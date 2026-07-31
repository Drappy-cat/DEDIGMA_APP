import React, { useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { useAudio } from "../contexts/AudioContext";
import { ScreenHeader } from "../components/ScreenHeader";
import { MascotDimas, MascotGita } from "../components/Mascot";
import { Btn } from "../components/Btn";

interface PetunjukScreenProps {
  onBack: () => void;
  onNext?: () => void;
}

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
      <ScreenHeader title="Petunjuk Penggunaan 📋" onBack={onBack} onHome={onBack} />
      <div className="flex-1 px-4 py-2 space-y-2 max-w-2xl mx-auto overflow-y-auto w-full">
        <div className="flex gap-3 items-start">
          <MascotDimas size="sm" />
          <div className="bg-white rounded-2xl p-2.5 shadow-md flex-1 border border-blue-100">
            <p className="font-['Nunito'] text-blue-800 text-sm leading-relaxed">
              Halo! Aku Dimas. Baca petunjuk ini supaya kamu bisa menggunakan DEDIGMA dengan mudah! 😊
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-3 border border-blue-100/40">
          <h3 className="font-['Fredoka'] font-semibold text-blue-700 text-base mb-2 flex items-center gap-1.5">
            <HelpCircle className="text-blue-500" size={18} /> Fungsi Tombol
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {buttons.map((b, i) => (
              <div key={i} className="bg-blue-50/70 rounded-2xl p-2 flex items-start gap-2 border border-blue-100/20">
                <span className="text-xl select-none">{b.icon}</span>
                <div>
                  <p className="font-['Fredoka'] font-semibold text-blue-700 text-[13px]">{b.label}</p>
                  <p className="font-['Nunito'] text-gray-500 text-[11px] leading-tight">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-3 border border-blue-100/40">
          <h3 className="font-['Fredoka'] font-semibold text-blue-700 text-base mb-2">Cara Mengerjakan Aktivitas</h3>
          <div className="space-y-1.5">
            {cara.map((c, i) => (
              <div key={i} className="flex items-start gap-2 bg-amber-50/60 rounded-2xl p-2 border border-amber-100/30">
                <span className="bg-amber-400 text-white font-['Fredoka'] font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 select-none shadow-sm">
                  {i + 1}
                </span>
                <p className="font-['Nunito'] text-gray-700 text-[13px] leading-tight">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-2 bg-transparent flex-shrink-0 flex justify-between w-full">
        {onBack ? (
          <button
            onClick={onBack}
            className="transition-transform cursor-pointer hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Kembali"
          >
            <img
              src="/assets/button/back.svg"
              alt="Tombol Kembali"
              className="w-10 sm:w-16 h-auto object-contain drop-shadow-md"
            />
          </button>
        ) : <div className="w-10 sm:w-16" />}
        {onNext && (
          <button
            onClick={handleNext}
            className="transition-transform cursor-pointer hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Lanjut"
          >
            <img
              src="/assets/button/next.svg"
              alt="Tombol Lanjut"
              className="w-10 sm:w-16 h-auto object-contain drop-shadow-md"
            />
          </button>
        )}
      </div>
    </div>
  );
};
export default PetunjukScreen;
