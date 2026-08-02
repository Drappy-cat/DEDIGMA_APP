import React, { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { motion } from "motion/react";
import { useAudio } from "../contexts/AudioContext";
import { ScreenHeader } from "../components/ScreenHeader";

interface PetunjukScreenProps {
  onBack: () => void;
  onNext?: () => void;
}

const TypedText: React.FC<{ text: string; delay?: number; speed?: number }> = ({
  text,
  delay = 0.3,
  speed = 0.045
}) => {
  return (
    <span>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.04, delay: delay + index * speed }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

export const PetunjukScreen: React.FC<PetunjukScreenProps> = ({ onBack, onNext }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();

  const buttons = [
    { icon: "🏠", label: "Tombol Beranda", desc: "Kembali ke halaman utama" },
    { icon: "📖", label: "Tombol Materi", desc: "Membuka materi budaya" },
    { icon: "⬅️", label: "Tombol Kembali", desc: "Kembali ke halaman sebelumnya" },
    { icon: "⭐", label: "Tombol Aktivitas", desc: "Membuka halaman aktivitas" },
    { icon: "➡️", label: "Tombol Lanjut", desc: "Melanjutkan ke halaman berikutnya" },
    { icon: "🏅", label: "Tombol Lencana", desc: "Melihat lencana yang kamu dapatkan" }
  ];

  const cara = [
    "Baca materi budaya dengan teliti sebelum mengerjakan aktivitas.",
    "Kerjakan semua aktivitas secara berurutan dari Misi 1 hingga Misi 3.",
    "Setiap keberhasilan akan menambah poin dan lencana.",
    "Selamat bermain dan selamat belajar! Semoga kamu jadi juara! 🎉"
  ];

  // Play Dimas narration on enter using local mp3 audio file
  useEffect(() => {
    playNarrator(
      "Halo! Aku Dimas. Baca petunjuk ini supaya kamu bisa menggunakan game ini dengan mudah!",
      "/assets/voice/revisi-dimas.mp3"
    );
    return () => {
      stopNarrator();
    };
  }, []);

  const handleNext = () => {
    playSFX("click");
    if (onNext) onNext();
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
        <ScreenHeader title="Petunjuk Penggunaan" onBack={onBack} onHome={onBack} />
      </div>

      {/* Main Parchment Scrollable Area */}
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

            {/* Wooden Header Sign */}
            <div className="flex justify-center mb-4">
              <div className="bg-[#7e371b] border-2 border-[#572410] rounded-2xl py-1.5 px-6 shadow-md border-b-4 border-r-2 flex items-center justify-center">
                <h1 className="font-['Fredoka'] font-extrabold text-xl sm:text-2xl text-white tracking-wider drop-shadow-md">
                  PETUNJUK PENGGUNAAN
                </h1>
              </div>
            </div>

            {/* Mascot & Speech Bubble */}
            <motion.div
              className="flex items-center gap-3 sm:gap-4 mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Dimas Mascot Image */}
              <div className="flex-shrink-0">
                <img
                  src="/assets/mascot/Dimas-Petunjuk.svg"
                  alt="Dimas Petunjuk"
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
                  <TypedText text="Halo! Aku Dimas. Baca petunjuk ini supaya kamu bisa menggunakan game ini dengan mudah! 😊" delay={0.4} />
                </p>
                
                {/* Manual Audio Play Button */}
                <button 
                  onClick={() => playNarrator("Halo! Aku Dimas. Baca petunjuk ini supaya kamu bisa menggunakan game ini dengan mudah!", "/assets/voice/revisi-dimas.mp3")}
                  className="absolute top-2 right-2 p-1.5 bg-[#f0e6d2] text-[#7e371b] hover:bg-[#e6dbbf] rounded-full transition-colors active:scale-95 border border-[#d9c5a3] shadow-sm"
                  aria-label="Putar Suara"
                >
                  <Volume2 size={16} />
                </button>
              </motion.div>
            </motion.div>

            {/* SECTION 1: FUNGSI TOMBOL */}
            <div className="bg-[#e6dbbf]/70 border-2 border-[#d0c09d] rounded-2xl p-3 sm:p-4 relative mt-5 pt-6 shadow-xs">
              {/* Top Green Ribbon Banner */}
              <div className="absolute -top-3 left-4 bg-[#366635] text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm py-0.5 px-4 rounded-lg shadow-sm border border-[#244723]">
                FUNGSI TOMBOL
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {buttons.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="bg-[#f6eed9] border border-[#d8c7a5] rounded-2xl p-2.5 flex items-center gap-3 shadow-xs"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#366635] text-white flex items-center justify-center text-lg flex-shrink-0 border border-[#244723] shadow-xs">
                      <span>{b.icon}</span>
                    </div>
                    <div>
                      <p className="font-['Fredoka'] font-bold text-[#366635] text-xs sm:text-sm">{b.label}</p>
                      <p className="font-['Nunito'] font-semibold text-[#5c4a3a] text-[11px] leading-snug">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SECTION 2: CARA MENGERJAKAN AKTIVITAS */}
            <div className="bg-[#e6dbbf]/70 border-2 border-[#d0c09d] rounded-2xl p-3 sm:p-4 relative mt-6 pt-6 shadow-xs">
              {/* Top Green Ribbon Banner */}
              <div className="absolute -top-3 left-4 bg-[#366635] text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm py-0.5 px-4 rounded-lg shadow-sm border border-[#244723]">
                CARA MENGERJAKAN AKTIVITAS
              </div>

              <div className="space-y-2">
                {cara.map((text, i) => (
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
                      {text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

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

export default PetunjukScreen;
