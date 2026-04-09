import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import UserNav from '@/components/UserNav';

async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { enrollments: true },
      },
    },
  });
}

export default async function AdminUsersPage() {
  const session = await auth();
  
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const users = await getUsers();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin" className="text-blue-600 hover:underline">
                ← Kembali ke Admin
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Kelola Users</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/users/new" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Tambah User
              </Link>
              <UserNav userName={session.user.name || ''} currentPage="admin" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Nama</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Kursus</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Tanggal</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user._count.enrollments}</td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {user.createdAt.toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link 
                        href={`/admin/users/${user.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Detail
                      </Link>
                      {user.role !== 'ADMIN' && (
                        <Link 
                          href={`/admin/users/${user.id}/delete`}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Hapus
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}