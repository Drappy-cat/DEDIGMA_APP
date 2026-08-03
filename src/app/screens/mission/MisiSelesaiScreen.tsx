import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Mission } from "../../types";
import { useAudio } from "../../contexts/AudioContext";
import { fireContinuousConfetti } from "../../utils/confetti";

interface MisiSelesaiScreenProps {
  mission: Mission;
  totalScore: number;
  onContinue: () => void;
}

export const MisiSelesaiScreen: React.FC<MisiSelesaiScreenProps> = ({
  mission,
  totalScore,
  onContinue
}) => {
  const { playSFX, playNarrator } = useAudio();

  useEffect(() => {
    fireContinuousConfetti();
    playSFX("badge");
    playNarrator(`Selamat! Kamu telah menyelesaikan Misi ${mission.id} dengan skor ${totalScore}!`);
  }, []);

  return (
    <div className="flex flex-col h-full font-['Nunito'] justify-between overflow-hidden max-h-full min-h-0 relative p-1 sm:p-2 select-none">
      
      {/* Scrollable Main Content Container */}
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-3 sm:space-y-4 pr-1 pb-16 flex flex-col items-center">
        
        {/* Top Header Section with Ribbon Medal & Wood Signboard */}
        <div className="flex flex-col items-center relative mt-3 mb-1 w-full max-w-md flex-shrink-0">
          
          {/* Top Gold Star Ribbon Medal 🎖️ (Overhanging Top Center) */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] border-2 border-[#fff5ce] shadow-lg flex items-center justify-center text-2xl sm:text-3xl z-20 -mb-5 relative">
            <div className="absolute inset-0 rounded-full bg-yellow-400 blur-md opacity-40 animate-pulse" />
            <span className="relative z-10">⭐</span>
          </div>

          {/* Centered Wooden Header Signboard Banner */}
          <div className="bg-[#6b3c1b] border-2 border-[#4a270f] rounded-2xl px-8 sm:px-10 pt-5 pb-2 text-[#fff5ce] font-['Fredoka'] font-extrabold text-lg sm:text-xl md:text-2xl uppercase tracking-wider shadow-md border-b-4 flex items-center justify-center gap-2 relative z-10 w-full text-center">
            <span className="text-base select-none">🌿</span>
            <span>MISI SELESAI!</span>
            <span className="text-base select-none transform scale-x-[-1]">🌿</span>
          </div>

          {/* Sub-banner Green Capsule Badge */}
          <div className="bg-[#256c3a] border border-[#184826] text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full px-5 py-1 shadow-xs -mt-3.5 z-20">
            {mission.name}
          </div>
        </div>

        {/* Outer Parchment Container for Score & Achievement */}
        <div className="w-full max-w-md space-y-3">
          
          {/* Upper Score Display Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-[#fdfcf7] border border-[#e8dcb8] rounded-3xl p-5 sm:p-6 shadow-xs text-center space-y-3 relative"
          >
            {/* Section Label */}
            <h4 className="text-[#7a6450] font-['Fredoka'] font-extrabold text-xs sm:text-sm tracking-wider uppercase">
              SKOR AKTIVITAS
            </h4>

            {/* Big Numeric Score Display */}
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="font-['Fredoka'] font-extrabold text-5xl sm:text-6xl text-[#256c3a] drop-shadow-xs">
                {totalScore}
              </span>
              <span className="font-['Fredoka'] font-bold text-lg sm:text-xl text-[#59432e]">
                / 100
              </span>
            </div>

            {/* Motivational Feedback Box (Light Green Tinted) */}
            <div className="bg-[#eaf4ea] border border-[#c4e0c4] rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 text-left">
              <span className="text-lg select-none flex-shrink-0 mt-0.5">🍃</span>
              <p className="text-[#235430] text-xs sm:text-sm font-['Nunito'] font-bold leading-relaxed">
                {totalScore >= 85
                  ? "Luar biasa! Pemahaman budayamu sangat cemerlang."
                  : totalScore >= 70
                  ? "Hebat sekali! Kamu memahami materi ini dengan baik."
                  : "Tidak apa-apa! Setiap petualangan membuatmu lebih bijak."}
              </p>
            </div>
          </motion.div>

          {/* Lower Achievement Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="bg-[#fdfcf7] border border-[#e8dcb8] rounded-3xl p-4 sm:p-5 shadow-xs space-y-2"
          >
            {/* Section Label */}
            <h4 className="text-[#7a6450] font-['Fredoka'] font-extrabold text-xs tracking-wider uppercase">
              PENCAPAIAN
            </h4>

            {/* Achievement Detail Item */}
            <div className="flex items-center gap-3.5 pt-0.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#f5ebd6] border border-[#e8dcb8] flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                🏅
              </div>
              <div className="text-left">
                <h5 className="font-['Fredoka'] font-extrabold text-[#1c5c32] text-sm sm:text-base leading-tight">
                  Penjelajah Budaya
                </h5>
                <p className="text-[#59432e] text-xs font-semibold mt-0.5">
                  Telah menyelesaikan Misi {mission.id}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Left Mascot: Dimas (dimas-peta.svg) — Significantly Enlarged & Dynamic Floating */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 sm:bottom-12 left-1 sm:left-3 z-40 pointer-events-auto flex flex-col items-center select-none max-w-[220px] sm:max-w-[280px] md:max-w-[320px]"
      >
        {/* Dimas Speech Dialogue Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-2xl p-2.5 sm:p-3 shadow-md mb-2 relative z-50 hidden md:block max-w-[220px]"
        >
          <div className="flex items-center gap-1 pb-1 mb-1 border-b border-[#e8dcb8]">
            <span className="text-xs">💡</span>
            <span className="font-['Fredoka'] font-extrabold text-[#1c5c32] text-[10px] uppercase">PESAN DIMAS</span>
          </div>
          <p className="text-[#4a3728] text-[11px] sm:text-xs font-['Nunito'] font-bold leading-tight">
            Hebat! Kamu berhasil menyelesaikan tantangan verifikasi fakta budaya ini!
          </p>
          <div className="absolute -bottom-2 left-6 w-0 h-0 border-t-[8px] border-t-[#e8dcb8] border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent" />
        </motion.div>

        {/* Dimas Image & Overlapping Bottom Name Badge */}
        <div className="relative flex flex-col items-center w-full">
          <img
            src="/assets/mascot/dimas-peta.svg"
            alt="Dimas Mascot"
            className="w-40 sm:w-56 md:w-64 lg:w-72 h-auto object-contain filter drop-shadow-2xl"
          />

          {/* Dimas Name Badge — Overlapping & Covering Bottom Boundary Line */}
          <div className="bg-[#fcf5e3] border-2 border-[#e5cca0] text-[#7a5316] text-xs sm:text-sm md:text-base font-['Fredoka'] font-extrabold rounded-full px-5 sm:px-7 py-1 shadow-lg absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap">
            Dimas
          </div>
        </div>
      </motion.div>

      {/* Right Mascot: Gita (Gita-Petunjuk.svg) — Significantly Enlarged & Dynamic Floating */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        className="absolute bottom-10 sm:bottom-12 right-1 sm:right-3 z-40 pointer-events-auto flex flex-col items-center select-none max-w-[220px] sm:max-w-[280px] md:max-w-[320px]"
      >
        {/* Gita Speech Dialogue Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-2xl p-2.5 sm:p-3 shadow-md mb-2 relative z-50 hidden md:block max-w-[220px]"
        >
          <div className="flex items-center gap-1 pb-1 mb-1 border-b border-[#e8dcb8]">
            <span className="text-xs">🌸</span>
            <span className="font-['Fredoka'] font-extrabold text-[#1c5c32] text-[10px] uppercase">PESAN GITA</span>
          </div>
          <p className="text-[#4a3728] text-[11px] sm:text-xs font-['Nunito'] font-bold leading-tight">
            Terus lestarikan warisan budaya kita dan tingkatkan pemahamanmu!
          </p>
          <div className="absolute -bottom-2 right-6 w-0 h-0 border-t-[8px] border-t-[#e8dcb8] border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent" />
        </motion.div>

        {/* Gita Image & Overlapping Bottom Name Badge */}
        <div className="relative flex flex-col items-center w-full">
          <img
            src="/assets/mascot/Gita-Petunjuk.svg"
            alt="Gita Mascot"
            className="w-40 sm:w-56 md:w-64 lg:w-72 h-auto object-contain filter drop-shadow-2xl"
          />

          {/* Gita Name Badge — Overlapping & Covering Bottom Boundary Line */}
          <div className="bg-[#fcf5e3] border-2 border-[#e5cca0] text-[#7a5316] text-xs sm:text-sm md:text-base font-['Fredoka'] font-extrabold rounded-full px-5 sm:px-7 py-1 shadow-lg absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap">
            Gita
          </div>
        </div>
      </motion.div>

      {/* Bottom Action Navigation Bar */}
      <div className="flex justify-center items-center px-2 py-1 flex-shrink-0 z-50 relative mt-1">
        <button
          onClick={() => { playSFX("click"); onContinue(); }}
          className="bg-gradient-to-b from-[#2a6838] via-[#1c5c32] to-[#144826] hover:from-[#358a4c] hover:to-[#1b572d] border-2 border-[#52ad69] text-white rounded-full px-8 py-2.5 font-['Fredoka'] font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-lg transition-transform active:scale-95 cursor-pointer focus:outline-none"
        >
          <span>Kembali ke Peta Misi</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default MisiSelesaiScreen;
