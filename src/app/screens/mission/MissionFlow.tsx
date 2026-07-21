import React, { useState } from "react";
import { MissionStage, Mission } from "../../types";
import { MISSIONS, STAGE_ORDER, STAGE_LABELS } from "../../data/missions";
import { ScreenHeader } from "../../components/ScreenHeader";
import { SkyBg } from "../../components/SkyBg";

// Sub-screens imports
import { MateriScreen } from "./MateriScreen";
import { CariFaktaScreen } from "./CariFaktaScreen";
import { CekFaktaScreen } from "./CekFaktaScreen";
import { AnalisisSumberScreen } from "./AnalisisSumberScreen";
import { DetektifBeritaScreen } from "./DetektifBeritaScreen";
import { RuangRefleksiScreen } from "./RuangRefleksiScreen";
import { TantanganScreen } from "./TantanganScreen";
import { MisiSelesaiScreen } from "./MisiSelesaiScreen";

interface MissionFlowProps {
  missionId: number;
  onComplete: (id: number, score: number) => void;
  onHome: () => void;
}

export const MissionFlow: React.FC<MissionFlowProps> = ({ missionId, onComplete, onHome }) => {
  const mission = MISSIONS.find((m) => m.id === missionId)!;
  const [stage, setStage] = useState<MissionStage>("materi");
  const [scores, setScores] = useState<number[]>([]);

  const advance = (score?: number) => {
    const newScores = score !== undefined ? [...scores, score] : scores;
    setScores(newScores);
    const idx = STAGE_ORDER.indexOf(stage);
    if (idx !== -1 && idx < STAGE_ORDER.length - 1) {
      setStage(STAGE_ORDER[idx + 1]);
    }
  };

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const stageIndex = STAGE_ORDER.indexOf(stage);
  const totalStages = STAGE_ORDER.length - 1; // Exclude 'selesai' from dots count

  if (stage === "selesai") {
    return (
      <SkyBg>
        <MisiSelesaiScreen
          mission={mission}
          totalScore={avgScore}
          onContinue={() => onComplete(missionId, avgScore)}
        />
      </SkyBg>
    );
  }

  return (
    <SkyBg className="flex flex-col h-screen overflow-hidden select-none">
      {/* Header */}
      <ScreenHeader
        title={`Misi ${missionId}: ${mission.name}`}
        onBack={onHome}
        onHome={onHome}
        step={`${STAGE_LABELS[stage]} (${stageIndex + 1}/${totalStages})`}
      />

      {/* Horizontal Stage Progress Bar dots */}
      <div className="bg-white px-4 py-2 flex gap-1 select-none flex-shrink-0">
        {STAGE_ORDER.slice(0, -1).map((s, i) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              i < stageIndex ? "bg-green-400" : i === stageIndex ? "bg-blue-500 scale-y-110" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Active Stage Body Container */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white/80 backdrop-blur-sm mx-2 my-2 rounded-3xl shadow-xl border border-white/20">
        {stage === "materi" && <MateriScreen mission={mission} onNext={() => advance()} />}
        {stage === "cari-fakta" && <CariFaktaScreen mission={mission} onNext={advance} />}
        {stage === "cek-fakta" && <CekFaktaScreen mission={mission} onNext={advance} />}
        {stage === "analisis-sumber" && <AnalisisSumberScreen mission={mission} onNext={advance} />}
        {stage === "detektif-berita" && <DetektifBeritaScreen mission={mission} onNext={advance} />}
        {stage === "ruang-refleksi" && <RuangRefleksiScreen mission={mission} onNext={() => advance()} />}
        {stage === "tantangan" && <TantanganScreen mission={mission} onFinish={(s) => advance(s)} />}
      </div>
    </SkyBg>
  );
};
export default MissionFlow;
