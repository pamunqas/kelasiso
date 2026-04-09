'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
  id: string;
  slug: string;
  modules: {
    lessons: { id: string }[];
  }[];
}

export default function EnrollButton({ course }: { course: Course }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (res.ok) {
        router.refresh();
        const firstLesson = course.modules[0]?.lessons[0];
        if (firstLesson) {
          router.push(`/courses/${course.slug}/learn/${firstLesson.id}`);
        } else {
          router.push(`/courses/${course.slug}`);
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
    >
      {loading ? 'Memuat...' : 'Daftar Kursus'}
    </button>
  );
}