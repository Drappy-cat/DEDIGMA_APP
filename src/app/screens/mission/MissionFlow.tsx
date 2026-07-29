import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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

export const MissionFlow: React.FC<MissionFlowProps> = ({ missionId, onComplete, onHome }) => {
  const mission = MISSIONS.find((m) => m.id === missionId)!;
  const [stage, setStage] = useState<MissionStage>("orientasi");
  const [activityScore, setActivityScore] = useState<number>(0);

  const advance = (score?: number) => {
    if (score !== undefined) {
      setActivityScore(score);
    }
    const idx = STAGE_ORDER.indexOf(stage);
    if (idx !== -1 && idx < STAGE_ORDER.length - 1) {
      setStage(STAGE_ORDER[idx + 1]);
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
        return <CekFaktaScreen mission={mission} onNext={(s) => advance(s)} />;
      case "analisis-sumber":
        return <AnalisisSumberScreen mission={mission} onNext={(s) => advance(s)} />;
      case "detektif-berita":
        return <DetektifBeritaScreen mission={mission} onNext={(s) => advance(s)} />;
      default:
        return <CekFaktaScreen mission={mission} onNext={(s) => advance(s)} />;
    }
  };

  if (stage === "selesai") {
    return (
      <div
        className="w-full h-full overflow-hidden flex flex-col"
        style={{
          backgroundImage: "url('/assets/bg-lobby.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <MisiSelesaiScreen
          mission={mission}
          totalScore={activityScore}
          onContinue={() => onComplete(missionId, activityScore)}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full overflow-hidden select-none"
      style={{
        backgroundImage: "url('/assets/bg-lobby.png')",
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

      {/* Horizontal Stage Progress Bar dots */}
      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 flex gap-1.5 select-none flex-shrink-0 border-b border-gray-200">
        {STAGE_ORDER.slice(0, -1).map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-0.5">
            <div
              className={`h-2 w-full rounded-full transition-all duration-500 ${
                i < stageIndex ? "bg-green-400" : i === stageIndex ? "bg-blue-500 scale-y-125" : "bg-gray-200"
              }`}
            />
            <span className={`text-[8px] font-bold transition-colors ${
              i <= stageIndex ? "text-blue-600" : "text-gray-400"
            }`}>
              {i === 2 ? ACTIVITY_LABELS[mission.activityType] || STAGE_LABELS[s] : STAGE_LABELS[s]}
            </span>
          </div>
        ))}
      </div>

      {/* Active Stage Body Container */}
      <div
        className="flex-1 overflow-hidden flex flex-col mx-3 my-3 p-6 shadow-2xl relative z-10"
        style={{
          backgroundImage: "url('/assets/content-bg.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundColor: "transparent"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex-1 overflow-hidden h-full"
          >
            {stage === "orientasi" && <OrientasiScreen mission={mission} onNext={() => advance()} />}
            {stage === "materi" && <MateriScreen mission={mission} onNext={() => advance()} />}
            {stage === "aktivitas" && renderActivity()}
            {stage === "refleksi" && <RuangRefleksiScreen mission={mission} onNext={() => advance()} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
export default MissionFlow;
