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
          backgroundImage: "url('/assets/bg-lobby.svg')",
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
        backgroundImage: "url('/assets/bg-lobby.svg')",
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

      {/* Horizontal Stage Progress Bar */}
      <div className="bg-[#f4ecd5]/95 backdrop-blur-sm px-4 py-2 flex gap-1.5 select-none flex-shrink-0 border-b-2 border-[#c2aa84]/50">
        {STAGE_ORDER.slice(0, -1).map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-0.5">
            <div
              className={`h-2 w-full rounded-full transition-all duration-500 ${
                i < stageIndex ? "bg-[#366635]" : i === stageIndex ? "bg-[#7e371b] scale-y-125" : "bg-[#d8c7a5]"
              }`}
            />
            <span className={`text-[8px] font-['Fredoka'] font-bold transition-colors ${
              i <= stageIndex ? "text-[#7e371b]" : "text-[#b5a08a]"
            }`}>
              {i === 2 ? ACTIVITY_LABELS[mission.activityType] || STAGE_LABELS[s] : STAGE_LABELS[s]}
            </span>
          </div>
        ))}
      </div>

      {/* Active Stage Body Container — Parchment Board */}
      <div
        className="flex-1 min-h-0 overflow-visible flex flex-col mx-2 sm:mx-3 my-2 sm:my-3 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] relative z-10 bg-[#f4ecd5] border-4 border-[#c2aa84]"
      >
        <div className="flex-1 min-h-0 overflow-visible flex flex-col p-3 sm:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex-1 min-h-0 overflow-visible h-full flex flex-col"
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
