'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import UserNav from '@/components/UserNav';
import TiptapEditor from '@/components/TiptapEditor';

interface Lesson {
  id: string;
  title: string;
  type: string;
  content: string;
  videoUrl: string;
  order: number;
}

export default function EditLessonPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;
  const moduleId = params.moduleId;
  const lessonId = params.lessonId;
  const isNew = lessonId === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    type: 'TEXT',
    content: '',
    videoUrl: '',
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)
        .then(res => res.json())
        .then(data => {
          if (data.lesson) {
            setFormData({
              title: data.lesson.title || '',
              type: data.lesson.type || 'TEXT',
              content: data.lesson.content || '',
              videoUrl: data.lesson.videoUrl || '',
            });
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [courseId, moduleId, lessonId, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isNew 
        ? `/api/admin/courses/${courseId}/modules/${moduleId}/lessons`
        : `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`;
      
      const httpMethod = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method: httpMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (res.ok) {
        router.push(`/admin/courses/${courseId}`);
      } else {
        setError(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Terjadi kesalahan: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Hapus pelajaran ini?')) return;
    
    try {
      const url = `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`;
      const res = await fetch(url, { method: 'DELETE' });
      
      if (res.ok) {
        router.push(`/admin/courses/${courseId}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal hapus');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
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
              <Link href={`/admin/courses/${courseId}`} className="text-blue-600 hover:underline">
                ← Kembali ke Kursus
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                {isNew ? 'Tambah Pelajaran' : 'Edit Pelajaran'}
              </h1>
            </div>
            <UserNav userName="Admin" currentPage="admin" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Pelajaran
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Konten
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="TEXT">Teks</option>
              <option value="VIDEO">Video</option>
              <option value="QUIZ">Quiz</option>
            </select>
          </div>
          
          {formData.type === 'VIDEO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Video
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konten
            </label>
            <TiptapEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <Link
              href={`/admin/courses/${courseId}`}
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