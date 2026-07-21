import { Mission, Student, MissionStage } from "../types";

export const MISSIONS: Mission[] = [
  {
    id: 1,
    name: "Larung Sesaji",
    emoji: "⛵",
    location: "Telaga Sarangan, Magetan",
    gradient: "from-blue-600 to-cyan-500",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-300",
    desc: "Tradisi ritual syukur di Telaga Sarangan yang dilakukan masyarakat Magetan setiap tahun.",
    content: {
      pengertian:
        "Larung Sesaji adalah tradisi ritual budaya masyarakat Jawa yang dilakukan di perairan atau danau sebagai wujud syukur kepada Tuhan Yang Maha Esa. Di Magetan, tradisi ini dilaksanakan setiap tahun di Telaga Sarangan dengan cara melarung (menghanyutkan) sesaji ke tengah danau.",
      sejarah:
        "Tradisi Larung Sesaji telah berlangsung selama ratusan tahun dan diwariskan secara turun-temurun oleh masyarakat Magetan. Kegiatan ini menjadi simbol harmoni antara manusia, alam, dan Sang Pencipta. Setiap tahun, ribuan masyarakat dan wisatawan menyaksikan ritual sakral ini.",
      tujuan:
        "Larung Sesaji dilaksanakan sebagai ungkapan rasa syukur atas berkah Tuhan Yang Maha Esa, memohon keselamatan bagi masyarakat, serta menjaga kelestarian alam dan kearifan lokal Magetan agar tetap lestari untuk generasi mendatang.",
      nilaiBudaya: ["🙏 Syukur", "🤝 Gotong Royong", "🌿 Harmoni dengan Alam", "❤️ Kebersamaan"]
    },
    faktaItems: [
      "Larung Sesaji dilaksanakan di Telaga Sarangan, Kabupaten Magetan.",
      "Tradisi ini merupakan ungkapan rasa syukur masyarakat kepada Tuhan Yang Maha Esa.",
      "Larung Sesaji melibatkan seluruh masyarakat setempat secara gotong royong.",
      "Kegiatan ini diadakan rutin setiap tahun sebagai warisan budaya Magetan."
    ],
    faktaQuestions: [
      { soal: "Di mana tradisi Larung Sesaji dilaksanakan?", kunci: ["telaga sarangan", "sarangan", "magetan"] },
      { soal: "Apa makna/tujuan dari tradisi Larung Sesaji?", kunci: ["syukur", "terima kasih", "selamat", "berkah"] },
      { soal: "Sebutkan satu nilai budaya dalam Larung Sesaji!", kunci: ["gotong royong", "syukur", "kebersamaan", "harmoni"] }
    ],
    cekFakta: [
      { text: "Larung Sesaji adalah tradisi membuang sampah ke danau.", benar: false },
      { text: "Larung Sesaji dilaksanakan di Telaga Sarangan.", benar: true },
      { text: "Tradisi Larung Sesaji sebagai wujud syukur kepada Tuhan.", benar: true },
      { text: "Larung Sesaji hanya boleh diikuti pemimpin desa.", benar: false }
    ],
    sumberAnalisis: [
      { nama: "Website Resmi Pemkab Magetan (magetan.go.id)", jenis: "Pemerintah Resmi", terpercaya: true, icon: "🏛️" },
      { nama: "Buku \"Kearifan Lokal Jawa Timur\" — Penerbit Balai Pustaka", jenis: "Buku Akademik", terpercaya: true, icon: "📚" },
      { nama: "Blog Pribadi \"Jalan-jalan ke Sarangan\"", jenis: "Blog Pribadi", terpercaya: false, icon: "✍️" },
      { nama: "Akun Instagram @budayamagetan_xyz (tidak diverifikasi)", jenis: "Media Sosial Tidak Resmi", terpercaya: false, icon: "📱" }
    ],
    beritaItems: [
      { judul: "Festival Larung Sesaji Telaga Sarangan Menarik Ribuan Wisatawan", isFakta: true },
      { judul: "Larung Sesaji Terbukti Mencemari Air Danau Sarangan", isFakta: false },
      { judul: "Pemkab Magetan Lestarikan Tradisi Larung Sesaji Setiap Tahun", isFakta: true },
      { judul: "Larung Sesaji Dilarang karena Dianggap Menyembah Berhala", isFakta: false }
    ],
    refleksiPertanyaan: [
      "Apa yang kamu pelajari dari tradisi Larung Sesaji hari ini?",
      "Nilai budaya apa yang paling kamu sukai dari Larung Sesaji?",
      "Bagaimana cara kamu ikut melestarikan tradisi Larung Sesaji?"
    ],
    kuis: [
      {
        soal: "Di mana tradisi Larung Sesaji dilaksanakan?",
        opsi: ["Pantai Selatan", "Telaga Sarangan", "Waduk Gajah Mungkur", "Sungai Bengawan Solo"],
        jawaban: 1
      },
      {
        soal: "Apa makna utama dari tradisi Larung Sesaji?",
        opsi: ["Mencari ikan", "Mengusir roh jahat", "Wujud syukur kepada Tuhan", "Olahraga air"],
        jawaban: 2
      },
      {
        soal: "Nilai budaya apa yang tercermin dalam Larung Sesaji?",
        opsi: ["Persaingan", "Gotong Royong", "Individualisme", "Keserakahan"],
        jawaban: 1
      }
    ],
    galeri: [
      { photoId: "1601058497548-f247dfe349d6", caption: "Keindahan alam Telaga Sarangan, Magetan" },
      { photoId: "1529547078401-761086c0a19b", caption: "Perahu sesaji melayang di tengah danau" },
      { photoId: "1589309736404-2e142a2acdf0", caption: "Panorama telaga saat senja tiba" },
      { photoId: "1710611229178-4d9015dd1ba0", caption: "Prosesi warga membawa sesaji bersama" }
    ],
    video: [
      {
        title: "Tradisi Larung Sesaji Telaga Sarangan",
        desc: "Dokumentasi upacara adat Larung Sesaji yang dilaksanakan setiap tahun oleh masyarakat Magetan di Telaga Sarangan.",
        thumbId: "1601058497548-f247dfe349d6",
        query: "larung+sesaji+telaga+sarangan+magetan"
      },
      {
        title: "Makna & Nilai Budaya Larung Sesaji",
        desc: "Penjelasan mendalam mengenai filosofi, sejarah, dan nilai-nilai luhur yang terkandung dalam tradisi Larung Sesaji.",
        thumbId: "1529547078401-761086c0a19b",
        query: "makna+larung+sesaji+budaya+jawa"
      }
    ]
  },
  {
    id: 2,
    name: "Nyadaran",
    emoji: "🌺",
    location: "Magetan, Jawa Timur",
    gradient: "from-emerald-600 to-green-500",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-300",
    desc: "Tradisi ziarah kubur dan penghormatan kepada leluhur masyarakat Magetan.",
    content: {
      pengertian:
        "Nyadaran adalah tradisi ziarah kubur dan membersihkan makam leluhur yang dilakukan masyarakat Jawa, termasuk di Magetan. Tradisi ini dilaksanakan sebagai bentuk penghormatan dan doa kepada arwah para leluhur yang telah mendahului.",
      sejarah:
        "Nyadaran telah diwariskan secara turun-temurun dalam budaya Jawa sejak berabad-abad lalu. Tradisi ini biasanya dilakukan menjelang bulan Ramadan sebagai bagian dari persiapan spiritual masyarakat Magetan.",
      tujuan:
        "Menghormati dan mendoakan arwah leluhur, mempererat tali silaturahmi antar anggota keluarga besar, serta menjaga dan melestarikan nilai-nilai luhur budaya lokal Magetan.",
      nilaiBudaya: ["🙏 Hormat kepada Leluhur", "🤝 Silaturahmi", "❤️ Kebersamaan", "⭐ Religiusitas"]
    },
    faktaItems: [
      "Nyadaran adalah tradisi ziarah kubur untuk menghormati leluhur.",
      "Tradisi ini biasa dilakukan menjelang bulan Ramadan.",
      "Nyadaran mempererat hubungan antar anggota keluarga besar.",
      "Kegiatan ini meliputi doa bersama dan membersihkan makam."
    ],
    faktaQuestions: [
      { soal: "Apa yang dilakukan dalam tradisi Nyadaran?", kunci: ["ziarah", "makam", "kubur", "leluhur", "bersih"] },
      { soal: "Kapan biasanya tradisi Nyadaran dilakukan?", kunci: ["ramadan", "ramadhan", "puasa"] },
      { soal: "Sebutkan satu nilai budaya dalam tradisi Nyadaran!", kunci: ["silaturahmi", "hormat", "kebersamaan", "religius"] }
    ],
    cekFakta: [
      { text: "Nyadaran adalah tradisi pesta makan-makan semata.", benar: false },
      { text: "Nyadaran merupakan bentuk penghormatan kepada leluhur.", benar: true },
      { text: "Nyadaran dilakukan dengan membersihkan makam leluhur.", benar: true },
      { text: "Nyadaran hanya boleh diikuti oleh kaum laki-laki.", benar: false }
    ],
    sumberAnalisis: [
      { nama: "Dinas Kebudayaan dan Pariwisata Jawa Timur (Resmi)", jenis: "Pemerintah Resmi", terpercaya: true, icon: "🏛️" },
      { nama: "Jurnal Budaya Nusantara Vol. 5 — Universitas Airlangga", jenis: "Jurnal Akademik", terpercaya: true, icon: "📚" },
      { nama: "Akun Facebook \"Info Desa Magetan\" (tidak terverifikasi)", jenis: "Media Sosial Tidak Resmi", terpercaya: false, icon: "📱" },
      { nama: "Pesan WhatsApp tanpa sumber yang jelas", jenis: "Pesan Berantai", terpercaya: false, icon: "💬" }
    ],
    beritaItems: [
      { judul: "Masyarakat Magetan Gelar Tradisi Nyadaran dengan Penuh Khidmat", isFakta: true },
      { judul: "Nyadaran Dipercaya Mendatangkan Kutukan bagi Pesertanya", isFakta: false },
      { judul: "Nyadaran Jadi Ajang Mempererat Silaturahmi Keluarga Besar", isFakta: true },
      { judul: "Pemerintah Resmi Larang Tradisi Nyadaran Mulai Tahun Ini", isFakta: false }
    ],
    refleksiPertanyaan: [
      "Apa yang paling kamu pelajari dari tradisi Nyadaran?",
      "Mengapa penting untuk menghormati para leluhur kita?",
      "Bagaimana tradisi Nyadaran bisa memperkuat kebersamaan keluarga?"
    ],
    kuis: [
      {
        soal: "Apa kegiatan utama dalam tradisi Nyadaran?",
        opsi: ["Larung sesaji ke danau", "Ziarah & bersihkan makam leluhur", "Pertunjukan wayang", "Lomba lari desa"],
        jawaban: 1
      },
      {
        soal: "Kapan biasanya tradisi Nyadaran dilakukan?",
        opsi: ["Hari kemerdekaan", "Menjelang bulan Ramadan", "Hari raya Natal", "Tahun Baru Masehi"],
        jawaban: 1
      },
      {
        soal: "Nilai utama yang paling menonjol dalam Nyadaran adalah...",
        opsi: ["Persaingan", "Keserakahan", "Hormat kepada leluhur", "Kemewahan"],
        jawaban: 2
      }
    ],
    galeri: [
      { photoId: "1772787429344-109fdb272441", caption: "Pelaksanaan ritual Nyadaran dengan api sesaji" },
      { photoId: "1772787429356-5acf7e71fe40", caption: "Menuangkan air bunga pada makam leluhur" },
      { photoId: "1772787429407-807643d391de", caption: "Masyarakat berkumpul dalam upacara Nyadaran" },
      { photoId: "1587632467120-c79b296a5dda", caption: "Rangkaian bunga dan sesaji untuk leluhur" }
    ],
    video: [
      {
        title: "Tradisi Nyadaran: Menghormati Leluhur",
        desc: "Liputan langsung prosesi Nyadaran — ziarah kubur, pembersihan makam, dan doa bersama untuk menghormati leluhur.",
        thumbId: "1772787429407-807643d391de",
        query: "tradisi+nyadaran+jawa+menghormati+leluhur"
      },
      {
        title: "Nilai Luhur dalam Tradisi Nyadaran",
        desc: "Penjelasan tentang nilai-nilai luhur silaturahmi, religiusitas, dan cinta leluhur yang terkandung dalam tradisi Nyadaran.",
        thumbId: "1772787429344-109fdb272441",
        query: "nyadaran+budaya+jawa+nilai+leluhur"
      }
    ]
  },
  {
    id: 3,
    name: "Ledhug Suro",
    emoji: "🥁",
    location: "Magetan, Jawa Timur",
    gradient: "from-orange-600 to-amber-500",
    bgLight: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-300",
    desc: "Festival perayaan Tahun Baru Jawa yang meriah dengan iringan bedug dan kesenian tradisional.",
    content: {
      pengertian:
        "Ledhug Suro adalah perayaan Tahun Baru Jawa (1 Muharram/Suro) yang ditandai dengan iringan bunyi ledhug (bedug) dan pertunjukan berbagai kesenian tradisional Jawa. 'Ledhug' berarti bunyi bedug yang dipukul menandai pergantian tahun.",
      sejarah:
        "Perayaan Ledhug Suro telah menjadi festival budaya tahunan di Magetan yang menggabungkan tradisi Islam dan budaya Jawa dengan harmonis. Festival ini menarik ribuan pengunjung dari berbagai daerah dan menjadi kebanggaan masyarakat Magetan.",
      tujuan:
        "Merayakan Tahun Baru Jawa (1 Suro), melestarikan kesenian dan kebudayaan tradisional Jawa, serta mempererat persatuan dan kebersamaan masyarakat Magetan dalam nuansa penuh kegembiraan.",
      nilaiBudaya: ["🤝 Persatuan", "🎭 Pelestarian Budaya", "🌈 Toleransi", "🎨 Kreativitas"]
    },
    faktaItems: [
      "Ledhug Suro merayakan Tahun Baru Jawa (1 Muharram/Suro).",
      "'Ledhug' berasal dari kata bedug yang dipukul saat perayaan.",
      "Festival ini menampilkan berbagai kesenian tradisional Magetan.",
      "Ledhug Suro menjadi daya tarik wisatawan lokal dan mancanegara."
    ],
    faktaQuestions: [
      { soal: "Apa yang dirayakan dalam Ledhug Suro?", kunci: ["tahun baru jawa", "1 suro", "muharram", "suro"] },
      { soal: "Apa arti kata 'Ledhug' dalam Ledhug Suro?", kunci: ["bedug", "gendang", "drum", "tabuh"] },
      {
        soal: "Sebutkan satu nilai budaya dalam festival Ledhug Suro!",
        kunci: ["persatuan", "toleransi", "budaya", "kreativitas", "kebersamaan"]
      }
    ],
    cekFakta: [
      { text: "Ledhug Suro adalah perayaan Tahun Baru Masehi.", benar: false },
      { text: "Ledhug Suro merayakan 1 Suro or Tahun Baru Jawa.", benar: true },
      { text: "Festival ini menampilkan berbagai kesenian tradisional.", benar: true },
      { text: "Ledhug Suro dilarang pemerintah karena dianggap kuno.", benar: false }
    ],
    sumberAnalisis: [
      { nama: "Portal Resmi Kemendikbud RI (kemdikbud.go.id)", jenis: "Pemerintah Resmi", terpercaya: true, icon: "🏛️" },
      { nama: "Ensiklopedi Budaya Jawa — Penerbit Akademia", jenis: "Buku Akademik", terpercaya: true, icon: "📚" },
      { nama: "Akun TikTok @travellerjawa (tidak terverifikasi)", jenis: "Media Sosial Tidak Resmi", terpercaya: false, icon: "📱" },
      { nama: "Blog Anonim \"Mitos dan Fakta Jawa\"", jenis: "Blog Tidak Dikenal", terpercaya: false, icon: "✍️" }
    ],
    beritaItems: [
      { judul: "Festival Ledhug Suro Magetan Ramai Dikunjungi Wisatawan Nusantara", isFakta: true },
      { judul: "Ledhug Suro Dipercaya Mendatangkan Bencana bagi Penonton", isFakta: false },
      { judul: "Pemkab Magetan Daftarkan Ledhug Suro sebagai Warisan Budaya", isFakta: true },
      { judul: "Anak-anak Dilarang Hadir di Festival Ledhug Suro", isFakta: false }
    ],
    refleksiPertanyaan: [
      "Apa keunikan dari festival Ledhug Suro yang paling kamu ingat?",
      "Mengapa penting merayakan dan melestarikan Tahun Baru Jawa?",
      "Apa yang bisa kamu lakukan untuk ikut melestarikan Ledhug Suro?"
    ],
    kuis: [
      {
        soal: "Ledhug Suro adalah perayaan...",
        opsi: ["Tahun Baru Masehi", "Tahun Baru Islam", "Tahun Baru Jawa (1 Suro)", "Hari Kemerdekaan RI"],
        jawaban: 2
      },
      {
        soal: "'Ledhug' dalam Ledhug Suro merujuk pada...",
        opsi: ["Tarian tradisional", "Bunyi bedug/gendang", "Jenis makanan khas", "Nama tokoh pendiri"],
        jawaban: 1
      },
      {
        soal: "Nilai utama yang tercermin dalam Festival Ledhug Suro adalah...",
        opsi: ["Persaingan antar desa", "Persatuan & pelestarian budaya", "Kemewahan gaya hidup", "Permusuhan antar kelompok"],
        jawaban: 1
      }
    ],
    galeri: [
      { photoId: "1752760023111-aed0c41f11f9", caption: "Dua seniman memukul bedug dalam festival Ledhug Suro" },
      { photoId: "1773562612529-7931f115516f", caption: "Penari tradisional tampil bersama gamelan" },
      { photoId: "1631813991050-477dc7f7e2f6", caption: "Perempuan berkebaya dalam perayaan Tahun Baru Jawa" },
      { photoId: "1698267703889-06c41f9acba5", caption: "Suasana meriah festival di tanah Magetan" }
    ],
    video: [
      {
        title: "Festival Ledhug Suro Magetan",
        desc: "Dokumentasi lengkap perayaan Tahun Baru Jawa (1 Suro) di Magetan — arak-arakan bedug, pertunjukan seni, dan antusiasme masyarakat.",
        thumbId: "1752760023111-aed0c41f11f9",
        query: "festival+ledhug+suro+magetan+tahun+baru+jawa"
      },
      {
        title: "Makna Filosofis Ledhug Suro",
        desc: "Menyelami makna di balik bunyi bedug dan ritual Ledhug Suro — perpaduan tradisi Islam dan budaya Jawa dengan harmonis.",
        thumbId: "1773562612529-7931f115516f",
        query: "makna+ledhug+suro+filosofi+budaya+jawa"
      }
    ]
  }
];

export const MOCK_STUDENTS: Student[] = [
  { id: 1, nama: "Budi Santoso", kelas: "5A", misi1: true, misi2: true, misi3: false, skor: 85, waktu: "45 menit", tanggal: "20 Jan 2025" },
  { id: 2, nama: "Siti Rahayu", kelas: "5A", misi1: true, misi2: true, misi3: true, skor: 95, waktu: "52 menit", tanggal: "20 Jan 2025" },
  { id: 3, nama: "Ahmad Fauzi", kelas: "5B", misi1: true, misi2: false, misi3: false, skor: 70, waktu: "28 menit", tanggal: "21 Jan 2025" },
  { id: 4, nama: "Dewi Kartika", kelas: "5B", misi1: true, misi2: true, misi3: true, skor: 92, waktu: "60 menit", tanggal: "21 Jan 2025" },
  { id: 5, nama: "Rizky Pratama", kelas: "5C", misi1: true, misi2: true, misi3: false, skor: 78, waktu: "40 menit", tanggal: "22 Jan 2025" },
  { id: 6, nama: "Nurul Hidayah", kelas: "5C", misi1: true, misi2: true, misi3: true, skor: 88, waktu: "55 menit", tanggal: "22 Jan 2025" },
  { id: 7, nama: "Fajar Kurniawan", kelas: "5A", misi1: false, misi2: false, misi3: false, skor: 0, waktu: "0 menit", tanggal: "-" },
  { id: 8, nama: "Anisa Putri", kelas: "5B", misi1: true, misi2: true, misi3: false, skor: 75, waktu: "38 menit", tanggal: "23 Jan 2025" },
  { id: 9, nama: "Yoga Permana", kelas: "5C", misi1: true, misi2: false, misi3: false, skor: 65, waktu: "22 menit", tanggal: "23 Jan 2025" },
  { id: 10, nama: "Melati Indah", kelas: "5A", misi1: true, misi2: true, misi3: true, skor: 98, waktu: "65 menit", tanggal: "24 Jan 2025" }
];

export const STAGE_ORDER: MissionStage[] = [
  "materi",
  "cari-fakta",
  "cek-fakta",
  "analisis-sumber",
  "detektif-berita",
  "ruang-refleksi",
  "tantangan",
  "selesai"
];

export const STAGE_LABELS: Record<MissionStage, string> = {
  materi: "Materi",
  "cari-fakta": "Cari Fakta",
  "cek-fakta": "Cek Fakta",
  "analisis-sumber": "Analisis Sumber",
  "detektif-berita": "Detektif Berita",
  "ruang-refleksi": "Ruang Refleksi",
  tantangan: "Tantangan",
  selesai: "Selesai"
};
