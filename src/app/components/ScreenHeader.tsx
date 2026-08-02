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
          {/* Direct Touch BGM Shortcut Button (Seperti di Screenshot) */}
          <button
            onClick={handleBgmToggle}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 border text-xs font-bold shadow backdrop-blur-sm active:scale-95 ${
              bgmEnabled && audioEnabled
                ? "bg-amber-500/30 border-amber-300/50 text-amber-200"
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
            className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all cursor-pointer flex items-center justify-center text-white active:scale-90"
            title="Pengaturan Audio & Volume"
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
                src="/assets/btn/home.png"
                alt="Beranda"
                className="w-7 h-7 object-contain active:scale-90 transition-transform"
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

