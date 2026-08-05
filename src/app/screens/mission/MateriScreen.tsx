import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, X, Info, Clock, Target, Heart, Image, Play, Lightbulb, ChevronRight, Sparkles } from "lucide-react";
import { Mission, MateriTab } from "../../types";
import { useAudio } from "../../contexts/AudioContext";

// Helper for photo URL
const unsplashUrl = (photoId: string, w = 600, h = 450) => {
  return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
};

// Video Card sub-component
const VideoCard: React.FC<{ item: { title: string; desc: string; thumbId: string; query: string }; missionName: string }> = ({ item, missionName }) => {
  const [playing, setPlaying] = useState(false);
  const { playSFX } = useAudio();
  const youtubeSearch = `https://www.youtube.com/results?search_query=${item.query}`;

  return (
    <div className="bg-[#faf5ea] border border-[#e2d5bc] rounded-2xl overflow-hidden shadow-xs">
      <div className="relative w-full select-none" style={{ aspectRatio: "16/9" }}>
        <img src={unsplashUrl(item.thumbId, 640, 360)} alt={item.title} className="w-full h-full object-cover" />
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
                src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(item.query)}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <p className="text-white/60 text-[10px] text-center mt-2 font-['Nunito']">
              Atau{" "}
              <a href={youtubeSearch} target="_blank" rel="noopener noreferrer" className="text-[#f3cc69] underline font-semibold">
                buka pencarian langsung di YouTube
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

export const MateriScreen: React.FC<MateriScreenProps> = ({ mission, onNext, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [tab, setTab] = useState<MateriTab>("pengertian");
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

  const handleTabChange = (key: MateriTab) => {
    playSFX("click");
    setTab(key);
  };

  const handleNext = () => {
    playSFX("click");
    onNext();
  };

  const heroPhoto = mission.galeri.length > 0 ? unsplashUrl(mission.galeri[0].photoId, 600, 450) : "/assets/materi-bg.jpg";

  return (
    <div className="flex flex-col h-full font-['Nunito'] justify-between overflow-hidden max-h-full min-h-0 relative p-1 sm:p-2 select-none">
      
      {/* Main Content Layout (Sidebar + Right Content Area) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 flex-1 min-h-0 h-full items-stretch">
        
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
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="md:col-span-8 lg:col-span-9 flex flex-col justify-between h-full min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-1 pb-16 sm:pb-20 space-y-3"
        >
          {/* Header Title with Leaf Sprigs 🌿 */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl text-[#1c5c32] select-none">🌿</span>
            <h2 className="font-['Fredoka'] font-extrabold text-2xl sm:text-3xl text-[#1c5c32] uppercase tracking-wider leading-none">
              {tab === "nilai-budaya" ? "NILAI BUDAYA" : tab}
            </h2>
            <span className="text-2xl text-[#1c5c32] select-none transform scale-x-[-1]">🌿</span>
          </div>

          {/* Tab Content Display */}
          <div className="flex-1 min-h-0 space-y-3">
            {/* Text Tabs (Pengertian, Sejarah, Tujuan) with Tilted Polaroid Photo */}
            {(tab === "pengertian" || tab === "sejarah" || tab === "tujuan") && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Text Paragraph (Left Column) */}
                <div className="md:col-span-7 bg-[#fbf7ee] border border-[#e5dabf] rounded-2xl p-4 sm:p-5 shadow-xs">
                  <p className="text-[#4a3728] text-xs sm:text-sm leading-relaxed font-semibold font-['Nunito'] text-justify">
                    {tab === "pengertian" && (
                      <>
                        <strong className="text-[#1c5c32] font-bold">{mission.name}</strong>{" "}
                        {content.pengertian.replace(mission.name, "").trimStart()}
                      </>
                    )}
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

            {/* Nilai Budaya Tab */}
            {tab === "nilai-budaya" && (
              <div className="bg-[#fbf7ee] border border-[#e5dabf] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <h3 className="font-['Fredoka'] font-extrabold text-[#1c5c32] text-sm sm:text-base mb-2">
                  Nilai-Nilai Budaya yang Terkandung:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {content.nilaiBudaya.map((n, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="bg-[#f5ebd6]/80 border border-[#e8d9bd] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-xs hover:shadow-sm transition-shadow text-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#1c5c32] text-white flex items-center justify-center text-xl shadow-xs">
                        {nilaiBudayaIcons[n] || "✨"}
                      </div>
                      <span className="font-['Fredoka'] font-extrabold text-[#3a2718] text-xs leading-tight">
                        {n}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

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
                          src={unsplashUrl(item.photoId)}
                          alt={item.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2.5">
                        <p className="text-[#4a3728] text-xs font-['Nunito'] font-bold leading-snug">{item.caption}</p>
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
              src={unsplashUrl(mission.galeri[lightbox].photoId, 800, 520)}
              alt={mission.galeri[lightbox].caption}
              className="w-full rounded-2xl object-cover shadow-2xl"
            />
            <p className="text-white text-sm text-center mt-3 leading-relaxed font-['Nunito']">{mission.galeri[lightbox].caption}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MateriScreen;
