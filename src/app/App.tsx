import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AudioProvider, useAudio } from "./contexts/AudioContext";
import { Screen } from "./types";
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
