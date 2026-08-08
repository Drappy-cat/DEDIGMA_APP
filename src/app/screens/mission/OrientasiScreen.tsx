import React, { useEffect } from "react";
import { motion } from "motion/react";
import { MapPin, Search, BookOpen, Star, Target, Sparkles } from "lucide-react";
import { Mission } from "../../types";
import { useAudio } from "../../contexts/AudioContext";

// Helper for photo URL
const unsplashUrl = (photoId: string, w = 600, h = 750) => {
  return `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
};

interface OrientasiScreenProps {
  mission: Mission;
  onNext: () => void;
  onBack?: () => void;
}

export const OrientasiScreen: React.FC<OrientasiScreenProps> = ({ mission, onNext, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();

  useEffect(() => {
    playNarrator(mission.orientasi.narasi);
    return () => {
      stopNarrator();
    };
  }, [mission.id]);

  const handleNext = () => {
    playSFX("click");
    onNext();
  };

  const heroPhoto = mission.galeri.length > 0
    ? (mission.galeri[0].imageSrc || unsplashUrl(mission.galeri[0].photoId, 600, 750))
    : "/assets/materi-bg.jpg";

  return (
    <div className="flex flex-col h-full font-['Nunito'] justify-between overflow-y-auto max-h-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-h-0 relative p-1 sm:p-2 select-none">
      
      {/* Top Centered Header Area */}
      <div className="flex flex-col items-center relative mb-1 sm:mb-2">
        {/* Top Centered Ribbon Badge */}
        <div className="bg-[#2a6838] border-2 border-[#1b4a24] rounded-full px-6 py-1 text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-xs flex items-center gap-2 relative z-10">
          <span className="text-base select-none">🌿</span>
          <span>ORIENTASI MISI {mission.id}</span>
          <span className="text-base select-none transform scale-x-[-1]">🌿</span>
        </div>

        {/* Main Title with Leaf Sprigs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 my-1">
          <span className="text-2xl sm:text-3xl text-[#1e582d] select-none">🌿</span>
          <h1 className="font-['Fredoka'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1c5c32] tracking-wider uppercase leading-none drop-shadow-xs text-center">
            {mission.name}
          </h1>
          <span className="text-2xl sm:text-3xl text-[#1e582d] select-none transform scale-x-[-1]">🌿</span>
        </div>

        {/* Location Badge Subtitle */}
        <div className="bg-[#faf3e3] border border-[#e8dcb8] rounded-full px-4 py-1 text-[#5c4733] font-['Nunito'] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs">
          <MapPin size={14} className="text-[#a6251a] flex-shrink-0" />
          <span>{mission.location}</span>
        </div>
      </div>

      {/* Main Content Grid Layout (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 flex-1 min-h-0 items-center my-auto">
        
        {/* Left Column: Polaroid Photo Card + Mascot Overlay + Speech Bubble */}
        <motion.div
          initial={{ x: -15, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="md:col-span-5 relative flex flex-col justify-center items-center h-full min-h-[220px] sm:min-h-[270px]"
        >
          {/* Polaroid Photo Frame */}
          <div className="w-full max-w-[250px] sm:max-w-[280px] bg-[#fdfbf7] p-2.5 sm:p-3 pb-7 sm:pb-8 rounded-3xl border border-[#e2d8c3] shadow-[0_8px_25px_rgba(0,0,0,0.15)] relative transform -rotate-1 transition-transform hover:rotate-0">
            {/* Top Left Leaf Accent Badge */}
            <div className="absolute -top-2 -left-2 text-xl select-none z-10">🌿</div>

            {/* Photo Image Container */}
            <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#eedebe] border border-[#d6c7a3] shadow-inner relative">
              <img
                src={heroPhoto}
                alt={mission.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Dimas Mascot Overlay at Bottom Left */}
          <div className="absolute -bottom-3 -left-3 sm:-bottom-5 sm:-left-5 w-32 sm:w-44 z-20 pointer-events-none">
            <img
              src="/assets/mascot/Dimas-Petunjuk.svg"
              alt="Dimas Mascot"
              className="w-full h-auto object-contain filter drop-shadow-lg"
            />
          </div>

          {/* Speech Bubble Attached to Photo — Positioned cleanly out of mascot hand overlap */}
          <div className="bg-[#fdfcf7] border-2 border-[#e8dcb8] rounded-2xl py-2.5 px-3 sm:py-3 sm:px-4 pl-12 sm:pl-14 flex items-center gap-2 shadow-xs -mt-5 sm:-mt-6 ml-16 sm:ml-24 relative z-10 max-w-[240px] sm:max-w-[280px]">
            <p className="text-[#523e2b] text-[11px] sm:text-xs font-['Nunito'] font-bold leading-snug">
              Setiap tradisi menyimpan pesan penting untuk kehidupan kita.
            </p>
          </div>
        </motion.div>

        {/* Right Column: Parchment Narration Card + 3 Objective Cards + Big Green CTA Button */}
        <motion.div
          initial={{ x: 15, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="md:col-span-7 flex flex-col justify-between h-full space-y-3"
        >
          {/* Parchment Narration Card */}
          <div className="bg-[#fbf7ee] border border-[#e5dabf] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3 relative flex-1 flex flex-col justify-between">
            {/* Greeting Header with Leaf Badge & Sparkles */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#256c3a] text-white flex items-center justify-center flex-shrink-0 shadow-xs text-sm">
                  🍃
                </div>
                <h3 className="font-['Fredoka'] font-extrabold text-[#1c5c32] text-sm sm:text-base md:text-lg leading-tight">
                  Selamat datang, Detektif!
                </h3>
              </div>
              <Sparkles size={18} className="text-[#e5a00d] flex-shrink-0" />
            </div>

            {/* Introduction Paragraph */}
            <p className="text-[#4a3728] text-xs sm:text-sm leading-relaxed font-semibold font-['Nunito'] text-justify">
              Kali ini kita akan menjelajahi tradisi <strong className="text-[#1c5c32] font-bold">{mission.name}</strong> di <strong className="text-[#1c5c32] font-bold">{mission.location}</strong>. Tradisi ini sudah berlangsung ratusan tahun sebagai wujud syukur kepada Tuhan Yang Maha Esa.
            </p>

            {/* 3 Objective Cards Container */}
            <div className="space-y-2 pt-1">
              {/* Objective 1: Kenali Tradisinya */}
              <div className="bg-[#f5ebd6]/70 border border-[#e8d9bd] rounded-2xl p-2.5 flex items-center gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#e8dbbd] border border-[#d6c4a3] flex items-center justify-center text-[#256c3a] flex-shrink-0 shadow-xs">
                  <BookOpen size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-['Fredoka'] font-extrabold text-[#3a2718] text-xs sm:text-sm leading-tight">
                    Kenali Tradisinya
                  </h4>
                  <p className="font-['Nunito'] font-semibold text-[#5c4837] text-[11px] sm:text-xs leading-none mt-0.5">
                    Pelajari sejarah dan makna {mission.name}.
                  </p>
                </div>
              </div>

              {/* Objective 2: Pahami Pesannya */}
              <div className="bg-[#f5ebd6]/70 border border-[#e8d9bd] rounded-2xl p-2.5 flex items-center gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#e8dbbd] border border-[#d6c4a3] flex items-center justify-center text-[#e5a00d] flex-shrink-0 shadow-xs">
                  <Star size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-['Fredoka'] font-extrabold text-[#3a2718] text-xs sm:text-sm leading-tight">
                    Pahami Pesannya
                  </h4>
                  <p className="font-['Nunito'] font-semibold text-[#5c4837] text-[11px] sm:text-xs leading-none mt-0.5">
                    Temukan nilai-nilai kehidupan di dalamnya.
                  </p>
                </div>
              </div>

              {/* Objective 3: Selesaikan Misi */}
              <div className="bg-[#f5ebd6]/70 border border-[#e8d9bd] rounded-2xl p-2.5 flex items-center gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[#e8dbbd] border border-[#d6c4a3] flex items-center justify-center text-[#d94828] flex-shrink-0 shadow-xs">
                  <Target size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-['Fredoka'] font-extrabold text-[#3a2718] text-xs sm:text-sm leading-tight">
                    Selesaikan Misi
                  </h4>
                  <p className="font-['Nunito'] font-semibold text-[#5c4837] text-[11px] sm:text-xs leading-none mt-0.5">
                    Kumpulkan informasi dan selesaikan tantangan!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Big Green CTA Button: MULAI PETUALANGAN! */}
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-b from-[#2d7a42] via-[#216334] to-[#174d27] hover:from-[#358a4c] hover:to-[#1b572d] border-4 border-[#164222] outline outline-2 outline-[#4ea96e] text-white rounded-full py-2.5 sm:py-3.5 px-6 font-['Fredoka'] font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg tracking-wide uppercase cursor-pointer hover:scale-[1.02] active:scale-95 transition-all focus:outline-none"
            aria-label="Mulai Petualangan"
          >
            <div className="w-8 h-8 rounded-full bg-[#f3c233] border border-[#ffe58f] text-[#1c4d29] flex items-center justify-center shadow-xs flex-shrink-0">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <span>MULAI PETUALANGAN!</span>
            <span className="text-xl select-none">🌿</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrientasiScreen;
