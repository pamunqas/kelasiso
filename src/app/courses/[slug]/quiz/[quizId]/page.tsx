'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export default function QuizPage({
  params,
}: {
  params: { slug: string; quizId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  let returnUrl = searchParams.get('return') || `/courses/${params.slug}`;
  
  // Extract just the path without query params for validation
  const pathOnly = returnUrl.split('?')[0];
  
  // Validate returnUrl - must include /learn/lessonId
  if (!pathOnly.includes('/learn/')) {
    returnUrl = `/courses/${params.slug}`;
  }
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch(`/api/quiz/${params.quizId}`)
      .then(res => res.json())
      .then(data => {
        if (data.questions) {
          setQuestions(data.questions.map((q: any) => ({
            ...q,
            options: JSON.parse(q.options),
          })));
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load quiz');
        setLoading(false);
      });
  }, [params.quizId]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const scorePercent = (correct / questions.length) * 100;
    setScore(scorePercent);
    setSubmitted(true);

    // Save attempt
    await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId: params.quizId,
        answers,
        score: scorePercent,
      }),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Memuat kuis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Link href={`/courses/${params.slug}`} className="text-blue-600 hover:underline mt-4 block">
            Kembali ke kursus
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <Link href={returnUrl} className="text-blue-600 hover:underline">
            ← Kembali ke pelajaran
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Kuis</h1>

          {submitted ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-6xl mb-4">
                {score >= 70 ? '🎉' : '📚'}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Skor Anda: {Math.round(score)}%
              </h2>
              <p className="text-gray-600 mb-6">
                {score >= 70
                  ? 'Selamat! Anda lulus kuis ini.'
                  : 'Silakan coba lagi untuk memahami materi lebih baik.'}
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setAnswers({});
                    setSubmitted(false);
                    setScore(0);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Coba Lagi
                </button>
                <Link
                  href={returnUrl}
                  className="block mt-4 text-blue-600 hover:underline"
                >
                  Kembali ke pelajaran
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, idx) => (
                <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {idx + 1}. {question.text}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => (
                      <label
                        key={optIdx}
                        className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                          answers[question.id] === option
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={() => handleAnswer(question.id, option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit Jawaban
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}