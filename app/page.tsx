'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState('');
  const [documentation, setDocumentation] = useState(true);
  const [flowchart, setFlowchart] = useState(false);
  const [quiz, setQuiz] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    if (!documentation && !flowchart && !quiz) {
      setError('Please select at least one option');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: repoUrl,
          generateDocs: documentation,
          generateUml: flowchart,
          generateQuizData: quiz,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze repository');
      }

      // Store data in sessionStorage and navigate to results
      sessionStorage.setItem('analysisData', JSON.stringify(data));
      sessionStorage.setItem('selectedOptions', JSON.stringify({ documentation, flowchart, quiz }));
      router.push('/results');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-16 px-8 bg-white dark:bg-black">
        <Image
          className="dark:invert mb-12"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center w-full max-w-xl">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50">
            Paste your GitHub Repository Link Here
          </h1>
          
          <input
            className="rounded-md border-2 border-gray-300 dark:border-gray-600 px-4 py-3 w-full bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:border-blue-500"
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/user/repo"
            disabled={loading}
          />

          <div className="mt-2 flex flex-col items-start justify-center gap-3 w-full">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="w-4 h-4 cursor-pointer"
                type="checkbox"
                checked={documentation}
                onChange={(e) => setDocumentation(e.target.checked)}
                disabled={loading}
              />
              <span className="text-lg text-black dark:text-white">Documentation</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="w-4 h-4 cursor-pointer"
                type="checkbox"
                checked={flowchart}
                onChange={(e) => setFlowchart(e.target.checked)}
                disabled={loading}
              />
              <span className="text-lg text-black dark:text-white">UML/Flowchart</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="w-4 h-4 cursor-pointer"
                type="checkbox"
                checked={quiz}
                onChange={(e) => setQuiz(e.target.checked)}
                disabled={loading}
              />
              <span className="text-lg text-black dark:text-white">Quiz</span>
            </label>
          </div>

          {error && (
            <div className="w-full p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 px-8 py-3 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors w-full"
          >
            {loading ? 'Analyzing Repository...' : 'Generate'}
          </button>

          {loading && (
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p className="animate-pulse">This may take a minute or two...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
