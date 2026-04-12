import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Convert markdown to clean HTML without h2 tags
function mdToCleanHtml(md: string): string {
  // Remove markdown headers and convert to proper format
  let html = md
    .replace(/^##\s*Konsep\s*$/gm, '<p><strong>Konsep:</strong> ')
    .replace(/^##\s*Contoh Dunia Nyata\s*$/gm, '</p><p><strong>Contoh Dunia Nyata:</strong> ')
    .replace(/^##\s*/gm, '')
    .replace(/^#\s*/gm, '')
    .trim();
  
  // Handle bold markers **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Handle bullet points at start of line
  html = html.replace(/^\*\s+/gm, '<li>');
  html = html.replace(/^-\s+/gm, '<li>');
  
  // Clean up multiple newlines
  html = html.replace(/\n\n+/g, ' ');
  html = html.replace(/\n/g, ' ');
  
  // Close properly
  html = html + '</p>';
  
  return html;
}

async function main() {
  console.log('Seeding database dengan materi ISO 27001 dari markdown...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iso-lms.com' },
    update: {},
    create: {
      email: 'admin@iso-lms.com',
      name: 'Admin kelasISO',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create demo student
  const studentPassword = await bcrypt.hash('demo123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: {},
    create: {
      email: 'student@demo.com',
      name: 'Peserta Demo',
      password: studentPassword,
      role: 'STUDENT',
    },
  });
  console.log('Created student user:', student.email);

// ========== COURSE 1: FOUNDATIONS OF TRUST ==========
  const course1 = await prisma.course.upsert({
    where: { slug: 'foundations-of-trust' },
    update: {},
    create: {
      title: 'Foundations of Trust',
      description: 'Dasar-dasar ISO 27001，包括konsep dasar, CIA Triad, PDCA, dan komitmen kepemimpinan.',
      slug: 'foundations-of-trust',
      category: 'ISO27001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  // Course 1 Modules
  const course1Modules = [
    { title: 'Module 1.1: Apa itu ISO 27001?', content: `## Konsep

Apa itu ISO 27001? Ini adalah sebuah 'Management System' (Sistem Manajemen Keamanan Informasi - ISMS), bukan sekadar firewall. Ini adalah strategi di balik keamanan. Anggaplah ini sebagai cetak biru utama untuk keselamatan perusahaan. Ini bukan hanya tentang IT; ini tentang bagaimana kita mengelola orang, proses, dan teknologi untuk menjaga keamanan informasi. 

## Contoh Dunia Nyata

Membeli pintu yang berat (firewall) tidak membuat rumah Anda aman jika Anda meninggalkan kunci di bawah keset (kebijakan yang buruk). ISO 27001 adalah buku panduan yang memastikan kita mengunci pintu, menjaga kunci tetap aman, dan tahu siapa saja yang diizinkan masuk.` },
    { title: 'Module 1.2: The CIA Triad', content: `## Konsep

CIA Triad singkatan dari Confidentiality (Kerahasiaan), Integrity (Integritas), dan Availability (Ketersediaan). Ini adalah tiga pilar dari setiap keputusan keamanan. Jika salah satu pilar ini runtuh, data kita terkompromi. 

## Contoh Dunia Nyata

* **Confidentiality (Kerahasiaan):** Mengunci file gaji sehingga hanya tim HR yang bisa membacanya.

* **Integrity (Integritas):** Memastikan jumlah tagihan klien tidak berubah secara tidak sengaja dari $100 menjadi $0.  
* **Availability (Ketersediaan):** Memastikan server benar-benar online saat Anda perlu mengunduh tagihan tersebut.` },
    { title: 'Module 1.3: The PDCA Cycle', content: `## Konsep

Siklus PDCA adalah: Plan (Rencana), Do (Lakukan), Check (Periksa), Act (Tindak Lanjut). Keamanan adalah sebuah lingkaran, bukan tujuan akhir. Kita tidak hanya mengatur keamanan sekali lalu melupakannya; kita terus menguji dan meningkatkannya secara konsisten. 

## Contoh Dunia Nyata

Anda **Plan** untuk mengunci pintu depan. Anda **Do** (melakukannya) setiap pagi. Anda **Check** dengan menarik gagang pintu. Jika longgar, Anda **Act** dengan memperbaiki kunci tersebut.` },
    { title: 'Module 1.4: Compliance vs. Security', content: `## Konsep

Compliance (Kepatuhan) adalah bukti untuk orang lain; Security (Keamanan) adalah perlindungan untuk diri sendiri. Anda butuh keduanya untuk bertahan hidup. Lulus audit (compliance) memberikan kita sertifikat, tetapi benar-benar mengikuti aturan setiap hari (security) menjaga kita agar tidak masuk dalam berita negatif. 

## Contoh Dunia Nyata

 Memiliki SIM membuktikan Anda diizinkan secara hukum untuk mengemudi (**Compliance**), tetapi memakai sabuk pengaman dan memeriksa titik buta menjaga Anda tetap hidup (**Security**).` },
    { title: 'Module 1.5: Leadership Buy-in', content: `## Konsep

Jika CEO tidak peduli, staf juga tidak akan peduli. Keamanan dimulai dengan komitmen manajemen puncak. Pemimpin harus menyediakan waktu, alat, dan anggaran untuk memungkinkan keamanan terwujud. 

## Contoh Dunia Nyata

Jika seorang manajer menuntut Anda berbagi kata sandi agar bisa "bekerja lebih cepat," maka budaya keamanan tersebut telah rusak dari level atas.` },
    { title: 'Module 1.6: The Document Trail', content: `## Konsep

Dalam ISO, jika tidak didokumentasikan, maka itu dianggap tidak terjadi. Log dan kebijakan (policies) adalah bukti sah Anda. 

## Contoh Dunia Nyata

Jika Anda mengatakan selalu memeriksa alat pemadam api setiap bulan, tetapi Anda tidak pernah menandatangani label pada botolnya, auditor akan menganggap Anda tidak pernah melakukannya. Dokumentasi adalah bukti kita.` },
    { title: 'Module 1.7: Stakeholders', content: `## Konsep

Siapa yang peduli dengan keamanan kita? **Stakeholders** (Pemangku Kepentingan) kita adalah Pelanggan, Karyawan, dan Regulator. Kita membangun sistem ini demi kepercayaan mereka. 

## Contoh Dunia Nyata

* **Pelanggan:** Ingin tahu bahwa data kartu kredit mereka aman.

* **Karyawan:** Ingin tahu bahwa alamat rumah dan data pribadi mereka bersifat privasi.  
* **Regulator:** Ingin memastikan kita mematuhi hukum yang berlaku.` },
    { title: 'Module 1.8: Busting Myths', content: `## Konsep

Mitos yang umum adalah 'Kami terlalu kecil' atau 'Ini hanya untuk tim IT'. Kenyataannya adalah setiap orang memainkan peran dalam melindungi data. 

## Contoh Dunia Nyata

Peretas tidak peduli apakah Anda startup dengan 5 orang atau korporasi dengan 5.000 orang. Jika Anda memiliki alamat email dan mengklik tautan berbahaya, Anda adalah pintu masuknya.` },
    { title: 'Module 1.9: The Roadmap', content: `## Konsep

Ini adalah pandangan menyeluruh tentang bagaimana kita bergerak dari ide dasar menuju organisasi yang tersertifikasi aman secara resmi. 

## Contoh Dunia Nyata

Seperti berlatih untuk maraton, kita mulai dengan menilai kesehatan kita, membuat rencana, melakukan kebiasaan harian, dan akhirnya melewati garis finis (proses audit).` },
  ];

  for (let i = 0; i < course1Modules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: course1Modules[i].title,
        order: i + 1,
        courseId: course1.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: course1Modules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(course1Modules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('Course 1 created: Foundations of Trust');

  // ========== COURSE 2: DEFINING THE SCOPE ==========
  const course2 = await prisma.course.upsert({
    where: { slug: 'defining-the-scope' },
    update: {},
    create: {
      title: 'Defining the Scope',
      description: 'Menentukan ruang lingkup ISMS termasuk identifikasi aset, batasan, dan konteks organisasi.',
      slug: 'defining-the-scope',
      category: 'ISO27001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const course2Modules = [
    { title: 'Module 2.1: Asset Identification', content: `## Konsep

Apa yang sebenarnya kita miliki? Ini mencakup laptop, daftar pelanggan, bahkan reputasi merek. Anda tidak bisa melindungi apa yang tidak Anda ketahui keberadaannya. 

## Contoh Dunia Nyata

* **Aset Fisik:** Laptop, server, dan gedung kantor.

* **Aset Non-Fisik:** Resep rahasia, daftar klien VIP di catatan tempel, dan nama baik perusahaan di media sosial.` },
    { title: 'Module 2.2: Defining the Boundary', content: `## Konsep

Kita harus memutuskan: Apakah keamanan ini berlaku untuk seluruh perusahaan atau hanya tim engineering saja? Menentukan batasan memberi tahu kita di mana aturan kita dimulai dan berakhir. 

## Contoh Dunia Nyata

Jika sebuah perusahaan membangun perangkat lunak yang aman tetapi laptop tim pemasaran tidak terlindungi dan terhubung ke jaringan yang sama, seluruh perusahaan berada dalam risiko.` },
    { title: 'Module 2.3: Internal Context', content: `## Konsep

Kita harus mempertimbangkan budaya perusahaan, tujuan, dan politik internal. Keamanan harus sesuai dengan budaya, bukan merusaknya. 

## Contoh Dunia Nyata

Agensi desain yang bergerak cepat mungkin menggunakan alat keamanan yang berbeda dari bank yang diatur ketat, karena budaya internal mereka sangat menghargai kecepatan dan kreativitas.` },
    { title: 'Module 2.4: External Context', content: `## Konsep

Kita juga harus melihat faktor eksternal seperti Hukum (seperti UU PDP), tren pasar, dan taktik peretas terbaru. 

## Contoh Dunia Nyata

Jika hukum privasi baru disahkan di negara tempat kita memiliki pelanggan, **External Context** kita telah berubah, dan kebijakan keamanan kita harus diperbarui agar sesuai dengan hukum baru tersebut.` },
    { title: 'Module 2.5: The Statement of Applicability (SoA)', content: `## Konsep

**SoA** (Pernyataan Keberlakuan) adalah daftar dari 9 control (kendali), dan Anda memilih mana yang berlaku untuk organisasi Anda. 

## Contoh Dunia Nyata

Anggaplah seperti menu di restoran. Anda tidak harus memesan setiap item, tetapi Anda harus memberikan alasan mengapa Anda melewatkan sup dan hanya memesan salad berdasarkan kebutuhan spesifik Anda (*scope*).` },
    { title: 'Module 2.6: Digital Inventory', content: `## Konsep

Ini berarti memiliki daftar inventaris dari setiap server, database, dan alat SaaS yang Anda gunakan. Kita perlu mengetahuinya untuk bisa melindunginya. 

## Contoh Dunia Nyata

Jika Anda mendaftar pengonversi PDF online gratis menggunakan email kantor dan mengunggah file rahasia, alat tersebut sekarang menjadi bagian dari **Digital Inventory** kita.` },
    { title: 'Module 2.7: Physical Scope', content: `## Konsep

Apakah kantor rumah atau kedai kopi dihitung sebagai ruang kerja? Jika Anda bekerja jarak jauh, ruang lingkup fisik meluas ke mana pun laptop Anda dibawa. 

## Contoh Dunia Nyata

Anda tidak boleh meninggalkan laptop kerja tanpa pengawasan di meja kafe. Keamanan fisik laptop tersebut adalah tanggung jawab Anda.` },
    { title: 'Module 2.8: Third-Party Context', content: `## Konsep

Vendor Anda (seperti GCP, Azure, dsb.) adalah bagian dari batasan keamanan Anda. Kita hanya seaman mitra terlemah kita. 

## Contoh Dunia Nyata

* **Kru Pembersih:** Mereka memiliki akses fisik ke kantor kita.

* **Layanan Cloud:** Mereka memegang data digital kita.` },
    { title: 'Module 2.9: The Scope Document', content: `## Konsep

Ini adalah pernyataan singkat dan jelas tentang apa yang Anda lindungi dan di bagian mana perlindungan itu berlaku. 

## Contoh Dunia Nyata

Ini adalah deklarasi resmi kepada auditor yang berbunyi, "Kami berjanji semua yang ada di dalam kotak khusus ini diamankan sesuai dengan aturan ISO."` },
  ];

  for (let i = 0; i < course2Modules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: course2Modules[i].title,
        order: i + 1,
        courseId: course2.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: course2Modules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(course2Modules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('Course 2 created: Defining the Scope');

  // ========== COURSE 3: LEADERSHIP & POLICY ==========
  const course3 = await prisma.course.upsert({
    where: { slug: 'leadership-policy' },
    update: {},
    create: {
      title: 'Leadership & Policy',
      description: 'Kepemimpinan, kebijakan keamanan, dan budaya organisasi dalam ISMS.',
      slug: 'leadership-policy',
      category: 'ISO27001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const course3Modules = [
    { title: 'Module 3.1: The Security Policy', content: `## Konsep

**Security Policy** (Kebijakan Keamanan) adalah 'Konstitusi' tingkat tinggi untuk keamanan perusahaan Anda. Ini menetapkan aturan tertinggi yang harus diikuti semua orang. 

## Contoh Dunia Nyata

Sama seperti konstitusi negara yang menetapkan hukum dasar, kebijakan ini menguraikan komitmen kita untuk menjaga keamanan data secara total.` },
    { title: 'Module 3.2: Providing Resources', content: `## Konsep

Manajemen harus memberikan waktu dan uang agar keamanan dapat berjalan. Anda tidak bisa membangun benteng dengan anggaran nol. 

## Contoh Dunia Nyata

Kepemimpinan harus membayar perangkat lunak yang tepat, kursus pelatihan, dan mengizinkan karyawan meluangkan waktu dari tugas harian mereka untuk belajar tentang keamanan.` },
    { title: 'Module 3.3: The ISO Role', content: `## Konsep

Ini melibatkan penunjukan satu orang atau posisi yang bertanggung jawab atas sistem keamanan (Information Security Officer). Jika sebuah proyek tidak memiliki manajer, tidak ada yang akan selesai. 

## Contoh Dunia Nyata

**Information Security Officer** (ISO) adalah kapten kapal yang memastikan strategi keamanan benar-benar bergerak maju dan tidak jalan di tempat.` },
    { title: 'Module 3.4: Roles & Responsibilities', content: `## Konsep

Setiap orang harus mengetahui 'deskripsi pekerjaan' terkait keamanan mereka masing-masing. Keamanan adalah olahraga tim. 

## Contoh Dunia Nyata

* **Tim IT:** Bertanggung jawab mengelola firewall dan server.

* **Karyawan:** Bertanggung jawab untuk mengunci layar komputer saat ditinggalkan.` },
    { title: 'Module 3.5: Setting Objectives', content: `## Konsep

Tujuan keamanan harus **SMART** (*Specific, Measurable, Achievable, Relevant, Time-bound*). 

## Contoh Dunia Nyata

* **Buruk:** "Menjadi lebih aman."

* **SMART:** "Memastikan 100% karyawan menyelesaikan pelatihan phishing pada akhir Kuartal 3."` },
    { title: 'Module 3.6: The Communication Plan', content: `## Konsep

Ini mengatur bagaimana kita memberi tahu karyawan dan pelanggan tentang adanya pembaruan atau peringatan keamanan. 

## Contoh Dunia Nyata

Jika ada penipuan email baru yang menargetkan industri kita, bagaimana kami memperingatkan Anda? Apakah melalui rapat umum atau peringatan email instan? Kita harus memiliki "megafon" yang andal.` },
    { title: 'Module 3.7: Policy Enforcement', content: `## Konsep

Apa yang terjadi jika seseorang melanggar aturan? Penegakan aturan harus dilakukan secara adil namun tegas. 

## Contoh Dunia Nyata

Jika seorang karyawan berulang kali membagikan kata sandi setelah dilatih, harus ada konsekuensi formal. Kebijakan keamanan adalah aturan wajib, bukan saran ramah.` },
    { title: 'Module 3.8: Continuous Review', content: `## Konsep

Ini berarti memeriksa secara rutin (misal setahun sekali) apakah kebijakan Anda masih masuk akal untuk kondisi saat ini. 

## Contoh Dunia Nyata

Kebijakan yang ditulis tahun 2010 kemungkinan besar tidak menyebutkan ponsel pintar atau penyimpanan cloud. Kita harus secara teratur memperbarui aturan kita untuk ancaman modern.` },
    { title: 'Module 3.9: Security Culture', content: `## Konsep

Tujuannya adalah menjadikan keamanan sebagai kebiasaan otomatis, seperti mengunci pintu rumah saat Anda pergi. 

## Contoh Dunia Nyata

Anda tidak berpikir lama saat memasang sabuk pengaman karena itu sudah menjadi memori otot. Mengunci PC saat Anda berdiri seharusnya terasa persis sama.` },
  ];

  for (let i = 0; i < course3Modules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: course3Modules[i].title,
        order: i + 1,
        courseId: course3.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: course3Modules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(course3Modules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('Course 3 created: Leadership & Policy');

  // ========== COURSE 4: THE RISK ENGINE ==========
  const course4 = await prisma.course.upsert({
    where: { slug: 'the-risk-engine' },
    update: {},
    create: {
      title: 'The Risk Engine',
      description: 'Penilaian risiko, treatment, dan register risiko dalam ISO 27001.',
      slug: 'the-risk-engine',
      category: 'ISO27001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const course4Modules = [
    { title: 'Module 4.1: Threats vs. Vulnerabilities', content: `## Konsep

Pencuri (**Threat**/Ancaman) menemukan jendela yang terbuka (**Vulnerability**/Kerentanan). Kita tidak selalu bisa mengendalikan ancaman, tetapi kita bisa memperbaiki kerentanan. 

## Contoh Dunia Nyata

* **Threat:** Peretas atau penjahat siber.

* **Vulnerability:** Kata sandi yang lemah atau software yang belum di-update.` },
    { title: 'Module 4.2: Impact and Likelihood', content: `## Konsep

Kita mengukur risiko dengan bertanya: Seberapa buruk dampaknya (**Impact**), dan seberapa besar kemungkinannya (**Likelihood**) terjadi? 

## Contoh Dunia Nyata

* **Meteor menabrak kantor:** Dampak sangat besar, namun kemungkinan sangat rendah.

* **Karyawan menjatuhkan laptop:** Dampak sedang, namun kemungkinan tinggi. Kita fokus pada risiko kemungkinan tinggi terlebih dahulu.` },
    { title: 'Module 4.3: Risk Assessment', content: `## Konsep

Ini adalah sesi formal untuk memburu segala hal yang bisa berakibat buruk bagi organisasi. 

## Contoh Dunia Nyata

Bayangkan duduk bersama tim Anda dan melakukan curah pendapat (*brainstorming*) tentang setiap kemungkinan cara seseorang bisa mencuri atau merusak data perusahaan.` },
    { title: 'Module 4.4: Risk Treatment', content: `## Konsep

Ini berarti memutuskan bagaimana menangani setiap risiko yang telah ditemukan. 

## Contoh Dunia Nyata

Setelah Anda tahu jalanan sedang licin (risiko), Anda harus memilih: Apakah mengemudi lebih lambat? Membeli ban khusus? Atau tetap di rumah saja? Keputusan itu adalah **Risk Treatment**.` },
    { title: 'Module 4.5: Mitigation', content: `## Konsep

Mengurangi risiko ke level yang dapat diterima (misal: memasang alarm). Sebagian besar keamanan IT kita adalah **Mitigation**. 

## Contoh Dunia Nyata

Anda tidak bisa menghentikan keberadaan pencuri, tetapi Anda bisa memasang terali pada jendela agar sangat sulit bagi mereka untuk masuk.` },
    { title: 'Module 4.6: Transfer', content: `## Konsep

Memindahkan beban risiko kepada pihak lain (misal: membeli asuransi siber). 

## Contoh Dunia Nyata

Jika peretas mencuri data kita dan kita dituntut, asuransi siber yang akan membayar penalti finansialnya. Risiko tetap terjadi, tetapi beban keuangannya dialihkan.` },
    { title: 'Module 4.7: Avoidance', content: `## Konsep

Menghentikan aktivitas berisiko tersebut sama sekali. 

## Contoh Dunia Nyata

Jika risiko menyimpan nomor kartu kredit pelanggan di server sendiri terlalu tinggi, kita memilih untuk menggunakan pihak ketiga (seperti Stripe atau PayPal) agar data tersebut tidak pernah menyentuh server kita.` },
    { title: 'Module 4.8: Acceptance', content: `## Konsep

Menyadari bahwa risiko tersebut cukup kecil sehingga kita bisa hidup dengannya tanpa tindakan tambahan. 

## Contoh Dunia Nyata

Menyediakan pulpen kantor bagi karyawan membawa risiko pulpen hilang atau dicuri. Biayanya sangat rendah sehingga kita menerima saja risikonya daripada membeli pelacak GPS untuk setiap pulpen.` },
    { title: 'Module 4.9: The Risk Register', content: `## Konsep

Ini adalah lembar kerja induk (*spreadsheet*) yang berisi daftar setiap risiko dan rencana Anda untuk menanganinya. 

## Contoh Dunia Nyata

Ini adalah daftar tugas (*to-do list*) utama bagi tim keamanan yang melacak apa risikonya, siapa penanggung jawabnya, dan kapan tenggat waktunya.` },
  ];

  for (let i = 0; i < course4Modules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: course4Modules[i].title,
        order: i + 1,
        courseId: course4.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: course4Modules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(course4Modules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('Course 4 created: The Risk Engine');

  // ========== COURSE 5: HUMAN RESOURCES SECURITY ==========
  const course5 = await prisma.course.upsert({
    where: { slug: 'human-resources-security' },
    update: {},
    create: {
      title: 'Human Resources Security',
      description: 'Keamanan sumber daya manusia termasuk screening, pelatihan, dan offboarding.',
      slug: 'human-resources-security',
      category: 'ISO27001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const course5Modules = [
    { title: 'Module 5.1: Screening', content: `## Konsep

Melakukan pemeriksaan latar belakang (*background checks*) untuk karyawan baru sebelum mereka diberikan akses ke data sensitif. 

## Contoh Dunia Nyata

Kita tidak akan memberikan kunci brankas bank kepada seseorang tanpa memverifikasi identitas dan sejarah perilaku mereka.` },
    { title: 'Module 5.2: The Contract', content: `## Konsep

Memasukkan tanggung jawab keamanan sebagai bagian dari perjanjian kerja secara legal. 

## Contoh Dunia Nyata

Dengan menandatangani kontrak, Anda secara hukum setuju untuk mengikuti aturan perlindungan data perusahaan sejak hari pertama Anda bergabung.` },
    { title: 'Module 5.3: Onboarding', content: `## Konsep

Pelatihan di hari pertama tentang kebijakan kata sandi, **Clean Desk** (meja bersih), dan mengunci layar komputer. 

## Contoh Dunia Nyata

Sebelum diberi akses ke file perusahaan, Anda harus mempelajari aturan dasar "rumah" agar tidak sengaja meninggalkan "jendela digital" terbuka.` },
    { title: 'Module 5.4: Awareness Training', content: `## Konsep

Sesi edukasi reguler untuk menjaga agar kewaspadaan keamanan tetap menjadi prioritas utama. 

## Contoh Dunia Nyata

Peretas terus mengubah taktik. Apa yang berhasil menipu orang tahun lalu mungkin tidak sama dengan sekarang. Pelatihan rutin menjaga "refleks" keamanan Anda tetap tajam.` },
    { title: 'Module 5.5: Phishing Tests', content: `## Konsep

Mengirim email simulasi palsu untuk melihat apakah staf sudah tahu cara mengenali ciri-ciri penipuan digital. 

## Contoh Dunia Nyata

Ini seperti latihan evakuasi kebakaran untuk kotak masuk email Anda. Kita berlatih mengenali tanda bahaya tanpa adanya bahaya yang nyata.` },
    { title: 'Module 5.6: Reporting Issues', content: `## Konsep

Mendorong budaya 'Tanpa Menyalahkan' (**No-Blame**) agar orang berani melaporkan kesalahan mereka sesegera mungkin. 

## Contoh Dunia Nyata

Jika Anda mengklik tautan buruk, laporkan ke tim IT segera. Jika disembunyikan karena takut, peretas punya lebih banyak waktu untuk mencuri data.` },
    { title: 'Module 5.7: Disciplinary Action', content: `## Konsep

Langkah-langkah formal yang jelas ketika aturan keamanan dengan sengaja diabaikan. 

## Contoh Dunia Nyata

Kecelakaan kerja bisa dimaafkan. Tetapi jika seorang karyawan sengaja melewati firewall untuk menonton konten terlarang, ada proses HR formal untuk perilaku tersebut.` },
    { title: 'Module 5.8: Offboarding', content: `## Konsep

Mengambil kembali aset fisik dan mencabut semua akses digital di saat yang sama ketika seseorang berhenti bekerja. 

## Contoh Dunia Nyata

Saat karyawan mengundurkan diri, akun mereka harus segera dibekukan agar mereka tidak bisa membawa daftar klien atau rahasia perusahaan ke tempat kerja baru.` },
    { title: 'Module 5.9: Post-Employment', content: `## Konsep

Perjanjian **NDA** (*Non-Disclosure Agreement*) yang menjaga rahasia tetap aman bahkan setelah karyawan tidak lagi bekerja di perusahaan. 

## Contoh Dunia Nyata

NDA berarti meskipun Anda bekerja untuk kompetitor tahun depan, Anda secara hukum dilarang membagikan detail proyek rahasia yang Anda kerjakan di sini.` },
  ];

  for (let i = 0; i < course5Modules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: course5Modules[i].title,
        order: i + 1,
        courseId: course5.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: course5Modules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(course5Modules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('Course 5 created: Human Resources Security');

  // ========== COURSE 6: OPERATIONS & TECH ==========
  const course6 = await prisma.course.upsert({
    where: { slug: 'operations-tech' },
    update: {},
    create: {
      title: 'Operations & Tech',
      description: 'Operasi teknis termasuk backup, anti-malware, patching, dan management.',
      slug: 'operations-tech',
      category: 'ISO27001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const course6Modules = [
    { title: 'Module 6.1: Backups', content: `## Konsep

Membuat salinan data dan menyimpannya dengan aman di lokasi yang berbeda. 

## Contoh Dunia Nyata

Jika ransomware mengunci komputer Anda, kita tidak perlu membayar peretas. Kita cukup menghapus data komputer tersebut dan mengunduh cadangan (backup) data kemarin.` },
    { title: 'Module 6.2: Anti-Malware', content: `## Konsep

Lebih dari sekadar antivirus; ini adalah sistem pemantauan untuk mendeteksi perilaku sistem yang aneh. 

## Contoh Dunia Nyata

Jika sistem mendeteksi komputer Anda tiba-tiba mencoba mengenkripsi 10.000 file secara massal di tengah malam, sistem **Anti-Malware** akan mematikannya secara otomatis.` },
    { title: 'Module 6.3: Logging', content: `## Konsep

Menyimpan catatan riwayat (**Log**) tentang apa yang terjadi di sistem untuk ditinjau jika terjadi masalah di kemudian hari. 

## Contoh Dunia Nyata

Jika uang hilang dari akun, log akan memberi tahu kita dengan tepat akun mana yang masuk, kapan waktunya, dan apa saja yang diklik. Ini adalah CCTV digital kita.` },
    { title: 'Module 6.4: Patching', content: `## Konsep

Memperbarui perangkat lunak untuk menambal celah keamanan yang sering digunakan peretas. 

## Contoh Dunia Nyata

Saat ponsel meminta instalasi pembaruan OS, itu biasanya karena produsen menemukan celah yang sedang dieksploitasi peretas. Jangan pernah menunda pembaruan!` },
    { title: 'Module 6.5: Change Management', content: `## Konsep

Menguji setiap pembaruan atau perubahan di lingkungan simulasi sebelum diberikan kepada pengguna langsung. 

## Contoh Dunia Nyata

Kita tidak dirilis kode baru pada Jumat sore dan berharap itu berhasil. Kita mengujinya di zona aman terlebih dahulu agar tidak merusak situs web yang diakses pelanggan.` },
    { title: 'Module 6.6: Capacity Planning', content: `## Konsep

Memastikan infrastruktur server tidak tumbang saat trafik penggunaan sedang melonjak tinggi. 

## Contoh Dunia Nyata

Jika ada kampanye pemasaran besar, kita harus berencana memiliki daya server yang cukup agar situs tidak crash di hari puncak tersebut.` },
    { title: 'Module 6.7: Backup Testing', content: `## Konsep

Benar-benar mencoba memulihkan (*restore*) data cadangan untuk memastikan file tersebut tidak rusak. 

## Contoh Dunia Nyata

Cadangan tidak berguna jika filenya korup. Kita menjalankan tes rutin seolah-olah server mati dan mencoba menarik data cadangan tersebut.` },
    { title: 'Module 6.8: Dev vs. Prod', content: `## Konsep

Memisahkan area 'Pembangunan' (**Development**) dari area 'Langsung' (**Production**). 

## Contoh Dunia Nyata

Pengembang membangun fitur di area simulasi (*sandbox*). Pelanggan hanya melihat produk akhir yang sudah diuji di area produksi. Keduanya tidak boleh bercampur.` },
    { title: 'Module 6.9: Clock Sync', content: `## Konsep

Memastikan semua waktu di server Anda sinkron agar catatan log menjadi akurat. 

## Contoh Dunia Nyata

Jika Server A mencatat jam 14:00 dan Server B mencatat 14:05, menyelidiki urutan kejadian peretasan menjadi mustahil karena garis waktunya tidak sinkron.` },
  ];

  for (let i = 0; i < course6Modules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: course6Modules[i].title,
        order: i + 1,
        courseId: course6.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: course6Modules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(course6Modules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('Course 6 created: Operations & Tech');

  // ========== COURSE 7: ACCESS & IDENTITY ==========
  const course7 = await prisma.course.upsert({
    where: { slug: 'access-identity' },
    update: {},
    create: {
      title: 'Access & Identity',
      description: 'Manajemen akses, identitas, password, dan keamanan fisik tempat kerja.',
      slug: 'access-identity',
      category: 'ISO27001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const course7Modules = [
    { title: 'Module 7.1: Least Privilege', content: `## Konsep

Hanya memberikan hak akses yang benar-benar dibutuhkan seseorang untuk melakukan pekerjaannya, tidak lebih. 

## Contoh Dunia Nyata

Anak magang pemasaran tidak butuh akses ke sistem penggajian. Jika akun mereka diretas, kerusakannya terbatas hanya pada file pemasaran.` },
    { title: 'Module 7.2: User Registration', content: `## Konsep

Cara formal untuk memberikan dan melacak identitas digital setiap individu. 

## Contoh Dunia Nyata

Kita tidak berbagi satu login umum. Setiap orang memiliki akun unik agar kita tahu persis siapa yang melakukan tindakan tertentu di sistem.` },
    { title: 'Module 7.3: Password Secrets', content: `## Konsep

Menggunakan frasa panjang dan kode unik untuk setiap akun agar sulit ditebak. 

## Contoh Dunia Nyata

Jangan gunakan "Password123". Gunakan frasa seperti "MonyetUnguNgebutSekali!". Frasa panjang mudah diingat namun secara matematis mustahil ditebak peretas.` },
    { title: 'Module 7.4: Multi-Factor (MFA)', content: `## Konsep

Menggunakan langkah verifikasi kedua (seperti aplikasi autentikator) untuk membuktikan identitas. 

## Contoh Dunia Nyata

Meskipun peretas tahu kata sandi Anda, mereka tidak bisa masuk tanpa memegang ponsel fisik Anda untuk menyetujui permintaan masuk tersebut.` },
    { title: 'Module 7.5: Privileged Access', content: `## Konsep

Perlindungan ekstra ketat untuk akun 'Admin' yang memiliki kuasa untuk menghapus atau mengubah segalanya. 

## Contoh Dunia Nyata

Admin IT memegang "kunci kerajaan." Akun mereka dipantau lebih ketat dan mereka harus menggunakan akun biasa untuk tugas-tugas ringan harian.` },
    { title: 'Module 7.6: Access Reviews', content: `## Konsep

Memeriksa secara berkala (misal 3 bulan sekali) siapa saja yang masih membutuhkan akses tertentu. 

## Contoh Dunia Nyata

Jika Anda pindah dari divisi Sales ke HR, akses Anda ke database Sales harus segera dicabut melalui tinjauan rutin ini agar tidak disalahgunakan.` },
    { title: 'Module 7.7: Physical Access', content: `## Konsep

Menggunakan kartu akses atau sidik jari untuk memasuki area kantor. 

## Contoh Dunia Nyata

**Tailgating**—membukakan pintu untuk orang lain tanpa kartu akses karena sopan santun—adalah risiko besar. Setiap orang wajib menempelkan kartu akses mereka sendiri.` },
    { title: 'Module 7.8: Clean Desk', content: `## Konsep

Tidak meninggalkan kata sandi atau dokumen sensitif di atas meja saat Anda pulang atau meninggalkan meja. 

## Contoh Dunia Nyata

Kru pembersih atau tamu kantor tidak seharusnya bisa melihat rencana strategi perusahaan yang tertulis di papan tulis atau catatan tempel di monitor Anda.` },
    { title: 'Module 7.9: Clear Screen', content: `## Konsep

Mengunci layar komputer Anda (**Windows + L**) setiap kali Anda berdiri meninggalkan meja. 

## Contoh Dunia Nyata

Jika Anda pergi mengambil kopi tanpa mengunci layar, siapa pun yang lewat bisa mengirim email palsu dari akun Anda atau mengunduh data rahasia.` },
  ];

  for (let i = 0; i < course7Modules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: course7Modules[i].title,
        order: i + 1,
        courseId: course7.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: course7Modules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(course7Modules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('Course 7 created: Access & Identity');

  // ========== COURSE 8: PHYSICAL SECURITY ==========
  const course8 = await prisma.course.upsert({
    where: { slug: 'physical-security' },
    update: {},
    create: {
      title: 'Physical Security',
      description: 'Keamanan fisik termasuk perimeter, visitor control, dan peralatan.',
      slug: 'physical-security',
      category: 'ISO27001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const course8Modules = [
    { title: 'Module 8.1: Secure Perimeters', content: `## Konsep

Menggunakan penghalang fisik seperti dinding, gerbang, dan resepsionis untuk membatasi orang yang masuk. 

## Contoh Dunia Nyata

Keamanan dimulai sebelum masuk gedung. Pagar dan penjaga keamanan mencegah orang yang tidak berkepentingan berkeliaran di area kantor.` },
    { title: 'Module 8.2: Visitor Control', content: `## Konsep

Mewajibkan tamu untuk mencatat identitas dan selalu didampingi selama berada di dalam gedung. 

## Contoh Dunia Nyata

Jika tukang ledeng datang, mereka harus mendaftar, memakai tanda pengenal tamu, dan didampingi staf agar tidak masuk ke area server sendirian.` },
    { title: 'Module 8.3: Server Siting', content: `## Konsep

Menempatkan perangkat keras di ruangan yang terkunci, sejuk, dan terlindungi dari gangguan. 

## Contoh Dunia Nyata

Kita tidak menaruh server krusial di dekat wastafel dapur atau di bawah atap yang bocor. Lingkungannya harus terkontrol secara suhu dan keamanan.` },
    { title: 'Module 8.4: Power & Utilities', content: `## Konsep

Memiliki rencana cadangan daya (**UPS**) jika terjadi pemadaman listrik secara mendadak. 

## Contoh Dunia Nyata

Jika listrik padam, **UPS** akan menjaga server tetap menyala cukup lama hingga sistem bisa dimatikan dengan aman atau beralih ke generator.` },
    { title: 'Module 8.5: Cabling Security', content: `## Konsep

Melindungi kabel jaringan agar tidak terpotong atau disadap oleh pihak yang tidak bertanggung jawab. 

## Contoh Dunia Nyata

Kabel jaringan tidak boleh dibiarkan menjuntai di lorong publik. Kabel harus masuk dalam pipa pelindung yang terkunci atau di dalam dinding.` },
    { title: 'Module 8.6: Equipment Disposal', content: `## Konsep

Menghancurkan dokumen fisik dan menghapus total data di hard drive sebelum dibuang atau didaur ulang. 

## Contoh Dunia Nyata

Kita tidak membuang laptop lama langsung ke tempat sampah. Hard drive harus dihancurkan secara fisik karena data lama masih bisa dipulihkan oleh orang lain.` },
    { title: 'Module 8.7: Removal of Assets', content: `## Konsep

Mewajibkan izin resmi sebelum membawa aset fisik (seperti laptop atau monitor) keluar dari area gedung. 

## Contoh Dunia Nyata

Memindahkan monitor kantor ke rumah untuk remote work harus dicatat secara resmi agar perusahaan tahu di mana posisi setiap asetnya.` },
    { title: 'Module 8.8: Unattended Equipment', content: `## Konsep

Kewaspadaan terhadap komputer yang ditinggalkan di area publik atau lokasi kerja sementara. 

## Contoh Dunia Nyata

Jangan pernah tinggalkan laptop tanpa pengawasan di kedai kopi atau bandara, meskipun hanya semenit untuk pergi ke toilet.` },
    { title: 'Module 8.9: Remote Sites', content: `## Konsep

Memastikan standar keamanan di kantor rumah atau pusat data jarak jauh sama ketatnya dengan kantor pusat. 

## Contoh Dunia Nyata

Saat bekerja dari rumah, jangan biarkan anggota keluarga menggunakan laptop kerja Anda. Ruang kerja rumah Anda adalah perpanjangan dari area keamanan perusahaan.` },
  ];

  for (let i = 0; i < course8Modules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: course8Modules[i].title,
        order: i + 1,
        courseId: course8.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: course8Modules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(course8Modules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('Course 8 created: Physical Security');

  // ========== COURSE 9: INCIDENT MANAGEMENT ==========
  const course9 = await prisma.course.create({
    data: {
      title: 'Incident Management',
      description: 'Manajemen insiden keamanan mulai dari pelaporan hingga lesson learned.',
      slug: 'incident-management',
      category: 'ISO27001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const course9Modules = [
    { title: 'Module 9.1: Apa itu Insiden?', content: `## Konsep

Segala kejadian yang mengganggu keamanan, baik itu kehilangan laptop, serangan peretas, atau bahkan mati lampu massal. 

## Contoh Dunia Nyata

* **Kesalahan Manusia:** Tidak sengaja mengirim data pelanggan ke orang yang salah.

* **Serangan:** Peretas mengunci data perusahaan.  
* **Teknis:** Website toko online mati saat promo besar.` },
    { title: 'Module 9.2: Reporting Channels', content: `## Konsep

Saluran komunikasi yang jelas agar setiap orang tahu harus melapor ke siapa saat terjadi masalah. 

## Contoh Dunia Nyata

Anda harus tahu nomor telepon atau email darurat tim keamanan. Jangan coba perbaiki sendiri; laporkan secepat mungkin karena waktu sangat berharga.` },
    { title: 'Module 9.3: Assessment', content: `## Konsep

Langkah evaluasi untuk menentukan apakah sebuah laporan adalah bencana besar atau hanya masalah teknis kecil. 

## Contoh Dunia Nyata

Tim keamanan akan menilai: Apakah ini hanya satu akun yang terkunci, atau apakah seluruh database sedang dihapus secara massal oleh penjahat?` },
    { title: 'Module 9.4: Response', content: `## Konsep

Tindakan untuk menghentikan penyebaran masalah (**Containment**/Penahanan). 

## Contoh Dunia Nyata

Seperti pemadam kebakaran mengisolasi satu ruangan agar api tidak menjalar ke seluruh rumah, tim IT mungkin mematikan akses internet pada satu laptop yang terinfeksi virus.` },
    { title: 'Module 9.5: Evidence', content: `## Konsep

Menjaga data log dan kondisi sistem sebagai barang bukti untuk penyelidikan lebih lanjut. 

## Contoh Dunia Nyata

Komputer yang diretas diperlakukan seperti tempat kejadian perkara (TKP). Kita tidak langsung menginstal ulang sistemnya, melainkan mengambil salinan data untuk forensik digital.` },
    { title: 'Module 9.6: Communication', content: `## Konsep

Menentukan kapan dan bagaimana cara memberi tahu pihak berwenang, pelanggan, atau regulator jika terjadi kebocoran data. 

## Contoh Dunia Nyata

Jika data pelanggan dicuri, ada hukum yang mengatur seberapa cepat kita harus mengumumkannya. Tim Legal dan PR akan menangani komunikasi ini.` },
    { title: 'Module 9.7: Recovery', content: `## Konsep

Langkah-langkah untuk mengembalikan operasional bisnis ke kondisi normal secepat mungkin. 

## Contoh Dunia Nyata

Setelah ancaman hilang, tim akan memulihkan data dari cadangan yang bersih dan menghidupkan kembali layanan secara bertahap.` },
    { title: 'Module 9.8: Lessons Learned', content: `## Konsep

Sesi diskusi setelah insiden selesai untuk memastikan kejadian yang sama tidak terulang kembali di masa depan. 

## Contoh Dunia Nyata

Kita mencari akar masalahnya. Jika karena klik tautan palsu, maka kita akan perkuat filter email dan mengadakan pelatihan tambahan bagi karyawan.` },
    { title: 'Module 9.9: The Incident Log', content: `## Konsep

Catatan induk dari setiap masalah keamanan yang pernah terjadi sebagai bahan evaluasi manajemen. 

## Contoh Dunia Nyata

Jika log menunjukkan ada 5 laptop hilang dalam sebulan, manajemen akan menyadari bahwa masalahnya ada pada kebijakan keamanan fisik secara umum.` },
  ];

  for (let i = 0; i < course9Modules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: course9Modules[i].title,
        order: i + 1,
        courseId: course9.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: course9Modules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(course9Modules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('Course 9 created: Incident Management');

  // ========== COURSE 10: THE FINISH LINE ==========
  const course10 = await prisma.course.create({
    data: {
      title: 'The Finish Line',
      description: 'Audit internal, eksternal, sertifikasi, dan pengawasan berkelanjutan.',
      slug: 'the-finish-line',
      category: 'ISO27001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const course10Modules = [
    { title: 'Module 10.1: Internal Audit', content: `## Konsep

Memeriksa kesiapan diri sendiri sebelum menghadapi ujian yang sesungguhnya dari pihak luar. 

## Contoh Dunia Nyata

Sebelum auditor resmi ISO datang, tim internal akan melakukan "simulasi audit" untuk menemukan dan memperbaiki kesalahan secara mandiri.` },
    { title: 'Module 10.2: Management Review', content: `## Konsep

Pertemuan puncak dengan pimpinan untuk memastikan seluruh sistem keamanan sudah siap untuk diaudit secara eksternal. 

## Contoh Dunia Nyata

Manajemen puncak meninjau hasil audit internal dan anggaran untuk memberikan persetujuan akhir bahwa organisasi sudah siap disertifikasi.` },
    { title: 'Module 10.3: Non-Conformity', content: `## Konsep

Istilah formal untuk sesuatu yang tidak sesuai dengan standar atau aturan yang telah ditetapkan. 

## Contoh Dunia Nyata

Jika aturan mewajibkan layar terkunci, namun auditor menemukan layar Anda terbuka saat Anda tidak ada di meja, itu tercatat sebagai **Non-Conformity** (Ketidaksesuaian).` },
    { title: 'Module 10.4: Corrective Action', content: `## Konsep

Tindakan nyata untuk memperbaiki akar masalah dari sebuah ketidaksesuaian. 

## Contoh Dunia Nyata

Jika banyak karyawan lupa mengunci layar, **Corrective Action**-nya adalah mengatur sistem agar layar terkunci otomatis secara paksa dalam 3 menit.` },
    { title: 'Module 10.5: Continuous Improvement', content: `## Konsep

Komitmen untuk terus meningkatkan sistem keamanan setiap tahun karena ancaman siber juga terus berkembang. 

## Contoh Dunia Nyata

ISO 27001 bukan proyek yang sekali jadi. Tujuannya adalah agar pertahanan kita hari ini sedikit lebih baik dari pada pertahanan kita kemarin.` },
    { title: 'Module 10.6: External Audit Stage 1', content: `## Konsep

Tahap di mana auditor luar memeriksa kelengkapan dokumentasi dan kebijakan di atas kertas. 

## Contoh Dunia Nyata

Auditor bertanya, "Apakah Anda memiliki cetak biru keamanan yang benar?" Mereka memastikan dokumen kita sudah memenuhi standar ISO.` },
    { title: 'Module 10.7: External Audit Stage 2', content: `## Konsep

Tahap di mana auditor memeriksa apakah Anda benar-benar melakukan apa yang tertulis di dokumen tersebut. 

## Contoh Dunia Nyata

Auditor akan berkeliling kantor, memeriksa meja kerja, melihat log server, dan mewawancarai karyawan secara acak tentang kebiasaan keamanan mereka.` },
    { title: 'Module 10.8: Certification', content: `## Konsep

Pengakuan resmi berupa sertifikat ISO 27001 setelah berhasil melewati semua tahap audit. 

## Contoh Dunia Nyata

Sukses! Sertifikat ini membuktikan kepada dunia dan pelanggan bahwa kita mengelola keamanan data mereka dengan standar internasional yang ketat.` },
    { title: 'Module 10.9: Surveillance', content: `## Konsep

Audit pengawasan tahunan untuk memastikan standar keamanan tetap terjaga dan tidak menurun setelah mendapatkan sertifikat. 

## Contoh Dunia Nyata

Kita tidak boleh lengah setelah lulus. Auditor akan kembali setiap tahun untuk memastikan kita tetap konsisten menjalankan aturan yang sudah disepakati.` },
  ];

  for (let i = 0; i < course10Modules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: course10Modules[i].title,
        order: i + 1,
        courseId: course10.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: course10Modules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(course10Modules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('Course 10 created: The Finish Line');

  // ========== ISO 9001 COURSES ==========
  console.log('\nAdding ISO 9001 courses...');

  // Course 1: Fondasi Mutu
  const iso9001Course1 = await prisma.course.create({
    data: {
      title: 'Fondasi Mutu',
      description: 'Dasar-dasar Sistem Manajemen Mutu ISO 9001 termasuk QMS, fokus pelanggan, dan kepemimpinan.',
      slug: 'fondasi-mutu',
      category: 'ISO9001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const fondasiMutuModules = [
    { title: 'Module 1.1: Pengenalan Sistem Manajemen Mutu', content: `## Konsep

Cara terstruktur mengelola organisasi agar selalu menghasilkan produk/jasa berkualitas melalui Sistem Manajemen Mutu (Quality Management System).

## Contoh Dunia Nyata

Seperti resep rahasia nasi goreng yang takarannya selalu sama setiap hari agar rasanya konsisten.` },
    { title: 'Module 1.2: Fokus pada Pelanggan', content: `## Konsep

Segala aktivitas harus berorientasi pada kepuasan pengguna akhir (Customer Focus).

## Contoh Dunia Nyata

Supir ojol yang memastikan rute dan kenyamanan penumpang sebelum berangkat.` },
    { title: 'Module 1.3: Kepemimpinan', content: `## Konsep

Pemimpin harus mengarahkan dan menyediakan sumber daya agar sistem berjalan (Leadership).

## Contoh Dunia Nyata

Kapten kapal yang memastikan semua kru tahu tugasnya saat menghadapi badai.` },
    { title: 'Module 1.4: Keterlibatan Orang', content: `## Konsep

Melibatkan orang yang kompeten di semua tingkatan organisasi (Engagement of People).

## Contoh Dunia Nyata

Tim pit-stop F1; jika satu orang leng saat ganti ban, mobil gagal juara.` },
    { title: 'Module 1.5: Pendekatan Proses', content: `## Konsep

Melihat pekerjaan sebagai rangkaian aktivitas yang saling terhubung (Process Approach).

## Contoh Dunia Nyata

Urutan menyeduh kopi; air harus panas sebelum kopi diaduk, bukan sebaliknya.` },
    { title: 'Module 1.6: Siklus PDCA', content: `## Konsep

Metode perbaikan terus-menerus (Plan-Do-Check-Act).

## Contoh Dunia Nyata

Diet; buat rencana makan, timbang berat badan tiap minggu, lalu sesuaikan olahraga jika belum turun.` },
    { title: 'Module 1.7: Konteks Organisasi', content: `## Konsep

Memahami faktor internal dan eksternal yang memengaruhi tujuan (Context of the Organization).

## Contoh Dunia Nyata

Membuka kedai es krim harus mempertimbangkan cuaca (eksternal) dan daya listrik kulkas (internal).` },
    { title: 'Module 1.8: Pihak Berkepentingan', content: `## Konsep

Mengetahui siapa saja yang terdampak oleh bisnis kita (Interested Parties).

## Contoh Dunia Nyata

Mengadakan hajatan; selain tamu, tetangga dan keamanan lingkungan juga harus diperhatikan.` },
    { title: 'Module 1.9: Ruang Lingkup Sistem Mutu', content: `## Konsep

Batasan jelas tentang produk atau divisi yang masuk dalam sertifikasi (Scope of QMS).

## Contoh Dunia Nyata

Memasang pagar rumah; tentukan apakah hanya rumah utama atau termasuk halaman belakang.` },
  ];

  for (let i = 0; i < fondasiMutuModules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: fondasiMutuModules[i].title,
        order: i + 1,
        courseId: iso9001Course1.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: fondasiMutuModules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(fondasiMutuModules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('ISO 9001 Course 1 created: Fondasi Mutu');

  // Course 2: Perencanaan & Risiko
  const iso9001Course2 = await prisma.course.create({
    data: {
      title: 'Perencanaan & Risiko',
      description: 'Perencanaan mutu, risk-based thinking, sasaran mutu, dan kebijakan mutu.',
      slug: 'perencanaan-risiko',
      category: 'ISO9001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const perencanaanModules = [
    { title: 'Module 2.1: Pemikiran Berbasis Risiko', content: `## Konsep

Proaktif mengidentifikasi masalah sebelum terjadi (Risk-based Thinking).

## Contoh Dunia Nyata

Membawa payung di tas meskipun cuaca saat ini masih cerah.` },
    { title: 'Module 2.2: Tindakan Mengatasi Risiko', content: `## Konsep

Rencana nyata untuk mencegah atau meminimalkan risiko (Actions to Address Risks).

## Contoh Dunia Nyata

Memasang alarm tambahan pada motor agar tidak dicuri saat parkir.` },
    { title: 'Module 2.3: Mengambil Peluang', content: `## Konsep

Melihat situasi menguntungkan sebagai peluang tumbuh (Opportunities).

## Contoh Dunia Nyata

Saat tren gaya hidup sehat naik, toko roti mulai menjual varian gandum utuh.` },
    { title: 'Module 2.4: Sasaran Mutu', content: `## Konsep

Target kualitas yang spesifik dan terukur (Quality Objectives).

## Contoh Dunia Nyata

Target lari 5 km dalam waktu kurang dari 30 menit pada akhir bulan.` },
    { title: 'Module 2.5: Merencanakan Sasaran Mutu', content: `## Konsep

Detail mengenai siapa, apa, dan kapan target dicapai (Planning to Achieve Objectives).

## Contoh Dunia Nyata

Menentukan jadwal latihan lari setiap Selasa dan Kamis untuk mencapai target bulanan.` },
    { title: 'Module 2.6: Perencanaan Perubahan', content: `## Konsep

Mengelola perubahan sistem agar tidak merusak operasional (Planning of Changes).

## Contoh Dunia Nyata

Mengganti sistem kasir lama ke digital tanpa menghentikan pelayanan pelanggan.` },
    { title: 'Module 2.7: Kebijakan Mutu', content: `## Konsep

Pernyataan komitmen manajemen terhadap kualitas (Quality Policy).

## Contoh Dunia Nyata

Slogan restoran "Hanya Bahan Segar, atau Uang Anda Kembali".` },
    { title: 'Module 2.8: Peran dan Tanggung Jawab', content: `## Konsep

Memastikan setiap orang tahu tugas dan wewenangnya (Organizational Roles & Responsibilities).

## Contoh Dunia Nyata

Pembagian tugas dalam tim sepak bola (kiper, bek, striker).` },
    { title: 'Module 2.9: Komunikasi Kebijakan', content: `## Konsep

Memastikan semua karyawan paham arah mutu perusahaan (Communicating the Policy).

## Contoh Dunia Nyata

Menjelaskan visi perusahaan dalam setiap rapat mingguan staf.` },
  ];

  for (let i = 0; i < perencanaanModules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: perencanaanModules[i].title,
        order: i + 1,
        courseId: iso9001Course2.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: perencanaanModules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(perencanaanModules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('ISO 9001 Course 2 created: Perencanaan & Risiko');

  // Course 3: Sumber Daya & Dukungan
  const iso9001Course3 = await prisma.course.create({
    data: {
      title: 'Sumber Daya & Dukungan',
      description: 'Penyediaan sumber daya, kompetensi, infrastruktur, dan informasi terdokumentasi.',
      slug: 'sumber-daya-dukungan',
      category: 'ISO9001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const sumberDayaModules = [
    { title: 'Module 3.1: Penyediaan Sumber Daya', content: `## Konsep

Organisasi menyediakan segala kebutuhan operasional (Provision of Resources).

## Contoh Dunia Nyata

Tukang bangunan yang imbuhnya semen, bata, dan alat yang layak.` },
    { title: 'Module 3.2: Sumber Daya Manusia', content: `## Konsep

Memastikan jumlah staf cukup untuk menjalankan sistem (People).

## Contoh Dunia Nyata

Menambah jumlah kasir saat musim diskon besar-besaran.` },
    { title: 'Module 3.3: Infrastruktur', content: `## Konsep

Fasilitas fisik dan teknologi yang dibutuhkan (Infrastructure).

## Contoh Dunia Nyata

Server internet yang stabil untuk perusahaan layanan cloud.` },
    { title: 'Module 3.4: Lingkungan Proses', content: `## Konsep

Kondisi tempat kerja yang mendukung produktivitas (Environment for Operation).

## Contoh Dunia Nyata

Lab komputer yang suhunya terjaga agar alat tidak overheat.` },
    { title: 'Module 3.5: Pemantauan & Pengukuran', content: `## Konsep

Alat ukur harus akurat dan dikalibrasi (Monitoring & Measuring Resources).

## Contoh Dunia Nyata

Timbangan emas yang harus dicek akurasinya secara rutin.` },
    { title: 'Module 3.6: Pengetahuan Organisasi', content: `## Konsep

Menjaga aset ilmu pengetahuan agar tidak hilang (Organizational Knowledge).

## Contoh Dunia Nyata

Manual operasional agar karyawan baru bisa bekerja seandal karyawan lama.` },
    { title: 'Module 3.7: Kompetensi', content: `## Konsep

Karyawan harus punya skill yang pas (Competence).

## Contoh Dunia Nyata

Syarat sertifikasi ahli las untuk pengerjaan pipa minyak.` },
    { title: 'Module 3.8: Kesadaran', content: `## Konsep

Karyawan sadar dampak kerjanya pada mutu (Awareness).

## Contoh Dunia Nyata

Koki yang sadar pentingnya cuci tangan agar makanan tidak terkontaminasi.` },
    { title: 'Module 3.9: Informasi Terdokumentasi', content: `## Konsep

Mengelola dokumen agar selalu update dan sah (Documented Information).

## Contoh Dunia Nyata

Buku SIM yang memiliki masa berlaku dan hanya dikeluarkan pihak berwenang.` },
  ];

  for (let i = 0; i < sumberDayaModules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: sumberDayaModules[i].title,
        order: i + 1,
        courseId: iso9001Course3.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: sumberDayaModules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(sumberDayaModules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('ISO 9001 Course 3 created: Sumber Daya & Dukungan');

  // Course 4: Operasional & Desain
  const iso9001Course4 = await prisma.course.create({
    data: {
      title: 'Operasional & Desain',
      description: 'Perencanaan operasional, desain produk, dan pengembangan.',
      slug: 'operasional-desain',
      category: 'ISO9001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const operasionalModules = [
    { title: 'Module 4.1: Perencanaan Operasional', content: `## Konsep

Kendali atas proses produksi dari awal hingga akhir (Operational Control).

## Contoh Dunia Nyata

Jadwal masak di katering agar makanan matang tepat sebelum jam pengiriman.` },
    { title: 'Module 4.2: Komunikasi Pelanggan', content: `## Konsep

Interaksi jelas mengenai produk dan keluhan (Customer Communication).

## Contoh Dunia Nyata

Layanan Customer Service yang responsif menjawab pertanyaan pembeli.` },
    { title: 'Module 4.3: Persyaratan Produk', content: `## Konsep

Menentukan spesifikasi produk sebelum dikerjakan (Requirements).

## Contoh Dunia Nyata

Mencatat pesanan baju: warna biru, ukuran L, bahan katun.` },
    { title: 'Module 4.4: Tinjauan Persyaratan', content: `## Konsep

Memastikan sanggup memenuhi pesanan sebelum deal (Review of Requirements).

## Contoh Dunia Nyata

Bengkel mengecek stok suku cadang sebelum berjanji servis selesai sore ini.` },
    { title: 'Module 4.5: Perubahan Persyaratan', content: `## Konsep

Mengelola revisi pesanan dari pelanggan (Changes to Requirements).

## Contoh Dunia Nyata

Pelanggan mengubah desain logo di tengah proses cetak.` },
    { title: 'Module 4.6: Desain dan Pengembangan', content: `## Konsep

Proses membuat produk baru dari ide ke kenyataan (Design and Development).

## Contoh Dunia Nyata

Perusahaan otomotif yang membuat konsep mobil listrik baru.` },
    { title: 'Module 4.7: Input Desain', content: `## Konsep

Kriteria dasar yang harus ada pada desain baru (Design Inputs).

## Contoh Dunia Nyata

Syarat kursi baru: harus tahan beban 100kg dan bisa dilipat.` },
    { title: 'Module 4.8: Kontrol Desain', content: `## Konsep

Menguji desain secara berkala (Design Controls).

## Contoh Dunia Nyata

Mencoba purwarupa (prototype) sepatu lari di berbagai medan sebelum dijual.` },
    { title: 'Module 4.9: Output Desain', content: `## Konsep

Hasil akhir desain yang siap diproduksi (Design Outputs).

## Contoh Dunia Nyata

File desain final siap cetak yang dikirim ke mesin produksi.` },
  ];

  for (let i = 0; i < operasionalModules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: operasionalModules[i].title,
        order: i + 1,
        courseId: iso9001Course4.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: operasionalModules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(operasionalModules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('ISO 9001 Course 4 created: Operasional & Desain');

  // Course 5: Produksi & Vendor
  const iso9001Course5 = await prisma.course.create({
    data: {
      title: 'Produksi & Vendor',
      description: 'Pengendalian vendor eksternal, produksi, dan menyerahkan produk.',
      slug: 'produksi-vendor',
      category: 'ISO9001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const produksiModules = [
    { title: 'Module 5.1: Penyedia Eksternal', content: `## Konsep

Mengendalikan kualitas barang dari supplier (External Providers).

## Contoh Dunia Nyata

Penjual martabak yang hanya mau membeli telur dari peternakan terpercaya.` },
    { title: 'Module 5.2: Informasi Vendor', content: `## Konsep

Instruksi detail saat memesan barang ke pihak luar (Information for Providers).

## Contoh Dunia Nyata

Menulis surat pesanan bahan baku lengkap dengan kode warna dan jumlahnya.` },
    { title: 'Module 5.3: Pengendalian Produksi', content: `## Konsep

Memastikan produksi berjalan sesuai standar (Control of Production).

## Contoh Dunia Nyata

Penggunaan SOP dalam merakit komponen elektronik di pabrik.` },
    { title: 'Module 5.4: Identifikasi & Telusur', content: `## Konsep

Menandai barang agar bisa dilacak asalnya (Identification & Traceability).

## Contoh Dunia Nyata

Kode produksi pada kaleng susu untuk tahu kapan susu itu dikemas.` },
    { title: 'Module 5.5: Properti Pelanggan', content: `## Konsep

Menjaga barang titipan milik pelanggan (Customer Property).

## Contoh Dunia Nyata

Penjahit yang menjaga kain mahal milik klien agar tidak rusak.` },
    { title: 'Module 5.6: Preservasi', content: `## Konsep

Melindungi produk agar tidak rusak saat disimpan/dikirim (Preservation).

## Contoh Dunia Nyata

Membungkus buah ekspor dengan jaring pelindung dan pendingin.` },
    { title: 'Module 5.7: Pasca Pengiriman', content: `## Konsep

Layanan setelah barang diterima pelanggan (Post-delivery Activities).

## Contoh Dunia Nyata

Layanan instalasi gratis dan garansi mesin selama satu tahun.` },
    { title: 'Module 5.8: Rilis Produk', content: `## Konsep

Cek terakhir sebelum barang keluar dari gudang (Release of Products).

## Contoh Dunia Nyata

Petugas gudang menandatangani surat jalan setelah cek fisik barang.` },
    { title: 'Module 5.9: Output Tidak Sesuai', content: `## Konsep

Menangani barang cacat agar tidak terkirim (Nonconforming Outputs).

## Contoh Dunia Nyata

Memisahkan roti yang gosong ke wadah khusus "tidak layak jual".` },
  ];

  for (let i = 0; i < produksiModules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: produksiModules[i].title,
        order: i + 1,
        courseId: iso9001Course5.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: produksiModules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(produksiModules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('ISO 9001 Course 5 created: Produksi & Vendor');

  // Course 6: Evaluasi & Perbaikan
  const iso9001Course6 = await prisma.course.create({
    data: {
      title: 'Evaluasi & Perbaikan',
      description: 'Pemantauan, analisis, audit, dan peningkatan berkelanjutan.',
      slug: 'evaluasi-perbaikan',
      category: 'ISO9001',
      framework: 'ISO',
      isPublished: true,
    },
  });

  const evaluasiModules = [
    { title: 'Module 6.1: Pemantauan & Analisis', content: `## Konsep

Mengukur kinerja sistem secara berkala (Monitoring & Analysis).

## Contoh Dunia Nyata

Melihat laporan grafik penjualan bulanan untuk evaluasi.` },
    { title: 'Module 6.2: Kepuasan Pelanggan', content: `## Konsep

Mencari tahu pendapat pelanggan tentang kita (Customer Satisfaction).

## Contoh Dunia Nyata

Mengirimkan survei bintang 1-5 setelah layanan selesai.` },
    { title: 'Module 6.3: Evaluasi Vendor', content: `## Konsep

Menilai apakah supplier masih layak dipertahankan (Evaluation of Providers).

## Contoh Dunia Nyata

Menghentikan kerjasama dengan vendor yang sering telat kirim bahan.` },
    { title: 'Module 6.4: Audit Internal', content: `## Konsep

Pemeriksaan mandiri oleh tim internal (Internal Audit).

## Contoh Dunia Nyata

Pemilik toko melakukan stok opname mendadak untuk cek kejujuran staf.` },
    { title: 'Module 6.5: Tinjauan Manajemen', content: `## Konsep

Rapat pimpinan untuk bahas nasib sistem kedepanya (Management Review).

## Contoh Dunia Nyata

Rapat direksi tahunan untuk memutuskan strategi tahun depan.` },
    { title: 'Module 6.6: Ketidaksesuaian', content: `## Konsep

Kejadian di mana aturan atau standar dilanggar (Nonconformity).

## Contoh Dunia Nyata

Ditemukannya tumpahan oli di area yang seharusnya bersih steril.` },
    { title: 'Module 6.7: Tindakan Korektif', content: `## Konsep

Menghilangkan penyebab masalah agar tidak terulang (Corrective Action).

## Contoh Dunia Nyata

Mengganti kabel yang terkelupas, bukan cuma menutupinya dengan lakban.` },
    { title: 'Module 6.8: Peningkatan Berkelanjutan', content: `## Konsep

Usaha tiada henti untuk jadi lebih baik (Continual Improvement).

## Contoh Dunia Nyata

Terus mencari cara agar proses produksi bisa 5 menit lebih cepat setiap tahun.` },
    { title: 'Module 6.9: Budaya Mutu', content: `## Konsep

Menjadikan kualitas sebagai kebiasaan otomatis semua staf (Quality Culture).

## Contoh Dunia Nyata

Tanpa diawasi CCTV, karyawan tetap bekerja rapi karena bangga akan hasilnya.` },
  ];

  for (let i = 0; i < evaluasiModules.length; i++) {
    const mod = await prisma.module.create({
      data: {
        title: evaluasiModules[i].title,
        order: i + 1,
        courseId: iso9001Course6.id,
      },
    });
    await prisma.lesson.create({
      data: {
        title: evaluasiModules[i].title.replace('Module ', ''),
        type: 'TEXT',
        content: mdToCleanHtml(evaluasiModules[i].content),
        order: 1,
        moduleId: mod.id,
      },
    });
  }
  console.log('ISO 9001 Course 6 created: Evaluasi & Perbaikan');

  // ========== ISO 9001 QUIZ MODULES ==========
  console.log('\nAdding ISO 9001 quiz modules...');

  // ISO 9001 Course 1 Quiz - Fondasi Mutu
  const iso9001Course1QuizModule = await prisma.module.create({
    data: { title: 'Module 1.10: Quiz - Fondasi Mutu', order: 10, courseId: iso9001Course1.id },
  });
  const iso9001Course1QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Fondasi Mutu',
      type: 'TEXT',
      content: '# Quiz: Fondasi Mutu\n\nJawablah 10 pertanyaan berikut untuk menguji pemahaman Anda.',
      order: 1,
      moduleId: iso9001Course1QuizModule.id,
    },
  });
  const iso9001Course1Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Fondasi Mutu', lessonId: iso9001Course1QuizLesson.id },
  });
  const iso9001Course1Questions = [
    { text: 'Fokus utama ISO 9001 adalah...', options: JSON.stringify(['Menghukum staf', 'Kepuasan Pelanggan', 'Mengurangi pajak', 'Membeli mesin baru']), correctAnswer: 'Kepuasan Pelanggan' },
    { text: 'Siklus PDCA, huruf A kepanjangan dari...', options: JSON.stringify(['Aim', 'Act', 'Account', 'Apply']), correctAnswer: 'Act' },
    { text: 'Siapa yang bertanggung jawab pada Leadership?', options: JSON.stringify(['Pelanggan', 'Supplier', 'Manajemen Puncak', 'Auditor']), correctAnswer: 'Manajemen Puncak' },
    { text: 'Process Approach berarti melihat pekerjaan sebagai...', options: JSON.stringify(['Tugas mandiri', 'Beban', 'Rangkaian aktivitas terhubung', 'Perintah bos']), correctAnswer: 'Rangkaian aktivitas terhubung' },
    { text: 'Faktor internal/eksternal perusahaan dibahas dalam modul...', options: JSON.stringify(['Audit', 'Konteks Organisasi', 'Desain', 'Dokumentasi']), correctAnswer: 'Konteks Organisasi' },
    { text: 'Masyarakat sekitar pabrik dalam ISO disebut...', options: JSON.stringify(['Produk', 'Pihak Berkepentingan', 'Karyawan', 'Kompetitor']), correctAnswer: 'Pihak Berkepentingan' },
    { text: 'Engagement of People menekankan pada...', options: JSON.stringify(['Keterlibatan semua level', 'Hanya manajer', 'Hanya pemilik', 'Orang luar']), correctAnswer: 'Keterlibatan semua level' },
    { text: 'Ruang Lingkup (Scope) menentukan...', options: JSON.stringify(['Nama perusahaan', 'Batasan sistem manajemen', 'Gaji direktur', 'Harga produk']), correctAnswer: 'Batasan sistem manajemen' },
    { text: 'Contoh Sistem Manajemen Mutu sederhana adalah...', options: JSON.stringify(['Buku harian', 'Resep masakan standar', 'Kertas kosong', 'Iklan TV']), correctAnswer: 'Resep masakan standar' },
    { text: 'Tahap Check dalam PDCA dilakukan untuk...', options: JSON.stringify(['Membuat rencana', 'Mengevaluasi hasil', 'Memulai kerja', 'Membayar tagihan']), correctAnswer: 'Mengevaluasi hasil' },
  ];
  for (const q of iso9001Course1Questions) {
    await prisma.question.create({ data: { ...q, quizId: iso9001Course1Quiz.id } });
  }
  console.log('ISO 9001 Course 1 quiz added');

  // ISO 9001 Course 2 Quiz - Perencanaan & Risiko
  const iso9001Course2QuizModule = await prisma.module.create({
    data: { title: 'Module 2.10: Quiz - Perencanaan & Risiko', order: 10, courseId: iso9001Course2.id },
  });
  const iso9001Course2QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Perencanaan & Risiko',
      type: 'TEXT',
      content: '# Quiz: Perencanaan & Risiko\n\nJawablah 10 pertanyaan berikut.',
      order: 1,
      moduleId: iso9001Course2QuizModule.id,
    },
  });
  const iso9001Course2Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Perencanaan & Risiko', lessonId: iso9001Course2QuizLesson.id },
  });
  const iso9001Course2Questions = [
    { text: 'Proaktif mencegah masalah adalah inti dari...', options: JSON.stringify(['Risk-based Thinking', 'Koreksi', 'Audit', 'Penjualan']), correctAnswer: 'Risk-based Thinking' },
    { text: 'Sasaran Mutu harus bersifat Measurable, artinya...', options: JSON.stringify(['Bagus', 'Dapat diukur', 'Rahasia', 'Mahal']), correctAnswer: 'Dapat diukur' },
    { text: 'Peluang (Opportunities) muncul dari...', options: JSON.stringify(['Kesalahan staf', 'Situasi menguntungkan', 'Kerugian', 'Audit gagal']), correctAnswer: 'Situasi menguntungkan' },
    { text: 'Siapa yang harus memahami Kebijakan Mutu?', options: JSON.stringify(['Hanya Direktur', 'Hanya Auditor', 'Seluruh Karyawan', 'Pihak Bank']), correctAnswer: 'Seluruh Karyawan' },
    { text: 'Perencanaan Perubahan dilakukan agar...', options: JSON.stringify(['Biaya naik', 'Sistem tidak terganggu', 'Karyawan bingung', 'Cepat sertifikasi']), correctAnswer: 'Sistem tidak terganggu' },
    { text: 'Tindakan mengatasi risiko kemalingan adalah...', options: JSON.stringify(['Membiarkan pintu terbuka', 'Memasang CCTV', 'Tidak punya kantor', 'Berdoa saja']), correctAnswer: 'Memasang CCTV' },
    { text: 'Organizational Roles menjelaskan tentang...', options: JSON.stringify(['Nama gedung', 'Tugas dan wewenang', 'Alamat rumah staf', 'Daftar harga']), correctAnswer: 'Tugas dan wewenang' },
    { text: 'Rencana mencapai sasaran harus mencakup...', options: JSON.stringify(['Nama pelanggan', 'Sumber daya dan penanggung jawab', 'Warna seragam', 'Merek laptop']), correctAnswer: 'Sumber daya dan penanggung jawab' },
    { text: 'Policies Mutu merupakan bentuk...', options: JSON.stringify(['Komitmen Manajemen', 'Prosedur teknis', 'Daftar hadir', 'Laporan keuangan']), correctAnswer: 'Komitmen Manajemen' },
    { text: 'Berbagi Kebijakan Mutu ke staf disebut...', options: JSON.stringify(['Rahasia', 'Komunikasi', 'Pelatihan skill', 'Dokumentasi']), correctAnswer: 'Komunikasi' },
  ];
  for (const q of iso9001Course2Questions) {
    await prisma.question.create({ data: { ...q, quizId: iso9001Course2Quiz.id } });
  }
  console.log('ISO 9001 Course 2 quiz added');

  // ISO 9001 Course 3 Quiz - Sumber Daya & Dukungan
  const iso9001Course3QuizModule = await prisma.module.create({
    data: { title: 'Module 3.10: Quiz - Sumber Daya & Dukungan', order: 10, courseId: iso9001Course3.id },
  });
  const iso9001Course3QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Sumber Daya & Dukungan',
      type: 'TEXT',
      content: '# Quiz: Sumber Daya & Dukungan\n\nJawablah 10 pertanyaan berikut.',
      order: 1,
      moduleId: iso9001Course3QuizModule.id,
    },
  });
  const iso9001Course3Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Sumber Daya & Dukungan', lessonId: iso9001Course3QuizLesson.id },
  });
  const iso9001Course3Questions = [
    { text: 'Infrastruktur dalam ISO 9001 mencakup...', options: JSON.stringify(['Gaji', 'Gedung dan peralatan', 'Nama supplier', 'Visi misi']), correctAnswer: 'Gedung dan peralatan' },
    { text: 'Kalibrasi dilakukan pada...', options: JSON.stringify(['Meja kantor', 'Alat ukur', 'Kursi staf', 'Seragam']), correctAnswer: 'Alat ukur' },
    { text: 'Agar ilmu tidak hilang saat staf resign, perusahaan menjaga...', options: JSON.stringify(['Kunci kantor', 'Pengetahuan Organisasi', 'Laptop staf', 'Uang kas']), correctAnswer: 'Pengetahuan Organisasi' },
    { text: 'Competence bisa didapat melalui...', options: JSON.stringify(['Pelatihan/Edukasi', 'Keberuntungan', 'Membeli ijazah', 'Menunggu']), correctAnswer: 'Pelatihan/Edukasi' },
    { text: 'Awareness berarti karyawan tahu...', options: JSON.stringify(['Nama direktur', 'Dampak kerjanya pada mutu', 'Alamat gudang', 'Tanggal gajian']), correctAnswer: 'Dampak kerjanya pada mutu' },
    { text: 'Documented Information harus...', options: JSON.stringify(['Dikendalikan dan update', 'Dibuat sebanyak mungkin', 'Disimpan di rumah staf', 'Tidak boleh dibaca']), correctAnswer: 'Dikendalikan dan update' },
    { text: 'Kondisi fisik tempat kerja disebut...', options: JSON.stringify(['Infrastruktur', 'Environment for operation', 'Kebijakan', 'Kompetensi']), correctAnswer: 'Environment for operation' },
    { text: 'Menambah server saat user naik adalah penyediaan...', options: JSON.stringify(['Risiko', 'Sumber Daya', 'Prosedur', 'Audit']), correctAnswer: 'Sumber Daya' },
    { text: 'Syarat utama info terdokumentasi adalah...', options: JSON.stringify(['Dicetak di kertas mahal', 'Ada bukti pengesahan', 'Ditulis tangan', 'Menggunakan bahasa Inggris']), correctAnswer: 'Ada bukti pengesahan' },
    { text: 'Dokter yang punya ijazah bedah memenuhi aspek...', options: JSON.stringify(['Awareness', 'Competence', 'Infrastructure', 'Traceability']), correctAnswer: 'Competence' },
  ];
  for (const q of iso9001Course3Questions) {
    await prisma.question.create({ data: { ...q, quizId: iso9001Course3Quiz.id } });
  }
  console.log('ISO 9001 Course 3 quiz added');

  // ISO 9001 Course 4 Quiz - Operasional & Desain
  const iso9001Course4QuizModule = await prisma.module.create({
    data: { title: 'Module 4.10: Quiz - Operasional & Desain', order: 10, courseId: iso9001Course4.id },
  });
  const iso9001Course4QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Operasional & Desain',
      type: 'TEXT',
      content: '# Quiz: Operasional & Desain\n\nJawablah 10 pertanyaan berikut.',
      order: 1,
      moduleId: iso9001Course4QuizModule.id,
    },
  });
  const iso9001Course4Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Operasional & Desain', lessonId: iso9001Course4QuizLesson.id },
  });
  const iso9001Course4Questions = [
    { text: 'Operational Planning dilakukan untuk...', options: JSON.stringify(['Mencari risiko', 'Mengontrol proses produksi', 'Menambah karyawan', 'Mengaudit vendor']), correctAnswer: 'Mengontrol proses produksi' },
    { text: 'Mengulang pesanan pembeli adalah bentuk...', options: JSON.stringify(['Audit', 'Komunikasi Pelanggan', 'Desain produk', 'Dokumentasi']), correctAnswer: 'Komunikasi Pelanggan' },
    { text: 'Sebelum deal proyek, kita melakukan...', options: JSON.stringify(['Review of Requirements', 'Pengiriman barang', 'Penagihan', 'Pemecatan']), correctAnswer: 'Review of Requirements' },
    { text: 'Tahap awal sebelum menggambar desain baru disebut...', options: JSON.stringify(['Design Output', 'Design Input', 'Design Review', 'Design Audit']), correctAnswer: 'Design Input' },
    { text: 'Mencoba prototype produk adalah bagian dari...', options: JSON.stringify(['Design Input', 'Design Control/Validation', 'Penjualan', 'Rekrutmen']), correctAnswer: 'Design Control/Validation' },
    { text: 'Cetak biru (blueprint) final adalah...', options: JSON.stringify(['Design Input', 'Design Output', 'Perencanaan Risiko', 'Kebijakan Mutu']), correctAnswer: 'Design Output' },
    { text: 'Persyaratan produk mencakup aturan hukum, caranya...', options: JSON.stringify(['Warna baju', 'Izin Edar/BPOM', 'Nama toko', 'Bonus karyawan']), correctAnswer: 'Izin Edar/BPOM' },
    { text: 'Jika pelanggan mengubah pesanan di tengah jalan, maka...', options: JSON.stringify(['Abaikan saja', 'Update dokumen pesanan', 'Marahi pelanggan', 'Batalkan proyek']), correctAnswer: 'Update dokumen pesanan' },
    { text: 'Membuat produk yang belum pernah ada sebelumnya adalah...', options: JSON.stringify(['Design & Development', 'Audit', 'Purchasing', 'Maintenance']), correctAnswer: 'Design & Development' },
    { text: 'Tujuan dari Kontrol Desain adalah memastikan...', options: JSON.stringify(['Desain murah', 'Desain memenuhi persyaratan', 'Desain berwarna-warni', 'Desain disukai auditor']), correctAnswer: 'Desain memenuhi persyaratan' },
  ];
  for (const q of iso9001Course4Questions) {
    await prisma.question.create({ data: { ...q, quizId: iso9001Course4Quiz.id } });
  }
  console.log('ISO 9001 Course 4 quiz added');

  // ISO 9001 Course 5 Quiz - Produksi & Vendor
  const iso9001Course5QuizModule = await prisma.module.create({
    data: { title: 'Module 5.10: Quiz - Produksi & Vendor', order: 10, courseId: iso9001Course5.id },
  });
  const iso9001Course5QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Produksi & Vendor',
      type: 'TEXT',
      content: '# Quiz: Produksi & Vendor\n\nJawablah 10 pertanyaan berikut.',
      order: 1,
      moduleId: iso9001Course5QuizModule.id,
    },
  });
  const iso9001Course5Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Produksi & Vendor', lessonId: iso9001Course5QuizLesson.id },
  });
  const iso9001Course5Questions = [
    { text: 'Supplier dalam istilah ISO disebut...', options: JSON.stringify(['Internal staf', 'External Providers', 'Customers', 'Competitors']), correctAnswer: 'External Providers' },
    { text: 'Nomor Batch pada obat berguna untuk...', options: JSON.stringify(['Mempercantik kemasan', 'Ketertelusuran (Traceability)', 'Menghitung jumlah', 'Iklan']), correctAnswer: 'Ketertelusuran (Traceability)' },
    { text: 'Menjaga data rahasia klien adalah klausa...', options: JSON.stringify(['Customer Property', 'Traceability', 'Design Input', 'Monitoring']), correctAnswer: 'Customer Property' },
    { text: 'Membungkus barang dengan bubble wrap adalah...', options: JSON.stringify(['Identifikasi', 'Preservasi', 'Rilis', 'Audit']), correctAnswer: 'Preservasi' },
    { text: 'Garansi termasuk dalam kegiatan...', options: JSON.stringify(['Desain', 'Pasca Pengiriman', 'Produksi', 'Perencanaan']), correctAnswer: 'Pasca Pengiriman' },
    { text: 'Apa yang dilakukan jika ada barang cacat?', options: JSON.stringify(['Kirim ke pelanggan', 'Kendalikan/Pisahkan', 'Sembunyikan', 'Buang tanpa catatan']), correctAnswer: 'Kendalikan/Pisahkan' },
    { text: 'Rilis Produk dilakukan oleh...', options: JSON.stringify(['Vendor', 'Pelanggan', 'Pihak berwenang/QC', 'Kurir']), correctAnswer: 'Pihak berwenang/QC' },
    { text: 'Memilih vendor berdasarkan performa disebut...', options: JSON.stringify(['Evaluasi Penyedia Eksternal', 'Kontrol Produksi', 'Design Input', 'Tinjauan Manajemen']), correctAnswer: 'Evaluasi Penyedia Eksternal' },
    { text: 'SOP penggunaan mesin adalah bagian dari...', options: JSON.stringify(['Kontrol Produksi', 'Pasca Pengiriman', 'Design Output', 'Audit Internal']), correctAnswer: 'Kontrol Produksi' },
    { text: 'Memberikan spesifikasi detail saat beli barang ke vendor bertujuan...', options: JSON.stringify(['Agar vendor bingung', 'Agar barang tidak salah kirim', 'Menghemat kertas', 'Mengurangi pajak']), correctAnswer: 'Agar barang tidak salah kirim' },
  ];
  for (const q of iso9001Course5Questions) {
    await prisma.question.create({ data: { ...q, quizId: iso9001Course5Quiz.id } });
  }
  console.log('ISO 9001 Course 5 quiz added');

  // ISO 9001 Course 6 Quiz - Evaluasi & Perbaikan
  const iso9001Course6QuizModule = await prisma.module.create({
    data: { title: 'Module 6.10: Quiz - Evaluasi & Perbaikan', order: 10, courseId: iso9001Course6.id },
  });
  const iso9001Course6QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Evaluasi & Perbaikan',
      type: 'TEXT',
      content: '# Quiz: Evaluasi & Perbaikan\n\nJawablah 10 pertanyaan berikut.',
      order: 1,
      moduleId: iso9001Course6QuizModule.id,
    },
  });
  const iso9001Course6Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Evaluasi & Perbaikan', lessonId: iso9001Course6QuizLesson.id },
  });
  const iso9001Course6Questions = [
    { text: 'Mengukur kepuasan pelanggan bisa melalui...', options: JSON.stringify(['Laporan pajak', 'Survei/Kuesioner', 'Audit vendor', 'Daftar hadir']), correctAnswer: 'Survei/Kuesioner' },
    { text: 'Audit Internal dilakukan oleh...', options: JSON.stringify(['Polisi', 'Karyawan sendiri yang terlatih', 'Pelanggan', 'Tetangga']), correctAnswer: 'Karyawan sendiri yang terlatih' },
    { text: 'Rapat pimpinan membahas kinerja sistem disebut...', options: JSON.stringify(['Rapat RT', 'Management Review', 'Audit Eksternal', 'Wawancara kerja']), correctAnswer: 'Management Review' },
    { text: 'Mengatasi penyebab masalah sampai akarnya disebut...', options: JSON.stringify(['Koreksi cepat', 'Corrective Action', 'Design Review', 'Monitoring']), correctAnswer: 'Corrective Action' },
    { text: 'Inti dari Continual Improvement adalah...', options: JSON.stringify(['Menjadi lebih baik terus-menerus', 'Bertahan di posisi yang sama', 'Menambah hutang', 'Mengurangi karyawan']), correctAnswer: 'Menjadi lebih baik terus-menerus' },
    { text: 'Kejadian tidak sesuai prosedur disebut...', options: JSON.stringify(['Peluang', 'Nonconformity', 'Kebijakan', 'Audit Sukses']), correctAnswer: 'Nonconformity' },
    { text: 'Analisis data dilakukan untuk...', options: JSON.stringify(['Membuat grafik indah saja', 'Dasar pengambilan keputusan', 'Menghukum staf', 'Mengisi waktu luang']), correctAnswer: 'Dasar pengambilan keputusan' },
    { text: 'Hasil Audit Internal harus...', options: JSON.stringify(['Ditindaklanjuti', 'Dihapus jika buruk', 'Disimpan selamanya tanpa dibaca', 'Diberikan ke kompetitor']), correctAnswer: 'Ditindaklanjuti' },
    { text: 'Perbaikan sistem operasi (update OS) adalah contoh...', options: JSON.stringify(['Ketidaksesuaian', 'Peningkatan Berkelanjutan', 'Kebijakan Mutu', 'Monitoring']), correctAnswer: 'Peningkatan Berkelanjutan' },
    { text: 'Evaluasi kinerja vendor dilakukan untuk...', options: JSON.stringify(['Mencari kesalahan vendor', 'Memastikan vendor tetap bermutu', 'Mengurangi harga secara paksa', 'Menghindari pajak']), correctAnswer: 'Memastikan vendor tetap bermutu' },
  ];
  for (const q of iso9001Course6Questions) {
    await prisma.question.create({ data: { ...q, quizId: iso9001Course6Quiz.id } });
  }
  console.log('ISO 9001 Course 6 quiz added');

  // ========== ADD QUIZ MODULES TO EACH COURSE ==========
  console.log('\nAdding quiz modules...');

  // Course 1 Quiz
  const course1QuizModule = await prisma.module.create({
    data: { title: 'Module 1.10: Quiz - Foundations of Trust', order: 10, courseId: course1.id },
  });
  const course1QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Foundations of Trust',
      type: 'TEXT',
      content: '# Quiz: Foundations of Trust\n\nJawablah 10 pertanyaan berikut untuk menguji pemahaman Anda tentang dasar-dasar ISO 27001.',
      order: 1,
      moduleId: course1QuizModule.id,
    },
  });
  const course1Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Foundations of Trust', lessonId: course1QuizLesson.id },
  });
  const course1Questions = [
    { text: "Apa kepanjangan dari 'I' dalam CIA Triad?", options: JSON.stringify(['Information', 'Investigation', 'Integrity', 'Intelligence']), correctAnswer: 'Integrity' },
    { text: "Apakah ISO 27001 itu sebuah perangkat lunak (software)?", options: JSON.stringify(['Ya, ini adalah firewall untuk melindungi jaringan', 'Bukan, ini adalah Management System (Sistem Manajemen)', 'Bukan, ini adalah perangkat keras peladen (server)', 'Ya, ini adalah perangkat lunak antivirus generasi terbaru']), correctAnswer: 'Bukan, ini adalah Management System (Sistem Manajemen)' },
    { text: "Apa langkah pertama dalam siklus PDCA?", options: JSON.stringify(['Protect', 'Prevent', 'Proceed', 'Plan']), correctAnswer: 'Plan' },
    { text: "Mengapa komitmen manajemen (Leadership Buy-in) penting?", options: JSON.stringify(['Agar tim IT bisa bekerja tanpa diawasi', 'Untuk menyediakan sumber daya dan membentuk budaya keamanan', 'Untuk menakut-nakuti karyawan agar patuh', 'Hanya sebagai syarat formalitas tanda tangan dokumen']), correctAnswer: 'Untuk menyediakan sumber daya dan membentuk budaya keamanan' },
    { text: "Jika sebuah situs web lambat namun masih bisa diakses, apakah Availability-nya sempurna?", options: JSON.stringify(['Ya, selama tidak mati total', 'Hanya jika situs tersebut tidak diserang peretas', 'Tidak', 'Ya, karena kecepatan tidak ada hubungannya dengan keamanan']), correctAnswer: 'Tidak' },
    { text: "Siapa yang dimaksud dengan Stakeholder (Pemangku Kepentingan)?", options: JSON.stringify(['Hanya tim IT dan Security Officer', 'Siapa saja yang terpengaruh oleh sistem keamanan Anda', 'Peretas yang mencoba mencuri data', 'Hanya investor dan pemilik saham perusahaan']), correctAnswer: 'Siapa saja yang terpengaruh oleh sistem keamanan Anda' },
    { text: "Benar atau Salah: Perusahaan rintisan (startup) kecil tidak membutuhkan ISO 27001.", options: JSON.stringify(['Benar', 'Salah, tetapi hanya jika mereka perusahaan teknologi', 'Benar, kecuali jika mereka memiliki lebih dari 100 karyawan', 'Salah']), correctAnswer: 'Salah' },
    { text: "Apa yang dilakukan pada tahap Check (Periksa) dalam siklus PDCA?", options: JSON.stringify(['Monitoring and Auditing', 'Menulis kode untuk memperbaiki aplikasi', 'Menghapus data pelanggan yang sudah lama', 'Membeli perangkat lunak keamanan baru']), correctAnswer: 'Monitoring and Auditing' },
    { text: "Apakah ISO 27001 hanya mencakup file digital saja?", options: JSON.stringify(['Tidak, hanya mencakup file digital dan perangkat keras saja', 'Ya, 100% hanya tentang data digital di komputer', 'Tidak, mencakup dokumen fisik (kertas) dan manusia juga', 'Ya, hanya mencakup database dan cloud']), correctAnswer: 'Tidak, mencakup dokumen fisik (kertas) dan manusia juga' },
    { text: "Apa itu Confidentiality (Kerahasiaan)?", options: JSON.stringify(['Membuat sistem tidak pernah mati', 'Memastikan hanya orang yang berwenang yang dapat melihat data', 'Menyimpan semua data dalam bentuk fisik agar tidak bisa diretas', 'Menyembunyikan nama perusahaan dari publik']), correctAnswer: 'Memastikan hanya orang yang berwenang yang dapat melihat data' },
  ];
  for (const q of course1Questions) {
    await prisma.question.create({ data: { ...q, quizId: course1Quiz.id } });
  }
  console.log('Course 1 quiz added');

  // Course 2 Quiz
  const course2QuizModule = await prisma.module.create({
    data: { title: 'Module 2.10: Quiz - Defining the Scope', order: 10, courseId: course2.id },
  });
  const course2QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Defining the Scope',
      type: 'TEXT',
      content: '# Quiz: Defining the Scope\n\nJawablah 10 pertanyaan berikut untuk menguji pemahaman Anda tentang menentukan ruang lingkup ISMS.',
      order: 1,
      moduleId: course2QuizModule.id,
    },
  });
  const course2Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Defining the Scope', lessonId: course2QuizLesson.id },
  });
  const course2Questions = [
    { text: "Apa yang dimaksud dengan Information Asset (Aset Informasi)?", options: JSON.stringify(['Hanya komputer dan peladen (server)', 'Apa pun yang memiliki nilai bagi organisasi', 'Hanya aset berbentuk uang di rekening bank perusahaan', 'Hanya dokumen cetak yang ada stempel rahasianya']), correctAnswer: 'Apa pun yang memiliki nilai bagi organisasi' },
    { text: "Apa kepanjangan dari SoA?", options: JSON.stringify(['System of Assets', 'Security of Applications', 'Standard of Auditing', 'Statement of Applicability']), correctAnswer: 'Statement of Applicability' },
    { text: "Bisakah Scope (Ruang Lingkup) hanya diterapkan pada satu departemen saja?", options: JSON.stringify(['Ya', 'Tidak, harus mencakup minimal 3 departemen', 'Tidak, harus diterapkan pada seluruh perusahaan', 'Hanya jika diwajibkan oleh pemerintah']), correctAnswer: 'Ya' },
    { text: "Apakah reputasi merek (brand reputation) termasuk sebagai aset?", options: JSON.stringify(['Tidak, karena tidak berwujud fisik', 'Tidak, itu adalah bagian dari pemasaran, bukan keamanan', 'Ya', 'Hanya jika perusahaan tersebut sudah go public']), correctAnswer: 'Ya' },
    { text: "Manakah yang merupakan contoh dari External Issue (Isu Eksternal)?", options: JSON.stringify(['Karyawan yang sering membagikan kata sandi', 'Undang-undang atau Peraturan Pemerintah (seperti UU PDP)', 'Jaringan WiFi kantor yang sering mati', 'Kerusakan pada mesin absensi sidik jari']), correctAnswer: 'Undang-undang atau Peraturan Pemerintah (seperti UU PDP)' },
    { text: "Mengapa kita membutuhkan Digital Inventory (Inventaris Digital)?", options: JSON.stringify(['Agar komputer berjalan lebih cepat', 'Untuk melaporkan pajak tahunan perusahaan', 'Syarat wajib untuk membeli asuransi kesehatan karyawan', 'Anda tidak bisa melindungi apa yang tidak Anda ketahui keberadaannya']), correctAnswer: 'Anda tidak bisa melindungi apa yang tidak Anda ketahui keberadaannya' },
    { text: "Siapa yang dimaksud dengan Third-Party (Pihak Ketiga)?", options: JSON.stringify(['Vendor atau mitra bisnis', 'Karyawan magang di perusahaan', 'Satpam di pintu depan', 'Auditor internal dari departemen akuntansi']), correctAnswer: 'Vendor atau mitra bisnis' },
    { text: "Apakah data pelanggan termasuk sebagai aset?", options: JSON.stringify(['Hanya jika mereka membayar layanan premium', 'Tidak, itu adalah aset milik pelanggan, bukan milik kita', 'Ya, biasanya itu adalah aset yang paling penting', 'Tidak, kecuali data tersebut dicetak ke atas kertas']), correctAnswer: 'Ya, biasanya itu adalah aset yang paling penting' },
    { text: "Benar atau Salah: Scope (Ruang Lingkup) tidak pernah berubah.", options: JSON.stringify(['Benar', 'Salah', 'Benar, jika perusahaan sudah mendapat sertifikat', 'Salah, tetapi hanya boleh diubah 10 tahun sekali']), correctAnswer: 'Salah' },
    { text: "Apa itu Boundary (Batas) dalam konteks keamanan informasi?", options: JSON.stringify(['Tembok fisik gedung kantor Anda', 'Batas anggaran tahunan untuk departemen IT', 'Kapasitas penyimpanan maksimal pada peladen Anda', 'Batas di mana aturan keamanan Anda berlaku dan tidak berlaku']), correctAnswer: 'Batas di mana aturan keamanan Anda berlaku dan tidak berlaku' },
  ];
  for (const q of course2Questions) {
    await prisma.question.create({ data: { ...q, quizId: course2Quiz.id } });
  }
  console.log('Course 2 quiz added');

  // Course 3 Quiz
  const course3QuizModule = await prisma.module.create({
    data: { title: 'Module 3.10: Quiz - Leadership & Policy', order: 10, courseId: course3.id },
  });
  const course3QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Leadership & Policy',
      type: 'TEXT',
      content: '# Quiz: Leadership & Policy\n\nJawablah 10 pertanyaan berikut untuk menguji pemahaman Anda tentang kepemimpinan dan kebijakan keamanan.',
      order: 1,
      moduleId: course3QuizModule.id,
    },
  });
  const course3Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Leadership & Policy', lessonId: course3QuizLesson.id },
  });
  const course3Questions = [
    { text: "Siapa yang harus menandatangani Security Policy (Kebijakan Keamanan) tingkat tertinggi?", options: JSON.stringify(['Ketua Tim IT', 'Resepsionis', 'Office Boy', 'Manajemen Puncak / Top Management']), correctAnswer: 'Manajemen Puncak / Top Management' },
    { text: "Apa yang dimaksud dengan tujuan operasional yang SMART?", options: JSON.stringify(['Target yang spesifik, terukur, dapat dicapai, relevan, dan terikat waktu', 'Target yang dipikirkan oleh karyawan-karyawan jenius di IT', 'Syarat administrasi minimal untuk lulus audit', 'Tujuan untuk mengamankan 100% sistem tanpa batas waktu']), correctAnswer: 'Target yang spesifik, terukur, dapat dicapai, relevan, dan terikat waktu' },
    { text: "Siapa yang menjadi penanggung jawab utama berjalannya sistem ISMS?", options: JSON.stringify(['Semua karyawan bertanggung jawab secara seimbang tanpa pemimpin', 'Satuan Pengamanan (Satpam) gedung', 'Information Security Officer / Petugas Keamanan Informasi', 'Pihak kepolisian siber']), correctAnswer: 'Information Security Officer / Petugas Keamanan Informasi' },
    { text: "Apakah aturan keamanan berlaku juga untuk CEO?", options: JSON.stringify(['Hanya jika ada auditor eksternal yang datang', 'Ya', 'Tidak, jajaran direksi kebal dari kebijakan', 'Hanya jika CEO tersebut sedang berada di kantor']), correctAnswer: 'Ya' },
    { text: "Mengapa Communication (Komunikasi) sangat vital dalam keamanan?", options: JSON.stringify(['Agar email karyawan tidak pernah kosong', 'Untuk formalitas semata agar terlihat sibuk', 'Agar karyawan saling mengawasi secara sembunyi-sembunyi', 'Untuk memastikan semua orang mengetahui dan memahami aturannya']), correctAnswer: 'Untuk memastikan semua orang mengetahui dan memahami aturannya' },
    { text: "Apa yang dimaksud dengan Enforcement (Penegakan Aturan)?", options: JSON.stringify(['Meminta pertanggungjawaban (tindakan tegas) jika ada yang melanggar aturan', 'Menghapus akun karyawan yang lupa kata sandi', 'Memberikan bonus kepada karyawan yang tidak pernah di-hack', 'Memecat semua vendor pihak ketiga']), correctAnswer: 'Meminta pertanggungjawaban (tindakan tegas) jika ada yang melanggar aturan' },
    { text: "Seberapa sering kebijakan keamanan harus ditinjau ulang (Review)?", options: JSON.stringify(['Setiap hari', 'Sekali dalam sepuluh tahun', 'Minimal setahun sekali', 'Tidak perlu ditinjau jika sudah pernah disetujui']), correctAnswer: 'Minimal setahun sekali' },
    { text: "Apakah Leadership Buy-in (Dukungan Manajemen) hanya tentang memberi uang/anggaran?", options: JSON.stringify(['Ya, anggaran adalah satu-satunya hal yang dibutuhkan dari manajemen', 'Tidak, ini juga tentang memberikan waktu dan dukungan nyata', 'Tidak, ini hanya tentang menandatangani dokumen tanpa peduli isinya', 'Ya, untuk membeli perangkat keras yang mahal']), correctAnswer: 'Tidak, ini juga tentang memberikan waktu dan dukungan nyata' },
    { text: "Manakah di bawah ini yang merupakan contoh kebiasaan keamanan (Security Habit)?", options: JSON.stringify(['Menempelkan kata sandi di layar agar tidak lupa', 'Berbagi akun karyawan agar pekerjaan lebih cepat selesai', 'Menyimpan dokumen rahasia di tong sampah publik', 'Mengunci layar komputer Anda setiap kali beranjak dari meja']), correctAnswer: 'Mengunci layar komputer Anda setiap kali beranjak dari meja' },
    { text: "Bisakah sebuah kebijakan hanya terdiri dari satu halaman saja?", options: JSON.stringify(['Ya, asalkan jelas dan mencakup prinsip tingkat atas', 'Tidak, dokumen ISO minimal harus 50 halaman', 'Ya, tetapi tidak boleh ada tanda baca', 'Tidak, itu melanggar standar internasional']), correctAnswer: 'Ya, asalkan jelas dan mencakup prinsip tingkat atas' },
  ];
  for (const q of course3Questions) {
    await prisma.question.create({ data: { ...q, quizId: course3Quiz.id } });
  }
  console.log('Course 3 quiz added');

  // Course 4 Quiz
  const course4QuizModule = await prisma.module.create({
    data: { title: 'Module 4.10: Quiz - The Risk Engine', order: 10, courseId: course4.id },
  });
  const course4QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: The Risk Engine',
      type: 'TEXT',
      content: '# Quiz: The Risk Engine\n\nJawablah 10 pertanyaan berikut untuk menguji pemahaman Anda tentang mesin risiko ISO 27001.',
      order: 1,
      moduleId: course4QuizModule.id,
    },
  });
  const course4Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: The Risk Engine', lessonId: course4QuizLesson.id },
  });
  const course4Questions = [
    { text: "Apa itu Vulnerability (Kerentanan)?", options: JSON.stringify(['Kelemahan dalam sebuah sistem', 'Anggaran keamanan yang terlalu kecil', 'Orang jahat yang mencoba mencuri data', 'Kata sandi yang terlalu kuat dan sulit diingat']), correctAnswer: 'Kelemahan dalam sebuah sistem' },
    { text: "Apa itu Threat (Ancaman)?", options: JSON.stringify(['Jendela kantor yang tidak bisa dikunci', 'Aplikasi antivirus yang sedang mati', 'Potensi penyebab dari suatu insiden yang tidak diinginkan', 'Sistem operasi yang belum di-update']), correctAnswer: 'Potensi penyebab dari suatu insiden yang tidak diinginkan' },
    { text: "Risiko (Risk) = Dampak (Impact) dikalikan dengan ___?", options: JSON.stringify(['Time (Waktu pengerjaan)', 'Likelihood (Kemungkinan terjadi)', 'Vulnerability (Kerentanan)', 'Money (Uang yang hilang)']), correctAnswer: 'Likelihood (Kemungkinan terjadi)' },
    { text: "Apa yang dimaksud dengan Risk Transfer (Memindahkan Risiko)?", options: JSON.stringify(['Memindahkan server dari lantai 1 ke lantai 2', 'Menerima bahwa risiko tersebut pasti akan terjadi', 'Menghapus risiko tersebut dari daftar sistem', 'Memberikan beban risiko kepada pihak lain, misalnya membeli asuransi']), correctAnswer: 'Memberikan beban risiko kepada pihak lain, misalnya membeli asuransi' },
    { text: "Apa itu Mitigation (Mitigasi)?", options: JSON.stringify(['Mengambil tindakan teknis atau prosedur untuk menurunkan tingkat risiko', 'Membiarkan risiko terjadi karena biayanya murah', 'Mengembalikan data yang hilang setelah diretas', 'Menghentikan total kegiatan bisnis perusahaan']), correctAnswer: 'Mengambil tindakan teknis atau prosedur untuk menurunkan tingkat risiko' },
    { text: "Apa yang dimaksud dengan Risk Register (Daftar Risiko)?", options: JSON.stringify(['Daftar absensi kehadiran karyawan IT', 'Buku tamu untuk pengunjung kantor', 'Daftar utama atau spreadsheet dari semua risiko yang telah diidentifikasi', 'Laporan keuangan bulanan perusahaan']), correctAnswer: 'Daftar utama atau spreadsheet dari semua risiko yang telah diidentifikasi' },
    { text: "Apakah Acceptance (Menerima Risiko) adalah strategi penanganan yang sah?", options: JSON.stringify(['Tidak, menerima risiko akan menggagalkan sertifikasi ISO', 'Ya, khusus untuk risiko dengan tingkat sangat rendah', 'Tidak, semua risiko harus diturunkan menjadi 0%', 'Ya, untuk semua jenis risiko jika kita tidak punya uang']), correctAnswer: 'Ya, khusus untuk risiko dengan tingkat sangat rendah' },
    { text: "Apa yang dimaksud dengan Avoidance (Menghindari Risiko)?", options: JSON.stringify(['Membeli asuransi agar kerugian dibayar', 'Tidak membuka email dari orang asing', 'Berbohong kepada auditor bahwa risiko itu tidak ada', 'Menghilangkan risiko dengan cara menghentikan aktivitas yang berisiko tersebut sama sekali']), correctAnswer: 'Menghilangkan risiko dengan cara menghentikan aktivitas yang berisiko tersebut sama sekali' },
    { text: "Siapa yang dimaksud dengan Risk Owner (Pemilik Risiko)?", options: JSON.stringify(['Orang atau jabatan tertentu yang ditugaskan untuk mengelola risiko tersebut', 'Pihak asuransi yang menanggung biaya', 'Auditor eksternal yang menemukan risiko tersebut', 'Peretas yang membuat ancaman']), correctAnswer: 'Orang atau jabatan tertentu yang ditugaskan untuk mengelola risiko tersebut' },
    { text: "Benar atau Salah: Anda dapat menghilangkan 100% risiko keamanan.", options: JSON.stringify(['Benar', 'Salah, kecuali Anda menggunakan AI terbaru', 'Salah', 'Benar, jika perusahaan tidak terkoneksi ke internet sama sekali']), correctAnswer: 'Salah' },
  ];
  for (const q of course4Questions) {
    await prisma.question.create({ data: { ...q, quizId: course4Quiz.id } });
  }
  console.log('Course 4 quiz added');

  // Course 5 Quiz
  const course5QuizModule = await prisma.module.create({
    data: { title: 'Module 5.10: Quiz - Human Resources Security', order: 10, courseId: course5.id },
  });
  const course5QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Human Resources Security',
      type: 'TEXT',
      content: '# Quiz: Human Resources Security\n\nJawablah 10 pertanyaan berikut untuk menguji pemahaman Anda tentang keamanan sumber daya manusia.',
      order: 1,
      moduleId: course5QuizModule.id,
    },
  });
  const course5Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Human Resources Security', lessonId: course5QuizLesson.id },
  });
  const course5Questions = [
    { text: "Mengapa kita perlu menyaring (Screening) karyawan baru?", options: JSON.stringify(['Agar bagian HRD terlihat sibuk', 'Untuk mengetahui siapa yang paling jago mengetik', 'Untuk memastikan mereka adalah orang yang dapat dipercaya sebelum memegang data', 'Sebagai syarat untuk mendapatkan kartu diskon karyawan']), correctAnswer: 'Untuk memastikan mereka adalah orang yang dapat dipercaya sebelum memegang data' },
    { text: "Apa itu Onboarding dalam konteks keamanan?", options: JSON.stringify(['Acara makan-makan menyambut karyawan baru', 'Proses karyawan baru mulai bekerja dan mempelajari aturan keamanan perusahaan', 'Mendaftarkan alamat email karyawan ke banyak newsletter', 'Proses memecat karyawan yang melanggar aturan']), correctAnswer: 'Proses karyawan baru mulai bekerja dan mempelajari aturan keamanan perusahaan' },
    { text: "Apa itu Phishing?", options: JSON.stringify(['Kesempatan memancing ikan di kolam kantor', 'Jenis virus yang merusak perangkat keras (layar, keyboard)', 'Proses mencadangkan (backup) data ke flashdisk', 'Email palsu/tipuan yang digunakan untuk mencuri data atau kata sandi']), correctAnswer: 'Email palsu/tipuan yang digunakan untuk mencuri data atau kata sandi' },
    { text: "Kapan akses digital harus dicabut untuk karyawan yang resign (mengundurkan diri)?", options: JSON.stringify(['Segera / langsung pada hari terakhir mereka', 'Setelah satu bulan agar mereka bisa menyalin file pribadi', 'Menunggu sampai karyawan penggantinya masuk', 'Hanya setelah akhir tahun keuangan ditutup']), correctAnswer: 'Segera / langsung pada hari terakhir mereka' },
    { text: "Apa kepanjangan dari NDA?", options: JSON.stringify(['Network Data Access', 'National Digital Authority', 'Non-Disclosure Agreement (Perjanjian Kerahasiaan)', 'New Data Assessment']), correctAnswer: 'Non-Disclosure Agreement (Perjanjian Kerahasiaan)' },
    { text: "Benar atau Salah: Pelatihan keamanan (Awareness Training) cukup dilakukan sekali saja saat masuk kerja.", options: JSON.stringify(['Benar, karena aturannya tidak pernah berubah', 'Salah, pelatihan harus dilakukan secara berkala', 'Benar, kecuali karyawannya amnesia', 'Salah, pelatihan harus dilakukan setiap hari tanpa libur']), correctAnswer: 'Salah, pelatihan harus dilakukan secara berkala' },
    { text: "Apa yang dimaksud dengan Human Firewall (Tembok Api Manusia)?", options: JSON.stringify(['Karyawan yang tubuhnya ditanam microchip keamanan', 'Satpam yang berjaga di ruang server', 'Aplikasi HRD untuk mengunci komputer karyawan', 'Karyawan yang sadar, terlatih, dan waspada terhadap ancaman keamanan']), correctAnswer: 'Karyawan yang sadar, terlatih, dan waspada terhadap ancaman keamanan' },
    { text: "Mengapa penting untuk melaporkan kesalahan yang tidak disengaja (misal: mengklik link berbahaya)?", options: JSON.stringify(['Agar karyawan tersebut bisa segera dipecat', 'Agar gajinya bisa dipotong bulan itu', 'Untuk memperbaikinya sebelum berubah menjadi bencana besar', 'Sebagai bahan gosip di kantor']), correctAnswer: 'Untuk memperbaikinya sebelum berubah menjadi bencana besar' },
    { text: "Apakah kontraktor pihak ketiga juga harus dilatih atau diberi pemahaman keamanan?", options: JSON.stringify(['Tidak, mereka bukan karyawan resmi', 'Hanya jika mereka dibayar mahal', 'Ya', 'Tidak, itu tanggung jawab perusahaan asal mereka']), correctAnswer: 'Ya' },
    { text: "Apa tujuan utama dari HR Security (Keamanan Sumber Daya Manusia)?", options: JSON.stringify(['Mengamankan sistem pelgajian (payroll) dari tim IT', 'Mengelola risiko-risiko keamanan yang berkaitan dengan manusia/karyawan', 'Mencegah karyawan untuk resign', 'Menghindari pajak ketenagakerjaan']), correctAnswer: 'Mengelola risiko-risiko keamanan yang berkaitan dengan manusia/karyawan' },
  ];
  for (const q of course5Questions) {
    await prisma.question.create({ data: { ...q, quizId: course5Quiz.id } });
  }
  console.log('Course 5 quiz added');

  // Course 6 Quiz
  const course6QuizModule = await prisma.module.create({
    data: { title: 'Module 6.10: Quiz - Operations & Tech', order: 10, courseId: course6.id },
  });
  const course6QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Operations & Tech',
      type: 'TEXT',
      content: '# Quiz: Operations & Tech\n\nJawablah 10 pertanyaan berikut untuk menguji pemahaman Anda tentang operasi dan teknologi keamanan.',
      order: 1,
      moduleId: course6QuizModule.id,
    },
  });
  const course6Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Operations & Tech', lessonId: course6QuizLesson.id },
  });
  const course6Questions = [
    { text: "Mengapa kita perlu mencadangkan (back up) data?", options: JSON.stringify(['Agar memori komputer tidak cepat penuh', 'Untuk memulihkannya jika data aslinya hilang atau dicuri', 'Untuk dijual ke pihak ketiga', 'Agar internet kantor berjalan lebih stabil']), correctAnswer: 'Untuk memulihkannya jika data aslinya hilang atau dicuri' },
    { text: "Apa itu Patch (Tambalan)?", options: JSON.stringify(['Stiker untuk menutupi webcam di laptop', 'Fitur untuk mengubah warna background aplikasi', 'Alat fisik untuk memperbaiki kabel LAN yang putus', 'Pembaruan perangkat lunak untuk menutupi celah/lubang keamanan']), correctAnswer: 'Pembaruan perangkat lunak untuk menutupi celah/lubang keamanan' },
    { text: "Apa yang dimaksud dengan Logging?", options: JSON.stringify(['Merekam/mencatat aktivitas dan peristiwa yang terjadi di dalam sistem', 'Masuk ke dalam aplikasi menggunakan username dan password', 'Menghapus jejak sejarah (history) browser', 'Proses menebang kayu secara virtual']), correctAnswer: 'Merekam/mencatat aktivitas dan peristiwa yang terjadi di dalam sistem' },
    { text: "Mengapa kita harus memisahkan lingkungan pengembangan (Dev) dan produksi (Production)?", options: JSON.stringify(['Agar tim IT memiliki lebih banyak komputer untuk bermain', 'Karena pemerintah mewajibkan dua ruangan yang berbeda', 'Untuk menghindari pembaruan yang rusak agar tidak menghancurkan situs/aplikasi yang sedang berjalan', 'Untuk menghemat tagihan listrik']), correctAnswer: 'Untuk menghindari pembaruan yang rusak agar tidak menghancurkan situs/aplikasi yang sedang berjalan' },
    { text: "Apa itu Malware?", options: JSON.stringify(['Perangkat keras yang mudah rusak', 'Perangkat lunak yang dirancang untuk menyebabkan kerusakan atau pencurian', 'Tipe kabel jaringan yang harganya murah', 'Aplikasi resmi dari pemerintah']), correctAnswer: 'Perangkat lunak yang dirancang untuk menyebabkan kerusakan atau pencurian' },
    { text: "Mengapa mencadangkan data tidak cukup, dan kita harus melakukan Backup Testing (Uji Coba)?", options: JSON.stringify(['Agar proses backup menjadi lebih cepat', 'Untuk memformat hard drive secara permanen', 'Sebagai cara menghapus virus yang menempel di backup', 'Untuk memastikan data cadangan tersebut benar-benar bisa dipulihkan/dibuka saat dibutuhkan']), correctAnswer: 'Untuk memastikan data cadangan tersebut benar-benar bisa dipulihkan/dibuka saat dibutuhkan' },
    { text: "Apa itu Change Management (Manajemen Perubahan)?", options: JSON.stringify(['Proses formal, pengujian, dan persetujuan sebelum membuat pembaruan ke sistem yang sedang berjalan', 'Mengubah kata sandi secara paksa setiap minggu', 'Mengganti karyawan IT lama dengan yang baru', 'Proses menukar laptop lama dengan yang baru']), correctAnswer: 'Proses formal, pengujian, dan persetujuan sebelum membuat pembaruan ke sistem yang sedang berjalan' },
    { text: "Mengapa Clock Sync (Sinkronisasi Waktu) antar server sangat penting?", options: JSON.stringify(['Agar alarm istirahat karyawan berbunyi bersamaan', 'Untuk mempercepat koneksi internet', 'Untuk memastikan catatan aktivitas (logs) berada dalam urutan kronologis yang akurat jika terjadi investigasi', 'Agar server tidak terlalu panas']), correctAnswer: 'Untuk memastikan catatan aktivitas (logs) berada dalam urutan kronologis yang akurat jika terjadi investigasi' },
    { text: "Apa itu Capacity Planning (Perencanaan Kapasitas)?", options: JSON.stringify(['Menghitung jumlah bangku di ruang meeting', 'Memastikan jumlah dan kekuatan sistem cukup untuk menangani beban aktivitas (load) pengguna', 'Rencana mengurangi jumlah karyawan agar ruangan luas', 'Mengukur panjang kabel jaringan']), correctAnswer: 'Memastikan jumlah dan kekuatan sistem cukup untuk menangani beban aktivitas (load) pengguna' },
    { text: "Apakah memiliki perangkat lunak Antivirus sudah cukup untuk keamanan operasional?", options: JSON.stringify(['Ya, antivirus adalah pertahanan mutlak', 'Ya, selama itu versi berbayar yang mahal', 'Tidak, antivirus sebenarnya berbahaya', 'Tidak, Anda membutuhkan lapisan perlindungan berlapis (seperti firewall, patching, kesadaran manusia)']), correctAnswer: 'Tidak, Anda membutuhkan lapisan perlindungan berlapis (seperti firewall, patching, kesadaran manusia)' },
  ];
  for (const q of course6Questions) {
    await prisma.question.create({ data: { ...q, quizId: course6Quiz.id } });
  }
  console.log('Course 6 quiz added');

  // Course 7 Quiz
  const course7QuizModule = await prisma.module.create({
    data: { title: 'Module 7.10: Quiz - Access & Identity', order: 10, courseId: course7.id },
  });
  const course7QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Access & Identity',
      type: 'TEXT',
      content: '# Quiz: Access & Identity\n\nJawablah 10 pertanyaan berikut untuk menguji pemahaman Anda tentang manajemen akses dan identitas.',
      order: 1,
      moduleId: course7QuizModule.id,
    },
  });
  const course7Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Access & Identity', lessonId: course7QuizLesson.id },
  });
  const course7Questions = [
    { text: "Apa itu Least Privilege (Hak Akses Minimal)?", options: JSON.stringify(['Menghukum karyawan dengan mengambil semua akses mereka', 'Memberikan akses Admin kepada semua orang agar praktis', 'Memotong gaji karyawan tingkat paling bawah', 'Memberikan pengguna akses minimum yang hanya mereka butuhkan untuk melakukan pekerjaan mereka']), correctAnswer: 'Memberikan pengguna akses minimum yang hanya mereka butuhkan untuk melakukan pekerjaan mereka' },
    { text: "Apa kepanjangan dari MFA?", options: JSON.stringify(['Multi-Factor Authentication (Otentikasi Multi-Faktor)', 'Main File Access', 'Multiple Folder Authorization', 'Mobile Phone Application']), correctAnswer: 'Multi-Factor Authentication (Otentikasi Multi-Faktor)' },
    { text: "Manakah yang merupakan contoh Faktor Kedua dalam otentikasi?", options: JSON.stringify(['Kata sandi lama Anda', 'Mengetik ulang password sebanyak dua kali', 'Kode SMS atau aplikasi Authenticator di ponsel Anda', 'Nama gadis ibu kandung Anda']), correctAnswer: 'Kode SMS atau aplikasi Authenticator di ponsel Anda' },
    { text: "Mengapa penting untuk melakukan peninjauan akses (Access Reviews) secara rutin?", options: JSON.stringify(['Untuk menambah jumlah kata sandi karyawan', 'Untuk menghapus akses orang-orang yang sudah tidak membutuhkannya lagi (pindah departemen/keluar)', 'Agar sistem berjalan lebih ringan', 'Untuk menagih biaya langganan perangkat lunak']), correctAnswer: 'Untuk menghapus akses orang-orang yang sudah tidak membutuhkannya lagi (pindah departemen/keluar)' },
    { text: "Siapakah yang disebut sebagai Privileged User (Pengguna Istimewa)?", options: JSON.stringify(['Karyawan yang mendapatkan fasilitas mobil kantor', 'Pelanggan VIP', 'Penjaga keamanan di lobi', 'Seseorang yang memiliki akses dan kekuatan ekstra di dalam sistem, seperti Admin IT']), correctAnswer: 'Seseorang yang memiliki akses dan kekuatan ekstra di dalam sistem, seperti Admin IT' },
    { text: "Apa yang dimaksud dengan Clean Desk (Meja Bersih)?", options: JSON.stringify(['Membersihkan/mengamankan informasi sensitif (seperti dokumen atau password) dari ruang kerja fisik Anda', 'Mengelap meja dengan disinfektan setiap pagi', 'Tidak membawa makanan ke dalam ruang kerja', 'Menghapus cache dan history di browser komputer']), correctAnswer: 'Membersihkan/mengamankan informasi sensitif (seperti dokumen atau password) dari ruang kerja fisik Anda' },
    { text: "Mengapa Anda harus mengunci layar (Clear Screen) saat beranjak dari meja?", options: JSON.stringify(['Untuk menghemat baterai/listrik', 'Agar layar komputer tidak cepat rusak', 'Untuk mencegah orang yang lewat menggunakan akun/komputer Anda tanpa izin', 'Untuk mengaktifkan mode pembaruan Windows']), correctAnswer: 'Untuk mencegah orang yang lewat menggunakan akun/komputer Anda tanpa izin' },
    { text: "Benar atau Salah: Berbagi kata sandi dengan rekan satu tim diperbolehkan jika pekerjaannya mendesak.", options: JSON.stringify(['Benar', 'Salah', 'Benar, asalkan dicatat di papan tulis', 'Benar, selama rekan tersebut memiliki jabatan yang sama']), correctAnswer: 'Salah' },
    { text: "Apa itu Identity (Identitas digital)?", options: JSON.stringify(['Kartu Tanda Penduduk (KTP) fisik', 'Foto profil di media sosial', 'Alamat IP dari kantor', 'Catatan digital unik (seperti akun username) dari seorang pengguna tertentu']), correctAnswer: 'Catatan digital unik (seperti akun username) dari seorang pengguna tertentu' },
    { text: "Apakah sidik jari (biometrik) dihitung sebagai bentuk otentikasi/verifikasi identitas?", options: JSON.stringify(['Ya', 'Tidak, karena mudah dipalsukan', 'Tidak, itu hanya berlaku di film', 'Ya, tetapi hanya untuk membuka kunci brankas baja']), correctAnswer: 'Ya' },
  ];
  for (const q of course7Questions) {
    await prisma.question.create({ data: { ...q, quizId: course7Quiz.id } });
  }
  console.log('Course 7 quiz added');

  // Course 8 Quiz
  const course8QuizModule = await prisma.module.create({
    data: { title: 'Module 8.10: Quiz - Physical Security', order: 10, courseId: course8.id },
  });
  const course8QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Physical Security',
      type: 'TEXT',
      content: '# Quiz: Physical Security\n\nJawablah 10 pertanyaan berikut untuk menguji pemahaman Anda tentang keamanan fisik.',
      order: 1,
      moduleId: course8QuizModule.id,
    },
  });
  const course8Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Physical Security', lessonId: course8QuizLesson.id },
  });
  const course8Questions = [
    { text: "Apa yang dimaksud dengan Perimeter dalam keamanan fisik?", options: JSON.stringify(['Area parkir bawah tanah', 'Batas luar dari area yang diamankan (seperti pagar, tembok, atau pintu utama)', 'Kamera CCTV yang mengawasi ruangan', 'Antivirus yang menjaga batas komputer']), correctAnswer: 'Batas luar dari area yang diamankan (seperti pagar, tembok, atau pintu utama)' },
    { text: "Bolehkah pengunjung/tamu dibiarkan berjalan sendirian di dalam area kantor?", options: JSON.stringify(['Ya, asalkan mereka sudah mengisi buku tamu', 'Ya, selama mereka memakai ID Card Tamu', 'Tidak, kecuali mereka membawa makanan', 'Tidak, mereka harus selalu dikawal']), correctAnswer: 'Tidak, mereka harus selalu dikawal' },
    { text: "Apa kepanjangan dari UPS (terkait listrik)?", options: JSON.stringify(['Uninterruptible Power Supply (Sistem Cadangan Daya/Baterai)', 'United Parcel Service (Jasa Pengiriman)', 'Universal Power Switch', 'Underground Protection System']), correctAnswer: 'Uninterruptible Power Supply (Sistem Cadangan Daya/Baterai)' },
    { text: "Mengapa penting untuk wipe hard drive sebelum membuangnya?", options: JSON.stringify(['Agar hard drive terlihat bersih saat dijual kiloan', 'Agar berat hard drive menjadi lebih ringan', 'Untuk memastikan tidak ada data lama yang dapat dipulihkan atau dicuri dari tempat sampah', 'Untuk menghindari korsleting listrik di tempat sampah']), correctAnswer: 'Untuk memastikan tidak ada data lama yang dapat dipulihkan atau dicuri dari tempat sampah' },
    { text: "Apa itu Siting dalam konteks penempatan server?", options: JSON.stringify(['Membuat situs web (website) untuk perusahaan', 'Memilih tempat/ruangan yang aman, dingin, dan kering untuk meletakkan peralatan IT penting', 'Menata meja karyawan agar terlihat rapi', 'Mengarahkan antenna WiFi ke arah karyawan']), correctAnswer: 'Memilih tempat/ruangan yang aman, dingin, dan kering untuk meletakkan peralatan IT penting' },
    { text: "Dapatkah kantor di rumah (home office) menjadi bagian dari ruang lingkup (scope) ISO 27001?", options: JSON.stringify(['Tidak, ISO hanya untuk gedung komersial', 'Tidak, kecuali di rumah tersebut tidak ada keluarga lain', 'Ya, tetapi auditor harus tidur di rumah tersebut', 'Ya']), correctAnswer: 'Ya' },
    { text: "Mengapa kabel jaringan (Cabling) harus dilindungi?", options: JSON.stringify(['Untuk mencegah pemadaman karena tersandung atau penyadapan/pemotongan data yang disengaja', 'Agar terlihat lebih rapi dan estetis saja', 'Untuk mencegah tikus berkembang biak', 'Agar kabel tidak melengkung dan data mengalir lebih cepat']), correctAnswer: 'Untuk mencegah pemadaman karena tersandung atau penyadapan/pemotongan data yang disengaja' },
    { text: "Apakah sekadar pintu yang dikunci sudah cukup untuk keamanan fisik ISO 27001?", options: JSON.stringify(['Ya, itu sudah lulus standar internasional 100%', 'Tidak, pintu kantor dilarang dikunci agar terbuka untuk pelanggan', 'Itu awal yang baik, tetapi keamanan fisik membutuhkan lapisan perlindungan lainnya (seperti CCTV atau alarm)', 'Ya, selama kuncinya terbuat dari emas']), correctAnswer: 'Itu awal yang baik, tetapi keamanan fisik membutuhkan lapisan perlindungan lainnya (seperti CCTV atau alarm)' },
    { text: "Apa yang dimaksud dengan Disposal (Pembuangan Peralatan)?", options: JSON.stringify(['Proses memecat karyawan', 'Proses dan prosedur yang aman dalam menyingkirkan peralatan IT atau dokumen yang sudah tua', 'Membuang sampah dapur kantor', 'Menyembunyikan kabel yang berantakan']), correctAnswer: 'Proses dan prosedur yang aman dalam menyingkirkan peralatan IT atau dokumen yang sudah tua' },
    { text: "Benar atau Salah: Menghancurkan kertas cetakan (shredding) dengan mesin penghancur adalah bagian dari ISO 27001.", options: JSON.stringify(['Salah, ISO 27001 tidak peduli dengan kertas', 'Salah, kertas harus selalu dibakar', 'Benar, tetapi hanya untuk kertas berlogo perusahaan', 'Benar']), correctAnswer: 'Benar' },
  ];
  for (const q of course8Questions) {
    await prisma.question.create({ data: { ...q, quizId: course8Quiz.id } });
  }
  console.log('Course 8 quiz added');

  // Course 9 Quiz
  const course9QuizModule = await prisma.module.create({
    data: { title: 'Module 9.10: Quiz - Incident Management', order: 10, courseId: course9.id },
  });
  const course9QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: Incident Management',
      type: 'TEXT',
      content: '# Quiz: Incident Management\n\nJawablah 10 pertanyaan berikut untuk menguji pemahaman Anda tentang manajemen insiden keamanan.',
      order: 1,
      moduleId: course9QuizModule.id,
    },
  });
  const course9Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: Incident Management', lessonId: course9QuizLesson.id },
  });
  const course9Questions = [
    { text: "Apakah pemadaman listrik yang mematikan server dihitung sebagai Insiden Keamanan?", options: JSON.stringify(['Tidak, karena bukan disebabkan oleh hacker', 'Tidak, itu adalah masalah PLN, bukan masalah keamanan perusahaan', 'Ya, karena hal tersebut merusak pilar Availability (Ketersediaan)', 'Ya, tetapi hanya jika mati listrik lebih dari 3 hari']), correctAnswer: 'Ya, karena hal tersebut merusak pilar Availability (Ketersediaan)' },
    { text: "Kapan Anda harus melaporkan kecurigaan terjadinya sebuah insiden keamanan?", options: JSON.stringify(['Setelah Anda mencoba memperbaikinya sendiri selama beberapa jam', 'Segera / secepat mungkin', 'Menunggu jam pulang kerja agar tidak mengganggu operasional', 'Menunggu hari Senin saat rapat mingguan']), correctAnswer: 'Segera / secepat mungkin' },
    { text: "Apa yang dimaksud dengan Containment (Pengekangan/Isolasi)?", options: JSON.stringify(['Menyimpan backup data ke dalam kontainer', 'Membayar uang tebusan kepada pembuat ransomware', 'Mengurung karyawan yang melakukan kesalahan di ruangan tertutup', 'Mengambil langkah agar masalah tidak menyebar menjadi lebih besar (misal: mencabut kabel LAN dari PC yang terinfeksi)']), correctAnswer: 'Mengambil langkah agar masalah tidak menyebar menjadi lebih besar (misal: mencabut kabel LAN dari PC yang terinfeksi)' },
    { text: "Mengapa penting untuk menyimpan barang bukti (Evidence) seperti log komputer setelah insiden?", options: JSON.stringify(['Agar kita bisa menjual data tersebut di dark web', 'Untuk bahan investigasi mencari tahu bagaimana peretas masuk, atau untuk kebutuhan hukum (kepolisian)', 'Karena memori komputer masih luas', 'Sebagai kenang-kenangan untuk tim IT']), correctAnswer: 'Untuk bahan investigasi mencari tahu bagaimana peretas masuk, atau untuk kebutuhan hukum (kepolisian)' },
    { text: "Apa itu Lesson Learned (Pelajaran yang Dipetik)?", options: JSON.stringify(['Menghukum orang yang pertama kali menemukan insiden', 'Menemukan akar masalah dan memperbaikinya agar kesalahan yang sama tidak terulang kembali di masa depan', 'Proses merekrut karyawan IT baru', 'Menutupi insiden agar perusahaan tidak malu']), correctAnswer: 'Menemukan akar masalah dan memperbaikinya agar kesalahan yang sama tidak terulang kembali di masa depan' },
    { text: "Kepada siapakah Anda harus melaporkan insiden keamanan?", options: JSON.stringify(['Ke media sosial pribadi', 'Ke nomor darurat 112', 'Kepada tim keamanan/IT yang telah ditunjuk resmi', 'Ke seluruh rekan kerja di grup WhatsApp kantor']), correctAnswer: 'Kepada tim keamanan/IT yang telah ditunjuk resmi' },
    { text: "Apakah kehilangan ID Badge (kartu akses masuk) termasuk sebagai insiden keamanan?", options: JSON.stringify(['Tidak, karena bisa dicetak ulang dengan murah', 'Ya', 'Tidak, selama karyawan itu masih hafal jalannya', 'Ya, tetapi hanya jika kartu tersebut terbuat dari plastik']), correctAnswer: 'Ya' },
    { text: "Benar atau Salah: Menyembunyikan fakta bahwa sistem kita telah diretas adalah ide yang bagus untuk melindungi citra perusahaan.", options: JSON.stringify(['Benar, agar pelanggan tidak kabur', 'Benar, jika peretasnya setuju untuk diam', 'Salah, karena memperburuk dampak dan berpotensi melanggar hukum', 'Salah, kecuali jika peretas hanya mengambil sedikit data']), correctAnswer: 'Salah, karena memperburuk dampak dan berpotensi melanggar hukum' },
    { text: "Apa yang dimaksud dengan fase Recovery (Pemulihan)?", options: JSON.stringify(['Menangkap pelaku peretasan secara fisik', 'Mengembalikan sistem dan operasional bisnis agar kembali berjalan normal', 'Mengklaim uang ganti rugi dari asuransi', 'Menghapus semua file yang tersisa dan menutup perusahaan']), correctAnswer: 'Mengembalikan sistem dan operasional bisnis agar kembali berjalan normal' },
    { text: "Apa fungsi dari Incident Log (Buku Catatan Insiden)?", options: JSON.stringify(['Mencatat jam masuk dan pulang satpam', 'Daftar peretas yang diincar kepolisian', 'Catatan pengunjung yang masuk ke lobi gedung', 'Mencatat semua insiden yang pernah terjadi agar bisa dianalisis tren kerentanannya']), correctAnswer: 'Mencatat semua insiden yang pernah terjadi agar bisa dianalisis tren kerentanannya' },
  ];
  for (const q of course9Questions) {
    await prisma.question.create({ data: { ...q, quizId: course9Quiz.id } });
  }
  console.log('Course 9 quiz added');

  // Course 10 Quiz
  const course10QuizModule = await prisma.module.create({
    data: { title: 'Module 10.10: Quiz - The Finish Line', order: 10, courseId: course10.id },
  });
  const course10QuizLesson = await prisma.lesson.create({
    data: {
      title: 'Quiz: The Finish Line',
      type: 'TEXT',
      content: '# Quiz: The Finish Line\n\nJawablah 10 pertanyaan berikut untuk menguji pemahaman Anda tentang audit dan sertifikasi ISO 27001.',
      order: 1,
      moduleId: course10QuizModule.id,
    },
  });
  const course10Quiz = await prisma.quiz.create({
    data: { title: 'Quiz: The Finish Line', lessonId: course10QuizLesson.id },
  });
  const course10Questions = [
    { text: "Apa itu Internal Audit (Audit Internal)?", options: JSON.stringify(['Audit pajak oleh Kementerian Keuangan', 'Pengecekan / simulasi sistem yang dilakukan oleh orang dalam perusahaan sendiri sebelum ujian sebenarnya', 'Tim IT meretas sistemnya sendiri untuk bersenang-senang', 'Pemeriksaan kehadiran karyawan secara diam-diam']), correctAnswer: 'Pengecekan / simulasi sistem yang dilakukan oleh orang dalam perusahaan sendiri sebelum ujian sebenarnya' },
    { text: "Apa arti dari kata Non-Conformity (Ketidaksesuaian)?", options: JSON.stringify(['Karyawan yang tidak menggunakan seragam kantor', 'Sertifikat ISO yang dicetak di kertas murah', 'Adanya aturan sistem yang gagal dipenuhi atau dilanggar (sesuatu yang rusak)', 'Lulus ujian ISO dengan nilai pas-pasan']), correctAnswer: 'Adanya aturan sistem yang gagal dipenuhi atau dilanggar (sesuatu yang rusak)' },
    { text: "Apa yang dimaksud dengan Corrective Action (Tindakan Perbaikan)?", options: JSON.stringify(['Menghukum karyawan yang gagal saat audit', 'Langkah yang diambil untuk memperbaiki akar penyebab masalah agar tidak terulang', 'Menyogok auditor eksternal agar lulus', 'Mengganti sistem ISO 27001 dengan sistem lain']), correctAnswer: 'Langkah yang diambil untuk memperbaiki akar penyebab masalah agar tidak terulang' },
    { text: "Apa yang terjadi pada Audit Eksternal Stage 1?", options: JSON.stringify(['Auditor mencoba meretas website perusahaan secara langsung', 'Auditor membagikan sertifikat kebanggaan', 'Auditor memeriksa kabel jaringan di atas plafon gedung', 'Auditor fokus pada peninjauan dokumen, kebijakan, dan kelengkapan administrasi Anda di atas kertas']), correctAnswer: 'Auditor fokus pada peninjauan dokumen, kebijakan, dan kelengkapan administrasi Anda di atas kertas' },
    { text: "Apa yang terjadi pada Audit Eksternal Stage 2?", options: JSON.stringify(['Auditor memeriksa bukti lapangan dan operasional, memastikan Anda benar-benar melakukan apa yang tertulis di kebijakan', 'Pemeriksaan ulang dokumen karena ada yang salah ketik', 'Mengundang media massa untuk peliputan', 'Auditor mewawancarai pelanggan perusahaan']), correctAnswer: 'Auditor memeriksa bukti lapangan dan operasional, memastikan Anda benar-benar melakukan apa yang tertulis di kebijakan' },
    { text: "Berapa lama masa berlaku sertifikat ISO 27001?", options: JSON.stringify(['Berlaku seumur hidup', '1 tahun, dan harus mengulang proses dari awal tahun depan', '3 tahun, namun ada pemeriksaan (surveillance) rutin setiap tahun', '5 tahun tanpa pemeriksaan lanjutan']), correctAnswer: '3 tahun, namun ada pemeriksaan (surveillance) rutin setiap tahun' },
    { text: "Apa inti dari konsep Continuous Improvement (Peningkatan Berkelanjutan)?", options: JSON.stringify(['Harus membeli software IT keluaran terbaru setiap bulan', 'Kesadaran bahwa sistem tidak pernah sempurna dan harus selalu dibuat lebih baik seiring waktu', 'Harus merekrut karyawan IT baru setiap tahun', 'Menambah jumlah kebijakan hingga ribuan halaman']), correctAnswer: 'Kesadaran bahwa sistem tidak pernah sempurna dan harus selalu dibuat lebih baik seiring waktu' },
    { text: "Siapa yang berhak melakukan Audit Eksternal dan memberikan sertifikat sah?", options: JSON.stringify(['CEO perusahaan', 'Petugas kepolisian setempat', 'Badan Sertifikasi (Certification Body) independen pihak ketiga yang terakreditasi', 'Pemegang saham terbesar']), correctAnswer: 'Badan Sertifikasi (Certification Body) independen pihak ketiga yang terakreditasi' },
    { text: "Apakah proses audit itu sesuatu yang menakutkan dan bertujuan mencari kesalahan karyawan?", options: JSON.stringify(['Ya, tujuannya murni untuk mencari alasan memecat karyawan IT', 'Tidak, ini hanyalah verifikasi untuk memastikan sistem berjalan dan mencari peluang perbaikan', 'Ya, karena auditor akan memberikan denda uang', 'Tidak, karena auditor bisa dibayar untuk diam']), correctAnswer: 'Tidak, ini hanyalah verifikasi untuk memastikan sistem berjalan dan mencari peluang perbaikan' },
    { text: "Apa tujuan akhir atau garis finis sesungguhnya dari ISO 27001?", options: JSON.stringify(['Sekadar mendapatkan logo untuk dipajang di website pemasaran', 'Memiliki departemen IT yang paling mahal di industri', 'Menggantikan peran manusia dengan sistem keamanan AI otomatis', 'Membangun organisasi yang sangat aman, tangguh, dan dapat dipercaya']), correctAnswer: 'Membangun organisasi yang sangat aman, tangguh, dan dapat dipercaya' },
  ];
  for (const q of course10Questions) {
    await prisma.question.create({ data: { ...q, quizId: course10Quiz.id } });
  }
  console.log('Course 10 quiz added');

  console.log('\n=== DATABASE SEEDED SUCCESSFULLY ===');
  console.log('Total: 22 courses, 216 modules, 216 lessons, 22 quizzes, 220 questions');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });