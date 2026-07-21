import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { Mission } from "../../types";
import { useAudio } from "../../contexts/AudioContext";

interface TantanganScreenProps {
  mission: Mission;
  onFinish: (score: number) => void;
}

export const TantanganScreen: React.FC<TantanganScreenProps> = ({ mission, onFinish }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(mission.kuis.map(() => null));
  const [done, setDone] = useState(false);

  const q = mission.kuis[current];
  const totalQ = mission.kuis.length;

  useEffect(() => {
    playNarrator(`Misi ketujuh: Tantangan DEDIGMA. Jawab kuis pilihan ganda berikut untuk mengetes pemahamanmu.`);
    return () => {
      stopNarrator();
    };
  }, []);

  const handleSelect = (idx: number) => {
    if (answers[current] !== null) return;
    const newAnswers = answers.map((a, i) => (i === current ? idx : a));
    setAnswers(newAnswers);
    setSelected(idx);

    // Play immediate success/fail SFX
    const isCorrect = idx === q.jawaban;
    if (isCorrect) {
      playSFX("success");
    } else {
      playSFX("fail");
    }

    setTimeout(() => {
      if (current < totalQ - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setDone(true);
        const correctCount = newAnswers.filter((a, i) => a === mission.kuis[i].jawaban).length;
        const finalScore = Math.round((correctCount / totalQ) * 100);

        if (finalScore >= 80) {
          playSFX("badge");
          playNarrator(`Luar biasa! Skor kuis kamu ${finalScore}. Kamu adalah Detektif Pintar!`);
        } else {
          playSFX("success");
          playNarrator(`Selamat! Kamu menyelesaikan kuis dengan skor ${finalScore}.`);
        }

        setTimeout(() => onFinish(finalScore), 1500);
      }
    }, 1000);
  };

  const correctCount = answers.filter((a, i) => a === mission.kuis[i].jawaban).length;
  const score = Math.round((correctCount / totalQ) * 100);

  if (done) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center gap-4 bg-gradient-to-b from-yellow-50 to-amber-50 font-['Nunito'] select-none">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-8xl filter drop-shadow-md"
        >
          {score >= 80 ? "🏆" : score >= 60 ? "⭐" : "💪"}
        </motion.div>
        <h2 className="font-['Fredoka'] font-bold text-3xl text-amber-700">
          {score >= 80 ? "Luar Biasa!" : score >= 60 ? "Bagus!" : "Tetap Semangat!"}
        </h2>
        <p className="text-lg text-gray-600">
          Skor Kuis: <strong className="text-amber-600 text-2xl">{score}</strong>
        </p>
        <p className="text-xs text-gray-400 font-semibold">
          {correctCount} dari {totalQ} pertanyaan dijawab dengan benar
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full font-['Nunito']">
      {/* Progress header bar */}
      <div className="bg-white px-4 py-2 border-b border-blue-100 select-none">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span className="font-semibold">Pertanyaan {current + 1} dari {totalQ}</span>
          <span className="text-amber-600 font-bold">{Math.round((current / totalQ) * 100)}%</span>
        </div>
        <div className="h-2 bg-blue-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${(current / totalQ) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Banner header */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-2xl p-4 shadow-md select-none">
          <h2 className="font-['Fredoka'] font-bold text-lg flex items-center gap-2">
            <Trophy size={22} className="filter drop-shadow-sm" /> Tantangan DEDIGMA
          </h2>
          <p className="text-amber-100 text-xs">Uji wawasan budayamu dan jawab dengan teliti!</p>
        </div>

        {/* Question Panel */}
        <motion.div
          key={current}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
            <p className="font-bold text-gray-800 text-base mb-4 leading-relaxed">{q.soal}</p>
            <div className="space-y-3">
              {q.opsi.map((o, idx) => {
                const userAns = answers[current];
                let btnStyle = "border-2 border-blue-100 bg-blue-50/30 text-gray-700 hover:border-blue-400 hover:bg-blue-50";

                if (userAns !== null) {
                  if (idx === q.jawaban) {
                    btnStyle = "border-2 border-green-400 bg-green-100 text-green-800 shadow-md shadow-green-100";
                  } else if (idx === userAns && userAns !== q.jawaban) {
                    btnStyle = "border-2 border-red-400 bg-red-100 text-red-700 shadow-md shadow-red-100";
                  } else {
                    btnStyle = "border-2 border-gray-150 bg-gray-50 text-gray-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    disabled={answers[current] !== null}
                    className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer select-none ${btnStyle}`}
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default TantanganScreen;
