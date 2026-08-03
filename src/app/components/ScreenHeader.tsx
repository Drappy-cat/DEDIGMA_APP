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
  const { playSFX, bgmEnabled, toggleBgm, audioEnabled } = useAudio();
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
    toggleBgm();
  };

  return (
    <>
      <div className="bg-[#361a07] text-white px-3 sm:px-4 py-1.5 flex items-center gap-2 sm:gap-3 shadow-md select-none border-b-2 border-[#542d10] relative z-30 flex-shrink-0">
        {onBack && (
          <button
            onClick={handleBack}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-b from-[#f5a32b] via-[#e58e1d] to-[#d87c14] hover:from-[#f7ad3d] hover:to-[#e2861a] border-2 border-[#fff5ce] rounded-full flex items-center justify-center text-white font-extrabold text-lg sm:text-xl transition-transform active:scale-90 shadow-md cursor-pointer focus:outline-none flex-shrink-0"
            aria-label="Kembali"
            title="Kembali"
          >
            ←
          </button>
        )}

        <div className="flex-1 min-w-0">
          <h2 className="font-['Fredoka'] font-extrabold text-sm sm:text-base leading-tight text-[#fff5ce] drop-shadow-sm truncate">{title}</h2>
          {step && <p className="text-[#fad86b] text-[11px] font-['Nunito'] font-bold leading-none mt-0.5 truncate">{step}</p>}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Touch BGM Shortcut Button */}
          <button
            onClick={handleBgmToggle}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 border text-xs font-['Fredoka'] font-extrabold shadow-sm active:scale-95 ${
              bgmEnabled && audioEnabled
                ? "bg-[#291307] border-[#f3cc69]/70 text-[#fff5ce]"
                : "bg-black/50 border-white/20 text-white/50 grayscale"
            }`}
            title={bgmEnabled ? "Matikan Musik Latar (BGM)" : "Nyalakan Musik Latar (BGM)"}
          >
            <span>🎵</span>
            <span>BGM</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] uppercase tracking-wider font-extrabold ${
              bgmEnabled && audioEnabled ? "bg-[#386533] text-white" : "bg-gray-600 text-white/70"
            }`}>
              {bgmEnabled && audioEnabled ? "ON »" : "OFF"}
            </span>
          </button>

          {/* Audio Settings Button */}
          <button
            onClick={() => {
              playSFX("click");
              setIsSettingsOpen(true);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-[#6b2e15] hover:bg-[#54210d] border border-[#f3cc69]/60 rounded-full transition-all cursor-pointer flex items-center justify-center text-[#fff5ce] active:scale-90 shadow-sm"
            title="Pengaturan Audio & Informasi Game"
          >
            <Settings size={17} />
          </button>

          {onHome && (
            <button
              onClick={handleHome}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-[#6b2e15] hover:bg-[#54210d] border border-[#f3cc69]/60 rounded-full transition-all cursor-pointer flex items-center justify-center text-[#fff5ce] active:scale-90 shadow-sm"
              aria-label="Beranda"
              title="Beranda"
            >
              <img
                src="/assets/button/home.svg"
                alt="Beranda"
                className="w-5 h-5 object-contain"
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
