import React, { useState } from "react";
import { motion } from "motion/react";
import { LogOut, X, Settings } from "lucide-react";
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
    // Coba putar musik latar secara otomatis saat SplashScreen dimuat
    playBGM();
  }, [playBGM]);

  const handleLogout = () => {
    playSFX("click");
    logout();
  };

  const handleAction = (callback: () => void) => {
    playSFX("click");
    playBGM(); // Pastikan musik bermain jika autoplay browser diblokir sebelumnya
    callback();
  };

  const handlePustakaOpen = () => {
    playSFX("click");
    setShowPustaka(true);
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
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 50}%`, // Mostly in the sky area
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="h-full flex flex-col overflow-hidden relative select-none">
      {/* Latar Belakang diletakkan sebagai elemen <img> agar SVG dapat dirender dengan baik */}
      <img
        src="/assets/bg-lobby.svg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Efek Bintang / Glitter */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {glitters.map((g) => (
          <motion.div
            key={g.id}
            className="absolute flex items-center justify-center text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
            style={{
              left: g.left,
              top: g.top,
              width: g.size * 3, // Perbesar sedikit untuk bentuk bintang
              height: g.size * 3,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
              y: [0, Math.random() * 30 + 20],
              rotate: [0, 180], // Tambahkan efek memutar
            }}
            transition={{
              duration: g.duration,
              repeat: Infinity,
              delay: g.delay,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M12 0C12 0 12 9.5 17 12C12 14.5 12 24 12 24C12 24 12 14.5 7 12C12 9.5 12 0 12 0Z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Top bar header */}
      <div className="flex justify-between items-center px-4 pt-3 relative z-20 flex-shrink-0">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-1 shadow border border-white/10">
          <span className="font-['Nunito'] font-bold text-white text-xs">👋 Halo, {userName}!</span>
        </div>

        <div className="flex items-center gap-2.5 landscape:gap-3">
          {/* Direct BGM Touch Shortcut (Persis Kapsul di Screenshot) */}
          <button
            onClick={handleBgmToggle}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 border text-xs font-bold shadow-lg backdrop-blur-md active:scale-95 ${
              bgmEnabled && audioEnabled
                ? "bg-amber-500/40 border-amber-300/60 text-amber-200 ring-2 ring-amber-400/30"
                : "bg-slate-900/60 border-slate-600/60 text-slate-300/70 grayscale"
            }`}
            title={bgmEnabled ? "Matikan Musik Latar (BGM)" : "Nyalakan Musik Latar (BGM)"}
          >
            <span>🎵</span>
            <span>{bgmEnabled && audioEnabled ? "BGM On" : "BGM Off"}</span>
          </button>

          {/* Dedicated Settings Button */}
          <button
            onClick={() => {
              playSFX("click");
              setIsSettingsOpen(true);
            }}
            className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/80 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Pengaturan Audio & Volume"
          >
            <Settings size={18} />
          </button>

          {/* Custom Speaker volume toggle */}
          <button
            onClick={handleVolumeToggle}
            className="transition-transform cursor-pointer focus:outline-none hover:scale-110 active:scale-95 flex items-center justify-center"
            aria-label={audioEnabled ? "Matikan Suara" : "Nyalakan Suara"}
          >
            <img
              src={audioEnabled ? "/assets/button/sound-on.svg" : "/assets/button/sound-off.svg"}
              alt={audioEnabled ? "Suara Nyala" : "Suara Mati"}
              className="w-10 h-10 landscape:w-14 landscape:h-14 object-contain"
            />
          </button>

          <button
            onClick={handleLogout}
            className="transition-transform cursor-pointer focus:outline-none hover:scale-110 active:scale-95 flex items-center justify-center"
            aria-label="Keluar"
          >
            <img
              src="/assets/button/home.svg"
              alt="Home / Keluar"
              className="w-10 h-10 landscape:w-14 landscape:h-14 object-contain"
            />
          </button>
        </div>
      </div>

      <AudioSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenProfil={() => onProfil()}
      />


      {/* Content wrapper: Central UI with floating mascots */}
      <div className="flex-1 w-full relative z-10 flex flex-col items-center justify-center px-4 overflow-hidden">
        
        {/* Logo Title (Center Top) */}
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col items-center z-20 pointer-events-auto"
        >
          <img
            src="/assets/logo.png"
            alt="DEDIGMA Logo"
            className="w-16 h-16 object-contain filter drop-shadow-md mb-2 animate-pulse"
          />
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-1 mb-1 border border-white/10 text-center">
            <h1 className="font-['Fredoka'] font-bold text-2xl md:text-4xl text-white drop-shadow-md leading-none">DEDIGMA</h1>
            <p className="font-['Fredoka'] font-semibold text-yellow-100 text-[8px] md:text-[10px] tracking-wider mt-0.5">
              DETEKTIF DIGITAL BUDAYA MAGETAN
            </p>
          </div>
          <p className="font-['Nunito'] text-white text-[11px] md:text-xs font-bold drop-shadow text-center max-w-xs leading-relaxed">
            🔍 Jelajahi Budaya, Temukan Fakta, Lestarikan Warisan!
          </p>
        </motion.div>

        {/* Center Game Buttons */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-3 w-full max-w-[250px] z-20 pointer-events-auto"
        >
          {/* Mulai Button */}
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

        {/* Mascots positioned left and right */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute left-1 sm:left-4 md:left-12 bottom-1 sm:bottom-2 z-20 pointer-events-auto"
        >
          <MascotDimas size="3xl" animate={true} isLobby={true} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute right-1 sm:right-4 md:right-12 bottom-1 sm:bottom-2 z-20 pointer-events-auto"
        >
          <MascotGita size="3xl" animate={true} isLobby={true} />
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
