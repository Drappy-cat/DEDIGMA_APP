import React from "react";
import { motion } from "motion/react";

interface MascotProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export const MascotDimas: React.FC<MascotProps> = ({ size = "md", animate = true }) => {
  const s = size === "sm" ? "text-4xl" : size === "lg" ? "text-8xl" : "text-6xl";

  return (
    <motion.div
      className="flex flex-col items-center gap-0.5 select-none"
      whileHover={animate ? { scale: 1.1, y: -4 } : {}}
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
      <span className={`${s} filter drop-shadow`}>🧑‍💻</span>
      <span className="text-xs font-['Fredoka'] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full shadow-sm">
        Dimas
      </span>
    </motion.div>
  );
};

export const MascotGita: React.FC<MascotProps> = ({ size = "md", animate = true }) => {
  const s = size === "sm" ? "text-4xl" : size === "lg" ? "text-8xl" : "text-6xl";

  return (
    <motion.div
      className="flex flex-col items-center gap-0.5 select-none"
      whileHover={animate ? { scale: 1.1, y: -4 } : {}}
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
      <span className={`${s} filter drop-shadow`}>👧</span>
      <span className="text-xs font-['Fredoka'] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shadow-sm">
        Gita
      </span>
    </motion.div>
  );
};
