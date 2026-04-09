'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
    >
      Cetak Sertifikat
    </button>
  );
}