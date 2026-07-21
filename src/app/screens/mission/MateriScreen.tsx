import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronRight, MapPin, X } from "lucide-react";
import { Mission, MateriTab } from "../../types";
import { Btn } from "../../components/Btn";
import { MascotDimas, MascotGita } from "../../components/Mascot";
import { useAudio } from "../../contexts/AudioContext";

// Helper for photo URL
const unsplashUrl = (photoId: string, w = 400, h = 260) => {
  return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
};

// Video Card sub-component
const VideoCard: React.FC<{ item: { title: string; desc: string; thumbId: string; query: string } }> = ({ item }) => {
  const [playing, setPlaying] = useState(false);
  const { playSFX } = useAudio();
  const youtubeSearch = `https://www.youtube.com/results?search_query=${item.query}`;

  const handlePlay = () => {
    playSFX("click");
    setPlaying(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      <div className="relative w-full select-none" style={{ aspectRatio: "16/9" }}>
        <img src={unsplashUrl(item.thumbId, 640, 360)} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/25" />
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-red-600 group-hover:bg-red-700 group-hover:scale-105 transition-all shadow-2xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </button>
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-['Fredoka'] font-bold px-2 py-0.5 rounded-md">
          ▶ YouTube
        </div>
      </div>

      <div className="p-3 space-y-2">
        <h4 className="font-['Fredoka'] font-semibold text-gray-800 text-sm leading-snug">{item.title}</h4>
        <p className="font-['Nunito'] text-gray-500 text-[11px] leading-relaxed">{item.desc}</p>
        <a
          href={youtubeSearch}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playSFX("click")}
          className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-['Fredoka'] font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
        >
          Tonton di YouTube
        </a>
      </div>

      {playing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPlaying(false)}
        >
          <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <p className="font-['Fredoka'] font-semibold text-white text-sm truncate">{item.title}</p>
              <button
                onClick={() => setPlaying(false)}
                className="text-white bg-white/20 hover:bg-white/30 rounded-full p-1 cursor-pointer"
              >
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
              <a
                href={youtubeSearch}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 underline font-semibold"
              >
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
}

export const MateriScreen: React.FC<MateriScreenProps> = ({ mission, onNext }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [tab, setTab] = useState<MateriTab>("pengertian");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const tabs: { key: MateriTab; label: string; icon: string }[] = [
    { key: "pengertian", label: "Pengertian", icon: "📖" },
    { key: "sejarah", label: "Sejarah", icon: "📜" },
    { key: "tujuan", label: "Tujuan", icon: "🎯" },
    { key: "nilai-budaya", label: "Nilai Budaya", icon: "⭐" },
    { key: "galeri", label: "Galeri", icon: "🖼️" },
    { key: "video", label: "Video", icon: "🎬" }
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

  return (
    <div className="flex flex-col h-full font-['Nunito']">
      {/* Tab bar — scrollable */}
      <div className="bg-white border-b border-blue-100 px-3 py-2 flex gap-2 overflow-x-auto scrollbar-none select-none">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl font-['Fredoka'] font-bold text-xs whitespace-nowrap transition-all cursor-pointer flex-shrink-0
              ${
                tab === t.key
                  ? t.key === "galeri"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                    : t.key === "video"
                    ? "bg-red-600 text-white shadow-md shadow-red-200"
                    : "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-500 hover:bg-gray-100 bg-white"
              }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Main content body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mission header banner */}
        <div className={`flex items-center gap-3 bg-gradient-to-r ${mission.gradient} text-white rounded-2xl p-3 shadow-md`}>
          <span className="text-4xl filter drop-shadow select-none">{mission.emoji}</span>
          <div>
            <h2 className="font-['Fredoka'] font-bold text-lg leading-tight">{mission.name}</h2>
            <p className="text-white/80 text-[10px] font-semibold mt-0.5 flex items-center gap-0.5 select-none">
              <MapPin size={10} /> {mission.location}
            </p>
          </div>
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {/* Text content tabs */}
          {(tab === "pengertian" || tab === "sejarah" || tab === "tujuan") && (
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100/50">
              <p className="text-gray-700 leading-relaxed text-sm">
                {tab === "pengertian" && content.pengertian}
                {tab === "sejarah" && content.sejarah}
                {tab === "tujuan" && content.tujuan}
              </p>
            </div>
          )}

          {/* Nilai Budaya tab */}
          {tab === "nilai-budaya" && (
            <div className="grid grid-cols-2 gap-3">
              {content.nilaiBudaya.map((n, i) => (
                <div
                  key={i}
                  className={`${mission.bgLight} ${mission.borderColor} border rounded-2xl p-4 text-center shadow-md flex items-center justify-center`}
                >
                  <p className={`font-['Fredoka'] font-bold ${mission.textColor} text-sm`}>{n}</p>
                </div>
              ))}
            </div>
          )}

          {/* Galeri tab */}
          {tab === "galeri" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-purple-50 rounded-xl px-3 py-2 border border-purple-100/20 select-none">
                <span className="text-lg">🖼️</span>
                <p className="text-purple-700 text-xs font-bold">Ketuk foto untuk melihat lebih besar</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mission.galeri.map((item, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      playSFX("click");
                      setLightbox(i);
                    }}
                    className="rounded-2xl overflow-hidden shadow-md text-left cursor-pointer border border-gray-100 bg-white flex flex-col"
                  >
                    <img
                      src={unsplashUrl(item.photoId)}
                      alt={item.caption}
                      className="w-full h-28 object-cover"
                    />
                    <div className="bg-white px-2 py-1.5 flex-1">
                      <p className="text-gray-600 text-[10px] leading-snug font-semibold">{item.caption}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Video tab */}
          {tab === "video" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2 border border-red-100/20 select-none">
                <span className="text-lg">🎬</span>
                <p className="text-red-700 text-xs font-bold">Tonton video pembelajaran tentang {mission.name}</p>
              </div>
              {mission.video.map((v, i) => (
                <VideoCard key={i} item={v} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Mascot companion speech tips */}
        {["pengertian", "sejarah", "tujuan", "nilai-budaya"].includes(tab) && (
          <div className="flex gap-3 items-start select-none">
            <MascotDimas size="sm" animate={true} />
            <div className="bg-blue-50 rounded-2xl p-3 flex-1 text-xs text-blue-700 leading-relaxed border border-blue-100">
              Baca setiap tab dengan teliti ya! Lanjutkan ke tab <strong>Galeri</strong> dan <strong>Video</strong> untuk
              materi yang lebih seru! 💪
            </div>
          </div>
        )}
        {tab === "galeri" && (
          <div className="flex gap-3 items-start select-none">
            <MascotGita size="sm" animate={true} />
            <div className="bg-purple-50 rounded-2xl p-3 flex-1 text-xs text-purple-700 leading-relaxed border border-purple-100">
              Ini foto-foto dokumentasi budaya {mission.name}. Amati keindahan kegiatan budaya masyarakat Magetan ya! 📸
            </div>
          </div>
        )}
        {tab === "video" && (
          <div className="flex gap-3 items-start select-none">
            <MascotDimas size="sm" animate={true} />
            <div className="bg-red-50 rounded-2xl p-3 flex-1 text-xs text-red-700 leading-relaxed border border-red-100">
              Tonton video pembelajaran di atas untuk memahami lebih dalam tradisi kearifan lokal {mission.name}! 🎬
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer action button */}
      <div className="p-4 bg-transparent flex-shrink-0 flex justify-center">
        <Btn onClick={handleNext} variant="lanjut" />
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
            <p className="text-white text-sm text-center mt-3 leading-relaxed">{mission.galeri[lightbox].caption}</p>
            {/* navigation inside lightbox */}
            <div className="flex justify-between mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSFX("click");
                  setLightbox((l) => (l !== null && l > 0 ? l - 1 : mission.galeri.length - 1));
                }}
                className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 font-['Fredoka'] font-bold text-xs cursor-pointer"
              >
                ← Sebelumnya
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSFX("click");
                  setLightbox((l) => (l !== null && l < mission.galeri.length - 1 ? l + 1 : 0));
                }}
                className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 font-['Fredoka'] font-bold text-xs cursor-pointer"
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
