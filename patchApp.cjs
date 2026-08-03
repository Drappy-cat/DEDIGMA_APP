const fs = require('fs');
let c = fs.readFileSync('src/app/App.tsx', 'utf8');

c = c.replace(
  'const PosttestScreen = lazy(() => import("./screens/PosttestScreen").then((m) => ({ default: m.PosttestScreen })));',
  'const PretestScreen = lazy(() => import("./screens/PretestScreen").then((m) => ({ default: m.PretestScreen })));\nconst PosttestScreen = lazy(() => import("./screens/PosttestScreen").then((m) => ({ default: m.PosttestScreen })));'
);

c = c.replace(
  'const [posttestScore, setPosttestScore] = useState<number | null>(null);',
  'const [pretestScore, setPretestScore] = useState<number | null>(null);\n  const [posttestScore, setPosttestScore] = useState<number | null>(null);'
);

c = c.replace(
  'setPosttestScore(null);',
  'setPretestScore(null);\n      setPosttestScore(null);'
);

c = c.replace(
  'if (loaded.posttest.score !== null) {',
  'if (loaded.pretest && loaded.pretest.score !== null) {\n          setPretestScore(loaded.pretest.score);\n        }\n        if (loaded.posttest.score !== null) {'
);

c = c.replace(
  'onMulai={() => navigateTo("peta-misi")}',
  'onMulai={() => navigateTo(pretestScore === null ? "pretest" : "peta-misi")}'
);

const pretestRoute = `
              {screen === "pretest" && (
                <PretestScreen
                  onComplete={(score) => {
                    setPretestScore(score);
                    setGameState((prev) => {
                      const updated = {
                        ...prev,
                        pretest: { score }
                      };
                      saveGameState(updated);
                      return updated;
                    });
                    navigateTo("peta-misi");
                  }}
                  onBack={() => navigateTo("splash")}
                />
              )}
`;

c = c.replace(
  '{screen === "posttest" && (',
  pretestRoute.trim() + '\n\n              {screen === "posttest" && ('
);

fs.writeFileSync('src/app/App.tsx', c);
console.log("App.tsx patched successfully");
