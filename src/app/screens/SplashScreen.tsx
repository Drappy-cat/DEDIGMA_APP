import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext";
import { MascotDimas, MascotGita } from "../components/Mascot";
import { AudioSettingsModal } from "../components/AudioSettingsModal";

interface SplashScreenProps {
  onMulai: () => void;
  onPetunjuk: () => void;
  onProfil: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onMulai, onPetunjuk, onProfil }) => {
  const { userName, logout } = useAuth();
  const { playSFX, playBGM, toggleAudio, toggleBGM, audioEnabled, bgmEnabled } = useAudio();
  const [showPustaka, setShowPustaka] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  React.useEffect(() => {
    playBGM();
  }, [playBGM]);

  const handleLogout = () => {
    playSFX("click");
    logout();
  };

  const handleAction = (callback: () => void) => {
    playSFX("click");
    playBGM();
    callback();
  };

  const handleVolumeToggle = () => {
    playSFX("click");
    toggleAudio();
  };

  const handleBgmToggle = () => {
    playSFX("click");
    toggleBGM();
  };

  // Generate random glitters / falling stars
  const glitters = React.useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 50}%`,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="h-full flex flex-col overflow-hidden relative select-none font-['Nunito']">
      {/* Background Image */}
      <img
        src="/assets/bg-lobby.svg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Glitter / Star Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {glitters.map((g) => (
          <motion.div
            key={g.id}
            className="absolute flex items-center justify-center text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
            style={{
              left: g.left,
              top: g.top,
              width: g.size * 3,
              height: g.size * 3,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              y: [0, Math.random() * 30 + 20],
              rotate: [0, 180],
            }}
            transition={{
              duration: g.duration,
              repeat: Infinity,
              delay: g.delay,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 0C12 0 12 9.5 17 12C12 14.5 12 24 12 24C12 24 12 14.5 7 12C12 9.5 12 0 12 0Z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Top Header Bar */}
      <div className="flex justify-between items-center px-4 pt-3 relative z-30 flex-shrink-0">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-3.5 py-1.5 shadow border border-white/20">
          <span className="font-['Nunito'] font-bold text-white text-xs sm:text-sm drop-shadow-xs">
            👋 Halo, {userName || "Siswa Demo"}!
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* BGM Toggle Button */}
          <button
            onClick={handleBgmToggle}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 border text-xs font-['Fredoka'] font-bold shadow-lg backdrop-blur-md active:scale-95 ${
              bgmEnabled && audioEnabled
                ? "bg-amber-500/40 border-amber-300/60 text-amber-200 ring-2 ring-amber-400/30"
                : "bg-slate-900/60 border-slate-600/60 text-slate-300/70 grayscale"
            }`}
            title={bgmEnabled ? "Matikan Musik Latar (BGM)" : "Nyalakan Musik Latar (BGM)"}
          >
            <span>🎵</span>
            <span>{bgmEnabled && audioEnabled ? "BGM On" : "BGM Off"}</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              playSFX("click");
              setIsSettingsOpen(true);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/80 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Pengaturan Audio & Volume"
          >
            <Settings size={18} />
          </button>

          {/* Speaker Volume Toggle Button */}
          <button
            onClick={handleVolumeToggle}
            className="transition-transform cursor-pointer focus:outline-none hover:scale-110 active:scale-95 flex items-center justify-center"
            title={audioEnabled ? "Matikan Seluruh Suara" : "Nyalakan Seluruh Suara"}
          >
            <img
              src={audioEnabled ? "/assets/button/sound-on.svg" : "/assets/button/sound-off.svg"}
              alt={audioEnabled ? "Suara Nyala" : "Suara Mati"}
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-sm"
            />
          </button>

          {/* Home / Logout Button */}
          <button
            onClick={handleLogout}
            className="transition-transform cursor-pointer focus:outline-none hover:scale-110 active:scale-95 flex items-center justify-center"
            title="Keluar"
          >
            <img
              src="/assets/button/home.svg"
              alt="Home / Keluar"
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-sm"
            />
          </button>
        </div>
      </div>

      <AudioSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenProfil={() => onProfil()}
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full relative z-10 flex flex-col items-center justify-center px-4 overflow-hidden">

        {/* Logo Title (Center Top) */}
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-3 flex flex-col items-center z-20 pointer-events-auto select-none"
        >
          <img
            src="/assets/title-dedigma.png"
            alt="DEDIGMA Title Logo"
            className="w-[300px] sm:w-[420px] md:w-[500px] h-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
          />
        </motion.div>

        {/* Center Game Action Buttons */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-3 w-full max-w-[250px] z-20 pointer-events-auto"
        >
          {/* MULAI Button */}
          <motion.button
            onClick={() => handleAction(onMulai)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full flex justify-center cursor-pointer focus:outline-none"
          >
            <img
              src="/assets/button/mulai.svg"
              alt="Mulai Misi Budaya"
              className="w-full h-auto object-contain filter drop-shadow-lg"
            />
          </motion.button>

          {/* Sub buttons row: Petunjuk and Profil */}
          <div className="grid grid-cols-2 gap-3 mt-1 w-full">
            <motion.button
              onClick={() => handleAction(onPetunjuk)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer focus:outline-none flex justify-center"
            >
              <img
                src="/assets/button/petunjuk.svg"
                alt="Petunjuk"
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
                src="/assets/button/profil.svg"
                alt="Profil"
                className="w-full h-auto object-contain filter drop-shadow-md"
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Mascots positioned left and right with name badges */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute -left-6 sm:left-2 md:left-8 landscape:left-4 -bottom-6 sm:-bottom-8 landscape:bottom-0 z-20 pointer-events-auto flex flex-col items-center"
        >
          <div className="relative flex flex-col items-center">
            <MascotDimas size="4xl" animate={true} isLobby={true} />
            <div className="absolute top-[52%] -translate-y-1/2 bg-gradient-to-b from-[#2a5bb5] via-[#1c4899] to-[#143778] border-2 border-[#6095f5] rounded-2xl px-4 sm:px-6 py-1 sm:py-1.5 text-center shadow-[0_8px_20px_rgba(0,0,0,0.6)] select-none z-30 min-w-[120px] sm:min-w-[155px]">
              <h3 className="font-['Fredoka'] font-extrabold text-xs sm:text-base text-white leading-tight tracking-wider drop-shadow-sm">
                DIMAS
              </h3>
              <p className="font-['Nunito'] font-bold text-[9px] sm:text-[11px] text-blue-100 leading-none mt-0.5 drop-shadow-xs">
                Detektif Digital
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute -right-6 sm:right-2 md:right-8 landscape:right-4 -bottom-6 sm:-bottom-8 landscape:bottom-0 z-20 pointer-events-auto flex flex-col items-center"
        >
          <div className="relative flex flex-col items-center">
            <MascotGita size="4xl" animate={true} isLobby={true} />
            <div className="absolute top-[52%] -translate-y-1/2 bg-gradient-to-b from-[#8f4121] via-[#7e371b] to-[#592410] border-2 border-[#bd6d46] rounded-2xl px-4 sm:px-6 py-1 sm:py-1.5 text-center shadow-[0_8px_20px_rgba(0,0,0,0.6)] select-none z-30 min-w-[120px] sm:min-w-[155px]">
              <h3 className="font-['Fredoka'] font-extrabold text-xs sm:text-base text-white leading-tight tracking-wider drop-shadow-sm">
                GITA
              </h3>
              <p className="font-['Nunito'] font-bold text-[9px] sm:text-[11px] text-amber-100 leading-none mt-0.5 drop-shadow-xs">
                Penjaga Budaya
              </p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Pustaka Modal */}
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
