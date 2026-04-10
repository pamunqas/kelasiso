import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const lessonContents: Record<string, Record<number, string>> = {
  'clause-4-context-organization': {
    1: `<h2>Pendahuluan Konteks Organisasi</h2>
<p>Klausul 4 ISO 27001 mengharuskan organisasi untuk memahami konteks internal dan eksternal tempat Information Security Management System (ISMS) beroperasi. Pemahaman ini menjadi fondasi untuk menentukan arah strategis keamanan informasi.</p>
<p>Organisasi harus mempertimbangkan berbagai faktor yang dapat mempengaruhi kemampuan mereka dalam mencapai tujuan keamanan informasi. Faktor-faktor ini meliputi kondisi pasar, regulasi yang berlaku, dan kebutuhan bisnis yang terus berkembang.</p>
<p>Dengan memahami konteks secara menyeluruh, organisasi dapat mengidentifikasi peluang dan ancaman yang relevan, serta memastikan bahwa ISMS selaras dengan strategi bisnis secara keseluruhan.</p>`,
    2: `<h2>Lingkungan Internal Organisasi</h2>
<p>Lingkungan internal mencakup semua aspek yang berada dalam kendali organisasi. Faktor-faktor penting meliputi budaya organisasi yang memengaruhi bagaimana keamanan informasi dipahami dan diterapkan sehari-hari.</p>
<p>Struktur governance organisasi menentukan bagaimana keputusan keamanan diambil dan siapa yang bertanggung jawab. Proses bisnis yang ada harus diintegrasikan dengan kontrol keamanan untuk memastikan kelancaran operasional.</p>
<p>Sumber daya yang tersedia, baik manusia, teknologi, maupun finansial, mempengaruhi kemampuan organisasi dalam mengimplementasikan dan memelihara ISMS yang efektif.</p>`,
    3: `<h2>Lingkungan Eksternal Organisasi</h2>
<p>Lingkungan eksternal terdiri dari faktor-faktor di luar kendali langsung organisasi namun tetap memberikan pengaruh signifikan. Regulasi pemerintah seperti Undang-Undang Perlindungan Data Pribadi harus dipatuhi.</p>
<p>Kondisi ekonomi mempengaruhi prioritas keamanan dan ketersediaan anggaran. Lanskap teknologi terus berkembang dengan ancaman baru yang muncul secara dinamis.</p>
<p>Persaingan pasar mendorong organisasi untuk terus meningkatkan keamanan demi mempertahankan kepercayaan pelanggan dan keunggulan kompetitif.</p>`,
    4: `<h2>Identifikasi Pihak Berkepentingan</h2>
<p>Pihak berkepentingan (stakeholder) adalah individu atau kelompok yang memiliki kepentingan terhadap informasi organisasi. Mengidentifikasi mereka dengan benar sangat penting untuk keberhasilan ISMS.</p>
<p>Pelanggan membutuhkan jaminan bahwa data mereka aman dan tidak akan disalahgunakan. Karyawan memerlukan perlindungan atas data pribadi mereka dan pelatihan untuk penanganan informasi yang benar.</p>
<p>Regulator mengharapkan kepatuhan terhadap peraturan yang berlaku. Partner bisnis membutuhkan kepercayaan bahwa rantai pasok aman dari kebocoran informasi.</p>`,
    5: `<h2>Kebutuhan Pihak Berkepentingan</h2>
<p>Setelah mengidentifikasi pihak berkepentingan, organisasi harus memahami kebutuhan dan ekspektasi spesifik mereka. Setiap kelompok memiliki persyaratan berbeda yang harus dipenuhi.</p>
<p>Pelanggan mungkin membutuhkan sertifikasi keamanan tertentu sebagai syarat kerjasama. Regulator mewajibkan pelaporan insiden dalam periode waktu yang ditentukan.</p>
<p>Memahami kebutuhan ini memungkinkan organisasi untuk merancang ISMS yang tidak hanya patuh tetapi juga memenuhi ekspektasi stakeholder secara efektif.</p>`,
    6: `<h2>Menentukan Cakupan ISMS</h2>
<p>Cakupan ISMS mendefinisikan batasan dan area operasi yang akan dicakup oleh sistem manajemen keamanan informasi. Penentuan cakupan yang tepat sangat penting untuk keberhasilan implementasi.</p>
<p>Cakupan harus mempertimbangkan hasil analisis konteks organisasi dan kebutuhan pihak berkepentingan. Semua aset informasi penting harus termasuk dalam cakupan.</p>
<p>Cakupan yang terlalu luas dapat menyulitkan implementasi, sementara cakupan terlalu sempit mungkin tidak mencakup semua risiko yang relevan.</p>`,
    7: `<h2>Sistem dan Proses Terkait ISMS</h2>
<p>Organisasi harus mengidentifikasi sistem dan proses yang memiliki dampak terhadap keamanan informasi. Ini termasuk sistem teknologi, proses bisnis, dan sumber daya manusia.</p>
<p>Proses pengumpulan, penyimpanan, dan distribusi informasi harus dipahami dengan jelas. Setiap sistem yang menangani informasi sensitif memerlukan kontrol keamanan yang sesuai.</p>
<p>Integrasi ISMS dengan proses bisnis yang ada memastikan bahwa keamanan tidak menjadi hambatan tetapi bagian dari operasional sehari-hari.</p>`,
    8: `<h2>Pendekatan Manajemen Risiko</h2>
<p>Klausul 6 mengharuskan penggunaan proses manajemen risiko yang terstruktur. Organisasi harus memilih pendekatan yang sesuai dengan konteks dan kebutuhan bisnis.</p>
<p>Metode analisis risiko dapat bervariasi dari kualitatif hingga kuantitatif, tergantung pada kompleksitas organisasi dan ketersediaan data. Hal penting adalah konsistensi dalam penerapan metode yang dipilih.</p>
<p>Hasil penilaian risiko menjadi dasar untuk menentukan kontrol yang diperlukan dan prioritas implementasi.</p>`,
    9: `<h2>Koordinasi dan Komunikasi</h2>
<p>Koordinasi antar departemen sangat penting untuk memastikan konsistensi dalam penerapan keamanan informasi. Komunikasi yang efektif memastikan semua pihak memahami kebijakan dan prosedur.</p>
<p>Komite koordinasi keamanan informasi dapat membantu menyatukan berbagai kepentingan departemen dan memastikan alignment dengan tujuan organisasi.</p>
<p>Komunikasi berkala tentang kebijakan keamanan, ancaman terbaru, dan best practice membantu membangun budaya keamanan yang kuat.</p>`,
  },
  'clause-5-leadership': {
    1: `<h2>Peran Kepemimpinan dalam Keamanan</h2>
<p>Kepemimpinan merupakan faktor kritis dalam keberhasilan ISMS. Tanpa dukungan dan komitmen dari manajemen puncak, upaya keamanan informasi tidak akan efektif.</p>
<p>Pemimpin organisasi harus menunjukkan contoh dalam mematuhi kebijakan keamanan. Keteladanan dari atasan mempengaruhi kepatuhan karyawan secara signifikan.</p>
<p>Kepemimpinan yang efektif dalam keamanan informasi membutuhkan pemahaman yang baik tentang risiko dan dampak potensial dari insiden keamanan.</p>`,
    2: `<h2>Komitmen Manajemen Puncak</h2>
<p>Manajemen puncak harus menyediakan sumber daya yang diperlukan, menetapkan kebijakan yang jelas, dan memastikan akuntabilitas yang tepat.</p>
<p>Komitmen ini diwujudkan melalui alokasi anggaran yang memadai, penunjukan personel yang kompeten, dan keterlibatan aktif dalam tinjauan manajemen.</p>
<p>Manajemen puncak juga harus memastikan bahwa keamanan informasi menjadi agenda reguler dalam rapat eksekutif.</p>`,
    3: `<h2>Kebijakan Keamanan Informasi</h2>
<p>Kebijakan keamanan informasi adalah dokumen fundamental yang menetapkan arah dan komitmen organisasi terhadap keamanan informasi.</p>
<p>Kebijakan harus mencakup scope ISMS, roles dan responsibilities, pendekatan terhadap manajemen risiko, dan komitmen terhadap kepatuhan regulasi.</p>
<p>Kebijakan yang baik harus cukup umum untuk memberikan fleksibilitas namun cukup spesifik untuk memberikan panduan yang jelas.</p>`,
    4: `<h2>Menyusun Kebijakan yang Baik</h2>
<p>Kebijakan yang efektif harus jelas, dapat dipahami, dan dapat diterapkan. Bahasa yang digunakan harus dapat dipahami oleh semua karyawan.</p>
<p>Kebijakan harus mencakup semua aspek keamanan informasi yang relevan dan selaras dengan arah strategis organisasi.</p>
<p>Review berkala diperlukan untuk memastikan kebijakan tetap relevan dengan perkembangan bisnis dan ancaman terbaru.</p>`,
    5: `<h2>Menetapkan Tujuan Keamanan</h2>
<p>Tujuan keamanan harus spesifik, terukur, dan terkait dengan risiko yang telah diidentifikasi. Tujuan harus align dengan bisnis dan dapat dicapai.</p>
<p>Contoh tujuan termasuk mengurangi jumlah insiden keamanan di bawah batas tertentu atau meningkatkan persentase karyawan yang telah menyelesaikan pelatihan keamanan.</p>
<p>Objektif ini harus diukur secara berkala untuk menilai efektivitas ISMS dan mengidentifikasi area perbaikan.</p>`,
    6: `<h2>Menyediakan Sumber Daya</h2>
<p>Sumber daya yang memadai sangat penting untuk keberhasilan ISMS. Ini termasuk sumber daya manusia, teknologi, dan finansial.</p>
<p>Organisasi harus memastikan bahwa personel yang ditugaskan memiliki keahlian dan pelatihan yang diperlukan untuk tanggung jawab keamanan mereka.</p>
<p>Infrastruktur teknologi harus memadai untuk mendukung implementasi kontrol keamanan yang diperlukan.</p>`,
    7: `<h2>Alokasi Tanggung Jawab</h2>
<p>Roles dan responsibilities keamanan informasi harus didefinisikan dengan jelas dan dikomunikasikan kepada semua pihak terkait.</p>
<p>Information Security Officer (ISO) memiliki tanggung jawab utama dalam koordinasi implementasi ISMS. Namun, keamanan adalah tanggung jawab semua orang.</p>
<p>Pemisahan tugas yang tepat membantu mencegah fraud dan memastikan kontrol yang efektif.</p>`,
    8: `<h2>Integrasi ISMS dengan Bisnis</h2>
<p>Keamanan informasi harus terintegrasi dengan proses bisnis, bukan dianggap sebagai beban tambahan yang terpisah.</p>
<p>Keputusan bisnis harus mempertimbangkan aspek keamanan sejak awal, bukan sebagai add-on setelah keputusan diambil.</p>
<p>Integrasi ini meningkatkan efektivitas keamanan dan mengurangi resistensi dari departemen lain.</p>`,
    9: `<h2>Komunikasi Kebijakan</h2>
<p>Kebijakan keamanan harus dikomunikasikan kepada semua karyawan dengan cara yang memastikan pemahaman dan kepatuhan.</p>
<p>Metode komunikasi dapat包括 pelatihan, poster, email, dan pengumuman. Kombinasi berbagai metode meningkatkan efektivitas.</p>
<p>Pelatihan onboarding harus mencakup pengenalan kebijakan keamanan untuk memastikan karyawan baru memahami ekspektasi sejak awal.</p>`,
  },
  'clause-6-planning': {
    1: `<h2>Dasar-Dasar Perencanaan Keamanan</h2>
<p>Perencanaan adalah fondasi dari ISMS yang efektif. Tanpa perencanaan yang matang, upaya keamanan akan terfragmentasi dan tidak terarah.</p>
<p>Proses perencanaan harus mempertimbangkan konteks organisasi, hasil penilaian risiko, dan kebutuhan bisnis yang harus dilindungi.</p>
<p>Perencanaan yang baik menghasilkan serangkaian tindakan yang terukur dan dapat ditindaklanjuti untuk mengelola risiko keamanan.</p>`,
    2: `<h2>Identifikasi Aset Informasi</h2>
<p>Aset informasi adalah sumber daya yang memiliki nilai bagi organisasi dan memerlukan perlindungan. Identifikasi aset adalah langkah pertama dalam penilaian risiko.</p>
<p>Aset dapat berupa data elektronik, dokumen fisik, perangkat keras, perangkat lunak, dan bahkan sumber daya manusia dengan keahlian khusus.</p>
<p>Setiap aset harus diidentifikasi dengan jelas, pemilik ditetapkan, dan tingkat sensitivitas ditentukan.</p>`,
    3: `<h2>Identifikasi Ancaman dan Kerentanan</h2>
<p>Ancaman adalah potensi bahaya yang dapat mengeksploitasi kerentanan untuk menyebabkan kerugian. Memahami ancaman membantu organisasi mempersiapkan diri.</p>
<p>Ancaman dapat berasal dari dalam (karyawan tidak puas) maupun luar (peretas). Kerentanan adalah kelemahan yang dapat dieksploitasi oleh ancaman.</p>
<p>Penilaian harus mempertimbangkan ancaman yang relevan dengan konteks organisasi, bukan semua ancaman yang ada.</p>`,
    4: `<h2>Analisis Risiko</h2>
<p>Analisis risiko adalah proses menentukan kemungkinan dan dampak dari risiko yang teridentifikasi. Ini membantu memprioritaskan upaya penanganan risiko.</p>
<p>Likelihood (kemungkinan) menunjukkan seberapa mungkin ancaman terealisasi. Impact (dampak) menunjukkan seberapa besar akibat jika ancaman terealisasi.</p>
<p>Kombinasi likelihood dan impact menghasilkan tingkat risiko yang menjadi dasar pengambilan keputusan.</p>`,
    5: `<h2>Menentukan Kriteria Risiko</h2>
<p>Kriteria risiko adalah standar yang digunakan untuk mengevaluasi dan membandingkan risiko. Kriteria harus ditetapkan sebelum penilaian risiko dimulai.</p>
<p>Kriteria dapat mencakup tingkat risiko yang dapat diterima, toleransi risiko per jenis aset, dan prioritas penanganan berdasarkan dampak bisnis.</p>
<p>Kriteria harus disepakati oleh manajemen dan konsisten dengan kebijakan organisasi.</p>`,
    6: `<h2>Evaluasi dan Prioritas Risiko</h2>
<p>Setelah analisis risiko selesai, risiko harus dievaluasi dan diprioritaskan berdasarkan kriteria yang telah ditetapkan.</p>
<p>Risiko dengan tingkat tinggi harus mendapat prioritas utama dalam rencana treatment. Risiko rendah mungkin tidak memerlukan tindakan segera.</p>
<p>Hasil evaluasi risiko menjadi input utama untuk perencanaan treatment risiko.</p>`,
    7: `<h2>Opsi Penanganan Risiko</h2>
<p>Ada empat opsi utama dalam menangani risiko: mitigate (kurangi), transfer (serahkan), avoid (hindari), dan accept (terima).</p>
<p>Mitigate adalah opsi paling umum dimana kontrol diterapkan untuk mengurangi likelihood atau dampak risiko.</p>
<p>Transfer melibatkan asuransi atau contract dengan pihak ketiga. Avoid berarti menghentikan aktivitas yang menimbulkan risiko. Accept berarti menerima risiko dengan pertimbangan tertentu.</p>`,
    8: `<h2>Menyusun Rencana Treatment</h2>
<p>Rencana treatment risiko menguraikan tindakan spesifik untuk menangani setiap risiko yang teridentifikasi dengan prioritas tinggi.</p>
<p>Rencana harus mencakup tindakan yang akan dilakukan, tanggung jawab, timeline, dan sumber daya yang diperlukan.</p>
<p>Rencana treatment harus reviewed dan approved oleh manajemen sebelum implementasi.</p>`,
    9: `<h2>Pernyataan Applicability</h2>
<p>Statement of Applicability (SoA) adalah dokumen yang menentukan kontrol mana yang diterapkan dan mengapa, berdasarkan hasil penilaian risiko.</p>
<p>SoA harus mencakup semua kontrol dari Annex A ISO 27001 dan menjelaskan mengapa kontrol tertentu diterapkan atau tidak diterapkan.</p>
<p>SoA menjadi dokumen referensi penting untuk audit internal dan eksternal.</p>`,
  },
  'clause-7-support': {
    1: `<h2>Sumber Daya untuk Keamanan</h2>
<p>Keberhasilan ISMS sangat bergantung pada ketersediaan sumber daya yang memadai. Organisasi harus berkomitmen untuk menyediakan sumber daya yang diperlukan.</p>
<p>Sumber daya mencakup personel terlatih, teknologi yang memadai, dan anggaran yang cukup untuk operasional keamanan.</p>
<p>Kekurangan sumber daya sering menjadi hambatan utama dalam implementasi dan pemeliharaan ISMS yang efektif.</p>`,
    2: `<h2>Kompetensi dan Keahlian</h2>
<p>Karyawan yang menangani keamanan informasi harus memiliki kompetensi yang sesuai dengan tanggung jawab mereka.</p>
<p> Kompetensi dapat diperoleh melalui pendidikan, pelatihan, dan pengalaman kerja. Organisasi harus mengevaluasi kompetensi secara berkala.</p>
<p>Untuk posisi kritis seperti Information Security Officer, kualifikasi khusus mungkin diperlukan.</p>`,
    3: `<h2>Proses Rekrutmen dan Seleksi</h2>
<p>Proses rekrutmen harus mencakup penilaian kesiapan keamanan kandidat untuk posisi yang menangani informasi sensitif.</p>
<p>Background check adalah bagian penting dari proses seleksi untuk memverifikasi kualifikasi dan riwayat kandidat.</p>
<p>Kandidat untuk posisi keamanan mungkin memerlukan проверка latar belakang yang lebih mendalam.</p>`,
    4: `<h2>Pelatihan Keamanan</h2>
<p>Pelatihan keamanan informasi harus diberikan kepada semua karyawan sebagai bagian dari program onboarding dan continuation education.</p>
<p>Pelatihan harus mencakup kebijakan keamanan organisasi, prosedur penanganan insiden, dan best practices sehari-hari.</p>
<p>Pelatihan berkala diperlukan untuk memastikan pengetahuan tetap segar dan mengikuti perkembangan ancaman terbaru.</p>`,
    5: `<h2>Kesadaran Keamanan</h2>
<p>Kesadaran keamanan adalah pemahaman karyawan tentang pentingnya keamanan informasi dan peran mereka dalam melindunginya.</p>
<p>Program kesadaran harus menarik dan relevan untuk mendorong keterlibatan aktif karyawan.</p>
<p>Metode untuk meningkatkan kesadaran包括 simulasi phishing, newsletter, dan kampanye internal.</p>`,
    6: `<h2>Dokumentasi yang Diperlukan</h2>
<p>Dokumentasi adalah bukti implementasi ISMS dan harus dikelol dengan baik. Dokumen wajib termasuk kebijakan, prosedur, dan records.</p>
<p>Setiap dokumen harus memiliki informasi versi, tanggal review, dan penanggung jawab untuk memastikan dokumen tetap terkini.</p>
<p>Dokumentasi yang baik memudahkan audit dan menunjukkan kepatuhan terhadap standar.</p>`,
    7: `<h2>Pengelolaan Informasi Terdokumentasi</h2>
<p>Informasi Terdokumentasi harus dikelola dengan prosedur yang jelas untuk确保 konsistensi dan aksesibilitas.</p>
<p>Prosedur untuk pembuatan, review, persetujuan, distribusi, dan pemeliharaan dokumen harus ditetapkan.</p>
<p>Sistem manajemen dokumen (DMS) dapat membantu mengelola informasi terdokumentasi secara efektif.</p>`,
    8: `<h2>Komunikasi Keamanan</h2>
<p>Komunikasi yang efektif tentang keamanan informasi memastikan semua pihak memahami peran dan tanggung jawab mereka.</p>
<p>Komunikasi harus двусторонний - organisasi mengkomunikasikan kebijakan dan prosedure, karyawan memberikan feedback tentang isu keamanan.</p>
<p>Saluran komunikasi yang jelas untuk melaporkan insiden atau kecurigaan keamanan sangat penting.</p>`,
    9: `<h2>Pengelolaan Pengetahuan</h2>
<p>Pengelolaan pengetahuan terkait keamanan informasi penting untuk continuity dan improvement.</p>
<p>Lessons learned dari insiden dan audit harus didokumentasikan dan digunakan untuk perbaikan berkelanjutan.</p>
<p>Repository pengetahuan dapat membantu organisasi belajar dari kesalahan dan successes masa lalu.</p>`,
  },
  'clause-8-operation': {
    1: `<h2>Perencanaan Operasi</h2>
<p>Perencanaan operasional yang baik memastikan bahwa aktivitas keamanan berjalan dengan lancar setiap hari.</p>
<p>Rencana operasional harus mencakup jadwal pemeliharaan, prosedur backup, dan respons insiden.</p>
<p>Perencanaan harus mempertimbangkan semua aspek operasi yang relevan untuk keamanan informasi.</p>`,
    2: `<h2>Penilaian Risiko Operasional</h2>
<p>Penilaian risiko operasional focus pada risiko yang terkait dengan aktivitas sehari-hari organisasi.</p>
<p>Risiko ini dapat berbeda dari risiko strategis dan memerlukan pendekatan yang sesuai untuk assessment dan treatment.</p>
<p>Hasil penilaian risiko operasional harus diintegrasikan dengan rencana operasional organisasi.</p>`,
    3: `<h2>Implementasi Treatment Risiko</h2>
<p>Rencana treatment risiko harus diimplementasikan sesuai jadwal dan dengan sumber daya yang dialokasikan.</p>
<p>Implementasi harus dipantau untuk memastikan efektifitas dan dilakukan adjustment jika diperlukan.</p>
<p>Progress implementasi harus dilaporkan kepada manajemen secara berkala.</p>`,
    4: `<h2>Pengelolaan Perubahan</h2>
<p>Perubahan dalam organisasi dapat mempengaruhi profil risiko keamanan. Perubahan harus dikelola dengan prosedur yang tepat.</p>
<p>Setiap perubahan yang berpotensi mempengaruhi keamanan harus melalui review keamanan sebelum diimplementasikan.</p>
<p>Change management yang baik memastikan bahwa keamanan tidak dikompromikan oleh kebutuhan untuk bergerak cepat.</p>`,
    5: `<h2>Manajemen Pihak Ketiga</h2>
<p>Vendor dan partner bisnis dapat memiliki akses ke informasi sensitif organisasi. Mereka harus dikelola dengan kontrol keamanan yang tepat.</p>
<p>Due diligence harus dilakukan sebelum engaging dengan pihak ketiga. Kontrak harus mencakup klausul keamanan yang sesuai.</p>
<p>Pemantauan berkala terhadap kepatuhan pihak ketiga diperlukan untuk memastikan kepatuhan berkelanjutan.</p>`,
    6: `<h2>Outsourcing dan Keamanan</h2>
<p>Outsourcing layanan yang menangani informasi sensitif memerlukan pertimbangan keamanan yang ekstra.</p>
<p>Provider harus memiliki kontrol keamanan yang setara atau lebih baik dari standar organisasi. Audit periodic dapat memverifikasi hal ini.</p>
<p>Exit strategy harus dipertimbangkan dalam kasus provider gagal memenuhi persyaratan keamanan.</p>`,
    7: `<h2>Manajemen Insiden Keamanan</h2>
<p>Manajemen insiden adalah kemampuan untuk mendeteksi, merespons, dan memulihkan dari insiden keamanan dengan efektif.</p>
<p>Prosedur penanganan insiden harus terdokumentasi dan semua karyawan harus memahami peran mereka.</p>
<p>Lessons learned dari setiap insiden harus digunakan untuk mencegah terulangnya insiden serupa.</p>`,
    8: `<h2>Konfigurasi Sistem</h2>
<p>Konfigurasi sistem yang aman adalah fondasi dari keamanan teknologi. Konfigurasi default sering tidak aman dan harus dimodifikasi.</p>
<p>Baseline keamanan harus ditetapkan untuk setiap jenis sistem dan dipatuhi oleh semua administrator.</p>
<p>Pemantauan konfigurasi membantu mendeteksi drift dari baseline yang ditetapkan.</p>`,
    9: `<h2>Backup dan Pemulihan Data</h2>
<p>Backup data adalah safety net untuk melindungi terhadap kehilangan informasi karena berbagai原因.</p>
<p>Strategi backup harus mempertimbangkan Recovery Time Objective (RTO) dan Recovery Point Objective (RPO) yang diperlukan.</p>
<p>Backup harus diuji secara berkala untuk memastikan data dapat dipulihkan dengan sukses.</p>`,
  },
  'clause-9-performance-evaluation': {
    1: `<h2>Monitoring dan Pengukuran</h2>
<p>Monitoring kinerja keamanan informasi membantu organisasi memahami apakah ISMS bekerja seperti yang diharapkan.</p>
<p>Metrik yang tepat harus dipilih untuk mengukur efektivitas kontrol keamanan dan progress implementasi.</p>
<p>Hasil monitoring harus digunakan untuk pengambilan keputusan dan perbaikan berkelanjutan.</p>`,
    2: `<h2>Indikator Kinerja Keamanan</h2>
<p>Key Performance Indicators (KPIs) untuk keamanan informasi dapat включая jumlah insiden, waktu respons, dan persentase karyawan yang dilatih.</p>
<p>Indikator harus dipilih dengan hati-hati untuk memberikan gambaran akurat tentang kinerja keamanan.</p>
<p>Trend analysis lebih berguna daripada data point tunggal untuk mengidentifikasi improvement atau degradation.</p>`,
    3: `<h2>Metode Pengukuran</h2>
<p>Pengukuran efektivitas kontrol dapat menggunakan berbagai metode termasuk audit, testing, dan metrics collection.</p>
<p>Beberapa kontrol memerlukan pengujian teknis, sementara yang lain mungkin memerlukan audit proses.</p>
<p>Hasil pengukuran harus dibandingkan dengan target yang ditetapkan untuk menentukan apakah improvements diperlukan.</p>`,
    4: `<h2>Audit Internal: Persiapan</h2>
<p>Audit internal adalah mekanisme untuk memverifikasi bahwa ISMS diimplementasikan dan beroperasi sesuai yang diharapkan.</p>
<p>Persiapan audit meliputi penyusunan jadwal, pemilihan auditor yang kompeten, dan preparation audit scope.</p>
<p>Auditor harus independen dari aktivitas yang diaudit untuk memastikan objektivitas.</p>`,
    5: `<2>Audit Internal: Pelaksanaan</h2>
<p>Pelaksanaan audit meliputi pengumpulan bukti, wawancara dengan персонал, dan review dokumentasi.</p>
<p>Auditor harus mendokumentasikan temuan dengan jelas dan berdasarkan bukti yang cukup.</p>
<p>Nonconformities harus diklasifikasikan berdasarkan severity untuk memungkinkan prioritasi corrective actions.</p>`,
    6: `<h2>Audit Internal: Pelaporan</h2>
<p>Laporan audit harus menyajikan temuan dengan jelas dan actionable recommendations.</p>
<p>Laporan harus mencakup context audit, metodologi, finding, dan recommendations.</p>
<p>Management harus melakukan review terhadap laporan audit dan menindaklanjuti findings yang signifikan.</p>`,
    7: `<h2>Tinjauan Manajemen</h2>
<p>Management review adalah forum untuk mengevaluasi kinerja ISMS secara keseluruhan dan membuat keputusan tentang perbaikan.</p>
<p>Input untuk management review включая hasil audit, metrics kinerja, dan perubahan risiko.</p>
<p>Output dari management review harus mencakup decisions dan actions terkait improvement ISMS.</p>`,
    8: `<h2>Evaluasi Kepatuhan</h2>
<p>Organisasi harus mengevaluasi kepatuhan terhadap persyaratan regulasi dan standar yang relevan.</p>
<p>Kepatuhan harus diverifikasi secara regular, bukan hanya saat audit eksternal.</p>
<p>Temuan ketidakpatuhan harus ditindaklanjuti dengan corrective actions yang sesuai.</p>`,
    9: `<h2>Tinjauan Berkelanjutan</h2>
<p>ISMS bukan proyek sekali jadi tetapi memerlukan pemeliharaan dan perbaikan berkelanjutan.</p>
<p>Review berkala memastikan bahwa ISMS tetap relevant dengan perubahan konteks organisasi.</p>
<p>Continuous improvement harus menjadi bagian dari budaya organisasi.</p>`,
  },
  'clause-10-improvement': {
    1: `<h2>Prinsip Perbaikan Berkelanjutan</h2>
<p>Prinsip perbaikan berkelanjutan (continuous improvement) adalah jantung dari ISMS yang efektif. Organisasi harus selalu berusaha untuk meningkatkan.</p>
<p>P得好 adalah siklus Plan-Do-Check-Act yang mendorong improvement iteratif dari waktu ke waktu.</p>
<p>Tidak ada sistem yang sempurna - selalu ada ruang untuk improvement.</p>`,
    2: `<h2>Ketidaksesuaian dan Koreksi</h2>
<p>Ketidaksesuaian adalah deviasi dari persyaratan yang ditetapkan. Ketika ketidaksesuaian teridentifikasi, tindakan koreksi diperlukan.</p>
<p>Pertama, ketidaksesuaian harus diinvestigasi untuk menentukan root cause. Kemudian, corrective action harus diterapkan untuk mencegah terulangnya.</p>
<p>Documentation dari ketidaksesuaian dan resolution adalah penting untuk audit dan learning.</p>`,
    3: `<h2>Analisis Akar Masalah</h2>
<p>Root cause analysis adalah proses untuk mengidentifikasi penyebab dasar dari masalah, bukan hanya gejala permukaan.</p>
<p>Teknik seperti 5 Whys atau Fishbone diagram dapat membantu dalam menganalisis akar masalah.</p>
<p>Tanpa mengidentifikasi root cause yang sebenarnya, corrective action tidak akan efektif dalam mencegah terulangnya masalah.</p>`,
    4: `<h2>Tindakan Korektif</h2>
<p>Corrective actions adalah langkah-langkah yang diambil untuk menghilangkan penyebab ketidaksesuaian atau situasi yang tidak diinginkan.</p>
<p>Corrective action plan harus mencakup spesifik actions, responsibilities, timelines, dan resources yang diperlukan.</p>
<p>Efektivitas corrective action harus diverifikasi setelah implementation untuk memastikan masalah terselesaikan.</p>`,
    5: `<h2>Tindakan Preventif</h2>
<p>Preventive actions adalah langkah-langkah untuk menghilangkan penyebab potensial dari ketidaksesuaian sebelum terjadi.</p>
<p>Preventive actions didasarkan pada risk assessment dan identifikasi area yang memerlukan attention sebelum masalah terjadi.</p>
<p>Monitoring terhadap preventive actions penting untuk memastikan mereka efektif dan tidak menciptakan masalah baru.</p>`,
    6: `<h2>Pembelajaran dari Insiden</h2>
<p>Setiap insiden keamanan adalah kesempatan untuk belajar dan meningkatkan. Lessons learned harus diekstraksi dan di-share.</p>
<p>Post-incident review harus mengidentifikasi apa yang berhasil, apa yang tidak, dan bagaimana improvement dapat dilakukan.</p>
<p>Lessons learned harus digunakan untuk mengupdate policies, procedures, dan training.</p>`,
    7: `<h2>Memperbarui Dokumentasi</h2>
<p>Dokumentasi ISMS harus kept up-to-date dengan perubahan konteks organisasi dan lessons learned.</p>
<p>Review berkala diperlukan untuk memastikan semua dokumen tetap relevan dan akurat.</p>
<p>Version control yang baik memastikan bahwa semua orang bekerja dengan dokumen terbaru.</p>`,
    8: `<h2>Model PDCA</h2>
<p>PDCA (Plan-Do-Check-Act) adalah framework untuk continuous improvement yang diadopsi oleh ISO 27001.</p>
<p>Plan - establish ISMS objectives and processes. Do - implement the processes. Check - monitor and measure processes. Act - take actions to continually improve.</p>
<p>Siklus PDCA harus berjalan secara terus-menerus untuk mendorong improvement yang berkelanjutan.</p>`,
    9: `<h2>Peninjauan Hasil Perbaikan</h2>
<p>Efektivitas dari improvement actions harus diukur dan dievaluasi secara berkala.</p>
<p>Jika improvement tidak efektif, alternative approaches harus dipertimbangkan.</p>
<p>Sharing successes dan failures membantu organisasi belajar dari pengalaman collective.</p>`,
  },
  'annex-a5-organizational-controls': {
    1: `<h2>Pengenalan Kontrol Organisasional</h2>
<p>Annex A.5 berisi kontrol yang berkaitan dengan struktur organisasi, kebijakan, dan proses yang diperlukan untuk keamanan informasi yang efektif.</p>
<p>Kontrol organisasional membentuk fondasi dari program keamanan informasi dengan menetapkan peran, responsibilities, dan accountability.</p>
<p>Kontrol ini berlaku untuk semua organisasi terlepas dari ukuran atau industri.</p>`,
    2: `<h2>Kebijakan Keamanan Informasi</h2>
<p>Kebijakan keamanan informasi harus didefinisikan, disetujui oleh manajemen, dipublikasikan, dan dikomunikasikan kepada semua karyawan.</p>
<p>Kebijakan harus reviewed secara berkala untuk memastikan tetap relevant dengan konteks organisasi saat ini.</p>
<p>Contoh konten kebijakan termasuk scope, objectives, roles dan responsibilities, dan compliance requirements.</p>`,
    3: `<h2>Peran dan Tanggung Jawab</h2>
<p>Roles dan responsibilities untuk keamanan informasi harus didefinisikan dan dialokasikan dengan jelas.</p>
<p>Information Security Officer memiliki tanggung jawab koordinasi. Namun, setiap employee memiliki tanggung jawab untuk mematuhi kebijakan keamanan.</p>
<p>Documentation dari roles membantu memastikan tidak ada gap atau overlap dalam tanggung jawab.</p>`,
    4: `<h2>Pemisahan Tugas</h2>
<p>Segregation of duties (SoD) memastikan bahwa tidak ada satu individu yang memiliki kontrol penuh atas transaksi atau proses kritis.</p>
<p>SoD membantu mencegah fraud dan error dengan memastikan checks and balances dalam proses.</p>
<p>Untuk sistem kritis, SoD harus diimplementasikan dengan controls yang tepat.</p>`,
    5: `<h2>Kontak dengan Otoritas</h2>
<p>Organisasi harus memiliki prosedur untuk berkomunikasi dengan otoritas yang relevan seperti regulator dan law enforcement.</p>
<p>Kontak harus dibuat sesegera mungkin ketika insiden keamanan terjadi yang memerlukan pelaporan wajib.</p>
<p>Informasi kontak harus kept up-to-date dan easily accessible untuk персонал yang berwenang.</p>`,
    6: `<h2>Kontak dengan Grup Keamanan</h2>
<p>partisipasi dalam forums atau groups keamanan informasi membantu organisasi stay updated dengan ancaman dan best practices terbaru.</p>
<p>Bergabung dengan komunitas keamanan menyediakan akses ke threat intelligence dan resources.</p>
<p>Organisasi harus mempertimbangkan keanggotaan yang relevant untuk industri dan konteks mereka.</p>`,
    7: `<h2>Manajemen Risiko Keamanan</h2>
<p>Proses manajemen risiko harus diimplementasikan sesuai dengan kebijakan yang ditetapkan dan mencakup seluruh lifecycle risiko.</p>
<p>Risk assessment harus dilakukan secara berkala dan setiap kali ada perubahan signifikan dalam konteks organisasi.</p>
<p>Hasil risk assessment harus didokumentasikan dan digunakan untuk pengambilan keputusan.</p>`,
    8: `<h2>Kategorisasi Aset</h2>
<p>Aset harus dikategorikan berdasarkan kebutuhan keamanan untuk memastikan protection yang sesuai.</p>
<p>Kategorisasi harus mempertimbangkan confidentiality, integrity, dan availability dari informasi.</p>
<p>Setiap kategori mungkin memerlukan controls yang berbeda untuk memberikan perlindungan yang tepat.</p>`,
    9: `<h2>Kepemimpinan dan Komitmen</h2>
<p>Manajemen harus menunjukkan komitmen terhadap keamanan informasi melalui participation aktif dan resource allocation.</p>
<p>Komitmen ini harus visible dalam semua level organisasi untuk membangun budaya keamanan yang kuat.</p>
<p>Leadership yang baik menciptakan environment di mana keamanan dihargai dan diprioritaskan.</p>`,
  },
  'annex-a6-people-controls': {
    1: `<h2>Pengenalan Kontrol Manusia</h2>
<p>Annex A.6 berfokus pada kontrol yang berkaitan dengan manusia dalam organisasi - dari rekrutmen hingga termination.</p>
<p>Manusia sering menjadi weakest link dalam keamanan, making controls in this area critical.</p>
<p>Kontrol manusia harus complemented dengan teknologi dan proses controls untuk keamanan yang komprehensif.</p>`,
    2: `<h2>Seleksi dan Penyaringan</h2>
<p>Background screening harus dilakukan untuk semua kandidat sebelum hiring, terutama untuk posisi yang menangani informasi sensitif.</p>
<p>Cakupan screening harus proportionate dengan peran dan tingkat risiko posisi.</p>
<p>Consent harus diperoleh dari kandidat sebelum melakukan background check.</p>`,
    3: `<h2>Syarat Kerja dan Perjanjian</h2>
<p>Terms of employment harus mencakup responsibilities keamanan informasi dan konsekuensi pelanggaran.</p>
<p>Non-disclosure agreements (NDAs) harus ditandatangani untuk melindungi informasi sensitif organisasi.</p>
<p>Kontrak harus reviewed secara berkala untuk memastikan mereka tetap adequate dan enforceably.</p>`,
    4: `<h2>Pelatihan Kesadaran</h2>
<p>Security awareness training harus diberikan kepada semua karyawan secara regular untuk memastikan mereka memahami ancaman dan responsibilities mereka.</p>
<p>Training harus engaging dan relevant untuk mendorong retensi informasi. Contoh nyata lebih efektif daripada teori murni.</p>
<p>Simulasi seperti phishing tests dapat membantu mengukur efektivitas training dan mengidentifikasi area yang memerlukan attention.</p>`,
    5: `<h2>Proses Disipliner</h2>
<p>Proses disipliner harus established untuk menangani pelanggaran kebijakan keamanan dengan fair dan consistent.</p>
<p>Prosedur harus jelas tentang apa yang constitui pelanggaran dan apa konsekuensinya.</p>
<p>Due process harus diikuti untuk memastikan keputusan disipliner adalah fair dan defensible.</p>`,
    6: `<h2>Tanggung Jawab Pengunduran Diri</h2>
<p>Ketika karyawan meninggalkan organisasi, semua akses harus dicabut dan semua assets dikembalikan.</p>
<p>Exit interview harus mencakup pengembalian assets, removal dari sistem, dan reminder tentang ongoing confidentiality obligations.</p>
<p>Prosedur exit yang baik harus documented dan executed consistently untuk semua departures.</p>`,
    7: `<h2>Pengembalian Aset</h2>
<p>Semua assets organisasi - termasuk perangkat, ID cards, dan documentation - harus dikembalikan saat karyawan meninggalkan.</p>
<p>Inventory check harus dilakukan untuk memastikan semua assets dikembalikan atau accounted for.</p>
<p>Retention dari information sensitif harus ensured setelah employee departure.</p>`,
    8: `<h2>Pengelolaan Hak Akses</h2>
<p>Akses ke informasi dan sistem harus dikelola dengan prosedur yang tepat termasuk provisioning, modification, dan revocation.</p>
<p>Principle of least privilege harus diterapkan - users hanya memiliki akses yang diperlukan untuk job functions mereka.</p>
<p>Regular access reviews harus dilakukan untuk memastikan akses tetap appropriate untuk current roles.</p>`,
    9: `<h2>Remote Work dan Keamanan</h2>
<p>Remote work memerlukan controls tambahan untuk memastikan keamanan informasi di luar kantor.</p>
<p>Requirements untuk remote work harus documented dan employees harus trained tentang expectations dan procedures.</p>
<p>Technology solutions seperti VPN dan encryption harus digunakan untuk melindungi remote access.</p>`,
  },
  'annex-a8-technological-controls': {
    1: `<h2>Pengenalan Kontrol Teknologi</h2>
<p>Annex A.8 berisi kontrol yang berkaitan dengan teknologi informasi - hardware, software, dan jaringan.</p>
<p>Kontrol teknologi adalah critical untuk melindungi informasi dalam sistem digital yang digunakan organisasi.</p>
<p>Kontrol ini harus implemented dalam kombinasi dengan organisasional dan people controls untuk comprehensive protection.</p>`,
    2: `<h2>Manajemen Akses Pengguna</h2>
<p>User access management mencakup proses untuk memberikan dan mencabut akses ke sistem dan informasi.</p>
<p>Registration dan de-registration processes harus terdokumentasi dan executed untuk semua users.</p>
<p>User ID harus unique dan tidak di-share antara multiple individuals untuk accountability.</p>`,
    3: `<h2>Kontrol Akses Sistem</h2>
<p>System dan application access control memastikan bahwa hanya authorized users yang dapat mengakses sistem dan data.</p>
<p>Password policies harus implemented untuk memastikan password yang kuat dan changed regularly.</p>
<p>Multi-factor authentication harus considered untuk sistem yang lebih sensitif.</p>`,
    4: `<h2>Enkripsi Data</h2>
<p>Cryptography controls melindungi kerahasiaan dan integritas informasi sensitif melalui enkripsi.</p>
<p>Data harus dienkripsi baik at rest (saat disimpan) maupun in transit (saat dikirimkan).</p>
<p>Algoritma encryption yang kuat dan standar harus digunakan untuk memastikan perlindungan yang adequate.</p>`,
    5: `<h2>Manajemen Kunci Enkripsi</h2>
<p>Key management adalah critical untuk effectiveness dari enkripsi. Keys harus di-generate, stored, distributed, dan destroyed dengan aman.</p>
<p>Procedures untuk key management harus documented dan implemented untuk seluruh lifecycle keys.</p>
<p>Lost atau compromised keys harus handled sebagai insiden keamanan dengan procedures untuk key revocation dan replacement.</p>`,
    6: `<h2>Keamanan Jaringan</h2>
<p>Networks harus dikonfigurasi dan dikontrol untuk melindungi informasi yang ditransmisikan dan systems yang terhubung.</p>
<p>Firewalls, intrusion detection/prevention systems, dan segmentation adalah komponen kunci dari network security.</p>
<p>Monitoring network traffic membantu mendeteksi anomalies dan potential attacks.</p>`,
    7: `<h2>Perlindungan Malware</h2>
<p>Malware protection mencakup preventive dan detective controls untuk melindungi terhadap malicious software.</p>
<p>Anti-virus/anti-malware software harus di-install dan kept updated di semua systems yang relevant.</p>
<p>User awareness tentang malware dan procedures untuk reporting suspicious files adalah equally important.</p>`,
    8: `<h2>Manajemen Kerentanan</h2>
<p>Vulnerability management adalah proses untuk mengidentifikasi, evaluating, dan addressing weaknesses dalam systems.</p>
<p>Regular vulnerability scans dan penetration tests membantu mengidentifikasi kerentanan sebelum attacker dapat mengeksploitasinya.</p>
<p>Patching procedures harus established untuk memastikan kerentanan di-addressed dengan timely manner.</p>`,
    9: `<h2>Konfigurasi Keamanan</h2>
<p>Secure configuration dari systems adalah fondasi dari technological security. Default configurations sering tidak aman.</p>
<p>Security baselines harus ditetapkan untuk berbeda types of systems dan enforced melalui configuration management.</p>
<p>Deviations dari secure baseline harus didokumentasi dan di-approve sebelum implementation.</p>`,
  },
};

const quizQuestions = [
  'Apa fokus utama dari materi ini?',
  'Mengapa konsep ini penting dalam ISO 27001?',
  'Bagaimana penerapan konsep ini di perusahaan?',
  'Apa manfaat utama dari implementasi konsep ini?',
  'Siapa yang bertanggung jawab utama dalam konsep ini?',
  'Apa konsekuensi jika konsep ini tidak diterapkan?',
  'Apa hubungan konsep ini dengan kontrol ISO 27001 lainnya?',
  'Bagaimana cara mengukur keberhasilan implementasi konsep ini?',
  'Apa tantangan umum dalam implementasi konsep ini?',
  'Apa best practice yang direkomendasikan untuk konsep ini?',
];

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
      description: 'Pelajari tentang kontrol organisasional dalam ISO 27001 meliputi struktur organisasi, kebijakan keamanan, pembagian tanggung jawab, dan koordinasi dengan pihak berkepentingan.',
    },
    {
      slug: 'annex-a6-people-controls',
      title: 'Annex A.6: Kontrol Manusia',
      description: 'Pelajari tentang kontrol manusia dalam ISO 27001 meliputi seleksi karyawan, pelatihan, pengelolaan akses, dan prosedur saat karyawan keluar.',
    },
    {
      slug: 'annex-a8-technological-controls',
      title: 'Annex A.8: Kontrol Teknologi',
      description: 'Pelajari tentang kontrol teknologi dalam ISO 27001 meliputi manajemen akses, enkripsi, keamanan jaringan, dan perlindungan malware.',
    },
  ];

  const courseModuleTitles: Record<string, { mod: number; title: string; isQuiz?: boolean }[]> = {
    'clause-4-context-organization': [
      { mod: 1, title: 'Pendahuluan Konteks Organisasi' },
      { mod: 2, title: 'Lingkungan Internal Organisasi' },
      { mod: 3, title: 'Lingkungan Eksternal Organisasi' },
      { mod: 4, title: 'Identifikasi Pihak Berkepentingan' },
      { mod: 5, title: 'Kebutuhan Pihak Berkepentingan' },
      { mod: 6, title: 'Menentukan Cakupan ISMS' },
      { mod: 7, title: 'Sistem dan Proses Terkait ISMS' },
      { mod: 8, title: 'Pendekatan Manajemen Risiko' },
      { mod: 9, title: 'Koordinasi dan Komunikasi' },
      { mod: 10, title: 'Kuis: Konteks Organisasi', isQuiz: true },
    ],
    'clause-5-leadership': [
      { mod: 1, title: 'Peran Kepemimpinan dalam Keamanan' },
      { mod: 2, title: 'Komitmen Manajemen Puncak' },
      { mod: 3, title: 'Kebijakan Keamanan Informasi' },
      { mod: 4, title: 'Menyusun Kebijakan yang Baik' },
      { mod: 5, title: 'Menetapkan Tujuan Keamanan' },
      { mod: 6, title: 'Menyediakan Sumber Daya' },
      { mod: 7, title: 'Alokasi Tanggung Jawab' },
      { mod: 8, title: 'Integrasi ISMS dengan Bisnis' },
      { mod: 9, title: 'Komunikasi Kebijakan' },
      { mod: 10, title: 'Kuis: Kepemimpinan', isQuiz: true },
    ],
    'clause-6-planning': [
      { mod: 1, title: 'Dasar-Dasar Perencanaan Keamanan' },
      { mod: 2, title: 'Identifikasi Aset Informasi' },
      { mod: 3, title: 'Identifikasi Ancaman dan Kerentanan' },
      { mod: 4, title: 'Analisis Risiko' },
      { mod: 5, title: 'Menentukan Kriteria Risiko' },
      { mod: 6, title: 'Evaluasi dan Prioritas Risiko' },
      { mod: 7, title: 'Opsi Penanganan Risiko' },
      { mod: 8, title: 'Menyusun Rencana Treatment' },
      { mod: 9, title: 'Pernyataan Applicability' },
      { mod: 10, title: 'Kuis: Perencanaan', isQuiz: true },
    ],
    'clause-7-support': [
      { mod: 1, title: 'Sumber Daya untuk Keamanan' },
      { mod: 2, title: 'Kompetensi dan Keahlian' },
      { mod: 3, title: 'Proses Rekrutmen dan Seleksi' },
      { mod: 4, title: 'Pelatihan Keamanan' },
      { mod: 5, title: 'Kesadaran Keamanan' },
      { mod: 6, title: 'Dokumentasi yang Diperlukan' },
      { mod: 7, title: 'Pengelolaan Informasi Terdokumentasi' },
      { mod: 8, title: 'Komunikasi Keamanan' },
      { mod: 9, title: 'Pengelolaan Pengetahuan' },
      { mod: 10, title: 'Kuis: Dukungan', isQuiz: true },
    ],
    'clause-8-operation': [
      { mod: 1, title: 'Perencanaan Operasi' },
      { mod: 2, title: 'Penilaian Risiko Operasional' },
      { mod: 3, title: 'Implementasi Treatment Risiko' },
      { mod: 4, title: 'Pengelolaan Perubahan' },
      { mod: 5, title: 'Manajemen Pihak Ketiga' },
      { mod: 6, title: 'Outsourcing dan Keamanan' },
      { mod: 7, title: 'Manajemen Insiden Keamanan' },
      { mod: 8, title: 'Konfigurasi Sistem' },
      { mod: 9, title: 'Backup dan Pemulihan Data' },
      { mod: 10, title: 'Kuis: Operasi', isQuiz: true },
    ],
    'clause-9-performance-evaluation': [
      { mod: 1, title: 'Monitoring dan Pengukuran' },
      { mod: 2, title: 'Indikator Kinerja Keamanan' },
      { mod: 3, title: 'Metode Pengukuran' },
      { mod: 4, title: 'Audit Internal: Persiapan' },
      { mod: 5, title: 'Audit Internal: Pelaksanaan' },
      { mod: 6, title: 'Audit Internal: Pelaporan' },
      { mod: 7, title: 'Tinjauan Manajemen' },
      { mod: 8, title: 'Evaluasi Kepatuhan' },
      { mod: 9, title: 'Tinjauan Berkelanjutan' },
      { mod: 10, title: 'Kuis: Evaluasi Kinerja', isQuiz: true },
    ],
    'clause-10-improvement': [
      { mod: 1, title: 'Prinsip Perbaikan Berkelanjutan' },
      { mod: 2, title: 'Ketidaksesuaian dan Koreksi' },
      { mod: 3, title: 'Analisis Akar Masalah' },
      { mod: 4, title: 'Tindakan Korektif' },
      { mod: 5, title: 'Tindakan Preventif' },
      { mod: 6, title: 'Pembelajaran dari Insiden' },
      { mod: 7, title: 'Memperbarui Dokumentasi' },
      { mod: 8, title: 'Model PDCA' },
      { mod: 9, title: 'Peninjauan Hasil Perbaikan' },
      { mod: 10, title: 'Kuis: Perbaikan', isQuiz: true },
    ],
    'annex-a5-organizational-controls': [
      { mod: 1, title: 'Pengenalan Kontrol Organisasional' },
      { mod: 2, title: 'Kebijakan Keamanan Informasi' },
      { mod: 3, title: 'Peran dan Tanggung Jawab' },
      { mod: 4, title: 'Pemisahan Tugas' },
      { mod: 5, title: 'Kontak dengan Otoritas' },
      { mod: 6, title: 'Kontak dengan Grup Keamanan' },
      { mod: 7, title: 'Manajemen Risiko Keamanan' },
      { mod: 8, title: 'Kategorisasi Aset' },
      { mod: 9, title: 'Kepemimpinan dan Komitmen' },
      { mod: 10, title: 'Kuis: Kontrol Organisasional', isQuiz: true },
    ],
    'annex-a6-people-controls': [
      { mod: 1, title: 'Pengenalan Kontrol Manusia' },
      { mod: 2, title: 'Seleksi dan Penyaringan' },
      { mod: 3, title: 'Syarat Kerja dan Perjanjian' },
      { mod: 4, title: 'Pelatihan Kesadaran' },
      { mod: 5, title: 'Proses Disipliner' },
      { mod: 6, title: 'Tanggung Jawab Pengunduran Diri' },
      { mod: 7, title: 'Pengembalian Aset' },
      { mod: 8, title: 'Pengelolaan Hak Akses' },
      { mod: 9, title: 'Remote Work dan Keamanan' },
      { mod: 10, title: 'Kuis: Kontrol Manusia', isQuiz: true },
    ],
    'annex-a8-technological-controls': [
      { mod: 1, title: 'Pengenalan Kontrol Teknologi' },
      { mod: 2, title: 'Manajemen Akses Pengguna' },
      { mod: 3, title: 'Kontrol Akses Sistem' },
      { mod: 4, title: 'Enkripsi Data' },
      { mod: 5, title: 'Manajemen Kunci Enkripsi' },
      { mod: 6, title: 'Keamanan Jaringan' },
      { mod: 7, title: 'Perlindungan Malware' },
      { mod: 8, title: 'Manajemen Kerentanan' },
      { mod: 9, title: 'Konfigurasi Keamanan' },
      { mod: 10, title: 'Kuis: Kontrol Teknologi', isQuiz: true },
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

    const modules = courseModuleTitles[courseData.slug] || [];

    for (let i = 0; i < modules.length; i++) {
      const moduleData = modules[i];
      const content = lessonContents[courseData.slug]?.[i + 1] || `<h2>${moduleData.title}</h2><p>Materi pembelajaran untuk ${moduleData.title}.</p>`;

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
          content: content,
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

        const questionOptions = [
          ['Pemahaman dasar', 'Pengelolaan risiko', 'Penerapan kontrol', 'Semua jawaban benar'],
          ['Tidak penting', 'Sangat penting', 'Hampir tidak penting', 'Tergantung situasi'],
          ['Tidak perlu diterapkan', 'Perlu diterapkan sesuai konteks', 'Hanya untuk perusahaan besar', 'Tidak ada panduan'],
          ['Menambah biaya', 'Memperkuat keamanan informasi', 'Tidak ada manfaat', 'Hanya formalitas'],
          ['Hanya IT', 'Hanya manajemen', 'Semua karyawan', 'Konsultan eksternal'],
          ['Tidak ada', 'Denda', 'Kerusakan reputasi', 'Semua yang disebutkan'],
          ['Independent', 'Terpisah', 'Saling terkait', 'Tidak ada hubungan'],
          ['Annual review saja', 'Metrics dan audit', 'Hanya audit', 'Tidak ada pengukuran'],
          ['Kurangnya sumber daya', 'Resistensi karyawan', 'Kompleksitas teknis', 'Semua yang tersebut'],
          ['Mengikuti standar', 'Melibatkan semua pihak', 'Training berkala', 'Semua benar'],
        ];

        for (let q = 0; q < 10; q++) {
          const correctIndex = q === 0 ? 3 : q === 1 ? 1 : q === 2 ? 1 : q === 3 ? 1 : q === 4 ? 2 : q === 5 ? 3 : q === 6 ? 2 : q === 7 ? 1 : q === 8 ? 3 : 3;
          
          await prisma.question.upsert({
            where: { id: `${quiz.id}-q${q + 1}` },
            update: {},
            create: {
              id: `${quiz.id}-q${q + 1}`,
              text: quizQuestions[q],
              options: JSON.stringify(questionOptions[q]),
              correctAnswer: questionOptions[q][correctIndex],
              quizId: quiz.id,
            },
          });
        }
      }
    }
  }

  console.log('All ISO 27001 courses seeded successfully!');
  console.log('Total: 10 courses, 100 modules, 100 lessons, 10 quizzes with 10 questions each');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
