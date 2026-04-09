import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import UserNav from '@/components/UserNav';

async function getCourses() {
  return await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      modules: {
        include: {
          lessons: true,
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function CoursesPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Kursus</h1>
            <UserNav userName={session.user.name || ''} currentPage="courses" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Kursus ISO 27001
        </h2>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Belum ada kursus yang tersedia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const lessonCount = course.modules.reduce(
                (acc, mod) => acc + mod.lessons.length,
                0
              );
              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      ISO
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{lessonCount} lessons</span>
                      <span>{course._count.enrollments} enrolled</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}