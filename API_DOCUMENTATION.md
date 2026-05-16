# GitHub Repository API Documentation

## Overview
This API fetches comprehensive information from a GitHub repository URL, including repository metadata, README content, programming languages used, and top contributors.

## Endpoint
```
POST /api/github
```

## Request

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "url": "https://github.com/owner/repository"
}
```

### Supported URL Formats
- `https://github.com/owner/repo`
- `https://github.com/owner/repo.git`
- `github.com/owner/repo`

## Response

### Success Response (200 OK)
```json
{
  "repository": {
    "name": "repository-name",
    "full_name": "owner/repository-name",
    "description": "Repository description",
    "html_url": "https://github.com/owner/repository-name",
    "homepage": "https://example.com",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-12-31T00:00:00Z",
    "pushed_at": "2023-12-31T00:00:00Z",
    "size": 1234,
    "stargazers_count": 100,
    "watchers_count": 50,
    "forks_count": 25,
    "open_issues_count": 5,
    "default_branch": "main",
    "topics": ["javascript", "api", "documentation"],
    "license": {
      "name": "MIT License",
      "spdx_id": "MIT"
    },
    "owner": {
      "login": "owner-username",
      "avatar_url": "https://avatars.githubusercontent.com/u/123456",
      "html_url": "https://github.com/owner-username",
      "type": "User"
    }
  },
  "readme": "# Repository Name\n\nFull README content in markdown...",
  "languages": {
    "JavaScript": 50000,
    "TypeScript": 30000,
    "CSS": 10000
  },
  "contributors": [
    {
      "login": "contributor1",
      "avatar_url": "https://avatars.githubusercontent.com/u/123456",
      "contributions": 150,
      "html_url": "https://github.com/contributor1"
    }
  ]
}
```

### Error Responses

#### 400 Bad Request - Missing URL
```json
{
  "error": "GitHub repository URL is required"
}
```

#### 400 Bad Request - Invalid URL
```json
{
  "error": "Invalid GitHub repository URL"
}
```

#### 404 Not Found
```json
{
  "error": "Repository not found or inaccessible"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Failed to fetch repository information",
  "details": "Error message details"
}
```

## Usage Examples

### Using fetch (JavaScript)
```javascript
const response = await fetch('/api/github', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://github.com/vercel/next.js'
  })
});

const data = await response.json();
console.log(data);
```

### Using curl
```bash
curl -X POST http://localhost:3000/api/github \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/vercel/next.js"}'
```

### Using axios (JavaScript)
```javascript
import axios from 'axios';

const { data } = await axios.post('/api/github', {
  url: 'https://github.com/vercel/next.js'
});

console.log(data);
```

## Setup

### 1. Install Dependencies
```bash
npm install @octokit/rest
```

### 2. Configure GitHub Token (Optional but Recommended)
Create a `.env.local` file in your project root:
```env
GITHUB_TOKEN=your_github_personal_access_token
```

**Why use a token?**
- Without token: 60 requests per hour
- With token: 5,000 requests per hour

**How to get a token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scope: `public_repo` (for public repositories)
4. Copy the generated token to your `.env.local` file

### 3. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/github`

## Rate Limits

GitHub API has rate limits:
- **Unauthenticated**: 60 requests per hour
- **Authenticated**: 5,000 requests per hour

The API will work without a token but with lower rate limits. For production use, always configure a GitHub token.

## Data Retrieved

The API fetches the following information:

1. **Repository Metadata**
   - Basic info (name, description, URLs)
   - Statistics (stars, forks, watchers, issues)
   - Dates (created, updated, last push)
   - Topics and license information
   - Owner details

2. **README Content**
   - Full README.md file content in markdown format
   - Decoded from base64

3. **Programming Languages**
   - Languages used in the repository
   - Byte count for each language

4. **Contributors**
   - Top 10 contributors
   - Contribution count for each
   - Profile information

## Use Cases

This API is perfect for:
- 📚 Generating documentation from repositories
- 🔍 Repository analysis and insights
- 📊 Creating repository dashboards
- 🤖 Building GitHub repository explorers
- 📝 Automated documentation generation
- 🎯 Repository comparison tools

## Error Handling

The API includes comprehensive error handling:
- URL validation
- GitHub API error handling
- Network error handling
- Graceful degradation (if README or contributors fail, other data is still returned)

## Notes

- The API uses `Promise.allSettled()` to fetch multiple data points concurrently
- If some data (like README or contributors) fails to fetch, the API still returns available data
- All dates are in ISO 8601 format
- Language data shows byte counts, not percentages