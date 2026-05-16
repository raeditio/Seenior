import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseGitHubUrl, getRepositoryInfo, getAllCodeFiles, type CodeFile } from '../github/lib';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Generate documentation using Gemini
async function generateDocumentation(files: CodeFile[], repoName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  
  const filesContext = files.map(f => `
File: ${f.path}
Language: ${f.language}
Content:
\`\`\`${f.language}
${f.content.substring(0, 2000)}${f.content.length > 2000 ? '...' : ''}
\`\`\`
`).join('\n\n');

  const prompt = `You are a technical documentation expert. Analyze the following code repository "${repoName}" and generate comprehensive documentation.

Repository Files:
${filesContext}

Please provide:
1. **Project Overview**: What does this project do? What problem does it solve?
2. **Architecture**: Describe the overall architecture and design patterns used
3. **Key Components**: List and explain the main components/modules
4. **File Structure**: Explain the organization of files and directories
5. **Technologies Used**: List the programming languages, frameworks, and libraries
6. **Setup Instructions**: How to set up and run the project
7. **API/Functions**: Document key functions, classes, or APIs
8. **Code Examples**: Show how to use the main features

Format the response in clean Markdown with proper headings, code blocks, and lists.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Generate UML diagram using Gemini
async function generateUML(files: CodeFile[], repoName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  
  const filesContext = files.map(f => `
File: ${f.path}
Language: ${f.language}
Content:
\`\`\`${f.language}
${f.content.substring(0, 2000)}${f.content.length > 2000 ? '...' : ''}
\`\`\`
`).join('\n\n');

  const prompt = `You are a software architecture expert. Analyze the following code repository "${repoName}" and generate UML diagrams.

Repository Files:
${filesContext}

Please provide:
1. **Class Diagram**: Show the main classes, their attributes, methods, and relationships (in Mermaid syntax)
2. **Sequence Diagram**: Show the flow of a typical user interaction (in Mermaid syntax)
3. **Component Diagram**: Show the high-level components and their dependencies (in Mermaid syntax)
4. **Architecture Explanation**: Explain the architecture and design patterns

Use Mermaid diagram syntax for all diagrams. Format each diagram in a code block with \`\`\`mermaid.
Provide clear explanations for each diagram.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Generate quiz using Gemini
async function generateQuiz(files: CodeFile[], repoName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  
  const filesContext = files.map(f => `
File: ${f.path}
Content:
\`\`\`${f.language}
${f.content.substring(0, 1500)}${f.content.length > 1500 ? '...' : ''}
\`\`\`
`).join('\n\n');

  const prompt = `You are a technical educator. Based on the following code repository "${repoName}", create a comprehensive quiz to test understanding of the codebase.

Repository Files:
${filesContext}

Generate 10 multiple-choice questions covering:
- Code functionality and purpose
- Architecture and design patterns
- Key functions and their behavior
- Best practices used in the code
- Potential improvements or issues

Format as JSON array with this structure:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this is the correct answer"
  }
]

Return ONLY the JSON array, no additional text.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  return [];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, generateDocs, generateUml, generateQuizData } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'GitHub repository URL is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Parse GitHub URL
    const parsed = parseGitHubUrl(url);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL' },
        { status: 400 }
      );
    }

    const { owner, repo } = parsed;

    // Fetch repository info and code files
    console.log('Fetching repository information...');
    const repoInfo = await getRepositoryInfo(owner, repo);
    
    console.log('Fetching repository files...');
    const files = await getAllCodeFiles(owner, repo);

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No code files found in repository' },
        { status: 404 }
      );
    }

    console.log(`Found ${files.length} code files`);

    const result: any = {
      repository: {
        name: repoInfo.name,
        full_name: repoInfo.full_name,
        description: repoInfo.description,
        html_url: repoInfo.html_url,
      },
      filesAnalyzed: files.length,
    };

    // Generate documentation if requested
    if (generateDocs) {
      console.log('Generating documentation...');
      result.documentation = await generateDocumentation(files, repoInfo.full_name);
    }

    // Generate UML if requested
    if (generateUml) {
      console.log('Generating UML diagrams...');
      result.uml = await generateUML(files, repoInfo.full_name);
    }

    // Generate quiz if requested
    if (generateQuizData) {
      console.log('Generating quiz...');
      result.quiz = await generateQuiz(files, repoInfo.full_name);
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error analyzing repository:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to analyze repository', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Made with Bob
