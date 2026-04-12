'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getFrameworkConfig } from '@/lib/framework-colors';
import UserNav from '@/components/UserNav';

interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: string;
  framework: string;
  order: number;
  modules: { lessons: { id: string }[] }[];
  _count: { enrollments: number };
}

interface Framework {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

const getFrameworks = (courses: Course[]): Framework[] => {
  const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];
  return categories.map(cat => {
    const config = getFrameworkConfig(cat);
    return {
      id: cat.toLowerCase(),
      name: config.name,
      slug: cat.toLowerCase(),
      description: config.description,
      color: config.banner
    };
  });
};

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (!data.role) {
          router.push('/login');
        } else {
          setUserName(data.name || '');
          return fetch('/api/courses');
        }
      })
      .then(res => res?.json())
      .then(data => {
        if (data?.courses) {
          setCourses(data.courses);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Memuat...</p>
      </div>
    );
  }

  // Group courses by category
  const coursesByFramework = courses.reduce((acc, course) => {
    const fw = course.category || course.framework || 'other';
    if (!acc[fw]) acc[fw] = [];
    acc[fw].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const frameworks = getFrameworks(courses);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-3">
              <img src="/logo.svg" alt="kelasISO Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-gray-900">Kursus</h1>
            </Link>
            <UserNav userName={userName} currentPage="courses" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pilih Framework</h2>
          
          {/* Framework Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frameworks.filter(fw => coursesByFramework[fw.slug.toUpperCase()]?.length > 0).map((fw) => {
              const fwCourses = coursesByFramework[fw.slug.toUpperCase()] || [];
              const totalModules = fwCourses.reduce((acc, c) => acc + c.modules.length, 0);
              const totalLessons = fwCourses.reduce(
                (acc, c) => acc + c.modules.reduce((a, m) => a + m.lessons.length, 0),
                0
              );
              
              return (
                <Link
                  key={fw.id}
                  href={`/frameworks/${fw.slug}`}
                  className={`bg-gradient-to-r ${fw.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">{fw.name}</h3>
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-blue-100 mb-4">{fw.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                      {fwCourses.length} Kursus
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                      {totalModules} Modul
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">
                      {totalLessons} Pelajaran
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}