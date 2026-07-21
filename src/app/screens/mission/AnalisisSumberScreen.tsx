import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BookOpen, ChevronRight } from "lucide-react";
import { Mission } from "../../types";
import { Btn } from "../../components/Btn";
import { useAudio } from "../../contexts/AudioContext";

interface AnalisisSumberScreenProps {
  mission: Mission;
  onNext: (score: number) => void;
}

export const AnalisisSumberScreen: React.FC<AnalisisSumberScreenProps> = ({ mission, onNext }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [answers, setAnswers] = useState<Record<number, boolean | null>>(
    Object.fromEntries(mission.sumberAnalisis.map((_, i) => [i, null]))
  );
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    playNarrator(
      `Misi keempat: Analisis Sumber. Pilihlah apakah sumber informasi yang tertera di layar terpercaya atau tidak terpercaya.`
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
      playNarrator(`Luar biasa! Skor kamu ${finalScore}. Kamu sangat pandai memilih sumber informasi terpercaya!`);
    } else {
      playSFX("fail");
      playNarrator(`Skor kamu ${finalScore}. Jangan lupa untuk selalu memprioritaskan sumber berita resmi ya.`);
    }
  };

  const handleNext = () => {
    const correctCount = mission.sumberAnalisis.filter((s, i) => answers[i] === s.terpercaya).length;
    const finalScore = Math.round((correctCount / mission.sumberAnalisis.length) * 100);
    onNext(finalScore);
  };

  const allAnswered = Object.values(answers).every((a) => a !== null);
  const score = checked
    ? Math.round((mission.sumberAnalisis.filter((s, i) => answers[i] === s.terpercaya).length / mission.sumberAnalisis.length) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full font-['Nunito']">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Header Prompt */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-2xl p-4 shadow-md select-none">
          <h2 className="font-['Fredoka'] font-bold text-lg flex items-center gap-2">
            <BookOpen size={22} className="filter drop-shadow-sm" /> Analisis Sumber Informasi
          </h2>
          <p className="text-purple-100 text-xs mt-1 leading-relaxed">
            Evaluasi kredibilitas! Tentukan mana sumber informasi yang TERPERCAYA (kredibel) dan TIDAK TERPERCAYA (kurang valid).
          </p>
        </div>

        {/* Sources Cards */}
        {mission.sumberAnalisis.map((s, i) => {
          const userAnswer = answers[i];
          const isCorrect = checked ? userAnswer === s.terpercaya : null;

          return (
            <div
              key={i}
              className={`bg-white rounded-2xl shadow-md p-4 border-2 transition-all
                ${
                  checked
                    ? isCorrect
                      ? "border-green-400 bg-green-50/20"
                      : "border-red-400 bg-red-50/20"
                    : userAnswer !== null
                    ? "border-purple-300"
                    : "border-gray-100"
                }`}
            >
              <div className="flex items-start gap-3 mb-3 select-none">
                <span className="text-3xl filter drop-shadow">{s.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm leading-snug">{s.nama}</p>
                  <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
                    {s.jenis}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSelect(i, true)}
                  disabled={checked}
                  className={`flex-1 py-2.5 rounded-xl font-['Fredoka'] font-bold text-xs border-2 transition-all cursor-pointer select-none
                    ${
                      userAnswer === true
                        ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-200"
                        : "border-green-300 bg-white text-green-600 hover:bg-green-50"
                    }`}
                >
                  ✅ Terpercaya
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect(i, false)}
                  disabled={checked}
                  className={`flex-1 py-2.5 rounded-xl font-['Fredoka'] font-bold text-xs border-2 transition-all cursor-pointer select-none
                    ${
                      userAnswer === false
                        ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-200"
                        : "border-red-300 bg-white text-red-500 hover:bg-red-50"
                    }`}
                >
                  ⚠️ Tidak Terpercaya
                </button>
              </div>

              {checked && (
                <p
                  className={`text-xs mt-2.5 font-bold select-none ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect
                    ? "✓ Tepat sekali! Pilihan kamu benar."
                    : `✗ Kurang tepat. Sumber ini ${
                        s.terpercaya
                          ? "TERPERCAYA karena merupakan publikasi akademik/pemerintah resmi."
                          : "TIDAK TERPERCAYA karena bersifat opini pribadi/media sosial tidak resmi."
                      }`}
                </p>
              )}
            </div>
          );
        })}

        {/* Results summary widget */}
        {checked && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-2xl p-4 text-center border-2 select-none shadow-md ${
              score >= 75 ? "bg-green-100 border-green-400 text-green-950" : "bg-amber-100 border-amber-400 text-amber-950"
            }`}
          >
            <p className="font-['Fredoka'] font-bold text-2xl">{score >= 75 ? "🎉 Hebat!" : "💪 Pelajari Lagi!"}</p>
            <p className="text-sm mt-0.5">
              Skor analisis sumber: <strong>{score} / 100</strong>
            </p>
          </motion.div>
        )}
      </div>

      {/* Sticky footer action button */}
      <div className="p-4 bg-transparent flex-shrink-0 flex justify-center">
        {!checked ? (
          <Btn
            onClick={handleCheck}
            variant="periksa"
            disabled={!allAnswered}
          />
        ) : (
          <Btn onClick={handleNext} variant="lanjut" />
        )}
      </div>
    </div>
  );
};
export default AnalisisSumberScreen;
