import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, ChevronRight } from "lucide-react";
import { Mission } from "../../types";
import { Btn } from "../../components/Btn";
import { useAudio } from "../../contexts/AudioContext";

interface CekFaktaScreenProps {
  mission: Mission;
  onNext: (score: number) => void;
}

export const CekFaktaScreen: React.FC<CekFaktaScreenProps> = ({ mission, onNext }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [answers, setAnswers] = useState<Record<number, boolean | null>>(
    Object.fromEntries(mission.cekFakta.map((_, i) => [i, null]))
  );
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    playNarrator(
      `Misi ketiga: Cek Fakta. Pilihlah benar atau keliru untuk beberapa informasi budaya yang ditampilkan di layar.`
    );
    return () => {
      stopNarrator();
    };
  }, []);

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
      playNarrator(`Hebat! Skor kamu ${finalScore}. Kamu sangat teliti dalam menyaring informasi budaya!`);
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
  const score = checked
    ? Math.round((mission.cekFakta.filter((f, i) => answers[i] === f.benar).length / mission.cekFakta.length) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full font-['Nunito']">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Banner info */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-4 shadow-md select-none">
          <h2 className="font-['Fredoka'] font-bold text-lg flex items-center gap-2">
            <Shield size={22} className="filter drop-shadow-sm" /> Cek Fakta Budaya
          </h2>
          <p className="text-blue-100 text-xs mt-1 leading-relaxed">
            Saring informasi digital! Tentukan apakah pernyataan berikut tentang {mission.name} bernilai BENAR atau KELIRU.
          </p>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 text-center text-xs font-bold select-none">
          <div className="bg-green-50 rounded-2xl p-2.5 border-2 border-green-200 text-green-700">
            ✅ INFORMASI BENAR
          </div>
          <div className="bg-red-50 rounded-2xl p-2.5 border-2 border-red-200 text-red-600">
            ❌ INFORMASI KELIRU
          </div>
        </div>

        {/* Statements */}
        {mission.cekFakta.map((item, i) => {
          const userAnswer = answers[i];
          const isCorrect = checked ? userAnswer === item.benar : null;

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
                    ? "border-blue-300"
                    : "border-gray-100"
                }`}
            >
              <p className="text-gray-700 text-sm mb-3 font-semibold leading-relaxed">{item.text}</p>
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
                  ✅ Benar
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
                  ❌ Keliru
                </button>
              </div>
              {checked && (
                <p
                  className={`text-xs mt-2.5 font-bold select-none ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect
                    ? "✓ Bagus! Verifikasi kamu tepat."
                    : `✗ Kurang tepat. Pernyataan ini sebenarnya bernilai ${item.benar ? "BENAR" : "KELIRU"}.`}
                </p>
              )}
            </div>
          );
        })}

        {/* Feedback results panel */}
        {checked && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-2xl p-4 text-center border-2 select-none shadow-md ${
              score >= 75 ? "bg-green-100 border-green-400 text-green-950" : "bg-amber-100 border-amber-400 text-amber-950"
            }`}
          >
            <p className="font-['Fredoka'] font-bold text-2xl">{score >= 75 ? "🎉 Luar Biasa!" : "💪 Tetap Semangat!"}</p>
            <p className="text-sm mt-0.5">
              Skor verifikasi fakta: <strong>{score} / 100</strong>
            </p>
          </motion.div>
        )}
      </div>

      {/* Sticky action button */}
      <div className="p-4 bg-white border-t border-blue-100 flex-shrink-0">
        {!checked ? (
          <Btn
            onClick={handleCheck}
            variant="primary"
            disabled={!allAnswered}
            className="w-full text-lg justify-center py-3 font-bold"
          >
            Cek Hasil ✅
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
export default CekFaktaScreen;
