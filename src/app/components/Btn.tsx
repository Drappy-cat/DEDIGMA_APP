import React from "react";
import { motion } from "motion/react";
import { useAudio } from "../contexts/AudioContext";

interface BtnProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "amber"
    | "green"
    | "red"
    | "ghost"
    | "lanjut"
    | "kembali"
    | "materi"
    | "aktivitas"
    | "lencana"
    | "home"
    | "pustaka"
    | "periksa"
    | "exit"
    | "next"
    | "prev"
    | "action-lanjut"
    | "action-ulangi"
    | "left"
    | "right";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Btn: React.FC<BtnProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button"
}) => {
  const { playSFX } = useAudio();

  const isImageBtn = [
    "lanjut",
    "kembali",
    "materi",
    "aktivitas",
    "lencana",
    "home",
    "pustaka",
    "periksa",
    "exit",
    "next",
    "prev",
    "action-lanjut",
    "action-ulangi",
    "left",
    "right"
  ].includes(variant);

  const imagePaths: Record<string, string> = {
    lanjut: "/assets/btn/lanjut.png",
    kembali: "/assets/btn/kembali.png",
    materi: "/assets/btn/materi.png",
    aktivitas: "/assets/btn/aktivitas.png",
    lencana: "/assets/btn/lencana.png",
    home: "/assets/btn/home.png",
    pustaka: "/assets/btn/pustaka.png",
    periksa: "/assets/btn/periksa.png",
    exit: "/assets/btn/exit.png",
    next: "/assets/btn/next.png",
    prev: "/assets/btn/prev.png",
    "action-lanjut": "/assets/btn/action-lanjut.png",
    "action-ulangi": "/assets/btn/action-ulangi.png",
    left: "/assets/btn/left.png",
    right: "/assets/btn/right.png"
  };

  const handleClick = () => {
    if (disabled) return;
    playSFX("click");
    if (onClick) {
      onClick();
    }
  };

  if (isImageBtn) {
    return (
      <motion.button
        type={type}
        disabled={disabled}
        onClick={handleClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        className={`bg-transparent border-none shadow-none cursor-pointer focus:outline-none p-0 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed select-none ${className}`}
      >
        <img
          src={imagePaths[variant]}
          alt={variant}
          className="h-12 w-auto object-contain filter drop-shadow-sm active:opacity-90"
        />
      </motion.button>
    );
  }

  const base =
    "font-['Fredoka'] font-semibold rounded-2xl px-5 py-2.5 transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none text-center inline-flex justify-center items-center gap-1.5";

  const normalVariants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-300",
    secondary: "bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-300",
    amber: "bg-amber-400 hover:bg-amber-500 text-amber-900 shadow-amber-200",
    green: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200",
    red: "bg-red-500 hover:bg-red-600 text-white shadow-red-200",
    ghost: "bg-white/60 hover:bg-white text-blue-700 border border-blue-200"
  };

  // Safe fallback typecasting
  const activeVariant = normalVariants[variant as keyof typeof normalVariants] || normalVariants.primary;

  return (
    <button
      type={type}
      className={`${base} ${activeVariant} ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
export default Btn;
