import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Target, BookOpen, Shield, Lightbulb, ChevronRight } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
import { MascotDimas, MascotGita } from "../components/Mascot";
import { Btn } from "../components/Btn";
import { useAudio } from "../contexts/AudioContext";

interface TujuanScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const tujuanItems = [
  {
    icon: <BookOpen size={20} className="text-blue-500" />,
    title: "Mengenal Kearifan Lokal Magetan",
    desc: "Mempelajari tradisi Larung Sesaji, Nyadaran, dan Ledhug Suro sebagai warisan budaya Kabupaten Magetan.",
    color: "bg-blue-50 border-blue-200"
  },
  {
    icon: <Shield size={20} className="text-emerald-500" />,
    title: "Literasi Digital & Anti-Hoax",
    desc: "Mengembangkan kemampuan berpikir kritis dalam menyaring, memverifikasi fakta, dan menganalisis sumber informasi digital.",
    color: "bg-emerald-50 border-emerald-200"
  },
  {
    icon: <Target size={20} className="text-amber-500" />,
    title: "Detektif Digital Budaya",
    desc: "Menjadi Detektif Digital yang mampu membedakan berita fakta dari hoaks terkait budaya lokal.",
    color: "bg-amber-50 border-amber-200"
  },
  {
    icon: <Lightbulb size={20} className="text-purple-500" />,
    title: "Refleksi & Pelestarian Budaya",
    desc: "Menumbuhkan rasa cinta terhadap budaya lokal melalui refleksi dan apresiasi nilai-nilai luhur.",
    color: "bg-purple-50 border-purple-200"
  }
];

const indikator = [
  "Siswa mampu menjelaskan pengertian, sejarah, dan tujuan tradisi budaya Magetan.",
  "Siswa mampu memilah informasi benar dan keliru terkait budaya lokal.",
  "Siswa mampu menganalisis kredibilitas sumber informasi digital.",
  "Siswa mampu mengklasifikasikan berita fakta dan hoaks secara kritis.",
  "Siswa mampu merefleksikan nilai-nilai luhur budaya untuk kehidupan sehari-hari."
];

export const TujuanScreen: React.FC<TujuanScreenProps> = ({ onNext, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();

  useEffect(() => {
    playNarrator(
      "Berikut adalah tujuan pembelajaran DEDIGMA. Kamu akan menjelajahi tiga misi budaya Magetan sambil mengasah kemampuan literasi digital. Siap menjadi Detektif Digital?"
    );
    return () => {
      stopNarrator();
    };
  }, []);

  const handleNext = () => {
    playSFX("click");
    onNext();
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden font-['Nunito']"
      style={{
        backgroundImage: "url('/assets/bg-lobby.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <ScreenHeader title="Tujuan Pembelajaran 🎯" onBack={onBack} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* Mascot intro */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 items-start"
        >
          <MascotGita size="sm" animate={true} />
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex-1 shadow-md border border-purple-100">
            <p className="text-purple-800 text-xs leading-relaxed font-semibold">
              Hai! Aku Gita. Sebelum memulai petualangan, yuk pahami dulu tujuan pembelajaran kita! 🌟
            </p>
          </div>
        </motion.div>

        {/* Capaian Pembelajaran */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-4 border border-blue-100/40"
        >
          <h3 className="font-['Fredoka'] font-bold text-blue-700 text-base mb-3 flex items-center gap-1.5">
            <Target size={18} className="text-blue-500" /> Capaian Pembelajaran
          </h3>
          <div className="space-y-3">
            {tujuanItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className={`rounded-2xl p-3 flex items-start gap-3 border shadow-sm ${item.color}`}
              >
                <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="font-['Fredoka'] font-bold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-600 text-[11px] leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Indikator Pembelajaran */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-4 border border-amber-100/40"
        >
          <h3 className="font-['Fredoka'] font-bold text-amber-700 text-base mb-3 flex items-center gap-1.5">
            📋 Indikator Pembelajaran
          </h3>
          <div className="space-y-2">
            {indikator.map((ind, i) => (
              <motion.div
                key={i}
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.55 + i * 0.06 }}
                className="flex items-start gap-2.5 bg-amber-50/60 rounded-xl p-2.5 border border-amber-100/30"
              >
                <span className="bg-amber-400 text-white font-['Fredoka'] font-bold w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 select-none shadow-sm">
                  {i + 1}
                </span>
                <p className="text-gray-700 text-xs leading-relaxed">{ind}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mascot encouragement */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3 items-start"
        >
          <MascotDimas size="sm" animate={true} />
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex-1 shadow-md border border-blue-100">
            <p className="text-blue-800 text-xs leading-relaxed font-semibold">
              Yuk mulai petualangan! Selesaikan 3 misi budaya Magetan dan buktikan bahwa kamu adalah Detektif Digital sejati! 🔍🏆
            </p>
          </div>
        </motion.div>
      </div>

      {/* Sticky footer */}
      <div className="p-4 bg-transparent flex-shrink-0 flex justify-center">
        <Btn onClick={handleNext} variant="lanjut" />
      </div>
    </div>
  );
};
export default TujuanScreen;
