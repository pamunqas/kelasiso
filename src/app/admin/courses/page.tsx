import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import UserNav from '@/components/UserNav';

async function getCourses() {
  return await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      modules: {
        include: { lessons: true },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });
}

export default async function AdminCoursesPage() {
  const session = await auth();
  
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin" className="text-blue-600 hover:underline">
                ← Kembali ke Admin
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Kelola Kursus</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/courses/new" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah Kursus
              </Link>
              <UserNav userName={session.user.name || ''} currentPage="admin" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const totalLessons = course.modules.reduce(
              (acc, mod) => acc + mod.lessons.length, 0
            );
            
            return (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">ISO</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      course.isPublished ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>{course.modules.length} Modul</span>
                    <span>{totalLessons} Pelajaran</span>
                    <span>{course._count.enrollments} Siswa</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      href={`/admin/courses/${course.id}`}
                      className="flex-1 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                    <Link 
                      href={`/admin/courses/${course.id}/delete`}
                      className="flex-1 py-2 bg-red-100 text-red-600 text-center rounded-lg hover:bg-red-200"
                    >
                      Hapus
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          
          {courses.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Belum ada kursus. Klik "Tambah Kursus" untuk membuat yang pertama.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}