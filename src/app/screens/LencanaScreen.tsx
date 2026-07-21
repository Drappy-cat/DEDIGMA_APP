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
    <div
      className="min-h-screen flex flex-col font-['Nunito']"
      style={{
        backgroundImage: "url('/assets/bg-lobby.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <ScreenHeader title="Lencana Kamu 🏅" onBack={onBack} />
      <div className="p-4 space-y-4 max-w-md mx-auto overflow-y-auto">
        <div className="text-center select-none">
          <p className="font-['Nunito'] text-blue-800 text-sm font-semibold">
            Kamu telah mengumpulkan <span className="text-blue-600 font-extrabold text-base">{badges.length}</span> lencana!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-3xl p-4 border flex items-center gap-4 shadow ${badge.color}`}
            >
              <span className="text-4xl filter drop-shadow select-none">{badge.emoji}</span>
              <div className="text-left">
                <h3 className="font-['Fredoka'] font-bold text-sm">{badge.name}</h3>
                <p className="text-[11px] leading-relaxed opacity-85 font-semibold mt-0.5">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {allDone && (
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <Btn onClick={onNext} variant="lanjut" />
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default LencanaScreen;
