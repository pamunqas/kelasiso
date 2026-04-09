'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CompleteButtonProps {
  lessonId: string;
  isCompleted: boolean;
  hasQuiz: boolean;
  quizPassed: boolean;
}

export default function CompleteButton({ 
  lessonId, 
  isCompleted, 
  hasQuiz, 
  quizPassed 
}: CompleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);

  const canComplete = !hasQuiz || (hasQuiz && quizPassed);

  const handleComplete = async () => {
    if (!canComplete || completed) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/lesson-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lessonId, 
          completed: true 
        }),
      });

      if (res.ok) {
        setCompleted(true);
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <button
        disabled
        className="px-6 py-3 font-semibold rounded-lg bg-green-100 text-green-700"
      >
        ✓ Selesai
      </button>
    );
  }

  if (!canComplete) {
    return (
      <button
        disabled
        className="px-6 py-3 font-semibold rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
        title={hasQuiz ? "Selesaikan kuis dengan nilai minimal 70% terlebih dahulu" : ""}
      >
        Tandai Selesai
      </button>
    );
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="px-6 py-3 font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400"
    >
      {loading ? 'Memuat...' : 'Tandai Selesai'}
    </button>
  );
}