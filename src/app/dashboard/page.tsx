import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getEnrollments(userId: string) {
  return await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: true },
          },
          _count: {
            select: { enrollments: true },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

async function getCertificates(userId: string) {
  return await prisma.certificate.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { issuedAt: 'desc' },
  });
}

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const enrollments = await getEnrollments(session.user.id);
  const certificates = await getCertificates(session.user.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <nav className="flex gap-4">
              <Link href="/courses" className="text-blue-600 hover:underline">
                Kursus
              </Link>
              <Link href="/certificates" className="text-blue-600 hover:underline">
                Sertifikat
              </Link>
              <span className="text-gray-600">{session.user.name}</span>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Enrolled Courses */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Kursus Saya
          </h2>
          
          {enrollments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">
                Anda belum terdaftar di kursus manapun.
              </p>
              <Link
                href="/courses"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lihat Kursus
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => {
                const course = enrollment.course;
                const totalLessons = course.modules.reduce(
                  (acc, mod) => acc + mod.lessons.length,
                  0
                );
                const firstLesson = course.modules[0]?.lessons[0];
                
                return (
                  <div
                    key={enrollment.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">ISO</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(enrollment.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {firstLesson && (
                        <Link
                          href={`/courses/${course.slug}/learn/${firstLesson.id}`}
                          className="block w-full py-2 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {enrollment.progress > 0 ? 'Lanjutkan' : 'Mulai Belajar'}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Certificates */}
        {certificates.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Sertifikat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-yellow-400"
                >
                  <div className="bg-yellow-50 p-6 text-center">
                    <div className="text-4xl mb-2">🏆</div>
                    <h3 className="font-bold text-gray-900">
                      Sertifikat Penyelesaian
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-2">{cert.course.title}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Nomor: {cert.certificateNumber}
                    </p>
                    <button
                      onClick={() => window.print()}
                      className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Cetak Sertifikat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}