**User:**

<task>
I need you to analyze the current state of this project to help elaborate the README file. Please:

1. Read the current [`README.md`](README.md) file
2. Read [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md) to understand the API structure
3. Read [`MIGRATION_SUMMARY.md`](MIGRATION_SUMMARY.md) to understand recent changes
4. Read [`package.json`](package.json) to understand dependencies and scripts
5. Analyze the project structure from the file tree provided in environment_details

Based on this analysis, provide a comprehensive summary that includes:
- Current README content and what's missing
- Key features of the application based on the codebase
- Technology stack and dependencies
- API endpoints and their purposes
- Project architecture (frontend/backend structure)
- Any notable patterns or conventions used

**Scope**: Only analyze and summarize the existing project. Do NOT write or modify any files.

**Completion**: When finished, use the `attempt_completion` tool with a detailed summary of your findings in the `result` parameter. This summary will be used to create an elaborated README.

**Note**: These instructions supersede any conflicting general instructions for Ask mode.
</task>
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
app/api/github/lib.ts,app/results/page.tsx,app/api/analyze/route.ts,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T12:28:43.997Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>ask</slug>
<name>❓ Ask</name>


# Current Workspace Directory (c:/Users/conan/OneDrive - UBC/Documents/Personal/Hackathon/IBM Bob/seenior) Files
.gitignore
AGENTS.md
API_DOCUMENTATION.md
CLAUDE.md
eslint.config.mjs
LICENSE
MIGRATION_SUMMARY.md
next.config.ts
package-lock.json
package.json
postcss.config.mjs
README.md
test-api.js
test-context-optimization.js
Todo
tsconfig.json
app/
app/favicon.ico
app/globals.css
app/layout.tsx
app/page.tsx
app/api/
app/api/analyze/
app/api/analyze/route.ts
app/api/github/
app/api/github/lib.ts
app/api/github/route.ts
app/components/
app/components/MermaidDiagram.tsx
app/components/uml/
app/components/uml/categoryColors.ts
app/components/uml/DescriptionPanel.tsx
app/components/uml/InteractiveDiagram.tsx
app/quiz/
app/quiz/page.tsx
app/results/
app/results/page.tsx
app/utils/
app/utils/export.ts
public/
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll analyze the project systematically by reading the key files you've specified.

<read_file>
<args>
  <file>
    <path>README.md</path>
  </file>
  <file>
    <path>API_DOCUMENTATION.md</path>
  </file>
  <file>
    <path>MIGRATION_SUMMARY.md</path>
  </file>
  <file>
    <path>package.json</path>
  </file>
  <file>
    <path>tsconfig.json</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>README.md</path>
<content lines="1-10">
 1 | # Seenior
 2 | ## Below is just a concept. To be finalized
 3 | Rapid Onboarding Toolkit for new hires.
 4 | 
 5 | ### Includes the following features:
 6 | - Fetches information about a codebase from a GitHub repository link
 7 | - Creates documentation
 8 | - Generates feature specific UMLs
 9 | - Generates a quiz set to check understanding
10 | - Answers any questions
</content>
</file>
<file><path>API_DOCUMENTATION.md</path>
<content lines="1-231">
  1 | # GitHub Repository API Documentation
  2 | 
  3 | ## Overview
  4 | This API fetches comprehensive information from a GitHub repository URL, including repository metadata, README content, programming languages used, and top contributors.
  5 | 
  6 | ## Endpoint
  7 | ```
  8 | POST /api/github
  9 | ```
 10 | 
 11 | ## Request
 12 | 
 13 | ### Headers
 14 | ```
 15 | Content-Type: application/json
 16 | ```
 17 | 
 18 | ### Body
 19 | ```json
 20 | {
 21 |   "url": "https://github.com/owner/repository"
 22 | }
 23 | ```
 24 | 
 25 | ### Supported URL Formats
 26 | - `https://github.com/owner/repo`
 27 | - `https://github.com/owner/repo.git`
 28 | - `github.com/owner/repo`
 29 | 
 30 | ## Response
 31 | 
 32 | ### Success Response (200 OK)
 33 | ```json
 34 | {
 35 |   "repository": {
 36 |     "name": "repository-name",
 37 |     "full_name": "owner/repository-name",
 38 |     "description": "Repository description",
 39 |     "html_url": "https://github.com/owner/repository-name",
 40 |     "homepage": "https://example.com",
 41 |     "created_at": "2023-01-01T00:00:00Z",
 42 |     "updated_at": "2023-12-31T00:00:00Z",
 43 |     "pushed_at": "2023-12-31T00:00:00Z",
 44 |     "size": 1234,
 45 |     "stargazers_count": 100,
 46 |     "watchers_count": 50,
 47 |     "forks_count": 25,
 48 |     "open_issues_count": 5,
 49 |     "default_branch": "main",
 50 |     "topics": ["javascript", "api", "documentation"],
 51 |     "license": {
 52 |       "name": "MIT License",
 53 |       "spdx_id": "MIT"
 54 |     },
 55 |     "owner": {
 56 |       "login": "owner-username",
 57 |       "avatar_url": "https://avatars.githubusercontent.com/u/123456",
 58 |       "html_url": "https://github.com/owner-username",
 59 |       "type": "User"
 60 |     }
 61 |   },
 62 |   "readme": "# Repository Name\n\nFull README content in markdown...",
 63 |   "languages": {
 64 |     "JavaScript": 50000,
 65 |     "TypeScript": 30000,
 66 |     "CSS": 10000
 67 |   },
 68 |   "contributors": [
 69 |     {
 70 |       "login": "contributor1",
 71 |       "avatar_url": "https://avatars.githubusercontent.com/u/123456",
 72 |       "contributions": 150,
 73 |       "html_url": "https://github.com/contributor1"
 74 |     }
 75 |   ]
 76 | }
 77 | ```
 78 | 
 79 | ### Error Responses
 80 | 
 81 | #### 400 Bad Request - Missing URL
 82 | ```json
 83 | {
 84 |   "error": "GitHub repository URL is required"
 85 | }
 86 | ```
 87 | 
 88 | #### 400 Bad Request - Invalid URL
 89 | ```json
 90 | {
 91 |   "error": "Invalid GitHub repository URL"
 92 | }
 93 | ```
 94 | 
 95 | #### 404 Not Found
 96 | ```json
 97 | {
 98 |   "error": "Repository not found or inaccessible"
 99 | }
100 | ```
101 | 
102 | #### 500 Internal Server Error
103 | ```json
104 | {
105 |   "error": "Failed to fetch repository information",
106 |   "details": "Error message details"
107 | }
108 | ```
109 | 
110 | ## Usage Examples
111 | 
112 | ### Using fetch (JavaScript)
113 | ```javascript
114 | const response = await fetch('/api/github', {
115 |   method: 'POST',
116 |   headers: {
117 |     'Content-Type': 'application/json',
118 |   },
119 |   body: JSON.stringify({
120 |     url: 'https://github.com/vercel/next.js'
121 |   })
122 | });
123 | 
124 | const data = await response.json();
125 | console.log(data);
126 | ```
127 | 
128 | ### Using curl
129 | ```bash
130 | curl -X POST http://localhost:3000/api/github \
131 |   -H "Content-Type: application/json" \
132 |   -d '{"url":"https://github.com/vercel/next.js"}'
133 | ```
134 | 
135 | ### Using axios (JavaScript)
136 | ```javascript
137 | import axios from 'axios';
138 | 
139 | const { data } = await axios.post('/api/github', {
140 |   url: 'https://github.com/vercel/next.js'
141 | });
142 | 
143 | console.log(data);
144 | ```
145 | 
146 | ## Setup
147 | 
148 | ### 1. Install Dependencies
149 | ```bash
150 | npm install @octokit/rest
151 | ```
152 | 
153 | ### 2. Configure GitHub Token (Optional but Recommended)
154 | Create a `.env.local` file in your project root:
155 | ```env
156 | GITHUB_TOKEN=your_github_personal_access_token
157 | ```
158 | 
159 | **Why use a token?**
160 | - Without token: 60 requests per hour
161 | - With token: 5,000 requests per hour
162 | 
163 | **How to get a token:**
164 | 1. Go to https://github.com/settings/tokens
165 | 2. Click "Generate new token (classic)"
166 | 3. Select scope: `public_repo` (for public repositories)
167 | 4. Copy the generated token to your `.env.local` file
168 | 
169 | ### 3. Start Development Server
170 | ```bash
171 | npm run dev
172 | ```
173 | 
174 | The API will be available at `http://localhost:3000/api/github`
175 | 
176 | ## Rate Limits
177 | 
178 | GitHub API has rate limits:
179 | - **Unauthenticated**: 60 requests per hour
180 | - **Authenticated**: 5,000 requests per hour
181 | 
182 | The API will work without a token but with lower rate limits. For production use, always configure a GitHub token.
183 | 
184 | ## Data Retrieved
185 | 
186 | The API fetches the following information:
187 | 
188 | 1. **Repository Metadata**
189 |    - Basic info (name, description, URLs)
190 |    - Statistics (stars, forks, watchers, issues)
191 |    - Dates (created, updated, last push)
192 |    - Topics and license information
193 |    - Owner details
194 | 
195 | 2. **README Content**
196 |    - Full README.md file content in markdown format
197 |    - Decoded from base64
198 | 
199 | 3. **Programming Languages**
200 |    - Languages used in the repository
201 |    - Byte count for each language
202 | 
203 | 4. **Contributors**
204 |    - Top 10 contributors
205 |    - Contribution count for each
206 |    - Profile information
207 | 
208 | ## Use Cases
209 | 
210 | This API is perfect for:
211 | - 📚 Generating documentation from repositories
212 | - 🔍 Repository analysis and insights
213 | - 📊 Creating repository dashboards
214 | - 🤖 Building GitHub repository explorers
215 | - 📝 Automated documentation generation
216 | - 🎯 Repository comparison tools
217 | 
218 | ## Error Handling
219 | 
220 | The API includes comprehensive error handling:
221 | - URL validation
222 | - GitHub API error handling
223 | - Network error handling
224 | - Graceful degradation (if README or contributors fail, other data is still returned)
225 | 
226 | ## Notes
227 | 
228 | - The API uses `Promise.allSettled()` to fetch multiple data points concurrently
229 | - If some data (like README or contributors) fails to fetch, the API still returns available data
230 | - All dates are in ISO 8601 format
231 | - Language data shows byte counts, not percentages
</content>
</file>
<file><path>MIGRATION_SUMMARY.md</path>
<content lines="1-233">
  1 | # API Migration Summary: Google Generative AI → IBM Watson AI
  2 | 
  3 | ## Overview
  4 | Successfully migrated the repository analysis API from Google Generative AI (Gemini) to IBM Watson AI (Llama 3.3 70B Instruct).
  5 | 
  6 | ## Changes Made
  7 | 
  8 | ### 1. Dependencies Updated
  9 | **Removed:**
 10 | - `@google/generative-ai` (v0.24.1)
 11 | 
 12 | **Added:**
 13 | - `@ibm-cloud/watsonx-ai` (latest)
 14 | - `ibm-cloud-sdk-core` (dependency)
 15 | 
 16 | ### 2. Code Changes (`app/api/analyze/route.ts`)
 17 | 
 18 | #### Imports
 19 | ```typescript
 20 | // Before
 21 | import { GoogleGenerativeAI } from '@google/generative-ai';
 22 | 
 23 | // After
 24 | import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
 25 | import { IamAuthenticator } from 'ibm-cloud-sdk-core';
 26 | ```
 27 | 
 28 | #### Configuration
 29 | ```typescript
 30 | // Before
 31 | const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
 32 | const GENERATION_CONFIG = {
 33 |   temperature: 0,
 34 |   topP: 1,
 35 |   topK: 1,
 36 | };
 37 | 
 38 | // After
 39 | const MODEL_ID = 'meta-llama/llama-3-3-70b-instruct';
 40 | 
 41 | function getWatsonAIService() {
 42 |   const apiKey = process.env.WATSONAI_API_KEY || '';
 43 |   const authenticator = new IamAuthenticator({ apikey: apiKey });
 44 |   
 45 |   return WatsonXAI.newInstance({
 46 |     version: '2024-05-31',
 47 |     authenticator,
 48 |     serviceUrl: 'https://us-south.ml.cloud.ibm.com',
 49 |   });
 50 | }
 51 | ```
 52 | 
 53 | #### API Calls
 54 | ```typescript
 55 | // Before (Gemini)
 56 | const model = genAI.getGenerativeModel({ 
 57 |   model: 'gemini-2.5-flash', 
 58 |   generationConfig: GENERATION_CONFIG 
 59 | });
 60 | const result = await model.generateContent(prompt);
 61 | const text = result.response.text();
 62 | 
 63 | // After (Watson AI)
 64 | const watsonxAIService = getWatsonAIService();
 65 | const projectId = process.env.WATSONX_PROJECT_ID || '';
 66 | 
 67 | const textGenParams = {
 68 |   input: prompt,
 69 |   modelId: MODEL_ID,
 70 |   projectId: projectId,
 71 |   parameters: {
 72 |     max_new_tokens: 4096,
 73 |     temperature: 0,
 74 |   },
 75 | };
 76 | 
 77 | const response = await watsonxAIService.generateText(textGenParams);
 78 | const text = response.result.results[0].generated_text;
 79 | ```
 80 | 
 81 | ### 3. Environment Variables
 82 | 
 83 | **Before:**
 84 | ```env
 85 | GEMINI_API_KEY=your_gemini_api_key
 86 | ```
 87 | 
 88 | **After:**
 89 | ```env
 90 | WATSONAI_API_KEY=your_watson_api_key_here
 91 | WATSONX_PROJECT_ID=your_watsonx_project_id_here
 92 | ```
 93 | 
 94 | ### 4. Functions Updated
 95 | All three generation functions were migrated:
 96 | - ✅ `generateDocumentation()` - Generates comprehensive code documentation
 97 | - ✅ `generateUML()` - Creates UML class and sequence diagrams
 98 | - ✅ `generateQuiz()` - Generates educational quizzes
 99 | 
100 | ### 5. Model Configuration
101 | 
102 | | Aspect | Google Gemini | IBM Watson AI |
103 | |--------|---------------|---------------|
104 | | Model | gemini-2.5-flash | meta-llama/llama-3-3-70b-instruct |
105 | | Temperature | 0 | 0 |
106 | | Max Tokens | Default | 4096 |
107 | | Response Format | text() | result.results[0].generated_text |
108 | | JSON Mode | responseMimeType: 'application/json' | Prompt-based |
109 | 
110 | ## Key Features Maintained
111 | 
112 | ✅ **Same Function Signatures**: All functions maintain their original signatures and return types  
113 | ✅ **Temperature 0**: Deterministic output for consistency  
114 | ✅ **JSON Handling**: Robust JSON parsing for UML generation with fallback  
115 | ✅ **Error Handling**: Comprehensive error handling for missing credentials  
116 | ✅ **Prompt Structures**: All prompts preserved with same instructions  
117 | 
118 | ## Setup Instructions
119 | 
120 | ### 1. Install Dependencies
121 | ```bash
122 | npm install @ibm-cloud/watsonx-ai ibm-cloud-sdk-core
123 | ```
124 | 
125 | ### 2. Configure Environment Variables
126 | Create or update `.env.local`:
127 | ```env
128 | WATSONAI_API_KEY=your_watson_api_key_here
129 | WATSONX_PROJECT_ID=your_watsonx_project_id_here
130 | GITHUB_TOKEN=your_github_token_here
131 | ```
132 | 
133 | ### 3. Get IBM Watson AI Credentials
134 | 1. Go to [IBM Cloud](https://cloud.ibm.com/)
135 | 2. Create a watsonx.ai instance
136 | 3. Get your API key from service credentials
137 | 4. Get your Project ID from watsonx.ai project settings
138 | 5. Add both to your `.env.local` file
139 | 
140 | ### 4. Start the Application
141 | ```bash
142 | npm run dev
143 | ```
144 | 
145 | ## Testing Checklist
146 | 
147 | - [ ] Test documentation generation with a sample repository
148 | - [ ] Test UML diagram generation (class and sequence diagrams)
149 | - [ ] Test quiz generation
150 | - [ ] Verify JSON parsing works correctly for UML
151 | - [ ] Test error handling for missing API keys
152 | - [ ] Test error handling for invalid repository URLs
153 | - [ ] Verify all three functions can run independently
154 | - [ ] Check that temperature=0 produces consistent results
155 | 
156 | ## API Endpoint
157 | 
158 | **Endpoint:** `POST /api/analyze`
159 | 
160 | **Request Body:**
161 | ```json
162 | {
163 |   "url": "https://github.com/owner/repo",
164 |   "generateDocs": true,
165 |   "generateUml": true,
166 |   "generateQuizData": true
167 | }
168 | ```
169 | 
170 | ## Benefits of Migration
171 | 
172 | 1. **Enterprise-Grade AI**: IBM Watson AI provides enterprise-level reliability and support
173 | 2. **Llama 3.3 70B**: More powerful model with better code understanding
174 | 3. **Consistent Output**: Temperature 0 ensures deterministic results
175 | 4. **Better Code Analysis**: Llama 3.3 excels at code comprehension tasks
176 | 5. **IBM Cloud Integration**: Seamless integration with IBM Cloud services
177 | 
178 | ## Potential Issues & Solutions
179 | 
180 | ### Issue: Authentication Errors
181 | **Solution**: Verify `WATSONAI_API_KEY` and `WATSONX_PROJECT_ID` are correctly set
182 | 
183 | ### Issue: Rate Limits
184 | **Solution**: IBM Watson AI has different rate limits than Google. Monitor usage in IBM Cloud dashboard
185 | 
186 | ### Issue: Response Format Differences
187 | **Solution**: Code includes robust JSON parsing with fallback for markdown-wrapped JSON
188 | 
189 | ### Issue: Model Availability
190 | **Solution**: Ensure `meta-llama/llama-3-3-70b-instruct` is available in your IBM Cloud region
191 | 
192 | ## Rollback Plan
193 | 
194 | If issues arise, rollback is straightforward:
195 | 
196 | 1. Reinstall Google AI SDK:
197 |    ```bash
198 |    npm install @google/generative-ai
199 |    ```
200 | 
201 | 2. Restore original `route.ts` from git:
202 |    ```bash
203 |    git checkout HEAD -- app/api/analyze/route.ts
204 |    ```
205 | 
206 | 3. Update environment variables back to `GEMINI_API_KEY`
207 | 
208 | ## Documentation Updates
209 | 
210 | - ✅ Updated `API_DOCUMENTATION.md` with new endpoint details
211 | - ✅ Created `.env.example` with required variables
212 | - ✅ Created this migration summary document
213 | 
214 | ## Next Steps
215 | 
216 | 1. Test all three generation functions with real repositories
217 | 2. Monitor API performance and response quality
218 | 3. Adjust max_tokens if needed for larger codebases
219 | 4. Consider implementing response caching for frequently analyzed repos
220 | 5. Add monitoring/logging for Watson AI API calls
221 | 
222 | ## Support
223 | 
224 | For issues related to:
225 | - **IBM Watson AI**: [IBM Cloud Support](https://cloud.ibm.com/docs/watson)
226 | - **Application Code**: Check application logs and error messages
227 | - **API Keys**: Verify credentials in IBM Cloud console
228 | 
229 | ---
230 | 
231 | **Migration Date**: 2026-05-17  
232 | **Migrated By**: Bob (AI Assistant)  
233 | **Status**: ✅ Complete - Ready for Testing
</content>
</file>
<file><path>package.json</path>
<content lines="1-30">
 1 | {
 2 |   "name": "seenior",
 3 |   "version": "0.1.0",
 4 |   "private": true,
 5 |   "scripts": {
 6 |     "dev": "next dev",
 7 |     "build": "next build",
 8 |     "start": "next start",
 9 |     "lint": "eslint"
10 |   },
11 |   "dependencies": {
12 |     "@google/generative-ai": "^0.24.1",
13 |     "@octokit/rest": "^22.0.1",
14 |     "framer-motion": "^12.38.0",
15 |     "mermaid": "^11.15.0",
16 |     "next": "16.2.6",
17 |     "react": "19.2.4",
18 |     "react-dom": "19.2.4"
19 |   },
20 |   "devDependencies": {
21 |     "@tailwindcss/postcss": "^4",
22 |     "@types/node": "^20",
23 |     "@types/react": "^19",
24 |     "@types/react-dom": "^19",
25 |     "eslint": "^9",
26 |     "eslint-config-next": "16.2.6",
27 |     "tailwindcss": "^4",
28 |     "typescript": "^5"
29 |   }
30 | }
</content>
</file>
<file><path>tsconfig.json</path>
<content lines="1-34">
 1 | {
 2 |   "compilerOptions": {
 3 |     "target": "ES2017",
 4 |     "lib": ["dom", "dom.iterable", "esnext"],
 5 |     "allowJs": true,
 6 |     "skipLibCheck": true,
 7 |     "strict": true,
 8 |     "noEmit": true,
 9 |     "esModuleInterop": true,
10 |     "module": "esnext",
11 |     "moduleResolution": "bundler",
12 |     "resolveJsonModule": true,
13 |     "isolatedModules": true,
14 |     "jsx": "react-jsx",
15 |     "incremental": true,
16 |     "plugins": [
17 |       {
18 |         "name": "next"
19 |       }
20 |     ],
21 |     "paths": {
22 |       "@/*": ["./*"]
23 |     }
24 |   },
25 |   "include": [
26 |     "next-env.d.ts",
27 |     "**/*.ts",
28 |     "**/*.tsx",
29 |     ".next/types/**/*.ts",
30 |     ".next/dev/types/**/*.ts",
31 |     "**/*.mts"
32 |   ],
33 |   "exclude": ["node_modules"]
34 | }
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
app/api/github/lib.ts,app/results/page.tsx,app/api/analyze/route.ts,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T12:28:59.041Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.02

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>ask</slug>
<name>❓ Ask</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<read_file>
<args>
  <file>
    <path>app/page.tsx</path>
  </file>
  <file>
    <path>app/results/page.tsx</path>
  </file>
  <file>
    <path>app/quiz/page.tsx</path>
  </file>
  <file>
    <path>app/api/analyze/route.ts</path>
  </file>
  <file>
    <path>app/api/github/route.ts</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 5 files] Result:
<files>
<file><path>app/page.tsx</path>
<content lines="1-167">
  1 | "use client";
  2 | 
  3 | import { useState } from "react";
  4 | import { useRouter } from "next/navigation";
  5 | import { motion, AnimatePresence } from "framer-motion";
  6 | 
  7 | const SECTIONS = [
  8 |   { id: "documentation", label: "Documentation", desc: "Summary, key files, business logic" },
  9 |   { id: "diagrams",      label: "UML / Flowchart", desc: "Architecture & request flow diagrams" },
 10 |   { id: "quiz",          label: "Quiz",            desc: "Comprehension questions to test understanding" },
 11 | ] as const;
 12 | 
 13 | type SectionId = (typeof SECTIONS)[number]["id"];
 14 | 
 15 | const container = {
 16 |   hidden: {},
 17 |   show: { transition: { staggerChildren: 0.08 } },
 18 | };
 19 | 
 20 | const item = {
 21 |   hidden: { opacity: 0, y: 20 },
 22 |   show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
 23 | };
 24 | 
 25 | export default function Home() {
 26 |   const router = useRouter();
 27 |   const [repoUrl, setRepoUrl] = useState("");
 28 |   const [selected, setSelected] = useState<Set<SectionId>>(new Set());
 29 |   const [focused, setFocused] = useState(false);
 30 | 
 31 |   function toggleSection(id: SectionId) {
 32 |     setSelected((prev) => {
 33 |       const next = new Set(prev);
 34 |       next.has(id) ? next.delete(id) : next.add(id);
 35 |       return next;
 36 |     });
 37 |   }
 38 | 
 39 |   const canSubmit = repoUrl.trim().length > 0 && selected.size > 0;
 40 | 
 41 |   function handleSubmit(e: React.FormEvent) {
 42 |     e.preventDefault();
 43 |     if (!canSubmit) return;
 44 |     const params = new URLSearchParams({
 45 |       repo: repoUrl.trim(),
 46 |       sections: [...selected].join(","),
 47 |     });
 48 |     router.push(`/results?${params.toString()}`);
 49 |   }
 50 | 
 51 |   return (
 52 |     <main className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden bg-black">
 53 |       <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
 54 |         <div className="h-[600px] w-[600px] rounded-full bg-white/[0.03] blur-3xl" />
 55 |       </div>
 56 | 
 57 |       <motion.form
 58 |         onSubmit={handleSubmit}
 59 |         variants={container}
 60 |         initial="hidden"
 61 |         animate="show"
 62 |         className="relative flex flex-col gap-10 w-full max-w-lg"
 63 |       >
 64 |         <motion.div variants={item}>
 65 |           <span className="text-xs font-semibold tracking-[0.2em] text-zinc-600 uppercase">Seenior</span>
 66 |         </motion.div>
 67 | 
 68 |         <motion.div variants={item} className="flex flex-col gap-2">
 69 |           <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
 70 |             Understand any codebase<br />
 71 |             <span className="text-zinc-500">in 60 seconds.</span>
 72 |           </h1>
 73 |           <p className="text-sm text-zinc-600">Paste a GitHub URL. Get an instant onboarding report.</p>
 74 |         </motion.div>
 75 | 
 76 |         <motion.div variants={item} className="relative">
 77 |           <motion.div
 78 |             animate={{
 79 |               boxShadow: focused
 80 |                 ? "0 0 0 2px rgba(255,255,255,0.15), 0 0 24px rgba(255,255,255,0.04)"
 81 |                 : "0 0 0 1px rgba(255,255,255,0.08)",
 82 |             }}
 83 |             transition={{ duration: 0.2 }}
 84 |             className="rounded-xl overflow-hidden"
 85 |           >
 86 |             <input
 87 |               type="text"
 88 |               value={repoUrl}
 89 |               onChange={(e) => setRepoUrl(e.target.value)}
 90 |               onFocus={() => setFocused(true)}
 91 |               onBlur={() => setFocused(false)}
 92 |               placeholder="github.com/user/repo"
 93 |               className="w-full bg-zinc-900/60 backdrop-blur px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none text-sm"
 94 |             />
 95 |           </motion.div>
 96 |         </motion.div>
 97 | 
 98 |         <motion.div variants={item} className="flex flex-col gap-2">
 99 |           <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Generate</p>
100 |           {SECTIONS.map(({ id, label, desc }) => {
101 |             const checked = selected.has(id);
102 |             return (
103 |               <motion.label
104 |                 key={id}
105 |                 whileHover={{ x: 2 }}
106 |                 whileTap={{ scale: 0.98 }}
107 |                 className="flex items-center gap-4 p-4 rounded-xl cursor-pointer select-none"
108 |                 style={{
109 |                   background: checked ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
110 |                   border: checked ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.04)",
111 |                   transition: "background 0.2s, border-color 0.2s",
112 |                 }}
113 |               >
114 |                 <input type="checkbox" checked={checked} onChange={() => toggleSection(id)} className="sr-only" />
115 |                 <motion.div
116 |                   animate={{
117 |                     backgroundColor: checked ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.05)",
118 |                     borderColor: checked ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.15)",
119 |                   }}
120 |                   transition={{ duration: 0.15 }}
121 |                   className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0"
122 |                 >
123 |                   <AnimatePresence>
124 |                     {checked && (
125 |                       <motion.svg
126 |                         initial={{ scale: 0, opacity: 0 }}
127 |                         animate={{ scale: 1, opacity: 1 }}
128 |                         exit={{ scale: 0, opacity: 0 }}
129 |                         transition={{ duration: 0.15, ease: "backOut" }}
130 |                         width="11" height="9" viewBox="0 0 11 9" fill="none"
131 |                       >
132 |                         <path d="M1 4L4 7.5L10 1" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
133 |                       </motion.svg>
134 |                     )}
135 |                   </AnimatePresence>
136 |                 </motion.div>
137 |                 <div className="flex flex-col gap-0.5">
138 |                   <span className="text-sm font-medium text-white">{label}</span>
139 |                   <span className="text-xs text-zinc-600">{desc}</span>
140 |                 </div>
141 |               </motion.label>
142 |             );
143 |           })}
144 |         </motion.div>
145 | 
146 |         <motion.div variants={item}>
147 |           <motion.button
148 |             type="submit"
149 |             disabled={!canSubmit}
150 |             whileHover={canSubmit ? { scale: 1.02 } : {}}
151 |             whileTap={canSubmit ? { scale: 0.97 } : {}}
152 |             transition={{ duration: 0.15 }}
153 |             className="relative overflow-hidden rounded-xl px-6 py-3.5 text-sm font-semibold transition-all disabled:cursor-not-allowed w-full"
154 |             style={{
155 |               background: canSubmit ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.08)",
156 |               color: canSubmit ? "black" : "rgba(255,255,255,0.2)",
157 |             }}
158 |           >
159 |             <motion.span animate={{ opacity: canSubmit ? 1 : 0.4 }} transition={{ duration: 0.2 }}>
160 |               Analyze repository →
161 |             </motion.span>
162 |           </motion.button>
163 |         </motion.div>
164 |       </motion.form>
165 |     </main>
166 |   );
167 | }
</content>
</file>
<file><path>app/results/page.tsx</path>
<content lines="1-510">
  1 | 'use client';
  2 | 
  3 | import { useEffect, useState, useRef } from 'react';
  4 | import { useSearchParams } from 'next/navigation';
  5 | import Link from 'next/link';
  6 | import { motion, AnimatePresence } from 'framer-motion';
  7 | import InteractiveDiagram from '@/app/components/uml/InteractiveDiagram';
  8 | import DescriptionPanel from '@/app/components/uml/DescriptionPanel';
  9 | import { type Category } from '@/app/components/uml/categoryColors';
 10 | 
 11 | interface UmlData {
 12 |   classDiagram: string;
 13 |   sequenceDiagram: string;
 14 |   descriptions: Record<string, string>;
 15 |   categories: Record<string, Category>;
 16 | }
 17 | 
 18 | interface AnalysisData {
 19 |   repository: {
 20 |     name: string;
 21 |     full_name: string;
 22 |     description: string;
 23 |     html_url: string;
 24 |   };
 25 |   filesAnalyzed: number;
 26 |   documentation?: string;
 27 |   uml?: UmlData;
 28 |   quiz?: Array<{
 29 |     question: string;
 30 |     options: string[];
 31 |     correctAnswer: number;
 32 |     explanation: string;
 33 |   }>;
 34 | }
 35 | 
 36 | type TabId = 'documentation' | 'uml' | 'quiz';
 37 | 
 38 | // --- Loading steps ---
 39 | const STEPS = [
 40 |   { label: 'Fetching repository information…', duration: 3000 },
 41 |   { label: 'Fetching repository files…',      duration: 6000 },
 42 |   { label: 'Reading code structure…',          duration: 7000 },
 43 |   { label: 'Generating your report…',          duration: 9000 },
 44 |   { label: 'Almost done, hang tight…',         duration: Infinity },
 45 | ];
 46 | 
 47 | function useLoadingSteps(active: boolean) {
 48 |   const [step, setStep] = useState(0);
 49 |   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 50 | 
 51 |   useEffect(() => {
 52 |     if (!active) { setStep(0); return; }
 53 |     if (step >= STEPS.length - 1) return;
 54 |     timerRef.current = setTimeout(() => setStep((s) => s + 1), STEPS[step].duration);
 55 |     return () => { if (timerRef.current) clearTimeout(timerRef.current); };
 56 |   }, [active, step]);
 57 | 
 58 |   return step;
 59 | }
 60 | 
 61 | // --- Skeleton bones ---
 62 | function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
 63 |   return <div className={`skeleton ${className ?? ''}`} style={style} />;
 64 | }
 65 | 
 66 | function DocsSkeleton() {
 67 |   return (
 68 |     <div className="flex flex-col gap-10">
 69 |       <div className="flex flex-col gap-3">
 70 |         <Bone className="h-3 w-24 mb-1" />
 71 |         <Bone className="h-4 w-full" /><Bone className="h-4 w-5/6" /><Bone className="h-4 w-4/6" />
 72 |       </div>
 73 |       <div className="flex flex-col gap-3">
 74 |         <Bone className="h-3 w-36 mb-1" />
 75 |         {[...Array(5)].map((_, i) => (
 76 |           <div key={i} className="flex gap-4 p-4 rounded-xl border border-zinc-900">
 77 |             <Bone className="h-3 w-3 shrink-0 mt-0.5" />
 78 |             <div className="flex flex-col gap-2 flex-1">
 79 |               <Bone className="h-3 w-48" /><Bone className="h-3 w-64" />
 80 |             </div>
 81 |           </div>
 82 |         ))}
 83 |       </div>
 84 |       <div className="flex flex-col gap-3">
 85 |         <Bone className="h-3 w-44 mb-1" />
 86 |         {[...Array(3)].map((_, i) => (
 87 |           <div key={i} className="p-5 rounded-xl border border-zinc-900 flex flex-col gap-3">
 88 |             <Bone className="h-4 w-36" /><Bone className="h-3 w-full" /><Bone className="h-3 w-5/6" />
 89 |           </div>
 90 |         ))}
 91 |       </div>
 92 |       <div className="flex flex-col gap-3">
 93 |         <Bone className="h-3 w-24 mb-1" />
 94 |         <div className="flex flex-wrap gap-2">
 95 |           {[80, 64, 96, 72, 56, 88].map((w, i) => (
 96 |             <Bone key={i} className="h-7 rounded-lg" style={{ width: `${w}px` }} />
 97 |           ))}
 98 |         </div>
 99 |       </div>
100 |     </div>
101 |   );
102 | }
103 | 
104 | function DiagramsSkeleton() {
105 |   return (
106 |     <div className="flex flex-col gap-10">
107 |       {['Architecture map', 'Request flow'].map((label) => (
108 |         <div key={label} className="flex flex-col gap-3">
109 |           <Bone className="h-3 w-36 mb-1" />
110 |           <div className="rounded-xl border border-zinc-900 p-6 flex flex-col gap-4 items-center">
111 |             <Bone className="h-10 w-40 rounded-lg" />
112 |             <Bone className="h-6 w-px" />
113 |             <div className="flex gap-8">
114 |               <Bone className="h-10 w-32 rounded-lg" /><Bone className="h-10 w-32 rounded-lg" />
115 |             </div>
116 |             <Bone className="h-6 w-px" />
117 |             <div className="flex gap-6">
118 |               <Bone className="h-10 w-24 rounded-lg" />
119 |               <Bone className="h-10 w-24 rounded-lg" />
120 |               <Bone className="h-10 w-24 rounded-lg" />
121 |             </div>
122 |           </div>
123 |         </div>
124 |       ))}
125 |     </div>
126 |   );
127 | }
128 | 
129 | function QuizSkeleton() {
130 |   return (
131 |     <div className="flex flex-col gap-4">
132 |       {[...Array(5)].map((_, i) => (
133 |         <div key={i} className="p-5 rounded-xl border border-zinc-900 flex flex-col gap-4">
134 |           <div className="flex gap-2 items-start">
135 |             <Bone className="h-3 w-4 shrink-0 mt-0.5" />
136 |             <div className="flex flex-col gap-2 flex-1">
137 |               <Bone className="h-3 w-full" /><Bone className="h-3 w-4/5" />
138 |             </div>
139 |           </div>
140 |           <div className="flex flex-col gap-2">
141 |             {[...Array(4)].map((_, j) => <Bone key={j} className="h-8 w-full rounded-lg" />)}
142 |           </div>
143 |         </div>
144 |       ))}
145 |     </div>
146 |   );
147 | }
148 | 
149 | function StepIndicator({ step, total }: { step: number; total: number }) {
150 |   return (
151 |     <div className="flex flex-col gap-3 pb-8 border-b border-zinc-900 mb-10">
152 |       <div className="flex items-center gap-3">
153 |         <motion.div
154 |           animate={{ rotate: 360 }}
155 |           transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
156 |           className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-white shrink-0"
157 |         />
158 |         <AnimatePresence mode="wait">
159 |           <motion.span
160 |             key={step}
161 |             initial={{ opacity: 0, y: 6 }}
162 |             animate={{ opacity: 1, y: 0 }}
163 |             exit={{ opacity: 0, y: -6 }}
164 |             transition={{ duration: 0.25 }}
165 |             className="text-sm text-zinc-300"
166 |           >
167 |             {STEPS[step].label}
168 |           </motion.span>
169 |         </AnimatePresence>
170 |       </div>
171 |       <div className="flex gap-1.5">
172 |         {[...Array(total)].map((_, i) => (
173 |           <motion.div
174 |             key={i}
175 |             animate={{ backgroundColor: i <= step ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.08)' }}
176 |             transition={{ duration: 0.4 }}
177 |             className="h-1 flex-1 rounded-full"
178 |           />
179 |         ))}
180 |       </div>
181 |       <p className="text-xs text-zinc-600">This usually takes 20–40 seconds</p>
182 |     </div>
183 |   );
184 | }
185 | 
186 | // Extract node names present in each diagram type
187 | function extractClassNames(diagram: string): Set<string> {
188 |   const names = new Set<string>();
189 |   // Explicit declarations: "class ClassName" or "class ClassName {"
190 |   for (const m of diagram.matchAll(/^\s*class\s+(\w+)/gm)) names.add(m[1]);
191 |   // Relationship lines: "A --> B", "A <|-- B", "A *-- B", etc.
192 |   // Left side
193 |   for (const m of diagram.matchAll(/^\s*(\w+)\s*(?:"[^"]*")?\s*(?:<\|--|<\.\.|\*--|o--|-->|\.\.>|<--|--|\|\|--|\.\.)/gm)) names.add(m[1]);
194 |   // Right side
195 |   for (const m of diagram.matchAll(/(?:<\|--|<\.\.|\*--|o--|-->|\.\.>|<--|--|\|\|--|\.\.)(?:"[^"]*")?\s*(\w+)/gm)) names.add(m[1]);
196 |   // Member definitions: "ClassName : +method()"
197 |   for (const m of diagram.matchAll(/^\s*(\w+)\s*:/gm)) names.add(m[1]);
198 |   return names;
199 | }
200 | 
201 | function extractActorNames(diagram: string): Set<string> {
202 |   const names = new Set<string>();
203 |   for (const m of diagram.matchAll(/^(?:participant|actor)\s+(\w+)/gm)) names.add(m[1]);
204 |   for (const m of diagram.matchAll(/^(\w+)(?:->>|-->|->|-->>)/gm)) names.add(m[1]);
205 |   for (const m of diagram.matchAll(/(?:->>|-->|->|-->>)(\w+):/gm)) names.add(m[1]);
206 |   return names;
207 | }
208 | 
209 | // --- Animations ---
210 | const fadeUp = {
211 |   hidden: { opacity: 0, y: 12 },
212 |   show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
213 |   exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
214 | };
215 | 
216 | function SectionLabel({ children }: { children: React.ReactNode }) {
217 |   return <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-4">{children}</p>;
218 | }
219 | 
220 | export default function ResultsPage() {
221 |   const searchParams = useSearchParams();
222 |   const repo = searchParams.get('repo') ?? '';
223 |   const sectionsParam = searchParams.get('sections') ?? '';
224 |   const sections = sectionsParam ? sectionsParam.split(',') : ['documentation'];
225 | 
226 |   const selectedOptions = {
227 |     documentation: sections.includes('documentation'),
228 |     flowchart: sections.includes('diagrams'),
229 |     quiz: sections.includes('quiz'),
230 |   };
231 | 
232 |   const [data, setData] = useState<AnalysisData | null>(null);
233 |   const [error, setError] = useState<string | null>(null);
234 |   const [activeTab, setActiveTab] = useState<TabId>(
235 |     selectedOptions.documentation ? 'documentation' : selectedOptions.flowchart ? 'uml' : 'quiz'
236 |   );
237 |   const [revealed, setRevealed] = useState<Set<number>>(new Set());
238 |   const [activeSubTab, setActiveSubTab] = useState<'class' | 'sequence'>('class');
239 |   const [activeNode, setActiveNode] = useState<string | null>(null);
240 |   const [diagramHeight, setDiagramHeight] = useState<number>(500);
241 | 
242 |   const loading = !data && !error;
243 |   const step = useLoadingSteps(loading);
244 | 
245 |   useEffect(() => {
246 |     if (!repo) return;
247 | 
248 |     async function run() {
249 |       try {
250 |         const res = await fetch('/api/analyze', {
251 |           method: 'POST',
252 |           headers: { 'Content-Type': 'application/json' },
253 |           body: JSON.stringify({
254 |             url: repo,
255 |             generateDocs: selectedOptions.documentation,
256 |             generateUml: selectedOptions.flowchart,
257 |             generateQuizData: selectedOptions.quiz,
258 |           }),
259 |         });
260 |         const json = await res.json();
261 |         if (!res.ok) throw new Error(json.error ?? 'Analysis failed');
262 |         setData(json);
263 |       } catch (e) {
264 |         setError(e instanceof Error ? e.message : 'Something went wrong');
265 |       }
266 |     }
267 | 
268 |     run();
269 |   // eslint-disable-next-line react-hooks/exhaustive-deps
270 |   }, [repo]);
271 | 
272 |   function toggleReveal(i: number) {
273 |     setRevealed((prev) => {
274 |       const next = new Set(prev);
275 |       next.has(i) ? next.delete(i) : next.add(i);
276 |       return next;
277 |     });
278 |   }
279 | 
280 |   const ALL_TABS: { id: TabId; label: string }[] = [
281 |     { id: 'documentation', label: 'Documentation' },
282 |     { id: 'uml',           label: 'UML / Flowchart' },
283 |     { id: 'quiz',          label: 'Quiz' },
284 |   ];
285 |   const tabs = ALL_TABS.filter((t) =>
286 |     t.id === 'documentation' ? selectedOptions.documentation :
287 |     t.id === 'uml'           ? selectedOptions.flowchart :
288 |                                selectedOptions.quiz
289 |   );
290 | 
291 |   return (
292 |     <div className="min-h-screen flex flex-col bg-black text-white">
293 |       {/* Header */}
294 |       <motion.header
295 |         initial={{ opacity: 0, y: -12 }}
296 |         animate={{ opacity: 1, y: 0 }}
297 |         transition={{ duration: 0.4 }}
298 |         className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between"
299 |       >
300 |         <div>
301 |           <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-0.5">
302 |             {loading ? 'Analyzing' : error ? 'Error' : 'Report'}
303 |           </p>
304 |           <p className="text-sm font-mono text-zinc-300 truncate max-w-xs">{repo || '—'}</p>
305 |         </div>
306 |         <motion.div whileHover={{ x: -2 }} transition={{ duration: 0.15 }}>
307 |           <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors">← New repo</Link>
308 |         </motion.div>
309 |       </motion.header>
310 | 
311 |       {/* Tabs — always visible so user can preview each section while loading */}
312 |       {!error && (
313 |         <motion.nav
314 |           initial={{ opacity: 0 }}
315 |           animate={{ opacity: 1 }}
316 |           transition={{ delay: 0.15, duration: 0.3 }}
317 |           className="flex gap-1 border-b border-zinc-900 px-4 pt-2"
318 |         >
319 |           {tabs.map((t) => (
320 |             <button
321 |               key={t.id}
322 |               onClick={() => setActiveTab(t.id)}
323 |               className="relative px-4 py-2.5 text-sm font-medium transition-colors"
324 |               style={{ color: activeTab === t.id ? 'white' : 'rgb(113 113 122)' }}
325 |             >
326 |               {activeTab === t.id && (
327 |                 <motion.div layoutId="tab-indicator" className="absolute inset-0 rounded-lg bg-white/[0.07]"
328 |                   transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
329 |               )}
330 |               <span className="relative z-10">{t.label}</span>
331 |               {activeTab === t.id && (
332 |                 <motion.div layoutId="tab-underline" className="absolute bottom-0 left-4 right-4 h-px bg-white"
333 |                   transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
334 |               )}
335 |             </button>
336 |           ))}
337 |         </motion.nav>
338 |       )}
339 | 
340 |       {/* Content */}
341 |       <main className={`flex-1 px-6 py-10 w-full mx-auto ${activeTab === 'uml' && data ? 'max-w-7xl' : 'max-w-3xl'}`}>
342 |         {/* Error */}
343 |         {error && (
344 |           <div className="flex flex-col items-center justify-center gap-4 py-32">
345 |             <p className="text-zinc-500 text-sm">Failed to analyze repository</p>
346 |             <p className="text-red-400 text-xs font-mono bg-zinc-900 px-4 py-2 rounded-lg">{error}</p>
347 |             <Link href="/" className="text-xs text-zinc-600 hover:text-white transition-colors mt-2">← Try another repo</Link>
348 |           </div>
349 |         )}
350 | 
351 |         {/* Loading: step indicator + per-tab skeleton */}
352 |         {loading && (
353 |           <>
354 |             <StepIndicator step={step} total={STEPS.length - 1} />
355 |             {activeTab === 'uml'  ? <DiagramsSkeleton /> :
356 |              activeTab === 'quiz' ? <QuizSkeleton /> :
357 |              <DocsSkeleton />}
358 |           </>
359 |         )}
360 | 
361 |         {/* Results */}
362 |         {!loading && !error && (
363 |           <AnimatePresence mode="wait">
364 |             {/* Documentation */}
365 |             {activeTab === 'documentation' && data?.documentation && (
366 |               <motion.div key="docs" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-10">
367 |                 <section>
368 |                   <SectionLabel>Documentation</SectionLabel>
369 |                   <div
370 |                     className="text-zinc-300 text-sm leading-relaxed"
371 |                     dangerouslySetInnerHTML={{
372 |                       __html: data.documentation
373 |                         .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto text-xs font-mono text-zinc-300 my-4"><code>$2</code></pre>')
374 |                         .replace(/`([^`]+)`/g, '<code class="bg-zinc-900 px-1.5 py-0.5 rounded text-xs text-zinc-300">$1</code>')
375 |                         .replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold text-white mt-6 mb-2">$1</h3>')
376 |                         .replace(/^## (.*$)/gim, '<h2 class="text-lg font-semibold text-white mt-8 mb-3">$1</h2>')
377 |                         .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-white mt-10 mb-4">$1</h1>')
378 |                         .replace(/^\* (.*$)/gim, '<li class="ml-4 text-zinc-400 text-sm">$1</li>')
379 |                         .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-200">$1</strong>')
380 |                         .replace(/\n\n/g, '<br/>')
381 |                     }}
382 |                   />
383 |                 </section>
384 |               </motion.div>
385 |             )}
386 | 
387 |             {/* UML */}
388 |             {activeTab === 'uml' && data?.uml && (() => {
389 |               // Class tab: show ALL descriptions (diagram nodes + utility functions/interfaces the AI included).
390 |               // Sequence tab: show only actors that appear in the diagram.
391 |               const sequenceActors = extractActorNames(data.uml.sequenceDiagram);
392 |               const panelDescriptions = activeSubTab === 'sequence'
393 |                 ? Object.fromEntries(
394 |                     Object.entries(data.uml.descriptions).filter(
395 |                       ([name]) => sequenceActors.size === 0 || sequenceActors.has(name)
396 |                     )
397 |                   )
398 |                 : data.uml.descriptions;
399 |               const panelLabel = activeSubTab === 'class' ? 'Components' : 'Actors';
400 | 
401 |               return (
402 |                 <motion.div key="uml" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-4">
403 |                   {/* Sub-tabs */}
404 |                   <div className="flex gap-1">
405 |                     {(['class', 'sequence'] as const).map((t) => (
406 |                       <button
407 |                         key={t}
408 |                         onClick={() => { setActiveSubTab(t); setActiveNode(null); }}
409 |                         className="px-4 py-2 text-xs font-medium rounded-lg transition-colors"
410 |                         style={{
411 |                           backgroundColor: activeSubTab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
412 |                           color: activeSubTab === t ? 'white' : 'rgb(113,113,122)',
413 |                         }}
414 |                       >
415 |                         {t === 'class' ? 'Class Diagram' : 'Sequence Diagram'}
416 |                       </button>
417 |                     ))}
418 |                   </div>
419 | 
420 |                   {/* Side-by-side: diagram + description panel */}
421 |                   <div
422 |                     className="flex gap-4"
423 |                     style={{ height: `${Math.min(Math.max(diagramHeight + 48, 380), Math.round(window.innerHeight * 0.82))}px` }}
424 |                   >
425 |                     {/* Diagram — pan/zoom viewport */}
426 |                     <div className="flex-1 min-w-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden relative">
427 |                       <InteractiveDiagram
428 |                         key={activeSubTab}
429 |                         chart={activeSubTab === 'class' ? data.uml.classDiagram : data.uml.sequenceDiagram}
430 |                         id={activeSubTab === 'class' ? 'class-diagram' : 'sequence-diagram'}
431 |                         categories={data.uml.categories ?? {}}
432 |                         activeNode={activeNode}
433 |                         onNodeHover={setActiveNode}
434 |                         onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
435 |                         onHeightReady={setDiagramHeight}
436 |                       />
437 |                     </div>
438 | 
439 |                     {/* Description panel — sticky header, independently scrollable list */}
440 |                     <div className="w-72 shrink-0 rounded-xl border border-zinc-900 bg-zinc-950/60 overflow-hidden flex flex-col">
441 |                       <DescriptionPanel
442 |                         descriptions={panelDescriptions}
443 |                         categories={data.uml.categories ?? {}}
444 |                         activeNode={activeNode}
445 |                         label={panelLabel}
446 |                         onNodeHover={setActiveNode}
447 |                         onNodeClick={(name) => setActiveNode((prev) => prev === name ? null : name)}
448 |                       />
449 |                     </div>
450 |                   </div>
451 |                 </motion.div>
452 |               );
453 |             })()}
454 | 
455 |             {/* Quiz */}
456 |             {activeTab === 'quiz' && data?.quiz && (
457 |               <motion.div key="quiz" variants={fadeUp} initial="hidden" animate="show" exit="exit" className="flex flex-col gap-4">
458 |                 {data.quiz.map((q, i) => (
459 |                   <div key={i} className="rounded-xl border border-zinc-900 bg-zinc-950/60 p-5">
460 |                     <p className="text-sm text-zinc-200 mb-4">
461 |                       <span className="font-mono text-xs text-zinc-700 mr-2">{i + 1}.</span>
462 |                       {q.question}
463 |                     </p>
464 |                     <div className="flex flex-col gap-2 mb-4">
465 |                       {q.options.map((opt, j) => (
466 |                         <motion.div
467 |                           key={j}
468 |                           animate={
469 |                             revealed.has(i) && j === q.correctAnswer
470 |                               ? { borderColor: 'rgb(21 128 61 / 0.6)', backgroundColor: 'rgb(5 46 22 / 0.4)' }
471 |                               : { borderColor: 'rgb(39 39 42)', backgroundColor: 'transparent' }
472 |                           }
473 |                           transition={{ duration: 0.25 }}
474 |                           className="text-xs px-3 py-2.5 rounded-lg border text-zinc-400"
475 |                         >
476 |                           {opt}
477 |                         </motion.div>
478 |                       ))}
479 |                     </div>
480 |                     <AnimatePresence>
481 |                       {revealed.has(i) && q.explanation && (
482 |                         <motion.div
483 |                           initial={{ opacity: 0, height: 0 }}
484 |                           animate={{ opacity: 1, height: 'auto' }}
485 |                           exit={{ opacity: 0, height: 0 }}
486 |                           className="overflow-hidden mb-4"
487 |                         >
488 |                           <div className="text-xs text-zinc-400 bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2.5">
489 |                             {q.explanation}
490 |                           </div>
491 |                         </motion.div>
492 |                       )}
493 |                     </AnimatePresence>
494 |                     <motion.button
495 |                       onClick={() => toggleReveal(i)}
496 |                       whileHover={{ x: 2 }}
497 |                       className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
498 |                     >
499 |                       {revealed.has(i) ? 'Hide answer ↑' : 'Reveal answer ↓'}
500 |                     </motion.button>
501 |                   </div>
502 |                 ))}
503 |               </motion.div>
504 |             )}
505 |           </AnimatePresence>
506 |         )}
507 |       </main>
508 |     </div>
509 |   );
510 | }
</content>
</file>
<file><path>app/quiz/page.tsx</path>
<content lines="1-274">
  1 | 'use client';
  2 | 
  3 | import { useEffect, useState } from 'react';
  4 | import { useRouter } from 'next/navigation';
  5 | import Link from 'next/link';
  6 | 
  7 | interface QuizQuestion {
  8 |   question: string;
  9 |   options: string[];
 10 |   correctAnswer: number;
 11 |   explanation: string;
 12 | }
 13 | 
 14 | export default function QuizPage() {
 15 |   const router = useRouter();
 16 |   const [questions, setQuestions] = useState<QuizQuestion[]>([]);
 17 |   const [currentQuestion, setCurrentQuestion] = useState(0);
 18 |   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
 19 |   const [showExplanation, setShowExplanation] = useState(false);
 20 |   const [score, setScore] = useState(0);
 21 |   const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
 22 |   const [quizComplete, setQuizComplete] = useState(false);
 23 |   const [repoName, setRepoName] = useState('');
 24 | 
 25 |   useEffect(() => {
 26 |     const storedData = sessionStorage.getItem('analysisData');
 27 | 
 28 |     if (!storedData) {
 29 |       router.push('/');
 30 |       return;
 31 |     }
 32 | 
 33 |     const parsedData = JSON.parse(storedData);
 34 |     
 35 |     if (!parsedData.quiz || parsedData.quiz.length === 0) {
 36 |       router.push('/results');
 37 |       return;
 38 |     }
 39 | 
 40 |     setQuestions(parsedData.quiz);
 41 |     setAnsweredQuestions(new Array(parsedData.quiz.length).fill(false));
 42 |     setRepoName(parsedData.repository.name);
 43 |   }, [router]);
 44 | 
 45 |   const handleAnswerSelect = (answerIndex: number) => {
 46 |     if (answeredQuestions[currentQuestion]) return;
 47 |     
 48 |     setSelectedAnswer(answerIndex);
 49 |     setShowExplanation(true);
 50 | 
 51 |     const newAnsweredQuestions = [...answeredQuestions];
 52 |     newAnsweredQuestions[currentQuestion] = true;
 53 |     setAnsweredQuestions(newAnsweredQuestions);
 54 | 
 55 |     if (answerIndex === questions[currentQuestion].correctAnswer) {
 56 |       setScore(score + 1);
 57 |     }
 58 |   };
 59 | 
 60 |   const handleNext = () => {
 61 |     if (currentQuestion < questions.length - 1) {
 62 |       setCurrentQuestion(currentQuestion + 1);
 63 |       setSelectedAnswer(null);
 64 |       setShowExplanation(false);
 65 |     } else {
 66 |       setQuizComplete(true);
 67 |     }
 68 |   };
 69 | 
 70 |   const handlePrevious = () => {
 71 |     if (currentQuestion > 0) {
 72 |       setCurrentQuestion(currentQuestion - 1);
 73 |       setSelectedAnswer(null);
 74 |       setShowExplanation(false);
 75 |     }
 76 |   };
 77 | 
 78 |   const handleRestart = () => {
 79 |     setCurrentQuestion(0);
 80 |     setSelectedAnswer(null);
 81 |     setShowExplanation(false);
 82 |     setScore(0);
 83 |     setAnsweredQuestions(new Array(questions.length).fill(false));
 84 |     setQuizComplete(false);
 85 |   };
 86 | 
 87 |   if (questions.length === 0) {
 88 |     return (
 89 |       <div className="flex items-center justify-center min-h-screen">
 90 |         <div className="animate-pulse text-xl">Loading quiz...</div>
 91 |       </div>
 92 |     );
 93 |   }
 94 | 
 95 |   if (quizComplete) {
 96 |     const percentage = Math.round((score / questions.length) * 100);
 97 |     let message = '';
 98 |     let emoji = '';
 99 | 
100 |     if (percentage >= 90) {
101 |       message = 'Outstanding! You have excellent understanding of this codebase!';
102 |       emoji = '🏆';
103 |     } else if (percentage >= 70) {
104 |       message = 'Great job! You have a solid grasp of the code!';
105 |       emoji = '🎉';
106 |     } else if (percentage >= 50) {
107 |       message = 'Good effort! Review the documentation to improve your understanding.';
108 |       emoji = '👍';
109 |     } else {
110 |       message = 'Keep learning! Review the documentation and try again.';
111 |       emoji = '📚';
112 |     }
113 | 
114 |     return (
115 |       <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-4">
116 |         <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
117 |           <div className="text-center">
118 |             <div className="text-6xl mb-4">{emoji}</div>
119 |             <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
120 |               Quiz Complete!
121 |             </h1>
122 |             <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
123 |               {score}/{questions.length}
124 |             </div>
125 |             <div className="text-2xl text-gray-700 dark:text-gray-300 mb-2">
126 |               {percentage}% Correct
127 |             </div>
128 |             <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
129 |               {message}
130 |             </p>
131 |             <div className="flex flex-col sm:flex-row gap-4 justify-center">
132 |               <button
133 |                 onClick={handleRestart}
134 |                 className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
135 |               >
136 |                 🔄 Retake Quiz
137 |               </button>
138 |               <Link
139 |                 href="/results"
140 |                 className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-semibold text-center"
141 |               >
142 |                 📚 Back to Documentation
143 |               </Link>
144 |               <Link
145 |                 href="/"
146 |                 className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold text-center"
147 |               >
148 |                 🏠 Analyze Another Repo
149 |               </Link>
150 |             </div>
151 |           </div>
152 |         </div>
153 |       </div>
154 |     );
155 |   }
156 | 
157 |   const question = questions[currentQuestion];
158 |   const isAnswered = answeredQuestions[currentQuestion];
159 | 
160 |   return (
161 |     <div className="min-h-screen bg-zinc-50 dark:bg-black">
162 |       {/* Header */}
163 |       <div className="bg-blue-600 text-white py-4 px-4">
164 |         <div className="max-w-4xl mx-auto flex justify-between items-center">
165 |           <h1 className="text-2xl font-bold">🎯 {repoName} Quiz</h1>
166 |           <Link href="/results" className="hover:underline">
167 |             ← Back to Results
168 |           </Link>
169 |         </div>
170 |       </div>
171 | 
172 |       <div className="max-w-4xl mx-auto px-4 py-8">
173 |         {/* Progress Bar */}
174 |         <div className="mb-8">
175 |           <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
176 |             <span>Question {currentQuestion + 1} of {questions.length}</span>
177 |             <span>Score: {score}/{answeredQuestions.filter(a => a).length}</span>
178 |           </div>
179 |           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
180 |             <div
181 |               className="bg-blue-600 h-3 rounded-full transition-all duration-300"
182 |               style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
183 |             />
184 |           </div>
185 |         </div>
186 | 
187 |         {/* Question Card */}
188 |         <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 mb-6">
189 |           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
190 |             {question.question}
191 |           </h2>
192 | 
193 |           <div className="space-y-4">
194 |             {question.options.map((option, index) => {
195 |               const isSelected = selectedAnswer === index;
196 |               const isCorrect = index === question.correctAnswer;
197 |               const showResult = showExplanation;
198 | 
199 |               let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
200 |               
201 |               if (!showResult) {
202 |                 buttonClass += 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800';
203 |               } else if (isCorrect) {
204 |                 buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900/20';
205 |               } else if (isSelected && !isCorrect) {
206 |                 buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900/20';
207 |               } else {
208 |                 buttonClass += 'border-gray-300 dark:border-gray-600 opacity-50';
209 |               }
210 | 
211 |               return (
212 |                 <button
213 |                   key={index}
214 |                   onClick={() => handleAnswerSelect(index)}
215 |                   disabled={isAnswered}
216 |                   className={buttonClass}
217 |                 >
218 |                   <div className="flex items-center gap-3">
219 |                     <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
220 |                       showResult && isCorrect
221 |                         ? 'bg-green-500 text-white'
222 |                         : showResult && isSelected && !isCorrect
223 |                         ? 'bg-red-500 text-white'
224 |                         : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
225 |                     }`}>
226 |                       {String.fromCharCode(65 + index)}
227 |                     </div>
228 |                     <span className="text-gray-900 dark:text-white flex-1">{option}</span>
229 |                     {showResult && isCorrect && <span className="text-2xl">✓</span>}
230 |                     {showResult && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
231 |                   </div>
232 |                 </button>
233 |               );
234 |             })}
235 |           </div>
236 | 
237 |           {/* Explanation */}
238 |           {showExplanation && (
239 |             <div className={`mt-6 p-4 rounded-lg ${
240 |               selectedAnswer === question.correctAnswer
241 |                 ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
242 |                 : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
243 |             }`}>
244 |               <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
245 |                 {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
246 |               </h3>
247 |               <p className="text-gray-700 dark:text-gray-300">{question.explanation}</p>
248 |             </div>
249 |           )}
250 |         </div>
251 | 
252 |         {/* Navigation Buttons */}
253 |         <div className="flex justify-between">
254 |           <button
255 |             onClick={handlePrevious}
256 |             disabled={currentQuestion === 0}
257 |             className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
258 |           >
259 |             ← Previous
260 |           </button>
261 |           <button
262 |             onClick={handleNext}
263 |             disabled={!isAnswered}
264 |             className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
265 |           >
266 |             {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next →'}
267 |           </button>
268 |         </div>
269 |       </div>
270 |     </div>
271 |   );
272 | }
273 | 
274 | // Made with Bob
</content>
</file>
<file><path>app/api/analyze/route.ts</path>
<content lines="1-264">
  1 | import { GoogleGenerativeAI } from '@google/generative-ai';
  2 | import { NextRequest, NextResponse } from 'next/server';
  3 | import { getAllCodeFiles, getRepositoryInfo, parseGitHubUrl, type CodeFile } from '../github/lib';
  4 | 
  5 | const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  6 | 
  7 | const GENERATION_CONFIG = {
  8 |   temperature: 0,      // fully deterministic output
  9 |   topP: 1,
 10 |   topK: 1,
 11 | };
 12 | 
 13 | // Generate documentation using Gemini
 14 | async function generateDocumentation(files: CodeFile[], repoName: string) {
 15 |   const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: GENERATION_CONFIG });
 16 |   
 17 |   const filesContext = files.map(f => `
 18 | File: ${f.path}
 19 | Language: ${f.language}
 20 | Content:
 21 | \`\`\`${f.language}
 22 | ${f.content.substring(0, 2000)}${f.content.length > 2000 ? '...' : ''}
 23 | \`\`\`
 24 | `).join('\n\n');
 25 | 
 26 |   const prompt = `You are a technical documentation expert. Analyze the following code repository "${repoName}" and generate comprehensive documentation.
 27 | 
 28 | Repository Files:
 29 | ${filesContext}
 30 | 
 31 | Please provide:
 32 | 1. **Project Overview**: What does this project do? What problem does it solve?
 33 | 2. **Architecture**: Describe the overall architecture and design patterns used
 34 | 3. **Key Components**: List and explain the main components/modules
 35 | 4. **Technologies Used**: List the programming languages, frameworks, and libraries
 36 | 5. **Setup Instructions**: How to set up and run the project
 37 | 6. **API/Functions**: Document key functions, classes, or APIs
 38 | 7. **Code Examples**: Show how to use the main features
 39 | 
 40 | Format the response in clean Markdown with proper headings, code blocks, and lists.`;
 41 | 
 42 |   const result = await model.generateContent(prompt);
 43 |   const response = await result.response;
 44 |   return response.text();
 45 | }
 46 | 
 47 | // Generate UML diagram using Gemini
 48 | async function generateUML(files: CodeFile[], repoName: string) {
 49 |   const model = genAI.getGenerativeModel({
 50 |     model: 'gemini-2.5-flash',
 51 |     generationConfig: { ...GENERATION_CONFIG, responseMimeType: 'application/json' },
 52 |   });
 53 | 
 54 |   const filesContext = files.map(f => `
 55 | File: ${f.path}
 56 | Language: ${f.language}
 57 | Content:
 58 | \`\`\`${f.language}
 59 | ${f.content.substring(0, 2000)}${f.content.length > 2000 ? '...' : ''}
 60 | \`\`\`
 61 | `).join('\n\n');
 62 | 
 63 |   const prompt = `You are a software architecture expert. Analyze the code repository "${repoName}".
 64 | 
 65 | Return a single JSON object with exactly these four keys:
 66 | 
 67 | {
 68 |   "classDiagram": "<valid Mermaid classDiagram string>",
 69 |   "sequenceDiagram": "<valid Mermaid sequenceDiagram string>",
 70 |   "descriptions": {
 71 |     "<NodeOrActorName>": "<one sentence plain-English description>"
 72 |   },
 73 |   "categories": {
 74 |     "<NodeOrActorName>": "<page|route|external|internal|actor>"
 75 |   }
 76 | }
 77 | 
 78 | Rules for the CLASS DIAGRAM:
 79 | - Include AT MOST 7 of the most architecturally important classes/modules. Skip utility helpers, config files, and anything not central to the main data flow.
 80 | - Show AT MOST 2-3 members per class — only the most important ones.
 81 | - Show AT MOST 5 relationships total. Prefer composition (-->) over inheritance. Drop trivial or obvious relationships.
 82 | - Do NOT show every file in the repo — be selective. A focused diagram with 5 nodes is better than a cluttered one with 15.
 83 | 
 84 | Rules for the SEQUENCE DIAGRAM:
 85 | - Show AT MOST 5 actors. Each actor name must be UNIQUE — never declare the same participant twice.
 86 | - Show only the primary happy-path request flow — skip error handling, retries, and edge cases.
 87 | - Keep it to AT MOST 10 messages total.
 88 | 
 89 | Rules for both diagrams:
 90 | - Use valid Mermaid v11 syntax only.
 91 | - In classDiagram: use ONLY the keyword "class", never "interface", "enum", or "abstract class".
 92 | - Actor and class names must be plain alphanumeric — no parentheses, colons, angle brackets, or special characters.
 93 | - Member types must be simple words only (string, number, boolean) — no arrays like string[], no generics, no union types.
 94 | - Do not include markdown fences inside the JSON strings — just the raw diagram text starting with "classDiagram" or "sequenceDiagram".
 95 | 
 96 | Rules for "descriptions":
 97 | - Must include one entry for every class in the classDiagram and every actor in the sequenceDiagram.
 98 | - ALSO include entries for up to 8 additional important utility functions, helper modules, or key interfaces that appear in the codebase but are not nodes in the diagrams (e.g. parseGitHubUrl, getRepositoryInfo, generateDocumentation). These give onboarding engineers the detail they need.
 99 | - Each description is one plain-English sentence.
100 | 
101 | Rules for "categories":
102 | - Must include one entry for every name in "descriptions".
103 | - Use exactly one of these five values: page, route, external, internal, actor.
104 |   - page: frontend React pages/components and client-side entry points
105 |   - route: Next.js API routes and server-side request handlers
106 |   - external: third-party APIs and services (GitHub, Gemini, Octokit, etc.)
107 |   - internal: internal utilities, helper modules, and library functions
108 |   - actor: human users, browsers, or generic client actors in sequence diagrams
109 | 
110 | Repository Files:
111 | ${filesContext}`;
112 | 
113 |   const result = await model.generateContent(prompt);
114 |   const text = result.response.text();
115 |   try {
116 |     return JSON.parse(text);
117 |   } catch {
118 |     const stripped = text.replace(/^```json\s*|```\s*$/g, '').trim();
119 |     return JSON.parse(stripped);
120 |   }
121 | }
122 | 
123 | // Generate quiz using Gemini
124 | async function generateQuiz(files: CodeFile[], repoName: string) {
125 |   const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig: GENERATION_CONFIG });
126 |   
127 |   const filesContext = files.map(f => `
128 | File: ${f.path}
129 | Content:
130 | \`\`\`${f.language}
131 | ${f.content.substring(0, 1500)}${f.content.length > 1500 ? '...' : ''}
132 | \`\`\`
133 | `).join('\n\n');
134 | 
135 |   const prompt = `You are a technical educator. Based on the following code repository "${repoName}", create a comprehensive quiz to test understanding of the codebase.
136 | 
137 | Repository Files:
138 | ${filesContext}
139 | 
140 | Generate 10 multiple-choice questions covering:
141 | - Code functionality and purpose
142 | - Architecture and design patterns
143 | - Key functions and their behavior
144 | - Best practices used in the code
145 | 
146 | Format as JSON array with this structure:
147 | [
148 |   {
149 |     "question": "Question text",
150 |     "options": ["Option A", "Option B", "Option C", "Option D"],
151 |     "correctAnswer": 0,
152 |     "explanation": "Why this is the correct answer"
153 |   }
154 | ]
155 | 
156 | Return ONLY the JSON array, no additional text.`;
157 | 
158 |   const result = await model.generateContent(prompt);
159 |   const response = await result.response;
160 |   const text = response.text();
161 |   
162 |   // Extract JSON from response
163 |   const jsonMatch = text.match(/\[[\s\S]*\]/);
164 |   if (jsonMatch) {
165 |     return JSON.parse(jsonMatch[0]);
166 |   }
167 |   
168 |   return [];
169 | }
170 | 
171 | export async function POST(request: NextRequest) {
172 |   try {
173 |     const body = await request.json();
174 |     const { url, generateDocs, generateUml, generateQuizData } = body;
175 | 
176 |     if (!url) {
177 |       return NextResponse.json(
178 |         { error: 'GitHub repository URL is required' },
179 |         { status: 400 }
180 |       );
181 |     }
182 | 
183 |     if (!process.env.GEMINI_API_KEY) {
184 |       return NextResponse.json(
185 |         { error: 'GEMINI_API_KEY is not configured' },
186 |         { status: 500 }
187 |       );
188 |     }
189 | 
190 |     // Parse GitHub URL
191 |     const parsed = parseGitHubUrl(url);
192 |     if (!parsed) {
193 |       return NextResponse.json(
194 |         { error: 'Invalid GitHub repository URL' },
195 |         { status: 400 }
196 |       );
197 |     }
198 | 
199 |     const { owner, repo } = parsed;
200 | 
201 |     // Fetch repository info and code files
202 |     console.log('Fetching repository information...');
203 |     const repoInfo = await getRepositoryInfo(owner, repo);
204 |     
205 |     console.log('Fetching repository files...');
206 |     const files = await getAllCodeFiles(owner, repo);
207 | 
208 |     if (files.length === 0) {
209 |       return NextResponse.json(
210 |         { error: 'No code files found in repository' },
211 |         { status: 404 }
212 |       );
213 |     }
214 | 
215 |     console.log(`Found ${files.length} code files`);
216 | 
217 |     const result: any = {
218 |       repository: {
219 |         name: repoInfo.name,
220 |         full_name: repoInfo.full_name,
221 |         description: repoInfo.description,
222 |         html_url: repoInfo.html_url,
223 |       },
224 |       filesAnalyzed: files.length,
225 |     };
226 | 
227 |     // Generate documentation if requested
228 |     if (generateDocs) {
229 |       console.log('Generating documentation...');
230 |       result.documentation = await generateDocumentation(files, repoInfo.full_name);
231 |     }
232 | 
233 |     // Generate UML if requested
234 |     if (generateUml) {
235 |       console.log('Generating UML diagrams...');
236 |       result.uml = await generateUML(files, repoInfo.full_name);
237 |     }
238 | 
239 |     // Generate quiz if requested
240 |     if (generateQuizData) {
241 |       console.log('Generating quiz...');
242 |       result.quiz = await generateQuiz(files, repoInfo.full_name);
243 |     }
244 | 
245 |     return NextResponse.json(result, { status: 200 });
246 | 
247 |   } catch (error) {
248 |     console.error('Error analyzing repository:', error);
249 |     
250 |     if (error instanceof Error) {
251 |       return NextResponse.json(
252 |         { error: 'Failed to analyze repository', details: error.message },
253 |         { status: 500 }
254 |       );
255 |     }
256 | 
257 |     return NextResponse.json(
258 |       { error: 'An unexpected error occurred' },
259 |       { status: 500 }
260 |     );
261 |   }
262 | }
263 | 
264 | // Made with Bob
</content>
</file>
<file><path>app/api/github/route.ts</path>
<content lines="1-59">
 1 | import { NextRequest, NextResponse } from 'next/server';
 2 | import { getCompleteRepositoryData } from './lib';
 3 | 
 4 | export async function POST(request: NextRequest) {
 5 |   try {
 6 |     const body = await request.json();
 7 |     const { url } = body;
 8 | 
 9 |     if (!url) {
10 |       return NextResponse.json(
11 |         { error: 'GitHub repository URL is required' },
12 |         { status: 400 }
13 |       );
14 |     }
15 | 
16 |     // Fetch complete repository data using the lib module
17 |     const data = await getCompleteRepositoryData(url);
18 | 
19 |     // Compile response
20 |     const response = {
21 |       repository: data.repository,
22 |       readme: data.readme,
23 |       languages: data.languages,
24 |       contributors: data.contributors,
25 |     };
26 | 
27 |     return NextResponse.json(response, { status: 200 });
28 | 
29 |   } catch (error) {
30 |     console.error('Error fetching GitHub repository:', error);
31 |     
32 |     if (error instanceof Error) {
33 |       return NextResponse.json(
34 |         { error: 'Failed to fetch repository information', details: error.message },
35 |         { status: 500 }
36 |       );
37 |     }
38 | 
39 |     return NextResponse.json(
40 |       { error: 'An unexpected error occurred' },
41 |       { status: 500 }
42 |     );
43 |   }
44 | }
45 | 
46 | export async function GET(request: NextRequest) {
47 |   return NextResponse.json(
48 |     { 
49 |       message: 'GitHub Repository API',
50 |       usage: 'Send a POST request with { "url": "https://github.com/owner/repo" }',
51 |       endpoints: {
52 |         POST: 'Fetch repository information from GitHub URL'
53 |       }
54 |     },
55 |     { status: 200 }
56 |   );
57 | }
58 | 
59 | // Made with Bob
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
app/api/github/lib.ts,app/results/page.tsx,app/api/analyze/route.ts,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T12:47:50.004Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.07

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>ask</slug>
<name>❓ Ask</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<read_file>
<args>
  <file>
    <path>app/api/github/lib.ts</path>
    <line_range>1-100</line_range>
  </file>
  <file>
    <path>app/layout.tsx</path>
  </file>
  <file>
    <path>next.config.ts</path>
  </file>
</args>
</read_file>

---

**User:**

[read_file for 'app/api/github/lib.ts', 'app/layout.tsx', 'next.config.ts'] Result:
<files>
<file><path>app/api/github/lib.ts</path>
<content lines="1-100">
  1 | import { Octokit } from '@octokit/rest';
  2 | 
  3 | const octokit = new Octokit({
  4 |   auth: process.env.GITHUB_TOKEN,
  5 | });
  6 | 
  7 | export interface GitHubRepo {
  8 |   owner: string;
  9 |   repo: string;
 10 | }
 11 | 
 12 | export interface CodeFile {
 13 |   path: string;
 14 |   content: string;
 15 |   language: string;
 16 | }
 17 | 
 18 | export interface RepositoryInfo {
 19 |   name: string;
 20 |   full_name: string;
 21 |   description: string;
 22 |   html_url: string;
 23 |   homepage: string;
 24 |   created_at: string;
 25 |   updated_at: string;
 26 |   pushed_at: string;
 27 |   size: number;
 28 |   stargazers_count: number;
 29 |   watchers_count: number;
 30 |   forks_count: number;
 31 |   open_issues_count: number;
 32 |   default_branch: string;
 33 |   topics: string[];
 34 |   license: {
 35 |     name: string;
 36 |     spdx_id: string;
 37 |   } | null;
 38 |   owner: {
 39 |     login: string;
 40 |     avatar_url: string;
 41 |     html_url: string;
 42 |     type: string;
 43 |   };
 44 | }
 45 | 
 46 | /**
 47 |  * Parse a GitHub URL and extract owner and repository name
 48 |  */
 49 | export function parseGitHubUrl(url: string): GitHubRepo | null {
 50 |   try {
 51 |     const patterns = [
 52 |       /github\.com\/([^\/]+)\/([^\/]+)/,
 53 |       /github\.com\/([^\/]+)\/([^\/]+)\.git/,
 54 |     ];
 55 | 
 56 |     for (const pattern of patterns) {
 57 |       const match = url.match(pattern);
 58 |       if (match) {
 59 |         return {
 60 |           owner: match[1],
 61 |           repo: match[2].replace('.git', ''),
 62 |         };
 63 |       }
 64 |     }
 65 |     return null;
 66 |   } catch (error) {
 67 |     return null;
 68 |   }
 69 | }
 70 | 
 71 | /**
 72 |  * Fetch repository information from GitHub
 73 |  */
 74 | export async function getRepositoryInfo(owner: string, repo: string): Promise<RepositoryInfo> {
 75 |   const { data } = await octokit.repos.get({ owner, repo });
 76 |   
 77 |   return {
 78 |     name: data.name,
 79 |     full_name: data.full_name,
 80 |     description: data.description || '',
 81 |     html_url: data.html_url,
 82 |     homepage: data.homepage || '',
 83 |     created_at: data.created_at,
 84 |     updated_at: data.updated_at,
 85 |     pushed_at: data.pushed_at || '',
 86 |     size: data.size,
 87 |     stargazers_count: data.stargazers_count,
 88 |     watchers_count: data.watchers_count,
 89 |     forks_count: data.forks_count,
 90 |     open_issues_count: data.open_issues_count,
 91 |     default_branch: data.default_branch,
 92 |     topics: data.topics || [],
 93 |     license: data.license ? {
 94 |       name: data.license.name,
 95 |       spdx_id: data.license.spdx_id || '',
 96 |     } : null,
 97 |     owner: {
 98 |       login: data.owner.login,
 99 |       avatar_url: data.owner.avatar_url,
100 |       html_url: data.owner.html_url,
</content>
</file>
<file><path>app/layout.tsx</path>
<content lines="1-33">
 1 | import type { Metadata } from "next";
 2 | import { Geist, Geist_Mono } from "next/font/google";
 3 | import "./globals.css";
 4 | 
 5 | const geistSans = Geist({
 6 |   variable: "--font-geist-sans",
 7 |   subsets: ["latin"],
 8 | });
 9 | 
10 | const geistMono = Geist_Mono({
11 |   variable: "--font-geist-mono",
12 |   subsets: ["latin"],
13 | });
14 | 
15 | export const metadata: Metadata = {
16 |   title: "Create Next App",
17 |   description: "Generated by create next app",
18 | };
19 | 
20 | export default function RootLayout({
21 |   children,
22 | }: Readonly<{
23 |   children: React.ReactNode;
24 | }>) {
25 |   return (
26 |     <html
27 |       lang="en"
28 |       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
29 |     >
30 |       <body className="flex flex-col">{children}</body>
31 |     </html>
32 |   );
33 | }
</content>
</file>
<file><path>next.config.ts</path>
<content lines="1-7">
1 | import type { NextConfig } from "next";
2 | 
3 | const nextConfig: NextConfig = {
4 |   /* config options here */
5 | };
6 | 
7 | export default nextConfig;
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
app/api/github/lib.ts,app/results/page.tsx,app/api/analyze/route.ts,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T12:47:55.778Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.16

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>ask</slug>
<name>❓ Ask</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<attempt_completion>
<result>
# Comprehensive Project Analysis: Seenior

## Current README Status

The existing [`README.md`](README.md:1-10) is minimal and marked as "just a concept" with only basic feature descriptions. It lacks:
- Setup instructions
- Technology stack details
- API documentation references
- Architecture overview
- Usage examples
- Environment configuration
- Deployment information

## Project Overview

**Seenior** is a rapid onboarding toolkit designed to help new developers understand codebases quickly. It analyzes GitHub repositories and generates comprehensive onboarding materials including documentation, UML diagrams, and comprehension quizzes.

## Key Features

Based on the codebase analysis:

1. **GitHub Repository Analysis** ([`/api/github`](app/api/github/route.ts:1-59))
   - Fetches repository metadata, README, languages, and contributors
   - Supports multiple GitHub URL formats
   - Rate-limited API with optional authentication

2. **AI-Powered Documentation Generation** ([`/api/analyze`](app/api/analyze/route.ts:14-45))
   - Creates comprehensive project documentation
   - Covers architecture, components, setup, and code examples
   - Uses Google Gemini AI (with IBM Watson migration planned per [`MIGRATION_SUMMARY.md`](MIGRATION_SUMMARY.md:1-233))

3. **Interactive UML Diagrams** ([`/api/analyze`](app/api/analyze/route.ts:48-121))
   - Generates class diagrams (architecture overview)
   - Creates sequence diagrams (request flow visualization)
   - Interactive pan/zoom interface with component descriptions
   - Color-coded categories (page/route/external/internal/actor)

4. **Comprehension Quizzes** ([`/api/analyze`](app/api/analyze/route.ts:124-169))
   - Generates 10 multiple-choice questions
   - Tests understanding of functionality, architecture, and best practices
   - Includes explanations for each answer

5. **Modern UI/UX** ([`app/page.tsx`](app/page.tsx:1-167), [`app/results/page.tsx`](app/results/page.tsx:1-510))
   - Dark-themed interface with Framer Motion animations
   - Progressive loading with step indicators
   - Tab-based navigation for different content types
   - Responsive design with Tailwind CSS

## Technology Stack

### Frontend
- **Framework**: Next.js 16.2.6 (App Router)
- **React**: 19.2.4
- **Styling**: Tailwind CSS 4.x with PostCSS
- **Animations**: Framer Motion 12.38.0
- **Diagrams**: Mermaid 11.15.0
- **Fonts**: Geist Sans & Geist Mono

### Backend/API
- **Runtime**: Next.js API Routes (Server-side)
- **AI Provider**: Google Generative AI (Gemini 2.5 Flash) - [`@google/generative-ai`](package.json:12) v0.24.1
  - **Note**: Migration to IBM Watson AI (Llama 3.3 70B) documented but not yet implemented in code
- **GitHub Integration**: Octokit REST API v22.0.1
- **Language**: TypeScript 5.x

### Development Tools
- **Linting**: ESLint 9 with Next.js config
- **Type Checking**: TypeScript with strict mode enabled
- **Module Resolution**: Bundler-style with path aliases (`@/*`)

## API Endpoints

### 1. POST [`/api/github`](app/api/github/route.ts:4-44)
**Purpose**: Fetch comprehensive GitHub repository information

**Request**:
```json
{
  "url": "https://github.com/owner/repo"
}
```

**Response**: Repository metadata, README content, programming languages, top contributors

**Supported URL Formats**:
- `https://github.com/owner/repo`
- `https://github.com/owner/repo.git`
- `github.com/owner/repo`

### 2. POST [`/api/analyze`](app/api/analyze/route.ts:171-262)
**Purpose**: Analyze repository and generate onboarding materials

**Request**:
```json
{
  "url": "https://github.com/owner/repo",
  "generateDocs": true,
  "generateUml": true,
  "generateQuizData": true
}
```

**Response**: Documentation, UML diagrams (class + sequence), and quiz questions

**Processing Flow**:
1. Parse GitHub URL
2. Fetch repository info and code files
3. Generate requested content using AI
4. Return structured JSON response

## Project Architecture

### Frontend Structure
```
app/
├── page.tsx              # Landing page with repo input
├── results/page.tsx      # Results display with tabs
├── quiz/page.tsx         # Standalone quiz interface
├── layout.tsx            # Root layout with fonts
├── globals.css           # Global styles
└── components/
    ├── MermaidDiagram.tsx           # Mermaid renderer
    └── uml/
        ├── InteractiveDiagram.tsx   # Pan/zoom diagram viewer
        ├── DescriptionPanel.tsx     # Component descriptions
        └── categoryColors.ts        # Color scheme definitions
```

### Backend Structure
```
app/api/
├── github/
│   ├── route.ts          # GitHub API endpoint
│   └── lib.ts            # GitHub utilities (Octokit wrapper)
└── analyze/
    └── route.ts          # AI analysis endpoint
```

### Utility Modules
- [`app/utils/export.ts`](app/utils/export.ts) - Export functionality
- [`app/api/github/lib.ts`](app/api/github/lib.ts:1-100) - GitHub API helpers:
  - [`parseGitHubUrl()`](app/api/github/lib.ts:49-69) - URL parsing
  - [`getRepositoryInfo()`](app/api/github/lib.ts:74-100) - Fetch repo metadata
  - `getAllCodeFiles()` - Retrieve repository code files
  - `getCompleteRepositoryData()` - Comprehensive data fetching

## Notable Patterns & Conventions

### 1. **AI Generation Strategy**
- **Temperature 0**: Ensures deterministic, consistent outputs
- **Context Optimization**: Truncates file content to 2000 chars for documentation, 1500 for quizzes
- **Structured Prompts**: Detailed instructions with format specifications
- **JSON Mode**: Uses `responseMimeType: 'application/json'` for UML generation
- **Fallback Parsing**: Strips markdown fences from JSON responses

### 2. **UML Diagram Constraints**
- **Selective Focus**: Max 7 classes, 5 relationships, 2-3 members per class
- **Simplicity**: Avoids clutter by showing only architecturally important components
- **Dual Diagrams**: Class diagram for structure, sequence diagram for flow
- **Enhanced Metadata**: Includes descriptions and categories for all nodes

### 3. **Progressive Loading UX**
- **Multi-step Indicators**: 5 loading phases with estimated durations
- **Skeleton Screens**: Content-specific loading states for each tab
- **Optimistic UI**: Shows tabs during loading for preview

### 4. **Interactive Diagram Features**
- **Pan & Zoom**: Viewport controls for large diagrams
- **Node Highlighting**: Hover and click interactions
- **Synchronized Panels**: Diagram and description panel stay in sync
- **Category Colors**: Visual coding by component type

### 5. **Code Organization**
- **Separation of Concerns**: API logic in `/api`, UI in `/app`, utilities in `/utils`
- **Type Safety**: Comprehensive TypeScript interfaces throughout
- **Reusable Components**: Modular UI components with clear responsibilities
- **Environment Variables**: Secure credential management via `.env.local`

### 6. **Error Handling**
- **Graceful Degradation**: Returns partial data if some operations fail
- **Comprehensive Validation**: URL parsing, credential checks, file existence
- **User-Friendly Messages**: Clear error states in UI

## Environment Configuration

Required environment variables (per [`MIGRATION_SUMMARY.md`](MIGRATION_SUMMARY.md:82-92)):

```env
# Current (Google Gemini)
GEMINI_API_KEY=your_gemini_api_key

# Planned (IBM Watson AI)
WATSONAI_API_KEY=your_watson_api_key
WATSONX_PROJECT_ID=your_project_id

# Optional (increases GitHub rate limits)
GITHUB_TOKEN=your_github_token
```

## Migration Status

**Important**: The codebase currently uses Google Gemini AI, but [`MIGRATION_SUMMARY.md`](MIGRATION_SUMMARY.md:1-233) documents a completed migration to IBM Watson AI that hasn't been implemented in the actual code yet. The [`package.json`](package.json:12) still lists `@google/generative-ai` as a dependency, not `@ibm-cloud/watsonx-ai`.

## Development Scripts

From [`package.json`](package.json:5-10):
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Additional Documentation

- [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md:1-231) - Detailed GitHub API endpoint documentation
- [`MIGRATION_SUMMARY.md`](MIGRATION_SUMMARY.md:1-233) - AI provider migration guide (planned, not implemented)
- [`AGENTS.md`](AGENTS.md) - Agent rules for Next.js development
- [`CLAUDE.md`](CLAUDE.md) - Additional documentation (not analyzed)

## Recommendations for README Enhancement

The README should be expanded to include:
1. **Quick Start Guide** with installation steps
2. **Environment Setup** with all required API keys
3. **Architecture Diagram** showing system components
4. **API Reference** linking to detailed documentation
5. **Screenshots** of the UI in action
6. **Technology Stack** section with version details
7. **Contributing Guidelines** for open-source collaboration
8. **License Information** (MIT license exists but not documented)
9. **Deployment Instructions** for production
10. **Troubleshooting** common issues and solutions
</result>
</attempt_completion>

