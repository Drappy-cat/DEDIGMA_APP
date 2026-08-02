import React from "react";
import { useAudio } from "../contexts/AudioContext";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  onHome?: () => void;
  step?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, onHome, step }) => {
  const { audioEnabled, bgmEnabled, narratorEnabled, toggleAudio, toggleBGM, toggleNarrator, playSFX } = useAudio();

  const handleBack = () => {
    playSFX("click");
    if (onBack) onBack();
  };

  const handleHome = () => {
    playSFX("click");
    if (onHome) onHome();
  };

  const handleBgmToggle = () => {
    playSFX("click");
    toggleBGM();
  };

  const handleNarratorToggle = () => {
    playSFX("click");
    toggleNarrator();
  };

  const handleVolumeToggle = () => {
    playSFX("click");
    toggleAudio();
  };

  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3 shadow-md select-none border-b border-white/10 relative z-30 flex-shrink-0">
      {onBack && (
        <button
          onClick={handleBack}
          className="p-1 hover:bg-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-center focus:outline-none"
          aria-label="Kembali"
        >
          <img
            src="/assets/btn/exit.png"
            alt="Kembali"
            className="w-6 h-6 sm:w-7 sm:h-7 object-contain active:scale-90 transition-transform"
          />
        </button>
      )}

      <div className="flex-1 min-w-0">
        <h2 className="font-['Fredoka'] font-bold text-sm sm:text-base leading-tight drop-shadow-sm truncate">{title}</h2>
        {step && <p className="text-blue-200 text-[10px] font-['Nunito'] font-semibold leading-none mt-0.5 truncate">{step}</p>}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* BGM Toggle */}
        <button
          onClick={handleBgmToggle}
          className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 border text-[11px] font-bold backdrop-blur-sm hover:scale-105 active:scale-95 ${
            bgmEnabled && audioEnabled
              ? "bg-amber-500/30 border-amber-300/50 text-amber-200 shadow"
              : "bg-white/10 border-white/10 text-white/40 grayscale"
          }`}
          title={bgmEnabled ? "Matikan Musik Latar (BGM)" : "Nyalakan Musik Latar (BGM)"}
        >
          <span>🎵</span>
          <span className="hidden sm:inline">{bgmEnabled ? "BGM On" : "BGM Off"}</span>
        </button>

        {/* Narrator / TTS Toggle */}
        <button
          onClick={handleNarratorToggle}
          className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 border text-[11px] font-bold backdrop-blur-sm hover:scale-105 active:scale-95 ${
            narratorEnabled && audioEnabled
              ? "bg-blue-400/30 border-blue-300/50 text-blue-100 shadow"
              : "bg-white/10 border-white/10 text-white/40 grayscale"
          }`}
          title={narratorEnabled ? "Matikan Suara Narator / TTS" : "Nyalakan Suara Narator / TTS"}
        >
          <span>🗣️</span>
          <span className="hidden sm:inline">{narratorEnabled ? "Suara On" : "Suara Off"}</span>
        </button>

        {/* Master Speaker volume toggle */}
        <button
          onClick={handleVolumeToggle}
          className="p-1 hover:bg-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-center focus:outline-none"
          title={audioEnabled ? "Matikan Seluruh Suara" : "Nyalakan Seluruh Suara"}
          aria-label={audioEnabled ? "Matikan Suara" : "Nyalakan Suara"}
        >
          <img
            src={audioEnabled ? "/assets/button/sound-on.svg" : "/assets/button/sound-off.svg"}
            alt="Suara"
            className="w-7 h-7 object-contain active:scale-90 transition-all drop-shadow-sm"
          />
        </button>

        {onHome && (
          <button
            onClick={handleHome}
            className="p-1 hover:bg-white/10 rounded-xl transition-all cursor-pointer flex items-center justify-center focus:outline-none"
            aria-label="Beranda"
          >
            <img
              src="/assets/button/home.svg"
              alt="Beranda"
              className="w-7 h-7 object-contain active:scale-90 transition-transform drop-shadow-sm"
            />
          </button>
        )}
      </div>
    </div>
  );
};
export default ScreenHeader;
