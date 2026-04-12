import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import EnrollButton from './EnrollButton';
import CertificateButton from '@/components/CertificateButton';
import UserNav from '@/components/UserNav';

async function getCourse(slug: string) {
  return await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: {
              quiz: true,
            },
          },
        },
      },
    },
  });
}

async function getEnrollment(userId: string, courseId: string) {
  return await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
}

async function getCertificate(userId: string, courseId: string) {
  return await prisma.certificate.findFirst({
    where: {
      userId,
      courseId,
    },
  });
}

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();
  const course = await getCourse(params.slug);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Kursus tidak ditemukan
          </h1>
          <Link href="/courses" className="text-blue-600 hover:underline">
            Kembali ke kursus
          </Link>
        </div>
      </div>
    );
  }

  let enrollment = null;
  let hasCertificate = false;
  if (session?.user?.id) {
    enrollment = await getEnrollment(session.user.id, course.id);
    const cert = await getCertificate(session.user.id, course.id);
    hasCertificate = !!cert;
  }

  const totalLessons = course.modules.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Detail Kursus</h1>
            <UserNav userName={session?.user?.name || ''} currentPage="courses" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            {/* Course Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white mb-6">
              <h2 className="text-4xl font-bold mb-4">
                {course.title}
              </h2>
              <p className="text-blue-100 text-lg mb-6">{course.description}</p>
              
              <div className="flex gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4.125-3.127a.993.993 0 00.488-.814zM9.843 3.503a1 1 0 011.414 0l4.125 3.127a.999.999 0 01.257.356L16.467 8.05a1 1 0 00.488.814l-7 3a1 1 0 01-1.788 0l-4.125-3.127a1 1 0 00-.257-.356L9.843 3.503z"/>
                  </svg>
                  <span>{course.modules.length} Modul</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                  </svg>
                  <span>{totalLessons} Pelajaran</span>
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h3 className="text-xl font-bold text-gray-900">
                  Kurikulum Kursus
                </h3>
              </div>
              <div className="divide-y">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="hover:bg-blue-50 transition-colors">
                    {/* Module Header */}
                    <div className="px-6 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {moduleIndex + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {module.title}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {module.lessons.length} pelajaran
                        </span>
                      </div>
                      {module.lessons.some(l => l.quiz) && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          + Quiz
                        </span>
                      )}
                    </div>
                    
                    {/* Lessons */}
                    <div className="bg-gray-50 px-6 py-2 pb-4">
                      <div className="space-y-2 ml-14">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 text-sm"
                          >
                            <span className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-xs">
                              {lessonIndex + 1}
                            </span>
                            <span className="text-gray-700">{lesson.title}</span>
                            {lesson.type === 'VIDEO' && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                                Video
                              </span>
                            )}
                            {lesson.type === 'TEXT' && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded">
                                Teks
                              </span>
                            )}
                            {lesson.quiz && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded">
                                Kuis
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enrollment Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              {enrollment ? (
                <div>
                  <div className="text-center mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {Math.round(enrollment.progress)}% selesai
                    </p>
                  </div>
                  {hasCertificate ? (
                    <CertificateButton courseId={course.id} hasCertificate={hasCertificate} />
                  ) : enrollment && enrollment.progress >= 100 ? (
                    <CertificateButton courseId={course.id} hasCertificate={hasCertificate} />
                  ) : course.modules[0]?.lessons[0] && (
                    <Link
                      href={`/courses/${course.slug}/learn/${course.modules[0].lessons[0].id}`}
                      className="block w-full py-3 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Lanjutkan Belajar
                    </Link>
                  )}
                </div>
              ) : session ? (
                <EnrollButton course={course} />
              ) : (
                <Link
                  href="/login"
                  className="block w-full py-3 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Masuk untuk Mendaftar
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}