import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle, Search, Trophy } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
import { useAudio } from "../contexts/AudioContext";

interface LencanaScreenProps {
  completedMissions: Set<number>;
  missionScores: Record<number, number>;
  onNext: () => void;
  onBack: () => void;
}

interface BadgeItem {
  id: string;
  type: "mission" | "achievement";
  emoji: string;
  name: string;
  desc: string;
  criteria: string;
  isUnlocked: boolean;
  theme: "gold" | "blue" | "purple" | "green";
  progressCurrent?: number;
  progressTotal?: number;
}

export const LencanaScreen: React.FC<LencanaScreenProps> = ({
  completedMissions,
  missionScores,
  onNext,
  onBack
}) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const missionBadges: BadgeItem[] = [
    {
      id: "m1",
      type: "mission",
      emoji: "⭐",
      name: "Penjelajah Budaya: Larung Sesaji",
      desc: "Menyelesaikan seluruh tahapan pembelajaran dan aktivitas pada Misi 1 (Larung Sesaji).",
      criteria: "Menyelesaikan Orientasi, Materi, Aktivitas, dan Refleksi Misi 1.",
      isUnlocked: completedMissions.has(1),
      theme: "gold"
    },
    {
      id: "m2",
      type: "mission",
      emoji: "⭐",
      name: "Penjelajah Budaya: Nyadaran",
      desc: "Menyelesaikan seluruh tahapan pembelajaran dan aktivitas pada Misi 2 (Nyadaran).",
      criteria: "Menyelesaikan Orientasi, Materi, Aktivitas, dan Refleksi Misi 2.",
      isUnlocked: completedMissions.has(2),
      theme: "blue"
    },
    {
      id: "m3",
      type: "mission",
      emoji: "⭐",
      name: "Penjelajah Budaya: Ledhug Suro",
      desc: "Menyelesaikan seluruh tahapan pembelajaran dan aktivitas pada Misi 3 (Ledhug Suro).",
      criteria: "Menyelesaikan Orientasi, Materi, Aktivitas, dan Refleksi Misi 3.",
      isUnlocked: completedMissions.has(3),
      theme: "purple"
    }
  ];

  const achievementBadges: BadgeItem[] = [
    {
      id: "a1",
      type: "achievement",
      emoji: "🔍",
      name: "Analisis Informasi Digital",
      desc: "Terbukti mampu menyaring dan memverifikasi kebenaran berita budaya lokal.",
      criteria: "Memverifikasi berita dan menyelesaikan tantangan Cek Fakta.",
      isUnlocked: completedMissions.size >= 1,
      theme: "blue",
      progressCurrent: completedMissions.size >= 3 ? 5 : completedMissions.size >= 1 ? 3 : 0,
      progressTotal: 5
    },
    {
      id: "a2",
      type: "achievement",
      emoji: "🏆",
      name: "Detektif Digital Budaya Magetan",
      desc: "Pencapaian tertinggi! Kamu telah menuntaskan seluruh 3 misi dan menjadi Detektif Budaya sejati.",
      criteria: "Menyelesaikan seluruh 3 Misi Budaya Magetan.",
      isUnlocked: completedMissions.size === 3,
      theme: "green",
      progressCurrent: completedMissions.size,
      progressTotal: 3
    }
  ];

  const totalBadges = 5;
  const unlockedCount = missionBadges.filter((b) => b.isUnlocked).length + achievementBadges.filter((b) => b.isUnlocked).length;

  useEffect(() => {
    playNarrator(`Kamu telah mengumpulkan ${unlockedCount} lencana! Ketuk kartu lencana untuk melihat detail pencapaian.`);
    return () => {
      stopNarrator();
    };
  }, [unlockedCount, playNarrator, stopNarrator]);

  const handleBadgeClick = (badge: BadgeItem) => {
    playSFX("click");
    setSelectedBadge(badge);
  };

  return (
    <div
      className="h-full flex flex-col font-['Nunito'] relative select-none overflow-hidden"
      style={{
        backgroundImage: "url('/assets/telaga.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Screen Header */}
      <div className="relative z-30 flex-shrink-0">
        <ScreenHeader title="Lencana Pencapaian 🏅" onBack={onBack} onHome={onBack} />
      </div>

      {/* Main Body Layout */}
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-3 sm:p-5 flex flex-col items-center justify-between relative z-10">
        
        {/* Top Header Signboard */}
        <div className="flex flex-col items-center relative mt-1 mb-3 w-full max-w-4xl flex-shrink-0">
          <div className="bg-[#6b3c1b] border-2 border-[#4a270f] rounded-2xl px-8 sm:px-12 py-1.5 sm:py-2 text-[#fff5ce] font-['Fredoka'] font-extrabold text-lg sm:text-2xl md:text-3xl uppercase tracking-wider shadow-lg border-b-4 flex items-center justify-center gap-2 relative z-10">
            <span className="text-base sm:text-lg select-none">🌿</span>
            <span>LENCANA</span>
            <span className="text-base sm:text-lg select-none transform scale-x-[-1]">🌿</span>
          </div>
        </div>

        {/* Sub-Header Parchment Info Banner & Dark Star Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-4xl mx-auto mb-3 flex-shrink-0">
          {/* Parchment Info Card */}
          <div className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-2xl px-5 py-2.5 shadow-md flex-1 text-center sm:text-left w-full">
            <p className="font-['Fredoka'] font-extrabold text-xs sm:text-sm text-[#3a2718]">
              Kamu telah mengumpulkan <span className="text-[#256c3a] font-black">{unlockedCount}</span> lencana!
            </p>
            <p className="text-[11px] text-[#7a6450] font-['Nunito'] font-bold mt-0.5">
              Ketik kartu lencana untuk melihat detail pencapaian
            </p>
          </div>

          {/* Dark Pill Star Counter Badge */}
          <div className="bg-[#1c3829] border-2 border-[#2d5841] text-white rounded-full px-5 py-2 flex items-center gap-2.5 shadow-lg flex-shrink-0">
            <span className="text-amber-400 text-base sm:text-lg select-none">⭐</span>
            <span className="font-['Fredoka'] font-extrabold text-sm sm:text-base text-[#fcd34d]">
              {unlockedCount} / {totalBadges}
            </span>
          </div>
        </div>

        {/* Upper Row: 3 Mission Badge Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl mx-auto my-1 flex-shrink-0">
          {/* Card 1: Larung Sesaji (Gold Medal) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleBadgeClick(missionBadges[0])}
            className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-3xl p-4 flex flex-col items-center justify-between text-center shadow-md relative hover:shadow-xl transition-all cursor-pointer select-none"
          >
            {/* Badge Medal Illustration - Gold Theme */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center my-2 flex-shrink-0 select-none">
              <div className="absolute -bottom-2 flex gap-1 z-0">
                <div className="w-4 h-9 bg-gradient-to-b from-[#3b82f6] via-[#f59e0b] to-[#ef4444] rounded-b-xs transform -rotate-12 border border-[#92400e] shadow-xs" />
                <div className="w-4 h-9 bg-gradient-to-b from-[#3b82f6] via-[#f59e0b] to-[#ef4444] rounded-b-xs transform rotate-12 border border-[#92400e] shadow-xs" />
              </div>
              <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#b45309] border-4 border-[#fff5ce] shadow-xl flex items-center justify-center ring-2 ring-[#b45309]">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#fde047] via-[#d97706] to-[#78350f] border-2 border-[#fef9c3] flex items-center justify-center shadow-inner text-2xl sm:text-3xl text-[#fff5ce]">
                  ⭐
                </div>
              </div>
            </div>

            <h3 className="font-['Fredoka'] font-extrabold text-xs sm:text-sm text-[#3a2718] mt-1 mb-1 leading-snug">
              {missionBadges[0].name}
            </h3>

            <p className="text-[#7a6450] text-[11px] sm:text-xs font-['Nunito'] font-bold leading-tight mb-3">
              {missionBadges[0].desc}
            </p>

            {missionBadges[0].isUnlocked ? (
              <div className="bg-[#e2ead8] text-[#256c3a] border border-[#b8d4aa] rounded-full px-5 py-1 text-xs font-['Fredoka'] font-extrabold flex items-center justify-center gap-1.5 shadow-xs w-full max-w-[140px]">
                <span>Selesai</span>
                <span className="text-xs">✔</span>
              </div>
            ) : (
              <div className="bg-gray-200 text-gray-500 border border-gray-300 rounded-full px-5 py-1 text-xs font-['Fredoka'] font-extrabold flex items-center justify-center gap-1.5 shadow-xs w-full max-w-[140px]">
                <span>Terkunci</span>
                <span className="text-xs">🔒</span>
              </div>
            )}
          </motion.div>

          {/* Card 2: Nyadaran (Blue Medal) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleBadgeClick(missionBadges[1])}
            className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-3xl p-4 flex flex-col items-center justify-between text-center shadow-md relative hover:shadow-xl transition-all cursor-pointer select-none"
          >
            {/* Badge Medal Illustration - Blue Theme */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center my-2 flex-shrink-0 select-none">
              <div className="absolute -bottom-2 flex gap-1 z-0">
                <div className="w-4 h-9 bg-gradient-to-b from-[#60a5fa] via-[#2563eb] to-[#1e3a8a] rounded-b-xs transform -rotate-12 border border-[#1e3a8a] shadow-xs" />
                <div className="w-4 h-9 bg-gradient-to-b from-[#60a5fa] via-[#2563eb] to-[#1e3a8a] rounded-b-xs transform rotate-12 border border-[#1e3a8a] shadow-xs" />
              </div>
              <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#93c5fd] via-[#2563eb] to-[#1e388a] border-4 border-[#e0f2fe] shadow-xl flex items-center justify-center ring-2 ring-[#1e3a8a]">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#60a5fa] via-[#1d4ed8] to-[#172554] border-2 border-[#f0f9ff] flex items-center justify-center shadow-inner text-2xl sm:text-3xl text-[#e0f2fe]">
                  ⭐
                </div>
              </div>
            </div>

            <h3 className="font-['Fredoka'] font-extrabold text-xs sm:text-sm text-[#3a2718] mt-1 mb-1 leading-snug">
              {missionBadges[1].name}
            </h3>

            <p className="text-[#7a6450] text-[11px] sm:text-xs font-['Nunito'] font-bold leading-tight mb-3">
              {missionBadges[1].desc}
            </p>

            {missionBadges[1].isUnlocked ? (
              <div className="bg-[#e2ead8] text-[#256c3a] border border-[#b8d4aa] rounded-full px-5 py-1 text-xs font-['Fredoka'] font-extrabold flex items-center justify-center gap-1.5 shadow-xs w-full max-w-[140px]">
                <span>Selesai</span>
                <span className="text-xs">✔</span>
              </div>
            ) : (
              <div className="bg-gray-200 text-gray-500 border border-gray-300 rounded-full px-5 py-1 text-xs font-['Fredoka'] font-extrabold flex items-center justify-center gap-1.5 shadow-xs w-full max-w-[140px]">
                <span>Terkunci</span>
                <span className="text-xs">🔒</span>
              </div>
            )}
          </motion.div>

          {/* Card 3: Ledhug Suro (Purple Medal) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleBadgeClick(missionBadges[2])}
            className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-3xl p-4 flex flex-col items-center justify-between text-center shadow-md relative hover:shadow-xl transition-all cursor-pointer select-none"
          >
            {/* Badge Medal Illustration - Purple Theme */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center my-2 flex-shrink-0 select-none">
              <div className="absolute -bottom-2 flex gap-1 z-0">
                <div className="w-4 h-9 bg-gradient-to-b from-[#c084fc] via-[#7c3aed] to-[#4c1d95] rounded-b-xs transform -rotate-12 border border-[#4c1d95] shadow-xs" />
                <div className="w-4 h-9 bg-gradient-to-b from-[#c084fc] via-[#7c3aed] to-[#4c1d95] rounded-b-xs transform rotate-12 border border-[#4c1d95] shadow-xs" />
              </div>
              <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#d8b4fe] via-[#7c3aed] to-[#4c1d95] border-4 border-[#f3e8ff] shadow-xl flex items-center justify-center ring-2 ring-[#4c1d95]">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#a855f7] via-[#6d28d9] to-[#3b0764] border-2 border-[#faf5ff] flex items-center justify-center shadow-inner text-2xl sm:text-3xl text-[#f3e8ff]">
                  ⭐
                </div>
              </div>
            </div>

            <h3 className="font-['Fredoka'] font-extrabold text-xs sm:text-sm text-[#3a2718] mt-1 mb-1 leading-snug">
              {missionBadges[2].name}
            </h3>

            <p className="text-[#7a6450] text-[11px] sm:text-xs font-['Nunito'] font-bold leading-tight mb-3">
              {missionBadges[2].desc}
            </p>

            {missionBadges[2].isUnlocked ? (
              <div className="bg-[#e2ead8] text-[#256c3a] border border-[#b8d4aa] rounded-full px-5 py-1 text-xs font-['Fredoka'] font-extrabold flex items-center justify-center gap-1.5 shadow-xs w-full max-w-[140px]">
                <span>Selesai</span>
                <span className="text-xs">✔</span>
              </div>
            ) : (
              <div className="bg-gray-200 text-gray-500 border border-gray-300 rounded-full px-5 py-1 text-xs font-['Fredoka'] font-extrabold flex items-center justify-center gap-1.5 shadow-xs w-full max-w-[140px]">
                <span>Terkunci</span>
                <span className="text-xs">🔒</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Lower Row: 2 Achievement Cards Grid with High-Contrast Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-4xl mx-auto my-1 flex-shrink-0">
          {achievementBadges.map((badge) => {
            const current = badge.progressCurrent || 0;
            const total = badge.progressTotal || 1;
            const percent = Math.min(100, Math.max(5, (current / total) * 100));

            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBadgeClick(badge)}
                className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-3xl p-3.5 sm:p-4 shadow-md flex items-start gap-3 relative overflow-hidden select-none cursor-pointer hover:shadow-xl transition-all"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#f5ebd6] border border-[#e8dcb8] flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-xs">
                  {badge.id === "a1" ? (
                    <Search size={26} className="text-[#2563eb]" />
                  ) : (
                    <Trophy size={26} className="text-[#d97706]" />
                  )}
                </div>

                {/* Text Info & Progress Bar */}
                <div className="flex-1 min-w-0 text-left space-y-1.5 w-full">
                  <h3 className="font-['Fredoka'] font-extrabold text-xs sm:text-sm text-[#3a2718] leading-tight">
                    {badge.name}
                  </h3>
                  <p className="text-[#7a6450] text-[11px] font-['Nunito'] font-bold leading-tight line-clamp-2">
                    {badge.desc}
                  </p>

                  {/* Progress Bar Track & Count Label */}
                  <div className="w-full flex items-center gap-3 pt-1">
                    <div className="flex-1 h-3.5 bg-[#e5dabe] border border-[#d1c29e] rounded-full overflow-hidden p-0.5 shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          badge.id === "a1"
                            ? "bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#1d4ed8]"
                            : "bg-gradient-to-r from-[#4ade80] via-[#256c3a] to-[#14532d]"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="font-['Fredoka'] font-extrabold text-xs sm:text-sm text-[#59432e] flex-shrink-0">
                      {current} / {total}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Badge Detail Modal Popup */}
      <AnimatePresence>
        {selectedBadge && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-3xl max-w-sm w-full p-6 relative shadow-2xl text-center flex flex-col items-center select-none"
            >
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 text-[#7a6450] hover:text-[#3a2718] p-1 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="w-20 h-20 rounded-full bg-[#f5ebd6] border-2 border-[#e8dcb8] flex items-center justify-center text-4xl mb-3 shadow-md">
                {selectedBadge.emoji}
              </div>

              <h3 className="font-['Fredoka'] font-extrabold text-lg text-[#3a2718] mb-1 leading-snug">
                {selectedBadge.name}
              </h3>

              <div className="bg-[#fcfaf5] rounded-2xl p-3.5 border border-[#e2d6b9] text-xs text-[#59432e] leading-relaxed mb-3 w-full font-['Nunito'] font-bold">
                {selectedBadge.desc}
              </div>

              <div className="bg-[#eaf4ea] rounded-2xl p-3.5 border border-[#c4e0c4] text-xs text-[#235430] w-full flex items-start gap-2 text-left">
                <CheckCircle size={16} className="text-[#256c3a] flex-shrink-0 mt-0.5" />
                <div className="font-['Nunito'] font-bold">
                  <span className="font-['Fredoka'] font-extrabold block text-[11px] text-[#256c3a] uppercase tracking-wider">Syarat Kriteria:</span>
                  <span>{selectedBadge.criteria}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="mt-5 w-full bg-[#256c3a] hover:bg-[#1c562e] text-white font-['Fredoka'] font-extrabold py-2.5 rounded-full text-sm shadow-md transition-colors cursor-pointer"
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
