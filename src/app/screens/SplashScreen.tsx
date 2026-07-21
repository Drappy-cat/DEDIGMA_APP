import React, { useState } from "react";
import { motion } from "motion/react";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext";
import { MascotDimas, MascotGita } from "../components/Mascot";

interface SplashScreenProps {
  onMulai: () => void;
  onPetunjuk: () => void;
  onProfil: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onMulai, onPetunjuk, onProfil }) => {
  const { userName, logout } = useAuth();
  const { playSFX } = useAudio();
  const [showPustaka, setShowPustaka] = useState(false);

  const handleLogout = () => {
    playSFX("click");
    logout();
  };

  const handleAction = (callback: () => void) => {
    playSFX("click");
    callback();
  };

  const handlePustakaOpen = () => {
    playSFX("click");
    setShowPustaka(true);
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative select-none"
      style={{
        backgroundImage: "url('/assets/bg-lobby.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Top bar header */}
      <div className="flex justify-between items-center px-4 pt-3 relative z-20 flex-shrink-0">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-1 shadow border border-white/10">
          <span className="font-['Nunito'] font-bold text-white text-xs">👋 Halo, {userName}!</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white/20 hover:bg-white/30 rounded-2xl p-1.5 transition-colors cursor-pointer text-white shadow border border-white/10"
          aria-label="Keluar"
        >
          <LogOut size={14} />
        </button>
      </div>

      {/* Content wrapper: Side-by-side on Landscape / Desktop, vertical on Portrait */}
      <div className="flex-1 flex flex-col landscape:flex-row items-center justify-center gap-6 landscape:gap-14 px-6 py-3 relative z-10 overflow-y-auto landscape:overflow-hidden">
        
        {/* Left Column: Logo & Mascots */}
        <div className="flex flex-col items-center text-center max-w-sm flex-shrink-0">
          {/* Logo Title */}
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-2"
          >
            <img
              src="/assets/logo.png"
              alt="DEDIGMA Logo"
              className="w-16 h-16 mx-auto object-contain filter drop-shadow-md mb-2 animate-pulse"
            />
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-1 mb-1 inline-block border border-white/10">
              <h1 className="font-['Fredoka'] font-bold text-2xl text-white drop-shadow-md leading-none">DEDIGMA</h1>
              <p className="font-['Fredoka'] font-semibold text-yellow-100 text-[8px] tracking-wider mt-0.5">
                DETEKTIF DIGITAL BUDAYA MAGETAN
              </p>
            </div>
            <p className="font-['Nunito'] text-white text-[11px] font-bold drop-shadow max-w-xs mx-auto leading-relaxed">
              🔍 Jelajahi Budaya, Temukan Fakta, Lestarikan Warisan!
            </p>
          </motion.div>

          {/* Character Mascots */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-end gap-5 mt-1"
          >
            <MascotDimas size="sm" animate={true} />
            <MascotGita size="sm" animate={true} />
          </motion.div>
        </div>

        {/* Right Column: Game Buttons */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-3 w-full max-w-[220px] landscape:max-w-[250px] flex-shrink-0"
        >
          <span className="text-[9px] font-bold text-yellow-100/90 tracking-widest uppercase font-['Fredoka'] select-none">
            Menu Utama
          </span>

          {/* Mulai Button */}
          <motion.button
            onClick={() => handleAction(onMulai)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full flex justify-center cursor-pointer focus:outline-none"
          >
            <img
              src="/assets/btn/mulai.png"
              alt="Mulai Misi Budaya"
              className="w-full h-auto object-contain filter drop-shadow-lg"
            />
          </motion.button>

          {/* Sub buttons row: Petunjuk, Pustaka, Profil */}
          <div className="grid grid-cols-3 gap-2 mt-0.5 w-full">
            <motion.button
              onClick={() => handleAction(onPetunjuk)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer focus:outline-none flex justify-center"
            >
              <img
                src="/assets/btn/petunjuk.png"
                alt="Petunjuk"
                className="w-full h-auto object-contain filter drop-shadow-md"
              />
            </motion.button>

            <motion.button
              onClick={handlePustakaOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer focus:outline-none flex justify-center"
            >
              <img
                src="/assets/btn/pustaka.png"
                alt="Pustaka"
                className="w-full h-auto object-contain filter drop-shadow-md"
              />
            </motion.button>

            <motion.button
              onClick={() => handleAction(onProfil)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer focus:outline-none flex justify-center"
            >
              <img
                src="/assets/btn/profil.png"
                alt="Profil"
                className="w-full h-auto object-contain filter drop-shadow-md"
              />
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* Pustaka (Bibliography) Modal Overlay */}
      {showPustaka && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setShowPustaka(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-4 relative shadow-2xl flex flex-col items-center border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center w-full mb-3 px-1 select-none">
              <h2 className="font-['Fredoka'] font-bold text-lg text-blue-800">Daftar Pustaka</h2>
              <button
                onClick={() => {
                  playSFX("click");
                  setShowPustaka(false);
                }}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[50vh] w-full bg-blue-50/50 rounded-2xl p-2 border border-blue-100">
              <img
                src="/assets/daftar-pustaka.png"
                alt="Konten Daftar Pustaka"
                className="w-full h-auto object-contain rounded-xl shadow-inner"
              />
            </div>
            <div className="mt-4 flex justify-center w-full">
              <button
                type="button"
                onClick={() => {
                  playSFX("click");
                  setShowPustaka(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white rounded-2xl px-6 py-1.5 font-['Fredoka'] font-semibold shadow-md active:scale-95 transition-all cursor-pointer text-xs"
              >
                Tutup ❌
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default SplashScreen;
