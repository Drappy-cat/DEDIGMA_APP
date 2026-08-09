import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScreenHeader } from "../components/ScreenHeader";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";
import { fireConfetti } from "../utils/confetti";
import { PRETEST_QUESTIONS } from "../data/pretestQuestions";
import { usePerformance } from "../hooks/usePerformance";

interface PretestScreenProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

export const PretestScreen: React.FC<PretestScreenProps> = ({ onComplete, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const { userName } = useAuth();
  const perf = usePerformance();
  const currentKey = `dedigma_pretest_current_${userName}`;
  const answersKey = `dedigma_pretest_answers_${userName}`;

  const [current, setCurrent] = useState(() => {
    try {
      const saved = localStorage.getItem(currentKey);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [answers, setAnswers] = useState<(number | null)[]>(() => {
    try {
      const saved = localStorage.getItem(answersKey);
      return saved ? JSON.parse(saved) : PRETEST_QUESTIONS.map(() => null);
    } catch {
      return PRETEST_QUESTIONS.map(() => null);
    }
  });

  const [done, setDone] = useState(false);

  useEffect(() => {
    localStorage.setItem(currentKey, current.toString());
    localStorage.setItem(answersKey, JSON.stringify(answers));
  }, [current, answers, currentKey, answersKey]);

  useEffect(() => {
    playNarrator(
      "Selamat datang di Pretest Interaktif DEDIGMA. Jawab pertanyaan awal ini dengan teliti untuk memulai petualanganmu."
    );
    return () => {
      stopNarrator();
    };
  }, []);

  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (answers[current] !== null) return;
    const newAnswers = answers.map((a, i) => (i === current ? idx : a));
    setAnswers(newAnswers);

    const isCorrect = idx === PRETEST_QUESTIONS[current].jawaban;
    if (isCorrect) {
      playSFX("success");
    } else {
      playSFX("fail");
    }

    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    playSFX("click");
    if (current < PRETEST_QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
      setIsAnswered(false);
    } else {
      setDone(true);
      const correctCount = answers.filter((a, i) => a === PRETEST_QUESTIONS[i].jawaban).length;
      const finalScore = Math.round((correctCount / PRETEST_QUESTIONS.length) * 100);

      localStorage.removeItem(currentKey);
      localStorage.removeItem(answersKey);

      fireConfetti();
      playSFX("badge");
      playNarrator(`Luar biasa! Kamu menyelesaikan Pretest dengan skor akhir ${finalScore}. Ketuk tombol di bawah untuk memulai petualanganmu.`);
    }
  };

  const correctCount = answers.filter((a, i) => a === PRETEST_QUESTIONS[i].jawaban).length;
  const score = Math.round((correctCount / PRETEST_QUESTIONS.length) * 100);

  const q = PRETEST_QUESTIONS[current];
  const totalQ = PRETEST_QUESTIONS.length;

  if (done) {
    return (
      <div
        className="h-full min-h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none font-['Nunito'] relative overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{
          backgroundImage: "url('/assets/telaga.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Dark Tint Overlay */}
        <div className={`absolute inset-0 ${perf.showBlurEffects ? 'bg-black/30 backdrop-blur-xs' : 'bg-black/40'} z-0 pointer-events-none`} />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md space-y-4 my-auto py-4">
          
          {/* Top Header Section with Ribbon Medal & Wood Signboard */}
          <div className="flex flex-col items-center relative mb-2 w-full flex-shrink-0">
            {/* Top Gold Ribbon Medal 🎓 */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] border-2 border-[#fff5ce] shadow-2xl flex items-center justify-center text-3xl sm:text-4xl z-20 -mb-6 relative"
            >
              {perf.showContinuousAnimations && <div className="absolute inset-0 rounded-full bg-yellow-400 blur-md opacity-50 animate-pulse" />}
              <span className="relative z-10">🎓</span>
            </motion.div>

            {/* Centered Wooden Header Signboard Banner */}
            <div className="bg-[#6b3c1b] border-2 border-[#4a270f] rounded-2xl px-6 sm:px-10 pt-6 pb-2 text-[#fff5ce] font-['Fredoka'] font-extrabold text-xl sm:text-2xl md:text-3xl uppercase tracking-wider shadow-xl border-b-4 flex items-center justify-center gap-2 relative z-10 w-full text-center">
              <span className="text-base sm:text-lg select-none">🌿</span>
              <span>PRETEST SELESAI!</span>
              <span className="text-base sm:text-lg select-none transform scale-x-[-1]">🌿</span>
            </div>

            {/* Sub-banner Green Capsule Badge */}
            <div className="bg-[#256c3a] border border-[#184826] text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-full px-6 py-1 shadow-md -mt-3.5 z-20">
              Evaluasi Awal DEDIGMA
            </div>
          </div>

          {/* Upper Score Display Parchment Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-3xl p-5 sm:p-7 shadow-2xl text-center space-y-3 relative w-full"
          >
            {/* Section Label */}
            <h4 className="text-[#7a6450] font-['Fredoka'] font-extrabold text-xs sm:text-sm tracking-widest uppercase">
              SKOR AKHIR EVALUASI
            </h4>

            {/* Big Numeric Score Display */}
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="font-['Fredoka'] font-extrabold text-5xl sm:text-6xl text-[#256c3a] drop-shadow-sm">
                {score}
              </span>
              <span className="font-['Fredoka'] font-bold text-lg sm:text-xl text-[#59432e]">
                / 100
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#7a6450] font-['Nunito'] font-extrabold">
              {correctCount} dari {totalQ} soal dijawab dengan benar
            </p>

            {/* Motivational Feedback Box */}
            <div className="bg-[#eaf4ea] border border-[#c4e0c4] rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 text-left mt-3">
              <span className="text-lg select-none flex-shrink-0 mt-0.5">🍃</span>
              <p className="text-[#235430] text-xs sm:text-sm font-['Nunito'] font-bold leading-relaxed">
                {score >= 85
                  ? "Luar biasa! Pengetahuan awal budayamu sangat cemerlang."
                  : score >= 70
                  ? "Hebat sekali! Siap untuk memulai petualangan misi di DEDIGMA."
                  : "Semangat! Petualangan belajar di DEDIGMA baru saja dimulai."}
              </p>
            </div>
          </motion.div>

          {/* Action Navigation Button */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            onClick={() => onComplete(score)}
            className="w-full bg-gradient-to-b from-[#f5a32b] via-[#e58e1d] to-[#d87c14] hover:from-[#f7ad3d] hover:to-[#e2861a] border-2 border-[#fff5ce] text-white font-['Fredoka'] font-extrabold rounded-full py-3.5 sm:py-4 text-base sm:text-lg shadow-xl transition-transform active:scale-95 cursor-pointer uppercase tracking-wider border-b-4 flex items-center justify-center gap-2"
          >
            <span>Mulai Petualangan Misi</span>
            <span>→</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full flex flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden font-['Nunito'] relative select-none"
      style={{
        backgroundImage: "url('/assets/telaga.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Top Navbar Header (Preserved as requested) */}
      <div className="relative z-30 flex-shrink-0">
        <ScreenHeader title="Pretest DEDIGMA 📝" onBack={onBack} onHome={onBack} />
      </div>

      {/* Sub-Header Progress Bar */}
      <div className="bg-[#fbf7ee]/95 backdrop-blur-xs px-4 py-1.5 border-b border-[#e6d9bd] flex items-center justify-between shadow-xs select-none relative z-20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2a6838] text-[#fff] font-['Fredoka'] font-extrabold flex items-center justify-center text-xs sm:text-sm shadow-xs flex-shrink-0">
            {current + 1}
          </div>
          <span className="font-['Fredoka'] font-extrabold text-xs sm:text-sm text-[#4a3728]">
            Evaluasi: Pertanyaan {current + 1} dari {totalQ}
          </span>
        </div>
        <div className="w-36 sm:w-64 h-2.5 bg-[#e6d9bd] rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#387a48] to-[#256c3a] rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / totalQ) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Body Container: Parchment Board & Bottom Navigation */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-between items-center px-2 sm:px-4 pb-4 pt-0.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Parchment Board Container (Zero Scroll, Full Height, Visible Overflow for Signboard) */}
        <div className="bg-[#fbf7ee] border-2 border-[#e6d9bd] rounded-3xl px-3 sm:px-5 pb-2 sm:pb-4 pt-7 sm:pt-9 md:pt-10 shadow-xl relative flex flex-col justify-between w-full max-w-4xl mx-auto flex-1 min-h-0 mt-5 sm:mt-7 mb-1 overflow-visible">
          
          {/* Centered Top Green Ribbon Banner Signboard */}
          <div className="bg-[#2a6838] border-3 sm:border-4 border-[#1c4d29] text-[#fff5ce] font-['Fredoka'] font-extrabold px-6 sm:px-12 py-1 sm:py-2 rounded-full text-xs sm:text-base md:text-xl flex items-center justify-center gap-2 sm:gap-3 shadow-xl absolute -top-4 sm:-top-5 md:-top-6 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap border-b-4 uppercase tracking-widest">
            <span className="text-xs sm:text-base select-none">🌿</span>
            <span>SOAL EVALUASI</span>
            <span className="text-xs sm:text-base select-none transform scale-x-[-1]">🌿</span>
          </div>

          {/* Decorative Corner Stars */}
          <div className="absolute top-2 left-4 text-amber-400 text-xs sm:text-sm select-none opacity-80 flex gap-0.5">
            <span>⭐</span>
            <span>⭐</span>
          </div>
          <div className="absolute top-2 right-4 text-amber-400 text-xs sm:text-sm select-none opacity-80 flex gap-0.5">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>

          {/* Question Statement Text & Options */}
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex-1 min-h-0 flex flex-col justify-between pt-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Question Statement */}
            <div className="flex-1 min-h-0 flex items-center justify-center my-auto px-2 sm:px-6 py-1.5 sm:py-3">
              <p className="text-[#3a2718] font-['Nunito'] font-extrabold text-xs sm:text-sm md:text-base leading-relaxed text-center">
                {q.soal}
              </p>
            </div>

            {/* 4 Multiple Choice Capsule Option Buttons */}
            <div className="space-y-1.5 sm:space-y-2.5 max-w-3xl mx-auto w-full flex-shrink-0 pb-1">
              {q.opsi.map((o, idx) => {
                const userAns = answers[current];
                const isSelected = userAns === idx;

                let buttonStyle = "bg-[#f5ebd6] border-2 border-[#e8dcb8] text-[#59432e] hover:bg-[#ebdfc4] shadow-xs";
                let badgeStyle = "bg-[#2a6838] text-white";

                if (userAns !== null) {
                  if (isSelected) {
                    if (idx === q.jawaban) {
                      buttonStyle = "bg-gradient-to-r from-[#387a48] to-[#295c34] text-white border-[#52ad69] shadow-md scale-[1.01]";
                      badgeStyle = "bg-white text-[#2a6838]";
                    } else {
                      buttonStyle = "bg-gradient-to-r from-[#d44333] to-[#b83223] text-white border-[#7a1c12] shadow-md";
                      badgeStyle = "bg-white text-[#d44333]";
                    }
                  } else if (idx === q.jawaban) {
                    buttonStyle = "bg-gradient-to-r from-[#387a48] to-[#295c34] text-white border-[#52ad69] opacity-90";
                    badgeStyle = "bg-white text-[#2a6838]";
                  } else {
                    buttonStyle = "bg-[#e8dbbd] border-2 border-[#d9cbb0] text-[#786550] opacity-50";
                    badgeStyle = "bg-[#786550] text-white";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    disabled={answers[current] !== null}
                    className={`w-full text-left rounded-full p-2 sm:p-2.5 flex items-center gap-3 transition-all cursor-pointer select-none ${buttonStyle}`}
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-['Fredoka'] font-extrabold flex items-center justify-center text-xs sm:text-sm flex-shrink-0 shadow-xs ${badgeStyle}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-['Nunito'] font-extrabold text-xs sm:text-sm leading-tight flex-1 pr-2">
                      {o}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Capsule Navigation Bar */}
        <div className="bg-[#2a6838] border-2 border-[#1c4d29] rounded-full p-1.5 sm:p-2 flex items-center justify-between shadow-lg w-full max-w-4xl mx-auto z-40 flex-shrink-0 mt-1">
          {/* Kembali Button */}
          <button
            type="button"
            onClick={() => {
              playSFX("click");
              if (current > 0) {
                setCurrent((c) => c - 1);
              } else if (onBack) {
                onBack();
              }
            }}
            className="bg-[#fbf7ee] border border-[#e5dabf] text-[#59432e] hover:bg-[#f5ebd6] font-['Fredoka'] font-extrabold rounded-full px-4 sm:px-5 py-1 sm:py-1.5 flex items-center gap-1.5 text-xs sm:text-sm shadow-xs active:scale-95 cursor-pointer"
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#59432e] text-white flex items-center justify-center text-xs">
              ←
            </div>
            <span>Kembali</span>
          </button>

          {/* Center Progress Dots Indicator */}
          <div className="flex items-center gap-1.5 justify-center max-w-[200px] overflow-hidden px-2">
            {PRETEST_QUESTIONS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                  idx === current
                    ? "bg-white scale-125 shadow-xs ring-2 ring-white/50"
                    : answers[idx] !== null
                    ? "bg-white/70"
                    : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Selanjutnya Button */}
          <button
            type="button"
            onClick={handleNextQuestion}
            disabled={answers[current] === null}
            className={`font-['Fredoka'] font-extrabold rounded-full px-5 sm:px-7 py-1.5 sm:py-2 flex items-center gap-2 text-xs sm:text-sm shadow-xs active:scale-95 transition-all border ${
              answers[current] !== null
                ? "bg-[#489458] hover:bg-[#52ad69] border-[#76c287] text-white cursor-pointer opacity-100"
                : "bg-white/20 border-white/30 text-white/50 cursor-not-allowed opacity-60"
            }`}
          >
            <span>{current < totalQ - 1 ? "Selanjutnya" : "Selesai 🎉"}</span>
            <div className="w-5 h-5 rounded-full bg-white/30 text-white flex items-center justify-center text-xs">
              →
            </div>
          </button>
        </div>
      </div>

      {/* Modal Feedback Popup */}
      <AnimatePresence>
        {isAnswered && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-3xl p-6 sm:p-8 w-[95%] max-w-lg shadow-2xl flex flex-col relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm border-2 ${
                  answers[current] === q.jawaban ? 'bg-[#eaf4ea] border-[#256c3a]' : 'bg-[#fdf2f0] border-[#d44333]'
                }`}>
                  {answers[current] === q.jawaban ? '✅' : '❌'}
                </div>
                <div>
                  <h3 className={`font-['Fredoka'] font-extrabold text-xl drop-shadow-sm ${
                    answers[current] === q.jawaban ? 'text-[#1c5c32]' : 'text-[#d44333]'
                  }`}>
                    {answers[current] === q.jawaban ? 'Tepat Sekali!' : 'Kurang Tepat!'}
                  </h3>
                  <p className="text-[#59432e] text-xs font-extrabold tracking-wider">PEMBAHASAN</p>
                </div>
              </div>
              
              <div className="bg-[#fcfaf5] rounded-2xl p-4 border border-[#e2d6b9] mb-6 max-h-48 overflow-y-auto shadow-inner">
                <p className="text-[#3a2718] text-sm leading-relaxed font-semibold">
                  {q.pembahasan || 'Jawaban telah direkam.'}
                </p>
              </div>
              
              <button
                onClick={() => {
                  playSFX("click");
                  setIsAnswered(false);
                }}
                className="w-full bg-gradient-to-r from-[#2a6838] to-[#1c5c32] hover:from-[#358a4c] hover:to-[#226839] border-2 border-[#52ad69] text-white rounded-full py-3.5 text-base font-['Fredoka'] font-extrabold shadow-lg cursor-pointer transition-transform active:scale-95"
              >
                Okay
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PretestScreen;
