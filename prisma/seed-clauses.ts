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
      description: 'Pelajari cara memahami lingkungan tempat organisasi bekerja, mengidentifikasi siapa saja yang berkepentingan dengan keamanan informasi perusahaan, dan menentukan batas/cakupan sistem manajemen keamanan informasi yang akan dibangun. Sangat penting untuk mengetahui siapa saja yang butuh informasi perusahaan dan bagaimana mereka menggunakannya.',
    },
    {
      slug: 'clause-5-leadership',
      title: 'Klausul 5: Kepemimpinan',
      description: 'Pelajari bagaimana pemimpin perusahaan harus komitmen dan memimpin penerapan sistem keamanan informasi. Pahami peran manajemen puncak dalam membuat kebijakan, menyediakan sumber daya, dan memastikan keamanan informasi menjadi bagian dari budaya perusahaan.',
    },
    {
      slug: 'clause-6-planning',
      title: 'Klausul 6: Perencanaan',
      description: 'Pelajari cara mengidentifikasi risiko yang mengancam keamanan informasi organisasi dan merencanakan tindakan untuk mengatasinya. Pahami bagaimana menentukan tingkat risiko yang diterima dan tidak diterima perusahaan.',
    },
    {
      slug: 'clause-7-support',
      title: 'Klausul 7: Dukungan',
      description: 'Pelajari bagaimana menyediakan sumber daya yang memadai, memastikan karyawan memiliki keahlian yang cukup, dan membuat semua orang menyadari pentingnya keamanan informasi. Pahami juga cara mengelola komunikasi terkait keamanan.',
    },
    {
      slug: 'clause-8-operation',
      title: 'Klausul 8: Operasi',
      description: 'Pelajari cara menjalankan dan mengontrol proses keamanan informasi sehari-hari. Pahami bagaimana mengelola perubahan, bekerja dengan pihak ketiga, dan memastikan sistem beroperasi dengan aman.',
    },
    {
      slug: 'clause-9-performance-evaluation',
      title: 'Klausul 9: Evaluasi Kinerja',
      description: 'Pelajari cara mengukur dan memantau kinerja sistem keamanan informasi melalui audit internal, pengukuran指标, dan tinjauan manajemen. Pahami bagaimana mengetahui apakah keamanan sudah berjalan dengan baik.',
    },
    {
      slug: 'clause-10-improvement',
      title: 'Klausul 10: Perbaikan',
      description: 'Pelajari cara menangani masalah yang ditemukan, melakukan tindakan korektif, dan terus meningkatkan sistem keamanan informasi. Pahami prinsip perbaikan berkelanjutan.',
    },
    {
      slug: 'annex-a5-organizational-controls',
      title: 'Annex A.5: Kontrol Organisasional',
      description: 'Pelajari控制 организационные структуры, политики безопасности, распределение ответственности и управление информационной безопасностью в компании.',
    },
    {
      slug: 'annex-a6-people-controls',
      title: 'Annex A.6: Kontrol Manusia',
      description: 'Pelajari cara mengelola keamanan terkait manusia: seleksi karyawan, pelatihan, perjanjian kerahasiaan, dan prosedur saat karyawan keluar.',
    },
    {
      slug: 'annex-a7-physical-controls',
      title: 'Annex A.7: Kontrol Fisik',
      description: 'Pelajari cara mengamankan fisik kantor dan data: keamanan area terbatas, perlindungan peralatan, dan pembuangan informasi sensitif yang aman.',
    },
    {
      slug: 'annex-a8-technological-controls',
      title: 'Annex A.8: Kontrol Teknologi',
      description: 'Pelajari cara mengamankan teknologi: kontrol akses pengguna,Enkripsi data, keamanan jaringan, dan perlindungan dari virus serta Malware.',
    },
  ];

  const courseModules: Record<string, { title: string; desc: string }[]> = {
    'clause-4-context-organization': [
      { title: 'Mengapa Organisasi Harus Memahami Konteks', desc: 'Pelajari mengapa penting bagi perusahaan untuk memahami lingkungan kerjaInternal dan eksternal dalam penerapan keamanan informasi.' },
      { title: 'Lingkungan Internal Organisasi', desc: 'Pelajari aspek dalam perusahaan seperti budaya, struktur organisasi, proses kerja, dan sumber daya yang влияют на безопасность.' },
      { title: 'Lingkungan Eksternal Organisasi', desc: 'Pelajari faktor di luar perusahaan yang perlu diperhatikan: peraturan hukum, kondisi ekonomi, sosial, dan teknologi.' },
      { title: 'Mengidentifikasi Pihak Berkepentingan', desc: 'Pelajari siapa saja yang berkepentingan dengan informasi perusahaan: pelanggan, karyawan, pemasok, pemerintah, dan masyarakat.' },
      { title: 'Kebutuhan dan Ekspektasi Pihak Berkepentingan', desc: 'Pelajari apa yang dibutuhkan dan diharapkan setiap pihak berkepentingan terkait keamanan informasi mereka.' },
      { title: 'Menentukan Cakupan ISMS', desc: 'Pelajari cara menentukan batas sistem manajemen keamanan informasi yang akan diterapkan di perusahaan.' },
      { title: 'Sistem dan Proses yang Memengaruhi ISMS', desc: 'Pelajari sistem dan proses apa saja yang perlu включены dalam cakupan ISMS perusahaan.' },
      { title: 'Pendekatan Manajemen Risiko', desc: 'Pelajari cara menentukan pendekatan untuk mengelola risiko keamanan informasi perusahaan.' },
      { title: 'Komite Koordinasi dan Komunikasi', desc: 'Pelajari pentingnya koordinasi antar bagian dan komunikasi terkait keamanan informasi.' },
      { title: 'Kuis: Konteks Organisasi', desc: 'Uji pengetahuan Anda tentang konteks organisasi dalam ISO 27001.' },
    ],
    'clause-5-leadership': [
      { title: 'Peran Kepemimpinan dalam Keamanan', desc: 'Pelajari mengapa pemimpin perusahaan harus terlibat langsung dalam keamanan informasi.' },
      { title: 'Komitmen Manajemen Puncak', desc: 'Pelajari bentuk komitmen yang harus ditunjukkan oleh директор dan manajemen senior.' },
      { title: 'Kebijakan Keamanan Informasi', desc: 'Pelajari apa itu kebijakan keamanan informasi dan mengapa penting bagi perusahaan.' },
      { title: 'Menyusun Kebijakan yang Baik', desc: 'Pelajari cara membuat kebijakan keamanan informasi yang jelas, dapat dipahami, dan dapat diterapkan.' },
      { title: 'Menetapkan Tujuan Keamanan', desc: 'Pelajari cara menentukan tujuan keamanan informasi yang selaras dengan bisnis.' },
      { title: 'Menyediakan Sumber Daya', desc: 'Pelajari sumber daya apa saja yang harus disediakan untuk keamanan informasi.' },
      { title: 'Alokasi Tanggung Jawab Keamanan', desc: 'Pelajari cara membagi tugas dan tanggung jawab keamanan informasi kepada orang yang tepat.' },
      { title: 'Integrasi ISMS dengan Bisnis', desc: 'Pelajari cara memastikan keamanan informasi menjadi bagian dari operasi bisnis sehari-hari.' },
      { title: 'Komunikasi Kebijakan kepada Karyawan', desc: 'Pelajari cara menyampaikan kebijakan keamanan kepada semua karyawan dengan efektif.' },
      { title: 'Kuis: Kepemimpinan', desc: 'Uji pengetahuan Anda tentang kepemimpinan dalam ISO 27001.' },
    ],
    'clause-6-planning': [
      { title: 'Dasar-Dasar Perencanaan Keamanan', desc: 'Pelajari mengapa perencanaan itu penting dalam keamanan informasi.' },
      { title: 'Identifikasi Aset Informasi', desc: 'Pelajari cara mengidentifikasi informasi apa saja yang perlu dilindungi perusahaan.' },
      { title: 'Mengidentifikasi Ancaman dan Kerentanan', desc: 'Pelajari ancaman apa saja yang dapat membahayakan informasi dan di mana kelemahan sistem.' },
      { title: 'Analisis Risiko: Likelihood dan Dampak', desc: 'Pelajari cara mengukur seberapa mungkin ancaman terjadi dan seberapa besar dampaknya.' },
      { title: 'Menentukan Kriteria Risiko', desc: 'Pelajari cara menentukan batasan risiko yang dapat diterima dan tidak dapat diterima perusahaan.' },
      { title: 'Evaluasi dan Prioritas Risiko', desc: 'Pelajari cara menilai dan mengurutkan risiko berdasarkan tingkat prioritas.' },
      { title: 'Opsi Penanganan Risiko', desc: 'Pelajari pilihan cara menangani risiko: mengurangi,转移, menghindari, atau menerima.' },
      { title: 'Menyusun Rencana Treatment Risiko', desc: 'Pelajari cara membuat rencana tindakan untuk mengatasi risiko yang telah diidentifikasi.' },
      { title: 'Pernyataan Applicability', desc: 'Pelajari cara menentukan kontrol mana saja yang diterapkan perusahaan berdasarkan hasil penilaian risiko.' },
      { title: 'Kuis: Perencanaan', desc: 'Uji pengetahuan Anda tentang perencanaan dalam ISO 27001.' },
    ],
    'clause-7-support': [
      { title: 'Sumber Daya untuk Keamanan Informasi', desc: 'Pelajari sumber daya yang diperlukan untuk menjalankan keamanan informasi dengan baik.' },
      { title: 'Kompetensi dan Keahlian Karyawan', desc: 'Pelajari kemampuan apa saja yang diperlukan untuk menangani keamanan informasi.' },
      { title: 'Proses Rekrutmen dan Seleksi', desc: 'Pelajari cara memastikan karyawan yang direkrut memiliki keahlian yang sesuai.' },
      { title: 'Pelatihan dan Pendidikan Keamanan', desc: 'Pelajari program pelatihan yang harus diberikan kepada karyawan.' },
      { title: 'Kesadaran Keamanan Informasi', desc: 'Pelajari cara membuat karyawan menyadari pentingnya keamanan informasi.' },
      { title: 'Dokumentasi yang Diperlukan', desc: 'Pelajari dokumen apa saja yang harus disiapkan untuk keamanan informasi.' },
      { title: 'Pengelolaan Informasi Terdokumentasi', desc: 'Pelajari cara mengelola dokumen terkait keamanan informasi dengan baik.' },
      { title: 'Komunikasi Keamanan', desc: 'Pelajari cara menyampaikan informasi keamanan secara efektif di perusahaan.' },
      { title: 'Pengelolaan Pengetahuan', desc: 'Pelajari cara mengelola pengetahuan dan pengalaman terkait keamanan.' },
      { title: 'Kuis: Dukungan', desc: 'Uji pengetahuan Anda tentang dukungan dalam ISO 27001.' },
    ],
    'clause-8-operations': [
      { title: 'Perencanaan dan Pengendalian Operasi', desc: 'Pelajari cara merencanakan dan mengontrol operasi keamanan informasi sehari-hari.' },
      { title: 'Penilaian Risiko Operasional', desc: 'Pelajari cara melakukan penilaian risiko yangfocus pada operasi perusahaan.' },
      { title: 'Implementasi Treatment Risiko', desc: 'Pelajari cara menerapkan tindakan penanganan risiko dalam operasi.' },
      { title: 'Pengelolaan Perubahan', desc: 'Pelajari cara mengelola perubahan yang dapat mempengaruhi keamanan informasi.' },
      { title: 'Manajemen Pihak Ketiga', desc: 'Pelajari cara mengelola keamanan saat bekerja denganvendor atau partner.' },
      { title: 'Outsourcing dan Keamanan', desc: 'Pelajari pertimbangan keamanan saat seringk informasi di luar perusahaan.' },
      { title: 'Manajemen Insiden Keamanan', desc: 'Pelajari cara menangani insiden atau pelanggaran keamanan informasi.' },
      { title: 'Konfigurasi dan Perubahan Sistem', desc: 'Pelajari cara mengelola konfigurasi dan perubahan sistem teknologi.' },
      { title: 'Backup dan Pemulihan Data', desc: 'Pelajari cara melakukan backup data dan merencanakan pemulihan.' },
      { title: 'Kuis: Operasi', desc: 'Uji pengetahuan Anda tentang operasi dalam ISO 27001.' },
    ],
    'clause-9-performance-evaluation': [
      { title: 'Monitoring dan Pengukuran', desc: 'Pelajari cara memantau dan mengukur kinerja keamanan informasi.' },
      { title: 'Indikator Kinerja Keamanan', desc: 'Pelajari指標 apa saja yang dapat digunakan untuk mengukur keamanan.' },
      { title: 'Metode Pengukuran', desc: 'Pelajari cara mengukur efektivitas kontrol keamanan informasi.' },
      { title: 'Audit Internal: Persiapan', desc: 'Pelajari cara mempersiapkan audit internal keamanan informasi.' },
      { title: 'Audit Internal: Pelaksanaan', desc: 'Pelajari cara melaksanakan audit internal dengan baik.' },
      { title: 'Audit Internal: Pelaporan', desc: 'Pelajari cara membuat laporan hasil audit internal.' },
      { title: 'Tinjauan Manajemen', desc: 'Pelajari bagaimana manajemen mengevaluasi kinerja keamanan informasi.' },
      { title: 'Evaluasi Kepatuhan', desc: 'Pelajari cara mengevaluasi kepatuhan terhadap kebijakan dan standar.' },
      { title: 'Review dan Tinjauan Berkelanjutan', desc: 'Pelajari cara terus memperbaiki sistem berdasarkan hasil evaluasi.' },
      { title: 'Kuis: Evaluasi Kinerja', desc: 'Uji pengetahuan Anda tentang evaluasi kinerja dalam ISO 27001.' },
    ],
    'clause-10-improvement': [
      { title: 'Prinsip Perbaikan Berkelanjutan', desc: 'Pelajari prinsip dasar terus meningkatkan keamanan informasi.' },
      { title: 'Ketidaksesuaian dan Koreksi', desc: 'Pelajari cara menangani ketidaksesuaian yang ditemukan.' },
      { title: 'Analisis Akar Masalah', desc: 'Pelajari cara menemukan penyebab utama masalah keamanan.' },
      { title: 'Tindakan Korektif', desc: 'Pelajari cara membuat dan melaksanakan tindakan korektif.' },
      { title: 'Tindakan Preventif', desc: 'Pelajari cara mencegah masalah sebelum terjadi.' },
      { title: 'Pembelajaran dari Insiden', desc: 'Pelajari cara memanfaatkan insiden untuk pembelajaran.' },
      { title: 'Memperbarui Dokumentasi', desc: 'Pelajari cara memperbarui dokumen setelah perbaikan dilakukan.' },
      { title: 'Model PDCA dalam Perbaikan', desc: 'Pelajari siklus Plan-Do-Check-Act untuk peningkatan berkelanjutan.' },
      { title: 'Peninjauan Hasil Perbaikan', desc: 'Pelajari cara menilai efektivitas perbaikan yang telah dilakukan.' },
      { title: 'Kuis: Perbaikan', desc: 'Uji pengetahuan Anda tentang perbaikan dalam ISO 27001.' },
    ],
    'annex-a5-organizational-controls': [
      { title: 'Pengenalan Kontrol Organisasional', desc: 'Pelajari apa itu kontrol organisasional dan mengapa penting.' },
      { title: 'Kebijakan Keamanan Informasi', desc: 'Pelajari cara membuat kebijakan keamanan yang tepat untuk perusahaan.' },
      { title: 'Peran dan Tanggung Jawab Keamanan', desc: 'Pelajari cara menetapkan peran dan tanggung jawab keamanan informasi.' },
      { title: 'Pemisahan Tugas', desc: 'Pelajari mengapa penting memisahkan tugas yang bertentangan.' },
      { title: 'Kontak dengan Otoritas', desc: 'Pelajari cara berkomunikasi dengan pihak berwenang terkait keamanan.' },
      { title: 'Kontak dengan Grup Keamanan', desc: 'Pelajari cara berhubungan dengan komunitas keamanan informasi.' },
      { title: 'Manajemen Risiko Keamanan', desc: 'Pelajari cara mengelola risiko keamanan secara terstruktur.' },
      { title: 'Kategorisasi Aset', desc: 'Pelajari cara mengelompokkan informasi berdasarkan tingkat kepentingan.' },
      { title: 'Kepemimpinan dan Komitmen', desc: 'Pelajari peran pemimpin dalam kontrol organisasional.' },
      { title: 'Kuis: Kontrol Organisasional', desc: 'Uji pengetahuan Anda tentang kontrol organisasional.' },
    ],
    'annex-a6-people-controls': [
      { title: 'Pengenalan Kontrol Manusia', desc: 'Pelajari mengapa manusia menjadi faktor penting dalam keamanan.' },
      { title: 'Seleksi dan Penyaringan Karyawan', desc: 'Pelajari cara melakukan seleksi yang tepat untuk keamanan.' },
      { title: 'Syarat Kerja dan Perjanjian', desc: 'Pelajari persyaratan keamanan yang harus dipenuhi karyawan.' },
      { title: 'Pelatihan Kesadaran Keamanan', desc: 'Pelajari cara meningkatkan kesadaran karyawan tentang keamanan.' },
      { title: 'Proses Disipliner', desc: 'Pelajari bagaimana menindaklanjuti pelanggaran kebijakan keamanan.' },
      { title: 'Tanggung Jawab Saat Pengunduran Diri', desc: 'Pelajari langkah-langkah saat karyawan meninggalkan perusahaan.' },
      { title: 'Pengembalian Aset', desc: 'Pelajari cara mengelola pengembalian aset perusahaan.' },
      { title: 'Pengelolaan Hak Akses', desc: 'Pelajari cara mengelola dan mencabut hak akses dengan benar.' },
      { title: 'Remote Work dan Keamanan', desc: 'Pertimbangan keamanan untuk pekerjaan jarak jauh.' },
      { title: 'Kuis: Kontrol Manusia', desc: 'Uji pengetahuan Anda tentang kontrol manusia.' },
    ],
    'annex-a7-physical-controls': [
      { title: 'Pengenalan Kontrol Fisik', desc: 'Pelajari mengapa keamanan fisik penting untuk informasi.' },
      { title: 'Area Keamanan dan Perimeter', desc: 'Pelajari cara mengamankan area kantor dan membatasi akses.' },
      { title: 'Kontrol Akses Fisik', desc: 'Pelajari cara mengendalikan siapa saja yang dapat masuk area terbatas.' },
      { title: 'Perlindungan terhadap Ancaman Fisik', desc: 'Pelajari cara melindungi dari kebakaran, banjir, dan bencana lain.' },
      { title: 'Keamanan Peralatan', desc: 'Pelajari cara mengamankan komputer dan peralatan kantor.' },
      { title: 'Peralatan di Luar Area Kerja', desc: 'Pertimbangan keamanan untuk peralatan yang dibawa keluar.' },
      { title: 'Pembuangan dan Penggunaan Kembali', desc: 'Pelajari cara membuang informasi dengan aman.' },
      { title: 'Keamanan Kabel dan Listrik', desc: 'Pelajari cara melindungi kabel dan sumber listrik.' },
      { title: 'Pemeliharaan Peralatan', desc: 'Pelajari cara merawat peralatan agar tetap aman.' },
      { title: 'Kuis: Kontrol Fisik', desc: 'Uji pengetahuan Anda tentang kontrol fisik.' },
    ],
    'annex-a8-technological-controls': [
      { title: 'Pengenalan Kontrol Teknologi', desc: 'Pelajari mengapa teknologi memerlukan kontrol khusus.' },
      { title: 'Manajemen Akses Pengguna', desc: 'Pelajari cara mengelola siapa saja yang dapat mengakses sistem.' },
      { title: 'Kontrol Akses Sistem dan Aplikasi', desc: 'Pelajari cara mengamankan akses ke sistem dan aplikasi.' },
      { title: 'Enkripsi Data', desc: 'Pelajari cara melindungi data dengan teknik enkripsi.' },
      { title: 'Manajemen Kunci Enkripsi', desc: 'Pelajari cara mengelola kunci untuk membuka data terenkripsi.' },
      { title: 'Keamanan Jaringan', desc: 'Pelajari cara melindungi jaringan komputer perusahaan.' },
      { title: 'Perlindungan Malware', desc: 'Pelajari cara melindungi dari virus dan perangkat berbahaya.' },
      { title: 'Manajemen Kerentanan', desc: 'Pelajari cara menangani kelemahan dalam sistem.' },
      { title: 'Konfigurasi Keamanan', desc: 'Pelajari cara mengatur sistem agar lebih aman.' },
      { title: 'Kuis: Kontrol Teknologi', desc: 'Uji pengetahuan Anda tentang kontrol teknologi.' },
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
      const isQuizModule = i === 9;

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

      await prisma.lesson.upsert({
        where: { id: `${courseData.slug.replace(/-/g, '')}-l${i + 1}` },
        update: {},
        create: {
          id: `${courseData.slug.replace(/-/g, '')}-l${i + 1}`,
          title: moduleData.title,
          type: 'TEXT',
          content: `<h2>${moduleData.title}</h2><p>${moduleData.desc}</p>`,
          order: 1,
          moduleId: mod.id,
        },
      });

      if (isQuizModule) {
        const lesson = await prisma.lesson.findUnique({
          where: { id: `${courseData.slug.replace(/-/g, '')}-l${i + 1}` },
        });

        if (lesson) {
          const quiz = await prisma.quiz.upsert({
            where: { lessonId: lesson.id },
            update: {},
            create: { title: moduleData.title, lessonId: lesson.id },
          });

          const questions = [
            {
              text: `Apa yang Anda pelajari dari materi ${moduleData.title}?`,
              options: ['Pemahaman dasar', 'Pengelolaan risiko', 'Penerapan kontrol', 'Semua jawaban benar'],
              correct: 'Semua jawaban benar',
            },
            {
              text: 'Meng mana konsep ini penting dalam ISO 27001?',
              options: ['Tidak penting', 'Sangat penting', 'Hampir tidak penting', 'Tergantung situasi'],
              correct: 'Sangat penting',
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
  }

  console.log('All ISO 27001 courses seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
