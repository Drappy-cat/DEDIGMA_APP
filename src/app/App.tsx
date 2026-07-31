import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AudioProvider, useAudio } from "./contexts/AudioContext";
import { Screen, Role, GameState, createDefaultGameState, calculateBadges } from "./types";
import { Btn } from "./components/Btn";
import { TANTANGAN_QUESTIONS } from "./data/missions";

// Screens imports
import { LoginScreen } from "./screens/LoginScreen";
import { SplashScreen } from "./screens/SplashScreen";
import { PetunjukScreen } from "./screens/PetunjukScreen";
import { TujuanScreen } from "./screens/TujuanScreen";
import { ProfilScreen } from "./screens/ProfilScreen";
import { PetaMisiScreen } from "./screens/PetaMisiScreen";
import { PosttestScreen } from "./screens/PosttestScreen";
import { LencanaScreen } from "./screens/LencanaScreen";
import { SertifikatScreen } from "./screens/SertifikatScreen";
import { GuruDashboardScreen } from "./screens/GuruDashboardScreen";
import { MissionFlow } from "./screens/mission/MissionFlow";

// Helper: Load/Save GameState from localStorage
function loadGameState(): GameState {
  try {
    const saved = localStorage.getItem("dedigma_game_state");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse game state", e);
  }
  return createDefaultGameState();
}

function saveGameState(state: GameState) {
  localStorage.setItem("dedigma_game_state", JSON.stringify(state));
}

function DemoPanel({
  screen,
  setScreen,
  setCompletedMissions,
  setMissionScores,
  setPosttestScore
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
  setCompletedMissions: (m: Set<number>) => void;
  setMissionScores: (s: Record<number, number>) => void;
  setPosttestScore: (s: number | null) => void;
}) {
  const { role, isLoggedIn, loginSiswa, loginGuru, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (targetScreen: Screen, targetRole?: Role) => {
    if (targetScreen === "login") return !isLoggedIn;
    if (targetRole) return isLoggedIn && role === targetRole && screen === targetScreen;
    return isLoggedIn && screen === targetScreen;
  };

  const handleSwitch = (target: "siswa-peta" | "guru-dashboard" | "login" | "splash" | "posttest" | "lencana") => {
    if (target === "login") {
      logout();
      setScreen("login");
    } else if (target === "siswa-peta") {
      loginSiswa("Siswa Demo");
      setScreen("peta-misi");
    } else if (target === "guru-dashboard") {
      loginGuru("Guru Demo", "guru@demo.com");
      setScreen("guru-dashboard");
    } else if (target === "splash") {
      loginSiswa("Siswa Demo");
      setScreen("splash");
    } else if (target === "posttest") {
      loginSiswa("Siswa Demo");
      setCompletedMissions(new Set([1, 2, 3]));
      setPosttestScore(null);
      setScreen("posttest");
    } else if (target === "lencana") {
      loginSiswa("Siswa Demo");
      setCompletedMissions(new Set([1, 2, 3]));
      setMissionScores({ 1: 90, 2: 85, 3: 95 });
      setPosttestScore(90);
      setScreen("lencana");
    }
  };

  return (
    <div className="fixed left-4 bottom-4 z-[999] font-['Nunito'] select-none">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900/90 text-white rounded-full px-4 py-2.5 text-xs font-bold shadow-2xl border border-slate-700/60 flex items-center gap-1.5 hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
        >
          🛠️ Demo Mode
        </button>
      ) : (
        <div className="bg-slate-900/95 border border-slate-700/60 rounded-3xl p-4 shadow-2xl w-48 space-y-2 flex flex-col text-left">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DEMO MODE</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer p-0.5"
            >
              ❌
            </button>
          </div>

          <button
            onClick={() => handleSwitch("siswa-peta")}
            className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isActive("peta-misi", "siswa")
                ? "bg-white text-slate-900 shadow-md font-bold"
                : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200"
            }`}
          >
            <span>🧑‍🎓</span> Tampilan Siswa
          </button>

          <button
            onClick={() => handleSwitch("guru-dashboard")}
            className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isActive("guru-dashboard", "guru")
                ? "bg-white text-slate-900 shadow-md font-bold"
                : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200"
            }`}
          >
            <span>👩‍🏫</span> Tampilan Guru
          </button>

          <button
            onClick={() => handleSwitch("login")}
            className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isActive("login")
                ? "bg-white text-slate-900 shadow-md font-bold"
                : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200"
            }`}
          >
            <span>🔄</span> Onboarding
          </button>

          <button
            onClick={() => handleSwitch("splash")}
            className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isActive("splash", "siswa")
                ? "bg-white text-slate-900 shadow-md font-bold"
                : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200"
            }`}
          >
            <span>✨</span> Splashscreen
          </button>

          <button
            onClick={() => handleSwitch("posttest")}
            className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isActive("posttest", "siswa")
                ? "bg-white text-slate-900 shadow-md font-bold"
                : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200"
            }`}
          >
            <span>📝</span> Posttest Kuis
          </button>

          <button
            onClick={() => handleSwitch("lencana")}
            className={`w-full text-left rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isActive("lencana", "siswa") || isActive("sertifikat", "siswa")
                ? "bg-white text-slate-900 shadow-md font-bold"
                : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200"
            }`}
          >
            <span>🏆</span> Admin / Certs
          </button>
        </div>
      )}
    </div>
  );
}

function AppContent() {
  const { role, userName, isLoggedIn } = useAuth();
  const { playSFX } = useAudio();
  const [screen, setScreen] = useState<Screen>("login");
  const [currentMissionId, setCurrentMissionId] = useState<number>(1);
  const [completedMissions, setCompletedMissions] = useState<Set<number>>(new Set());
  const [missionScores, setMissionScores] = useState<Record<number, number>>({});
  const [posttestScore, setPosttestScore] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>(loadGameState());

  // Sync screen with auth state
  useEffect(() => {
    if (!isLoggedIn) {
      setScreen("login");
      setCompletedMissions(new Set());
      setMissionScores({});
      setPosttestScore(null);
      setGameState(createDefaultGameState());
    } else {
      if (role === "guru") {
        setScreen("guru-dashboard");
      } else {
        setScreen("splash");

        // Load student progress from GameState
        const loaded = loadGameState();
        setGameState(loaded);

        const completed = new Set<number>();
        const scores: Record<number, number> = {};
        for (const [idStr, progress] of Object.entries(loaded.missions)) {
          const id = Number(idStr);
          if (progress.completed) {
            completed.add(id);
            scores[id] = progress.activityScore;
          }
        }
        setCompletedMissions(completed);
        setMissionScores(scores);
        if (loaded.posttest.score !== null) {
          setPosttestScore(loaded.posttest.score);
        }
      }
    }
  }, [isLoggedIn, role]);

  const navigateTo = (nextScreen: Screen) => {
    playSFX("click");
    setScreen(nextScreen);
  };

  const completeMission = (id: number, score: number) => {
    setCompletedMissions((prev) => {
      const next = new Set([...prev, id]);
      return next;
    });
    setMissionScores((prev) => {
      const next = { ...prev, [id]: score };
      return next;
    });

    // Update GameState
    setGameState((prev) => {
      const updated = {
        ...prev,
        missions: {
          ...prev.missions,
          [id]: {
            ...prev.missions[id],
            activityScore: score,
            completed: true
          }
        }
      };
      // Calculate badges
      const allScores: Record<number, number> = {};
      for (const [key, m] of Object.entries(updated.missions)) {
        if (m.completed) allScores[Number(key)] = m.activityScore;
      }
      updated.badges = calculateBadges(allScores);
      updated.totalScore = Object.values(allScores).length > 0
        ? Math.round(Object.values(allScores).reduce((a, b) => a + b, 0) / Object.values(allScores).length)
        : 0;

      saveGameState(updated);
      return updated;
    });

    setScreen("peta-misi");
  };

  const allMissionsDone = completedMissions.size === 3;

  // Render Login and Teacher Dashboard without container constraint
  if (!isLoggedIn || role === "guru" || screen === "login" || screen === "guru-dashboard") {
    return (
      <div className="size-full min-h-screen font-['Nunito']" style={{ fontFamily: "'Nunito', sans-serif" }}>
        {screen === "login" && <LoginScreen />}
        {screen === "guru-dashboard" && <GuruDashboardScreen />}
        <DemoPanel
          screen={screen}
          setScreen={setScreen}
          setCompletedMissions={setCompletedMissions}
          setMissionScores={setMissionScores}
          setPosttestScore={setPosttestScore}
        />
      </div>
    );
  }

  // Student Gameplay: Wrapped inside a centered rounded tablet frame container on larger monitors
  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center py-0 md:py-6 px-0 md:px-4 font-['Nunito'] select-none">
      <div className="w-full max-w-5xl min-h-screen md:min-h-0 md:h-[700px] bg-white relative overflow-hidden shadow-2xl md:rounded-3xl border border-white/10 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full flex flex-col relative overflow-hidden"
          >
            {screen === "splash" && (
              <SplashScreen
                onMulai={() => navigateTo("petunjuk")}
                onPetunjuk={() => navigateTo("petunjuk")}
                onProfil={() => navigateTo("profil")}
              />
            )}

            {screen === "petunjuk" && <PetunjukScreen onBack={() => navigateTo("tujuan")} />}
            {screen === "tujuan" && (
              <TujuanScreen
                onNext={() => navigateTo("peta-misi")}
                onBack={() => navigateTo("petunjuk")}
              />
            )}
            {screen === "profil" && <ProfilScreen onBack={() => navigateTo("splash")} />}

            {screen === "peta-misi" && (
              <div className="flex flex-col h-full relative">
                <PetaMisiScreen
                  completedMissions={completedMissions}
                  onMission={(id) => {
                    setCurrentMissionId(id);
                    navigateTo("mission-flow");
                  }}
                  onBack={() => navigateTo("splash")}
                />
                {allMissionsDone && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4">
                    <Btn
                      onClick={() => navigateTo(posttestScore === null ? "posttest" : "lencana")}
                      variant="amber"
                      className="w-full text-lg px-8 py-4 shadow-2xl justify-center font-bold"
                    >
                      {posttestScore === null ? "📝 Posttest Interaktif!" : "🏅 Lencana & Sertifikat!"}
                    </Btn>
                  </div>
                )}
              </div>
            )}

            {screen === "mission-flow" && (
              <MissionFlow
                missionId={currentMissionId}
                onComplete={completeMission}
                onHome={() => navigateTo("peta-misi")}
              />
            )}

            {screen === "posttest" && (
              <PosttestScreen
                onComplete={(score) => {
                  setPosttestScore(score);
                  setGameState((prev) => {
                    const updated = {
                      ...prev,
                      posttest: { ...prev.posttest, score }
                    };
                    saveGameState(updated);
                    return updated;
                  });
                  navigateTo("lencana");
                }}
                onBack={() => navigateTo("peta-misi")}
              />
            )}

            {screen === "lencana" && (
              <LencanaScreen
                completedMissions={completedMissions}
                missionScores={missionScores}
                onNext={() => navigateTo("sertifikat")}
                onBack={() => navigateTo("peta-misi")}
              />
            )}

            {screen === "sertifikat" && (
              <SertifikatScreen
                studentName={userName}
                missionScores={missionScores}
                onBack={() => navigateTo("splash")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <DemoPanel
        screen={screen}
        setScreen={setScreen}
        setCompletedMissions={setCompletedMissions}
        setMissionScores={setMissionScores}
        setPosttestScore={setPosttestScore}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <AppContent />
      </AudioProvider>
    </AuthProvider>
  );
}
