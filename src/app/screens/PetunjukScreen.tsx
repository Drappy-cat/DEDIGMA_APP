import React, { useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { useAudio } from "../contexts/AudioContext";
import { ScreenHeader } from "../components/ScreenHeader";
import { MascotDimas, MascotGita } from "../components/Mascot";
import { SkyBg } from "../components/SkyBg";

interface PetunjukScreenProps {
  onBack: () => void;
}

export const PetunjukScreen: React.FC<PetunjukScreenProps> = ({ onBack }) => {
  const { playNarrator, stopNarrator } = useAudio();

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

  return (
    <SkyBg>
      <ScreenHeader title="Petunjuk Penggunaan 📋" onBack={onBack} />
      <div className="p-4 space-y-4 max-w-2xl mx-auto overflow-y-auto">
        <div className="flex gap-4 items-start">
          <MascotDimas size="sm" />
          <div className="bg-white rounded-2xl p-3 shadow-md flex-1 border border-blue-100">
            <p className="font-['Nunito'] text-blue-800 text-sm leading-relaxed">
              Halo! Aku Dimas. Baca petunjuk ini supaya kamu bisa menggunakan DEDIGMA dengan mudah! 😊
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-4 border border-blue-100/40">
          <h3 className="font-['Fredoka'] font-semibold text-blue-700 text-lg mb-3 flex items-center gap-1.5">
            <HelpCircle className="text-blue-500" size={20} /> Fungsi Tombol
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {buttons.map((b, i) => (
              <div key={i} className="bg-blue-50/70 rounded-2xl p-3 flex items-start gap-2.5 border border-blue-100/20">
                <span className="text-2xl select-none">{b.icon}</span>
                <div>
                  <p className="font-['Fredoka'] font-semibold text-blue-700 text-sm">{b.label}</p>
                  <p className="font-['Nunito'] text-gray-500 text-xs leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-4 border border-blue-100/40">
          <h3 className="font-['Fredoka'] font-semibold text-blue-700 text-lg mb-3">Cara Mengerjakan Aktivitas</h3>
          <div className="space-y-2.5">
            {cara.map((c, i) => (
              <div key={i} className="flex items-start gap-3 bg-amber-50/60 rounded-2xl p-3 border border-amber-100/30">
                <span className="bg-amber-400 text-white font-['Fredoka'] font-bold w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 select-none shadow-sm">
                  {i + 1}
                </span>
                <p className="font-['Nunito'] text-gray-700 text-sm leading-relaxed">{c}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-8 py-2">
          <MascotDimas size="sm" />
          <MascotGita size="sm" />
        </div>
      </div>
    </SkyBg>
  );
};
export default PetunjukScreen;
