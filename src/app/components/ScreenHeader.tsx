import React, { useState } from "react";
import { Settings } from "lucide-react";
import { useAudio } from "../contexts/AudioContext";
import { AudioSettingsModal } from "./AudioSettingsModal";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  onHome?: () => void;
  step?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, onHome, step }) => {
  const { audioEnabled, bgmEnabled, toggleBGM, playSFX } = useAudio();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  return (
    <>
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

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Direct Touch BGM Shortcut Button */}
          <button
            onClick={handleBgmToggle}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 border text-xs font-['Fredoka'] font-bold shadow backdrop-blur-sm active:scale-95 ${
              bgmEnabled && audioEnabled
                ? "bg-[#7e371b]/90 border-[#fad86b]/70 text-[#fff5ce]"
                : "bg-black/30 border-white/20 text-white/50 grayscale"
            }`}
            title={bgmEnabled ? "Matikan Musik Latar (BGM)" : "Nyalakan Musik Latar (BGM)"}
          >
            <span>🎵</span>
            <span>{bgmEnabled && audioEnabled ? "BGM On" : "BGM Off"}</span>
          </button>

          {/* Dedicated Audio Settings Button */}
          <button
            onClick={() => {
              playSFX("click");
              setIsSettingsOpen(true);
            }}
            className="p-1.5 bg-[#7e371b]/80 hover:bg-[#7e371b] border border-[#fad86b]/50 rounded-full transition-all cursor-pointer flex items-center justify-center text-[#fff5ce] active:scale-90 shadow-sm"
            title="Pengaturan Audio & Informasi Game"
          >
            <Settings size={18} />
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
                className="w-7 h-7 object-contain active:scale-90 transition-transform drop-shadow-xs"
              />
            </button>
          )}
        </div>
      </div>

      <AudioSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default ScreenHeader;
