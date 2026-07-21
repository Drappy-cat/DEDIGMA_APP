import React from "react";
import { useAudio } from "../contexts/AudioContext";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  onHome?: () => void;
  step?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, onHome, step }) => {
  const { audioEnabled, toggleAudio, playSFX } = useAudio();

  const handleBack = () => {
    playSFX("click");
    if (onBack) onBack();
  };

  const handleHome = () => {
    playSFX("click");
    if (onHome) onHome();
  };

  const handleVolumeToggle = () => {
    playSFX("click");
    toggleAudio();
  };

  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white px-4 py-2.5 flex items-center gap-3 shadow-md select-none border-b border-white/10 relative z-30">
      {onBack && (
        <button
          onClick={handleBack}
          className="p-1 hover:bg-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-center focus:outline-none"
          aria-label="Kembali"
        >
          <img
            src="/assets/btn/exit.png"
            alt="Kembali"
            className="w-7 h-7 object-contain active:scale-90 transition-transform"
          />
        </button>
      )}

      <div className="flex-1 min-w-0">
        <h2 className="font-['Fredoka'] font-bold text-base leading-tight drop-shadow-sm truncate">{title}</h2>
        {step && <p className="text-blue-200 text-[10px] font-['Nunito'] font-semibold leading-none mt-0.5">{step}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Custom Speaker volume toggle */}
        <button
          onClick={handleVolumeToggle}
          className="p-1 hover:bg-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-center focus:outline-none"
          aria-label={audioEnabled ? "Matikan Suara" : "Nyalakan Suara"}
        >
          <img
            src="/assets/btn/speaker.png"
            alt="Suara"
            className={`w-7 h-7 object-contain active:scale-90 transition-all ${
              audioEnabled ? "" : "opacity-40 filter grayscale scale-95"
            }`}
          />
        </button>

        {onHome && (
          <button
            onClick={handleHome}
            className="p-1 hover:bg-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-center focus:outline-none"
            aria-label="Beranda"
          >
            <img
              src="/assets/btn/home.png"
              alt="Beranda"
              className="w-7 h-7 object-contain active:scale-90 transition-transform"
            />
          </button>
        )}
      </div>
    </div>
  );
};
export default ScreenHeader;
