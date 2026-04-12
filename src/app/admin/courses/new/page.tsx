'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserNav from '@/components/UserNav';

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ISO27001',
    framework: 'ISO',
    isPublished: false,
  });

  const frameworks = [
    { value: 'ISO', label: 'ISO' },
    { value: 'NIST', label: 'NIST' },
    { value: 'CIS', label: 'CIS' },
    { value: 'LAINNYA', label: 'Lainnya' },
  ];

  const categoriesByFramework: Record<string, { value: string; label: string }[]> = {
    ISO: [
      { value: 'ISO27001', label: 'ISO 27001' },
      { value: 'ISO27002', label: 'ISO 27002' },
      { value: 'ISO27005', label: 'ISO 27005' },
      { value: 'ISO27701', label: 'ISO 27701' },
      { value: 'ISO17001', label: 'ISO 17001' },
      { value: 'ISO9001', label: 'ISO 9001' },
      { value: 'ISO14001', label: 'ISO 14001' },
      { value: 'ISO45001', label: 'ISO 45001' },
      { value: 'ISO22301', label: 'ISO 22301' },
      { value: 'ISO31000', label: 'ISO 31000' },
      { value: 'ISO27001', label: 'ISO 27001' },
    ],
    NIST: [
      { value: 'NIST80053', label: 'NIST 800-53' },
      { value: 'NISTCSF', label: 'NIST Cybersecurity Framework' },
      { value: 'NIST800171', label: 'NIST 800-171' },
    ],
    CIS: [
      { value: 'CISControls', label: 'CIS Controls' },
      { value: 'CISBenchmarks', label: 'CIS Benchmarks' },
    ],
    LAINNYA: [
      { value: 'GDPR', label: 'GDPR' },
      { value: 'PCIDSS', label: 'PCI-DSS' },
      { value: 'SOC2', label: 'SOC 2' },
      { value: 'HIPAA', label: 'HIPAA' },
      { value: 'LAINNYA', label: 'Lainnya' },
    ],
  };

  const availableCategories = categoriesByFramework[formData.framework] || categoriesByFramework['ISO'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/courses/${data.course.id}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin/courses" className="text-blue-600 hover:underline">
                ← Kembali ke Kursus
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Tambah Kursus Baru</h1>
            </div>
            <UserNav userName="Admin" currentPage="admin" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Kursus
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Framework
                </label>
                <select
                  value={formData.framework}
                  onChange={(e) => setFormData({ ...formData, framework: e.target.value, category: '' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {frameworks.map(fw => (
                    <option key={fw.value} value={fw.value}>{fw.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Kategori</option>
                  {availableCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isPublished" className="text-sm text-gray-700">
                Publish sekarang
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? 'Menyimpan...' : 'Buat Kursus'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}