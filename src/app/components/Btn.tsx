import React from "react";
import { useAudio } from "../contexts/AudioContext";

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "amber" | "green" | "red" | "ghost";
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

  const base =
    "font-['Fredoka'] font-semibold rounded-2xl px-5 py-2.5 transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none text-center inline-flex justify-center items-center gap-1.5";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-300",
    secondary: "bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-300",
    amber: "bg-amber-400 hover:bg-amber-500 text-amber-900 shadow-amber-200",
    green: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200",
    red: "bg-red-500 hover:bg-red-600 text-white shadow-red-200",
    ghost: "bg-white/60 hover:bg-white text-blue-700 border border-blue-200"
  };

  const handleClick = () => {
    if (disabled) return;
    playSFX("click");
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
