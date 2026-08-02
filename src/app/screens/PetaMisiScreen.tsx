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
    image: "/assets/larung sesaji.svg",
    desc: "Ritual persembahan sesaji di permukaan Telaga Sarangan sebagai wujud rasa syukur dan penghormatan kepada alam.",
    color: "#3b82f6",
    accent: "from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    name: "Nyadaran",
    emoji: "🌺",
    location: "Ngebel / Magetan Kidul",
    image: "/assets/nyadaran-cover.png",
    desc: "Upacara tradisional bersih desa yang penuh dengan doa dan harapan masyarakat Magetan.",
    color: "#10b981",
    accent: "from-emerald-500 to-green-400",
  },
  {
    id: 3,
    name: "Ledhug Suro",
    emoji: "🥁",
    location: "Alun-Alun Magetan",
    image: "/assets/map-base.png",
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
        <ScreenHeader title="Peta Misi Budaya" onBack={onBack} onHome={onBack} />
      </div>

      {/* Banner Title Asset */}
      <div className="relative z-10 flex justify-center pt-1">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="w-44 sm:w-64 md:w-72 pointer-events-none"
        >
          <img 
            src="/assets/map-petatxt.svg" 
            alt="Peta Budaya Magetan" 
            className="w-full h-auto drop-shadow-md object-contain"
          />
        </motion.div>
      </div>

      {/* Main Content: Stamp Cards Carousel */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-start pt-1 sm:pt-2 px-2 sm:px-6 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
                    scale: isActive ? 1 : 0.82,
                    filter: isActive ? "none" : "brightness(0.7)",
                  }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  onClick={() => {
                    playSFX("click");
                    setSelectedIdx(idx);
                  }}
                  className={`relative cursor-pointer transition-all ${
                    isActive ? "z-20" : "z-10"
                  }`}
                >
                  {/* Stamp Card */}
                  <div
                    className={`relative bg-[#f9f3e3] rounded-lg overflow-hidden shadow-xl transition-all ${
                      isActive
                        ? "w-36 sm:w-48 border-[3px] border-[#c2aa84]"
                        : "w-24 sm:w-32 border-2 border-[#d8c7a5]/60"
                    }`}
                  >
                    {/* Stamp perforated edge effect (top) */}
                    <div className="absolute top-0 left-0 right-0 h-2 flex justify-between px-1 z-20">
                      {[...Array(isActive ? 10 : 7)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#2a1a0a]/80 -mt-0.5"
                        />
                      ))}
                    </div>
                    {/* Stamp perforated edge effect (bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 h-2 flex justify-between px-1 z-20">
                      {[...Array(isActive ? 10 : 7)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#2a1a0a]/80 mt-0.5"
                        />
                      ))}
                    </div>

                    {/* Mission Name Banner */}
                    <div className="bg-[#4a3728] px-1.5 py-0.5 sm:py-1 text-center relative z-10">
                      <span
                        className={`font-['Fredoka'] font-bold text-[#fff5ce] leading-tight ${
                          isActive ? "text-[10px] sm:text-xs" : "text-[8px] sm:text-[10px]"
                        }`}
                      >
                        {mission.name}
                      </span>
                    </div>

                    {/* Image */}
                    <div className={`relative ${isActive ? "h-20 sm:h-28" : "h-14 sm:h-18"}`}>
                      <img
                        src={mission.image}
                        alt={mission.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Locked overlay */}
                      {isLocked && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Lock size={isActive ? 24 : 16} className="text-gray-300" />
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
                <div className="flex-shrink-0 bg-gray-400/50 text-gray-300 rounded-xl px-3 py-1.5 font-['Fredoka'] font-bold text-[11px] border border-gray-500/50 flex items-center gap-1">
                  <Lock size={12} />
                  Terkunci
                </div>
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
        >
          <motion.img
            src="/assets/mascot/dimas-peta.svg"
            alt="Dimas"
            className="w-24 sm:w-36 max-h-[18vh] sm:max-h-[24vh] h-auto object-contain filter drop-shadow-lg"
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
            className="w-22 sm:w-32 max-h-[16vh] sm:max-h-[22vh] h-auto object-contain filter drop-shadow-lg"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PetaMisiScreen;
