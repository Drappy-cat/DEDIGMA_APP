import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Lock, Compass, BookOpen, Search, MessageSquare } from "lucide-react";
import { MissionStage, Mission } from "../../types";
import { MISSIONS, STAGE_ORDER, STAGE_LABELS, ACTIVITY_LABELS } from "../../data/missions";
import { ScreenHeader } from "../../components/ScreenHeader";

// Sub-screens imports
import { OrientasiScreen } from "./OrientasiScreen";
import { MateriScreen } from "./MateriScreen";
import { CekFaktaScreen } from "./CekFaktaScreen";
import { AnalisisSumberScreen } from "./AnalisisSumberScreen";
import { DetektifBeritaScreen } from "./DetektifBeritaScreen";
import { RuangRefleksiScreen } from "./RuangRefleksiScreen";
import { MisiSelesaiScreen } from "./MisiSelesaiScreen";

interface MissionFlowProps {
  missionId: number;
  onComplete: (id: number, score: number) => void;
  onHome: () => void;
}

// Stage left icon mapping
const stageIcons: Record<string, React.ReactNode> = {
  orientasi: <Compass size={14} className="text-white" />,
  materi: <BookOpen size={14} className="text-[#654e38]" />,
  aktivitas: <Search size={14} className="text-[#654e38]" />,
  refleksi: <MessageSquare size={14} className="text-[#654e38]" />
};

export const MissionFlow: React.FC<MissionFlowProps> = ({ missionId, onComplete, onHome }) => {
  const mission = MISSIONS.find((m) => m.id === missionId) || MISSIONS[0];
  const [stage, setStage] = useState<MissionStage>("orientasi");
  const [activityScore, setActivityScore] = useState<number>(0);
  const [unlockedIndex, setUnlockedIndex] = useState<number>(0);

  const advance = (score?: number) => {
    if (score !== undefined) {
      setActivityScore(score);
    }
    const idx = STAGE_ORDER.indexOf(stage);
    if (idx !== -1 && idx < STAGE_ORDER.length - 1) {
      const nextIdx = idx + 1;
      setStage(STAGE_ORDER[nextIdx]);
      if (nextIdx > unlockedIndex) {
        setUnlockedIndex(nextIdx);
      }
    }
  };

  const stageIndex = STAGE_ORDER.indexOf(stage);
  const totalStages = STAGE_ORDER.length - 1; // Exclude 'selesai' from dots count

  // Get the right activity label for the step display
  const getStepLabel = () => {
    if (stage === "aktivitas") {
      return ACTIVITY_LABELS[mission.activityType] || "Aktivitas";
    }
    return STAGE_LABELS[stage];
  };

  // Render the correct activity component based on mission's activityType
  const renderActivity = () => {
    switch (mission.activityType) {
      case "cek-fakta":
        return <CekFaktaScreen mission={mission} onNext={(s) => advance(s)} onBack={() => setStage("materi")} />;
      case "analisis-sumber":
        return <AnalisisSumberScreen mission={mission} onNext={(s) => advance(s)} onBack={() => setStage("materi")} />;
      case "detektif-berita":
        return <DetektifBeritaScreen mission={mission} onNext={(s) => advance(s)} onBack={() => setStage("materi")} />;
      default:
        return <CekFaktaScreen mission={mission} onNext={(s) => advance(s)} onBack={() => setStage("materi")} />;
    }
  };

  if (stage === "selesai") {
    return (
      <div
        className="w-full h-full overflow-hidden flex flex-col"
        style={{
          backgroundImage: "url('/assets/telaga.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <MisiSelesaiScreen
          mission={mission}
          totalScore={activityScore}
          onContinue={() => {
            onComplete(missionId, activityScore);
            onHome();
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden select-none relative"
      style={{
        backgroundImage: "url('/assets/telaga.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Header */}
      <ScreenHeader
        title={`Misi ${missionId}: ${mission.name}`}
        onBack={onHome}
        onHome={onHome}
        step={`${getStepLabel()} (${stageIndex + 1}/${totalStages})`}
      />

      {/* Stage Tabs Row — Floating directly over sky background with distinct active (warm amber brown) vs completed (green) colors */}
      <div className="px-3 sm:px-6 py-2 sm:py-2.5 flex gap-2 sm:gap-3 select-none flex-shrink-0 relative z-20">
        {STAGE_ORDER.slice(0, -1).map((s, i) => {
          const isCompleted = i < stageIndex || (i <= unlockedIndex && i < stageIndex);
          const isActive = i === stageIndex;
          const isUnlocked = i <= unlockedIndex || i <= stageIndex;
          const label = i === 2 ? ACTIVITY_LABELS[mission.activityType] || STAGE_LABELS[s] : STAGE_LABELS[s];

          return (
            <button
              key={s}
              disabled={!isUnlocked}
              onClick={() => isUnlocked && setStage(s as MissionStage)}
              className={`flex-1 flex items-center justify-center relative px-3 py-1.5 sm:py-2 rounded-full font-['Fredoka'] font-extrabold text-xs sm:text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-b from-[#7a3418] via-[#652a12] to-[#4e1f0b] text-[#fff5ce] border-2 border-[#f3cc69] shadow-md scale-[1.02]"
                  : isCompleted
                  ? "bg-[#1c5c36] text-white shadow-xs border border-[#4ea96e] hover:bg-[#154629] cursor-pointer"
                  : "bg-[#f7edd8] text-[#523d2b] border border-[#e6d8be] shadow-xs cursor-not-allowed opacity-95"
              }`}
            >
              {/* Left Stage Icon */}
              <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-1.5 flex-shrink-0 ${
                isActive
                  ? "bg-[#f3a02b] border border-[#ffe082] text-white shadow-xs"
                  : isCompleted
                  ? "bg-white/20 border border-white/40 text-white"
                  : "bg-[#ebd9bc] border border-[#d6c4a3] text-[#654e38]"
              }`}>
                {stageIcons[s] || <Compass size={13} />}
              </span>

              <span className="truncate">{label}</span>
              
              {/* Right Icon Badge (Lock or Checkmark for completed/locked stages) */}
              {isCompleted ? (
                <div className="absolute right-1.5 sm:right-2 flex items-center justify-center">
                  <span className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-[10px]">
                    <Check size={11} strokeWidth={3} />
                  </span>
                </div>
              ) : !isActive ? (
                <div className="absolute right-1.5 sm:right-2 flex items-center justify-center">
                  <span className="w-5 h-5 rounded-full bg-[#dfcaa7]/60 border border-[#cbb38e]/60 flex items-center justify-center text-[#6e5640] text-[10px]">
                    <Lock size={10} />
                  </span>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Main Board Card Wrapping Container — Borderless Clean Card */}
      <div className="flex-1 min-h-0 overflow-visible flex flex-col mx-2 sm:mx-4 mb-2 sm:mb-3 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] relative z-10 bg-[#f7f2e5]">
        
        {/* Decorative Corner Leaves Accent */}
        <div className="absolute -top-3 -left-3 text-2xl z-30 select-none pointer-events-none">🌿</div>
        <div className="absolute -top-3 -right-3 text-2xl z-30 select-none pointer-events-none transform scale-x-[-1]">🌿</div>
        <div className="absolute -bottom-3 -left-3 text-2xl z-30 select-none pointer-events-none transform scale-y-[-1]">🌿</div>
        <div className="absolute -bottom-3 -right-3 text-2xl z-30 select-none pointer-events-none transform scale-x-[-1] scale-y-[-1]">🌿</div>

        {/* Stage Content Container — Scrollable without visible scrollbar */}
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col p-2 sm:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden h-full flex flex-col"
            >
              {stage === "orientasi" && <OrientasiScreen mission={mission} onNext={() => advance()} onBack={onHome} />}
              {stage === "materi" && <MateriScreen mission={mission} onNext={() => advance()} onBack={() => setStage("orientasi")} />}
              {stage === "aktivitas" && renderActivity()}
              {stage === "refleksi" && <RuangRefleksiScreen mission={mission} onNext={() => advance()} onBack={() => setStage("aktivitas")} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
export default MissionFlow;
