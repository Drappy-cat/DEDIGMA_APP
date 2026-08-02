import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Target, BookOpen, Shield, Lightbulb, Volume2 } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
import { MascotDimas, MascotGita } from "../components/Mascot";
import { useAudio } from "../contexts/AudioContext";

interface TujuanScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const TypedText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  return (
    <span>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.03, delay: delay + index * 0.02 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

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
    // Autoplay attempt
    playNarrator(
      "Berikut adalah tujuan pembelajaran DEDIGMA. Kamu akan menjelajahi tiga misi budaya Magetan sambil mengasah kemampuan literasi digital. Siap menjadi Detektif Digital?",
      "/assets/voice/tujuan-dedigma.mp3"
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
        backgroundImage: "url('/assets/bg-lobby.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <ScreenHeader title="Tujuan Pembelajaran" onBack={onBack} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full custom-scrollbar">
        {/* Mascot intro */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-3 items-start"
        >
          <MascotGita size="sm" animate={true} interactive={false} />
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex-1 shadow-md border border-purple-100 origin-top-left relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
          >
            <p className="text-purple-800 text-xs leading-relaxed font-semibold pr-8">
              <TypedText text="Hai! Aku Gita. Sebelum memulai petualangan, yuk pahami dulu tujuan pembelajaran kita!" delay={0.4} />
            </p>
            <button 
              onClick={() => playNarrator("Berikut adalah tujuan pembelajaran DEDIGMA. Kamu akan menjelajahi tiga misi budaya Magetan sambil mengasah kemampuan literasi digital. Siap menjadi Detektif Digital?", "/assets/voice/tujuan-dedigma.mp3")}
              className="absolute top-2 right-2 p-1.5 bg-purple-50 text-purple-500 hover:bg-purple-100 hover:text-purple-600 rounded-full transition-colors active:scale-95"
              aria-label="Putar Suara"
            >
              <Volume2 size={16} />
            </button>
          </motion.div>
        </motion.div>

        {/* Capaian Pembelajaran */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
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
                transition={{ duration: 0.3, delay: 1.4 + i * 0.08 }}
                className={`rounded-2xl p-3 flex items-start gap-3 border shadow-sm ${item.color}`}
              >
                <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="font-['Fredoka'] font-bold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-600 text-xs leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Indikator Pembelajaran */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.8 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-4 border border-amber-100/40"
        >
          <h3 className="font-['Fredoka'] font-bold text-amber-700 text-base mb-3 flex items-center gap-1.5">
            Indikator Pembelajaran
          </h3>
          <div className="space-y-2">
            {indikator.map((ind, i) => (
              <motion.div
                key={i}
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 2.0 + i * 0.08 }}
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 2.5 }}
          className="flex gap-3 items-start"
        >
          <MascotDimas size="sm" animate={true} interactive={false} />
          <motion.div 
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 flex-1 shadow-md border border-blue-100 origin-top-left"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4, delay: 2.7 }}
          >
            <p className="text-blue-800 text-xs leading-relaxed font-semibold">
              <TypedText text="Yuk mulai petualangan! Selesaikan 3 misi budaya Magetan dan buktikan bahwa kamu adalah Detektif Digital sejati!" delay={2.8} />
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Sticky footer */}
      <motion.div 
        className="px-6 py-3 bg-transparent flex-shrink-0 flex justify-between w-full"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 3.2 }}
      >
        {onBack ? (
          <button
            onClick={onBack}
            className="transition-transform cursor-pointer hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Kembali"
          >
            <img
              src="/assets/button/back.svg"
              alt="Tombol Kembali"
              className="w-12 sm:w-16 h-auto object-contain drop-shadow-md"
            />
          </button>
        ) : <div className="w-12 sm:w-16" />}
        {onNext && (
          <button
            onClick={handleNext}
            className="transition-transform cursor-pointer hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Lanjut"
          >
            <img
              src="/assets/button/next.svg"
              alt="Tombol Lanjut"
              className="w-12 sm:w-16 h-auto object-contain drop-shadow-md"
            />
          </button>
        )}
      </motion.div>
    </div>
  );
};
export default TujuanScreen;
