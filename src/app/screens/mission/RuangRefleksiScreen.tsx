import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lightbulb } from "lucide-react";
import { Mission } from "../../types";
import { useAudio } from "../../contexts/AudioContext";
import { useAuth } from "../../contexts/AuthContext";

interface RuangRefleksiScreenProps {
  mission: Mission;
  onNext: (reflectionText?: string) => void;
  onBack?: () => void;
}

export const RuangRefleksiScreen: React.FC<RuangRefleksiScreenProps> = ({ mission, onNext, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const { userName } = useAuth();
  const storageKey = `dedigma_mission_${mission.id}_refleksi_${userName}`;

  const [answers, setAnswers] = useState<string[]>(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved).answers;
    return mission.refleksiPertanyaan.map(() => "");
  });
  
  const [isSubmitted, setIsSubmitted] = useState(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved).isSubmitted;
    return false;
  });

  useEffect(() => {
    playNarrator(
      `Ruang Refleksi. Tuliskan pendapat atau perasaanmu setelah mempelajari tradisi ${mission.name}. Tulis minimal 5 huruf ya.`
    );
    return () => {
      stopNarrator();
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify({ answers, isSubmitted }));
  }, [answers, isSubmitted, storageKey]);

  const handleNext = () => {
    playSFX("click");
    if (!isSubmitted) {
      setIsSubmitted(true);
    }
    const formattedReflection = answers.map((ans, idx) => `Q${idx + 1}: ${ans.trim()}`).join(" | ");
    onNext(formattedReflection);
  };

  const canContinue = isSubmitted || answers.every((a) => a.trim().length >= 5);

  return (
    <div className="flex flex-col h-full font-['Nunito'] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-2 sm:p-4 md:p-6 select-none relative">
      
      {/* Scrollable Container for Content */}
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-3 sm:space-y-4 pr-1 pb-16">
        
        {/* Header Title with Green Lightbulb Icon */}
        <div className="flex items-start gap-2.5 mb-1 flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#256c3a]/15 text-[#1c5c32] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-['Fredoka'] font-extrabold text-xl sm:text-2xl text-[#1c5c32] leading-tight">
              Ruang Refleksi Budaya
            </h2>
            <p className="text-xs sm:text-sm text-[#594735] font-semibold leading-relaxed">
              Renungkan nilai tradisi! Tuliskan hasil pemikiranmu secara jujur setelah mempelajari tradisi <span className="font-extrabold text-[#1c5c32]">{mission.name}</span>.
            </p>
          </div>
        </div>

        {/* Mascot Gita & Speech Dialogue Bubble */}
        <div className="flex items-start gap-3 my-2 sm:my-3 flex-shrink-0">
          {/* Gita Avatar Container */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f5ebd6] border-2 border-[#e8dcb8] shadow-xs overflow-hidden flex items-center justify-center relative p-1">
              <img
                src="/assets/mascot/Gita-Refleksi.svg"
                alt="Gita Mascot"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            {/* Gita Name Badge */}
            <div className="bg-[#fdfcf7] border border-[#e8dcb8] text-[#59432e] font-['Fredoka'] font-extrabold text-[11px] rounded-full px-3 py-0.5 shadow-xs -mt-2.5 z-10">
              Gita
            </div>
          </div>

          {/* Speech Dialogue Bubble */}
          <div className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-2xl p-3.5 sm:p-4 shadow-xs flex-1 relative mt-1">
            {/* Left Pointer Tail */}
            <div className="absolute top-4 -left-2.5 w-0 h-0 border-t-8 border-t-transparent border-r-[10px] border-r-[#e8dcb8] border-b-8 border-b-transparent" />
            <div className="absolute top-4 -left-2 w-0 h-0 border-t-7 border-t-transparent border-r-[9px] border-r-[#fdfcf7] border-b-7 border-b-transparent" />

            <p className="text-[#4a3728] text-xs sm:text-sm font-['Nunito'] font-bold leading-relaxed">
              Hai! Aku Gita. Sekarang saatnya menuliskan pemikiranmu. Tidak ada jawaban salah, tulis apa saja yang kamu rasakan tentang warisan budaya kita! 🌸
            </p>
          </div>
        </div>

        {/* Reflection Questions List */}
        {mission.refleksiPertanyaan.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#fdfcf7] border border-[#e8dcb8] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3 relative"
          >
            {/* Question Title Header with Green Circular Number Badge */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#256c3a] text-white font-['Fredoka'] font-extrabold text-sm sm:text-base flex items-center justify-center flex-shrink-0 shadow-xs">
                {i + 1}
              </div>
              <h3 className="font-['Fredoka'] font-extrabold text-[#1c5c32] text-sm sm:text-base md:text-lg leading-snug">
                {q}
              </h3>
            </div>

            {/* Textarea Input Container */}
            <div className="relative">
              <textarea
                value={answers[i] || ""}
                onChange={(e) => {
                  if (isSubmitted) return;
                  const val = e.target.value.slice(0, 300);
                  setAnswers((prev) => prev.map((a, j) => (j === i ? val : a)));
                }}
                disabled={isSubmitted}
                placeholder={isSubmitted ? "" : "Tuliskan pemikiran atau tanggapanmu di sini..."}
                className={`w-full border border-[#e2d6b9] focus:bg-white rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm font-['Nunito'] font-semibold leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#256c3a]/30 resize-none transition-all min-h-[120px] sm:min-h-[150px] ${
                  isSubmitted ? "bg-[#e8e4db] text-[#595349] cursor-not-allowed opacity-80" : "bg-[#fcfaf5]/80 focus:border-[#256c3a] text-[#3a2718]"
                }`}
              />
              {/* Character Counter */}
              <div className="absolute bottom-3 right-4 text-[11px] sm:text-xs font-semibold text-[#a89d88] pointer-events-none select-none">
                {(answers[i] || "").length}/300
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Action / Navigation Bar */}
      <div className="flex justify-between items-center px-2 py-1 flex-shrink-0 z-30 relative mt-1">
        {onBack ? (
          <button
            onClick={() => { playSFX("click"); onBack(); }}
            className="bg-gradient-to-b from-[#874119] via-[#753412] to-[#632c0f] hover:from-[#9c4c1e] hover:to-[#733311] border-2 border-[#d98b48] text-white rounded-full px-5 py-1.5 sm:py-2 flex items-center gap-2 font-['Fredoka'] font-extrabold text-xs sm:text-sm shadow-md transition-transform active:scale-95 cursor-pointer focus:outline-none"
            aria-label="Kembali"
          >
            <span>←</span>
            <span>Kembali</span>
          </button>
        ) : (
          <div className="w-20" />
        )}

        <button
          onClick={() => { playSFX("click"); handleNext(); }}
          disabled={!canContinue}
          className={`rounded-full px-6 py-2 flex items-center gap-2 font-['Fredoka'] font-extrabold text-sm shadow-lg transition-all border-2 ${
            canContinue
              ? "bg-gradient-to-b from-[#fdb813] via-[#f59e0b] to-[#e68a00] hover:from-[#ffc125] hover:to-[#f09300] text-white border-[#fff5ce] cursor-pointer hover:scale-105 active:scale-95"
              : "bg-[#ccc3b1] text-[#787163] border-[#a89f8f] cursor-not-allowed opacity-70"
          }`}
        >
          <span>{isSubmitted ? "Lanjut" : "Kirim Refleksi"}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default RuangRefleksiScreen;
