import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Award, CheckCircle } from "lucide-react";
import { MISSIONS } from "../data/missions";
import { ScreenHeader } from "../components/ScreenHeader";
import { Btn } from "../components/Btn";
import { useAudio } from "../contexts/AudioContext";

interface LencanaScreenProps {
  completedMissions: Set<number>;
  missionScores: Record<number, number>;
  onNext: () => void;
  onBack: () => void;
}

interface BadgeItem {
  emoji: string;
  name: string;
  desc: string;
  criteria: string;
  color: string;
}

export const LencanaScreen: React.FC<LencanaScreenProps> = ({
  completedMissions,
  missionScores,
  onNext,
  onBack
}) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const allDone = completedMissions.size === 3;

  const badges: BadgeItem[] = [
    ...MISSIONS.filter((m) => completedMissions.has(m.id)).map((m) => ({
      emoji: "🏅",
      name: `Penjelajah Budaya: ${m.name}`,
      desc: `Kamu berhasil menyelesaikan seluruh tahapan pembelajaran dan aktivitas pada Misi ${m.id} (${m.name}).`,
      criteria: "Menyelesaikan Orientasi, Materi, Aktivitas, dan Refleksi Misi.",
      color: "bg-amber-100 border-amber-300 text-amber-900"
    })),
    ...(completedMissions.size >= 1
      ? [
          {
            emoji: "🔍",
            name: "Analis Informasi Digital",
            desc: "Kamu terbukti mampu menyaring dan memverifikasi kebenaran berita budaya lokal.",
            criteria: "Menyelesaikan minimal 1 Aktivitas Literasi Digital dengan nilai baik.",
            color: "bg-blue-100 border-blue-300 text-blue-900"
          }
        ]
      : []),
    ...(allDone
      ? [
          {
            emoji: "🏆",
            name: "Detektif Digital Budaya Magetan",
            desc: "Pencapaian tertinggi! Kamu telah menuntaskan seluruh 3 Misi Budaya Magetan dan siap melestarikan kearifan lokal.",
            criteria: "Menyelesaikan 100% seluruh Misi Budaya Magetan.",
            color: "bg-yellow-100 border-yellow-400 text-yellow-900 shadow-amber-200 shadow-md"
          }
        ]
      : [])
  ];

  useEffect(() => {
    if (allDone) {
      playNarrator(
        `Selamat! Kamu sudah mendapatkan ${badges.length} lencana termasuk gelar utama Detektif Digital Budaya Magetan! Ketuk kartu lencana untuk melihat detail atau ketuk tombol lanjut.`
      );
    } else {
      playNarrator(`Kamu telah mengumpulkan ${badges.length} lencana sejauh ini. Teruskan petualanganmu!`);
    }
    return () => {
      stopNarrator();
    };
  }, [completedMissions.size]);

  const handleBadgeClick = (badge: BadgeItem) => {
    playSFX("click");
    setSelectedBadge(badge);
  };

  return (
    <div
      className="h-full flex flex-col font-['Nunito'] relative"
      style={{
        backgroundImage: "url('/assets/bg-lobby.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <ScreenHeader title="Lencana Kamu 🏅" onBack={onBack} onHome={onBack} />
      <div className="flex-1 p-4 space-y-4 max-w-md mx-auto overflow-y-auto w-full">
        <div className="text-center select-none bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-blue-100">
          <p className="font-['Nunito'] text-blue-800 text-sm font-semibold">
            Kamu telah mengumpulkan <span className="text-blue-600 font-extrabold text-base">{badges.length}</span> lencana!
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Ketuk kartu lencana untuk melihat detail kriteria pencapaian</p>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleBadgeClick(badge)}
              className={`rounded-3xl p-4 border flex items-center gap-4 shadow cursor-pointer transition-all relative overflow-hidden group will-change-transform transform-gpu ${badge.color}`}
            >
              {/* Glossy hologram shimmer glare layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              <span className="text-4xl filter drop-shadow select-none relative z-10">{badge.emoji}</span>
              <div className="text-left flex-1 min-w-0 relative z-10">
                <h3 className="font-['Fredoka'] font-bold text-sm truncate">{badge.name}</h3>
                <p className="text-[11px] leading-relaxed opacity-85 font-semibold mt-0.5 line-clamp-2">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {allDone && (
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-2 flex justify-center"
          >
            <Btn onClick={onNext} variant="lanjut">
              Ambil Sertifikat 📜
            </Btn>
          </motion.div>
        )}
      </div>

      {/* Badge detail popup modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div
            className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-sm w-full p-5 relative shadow-2xl border border-amber-200 text-center flex flex-col items-center select-none max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-5xl mb-3 shadow-inner border-2 border-amber-300">
                {selectedBadge.emoji}
              </div>

              <h3 className="font-['Fredoka'] font-bold text-lg text-gray-800 mb-1 leading-snug">
                {selectedBadge.name}
              </h3>

              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-100 text-xs text-gray-700 leading-relaxed mb-3 w-full">
                {selectedBadge.desc}
              </div>

              <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100 text-xs text-blue-800 w-full flex items-start gap-2 text-left">
                <CheckCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[10px] text-blue-500 uppercase tracking-wider">Kriteria Syarat:</span>
                  <span>{selectedBadge.criteria}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-['Fredoka'] font-bold px-6 py-2.5 rounded-full text-xs shadow-md transition-colors cursor-pointer"
              >
                Tutup Detail
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default LencanaScreen;
