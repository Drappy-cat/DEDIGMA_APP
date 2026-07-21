import React from "react";
import { motion } from "motion/react";
import { LogOut, HelpCircle, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext";
import { MascotDimas, MascotGita } from "../components/Mascot";
import { Btn } from "../components/Btn";

interface SplashScreenProps {
  onMulai: () => void;
  onPetunjuk: () => void;
  onProfil: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onMulai, onPetunjuk, onProfil }) => {
  const { userName, logout } = useAuth();
  const { playSFX } = useAudio();

  const handleLogout = () => {
    playSFX("click");
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 via-blue-400 to-cyan-300 flex flex-col overflow-hidden relative select-none">
      {/* Top bar */}
      <div className="flex justify-between items-center px-4 pt-4 relative z-20">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-sm">
          <span className="font-['Nunito'] font-bold text-white text-sm">👋 Halo, {userName}!</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white/20 rounded-2xl p-2 hover:bg-white/30 transition-colors cursor-pointer text-white shadow-sm"
          aria-label="Keluar"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Mountains decoration */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-green-700 to-green-500 z-0"
        style={{
          clipPath: "polygon(0 60%, 15% 30%, 30% 50%, 50% 10%, 70% 40%, 85% 20%, 100% 45%, 100% 100%, 0 100%)"
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-green-800 to-green-600 z-0"
        style={{
          clipPath: "polygon(0 70%, 20% 45%, 40% 60%, 60% 30%, 80% 50%, 100% 35%, 100% 100%, 0 100%)"
        }}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-2"
        >
          <div className="bg-white/20 backdrop-blur rounded-3xl px-6 py-4 mb-4 inline-block shadow-lg border border-white/10">
            <h1 className="font-['Fredoka'] font-bold text-5xl text-white drop-shadow-lg leading-tight">DEDIGMA</h1>
            <p className="font-['Fredoka'] font-semibold text-blue-100 text-xs tracking-wider">
              DETEKTIF DIGITAL BUDAYA MAGETAN
            </p>
          </div>
          <p className="font-['Nunito'] text-white/95 text-base font-bold max-w-xs mx-auto leading-relaxed drop-shadow-sm">
            🔍 Jelajahi Budaya, Temukan Fakta, Lestarikan Warisan!
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-end gap-8 my-6"
        >
          <MascotDimas size="lg" />
          <MascotGita size="lg" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 w-full max-w-xs"
        >
          <Btn onClick={onMulai} variant="amber" className="w-full text-2xl py-4 flex items-center justify-center shadow-lg">
            🗺️ MULAI
          </Btn>
          <div className="grid grid-cols-2 gap-3">
            <Btn onClick={onPetunjuk} variant="secondary" className="flex items-center justify-center gap-2 py-3 shadow-md">
              <HelpCircle size={18} /> Petunjuk
            </Btn>
            <Btn onClick={onProfil} variant="secondary" className="flex items-center justify-center gap-2 py-3 shadow-md">
              <Users size={18} /> Profil
            </Btn>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default SplashScreen;
