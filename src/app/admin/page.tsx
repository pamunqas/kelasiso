import { prisma } from '@/lib/prisma';
import { auth } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

async function getStats() {
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    completedEnrollments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.enrollment.count({
      where: { completedAt: { not: null } },
    }),
  ]);

  return { totalUsers, totalCourses, totalEnrollments, completedEnrollments };
}

async function getRecentUsers() {
  return await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}

export default async function AdminDashboard() {
  const session = await auth();
  
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const stats = await getStats();
  const recentUsers = await getRecentUsers();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <nav className="flex gap-4 items-center">
              <span className="text-gray-600">Halo, {session.user.name}</span>
              <LogoutButton />
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-gray-600">Total Users</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-600">{stats.totalCourses}</div>
            <div className="text-gray-600">Total Courses</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-purple-600">{stats.totalEnrollments}</div>
            <div className="text-gray-600">Enrollments</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.completedEnrollments}</div>
            <div className="text-gray-600">Completed</div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Nama</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2">{user.name}</td>
                    <td className="py-2 text-gray-600">{user.email}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions - Full Admin Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/users" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kelola Users</h3>
            <p className="text-gray-600 text-sm">Lihat, tambah, edit, hapus user</p>
          </Link>
          <Link href="/admin/courses" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kelola Kursus</h3>
            <p className="text-gray-600 text-sm">Lihat, tambah, edit kursus</p>
          </Link>
          <Link href="/admin/courses/new" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">➕</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tambah Kursus</h3>
            <p className="text-gray-600 text-sm">Buat kursus baru lengkap</p>
          </Link>
          <Link href="/dashboard" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🏠</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Dashboard</h3>
            <p className="text-gray-600 text-sm">Lihat tampilan student</p>
          </Link>
        </div>
      </main>
    </div>
  );
}