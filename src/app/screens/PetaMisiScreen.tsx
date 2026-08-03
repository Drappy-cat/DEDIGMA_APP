import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useAudio } from "../contexts/AudioContext";
import { ScreenHeader } from "../components/ScreenHeader";

interface PetaMisiScreenProps {
  completedMissions: Set<number>;
  onMission: (id: number) => void;
  onBack: () => void;
}

const MISSIONS = [
  {
    id: 1,
    name: "Larung Sesaji",
    emoji: "⛵",
    location: "Telaga Sarangan",
    image: "/assets/peta/larungsesaji.svg",
    desc: "Ritual persembahan sesaji di permukaan Telaga Sarangan sebagai wujud rasa syukur dan penghormatan kepada alam.",
    color: "#3b82f6",
    accent: "from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    name: "Nyadaran",
    emoji: "🌺",
    location: "Ngebel / Magetan Kidul",
    image: "/assets/peta/nyadran.svg",
    desc: "Upacara tradisional bersih desa yang penuh dengan doa dan harapan masyarakat Magetan.",
    color: "#10b981",
    accent: "from-emerald-500 to-green-400",
  },
  {
    id: 3,
    name: "Ledhug Suro",
    emoji: "🥁",
    location: "Alun-Alun Magetan",
    image: "/assets/peta/ledhugsuro.svg",
    desc: "Festival bedug raksasa menyambut tahun baru Suro dengan penuh semangat gotong-royong.",
    color: "#f59e0b",
    accent: "from-orange-500 to-amber-400",
  },
];

export const PetaMisiScreen: React.FC<PetaMisiScreenProps> = ({
  completedMissions,
  onMission,
  onBack,
}) => {
  const { playSFX } = useAudio();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [shakingId, setShakingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerShake = (id: number) => {
    try {
      playSFX("fail");
    } catch {
      playSFX("click");
    }
    setShakingId(id);
    setToastMessage("Misi masih terkunci, selesaikan misi sebelumnya!");
    setTimeout(() => setShakingId(null), 450);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelect = (id: number) => {
    playSFX("click");
    onMission(id);
  };

  const handlePrev = () => {
    playSFX("click");
    setSelectedIdx((prev) => (prev > 0 ? prev - 1 : MISSIONS.length - 1));
  };

  const handleNext = () => {
    playSFX("click");
    setSelectedIdx((prev) => (prev < MISSIONS.length - 1 ? prev + 1 : 0));
  };

  const selected = MISSIONS[selectedIdx];
  const isSelectedCompleted = completedMissions.has(selected.id);
  const isSelectedLocked = selected.id > 1 && !completedMissions.has(selected.id - 1);

  // Calculate progress percentage per mission
  const getProgress = (id: number): number => {
    if (completedMissions.has(id)) return 100;
    // If it's the current active (not locked, not completed), show partial
    if (id === 1 || completedMissions.has(id - 1)) return 15;
    return 0;
  };

  return (
    <motion.div
      className="h-full flex flex-col overflow-hidden relative select-none font-['Nunito']"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Parchment Map Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/peta.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.45) sepia(0.3)",
        }}
      />
      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#2a1a0a]/60 via-[#3b2410]/30 to-[#1a0e05]/70" />

      {/* Subtle atmosphere effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {/* Drifting clouds */}
        <motion.div
          className="absolute top-[8%] left-[-20%] w-[30rem] h-28 bg-white/8 blur-[50px] rounded-full"
          animate={{ x: ["0vw", "120vw"] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-[30%] left-[-30%] w-[35rem] h-32 bg-white/5 blur-[60px] rounded-full"
          animate={{ x: ["0vw", "130vw"] }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear", delay: 20 }}
        />
        {/* Fireflies */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`ff-${i}`}
            className="absolute bg-amber-200 rounded-full shadow-[0_0_6px_2px_rgba(253,230,138,0.6)]"
            style={{
              top: `${15 + Math.random() * 70}%`,
              left: `${10 + Math.random() * 80}%`,
              width: `${2 + Math.random() * 2}px`,
              height: `${2 + Math.random() * 2}px`,
            }}
            animate={{
              y: [0, -30 + Math.random() * 10, 0],
              x: [0, (Math.random() - 0.5) * 40, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-30">
        <ScreenHeader title="" onBack={onBack} onHome={onBack} />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-20 sm:top-24 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
          >
            <div className="bg-red-950/90 backdrop-blur-sm border-2 border-red-500/80 text-red-100 font-['Fredoka'] font-medium text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-2">
              <Lock size={16} className="text-red-400" />
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner Title Asset - Absolute Overlay */}
      <div className="absolute -top-4 sm:-top-8 inset-x-0 z-40 flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-60 sm:w-80 md:w-96"
        >
          <img 
            src="/assets/map-petatxt.svg" 
            alt="Peta Budaya Magetan" 
            className="w-full h-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] object-contain"
          />
        </motion.div>
      </div>

      {/* Main Content: Stamp Cards Carousel */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-start pt-32 sm:pt-40 pb-8 sm:pb-12 px-2 sm:px-6 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Stamp Cards Row */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-4 w-full max-w-4xl">
          {/* Left Arrow */}
          <motion.button
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#f4ecd5]/90 border-2 border-[#c2aa84] flex items-center justify-center cursor-pointer shadow-md hover:bg-[#ece2c8] transition-colors z-20"
          >
            <ChevronLeft size={18} className="text-[#5c4a3a]" />
          </motion.button>

          {/* Stamp Cards */}
          <div className="flex items-center justify-center gap-2 sm:gap-5 flex-1 min-w-0">
            {MISSIONS.map((mission, idx) => {
              const isActive = idx === selectedIdx;
              const isCompleted = completedMissions.has(mission.id);
              const isLocked = mission.id > 1 && !completedMissions.has(mission.id - 1);
              const progress = getProgress(mission.id);

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    x: shakingId === mission.id ? [-18, 18, -14, 14, -8, 8, -3, 3, 0] : 0,
                    rotate: shakingId === mission.id ? [-6, 6, -5, 5, -2, 2, 0] : 0,
                    scale: isActive
                      ? shakingId === mission.id ? [0.94, 1.04, 0.97, 1] : 1
                      : shakingId === mission.id ? [0.76, 0.86, 0.79, 0.82] : 0.82,
                    filter: isActive ? "none" : "brightness(0.7)",
                  }}
                  transition={{
                    duration: 0.45,
                    delay: shakingId === mission.id ? 0 : idx * 0.1,
                  }}
                  onTap={() => {
                    playSFX("click");
                    if (isLocked) {
                      setSelectedIdx(idx);
                      triggerShake(mission.id);
                    } else if (isActive) {
                      // Enter mission if tapping the already centered unlocked card
                      handleSelect(mission.id);
                    } else {
                      // Just bring it to center if tapping an inactive unlocked card
                      setSelectedIdx(idx);
                    }
                  }}
                  className={`relative cursor-pointer transition-all ${
                    isActive ? "z-20" : "z-10"
                  }`}
                >
                  {/* Stamp Card */}
                  <div
                    className={`relative bg-[#f9f3e3] rounded-lg overflow-hidden shadow-xl transition-all ${
                      shakingId === mission.id
                        ? "ring-4 ring-red-500 border-[3px] border-red-600 shadow-red-500/50"
                        : isActive
                        ? "w-44 sm:w-60 border-[3px] border-[#c2aa84]"
                        : "w-28 sm:w-40 border-2 border-[#d8c7a5]/60"
                    } ${isActive ? "w-44 sm:w-60" : "w-28 sm:w-40"}`}
                  >
                    {/* Stamp perforated edge effect (top) */}
                    <div className="absolute top-0 left-0 right-0 h-2 flex justify-between px-1 z-20">
                      {[...Array(isActive ? 13 : 9)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#2a1a0a]/80 -mt-0.5"
                        />
                      ))}
                    </div>
                    {/* Stamp perforated edge effect (bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 h-2 flex justify-between px-1 z-20">
                      {[...Array(isActive ? 13 : 9)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#2a1a0a]/80 mt-0.5"
                        />
                      ))}
                    </div>

                    {/* Mission Name Banner */}
                    <div className={`px-1.5 py-0.5 sm:py-1 text-center relative z-10 transition-colors ${
                      shakingId === mission.id ? "bg-red-800" : "bg-[#4a3728]"
                    }`}>
                      <span
                        className={`font-['Fredoka'] font-bold text-[#fff5ce] leading-tight ${
                          isActive ? "text-[10px] sm:text-xs" : "text-[8px] sm:text-[10px]"
                        }`}
                      >
                        {mission.name}
                      </span>
                    </div>

                    {/* Image */}
                    <div className={`relative ${isActive ? "h-28 sm:h-40" : "h-16 sm:h-24"}`}>
                      <img
                        src={mission.image}
                        alt={mission.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Locked overlay */}
                      {isLocked && (
                        <div className={`absolute inset-0 transition-colors flex items-center justify-center ${
                          shakingId === mission.id ? "bg-red-950/80" : "bg-black/60"
                        }`}>
                          <Lock
                            size={isActive ? 28 : 20}
                            className={`transition-all ${
                              shakingId === mission.id
                                ? "text-red-400 scale-125 rotate-12"
                                : "text-gray-300"
                            }`}
                          />
                        </div>
                      )}
                      {/* Completed stamp */}
                      {isCompleted && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-emerald-500/90 rounded-full p-1.5 sm:p-2 border-2 border-white shadow-lg">
                            <Check size={isActive ? 20 : 14} className="text-white" strokeWidth={3} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Location tag for active */}
                    {isActive && (
                      <div className="bg-[#f4ecd5] px-1.5 py-0.5 sm:py-1 text-center border-t border-[#d8c7a5]">
                        <span className="text-[9px] sm:text-[11px] text-[#7e5c3a] font-bold font-['Nunito'] truncate block">
                          📍 {mission.location}
                        </span>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="px-1.5 py-1 bg-[#f4ecd5]">
                      <div className="flex items-center gap-1">
                        <div className="flex-1 h-1.5 sm:h-2 bg-[#d8c7a5]/60 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              isCompleted
                                ? "bg-emerald-500"
                                : progress > 0
                                ? "bg-amber-400"
                                : "bg-gray-400/40"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + idx * 0.1 }}
                          />
                        </div>
                        <span
                          className={`font-['Fredoka'] font-bold ${
                            isActive ? "text-[9px] sm:text-[11px]" : "text-[7px] sm:text-[9px]"
                          } text-[#5c4a3a]`}
                        >
                          {progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#f4ecd5]/90 border-2 border-[#c2aa84] flex items-center justify-center cursor-pointer shadow-md hover:bg-[#ece2c8] transition-colors z-20"
          >
            <ChevronRight size={18} className="text-[#5c4a3a]" />
          </motion.button>
        </div>

        {/* Description Bar & Action */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-lg sm:max-w-xl mt-2 sm:mt-3 mb-14 sm:mb-16 px-1"
          >
            <div className="bg-[#f4ecd5]/95 backdrop-blur-sm border-2 border-[#c2aa84] rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-lg flex items-center gap-2 sm:gap-4">
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-['Fredoka'] font-extrabold text-[#4a3728] text-xs sm:text-base leading-tight flex items-center gap-1">
                  <span className="text-base sm:text-lg">{selected.emoji}</span>
                  <span className="truncate">Misi {selected.id}: {selected.name}</span>
                </h3>
                <p className="text-[#7e5c3a] text-[10px] sm:text-xs mt-0.5 font-semibold leading-snug line-clamp-2">
                  {selected.desc}
                </p>
              </div>

              {/* Action Button */}
              {isSelectedLocked ? (
                <motion.button
                  onClick={() => triggerShake(selected.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.93 }}
                  animate={shakingId === selected.id ? { x: [0, -10, 10, -8, 8, -4, 4, 0], rotate: [0, -3, 3, -2, 2, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="flex-shrink-0 bg-red-950/70 hover:bg-red-900/80 text-red-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 font-['Fredoka'] font-bold text-xs sm:text-sm border-2 border-red-500/60 flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                >
                  <Lock size={14} className="text-red-300 animate-pulse" />
                  Terkunci 🔒
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => handleSelect(selected.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 font-['Fredoka'] font-bold text-xs sm:text-sm border-2 cursor-pointer shadow-md transition-colors ${
                    isSelectedCompleted
                      ? "bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white"
                      : "bg-[#7e371b] hover:bg-[#5a2512] border-[#572410] text-[#fff5ce]"
                  }`}
                >
                  {isSelectedCompleted ? "Ulangi ✓" : "Mulai →"}
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom: Mascots */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex justify-between items-end px-1 sm:px-3 pointer-events-none">
        {/* Dimas - left */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="-ml-4 sm:-ml-8 md:-ml-12 lg:-ml-16"
        >
          <motion.img
            src="/assets/mascot/dimas-peta.svg"
            alt="Dimas"
            className="w-40 sm:w-56 md:w-72 lg:w-80 max-h-[28vh] sm:max-h-[35vh] md:max-h-[45vh] h-auto object-contain filter drop-shadow-lg"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Gita - right */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        >
          <motion.img
            src="/assets/mascot/gita-peta.svg"
            alt="Gita"
            className="w-36 sm:w-52 md:w-64 lg:w-72 max-h-[25vh] sm:max-h-[32vh] md:max-h-[40vh] h-auto object-contain filter drop-shadow-lg"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PetaMisiScreen;
