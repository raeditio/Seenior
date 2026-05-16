import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface GitHubRepo {
  owner: string;
  repo: string;
}

export interface CodeFile {
  path: string;
  content: string;
  language: string;
}

export interface RepositoryInfo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  homepage: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  topics: string[];
  license: {
    name: string;
    spdx_id: string;
  } | null;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
  };
}

/**
 * Parse a GitHub URL and extract owner and repository name
 */
export function parseGitHubUrl(url: string): GitHubRepo | null {
  try {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,
      /github\.com\/([^\/]+)\/([^\/]+)\.git/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace('.git', ''),
        };
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch repository information from GitHub
 */
export async function getRepositoryInfo(owner: string, repo: string): Promise<RepositoryInfo> {
  const { data } = await octokit.repos.get({ owner, repo });
  
  return {
    name: data.name,
    full_name: data.full_name,
    description: data.description || '',
    html_url: data.html_url,
    homepage: data.homepage || '',
    created_at: data.created_at,
    updated_at: data.updated_at,
    pushed_at: data.pushed_at || '',
    size: data.size,
    stargazers_count: data.stargazers_count,
    watchers_count: data.watchers_count,
    forks_count: data.forks_count,
    open_issues_count: data.open_issues_count,
    default_branch: data.default_branch,
    topics: data.topics || [],
    license: data.license ? {
      name: data.license.name,
      spdx_id: data.license.spdx_id || '',
    } : null,
    owner: {
      login: data.owner.login,
      avatar_url: data.owner.avatar_url,
      html_url: data.owner.html_url,
      type: data.owner.type,
    },
  };
}

/**
 * Fetch repository file tree
 */
async function getRepoFiles(owner: string, repo: string, path: string = '') {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching repo files:', error);
    return [];
  }
}

/**
 * Recursively fetch all code files from a repository
 */
export async function getAllCodeFiles(
  owner: string,
  repo: string,
  path: string = '',
  maxFiles: number = 50
): Promise<CodeFile[]> {
  const codeExtensions = [
    '.js', '.ts', '.jsx', '.tsx',
    '.py', '.java', '.cpp', '.c',
    '.go', '.rs', '.rb', '.php',
    '.cs', '.swift', '.kt', '.scala',
    '.html', '.css', '.scss', '.vue',
    '.json', '.yaml', '.yml', '.xml',
  ];
  
  const files: CodeFile[] = [];
  
  const items = await getRepoFiles(owner, repo, path);
  
  for (const item of items) {
    if (files.length >= maxFiles) break;
    
    if (item.type === 'file') {
      const ext = item.name.substring(item.name.lastIndexOf('.'));
      if (codeExtensions.includes(ext)) {
        try {
          const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path: item.path,
          });
          
          if ('content' in data && data.content) {
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            files.push({
              path: item.path,
              content,
              language: ext.substring(1),
            });
          }
        } catch (error) {
          console.error(`Error fetching file ${item.path}:`, error);
        }
      }
    } else if (item.type === 'dir' && files.length < maxFiles) {
      const subFiles = await getAllCodeFiles(owner, repo, item.path, maxFiles - files.length);
      files.push(...subFiles);
    }
  }
  
  return files;
}

/**
 * Fetch README content from repository
 */
export async function getReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const { data } = await octokit.repos.getReadme({ owner, repo });
    if ('content' in data && data.content) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }
    return null;
  } catch (error) {
    console.error('Error fetching README:', error);
    return null;
  }
}

/**
 * Fetch programming languages used in repository
 */
export async function getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  try {
    const { data } = await octokit.repos.listLanguages({ owner, repo });
    return data;
  } catch (error) {
    console.error('Error fetching languages:', error);
    return {};
  }
}

/**
 * Fetch top contributors of repository
 */
export async function getContributors(owner: string, repo: string, limit: number = 10) {
  try {
    const { data } = await octokit.repos.listContributors({
      owner,
      repo,
      per_page: limit,
    });
    
    return data.map(contributor => ({
      login: contributor.login || '',
      avatar_url: contributor.avatar_url,
      contributions: contributor.contributions,
      html_url: contributor.html_url || '',
    }));
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return [];
  }
}

/**
 * Fetch complete repository data including metadata and code files
 */
export async function getCompleteRepositoryData(url: string, maxFiles: number = 50) {
  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    throw new Error('Invalid GitHub repository URL');
  }

  const { owner, repo } = parsed;

  // Fetch all data in parallel
  const [repoInfo, codeFiles, readme, languages, contributors] = await Promise.all([
    getRepositoryInfo(owner, repo),
    getAllCodeFiles(owner, repo, '', maxFiles),
    getReadme(owner, repo),
    getLanguages(owner, repo),
    getContributors(owner, repo),
  ]);

  return {
    repository: repoInfo,
    codeFiles,
    readme,
    languages,
    contributors,
  };
}

// Made with Bob
