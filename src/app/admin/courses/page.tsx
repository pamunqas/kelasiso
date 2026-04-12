'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  isPublished: boolean;
  modules: { id: string; title: string; lessons: { id: string }[] }[];
  _count: { enrollments: number };
}

interface Framework {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

const getAdminFrameworks = (courses: Course[]): Framework[] => {
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

const categoryInfo: Record<string, { name: string; description: string }> = {
  'iso27001': { 
    name: 'ISO 27001', 
    description: 'Sistem Manajemen Keamanan Informasi (SMKI)' 
  },
  'iso9001': { 
    name: 'ISO 9001', 
    description: 'Sistem Manajemen Mutu (SMM)' 
  },
  'iso27002': { 
    name: 'ISO 27002', 
    description: 'Sistem Manajemen Keamanan Informasi - Pedoman Teknis' 
  },
};

export default function AdminCoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  const selectedFramework = searchParams.get('framework');

  useEffect(() => {
    fetch('/api/admin/courses')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          router.push('/');
        } else if (data.courses) {
          setCourses(data.courses);
          fetch('/api/me')
            .then(res => res.json())
            .then(userData => {
              setUserName(userData.user?.name || 'Admin');
            });
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

  const coursesByFramework = courses.reduce((acc, course) => {
    const fw = course.category || course.framework || 'other';
    if (!acc[fw]) acc[fw] = [];
    acc[fw].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const fwCourses = selectedFramework 
    ? coursesByFramework[selectedFramework.toUpperCase()] || []
    : [];

  const allFrameworks = getAdminFrameworks(courses);
  const currentFramework = allFrameworks.find(f => f.slug === selectedFramework);
  const cat = selectedFramework 
    ? categoryInfo[selectedFramework.toLowerCase()] || getFrameworkConfig(selectedFramework)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin" className="text-blue-600 hover:underline">
                ← Kembali ke Admin
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                {selectedFramework ? `Kelola Kursus - ${currentFramework?.name}` : 'Kelola Kursus'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/courses/new" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Kursus
              </Link>
              <UserNav userName={userName} currentPage="admin" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!selectedFramework ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pilih Framework</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allFrameworks.filter(fw => coursesByFramework[fw.slug.toUpperCase()]?.length > 0).map((fw) => {
                const fwCoursesList = coursesByFramework[fw.slug.toUpperCase()] || [];
                const totalModules = fwCoursesList.reduce((acc, c) => acc + c.modules.length, 0);
                const totalLessons = fwCoursesList.reduce(
                  (acc, c) => acc + c.modules.reduce((a, m) => a + m.lessons.length, 0),
                  0
                );
                
                return (
                  <Link
                    key={fw.id}
                    href={`/admin/courses?framework=${fw.slug}`}
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
                        {fwCoursesList.length} Kursus
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
          </>
        ) : (
          <>
            <Link 
              href="/admin/courses" 
              className="text-blue-600 hover:underline text-sm mb-4 inline-block"
            >
              ← Kembali ke Kursus
            </Link>

            <div className={`bg-gradient-to-r ${currentFramework?.color || 'from-blue-600 to-indigo-700'} rounded-xl p-8 text-white mb-8`}>
              <h2 className="text-3xl font-bold mb-2">{cat?.name}</h2>
              <p className="text-blue-100 mb-4">{cat?.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {fwCourses.length} Kursus
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {fwCourses.reduce((a, c) => a + c.modules.length, 0)} Modul
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  {fwCourses.reduce((acc, c) => acc + c.modules.reduce((a, m) => a + m.lessons.length, 0), 0)} Pelajaran
                </span>
              </div>
            </div>

            {fwCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Tidak ada kursus untuk framework ini.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {fwCourses.map((course, index) => {
                  const totalLessons = course.modules.reduce(
                    (acc, mod) => acc + mod.lessons.length, 0
                  );
                  
                  return (
                    <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </span>
                              <h3 className="text-xl font-bold text-gray-900">
                                {course.title}
                              </h3>
                              <span className={`px-2 py-1 text-xs rounded ${
                                course.isPublished ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {course.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4">{course.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {course.modules.slice(0, 5).map((mod) => (
                                <span 
                                  key={mod.id} 
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                  {mod.title.replace(/Module \d+\.\d+: /, '')}
                                </span>
                              ))}
                              {course.modules.length > 5 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  +{course.modules.length - 5} modul
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                {course.modules.length} Modul
                              </span>
                              <span className="flex items-center gap-1">
                                {totalLessons} Pelajaran
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Link
                              href={`/admin/courses/${course.id}`}
                              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/admin/courses/${course.id}/delete`}
                              className="px-6 py-3 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 transition-colors whitespace-nowrap"
                            >
                              Hapus
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!selectedFramework && courses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Tidak ada kursus. Silakan tambah kursus baru.
          </div>
        )}
      </main>
    </div>
  );
}