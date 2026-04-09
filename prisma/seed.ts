import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iso-lms.com' },
    update: {},
    create: {
      email: 'admin@iso-lms.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create demo student
  const student = await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: {},
    create: {
      email: 'student@demo.com',
      name: 'Demo Student',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });
  console.log('Created student user:', student.email);

  // Create ISO 27001 Course
  const course = await prisma.course.upsert({
    where: { slug: 'iso-27001-2022' },
    update: {},
    create: {
      title: 'ISO 27001:2022 Information Security Management System',
      description: 'Pelajari standar keamanan informasi ISO 27001 versi terbaru untuk meningkatkan keamanan organisasi Anda. Kursus ini mencakup semua aspek ISMS dari fundamental hingga implementasi.',
      slug: 'iso-27001-2022',
      isPublished: true,
    },
  });
  console.log('Created course:', course.title);

  // Module 1: Pengenalan ISO 27001
  const module1 = await prisma.module.upsert({
    where: { id: 'module-1' },
    update: {},
    create: {
      id: 'module-1',
      title: 'Pengenalan ISO 27001',
      order: 1,
      courseId: course.id,
    },
  });

  // Lessons for Module 1
  const lesson1_1 = await prisma.lesson.upsert({
    where: { id: 'lesson-1-1' },
    update: {},
    create: {
      id: 'lesson-1-1',
      title: 'Apa itu ISO 27001?',
      type: 'TEXT',
      content: `<h2>Apa itu ISO 27001?</h2>
<p>ISO 27001 adalah standar internasional untuk Sistem Manajemen Keamanan Informasi (SMKI) atau dalam bahasa Inggris dikenal sebagai Information Security Management System (ISMS).</p>
<h3>Tujuan Utama</h3>
<ul>
<li>Melindungi informasi organisasi dari berbagai ancaman</li>
<li>Menyediakan kerangka kerja untuk mengelola keamanan informasi</li>
<li>Memenuhi persyaratan regulasi dan compliance</li>
</ul>
<h3>Mengapa ISO 27001 Penting?</h3>
<p>Dalam era digital saat ini, informasi adalah aset berharga yang harus dilindungi. ISO 27001 membantu organisasi mengidentifikasi risiko keamanan dan implementasi kontrol yang tepat.</p>`,
      order: 1,
      moduleId: module1.id,
    },
  });

  const lesson1_2 = await prisma.lesson.upsert({
    where: { id: 'lesson-1-2' },
    update: {},
    create: {
      id: 'lesson-1-2',
      title: 'Sejarah dan Perkembangan ISO 27001',
      type: 'TEXT',
      content: `<h2>Sejarah ISO 27001</h2>
<p>ISO 27001 pertama kali diterbitkan pada tahun 2005 sebagai BS 7799-2. Versi pertama ini merupakan hasil dari pengembangan standar keamanan informasi Inggris BS 7799.</p>
<h3>Perkembangan Versi</h3>
<ul>
<li><strong>2005</strong>: ISO/IEC 27001:2005 - Versi pertama</li>
<li><strong>2013</strong>: ISO/IEC 27001:2013 - Revisi major dengan perubahan struktur</li>
<li><strong>2022</strong>: ISO/IEC 27001:2022 - Versi terbaru dengan pembaruan kontrol</li>
</ul>
<h3>Perubahan di ISO 27001:2022</h3>
<p>Versi 2022 membawa perubahan signifikan termasuk pengurangan jumlah kontrol dari 114 menjadi 93 kontrol, pengelompokan baru, dan penambahan kontrol baru untuk mengatasi ancaman siber modern.</p>`,
      order: 2,
      moduleId: module1.id,
    },
  });

  // Create Quiz for Module 1
  const quiz1 = await prisma.quiz.upsert({
    where: { lessonId: lesson1_2.id },
    update: {},
    create: {
      title: 'Kuis Module 1: Pengenalan ISO 27001',
      lessonId: lesson1_2.id,
    },
  });

  // Questions for Quiz 1
  const questions1 = [
    {
      id: 'q1-1',
      text: 'Apa kependekan dari ISMS?',
      options: JSON.stringify(['Information Security Management System', 'International Security Management System', 'Information System Management', 'Internal Security Audit System']),
      correctAnswer: 'Information Security Management System',
    },
    {
      id: 'q1-2',
      text: 'Berapa jumlah kontrol dalam ISO 27001:2022?',
      options: JSON.stringify(['114', '93', '100', '120']),
      correctAnswer: '93',
    },
    {
      id: 'q1-3',
      text: 'Tahun berapa ISO 27001 versi terbaru diterbitkan?',
      options: JSON.stringify(['2013', '2020', '2022', '2021']),
      correctAnswer: '2022',
    },
  ];

  for (const q of questions1) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: { ...q, quizId: quiz1.id },
    });
  }
  console.log('Created quiz for Module 1');

  // Module 2: ISMS Requirements
  const module2 = await prisma.module.upsert({
    where: { id: 'module-2' },
    update: {},
    create: {
      id: 'module-2',
      title: 'Klausul ISO 27001 (Clause 4-10)',
      order: 2,
      courseId: course.id,
    },
  });

  const lesson2_1 = await prisma.lesson.upsert({
    where: { id: 'lesson-2-1' },
    update: {},
    create: {
      id: 'lesson-2-1',
      title: 'Klausul 4-6: Konteks Organisasi',
      type: 'TEXT',
      content: `<h2>Klausul 4-6: Konteks Organisasi</h2>
<h3>Klausul 4: Konteks Organisasi</h3>
<p>Organisasi harus menentukan konteks eksternal dan internal yang relevan untuk ISMS. Ini mencakup:</p>
<ul>
<li>Pemahaman tentang organisasi dan konteksnya</li>
<li>Kebutuhan dan ekspektasi pihak berkepentingan</li>
<li>Cakupan ISMS</li>
</ul>
<h3>Klausul 5: Kepemimpinan</h3>
<p>Top management harus menunjukkan komitmen terhadap ISMS dengan:</p>
<ul>
<li>Menetapkan kebijakan keamanan informasi</li>
<li>Memastikan tanggung jawab dan autoridade</li>
<li>Mengintegrasikan ISMS dalam proses bisnis</li>
</ul>
<h3>Klausul 6: Perencanaan</h3>
<p>Organisasi harus merencanakan aksi untuk menangani risiko dan peluang, termasuk menentukan criteria risiko dan melakukan assessment risiko.</p>`,
      order: 1,
      moduleId: module2.id,
    },
  });

  const lesson2_2 = await prisma.lesson.upsert({
    where: { id: 'lesson-2-2' },
    update: {},
    create: {
      id: 'lesson-2-2',
      title: 'Klausul 7-10: Dukungan dan Operasi',
      type: 'TEXT',
      content: `<h2>Klausul 7-10: Dukungan dan Operasi</h2>
<h3>Klausul 7: Dukungan</h3>
<p>Organisasi harus menyediakan sumber daya, kompetensi, kesadaran, komunikasi, dan informasi terdokumentasi yang diperlukan untuk ISMS.</p>
<h3>Klausul 8: Operasi</h3>
<p>Klausul ini mencakup:</p>
<ul>
<li>Perencanaan dan kontrol operasional</li>
<li>Penilaian risiko</li>
<li>Treatment risiko</li>
</ul>
<h3>Klausul 9: Evaluasi Performa</h3>
<p>Organisasi harus melakukan:</p>
<ul>
<li>Monitoring, pengukuran, analisis, dan evaluasi</li>
<li>Audit internal</li>
<li>Tinjauan manajemen</li>
</ul>
<h3>Klausul 10: Improvement</h3>
<p>Meliputi:</p>
<ul>
<li>Ketidaksesuaian dan aksi korektif</li>
<li>Continual improvement</li>
</ul>`,
      order: 2,
      moduleId: module2.id,
    },
  });

  // Create Quiz for Module 2
  const quiz2 = await prisma.quiz.upsert({
    where: { lessonId: lesson2_2.id },
    update: {},
    create: {
      title: 'Kuis Module 2: Klausul ISO 27001',
      lessonId: lesson2_2.id,
    },
  });

  const questions2 = [
    {
      id: 'q2-1',
      text: 'Klausul berapa yang membahas tentang kepemimpinan (leadership)?',
      options: JSON.stringify(['3', '4', '5', '6']),
      correctAnswer: '5',
    },
    {
      id: 'q2-2',
      text: 'Apa yang termasuk dalam klausul 9 (Evaluasi Performa)?',
      options: JSON.stringify(['Perencanaan', 'Audit internal', 'Dukungan', 'Treatment risiko']),
      correctAnswer: 'Audit internal',
    },
  ];

  for (const q of questions2) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: { ...q, quizId: quiz2.id },
    });
  }

  // Module 3: Annex A Controls
  const module3 = await prisma.module.upsert({
    where: { id: 'module-3' },
    update: {},
    create: {
      id: 'module-3',
      title: 'Annex A Controls',
      order: 3,
      courseId: course.id,
    },
  });

  const lesson3_1 = await prisma.lesson.upsert({
    where: { id: 'lesson-3-1' },
    update: {},
    create: {
      id: 'lesson-3-1',
      title: 'Pengenalan Annex A Controls',
      type: 'TEXT',
      content: `<h2>Pengenalan Annex A Controls</h2>
<p>Annex A dalam ISO 27001:2022 berisi 93 kontrol keamanan informasi yang dikelompokkan menjadi 4 kategori:</p>
<h3>Kategori Kontrol</h3>
<ol>
<li><strong>Organizational Controls</strong> (37 kontrol)</li>
<li><strong>People Controls</strong> (8 kontrol)</li>
<li><strong>Physical Controls</strong> (14 kontrol)</li>
<li><strong>Technological Controls</strong> (34 kontrol)</li>
</ol>
<h3>Penerapan Annex A</h3>
<p>Organisasi harus melakukan assessment risiko untuk menentukan kontrol mana yang applicable dan perlu diimplementasi sesuai konteks organisasi.</p>`,
      order: 1,
      moduleId: module3.id,
    },
  });

  // Module 4: Risk Assessment
  const module4 = await prisma.module.upsert({
    where: { id: 'module-4' },
    update: {},
    create: {
      id: 'module-4',
      title: 'Penilaian dan Penanganan Risiko',
      order: 4,
      courseId: course.id,
    },
  });

  const lesson4_1 = await prisma.lesson.upsert({
    where: { id: 'lesson-4-1' },
    update: {},
    create: {
      id: 'lesson-4-1',
      title: 'Dasar-dasar Risk Assessment',
      type: 'TEXT',
      content: `<h2>Dasar-dasar Penilaian Risiko</h2>
<p>Risk assessment adalah proses fundamental dalam ISMS untuk mengidentifikasi, menganalisis, dan mengevaluasi risiko keamanan informasi.</p>
<h3>Langkah-langkah Risk Assessment</h3>
<ol>
<li><strong>Identifikasi Risiko</strong>: Mengidentifikasi aset, ancaman, dan kerentanan</li>
<li><strong>Analisis Risiko</strong>: Menilai kemungkinan dan dampak</li>
<li><strong>Evaluasi Risiko</strong>: Menentukan prioritas risiko</li>
<li><strong>Treatment Risiko</strong>: Menentukan aksi untuk menangani risiko</li>
</ol>
<h3>Metode Penilaian Risiko</h3>
<p>Organisasi dapat menggunakan berbagai metode seperti:</p>
<ul>
<li>Qualitative assessment</li>
<li>Quantitative assessment</li>
<li>Semi-quantitative assessment</li>
</ul>`,
      order: 1,
      moduleId: module4.id,
    },
  });

  // Module 5: Internal Audit
  const module5 = await prisma.module.upsert({
    where: { id: 'module-5' },
    update: {},
    create: {
      id: 'module-5',
      title: 'Audit Internal',
      order: 5,
      courseId: course.id,
    },
  });

  const lesson5_1 = await prisma.lesson.upsert({
    where: { id: 'lesson-5-1' },
    update: {},
    create: {
      id: 'lesson-5-1',
      title: 'Konsep Audit Internal',
      type: 'TEXT',
      content: `<h2>Konsep Audit Internal ISO 27001</h2>
<p>Audit internal adalah evaluasi sistematis untuk menentukan apakah ISMS sesuai dengan persyaratan standar dan kebijakan organisasi.</p>
<h3>Tujuan Audit Internal</h3>
<ul>
<li>Memverifikasi implementasi kontrol</li>
<li>Mengevaluasi efektivitas ISMS</li>
<li>Mengidentifikasi area improvement</li>
<li>Menyiapkan untuk audit eksternal</li>
</ul>
<h3>Langkah-langkah Audit</h3>
<ol>
<li>Merencanakan program audit</li>
<li>Melakukan audit</li>
<li>Melaporkan temuan</li>
<li>Follow-up hasil audit</li>
</ol>`,
      order: 1,
      moduleId: module5.id,
    },
  });

  // Module 6: Continuous Improvement
  const module6 = await prisma.module.upsert({
    where: { id: 'module-6' },
    update: {},
    create: {
      id: 'module-6',
      title: 'Perbaikan Berkelanjutan',
      order: 6,
      courseId: course.id,
    },
  });

  const lesson6_1 = await prisma.lesson.upsert({
    where: { id: 'lesson-6-1' },
    update: {},
    create: {
      id: 'lesson-6-1',
      title: 'Continual Improvement',
      type: 'TEXT',
      content: `<h2>Perbaikan Berkelanjutan (Continual Improvement)</h2>
<p>Prinsip perbaikan berkelanjutan memastikan ISMS terus berkembang dan efektif seiring waktu.</p>
<h3>Prinsip Utama</h3>
<ul>
<li><strong>Plan-Do-Check-Act (PDCA)</strong>: Siklus peningkatan berkelanjutan</li>
<li><strong>Lessons Learned</strong>: Pembelajaran dari insiden dan audit</li>
<li><strong>Metrics & KPIs</strong>: Pengukuran efektivitas kontrol</li>
</ul>
<h3>Aksi Perbaikan</h3>
<ol>
<li>Analisis temuan audit</li>
<li>Evaluasi insiden keamanan</li>
<li>Tinjauan manajemen</li>
<li>Update dokumentasi dan kontrol</li>
</ol>`,
      order: 1,
      moduleId: module6.id,
    },
  });

  // Create Quiz for Module 6
  const quiz6 = await prisma.quiz.upsert({
    where: { lessonId: lesson6_1.id },
    update: {},
    create: {
      title: 'Kuis Module 6: Perbaikan Berkelanjutan',
      lessonId: lesson6_1.id,
    },
  });

  const questions6 = [
    {
      id: 'q6-1',
      text: 'Apa singkatan dari PDCA?',
      options: JSON.stringify(['Plan-Do-Check-Act', 'Process-Design-Control-Audit', 'Prevention-Detection-Correction-Action', 'Project-Development-Control-Approval']),
      correctAnswer: 'Plan-Do-Check-Act',
    },
  ];

  for (const q of questions6) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: { ...q, quizId: quiz6.id },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });