**User:**

<task>
Fix JSON parsing error in the analyze API where llama3 is returning text before the JSON object.

**Context:**
The error message shows: `SyntaxError: Unexpected token 'H', "Here is th"... is not valid JSON`

This indicates that llama3 is responding with text like "Here is the..." before the actual JSON object, causing JSON.parse() to fail.

**Task Scope:**
1. Examine the file [`app/api/analyze/route.ts`](app/api/analyze/route.ts) to locate where the LLM response is being parsed
2. Identify where JSON.parse() is being called on the llama3 response
3. Implement a robust JSON extraction function that:
   - Strips any text before the first `{` or `[` character
   - Extracts only the JSON portion from the response
   - Handles edge cases like multiple JSON objects or trailing text
4. Replace the direct JSON.parse() call with this extraction function
5. Add error handling to provide better error messages if JSON extraction fails

**Important:**
- Only modify the code necessary to fix this specific JSON parsing issue
- Do not make unrelated changes to the codebase
- Ensure the fix handles various response formats from llama3
- Test that the solution works by examining the code logic

**Completion:**
When finished, use the `attempt_completion` tool with a concise summary of:
- What file(s) were modified
- What changes were made to fix the JSON parsing
- How the solution handles non-JSON text in responses

These instructions supersede any conflicting general instructions your mode might have.
</task>
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
test-context-optimization.js,app/utils/export.ts,app/api/analyze/route.ts,app/api/github/lib.ts,app/results/page.tsx,app/api/github/route.ts,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T11:35:21.543Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>


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

I'll help you fix the JSON parsing error in the analyze API. Let me start by examining the route file to understand the current implementation.

<read_file>
<args>
<file>
<path>app/api/analyze/route.ts</path>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'app/api/analyze/route.ts'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>app/api/analyze/route.ts</path>
<content lines="1-278">
  1 | 
  2 | import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
  3 | import { IamAuthenticator } from 'ibm-cloud-sdk-core';
  4 | import { NextRequest, NextResponse } from 'next/server';
  5 | import { getAllCodeFiles, getRepositoryInfo, parseGitHubUrl, type CodeFile } from '../github/lib';
  6 | 
  7 | // Initialize WatsonX AI client with explicit authentication
  8 | const watsonxAI = WatsonXAI.newInstance({
  9 |   version: '2024-05-31',
 10 |   serviceUrl: 'https://us-south.ml.cloud.ibm.com',
 11 |   authenticator: new IamAuthenticator({
 12 |     apikey: process.env.WATSONAI_API_KEY || '',
 13 |   }),
 14 | });
 15 | 
 16 | const GENERATION_CONFIG = {
 17 |   temperature: 0,      // fully deterministic output
 18 |   topP: 1,
 19 |   topK: 1,
 20 | };
 21 | 
 22 | // Generate text using WatsonX AI (kept for backward compatibility)
 23 | async function generateText(prompt: string, responseFormat?: 'json'): Promise<string> {
 24 |   const params = {
 25 |     input: prompt,
 26 |     modelId: 'meta-llama/llama-3-3-70b-instruct',
 27 |     projectId: process.env.WATSONX_PROJECT_ID || '',
 28 |     parameters: GENERATION_CONFIG,
 29 |   };
 30 | 
 31 |   const response = await watsonxAI.generateText(params);
 32 |   
 33 |   if (response.result && response.result.results && response.result.results.length > 0) {
 34 |     return response.result.results[0].generated_text || '';
 35 |   }
 36 |   
 37 |   throw new Error('No response generated from WatsonX AI');
 38 | }
 39 | 
 40 | async function generateDocumentation(files: CodeFile[], repoName: string) {
 41 |   const filesContext = files.map(f => `
 42 | File: ${f.path}
 43 | Language: ${f.language}
 44 | Content:
 45 | \`\`\`${f.language}
 46 | ${f.content.substring(0, 2000)}${f.content.length > 2000 ? '...' : ''}
 47 | \`\`\`
 48 | `).join('\n\n');
 49 | 
 50 |   const prompt = `You are a technical documentation expert. Analyze the following code repository "${repoName}" and generate comprehensive documentation.
 51 | 
 52 | Repository Files:
 53 | ${filesContext}
 54 | 
 55 | Please provide:
 56 | 1. **Project Overview**: What does this project do? What problem does it solve?
 57 | 2. **Architecture**: Describe the overall architecture and design patterns used
 58 | 3. **Key Components**: List and explain the main components/modules
 59 | 4. **Technologies Used**: List the programming languages, frameworks, and libraries
 60 | 5. **Setup Instructions**: How to set up and run the project
 61 | 6. **API/Functions**: Document key functions, classes, or APIs
 62 | 7. **Code Examples**: Show how to use the main features
 63 | 
 64 | Format the response in clean Markdown with proper headings, code blocks, and lists.`;
 65 | 
 66 |   return await generateText(prompt);
 67 | }
 68 | 
 69 | // Generate UML diagram using Gemini
 70 | async function generateUML(files: CodeFile[], repoName: string) {
 71 | 
 72 |   const filesContext = files.map(f => `
 73 | File: ${f.path}
 74 | Language: ${f.language}
 75 | Content:
 76 | \`\`\`${f.language}
 77 | ${f.content.substring(0, 2000)}${f.content.length > 2000 ? '...' : ''}
 78 | \`\`\`
 79 | `).join('\n\n');
 80 | 
 81 |   const prompt = `You are a software architecture expert. Analyze the code repository "${repoName}".
 82 | 
 83 | Return a single JSON object with exactly these four keys:
 84 | 
 85 | {
 86 |   "classDiagram": "<valid Mermaid classDiagram string>",
 87 |   "sequenceDiagram": "<valid Mermaid sequenceDiagram string>",
 88 |   "descriptions": {
 89 |     "<NodeOrActorName>": "<one sentence plain-English description>"
 90 |   },
 91 |   "categories": {
 92 |     "<NodeOrActorName>": "<page|route|external|internal|actor>"
 93 |   }
 94 | }
 95 | 
 96 | Rules for the CLASS DIAGRAM:
 97 | - Include AT MOST 7 of the most architecturally important classes/modules. Skip utility helpers, config files, and anything not central to the main data flow.
 98 | - Show AT MOST 2-3 members per class — only the most important ones.
 99 | - Show AT MOST 5 relationships total. Prefer composition (-->) over inheritance. Drop trivial or obvious relationships.
100 | - Do NOT show every file in the repo — be selective. A focused diagram with 5 nodes is better than a cluttered one with 15.
101 | 
102 | Rules for the SEQUENCE DIAGRAM:
103 | - Show AT MOST 5 actors. Each actor name must be UNIQUE — never declare the same participant twice.
104 | - Show only the primary happy-path request flow — skip error handling, retries, and edge cases.
105 | - Keep it to AT MOST 10 messages total.
106 | 
107 | Rules for both diagrams:
108 | - Use valid Mermaid v11 syntax only.
109 | - In classDiagram: use ONLY the keyword "class", never "interface", "enum", or "abstract class".
110 | - Actor and class names must be plain alphanumeric — no parentheses, colons, angle brackets, or special characters.
111 | - Member types must be simple words only (string, number, boolean) — no arrays like string[], no generics, no union types.
112 | - Do not include markdown fences inside the JSON strings — just the raw diagram text starting with "classDiagram" or "sequenceDiagram".
113 | 
114 | Rules for "descriptions":
115 | - Must include one entry for every class in the classDiagram and every actor in the sequenceDiagram.
116 | - ALSO include entries for up to 8 additional important utility functions, helper modules, or key interfaces that appear in the codebase but are not nodes in the diagrams (e.g. parseGitHubUrl, getRepositoryInfo, generateDocumentation). These give onboarding engineers the detail they need.
117 | - Each description is one plain-English sentence.
118 | 
119 | Rules for "categories":
120 | - Must include one entry for every name in "descriptions".
121 | - Use exactly one of these five values: page, route, external, internal, actor.
122 |   - page: frontend React pages/components and client-side entry points
123 |   - route: Next.js API routes and server-side request handlers
124 |   - external: third-party APIs and services (GitHub, Gemini, Octokit, etc.)
125 |   - internal: internal utilities, helper modules, and library functions
126 |   - actor: human users, browsers, or generic client actors in sequence diagrams
127 | 
128 | Repository Files:
129 | ${filesContext}`;
130 | 
131 |   const text = await generateText(prompt);
132 |   try {
133 |     return JSON.parse(text);
134 |   } catch {
135 |     const stripped = text.replace(/^```json\s*|```\s*$/g, '').trim();
136 |     return JSON.parse(stripped);
137 |   }
138 | }
139 | 
140 | // Generate quiz using Gemini
141 | async function generateQuiz(files: CodeFile[], repoName: string) {
142 |   
143 |   const filesContext = files.map(f => `
144 | File: ${f.path}
145 | Content:
146 | \`\`\`${f.language}
147 | ${f.content.substring(0, 1500)}${f.content.length > 1500 ? '...' : ''}
148 | \`\`\`
149 | `).join('\n\n');
150 | 
151 |   const prompt = `You are a technical educator. Based on the following code repository "${repoName}", create a comprehensive quiz to test understanding of the codebase.
152 | 
153 | Repository Files:
154 | ${filesContext}
155 | 
156 | Generate 10 multiple-choice questions covering:
157 | - Code functionality and purpose
158 | - Architecture and design patterns
159 | - Key functions and their behavior
160 | - Best practices used in the code
161 | 
162 | Format as JSON array with this structure:
163 | [
164 |   {
165 |     "question": "Question text",
166 |     "options": ["Option A", "Option B", "Option C", "Option D"],
167 |     "correctAnswer": 0,
168 |     "explanation": "Why this is the correct answer"
169 |   }
170 | ]
171 | 
172 | Return ONLY the JSON array, no additional text.`;
173 | 
174 |   const text = await generateText(prompt);
175 |   
176 |   // Extract JSON from response
177 |   const jsonMatch = text.match(/\[[\s\S]*\]/);
178 |   if (jsonMatch) {
179 |     return JSON.parse(jsonMatch[0]);
180 |   }
181 |   
182 |   return [];
183 | }
184 | 
185 | export async function POST(request: NextRequest) {
186 |   try {
187 |     const body = await request.json();
188 |     const { url, generateDocs, generateUml, generateQuizData } = body;
189 | 
190 |     if (!url) {
191 |       return NextResponse.json(
192 |         { error: 'GitHub repository URL is required' },
193 |         { status: 400 }
194 |       );
195 |     }
196 | 
197 |     if (!process.env.GEMINI_API_KEY) {
198 |       return NextResponse.json(
199 |         { error: 'WATSON_API_KEY is not configured' },
200 |         { status: 500 }
201 |       );
202 |     }
203 | 
204 |     // Parse GitHub URL
205 |     const parsed = parseGitHubUrl(url);
206 |     if (!parsed) {
207 |       return NextResponse.json(
208 |         { error: 'Invalid GitHub repository URL' },
209 |         { status: 400 }
210 |       );
211 |     }
212 | 
213 |     const { owner, repo } = parsed;
214 | 
215 |     // Fetch repository info and code files
216 |     console.log('Fetching repository information...');
217 |     const repoInfo = await getRepositoryInfo(owner, repo);
218 |     
219 |     console.log('Fetching repository files...');
220 |     const files = await getAllCodeFiles(owner, repo);
221 | 
222 |     if (files.length === 0) {
223 |       return NextResponse.json(
224 |         { error: 'No code files found in repository' },
225 |         { status: 404 }
226 |       );
227 |     }
228 | 
229 |     console.log(`Found ${files.length} code files`);
230 | 
231 |     const result: any = {
232 |       repository: {
233 |         name: repoInfo.name,
234 |         full_name: repoInfo.full_name,
235 |         description: repoInfo.description,
236 |         html_url: repoInfo.html_url,
237 |       },
238 |       filesAnalyzed: files.length,
239 |     };
240 | 
241 |     // Generate documentation if requested
242 |     if (generateDocs) {
243 |       console.log('Generating documentation...');
244 |       result.documentation = await generateDocumentation(files, repoInfo.full_name);
245 |     }
246 | 
247 |     // Generate UML if requested
248 |     if (generateUml) {
249 |       console.log('Generating UML diagrams...');
250 |       result.uml = await generateUML(files, repoInfo.full_name);
251 |     }
252 | 
253 |     // Generate quiz if requested
254 |     if (generateQuizData) {
255 |       console.log('Generating quiz...');
256 |       result.quiz = await generateQuiz(files, repoInfo.full_name);
257 |     }
258 | 
259 |     return NextResponse.json(result, { status: 200 });
260 | 
261 |   } catch (error) {
262 |     console.error('Error analyzing repository:', error);
263 |     
264 |     if (error instanceof Error) {
265 |       return NextResponse.json(
266 |         { error: 'Failed to analyze repository', details: error.message },
267 |         { status: 500 }
268 |       );
269 |     }
270 | 
271 |     return NextResponse.json(
272 |       { error: 'An unexpected error occurred' },
273 |       { status: 500 }
274 |     );
275 |   }
276 | }
277 | 
278 | // Made with Bob
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
test-context-optimization.js,app/utils/export.ts,app/api/analyze/route.ts,app/api/github/lib.ts,app/results/page.tsx,app/api/github/route.ts,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T11:35:25.820Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.01

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Now I can see the issue. The `generateUML` function (lines 70-138) is calling `JSON.parse(text)` directly on line 133, which fails when llama3 returns text before the JSON object. There's already a fallback on lines 134-137 that strips markdown code fences, but it doesn't handle the case where there's explanatory text before the JSON.

Let me implement a robust JSON extraction function and update the code:

<apply_diff>
<path>app/api/analyze/route.ts</path>
<diff>
<<<<<<< SEARCH
:start_line:68
-------
}

// Generate UML diagram using Gemini
async function generateUML(files: CodeFile[], repoName: string) {
=======
}

// Extract JSON from text that may contain non-JSON content
function extractJSON(text: string): any {
  // First, try to parse the text directly
  try {
    return JSON.parse(text);
  } catch {
    // If direct parsing fails, try to extract JSON
  }

  // Remove markdown code fences if present
  let cleaned = text.replace(/^```json\s*|```\s*$/g, '').trim();
  
  // Try parsing after removing code fences
  try {
    return JSON.parse(cleaned);
  } catch {
    // If still failing, extract JSON object or array
  }

  // Find the first occurrence of { or [
  const jsonStartMatch = cleaned.match(/[{\[]/);
  if (!jsonStartMatch) {
    throw new Error('No JSON object or array found in response');
  }

  const jsonStart = jsonStartMatch.index!;
  
  // Extract from the first { or [ to the end
  const potentialJson = cleaned.substring(jsonStart);
  
  // Try to find matching closing brace/bracket by parsing incrementally
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  let jsonEnd = -1;
  
  for (let i = 0; i < potentialJson.length; i++) {
    const char = potentialJson[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === '"') {
      inString = !inString;
      continue;
    }
    
    if (inString) continue;
    
    if (char === '{' || char === '[') {
      depth++;
    } else if (char === '}' || char === ']') {
      depth--;
      if (depth === 0) {
        jsonEnd = i + 1;
        break;
      }
    }
  }
  
  if (jsonEnd === -1) {
    // If we couldn't find a proper end, try parsing the whole thing
    try {
      return JSON.parse(potentialJson);
    } catch (e) {
      throw new Error(`Failed to extract valid JSON from response. Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }
  
  const extractedJson = potentialJson.substring(0, jsonEnd);
  
  try {
    return JSON.parse(extractedJson);
  } catch (e) {
    throw new Error(`Extracted JSON is invalid. Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

// Generate UML diagram using Gemini
async function generateUML(files: CodeFile[], repoName: string) {
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'app/api/analyze/route.ts'] Result:
<file_write_result>
<path>app/api/analyze/route.ts</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<notice>Making multiple related changes in a single apply_diff is more efficient. If other changes are needed in this file, please include them as additional SEARCH/REPLACE blocks.</notice>
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
test-context-optimization.js,app/utils/export.ts,app/api/github/lib.ts,app/results/page.tsx,app/api/analyze/route.ts,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Recently Modified Files
These files have been modified since you last accessed them (file was just edited so you may need to re-read it before editing):
app/api/analyze/route.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T11:35:44.328Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.03

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Now I need to update the `generateUML` function to use the new `extractJSON` function instead of the direct `JSON.parse` calls:

<apply_diff>
<path>app/api/analyze/route.ts</path>
<diff>
<<<<<<< SEARCH
:start_line:213
-------
  const text = await generateText(prompt);
  try {
    return JSON.parse(text);
  } catch {
    const stripped = text.replace(/^```json\s*|```\s*$/g, '').trim();
    return JSON.parse(stripped);
  }
}
=======
  const text = await generateText(prompt);
  return extractJSON(text);
}
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'app/api/analyze/route.ts'] Result:
<file_write_result>
<path>app/api/analyze/route.ts</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<notice>Making multiple related changes in a single apply_diff is more efficient. If other changes are needed in this file, please include them as additional SEARCH/REPLACE blocks.</notice>
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
test-context-optimization.js,app/utils/export.ts,app/api/github/lib.ts,app/results/page.tsx,app/api/analyze/route.ts,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T11:35:51.504Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.05

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

Now let me also update the `generateQuiz` function to use the same robust JSON extraction, as it also parses JSON responses and could face similar issues:

<apply_diff>
<path>app/api/analyze/route.ts</path>
<diff>
<<<<<<< SEARCH
:start_line:253
-------
  const text = await generateText(prompt);
  
  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  return [];
}
=======
  const text = await generateText(prompt);
  
  try {
    return extractJSON(text);
  } catch (error) {
    console.error('Failed to extract quiz JSON:', error);
    // Return empty array as fallback
    return [];
  }
}
>>>>>>> REPLACE
</diff>
</apply_diff>

---

**User:**

[apply_diff for 'app/api/analyze/route.ts'] Result:
<file_write_result>
<path>app/api/analyze/route.ts</path>
<operation>modified</operation>
<notice>
<i>You do not need to re-read the file, as you have seen all changes</i>
<i>Proceed with the task using these changes as the new baseline.</i>
</notice>
</file_write_result>

<notice>Making multiple related changes in a single apply_diff is more efficient. If other changes are needed in this file, please include them as additional SEARCH/REPLACE blocks.</notice>
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
test-context-optimization.js,app/utils/export.ts,app/api/github/lib.ts,app/results/page.tsx,app/api/analyze/route.ts,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Recently Modified Files
These files have been modified since you last accessed them (file was just edited so you may need to re-read it before editing):
app/api/analyze/route.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T11:35:58.214Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.08

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**
- .bobignore
- .env

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

<attempt_completion>
<result>
**Fixed JSON parsing error in the analyze API**

**File Modified:**
- `app/api/analyze/route.ts`

**Changes Made:**

1. **Added `extractJSON()` function** (lines 71-153):
   - Implements robust JSON extraction that handles various response formats from llama3
   - First attempts direct JSON.parse()
   - Strips markdown code fences (```json...```) if present
   - Extracts JSON by finding the first `{` or `[` character and parsing from there
   - Uses depth tracking to find the matching closing brace/bracket
   - Handles escaped characters and strings properly
   - Provides detailed error messages if extraction fails

2. **Updated `generateUML()` function** (lines 213-215):
   - Replaced the try-catch block with direct call to `extractJSON(text)`
   - Removed redundant code fence stripping logic (now handled by extractJSON)

3. **Updated `generateQuiz()` function** (lines 253-260):
   - Replaced regex-based JSON extraction with `extractJSON(text)`
   - Added try-catch with error logging for better debugging
   - Returns empty array as fallback if extraction fails

**How the Solution Works:**

The `extractJSON()` function handles non-JSON text in responses by:
- Attempting direct parsing first (for clean responses)
- Stripping markdown code fences if present
- Finding the first JSON delimiter (`{` or `[`) and extracting from that point
- Properly tracking nested braces/brackets while respecting string boundaries
- Providing clear error messages indicating what went wrong

This fix ensures that responses like "Here is the JSON: {...}" will be parsed correctly by extracting only the JSON portion.
</result>
</attempt_completion>

