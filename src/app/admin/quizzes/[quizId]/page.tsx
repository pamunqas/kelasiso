'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import UserNav from '@/components/UserNav';

interface Question {
  id?: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetch(`/api/admin/quizzes/${quizId}`)
      .then(res => res.json())
      .then(data => {
        if (data.quiz) {
          setQuizTitle(data.quiz.title);
          setCourseTitle(data.quiz.lesson?.module?.course?.title || '');
          setQuestions(data.quiz.questions?.map((q: any) => ({
            text: q.text,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
            correctAnswer: q.correctAnswer,
          })) || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [quizId]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    if (field === 'options') {
      updated[index][field] = value;
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    const newOptions = [...updated[qIndex].options];
    newOptions[oIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options: newOptions };
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Validate
    for (const q of questions) {
      if (!q.text || q.options.some(o => !o) || !q.correctAnswer) {
        setError('Semua pertanyaan harus memiliki teks, 4 opsi, dan jawaban benar');
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions }),
      });

      const data = await res.json();
      
      if (res.ok) {
        router.push('/admin/courses');
      } else {
        setError(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin/courses" className="text-blue-600 hover:underline">
                ← Kembali ke Kursus
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                Edit Kuis: {quizTitle}
              </h1>
              <p className="text-gray-600 text-sm">{courseTitle}</p>
            </div>
            <UserNav userName="Admin" currentPage="admin" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Pertanyaan Kuis ({questions.length})</h2>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                + Tambah Pertanyaan
              </button>
            </div>

            {questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Belum ada pertanyaan. Klik "Tambah Pertanyaan" untuk menambahkan.
              </p>
            ) : (
              <div className="space-y-6">
                {questions.map((q, qIdx) => (
                  <div key={qIdx} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-medium">Pertanyaan {qIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teks Pertanyaan
                      </label>
                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Masukkan teks pertanyaan..."
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opsi Jawaban
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={q.correctAnswer === opt}
                              onChange={() => handleQuestionChange(qIdx, 'correctAnswer', opt)}
                              className="w-4 h-4 text-green-600"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder={`Opsi ${oIdx + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Pilih tombol radio di samping jawaban yang benar
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <Link
              href="/admin/courses"
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
            >
              Batal
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
