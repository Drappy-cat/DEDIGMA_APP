import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AudioProvider, useAudio } from "./contexts/AudioContext";
import { Screen, Role } from "./types";
import { Btn } from "./components/Btn";

// Screens imports
import { LoginScreen } from "./screens/LoginScreen";
import { SplashScreen } from "./screens/SplashScreen";
import { PetunjukScreen } from "./screens/PetunjukScreen";
import { ProfilScreen } from "./screens/ProfilScreen";
import { PetaMisiScreen } from "./screens/PetaMisiScreen";
import { PosttestScreen } from "./screens/PosttestScreen";
import { LencanaScreen } from "./screens/LencanaScreen";
import { SertifikatScreen } from "./screens/SertifikatScreen";
import { GuruDashboardScreen } from "./screens/GuruDashboardScreen";
import { MissionFlow } from "./screens/mission/MissionFlow";

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

  // Sync screen with auth state
  useEffect(() => {
    if (!isLoggedIn) {
      setScreen("login");
      setCompletedMissions(new Set());
      setMissionScores({});
      setPosttestScore(null);
    } else {
      if (role === "guru") {
        setScreen("guru-dashboard");
      } else {
        setScreen("splash");

        // Load student progress from localStorage
        const savedMissions = localStorage.getItem("dedigma_completed_missions");
        const savedScores = localStorage.getItem("dedigma_mission_scores");
        const savedPosttest = localStorage.getItem("dedigma_posttest_score");
        if (savedMissions) {
          try {
            setCompletedMissions(new Set(JSON.parse(savedMissions)));
          } catch (e) {
            console.error("Failed to parse saved missions", e);
          }
        }
        if (savedScores) {
          try {
            setMissionScores(JSON.parse(savedScores));
          } catch (e) {
            console.error("Failed to parse saved scores", e);
          }
        }
        if (savedPosttest) {
          setPosttestScore(Number(savedPosttest));
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
      localStorage.setItem("dedigma_completed_missions", JSON.stringify(Array.from(next)));
      return next;
    });
    setMissionScores((prev) => {
      const next = { ...prev, [id]: score };
      localStorage.setItem("dedigma_mission_scores", JSON.stringify(next));
      return next;
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
        {screen === "splash" && (
          <SplashScreen
            onMulai={() => navigateTo("peta-misi")}
            onPetunjuk={() => navigateTo("petunjuk")}
            onProfil={() => navigateTo("profil")}
          />
        )}

        {screen === "petunjuk" && <PetunjukScreen onBack={() => navigateTo("splash")} />}
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
              localStorage.setItem("dedigma_posttest_score", String(score));
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
