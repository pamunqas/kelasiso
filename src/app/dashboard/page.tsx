import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import { getFrameworkConfig } from '@/lib/framework-colors';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import UserNav from '@/components/UserNav';
import CertificateButton from '@/components/CertificateButton';
import PrintButton from '@/components/PrintButton';

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
            <Link href="/dashboard" className="flex items-center gap-3">
              <img src="/logo.svg" alt="kelasISO Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </Link>
            <UserNav userName={session.user.name || ''} currentPage="dashboard" />
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
                
                const fw = getFrameworkConfig(course.category?.toLowerCase() || 'iso27001');
                const courseColor = fw.card;
                
                return (
                  <div
                    key={enrollment.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className={`h-32 bg-gradient-to-r ${courseColor} flex items-center justify-center`}>
                      <span className="text-white text-3xl font-bold">{course.category || 'ISO'}</span>
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
                            className={`h-2 rounded-full ${fw.bgSolid}`}
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {enrollment.progress >= 100 ? (
                        <CertificateButton 
                          courseId={course.id} 
                          hasCertificate={certificates.some(c => c.courseId === course.id)} 
                        />
                      ) : firstLesson && (
                        <Link
                          href={`/courses/${course.slug}/learn/${firstLesson.id}`}
                          className={`block w-full py-2 text-white text-center font-semibold rounded-lg transition-colors ${fw.bgSolid} ${fw.hoverBg}`}
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
               {certificates.map((cert) => {
                 const config = getFrameworkConfig(cert.course.category);
                 return (
                   <div
                     key={cert.id}
                     className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${config.borderColor}`}
                   >
                     <div className={`${config.bgLight} p-6 text-center`}>
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
                       <PrintButton />
                     </div>
                   </div>
                 );
               })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}