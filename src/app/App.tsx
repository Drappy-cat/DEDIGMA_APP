import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AudioProvider, useAudio } from "./contexts/AudioContext";
import { Screen, Role, GameState, createDefaultGameState, calculateBadges } from "./types";
import { Btn } from "./components/Btn";
import { Toaster, toast } from "sonner";
import { syncProgressToSupabase, syncPretestToSupabase, syncPosttestToSupabase, fetchStudentDataFromSupabase, subscribeToStudentProgress } from "./services/supabase";
import { usePerformance } from "./hooks/usePerformance";

// Lazy loaded screens for code-splitting & performance optimization
const LoginScreen = lazy(() => import("./screens/LoginScreen").then((m) => ({ default: m.LoginScreen })));
const SplashScreen = lazy(() => import("./screens/SplashScreen"));
const PetunjukScreen = lazy(() => import("./screens/PetunjukScreen").then((m) => ({ default: m.PetunjukScreen })));
const TujuanScreen = lazy(() => import("./screens/TujuanScreen").then((m) => ({ default: m.TujuanScreen })));
const ProfilScreen = lazy(() => import("./screens/ProfilScreen").then((m) => ({ default: m.ProfilScreen })));
const PetaMisiScreen = lazy(() => import("./screens/PetaMisiScreen").then((m) => ({ default: m.PetaMisiScreen })));
const PretestScreen = lazy(() => import("./screens/PretestScreen").then((m) => ({ default: m.PretestScreen })));
const PosttestScreen = lazy(() => import("./screens/PosttestScreen").then((m) => ({ default: m.PosttestScreen })));
const LencanaScreen = lazy(() => import("./screens/LencanaScreen").then((m) => ({ default: m.LencanaScreen })));
const SertifikatScreen = lazy(() => import("./screens/SertifikatScreen").then((m) => ({ default: m.SertifikatScreen })));
const GuruDashboardScreen = lazy(() => import("./screens/GuruDashboardScreen").then((m) => ({ default: m.GuruDashboardScreen })));
const MissionFlow = lazy(() => import("./screens/mission/MissionFlow").then((m) => ({ default: m.MissionFlow })));

const ScreenLoader = () => (
  <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-slate-900 text-white p-6 select-none">
    <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
    <span className="font-['Fredoka'] font-bold text-sm tracking-wide text-amber-200 animate-pulse">
      Memuat DEDIGMA... 🔍
    </span>
  </div>
);

// Helper: Load/Save GameState from localStorage (scoped per user)
function loadGameState(userName?: string): GameState {
  try {
    const key = userName ? `dedigma_game_state_${userName}` : "dedigma_game_state";
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse game state", e);
  }
  return createDefaultGameState();
}

function saveGameState(state: GameState, userName?: string) {
  const key = userName ? `dedigma_game_state_${userName}` : "dedigma_game_state";
  localStorage.setItem(key, JSON.stringify(state));
}

function DemoPanel({
  screen,
  setScreen,
  setCompletedMissions,
  setMissionScores,
  setPretestScore,
  setPosttestScore,
  setCurrentMissionId
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
  setCompletedMissions: (m: Set<number>) => void;
  setMissionScores: (s: Record<number, number>) => void;
  setPretestScore: (s: number | null) => void;
  setPosttestScore: (s: number | null) => void;
  setCurrentMissionId: (id: number) => void;
}) {
  const { role, isLoggedIn, loginSiswa, loginGuru, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (targetScreen: Screen, targetRole?: Role) => {
    if (targetScreen === "login") return !isLoggedIn;
    if (targetRole) return isLoggedIn && role === targetRole && screen === targetScreen;
    return isLoggedIn && screen === targetScreen;
  };

  const handleSwitch = (target: "siswa-peta" | "guru-dashboard" | "login" | "splash" | "pretest" | "posttest" | "lencana" | "petunjuk" | "tujuan" | "misi-1" | "misi-2" | "misi-3" | "sertifikat") => {
    if (target === "login") {
      logout();
      setScreen("login");
    } else if (target === "guru-dashboard") {
      loginGuru("Guru Demo", "guru@demo.com");
      setScreen("guru-dashboard");
    } else {
      loginSiswa("Siswa Demo");
      
      if (target === "siswa-peta") {
        setScreen("peta-misi");
      } else if (target === "splash") {
        setScreen("splash");
      } else if (target === "petunjuk") {
        setScreen("petunjuk");
      } else if (target === "tujuan") {
        setScreen("tujuan");
      } else if (target === "pretest") {
        setPretestScore(null);
        setScreen("pretest");
      } else if (target === "misi-1") {
        setCurrentMissionId(1);
        setScreen("mission-flow");
      } else if (target === "misi-2") {
        setCurrentMissionId(2);
        setScreen("mission-flow");
      } else if (target === "misi-3") {
        setCurrentMissionId(3);
        setScreen("mission-flow");
      } else if (target === "posttest") {
        setCompletedMissions(new Set([1, 2, 3]));
        setPretestScore(null);
        setPosttestScore(null);
        setScreen("posttest");
      } else if (target === "lencana") {
        setCompletedMissions(new Set([1, 2, 3]));
        setMissionScores({ 1: 90, 2: 85, 3: 95 });
        setPosttestScore(90);
        setScreen("lencana");
      } else if (target === "sertifikat") {
        setCompletedMissions(new Set([1, 2, 3]));
        setMissionScores({ 1: 90, 2: 85, 3: 95 });
        setPosttestScore(90);
        setScreen("sertifikat");
      }
    }
  };

  const btnClass = "w-full text-left rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer";
  const activeClass = "bg-white text-slate-900 shadow font-bold";
  const inactiveClass = "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200";

  return (
    <div className="fixed left-4 bottom-4 z-[999] font-['Nunito'] select-none">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900/90 text-white rounded-full px-4 py-2.5 text-xs font-bold shadow-2xl border border-slate-700/60 flex items-center gap-1.5 hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
        >
          Demo Mode
        </button>
      ) : (
        <div className="bg-slate-900/95 border border-slate-700/60 rounded-3xl p-4 shadow-2xl w-52 space-y-3 flex flex-col text-left max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-1 sticky top-0 bg-slate-900/95 z-10 pt-1 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DEMO MODE</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer p-0.5"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">Awal & Guru</div>
            <button onClick={() => handleSwitch("login")} className={`${btnClass} ${isActive("login") ? activeClass : inactiveClass}`}>
              <span>🔄</span> Onboarding
            </button>
            <button onClick={() => handleSwitch("guru-dashboard")} className={`${btnClass} ${isActive("guru-dashboard", "guru") ? activeClass : inactiveClass}`}>
              <span>👩‍🏫</span> Panel Guru
            </button>
            <button onClick={() => handleSwitch("splash")} className={`${btnClass} ${isActive("splash", "siswa") ? activeClass : inactiveClass}`}>
              <span>✨</span> Splashscreen
            </button>
            <button onClick={() => handleSwitch("petunjuk")} className={`${btnClass} ${isActive("petunjuk", "siswa") ? activeClass : inactiveClass}`}>
              <span>📋</span> Petunjuk
            </button>
            <button onClick={() => handleSwitch("tujuan")} className={`${btnClass} ${isActive("tujuan", "siswa") ? activeClass : inactiveClass}`}>
              <span>🎯</span> Tujuan Misi
            </button>
            <button onClick={() => handleSwitch("pretest")} className={`${btnClass} ${isActive("pretest", "siswa") ? activeClass : inactiveClass}`}>
              <span>📝</span> Pretest Kuis
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">Peta & Misi</div>
            <button onClick={() => handleSwitch("siswa-peta")} className={`${btnClass} ${isActive("peta-misi", "siswa") ? activeClass : inactiveClass}`}>
              <span>🗺️</span> Peta Misi
            </button>
            <button onClick={() => handleSwitch("misi-1")} className={`${btnClass} ${inactiveClass}`}>
              <span>⛵</span> Misi 1 (Mulai)
            </button>
            <button onClick={() => handleSwitch("misi-2")} className={`${btnClass} ${inactiveClass}`}>
              <span>🌺</span> Misi 2 (Mulai)
            </button>
            <button onClick={() => handleSwitch("misi-3")} className={`${btnClass} ${inactiveClass}`}>
              <span>🥁</span> Misi 3 (Mulai)
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1">Akhir (Syarat Selesai Misi)</div>
            <button onClick={() => handleSwitch("posttest")} className={`${btnClass} ${isActive("posttest", "siswa") ? activeClass : inactiveClass}`}>
              <span>📝</span> Posttest Kuis
            </button>
            <button onClick={() => handleSwitch("lencana")} className={`${btnClass} ${isActive("lencana", "siswa") ? activeClass : inactiveClass}`}>
              <span>🏆</span> Lencana
            </button>
            <button onClick={() => handleSwitch("sertifikat")} className={`${btnClass} ${isActive("sertifikat", "siswa") ? activeClass : inactiveClass}`}>
              <span>🎓</span> Sertifikat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AppContent() {
  const { role, userName, kelas, isLoggedIn } = useAuth();
  const { playSFX } = useAudio();
  const [screen, setScreen] = useState<Screen>("login");
  const [screenHistory, setScreenHistory] = useState<Screen[]>([]);
  const [currentMissionId, setCurrentMissionId] = useState<number>(1);
  const [completedMissions, setCompletedMissions] = useState<Set<number>>(new Set());
  const [missionScores, setMissionScores] = useState<Record<number, number>>({});
  const [pretestScore, setPretestScore] = useState<number | null>(null);
  const [posttestScore, setPosttestScore] = useState<number | null>(null);
  const perf = usePerformance();
  const [gameState, setGameState] = useState<GameState>(loadGameState());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Terhubung kembali ke internet 🌐✅", {
        description: "Data akan disinkronkan ke server secara otomatis.",
      });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Koneksi terputus. Mode Offline Aktif 📶❌", {
        description: "Data tetap aman dan akan disinkronkan saat online.",
        duration: 5000,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync screen with auth state
  useEffect(() => {
    if (!isLoggedIn) {
      setScreen("login");
      setScreenHistory([]);
      setCompletedMissions(new Set());
      setMissionScores({});
      setPosttestScore(null);
      setGameState(createDefaultGameState());
    } else {
      if (role === "guru") {
        setScreen("guru-dashboard");
        setScreenHistory([]);
      } else {
        setScreen("splash");
        setScreenHistory([]);

        // 1. Initial Load from LocalStorage (scoped per user)
        const loadLocal = () => {
          const loaded = loadGameState(userName);
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
          setPretestScore(loaded.pretest?.score ?? null);
          setPosttestScore(loaded.posttest?.score ?? null);
        };

        loadLocal();

        // 2. Fetch from Supabase to sync DOWN
        if (navigator.onLine) {
          fetchStudentDataFromSupabase(userName).then((data) => {
            if (data) {
              setGameState((prev) => {
                const updated = JSON.parse(JSON.stringify(prev)); // Deep copy
                let stateChanged = false;

                if (data.pretest) {
                  updated.pretest.score = data.pretest.pretest_score;
                  setPretestScore(data.pretest.pretest_score);
                  stateChanged = true;
                }

                if (data.posttest) {
                  updated.posttest.score = data.posttest.posttest_score;
                  setPosttestScore(data.posttest.posttest_score);
                  stateChanged = true;
                }

                if (data.progress && data.progress.length > 0) {
                  const completed = new Set<number>();
                  const scores: Record<number, number> = {};
                  data.progress.forEach(p => {
                    if (p.completed) {
                      updated.missions[p.mission_id] = {
                        activityScore: p.activity_score,
                        completed: true
                      };
                      completed.add(p.mission_id);
                      scores[p.mission_id] = p.activity_score;
                    }
                  });
                  setCompletedMissions(completed);
                  setMissionScores(scores);
                  stateChanged = true;
                }

                if (stateChanged) {
                  // Recalculate totals
                  const allScores: Record<number, number> = {};
                  for (const [key, m] of Object.entries(updated.missions)) {
                    if (m.completed) allScores[Number(key)] = (m as any).activityScore;
                  }
                  updated.badges = calculateBadges(allScores);
                  updated.totalScore = Object.values(allScores).length > 0
                    ? Math.round(Object.values(allScores).reduce((a, b) => a + b, 0) / Object.values(allScores).length)
                    : 0;

                  saveGameState(updated, userName);
                  toast.success("Misi berhasil disinkronkan dari server! 🔄✅");
                }

                return stateChanged ? updated : prev;
              });
            }
          });
        }
        
        // 3. Realtime Subscription
        let unsubscribe: (() => void) | null = null;
        if (navigator.onLine) {
          unsubscribe = subscribeToStudentProgress(userName, () => {
            fetchStudentDataFromSupabase(userName).then((data) => {
              if (data) {
                setGameState((prev) => {
                  const updated = JSON.parse(JSON.stringify(prev)); // Deep copy
                  let stateChanged = false;

                  if (data.pretest) {
                    updated.pretest.score = data.pretest.pretest_score;
                    setPretestScore(data.pretest.pretest_score);
                    stateChanged = true;
                  }

                  if (data.posttest) {
                    updated.posttest.score = data.posttest.posttest_score;
                    setPosttestScore(data.posttest.posttest_score);
                    stateChanged = true;
                  }

                  if (data.progress && data.progress.length > 0) {
                    const completed = new Set<number>();
                    const scores: Record<number, number> = {};
                    data.progress.forEach(p => {
                      if (p.completed) {
                        updated.missions[p.mission_id] = {
                          activityScore: p.activity_score,
                          completed: true
                        };
                        completed.add(p.mission_id);
                        scores[p.mission_id] = p.activity_score;
                      }
                    });
                    setCompletedMissions(completed);
                    setMissionScores(scores);
                    stateChanged = true;
                  }

                  if (stateChanged) {
                    const allScores: Record<number, number> = {};
                    for (const [key, m] of Object.entries(updated.missions)) {
                      if (m.completed) allScores[Number(key)] = (m as any).activityScore;
                    }
                    updated.badges = calculateBadges(allScores);
                    updated.totalScore = Object.values(allScores).length > 0
                      ? Math.round(Object.values(allScores).reduce((a, b) => a + b, 0) / Object.values(allScores).length)
                      : 0;

                    saveGameState(updated, userName);
                    toast.success("Misi berhasil disinkronkan dari server secara realtime! 🔄✅");
                  }

                  return stateChanged ? updated : prev;
                });
              }
            });
          });
        }

        return () => {
          if (unsubscribe) unsubscribe();
        };
      }
    }
  }, [isLoggedIn, role, userName]);

  const navigateTo = (nextScreen: Screen) => {
    playSFX("click");
    if (screen !== nextScreen) {
      setScreenHistory((prev) => [...prev, screen]);
    }
    setScreen(nextScreen);
  };

  const handleGoBack = (): boolean => {
    if (screenHistory.length > 0) {
      const prevScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory((prev) => prev.slice(0, -1));
      setScreen(prevScreen);
      return true;
    }

    // Fallback logical back navigation
    if (screen === "mission-flow" || screen === "posttest" || screen === "lencana" || screen === "sertifikat") {
      setScreen("peta-misi");
      return true;
    }
    if (screen === "petunjuk" || screen === "tujuan" || screen === "profil" || screen === "pretest" || screen === "peta-misi") {
      setScreen("splash");
      return true;
    }

    // At root screens (login / splash / guru-dashboard), return false to let app exit
    return false;
  };

  // Capacitor Android Hardware Back Button listener
  useEffect(() => {
    let listenerHandler: any = null;

    const setupBackListener = async () => {
      try {
        const { App: CapApp } = await import("@capacitor/app");
        listenerHandler = await CapApp.addListener("backButton", () => {
          const handled = handleGoBack();
          if (!handled) {
            CapApp.exitApp();
          }
        });
      } catch (err) {
        // Ignored in desktop browser environment
      }
    };

    setupBackListener();

    return () => {
      if (listenerHandler && listenerHandler.remove) {
        listenerHandler.remove();
      }
    };
  }, [screen, screenHistory]);

  const completeMission = (id: number, score: number, reflectionText?: string) => {
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
            reflectionText: reflectionText || prev.missions[id]?.reflectionText || "",
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
      saveGameState(updated, userName);
      return updated;
    });

    // Sync to Supabase
    syncProgressToSupabase({
      userName,
      kelas,
      missionId: id,
      missionName: id === 1 ? "Larung Sesaji" : id === 2 ? "Nyadran" : "Ledhug Suro",
      score,
      reflectionText,
      completed: true
    });
  };

  const allMissionsDone = completedMissions.has(1) && completedMissions.has(2) && completedMissions.has(3);

  return (
    <div className="min-h-[100dvh] w-full bg-slate-900 flex items-center justify-center p-0 md:p-4 font-['Nunito'] select-none overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
      <div className="w-full max-w-5xl h-[100dvh] md:h-[720px] md:max-h-[92vh] bg-white relative overflow-hidden shadow-2xl md:rounded-3xl border-0 md:border md:border-white/10 flex flex-col">
        <Suspense fallback={<ScreenLoader />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, ...(perf.isLowEnd ? {} : { scale: 0.98 }) }}
              animate={{ opacity: 1, ...(perf.isLowEnd ? {} : { scale: 1 }) }}
              exit={{ opacity: 0, ...(perf.isLowEnd ? {} : { scale: 1.02 }) }}
              transition={{ duration: perf.transitionDuration(0.25), ease: "easeInOut" }}
              className="w-full h-full flex flex-col overflow-hidden relative"
            >
              {!isLoggedIn && (
                <LoginScreen
                  onLoginSiswa={() => navigateTo("splash")}
                  onLoginGuru={() => navigateTo("guru-dashboard")}
                />
              )}

              {isLoggedIn && role === "guru" && screen === "guru-dashboard" && <GuruDashboardScreen />}

              {screen === "splash" && (
                <SplashScreen
                  onMulai={() => navigateTo(pretestScore === null ? "pretest" : "peta-misi")}
                  onPetunjuk={() => navigateTo("petunjuk")}
                  onProfil={() => navigateTo("profil")}
                />
              )}

              {screen === "petunjuk" && (
                <PetunjukScreen
                  onBack={() => navigateTo("splash")}
                  onNext={() => navigateTo("tujuan")}
                />
              )}
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
                        onClick={() =>
                          navigateTo(
                            posttestScore === null
                              ? "posttest"
                              : "lencana"
                          )
                        }
                        variant="amber"
                        className="w-full text-lg px-8 py-4 shadow-2xl justify-center font-bold"
                      >
                        {posttestScore === null
                          ? "Posttest Interaktif"
                          : "Lencana & Sertifikat"}
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

              {screen === "pretest" && (
                <PretestScreen
                  onComplete={(score) => {
                    setPretestScore(score);
                    setGameState((prev) => {
                      const updated = {
                        ...prev,
                        pretest: { score }
                      };
                      saveGameState(updated, userName);
                      return updated;
                    });
                    syncPretestToSupabase({ userName, kelas, score });
                    navigateTo("peta-misi");
                  }}
                  onBack={() => navigateTo("splash")}
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
                      saveGameState(updated, userName);
                      return updated;
                    });
                    syncPosttestToSupabase({ userName, kelas, score });
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
                  pretestScore={pretestScore}
                  posttestScore={posttestScore}
                  onBack={() => navigateTo("peta-misi")}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>

      {import.meta.env.DEV && (
        <DemoPanel
          screen={screen}
          setScreen={setScreen}
          setCompletedMissions={setCompletedMissions}
          setMissionScores={setMissionScores}
          setPretestScore={setPretestScore}
          setPosttestScore={setPosttestScore}
          setCurrentMissionId={setCurrentMissionId}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <AppContent />
        <Toaster position="top-center" richColors />
      </AudioProvider>
    </AuthProvider>
  );
}
export default App;
