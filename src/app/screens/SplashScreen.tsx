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
            className={`px-2.5 py-1 rounded-2xl transition-all cursor-pointer flex items-center gap-1 border text-xs font-bold shadow backdrop-blur-sm ${
              bgmEnabled && audioEnabled
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
            className={`px-2.5 py-1 rounded-2xl transition-all cursor-pointer flex items-center gap-1 border text-xs font-bold shadow backdrop-blur-sm ${
              narratorEnabled && audioEnabled
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
        
        {!hasStarted ? (
          /* GAME LOADING SCREEN STATE */
          <motion.div
            key="game-loading-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center justify-center w-full max-w-md z-20 pointer-events-auto px-4"
          >
            {/* Logo & Game Title */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center mb-6 text-center"
            >
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-yellow-400/30 blur-2xl rounded-full animate-pulse" />
                <img
                  src="/assets/logo.png"
                  alt="DEDIGMA Logo"
                  className="w-20 h-20 md:w-28 md:h-28 object-contain relative z-10 filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]"
                />
              </div>

              <div className="bg-gradient-to-r from-blue-900/80 via-indigo-900/90 to-blue-900/80 backdrop-blur-md rounded-3xl px-6 py-2.5 border-2 border-amber-400/50 shadow-2xl text-center flex flex-col items-center">
                <h1 className="font-['Fredoka'] font-extrabold text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                  DEDIGMA
                </h1>
                <p className="font-['Fredoka'] font-bold text-cyan-200 text-[10px] md:text-xs tracking-widest mt-0.5 uppercase drop-shadow">
                  DETEKTIF DIGITAL BUDAYA MAGETAN
                </p>
              </div>
            </motion.div>

            {/* Game Loading Bar Container */}
            <div className="w-full bg-slate-950/80 backdrop-blur-md p-4 rounded-3xl border-2 border-amber-400/40 shadow-2xl flex flex-col items-center">
              <div className="flex justify-between items-center w-full mb-2 px-1">
                <span className="font-['Fredoka'] font-bold text-xs md:text-sm text-yellow-300 flex items-center gap-2">
                  {loadingProgress < 100 && (
                    <svg className="animate-spin h-3.5 w-3.5 text-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loadingProgress < 100 ? "Memuat Aset Game..." : "Selesai Memuat!"}
                </span>
                <span className="font-['Fredoka'] font-extrabold text-sm md:text-base text-amber-400">
                  {loadingProgress}%
                </span>
              </div>

              {/* Progress Bar Frame */}
              <div className="w-full h-5 md:h-6 bg-slate-900 rounded-full p-1 border border-white/20 relative overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)] relative"
                  style={{ width: `${loadingProgress}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </motion.div>
              </div>

              {/* Dynamic Cultural Tips */}
              <div className="mt-3 h-10 flex items-center justify-center text-center px-2">
                <motion.p
                  key={currentTipIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="font-['Nunito'] text-cyan-100 text-[11px] md:text-xs font-bold leading-tight drop-shadow"
                >
                  {tips[currentTipIndex]}
                </motion.p>
              </div>

              {/* Start / Enter Button when 100% or user clicks */}
              <motion.button
                onClick={handleStartGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-2 w-full py-2.5 rounded-2xl font-['Fredoka'] font-black text-sm md:text-base transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                  loadingProgress >= 100
                    ? "bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 text-slate-950 animate-bounce border-2 border-white"
                    : "bg-amber-500/80 hover:bg-amber-500 text-slate-950 border border-amber-300/50"
                }`}
              >
                <span>{loadingProgress >= 100 ? "MASUK KE GAME" : "LEWATI LOADING"}</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* LOBBY MENU SCREEN STATE */
          <motion.div
            key="lobby-menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center w-full"
          >
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
              transition={{ delay: 0.2 }}
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
          </motion.div>
        )}

        {/* Mascots positioned left and right */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -left-10 landscape:left-10 -bottom-10 landscape:bottom-0 z-10 pointer-events-auto flex flex-col items-center"
        >
          <MascotDimas size="3xl" animate={true} isLobby={true} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -right-10 landscape:right-10 -bottom-10 landscape:bottom-0 z-10 pointer-events-auto flex flex-col items-center"
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
