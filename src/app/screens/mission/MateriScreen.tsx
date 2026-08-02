import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, X, Info, Clock, Target, Heart, Image, Play } from "lucide-react";
import { Mission, MateriTab } from "../../types";
import { useAudio } from "../../contexts/AudioContext";

// Helper for photo URL
const unsplashUrl = (photoId: string, w = 400, h = 260) => {
  return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
};

// Video Card sub-component with parchment styling
const VideoCard: React.FC<{ item: { title: string; desc: string; thumbId: string; query: string }; missionName: string }> = ({ item, missionName }) => {
  const [playing, setPlaying] = useState(false);
  const { playSFX } = useAudio();
  const youtubeSearch = `https://www.youtube.com/results?search_query=${item.query}`;

  return (
    <div className="bg-[#f6eed9] border-2 border-[#d8c7a5] rounded-2xl overflow-hidden shadow-sm">
      <div className="relative w-full select-none" style={{ aspectRatio: "16/9" }}>
        <img src={unsplashUrl(item.thumbId, 640, 360)} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/25" />
        <button
          onClick={() => { playSFX("click"); setPlaying(true); }}
          className="absolute inset-0 flex items-center justify-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#7e371b] group-hover:bg-[#5a2512] group-hover:scale-105 transition-all shadow-2xl flex items-center justify-center border-2 border-[#fad86b]">
            <svg viewBox="0 0 24 24" fill="#fad86b" className="w-7 h-7 ml-1">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </button>
      </div>

      <div className="p-3 space-y-2">
        <h4 className="font-['Fredoka'] font-bold text-[#4a3728] text-sm leading-snug">{item.title}</h4>
        <p className="font-['Nunito'] font-semibold text-[#7a6450] text-[11px] leading-relaxed">{item.desc}</p>
        <a
          href={youtubeSearch}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playSFX("click")}
          className="inline-flex items-center gap-1.5 bg-[#7e371b] hover:bg-[#5a2512] text-[#fff5ce] font-['Fredoka'] font-bold text-xs px-4 py-1.5 rounded-xl transition-all shadow-sm border border-[#572410]"
        >
          <Play size={12} /> Tonton di YouTube
        </a>
      </div>

      {playing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPlaying(false)}>
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <p className="font-['Fredoka'] font-semibold text-white text-sm truncate">{item.title}</p>
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
              <a href={youtubeSearch} target="_blank" rel="noopener noreferrer" className="text-[#fad86b] underline font-semibold">
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
  pengertian: <Info size={16} />,
  sejarah: <Clock size={16} />,
  tujuan: <Target size={16} />,
  "nilai-budaya": <Heart size={16} />,
  galeri: <Image size={16} />,
  video: <Play size={16} />
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

  // Get the first gallery photo for the pengertian/sejarah/tujuan content area
  const heroPhoto = mission.galeri.length > 0 ? unsplashUrl(mission.galeri[0].photoId, 320, 200) : null;

  return (
    <div className="flex flex-col h-full font-['Nunito'] overflow-visible min-h-0">
      {/* Wooden Header Banner */}
      <div className="flex justify-center py-2 flex-shrink-0">
        <div className="bg-[#7e371b] border-2 border-[#572410] rounded-2xl py-1.5 px-6 shadow-md border-b-4 flex items-center justify-center gap-2">
          <h1 className="font-['Fredoka'] font-extrabold text-base sm:text-lg text-white tracking-wider drop-shadow-md uppercase">
            Materi Budaya
          </h1>
        </div>
      </div>

      <div className="flex justify-center -mt-1 mb-2 flex-shrink-0">
        <div className="bg-[#572410] border border-[#3d1a0c] rounded-xl py-1 px-5 shadow-sm">
          <h2 className="font-['Fredoka'] font-extrabold text-sm sm:text-base text-[#fad86b] tracking-wide drop-shadow-sm uppercase">
            {mission.name}
          </h2>
        </div>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex gap-3 overflow-visible px-1 min-h-0">
        {/* Left Sidebar: Tabs + Mascot */}
        <div className="flex flex-col flex-shrink-0 w-[130px] sm:w-[160px] h-full">
          <div className="flex flex-col gap-1">
            {tabs.map((t, i) => (
              <motion.button
                key={t.key}
                onClick={() => handleTabChange(t.key)}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={`flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl font-['Fredoka'] font-bold text-[10px] sm:text-xs whitespace-nowrap transition-all cursor-pointer text-left border-2 shadow-sm ${
                  tab === t.key
                    ? "bg-[#366635] text-white border-[#244723] shadow-md"
                    : "bg-[#f6eed9] text-[#5c4a3a] border-[#d8c7a5] hover:bg-[#ece2c8] hover:border-[#c2aa84]"
                }`}
              >
                <span className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex-shrink-0 ${
                  tab === t.key ? "bg-white/20" : "bg-[#e6dbbf]"
                }`}>
                  {tabIcons[t.key]}
                </span>
                {t.label}
              </motion.button>
            ))}
          </div>


        </div>

        {/* Right: Content Area */}
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 min-h-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {/* Text content tabs (Pengertian, Sejarah, Tujuan) */}
              {(tab === "pengertian" || tab === "sejarah" || tab === "tujuan") && (
                <>
                  {/* Separated Image */}
                  {heroPhoto && (
                    <div className="flex justify-center w-full mb-1">
                      <div className="w-[92%] sm:w-[88%] rounded-xl overflow-hidden border-2 border-[#c2aa84] shadow-md">
                        <img
                          src={heroPhoto}
                          alt={mission.name}
                          className="w-full h-40 sm:h-48 object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Text Card */}
                  <div className="bg-[#f6eed9] border-2 border-[#d8c7a5] rounded-2xl p-3 sm:p-4 shadow-sm w-full">
                    <p className="w-full text-[#4a3728] leading-relaxed text-[16px] font-bold text-justify">
                      {tab === "pengertian" && (
                        <>
                          <strong className="text-[#7e371b] font-extrabold">{mission.name}</strong>{" "}
                          {content.pengertian.replace(mission.name, "").trimStart()}
                        </>
                      )}
                      {tab === "sejarah" && content.sejarah}
                      {tab === "tujuan" && content.tujuan}
                    </p>
                  </div>
                </>
              )}

              {/* Nilai Budaya tab */}
              {tab === "nilai-budaya" && (
                <div className="bg-[#f6eed9] border-2 border-[#d8c7a5] rounded-2xl p-3 sm:p-4 shadow-sm">
                  {/* Section title */}
                  <h3 className="font-['Fredoka'] font-extrabold text-[#4a3728] text-sm sm:text-base text-center mb-3 pb-2 border-b-2 border-[#d8c7a5]">
                    Nilai Budaya yang Terkandung
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {content.nilaiBudaya.map((n, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15 + i * 0.08 }}
                        className="bg-[#ece2c8] border-2 border-[#c2aa84] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#4a3728] border-2 border-[#3b1e0a] flex items-center justify-center text-2xl shadow-sm">
                          {nilaiBudayaIcons[n] || "💫"}
                        </div>
                        <p className="font-['Fredoka'] font-extrabold text-[#4a3728] text-[11px] sm:text-xs text-center leading-tight">
                          {n}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Galeri tab */}
              {tab === "galeri" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-[#f6eed9] rounded-xl px-3 py-2 border-2 border-[#d8c7a5] select-none shadow-sm">
                    <Image size={16} className="text-[#7e371b]" />
                    <p className="text-[#7e371b] text-xs font-['Fredoka'] font-bold">Ketuk foto untuk melihat lebih besar</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {mission.galeri.map((item, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          playSFX("click");
                          setLightbox(i);
                        }}
                        className="rounded-2xl overflow-hidden shadow-sm text-left cursor-pointer border-2 border-[#d8c7a5] bg-[#f6eed9] flex flex-col hover:shadow-md transition-shadow"
                      >
                        <img
                          src={unsplashUrl(item.photoId)}
                          alt={item.caption}
                          className="w-full h-24 sm:h-28 object-cover"
                        />
                        <div className="px-2.5 py-2">
                          <p className="text-[#5c4a3a] text-[10px] leading-snug font-['Nunito'] font-bold">{item.caption}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Video tab */}
              {tab === "video" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-[#f6eed9] rounded-xl px-3 py-2 border-2 border-[#d8c7a5] select-none shadow-sm">
                    <Play size={16} className="text-[#7e371b]" />
                    <p className="text-[#7e371b] text-xs font-['Fredoka'] font-bold">Tonton video pembelajaran tentang {mission.name}</p>
                  </div>
                  {mission.video.map((v, i) => (
                    <VideoCard key={i} item={v} missionName={mission.name} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Speaker button to replay narration */}
          <div className="flex justify-end pb-1">
            <button
              onClick={() => {
                let speakText = "";
                if (tab === "pengertian") speakText = `Berikut adalah pengertian dari ${mission.name}. ${content.pengertian}`;
                else if (tab === "sejarah") speakText = `Mari baca sejarah tentang ${mission.name}. ${content.sejarah}`;
                else if (tab === "tujuan") speakText = `Apa tujuan pelaksanaan ${mission.name}? ${content.tujuan}`;
                else if (tab === "nilai-budaya") speakText = `Nilai budaya yang terkandung meliputi: ${content.nilaiBudaya.join(", ")}`;
                else if (tab === "galeri") speakText = "Lihat galeri foto kegiatan budaya di halaman ini.";
                else if (tab === "video") speakText = `Tonton video edukasi tentang ${mission.name}.`;
                if (speakText) playNarrator(speakText);
              }}
              className="p-2 bg-[#f0e6d2] text-[#7e371b] hover:bg-[#e6dbbf] rounded-full transition-colors active:scale-95 border-2 border-[#d9c5a3] shadow-sm"
              aria-label="Putar Suara"
            >
              <Volume2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation: Back + Next */}
      <div className="flex justify-between items-center px-3 py-2 flex-shrink-0 z-30 relative">
        {onBack ? (
          <button
            onClick={() => { playSFX("click"); onBack(); }}
            className="transition-transform cursor-pointer hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Kembali"
          >
            <img
              src="/assets/button/back.svg"
              alt="Tombol Kembali"
              className="w-12 sm:w-16 h-auto object-contain drop-shadow-md"
            />
          </button>
        ) : (
          <div className="w-12 sm:w-16" />
        )}
        <button
          onClick={handleNext}
          className="transition-transform cursor-pointer hover:scale-105 active:scale-95 focus:outline-none"
          aria-label="Lanjut"
        >
          <img
            src="/assets/button/next.svg"
            alt="Tombol Lanjut"
            className="w-12 sm:w-16 h-auto object-contain drop-shadow-md"
          />
        </button>
      </div>

      {/* Mascot at bottom left */}
      <motion.div 
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute -bottom-12 sm:-bottom-16 -left-4 sm:-left-6 z-20 pointer-events-none origin-bottom"
      >
        <motion.div
          animate={{ 
            y: [0, -3, 0],
            scaleY: [1, 1.015, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="origin-bottom"
        >
          <img 
            src="/assets/mascot/Dimas-Petunjuk.svg" 
            alt="Dimas Petunjuk" 
            className="w-48 sm:w-64 h-auto object-contain filter drop-shadow-xl" 
          />
        </motion.div>
      </motion.div>

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
            <div className="flex justify-between mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSFX("click");
                  setLightbox((l) => (l !== null && l > 0 ? l - 1 : mission.galeri.length - 1));
                }}
                className="bg-[#7e371b] hover:bg-[#5a2512] text-[#fff5ce] rounded-xl px-4 py-2 font-['Fredoka'] font-bold text-xs cursor-pointer border border-[#572410] shadow-sm"
              >
                ← Sebelumnya
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSFX("click");
                  setLightbox((l) => (l !== null && l < mission.galeri.length - 1 ? l + 1 : 0));
                }}
                className="bg-[#7e371b] hover:bg-[#5a2512] text-[#fff5ce] rounded-xl px-4 py-2 font-['Fredoka'] font-bold text-xs cursor-pointer border border-[#572410] shadow-sm"
              >
                Berikutnya →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MateriScreen;
