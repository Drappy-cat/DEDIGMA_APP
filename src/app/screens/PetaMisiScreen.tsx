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
    { id: 1, name: "Larung Sesaji", emoji: "⛵", location: "Telaga Sarangan", top: "40%", left: "68%", color: "from-blue-600 to-cyan-500" },
    { id: 2, name: "Nyadaran", emoji: "🌺", location: "Magetan Kidul", top: "60%", left: "35%", color: "from-emerald-600 to-green-500" },
    { id: 3, name: "Ledhug Suro", emoji: "🥁", location: "Alun-Alun Magetan", top: "32%", left: "42%", color: "from-orange-600 to-amber-500" }
  ];

  return (
    <div
      className="h-full flex flex-col overflow-hidden relative select-none font-['Nunito']"
      style={{
        backgroundImage: "url('/assets/map-base.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Absolute Header overlay */}
      <div className="absolute top-0 inset-x-0 z-30">
        <ScreenHeader title="Peta Misi Budaya" onBack={onBack} onHome={onBack} />
      </div>

      {/* Map Content Viewport */}
      <div className="flex-1 relative w-full h-full pt-12 sm:pt-14">
        {pins.map((pin, idx) => {
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
                        delay: idx * 0.4
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
                  whileHover={{ scale: 1.14 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  {/* Glowing outer pin ring */}
                  <div className="relative">
                    {isCompleted && (
                      <span className="absolute -top-1.5 -right-1.5 z-30 text-white bg-emerald-500 rounded-full border-2 border-white w-6 h-6 flex items-center justify-center shadow-md animate-bounce">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border-4 border-white shadow-2xl relative z-10 bg-gradient-to-br ${pin.color}`}
                    >
                      {pin.emoji}
                    </div>
                    {/* Ring Pulse effect for active uncompleted mission */}
                    {!isCompleted && (
                      <span className="absolute inset-0 rounded-full border-4 border-amber-300 animate-ping opacity-75 pointer-events-none" />
                    )}
                  </div>
                  <div className="bg-white text-gray-800 border-2 border-amber-400 font-['Fredoka'] px-3.5 py-1 rounded-full text-xs font-bold shadow-xl leading-none flex flex-col items-center">
                    <span className="text-[10px] text-amber-700 font-semibold">Misi {pin.id}</span>
                    <span className="mt-0.5">{pin.name}</span>
                  </div>
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
export default PetaMisiScreen;
