import React from "react";
import { motion } from "motion/react";
import { Mission } from "../../types";
import { Btn } from "../../components/Btn";

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
  return (
    <div className="flex flex-col h-full items-center justify-center p-6 text-center gap-5 bg-gradient-to-b from-yellow-50 to-amber-50 font-['Nunito'] select-none">
      {/* Animated badge */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-8xl filter drop-shadow-lg"
      >
        🏅
      </motion.div>

      <div>
        <h2 className="font-['Fredoka'] font-bold text-3xl text-amber-700 leading-tight">Misi Selesai!</h2>
        <p className="font-['Fredoka'] text-blue-600 text-xl font-semibold mt-1">{mission.name}</p>
      </div>

      {/* Average Score display */}
      <div className="bg-white rounded-3xl shadow-lg p-5 w-full max-w-xs border border-amber-200/50">
        <p className="text-gray-500 text-xs font-semibold mb-1">Rata-rata Skor Aktivitas</p>
        <p className="font-['Fredoka'] font-bold text-5xl text-amber-500 leading-none">{totalScore}</p>
        <p className="text-gray-400 text-[10px] font-bold mt-1.5 uppercase">dari 100 poin</p>

        <div className="mt-3.5 bg-amber-100/70 border border-amber-200/40 rounded-xl p-2.5">
          <p className="text-amber-800 text-[11px] font-bold leading-relaxed">
            {totalScore >= 85
              ? "🌟 Luar biasa! Kamu Detektif Budaya sejati yang sangat cerdas!"
              : totalScore >= 70
              ? "⭐ Hebat! Kamu memahami materi ini dengan baik. Teruskan!"
              : "💪 Tidak apa-apa! Setiap petualangan membuatmu lebih bijak."}
          </p>
        </div>
      </div>

      {/* Earned Badge Detail */}
      <div className="bg-amber-100/60 border border-amber-200/60 rounded-2xl p-4 w-full max-w-xs flex items-center gap-3">
        <span className="text-4xl filter drop-shadow">🏅</span>
        <div className="text-left">
          <p className="font-['Fredoka'] font-bold text-amber-900 text-sm">Penjelajah Budaya</p>
          <p className="text-amber-700 text-xs font-semibold">Telah Menyelesaikan Misi {mission.id}</p>
        </div>
      </div>

      {/* Action button */}
      <Btn onClick={onContinue} variant="kembali" />
    </div>
  );
};
export default MisiSelesaiScreen;
