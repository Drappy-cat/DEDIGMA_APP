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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] sm:w-[800px] sm:h-[800px] pointer-events-none opacity-40"
        style={{
          background: "repeating-conic-gradient(from 0deg, transparent 0deg 15deg, rgba(255, 255, 255, 0.15) 15deg 30deg)",
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
        className="absolute bottom-0 -left-6 sm:left-4 w-40 sm:w-56 md:w-72 lg:w-80 max-h-[28vh] sm:max-h-[35vh] md:max-h-[45vh] h-auto object-contain drop-shadow-xl z-20 pointer-events-none origin-bottom"
      />
      <motion.img 
        src="/assets/mascot/gita-peta.svg" 
        alt="Gita"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1, y: [0, -12, 0] }}
        transition={{ x: { duration: 0.8 }, opacity: { duration: 0.8 }, y: { duration: 2.2, repeat: Infinity, delay: 0.3 } }}
        className="absolute bottom-0 -right-6 sm:right-4 w-36 sm:w-52 md:w-64 lg:w-72 max-h-[25vh] sm:max-h-[32vh] md:max-h-[40vh] h-auto object-contain drop-shadow-xl z-20 pointer-events-none origin-bottom"
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
          <h2 className="font-['Fredoka'] font-extrabold text-3xl sm:text-4xl text-amber-300 leading-tight drop-shadow-lg uppercase tracking-wide">
            Misi Selesai! 🎉
          </h2>
          <p className="font-['Fredoka'] text-[#366635] text-lg sm:text-xl font-bold mt-2 bg-white/90 px-5 py-1.5 rounded-full inline-block border-2 border-[#366635]/20 shadow-sm">
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
          className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 w-full flex items-center gap-3 sm:gap-4 shadow-lg"
        >
          <span className="text-3xl sm:text-4xl filter drop-shadow">🏅</span>
          <div className="text-left">
            <p className="font-['Fredoka'] font-bold text-white text-sm sm:text-base drop-shadow-sm">Penjelajah Budaya</p>
            <p className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-wide">Telah Menyelesaikan Misi {mission.id}</p>
          </div>
        </motion.div>

        {/* Action button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.7 }}
          onClick={() => { playSFX("click"); onContinue(); }}
          className="mt-4 flex items-center justify-center gap-3 bg-gradient-to-b from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-600 active:scale-95 px-8 py-3.5 rounded-full shadow-xl border-4 border-white transition-all focus:outline-none"
        >
          <img src="/assets/button/home.svg" alt="Home" className="w-8 sm:w-10 h-auto object-contain drop-shadow-md" />
          <span className="font-['Fredoka'] font-bold text-white text-lg sm:text-xl drop-shadow-md">Kembali ke Peta</span>
        </motion.button>
      </div>
    </div>
  );
};
export default MisiSelesaiScreen;
