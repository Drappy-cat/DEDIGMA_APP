import React from "react";
import { useAudio } from "../contexts/AudioContext";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  onHome?: () => void;
  step?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, onHome, step }) => {
  const { playSFX } = useAudio();

  const handleBack = () => {
    playSFX("click");
    if (onBack) onBack();
  };

  const handleHome = () => {
    playSFX("click");
    if (onHome) onHome();
  };

  return (
    <div className="bg-gradient-to-r from-[#3b1e0a] via-[#4a270f] to-[#3b1e0a] text-white px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3 shadow-lg select-none border-b-2 border-[#c2aa84]/40 relative z-30 flex-shrink-0">
      {onBack && (
        <button
          onClick={handleBack}
          className="p-1 hover:bg-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-center focus:outline-none"
          aria-label="Kembali"
        >
          <img
            src="/assets/btn/exit.png"
            alt="Kembali"
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain active:scale-90 transition-transform filter drop-shadow-xs"
          />
        </button>
      )}

      <div className="flex-1 min-w-0">
        <h2 className="font-['Fredoka'] font-extrabold text-sm sm:text-base leading-tight text-[#fff5ce] drop-shadow-sm truncate">{title}</h2>
        {step && <p className="text-[#fad86b] text-[10px] font-['Nunito'] font-bold leading-none mt-0.5 truncate">{step}</p>}
      </div>

      {onHome && (
        <button
          onClick={handleHome}
          className="p-1 hover:bg-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-center focus:outline-none"
          aria-label="Beranda"
        >
          <img
            src="/assets/button/home.svg"
            alt="Beranda"
            className="w-7 h-7 object-contain active:scale-90 transition-transform drop-shadow-xs"
          />
        </button>
      )}
    </div>
  );
};

export default ScreenHeader;
