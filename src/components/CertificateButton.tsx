'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CertificateButtonProps {
  courseId: string;
  hasCertificate: boolean;
}

export default function CertificateButton({ courseId, hasCertificate }: CertificateButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (res.ok) {
        router.refresh();
        router.push('/certificates');
      } else {
        alert(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (hasCertificate) {
    return (
      <Link
        href="/certificates"
        className="block w-full py-3 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        📜 Lihat Sertifikat
      </Link>
    );
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="block w-full py-3 bg-green-600 text-white text-center font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
    >
      {loading ? 'Memuat...' : '🎓 Dapatkan Sertifikat'}
    </button>
  );
}