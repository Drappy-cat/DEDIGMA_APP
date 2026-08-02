import React from "react";
import { motion } from "motion/react";

interface MascotProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  animate?: boolean;
  isLobby?: boolean;
}

export const MascotDimas: React.FC<MascotProps> = ({ size = "md", animate = true, isLobby = false }) => {
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

  return (
    <motion.div
      className={`flex flex-col items-center select-none ${isLobby ? "relative" : ""}`}
      whileHover={animate ? { scale: 1.05, y: -4 } : {}}
      animate={
        animate
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
  );
};

export const MascotGita: React.FC<MascotProps> = ({ size = "md", animate = true, isLobby = false }) => {
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

  return (
    <motion.div
      className={`flex flex-col items-center select-none ${isLobby ? "relative" : ""}`}
      whileHover={animate ? { scale: 1.05, y: -4 } : {}}
      animate={
        animate
          ? {
            y: [0, -4, 0],
            transition: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5 // staggered bounce
            }
          }
          : {}
      }
    >
      <img
        src="/assets/mascot/gita-char.svg"
        alt="Gita Mascot"
        className={`${sizeClasses[size]} object-contain filter drop-shadow-md ${isLobby ? "scale-[1.05] sm:scale-[1.15] landscape:scale-[1.25] origin-bottom" : ""}`}
      />
      <img 
        src="/assets/ket-gita.svg" 
        alt="Keterangan Gita"
        className={
          isLobby
            ? "absolute -bottom-4 w-32 h-auto z-10 pointer-events-none drop-shadow-sm"
            : "w-20 h-auto mt-1 drop-shadow-sm"
        }
      />
    </motion.div>
  );
};
