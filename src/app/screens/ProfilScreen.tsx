import React, { useEffect } from "react";
import { useAudio } from "../contexts/AudioContext";
import { ScreenHeader } from "../components/ScreenHeader";
import { MascotDimas, MascotGita } from "../components/Mascot";


interface ProfilScreenProps {
  onBack: () => void;
}

export const ProfilScreen: React.FC<ProfilScreenProps> = ({ onBack }) => {
  const { playNarrator, stopNarrator } = useAudio();

  useEffect(() => {
    playNarrator("Ini adalah halaman profil pengembang. Di sini kamu bisa berkenalan dengan maskot DEDIGMA, Dimas dan Gita.");
    return () => {
      stopNarrator();
    };
  }, []);

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        backgroundImage: "url('/assets/bg-lobby.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <ScreenHeader title="Profil Pengembang 👩‍💻" onBack={onBack} />
      <div className="p-4 max-w-md mx-auto space-y-4 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-lg p-6 text-center border border-blue-100/30">
          <div className="text-6xl mb-3 select-none">🎓</div>
          <h2 className="font-['Fredoka'] font-bold text-2xl text-blue-700">DEDIGMA</h2>
          <p className="font-['Fredoka'] text-amber-600 font-semibold text-sm">Detektif Digital Budaya Magetan</p>

          <div className="mt-4 bg-blue-50/70 rounded-2xl p-4 text-left space-y-2.5 border border-blue-100/20">
            <p className="font-['Nunito'] text-sm text-gray-600">
              <span className="font-bold text-blue-700">Versi:</span> 1.0.0
            </p>
            <p className="font-['Nunito'] text-sm text-gray-600">
              <span className="font-bold text-blue-700">Jenjang:</span> Sekolah Dasar
            </p>
            <p className="font-['Nunito'] text-sm text-gray-600">
              <span className="font-bold text-blue-700">Mata Pelajaran:</span> Literasi Digital & Budaya
            </p>
            <p className="font-['Nunito'] text-sm text-gray-600">
              <span className="font-bold text-blue-700">Tema:</span> Kearifan Lokal Magetan
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-4 border border-blue-100/30">
          <h3 className="font-['Fredoka'] font-semibold text-blue-700 text-lg mb-3">Maskot DEDIGMA</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50/50 rounded-2xl p-3 text-center border border-blue-100/10 flex flex-col items-center">
              <MascotDimas size="sm" animate={true} />
              <p className="font-['Nunito'] text-[11px] text-gray-600 mt-2 leading-relaxed">
                Mewakili literasi digital. Siswa yang cerdas, kritis, dan bijak menggunakan teknologi.
              </p>
            </div>
            <div className="bg-amber-50/50 rounded-2xl p-3 text-center border border-amber-100/10 flex flex-col items-center">
              <MascotGita size="sm" animate={true} />
              <p className="font-['Nunito'] text-[11px] text-gray-600 mt-2 leading-relaxed">
                Mewakili literasi budaya. Bangga terhadap identitas daerah dan warisan leluhur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilScreen;
