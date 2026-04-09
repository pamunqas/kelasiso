import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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
  
  if (!enrollment) {
    redirect(`/courses/${params.slug}`);
  }

  const allLessons = await getAllLessons(course.id);
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  
  const lessonProgress = await getLessonProgress(session.user.id, lesson.id);
  const isCompleted = lessonProgress?.completed || false;

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
            <div className="text-sm text-gray-500">
              {currentIndex + 1} / {allLessons.length}
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
                  <Link
                    href={`/courses/${params.slug}/quiz/${lesson.quiz.id}`}
                    className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Ambil Kuis
                  </Link>
                </div>
              )}

              {/* Mark Complete Button */}
              <div className="mt-8 pt-6 border-t flex justify-between items-center">
                <form action="/api/lesson-progress" method="POST">
                  <input type="hidden" name="lessonId" value={lesson.id} />
                  <input type="hidden" name="completed" value={isCompleted ? 'false' : 'true'} />
                  <button
                    type="submit"
                    className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                      isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isCompleted ? '✓ Selesai' : 'Tandai Selesai'}
                  </button>
                </form>

                <div className="flex gap-4">
                  {prevLesson && (
                    <Link
                      href={`/courses/${params.slug}/learn/${prevLesson.id}`}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      ← Pelajaran Sebelumnya
                    </Link>
                  )}
                  {nextLesson && (
                    <Link
                      href={`/courses/${params.slug}/learn/${nextLesson.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Pelajaran Berikutnya →
                    </Link>
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