import React, { useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, MapPin } from "lucide-react";
import { MISSIONS } from "../data/missions";
import { Mission } from "../types";
import { MascotDimas, MascotGita } from "../components/Mascot";
import { useAudio } from "../contexts/AudioContext";

interface IslandNodeProps {
  mission: Mission;
  done: boolean;
  unlocked: boolean;
  onClick: () => void;
  style: React.CSSProperties;
}

const IslandNode: React.FC<IslandNodeProps> = ({ mission, done, unlocked, onClick, style }) => {
  const gradients: Record<number, string> = {
    1: "from-blue-500 to-cyan-400",
    2: "from-emerald-500 to-green-400",
    3: "from-orange-500 to-amber-400"
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: mission.id * 0.15, type: "spring", stiffness: 180 }}
      className="absolute"
      style={style}
    >
      {/* Island terrain blur back-glow */}
      <div
        className="absolute inset-0 -m-4 rounded-full bg-green-700/50 blur-md select-none pointer-events-none"
        style={{ transform: "scale(1.2)" }}
      />

      {/* Number badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow-lg flex items-center justify-center select-none font-bold text-amber-900 text-sm">
        {mission.id}
      </div>

      {/* Card */}
      <button
        onClick={onClick}
        disabled={!unlocked}
        className={`relative z-10 w-28 rounded-xl overflow-hidden shadow-xl border-2 transition-all cursor-pointer select-none
          ${
            done
              ? "border-yellow-300 ring-2 ring-yellow-300/40"
              : unlocked
              ? "border-white/70 hover:scale-105 active:scale-95"
              : "border-white/20 grayscale opacity-70 cursor-not-allowed"
          }
        `}
      >
        {/* Illustration area */}
        <div
          className={`h-20 bg-gradient-to-br ${
            gradients[mission.id]
          } flex items-center justify-center text-2xl relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-600/70" />
          <div className="relative z-10 text-center leading-none">
            {unlocked ? <span className="text-2xl drop-shadow">{mission.emoji}</span> : <span className="text-2xl">🔒</span>}
          </div>
          {done && <div className="absolute top-1 right-1 text-sm select-none">✅</div>}
        </div>

        {/* Name banner */}
        <div className={`px-1.5 py-1.5 text-center ${done ? "bg-green-700" : unlocked ? "bg-blue-900" : "bg-gray-700"}`}>
          <p className="font-['Fredoka'] font-bold text-white text-[11px] leading-tight truncate">{mission.name}</p>
          {done && <p className="text-yellow-300 text-[9px] font-['Nunito']">✨ Selesai</p>}
          {!done && unlocked && <p className="text-blue-200 text-[9px] font-['Nunito']">Ketuk untuk mulai</p>}
          {!unlocked && <p className="text-gray-400 text-[9px] font-['Nunito']">🔒 Terkunci</p>}
        </div>
      </button>
    </motion.div>
  );
};

interface PetaMisiScreenProps {
  completedMissions: Set<number>;
  onMission: (id: number) => void;
  onBack: () => void;
}

export const PetaMisiScreen: React.FC<PetaMisiScreenProps> = ({ completedMissions, onMission, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();

  const positions = [
    { left: "7%", top: "45%" }, // Misi 1 (bottom-left)
    { left: "38%", top: "20%" }, // Misi 2 (center)
    { left: "68%", top: "8%" } // Misi 3 (top-right)
  ];

  useEffect(() => {
    if (completedMissions.size === 0) {
      playNarrator("Ayo kita mulai petualangan! Pilih misi pertama untuk menyelidiki tradisi Larung Sesaji di Telaga Sarangan.");
    } else if (completedMissions.size === 3) {
      playNarrator("Luar biasa! Kamu telah menyelesaikan semua misi budaya! Klik tombol kuning di bawah untuk melihat lencana dan sertifikat detektifmu.");
    } else {
      playNarrator("Misi berikutnya sudah terbuka! Klik pulau misi untuk melanjutkan penyelidikan budayamu.");
    }
    return () => {
      stopNarrator();
    };
  }, [completedMissions.size]);

  const handleBack = () => {
    playSFX("click");
    onBack();
  };

  return (
    <div
      className="min-h-screen flex flex-col select-none"
      style={{ background: "linear-gradient(160deg, #0f4c6e 0%, #1a6b5c 40%, #0d3d5c 100%)" }}
    >
      {/* Header */}
      <div className="bg-black/30 backdrop-blur px-4 py-3 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors cursor-pointer text-white"
          aria-label="Kembali"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-['Fredoka'] font-bold text-white text-xl tracking-wide drop-shadow-sm">PETA MISI BUDAYA</h2>
        </div>
        <div className="w-8" />
      </div>

      {/* Subtitle */}
      <div className="text-center py-2">
        <p className="font-['Nunito'] text-cyan-200 text-sm px-4">Pilih misi budaya yang ingin kamu jelajahi!</p>
      </div>

      {/* Map canvas */}
      <div className="flex-1 relative overflow-hidden mx-3 mb-3 rounded-3xl" style={{ minHeight: 340 }}>
        {/* Ocean background */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden"
          style={{ background: "radial-gradient(ellipse at 30% 60%, #1a7a5e 0%, #0d5a8a 50%, #0a3d6b 100%)" }}
        >
          {/* Waves */}
          {[20, 35, 50, 65, 80].map((top, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-cyan-400/20"
              style={{ top: `${top}%`, transform: `rotate(${i % 2 === 0 ? -1.5 : 1}deg)` }}
            />
          ))}
          {/* Sparkles */}
          {["5%,15%", "80%,25%", "20%,75%", "60%,55%", "90%,70%", "45%,85%"].map((pos, i) => {
            const [l, t] = pos.split(",");
            return (
              <div key={i} className="absolute text-xs opacity-50" style={{ left: l, top: t }}>
                ✨
              </div>
            );
          })}
          {/* Decorative Trees */}
          {["15%,90%", "55%,80%", "85%,55%"].map((pos, i) => {
            const [l, t] = pos.split(",");
            return (
              <div key={i} className="absolute opacity-30 text-base" style={{ left: l, top: t }}>
                🌳
              </div>
            );
          })}
        </div>

        {/* SVG connecting paths */}
        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <marker id="arrowhead" markerWidth="4" markerHeight="3" refX="2" refY="1.5" orient="auto">
              <polygon points="0 0, 4 1.5, 0 3" fill="#fbbf24" opacity="0.9" />
            </marker>
          </defs>
          <path
            d="M 21 65 Q 36 50 51 38"
            stroke="#fbbf24"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            fill="none"
            opacity="0.85"
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 51 38 Q 66 26 81 22"
            stroke="#fbbf24"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            fill="none"
            opacity="0.85"
            markerEnd="url(#arrowhead)"
          />
        </svg>

        {/* Islands */}
        {MISSIONS.map((m, idx) => {
          const done = completedMissions.has(m.id);
          const unlocked = m.id === 1 || completedMissions.has(m.id - 1);
          return (
            <IslandNode
              key={m.id}
              mission={m}
              done={done}
              unlocked={unlocked}
              onClick={() => {
                if (unlocked) {
                  playSFX("click");
                  onMission(m.id);
                }
              }}
              style={{
                left: positions[idx].left,
                top: positions[idx].top,
                width: 112
              }}
            />
          );
        })}

        {/* Mascots */}
        <div className="absolute bottom-3 right-3 z-20 flex items-end gap-2 pointer-events-none">
          <MascotDimas size="sm" animate={true} />
          <MascotGita size="sm" animate={true} />
        </div>
      </div>

      {/* Warning info bar */}
      <div className="mx-3 mb-4 bg-blue-800/80 backdrop-blur rounded-2xl px-4 py-2.5 border border-blue-500/40 shadow">
        <p className="font-['Nunito'] text-blue-100 text-xs text-center leading-relaxed">
          Selesaikan setiap misi secara berurutan untuk membuka misi berikutnya dan mendapatkan lencana! 🏅
        </p>
      </div>
    </div>
  );
};
export default PetaMisiScreen;
