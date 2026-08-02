import React, { useEffect } from "react";
import { HelpCircle, Home, BookOpen, ArrowLeft, Star, ArrowRight, Award } from "lucide-react";
import { motion } from "motion/react";
import { useAudio } from "../contexts/AudioContext";
import { ScreenHeader } from "../components/ScreenHeader";
import { MascotDimas, MascotGita } from "../components/Mascot";

interface PetunjukScreenProps {
  onBack: () => void;
  onNext?: () => void;
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

export const PetunjukScreen: React.FC<PetunjukScreenProps> = ({ onBack, onNext }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();

  const buttons = [
    { icon: <Home className="text-blue-600" size={20} />, label: "Tombol Beranda", desc: "Kembali ke halaman utama" },
    { icon: <BookOpen className="text-emerald-600" size={20} />, label: "Tombol Materi", desc: "Membuka materi budaya" },
    { icon: <ArrowLeft className="text-amber-600" size={20} />, label: "Tombol Kembali", desc: "Kembali ke halaman sebelumnya" },
    { icon: <Star className="text-purple-600" size={20} />, label: "Tombol Aktivitas", desc: "Membuka halaman aktivitas" },
    { icon: <ArrowRight className="text-cyan-600" size={20} />, label: "Tombol Lanjut", desc: "Melanjutkan ke halaman berikutnya" },
    { icon: <Award className="text-amber-500" size={20} />, label: "Tombol Lencana", desc: "Melihat lencana yang kamu dapatkan" }
  ];

  const cara = [
    "Baca materi budaya dengan teliti sebelum mengerjakan aktivitas.",
    "Kerjakan semua aktivitas secara berurutan dari Misi 1 hingga Misi 3.",
    "Selesaikan semua misi untuk mendapatkan sertifikat digital."
  ];

  // Play narration on enter
  useEffect(() => {
    playNarrator("Halo! Aku Dimas. Baca petunjuk ini supaya kamu bisa menggunakan DEDIGMA dengan mudah!");
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
      className="h-full flex flex-col overflow-hidden"
      style={{
        backgroundImage: "url('/assets/bg-lobby.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <ScreenHeader title="Petunjuk Penggunaan" onBack={onBack} onHome={onBack} />
      <div className="flex-1 p-4 space-y-4 max-w-2xl mx-auto overflow-y-auto w-full custom-scrollbar">
        {/* Dimas & Popup Chat */}
        <motion.div 
          className="flex gap-4 items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MascotDimas size="sm" animate={true} interactive={false} />
          <motion.div 
            className="bg-white rounded-2xl p-3.5 shadow-md flex-1 border border-blue-100 origin-top-left"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
          >
            <p className="font-['Nunito'] text-blue-900 font-semibold text-sm leading-relaxed">
              <TypedText text="Halo! Aku Dimas. Baca petunjuk ini supaya kamu bisa menggunakan DEDIGMA dengan mudah!" delay={0.4} />
            </p>
          </motion.div>
        </motion.div>

        {/* Fungsi Tombol */}
        <motion.div 
          className="bg-white rounded-3xl shadow-lg p-4 border border-blue-100/40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <h3 className="font-['Fredoka'] font-bold text-blue-700 text-lg mb-3 flex items-center gap-2">
            <HelpCircle className="text-blue-500" size={20} /> Fungsi Tombol Navigasi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {buttons.map((b, i) => (
              <motion.div 
                key={i} 
                className="bg-blue-50/70 rounded-2xl p-3 flex items-start gap-3 border border-blue-100/30"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.4 + (i * 0.08) }}
              >
                <span className="p-2 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                  {b.icon}
                </span>
                <div>
                  <p className="font-['Fredoka'] font-bold text-blue-800 text-sm">{b.label}</p>
                  <p className="font-['Nunito'] text-gray-500 text-xs leading-relaxed mt-0.5">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cara Mengerjakan */}
        <motion.div 
          className="bg-white rounded-3xl shadow-lg p-4 border border-blue-100/40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 2.0 }}
        >
          <h3 className="font-['Fredoka'] font-bold text-blue-700 text-lg mb-3">Cara Mengerjakan Aktivitas</h3>
          <div className="space-y-2.5">
            {cara.map((c, i) => (
              <motion.div 
                key={i} 
                className="flex items-start gap-3 bg-amber-50/60 rounded-2xl p-3 border border-amber-100/30"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 2.2 + (i * 0.1) }}
              >
                <span className="bg-amber-400 text-white font-['Fredoka'] font-bold w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 select-none shadow-sm">
                  {i + 1}
                </span>
                <p className="font-['Nunito'] text-gray-700 text-sm leading-relaxed">{c}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="flex justify-center gap-8 py-2">
          <MascotDimas size="sm" animate={true} interactive={false} />
          <MascotGita size="sm" animate={true} interactive={false} />
        </div>
      </div>

      <motion.div 
        className="px-6 py-3 bg-transparent flex-shrink-0 flex justify-between w-full"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 2.6 }}
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
export default PetunjukScreen;
