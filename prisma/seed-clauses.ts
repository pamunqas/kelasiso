import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with ISO 27001 Clause Courses...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@iso-lms.com' },
    update: {},
    create: {
      email: 'admin@iso-lms.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const studentPassword = await bcrypt.hash('demo123', 10);
  await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: {},
    create: {
      email: 'student@demo.com',
      name: 'Demo Student',
      password: studentPassword,
      role: 'STUDENT',
    },
  });

  const courses = [
    {
      slug: 'clause-4-context-organization',
      title: 'Klausul 4: Konteks Organisasi',
      description: 'Pelajari cara memahami lingkungan tempat organisasi bekerja, mengidentifikasi siapa saja yang berkepentingan dengan keamanan informasi perusahaan, dan menentukan batas/cakupan sistem manajemen keamanan informasi yang akan dibangun.',
    },
    {
      slug: 'clause-5-leadership',
      title: 'Klausul 5: Kepemimpinan',
      description: 'Pelajari bagaimana pemimpin perusahaan harus komitmen dan memimpin penerapan sistem keamanan informasi. Pahami peran manajemen puncak dalam membuat kebijakan dan memastikan keamanan menjadi bagian dari budaya perusahaan.',
    },
    {
      slug: 'clause-6-planning',
      title: 'Klausul 6: Perencanaan',
      description: 'Pelajari cara mengidentifikasi risiko yang mengancam keamanan informasi organisasi dan merencanakan tindakan untuk mengatasinya. Pahami bagaimana menentukan tingkat risiko yang dapat diterima.',
    },
    {
      slug: 'clause-7-support',
      title: 'Klausul 7: Dukungan',
      description: 'Pelajari bagaimana menyediakan sumber daya yang memadai, memastikan karyawan memiliki keahlian yang cukup, dan membuat semua orang menyadari pentingnya keamanan informasi.',
    },
    {
      slug: 'clause-8-operation',
      title: 'Klausul 8: Operasi',
      description: 'Pelajari cara menjalankan dan mengontrol proses keamanan informasi sehari-hari. Pahami bagaimana mengelola perubahan, bekerja dengan pihak ketiga, dan memastikan sistem beroperasi dengan aman.',
    },
    {
      slug: 'clause-9-performance-evaluation',
      title: 'Klausul 9: Evaluasi Kinerja',
      description: 'Pelajari cara mengukur dan memantau kinerja sistem keamanan informasi melalui audit internal dan tinjauan manajemen. Pahami bagaimana mengetahui apakah keamanan sudah berjalan dengan baik.',
    },
    {
      slug: 'clause-10-improvement',
      title: 'Klausul 10: Perbaikan',
      description: 'Pelajari cara menangani masalah yang ditemukan, melakukan tindakan korektif, dan terus meningkatkan sistem keamanan informasi dengan prinsip perbaikan berkelanjutan.',
    },
    {
      slug: 'annex-a5-organizational-controls',
      title: 'Annex A.5: Kontrol Organisasional',
      description: 'Pelajari控制 организационные структуры, политики безопасности, dan distribusi tanggung jawab dalam pengelolaan keamanan informasi di perusahaan.',
    },
    {
      slug: 'annex-a6-people-controls',
      title: 'Annex A.6: Kontrol Manusia',
      description: 'Pelajari cara mengelola keamanan terkait manusia: seleksi karyawan, pelatihan, perjanjian kerahasiaan, dan prosedur saat karyawan keluar.',
    },
    {
      slug: 'annex-a8-technological-controls',
      title: 'Annex A.8: Kontrol Teknologi',
      description: 'Pelajari cara mengamankan teknologi: kontrol akses pengguna, enkripsi data, keamanan jaringan, dan perlindungan dari virus serta malware.',
    },
  ];

  const courseModules: Record<string, { mod: number; title: string; desc: string; isQuiz?: boolean }[]> = {
    'clause-4-context-organization': [
      { mod: 1, title: 'Pendahuluan Konteks Organisasi', desc: 'Pelajari mengapa organisasi harus memahami konteks internal dan eksternal dalam penerapan keamanan informasi.' },
      { mod: 2, title: 'Memahami Lingkungan Internal', desc: 'Pelajari aspek internal perusahaan: budaya organisasi, struktur governance, proses bisnis, dan sumber daya yang tersedia.' },
      { mod: 3, title: 'Memahami Lingkungan Eksternal', desc: 'Pelajari faktor eksternal yang mempengaruhi organisasi: regulasi, kondisi ekonomi, sosial, teknologi, dan kompetitor.' },
      { mod: 4, title: 'Identifikasi Pihak Berkepentingan', desc: 'Pelajari siapa saja pihak berkepentingan dengan informasi perusahaan: pelanggan, karyawan, pemasok, pemerintah, dan masyarakat.' },
      { mod: 5, title: 'Kebutuhan Pihak Berkepentingan', desc: 'Pelajari kebutuhan dan ekspektasi masing-masing pihak berkepentingan terkait keamanan informasi mereka.' },
      { mod: 6, title: 'Menentukan Cakupan ISMS', desc: 'Pelajari cara menentukan batas dan ruang lingkup sistem manajemen keamanan informasi yang akan diterapkan.' },
      { mod: 7, title: 'Sistem dan Proses Terkait ISMS', desc: 'Pelajari sistem dan proses apa saja yang perlu включены dalam cakupan ISMS perusahaan.' },
      { mod: 8, title: 'Pendekatan Manajemen Risiko', desc: 'Pelajari cara menentukan pendekatan untuk mengidentifikasi dan mengelola risiko keamanan informasi.' },
      { mod: 9, title: 'Koordinasi dan Komunikasi', desc: 'Pelajari pentingnya koordinasi antar bagian dan komunikasi terkait keamanan informasi.' },
      { mod: 10, title: 'Kuis: Konteks Organisasi', desc: 'Uji pengetahuan Anda tentang Klausul 4 - Konteks Organisasi dalam ISO 27001.', isQuiz: true },
    ],
    'clause-5-leadership': [
      { mod: 1, title: 'Peran Kepemimpinan dalam Keamanan', desc: 'Pelajari mengapa pemimpin perusahaan harus terlibat langsung dalam keamanan informasi.' },
      { mod: 2, title: 'Komitmen Manajemen Puncak', desc: 'Pelajari bentuk komitmen yang harus ditunjukkan oleh direksi dan manajemen senior.' },
      { mod: 3, title: 'Kebijakan Keamanan Informasi', desc: 'Pelajari apa itu kebijakan keamanan informasi dan mengapa penting bagi perusahaan.' },
      { mod: 4, title: 'Menyusun Kebijakan yang Baik', desc: 'Pelajari cara membuat kebijakan keamanan informasi yang jelas, dapat dipahami, dan dapat diterapkan.' },
      { mod: 5, title: 'Menetapkan Tujuan Keamanan', desc: 'Pelajari cara menentukan tujuan keamanan informasi yang selaras dengan bisnis.' },
      { mod: 6, title: 'Menyediakan Sumber Daya', desc: 'Pelajari sumber daya apa saja yang harus disediakan untuk keamanan informasi.' },
      { mod: 7, title: 'Alokasi Tanggung Jawab', desc: 'Pelajari cara membagi tugas dan tanggung jawab keamanan informasi kepada orang yang tepat.' },
      { mod: 8, title: 'Integrasi ISMS dengan Bisnis', desc: 'Pelajari cara memastikan keamanan informasi menjadi bagian dari operasi bisnis sehari-hari.' },
      { mod: 9, title: 'Komunikasi Kebijakan', desc: 'Pelajari cara menyampaikan kebijakan keamanan kepada semua karyawan dengan efektif.' },
      { mod: 10, title: 'Kuis: Kepemimpinan', desc: 'Uji pengetahuan Anda tentang Klausul 5 - Kepemimpinan dalam ISO 27001.', isQuiz: true },
    ],
    'clause-6-planning': [
      { mod: 1, title: 'Dasar-Dasar Perencanaan Keamanan', desc: 'Pelajari mengapa perencanaan itu penting dalam keamanan informasi.' },
      { mod: 2, title: 'Identifikasi Aset Informasi', desc: 'Pelajari cara mengidentifikasi informasi apa saja yang perlu dilindungi perusahaan.' },
      { mod: 3, title: 'Identifikasi Ancaman dan Kerentanan', desc: 'Pelajari ancaman apa saja yang dapat membahayakan informasi dan di mana kelemahan sistem berada.' },
      { mod: 4, title: 'Analisis Risiko', desc: 'Pelajari cara mengukur seberapa mungkin ancaman terjadi dan seberapa besar dampaknya.' },
      { mod: 5, title: 'Menentukan Kriteria Risiko', desc: 'Pelajari cara menentukan batasan risiko yang dapat diterima dan tidak dapat diterima perusahaan.' },
      { mod: 6, title: 'Evaluasi dan Prioritas Risiko', desc: 'Pelajari cara menilai dan mengurutkan risiko berdasarkan tingkat prioritas.' },
      { mod: 7, title: 'Opsi Penanganan Risiko', desc: 'Pelajari pilihan cara menangani risiko: mengurangi, mentransfer, menghindari, atau menerima.' },
      { mod: 8, title: 'Menyusun Rencana Treatment', desc: 'Pelajari cara membuat rencana tindakan untuk mengatasi risiko yang telah diidentifikasi.' },
      { mod: 9, title: 'Pernyataan Applicability', desc: 'Pelajari cara menentukan kontrol mana saja yang diterapkan perusahaan berdasarkan hasil penilaian risiko.' },
      { mod: 10, title: 'Kuis: Perencanaan', desc: 'Uji pengetahuan Anda tentang Klausul 6 - Perencanaan dalam ISO 27001.', isQuiz: true },
    ],
    'clause-7-support': [
      { mod: 1, title: 'Sumber Daya untuk Keamanan', desc: 'Pelajari sumber daya yang diperlukan untuk menjalankan keamanan informasi dengan baik.' },
      { mod: 2, title: 'Kompetensi dan Keahlian', desc: 'Pelajari kemampuan apa saja yang diperlukan untuk menangani keamanan informasi.' },
      { mod: 3, title: 'Proses Rekrutmen dan Seleksi', desc: 'Pelajari cara memastikan karyawan yang direkrut memiliki keahlian yang sesuai.' },
      { mod: 4, title: 'Pelatihan Keamanan', desc: 'Pelajari program pelatihan yang harus diberikan kepada karyawan.' },
      { mod: 5, title: 'Kesadaran Keamanan', desc: 'Pelajari cara membuat karyawan menyadari pentingnya keamanan informasi.' },
      { mod: 6, title: 'Dokumentasi yang Diperlukan', desc: 'Pelajari dokumen apa saja yang harus disiapkan untuk keamanan informasi.' },
      { mod: 7, title: 'Pengelolaan Informasi Terdokumentasi', desc: 'Pelajari cara mengelola dokumen terkait keamanan informasi dengan baik.' },
      { mod: 8, title: 'Komunikasi Keamanan', desc: 'Pelajari cara menyampaikan informasi keamanan secara efektif di perusahaan.' },
      { mod: 9, title: 'Pengelolaan Pengetahuan', desc: 'Pelajari cara mengelola pengetahuan dan pengalaman terkait keamanan.' },
      { mod: 10, title: 'Kuis: Dukungan', desc: 'Uji pengetahuan Anda tentang Klausul 7 - Dukungan dalam ISO 27001.', isQuiz: true },
    ],
    'clause-8-operation': [
      { mod: 1, title: 'Perencanaan Operasi', desc: 'Pelajari cara merencanakan operasi keamanan informasi sehari-hari.' },
      { mod: 2, title: 'Penilaian Risiko Operasional', desc: 'Pelajari cara melakukan penilaian risiko yang berfokus pada operasi perusahaan.' },
      { mod: 3, title: 'Implementasi Treatment Risiko', desc: 'Pelajari cara menerapkan tindakan penanganan risiko dalam operasi.' },
      { mod: 4, title: 'Pengelolaan Perubahan', desc: 'Pelajari cara mengelola perubahan yang dapat mempengaruhi keamanan informasi.' },
      { mod: 5, title: 'Manajemen Pihak Ketiga', desc: 'Pelajari cara mengelola keamanan saat bekerja dengan vendor atau partner.' },
      { mod: 6, title: 'Outsourcing dan Keamanan', desc: 'Pelajari pertimbangan keamanan saat menyerahkan informasi di luar perusahaan.' },
      { mod: 7, title: 'Manajemen Insiden Keamanan', desc: 'Pelajari cara menangani insiden atau pelanggaran keamanan informasi.' },
      { mod: 8, title: 'Konfigurasi Sistem', desc: 'Pelajari cara mengelola konfigurasi dan perubahan sistem teknologi.' },
      { mod: 9, title: 'Backup dan Pemulihan Data', desc: 'Pelajari cara melakukan backup data dan merencanakan pemulihan.' },
      { mod: 10, title: 'Kuis: Operasi', desc: 'Uji pengetahuan Anda tentang Klausul 8 - Operasi dalam ISO 27001.', isQuiz: true },
    ],
    'clause-9-performance-evaluation': [
      { mod: 1, title: 'Monitoring dan Pengukuran', desc: 'Pelajari cara memantau dan mengukur kinerja keamanan informasi.' },
      { mod: 2, title: 'Indikator Kinerja Keamanan', desc: 'Pelajari indikator apa saja yang dapat digunakan untuk mengukur keamanan.' },
      { mod: 3, title: 'Metode Pengukuran', desc: 'Pelajari cara mengukur efektivitas kontrol keamanan informasi.' },
      { mod: 4, title: 'Audit Internal: Persiapan', desc: 'Pelajari cara mempersiapkan audit internal keamanan informasi.' },
      { mod: 5, title: 'Audit Internal: Pelaksanaan', desc: 'Pelajari cara melaksanakan audit internal dengan baik.' },
      { mod: 6, title: 'Audit Internal: Pelaporan', desc: 'Pelajari cara membuat laporan hasil audit internal.' },
      { mod: 7, title: 'Tinjauan Manajemen', desc: 'Pelajari bagaimana manajemen mengevaluasi kinerja keamanan informasi.' },
      { mod: 8, title: 'Evaluasi Kepatuhan', desc: 'Pelajari cara mengevaluasi kepatuhan terhadap kebijakan dan standar.' },
      { mod: 9, title: 'Tinjauan Berkelanjutan', desc: 'Pelajari cara terus memperbaiki sistem berdasarkan hasil evaluasi.' },
      { mod: 10, title: 'Kuis: Evaluasi Kinerja', desc: 'Uji pengetahuan Anda tentang Klausul 9 - Evaluasi Kinerja dalam ISO 27001.', isQuiz: true },
    ],
    'clause-10-improvement': [
      { mod: 1, title: 'Prinsip Perbaikan Berkelanjutan', desc: 'Pelajari prinsip dasar terus meningkatkan keamanan informasi.' },
      { mod: 2, title: 'Ketidaksesuaian dan Koreksi', desc: 'Pelajari cara menangani ketidaksesuaian yang ditemukan.' },
      { mod: 3, title: 'Analisis Akar Masalah', desc: 'Pelajari cara menemukan penyebab utama masalah keamanan.' },
      { mod: 4, title: 'Tindakan Korektif', desc: 'Pelajari cara membuat dan melaksanakan tindakan korektif.' },
      { mod: 5, title: 'Tindakan Preventif', desc: 'Pelajari cara mencegah masalah sebelum terjadi.' },
      { mod: 6, title: 'Pembelajaran dari Insiden', desc: 'Pelajari cara memanfaatkan insiden untuk pembelajaran.' },
      { mod: 7, title: 'Memperbarui Dokumentasi', desc: 'Pelajari cara memperbarui dokumen setelah perbaikan dilakukan.' },
      { mod: 8, title: 'Model PDCA', desc: 'Pelajari siklus Plan-Do-Check-Act untuk peningkatan berkelanjutan.' },
      { mod: 9, title: 'Peninjauan Hasil Perbaikan', desc: 'Pelajari cara menilai efektivitas perbaikan yang telah dilakukan.' },
      { mod: 10, title: 'Kuis: Perbaikan', desc: 'Uji pengetahuan Anda tentang Klausul 10 - Perbaikan dalam ISO 27001.', isQuiz: true },
    ],
    'annex-a5-organizational-controls': [
      { mod: 1, title: 'Pengenalan Kontrol Organisasional', desc: 'Pelajari apa itu kontrol organisasional dan mengapa penting dalam ISO 27001.' },
      { mod: 2, title: 'Kebijakan Keamanan Informasi', desc: 'Pelajari cara membuat kebijakan keamanan yang tepat untuk perusahaan.' },
      { mod: 3, title: 'Peran dan Tanggung Jawab', desc: 'Pelajari cara menetapkan peran dan tanggung jawab keamanan informasi.' },
      { mod: 4, title: 'Pemisahan Tugas', desc: 'Pelajari mengapa penting memisahkan tugas yang bertentangan untuk mencegah fraud.' },
      { mod: 5, title: 'Kontak dengan Otoritas', desc: 'Pelajari cara berkomunikasi dengan pihak berwenang terkait keamanan.' },
      { mod: 6, title: 'Kontak dengan Grup Keamanan', desc: 'Pelajari cara berhubungan dengan komunitas keamanan informasi.' },
      { mod: 7, title: 'Manajemen Risiko Keamanan', desc: 'Pelajari cara mengelola risiko keamanan secara terstruktur.' },
      { mod: 8, title: 'Kategorisasi Aset', desc: 'Pelajari cara mengelompokkan informasi berdasarkan tingkat kepentingan.' },
      { mod: 9, title: 'Kepemimpinan dan Komitmen', desc: 'Pelajari peran pemimpin dalam implementasi kontrol organisasional.' },
      { mod: 10, title: 'Kuis: Kontrol Organisasional', desc: 'Uji pengetahuan Anda tentang Annex A.5 dalam ISO 27001.', isQuiz: true },
    ],
    'annex-a6-people-controls': [
      { mod: 1, title: 'Pengenalan Kontrol Manusia', desc: 'Pelajari mengapa manusia menjadi faktor penting dalam keamanan informasi.' },
      { mod: 2, title: 'Seleksi dan Penyaringan', desc: 'Pelajari cara melakukan seleksi yang tepat untuk keamanan.' },
      { mod: 3, title: 'Syarat Kerja dan Perjanjian', desc: 'Pelajari persyaratan keamanan yang harus dipenuhi karyawan.' },
      { mod: 4, title: 'Pelatihan Kesadaran', desc: 'Pelajari cara meningkatkan kesadaran karyawan tentang keamanan.' },
      { mod: 5, title: 'Proses Disipliner', desc: 'Pelajari bagaimana menindaklanjuti pelanggaran kebijakan keamanan.' },
      { mod: 6, title: 'Tanggung Jawab Pengunduran Diri', desc: 'Pelajari langkah-langkah saat karyawan meninggalkan perusahaan.' },
      { mod: 7, title: 'Pengembalian Aset', desc: 'Pelajari cara mengelola pengembalian aset perusahaan.' },
      { mod: 8, title: 'Pengelolaan Hak Akses', desc: 'Pelajari cara mengelola dan mencabut hak akses dengan benar.' },
      { mod: 9, title: 'Remote Work dan Keamanan', desc: 'Pertimbangan keamanan untuk pekerjaan jarak jauh.' },
      { mod: 10, title: 'Kuis: Kontrol Manusia', desc: 'Uji pengetahuan Anda tentang Annex A.6 dalam ISO 27001.', isQuiz: true },
    ],
    'annex-a8-technological-controls': [
      { mod: 1, title: 'Pengenalan Kontrol Teknologi', desc: 'Pelajari mengapa teknologi memerlukan kontrol khusus dalam keamanan.' },
      { mod: 2, title: 'Manajemen Akses Pengguna', desc: 'Pelajari cara mengelola siapa saja yang dapat mengakses sistem.' },
      { mod: 3, title: 'Kontrol Akses Sistem', desc: 'Pelajari cara mengamankan akses ke sistem dan aplikasi.' },
      { mod: 4, title: 'Enkripsi Data', desc: 'Pelajari cara melindungi data dengan teknik enkripsi.' },
      { mod: 5, title: 'Manajemen Kunci Enkripsi', desc: 'Pelajari cara mengelola kunci untuk membuka data terenkripsi.' },
      { mod: 6, title: 'Keamanan Jaringan', desc: 'Pelajari cara melindungi jaringan komputer perusahaan.' },
      { mod: 7, title: 'Perlindungan Malware', desc: 'Pelajari cara melindungi dari virus dan perangkat berbahaya.' },
      { mod: 8, title: 'Manajemen Kerentanan', desc: 'Pelajari cara menangani kelemahan dalam sistem.' },
      { mod: 9, title: 'Konfigurasi Keamanan', desc: 'Pelajari cara mengatur sistem agar lebih aman.' },
      { mod: 10, title: 'Kuis: Kontrol Teknologi', desc: 'Uji pengetahuan Anda tentang Annex A.8 dalam ISO 27001.', isQuiz: true },
    ],
  };

  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {},
      create: {
        title: courseData.title,
        description: courseData.description,
        slug: courseData.slug,
        isPublished: true,
      },
    });

    const modules = courseModules[courseData.slug] || [];

    for (let i = 0; i < modules.length; i++) {
      const moduleData = modules[i];

      const mod = await prisma.module.upsert({
        where: { id: `${courseData.slug.replace(/-/g, '')}-mod${i + 1}` },
        update: {},
        create: {
          id: `${courseData.slug.replace(/-/g, '')}-mod${i + 1}`,
          title: moduleData.title,
          order: i + 1,
          courseId: course.id,
        },
      });

      const lesson = await prisma.lesson.upsert({
        where: { id: `${courseData.slug.replace(/-/g, '')}-mod${i + 1}-lesson` },
        update: {},
        create: {
          id: `${courseData.slug.replace(/-/g, '')}-mod${i + 1}-lesson`,
          title: moduleData.title,
          type: 'TEXT',
          content: `<h2>${moduleData.title}</h2><p>${moduleData.desc}</p>`,
          order: 1,
          moduleId: mod.id,
        },
      });

      if (moduleData.isQuiz) {
        const quiz = await prisma.quiz.upsert({
          where: { lessonId: lesson.id },
          update: {},
          create: { title: moduleData.title, lessonId: lesson.id },
        });

        const questions = [
          {
            text: `Apa fokus utama dari materi ${moduleData.title}?`,
            options: ['Pemahaman dasar', 'Pengelolaan risiko', 'Penerapan kontrol', 'Semua jawaban benar'],
            correct: 'Semua jawaban benar',
          },
          {
            text: 'Mengapa konsep ini penting dalam ISO 27001?',
            options: ['Tidak penting', 'Sangat penting', 'Hampir tidak penting', 'Tergantung situasi'],
            correct: 'Sangat penting',
          },
          {
            text: 'Bagaimana penerapan konsep ini di perusahaan?',
            options: ['Tidak perlu diterapkan', 'Perlu diterapkan sesuai konteks', 'Hanya untuk perusahaan besar', 'Tidak ada panduan'],
            correct: 'Perlu diterapkan sesuai konteks',
          },
          {
            text: 'Apa manfaat utama dari konsep ini?',
            options: ['Menambah biaya', 'Memperkuat keamanan informasi', 'Tidak ada manfaat', 'Hanya formalitas'],
            correct: 'Memperkuat keamanan informasi',
          },
          {
            text: 'Siapa yang bertanggung jawab dalam konsep ini?',
            options: ['Hanya IT', 'Hanya manajemen', 'Semua karyawan', 'Konsultan eksternal'],
            correct: 'Semua karyawan',
          },
        ];

        for (const q of questions) {
          await prisma.question.upsert({
            where: { id: `${quiz.id}-q${questions.indexOf(q) + 1}` },
            update: {},
            create: {
              id: `${quiz.id}-q${questions.indexOf(q) + 1}`,
              text: q.text,
              options: JSON.stringify(q.options),
              correctAnswer: q.correct,
              quizId: quiz.id,
            },
          });
        }
      }
    }
  }

  console.log('All ISO 27001 courses seeded successfully!');
  console.log('Total: 10 courses, 100 modules, 100 lessons, 10 quizzes');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
