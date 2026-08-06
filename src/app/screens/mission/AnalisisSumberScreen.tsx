import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, AlertTriangle, BookOpen, X, Lightbulb } from "lucide-react";
import { Mission } from "../../types";
import { useAudio } from "../../contexts/AudioContext";

interface AnalisisSumberScreenProps {
  mission: Mission;
  onNext: (score: number) => void;
  onBack?: () => void;
}

export const AnalisisSumberScreen: React.FC<AnalisisSumberScreenProps> = ({ mission, onNext, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [answers, setAnswers] = useState<Record<number, boolean | null>>(
    Object.fromEntries(mission.sumberAnalisis.map((_, i) => [i, null]))
  );
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    playNarrator(
      `Misi Analisis Sumber Informasi. Evaluasi kredibilitas! Tentukan mana sumber informasi yang TERPERCAYA dan TIDAK TERPERCAYA.`
    );
    return () => {
      stopNarrator();
    };
  }, []);

  const handleSelect = (idx: number, isReliable: boolean) => {
    if (checked) return;
    playSFX("click");
    setAnswers((prev) => ({ ...prev, [idx]: isReliable }));
  };

  const handleCheck = () => {
    setChecked(true);
    const correctCount = mission.sumberAnalisis.filter((s, i) => answers[i] === s.terpercaya).length;
    const finalScore = Math.round((correctCount / mission.sumberAnalisis.length) * 100);

    if (finalScore >= 75) {
      playSFX("success");
      playNarrator(`Luar biasa! Skor analisis sumber kamu ${finalScore}. Kamu sangat pandai mengenali sumber terpercaya!`);
    } else {
      playSFX("fail");
      playNarrator(`Skor kamu ${finalScore}. Selalu utamakan sumber resmi dan akademis ya!`);
    }
  };

  const handleNext = () => {
    const correctCount = mission.sumberAnalisis.filter((s, i) => answers[i] === s.terpercaya).length;
    const finalScore = Math.round((correctCount / mission.sumberAnalisis.length) * 100);
    onNext(finalScore);
  };

  const allAnswered = Object.values(answers).every((a) => a !== null);
  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const totalItems = mission.sumberAnalisis.length;
  const score = checked
    ? Math.round((mission.sumberAnalisis.filter((s, i) => answers[i] === s.terpercaya).length / totalItems) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full font-['Nunito'] justify-between overflow-hidden max-h-full min-h-0 relative p-1 sm:p-2 select-none">
      
      {/* Top Header Section with Green Ribbon Banner */}
      <div className="flex flex-col items-center relative mb-2 flex-shrink-0">
        {/* Top Right Progress Capsule Badge */}
        <div className="absolute top-0 right-0 hidden sm:flex items-center gap-1 bg-[#256c3a] border border-[#184826] text-white rounded-full px-3 py-1 font-['Fredoka'] font-extrabold text-xs shadow-xs">
          <span>{answeredCount} / {totalItems}</span>
        </div>

        {/* Green Ribbon Banner Header matching reference image */}
        <div className="relative flex items-center justify-center mt-1">
          <svg
            className="w-[280px] sm:w-[370px] md:w-[420px] h-[48px] sm:h-[58px] filter drop-shadow-md"
            viewBox="0 0 400 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ribbon Tail Left */}
            <path d="M5 15 L50 15 L50 45 L5 45 L20 30 Z" fill="#1b441c" />
            {/* Ribbon Tail Right */}
            <path d="M395 15 L350 15 L350 45 L395 45 L380 30 Z" fill="#1b441c" />
            {/* Ribbon Fold Left */}
            <path d="M40 45 L50 45 L50 53 Z" fill="#102d11" />
            {/* Ribbon Fold Right */}
            <path d="M360 45 L350 45 L350 53 Z" fill="#102d11" />
            {/* Ribbon Main Body */}
            <rect x="36" y="7" width="328" height="42" rx="8" fill="url(#green_ribbon_grad)" stroke="#4e974c" strokeWidth="2" />
            <defs>
              <linearGradient id="green_ribbon_grad" x1="200" y1="7" x2="200" y2="49" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3c783a" />
                <stop offset="1" stopColor="#225221" />
              </linearGradient>
            </defs>
          </svg>

          {/* Icon & Ribbon Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-white font-['Fredoka'] font-extrabold text-sm sm:text-lg md:text-xl drop-shadow-sm pb-1">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.5]" />
            <span>Analisis Sumber Informasi</span>
          </div>
        </div>

        {/* Sub-instruction Text Paragraph */}
        <p className="text-center text-xs sm:text-sm text-[#4a3728] font-semibold leading-relaxed max-w-xl mx-auto mt-2">
          Evaluasi kredibilitas! Tentukan mana sumber informasi yang{" "}
          <strong className="text-[#256c3a] font-extrabold">TERPERCAYA (kredibel)</strong> dan{" "}
          <strong className="text-[#c83737] font-extrabold">TIDAK TERPERCAYA (kurang valid)</strong>.
        </p>
      </div>

      {/* Main Content Area: Source Items Scrollable Cards */}
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-3 sm:space-y-4 pr-1 pb-24">
        {mission.sumberAnalisis.map((s, i) => {
          const userAnswer = answers[i];
          const isCorrect = checked ? userAnswer === s.terpercaya : null;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-[#fffefc] border-2 rounded-[22px] p-3.5 sm:p-4 shadow-sm flex flex-col gap-2.5 sm:gap-3 transition-all ${
                checked
                  ? isCorrect
                    ? "border-[#256c3a] bg-[#f0f7f2]"
                    : "border-[#c83737] bg-[#fdf2f0]"
                  : userAnswer !== null
                  ? "border-[#256c3a]/60 bg-[#fafcf9]"
                  : "border-[#e8dfcf] hover:border-[#a5d89d]/70"
              }`}
            >
              {/* Top Row: Source Info (Left) + Action Buttons (Right) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                {/* Left Side: Source Icon + Title + Category Pill Badge */}
                <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                  {/* 3D Box Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#f4efe4] border border-[#e3d7c3] flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-2xs">
                    {s.icon || "🏛️"}
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0">
                    <h3 className="font-['Nunito'] font-extrabold text-xs sm:text-sm md:text-base text-[#2c2621] leading-snug">
                      {s.nama}
                    </h3>
                    <div>
                      <span className="bg-[#e7f4e7] text-[#2d682e] text-[10px] sm:text-xs font-['Fredoka'] font-extrabold px-2.5 py-0.5 rounded-md inline-block shadow-2xs">
                        {s.jenis}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: 2 Decision Buttons (Terpercaya vs Tidak Terpercaya) */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                  {/* Terpercaya Button */}
                  <button
                    type="button"
                    onClick={() => handleSelect(i, true)}
                    disabled={checked}
                    className={`flex-1 sm:flex-initial px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-['Fredoka'] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer select-none ${
                      userAnswer === true
                        ? "bg-[#2d682e] text-white border-[#1c471e] shadow-md scale-[1.02]"
                        : "bg-[#f2f9f1] hover:bg-[#e4f3e3] border-[#a5d89d] text-[#2d682e]"
                    }`}
                  >
                    <Check
                      size={16}
                      strokeWidth={3}
                      className={userAnswer === true ? "text-white" : "text-[#2d682e]"}
                    />
                    <span>Terpercaya</span>
                  </button>

                  {/* Tidak Terpercaya Button */}
                  <button
                    type="button"
                    onClick={() => handleSelect(i, false)}
                    disabled={checked}
                    className={`flex-1 sm:flex-initial px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-['Fredoka'] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer select-none ${
                      userAnswer === false
                        ? "bg-[#c83737] text-white border-[#8b2222] shadow-md scale-[1.02]"
                        : "bg-[#fdf0f0] hover:bg-[#fae1e1] border-[#f4b6b6] text-[#b93838]"
                    }`}
                  >
                    <AlertTriangle
                      size={16}
                      strokeWidth={2.5}
                      className={userAnswer === false ? "text-white" : "text-[#b93838]"}
                    />
                    <span>Tidak Terpercaya</span>
                  </button>
                </div>
              </div>

              {/* Feedback Message (shows after clicking Periksa as a clean full-width bottom block) */}
              {checked && (
                <div
                  className={`w-full text-xs sm:text-sm font-bold pt-2 mt-1 border-t border-black/10 select-none flex items-center gap-1.5 ${
                    isCorrect ? "text-[#256c3a]" : "text-[#c83737]"
                  }`}
                >
                  <span>
                    {isCorrect
                      ? "✓ Tepat sekali! Analisis sumber informasi kamu benar."
                      : `✕ Kurang tepat. Sumber ini ${
                          s.terpercaya
                            ? "TERPERCAYA karena diterbitkan oleh lembaga resmi / jurnal akademik valid."
                            : "TIDAK TERPERCAYA karena berasal dari sumber non-resmi atau opini pribadi."
                        }`}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Feedback Results Panel */}
        {checked && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-2xl p-4 text-center border-2 select-none shadow-md ${
              score >= 75
                ? "bg-[#eaf4ed] border-[#256c3a] text-[#1c4827]"
                : "bg-[#fdf4e7] border-[#e69824] text-[#6e4307]"
            }`}
          >
            <p className="font-['Fredoka'] font-extrabold text-xl sm:text-2xl">
              {score >= 75 ? "Luar Biasa! 🎉" : "Tetap Semangat! 💪"}
            </p>
            <p className="text-xs sm:text-sm mt-1 font-semibold">
              Skor analisis sumber: <strong className="font-extrabold">{score} / 100</strong>
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom Action / Navigation Bar */}
      <div className="flex justify-between items-center px-2 py-1 flex-shrink-0 z-30 relative mt-1">
        {onBack ? (
          <button
            onClick={() => {
              playSFX("click");
              onBack();
            }}
            className="bg-gradient-to-b from-[#874119] via-[#753412] to-[#632c0f] hover:from-[#9c4c1e] hover:to-[#733311] border-2 border-[#d98b48] text-white rounded-full px-5 py-1.5 sm:py-2 flex items-center gap-2 font-['Fredoka'] font-extrabold text-xs sm:text-sm shadow-md transition-transform active:scale-95 cursor-pointer focus:outline-none"
            aria-label="Kembali"
          >
            <span>←</span>
            <span>Kembali</span>
          </button>
        ) : (
          <div className="w-20" />
        )}

        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!allAnswered}
            className={`rounded-full px-7 py-2 font-['Fredoka'] font-extrabold text-sm sm:text-base shadow-lg transition-all border-2 ${
              allAnswered
                ? "bg-gradient-to-b from-[#2a6838] via-[#1c5c32] to-[#144826] text-white border-[#52ad69] cursor-pointer hover:scale-105 active:scale-95"
                : "bg-[#ccc3b1] text-[#787163] border-[#a89f8f] cursor-not-allowed opacity-70"
            }`}
          >
            PERIKSA JAWABAN
          </button>
        ) : (
          <button
            onClick={() => {
              playSFX("click");
              handleNext();
            }}
            className="bg-gradient-to-b from-[#fdb813] via-[#f59e0b] to-[#e68a00] hover:from-[#ffc125] hover:to-[#f09300] border-2 border-[#fff5ce] text-white rounded-full px-6 py-2 flex items-center gap-2 font-['Fredoka'] font-extrabold text-sm shadow-md transition-transform active:scale-95 cursor-pointer focus:outline-none"
            aria-label="Lanjut"
          >
            <span>Lanjut</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Dimas Mascot & Hint Dialogue Speech Bubble (Bottom Right Mirrored) */}
      <div className="absolute bottom-14 sm:bottom-16 right-2 sm:right-4 z-50 pointer-events-auto flex flex-row-reverse items-end gap-2.5 sm:gap-3.5 max-w-[92%] sm:max-w-[88%] select-none">
        {/* Interactive Dimas Mascot */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.06, rotate: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            playSFX("click");
            setShowHint((prev) => !prev);
          }}
          className="w-28 sm:w-36 cursor-pointer relative group flex-shrink-0 flex flex-col items-center"
          title="Klik Dimas untuk petunjuk!"
        >
          <img
            src="/assets/mascot/Dimas-Petunjuk.svg"
            alt="Dimas Mascot"
            className="w-full h-auto object-contain filter drop-shadow-2xl transform scale-x-[-1]"
          />

          {/* Bottom Badge: Klik Dimas! */}
          <div className="bg-[#fcf5e3] border-2 border-[#e5cca0] text-[#7a5316] text-[10px] sm:text-[11px] font-['Fredoka'] font-extrabold rounded-full px-2.5 py-0.5 shadow-md absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 whitespace-nowrap group-hover:bg-[#f5e3b8] transition-colors">
            <span className="text-xs">💡</span>
            <span>Klik Dimas!</span>
          </div>
        </motion.div>

        {/* Speech Dialogue Bubble Popup */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-2xl p-3 sm:p-4 shadow-xl relative z-50 max-w-[260px] sm:max-w-[320px] mb-3"
            >
              {/* Right Pointer Tail */}
              <div className="absolute bottom-4 -right-2.5 w-0 h-0 border-t-8 border-t-transparent border-l-[10px] border-l-[#e8dcb8] border-b-8 border-b-transparent" />
              <div className="absolute bottom-4 -right-2 w-0 h-0 border-t-7 border-t-transparent border-l-[9px] border-l-[#fdfcf7] border-b-7 border-b-transparent" />

              {/* Speech Dialogue Header */}
              <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-[#e8dcb8]">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#f3c233] text-[#1c4d29] flex items-center justify-center text-xs">
                    💡
                  </div>
                  <h4 className="font-['Fredoka'] font-extrabold text-[#1c5c32] text-xs uppercase">
                    PETUNJUK DETEKTIF
                  </h4>
                </div>
                <button
                  onClick={() => setShowHint(false)}
                  className="text-[#5c4733] hover:text-[#1c5c32] hover:bg-[#f2e6cb] p-0.5 rounded-full cursor-pointer transition-colors"
                  aria-label="Tutup"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Speech Dialogue Text */}
              <p className="text-[#4a3728] text-xs font-['Nunito'] font-bold leading-relaxed">
                Perhatikan jenis sumbernya! Publikasi pemerintah resmi (.go.id) dan jurnal akademik dapat dipercaya. Blog atau media sosial perseorangan perlu diwaspadai.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalisisSumberScreen;

