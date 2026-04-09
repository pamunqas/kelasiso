'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import UserNav from '@/components/UserNav';

export default function DeleteCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [course, setCourse] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/courses/${courseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.course) {
          setCourse(data.course);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  const handleDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/admin/courses');
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal hapus kursus');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  }

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">Kursus tidak ditemukan</div>;
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
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Hapus Kursus</h1>
            </div>
            <UserNav userName="Admin" currentPage="admin" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Hapus Kursus?</h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus kursus <strong>"{course.title}"</strong>? 
              Semua modul, pelajaran, dan enrollments juga akan dihapus.
            </p>
            
            <div className="flex gap-3">
              <Link
                href="/admin/courses"
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
              >
                Batal
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-400"
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}