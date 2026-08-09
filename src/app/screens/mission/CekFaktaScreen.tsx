import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Lightbulb } from "lucide-react";
import { Mission } from "../../types";
import { useAudio } from "../../contexts/AudioContext";
import { useAuth } from "../../contexts/AuthContext";

interface CekFaktaScreenProps {
  mission: Mission;
  onNext: (score: number) => void;
  onBack?: () => void;
}

export const CekFaktaScreen: React.FC<CekFaktaScreenProps> = ({ mission, onNext, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const { userName } = useAuth();
  const storageKey = `dedigma_mission_${mission.id}_cekfakta_${userName}`;

  const [answers, setAnswers] = useState<Record<number, boolean | null>>(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved).answers;
    return Object.fromEntries(mission.cekFakta.map((_, i) => [i, null]));
  });
  const [checked, setChecked] = useState(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved).checked;
    return false;
  });
  const [showFunFact, setShowFunFact] = useState(false);

  useEffect(() => {
    playNarrator(
      `Aktivitas Cek Fakta Budaya ${mission.name}. Saring informasi digital dengan menentukan BENAR atau KELIRU pada tiap pernyataan!`
    );
    return () => {
      stopNarrator();
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify({ answers, checked }));
  }, [answers, checked, storageKey]);

  const handleSelect = (idx: number, isTrue: boolean) => {
    if (checked) return;
    playSFX("click");
    setAnswers((prev) => ({ ...prev, [idx]: isTrue }));
  };

  const handleCheck = () => {
    setChecked(true);
    const correctCount = mission.cekFakta.filter((f, i) => answers[i] === f.benar).length;
    const finalScore = Math.round((correctCount / mission.cekFakta.length) * 100);

    if (finalScore >= 75) {
      playSFX("success");
      playNarrator(`Hebat! Skor verifikasi fakta kamu ${finalScore}. Kamu sangat teliti dalam menyaring informasi budaya!`);
    } else {
      playSFX("fail");
      playNarrator(`Skor kamu ${finalScore}. Terus asah ketelitianmu ya.`);
    }
  };

  const handleNext = () => {
    const correctCount = mission.cekFakta.filter((f, i) => answers[i] === f.benar).length;
    const finalScore = Math.round((correctCount / mission.cekFakta.length) * 100);
    onNext(finalScore);
  };

  const allAnswered = Object.values(answers).every((a) => a !== null);
  const answeredCount = Object.values(answers).filter((a) => a !== null).length;
  const totalQuestions = mission.cekFakta.length;
  const score = checked
    ? Math.round((mission.cekFakta.filter((f, i) => answers[i] === f.benar).length / totalQuestions) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full font-['Nunito'] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-2 sm:p-4 md:p-6 select-none relative">
      
      {/* Top Header Section */}
      <div className="flex flex-col items-center relative mb-2 flex-shrink-0">
        {/* Top Right Progress Capsule Badge */}
        <div className="absolute top-0 right-0 hidden sm:flex items-center gap-1 bg-[#256c3a] border border-[#184826] text-white rounded-full px-3 py-1 font-['Fredoka'] font-extrabold text-xs shadow-xs">
          <span>{answeredCount} / {totalQuestions}</span>
        </div>

        {/* Centered Wooden Header Signboard Banner */}
        <div className="bg-[#6b3c1b] border-2 border-[#4a270f] rounded-2xl px-6 sm:px-8 py-1.5 text-[#fff5ce] font-['Fredoka'] font-extrabold text-sm sm:text-base md:text-lg uppercase tracking-wider shadow-md border-b-4 flex items-center justify-center gap-2 relative z-10">
          <span className="text-base select-none">🌿</span>
          <span>CEK FAKTA BUDAYA</span>
          <span className="text-base select-none transform scale-x-[-1]">🌿</span>
        </div>

        {/* Sub-instruction Text Paragraph */}
        <p className="text-center text-xs sm:text-sm text-[#4a3728] font-semibold leading-relaxed max-w-xl mx-auto mt-2">
          Saring informasi digital! Tentukan apakah pernyataan berikut tentang <strong className="text-[#1c5c32] font-extrabold">{mission.name}</strong> bernilai <strong className="text-[#256c3a] font-extrabold">BENAR</strong> atau <strong className="text-[#d44333] font-extrabold">KELIRU</strong>.
        </p>
      </div>

      {/* Main Content Area: Question Cards Scrollable List */}
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-3 sm:space-y-4 pr-1 pb-16">
        {mission.cekFakta.map((item, i) => {
          const userAnswer = answers[i];
          const isCorrect = checked ? userAnswer === item.benar : null;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-[#fdfcf7] border rounded-2xl p-4 sm:p-5 shadow-xs relative space-y-3 transition-all ${
                checked
                  ? isCorrect
                    ? "border-[#256c3a] bg-[#f0f7f2]"
                    : "border-[#d44333] bg-[#fdf2f0]"
                  : userAnswer !== null
                  ? "border-[#256c3a]/50"
                  : "border-[#e8dcb8]"
              }`}
            >
              {/* Top Right Leaf Sprig Accent */}
              <div className="absolute top-2.5 right-3 text-base select-none opacity-80">🌿</div>

              {/* Question Statement Text */}
              <p className="text-[#3a2718] font-['Nunito'] font-extrabold text-xs sm:text-sm md:text-base leading-snug pr-5">
                {item.text}
              </p>

              {/* 2 Big Option Buttons: BENAR vs KELIRU */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* BENAR Button */}
                <button
                  type="button"
                  onClick={() => handleSelect(i, true)}
                  disabled={checked}
                  className={`py-2.5 px-4 rounded-xl font-['Fredoka'] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-b-4 select-none ${
                    userAnswer === true
                      ? "bg-gradient-to-b from-[#3a854a] to-[#256c3a] text-white border-[#164724] shadow-md ring-2 ring-[#256c3a] opacity-100 scale-[1.02]"
                      : "bg-[#256c3a]/50 hover:bg-[#256c3a]/75 text-white/90 border-[#1c4d29]/40 opacity-65 hover:opacity-90 shadow-xs"
                  } ${checked && !item.benar && userAnswer !== true ? "opacity-35" : ""}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    userAnswer === true ? "bg-white/30" : "bg-white/20"
                  }`}>
                    <Check size={14} strokeWidth={3} className="text-white" />
                  </div>
                  <span>BENAR</span>
                </button>

                {/* KELIRU Button */}
                <button
                  type="button"
                  onClick={() => handleSelect(i, false)}
                  disabled={checked}
                  className={`py-2.5 px-4 rounded-xl font-['Fredoka'] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-b-4 select-none ${
                    userAnswer === false
                      ? "bg-gradient-to-b from-[#d44333] to-[#b83223] text-white border-[#7a1c12] shadow-md ring-2 ring-[#b83223] opacity-100 scale-[1.02]"
                      : "bg-[#d44333]/50 hover:bg-[#d44333]/75 text-white/90 border-[#8c2419]/40 opacity-65 hover:opacity-90 shadow-xs"
                  } ${checked && item.benar && userAnswer !== false ? "opacity-35" : ""}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    userAnswer === false ? "bg-white/30" : "bg-white/20"
                  }`}>
                    <X size={14} strokeWidth={3} className="text-white" />
                  </div>
                  <span>KELIRU</span>
                </button>
              </div>

              {/* Feedback text after checking */}
              {checked && (
                <div
                  className={`text-xs font-bold pt-1 flex items-center gap-1.5 select-none ${
                    isCorrect ? "text-[#256c3a]" : "text-[#d44333]"
                  }`}
                >
                  <span>{isCorrect ? "✓ Bagus! Verifikasi fakta kamu tepat." : `✕ Kurang tepat. Informasi ini bernilai ${item.benar ? "BENAR" : "KELIRU"}.`}</span>
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
              Skor verifikasi fakta: <strong className="font-extrabold">{score} / 100</strong>
            </p>
          </motion.div>
        )}
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
            onClick={() => { playSFX("click"); handleNext(); }}
            className="bg-gradient-to-b from-[#fdb813] via-[#f59e0b] to-[#e68a00] hover:from-[#ffc125] hover:to-[#f09300] border-2 border-[#fff5ce] text-white rounded-full px-6 py-2 flex items-center gap-2 font-['Fredoka'] font-extrabold text-sm shadow-md transition-transform active:scale-95 cursor-pointer focus:outline-none"
            aria-label="Lanjut"
          >
            <span>Lanjut</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Fixed Top-Layer Dimas Mascot & Dialogue Speech Bubble (Bottom Right Mirrored) */}
      <div className="absolute bottom-14 sm:bottom-16 right-2 sm:right-4 z-50 pointer-events-auto flex flex-row-reverse items-end gap-2.5 sm:gap-3.5 max-w-[92%] sm:max-w-[88%] select-none">
        {/* Interactive Dimas Mascot */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.06, rotate: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            playSFX("click");
            setShowFunFact((prev) => !prev);
          }}
          className="w-28 sm:w-36 cursor-pointer relative group flex-shrink-0 flex flex-col items-center"
          title="Klik Dimas untuk petunjuk!"
        >
          <img
            src="/assets/mascot/Dimas-Petunjuk.svg"
            alt="Dimas Mascot"
            className="w-full h-auto object-contain filter drop-shadow-2xl transform scale-x-[-1]"
          />

          {/* Bottom Coverage Badge: Klik Dimas! */}
          <div className="bg-[#fcf5e3] border-2 border-[#e5cca0] text-[#7a5316] text-[10px] sm:text-[11px] font-['Fredoka'] font-extrabold rounded-full px-2.5 py-0.5 shadow-md absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 whitespace-nowrap group-hover:bg-[#f5e3b8] transition-colors">
            <span className="text-xs">💡</span>
            <span>Klik Dimas!</span>
          </div>
        </motion.div>

        {/* Dimas Speech Dialogue Bubble Popup */}
        <AnimatePresence>
          {showFunFact && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-2xl p-3 sm:p-4 shadow-xl relative z-50 max-w-[260px] sm:max-w-[320px] mb-3"
            >
              {/* Right Pointer Tail pointing to Dimas */}
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
                  onClick={() => setShowFunFact(false)}
                  className="text-[#5c4733] hover:text-[#1c5c32] hover:bg-[#f2e6cb] p-0.5 rounded-full cursor-pointer transition-colors"
                  aria-label="Tutup"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Speech Dialogue Text */}
              <p className="text-[#4a3728] text-xs font-['Nunito'] font-bold leading-relaxed">
                Teliti kembali setiap berita! Informasi hoax biasanya provokatif dan tidak sesuai adat budaya setempat.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CekFaktaScreen;
