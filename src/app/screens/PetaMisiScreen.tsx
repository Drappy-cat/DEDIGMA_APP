import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, Lock } from "lucide-react";
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
    { id: 2, name: "Nyadaran", emoji: "🌺", location: "Ngebel/Magetan Kidul", top: "60%", left: "35%", color: "from-emerald-600 to-green-500" },
    { id: 3, name: "Ledhug Suro", emoji: "🥁", location: "Alun-Alun Magetan", top: "32%", left: "42%", color: "from-orange-600 to-amber-500" }
  ];

  return (
    <div
      className="h-screen flex flex-col overflow-hidden relative select-none font-['Nunito']"
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
      <div className="flex-1 relative w-full h-full">
        {pins.map((pin) => {
          const isCompleted = completedMissions.has(pin.id);
          const isLocked = pin.id > 1 && !completedMissions.has(pin.id - 1);

          return (
            <div
              key={pin.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ top: pin.top, left: pin.left }}
            >
              {isLocked ? (
                // Locked Pin layout
                <div className="flex flex-col items-center gap-1.5 filter opacity-75">
                  <div className="bg-gray-500 text-white rounded-full w-12 h-12 flex items-center justify-center border-4 border-gray-400 shadow-lg cursor-not-allowed">
                    <Lock size={20} />
                  </div>
                  <div className="bg-gray-800/80 backdrop-blur-sm text-gray-200 px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
                    🔒 Misi {pin.id}
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
                  {/* Glowing outer pin ring */}
                  <div className="relative">
                    {isCompleted && (
                      <span className="absolute -top-1.5 -right-1.5 z-30 text-xl bg-amber-400 rounded-full border border-white w-6 h-6 flex items-center justify-center shadow-md animate-bounce">
                        ✅
                      </span>
                    )}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border-4 border-white shadow-2xl relative z-10 bg-gradient-to-br ${pin.color}`}
                    >
                      {pin.emoji}
                    </div>
                    {/* Ring Pulse effect for active uncompleted mission */}
                    {!isCompleted && (
                      <span className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-60 pointer-events-none" />
                    )}
                  </div>
                  <div className="bg-white text-gray-800 border-2 border-amber-300 font-['Fredoka'] px-3.5 py-1 rounded-full text-xs font-bold shadow-xl leading-none flex flex-col items-center">
                    <span className="text-[10px] text-gray-400">Misi {pin.id}</span>
                    <span className="mt-0.5">{pin.name}</span>
                  </div>
                </motion.button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PetaMisiScreen;
