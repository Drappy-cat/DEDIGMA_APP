import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, ChevronRight, Check, X, ArrowDown } from "lucide-react";
import { Mission } from "../../types";
import { Btn } from "../../components/Btn";
import { useAudio } from "../../contexts/AudioContext";

interface DetektifBeritaScreenProps {
  mission: Mission;
  onNext: (score: number) => void;
}

export const DetektifBeritaScreen: React.FC<DetektifBeritaScreenProps> = ({ mission, onNext }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [answers, setAnswers] = useState<Record<number, boolean | null>>(
    Object.fromEntries(mission.beritaItems.map((_, i) => [i, null]))
  );
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(0);
  const [checked, setChecked] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState<"fakta" | "hoaks" | null>(null);

  useEffect(() => {
    playNarrator(
      `Misi kelima: Detektif Berita. Geser atau pindahkan setiap kartu berita di bawah ke dalam kolom fakta atau kolom hoaks.`
    );
    return () => {
      stopNarrator();
    };
  }, []);

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    if (checked) return;
    e.dataTransfer.setData("text/plain", String(idx));
    // Set feedback for drag active card
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

    // Advance to next unclassified card
    findNextActiveCard(idx);
  };

  // Click-to-move handlers for touch screens
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
      // Find any remaining unclassified
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
      playNarrator(`Hebat! Skor kamu ${finalScore}. Kamu adalah Detektif Berita yang handal!`);
    } else {
      playSFX("fail");
      playNarrator(`Skor kamu ${finalScore}. Terus berlatih agar tidak mudah percaya berita palsu.`);
    }
  };

  const handleNext = () => {
    const correctCount = mission.beritaItems.filter((b, i) => answers[i] === b.isFakta).length;
    const finalScore = Math.round((correctCount / mission.beritaItems.length) * 100);
    onNext(finalScore);
  };

  const allAnswered = Object.values(answers).every((a) => a !== null);
  const score = checked
    ? Math.round((mission.beritaItems.filter((b, i) => answers[i] === b.isFakta).length / mission.beritaItems.length) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full font-['Nunito']">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Banner header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-2xl p-4 shadow-md select-none">
          <h2 className="font-['Fredoka'] font-bold text-lg flex items-center gap-2">
            🕵️ Detektif Berita Budaya
          </h2>
          <p className="text-amber-100 text-xs mt-1 leading-relaxed">
            Klasifikasikan berita! Seret (drag & drop) atau ketuk tombol pada berita untuk memasukkannya ke kolom FAKTA atau HOAKS.
          </p>
        </div>

        {/* Peti Berita / Pending cards chest */}
        {!checked && activeCardIndex !== null && activeCardIndex !== -1 && (
          <div className="bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-3xl p-4 flex flex-col items-center gap-3 shadow-inner">
            <span className="text-xs font-['Fredoka'] font-bold text-amber-700 bg-amber-200 px-3 py-1 rounded-full flex items-center gap-1 select-none">
              📦 Peti Berita: Seret kartu ini <ArrowDown size={12} className="animate-bounce" />
            </span>

            <motion.div
              draggable
              onDragStart={(e) => handleDragStart(e, activeCardIndex)}
              className="bg-white border-2 border-amber-200 hover:border-amber-400 rounded-2xl p-4 shadow-lg w-full max-w-sm cursor-grab active:cursor-grabbing relative overflow-hidden group select-none"
              whileHover={{ scale: 1.01 }}
              layout
            >
              <p className="font-bold text-gray-800 text-sm leading-relaxed mb-4">
                📰 "{mission.beritaItems[activeCardIndex].judul}"
              </p>

              {/* Mobile friendly click buttons inside card */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => moveCard(activeCardIndex, true)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl py-2 font-['Fredoka'] font-bold text-xs shadow transition-all cursor-pointer"
                >
                  Pindahkan ke Fakta
                </button>
                <button
                  type="button"
                  onClick={() => moveCard(activeCardIndex, false)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2 font-['Fredoka'] font-bold text-xs shadow transition-all cursor-pointer"
                >
                  Pindahkan ke Hoaks
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Drag columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* Fakta Column */}
          <div
            onDragOver={(e) => handleDragOver(e, "fakta")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "fakta")}
            className={`rounded-3xl p-3 border-2 transition-all flex flex-col min-h-[160px] gap-2.5 shadow-sm
              ${
                dragOverColumn === "fakta"
                  ? "bg-green-100 border-green-500 scale-105"
                  : "bg-green-50/50 border-green-200"
              }`}
          >
            <h3 className="font-['Fredoka'] font-bold text-green-700 text-xs text-center border-b border-green-200/50 pb-1.5 select-none">
              📰 KOLOM FAKTA
            </h3>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-[220px]">
              {mission.beritaItems.map((item, idx) => {
                if (answers[idx] !== true) return null;
                const isCorrect = checked ? item.isFakta === true : null;

                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`bg-white p-2.5 rounded-xl border shadow-sm text-xs leading-relaxed relative flex flex-col gap-2 ${
                      checked
                        ? isCorrect
                          ? "border-green-400 bg-green-50"
                          : "border-red-400 bg-red-50"
                        : "border-green-100"
                    }`}
                  >
                    <p className="text-gray-700 font-medium">"{item.judul}"</p>
                    {checked && (
                      <span
                        className={`flex items-center gap-0.5 text-[9px] font-bold ${
                          isCorrect ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isCorrect ? <><Check size={12} /> Benar (Fakta)</> : <><X size={12} /> Salah (Hoaks)</>}
                      </span>
                    )}
                    {!checked && (
                      <button
                        onClick={() => setAnswers((prev) => ({ ...prev, [idx]: null }))}
                        className="text-[9px] text-red-500 hover:underline font-bold self-end mt-1 cursor-pointer"
                      >
                        Kembalikan ↩
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Hoaks Column */}
          <div
            onDragOver={(e) => handleDragOver(e, "hoaks")}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "hoaks")}
            className={`rounded-3xl p-3 border-2 transition-all flex flex-col min-h-[160px] gap-2.5 shadow-sm
              ${
                dragOverColumn === "hoaks"
                  ? "bg-red-100 border-red-500 scale-105"
                  : "bg-red-50/50 border-red-200"
              }`}
          >
            <h3 className="font-['Fredoka'] font-bold text-red-600 text-xs text-center border-b border-red-200/50 pb-1.5 select-none">
              🚫 KOLOM HOAKS
            </h3>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-[220px]">
              {mission.beritaItems.map((item, idx) => {
                if (answers[idx] !== false) return null;
                const isCorrect = checked ? item.isFakta === false : null;

                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`bg-white p-2.5 rounded-xl border shadow-sm text-xs leading-relaxed relative flex flex-col gap-2 ${
                      checked
                        ? isCorrect
                          ? "border-green-400 bg-green-50"
                          : "border-red-400 bg-red-50"
                        : "border-red-100"
                    }`}
                  >
                    <p className="text-gray-700 font-medium">"{item.judul}"</p>
                    {checked && (
                      <span
                        className={`flex items-center gap-0.5 text-[9px] font-bold ${
                          isCorrect ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isCorrect ? <><Check size={12} /> Benar (Hoaks)</> : <><X size={12} /> Salah (Fakta)</>}
                      </span>
                    )}
                    {!checked && (
                      <button
                        onClick={() => setAnswers((prev) => ({ ...prev, [idx]: null }))}
                        className="text-[9px] text-red-500 hover:underline font-bold self-end mt-1 cursor-pointer"
                      >
                        Kembalikan ↩
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results summary widget */}
        {checked && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-2xl p-4 text-center border-2 select-none shadow-md ${
              score >= 75 ? "bg-green-100 border-green-400 text-green-950" : "bg-amber-100 border-amber-400 text-amber-950"
            }`}
          >
            <p className="font-['Fredoka'] font-bold text-2xl">
              {score >= 75 ? "🎉 Detektif Berita Handal!" : "💪 Semangat Belajar!"}
            </p>
            <p className="text-sm mt-0.5">
              Skor klasifikasi berita: <strong>{score} / 100</strong>
            </p>
          </motion.div>
        )}
      </div>

      {/* Sticky action footer */}
      <div className="p-4 bg-white border-t border-blue-100 flex-shrink-0">
        {!checked ? (
          <Btn
            onClick={handleCheck}
            variant="amber"
            disabled={!allAnswered}
            className="w-full text-lg justify-center py-3 font-bold"
          >
            Cek Hasil 🔍
          </Btn>
        ) : (
          <Btn onClick={handleNext} variant="green" className="w-full text-lg justify-center py-3 font-bold">
            Lanjut <ChevronRight size={20} />
          </Btn>
        )}
      </div>
    </div>
  );
};
export default DetektifBeritaScreen;
