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
    sm: "w-8 h-8 sm:w-12 sm:h-12",
    md: "w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28",
    lg: "w-20 h-20 sm:w-32 sm:h-32 md:w-44 md:h-44",
    xl: "w-24 h-24 sm:w-40 sm:h-40 md:w-64 md:h-64",
    "2xl": "w-28 h-28 sm:w-48 sm:h-48 md:w-80 md:h-80",
    "3xl": "w-24 h-24 xs:w-32 xs:h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 landscape:w-56 landscape:h-56",
    "4xl": "w-28 h-28 sm:w-56 sm:h-56 md:w-80 md:h-80",
    lobby: "w-32 h-32 xs:w-40 xs:h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 max-h-[58vh] max-w-[25vw]",
    "5xl": "w-32 h-32 sm:w-[20rem] sm:h-[20rem] md:w-[30rem] md:h-[30rem]",
    "6xl": "w-40 h-40 sm:w-[25rem] sm:h-[25rem] md:w-[40rem] md:h-[40rem]",
    "7xl": "w-48 h-48 sm:w-[30rem] sm:h-[30rem] md:w-[50rem] md:h-[50rem]"
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
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-[999] bg-blue-600 text-white font-['Fredoka'] text-xs font-bold px-3 py-1.5 rounded-2xl shadow-2xl border border-blue-400 max-w-[200px] xs:max-w-[240px] text-center whitespace-normal pointer-events-none"
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
          className={`${sizeClasses[size]} object-contain filter drop-shadow-md origin-bottom max-h-[58vh] max-w-[25vw]`}
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
    sm: "w-8 h-8 sm:w-12 sm:h-12",
    md: "w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28",
    lg: "w-20 h-20 sm:w-32 sm:h-32 md:w-44 md:h-44",
    xl: "w-24 h-24 sm:w-40 sm:h-40 md:w-64 md:h-64",
    "2xl": "w-28 h-28 sm:w-48 sm:h-48 md:w-80 md:h-80",
    "3xl": "w-24 h-24 xs:w-32 xs:h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 landscape:w-56 landscape:h-56",
    "4xl": "w-28 h-28 sm:w-56 sm:h-56 md:w-80 md:h-80",
    lobby: "w-44 h-44 xs:w-52 xs:h-52 sm:w-80 sm:h-80 md:w-96 md:h-96",
    "5xl": "w-32 h-32 sm:w-[20rem] sm:h-[20rem] md:w-[30rem] md:h-[30rem]",
    "6xl": "w-40 h-40 sm:w-[25rem] sm:h-[25rem] md:w-[40rem] md:h-[40rem]",
    "7xl": "w-48 h-48 sm:w-[30rem] sm:h-[30rem] md:w-[50rem] md:h-[50rem]"
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
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-[999] bg-amber-600 text-white font-['Fredoka'] text-xs font-bold px-3 py-1.5 rounded-2xl shadow-2xl border border-amber-400 max-w-[200px] xs:max-w-[240px] text-center whitespace-normal pointer-events-none"
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
          className={`${sizeClasses[size]} object-contain filter drop-shadow-md origin-bottom max-h-[58vh] max-w-[25vw]`}
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
