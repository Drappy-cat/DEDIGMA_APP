import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAudio } from "../contexts/AudioContext";

interface MascotProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  animate?: boolean;
  isLobby?: boolean;
}

const dimasQuotes = [
  "Halo Detektif Digital!",
  "Ayo saring berita sebelum sharing!",
  "Siap verifikasi fakta hari ini?",
  "Semangat menuntaskan misi!"
];

const gitaQuotes = [
  "Salam Budaya Magetan!",
  "Mari lestarikan tradisi daerah!",
  "Bangga dengan budaya lokal!",
  "Jadilah detektif berwawasan budaya!"
];

export const MascotDimas: React.FC<MascotProps> = ({ size = "md", animate = true, isLobby = false }) => {
  const { playSFX } = useAudio();
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);

  const sizeClasses: Record<string, string> = {
    sm: "w-14 h-14",
    md: "w-28 h-28",
    lg: "w-44 h-44",
    xl: "w-64 h-64",
    "2xl": "w-80 h-80",
    "3xl": "w-48 h-48 sm:w-72 sm:h-72 landscape:w-96 landscape:h-96",
    "4xl": "w-[30rem] h-[30rem]",
    "5xl": "w-[40rem] h-[40rem]",
    "6xl": "w-[50rem] h-[50rem]",
    "7xl": "w-[60rem] h-[60rem]",
    "8xl": "w-[75rem] h-[75rem]"
  };

  const handleTap = () => {
    try {
      playSFX("click");
    } catch {}
    setIsBouncing(true);
    const randomQuote = dimasQuotes[Math.floor(Math.random() * dimasQuotes.length)];
    setBubbleText(randomQuote);

    setTimeout(() => setIsBouncing(false), 500);
    setTimeout(() => setBubbleText(null), 2500);
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none cursor-pointer" onClick={handleTap}>
      <AnimatePresence>
        {bubbleText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -12, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute -top-10 z-50 bg-blue-600 text-white font-['Fredoka'] text-xs font-bold px-3 py-1.5 rounded-2xl shadow-xl border border-blue-400 whitespace-nowrap pointer-events-none"
          >
            {bubbleText}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rotate-45 border-r border-b border-blue-400" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`flex flex-col items-center select-none ${isLobby ? "relative" : ""}`}
        whileHover={animate ? { scale: 1.06, y: -4 } : {}}
        whileTap={{ scale: 0.92, rotate: -4 }}
        animate={
          isBouncing
            ? { scale: [1, 1.2, 0.95, 1], rotate: [0, -6, 6, 0] }
            : animate
            ? {
                y: [0, -4, 0],
                transition: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }
            : {}
        }
      >
        <img
          src="/assets/mascot/dimas-char.svg"
          alt="Dimas Mascot"
          className={`${sizeClasses[size]} object-contain filter drop-shadow-md ${isLobby ? "scale-[1.05] sm:scale-[1.15] landscape:scale-[1.25] origin-bottom" : ""}`}
        />
        <img 
          src="/assets/ket-dimas.svg" 
          alt="Keterangan Dimas"
          className={
            isLobby
              ? "absolute -bottom-3 sm:-bottom-4 w-20 sm:w-28 landscape:w-32 h-auto z-10 pointer-events-none drop-shadow-sm"
              : "w-20 h-auto mt-1 drop-shadow-sm"
          }
        />
      </motion.div>
    </div>
  );
};

export const MascotGita: React.FC<MascotProps> = ({ size = "md", animate = true, isLobby = false }) => {
  const { playSFX } = useAudio();
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);

  const sizeClasses: Record<string, string> = {
    sm: "w-14 h-14",
    md: "w-28 h-28",
    lg: "w-44 h-44",
    xl: "w-64 h-64",
    "2xl": "w-80 h-80",
    "3xl": "w-48 h-48 sm:w-72 sm:h-72 landscape:w-96 landscape:h-96",
    "4xl": "w-[30rem] h-[30rem]",
    "5xl": "w-[40rem] h-[40rem]",
    "6xl": "w-[50rem] h-[50rem]",
    "7xl": "w-[60rem] h-[60rem]",
    "8xl": "w-[75rem] h-[75rem]"
  };

  const handleTap = () => {
    try {
      playSFX("click");
    } catch {}
    setIsBouncing(true);
    const randomQuote = gitaQuotes[Math.floor(Math.random() * gitaQuotes.length)];
    setBubbleText(randomQuote);

    setTimeout(() => setIsBouncing(false), 500);
    setTimeout(() => setBubbleText(null), 2500);
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none cursor-pointer" onClick={handleTap}>
      <AnimatePresence>
        {bubbleText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -12, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute -top-10 z-50 bg-amber-600 text-white font-['Fredoka'] text-xs font-bold px-3 py-1.5 rounded-2xl shadow-xl border border-amber-400 whitespace-nowrap pointer-events-none"
          >
            {bubbleText}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-amber-600 rotate-45 border-r border-b border-amber-400" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`flex flex-col items-center select-none ${isLobby ? "relative" : ""}`}
        whileHover={animate ? { scale: 1.06, y: -4 } : {}}
        whileTap={{ scale: 0.92, rotate: 4 }}
        animate={
          isBouncing
            ? { scale: [1, 1.2, 0.95, 1], rotate: [0, 6, -6, 0] }
            : animate
            ? {
                y: [0, -4, 0],
                transition: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }
              }
            : {}
        }
      >
        <img
          src="/assets/gita-char.png"
          alt="Gita Mascot"
          className={`${sizeClasses[size]} object-contain filter drop-shadow-md ${isLobby ? "scale-[1.05] sm:scale-[1.15] landscape:scale-[1.25] origin-bottom" : ""}`}
        />
        <span className={
          isLobby
            ? "absolute -bottom-2 text-[10px] sm:text-[12px] font-['Fredoka'] font-bold text-amber-700 bg-amber-100 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm z-10 pointer-events-none"
            : "text-[10px] font-['Fredoka'] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mt-1 shadow-sm"
        }>
          Gita
        </span>
      </motion.div>
    </div>
  );
};
