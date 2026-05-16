'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [repoName, setRepoName] = useState('');

  useEffect(() => {
    const storedData = sessionStorage.getItem('analysisData');

    if (!storedData) {
      router.push('/');
      return;
    }

    const parsedData = JSON.parse(storedData);
    
    if (!parsedData.quiz || parsedData.quiz.length === 0) {
      router.push('/results');
      return;
    }

    setQuestions(parsedData.quiz);
    setAnsweredQuestions(new Array(parsedData.quiz.length).fill(false));
    setRepoName(parsedData.repository.name);
  }, [router]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions[currentQuestion]) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Array(questions.length).fill(false));
    setQuizComplete(false);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl">Loading quiz...</div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    let emoji = '';

    if (percentage >= 90) {
      message = 'Outstanding! You have excellent understanding of this codebase!';
      emoji = '🏆';
    } else if (percentage >= 70) {
      message = 'Great job! You have a solid grasp of the code!';
      emoji = '🎉';
    } else if (percentage >= 50) {
      message = 'Good effort! Review the documentation to improve your understanding.';
      emoji = '👍';
    } else {
      message = 'Keep learning! Review the documentation and try again.';
      emoji = '📚';
    }

    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{emoji}</div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Complete!
            </h1>
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {score}/{questions.length}
            </div>
            <div className="text-2xl text-gray-700 dark:text-gray-300 mb-2">
              {percentage}% Correct
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {message}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                🔄 Retake Quiz
              </button>
              <Link
                href="/results"
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-semibold text-center"
              >
                📚 Back to Documentation
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold text-center"
              >
                🏠 Analyze Another Repo
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = answeredQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <div className="bg-blue-600 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎯 {repoName} Quiz</h1>
          <Link href="/results" className="hover:underline">
            ← Back to Results
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>Score: {score}/{answeredQuestions.filter(a => a).length}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showResult = showExplanation;

              let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
              
              if (!showResult) {
                buttonClass += 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800';
              } else if (isCorrect) {
                buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900/20';
              } else if (isSelected && !isCorrect) {
                buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900/20';
              } else {
                buttonClass += 'border-gray-300 dark:border-gray-600 opacity-50';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      showResult && isCorrect
                        ? 'bg-green-500 text-white'
                        : showResult && isSelected && !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-gray-900 dark:text-white flex-1">{option}</span>
                    {showResult && isCorrect && <span className="text-2xl">✓</span>}
                    {showResult && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`mt-6 p-4 rounded-lg ${
              selectedAnswer === question.correctAnswer
                ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
            }`}>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
