import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CompleteButton from './CompleteButton';
import CertificateButton from '@/components/CertificateButton';
import UserNav from '@/components/UserNav';

async function getLesson(lessonId: string) {
  return await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: true,
        },
      },
      quiz: {
        include: {
          questions: true,
        },
      },
    },
  });
}

async function getLessonProgress(userId: string, lessonId: string) {
  return await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  });
}

async function getQuizAttempts(userId: string, quizId: string) {
  return await prisma.quizAttempt.findMany({
    where: {
      userId,
      quizId,
    },
    orderBy: {
      attemptedAt: 'desc',
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

async function getAllLessons(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });
  
  if (!course) return [];
  
  return course.modules.flatMap(m => m.lessons);
}

export default async function LessonPage({
  params,
}: {
  params: { slug: string; lessonId: string };
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const lesson = await getLesson(params.lessonId);
  
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pelajaran tidak ditemukan
          </h1>
          <Link href="/courses" className="text-blue-600 hover:underline">
            Kembali ke kursus
          </Link>
        </div>
      </div>
    );
  }

  const course = lesson.module.course;
  const enrollment = await getEnrollment(session.user.id, course.id);
  const certificate = await getCertificate(session.user.id, course.id);
  const hasCertificate = !!certificate;
  
  if (!enrollment) {
    redirect(`/courses/${params.slug}`);
  }

  const allLessons = await getAllLessons(course.id);
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  
  const lessonProgress = await getLessonProgress(session.user.id, lesson.id);
  const isCompleted = lessonProgress?.completed || false;

  const hasQuiz = lesson.quiz ? true : false;
  let quizPassed = false;
  let hasTakenQuiz = false;
  let latestAttempt = null;
  
  if (lesson.quiz) {
    const quizAttempts = await getQuizAttempts(session.user.id, lesson.quiz.id);
    quizPassed = quizAttempts.some(a => a.score >= 70);
    hasTakenQuiz = quizAttempts.length > 0;
    latestAttempt = quizAttempts[0] || null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href={`/courses/${params.slug}`} className="text-blue-600 hover:underline">
                ← Kembali ke kursus
              </Link>
              <h1 className="text-xl font-bold text-gray-900 mt-1">
                {lesson.title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {currentIndex + 1} / {allLessons.length}
              </span>
              <UserNav userName={session.user.name || ''} currentPage="courses" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Video Content */}
              {lesson.type === 'VIDEO' && lesson.videoUrl && (
                <div className="mb-6">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={lesson.videoUrl}
                      title={lesson.title}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Text Content */}
              {lesson.type === 'TEXT' && lesson.content && (
                <div className="prose max-w-none mb-6">
                  <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                </div>
              )}

              {/* Quiz Section */}
              {lesson.quiz && (
                <div className="mt-8 border-t pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {lesson.quiz.title}
                  </h2>
                  
                  {!hasTakenQuiz ? (
                    <Link
                      href={`/courses/${params.slug}/quiz/${lesson.quiz.id}?return=/courses/${params.slug}/learn/${lesson.id}`}
                      className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Ambil Kuis
                    </Link>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Nilai Terakhir</p>
                            <p className={`text-2xl font-bold ${
                              latestAttempt && latestAttempt.score >= 70 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {latestAttempt?.score}%
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            latestAttempt && latestAttempt.score >= 70 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {latestAttempt && latestAttempt.score >= 70 ? 'Lulus' : 'Tidak Lulus'}
                          </div>
                        </div>
                      </div>
                      
                      {latestAttempt && latestAttempt.score < 70 && (
                        <Link
                          href={`/courses/${params.slug}/quiz/${lesson.quiz.id}`}
                          className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Ulangi Kuis
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Mark Complete Button */}
              <div className="mt-8 pt-6 border-t flex justify-between items-center">
                <CompleteButton 
                  lessonId={lesson.id} 
                  isCompleted={isCompleted}
                  hasQuiz={hasQuiz}
                  quizPassed={quizPassed}
                />

                <div className="flex gap-4">
                  {prevLesson && (
                    <Link
                      href={`/courses/${params.slug}/learn/${prevLesson.id}`}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      ← Pelajaran Sebelumnya
                    </Link>
                  )}
                  {nextLesson ? (
                    isCompleted ? (
                      <Link
                        href={`/courses/${params.slug}/learn/${nextLesson.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Pelajaran Berikutnya →
                      </Link>
                    ) : (
                      <span className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed">
                        Selesaikan pelajaran ini dulu
                      </span>
                    )
                  ) : (
                    isCompleted && (
                      <CertificateButton courseId={course.id} hasCertificate={hasCertificate} />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Daftar Pelajaran</h3>
              <div className="space-y-2">
                {allLessons.map((l, idx) => (
                  <Link
                    key={l.id}
                    href={`/courses/${params.slug}/learn/${l.id}`}
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      l.id === lesson.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {idx + 1}. {l.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}