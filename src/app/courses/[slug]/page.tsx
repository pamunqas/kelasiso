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
    if (enrollment && enrollment.progress >= 100) {
      const cert = await getCertificate(session.user.id, course.id);
      hasCertificate = !!cert;
    }
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
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h2>
              <p className="text-gray-600 mb-6">{course.description}</p>
              
              <div className="flex gap-4 text-sm text-gray-500 mb-6">
                <span>{course.modules.length} Modul</span>
                <span>{totalLessons} Pelajaran</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Kurikulum
              </h3>
              <div className="space-y-4">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h4 className="font-semibold text-gray-900">
                        Modul {moduleIndex + 1}: {module.title}
                      </h4>
                    </div>
                    <div className="divide-y">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="px-4 py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-sm">
                              {lessonIndex + 1}.
                            </span>
                            <span className="text-gray-700">{lesson.title}</span>
                            {lesson.type === 'VIDEO' && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                                Video
                              </span>
                            )}
                            {lesson.type === 'TEXT' && (
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                                Teks
                              </span>
                            )}
                            {lesson.quiz && (
                              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
                                Kuis
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
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
                  {enrollment.progress >= 100 ? (
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