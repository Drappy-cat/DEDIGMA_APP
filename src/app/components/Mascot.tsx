import React from "react";
import { motion } from "motion/react";

interface MascotProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export const MascotDimas: React.FC<MascotProps> = ({ size = "md", animate = true }) => {
  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-28 h-28",
    lg: "w-44 h-44"
  };

  return (
    <motion.div
      className="flex flex-col items-center select-none"
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
        src="/assets/dimas-char.png"
        alt="Dimas Mascot"
        className={`${sizeClasses[size]} object-contain filter drop-shadow-md`}
      />
      <span className="text-[10px] font-['Fredoka'] font-bold text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full shadow-sm mt-1">
        Dimas
      </span>
    </motion.div>
  );
};

export const MascotGita: React.FC<MascotProps> = ({ size = "md", animate = true }) => {
  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-28 h-28",
    lg: "w-44 h-44"
  };

  return (
    <motion.div
      className="flex flex-col items-center select-none"
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
        src="/assets/gita-char.png"
        alt="Gita Mascot"
        className={`${sizeClasses[size]} object-contain filter drop-shadow-md`}
      />
      <span className="text-[10px] font-['Fredoka'] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full shadow-sm mt-1">
        Gita
      </span>
    </motion.div>
  );
};
