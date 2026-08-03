import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAudio } from "../contexts/AudioContext";

interface MascotProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "lobby";
  animate?: boolean;
  isLobby?: boolean;
  interactive?: boolean;
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

export const MascotDimas: React.FC<MascotProps> = ({
  size = "md",
  animate = true,
  isLobby = false,
  interactive = true
}) => {
  const { playSFX } = useAudio();
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);

  const sizeClasses: Record<string, string> = {
    sm: "w-12 h-12",
    md: "w-24 h-24 sm:w-28 sm:h-28",
    lg: "w-36 h-36 sm:w-44 sm:h-44",
    xl: "w-48 h-48 sm:w-64 sm:h-64",
    "2xl": "w-60 h-60 sm:w-80 sm:h-80",
    "3xl": "w-28 h-28 xs:w-36 xs:h-36 sm:w-56 sm:h-56 md:w-64 md:h-64 landscape:w-72 landscape:h-72",
    "4xl": "w-72 h-72 sm:w-96 sm:h-96",
    lobby: "w-44 h-44 xs:w-52 xs:h-52 sm:w-80 sm:h-80 md:w-96 md:h-96",
    "5xl": "w-[30rem] h-[30rem]",
    "6xl": "w-[40rem] h-[40rem]",
    "7xl": "w-[50rem] h-[50rem]"
  };

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive) return;

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
    <div
      className={`relative inline-flex flex-col items-center select-none outline-none focus:outline-none ${
        interactive ? "cursor-pointer" : "pointer-events-none"
      }`}
      onClick={handleTap}
    >
      <AnimatePresence>
        {bubbleText && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-[999] bg-blue-600 text-white font-['Fredoka'] text-xs font-bold px-3 py-1.5 rounded-2xl shadow-2xl border border-blue-400 whitespace-nowrap pointer-events-none"
          >
            {bubbleText}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rotate-45 border-r border-b border-blue-400" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`flex flex-col items-center select-none outline-none focus:outline-none ${isLobby ? "relative" : ""}`}
        whileHover={animate && interactive ? { scale: 1.06, y: -3 } : {}}
        whileTap={interactive ? { scale: 0.92, rotate: -4 } : {}}
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
          className={`${sizeClasses[size]} object-contain filter drop-shadow-md origin-bottom`}
        />
        {!isLobby && (
          <span className="text-[10px] font-['Fredoka'] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full mt-1 shadow-sm">
            Dimas
          </span>
        )}
      </motion.div>
    </div>
  );
};

export const MascotGita: React.FC<MascotProps> = ({
  size = "md",
  animate = true,
  isLobby = false,
  interactive = true
}) => {
  const { playSFX } = useAudio();
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);

  const sizeClasses: Record<string, string> = {
    sm: "w-12 h-12",
    md: "w-24 h-24 sm:w-28 sm:h-28",
    lg: "w-36 h-36 sm:w-44 sm:h-44",
    xl: "w-48 h-48 sm:w-64 sm:h-64",
    "2xl": "w-60 h-60 sm:w-80 sm:h-80",
    "3xl": "w-28 h-28 xs:w-36 xs:h-36 sm:w-56 sm:h-56 md:w-64 md:h-64 landscape:w-72 landscape:h-72",
    "4xl": "w-72 h-72 sm:w-96 sm:h-96",
    lobby: "w-44 h-44 xs:w-52 xs:h-52 sm:w-80 sm:h-80 md:w-96 md:h-96",
    "5xl": "w-[30rem] h-[30rem]",
    "6xl": "w-[40rem] h-[40rem]",
    "7xl": "w-[50rem] h-[50rem]"
  };

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive) return;

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
    <div
      className={`relative inline-flex flex-col items-center select-none outline-none focus:outline-none ${
        interactive ? "cursor-pointer" : "pointer-events-none"
      }`}
      onClick={handleTap}
    >
      <AnimatePresence>
        {bubbleText && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-[999] bg-amber-600 text-white font-['Fredoka'] text-xs font-bold px-3 py-1.5 rounded-2xl shadow-2xl border border-amber-400 whitespace-nowrap pointer-events-none"
          >
            {bubbleText}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-amber-600 rotate-45 border-r border-b border-amber-400" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`flex flex-col items-center select-none outline-none focus:outline-none ${isLobby ? "relative" : ""}`}
        whileHover={animate && interactive ? { scale: 1.06, y: -3 } : {}}
        whileTap={interactive ? { scale: 0.92, rotate: 4 } : {}}
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
          src="/assets/mascot/gita-char.svg"
          alt="Gita Mascot"
          className={`${sizeClasses[size]} object-contain filter drop-shadow-md origin-bottom`}
        />
        {!isLobby && (
          <span className="text-[10px] font-['Fredoka'] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mt-1 shadow-sm">
            Gita
          </span>
        )}
      </motion.div>
    </div>
  );
};
