import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getCertificates(userId: string) {
  return await prisma.certificate.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { issuedAt: 'desc' },
  });
}

export default async function CertificatesPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const certificates = await getCertificates(session.user.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Sertifikat</h1>
            <nav className="flex gap-4">
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                Dashboard
              </Link>
              <Link href="/courses" className="text-blue-600 hover:underline">
                Kursus
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {certificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">
              Anda belum memiliki sertifikat.
            </p>
            <p className="text-gray-500 mb-6">
              Selesaikan kursus untuk mendapatkan sertifikat.
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
                  <p className="text-sm text-gray-500 mt-2">
                    {cert.issuedAt.toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {cert.course.title}
                  </h4>
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
        )}
      </main>
    </div>
  );
}