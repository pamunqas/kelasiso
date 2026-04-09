export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          ISO 27001 LMS
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Platform pembelajaran standar keamanan informasi ISO 27001 untuk pekerja Indonesia
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/courses"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lihat Kursus
          </a>
          <a
            href="/login"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Masuk
          </a>
        </div>
      </div>
    </main>
  );
}