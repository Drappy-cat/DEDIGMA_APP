import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, ChevronRight, Check, X } from "lucide-react";
import { Mission } from "../../types";
import { Btn } from "../../components/Btn";
import { useAudio } from "../../contexts/AudioContext";

interface CariFaktaScreenProps {
  mission: Mission;
  onNext: (score: number) => void;
}

export const CariFaktaScreen: React.FC<CariFaktaScreenProps> = ({ mission, onNext }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [answers, setAnswers] = useState<string[]>(mission.faktaQuestions.map(() => ""));
  const [results, setResults] = useState<boolean[] | null>(null);

  useEffect(() => {
    playNarrator(
      `Misi kedua: Cari Fakta Budaya. Jawab tiga pertanyaan berikut berdasarkan materi yang telah kamu baca. Ketik jawabanmu.`
    );
    return () => {
      stopNarrator();
    };
  }, []);

  const checkAnswers = () => {
    const res = mission.faktaQuestions.map((q, i) => {
      const ans = answers[i].toLowerCase().trim();
      return q.kunci.some((k) => ans.includes(k));
    });

    setResults(res);

    const correctCount = res.filter(Boolean).length;
    const finalScore = Math.round((correctCount / res.length) * 100);

    if (finalScore >= 67) {
      playSFX("success");
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
            Berdasarkan materi yang telah dipelajari, temukan fakta utama tentang tradisi {mission.name}!
          </p>
        </div>

        {/* Questions */}
        {mission.faktaQuestions.map((q, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-4 space-y-2.5 border border-gray-100/50">
            <div className="flex items-start gap-2.5">
              <span className="bg-blue-100 text-blue-700 font-['Fredoka'] font-bold w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 select-none shadow-sm">
                {i + 1}
              </span>
              <p className="font-bold text-gray-700 text-sm leading-relaxed">{q.soal}</p>
            </div>
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
                    <Check size={16} /> Jawaban kamu tepat!
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
            <p className="font-['Fredoka'] font-bold text-2xl">{score >= 67 ? "🎉 Bagus!" : "💪 Semangat Belajar!"}</p>
            <p className="text-sm mt-0.5">
              Skor kamu untuk aktivitas ini: <strong>{score} / 100</strong>
            </p>
          </motion.div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white border-t border-blue-100 flex gap-3 flex-shrink-0">
        {!results ? (
          <Btn onClick={checkAnswers} variant="primary" disabled={!allFilled} className="flex-1 text-lg justify-center font-bold">
            Cek Jawaban ✅
          </Btn>
        ) : (
          <Btn onClick={handleNext} variant="green" className="flex-1 text-lg justify-center font-bold">
            Lanjut <ChevronRight size={20} />
          </Btn>
        )}
      </div>
    </div>
  );
};
export default CariFaktaScreen;
