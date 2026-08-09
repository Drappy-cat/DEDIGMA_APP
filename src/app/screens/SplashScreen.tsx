import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Settings, Volume2, VolumeX, Home } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext";
import { MascotDimas, MascotGita } from "../components/Mascot";
import { AudioSettingsModal } from "../components/AudioSettingsModal";
import { usePerformance } from "../hooks/usePerformance";

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
  const perf = usePerformance();

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
    return Array.from({ length: perf.particleCount(25) }).map((_, i) => ({
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
        <div className="bg-[#361a07]/90 backdrop-blur-md rounded-2xl px-3.5 py-1.5 shadow-md border-2 border-[#f3cc69]/70 flex items-center gap-1.5 select-none">
          <span className="font-['Fredoka'] font-extrabold text-[#fff5ce] text-xs sm:text-sm tracking-wide drop-shadow-xs">
            👋 Halo, <span className="text-[#fcd462]">{userName || "Siswa Demo"}</span>!
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Touch BGM Shortcut Button */}
          <button
            onClick={handleBgmToggle}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 border text-xs font-['Fredoka'] font-extrabold shadow-sm active:scale-95 ${
              bgmEnabled && audioEnabled
                ? "bg-[#291307] border-[#f3cc69]/70 text-[#fff5ce]"
                : "bg-black/50 border-white/20 text-white/50 grayscale"
            }`}
            title={bgmEnabled ? "Matikan Musik Latar (BGM)" : "Nyalakan Musik Latar (BGM)"}
          >
            <span>🎵</span>
            <span>BGM</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] uppercase tracking-wider font-extrabold ${
              bgmEnabled && audioEnabled ? "bg-[#386533] text-white" : "bg-gray-600 text-white/70"
            }`}>
              {bgmEnabled && audioEnabled ? "ON »" : "OFF"}
            </span>
          </button>

          {/* Audio Settings Button */}
          <button
            onClick={() => {
              playSFX("click");
              setIsSettingsOpen(true);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-[#6b2e15] hover:bg-[#54210d] border border-[#f3cc69]/60 rounded-full transition-all cursor-pointer flex items-center justify-center text-[#fff5ce] active:scale-90 shadow-sm"
            title="Pengaturan Audio & Informasi Game"
          >
            <Settings size={17} />
          </button>

          {/* Speaker Volume Toggle Button */}
          <button
            onClick={handleVolumeToggle}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-[#6b2e15] hover:bg-[#54210d] border border-[#f3cc69]/60 rounded-full transition-all cursor-pointer flex items-center justify-center text-[#fff5ce] active:scale-90 shadow-sm"
            title={audioEnabled ? "Matikan Seluruh Suara" : "Nyalakan Seluruh Suara"}
          >
            {audioEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          {/* Home / Logout Button */}
          <button
            onClick={handleLogout}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-[#6b2e15] hover:bg-[#54210d] border border-[#f3cc69]/60 rounded-full transition-all cursor-pointer flex items-center justify-center text-[#fff5ce] active:scale-90 shadow-sm"
            aria-label="Beranda"
            title="Beranda / Keluar"
          >
            <Home size={17} />
          </button>
        </div>
      </div>

      <AudioSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenProfil={() => onProfil()}
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full relative z-10 flex flex-col items-center justify-between py-2 sm:py-4 px-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

        {/* Logo Title (Center Top) */}
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-0.5 sm:mt-2 mb-1 flex flex-col items-center z-20 pointer-events-auto select-none"
        >
          <img
            src="/assets/title-dedigma.png"
            alt="DEDIGMA Title Logo"
            className="w-[240px] xs:w-[280px] sm:w-[360px] md:w-[460px] max-h-[18vh] sm:max-h-[22vh] h-auto object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
          />
        </motion.div>

        {/* Center Game Action Buttons */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-2 sm:gap-3 w-full max-w-[180px] xs:max-w-[210px] sm:max-w-[240px] z-50 relative pointer-events-auto my-auto"
        >
          {/* MULAI Button */}
          <motion.button
            onClick={() => handleAction(onMulai)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full flex justify-center cursor-pointer focus:outline-none z-50 relative"
          >
            <img
              src="/assets/button/mulai.svg"
              alt="Mulai Misi Budaya"
              className="w-full max-h-[12vh] sm:max-h-[15vh] h-auto object-contain filter drop-shadow-lg"
            />
          </motion.button>

          {/* Sub buttons row: Petunjuk and Profil */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3.5 mt-0.5 w-full relative z-50 items-end">
            <motion.button
              onClick={() => handleAction(onPetunjuk)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer focus:outline-none flex items-center justify-center z-50 relative overflow-hidden"
            >
              <img
                src="/assets/button/petunjuk.svg"
                alt="Petunjuk"
                className="w-full max-h-[7vh] sm:max-h-[9vh] h-auto object-contain transform scale-[1.055] filter drop-shadow-md"
              />
            </motion.button>

            <motion.button
              onClick={() => handleAction(onProfil)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer focus:outline-none flex justify-center z-50 relative -translate-y-[2px]"
            >
              <img
                src="/assets/button/profil.svg"
                alt="Profil"
                className="w-full max-h-[7vh] sm:max-h-[9vh] h-auto object-contain filter drop-shadow-md"
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Mascots positioned left and right with name badges */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute -left-6 xs:-left-3 sm:left-2 md:left-6 bottom-0 z-10 pointer-events-none flex flex-col items-center"
        >
          <div className="relative flex flex-col items-center">
            <div className="pointer-events-auto">
              <MascotDimas size="lobby" animate={true} isLobby={true} />
            </div>
            <div className="absolute bottom-1 sm:bottom-3 bg-gradient-to-b from-[#2a5bb5] via-[#1c4899] to-[#143778] border-2 border-[#6095f5] rounded-xl sm:rounded-2xl px-2 sm:px-4 py-0.5 text-center shadow-[0_8px_20px_rgba(0,0,0,0.6)] select-none z-20 min-w-[70px] sm:min-w-[130px] pointer-events-auto">
              <h3 className="font-['Fredoka'] font-extrabold text-[9px] sm:text-xs text-white leading-tight tracking-wider drop-shadow-sm">
                DIMAS
              </h3>
              <p className="font-['Nunito'] font-bold text-[7px] sm:text-[9px] text-blue-100 leading-none mt-0.5 drop-shadow-xs">
                Detektif Digital
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute -right-6 xs:-right-3 sm:right-2 md:right-6 bottom-0 z-10 pointer-events-none flex flex-col items-center"
        >
          <div className="relative flex flex-col items-center">
            <div className="pointer-events-auto">
              <MascotGita size="lobby" animate={true} isLobby={true} />
            </div>
            <div className="absolute bottom-1 sm:bottom-3 bg-gradient-to-b from-[#8f4121] via-[#7e371b] to-[#592410] border-2 border-[#bd6d46] rounded-xl sm:rounded-2xl px-2 sm:px-4 py-0.5 text-center shadow-[0_8px_20px_rgba(0,0,0,0.6)] select-none z-20 min-w-[70px] sm:min-w-[130px] pointer-events-auto">
              <h3 className="font-['Fredoka'] font-extrabold text-[9px] sm:text-xs text-white leading-tight tracking-wider drop-shadow-sm">
                GITA
              </h3>
              <p className="font-['Nunito'] font-bold text-[7px] sm:text-[9px] text-amber-100 leading-none mt-0.5 drop-shadow-xs">
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
