import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Volume2 } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
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
          transition={{ duration: 0.04, delay: delay + index * 0.025 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const tujuanItems = [
  {
    icon: "📖",
    title: "Mengenal Kearifan Lokal Magetan",
    desc: "Mempelajari tradisi Larung Sesaji, Nyadaran, dan Ledhug Suro sebagai warisan budaya Kabupaten Magetan."
  },
  {
    icon: "🛡️",
    title: "Literasi Digital & Anti-Hoax",
    desc: "Mengembangkan kemampuan berpikir kritis dalam menyaring, memverifikasi fakta, dan menganalisis sumber informasi."
  },
  {
    icon: "🎯",
    title: "Detektif Digital Budaya",
    desc: "Menjadi Detektif Digital yang mampu membedakan berita fakta dari hoaks terkait budaya lokal."
  },
  {
    icon: "💡",
    title: "Refleksi & Pelestarian Budaya",
    desc: "Menumbuhkan rasa cinta terhadap budaya lokal melalui refleksi dan apresiasi nilai-nilai luhur."
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
      className="h-full flex flex-col overflow-hidden select-none font-['Nunito'] relative"
      style={{
        backgroundImage: "url('/assets/bg-login.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/35 z-0" />

      {/* Screen Header */}
      <div className="relative z-20">
        <ScreenHeader title="Tujuan Pembelajaran" onBack={onBack} />
      </div>

      {/* Main Scrollable Content Area */}
      <div className="flex-1 w-full max-w-4xl mx-auto p-3 sm:p-5 relative z-10 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

        {/* Outer Wooden Signpost Board Frame */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#6b3117] border-4 border-[#451e0c] rounded-[2.5rem] p-2.5 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative"
        >
          {/* Main Parchment Paper Board */}
          <div className="bg-[#f4ecd5] border-2 border-[#c2aa84] rounded-3xl p-4 sm:p-6 relative overflow-hidden">

            {/* Decorative Blue Pins */}
            <div className="absolute top-3 left-3 text-xl opacity-80">📌</div>
            <div className="absolute top-3 right-3 text-xl opacity-80">📌</div>

            {/* Wooden Header Sign Banner */}
            <div className="flex justify-center mb-4">
              <div className="bg-[#7e371b] border-2 border-[#572410] rounded-2xl py-1.5 px-6 shadow-md border-b-4 border-r-2 flex items-center justify-center">
                <h1 className="font-['Fredoka'] font-extrabold text-xl sm:text-2xl text-white tracking-wider drop-shadow-md">
                  TUJUAN PEMBELAJARAN
                </h1>
              </div>
            </div>

            {/* Mascot Gita & Speech Bubble */}
            <motion.div
              className="flex items-center gap-3 sm:gap-4 mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Gita Mascot Image */}
              <div className="flex-shrink-0">
                <img
                  src="/assets/mascot/Gita-Tujuan.svg"
                  alt="Gita Tujuan"
                  className="w-24 sm:w-32 h-auto object-contain filter drop-shadow-md"
                />
              </div>

              {/* Speech Bubble */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-[#f8f3e6] border-2 border-[#d9c5a3] rounded-2xl p-3 sm:p-4 shadow-sm flex-1 relative text-[#4a3728]"
              >
                {/* Pointer Triangle */}
                <div className="absolute top-5 -left-3 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-[#d9c5a3]" />
                <div className="absolute top-5 -left-2.5 w-0 h-0 border-y-7 border-y-transparent border-r-7 border-r-[#f8f3e6]" />

                <p className="font-['Nunito'] font-bold text-xs sm:text-sm text-[#4a3728] leading-relaxed pr-8">
                  <TypedText text="Hai! Aku Gita. Sebelum memulai petualangan, yuk pahami dulu tujuan pembelajaran kita! 🌟" delay={0.4} />
                </p>

                {/* Manual Audio Play Button */}
                <button 
                  onClick={() => playNarrator("Berikut adalah tujuan pembelajaran DEDIGMA. Kamu akan menjelajahi tiga misi budaya Magetan sambil mengasah kemampuan literasi digital. Siap menjadi Detektif Digital?", "/assets/voice/tujuan-dedigma.mp3")}
                  className="absolute top-2 right-2 p-1.5 bg-[#f0e6d2] text-[#7e371b] hover:bg-[#e6dbbf] rounded-full transition-colors active:scale-95 border border-[#d9c5a3] shadow-sm"
                  aria-label="Putar Suara"
                >
                  <Volume2 size={16} />
                </button>
              </motion.div>
            </motion.div>

            {/* SECTION 1: CAPAIAN PEMBELAJARAN */}
            <div className="bg-[#e6dbbf]/70 border-2 border-[#d0c09d] rounded-2xl p-3 sm:p-4 relative mt-5 pt-6 shadow-xs">
              {/* Top Green Ribbon Banner */}
              <div className="absolute -top-3 left-4 bg-[#366635] text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm py-0.5 px-4 rounded-lg shadow-sm border border-[#244723]">
                CAPAIAN PEMBELAJARAN
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tujuanItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="bg-[#f6eed9] border border-[#d8c7a5] rounded-2xl p-2.5 flex items-start gap-3 shadow-xs"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#366635] text-white flex items-center justify-center text-lg flex-shrink-0 border border-[#244723] shadow-xs mt-0.5">
                      <span>{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-['Fredoka'] font-bold text-[#366635] text-xs sm:text-sm">{item.title}</p>
                      <p className="font-['Nunito'] font-semibold text-[#5c4a3a] text-[11px] leading-snug mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SECTION 2: INDIKATOR PEMBELAJARAN */}
            <div className="bg-[#e6dbbf]/70 border-2 border-[#d0c09d] rounded-2xl p-3 sm:p-4 relative mt-6 pt-6 shadow-xs">
              {/* Top Green Ribbon Banner */}
              <div className="absolute -top-3 left-4 bg-[#366635] text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm py-0.5 px-4 rounded-lg shadow-sm border border-[#244723]">
                INDIKATOR PEMBELAJARAN
              </div>

              <div className="space-y-2">
                {indikator.map((ind, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + i * 0.1 }}
                    className="bg-[#f6eed9] border border-[#d8c7a5] rounded-2xl p-2.5 flex items-center gap-3 shadow-xs"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#df9d3b] text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm flex items-center justify-center flex-shrink-0 border border-[#b87c27] shadow-xs">
                      {i + 1}
                    </div>
                    <p className="font-['Nunito'] font-bold text-[#4a3728] text-xs sm:text-sm leading-snug">
                      {ind}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mascot Dimas Encouragement */}
            <motion.div
              className="flex items-center gap-3 sm:gap-4 mt-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
            >
              <div className="flex-shrink-0">
                <img
                  src="/assets/mascot/Dimas-Petunjuk.svg"
                  alt="Dimas Encouragement"
                  className="w-20 sm:w-24 h-auto object-contain filter drop-shadow-md"
                />
              </div>

              <div className="bg-[#f8f3e6] border-2 border-[#d9c5a3] rounded-2xl p-3 shadow-sm flex-1 relative text-[#4a3728]">
                <div className="absolute top-4 -left-3 w-0 h-0 border-y-7 border-y-transparent border-r-7 border-r-[#d9c5a3]" />
                <div className="absolute top-4 -left-2.5 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-[#f8f3e6]" />
                <p className="font-['Nunito'] font-bold text-xs text-[#4a3728] leading-relaxed">
                  <TypedText text="Yuk mulai petualangan! Selesaikan 3 misi budaya Magetan dan buktikan bahwa kamu adalah Detektif Digital sejati! 🔍🏆" delay={1.7} />
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Navigation Buttons */}
      <div className="relative z-20 px-4 sm:px-8 py-2 flex justify-between items-center w-full max-w-4xl mx-auto flex-shrink-0 pointer-events-auto">
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
        ) : <div />}

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
      </div>
    </div>
  );
};

export default TujuanScreen;
