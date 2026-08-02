import React from "react";
import { motion } from "motion/react";
import { Lock, Check } from "lucide-react";
import { useAudio } from "../contexts/AudioContext";
import { ScreenHeader } from "../components/ScreenHeader";

interface PetaMisiScreenProps {
  completedMissions: Set<number>;
  onMission: (id: number) => void;
  onBack: () => void;
}

export const PetaMisiScreen: React.FC<PetaMisiScreenProps> = ({
  completedMissions,
  onMission,
  onBack
}) => {
  const { playSFX } = useAudio();

  const handleSelect = (id: number) => {
    playSFX("click");
    onMission(id);
  };

  // Specific absolute positions mapping to the custom map graphic coordinates
  const pins = [
    { 
      id: 1, 
      name: "Larung Sesaji", 
      emoji: "⛵", 
      icon: "",
      image: "/assets/larung sesaji.svg",
      type: "card",
      location: "Telaga Sarangan", 
      top: "70%", 
      left: "45%", 
      color: "from-blue-600 to-cyan-500" 
    },
    { id: 2, name: "Nyadaran", emoji: "🌺", type: "circle", location: "Ngebel/Magetan Kidul", top: "45%", left: "55%", color: "from-emerald-600 to-green-500" },
    { id: 3, name: "Ledhug Suro", emoji: "🥁", type: "circle", location: "Alun-Alun Magetan", top: "25%", left: "30%", color: "from-orange-600 to-amber-500" }
  ];

  return (
    <motion.div
      className="h-full flex flex-col overflow-hidden relative select-none font-['Nunito']"
      style={{
        backgroundImage: "url('/assets/peta.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Animasi Atmosfer Peta (Awan & Kunang-kunang) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Awan Drifting (Kabut tipis) */}
        <motion.div
          className="absolute top-[5%] left-[-20%] w-[30rem] h-32 bg-white/30 blur-[40px] rounded-full"
          animate={{ x: ["0vw", "120vw"] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-[25%] left-[-30%] w-[40rem] h-40 bg-white/20 blur-[50px] rounded-full"
          animate={{ x: ["0vw", "130vw"] }}
          transition={{ duration: 65, repeat: Infinity, ease: "linear", delay: 15 }}
        />
        
        {/* Kunang-kunang Ajaib (Fireflies) */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`firefly-${i}`}
            className="absolute bg-amber-200 rounded-full shadow-[0_0_8px_2px_rgba(253,230,138,0.8)]"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${10 + Math.random() * 80}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`
            }}
            animate={{
              y: [0, -40 + Math.random() * 10, 0],
              x: [0, (Math.random() - 0.5) * 50, 0],
              opacity: [0, 0.7, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Absolute Header overlay */}
      <div className="absolute top-0 inset-x-0 z-30">
        <ScreenHeader title="Peta Misi Budaya" onBack={onBack} onHome={onBack} />
      </div>

      {/* Map Content Viewport */}
      <div className="flex-1 relative w-full h-full pt-12 sm:pt-14">
        {/* Teks Peta (map-petatxt.svg) */}
        <motion.div 
          className="absolute -top-14 sm:-top-20 left-1/2 -translate-x-1/2 z-40 w-64 sm:w-80 md:w-96 pointer-events-none"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.3, duration: 1, delay: 0.4 }}
        >
          <img 
            src="/assets/map-petatxt.svg" 
            alt="Peta Budaya" 
            className="w-full h-auto drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
          />
        </motion.div>

        {/* Jejak Jalur (Dotted Path) */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <path
            d="M 75 88 Q 45 88 45 70 T 55 45 T 30 25"
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="0.8"
            strokeDasharray="1.5 1.5"
            vectorEffect="non-scaling-stroke"
            className="filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
          />
        </svg>

        {pins.map((pin) => {
          const isCompleted = completedMissions.has(pin.id);
          const isLocked = pin.id > 1 && !completedMissions.has(pin.id - 1);

          return (
            <motion.div
              key={pin.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform transform-gpu"
              style={{ top: pin.top, left: pin.left }}
              animate={
                !isLocked
                  ? {
                      y: [0, -6, 0],
                      transition: {
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: pin.id * 0.4
                      }
                    }
                  : {}
              }
            >
              {isLocked ? (
                // Locked Pin layout
                <div className="flex flex-col items-center gap-1.5 filter opacity-75">
                  <div className="bg-gray-700/80 text-gray-300 rounded-full w-12 h-12 flex items-center justify-center border-4 border-gray-500/80 shadow-lg cursor-not-allowed">
                    <Lock size={18} />
                  </div>
                  <div className="bg-gray-900/80 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-full text-[10px] font-bold shadow-md border border-gray-700">
                    Misi {pin.id} Terkunci
                  </div>
                </div>
              ) : (
                // Active/Completed Pin layout
                <motion.button
                  onClick={() => handleSelect(pin.id)}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.93 }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  {/* Glowing outer pin ring or Card */}
                  <div className="relative">
                    {isCompleted && (
                      <span className="absolute -top-1.5 -right-1.5 z-30 text-white bg-emerald-500 rounded-full border-2 border-white w-6 h-6 flex items-center justify-center shadow-md animate-bounce">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                    {pin.type === "card" ? (
                      <div className="w-24 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden border-4 border-white shadow-2xl relative z-10 flex items-center justify-center bg-white">
                        <img src={pin.image} alt={pin.name} className="absolute inset-0 w-full h-full object-cover" />
                        {pin.icon && (
                          <span className="text-3xl relative z-10 filter drop-shadow-md">{pin.icon}</span>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border-4 border-white shadow-2xl relative z-10 bg-gradient-to-br ${pin.color}`}
                      >
                        {pin.emoji}
                      </div>
                    )}
                    {/* Ring Pulse effect for active uncompleted mission */}
                    {!isCompleted && (
                      <span className="absolute inset-0 rounded-full border-4 border-amber-300 animate-ping opacity-75 pointer-events-none" />
                    )}
                  </div>
                  <div className="bg-white text-gray-800 border-2 border-amber-300 font-['Fredoka'] px-3.5 py-1 rounded-full text-xs font-bold shadow-xl leading-none flex flex-col items-center mt-1">
                    <span className="text-[10px] text-amber-700 font-semibold">Misi {pin.id}</span>
                    <span className="mt-0.5">{pin.name}</span>
                  </div>
                </motion.button>
              )}
            </motion.div>
          );
        })}

        {/* Karakter Penunjuk Peta (Dimas & Gita) */}
        <motion.div 
          className="absolute bottom-0 left-[-1rem] sm:left-4 z-50 flex items-end drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] pointer-events-none"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.2, duration: 1.2, delay: 0.5 }}
        >
          <motion.img 
            src="/assets/mascot/gita-peta.svg" 
            alt="Gita" 
            className="w-44 sm:w-60 h-auto object-contain relative z-10 scale-x-[-1]"
            animate={{ y: [24, 19, 24] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.img 
            src="/assets/mascot/dimas-peta.svg" 
            alt="Dimas" 
            className="w-48 sm:w-64 h-auto object-contain -ml-16 sm:-ml-24 relative z-20"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
export default PetaMisiScreen;
