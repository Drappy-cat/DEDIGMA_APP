import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, ArrowDown, Inbox } from "lucide-react";
import { Mission } from "../../types";
import { useAudio } from "../../contexts/AudioContext";

interface DetektifBeritaScreenProps {
  mission: Mission;
  onNext: (score: number) => void;
  onBack?: () => void;
}

export const DetektifBeritaScreen: React.FC<DetektifBeritaScreenProps> = ({ mission, onNext, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [answers, setAnswers] = useState<Record<number, boolean | null>>(
    Object.fromEntries(mission.beritaItems.map((_, i) => [i, null]))
  );
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(0);
  const [checked, setChecked] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState<"fakta" | "hoaks" | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    playNarrator(
      `Misi Detektif Berita Budaya. Klasifikasikan berita! Seret atau ketuk tombol pada berita untuk memasukkannya ke kolom FAKTA atau HOAKS.`
    );
    return () => {
      stopNarrator();
    };
  }, []);

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    if (checked) return;
    e.dataTransfer.setData("text/plain", String(idx));
    setActiveCardIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent, column: "fakta" | "hoaks") => {
    e.preventDefault();
    if (checked) return;
    setDragOverColumn(column);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, column: "fakta" | "hoaks") => {
    e.preventDefault();
    setDragOverColumn(null);
    if (checked) return;

    const idx = Number(e.dataTransfer.getData("text/plain"));
    if (isNaN(idx)) return;

    setAnswers((prev) => ({ ...prev, [idx]: column === "fakta" }));
    playSFX("click");
    findNextActiveCard(idx);
  };

  const moveCard = (idx: number, isFakta: boolean) => {
    if (checked) return;
    playSFX("click");
    setAnswers((prev) => ({ ...prev, [idx]: isFakta }));
    findNextActiveCard(idx);
  };

  const findNextActiveCard = (currentIdx: number) => {
    const nextIdx = mission.beritaItems.findIndex(
      (item, i) => i > currentIdx && answers[i] === null
    );

    if (nextIdx !== -1) {
      setActiveCardIndex(nextIdx);
    } else {
      const remainingIdx = mission.beritaItems.findIndex((_, i) => answers[i] === null && i !== currentIdx);
      setActiveCardIndex(remainingIdx !== -1 ? remainingIdx : null);
    }
  };

  const handleCheck = () => {
    setChecked(true);
    const correctCount = mission.beritaItems.filter((b, i) => answers[i] === b.isFakta).length;
    const finalScore = Math.round((correctCount / mission.beritaItems.length) * 100);

    if (finalScore >= 75) {
      playSFX("success");
      playNarrator(`Hebat! Skor klasifikasi berita kamu ${finalScore}. Kamu adalah Detektif Berita yang handal!`);
    } else {
      playSFX("fail");
      playNarrator(`Skor kamu ${finalScore}. Terus berlatih agar tidak mudah terkecoh berita hoaks.`);
    }
  };

  const handleNext = () => {
    const correctCount = mission.beritaItems.filter((b, i) => answers[i] === b.isFakta).length;
    const finalScore = Math.round((correctCount / mission.beritaItems.length) * 100);
    onNext(finalScore);
  };

  const allAnswered = Object.values(answers).every((a) => a !== null);
  const classifiedCount = Object.values(answers).filter((a) => a !== null).length;
  const totalBerita = mission.beritaItems.length;
  const score = checked
    ? Math.round((mission.beritaItems.filter((b, i) => answers[i] === b.isFakta).length / totalBerita) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full font-['Nunito'] justify-between overflow-hidden max-h-full min-h-0 relative p-1 sm:p-2 select-none">
      
      {/* Header Section matching reference image */}
      <div className="flex flex-col items-center text-center relative mb-2 flex-shrink-0">
        {/* Progress Badge */}
        <div className="absolute top-0 right-0 hidden sm:flex items-center gap-1 bg-[#256c3a] border border-[#184826] text-white rounded-full px-3 py-1 font-['Fredoka'] font-extrabold text-xs shadow-xs">
          <span>{classifiedCount} / {totalBerita}</span>
        </div>

        {/* Title Header */}
        <h2 className="font-['Fredoka'] font-extrabold text-lg sm:text-xl md:text-2xl text-[#255224] flex items-center justify-center gap-2">
          <span>🕵️</span>
          <span>Detektif Berita Budaya</span>
        </h2>

        {/* Subtitle Paragraph */}
        <p className="text-xs sm:text-sm text-[#4a3728] font-semibold leading-relaxed max-w-xl mx-auto mt-1">
          Klasifikasikan berita! Seret (drag & drop) atau ketuk tombol pada berita untuk memasukkannya ke kolom <strong className="text-[#256c3a]">FAKTA</strong> atau <strong className="text-[#be342d]">HOAKS</strong>.
        </p>
      </div>

      {/* Main Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-3 sm:space-y-4 pr-1 pb-24">
        
        {/* Active Pending News Card Box ("Pindahkan kartu berita ini") */}
        {!checked && activeCardIndex !== null && activeCardIndex !== -1 ? (
          <div className="bg-[#fcf7ee] border-2 border-dashed border-[#e6d6ba] rounded-3xl p-3.5 sm:p-4 flex flex-col items-center gap-3 shadow-xs relative">
            {/* Top Pill Badge */}
            <div className="bg-[#f8ebd7] border border-[#e2cca4] text-[#7a5a2b] text-xs font-['Fredoka'] font-extrabold px-4 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
              <span>👆</span>
              <span>Pindahkan kartu berita ini</span>
            </div>

            {/* Draggable Active News Card */}
            <motion.div
              draggable
              onDragStart={(e) => handleDragStart(e, activeCardIndex)}
              className="bg-white border-2 border-[#e8dfcf] hover:border-[#a5d89d] rounded-2xl p-4 sm:p-5 shadow-lg w-full max-w-lg cursor-grab active:cursor-grabbing flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 select-none transform-gpu"
              whileHover={{ scale: 1.01 }}
              whileDrag={{ scale: 1.03, rotate: 3 }}
              layout
            >
              {/* Document Blue Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#eaf2fd] border border-[#c4dafa] flex items-center justify-center text-2xl flex-shrink-0 shadow-2xs">
                📄
              </div>

              <div className="flex flex-col gap-3 flex-1 min-w-0 text-center sm:text-left">
                <p className="font-['Nunito'] font-extrabold text-sm sm:text-base text-[#28324a] leading-snug">
                  “{mission.beritaItems[activeCardIndex].judul}”
                </p>

                {/* 2 Action Buttons */}
                <div className="flex items-center gap-2.5 w-full">
                  <button
                    type="button"
                    onClick={() => moveCard(activeCardIndex, true)}
                    className="flex-1 bg-[#387a3e] hover:bg-[#2d682e] active:scale-95 text-white font-['Fredoka'] font-extrabold rounded-xl py-2 px-3 text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm border border-[#255224] transition-all cursor-pointer"
                  >
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <Check size={12} strokeWidth={3} className="text-white" />
                    </div>
                    <span>Pindahkan ke Fakta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => moveCard(activeCardIndex, false)}
                    className="flex-1 bg-[#be342d] hover:bg-[#a62b25] active:scale-95 text-white font-['Fredoka'] font-extrabold rounded-xl py-2 px-3 text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm border border-[#8b2222] transition-all cursor-pointer"
                  >
                    <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                      <X size={12} strokeWidth={3} className="text-white" />
                    </div>
                    <span>Pindahkan ke Hoaks</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : !checked ? (
          <div className="bg-[#eaf4ed] border-2 border-[#a5d89d] rounded-2xl p-3.5 text-center text-[#256c3a] font-['Fredoka'] font-extrabold text-xs sm:text-sm shadow-xs">
            🎉 Semua kartu berita telah diklasifikasikan! Klik PERIKSA JAWABAN di bawah untuk melihat hasil.
          </div>
        ) : null}

        {/* 2 Target Drop Columns: KOLOM FAKTA vs KOLOM HOAKS */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          
          {/* KOLOM FAKTA */}
          <div
            onDragOver={(e) => handleDragOver(e, "fakta")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "fakta")}
            className={`rounded-2xl p-3 sm:p-4 border-2 transition-all flex flex-col justify-between min-h-[220px] shadow-xs relative ${
              dragOverColumn === "fakta"
                ? "bg-[#e2f3e4] border-[#256c3a] scale-[1.02] ring-4 ring-[#256c3a]/30 shadow-md"
                : "bg-[#edf6ee] border-[#b8e0bc]"
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-center gap-1.5 text-[#2e6e34] font-['Fredoka'] font-extrabold text-xs sm:text-sm border-b border-[#c2e8c6] pb-1.5 mb-1.5 select-none">
                <Check size={16} strokeWidth={3} />
                <span>KOLOM FAKTA</span>
              </div>

              {/* Sub-text */}
              <p className="text-[11px] text-[#426b47] text-center font-medium leading-tight mb-2.5 select-none">
                Tarik kartu berita yang menurutmu FAKTA ke sini.
              </p>

              {/* Items dropped in Fakta */}
              <div className="space-y-2">
                {mission.beritaItems.map((item, idx) => {
                  if (answers[idx] !== true) return null;
                  const isCorrect = checked ? item.isFakta === true : null;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`bg-white p-2.5 rounded-xl border shadow-2xs text-xs flex flex-col gap-1.5 ${
                        checked
                          ? isCorrect
                            ? "border-[#256c3a] bg-[#f0f7f2]"
                            : "border-[#be342d] bg-[#fdf2f0]"
                          : "border-[#b8e0bc]"
                      }`}
                    >
                      <p className="text-[#28324a] font-bold leading-snug">“{item.judul}”</p>
                      {checked ? (
                        <span
                          className={`flex items-center gap-1 text-[10px] font-extrabold ${
                            isCorrect ? "text-[#256c3a]" : "text-[#be342d]"
                          }`}
                        >
                          {isCorrect ? (
                            <>✓ Benar (Fakta)</>
                          ) : (
                            <>✕ Salah (Seharusnya Hoaks)</>
                          )}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            playSFX("click");
                            setAnswers((prev) => ({ ...prev, [idx]: null }));
                            setActiveCardIndex(idx);
                          }}
                          className="text-[10px] text-[#be342d] hover:underline font-extrabold self-end cursor-pointer"
                        >
                          Kembalikan ↩
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Inbox Tray Illustration */}
            <div className="flex justify-center pt-3 opacity-60 pointer-events-none select-none">
              <div className="w-16 h-10 rounded-lg border-2 border-[#a8d8ac] bg-[#d9edd9] flex items-center justify-center text-[#2e6e34] shadow-inner">
                <Inbox size={20} />
              </div>
            </div>
          </div>

          {/* KOLOM HOAKS */}
          <div
            onDragOver={(e) => handleDragOver(e, "hoaks")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "hoaks")}
            className={`rounded-2xl p-3 sm:p-4 border-2 transition-all flex flex-col justify-between min-h-[220px] shadow-xs relative ${
              dragOverColumn === "hoaks"
                ? "bg-[#fce5e5] border-[#be342d] scale-[1.02] ring-4 ring-[#be342d]/30 shadow-md"
                : "bg-[#fdf0f0] border-[#f6c2c2]"
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-center gap-1.5 text-[#c63831] font-['Fredoka'] font-extrabold text-xs sm:text-sm border-b border-[#f7d2d2] pb-1.5 mb-1.5 select-none">
                <X size={16} strokeWidth={3} />
                <span>KOLOM HOAKS</span>
              </div>

              {/* Sub-text */}
              <p className="text-[11px] text-[#8b4242] text-center font-medium leading-tight mb-2.5 select-none">
                Tarik kartu berita yang menurutmu HOAKS ke sini.
              </p>

              {/* Items dropped in Hoaks */}
              <div className="space-y-2">
                {mission.beritaItems.map((item, idx) => {
                  if (answers[idx] !== false) return null;
                  const isCorrect = checked ? item.isFakta === false : null;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`bg-white p-2.5 rounded-xl border shadow-2xs text-xs flex flex-col gap-1.5 ${
                        checked
                          ? isCorrect
                            ? "border-[#256c3a] bg-[#f0f7f2]"
                            : "border-[#be342d] bg-[#fdf2f0]"
                          : "border-[#f6c2c2]"
                      }`}
                    >
                      <p className="text-[#28324a] font-bold leading-snug">“{item.judul}”</p>
                      {checked ? (
                        <span
                          className={`flex items-center gap-1 text-[10px] font-extrabold ${
                            isCorrect ? "text-[#256c3a]" : "text-[#be342d]"
                          }`}
                        >
                          {isCorrect ? (
                            <>✓ Benar (Hoaks)</>
                          ) : (
                            <>✕ Salah (Seharusnya Fakta)</>
                          )}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            playSFX("click");
                            setAnswers((prev) => ({ ...prev, [idx]: null }));
                            setActiveCardIndex(idx);
                          }}
                          className="text-[10px] text-[#be342d] hover:underline font-extrabold self-end cursor-pointer"
                        >
                          Kembalikan ↩
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Inbox Tray Illustration */}
            <div className="flex justify-center pt-3 opacity-60 pointer-events-none select-none">
              <div className="w-16 h-10 rounded-lg border-2 border-[#f2b2b2] bg-[#fae1e1] flex items-center justify-center text-[#c63831] shadow-inner">
                <Inbox size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Results summary widget */}
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
              {score >= 75 ? "Detektif Berita Handal! 🎉" : "Tetap Semangat! 💪"}
            </p>
            <p className="text-xs sm:text-sm mt-1 font-semibold">
              Skor klasifikasi berita: <strong className="font-extrabold">{score} / 100</strong>
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

      {/* Dimas Mascot & Hint Dialogue Speech Bubble */}
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
          <div className="bg-[#fcf5e3] border-2 border-[#e5cca0] text-[#7a5a2b] text-[10px] sm:text-[11px] font-['Fredoka'] font-extrabold rounded-full px-2.5 py-0.5 shadow-md absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 whitespace-nowrap group-hover:bg-[#f5e3b8] transition-colors">
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
              {/* Pointer Tail */}
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
                Cermati baik-baik kalimat berita! Berita hoaks sering kali memakai kalimat berlebihan, provokatif, atau tidak sesuai fakta sejarah budaya setempat.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DetektifBeritaScreen;

