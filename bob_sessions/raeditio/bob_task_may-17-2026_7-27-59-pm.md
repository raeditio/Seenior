**User:**

<task>
Fix the UML diagram generation to ensure proper Mermaid syntax with diagram type keywords.

**Problem:**
The Watson AI model is generating class definitions without the required `classDiagram` keyword at the start. Mermaid cannot render diagrams without the proper diagram type declaration.

**Current Output:**
```
class GitHubRepo {
  owner: string
  repo: string
}
```

**Required Output:**
```
classDiagram
class GitHubRepo {
  owner: string
  repo: string
}
```

**Solution:**

Update the `generateUML()` function in `app/api/analyze/route.ts` to:

1. **Add explicit diagram type validation and correction:**
   - Check if `classDiagram` starts with "classDiagram"
   - Check if `sequenceDiagram` starts with "sequenceDiagram"
   - Check if `componentDiagram` starts with "graph" or "flowchart"
   - Check if `stateDiagram` starts with "stateDiagram" or "stateDiagram-v2"
   - Check if `erDiagram` starts with "erDiagram"

2. **Auto-prepend missing keywords:**
   - If a diagram is missing its type keyword, prepend it automatically
   - Log a warning when this happens

3. **Implementation:**

Add this helper function before `generateUML()`:
```typescript
function ensureDiagramType(diagram: string, type: 'class' | 'sequence' | 'component' | 'state' | 'er'): string {
  if (!diagram || diagram.trim() === '') return diagram;
  
  const trimmed = diagram.trim();
  const keywords = {
    class: 'classDiagram',
    sequence: 'sequenceDiagram',
    component: 'graph TD',
    state: 'stateDiagram-v2',
    er: 'erDiagram'
  };
  
  const keyword = keywords[type];
  const startsWithKeyword = type === 'component' 
    ? trimmed.startsWith('graph') || trimmed.startsWith('flowchart')
    : trimmed.startsWith(keyword);
  
  if (!startsWithKeyword) {
    console.warn(`${type} diagram missing type keyword, prepending "${keyword}"`);
    return `${keyword}\n${trimmed}`;
  }
  
  return diagram;
}
```

Then in `generateUML()`, after parsing the JSON, add:
```typescript
const parsed = JSON.parse(jsonMatch[0]);

// Ensure all diagrams have proper type keywords
if (parsed.classDiagram) {
  parsed.classDiagram = ensureDiagramType(parsed.classDiagram, 'class');
}
if (parsed.sequenceDiagram) {
  parsed.sequenceDiagram = ensureDiagramType(parsed.sequenceDiagram, 'sequence');
}
if (parsed.componentDiagram) {
  parsed.componentDiagram = ensureDiagramType(parsed.componentDiagram, 'component');
}
if (parsed.stateDiagram) {
  parsed.stateDiagram = ensureDiagramType(parsed.stateDiagram, 'state');
}
if (parsed.erDiagram) {
  parsed.erDiagram = ensureDiagramType(parsed.erDiagram, 'er');
}

return parsed;
```

4. **Update the prompt to be more explicit:**
Add to the prompt: "CRITICAL: Each diagram MUST start with its type keyword on the first line (classDiagram, sequenceDiagram, etc.)"

This will ensure all diagrams render correctly in Mermaid.
</task>
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,app/api/analyze/route.ts,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:26:56.633Z
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

I'll help you fix the UML diagram generation to ensure proper Mermaid syntax. Let me start by reading the current implementation of the analyze route.

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
<content lines="1-439">
  1 | import { WatsonXAI } from '@ibm-cloud/watsonx-ai';
  2 | import { IamAuthenticator } from 'ibm-cloud-sdk-core';
  3 | import { NextRequest, NextResponse } from 'next/server';
  4 | import {
  5 |   getAllCodeFiles,
  6 |   getRepositoryInfo,
  7 |   parseGitHubUrl,
  8 |   buildOptimizedContext,
  9 |   type CodeFile
 10 | } from '../github/lib';
 11 | 
 12 | const MODEL_ID = 'meta-llama/llama-3-3-70b-instruct';
 13 | 
 14 | // Initialize Watson AI client with authentication
 15 | function getWatsonAIService() {
 16 |   const apiKey = process.env.WATSONAI_API_KEY || '';
 17 |   const projectId = process.env.WATSONX_PROJECT_ID || '';
 18 |   
 19 |   const authenticator = new IamAuthenticator({
 20 |     apikey: apiKey,
 21 |   });
 22 | 
 23 |   return WatsonXAI.newInstance({
 24 |     version: '2024-05-31',
 25 |     authenticator,
 26 |     serviceUrl: 'https://us-south.ml.cloud.ibm.com',
 27 |   });
 28 | }
 29 | 
 30 | // Generate documentation using Watson AI
 31 | async function generateDocumentation(files: CodeFile[], repoName: string) {
 32 |   // Use optimized context builder with 80k token budget
 33 |   const filesContext = buildOptimizedContext(files, 80000);
 34 | 
 35 |   const prompt = `You are a technical documentation expert. Analyze the following code repository "${repoName}" and generate comprehensive documentation.
 36 | 
 37 | Repository Files:
 38 | ${filesContext}
 39 | 
 40 | Please provide:
 41 | 1. **Project Overview**: What does this project do? What problem does it solve?
 42 | 2. **Architecture**: Describe the overall architecture and design patterns used
 43 | 3. **Key Components**: List and explain the main components/modules. Include their function calls
 44 | 4. **Technologies Used**: List the programming languages, frameworks, and libraries
 45 | 5. **Setup Instructions**: How to set up and run the project
 46 | 6. **API/Functions**: Document key functions, classes, or APIs
 47 | 7. **Code Examples**: Show how to use the main features
 48 | 
 49 | Format the response in clean Markdown with proper headings, code blocks, and lists.`;
 50 | 
 51 |   const watsonxAIService = getWatsonAIService();
 52 |   const projectId = process.env.WATSONX_PROJECT_ID || '';
 53 | 
 54 |   const textGenParams = {
 55 |     input: prompt,
 56 |     modelId: MODEL_ID,
 57 |     projectId: projectId,
 58 |     parameters: {
 59 |       max_new_tokens: 4096,
 60 |       temperature: 0,
 61 |     },
 62 |   };
 63 | 
 64 |   const response = await watsonxAIService.generateText(textGenParams);
 65 |   return response.result.results[0].generated_text;
 66 | }
 67 | 
 68 | // Generate UML diagram using Watson AI
 69 | async function generateUML(files: CodeFile[], repoName: string) {
 70 |   // Use optimized context builder with 80k token budget
 71 |   const filesContext = buildOptimizedContext(files, 80000);
 72 | 
 73 |   const prompt = `You are a software architecture expert. Analyze the code repository "${repoName}".
 74 | 
 75 | Return a single JSON object with exactly these seven keys:
 76 | 
 77 | {
 78 |   "classDiagram": "<valid Mermaid classDiagram string>",
 79 |   "sequenceDiagram": "<valid Mermaid sequenceDiagram string>",
 80 |   "componentDiagram": "<valid Mermaid component diagram string or empty string>",
 81 |   "stateDiagram": "<valid Mermaid stateDiagram-v2 string or empty string>",
 82 |   "erDiagram": "<valid Mermaid erDiagram string or empty string>",
 83 |   "descriptions": {
 84 |     "<NodeOrActorName>": "<one sentence plain-English description>"
 85 |   },
 86 |   "categories": {
 87 |     "<NodeOrActorName>": "<page|route|external|internal|actor>"
 88 |   }
 89 | }
 90 | 
 91 | Rules for the CLASS DIAGRAM:
 92 | - Include AT MOST 7 of the most architecturally important classes/modules. Skip utility helpers, config files, and anything not central to the main data flow.
 93 | - Show AT MOST 2-3 members per class — only the most important ones.
 94 | - Show AT MOST 5 relationships total. Prefer composition (-->) over inheritance. Drop trivial or obvious relationships.
 95 | - Do NOT show every file in the repo — be selective. A focused diagram with 5 nodes is better than a cluttered one with 15.
 96 | 
 97 | Rules for the SEQUENCE DIAGRAM:
 98 | - Show AT MOST 5 actors. Each actor name must be UNIQUE — never declare the same participant twice.
 99 | - Show only the primary happy-path request flow — skip error handling, retries, and edge cases.
100 | - Keep it to AT MOST 10 messages total.
101 | 
102 | Rules for the COMPONENT DIAGRAM:
103 | - Show system boundaries and external services (APIs, databases, cloud services)
104 | - Include main application components: frontend, backend, database, external APIs
105 | - Show deployment architecture if detectable from config files (Docker, Kubernetes, etc.)
106 | - Use Mermaid C4 component diagram syntax or standard component diagram syntax
107 | - Max 8 components total — focus on high-level architecture only
108 | - If the codebase is too simple (single file, no clear architecture), return empty string ""
109 | 
110 | Rules for the STATE DIAGRAM:
111 | - Identify state machines in the code: enums with state values, state management patterns, workflow logic, lifecycle management
112 | - Show primary state transitions only — skip trivial or obvious transitions
113 | - Max 6 states total — focus on the most important state machine
114 | - Use Mermaid stateDiagram-v2 syntax
115 | - If no clear state machine exists in the codebase, return empty string ""
116 | - Look for: Redux/Zustand state, React component lifecycle, authentication states, order/workflow states, connection states
117 | 
118 | Rules for the ER DIAGRAM:
119 | - Detect database models: Prisma schema, TypeORM entities, Sequelize models, Django models, SQL schema files, MongoDB schemas
120 | - Show entity relationships: one-to-many (||--o{), many-to-many (}o--o{), one-to-one (||--||)
121 | - Max 7 entities — focus on core data model only
122 | - Use Mermaid erDiagram syntax
123 | - If no database schema or ORM models detected, return empty string ""
124 | - Include key attributes for each entity (primary keys, foreign keys, important fields)
125 | 
126 | Rules for all diagrams:
127 | - Use valid Mermaid v11 syntax only.
128 | - In classDiagram: use ONLY the keyword "class", never "interface", "enum", or "abstract class".
129 | - Actor and class names must be plain alphanumeric — no parentheses, colons, angle brackets, or special characters.
130 | - Member types must be simple words only (string, number, boolean) — no arrays like string[], no generics, no union types.
131 | - Do not include markdown fences inside the JSON strings — just the raw diagram text starting with the diagram type keyword.
132 | - For componentDiagram, stateDiagram, and erDiagram: return empty string "" if that aspect is not present in the codebase.
133 | 
134 | Rules for "descriptions":
135 | - Must include one entry for every class in the classDiagram and every actor in the sequenceDiagram.
136 | - ALSO include entries for up to 8 additional important utility functions, helper modules, or key interfaces that appear in the codebase but are not nodes in the diagrams (e.g. parseGitHubUrl, getRepositoryInfo, generateDocumentation). These give onboarding engineers the detail they need.
137 | - Each description is one plain-English sentence.
138 | 
139 | Rules for "categories":
140 | - Must include one entry for every name in "descriptions".
141 | - Use exactly one of these five values: page, route, external, internal, actor.
142 |   - page: frontend React pages/components and client-side entry points
143 |   - route: Next.js API routes and server-side request handlers
144 |   - external: third-party APIs and services (GitHub, Gemini, Octokit, etc.)
145 |   - internal: internal utilities, helper modules, and library functions
146 |   - actor: human users, browsers, or generic client actors in sequence diagrams
147 | 
148 | Repository Files:
149 | ${filesContext}
150 | 
151 | Return ONLY the JSON object, no additional text or markdown formatting.`;
152 | 
153 |   const watsonxAIService = getWatsonAIService();
154 |   const projectId = process.env.WATSONX_PROJECT_ID || '';
155 | 
156 |   const textGenParams = {
157 |     input: prompt,
158 |     modelId: MODEL_ID,
159 |     projectId: projectId,
160 |     parameters: {
161 |       max_new_tokens: 4096,
162 |       temperature: 0,
163 |     },
164 |   };
165 | 
166 |   const response = await watsonxAIService.generateText(textGenParams);
167 |   const text = response.result.results[0].generated_text;
168 |   
169 |   // Try multiple parsing strategies
170 |   try {
171 |     // Strategy 1: Direct parse
172 |     return JSON.parse(text);
173 |   } catch (e1) {
174 |     try {
175 |       // Strategy 2: Strip markdown code fences (multiline aware)
176 |       const stripped = text
177 |         .replace(/^```(?:json)?\s*/m, '')  // Remove opening fence
178 |         .replace(/```\s*$/m, '')            // Remove closing fence
179 |         .trim();
180 |       return JSON.parse(stripped);
181 |     } catch (e2) {
182 |       try {
183 |         // Strategy 3: Extract JSON object from anywhere in text
184 |         const jsonMatch = text.match(/\{[\s\S]*\}/);
185 |         if (jsonMatch) {
186 |           return JSON.parse(jsonMatch[0]);
187 |         }
188 |         throw new Error('No JSON object found in response');
189 |       } catch (e3) {
190 |         // Log the actual response for debugging
191 |         console.error('Failed to parse UML JSON. Raw response:', text.substring(0, 500));
192 |         throw new Error(`Failed to parse UML JSON: ${e3 instanceof Error ? e3.message : 'Unknown error'}`);
193 |       }
194 |     }
195 |   }
196 | }
197 | 
198 | // Generate quiz using Watson AI
199 | async function generateQuiz(files: CodeFile[], repoName: string) {
200 |   // Use optimized context builder with 80k token budget
201 |   const filesContext = buildOptimizedContext(files, 80000);
202 | 
203 |   const prompt = `You are a technical educator. Based on the following code repository "${repoName}", create a comprehensive quiz to test understanding of the codebase.
204 | 
205 | Repository Files:
206 | ${filesContext}
207 | 
208 | Generate 10 multiple-choice questions covering:
209 | - Code functionality and purpose
210 | - Architecture and design patterns
211 | - Key functions and their behavior
212 | - Best practices used in the code
213 | 
214 | Format as JSON array with this structure:
215 | [
216 |   {
217 |     "question": "Question text",
218 |     "options": ["Option A", "Option B", "Option C", "Option D"],
219 |     "correctAnswer": 0,
220 |     "explanation": "Why this is the correct answer"
221 |   }
222 | ]
223 | 
224 | Return ONLY the JSON array, no additional text.`;
225 | 
226 |   const watsonxAIService = getWatsonAIService();
227 |   const projectId = process.env.WATSONX_PROJECT_ID || '';
228 | 
229 |   const textGenParams = {
230 |     input: prompt,
231 |     modelId: MODEL_ID,
232 |     projectId: projectId,
233 |     parameters: {
234 |       max_new_tokens: 4096,
235 |       temperature: 0,
236 |     },
237 |   };
238 | 
239 |   const response = await watsonxAIService.generateText(textGenParams);
240 |   const text = response.result.results[0].generated_text;
241 |   
242 |   // Extract JSON from response
243 |   const jsonMatch = text.match(/\[[\s\S]*\]/);
244 |   if (jsonMatch) {
245 |     return JSON.parse(jsonMatch[0]);
246 |   }
247 |   
248 |   return [];
249 | }
250 | 
251 | export async function POST(request: NextRequest) {
252 |   try {
253 |     const body = await request.json();
254 |     const { url, generateDocs, generateUml, generateQuizData } = body;
255 | 
256 |     if (!url) {
257 |       return NextResponse.json(
258 |         { error: 'GitHub repository URL is required' },
259 |         { status: 400 }
260 |       );
261 |     }
262 | 
263 |     if (!process.env.WATSONAI_API_KEY) {
264 |       return NextResponse.json(
265 |         { error: 'WATSONAI_API_KEY is not configured' },
266 |         { status: 500 }
267 |       );
268 |     }
269 | 
270 |     if (!process.env.WATSONX_PROJECT_ID) {
271 |       return NextResponse.json(
272 |         { error: 'WATSONX_PROJECT_ID is not configured' },
273 |         { status: 500 }
274 |       );
275 |     }
276 | 
277 |     // Parse GitHub URL
278 |     const parsed = parseGitHubUrl(url);
279 |     if (!parsed) {
280 |       return NextResponse.json(
281 |         { error: 'Invalid GitHub repository URL' },
282 |         { status: 400 }
283 |       );
284 |     }
285 | 
286 |     const { owner, repo } = parsed;
287 | 
288 |     // Fetch repository info and code files
289 |     console.log('Fetching repository information...');
290 |     const repoInfo = await getRepositoryInfo(owner, repo);
291 |     
292 |     console.log('Fetching repository files...');
293 |     const files = await getAllCodeFiles(owner, repo);
294 | 
295 |     if (files.length === 0) {
296 |       return NextResponse.json(
297 |         { error: 'No code files found in repository' },
298 |         { status: 404 }
299 |       );
300 |     }
301 | 
302 |     console.log(`Found ${files.length} code files`);
303 | 
304 |     const result: any = {
305 |       repository: {
306 |         name: repoInfo.name,
307 |         full_name: repoInfo.full_name,
308 |         description: repoInfo.description,
309 |         html_url: repoInfo.html_url,
310 |       },
311 |       filesAnalyzed: files.length,
312 |     };
313 | 
314 |     // Parallel generation with Promise.allSettled for graceful error handling
315 |     const startTime = Date.now();
316 |     const promises: Promise<{ type: string; data: any }>[] = [];
317 | 
318 |     if (generateDocs) {
319 |       console.log('Starting documentation generation...');
320 |       const docStartTime = Date.now();
321 |       promises.push(
322 |         generateDocumentation(files, repoInfo.full_name)
323 |           .then(doc => {
324 |             const docTime = Date.now() - docStartTime;
325 |             console.log(`✓ Generated documentation in ${docTime}ms`);
326 |             return { type: 'documentation', data: doc };
327 |           })
328 |           .catch(error => {
329 |             const docTime = Date.now() - docStartTime;
330 |             console.error(`✗ Documentation generation failed after ${docTime}ms:`, error);
331 |             throw error;
332 |           })
333 |       );
334 |     }
335 | 
336 |     if (generateUml) {
337 |       console.log('Starting UML generation...');
338 |       const umlStartTime = Date.now();
339 |       promises.push(
340 |         generateUML(files, repoInfo.full_name)
341 |           .then(uml => {
342 |             const umlTime = Date.now() - umlStartTime;
343 |             console.log(`✓ Generated UML in ${umlTime}ms`);
344 |             return { type: 'uml', data: uml };
345 |           })
346 |           .catch(error => {
347 |             const umlTime = Date.now() - umlStartTime;
348 |             console.error(`✗ UML generation failed after ${umlTime}ms:`, error);
349 |             throw error;
350 |           })
351 |       );
352 |     }
353 | 
354 |     if (generateQuizData) {
355 |       console.log('Starting quiz generation...');
356 |       const quizStartTime = Date.now();
357 |       promises.push(
358 |         generateQuiz(files, repoInfo.full_name)
359 |           .then(quiz => {
360 |             const quizTime = Date.now() - quizStartTime;
361 |             console.log(`✓ Generated quiz in ${quizTime}ms`);
362 |             return { type: 'quiz', data: quiz };
363 |           })
364 |           .catch(error => {
365 |             const quizTime = Date.now() - quizStartTime;
366 |             console.error(`✗ Quiz generation failed after ${quizTime}ms:`, error);
367 |             throw error;
368 |           })
369 |       );
370 |     }
371 | 
372 |     // Wait for all promises to settle (succeed or fail)
373 |     const results = await Promise.allSettled(promises);
374 |     const totalTime = Date.now() - startTime;
375 | 
376 |     // Process results and collect errors
377 |     const errors: Record<string, string> = {};
378 |     let successCount = 0;
379 | 
380 |     results.forEach((settledResult, index) => {
381 |       if (settledResult.status === 'fulfilled') {
382 |         const { type, data } = settledResult.value;
383 |         result[type] = data;
384 |         successCount++;
385 |       } else {
386 |         // Determine which generation failed based on the order
387 |         const failedTypes = [];
388 |         if (generateDocs) failedTypes.push('documentation');
389 |         if (generateUml) failedTypes.push('uml');
390 |         if (generateQuizData) failedTypes.push('quiz');
391 |         
392 |         const failedType = failedTypes[index];
393 |         errors[failedType] = settledResult.reason?.message || 'Generation failed';
394 |         console.error(`Failed to generate ${failedType}:`, settledResult.reason);
395 |       }
396 |     });
397 | 
398 |     // Add errors to result if any occurred
399 |     if (Object.keys(errors).length > 0) {
400 |       result.errors = errors;
401 |     }
402 | 
403 |     // Log performance metrics
404 |     const requestedCount = promises.length;
405 |     console.log(`\n=== Performance Summary ===`);
406 |     console.log(`Total generation time: ${totalTime}ms`);
407 |     console.log(`Requested: ${requestedCount} generations`);
408 |     console.log(`Succeeded: ${successCount} generations`);
409 |     console.log(`Failed: ${requestedCount - successCount} generations`);
410 |     
411 |     // Estimate time saved by parallelization (assuming ~30s per generation sequentially)
412 |     if (requestedCount > 1) {
413 |       const estimatedSequentialTime = requestedCount * 30000; // 30s per generation
414 |       const timeSaved = estimatedSequentialTime - totalTime;
415 |       const percentImprovement = ((timeSaved / estimatedSequentialTime) * 100).toFixed(1);
416 |       console.log(`Estimated time saved: ${(timeSaved / 1000).toFixed(1)}s (${percentImprovement}% faster)`);
417 |     }
418 |     console.log(`===========================\n`);
419 | 
420 |     return NextResponse.json(result, { status: 200 });
421 | 
422 |   } catch (error) {
423 |     console.error('Error analyzing repository:', error);
424 |     
425 |     if (error instanceof Error) {
426 |       return NextResponse.json(
427 |         { error: 'Failed to analyze repository', details: error.message },
428 |         { status: 500 }
429 |       );
430 |     }
431 | 
432 |     return NextResponse.json(
433 |       { error: 'An unexpected error occurred' },
434 |       { status: 500 }
435 |     );
436 |   }
437 | }
438 | 
439 | // Made with Bob
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,app/api/analyze/route.ts,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:27:00.297Z
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

I'll fix the UML diagram generation to ensure proper Mermaid syntax with diagram type keywords. Let me implement the solution step by step.

<apply_diff>
<path>app/api/analyze/route.ts</path>
<diff>
<<<<<<< SEARCH
:start_line:68
-------
// Generate UML diagram using Watson AI
async function generateUML(files: CodeFile[], repoName: string) {
=======
// Helper function to ensure diagram has proper type keyword
function ensureDiagramType(diagram: string, type: 'class' | 'sequence' | 'component' | 'state' | 'er'): string {
  if (!diagram || diagram.trim() === '') return diagram;
  
  const trimmed = diagram.trim();
  const keywords = {
    class: 'classDiagram',
    sequence: 'sequenceDiagram',
    component: 'graph TD',
    state: 'stateDiagram-v2',
    er: 'erDiagram'
  };
  
  const keyword = keywords[type];
  const startsWithKeyword = type === 'component' 
    ? trimmed.startsWith('graph') || trimmed.startsWith('flowchart')
    : trimmed.startsWith(keyword);
  
  if (!startsWithKeyword) {
    console.warn(`${type} diagram missing type keyword, prepending "${keyword}"`);
    return `${keyword}\n${trimmed}`;
  }
  
  return diagram;
}

// Generate UML diagram using Watson AI
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
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,app/api/analyze/route.ts,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Recently Modified Files
These files have been modified since you last accessed them (file was just edited so you may need to re-read it before editing):
app/api/analyze/route.ts

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:27:09.980Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.04

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

Now I need to add the diagram type validation after parsing the JSON and update the prompt to be more explicit about the requirement. Let me continue with the changes.

<apply_diff>
<path>app/api/analyze/route.ts</path>
<diff>
<<<<<<< SEARCH
:start_line:125
-------
Rules for all diagrams:
- Use valid Mermaid v11 syntax only.
- In classDiagram: use ONLY the keyword "class", never "interface", "enum", or "abstract class".
- Actor and class names must be plain alphanumeric — no parentheses, colons, angle brackets, or special characters.
- Member types must be simple words only (string, number, boolean) — no arrays like string[], no generics, no union types.
- Do not include markdown fences inside the JSON strings — just the raw diagram text starting with the diagram type keyword.
- For componentDiagram, stateDiagram, and erDiagram: return empty string "" if that aspect is not present in the codebase.
=======
Rules for all diagrams:
- CRITICAL: Each diagram MUST start with its type keyword on the first line (classDiagram, sequenceDiagram, graph TD, stateDiagram-v2, or erDiagram)
- Use valid Mermaid v11 syntax only.
- In classDiagram: use ONLY the keyword "class", never "interface", "enum", or "abstract class".
- Actor and class names must be plain alphanumeric — no parentheses, colons, angle brackets, or special characters.
- Member types must be simple words only (string, number, boolean) — no arrays like string[], no generics, no union types.
- Do not include markdown fences inside the JSON strings — just the raw diagram text starting with the diagram type keyword.
- For componentDiagram, stateDiagram, and erDiagram: return empty string "" if that aspect is not present in the codebase.
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
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,app/api/analyze/route.ts,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:27:22.936Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.07

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

Now I need to add the validation logic after parsing the JSON to ensure all diagrams have proper type keywords.

<apply_diff>
<path>app/api/analyze/route.ts</path>
<diff>
<<<<<<< SEARCH
:start_line:206
-------
      try {
        // Strategy 3: Extract JSON object from anywhere in text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('No JSON object found in response');
      } catch (e3) {
        // Log the actual response for debugging
        console.error('Failed to parse UML JSON. Raw response:', text.substring(0, 500));
        throw new Error(`Failed to parse UML JSON: ${e3 instanceof Error ? e3.message : 'Unknown error'}`);
      }
=======
      try {
        // Strategy 3: Extract JSON object from anywhere in text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          
          // Ensure all diagrams have proper type keywords
          if (parsed.classDiagram) {
            parsed.classDiagram = ensureDiagramType(parsed.classDiagram, 'class');
          }
          if (parsed.sequenceDiagram) {
            parsed.sequenceDiagram = ensureDiagramType(parsed.sequenceDiagram, 'sequence');
          }
          if (parsed.componentDiagram) {
            parsed.componentDiagram = ensureDiagramType(parsed.componentDiagram, 'component');
          }
          if (parsed.stateDiagram) {
            parsed.stateDiagram = ensureDiagramType(parsed.stateDiagram, 'state');
          }
          if (parsed.erDiagram) {
            parsed.erDiagram = ensureDiagramType(parsed.erDiagram, 'er');
          }
          
          return parsed;
        }
        throw new Error('No JSON object found in response');
      } catch (e3) {
        // Log the actual response for debugging
        console.error('Failed to parse UML JSON. Raw response:', text.substring(0, 500));
        throw new Error(`Failed to parse UML JSON: ${e3 instanceof Error ? e3.message : 'Unknown error'}`);
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
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,app/api/analyze/route.ts,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:27:33.925Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.10

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

Now I need to apply the same validation to the other parsing strategies (Strategy 1 and Strategy 2) to ensure consistency across all parsing paths.

<apply_diff>
<path>app/api/analyze/route.ts</path>
<diff>
<<<<<<< SEARCH
:start_line:193
-------
  // Try multiple parsing strategies
  try {
    // Strategy 1: Direct parse
    return JSON.parse(text);
  } catch (e1) {
    try {
      // Strategy 2: Strip markdown code fences (multiline aware)
      const stripped = text
        .replace(/^```(?:json)?\s*/m, '')  // Remove opening fence
        .replace(/```\s*$/m, '')            // Remove closing fence
        .trim();
      return JSON.parse(stripped);
    } catch (e2) {
=======
  // Try multiple parsing strategies
  try {
    // Strategy 1: Direct parse
    const parsed = JSON.parse(text);
    
    // Ensure all diagrams have proper type keywords
    if (parsed.classDiagram) {
      parsed.classDiagram = ensureDiagramType(parsed.classDiagram, 'class');
    }
    if (parsed.sequenceDiagram) {
      parsed.sequenceDiagram = ensureDiagramType(parsed.sequenceDiagram, 'sequence');
    }
    if (parsed.componentDiagram) {
      parsed.componentDiagram = ensureDiagramType(parsed.componentDiagram, 'component');
    }
    if (parsed.stateDiagram) {
      parsed.stateDiagram = ensureDiagramType(parsed.stateDiagram, 'state');
    }
    if (parsed.erDiagram) {
      parsed.erDiagram = ensureDiagramType(parsed.erDiagram, 'er');
    }
    
    return parsed;
  } catch (e1) {
    try {
      // Strategy 2: Strip markdown code fences (multiline aware)
      const stripped = text
        .replace(/^```(?:json)?\s*/m, '')  // Remove opening fence
        .replace(/```\s*$/m, '')            // Remove closing fence
        .trim();
      const parsed = JSON.parse(stripped);
      
      // Ensure all diagrams have proper type keywords
      if (parsed.classDiagram) {
        parsed.classDiagram = ensureDiagramType(parsed.classDiagram, 'class');
      }
      if (parsed.sequenceDiagram) {
        parsed.sequenceDiagram = ensureDiagramType(parsed.sequenceDiagram, 'sequence');
      }
      if (parsed.componentDiagram) {
        parsed.componentDiagram = ensureDiagramType(parsed.componentDiagram, 'component');
      }
      if (parsed.stateDiagram) {
        parsed.stateDiagram = ensureDiagramType(parsed.stateDiagram, 'state');
      }
      if (parsed.erDiagram) {
        parsed.erDiagram = ensureDiagramType(parsed.erDiagram, 'er');
      }
      
      return parsed;
    } catch (e2) {
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
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,app/api/analyze/route.ts,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:27:45.043Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.14

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

Perfect! Now let me verify the changes by reading the updated file to ensure everything is correct.

<read_file>
<args>
<file>
<path>app/api/analyze/route.ts</path>
<line_range>68-260</line_range>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'app/api/analyze/route.ts'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>app/api/analyze/route.ts</path>
<content lines="68-260">
 68 | // Helper function to ensure diagram has proper type keyword
 69 | function ensureDiagramType(diagram: string, type: 'class' | 'sequence' | 'component' | 'state' | 'er'): string {
 70 |   if (!diagram || diagram.trim() === '') return diagram;
 71 |   
 72 |   const trimmed = diagram.trim();
 73 |   const keywords = {
 74 |     class: 'classDiagram',
 75 |     sequence: 'sequenceDiagram',
 76 |     component: 'graph TD',
 77 |     state: 'stateDiagram-v2',
 78 |     er: 'erDiagram'
 79 |   };
 80 |   
 81 |   const keyword = keywords[type];
 82 |   const startsWithKeyword = type === 'component'
 83 |     ? trimmed.startsWith('graph') || trimmed.startsWith('flowchart')
 84 |     : trimmed.startsWith(keyword);
 85 |   
 86 |   if (!startsWithKeyword) {
 87 |     console.warn(`${type} diagram missing type keyword, prepending "${keyword}"`);
 88 |     return `${keyword}\n${trimmed}`;
 89 |   }
 90 |   
 91 |   return diagram;
 92 | }
 93 | 
 94 | // Generate UML diagram using Watson AI
 95 | async function generateUML(files: CodeFile[], repoName: string) {
 96 |   // Use optimized context builder with 80k token budget
 97 |   const filesContext = buildOptimizedContext(files, 80000);
 98 | 
 99 |   const prompt = `You are a software architecture expert. Analyze the code repository "${repoName}".
100 | 
101 | Return a single JSON object with exactly these seven keys:
102 | 
103 | {
104 |   "classDiagram": "<valid Mermaid classDiagram string>",
105 |   "sequenceDiagram": "<valid Mermaid sequenceDiagram string>",
106 |   "componentDiagram": "<valid Mermaid component diagram string or empty string>",
107 |   "stateDiagram": "<valid Mermaid stateDiagram-v2 string or empty string>",
108 |   "erDiagram": "<valid Mermaid erDiagram string or empty string>",
109 |   "descriptions": {
110 |     "<NodeOrActorName>": "<one sentence plain-English description>"
111 |   },
112 |   "categories": {
113 |     "<NodeOrActorName>": "<page|route|external|internal|actor>"
114 |   }
115 | }
116 | 
117 | Rules for the CLASS DIAGRAM:
118 | - Include AT MOST 7 of the most architecturally important classes/modules. Skip utility helpers, config files, and anything not central to the main data flow.
119 | - Show AT MOST 2-3 members per class — only the most important ones.
120 | - Show AT MOST 5 relationships total. Prefer composition (-->) over inheritance. Drop trivial or obvious relationships.
121 | - Do NOT show every file in the repo — be selective. A focused diagram with 5 nodes is better than a cluttered one with 15.
122 | 
123 | Rules for the SEQUENCE DIAGRAM:
124 | - Show AT MOST 5 actors. Each actor name must be UNIQUE — never declare the same participant twice.
125 | - Show only the primary happy-path request flow — skip error handling, retries, and edge cases.
126 | - Keep it to AT MOST 10 messages total.
127 | 
128 | Rules for the COMPONENT DIAGRAM:
129 | - Show system boundaries and external services (APIs, databases, cloud services)
130 | - Include main application components: frontend, backend, database, external APIs
131 | - Show deployment architecture if detectable from config files (Docker, Kubernetes, etc.)
132 | - Use Mermaid C4 component diagram syntax or standard component diagram syntax
133 | - Max 8 components total — focus on high-level architecture only
134 | - If the codebase is too simple (single file, no clear architecture), return empty string ""
135 | 
136 | Rules for the STATE DIAGRAM:
137 | - Identify state machines in the code: enums with state values, state management patterns, workflow logic, lifecycle management
138 | - Show primary state transitions only — skip trivial or obvious transitions
139 | - Max 6 states total — focus on the most important state machine
140 | - Use Mermaid stateDiagram-v2 syntax
141 | - If no clear state machine exists in the codebase, return empty string ""
142 | - Look for: Redux/Zustand state, React component lifecycle, authentication states, order/workflow states, connection states
143 | 
144 | Rules for the ER DIAGRAM:
145 | - Detect database models: Prisma schema, TypeORM entities, Sequelize models, Django models, SQL schema files, MongoDB schemas
146 | - Show entity relationships: one-to-many (||--o{), many-to-many (}o--o{), one-to-one (||--||)
147 | - Max 7 entities — focus on core data model only
148 | - Use Mermaid erDiagram syntax
149 | - If no database schema or ORM models detected, return empty string ""
150 | - Include key attributes for each entity (primary keys, foreign keys, important fields)
151 | 
152 | Rules for all diagrams:
153 | - CRITICAL: Each diagram MUST start with its type keyword on the first line (classDiagram, sequenceDiagram, graph TD, stateDiagram-v2, or erDiagram)
154 | - Use valid Mermaid v11 syntax only.
155 | - In classDiagram: use ONLY the keyword "class", never "interface", "enum", or "abstract class".
156 | - Actor and class names must be plain alphanumeric — no parentheses, colons, angle brackets, or special characters.
157 | - Member types must be simple words only (string, number, boolean) — no arrays like string[], no generics, no union types.
158 | - Do not include markdown fences inside the JSON strings — just the raw diagram text starting with the diagram type keyword.
159 | - For componentDiagram, stateDiagram, and erDiagram: return empty string "" if that aspect is not present in the codebase.
160 | 
161 | Rules for "descriptions":
162 | - Must include one entry for every class in the classDiagram and every actor in the sequenceDiagram.
163 | - ALSO include entries for up to 8 additional important utility functions, helper modules, or key interfaces that appear in the codebase but are not nodes in the diagrams (e.g. parseGitHubUrl, getRepositoryInfo, generateDocumentation). These give onboarding engineers the detail they need.
164 | - Each description is one plain-English sentence.
165 | 
166 | Rules for "categories":
167 | - Must include one entry for every name in "descriptions".
168 | - Use exactly one of these five values: page, route, external, internal, actor.
169 |   - page: frontend React pages/components and client-side entry points
170 |   - route: Next.js API routes and server-side request handlers
171 |   - external: third-party APIs and services (GitHub, Gemini, Octokit, etc.)
172 |   - internal: internal utilities, helper modules, and library functions
173 |   - actor: human users, browsers, or generic client actors in sequence diagrams
174 | 
175 | Repository Files:
176 | ${filesContext}
177 | 
178 | Return ONLY the JSON object, no additional text or markdown formatting.`;
179 | 
180 |   const watsonxAIService = getWatsonAIService();
181 |   const projectId = process.env.WATSONX_PROJECT_ID || '';
182 | 
183 |   const textGenParams = {
184 |     input: prompt,
185 |     modelId: MODEL_ID,
186 |     projectId: projectId,
187 |     parameters: {
188 |       max_new_tokens: 4096,
189 |       temperature: 0,
190 |     },
191 |   };
192 | 
193 |   const response = await watsonxAIService.generateText(textGenParams);
194 |   const text = response.result.results[0].generated_text;
195 |   
196 |   // Try multiple parsing strategies
197 |   try {
198 |     // Strategy 1: Direct parse
199 |     const parsed = JSON.parse(text);
200 |     
201 |     // Ensure all diagrams have proper type keywords
202 |     if (parsed.classDiagram) {
203 |       parsed.classDiagram = ensureDiagramType(parsed.classDiagram, 'class');
204 |     }
205 |     if (parsed.sequenceDiagram) {
206 |       parsed.sequenceDiagram = ensureDiagramType(parsed.sequenceDiagram, 'sequence');
207 |     }
208 |     if (parsed.componentDiagram) {
209 |       parsed.componentDiagram = ensureDiagramType(parsed.componentDiagram, 'component');
210 |     }
211 |     if (parsed.stateDiagram) {
212 |       parsed.stateDiagram = ensureDiagramType(parsed.stateDiagram, 'state');
213 |     }
214 |     if (parsed.erDiagram) {
215 |       parsed.erDiagram = ensureDiagramType(parsed.erDiagram, 'er');
216 |     }
217 |     
218 |     return parsed;
219 |   } catch (e1) {
220 |     try {
221 |       // Strategy 2: Strip markdown code fences (multiline aware)
222 |       const stripped = text
223 |         .replace(/^```(?:json)?\s*/m, '')  // Remove opening fence
224 |         .replace(/```\s*$/m, '')            // Remove closing fence
225 |         .trim();
226 |       const parsed = JSON.parse(stripped);
227 |       
228 |       // Ensure all diagrams have proper type keywords
229 |       if (parsed.classDiagram) {
230 |         parsed.classDiagram = ensureDiagramType(parsed.classDiagram, 'class');
231 |       }
232 |       if (parsed.sequenceDiagram) {
233 |         parsed.sequenceDiagram = ensureDiagramType(parsed.sequenceDiagram, 'sequence');
234 |       }
235 |       if (parsed.componentDiagram) {
236 |         parsed.componentDiagram = ensureDiagramType(parsed.componentDiagram, 'component');
237 |       }
238 |       if (parsed.stateDiagram) {
239 |         parsed.stateDiagram = ensureDiagramType(parsed.stateDiagram, 'state');
240 |       }
241 |       if (parsed.erDiagram) {
242 |         parsed.erDiagram = ensureDiagramType(parsed.erDiagram, 'er');
243 |       }
244 |       
245 |       return parsed;
246 |     } catch (e2) {
247 |       try {
248 |         // Strategy 3: Extract JSON object from anywhere in text
249 |         const jsonMatch = text.match(/\{[\s\S]*\}/);
250 |         if (jsonMatch) {
251 |           const parsed = JSON.parse(jsonMatch[0]);
252 |           
253 |           // Ensure all diagrams have proper type keywords
254 |           if (parsed.classDiagram) {
255 |             parsed.classDiagram = ensureDiagramType(parsed.classDiagram, 'class');
256 |           }
257 |           if (parsed.sequenceDiagram) {
258 |             parsed.sequenceDiagram = ensureDiagramType(parsed.sequenceDiagram, 'sequence');
259 |           }
260 |           if (parsed.componentDiagram) {
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
app\api\analyze\route.ts

# VSCode Open Tabs
app/api/github/lib.ts,test-context-optimization.js,app/utils/export.ts,app/results/page.tsx,app/api/analyze/route.ts,.env.example,.env,API_DOCUMENTATION.md,MIGRATION_SUMMARY.md

# Current Time
Current time in ISO 8601 UTC format: 2026-05-17T10:27:49.213Z
User time zone: Asia/Seoul, UTC+9:00

# Current Cost
$0.17

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
Successfully fixed the UML diagram generation to ensure proper Mermaid syntax with diagram type keywords.

## Changes Made:

### 1. **Added `ensureDiagramType()` Helper Function** (lines 68-92)
   - Validates if diagrams start with the correct type keyword
   - Auto-prepends missing keywords:
     - `classDiagram` for class diagrams
     - `sequenceDiagram` for sequence diagrams
     - `graph TD` for component diagrams
     - `stateDiagram-v2` for state diagrams
     - `erDiagram` for ER diagrams
   - Logs warnings when keywords are missing
   - Handles special case for component diagrams (accepts `graph` or `flowchart`)

### 2. **Updated Prompt** (line 153)
   - Added CRITICAL instruction: "Each diagram MUST start with its type keyword on the first line (classDiagram, sequenceDiagram, graph TD, stateDiagram-v2, or erDiagram)"
   - This makes the requirement explicit to the Watson AI model

### 3. **Applied Validation to All Parsing Strategies** (lines 197-270)
   - **Strategy 1** (Direct parse): Added validation after JSON.parse()
   - **Strategy 2** (Strip markdown fences): Added validation after parsing stripped text
   - **Strategy 3** (Extract JSON): Added validation after extracting JSON object
   - All five diagram types are validated in each strategy

## How It Works:

1. **Prevention**: The updated prompt explicitly tells Watson AI to include diagram type keywords
2. **Detection**: The helper function checks if each diagram starts with its required keyword
3. **Correction**: If a keyword is missing, it's automatically prepended with a warning logged
4. **Consistency**: All three parsing strategies apply the same validation

## Result:

- **Before**: `class GitHubRepo { owner: string }`
- **After**: `classDiagram\nclass GitHubRepo { owner: string }`

All diagrams will now render correctly in Mermaid, even if Watson AI occasionally forgets to include the type keyword.
</result>
</attempt_completion>

