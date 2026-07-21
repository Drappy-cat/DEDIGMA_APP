import React, { useEffect } from "react";
import { motion } from "motion/react";
import { MISSIONS } from "../data/missions";
import { ScreenHeader } from "../components/ScreenHeader";
import { Btn } from "../components/Btn";
import { SkyBg } from "../components/SkyBg";
import { useAudio } from "../contexts/AudioContext";

interface LencanaScreenProps {
  completedMissions: Set<number>;
  missionScores: Record<number, number>;
  onNext: () => void;
  onBack: () => void;
}

export const LencanaScreen: React.FC<LencanaScreenProps> = ({
  completedMissions,
  missionScores,
  onNext,
  onBack
}) => {
  const { playNarrator, stopNarrator } = useAudio();
  const allDone = completedMissions.size === 3;

  const badges = [
    ...MISSIONS.filter((m) => completedMissions.has(m.id)).map((m) => ({
      emoji: "🏅",
      name: "Penjelajah Budaya",
      desc: `Menyelesaikan Misi: ${m.name}`,
      color: "bg-amber-100 border-amber-300 text-amber-900"
    })),
    ...(completedMissions.size >= 1
      ? [
          {
            emoji: "🔍",
            name: "Analis Informasi",
            desc: "Berhasil menyelesaikan aktivitas verifikasi fakta",
            color: "bg-blue-100 border-blue-300 text-blue-900"
          }
        ]
      : []),
    ...(allDone
      ? [
          {
            emoji: "🏆",
            name: "Detektif Digital Budaya Magetan",
            desc: "Menyelesaikan seluruh misi pembelajaran DEDIGMA!",
            color: "bg-yellow-100 border-yellow-400 text-yellow-900 shadow-amber-200 shadow-md"
          }
        ]
      : [])
  ];

  useEffect(() => {
    if (allDone) {
      playNarrator(
        `Selamat! Kamu sudah mendapatkan ${badges.length} lencana termasuk gelar utama Detektif Digital Budaya Magetan! Ketuk tombol ambil sertifikat di bawah.`
      );
    } else {
      playNarrator(`Kamu telah mengumpulkan ${badges.length} lencana sejauh ini. Teruskan petualanganmu!`);
    }
    return () => {
      stopNarrator();
    };
  }, [completedMissions.size]);

  return (
    <SkyBg>
      <ScreenHeader title="Lencana Kamu 🏅" onBack={onBack} />
      <div className="p-4 space-y-4 max-w-md mx-auto overflow-y-auto">
        <div className="text-center select-none">
          <p className="font-['Nunito'] text-blue-800 text-sm font-semibold">
            Kamu telah mengumpulkan <span className="text-blue-600 font-extrabold text-base">{badges.length}</span> lencana!
          </p>
        </div>

        <div className="space-y-3">
          {badges.map((b, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`${b.color} border-2 rounded-2xl p-4 flex items-center gap-4`}
            >
              <span className="text-5xl filter drop-shadow select-none">{b.emoji}</span>
              <div>
                <p className="font-['Fredoka'] font-bold text-base">{b.name}</p>
                <p className="font-['Nunito'] text-xs opacity-80 leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}

          {!allDone && (
            <div className="bg-gray-100/70 border-2 border-dashed border-gray-300 rounded-2xl p-4 flex items-center gap-4 opacity-60 select-none">
              <span className="text-5xl">🔒</span>
              <div>
                <p className="font-['Fredoka'] font-bold text-gray-500 text-base">Detektif Digital Budaya Magetan</p>
                <p className="font-['Nunito'] text-gray-400 text-xs leading-relaxed">
                  Selesaikan semua misi untuk membuka lencana ini!
                </p>
              </div>
            </div>
          )}
        </div>

        {allDone && (
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <Btn onClick={onNext} variant="amber" className="w-full text-xl py-4 justify-center shadow-lg font-bold">
              🎓 Ambil Sertifikat!
            </Btn>
          </motion.div>
        )}
      </div>
    </SkyBg>
  );
};
export default LencanaScreen;
