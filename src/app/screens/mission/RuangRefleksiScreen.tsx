import React, { useState, useEffect } from "react";
import { Lightbulb, ChevronRight } from "lucide-react";
import { Mission } from "../../types";
import { Btn } from "../../components/Btn";
import { MascotGita } from "../../components/Mascot";
import { useAudio } from "../../contexts/AudioContext";

interface RuangRefleksiScreenProps {
  mission: Mission;
  onNext: () => void;
}

export const RuangRefleksiScreen: React.FC<RuangRefleksiScreenProps> = ({ mission, onNext }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [answers, setAnswers] = useState<string[]>(mission.refleksiPertanyaan.map(() => ""));

  useEffect(() => {
    playNarrator(
      `Misi keenam: Ruang Refleksi. Tuliskan pendapat atau perasaanmu setelah mempelajari tradisi ${mission.name}. Tulis minimal 5 huruf ya.`
    );
    return () => {
      stopNarrator();
    };
  }, []);

  const handleNext = () => {
    playSFX("click");
    onNext();
  };

  const canContinue = answers.every((a) => a.trim().length >= 5);

  return (
    <div className="flex flex-col h-full font-['Nunito']">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Header Prompt */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-2xl p-4 shadow-md select-none">
          <h2 className="font-['Fredoka'] font-bold text-lg flex items-center gap-2">
            <Lightbulb size={22} className="filter drop-shadow-sm" /> Ruang Refleksi Budaya
          </h2>
          <p className="text-teal-100 text-xs mt-1 leading-relaxed">
            Renungkan nilai tradisi! Tuliskan hasil pemikiranmu secara jujur setelah mempelajari tradisi {mission.name}.
          </p>
        </div>

        {/* Companion Advice */}
        <div className="flex gap-3 items-start select-none">
          <MascotGita size="sm" animate={true} />
          <div className="bg-amber-50 rounded-2xl p-3 flex-1 border border-amber-200 shadow-sm">
            <p className="text-amber-800 text-xs leading-relaxed">
              Hai! Aku Gita. Sekarang saatnya menuliskan pemikiranmu. Tidak ada jawaban salah, tulis apa saja yang kamu
              rasakan tentang warisan budaya kita! 🌺
            </p>
          </div>
        </div>

        {/* Reflection text areas */}
        {mission.refleksiPertanyaan.map((q, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-4 space-y-2.5 border border-gray-100/50">
            <div className="flex items-start gap-2.5">
              <span className="bg-teal-100 text-teal-700 font-['Fredoka'] font-bold w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 select-none shadow-sm">
                {i + 1}
              </span>
              <p className="font-bold text-gray-700 text-sm leading-relaxed">{q}</p>
            </div>
            <textarea
              value={answers[i]}
              onChange={(e) =>
                setAnswers((prev) => prev.map((a, j) => (j === i ? e.target.value : a)))
              }
              placeholder="Tuliskan pemikiran atau tanggapanmu di sini..."
              rows={3}
              className="w-full border-2 border-teal-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-teal-500 resize-none bg-teal-50/50 transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Sticky footer action button */}
      <div className="p-4 bg-transparent flex-shrink-0 flex justify-center">
        <Btn
          onClick={handleNext}
          variant="lanjut"
          disabled={!canContinue}
        />
        {!canContinue && (
          <p className="text-center text-[10px] text-gray-400 font-semibold mt-1.5 select-none">
            Isi seluruh pertanyaan dengan jawaban minimal 5 karakter untuk melanjutkan.
          </p>
        )}
      </div>
    </div>
  );
};
export default RuangRefleksiScreen;
