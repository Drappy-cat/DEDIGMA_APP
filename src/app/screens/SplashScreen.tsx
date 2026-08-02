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
  const { playSFX, playBGM, toggleAudio, toggleBGM, toggleNarrator, audioEnabled, bgmEnabled, narratorEnabled } = useAudio();
  const [showPustaka, setShowPustaka] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tips = React.useMemo(() => [
    "Magetan terkenal dengan pesona Telaga Sarangan dan tradisi Larung Sesaji.",
    "Reog Ponorogo & Nyadaran adalah bagian dari warisan budaya luhur daerah.",
    "Menyiapkan berkas-berkas Misi Detektif Digital...",
    "Siapkan diri menjadi Detektif Cilik Budaya Magetan yang handal!"
  ], []);

  React.useEffect(() => {
    // Coba putar musik latar secara otomatis saat SplashScreen dimuat
    playBGM();
  }, [playBGM]);

  // Loading bar animation effect (0% to 100%)
  React.useEffect(() => {
    if (hasStarted) return;

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [hasStarted]);

  // Rotate tips periodically during loading
  React.useEffect(() => {
    if (hasStarted) return;
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 1800);
    return () => clearInterval(tipInterval);
  }, [hasStarted, tips]);

  const handleLogout = () => {
    playSFX("click");
    logout();
  };

  const handleStartGame = () => {
    playSFX("click");
    playBGM();
    setHasStarted(true);
  };

  const handleAction = (callback: () => void) => {
    playSFX("click");
    playBGM(); // Pastikan musik bermain jika autoplay browser diblokir sebelumnya
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

  const handleNarratorToggle = () => {
    playSFX("click");
    toggleNarrator();
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
        <div className="flex items-center gap-3 landscape:gap-4">
          {/* BGM Toggle */}
          <button
            onClick={handleBgmToggle}
            className={`px-2.5 py-1 rounded-2xl transition-all cursor-pointer flex items-center gap-1 border text-xs font-bold shadow backdrop-blur-sm ${bgmEnabled && audioEnabled
              ? "bg-amber-500/30 border-amber-300/50 text-amber-200"
              : "bg-white/10 border-white/10 text-white/40 grayscale"
              }`}
            title={bgmEnabled ? "Matikan Musik Latar (BGM)" : "Nyalakan Musik Latar (BGM)"}
          >
            <span>🎵</span>
            <span className="hidden sm:inline">{bgmEnabled ? "BGM" : "BGM Off"}</span>
          </button>

          {/* Narrator Toggle */}
          <button
            onClick={handleNarratorToggle}
            className={`px-2.5 py-1 rounded-2xl transition-all cursor-pointer flex items-center gap-1 border text-xs font-bold shadow backdrop-blur-sm ${narratorEnabled && audioEnabled
              ? "bg-blue-500/30 border-blue-300/50 text-blue-100"
              : "bg-white/10 border-white/10 text-white/40 grayscale"
              }`}
            title={narratorEnabled ? "Matikan Suara Narator / TTS" : "Nyalakan Suara Narator / TTS"}
          >
            <span>🗣️</span>
            <span className="hidden sm:inline">{narratorEnabled ? "Suara" : "Suara Off"}</span>
          </button>

          {/* Master Speaker volume toggle */}
          <button
            onClick={handleVolumeToggle}
            className="transition-transform cursor-pointer focus:outline-none hover:scale-110 active:scale-95 flex items-center justify-center"
            title={audioEnabled ? "Matikan Seluruh Suara" : "Nyalakan Seluruh Suara"}
          >
            <img
              src={audioEnabled ? "/assets/button/sound-on.svg" : "/assets/button/sound-off.svg"}
              alt={audioEnabled ? "Suara Nyala" : "Suara Mati"}
              className="w-10 h-10 landscape:w-12 landscape:h-12 object-contain drop-shadow-sm"
            />
          </button>

          {/* Home / Keluar toggle */}
          <button
            onClick={handleLogout}
            className="transition-transform cursor-pointer focus:outline-none hover:scale-110 active:scale-95 flex items-center justify-center"
            title="Keluar"
          >
            <img
              src="/assets/button/home.svg"
              alt="Home / Keluar"
              className="w-10 h-10 landscape:w-12 landscape:h-12 object-contain drop-shadow-sm"
            />
          </button>
        </div>
      </div>

      {/* Content wrapper: Central UI with floating mascots */}
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
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute -left-14 sm:-left-20 landscape:-left-2 landscape:sm:left-4 -bottom-10 landscape:bottom-0 z-10 pointer-events-auto"
        >
          <MascotDimas size="3xl" animate={true} isLobby={true} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute -right-14 sm:-right-20 landscape:-right-2 landscape:sm:right-4 -bottom-10 landscape:bottom-0 z-10 pointer-events-auto"
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
