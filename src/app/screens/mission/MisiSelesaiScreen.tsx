import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Mission } from "../../types";
import { useAudio } from "../../contexts/AudioContext";
import { fireConfetti } from "../../utils/confetti";

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
    fireConfetti();
    playSFX("badge");
    playNarrator(`Selamat! Kamu telah menyelesaikan Misi ${mission.id} dengan skor ${totalScore}!`);
  }, []);

  return (
    <div 
      className="flex flex-col h-full items-center justify-center p-4 sm:p-6 text-center font-['Nunito'] select-none relative overflow-hidden rounded-[1.25rem]"
      style={{
        backgroundImage: "url('/assets/bg-login.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      
      {/* Light Rays Background Effect */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] sm:w-[800px] sm:h-[800px] pointer-events-none opacity-20"
        style={{
          background: "repeating-conic-gradient(from 0deg, transparent 0deg 15deg, #f59e0b 15deg 30deg)",
          maskImage: "radial-gradient(circle, black 20%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 60%)",
        }}
      />

      {/* Mascots Celebrating */}
      <motion.img 
        src="/assets/mascot/dimas-peta.svg" 
        alt="Dimas"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1, y: [0, -10, 0] }}
        transition={{ x: { duration: 0.8 }, opacity: { duration: 0.8 }, y: { duration: 2, repeat: Infinity } }}
        className="absolute bottom-4 -left-6 sm:left-4 w-24 sm:w-36 h-auto drop-shadow-xl z-20 pointer-events-none"
      />
      <motion.img 
        src="/assets/mascot/gita-peta.svg" 
        alt="Gita"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1, y: [0, -12, 0] }}
        transition={{ x: { duration: 0.8 }, opacity: { duration: 0.8 }, y: { duration: 2.2, repeat: Infinity, delay: 0.3 } }}
        className="absolute bottom-4 -right-6 sm:right-4 w-24 sm:w-36 h-auto drop-shadow-xl z-20 pointer-events-none"
      />

      <div className="relative z-30 flex flex-col items-center gap-4 sm:gap-5 w-full max-w-md">
        {/* Animated badge */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative text-7xl sm:text-8xl filter drop-shadow-2xl"
        >
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <span className="relative z-10">🏅</span>
        </motion.div>

        <div>
          <h2 className="font-['Fredoka'] font-extrabold text-3xl sm:text-4xl text-amber-800 leading-tight drop-shadow-sm uppercase tracking-wide">
            Misi Selesai! 🎉
          </h2>
          <p className="font-['Fredoka'] text-[#366635] text-lg sm:text-xl font-bold mt-1 bg-white/50 px-4 py-1 rounded-full inline-block border-2 border-[#366635]/20 shadow-sm">
            {mission.name}
          </p>
        </div>

        {/* Average Score display */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] p-4 sm:p-6 w-full border-2 border-amber-300 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300"></div>
          
          <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Rata-rata Skor Aktivitas</p>
          <div className="flex items-baseline justify-center gap-1">
            <p className="font-['Fredoka'] font-extrabold text-5xl sm:text-6xl text-amber-500 drop-shadow-sm">{totalScore}</p>
            <span className="text-gray-400 text-xs font-bold uppercase">/ 100</span>
          </div>

          <div className={`mt-4 border rounded-xl p-3 sm:p-4 shadow-inner ${
            totalScore >= 85 ? "bg-green-50/80 border-green-200" : 
            totalScore >= 70 ? "bg-amber-50/80 border-amber-200" : 
            "bg-orange-50/80 border-orange-200"
          }`}>
            <p className={`text-xs sm:text-sm font-bold leading-relaxed ${
              totalScore >= 85 ? "text-green-800" : 
              totalScore >= 70 ? "text-amber-800" : 
              "text-orange-800"
            }`}>
              {totalScore >= 85
                ? "🌟 Luar biasa! Kamu Detektif Budaya sejati yang sangat cerdas!"
                : totalScore >= 70
                ? "⭐ Hebat! Kamu memahami materi ini dengan baik. Teruskan!"
                : "💪 Tidak apa-apa! Setiap petualangan membuatmu lebih bijak."}
            </p>
          </div>
        </motion.div>

        {/* Earned Badge Detail */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#c2aa84]/20 border-2 border-[#c2aa84]/50 rounded-2xl p-3 sm:p-4 w-full flex items-center gap-3 sm:gap-4 shadow-inner backdrop-blur-sm"
        >
          <span className="text-3xl sm:text-4xl filter drop-shadow">🏅</span>
          <div className="text-left">
            <p className="font-['Fredoka'] font-bold text-[#5c4a3a] text-sm sm:text-base">Penjelajah Budaya</p>
            <p className="text-[#7e371b] text-[10px] sm:text-xs font-bold uppercase tracking-wide">Telah Menyelesaikan Misi {mission.id}</p>
          </div>
        </motion.div>

        {/* Action button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.7 }}
          onClick={() => { playSFX("click"); onContinue(); }}
          className="mt-2 transition-transform cursor-pointer hover:scale-110 active:scale-95 focus:outline-none"
          aria-label="Kembali ke Peta"
        >
          <img src="/assets/button/home.svg" alt="Kembali ke Peta" className="w-16 sm:w-20 h-auto object-contain drop-shadow-xl" />
        </motion.button>
      </div>
    </div>
  );
};
export default MisiSelesaiScreen;
