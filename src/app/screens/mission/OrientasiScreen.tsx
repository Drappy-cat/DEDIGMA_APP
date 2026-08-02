import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play, MapPin, ChevronRight } from "lucide-react";
import { Mission } from "../../types";
import { Btn } from "../../components/Btn";
import { MascotDimas } from "../../components/Mascot";
import { useAudio } from "../../contexts/AudioContext";

interface OrientasiScreenProps {
  mission: Mission;
  onNext: () => void;
  onBack?: () => void;
}

export const OrientasiScreen: React.FC<OrientasiScreenProps> = ({ mission, onNext, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    playNarrator(mission.orientasi.narasi);
    return () => {
      stopNarrator();
    };
  }, [mission.id]);

  const handlePlayVideo = () => {
    playSFX("click");
    setShowVideo(true);
  };

  const handleNext = () => {
    playSFX("click");
    onNext();
  };

  return (
    <div className="flex flex-col h-full font-['Nunito']">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mission Header Banner */}
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-r ${mission.gradient} text-white rounded-3xl p-5 shadow-lg relative overflow-hidden`}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl filter drop-shadow select-none">{mission.emoji}</span>
              <div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Orientasi Misi {mission.id}</p>
                <h2 className="font-['Fredoka'] font-bold text-2xl leading-tight">{mission.name}</h2>
              </div>
            </div>
            <p className="text-white/80 text-[10px] font-semibold flex items-center gap-0.5 mt-1 select-none">
              <MapPin size={10} /> {mission.location}
            </p>
          </div>
          {/* Decorative circle */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10" />
        </motion.div>

        {/* Narration Card */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex gap-3 items-start"
        >
          <MascotDimas size="sm" animate={true} />
          <div className="bg-white rounded-2xl p-4 flex-1 shadow-md border border-blue-100">
            <p className="text-gray-700 text-sm leading-relaxed">{mission.orientasi.narasi}</p>
          </div>
        </motion.div>

        {/* Video Preview Card */}
        {mission.orientasi.videoQuery && (
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className="relative w-full select-none bg-gradient-to-br from-gray-800 to-gray-900" style={{ aspectRatio: "16/9" }}>
              {/* Placeholder gradient background with play button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${mission.gradient} flex items-center justify-center shadow-2xl opacity-80`}>
                  <span className="text-4xl select-none">{mission.emoji}</span>
                </div>
                <p className="text-white/60 text-xs font-semibold">Video Orientasi Misi {mission.id}</p>
              </div>

              {!showVideo && (
                <button
                  onClick={handlePlayVideo}
                  className="absolute inset-0 flex items-center justify-center group cursor-pointer z-10"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-700 shadow-2xl flex items-center justify-center"
                  >
                    <Play size={28} className="text-white ml-1" fill="white" />
                  </motion.div>
                </button>
              )}

              {showVideo && (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(mission.orientasi.videoQuery)}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0 z-20"
                />
              )}
            </div>

            <div className="p-3">
              <h4 className="font-['Fredoka'] font-semibold text-gray-800 text-sm">Video Pengantar: {mission.name}</h4>
              <p className="text-gray-500 text-[11px] leading-relaxed mt-1">{mission.desc}</p>
              <a
                href={`https://www.youtube.com/results?search_query=${mission.orientasi.videoQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-[11px] font-bold mt-2"
              >
                🔗 Tonton langsung di YouTube
              </a>
            </div>
          </motion.div>
        )}

        {/* Mission Overview */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="bg-white rounded-2xl shadow-md p-4 border border-gray-100/50"
        >
          <h3 className="font-['Fredoka'] font-bold text-gray-800 text-sm mb-2">📋 Tentang Misi Ini</h3>
          <p className="text-gray-600 text-xs leading-relaxed">{mission.desc}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {mission.content.nilaiBudaya.map((n, i) => (
              <span
                key={i}
                className={`${mission.bgLight} ${mission.textColor} text-[10px] font-bold px-2.5 py-1 rounded-full border ${mission.borderColor}`}
              >
                {n}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation: Back + Next */}
      <div className="flex justify-between items-center px-3 py-2 flex-shrink-0 z-30 relative bg-transparent">
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
    </div>
  );
};
export default OrientasiScreen;
