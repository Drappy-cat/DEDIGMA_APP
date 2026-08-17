import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, X, Info, Clock, Target, Heart, Image, Play, Lightbulb, ChevronRight, ChevronLeft, ChevronDown, Sparkles, Users, Leaf, Handshake, Landmark, Palette, Calendar, MapPin, Anchor, Flag, ShieldCheck, Check } from "lucide-react";
import { Mission, MateriTab } from "../../types";
import { useAudio } from "../../contexts/AudioContext";

// Helper for photo URL with local fallback support
const unsplashUrl = (photoId: string, w = 600, h = 450) => {
  return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
};

const getPhotoUrl = (item: { photoId: string; imageSrc?: string }, w = 600, h = 450) => {
  return item.imageSrc || unsplashUrl(item.photoId, w, h);
};

// Video Card sub-component
const VideoCard: React.FC<{ item: { title: string; desc: string; thumbId: string; query: string; videoId?: string }; missionName: string }> = ({ item, missionName }) => {
  const [playing, setPlaying] = useState(false);
  const { playSFX } = useAudio();
  const youtubeSearch = item.videoId 
    ? `https://www.youtube.com/watch?v=${item.videoId}` 
    : `https://www.youtube.com/results?search_query=${item.query}`;

  const embedUrl = item.videoId 
    ? `https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0`
    : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(item.query)}`;

  const thumbUrl = item.videoId 
    ? `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` 
    : unsplashUrl(item.thumbId, 640, 360);

  return (
    <div className="bg-[#faf5ea] border border-[#e2d5bc] rounded-2xl overflow-hidden shadow-xs">
      <div className="relative w-full select-none" style={{ aspectRatio: "16/9" }}>
        <img src={thumbUrl} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/25" />
        <button
          onClick={() => { playSFX("click"); setPlaying(true); }}
          className="absolute inset-0 flex items-center justify-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#1c5c32] group-hover:bg-[#144826] group-hover:scale-105 transition-all shadow-lg flex items-center justify-center border-2 border-[#fff5ce]">
            <Play size={20} className="text-white fill-white ml-0.5" />
          </div>
        </button>
      </div>

      <div className="p-3 space-y-1.5">
        <h4 className="font-['Fredoka'] font-extrabold text-[#3a2718] text-xs sm:text-sm leading-snug">{item.title}</h4>
        <p className="font-['Nunito'] font-semibold text-[#5c4733] text-[11px] sm:text-xs leading-relaxed">{item.desc}</p>
        <a
          href={youtubeSearch}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playSFX("click")}
          className="inline-flex items-center gap-1.5 bg-[#1c5c32] hover:bg-[#144826] text-white font-['Fredoka'] font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-xs border border-[#144826] mt-1"
        >
          <Play size={12} fill="white" /> Tonton di YouTube
        </a>
      </div>

      {playing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPlaying(false)}>
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <p className="font-['Fredoka'] font-bold text-white text-sm truncate">{item.title}</p>
              <button onClick={() => setPlaying(false)} className="text-white bg-white/20 hover:bg-white/30 rounded-full p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
              <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <p className="text-white/60 text-[10px] text-center mt-2 font-['Nunito']">
              Atau{" "}
              <a href={youtubeSearch} target="_blank" rel="noopener noreferrer" className="text-[#f3cc69] underline font-semibold">
                {item.videoId ? "buka langsung di YouTube" : "buka pencarian langsung di YouTube"}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface MateriScreenProps {
  mission: Mission;
  onNext: () => void;
  onBack?: () => void;
}

// Tab icon mapping
const tabIcons: Record<MateriTab, React.ReactNode> = {
  pengertian: <Info size={15} />,
  sejarah: <Clock size={15} />,
  tujuan: <Target size={15} />,
  "nilai-budaya": <Heart size={15} />,
  galeri: <Image size={15} />,
  video: <Play size={15} />
};

// Fun facts mapping for "TAHUKAH KAMU?" callout box
const funFacts: Record<MateriTab, string> = {
  pengertian: "Tradisi ini mengajarkan kita untuk bersyukur dan mengawali pergantian waktu dengan nilai-nilai positif serta kedamaian.",
  sejarah: "Tradisi adat ini sudah dilestarikan secara turun-temurun selama ratusan tahun oleh masyarakat setempat sebagai warisan luhur.",
  tujuan: "Upacara tradisional ini tidak hanya memelihara kebudayaan nenek moyang, tetapi juga menguatkan rasa kebersamaan warga.",
  "nilai-budaya": "Semangat gotong royong dan rasa hormat kepada alam merupakan kearifan lokal utama yang senantiasa dijaga.",
  galeri: "Dokumentasi sejarah ini merekam momen-momen penting dalam prosesi adat yang penuh makna kebudayaan.",
  video: "Melalui tayangan video edukasi ini kita dapat menyaksikan langsung keindahan dan antusiasme masyarakat lokal."
};

// Nilai Budaya icon mapping
const nilaiBudayaIcons: Record<string, string> = {
  "Syukur": "🙏",
  "Gotong Royong": "👥",
  "Harmoni Alam": "🌿",
  "Kebersamaan": "🤝",
  "Hormat Leluhur": "🙏",
  "Silaturahmi": "👨‍👩‍👧‍👦",
  "Religiusitas": "☪️",
  "Persatuan": "🤝",
  "Pelestarian Budaya": "🏛️",
  "Toleransi": "🕊️",
  "Kreativitas": "🎨"
};

// Custom Pengertian Data per Mission matching reference design
const pengertianDataByMission: Record<number, {
  apaItuTitle: string;
  par1: React.ReactNode;
  par2: React.ReactNode;
  maknaPillars: { icon: React.ReactNode; title: string; desc: string }[];
  tahukahKamu: React.ReactNode;
}> = {
  1: {
    apaItuTitle: "Apa itu Larung Sesaji?",
    par1: (
      <>
        Larung Sesaji adalah tradisi ritual budaya masyarakat Jawa yang dilakukan di perairan atau danau sebagai{" "}
        <strong className="text-[#1c5c32] font-extrabold">wujud syukur</strong> kepada Tuhan Yang Maha Esa.
      </>
    ),
    par2: (
      <>
        Di Magetan, tradisi ini dilaksanakan setiap tahun di{" "}
        <strong className="text-[#1c5c32] font-extrabold">Telaga Sarangan</strong> dengan cara melarung (menghanyutkan) sesaji ke tengah danau.
      </>
    ),
    maknaPillars: [
      { icon: <Heart size={20} className="text-white fill-white/20" />, title: "Wujud Syukur", desc: "Ungkapan rasa syukur atas limpahan nikmat dan keselamatan." },
      { icon: <Users size={20} className="text-white" />, title: "Kebersamaan", desc: "Mempererat tali silaturahmi dan semangat gotong royong masyarakat." },
      { icon: <Leaf size={20} className="text-white fill-white/20" />, title: "Kelestarian Alam", desc: "Menghormati alam dan menjaga keseimbangan lingkungan." },
    ],
    tahukahKamu: (
      <>
        Larung Sesaji bukan hanya sekadar tradisi, tetapi juga cerminan{" "}
        <span className="text-[#ffe57f] font-extrabold">harmoni</span> antara{" "}
        <span className="text-[#ffe57f] font-extrabold">manusia, alam, dan Tuhan</span>.
      </>
    ),
  },
  2: {
    apaItuTitle: "Apa itu Nyadaran?",
    par1: (
      <>
        Nyadaran adalah tradisi ziarah kubur dan membersihkan makam leluhur yang dilakukan masyarakat Jawa sebagai{" "}
        <strong className="text-[#1c5c32] font-extrabold">bentuk penghormatan</strong> dan doa kepada arwah para leluhur.
      </>
    ),
    par2: (
      <>
        Di Magetan, tradisi ini dilaksanakan secara rutin{" "}
        <strong className="text-[#1c5c32] font-extrabold">menjelang bulan Ramadan</strong> dengan kerja bakti serta doa bersama seluruh warga desa.
      </>
    ),
    maknaPillars: [
      { icon: <Heart size={20} className="text-white fill-white/20" />, title: "Hormat Leluhur", desc: "Mendoakan arwah leluhur dan mengingat jasa para pendahulu." },
      { icon: <Users size={20} className="text-white" />, title: "Silaturahmi", desc: "Mempererat persaudaraan antar sesama keluarga besar dan warga." },
      { icon: <Sparkles size={20} className="text-white" />, title: "Religiusitas", desc: "Meningkatkan ketakwaan dan kesucian diri menjelang bulan Ramadan." },
    ],
    tahukahKamu: (
      <>
        Tradisi Nyadaran menjadi momentum penting untuk{" "}
        <span className="text-[#ffe57f] font-extrabold">menyambung silaturahmi</span> dan menyucikan hati sebelum memasuki{" "}
        <span className="text-[#ffe57f] font-extrabold">bulan suci Ramadan</span>.
      </>
    ),
  },
  3: {
    apaItuTitle: "Apa itu Ledhug Suro?",
    par1: (
      <>
        Ledhug Suro adalah festival perayaan{" "}
        <strong className="text-[#1c5c32] font-extrabold">Tahun Baru Jawa (1 Suro / 1 Muharram)</strong> di Magetan yang ditandai dengan iringan bunyi bedug dan kesenian tradisional.
      </>
    ),
    par2: (
      <>
        Festival ini dimeriahkan dengan{" "}
        <strong className="text-[#1c5c32] font-extrabold">arak-arakan lesung dan bedug</strong> serta pertunjukan seni yang menyatukan seluruh masyarakat Magetan.
      </>
    ),
    maknaPillars: [
      { icon: <Handshake size={20} className="text-white" />, title: "Persatuan", desc: "Menyatukan seluruh elemen masyarakat dalam perayaan penuh kegembiraan." },
      { icon: <Landmark size={20} className="text-white" />, title: "Pelestarian Budaya", desc: "Menjaga dan mengenalkan kesenian tradisional kepada generasi muda." },
      { icon: <Palette size={20} className="text-white" />, title: "Kreativitas", desc: "Wadah ekspresi seni dan kreativitas warga Magetan." },
    ],
    tahukahKamu: (
      <>
        Nama <span className="text-[#ffe57f] font-extrabold">Ledhug</span> berasal dari gabungan bunyi{" "}
        <span className="text-[#ffe57f] font-extrabold">lesung dan bedug</span> yang ditabuh secara meriah menandai pergantian tahun Jawa.
      </>
    ),
  },
};

// Nilai Budaya Detailed Interactive Data per Mission matching reference design
interface NilaiBudayaDetail {
  title: string;
  desc: React.ReactNode;
  tahukahKamu: React.ReactNode;
  photoId: string;
}

const nilaiBudayaDetailsByMission: Record<number, Record<string, NilaiBudayaDetail>> = {
  1: {
    "Syukur": {
      title: "SYUKUR",
      desc: (
        <>
          Larung Sesaji adalah wujud <strong className="text-[#1c5c32] font-extrabold">rasa syukur</strong> masyarakat kepada Tuhan Yang Maha Esa atas segala rahmat, rezeki, dan keselamatan yang diberikan. Hasil bumi, makanan, dan <strong className="text-[#1c5c32] font-extrabold">sesaji</strong> dilarung sebagai ungkapan terima kasih atas kehidupan yang harmonis.
        </>
      ),
      tahukahKamu: (
        <>
          Ungkapan syukur membuat kita <strong className="text-[#1c5c32] font-extrabold">lebih rendah hati</strong> dan menghargai setiap nikmat yang diterima.
        </>
      ),
      photoId: "1598899134739-24c46f58b8c0",
    },
    "Kebersamaan": {
      title: "KEBERSAMAAN",
      desc: (
        <>
          Prosesi persiapan hingga melarung sesaji dilakukan secara <strong className="text-[#1c5c32] font-extrabold">bersama-sama</strong> oleh seluruh warga. Nilai kebersamaan ini mempererat rasa persaudaraan antarwarga tanpa membeda-bedakan status sosial.
        </>
      ),
      tahukahKamu: (
        <>
          Semangat kebersamaan melahirkan ikatan kekeluargaan yang kokoh dalam menjaga ketenteraman desa.
        </>
      ),
      photoId: "1544644181-1484b3fdfc62",
    },
    "Kelestarian Alam": {
      title: "KELESTARIAN ALAM",
      desc: (
        <>
          Tradisi ini mengajarkan masyarakat untuk senantiasa <strong className="text-[#1c5c32] font-extrabold">menjaga dan merawat Telaga Sarangan</strong>. Lingkungan air dan hulu sungai dijaga kebersihannya agar berkah alam terus dirasakan generasi mendatang.
        </>
      ),
      tahukahKamu: (
        <>
          Masyarakat Magetan percaya bahwa alam yang dirawat dengan kasih sayang akan memberikan rezeki yang melimpah.
        </>
      ),
      photoId: "1507525428034-b723cf961d3e",
    },
    "Gotong Royong": {
      title: "GOTONG ROYONG",
      desc: (
        <>
          Mulai dari pembuatan bucheng tumpeng, persiapan perahu, hingga pembersihan area telaga dilakukan dengan semangat <strong className="text-[#1c5c32] font-extrabold">gotong royong</strong> saling bantu-membantu secara sukarela.
        </>
      ),
      tahukahKamu: (
        <>
          Gotong royong adalah jati diri bangsa Indonesia yang menjadikan pekerjaan berat terasa jauh lebih ringan.
        </>
      ),
      photoId: "1533105079780-92b9be482077",
    },
  },
  2: {
    "Hormat Leluhur": {
      title: "HORMAT LELUHUR",
      desc: (
        <>
          Nyadaran menjadi sarana mendoakan dan <strong className="text-[#1c5c32] font-extrabold">mengenang jasa para pendahulu</strong>. Mengingat asal-usul dan perjuangan leluhur menanamkan rasa hormat dan bakti pada generasi penerus.
        </>
      ),
      tahukahKamu: (
        <>
          Mendoakan orang tua dan leluhur adalah bentuk penghormatan tertinggi yang menyambung keberkahan hidup.
        </>
      ),
      photoId: "1506744038136-46273834b3fb",
    },
    "Silaturahmi": {
      title: "SILATURAHMI",
      desc: (
        <>
          Momen Nyadaran menjadi ajang berkumpulnya sanak keluarga dari perantauan untuk <strong className="text-[#1c5c32] font-extrabold">mempererat silaturahmi</strong> dan saling memaafkan sebelum menjalankan ibadah puasa Ramadan.
        </>
      ),
      tahukahKamu: (
        <>
          Silaturahmi dilapangkan rezekinya dan dipanjangkan umurnya oleh Tuhan Yang Maha Esa.
        </>
      ),
      photoId: "1544644181-1484b3fdfc62",
    },
    "Religiusitas": {
      title: "RELIGIUSITAS",
      desc: (
        <>
          Pembacaan doa-doa suci dan zikir bersama di makam leluhur meningkatkan <strong className="text-[#1c5c32] font-extrabold">ketakwaan dan kesucian diri</strong> dalam menyambut bulan penuh berkah.
        </>
      ),
      tahukahKamu: (
        <>
          Ziarah kubur mengingatkan manusia akan hakikat kehidupan serta mempersiapkan diri dengan perbuatan baik.
        </>
      ),
      photoId: "1598899134739-24c46f58b8c0",
    },
    "Gotong Royong": {
      title: "GOTONG ROYONG",
      desc: (
        <>
          Kerja bakti membersihkan kompleks makam desa dilakukan secara bersama-sama penuh keikhlasan demi kenyamanan bersama.
        </>
      ),
      tahukahKamu: (
        <>
          Kebersihan kompleks makam mencerminkan kepedulian warga terhadap warisan sejarah desanya.
        </>
      ),
      photoId: "1533105079780-92b9be482077",
    },
  },
  3: {
    "Persatuan": {
      title: "PERSATUAN",
      desc: (
        <>
          Festival Ledhug Suro menyatukan seluruh elemen masyarakat Magetan dalam <strong className="text-[#1c5c32] font-extrabold">suasana kebersamaan dan keceriaan</strong> menyambut Tahun Baru Jawa.
        </>
      ),
      tahukahKamu: (
        <>
          Persatuan warga menjadi kekuatan utama dalam menjaga kedaulatan dan keharmonisan daerah.
        </>
      ),
      photoId: "1533105079780-92b9be482077",
    },
    "Pelestarian Budaya": {
      title: "PELESTARIAN BUDAYA",
      desc: (
        <>
          Arak-arakan lesung, bedug, dan pertunjukan seni etnik mengenalkan warisan seni khas Magetan kepada <strong className="text-[#1c5c32] font-extrabold">generasi muda</strong> agar tak lekang oleh waktu.
        </>
      ),
      tahukahKamu: (
        <>
          Mengenal budaya sendiri membuat kita bangga akan identitas dan nilai luhur bangsa.
        </>
      ),
      photoId: "1598899134739-24c46f58b8c0",
    },
    "Kreativitas": {
      title: "KREATIVITAS",
      desc: (
        <>
          Pembuatan gunungan kue Bolu Rahayu khas Magetan serta aransemen musik lesung-bedug wadah ekspresi <strong className="text-[#1c5c32] font-extrabold">kreativitas seniman lokal</strong>.
        </>
      ),
      tahukahKamu: (
        <>
          Kreativitas lokal yang dipadukan dengan tradisi mampu menggerakkan ekonomi dan pariwisata daerah.
        </>
      ),
      photoId: "1506744038136-46273834b3fb",
    },
    "Gotong Royong": {
      title: "GOTONG ROYONG",
      desc: (
        <>
          Pembagian roti Bolu Rahayu kepada ribuan warga merupakan simbol indahnya semangat <strong className="text-[#1c5c32] font-extrabold">berbagi dan gotong royong</strong> antar sesama.
        </>
      ),
      tahukahKamu: (
        <>
          Berbagi makanan saat pesta rakyat membawa kegembiraan dan kebahagiaan bagi seluruh lapisan masyarakat.
        </>
      ),
      photoId: "1544644181-1484b3fdfc62",
    },
  },
};

export const MateriScreen: React.FC<MateriScreenProps> = ({ mission, onNext, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [tab, setTab] = useState<MateriTab>("pengertian");
  const [selectedNilaiIndex, setSelectedNilaiIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showFunFact, setShowFunFact] = useState(false);

  const tabs: { key: MateriTab; label: string }[] = [
    { key: "pengertian", label: "Pengertian" },
    { key: "sejarah", label: "Sejarah" },
    { key: "tujuan", label: "Tujuan" },
    { key: "nilai-budaya", label: "Nilai Budaya" },
    { key: "galeri", label: "Galeri" },
    { key: "video", label: "Video" }
  ];

  const content = mission.content;

  // Speak when tab changes
  useEffect(() => {
    stopNarrator();

    let speakText = "";
    if (tab === "pengertian") {
      speakText = `Berikut adalah pengertian dari ${mission.name}. ${content.pengertian}`;
    } else if (tab === "sejarah") {
      speakText = `Mari baca sejarah tentang ${mission.name}. ${content.sejarah}`;
    } else if (tab === "tujuan") {
      speakText = `Apa tujuan pelaksanaan ${mission.name}? ${content.tujuan}`;
    } else if (tab === "nilai-budaya") {
      speakText = `Nilai budaya yang terkandung meliputi: ${content.nilaiBudaya.join(", ")}`;
    } else if (tab === "galeri") {
      speakText = "Lihat galeri foto kegiatan budaya di halaman ini.";
    } else if (tab === "video") {
      speakText = `Tonton video edukasi yang menceritakan tentang ${mission.name}.`;
    }

    if (speakText) {
      playNarrator(speakText);
    }
  }, [tab, mission.name]);

  const [isAtBottom, setIsAtBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const reachedBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 30;
    setIsAtBottom(reachedBottom);
  };

  const scrollToBottom = () => {
    playSFX("click");
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  const handleTabChange = (key: MateriTab) => {
    playSFX("click");
    setTab(key);
    setSelectedNilaiIndex(0);
    setIsAtBottom(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  const handleNext = () => {
    playSFX("click");
    onNext();
  };

  const getHeroPhoto = () => {
    let index = 0;
    if (tab === "sejarah") index = 1;
    else if (tab === "tujuan") index = 2;
    else if (tab === "nilai-budaya") index = 3;
    
    if (mission.galeri && mission.galeri.length > index) {
      return getPhotoUrl(mission.galeri[index], 600, 450);
    } else if (mission.galeri && mission.galeri.length > 0) {
      return getPhotoUrl(mission.galeri[0], 600, 450);
    }
    return "/assets/materi-bg.jpg";
  };
  const heroPhoto = getHeroPhoto();

  return (
    <div className="flex flex-col h-full font-['Nunito'] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-2 sm:p-4 md:p-6 select-none relative">
      
      {/* Main Content Layout (Sidebar + Right Content Area) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 flex-1 mt-2 md:mt-4">
        
        {/* Left Sidebar: Ribbon Header + Wood Signboard + Full Height Parchment Menu (Fixed Non-Scrollable) */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center h-full min-h-0 relative z-20">
          
          {/* Top Green Ribbon Header Badge */}
          <div className="bg-[#2a6838] border-2 border-[#1b4a24] rounded-full px-4 sm:px-5 py-1 text-white font-['Fredoka'] font-extrabold text-[11px] sm:text-xs uppercase tracking-wider shadow-xs flex items-center justify-center gap-1.5 z-10 w-full text-center flex-shrink-0">
            <span className="text-sm select-none">🌿</span>
            <span>MATERI BUDAYA</span>
            <span className="text-sm select-none transform scale-x-[-1]">🌿</span>
          </div>

          {/* Sub-banner Wood Signboard */}
          <div className="bg-[#6b3c1b] border border-[#4a270f] rounded-lg px-3 py-0.5 text-[#fff5ce] font-['Fredoka'] font-extrabold text-[11px] sm:text-xs uppercase shadow-xs text-center -mt-1.5 mb-2.5 z-10 w-[90%] flex-shrink-0">
            {mission.name}
          </div>

          {/* Vertical Parchment Menu Container — Stretched to Bottom (Mentok Sampai Bawah) */}
          <div className="w-full flex-1 min-h-0 bg-[#fbf7ee] border border-[#e5dabf] rounded-2xl p-2.5 sm:p-3 shadow-xs flex flex-col justify-between gap-1.5 sm:gap-2">
            {tabs.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => handleTabChange(t.key)}
                  className={`w-full flex-1 flex items-center justify-between font-['Fredoka'] font-extrabold text-xs sm:text-sm rounded-xl px-3 py-2 sm:py-2.5 transition-all cursor-pointer shadow-xs ${
                    isActive
                      ? "bg-gradient-to-r from-[#387a48] to-[#295c34] text-white border border-[#52ad69] shadow-md scale-[1.01]"
                      : "bg-[#f5ebd6]/90 text-[#59432e] hover:bg-[#ebd9bc] border border-[#e8d9bd]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive ? "bg-white/20 text-white" : "bg-[#e8dbbd] text-[#5c4733]"
                    }`}>
                      {tabIcons[t.key]}
                    </span>
                    <span className="truncate">{t.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="text-white flex-shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area: Header Title + Content Display (Scrollable) */}
        <motion.div
          key={tab}
          ref={contentRef}
          onScroll={handleScroll}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="md:col-span-8 lg:col-span-9 flex flex-col space-y-4 md:space-y-6 h-full min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-1 pb-16 sm:pb-20 space-y-3"
        >
          {/* Header Title with Leaf Sprigs 🌿 (for non-pengertian tabs) */}
          {tab !== "pengertian" && (
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl text-[#1c5c32] select-none">🌿</span>
                <h2 className="font-['Fredoka'] font-extrabold text-2xl sm:text-3xl text-[#1c5c32] uppercase tracking-wider leading-none">
                  {tab === "nilai-budaya" ? "NILAI BUDAYA" : tab}
                </h2>
                <span className="text-2xl text-[#1c5c32] select-none transform scale-x-[-1]">🌿</span>
              </div>
            </div>
          )}

          {/* Tab Content Display */}
          <div className="flex-1 min-h-0 space-y-3">
            {/* Pengertian Tab — Matching Reference Image 100% */}
            {tab === "pengertian" && (() => {
              const pData = pengertianDataByMission[mission.id] || pengertianDataByMission[1];
              return (
                <div className="space-y-4">
                  {/* Header Title Section */}
                  <div className="flex flex-col items-center text-center pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-[#1c5c32] select-none">🌿</span>
                      <h2 className="font-['Fredoka'] font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#1c5c32] uppercase tracking-wider leading-none">
                        PENGERTIAN
                      </h2>
                      <span className="text-2xl text-[#1c5c32] select-none transform scale-x-[-1]">🌿</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#6b4f35] font-semibold mt-1">
                      Mengenal lebih dekat tradisi budaya Indonesia
                    </p>
                    {/* Decorative Gold Flourish */}
                    <div className="flex items-center gap-2 text-[#d4af37] text-xs mt-1 select-none opacity-80">
                      <span>―――</span>
                      <span>❖</span>
                      <span>―――</span>
                    </div>
                  </div>

                  {/* Main 2-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 items-start">
                    
                    {/* Left Column: Card 1 (Apa itu...?) + Card 2 (Inti Makna Tradisi) */}
                    <div className="md:col-span-7 space-y-4">
                      
                      {/* Card 1: Apa itu [Nama Tradisi]? */}
                      <div className="bg-[#fefcf8] border border-[#e8dfcf] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3 relative">
                        {/* Header Tag Pill */}
                        <div>
                          <span className="bg-[#255224] text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                            <span>⭐</span>
                            <span>{pData.apaItuTitle}</span>
                          </span>
                        </div>

                        {/* Paragraph 1 */}
                        <p className="text-[#3a2718] font-['Nunito'] font-semibold text-xs sm:text-sm leading-relaxed">
                          {pData.par1}
                        </p>

                        {/* Dashed Separator */}
                        <div className="border-t border-dashed border-[#d8ccb6] my-1" />

                        {/* Paragraph 2 */}
                        <p className="text-[#3a2718] font-['Nunito'] font-semibold text-xs sm:text-sm leading-relaxed">
                          {pData.par2}
                        </p>
                      </div>

                      {/* Card 2: Inti Makna Tradisi */}
                      <div className="bg-[#edf6ee] border border-[#b8e0bc] rounded-2xl p-3.5 sm:p-4 shadow-xs relative mt-4">
                        {/* Header Tag Pill Centered on Top Border */}
                        <span className="bg-[#255224] text-white font-['Fredoka'] font-extrabold text-xs px-4 py-1 rounded-full shadow-2xs absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          Inti Makna Tradisi
                        </span>

                        {/* 3 Pillars Grid */}
                        <div className="grid grid-cols-3 gap-2 pt-2.5 text-center">
                          {pData.maknaPillars.map((pillar, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5">
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#387a3e] text-white flex items-center justify-center text-lg sm:text-xl shadow-xs">
                                {pillar.icon}
                              </div>
                              <h4 className="font-['Fredoka'] font-extrabold text-[#1c5c32] text-xs leading-tight mt-0.5">
                                {pillar.title}
                              </h4>
                              <p className="font-['Nunito'] text-[10px] sm:text-[11px] text-[#4a3728] leading-tight font-semibold">
                                {pillar.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Tilted Polaroid Photo */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center pt-2">
                      
                      {/* Tilted Polaroid Photo Frame */}
                      <div className="w-full max-w-[280px] sm:max-w-[320px] bg-[#fdfbf7] p-3 sm:p-3.5 pb-7 sm:pb-8 rounded-2xl border border-[#ded5c0] shadow-[0_10px_30px_rgba(0,0,0,0.12)] relative transform rotate-2 hover:rotate-0 transition-transform">
                        {/* Top Paper Tape Accent */}
                        <div className="bg-[#d9c49d]/90 border border-[#bfa87e] w-20 h-4.5 rounded-xs absolute -top-2.5 left-1/2 -translate-x-1/2 shadow-2xs z-10 opacity-90" />

                        {/* Image */}
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#eedebe] border border-[#d6c7a3] shadow-inner">
                          <img
                            src={heroPhoto}
                            alt={mission.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Other Text Tabs (Sejarah, Tujuan) with Tilted Polaroid Photo */}
            {(tab === "sejarah" || tab === "tujuan") && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Text Paragraph (Left Column) */}
                <div className="md:col-span-7 bg-[#fbf7ee] border border-[#e5dabf] rounded-2xl p-4 sm:p-5 shadow-xs">
                  <p className="text-[#4a3728] text-xs sm:text-sm leading-relaxed font-semibold font-['Nunito'] text-justify">
                    {tab === "sejarah" && content.sejarah}
                    {tab === "tujuan" && content.tujuan}
                  </p>
                </div>

                {/* Tilted Polaroid Photo Card (Right Column) */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="w-full max-w-[240px] sm:max-w-[260px] bg-[#fdfbf7] p-2.5 sm:p-3 pb-7 sm:pb-8 rounded-2xl border border-[#ded5c0] shadow-[0_8px_25px_rgba(0,0,0,0.15)] relative transform rotate-3 transition-transform hover:rotate-0">
                    {/* Top Right Masking Tape Accent */}
                    <div className="absolute -top-2 -right-2 w-10 sm:w-12 h-4 sm:h-5 bg-[#d8c7a5]/80 border border-[#c4b391] rotate-12 shadow-xs z-10 opacity-90 rounded-xs" />
                    {/* Bottom Left Masking Tape Accent */}
                    <div className="absolute -bottom-2 -left-2 w-10 sm:w-12 h-4 sm:h-5 bg-[#d8c7a5]/80 border border-[#c4b391] rotate-12 shadow-xs z-10 opacity-90 rounded-xs" />

                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#eedebe] border border-[#d6c7a3] shadow-inner">
                      <img
                        src={heroPhoto}
                        alt={mission.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nilai Budaya Tab — Detailed Interactive Presentation Matching Reference Image */}
            {tab === "nilai-budaya" && (() => {
              const nilaiList = content.nilaiBudaya || ["Syukur", "Kebersamaan", "Kelestarian Alam", "Gotong Royong"];
              const safeIndex = Math.min(selectedNilaiIndex, nilaiList.length - 1);
              const currentNilaiName = nilaiList[safeIndex] || nilaiList[0];
              const missionDetails = nilaiBudayaDetailsByMission[mission.id] || nilaiBudayaDetailsByMission[1];
              const activeDetail = missionDetails[currentNilaiName] || {
                title: currentNilaiName.toUpperCase(),
                desc: `${mission.name} mengandung nilai ${currentNilaiName} yang sangat luhur dan perlu dilestarikan.`,
                tahukahKamu: `Nilai ${currentNilaiName} mengajarkan kita untuk senantiasa hidup harmonis dalam bermasyarakat.`,
                photoId: "1598899134739-24c46f58b8c0",
              };

              return (
                <div className="flex flex-col justify-between h-full min-h-0 space-y-3 relative select-none">
                  
                  {/* Top Header Title with Leaf Sprigs 🌿 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl text-[#2d6132] select-none">🌿</span>
                      <h2 className="font-['Fredoka'] font-extrabold text-2xl sm:text-3xl text-[#1c5c32] uppercase tracking-wider leading-none">
                        {activeDetail.title}
                      </h2>
                      <span className="text-xl sm:text-2xl text-[#2d6132] select-none transform scale-x-[-1]">🌿</span>
                    </div>
                  </div>

                  {/* Main 2-Column Section: Left Photo Frame + Right Description & Tahukah Kamu */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Left Column: Rounded Image Frame */}
                    <div className="md:col-span-5 flex justify-center">
                      <div className="w-full max-w-[260px] sm:max-w-[290px] aspect-[4/3] rounded-3xl overflow-hidden bg-[#eedebe] border-2 border-[#d6c7a3] shadow-[0_8px_25px_rgba(0,0,0,0.12)]">
                        <img
                          src={
                            mission.galeri && mission.galeri.length > 0
                              ? (mission.galeri[safeIndex % mission.galeri.length].imageSrc || unsplashUrl(mission.galeri[safeIndex % mission.galeri.length].photoId, 600, 450))
                              : heroPhoto
                          }
                          alt={activeDetail.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Right Column: Main Explanation + Tahukah Kamu? Box */}
                    <div className="md:col-span-7 flex flex-col gap-3">
                      {/* Main Explanation Paragraph */}
                      <p className="text-[#3a2718] font-['Nunito'] font-semibold text-xs sm:text-sm leading-relaxed text-justify">
                        {activeDetail.desc}
                      </p>

                      {/* Soft Sage Green Callout Box 🌿 Tahukah Kamu? */}
                      <div className="bg-[#e7f0e6] border border-[#c5e3c7] rounded-2xl p-3.5 sm:p-4 shadow-2xs flex flex-col gap-1 mt-1">
                        <div className="flex items-center gap-1.5 text-[#1c5c32] font-['Fredoka'] font-extrabold text-xs sm:text-sm">
                          <span className="text-base">🌿</span>
                          <span>Tahukah Kamu?</span>
                        </div>
                        <p className="text-[#3a2718] font-['Nunito'] font-semibold text-xs leading-relaxed">
                          {activeDetail.tahukahKamu}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation & Stepper Control Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#e8dfcf] mt-1 pr-32 sm:pr-44 md:pr-48 relative z-20">
                    {/* Stepper Pagination Dots */}
                    <div className="flex items-center gap-2">
                      {nilaiList.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            playSFX("click");
                            setSelectedNilaiIndex(idx);
                          }}
                          className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer border ${
                            safeIndex === idx
                              ? "bg-[#2d6132] border-[#1c4722] scale-110 shadow-xs"
                              : "bg-transparent border-[#8a7259] hover:bg-[#d8c8a8]"
                          }`}
                          title={item}
                        />
                      ))}
                    </div>

                    {/* Right Action Button */}
                    {safeIndex < nilaiList.length - 1 ? (
                      <button
                        onClick={() => {
                          playSFX("click");
                          setSelectedNilaiIndex((prev) => prev + 1);
                        }}
                        className="bg-[#376935] hover:bg-[#285226] text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-2 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap z-20"
                      >
                        <span>Selanjutnya</span>
                        <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          playSFX("click");
                          handleTabChange("galeri");
                        }}
                        className="bg-[#376935] hover:bg-[#285226] text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-2 rounded-full flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap z-20"
                      >
                        <span>Selesai</span>
                        <Check size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Galeri Tab */}
            {tab === "galeri" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {mission.galeri.map((item, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                      onClick={() => { playSFX("click"); setLightbox(i); }}
                      className="rounded-2xl overflow-hidden shadow-xs border border-[#e5dabf] bg-[#fbf7ee] text-left cursor-pointer hover:shadow-md transition-all group"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-[#eedebe]">
                        <img
                          src={getPhotoUrl(item, 600, 450)}
                          alt={item.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2.5">
                        <p className="text-[#4a3728] text-xs font-['Nunito'] font-bold leading-snug">{item.caption}</p>
                        {item.source && (
                          <p className="text-[#8a7b68] text-[10px] font-['Nunito'] font-semibold mt-1 italic">📷 Sumber: {item.source}</p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Video Tab */}
            {tab === "video" && (
              <div className="space-y-3">
                {mission.video.map((v, i) => (
                  <VideoCard key={i} item={v} missionName={mission.name} />
                ))}

                {/* Cek Fakta Navigation Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  className="pt-2"
                >
                  <button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-[#2a6838] via-[#1c5c32] to-[#144826] hover:from-[#358a4c] hover:to-[#1b572d] border-2 border-[#52ad69] text-white rounded-2xl p-3.5 font-['Fredoka'] font-extrabold text-sm sm:text-base flex items-center justify-between shadow-lg cursor-pointer hover:scale-[1.01] active:scale-95 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f3c233] border border-[#ffe58f] text-[#1c4d29] flex items-center justify-center font-bold text-lg shadow-xs flex-shrink-0 group-hover:scale-110 transition-transform">
                        🔎
                      </div>
                      <div className="text-left">
                        <span className="text-[#ffe58f] text-[11px] sm:text-xs uppercase tracking-wider block font-extrabold">
                          TANTANGAN BUDAYA BERIKUTNYA
                        </span>
                        <h4 className="text-white font-extrabold text-sm sm:text-base leading-tight">
                          Lanjut ke Halaman Cek Fakta
                        </h4>
                      </div>
                    </div>
                    <div className="bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 group-hover:bg-white/30 transition-colors flex-shrink-0">
                      <span>Mulai</span>
                      <span>→</span>
                    </div>
                  </button>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>



      {/* Fixed Top-Layer Dimas Mascot & Dialogue Speech Bubble (Lifted Up for Instant Visibility Without Scroll) */}
      <div className="absolute bottom-14 sm:bottom-16 right-2 sm:right-4 z-50 pointer-events-auto flex flex-row-reverse items-end gap-2.5 sm:gap-3.5 max-w-[92%] sm:max-w-[88%] select-none">
        {/* Interactive Dimas Mascot (Mirrored Facing Left, Enlarged & Dynamic) */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.06, rotate: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            playSFX("click");
            setShowFunFact((prev) => !prev);
          }}
          className="w-32 sm:w-44 md:w-48 cursor-pointer relative group flex-shrink-0 flex flex-col items-center"
          title="Klik Dimas untuk melihat fakta menarik!"
        >
          <img
            src="/assets/mascot/Dimas-Petunjuk.svg"
            alt="Dimas Mascot"
            className="w-full h-auto object-contain filter drop-shadow-2xl transform scale-x-[-1]"
          />

          {/* Bottom Coverage Badge: Klik Dimas! */}
          <div className="bg-[#fcf5e3] border-2 border-[#e5cca0] text-[#7a5316] text-[11px] sm:text-xs font-['Fredoka'] font-extrabold rounded-full px-3 py-1 shadow-lg absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 whitespace-nowrap group-hover:bg-[#f5e3b8] transition-colors">
            <span className="text-xs">💡</span>
            <span>Klik Dimas!</span>
          </div>
        </motion.div>

        {/* Dimas Speech Dialogue Bubble Popup */}
        <AnimatePresence>
          {showFunFact && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-2xl p-3 sm:p-4 shadow-xl relative z-50 max-w-[280px] sm:max-w-[360px] mb-3"
            >
              {/* Right Pointer Tail pointing to Dimas */}
              <div className="absolute bottom-4 -right-2.5 w-0 h-0 border-t-8 border-t-transparent border-l-[10px] border-l-[#e8dcb8] border-b-8 border-b-transparent" />
              <div className="absolute bottom-4 -right-2 w-0 h-0 border-t-7 border-t-transparent border-l-[9px] border-l-[#fdfcf7] border-b-7 border-b-transparent" />

              {/* Speech Dialogue Header */}
              <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-[#e8dcb8]">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#f3c233] border border-[#ffe58f] text-[#1c4d29] flex items-center justify-center text-xs shadow-xs">
                    💡
                  </div>
                  <h4 className="font-['Fredoka'] font-extrabold text-[#1c5c32] text-xs sm:text-sm uppercase tracking-wide">
                    TAHUKAH KAMU?
                  </h4>
                </div>
                <button
                  onClick={() => setShowFunFact(false)}
                  className="text-[#5c4733] hover:text-[#1c5c32] hover:bg-[#f2e6cb] p-1 rounded-full cursor-pointer transition-colors"
                  aria-label="Tutup"
                  title="Tutup"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Speech Dialogue Text */}
              <p className="text-[#4a3728] text-xs sm:text-sm font-['Nunito'] font-bold leading-relaxed">
                {funFacts[tab] || "Tradisi ini mengajarkan kita untuk senantiasa bersyukur dan menjaga keharmonisan sesama."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox for Gallery */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="w-full max-w-lg select-none" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/70 text-xs font-semibold">
                {lightbox + 1} / {mission.galeri.length}
              </span>
              <button
                onClick={() => setLightbox(null)}
                className="text-white bg-white/20 hover:bg-white/30 rounded-full p-1.5 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <img
              src={getPhotoUrl(mission.galeri[lightbox], 800, 520)}
              alt={mission.galeri[lightbox].caption}
              className="w-full rounded-2xl object-cover shadow-2xl"
            />
            <p className="text-white text-sm text-center mt-3 leading-relaxed font-['Nunito']">{mission.galeri[lightbox].caption}</p>
            {mission.galeri[lightbox].source && (
              <p className="text-white/50 text-xs text-center mt-1 font-['Nunito'] italic">📷 Sumber: {mission.galeri[lightbox].source}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MateriScreen;
