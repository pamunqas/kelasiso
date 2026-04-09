import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import UserNav from '@/components/UserNav';

async function getUserWithDetails(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      enrollments: {
        include: {
          course: {
            include: {
              modules: {
                include: { lessons: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      certificates: {
        include: { course: true },
        orderBy: { issuedAt: 'desc' },
      },
    },
  });
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const user = await getUserWithDetails(params.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User tidak ditemukan</h1>
          <Link href="/admin/users" className="text-blue-600 hover:underline">
            Kembali ke Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin/users" className="text-blue-600 hover:underline">
                ← Kembali ke Users
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Detail User</h1>
            </div>
            <UserNav userName={session.user.name || ''} currentPage="admin" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nama</p>
              <p className="font-semibold text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <span className={`px-2 py-1 text-xs rounded ${
                user.role === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {user.role}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tanggal Daftar</p>
              <p className="font-semibold text-gray-900">
                {user.createdAt.toLocaleDateString('id-ID')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Kursus</p>
              <p className="font-semibold text-gray-900">{user.enrollments.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sertifikat</p>
              <p className="font-semibold text-gray-900">{user.certificates.length}</p>
            </div>
          </div>
        </div>

        {/* Enrollments */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Kursus yang Diikuti</h2>
          
          {user.enrollments.length === 0 ? (
            <p className="text-gray-500">Belum mengikuti kursus apapun</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Kursus</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Progress</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Mulai</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Selesai</th>
                  </tr>
                </thead>
                <tbody>
                  {user.enrollments.map((enrollment) => {
                    const totalLessons = enrollment.course.modules.reduce(
                      (acc, mod) => acc + mod.lessons.length, 0
                    );
                    
                    return (
                      <tr key={enrollment.id} className="border-t">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{enrollment.course.title}</div>
                          <div className="text-sm text-gray-500">
                            {enrollment.course.modules.length} modul, {totalLessons} pelajaran
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{Math.round(enrollment.progress)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {enrollment.completedAt ? (
                            <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-600">
                              Selesai
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-600">
                              Berlangsung
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {enrollment.createdAt.toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {enrollment.completedAt 
                            ? enrollment.completedAt.toLocaleDateString('id-ID')
                            : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sertifikat</h2>
          
          {user.certificates.length === 0 ? (
            <p className="text-gray-500">Belum memiliki sertifikat</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.certificates.map((cert) => (
                <div key={cert.id} className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="font-semibold text-gray-900">{cert.course.title}</p>
                      <p className="text-sm text-gray-500">{cert.issuedAt.toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">No: {cert.certificateNumber}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}