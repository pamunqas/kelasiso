import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import { getFrameworkConfig, frameworkConfig } from '@/lib/framework-colors';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import UserNav from '@/components/UserNav';

interface PageProps {
  params: { category: string };
}

async function getCoursesByCategory(category: string) {
  return await prisma.course.findMany({
    where: { 
      category: category.toUpperCase(),
      isPublished: true 
    },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { order: 'asc' },
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const courses = await getCoursesByCategory(params.category);
  const cat = getFrameworkConfig(params.category.toLowerCase());

  const totalLessons = courses.reduce(
    (acc, c) => acc + c.modules.reduce((a, m) => a + m.lessons.length, 0),
    0
  );

  const bgClass = cat.bg;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgClass}`}>
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-3">
              <img src="/logo.svg" alt="kelasISO Logo" className="w-10 h-10" />
              <div>
                <Link href="/courses" className={`${cat.text} hover:underline text-sm`}>
                  ← Kembali ke Kursus
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">{cat.name}</h1>
              </div>
            </Link>
            <UserNav userName={session.user.name || ''} currentPage="courses" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className={`bg-gradient-to-r ${cat.banner} rounded-xl p-8 text-white mb-8`}>
          <h2 className="text-3xl font-bold mb-2">{cat.name}</h2>
          <p className="text-blue-100 mb-4">{cat.description}</p>
          <div className="flex gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {courses.length} Kursus
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {courses.reduce((a, c) => a + c.modules.length, 0)} Modul
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {totalLessons} Pelajaran
            </span>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Tidak ada kursus untuk category ini.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course, index) => (
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
                          {course.modules.reduce((a, m) => a + m.lessons.length, 0)} Pelajaran
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/courses/${course.slug}`}
                      className="ml-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Mulai Belajar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}