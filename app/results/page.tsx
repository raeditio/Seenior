'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AnalysisData {
  repository: {
    name: string;
    full_name: string;
    description: string;
    html_url: string;
  };
  filesAnalyzed: number;
  documentation?: string;
  uml?: string;
  quiz?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [selectedOptions, setSelectedOptions] = useState({ documentation: false, flowchart: false, quiz: false });
  const [activeTab, setActiveTab] = useState<'documentation' | 'uml'>('documentation');

  useEffect(() => {
    const storedData = sessionStorage.getItem('analysisData');
    const storedOptions = sessionStorage.getItem('selectedOptions');

    if (!storedData) {
      router.push('/');
      return;
    }

    const parsedData = JSON.parse(storedData);
    const parsedOptions = storedOptions ? JSON.parse(storedOptions) : { documentation: true, flowchart: false, quiz: false };
    
    setData(parsedData);
    setSelectedOptions(parsedOptions);

    // Set initial active tab based on what was generated
    if (parsedOptions.documentation) {
      setActiveTab('documentation');
    } else if (parsedOptions.flowchart) {
      setActiveTab('uml');
    }
  }, [router]);

  const handleDownloadPDF = () => {
    if (!data?.documentation) return;

    // Create a simple HTML document for PDF conversion
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${data.repository.name} - Documentation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1, h2, h3 { color: #333; }
            code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
            pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>${data.repository.full_name}</h1>
          <p>${data.repository.description}</p>
          <hr>
          ${data.documentation.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.repository.name}-documentation.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header with Quiz Link */}
      {selectedOptions.quiz && (
        <div className="bg-blue-600 text-white py-3 px-4 text-center">
          <Link href="/quiz" className="hover:underline font-semibold">
            🎯 Test your knowledge with the Quiz →
          </Link>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Repository Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            <a
              href={data.repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {data.repository.full_name}
            </a>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{data.repository.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>📁 {data.filesAnalyzed} files analyzed</span>
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              ← Analyze another repository
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {selectedOptions.documentation && (
              <button
                onClick={() => setActiveTab('documentation')}
                className={`flex-1 px-6 py-4 text-lg font-semibold transition-colors ${
                  activeTab === 'documentation'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                📚 Documentation
              </button>
            )}
            {selectedOptions.flowchart && (
              <button
                onClick={() => setActiveTab('uml')}
                className={`flex-1 px-6 py-4 text-lg font-semibold transition-colors ${
                  activeTab === 'uml'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                📊 UML/Flowchart
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'documentation' && data.documentation && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Documentation</h2>
                  <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    📥 Download as HTML
                  </button>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div
                    className="markdown-content"
                    dangerouslySetInnerHTML={{
                      __html: data.documentation
                        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>')
                        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">$1</code>')
                        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">$1</h3>')
                        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">$1</h2>')
                        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-5 text-gray-900 dark:text-white">$1</h1>')
                        .replace(/^\* (.*$)/gim, '<li class="ml-6 text-gray-700 dark:text-gray-300">$1</li>')
                        .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 text-gray-700 dark:text-gray-300">$1</li>')
                        .replace(/\n\n/g, '<br><br>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'uml' && data.uml && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">UML Diagrams & Architecture</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div
                    className="markdown-content"
                    dangerouslySetInnerHTML={{
                      __html: data.uml
                        .replace(/```mermaid\n([\s\S]*?)```/g, '<div class="mermaid-diagram bg-white dark:bg-gray-800 p-6 rounded-lg my-4 border border-gray-200 dark:border-gray-700"><pre class="text-sm">$1</pre><p class="text-xs text-gray-500 mt-2">Note: Mermaid diagram - copy to a Mermaid viewer to visualize</p></div>')
                        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>')
                        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">$1</code>')
                        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">$1</h3>')
                        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">$1</h2>')
                        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-5 text-gray-900 dark:text-white">$1</h1>')
                        .replace(/^\* (.*$)/gim, '<li class="ml-6 text-gray-700 dark:text-gray-300">$1</li>')
                        .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 text-gray-700 dark:text-gray-300">$1</li>')
                        .replace(/\n\n/g, '<br><br>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Quiz Link */}
        {selectedOptions.quiz && (
          <div className="mt-8 bg-blue-600 text-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to test your knowledge?</h3>
            <p className="mb-4">Take the quiz to see how well you understand this codebase!</p>
            <Link
              href="/quiz"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100 transition-colors"
            >
              Start Quiz →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Made with Bob
