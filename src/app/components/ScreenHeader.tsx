import React from "react";
import { ChevronLeft, Home, Volume2, VolumeX } from "lucide-react";
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
    <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-4 py-3 flex items-center gap-3 shadow-lg select-none">
      {onBack && (
        <button
          onClick={handleBack}
          className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
          aria-label="Kembali"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <div className="flex-1">
        <h2 className="font-['Fredoka'] font-semibold text-lg leading-tight drop-shadow-sm">{title}</h2>
        {step && <p className="text-blue-200 text-xs font-['Nunito']">{step}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleVolumeToggle}
          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
            audioEnabled ? "bg-white/20 hover:bg-white/30 text-white" : "bg-red-500/20 hover:bg-red-500/30 text-red-200"
          }`}
          aria-label={audioEnabled ? "Matikan Suara" : "Nyalakan Suara"}
        >
          {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {onHome && (
          <button
            onClick={handleHome}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
            aria-label="Beranda"
          >
            <Home size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
export default ScreenHeader;
