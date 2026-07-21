import { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  ChevronRight, ChevronLeft, Check, X, LogOut, Download,
  BarChart2, Star, Trophy, Award, BookOpen, Search,
  Shield, Home, MapPin, Users, FileText, HelpCircle, Lightbulb
} from "lucide-react";

// ──────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────
type Role = "guru" | "siswa";
type Screen =
  | "login" | "splash" | "petunjuk" | "profil"
  | "peta-misi" | "mission-flow"
  | "lencana" | "sertifikat"
  | "guru-dashboard";
type MissionStage =
  | "materi" | "cari-fakta" | "cek-fakta"
  | "analisis-sumber" | "detektif-berita"
  | "ruang-refleksi" | "tantangan" | "selesai";
type MateriTab = "pengertian" | "sejarah" | "tujuan" | "nilai-budaya" | "galeri" | "video";

// ──────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────
interface Mission {
  id: number; name: string; emoji: string; location: string;
  gradient: string; bgLight: string; textColor: string; borderColor: string; desc: string;
  content: { pengertian: string; sejarah: string; tujuan: string; nilaiBudaya: string[] };
  faktaItems: string[];
  faktaQuestions: { soal: string; kunci: string[] }[];
  cekFakta: { text: string; benar: boolean }[];
  sumberAnalisis: { nama: string; jenis: string; terpercaya: boolean; icon: string }[];
  beritaItems: { judul: string; isFakta: boolean }[];
  refleksiPertanyaan: string[];
  kuis: { soal: string; opsi: string[]; jawaban: number }[];
  galeri: { photoId: string; caption: string }[];
  video: { title: string; desc: string; thumbId: string; query: string }[];
}

const MISSIONS: Mission[] = [
  {
    id: 1, name: "Larung Sesaji", emoji: "⛵",
    location: "Telaga Sarangan, Magetan",
    gradient: "from-blue-600 to-cyan-500",
    bgLight: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-300",
    desc: "Tradisi ritual syukur di Telaga Sarangan yang dilakukan masyarakat Magetan setiap tahun.",
    content: {
      pengertian: "Larung Sesaji adalah tradisi ritual budaya masyarakat Jawa yang dilakukan di perairan atau danau sebagai wujud syukur kepada Tuhan Yang Maha Esa. Di Magetan, tradisi ini dilaksanakan setiap tahun di Telaga Sarangan dengan cara melarung (menghanyutkan) sesaji ke tengah danau.",
      sejarah: "Tradisi Larung Sesaji telah berlangsung selama ratusan tahun dan diwariskan secara turun-temurun oleh masyarakat Magetan. Kegiatan ini menjadi simbol harmoni antara manusia, alam, dan Sang Pencipta. Setiap tahun, ribuan masyarakat dan wisatawan menyaksikan ritual sakral ini.",
      tujuan: "Larung Sesaji dilaksanakan sebagai ungkapan rasa syukur atas berkah Tuhan Yang Maha Esa, memohon keselamatan bagi masyarakat, serta menjaga kelestarian alam dan kearifan lokal Magetan agar tetap lestari untuk generasi mendatang.",
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
      { soal: "Sebutkan satu nilai budaya dalam Larung Sesaji!", kunci: ["gotong royong", "syukur", "kebersamaan", "harmoni"] },
    ],
    cekFakta: [
      { text: "Larung Sesaji adalah tradisi membuang sampah ke danau.", benar: false },
      { text: "Larung Sesaji dilaksanakan di Telaga Sarangan.", benar: true },
      { text: "Tradisi Larung Sesaji sebagai wujud syukur kepada Tuhan.", benar: true },
      { text: "Larung Sesaji hanya boleh diikuti pemimpin desa.", benar: false },
    ],
    sumberAnalisis: [
      { nama: "Website Resmi Pemkab Magetan (magetan.go.id)", jenis: "Pemerintah Resmi", terpercaya: true, icon: "🏛️" },
      { nama: "Buku \"Kearifan Lokal Jawa Timur\" — Penerbit Balai Pustaka", jenis: "Buku Akademik", terpercaya: true, icon: "📚" },
      { nama: "Blog Pribadi \"Jalan-jalan ke Sarangan\"", jenis: "Blog Pribadi", terpercaya: false, icon: "✍️" },
      { nama: "Akun Instagram @budayamagetan_xyz (tidak diverifikasi)", jenis: "Media Sosial Tidak Resmi", terpercaya: false, icon: "📱" },
    ],
    beritaItems: [
      { judul: "Festival Larung Sesaji Telaga Sarangan Menarik Ribuan Wisatawan", isFakta: true },
      { judul: "Larung Sesaji Terbukti Mencemari Air Danau Sarangan", isFakta: false },
      { judul: "Pemkab Magetan Lestarikan Tradisi Larung Sesaji Setiap Tahun", isFakta: true },
      { judul: "Larung Sesaji Dilarang karena Dianggap Menyembah Berhala", isFakta: false },
    ],
    refleksiPertanyaan: [
      "Apa yang kamu pelajari dari tradisi Larung Sesaji hari ini?",
      "Nilai budaya apa yang paling kamu sukai dari Larung Sesaji?",
      "Bagaimana cara kamu ikut melestarikan tradisi Larung Sesaji?"
    ],
    kuis: [
      { soal: "Di mana tradisi Larung Sesaji dilaksanakan?", opsi: ["Pantai Selatan", "Telaga Sarangan", "Waduk Gajah Mungkur", "Sungai Bengawan Solo"], jawaban: 1 },
      { soal: "Apa makna utama dari tradisi Larung Sesaji?", opsi: ["Mencari ikan", "Mengusir roh jahat", "Wujud syukur kepada Tuhan", "Olahraga air"], jawaban: 2 },
      { soal: "Nilai budaya apa yang tercermin dalam Larung Sesaji?", opsi: ["Persaingan", "Gotong Royong", "Individualisme", "Keserakahan"], jawaban: 1 },
    ],
    galeri: [
      { photoId: "1601058497548-f247dfe349d6", caption: "Keindahan alam Telaga Sarangan, Magetan" },
      { photoId: "1529547078401-761086c0a19b", caption: "Perahu sesaji melayang di tengah danau" },
      { photoId: "1589309736404-2e142a2acdf0", caption: "Panorama telaga saat senja tiba" },
      { photoId: "1710611229178-4d9015dd1ba0", caption: "Prosesi warga membawa sesaji bersama" },
    ],
    video: [
      { title: "Tradisi Larung Sesaji Telaga Sarangan", desc: "Dokumentasi upacara adat Larung Sesaji yang dilaksanakan setiap tahun oleh masyarakat Magetan di Telaga Sarangan.", thumbId: "1601058497548-f247dfe349d6", query: "larung+sesaji+telaga+sarangan+magetan" },
      { title: "Makna & Nilai Budaya Larung Sesaji", desc: "Penjelasan mendalam mengenai filosofi, sejarah, dan nilai-nilai luhur yang terkandung dalam tradisi Larung Sesaji.", thumbId: "1529547078401-761086c0a19b", query: "makna+larung+sesaji+budaya+jawa" },
    ],
  },
  {
    id: 2, name: "Nyadaran", emoji: "🌺",
    location: "Magetan, Jawa Timur",
    gradient: "from-emerald-600 to-green-500",
    bgLight: "bg-emerald-50", textColor: "text-emerald-700", borderColor: "border-emerald-300",
    desc: "Tradisi ziarah kubur dan penghormatan kepada leluhur masyarakat Magetan.",
    content: {
      pengertian: "Nyadaran adalah tradisi ziarah kubur dan membersihkan makam leluhur yang dilakukan masyarakat Jawa, termasuk di Magetan. Tradisi ini dilaksanakan sebagai bentuk penghormatan dan doa kepada arwah para leluhur yang telah mendahului.",
      sejarah: "Nyadaran telah diwariskan secara turun-temurun dalam budaya Jawa sejak berabad-abad lalu. Tradisi ini biasanya dilakukan menjelang bulan Ramadan sebagai bagian dari persiapan spiritual masyarakat Magetan.",
      tujuan: "Menghormati dan mendoakan arwah leluhur, mempererat tali silaturahmi antar anggota keluarga besar, serta menjaga dan melestarikan nilai-nilai luhur budaya lokal Magetan.",
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
      { soal: "Sebutkan satu nilai budaya dalam tradisi Nyadaran!", kunci: ["silaturahmi", "hormat", "kebersamaan", "religius"] },
    ],
    cekFakta: [
      { text: "Nyadaran adalah tradisi pesta makan-makan semata.", benar: false },
      { text: "Nyadaran merupakan bentuk penghormatan kepada leluhur.", benar: true },
      { text: "Nyadaran dilakukan dengan membersihkan makam leluhur.", benar: true },
      { text: "Nyadaran hanya boleh diikuti oleh kaum laki-laki.", benar: false },
    ],
    sumberAnalisis: [
      { nama: "Dinas Kebudayaan dan Pariwisata Jawa Timur (Resmi)", jenis: "Pemerintah Resmi", terpercaya: true, icon: "🏛️" },
      { nama: "Jurnal Budaya Nusantara Vol. 5 — Universitas Airlangga", jenis: "Jurnal Akademik", terpercaya: true, icon: "📚" },
      { nama: "Akun Facebook \"Info Desa Magetan\" (tidak terverifikasi)", jenis: "Media Sosial Tidak Resmi", terpercaya: false, icon: "📱" },
      { nama: "Pesan WhatsApp tanpa sumber yang jelas", jenis: "Pesan Berantai", terpercaya: false, icon: "💬" },
    ],
    beritaItems: [
      { judul: "Masyarakat Magetan Gelar Tradisi Nyadaran dengan Penuh Khidmat", isFakta: true },
      { judul: "Nyadaran Dipercaya Mendatangkan Kutukan bagi Pesertanya", isFakta: false },
      { judul: "Nyadaran Jadi Ajang Mempererat Silaturahmi Keluarga Besar", isFakta: true },
      { judul: "Pemerintah Resmi Larang Tradisi Nyadaran Mulai Tahun Ini", isFakta: false },
    ],
    refleksiPertanyaan: [
      "Apa yang paling kamu pelajari dari tradisi Nyadaran?",
      "Mengapa penting untuk menghormati para leluhur kita?",
      "Bagaimana tradisi Nyadaran bisa memperkuat kebersamaan keluarga?"
    ],
    kuis: [
      { soal: "Apa kegiatan utama dalam tradisi Nyadaran?", opsi: ["Larung sesaji ke danau", "Ziarah & bersihkan makam leluhur", "Pertunjukan wayang", "Lomba lari desa"], jawaban: 1 },
      { soal: "Kapan biasanya tradisi Nyadaran dilakukan?", opsi: ["Hari kemerdekaan", "Menjelang bulan Ramadan", "Hari raya Natal", "Tahun Baru Masehi"], jawaban: 1 },
      { soal: "Nilai utama yang paling menonjol dalam Nyadaran adalah...", opsi: ["Persaingan", "Keserakahan", "Hormat kepada leluhur", "Kemewahan"], jawaban: 2 },
    ],
    galeri: [
      { photoId: "1772787429344-109fdb272441", caption: "Pelaksanaan ritual Nyadaran dengan api sesaji" },
      { photoId: "1772787429356-5acf7e71fe40", caption: "Menuangkan air bunga pada makam leluhur" },
      { photoId: "1772787429407-807643d391de", caption: "Masyarakat berkumpul dalam upacara Nyadaran" },
      { photoId: "1587632467120-c79b296a5dda", caption: "Rangkaian bunga dan sesaji untuk leluhur" },
    ],
    video: [
      { title: "Tradisi Nyadaran: Menghormati Leluhur", desc: "Liputan langsung prosesi Nyadaran — ziarah kubur, pembersihan makam, dan doa bersama untuk menghormati leluhur.", thumbId: "1772787429407-807643d391de", query: "tradisi+nyadaran+jawa+menghormati+leluhur" },
      { title: "Nilai Luhur dalam Tradisi Nyadaran", desc: "Penjelasan tentang nilai-nilai luhur silaturahmi, religiusitas, dan cinta leluhur yang terkandung dalam tradisi Nyadaran.", thumbId: "1772787429344-109fdb272441", query: "nyadaran+budaya+jawa+nilai+leluhur" },
    ],
  },
  {
    id: 3, name: "Ledhug Suro", emoji: "🥁",
    location: "Magetan, Jawa Timur",
    gradient: "from-orange-600 to-amber-500",
    bgLight: "bg-orange-50", textColor: "text-orange-700", borderColor: "border-orange-300",
    desc: "Festival perayaan Tahun Baru Jawa yang meriah dengan iringan bedug dan kesenian tradisional.",
    content: {
      pengertian: "Ledhug Suro adalah perayaan Tahun Baru Jawa (1 Muharram/Suro) yang ditandai dengan iringan bunyi ledhug (bedug) dan pertunjukan berbagai kesenian tradisional Jawa. 'Ledhug' berarti bunyi bedug yang dipukul menandai pergantian tahun.",
      sejarah: "Perayaan Ledhug Suro telah menjadi festival budaya tahunan di Magetan yang menggabungkan tradisi Islam dan budaya Jawa dengan harmonis. Festival ini menarik ribuan pengunjung dari berbagai daerah dan menjadi kebanggaan masyarakat Magetan.",
      tujuan: "Merayakan Tahun Baru Jawa (1 Suro), melestarikan kesenian dan kebudayaan tradisional Jawa, serta mempererat persatuan dan kebersamaan masyarakat Magetan dalam nuansa penuh kegembiraan.",
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
      { soal: "Sebutkan satu nilai budaya dalam festival Ledhug Suro!", kunci: ["persatuan", "toleransi", "budaya", "kreativitas", "kebersamaan"] },
    ],
    cekFakta: [
      { text: "Ledhug Suro adalah perayaan Tahun Baru Masehi.", benar: false },
      { text: "Ledhug Suro merayakan 1 Suro atau Tahun Baru Jawa.", benar: true },
      { text: "Festival ini menampilkan berbagai kesenian tradisional.", benar: true },
      { text: "Ledhug Suro dilarang pemerintah karena dianggap kuno.", benar: false },
    ],
    sumberAnalisis: [
      { nama: "Portal Resmi Kemendikbud RI (kemdikbud.go.id)", jenis: "Pemerintah Resmi", terpercaya: true, icon: "🏛️" },
      { nama: "Ensiklopedi Budaya Jawa — Penerbit Akademia", jenis: "Buku Akademik", terpercaya: true, icon: "📚" },
      { nama: "Akun TikTok @travellerjawa (tidak terverifikasi)", jenis: "Media Sosial Tidak Resmi", terpercaya: false, icon: "📱" },
      { nama: "Blog Anonim \"Mitos dan Fakta Jawa\"", jenis: "Blog Tidak Dikenal", terpercaya: false, icon: "✍️" },
    ],
    beritaItems: [
      { judul: "Festival Ledhug Suro Magetan Ramai Dikunjungi Wisatawan Nusantara", isFakta: true },
      { judul: "Ledhug Suro Dipercaya Mendatangkan Bencana bagi Penonton", isFakta: false },
      { judul: "Pemkab Magetan Daftarkan Ledhug Suro sebagai Warisan Budaya", isFakta: true },
      { judul: "Anak-anak Dilarang Hadir di Festival Ledhug Suro", isFakta: false },
    ],
    refleksiPertanyaan: [
      "Apa keunikan dari festival Ledhug Suro yang paling kamu ingat?",
      "Mengapa penting merayakan dan melestarikan Tahun Baru Jawa?",
      "Apa yang bisa kamu lakukan untuk ikut melestarikan Ledhug Suro?"
    ],
    kuis: [
      { soal: "Ledhug Suro adalah perayaan...", opsi: ["Tahun Baru Masehi", "Tahun Baru Islam", "Tahun Baru Jawa (1 Suro)", "Hari Kemerdekaan RI"], jawaban: 2 },
      { soal: "'Ledhug' dalam Ledhug Suro merujuk pada...", opsi: ["Tarian tradisional", "Bunyi bedug/gendang", "Jenis makanan khas", "Nama tokoh pendiri"], jawaban: 1 },
      { soal: "Nilai utama yang tercermin dalam Festival Ledhug Suro adalah...", opsi: ["Persaingan antar desa", "Persatuan & pelestarian budaya", "Kemewahan gaya hidup", "Permusuhan antar kelompok"], jawaban: 1 },
    ],
    galeri: [
      { photoId: "1752760023111-aed0c41f11f9", caption: "Dua seniman memukul bedug dalam festival Ledhug Suro" },
      { photoId: "1773562612529-7931f115516f", caption: "Penari tradisional tampil bersama gamelan" },
      { photoId: "1631813991050-477dc7f7e2f6", caption: "Perempuan berkebaya dalam perayaan Tahun Baru Jawa" },
      { photoId: "1698267703889-06c41f9acba5", caption: "Suasana meriah festival di tanah Magetan" },
    ],
    video: [
      { title: "Festival Ledhug Suro Magetan", desc: "Dokumentasi lengkap perayaan Tahun Baru Jawa (1 Suro) di Magetan — arak-arakan bedug, pertunjukan seni, dan antusiasme masyarakat.", thumbId: "1752760023111-aed0c41f11f9", query: "festival+ledhug+suro+magetan+tahun+baru+jawa" },
      { title: "Makna Filosofis Ledhug Suro", desc: "Menyelami makna di balik bunyi bedug dan ritual Ledhug Suro — perpaduan tradisi Islam dan budaya Jawa yang harmonis.", thumbId: "1773562612529-7931f115516f", query: "makna+ledhug+suro+filosofi+budaya+jawa" },
    ],
  }
];

const MOCK_STUDENTS = [
  { id: 1, nama: "Budi Santoso", kelas: "5A", misi1: true, misi2: true, misi3: false, skor: 85, waktu: "45 menit", tanggal: "20 Jan 2025" },
  { id: 2, nama: "Siti Rahayu", kelas: "5A", misi1: true, misi2: true, misi3: true, skor: 95, waktu: "52 menit", tanggal: "20 Jan 2025" },
  { id: 3, nama: "Ahmad Fauzi", kelas: "5B", misi1: true, misi2: false, misi3: false, skor: 70, waktu: "28 menit", tanggal: "21 Jan 2025" },
  { id: 4, nama: "Dewi Kartika", kelas: "5B", misi1: true, misi2: true, misi3: true, skor: 92, waktu: "60 menit", tanggal: "21 Jan 2025" },
  { id: 5, nama: "Rizky Pratama", kelas: "5C", misi1: true, misi2: true, misi3: false, skor: 78, waktu: "40 menit", tanggal: "22 Jan 2025" },
  { id: 6, nama: "Nurul Hidayah", kelas: "5C", misi1: true, misi2: true, misi3: true, skor: 88, waktu: "55 menit", tanggal: "22 Jan 2025" },
  { id: 7, nama: "Fajar Kurniawan", kelas: "5A", misi1: false, misi2: false, misi3: false, skor: 0, waktu: "0 menit", tanggal: "-" },
  { id: 8, nama: "Anisa Putri", kelas: "5B", misi1: true, misi2: true, misi3: false, skor: 75, waktu: "38 menit", tanggal: "23 Jan 2025" },
  { id: 9, nama: "Yoga Permana", kelas: "5C", misi1: true, misi2: false, misi3: false, skor: 65, waktu: "22 menit", tanggal: "23 Jan 2025" },
  { id: 10, nama: "Melati Indah", kelas: "5A", misi1: true, misi2: true, misi3: true, skor: 98, waktu: "65 menit", tanggal: "24 Jan 2025" },
];

const STAGE_ORDER: MissionStage[] = [
  "materi", "cari-fakta", "cek-fakta",
  "analisis-sumber", "detektif-berita",
  "ruang-refleksi", "tantangan", "selesai"
];

const STAGE_LABELS: Record<MissionStage, string> = {
  "materi": "Materi", "cari-fakta": "Cari Fakta", "cek-fakta": "Cek Fakta",
  "analisis-sumber": "Analisis Sumber", "detektif-berita": "Detektif Berita",
  "ruang-refleksi": "Ruang Refleksi", "tantangan": "Tantangan", "selesai": "Selesai"
};

// ──────────────────────────────────────────────
// SHARED UI COMPONENTS
// ──────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", className = "", disabled = false }: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "primary" | "secondary" | "amber" | "green" | "red" | "ghost";
  className?: string; disabled?: boolean;
}) {
  const base = "font-['Fredoka'] font-semibold rounded-2xl px-5 py-2.5 transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-300",
    secondary: "bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-300",
    amber: "bg-amber-400 hover:bg-amber-500 text-amber-900 shadow-amber-200",
    green: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200",
    red: "bg-red-500 hover:bg-red-600 text-white shadow-red-200",
    ghost: "bg-white/60 hover:bg-white text-blue-700 border border-blue-200",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function MascotDimas({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "text-4xl" : size === "lg" ? "text-8xl" : "text-6xl";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={s}>🧑‍💻</span>
      <span className="text-xs font-['Fredoka'] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Dimas</span>
    </div>
  );
}

function MascotGita({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "text-4xl" : size === "lg" ? "text-8xl" : "text-6xl";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={s}>👧</span>
      <span className="text-xs font-['Fredoka'] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Gita</span>
    </div>
  );
}

function ScreenHeader({
  title, onBack, onHome, step
}: { title: string; onBack?: () => void; onHome?: () => void; step?: string }) {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-4 py-3 flex items-center gap-3 shadow-lg">
      {onBack && (
        <button onClick={onBack} className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
          <ChevronLeft size={20} />
        </button>
      )}
      <div className="flex-1">
        <h2 className="font-['Fredoka'] font-semibold text-lg leading-tight">{title}</h2>
        {step && <p className="text-blue-200 text-xs font-['Nunito']">{step}</p>}
      </div>
      {onHome && (
        <button onClick={onHome} className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
          <Home size={18} />
        </button>
      )}
    </div>
  );
}

function SkyBg({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-blue-100 ${className}`}>
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────
// LOGIN SCREEN
// ──────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (role: Role, name: string) => void }) {
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [guruPass, setGuruPass] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!role) { setError("Pilih peran terlebih dahulu!"); return; }
    if (role === "siswa" && !name.trim()) { setError("Masukkan nama kamu!"); return; }
    if (role === "guru" && guruPass !== "guru123") { setError("Password guru salah!"); return; }
    onLogin(role, role === "siswa" ? name : "Guru");
  };

  return (
    <SkyBg className="flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🔍</div>
          <h1 className="font-['Fredoka'] font-bold text-4xl text-white drop-shadow-lg">DEDIGMA</h1>
          <p className="font-['Nunito'] text-blue-100 text-sm mt-1">Detektif Digital Budaya Magetan</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-4">
          <h2 className="font-['Fredoka'] font-semibold text-xl text-blue-800 text-center">Masuk sebagai</h2>

          <div className="grid grid-cols-2 gap-3">
            {(["siswa", "guru"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setError(""); }}
                className={`p-4 rounded-2xl border-2 transition-all font-['Fredoka'] font-semibold text-lg flex flex-col items-center gap-1 cursor-pointer
                  ${role === r ? "border-blue-500 bg-blue-50 text-blue-700 scale-105 shadow-md" : "border-gray-200 text-gray-500 hover:border-blue-300"}`}
              >
                <span className="text-3xl">{r === "siswa" ? "🧒" : "👩‍🏫"}</span>
                {r === "siswa" ? "Siswa" : "Guru"}
              </button>
            ))}
          </div>

          {role === "siswa" && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              <label className="font-['Nunito'] font-semibold text-sm text-gray-600 block mb-1">Nama Kamu</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Tulis nama kamu di sini..."
                className="w-full border-2 border-blue-200 rounded-2xl px-4 py-2.5 font-['Nunito'] text-gray-700 focus:outline-none focus:border-blue-500 bg-blue-50"
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
            </motion.div>
          )}

          {role === "guru" && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              <label className="font-['Nunito'] font-semibold text-sm text-gray-600 block mb-1">Password Guru</label>
              <input
                type="password" value={guruPass} onChange={e => setGuruPass(e.target.value)}
                placeholder="Masukkan password guru..."
                className="w-full border-2 border-blue-200 rounded-2xl px-4 py-2.5 font-['Nunito'] text-gray-700 focus:outline-none focus:border-blue-500 bg-blue-50"
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
              <p className="text-xs text-gray-400 mt-1 font-['Nunito']">Password: guru123</p>
            </motion.div>
          )}

          {error && (
            <p className="text-red-500 text-sm font-['Nunito'] text-center bg-red-50 rounded-xl py-2">{error}</p>
          )}

          <Btn onClick={handleSubmit} variant="primary" className="w-full text-xl py-3">
            Masuk 🚀
          </Btn>
        </div>
      </motion.div>
    </SkyBg>
  );
}

// ──────────────────────────────────────────────
// SPLASH SCREEN
// ──────────────────────────────────────────────
function SplashScreen({ studentName, onMulai, onPetunjuk, onProfil, onLogout }: {
  studentName: string; onMulai: () => void; onPetunjuk: () => void;
  onProfil: () => void; onLogout: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-cyan-300 flex flex-col overflow-hidden relative">
      {/* Top bar */}
      <div className="flex justify-between items-center px-4 pt-4">
        <div className="bg-white/20 rounded-2xl px-3 py-1.5">
          <span className="font-['Nunito'] font-bold text-white text-sm">👋 Halo, {studentName}!</span>
        </div>
        <button onClick={onLogout} className="bg-white/20 rounded-2xl p-2 hover:bg-white/30 transition-colors">
          <LogOut size={18} className="text-white" />
        </button>
      </div>

      {/* Mountains decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-green-700 to-green-500" style={{ clipPath: "polygon(0 60%, 15% 30%, 30% 50%, 50% 10%, 70% 40%, 85% 20%, 100% 45%, 100% 100%, 0 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-green-800 to-green-600" style={{ clipPath: "polygon(0 70%, 20% 45%, 40% 60%, 60% 30%, 80% 50%, 100% 35%, 100% 100%, 0 100%)" }} />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-center mb-2"
        >
          <div className="bg-white/20 backdrop-blur rounded-3xl px-6 py-4 mb-4 inline-block">
            <h1 className="font-['Fredoka'] font-bold text-5xl text-white drop-shadow-lg">DEDIGMA</h1>
            <p className="font-['Fredoka'] font-semibold text-blue-100 text-sm tracking-wider">DETEKTIF DIGITAL BUDAYA MAGETAN</p>
          </div>
          <p className="font-['Nunito'] text-white/90 text-base font-semibold max-w-xs mx-auto leading-relaxed">
            🔍 Jelajahi Budaya, Temukan Fakta, Lestarikan Warisan!
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex items-end gap-8 my-4"
        >
          <MascotDimas size="lg" />
          <MascotGita size="lg" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
          className="space-y-3 w-full max-w-xs"
        >
          <Btn onClick={onMulai} variant="amber" className="w-full text-2xl py-4">
            🗺️ MULAI
          </Btn>
          <div className="grid grid-cols-2 gap-3">
            <Btn onClick={onPetunjuk} variant="secondary" className="flex items-center justify-center gap-2 py-3">
              <HelpCircle size={18} /> Petunjuk
            </Btn>
            <Btn onClick={onProfil} variant="secondary" className="flex items-center justify-center gap-2 py-3">
              <Users size={18} /> Profil
            </Btn>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// PETUNJUK SCREEN
// ──────────────────────────────────────────────
function PetunjukScreen({ onBack }: { onBack: () => void }) {
  const buttons = [
    { icon: "🏠", label: "Tombol Beranda", desc: "Kembali ke halaman utama" },
    { icon: "📖", label: "Tombol Materi", desc: "Membuka materi budaya" },
    { icon: "⬅️", label: "Tombol Kembali", desc: "Kembali ke halaman sebelumnya" },
    { icon: "⭐", label: "Tombol Aktivitas", desc: "Membuka halaman aktivitas" },
    { icon: "➡️", label: "Tombol Lanjut", desc: "Melanjutkan ke halaman berikutnya" },
    { icon: "🏅", label: "Tombol Lencana", desc: "Melihat lencana yang kamu dapatkan" },
  ];

  const cara = [
    "Baca materi budaya dengan teliti sebelum mengerjakan aktivitas.",
    "Kerjakan semua aktivitas secara berurutan dari Misi 1 hingga Misi 3.",
    "Selesaikan semua misi untuk mendapatkan sertifikat digital.",
  ];

  return (
    <SkyBg>
      <ScreenHeader title="Petunjuk Penggunaan 📋" onBack={onBack} />
      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <div className="flex gap-4 items-start">
          <MascotDimas size="sm" />
          <div className="bg-white rounded-2xl p-3 shadow flex-1">
            <p className="font-['Nunito'] text-blue-800 text-sm">
              Halo! Aku Dimas. Baca petunjuk ini supaya kamu bisa menggunakan DEDIGMA dengan mudah! 😊
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-4">
          <h3 className="font-['Fredoka'] font-semibold text-blue-700 text-lg mb-3">Fungsi Tombol</h3>
          <div className="grid grid-cols-2 gap-2">
            {buttons.map((b, i) => (
              <div key={i} className="bg-blue-50 rounded-2xl p-3 flex items-start gap-2">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="font-['Fredoka'] font-semibold text-blue-700 text-sm">{b.label}</p>
                  <p className="font-['Nunito'] text-gray-500 text-xs">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-4">
          <h3 className="font-['Fredoka'] font-semibold text-blue-700 text-lg mb-3">Cara Mengerjakan Aktivitas</h3>
          <div className="space-y-2">
            {cara.map((c, i) => (
              <div key={i} className="flex items-start gap-3 bg-amber-50 rounded-2xl p-3">
                <span className="bg-amber-400 text-white font-['Fredoka'] font-bold w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">{i + 1}</span>
                <p className="font-['Nunito'] text-gray-700 text-sm">{c}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-8 py-2">
          <MascotDimas size="sm" />
          <MascotGita size="sm" />
        </div>
      </div>
    </SkyBg>
  );
}

// ──────────────────────────────────────────────
// PROFIL PENGEMBANG SCREEN
// ──────────────────────────────────────────────
function ProfilScreen({ onBack }: { onBack: () => void }) {
  return (
    <SkyBg>
      <ScreenHeader title="Profil Pengembang 👩‍💻" onBack={onBack} />
      <div className="p-4 max-w-md mx-auto space-y-4">
        <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
          <div className="text-6xl mb-3">🎓</div>
          <h2 className="font-['Fredoka'] font-bold text-2xl text-blue-700">DEDIGMA</h2>
          <p className="font-['Fredoka'] text-amber-600 font-semibold">Detektif Digital Budaya Magetan</p>
          <div className="mt-4 bg-blue-50 rounded-2xl p-3 text-left space-y-2">
            <p className="font-['Nunito'] text-sm text-gray-600"><span className="font-bold text-blue-700">Versi:</span> 1.0.0</p>
            <p className="font-['Nunito'] text-sm text-gray-600"><span className="font-bold text-blue-700">Jenjang:</span> Sekolah Dasar</p>
            <p className="font-['Nunito'] text-sm text-gray-600"><span className="font-bold text-blue-700">Mata Pelajaran:</span> Literasi Digital & Budaya</p>
            <p className="font-['Nunito'] text-sm text-gray-600"><span className="font-bold text-blue-700">Tema:</span> Kearifan Lokal Magetan</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-4">
          <h3 className="font-['Fredoka'] font-semibold text-blue-700 text-lg mb-2">Maskot DEDIGMA</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-2xl p-3 text-center">
              <MascotDimas size="sm" />
              <p className="font-['Nunito'] text-xs text-gray-600 mt-2">Mewakili literasi digital. Kritis, rasa ingin tahu tinggi.</p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-3 text-center">
              <MascotGita size="sm" />
              <p className="font-['Nunito'] text-xs text-gray-600 mt-2">Mewakili literasi budaya. Cinta budaya lokal Magetan.</p>
            </div>
          </div>
        </div>
      </div>
    </SkyBg>
  );
}

// ──────────────────────────────────────────────
// PETA MISI SCREEN — adventure map style
// ──────────────────────────────────────────────
function IslandNode({ mission, done, unlocked, onClick, style }: {
  mission: Mission; done: boolean; unlocked: boolean;
  onClick: () => void; style: React.CSSProperties;
}) {
  const gradients: Record<number, string> = {
    1: "from-blue-500 to-cyan-400",
    2: "from-emerald-500 to-green-400",
    3: "from-orange-500 to-amber-400",
  };
  const illustrations: Record<number, string> = { 1: "⛵🌊🏔️", 2: "🌺🏘️🌿", 3: "🥁🎭🏯" };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: mission.id * 0.2, type: "spring", stiffness: 200 }}
      className="absolute"
      style={style}
    >
      {/* Island terrain blob */}
      <div className="absolute inset-0 -m-4 rounded-full bg-green-700/60 blur-md" style={{ transform: "scale(1.3)" }} />

      {/* Number badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow-lg flex items-center justify-center">
        <span className="font-['Fredoka'] font-bold text-amber-900 text-sm">{mission.id}</span>
      </div>

      {/* Card */}
      <button
        onClick={onClick}
        disabled={!unlocked}
        className={`relative z-10 w-28 rounded-xl overflow-hidden shadow-xl border-2 transition-all cursor-pointer
          ${done ? "border-yellow-300" : unlocked ? "border-white/70 hover:scale-110 active:scale-95" : "border-white/30 grayscale opacity-70"}
        `}
      >
        {/* Illustration area */}
        <div className={`h-20 bg-gradient-to-br ${gradients[mission.id]} flex items-center justify-center text-2xl relative overflow-hidden`}>
          {/* Sky/background */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300/60 to-transparent" />
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-green-600/70" />
          {/* Content */}
          <div className="relative z-10 text-center leading-none">
            {unlocked ? (
              <span className="text-2xl drop-shadow">{mission.emoji}</span>
            ) : (
              <span className="text-2xl">🔒</span>
            )}
          </div>
          {done && (
            <div className="absolute top-1 right-1 text-base">✅</div>
          )}
        </div>

        {/* Name banner */}
        <div className={`px-1.5 py-1.5 text-center ${done ? "bg-green-700" : unlocked ? "bg-blue-900" : "bg-gray-700"}`}>
          <p className="font-['Fredoka'] font-bold text-white text-xs leading-tight">{mission.name}</p>
          {done && <p className="text-yellow-300 text-[9px] font-['Nunito']">✨ Selesai</p>}
          {!done && unlocked && <p className="text-blue-200 text-[9px] font-['Nunito']">Tap untuk mulai</p>}
          {!unlocked && <p className="text-gray-400 text-[9px] font-['Nunito']">🔒 Terkunci</p>}
        </div>
      </button>
    </motion.div>
  );
}

function PetaMisiScreen({ completedMissions, onMission, onBack }: {
  completedMissions: Set<number>; onMission: (id: number) => void; onBack: () => void;
}) {
  // Island positions (left%, top%) — matching the reference image layout:
  // Misi 1 bottom-left, Misi 2 center, Misi 3 top-right
  const positions = [
    { left: "7%",  top: "48%" },   // Misi 1 — Larung Sesaji (bottom-left)
    { left: "37%", top: "22%" },   // Misi 2 — Nyadaran (center)
    { left: "67%", top: "8%"  },   // Misi 3 — Ledhug Suro (top-right)
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #0f4c6e 0%, #1a6b5c 40%, #0d3d5c 100%)" }}>
      {/* Header */}
      <div className="bg-black/30 backdrop-blur px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-['Fredoka'] font-bold text-white text-xl tracking-wide">PETA MISI BUDAYA</h2>
        </div>
        <div className="w-8" />
      </div>

      {/* Subtitle */}
      <div className="text-center py-2">
        <p className="font-['Nunito'] text-cyan-200 text-sm px-4">Pilih misi budaya yang ingin kamu jelajahi!</p>
      </div>

      {/* Map canvas */}
      <div className="flex-1 relative overflow-hidden mx-3 mb-3 rounded-3xl" style={{ minHeight: 340 }}>
        {/* Ocean texture */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ background: "radial-gradient(ellipse at 30% 60%, #1a7a5e 0%, #0d5a8a 50%, #0a3d6b 100%)" }}>
          {/* Wave lines */}
          {[20, 35, 50, 65, 80].map((top, i) => (
            <div key={i} className="absolute left-0 right-0 h-px bg-cyan-400/20"
              style={{ top: `${top}%`, transform: `rotate(${i % 2 === 0 ? -1.5 : 1}deg)` }} />
          ))}
          {/* Sparkle stars */}
          {["5%,15%","80%,25%","20%,75%","60%,55%","90%,70%","45%,85%"].map((pos, i) => {
            const [l, t] = pos.split(",");
            return <div key={i} className="absolute text-xs opacity-60" style={{ left: l, top: t }}>✨</div>;
          })}
          {/* Decorative trees/islands hints */}
          {["15%,90%","55%,80%","85%,55%"].map((pos, i) => {
            const [l, t] = pos.split(",");
            return <div key={i} className="absolute opacity-40 text-base" style={{ left: l, top: t }}>🌳</div>;
          })}
        </div>

        {/* SVG connecting path between islands */}
        <svg
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          viewBox="0 0 100 100" preserveAspectRatio="none"
        >
          <defs>
            <marker id="arrowhead" markerWidth="4" markerHeight="3" refX="2" refY="1.5" orient="auto">
              <polygon points="0 0, 4 1.5, 0 3" fill="#fbbf24" opacity="0.9" />
            </marker>
          </defs>
          {/* Dashed path from Misi 1 → Misi 2 */}
          <path
            d="M 21 68 Q 36 52 51 40"
            stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="3 2"
            fill="none" opacity="0.85"
            markerEnd="url(#arrowhead)"
          />
          {/* Dashed path from Misi 2 → Misi 3 */}
          <path
            d="M 51 40 Q 66 28 81 24"
            stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="3 2"
            fill="none" opacity="0.85"
            markerEnd="url(#arrowhead)"
          />
        </svg>

        {/* Island nodes */}
        {MISSIONS.map((m, idx) => {
          const done = completedMissions.has(m.id);
          const unlocked = m.id === 1 || completedMissions.has(m.id - 1);
          return (
            <IslandNode
              key={m.id}
              mission={m}
              done={done}
              unlocked={unlocked}
              onClick={() => unlocked && onMission(m.id)}
              style={{
                left: positions[idx].left,
                top: positions[idx].top,
                width: 112,
              }}
            />
          );
        })}

        {/* Mascots bottom-right */}
        <div className="absolute bottom-3 right-3 z-20 flex items-end gap-2">
          <MascotDimas size="sm" />
          <MascotGita size="sm" />
        </div>
      </div>

      {/* Info bar */}
      <div className="mx-3 mb-4 bg-blue-800/80 backdrop-blur rounded-2xl px-4 py-2.5 border border-blue-500/40">
        <p className="font-['Nunito'] text-blue-100 text-xs text-center leading-relaxed">
          Selesaikan setiap misi secara berurutan untuk membuka misi berikutnya dan mendapatkan lencana! 🏅
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// HELPERS FOR MATERI
// ──────────────────────────────────────────────
function unsplashUrl(photoId: string, w = 400, h = 260) {
  return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

function VideoCard({ item }: { item: { title: string; desc: string; thumbId: string; query: string } }) {
  const [playing, setPlaying] = useState(false);
  const youtubeSearch = `https://www.youtube.com/results?search_query=${item.query}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Thumbnail / player area */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <img
          src={unsplashUrl(item.thumbId, 640, 360)}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Play button */}
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 flex items-center justify-center group"
        >
          <div className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-700 transition-all shadow-2xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </button>
        {/* YouTube badge */}
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-['Fredoka'] font-semibold px-2 py-0.5 rounded-md">
          ▶ YouTube
        </div>
      </div>

      {/* Info + link */}
      <div className="p-3 space-y-2">
        <h4 className="font-['Fredoka'] font-semibold text-gray-800 text-base leading-tight">{item.title}</h4>
        <p className="font-['Nunito'] text-gray-500 text-xs leading-relaxed">{item.desc}</p>
        <a
          href={youtubeSearch}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-['Fredoka'] font-semibold text-sm px-4 py-2 rounded-xl transition-all shadow"
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><polygon points="5,3 19,12 5,21" /></svg>
          Tonton di YouTube
        </a>
      </div>

      {/* Modal overlay when play clicked */}
      {playing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPlaying(false)}>
          <div className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <p className="font-['Fredoka'] font-semibold text-white text-sm">{item.title}</p>
              <button onClick={() => setPlaying(false)} className="text-white bg-white/20 rounded-full p-1"><X size={18} /></button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/results?search_query=${item.query}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="text-white/60 text-xs text-center mt-2 font-['Nunito']">
              Atau{" "}
              <a href={youtubeSearch} target="_blank" rel="noopener noreferrer" className="text-red-400 underline">buka langsung di YouTube</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// MATERI SCREEN
// ──────────────────────────────────────────────
function MateriScreen({ mission, onNext }: { mission: Mission; onNext: () => void }) {
  const [tab, setTab] = useState<MateriTab>("pengertian");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const tabs: { key: MateriTab; label: string; icon: string }[] = [
    { key: "pengertian", label: "Pengertian", icon: "📖" },
    { key: "sejarah", label: "Sejarah", icon: "📜" },
    { key: "tujuan", label: "Tujuan", icon: "🎯" },
    { key: "nilai-budaya", label: "Nilai Budaya", icon: "⭐" },
    { key: "galeri", label: "Galeri", icon: "🖼️" },
    { key: "video", label: "Video", icon: "🎬" },
  ];
  const content = mission.content;

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar — scrollable */}
      <div className="bg-white border-b border-blue-100 px-3 py-2 flex gap-2 overflow-x-auto scrollbar-none">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-['Fredoka'] font-semibold text-sm whitespace-nowrap transition-all cursor-pointer flex-shrink-0
              ${tab === t.key
                ? t.key === "galeri" ? "bg-purple-600 text-white shadow"
                : t.key === "video" ? "bg-red-600 text-white shadow"
                : "bg-blue-600 text-white shadow"
              : "text-gray-500 hover:bg-gray-100"}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mission header banner */}
        <div className={`flex items-center gap-3 bg-gradient-to-r ${mission.gradient} text-white rounded-2xl p-3`}>
          <span className="text-4xl">{mission.emoji}</span>
          <div>
            <h2 className="font-['Fredoka'] font-bold text-xl">{mission.name}</h2>
            <p className="text-white/80 text-xs font-['Nunito']"><MapPin size={10} className="inline" /> {mission.location}</p>
          </div>
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

          {/* ── Text tabs ── */}
          {(tab === "pengertian" || tab === "sejarah" || tab === "tujuan") && (
            <div className="bg-white rounded-2xl p-4 shadow">
              <p className="font-['Nunito'] text-gray-700 leading-relaxed text-sm">
                {tab === "pengertian" && content.pengertian}
                {tab === "sejarah" && content.sejarah}
                {tab === "tujuan" && content.tujuan}
              </p>
            </div>
          )}

          {/* ── Nilai Budaya ── */}
          {tab === "nilai-budaya" && (
            <div className="grid grid-cols-2 gap-3">
              {content.nilaiBudaya.map((n, i) => (
                <div key={i} className={`${mission.bgLight} rounded-2xl p-4 text-center shadow`}>
                  <p className={`font-['Fredoka'] font-semibold ${mission.textColor} text-base`}>{n}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Galeri ── */}
          {tab === "galeri" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-purple-50 rounded-xl px-3 py-2">
                <span className="text-lg">🖼️</span>
                <p className="font-['Nunito'] text-purple-700 text-xs font-semibold">Ketuk foto untuk melihat lebih besar</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mission.galeri.map((item, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setLightbox(i)}
                    className="rounded-2xl overflow-hidden shadow-md text-left cursor-pointer"
                  >
                    <img
                      src={unsplashUrl(item.photoId)}
                      alt={item.caption}
                      className="w-full h-28 object-cover"
                    />
                    <div className="bg-white px-2 py-1.5">
                      <p className="font-['Nunito'] text-gray-600 text-xs leading-tight">{item.caption}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* ── Video ── */}
          {tab === "video" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2">
                <span className="text-lg">🎬</span>
                <p className="font-['Nunito'] text-red-700 text-xs font-semibold">Tonton video pembelajaran tentang {mission.name}</p>
              </div>
              {mission.video.map((v, i) => (
                <VideoCard key={i} item={v} />
              ))}
            </div>
          )}

        </motion.div>

        {/* Mascot tip — shown for reading tabs */}
        {["pengertian", "sejarah", "tujuan", "nilai-budaya"].includes(tab) && (
          <div className="flex gap-3 items-start">
            <MascotDimas size="sm" />
            <div className="bg-blue-50 rounded-2xl p-3 flex-1 text-sm font-['Nunito'] text-blue-700">
              Baca setiap tab dengan teliti ya! Lanjutkan ke tab <strong>Galeri</strong> dan <strong>Video</strong> untuk materi yang lebih seru! 💪
            </div>
          </div>
        )}
        {tab === "galeri" && (
          <div className="flex gap-3 items-start">
            <MascotGita size="sm" />
            <div className="bg-purple-50 rounded-2xl p-3 flex-1 text-sm font-['Nunito'] text-purple-700">
              Ini foto-foto dokumentasi budaya {mission.name}. Amati dengan teliti ya! 📸
            </div>
          </div>
        )}
        {tab === "video" && (
          <div className="flex gap-3 items-start">
            <MascotDimas size="sm" />
            <div className="bg-red-50 rounded-2xl p-3 flex-1 text-sm font-['Nunito'] text-red-700">
              Tonton video ini untuk memahami lebih dalam tradisi {mission.name}! 🎬
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-blue-100">
        <Btn onClick={onNext} variant="primary" className="w-full text-lg">
          Mulai Aktivitas <ChevronRight size={20} className="inline" />
        </Btn>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-['Nunito'] text-white/70 text-xs">
                {lightbox + 1} / {mission.galeri.length}
              </span>
              <button onClick={() => setLightbox(null)} className="text-white bg-white/20 rounded-full p-1.5">
                <X size={18} />
              </button>
            </div>
            <img
              src={unsplashUrl(mission.galeri[lightbox].photoId, 800, 520)}
              alt={mission.galeri[lightbox].caption}
              className="w-full rounded-2xl object-cover shadow-2xl"
            />
            <p className="font-['Nunito'] text-white text-sm text-center mt-3 leading-relaxed">
              {mission.galeri[lightbox].caption}
            </p>
            {/* prev / next */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setLightbox(l => l !== null && l > 0 ? l - 1 : mission.galeri.length - 1)}
                className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 font-['Fredoka'] font-semibold text-sm"
              >
                ← Sebelumnya
              </button>
              <button
                onClick={() => setLightbox(l => l !== null && l < mission.galeri.length - 1 ? l + 1 : 0)}
                className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 font-['Fredoka'] font-semibold text-sm"
              >
                Berikutnya →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// CARI FAKTA SCREEN
// ──────────────────────────────────────────────
function CariFaktaScreen({ mission, onNext }: { mission: Mission; onNext: (score: number) => void }) {
  const [answers, setAnswers] = useState<string[]>(mission.faktaQuestions.map(() => ""));
  const [results, setResults] = useState<boolean[] | null>(null);

  const checkAnswers = () => {
    const res = mission.faktaQuestions.map((q, i) => {
      const ans = answers[i].toLowerCase().trim();
      return q.kunci.some(k => ans.includes(k));
    });
    setResults(res);
  };

  const score = results ? Math.round((results.filter(Boolean).length / results.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl p-4">
          <h2 className="font-['Fredoka'] font-bold text-xl flex items-center gap-2">
            <Search size={22} /> Cari Fakta Budaya
          </h2>
          <p className="font-['Nunito'] text-blue-100 text-sm mt-1">
            Berdasarkan materi di atas, temukan fakta penting tentang {mission.name}!
          </p>
        </div>

        {mission.faktaQuestions.map((q, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-700 font-['Fredoka'] font-bold w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">{i + 1}</span>
              <p className="font-['Nunito'] font-semibold text-gray-700 text-sm">{q.soal}</p>
            </div>
            <input
              value={answers[i]}
              onChange={e => setAnswers(prev => prev.map((a, j) => j === i ? e.target.value : a))}
              placeholder="Tulis jawabanmu di sini..."
              disabled={!!results}
              className={`w-full border-2 rounded-xl px-3 py-2 font-['Nunito'] text-sm focus:outline-none transition-colors
                ${results ? (results[i] ? "border-green-400 bg-green-50 text-green-700" : "border-red-400 bg-red-50 text-red-700") : "border-blue-200 focus:border-blue-500 bg-blue-50"}`}
            />
            {results && (
              <div className={`flex items-center gap-2 text-sm font-['Nunito'] font-semibold ${results[i] ? "text-green-600" : "text-red-600"}`}>
                {results[i] ? <><Check size={16} /> Jawaban kamu tepat!</> : <><X size={16} /> Kurang tepat. Kata kunci: {q.kunci[0]}</>}
              </div>
            )}
          </div>
        ))}

        {results && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className={`rounded-2xl p-4 text-center ${score >= 67 ? "bg-green-100 border-2 border-green-400" : "bg-amber-100 border-2 border-amber-400"}`}>
            <p className="font-['Fredoka'] font-bold text-2xl text-gray-800">{score >= 67 ? "🎉 Bagus!" : "💪 Terus Semangat!"}</p>
            <p className="font-['Nunito'] text-gray-600 text-sm">Skor kamu: <strong>{score}</strong></p>
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-blue-100 flex gap-3">
        {!results ? (
          <Btn onClick={checkAnswers} variant="primary" className="flex-1 text-lg">
            Cek Jawaban ✅
          </Btn>
        ) : (
          <Btn onClick={() => onNext(score)} variant="green" className="flex-1 text-lg">
            Lanjut <ChevronRight size={20} className="inline" />
          </Btn>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// CEK FAKTA SCREEN
// ──────────────────────────────────────────────
function CekFaktaScreen({ mission, onNext }: { mission: Mission; onNext: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>(
    Object.fromEntries(mission.cekFakta.map((_, i) => [i, null]))
  );
  const [checked, setChecked] = useState(false);

  const allAnswered = Object.values(answers).every(a => a !== null);
  const score = checked
    ? Math.round((mission.cekFakta.filter((f, i) => answers[i] === f.benar).length / mission.cekFakta.length) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-4">
          <h2 className="font-['Fredoka'] font-bold text-xl flex items-center gap-2">
            <Shield size={22} /> Cek Fakta
          </h2>
          <p className="font-['Nunito'] text-blue-100 text-sm mt-1">
            Pilih: apakah informasi berikut tentang {mission.name} itu BENAR atau KELIRU?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-green-100 rounded-2xl p-2 border-2 border-green-300">
            <span className="font-['Fredoka'] font-semibold text-green-700">✅ INFORMASI BENAR</span>
          </div>
          <div className="bg-red-100 rounded-2xl p-2 border-2 border-red-300">
            <span className="font-['Fredoka'] font-semibold text-red-600">❌ INFORMASI KELIRU</span>
          </div>
        </div>

        {mission.cekFakta.map((item, i) => {
          const userAnswer = answers[i];
          const isCorrect = checked ? userAnswer === item.benar : null;
          return (
            <div key={i} className={`bg-white rounded-2xl shadow p-4 border-2 transition-all
              ${checked ? (isCorrect ? "border-green-400" : "border-red-400") : "border-blue-100"}`}>
              <p className="font-['Nunito'] text-gray-700 text-sm mb-3">{item.text}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => !checked && setAnswers(prev => ({ ...prev, [i]: true }))}
                  disabled={checked}
                  className={`flex-1 py-2 rounded-xl font-['Fredoka'] font-semibold text-sm border-2 transition-all cursor-pointer
                    ${userAnswer === true ? "bg-green-500 border-green-500 text-white" : "border-green-300 text-green-600 hover:bg-green-50"}`}
                >
                  ✅ Benar
                </button>
                <button
                  onClick={() => !checked && setAnswers(prev => ({ ...prev, [i]: false }))}
                  disabled={checked}
                  className={`flex-1 py-2 rounded-xl font-['Fredoka'] font-semibold text-sm border-2 transition-all cursor-pointer
                    ${userAnswer === false ? "bg-red-500 border-red-500 text-white" : "border-red-300 text-red-500 hover:bg-red-50"}`}
                >
                  ❌ Keliru
                </button>
              </div>
              {checked && (
                <p className={`text-xs mt-2 font-['Nunito'] font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? "✓ Benar! Jawaban kamu tepat." : `✗ Kurang tepat. Informasi ini sebenarnya ${item.benar ? "BENAR" : "KELIRU"}.`}
                </p>
              )}
            </div>
          );
        })}

        {checked && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className={`rounded-2xl p-4 text-center ${score >= 75 ? "bg-green-100 border-2 border-green-400" : "bg-amber-100 border-2 border-amber-400"}`}>
            <p className="font-['Fredoka'] font-bold text-2xl">{score >= 75 ? "🎉 Keren!" : "💪 Semangat!"}</p>
            <p className="font-['Nunito'] text-gray-600 text-sm">Skor: <strong>{score}</strong></p>
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-blue-100">
        {!checked ? (
          <Btn onClick={() => setChecked(true)} variant="primary" disabled={!allAnswered} className="w-full text-lg">
            Cek Hasil ✅
          </Btn>
        ) : (
          <Btn onClick={() => onNext(score)} variant="green" className="w-full text-lg">
            Lanjut <ChevronRight size={20} className="inline" />
          </Btn>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// ANALISIS SUMBER SCREEN
// ──────────────────────────────────────────────
function AnalisisSumberScreen({ mission, onNext }: { mission: Mission; onNext: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>(
    Object.fromEntries(mission.sumberAnalisis.map((_, i) => [i, null]))
  );
  const [checked, setChecked] = useState(false);

  const allAnswered = Object.values(answers).every(a => a !== null);
  const score = checked
    ? Math.round((mission.sumberAnalisis.filter((s, i) => answers[i] === s.terpercaya).length / mission.sumberAnalisis.length) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-2xl p-4">
          <h2 className="font-['Fredoka'] font-bold text-xl flex items-center gap-2">
            <BookOpen size={22} /> Analisis Sumber
          </h2>
          <p className="font-['Nunito'] text-purple-100 text-sm mt-1">
            Manakah sumber informasi yang TERPERCAYA dan yang TIDAK TERPERCAYA?
          </p>
        </div>

        {mission.sumberAnalisis.map((s, i) => {
          const userAnswer = answers[i];
          const isCorrect = checked ? userAnswer === s.terpercaya : null;
          return (
            <div key={i} className={`bg-white rounded-2xl shadow p-4 border-2 transition-all
              ${checked ? (isCorrect ? "border-green-400" : "border-red-400") : "border-blue-100"}`}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="font-['Nunito'] font-semibold text-gray-800 text-sm">{s.nama}</p>
                  <span className="bg-gray-100 text-gray-500 text-xs font-['Nunito'] px-2 py-0.5 rounded-full">{s.jenis}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => !checked && setAnswers(prev => ({ ...prev, [i]: true }))}
                  disabled={checked}
                  className={`flex-1 py-2 rounded-xl font-['Fredoka'] font-semibold text-sm border-2 transition-all cursor-pointer
                    ${userAnswer === true ? "bg-green-500 border-green-500 text-white" : "border-green-300 text-green-600 hover:bg-green-50"}`}
                >
                  ✅ Terpercaya
                </button>
                <button
                  onClick={() => !checked && setAnswers(prev => ({ ...prev, [i]: false }))}
                  disabled={checked}
                  className={`flex-1 py-2 rounded-xl font-['Fredoka'] font-semibold text-sm border-2 transition-all cursor-pointer
                    ${userAnswer === false ? "bg-red-500 border-red-500 text-white" : "border-red-300 text-red-500 hover:bg-red-50"}`}
                >
                  ⚠️ Tidak Terpercaya
                </button>
              </div>
              {checked && (
                <p className={`text-xs mt-2 font-['Nunito'] font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? "✓ Tepat!" : `✗ Sumber ini sebenarnya ${s.terpercaya ? "TERPERCAYA" : "TIDAK TERPERCAYA"} karena ${s.terpercaya ? "merupakan sumber resmi dan akademik" : "belum terverifikasi"}.`}
                </p>
              )}
            </div>
          );
        })}

        {checked && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className={`rounded-2xl p-4 text-center ${score >= 75 ? "bg-green-100 border-2 border-green-400" : "bg-amber-100 border-2 border-amber-400"}`}>
            <p className="font-['Fredoka'] font-bold text-2xl">{score >= 75 ? "🎉 Hebat!" : "💪 Hampir!"}</p>
            <p className="font-['Nunito'] text-gray-600 text-sm">Skor: <strong>{score}</strong></p>
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-blue-100">
        {!checked ? (
          <Btn onClick={() => setChecked(true)} variant="primary" disabled={!allAnswered} className="w-full text-lg">
            Cek Hasil ✅
          </Btn>
        ) : (
          <Btn onClick={() => onNext(score)} variant="green" className="w-full text-lg">
            Lanjut <ChevronRight size={20} className="inline" />
          </Btn>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// DETEKTIF BERITA SCREEN
// ──────────────────────────────────────────────
function DetektifBeritaScreen({ mission, onNext }: { mission: Mission; onNext: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>(
    Object.fromEntries(mission.beritaItems.map((_, i) => [i, null]))
  );
  const [checked, setChecked] = useState(false);

  const allAnswered = Object.values(answers).every(a => a !== null);
  const score = checked
    ? Math.round((mission.beritaItems.filter((b, i) => answers[i] === b.isFakta).length / mission.beritaItems.length) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-2xl p-4">
          <h2 className="font-['Fredoka'] font-bold text-xl flex items-center gap-2">
            🕵️ Detektif Berita
          </h2>
          <p className="font-['Nunito'] text-amber-100 text-sm mt-1">
            Tentukan apakah setiap berita ini FAKTA atau HOAKS tentang {mission.name}!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-green-100 rounded-2xl p-2 border-2 border-green-300">
            <span className="font-['Fredoka'] font-semibold text-green-700 text-sm">📰 FAKTA</span>
          </div>
          <div className="bg-red-100 rounded-2xl p-2 border-2 border-red-300">
            <span className="font-['Fredoka'] font-semibold text-red-600 text-sm">🚫 HOAKS</span>
          </div>
        </div>

        {mission.beritaItems.map((b, i) => {
          const userAnswer = answers[i];
          const isCorrect = checked ? userAnswer === b.isFakta : null;
          return (
            <div key={i} className={`bg-white rounded-2xl shadow p-4 border-2 transition-all
              ${checked ? (isCorrect ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50") : "border-blue-100"}`}>
              <p className="font-['Nunito'] font-semibold text-gray-800 text-sm mb-3 leading-relaxed">
                📰 "{b.judul}"
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => !checked && setAnswers(prev => ({ ...prev, [i]: true }))}
                  disabled={checked}
                  className={`flex-1 py-2 rounded-xl font-['Fredoka'] font-semibold text-sm border-2 transition-all cursor-pointer
                    ${userAnswer === true ? "bg-green-500 border-green-500 text-white" : "border-green-300 text-green-600 hover:bg-green-50"}`}
                >
                  ✅ Fakta
                </button>
                <button
                  onClick={() => !checked && setAnswers(prev => ({ ...prev, [i]: false }))}
                  disabled={checked}
                  className={`flex-1 py-2 rounded-xl font-['Fredoka'] font-semibold text-sm border-2 transition-all cursor-pointer
                    ${userAnswer === false ? "bg-red-500 border-red-500 text-white" : "border-red-300 text-red-500 hover:bg-red-50"}`}
                >
                  🚫 Hoaks
                </button>
              </div>
              {checked && (
                <p className={`text-xs mt-2 font-['Nunito'] font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? "✓ Tepat sekali!" : `✗ Berita ini sebenarnya ${b.isFakta ? "FAKTA" : "HOAKS"}!`}
                </p>
              )}
            </div>
          );
        })}

        {checked && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className={`rounded-2xl p-4 text-center ${score >= 75 ? "bg-green-100 border-2 border-green-400" : "bg-amber-100 border-2 border-amber-400"}`}>
            <p className="font-['Fredoka'] font-bold text-2xl">{score >= 75 ? "🕵️ Detektif Handal!" : "💪 Terus Latihan!"}</p>
            <p className="font-['Nunito'] text-gray-600 text-sm">Skor: <strong>{score}</strong></p>
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-blue-100">
        {!checked ? (
          <Btn onClick={() => setChecked(true)} variant="amber" disabled={!allAnswered} className="w-full text-lg">
            Cek Hasil 🔍
          </Btn>
        ) : (
          <Btn onClick={() => onNext(score)} variant="green" className="w-full text-lg">
            Lanjut <ChevronRight size={20} className="inline" />
          </Btn>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// RUANG REFLEKSI SCREEN
// ──────────────────────────────────────────────
function RuangRefleksiScreen({ mission, onNext }: { mission: Mission; onNext: () => void }) {
  const [answers, setAnswers] = useState<string[]>(mission.refleksiPertanyaan.map(() => ""));
  const canContinue = answers.every(a => a.trim().length >= 5);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-2xl p-4">
          <h2 className="font-['Fredoka'] font-bold text-xl flex items-center gap-2">
            <Lightbulb size={22} /> Ruang Refleksi
          </h2>
          <p className="font-['Nunito'] text-teal-100 text-sm mt-1">
            Tulis pemikiranmu setelah mempelajari {mission.name}!
          </p>
        </div>

        <div className="flex gap-3 items-start">
          <MascotGita size="sm" />
          <div className="bg-amber-50 rounded-2xl p-3 flex-1 border border-amber-200">
            <p className="font-['Nunito'] text-amber-800 text-sm">
              Hei! Aku Gita. Sekarang saatnya merenungkan apa yang telah kamu pelajari. Tidak ada jawaban salah! 🌺
            </p>
          </div>
        </div>

        {mission.refleksiPertanyaan.map((q, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-4 space-y-2">
            <div className="flex items-start gap-2">
              <span className="bg-teal-100 text-teal-700 font-['Fredoka'] font-bold w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0">{i + 1}</span>
              <p className="font-['Nunito'] font-semibold text-gray-700 text-sm">{q}</p>
            </div>
            <textarea
              value={answers[i]}
              onChange={e => setAnswers(prev => prev.map((a, j) => j === i ? e.target.value : a))}
              placeholder="Tulis jawabanmu di sini..."
              rows={3}
              className="w-full border-2 border-teal-200 rounded-xl px-3 py-2 font-['Nunito'] text-sm text-gray-700 focus:outline-none focus:border-teal-500 resize-none bg-teal-50"
            />
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-blue-100">
        <Btn onClick={onNext} variant="green" disabled={!canContinue} className="w-full text-lg">
          Selesai Refleksi <ChevronRight size={20} className="inline" />
        </Btn>
        {!canContinue && <p className="text-center text-xs text-gray-400 font-['Nunito'] mt-1">Isi semua pertanyaan terlebih dahulu</p>}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// TANTANGAN SCREEN
// ──────────────────────────────────────────────
function TantanganScreen({ mission, onFinish }: { mission: Mission; onFinish: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(mission.kuis.map(() => null));
  const [done, setDone] = useState(false);

  const q = mission.kuis[current];
  const totalQ = mission.kuis.length;

  const handleSelect = (idx: number) => {
    if (answers[current] !== null) return;
    const newAnswers = answers.map((a, i) => i === current ? idx : a);
    setAnswers(newAnswers);
    setSelected(idx);
    setTimeout(() => {
      if (current < totalQ - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
      } else {
        setDone(true);
        const correct = newAnswers.filter((a, i) => a === mission.kuis[i].jawaban).length;
        setTimeout(() => onFinish(Math.round((correct / totalQ) * 100)), 1500);
      }
    }, 800);
  };

  const correctCount = answers.filter((a, i) => a === mission.kuis[i].jawaban).length;
  const score = Math.round((correctCount / totalQ) * 100);

  if (done) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center gap-4 bg-gradient-to-b from-yellow-50 to-amber-50">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl">
          {score >= 80 ? "🏆" : score >= 60 ? "⭐" : "💪"}
        </motion.div>
        <h2 className="font-['Fredoka'] font-bold text-3xl text-amber-700">
          {score >= 80 ? "Luar Biasa!" : score >= 60 ? "Bagus!" : "Tetap Semangat!"}
        </h2>
        <p className="font-['Nunito'] text-lg text-gray-600">Skor: <strong className="text-amber-600 text-2xl">{score}</strong></p>
        <p className="font-['Nunito'] text-sm text-gray-500">{correctCount} dari {totalQ} soal benar</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="bg-white px-4 py-2 border-b border-blue-100">
        <div className="flex justify-between text-xs font-['Nunito'] text-gray-500 mb-1">
          <span>Soal {current + 1} dari {totalQ}</span>
          <span className="text-amber-600 font-semibold">{Math.round(((current) / totalQ) * 100)}%</span>
        </div>
        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all" style={{ width: `${(current / totalQ) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-2xl p-4">
          <h2 className="font-['Fredoka'] font-bold text-lg flex items-center gap-2">
            <Trophy size={22} /> Tantangan DEDIGMA
          </h2>
          <p className="font-['Nunito'] text-amber-100 text-sm">Uji pemahamanmu tentang {mission.name}!</p>
        </div>

        <motion.div key={current} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <p className="font-['Nunito'] font-bold text-gray-800 text-base mb-4">{q.soal}</p>
            <div className="space-y-2">
              {q.opsi.map((o, idx) => {
                const userAns = answers[current];
                let cls = "border-2 border-blue-100 bg-blue-50 text-gray-700 hover:border-blue-400 hover:bg-blue-100";
                if (userAns !== null) {
                  if (idx === q.jawaban) cls = "border-2 border-green-400 bg-green-100 text-green-800";
                  else if (idx === userAns && userAns !== q.jawaban) cls = "border-2 border-red-400 bg-red-100 text-red-700";
                  else cls = "border-2 border-gray-200 bg-gray-50 text-gray-400";
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={answers[current] !== null}
                    className={`w-full text-left rounded-xl px-4 py-3 font-['Nunito'] text-sm font-semibold transition-all cursor-pointer ${cls}`}
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>{o}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// MISI SELESAI SCREEN
// ──────────────────────────────────────────────
function MisiSelesaiScreen({ mission, totalScore, onContinue }: {
  mission: Mission; totalScore: number; onContinue: () => void;
}) {
  return (
    <div className="flex flex-col h-full items-center justify-center p-6 text-center gap-5 bg-gradient-to-b from-yellow-50 to-amber-50">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="text-8xl">🏅</motion.div>
      <div>
        <h2 className="font-['Fredoka'] font-bold text-3xl text-amber-700">Misi Selesai!</h2>
        <p className="font-['Fredoka'] text-blue-600 text-xl mt-1">{mission.name}</p>
      </div>
      <div className="bg-white rounded-3xl shadow-lg p-5 w-full max-w-xs">
        <p className="font-['Nunito'] text-sm text-gray-500 mb-1">Rata-rata Skor Aktivitas</p>
        <p className="font-['Fredoka'] font-bold text-5xl text-amber-500">{totalScore}</p>
        <p className="font-['Nunito'] text-sm text-gray-400 mt-1">dari 100</p>
        <div className="mt-3 bg-amber-100 rounded-xl p-2">
          <p className="font-['Nunito'] text-amber-700 text-xs font-semibold">
            {totalScore >= 85 ? "🌟 Luar biasa! Kamu Detektif Budaya sejati!" :
              totalScore >= 70 ? "⭐ Bagus! Terus semangat belajar!" :
                "💪 Tidak apa-apa, yang penting sudah mencoba!"}
          </p>
        </div>
      </div>
      <div className="bg-amber-100 rounded-2xl p-4 w-full max-w-xs">
        <p className="font-['Fredoka'] font-semibold text-amber-700 text-base">Lencana Diperoleh:</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-4xl">🏅</span>
          <div className="text-left">
            <p className="font-['Fredoka'] font-semibold text-amber-800 text-sm">Penjelajah Budaya</p>
            <p className="font-['Nunito'] text-amber-600 text-xs">Menyelesaikan Misi {mission.id}</p>
          </div>
        </div>
      </div>
      <Btn onClick={onContinue} variant="amber" className="w-full max-w-xs text-xl py-4">
        Kembali ke Peta Misi 🗺️
      </Btn>
    </div>
  );
}

// ──────────────────────────────────────────────
// MISSION FLOW ORCHESTRATOR
// ──────────────────────────────────────────────
function MissionFlow({ missionId, onComplete, onHome }: {
  missionId: number; onComplete: (id: number, score: number) => void; onHome: () => void;
}) {
  const mission = MISSIONS.find(m => m.id === missionId)!;
  const [stage, setStage] = useState<MissionStage>("materi");
  const [scores, setScores] = useState<number[]>([]);

  const stagesWithScore: MissionStage[] = ["cari-fakta", "cek-fakta", "analisis-sumber", "detektif-berita", "tantangan"];

  const advance = (score?: number) => {
    const newScores = score !== undefined ? [...scores, score] : scores;
    setScores(newScores);
    const idx = STAGE_ORDER.indexOf(stage);
    setStage(STAGE_ORDER[idx + 1]);
  };

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const stageIndex = STAGE_ORDER.indexOf(stage);
  const totalStages = STAGE_ORDER.length - 1; // exclude 'selesai'

  if (stage === "selesai") {
    return (
      <SkyBg>
        <MisiSelesaiScreen mission={mission} totalScore={avgScore} onContinue={() => onComplete(missionId, avgScore)} />
      </SkyBg>
    );
  }

  return (
    <SkyBg className="flex flex-col">
      <ScreenHeader
        title={`Misi ${missionId}: ${mission.name}`}
        onBack={onHome}
        onHome={onHome}
        step={`${STAGE_LABELS[stage]} (${stageIndex + 1}/${totalStages})`}
      />

      {/* Stage progress bar */}
      <div className="bg-white px-4 py-2 flex gap-1">
        {STAGE_ORDER.slice(0, -1).map((s, i) => (
          <div key={s} className={`h-2 flex-1 rounded-full transition-all ${i < stageIndex ? "bg-green-400" : i === stageIndex ? "bg-blue-500" : "bg-gray-200"}`} />
        ))}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white/80 backdrop-blur-sm mx-2 my-2 rounded-3xl shadow-xl">
        {stage === "materi" && <MateriScreen mission={mission} onNext={() => advance()} />}
        {stage === "cari-fakta" && <CariFaktaScreen mission={mission} onNext={advance} />}
        {stage === "cek-fakta" && <CekFaktaScreen mission={mission} onNext={advance} />}
        {stage === "analisis-sumber" && <AnalisisSumberScreen mission={mission} onNext={advance} />}
        {stage === "detektif-berita" && <DetektifBeritaScreen mission={mission} onNext={advance} />}
        {stage === "ruang-refleksi" && <RuangRefleksiScreen mission={mission} onNext={() => advance()} />}
        {stage === "tantangan" && <TantanganScreen mission={mission} onFinish={(s) => { advance(s); }} />}
      </div>
    </SkyBg>
  );
}

// ──────────────────────────────────────────────
// LENCANA SCREEN
// ──────────────────────────────────────────────
function LencanaScreen({ completedMissions, missionScores, onNext, onBack }: {
  completedMissions: Set<number>; missionScores: Record<number, number>;
  onNext: () => void; onBack: () => void;
}) {
  const allDone = completedMissions.size === 3;
  const badges = [
    ...MISSIONS.filter(m => completedMissions.has(m.id)).map(m => ({
      emoji: "🏅", name: "Penjelajah Budaya", desc: `Menyelesaikan Misi: ${m.name}`, color: "bg-amber-100 border-amber-300"
    })),
    ...(completedMissions.size >= 1 ? [{ emoji: "🔍", name: "Analis Informasi", desc: "Berhasil menyelesaikan aktivitas verifikasi", color: "bg-blue-100 border-blue-300" }] : []),
    ...(allDone ? [{ emoji: "🏆", name: "Detektif Digital Budaya Magetan", desc: "Menyelesaikan seluruh misi DEDIGMA!", color: "bg-yellow-100 border-yellow-400" }] : []),
  ];

  return (
    <SkyBg>
      <ScreenHeader title="Lencana Kamu 🏅" onBack={onBack} />
      <div className="p-4 space-y-4 max-w-md mx-auto">
        <div className="text-center">
          <p className="font-['Nunito'] text-blue-700 text-sm">Kamu telah mendapatkan {badges.length} lencana!</p>
        </div>

        <div className="space-y-3">
          {badges.map((b, i) => (
            <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
              className={`${b.color} border-2 rounded-2xl p-4 flex items-center gap-4`}>
              <span className="text-5xl">{b.emoji}</span>
              <div>
                <p className="font-['Fredoka'] font-bold text-gray-800 text-base">{b.name}</p>
                <p className="font-['Nunito'] text-gray-500 text-xs">{b.desc}</p>
              </div>
            </motion.div>
          ))}
          {!allDone && (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-4 flex items-center gap-4 opacity-60">
              <span className="text-5xl">🔒</span>
              <div>
                <p className="font-['Fredoka'] font-bold text-gray-500 text-base">Detektif Digital Budaya Magetan</p>
                <p className="font-['Nunito'] text-gray-400 text-xs">Selesaikan semua misi untuk membuka lencana ini!</p>
              </div>
            </div>
          )}
        </div>

        {allDone && (
          <Btn onClick={onNext} variant="amber" className="w-full text-xl py-4">
            🎓 Ambil Sertifikat!
          </Btn>
        )}
      </div>
    </SkyBg>
  );
}

// ──────────────────────────────────────────────
// SERTIFIKAT SCREEN
// ──────────────────────────────────────────────
function SertifikatScreen({ studentName, missionScores, onBack }: {
  studentName: string; missionScores: Record<number, number>; onBack: () => void;
}) {
  const avg = Math.round(Object.values(missionScores).reduce((a, b) => a + b, 0) / Object.keys(missionScores).length);
  const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const certRef = useRef<HTMLDivElement>(null);

  const printCert = () => {
    const el = certRef.current;
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>Sertifikat DEDIGMA</title><style>body{margin:0;font-family:sans-serif}</style></head><body>${el.outerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <SkyBg>
      <ScreenHeader title="Sertifikat Digital 🎓" onBack={onBack} />
      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Certificate */}
        <div ref={certRef}>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-400">
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-4 text-center">
              <p className="font-['Fredoka'] font-bold text-2xl tracking-wider">DEDIGMA</p>
              <p className="text-blue-200 text-xs font-['Nunito']">Detektif Digital Budaya Magetan</p>
            </div>

            <div className="p-6 text-center space-y-3">
              <p className="font-['Nunito'] text-gray-500 text-sm">SERTIFIKAT PENYELESAIAN</p>
              <p className="font-['Nunito'] text-gray-500 text-sm">Diberikan kepada:</p>
              <div className="border-b-2 border-amber-400 pb-2 mb-1">
                <h2 className="font-['Fredoka'] font-bold text-3xl text-blue-700">{studentName}</h2>
              </div>
              <p className="font-['Nunito'] text-gray-600 text-sm leading-relaxed">
                Telah berhasil menyelesaikan seluruh misi pembelajaran dalam media DEDIGMA dan menunjukkan kemampuan literasi digital serta kecintaan terhadap budaya lokal Magetan.
              </p>

              <div className="grid grid-cols-3 gap-2 my-3">
                {MISSIONS.map(m => (
                  <div key={m.id} className="bg-blue-50 rounded-xl p-2 text-center">
                    <span className="text-2xl">{m.emoji}</span>
                    <p className="font-['Fredoka'] text-blue-700 text-xs font-semibold">{m.name}</p>
                    <p className="font-['Nunito'] text-gray-400 text-xs">Skor: {missionScores[m.id] ?? 0}</p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 rounded-2xl p-3">
                <p className="font-['Fredoka'] font-bold text-amber-700 text-xl">Rata-rata: {avg}</p>
                <div className="flex justify-center gap-2 mt-1">
                  <span>🏅</span><span>🔍</span><span>🏆</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-2">
                <div className="text-left">
                  <p className="font-['Nunito'] text-gray-400 text-xs">{today}</p>
                  <p className="font-['Nunito'] text-gray-500 text-xs font-semibold">Tanggal</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl">🎓</div>
                  <p className="font-['Nunito'] text-gray-500 text-xs">Tanda Penghargaan</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 p-2 text-center">
              <p className="font-['Fredoka'] font-semibold text-sm">Jelajahi Budaya, Temukan Fakta, Lestarikan Warisan! 🌟</p>
            </div>
          </div>
        </div>

        <Btn onClick={printCert} variant="primary" className="w-full text-lg flex items-center justify-center gap-2">
          <FileText size={20} /> Cetak / Simpan Sertifikat
        </Btn>
        <Btn onClick={onBack} variant="ghost" className="w-full">
          Kembali ke Beranda
        </Btn>
      </div>
    </SkyBg>
  );
}

// ──────────────────────────────────────────────
// GURU DASHBOARD SCREEN
// ──────────────────────────────────────────────
function GuruDashboardScreen({ onLogout }: { onLogout: () => void }) {
  const [filter, setFilter] = useState("Semua");
  const classes = ["Semua", "5A", "5B", "5C"];
  const filtered = filter === "Semua" ? MOCK_STUDENTS : MOCK_STUDENTS.filter(s => s.kelas === filter);

  const stats = {
    total: MOCK_STUDENTS.length,
    selesai: MOCK_STUDENTS.filter(s => s.misi1 && s.misi2 && s.misi3).length,
    avgScore: Math.round(MOCK_STUDENTS.filter(s => s.skor > 0).reduce((a, b) => a + b.skor, 0) / MOCK_STUDENTS.filter(s => s.skor > 0).length),
    active: MOCK_STUDENTS.filter(s => s.misi1).length,
  };

  const exportCSV = () => {
    const headers = ["No", "Nama Siswa", "Kelas", "Misi 1", "Misi 2", "Misi 3", "Skor", "Durasi", "Tanggal"];
    const rows = MOCK_STUDENTS.map((s, i) => [
      i + 1, s.nama, s.kelas,
      s.misi1 ? "Selesai" : "Belum",
      s.misi2 ? "Selesai" : "Belum",
      s.misi3 ? "Selesai" : "Belum",
      s.skor, s.waktu, s.tanggal
    ]);
    const BOM = "﻿";
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "aktivitas_dedigma.csv";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar-style header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white px-5 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          <div>
            <h1 className="font-['Fredoka'] font-bold text-xl">DEDIGMA</h1>
            <p className="text-blue-200 text-xs font-['Nunito']">Dashboard Guru</p>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-3 py-2 text-sm font-['Nunito'] font-semibold">
          <LogOut size={16} /> Keluar
        </button>
      </div>

      <div className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-4">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Siswa", value: stats.total, emoji: "👥", color: "from-blue-500 to-blue-600" },
            { label: "Sudah Aktif", value: stats.active, emoji: "✅", color: "from-green-500 to-emerald-600" },
            { label: "Selesai Semua", value: stats.selesai, emoji: "🏆", color: "from-amber-500 to-orange-500" },
            { label: "Rata-rata Skor", value: stats.avgScore, emoji: "⭐", color: "from-purple-500 to-indigo-500" },
          ].map((s, i) => (
            <div key={i} className={`bg-gradient-to-br ${s.color} text-white rounded-2xl p-4 shadow-lg`}>
              <span className="text-2xl">{s.emoji}</span>
              <p className="font-['Fredoka'] font-bold text-3xl mt-1">{s.value}</p>
              <p className="font-['Nunito'] text-white/80 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter & Export bar */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            <span className="font-['Fredoka'] font-semibold text-blue-700">Filter Kelas:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {classes.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1 rounded-xl font-['Fredoka'] font-semibold text-sm cursor-pointer transition-all
                  ${filter === c ? "bg-blue-600 text-white shadow" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={exportCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-2 font-['Fredoka'] font-semibold text-sm transition-all shadow cursor-pointer">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-2">
            <BarChart2 size={18} />
            <span className="font-['Fredoka'] font-semibold">Aktivitas Siswa</span>
            <span className="ml-auto text-blue-200 text-xs font-['Nunito']">{filtered.length} siswa</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 border-b border-blue-100">
                  {["No", "Nama", "Kelas", "Misi 1", "Misi 2", "Misi 3", "Skor", "Durasi", "Tanggal"].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left font-['Fredoka'] font-semibold text-blue-700 text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                    <td className="px-3 py-2.5 font-['Nunito'] text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-3 py-2.5 font-['Nunito'] font-semibold text-gray-800">{s.nama}</td>
                    <td className="px-3 py-2.5">
                      <span className="bg-blue-100 text-blue-700 font-['Fredoka'] font-semibold text-xs px-2 py-0.5 rounded-full">{s.kelas}</span>
                    </td>
                    {[s.misi1, s.misi2, s.misi3].map((done, mi) => (
                      <td key={mi} className="px-3 py-2.5 text-center">
                        <span className={`text-sm ${done ? "text-green-500" : "text-gray-300"}`}>{done ? "✅" : "○"}</span>
                      </td>
                    ))}
                    <td className="px-3 py-2.5">
                      <span className={`font-['Fredoka'] font-bold text-sm ${s.skor >= 85 ? "text-green-600" : s.skor >= 70 ? "text-amber-600" : s.skor > 0 ? "text-red-500" : "text-gray-300"}`}>
                        {s.skor > 0 ? s.skor : "-"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-['Nunito'] text-gray-500 text-xs">{s.waktu}</td>
                    <td className="px-3 py-2.5 font-['Nunito'] text-gray-400 text-xs whitespace-nowrap">{s.tanggal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mission completion chart */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-['Fredoka'] font-semibold text-blue-700 text-base mb-3 flex items-center gap-2">
            <Award size={18} /> Progres Penyelesaian Misi
          </h3>
          <div className="space-y-3">
            {MISSIONS.map(m => {
              const count = MOCK_STUDENTS.filter(s => s[`misi${m.id}` as keyof typeof s]).length;
              const pct = Math.round((count / MOCK_STUDENTS.length) * 100);
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{m.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-['Nunito'] text-gray-500 mb-1">
                      <span className="font-semibold">{m.name}</span>
                      <span>{count}/{MOCK_STUDENTS.length} siswa ({pct}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${m.gradient} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [studentName, setStudentName] = useState("");
  const [screen, setScreen] = useState<Screen>("login");
  const [currentMissionId, setCurrentMissionId] = useState<number>(1);
  const [completedMissions, setCompletedMissions] = useState<Set<number>>(new Set());
  const [missionScores, setMissionScores] = useState<Record<number, number>>({});

  const login = (r: Role, name: string) => {
    setRole(r);
    setStudentName(name);
    setScreen(r === "guru" ? "guru-dashboard" : "splash");
  };

  const logout = () => {
    setRole(null);
    setStudentName("");
    setScreen("login");
    setCompletedMissions(new Set());
    setMissionScores({});
  };

  const completeMission = (id: number, score: number) => {
    setCompletedMissions(prev => new Set([...prev, id]));
    setMissionScores(prev => ({ ...prev, [id]: score }));
    setScreen("peta-misi");
  };

  const allMissionsDone = completedMissions.size === 3;

  return (
    <div className="size-full min-h-screen font-['Nunito']" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {screen === "login" && <LoginScreen onLogin={login} />}

      {screen === "splash" && (
        <SplashScreen
          studentName={studentName}
          onMulai={() => setScreen("peta-misi")}
          onPetunjuk={() => setScreen("petunjuk")}
          onProfil={() => setScreen("profil")}
          onLogout={logout}
        />
      )}

      {screen === "petunjuk" && <PetunjukScreen onBack={() => setScreen("splash")} />}
      {screen === "profil" && <ProfilScreen onBack={() => setScreen("splash")} />}

      {screen === "peta-misi" && (
        <div className="flex flex-col min-h-screen">
          <PetaMisiScreen
            completedMissions={completedMissions}
            onMission={(id) => { setCurrentMissionId(id); setScreen("mission-flow"); }}
            onBack={() => setScreen("splash")}
          />
          {allMissionsDone && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
              <Btn onClick={() => setScreen("lencana")} variant="amber" className="text-lg px-8 py-4 shadow-2xl">
                🏅 Lihat Lencana & Sertifikat!
              </Btn>
            </div>
          )}
        </div>
      )}

      {screen === "mission-flow" && (
        <MissionFlow
          missionId={currentMissionId}
          onComplete={completeMission}
          onHome={() => setScreen("peta-misi")}
        />
      )}

      {screen === "lencana" && (
        <LencanaScreen
          completedMissions={completedMissions}
          missionScores={missionScores}
          onNext={() => setScreen("sertifikat")}
          onBack={() => setScreen("peta-misi")}
        />
      )}

      {screen === "sertifikat" && (
        <SertifikatScreen
          studentName={studentName}
          missionScores={missionScores}
          onBack={() => setScreen("splash")}
        />
      )}

      {screen === "guru-dashboard" && <GuruDashboardScreen onLogout={logout} />}
    </div>
  );
}
