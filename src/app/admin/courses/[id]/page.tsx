'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import UserNav from '@/components/UserNav';

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: { id: string; title: string; order: number; quiz?: { id: string } }[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: string;
  framework: string;
  isPublished: boolean;
  modules: Module[];
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [course, setCourse] = useState<Course | null>(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');

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

  const handleSaveCourse = async (field: string, value: string | boolean) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      
      if (res.ok) {
        setCourse((prev: any) => prev ? { ...prev, [field]: value } : null);
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newModuleTitle }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setCourse((prev: any) => prev ? { 
          ...prev, 
          modules: [...prev.modules, data.module] 
        } : null);
        setNewModuleTitle('');
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal tambah modul');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Hapus modul dan semua pelajarannya?')) return;
    
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setCourse((prev: any) => prev ? { 
          ...prev, 
          modules: prev.modules.filter((m: any) => m.id !== moduleId) 
        } : null);
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal hapus modul');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm('Hapus pelajaran ini?')) return;
    
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setCourse((prev: any) => {
          if (!prev) return null;
          return {
            ...prev,
            modules: prev.modules.map((m: any) => {
              if (m.id === moduleId) {
                return {
                  ...m,
                  lessons: m.lessons.filter((l: any) => l.id !== lessonId)
                };
              }
              return m;
            })
          };
        });
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal hapus pelajaran');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    }
  };

  const handleUpdateModuleTitle = async (moduleId: string, newTitle: string) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Gagal update modul');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
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
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Kursus</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Status:</span>
                <button
                  onClick={() => handleSaveCourse('isPublished', !course.isPublished)}
                  className={`px-3 py-1 rounded ${course.isPublished ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  {course.isPublished ? 'Published' : 'Draft'}
                </button>
              </div>
              <UserNav userName="Admin" currentPage="admin" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>
        )}
        
        {/* Course Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Info Kursus</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <input
                type="text"
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                onBlur={(e) => handleSaveCourse('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                value={course.description}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                onBlur={(e) => handleSaveCourse('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Framework</label>
                <select
                  value={course.framework || 'ISO'}
                  onChange={(e) => {
                    setCourse({ ...course, framework: e.target.value, category: '' });
                    handleSaveCourse('framework', e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="ISO">ISO</option>
                  <option value="NIST">NIST</option>
                  <option value="CIS">CIS</option>
                  <option value="LAINNYA">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={course.category || ''}
                  onChange={(e) => {
                    setCourse({ ...course, category: e.target.value });
                    handleSaveCourse('category', e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="ISO27001">ISO 27001</option>
                  <option value="ISO27002">ISO 27002</option>
                  <option value="ISO27005">ISO 27005</option>
                  <option value="ISO27701">ISO 27701</option>
                  <option value="ISO9001">ISO 9001</option>
                  <option value="ISO14001">ISO 14001</option>
                  <option value="ISO45001">ISO 45001</option>
                  <option value="ISO22301">ISO 22301</option>
                  <option value="ISO31000">ISO 31000</option>
                  <option value="NIST80053">NIST 800-53</option>
                  <option value="NISTCSF">NIST Cybersecurity Framework</option>
                  <option value="CISControls">CIS Controls</option>
                  <option value="GDPR">GDPR</option>
                  <option value="PCIDSS">PCI-DSS</option>
                  <option value="SOC2">SOC 2</option>
                  <option value="LAINNYA">Lainnya</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Modul & Pelajaran</h2>
          
          <div className="space-y-4 mb-6">
            {course.modules.map((module, idx) => (
              <div key={module.id} className="border rounded-lg">
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">Modul {idx + 1}</span>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => {
                        const updated = [...course.modules];
                        updated[idx].title = e.target.value;
                        setCourse({ ...course, modules: updated });
                      }}
                      onBlur={(e) => handleUpdateModuleTitle(module.id, e.target.value)}
                      className="font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteModule(module.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Hapus
                  </button>
                </div>
                
                <div className="px-4 py-2">
                  {module.lessons.length === 0 ? (
                    <p className="text-gray-500 text-sm py-2">Belum ada pelajaran</p>
                  ) : (
                    <ul className="space-y-2">
                      {module.lessons.map((lesson, lIdx) => (
                        <li key={lesson.id} className="flex items-center justify-between text-sm">
                          <span>{lIdx + 1}. {lesson.title} {lesson.quiz && <span className="text-purple-600 text-xs ml-1">(Kuis)</span>}</span>
                          <div className="flex gap-2">
                            <Link 
                              href={`/admin/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </Link>
                            {lesson.quiz && (
                              <Link 
                                href={`/admin/quizzes/${lesson.quiz.id}`}
                                className="text-purple-600 hover:underline"
                              >
                                Edit Kuis
                              </Link>
                            )}
                            <button 
                              onClick={() => handleDeleteLesson(module.id, lesson.id)}
                              className="text-red-600 hover:underline"
                            >
                              Hapus
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link 
                    href={`/admin/courses/${courseId}/modules/${module.id}/lessons/new`}
                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                  >
                    + Tambah Pelajaran
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Module */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="Judul modul baru..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAddModule}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tambah Modul
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}