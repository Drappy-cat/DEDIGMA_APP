import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Check, X, Lightbulb } from "lucide-react";
import { Mission } from "../../types";
import { Btn } from "../../components/Btn";
import { useAudio } from "../../contexts/AudioContext";
import { fireConfetti } from "../../utils/confetti";

interface CariFaktaScreenProps {
  mission: Mission;
  onNext: (score: number) => void;
}

// Levenshtein distance for fuzzy typo matching
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Check if user answer matches keywords with typo tolerance
function isFuzzyMatch(userAns: string, keywords: string[]): boolean {
  const cleanAns = userAns.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  if (!cleanAns) return false;

  const ansWords = cleanAns.split(/\s+/);

  for (const key of keywords) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    
    // 1. Direct substring match
    if (cleanAns.includes(cleanKey) || cleanKey.includes(cleanAns)) return true;

    // 2. Word by word fuzzy matching (tolerates 1-2 typos)
    const keyWords = cleanKey.split(/\s+/);
    for (const kw of keyWords) {
      const maxDistance = kw.length > 5 ? 2 : 1;
      if (ansWords.some((aw) => levenshtein(aw, kw) <= maxDistance)) {
        return true;
      }
    }
  }

  return false;
}

export const CariFaktaScreen: React.FC<CariFaktaScreenProps> = ({ mission, onNext }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [answers, setAnswers] = useState<string[]>(mission.faktaQuestions.map(() => ""));
  const [results, setResults] = useState<boolean[] | null>(null);
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});

  useEffect(() => {
    playNarrator(
      `Misi kedua: Cari Fakta Budaya. Jawab tiga pertanyaan berikut berdasarkan materi yang telah kamu baca. Ketik jawabanmu.`
    );
    return () => {
      stopNarrator();
    };
  }, []);

  const toggleHint = (index: number) => {
    playSFX("click");
    setShowHints((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const checkAnswers = () => {
    const res = mission.faktaQuestions.map((q, i) => {
      return isFuzzyMatch(answers[i], q.kunci);
    });

    setResults(res);

    const correctCount = res.filter(Boolean).length;
    const finalScore = Math.round((correctCount / res.length) * 100);

    if (finalScore >= 67) {
      playSFX("success");
      fireConfetti();
      playNarrator(`Hebat! Skor kamu ${finalScore}. Kamu memahami fakta budaya dengan sangat baik!`);
    } else {
      playSFX("fail");
      playNarrator(`Skor kamu ${finalScore}. Tidak apa-apa, mari pelajari kembali di misi-misi selanjutnya.`);
    }
  };

  const handleNext = () => {
    const correctCount = results ? results.filter(Boolean).length : 0;
    const finalScore = results ? Math.round((correctCount / results.length) * 100) : 0;
    onNext(finalScore);
  };

  const score = results ? Math.round((results.filter(Boolean).length / results.length) * 100) : 0;
  const allFilled = answers.every((a) => a.trim().length > 0);

  return (
    <div className="flex flex-col h-full font-['Nunito']">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Banner header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl p-4 shadow-md select-none">
          <h2 className="font-['Fredoka'] font-bold text-lg flex items-center gap-2">
            <Search size={22} className="filter drop-shadow-sm" /> Cari Fakta Budaya
          </h2>
          <p className="text-blue-100 text-xs mt-1 leading-relaxed">
            Berdasarkan materi yang telah dipelajari, temukan fakta utama tentang tradisi {mission.name}! (Sistem mendukung toleransi kesalahan ketik/typo).
          </p>
        </div>

        {/* Questions */}
        {mission.faktaQuestions.map((q, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-4 space-y-2.5 border border-gray-100/50">
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5 flex-1">
                <span className="bg-blue-100 text-blue-700 font-['Fredoka'] font-bold w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 select-none shadow-sm">
                  {i + 1}
                </span>
                <p className="font-bold text-gray-700 text-sm leading-relaxed">{q.soal}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleHint(i)}
                className="text-xs text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full font-semibold border border-amber-200 flex items-center gap-1 flex-shrink-0 cursor-pointer select-none transition-colors"
              >
                <Lightbulb size={12} /> {showHints[i] ? "Tutup Clue" : "Clue"}
              </button>
            </div>

            <AnimatePresence>
              {showHints[i] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-2.5 text-xs select-none overflow-hidden will-change-transform transform-gpu"
                >
                  <strong>Petunjuk Detektif:</strong> Kata kunci berkaitan dengan <em>"{q.kunci[0]}"</em>.
                </motion.div>
              )}
            </AnimatePresence>

            <input
              value={answers[i]}
              onChange={(e) =>
                setAnswers((prev) => prev.map((a, j) => (j === i ? e.target.value : a)))
              }
              placeholder="Tulis jawabanmu di sini..."
              disabled={!!results}
              className={`w-full border-2 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all
                ${
                  results
                    ? results[i]
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-red-400 bg-red-50 text-red-700"
                    : "border-blue-200 focus:border-blue-500 bg-blue-50/50"
                }`}
            />
            {results && (
              <div
                className={`flex items-center gap-1.5 text-xs font-semibold select-none ${
                  results[i] ? "text-green-600" : "text-red-600"
                }`}
              >
                {results[i] ? (
                  <>
                    <Check size={16} /> Jawaban kamu tepat! (Mendukung toleransi typo)
                  </>
                ) : (
                  <>
                    <X size={16} /> Kurang tepat. Kata kunci: <span className="underline">{q.kunci[0]}</span>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Results summary widget */}
        {results && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-2xl p-4 text-center border-2 select-none shadow-md ${
              score >= 67 ? "bg-green-100 border-green-400 text-green-950" : "bg-amber-100 border-amber-400 text-amber-950"
            }`}
          >
            <p className="font-['Fredoka'] font-bold text-2xl">{score >= 67 ? "🎉 Luar Biasa!" : "💪 Semangat Belajar!"}</p>
            <p className="text-sm mt-0.5">
              Skor kamu untuk aktivitas ini: <strong>{score} / 100</strong>
            </p>
          </motion.div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-transparent flex gap-3 flex-shrink-0 justify-center">
        {!results ? (
          <Btn onClick={checkAnswers} variant="periksa" disabled={!allFilled} />
        ) : (
          <Btn onClick={handleNext} variant="lanjut" />
        )}
      </div>
    </div>
  );
};
export default CariFaktaScreen;

