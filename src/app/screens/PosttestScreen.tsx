import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, BookOpen, ChevronRight } from "lucide-react";
import { Btn } from "../components/Btn";
import { ScreenHeader } from "../components/ScreenHeader";
import { useAudio } from "../contexts/AudioContext";
import { fireConfetti } from "../utils/confetti";
import { POSTTEST_QUESTIONS } from "../data/posttestQuestions";
interface PosttestScreenProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

export const PosttestScreen: React.FC<PosttestScreenProps> = ({ onComplete, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(POSTTEST_QUESTIONS.map(() => null));
  const [done, setDone] = useState(false);

  useEffect(() => {
    playNarrator(
      "Selamat datang di Posttest Interaktif DEDIGMA. Jawab pertanyaan evaluasi akhir ini dengan teliti untuk mendapatkan sertifikat kelulusanmu."
    );
    return () => {
      stopNarrator();
    };
  }, []);

  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (answers[current] !== null) return;
    const newAnswers = answers.map((a, i) => (i === current ? idx : a));
    setAnswers(newAnswers);

    const isCorrect = idx === POSTTEST_QUESTIONS[current].jawaban;
    if (isCorrect) {
      playSFX("success");
    } else {
      playSFX("fail");
    }

    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    playSFX("click");
    if (current < POSTTEST_QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
      setIsAnswered(false);
    } else {
      setDone(true);
      const correctCount = answers.filter((a, i) => a === POSTTEST_QUESTIONS[i].jawaban).length;
      const finalScore = Math.round((correctCount / POSTTEST_QUESTIONS.length) * 100);

      fireConfetti();
      playSFX("badge");
      playNarrator(`Luar biasa! Kamu menyelesaikan Posttest dengan skor akhir ${finalScore}. Ketuk tombol di bawah untuk melihat sertifikat kelulusanmu.`);
    }
  };

  const correctCount = answers.filter((a, i) => a === POSTTEST_QUESTIONS[i].jawaban).length;
  const score = Math.round((correctCount / POSTTEST_QUESTIONS.length) * 100);

  const q = POSTTEST_QUESTIONS[current];
  const totalQ = POSTTEST_QUESTIONS.length;

  if (done) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none font-['Nunito'] relative overflow-hidden">
        {/* Blurred Background Layer */}
        <div
          className="absolute inset-0 z-0 bg-black/10 backdrop-blur-sm"
          style={{
            backgroundImage: "url('/assets/bg-login.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-8xl filter drop-shadow-lg mb-4"
          >
            🎓
          </motion.div>
          <h2 className="font-['Fredoka'] font-bold text-3xl text-amber-700 leading-tight">Posttest Selesai!</h2>
          <p className="text-gray-500 font-semibold mt-2 text-sm">Kamu telah menyelesaikan seluruh evaluasi akhir.</p>

          <div className="bg-white/95 rounded-3xl shadow-xl p-5 my-6 w-full max-w-xs border border-amber-200">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Skor Akhir Evaluasi</p>
            <p className="font-['Fredoka'] font-bold text-6xl text-amber-500 my-1">{score}</p>
            <p className="text-xs text-gray-500 font-semibold">{correctCount} dari {totalQ} benar</p>
          </div>

          <Btn onClick={() => onComplete(score)} variant="amber" className="w-full max-w-xs mt-6 py-3 text-lg font-bold">
            Lihat Sertifikat
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden font-['Nunito'] relative">
      {/* Blurred Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/bg-login.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="absolute inset-0 z-0 bg-white/10 backdrop-blur-[4px]"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full w-full">
        <ScreenHeader title="Posttest DEDIGMA 📝" onBack={onBack} onHome={onBack} />

        {/* Progress bar */}
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2.5 border-b border-gray-200 select-none">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className="font-bold">Evaluasi: Pertanyaan {current + 1} dari {totalQ}</span>
            <span className="text-blue-600 font-bold">{Math.round((current / totalQ) * 100)}%</span>
          </div>
          <div className="h-2 bg-blue-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${(current / totalQ) * 100}%` }}
            />
          </div>
        </div>

        {/* Question container */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div
            className="w-[95%] max-w-none h-[90%] sm:h-full max-h-[650px] shadow-2xl relative flex flex-col justify-between mx-auto"
            style={{
              backgroundImage: "url('/assets/content-bg.png')",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              backgroundColor: "transparent",
              minHeight: "480px"
            }}
          >
            {/* Absolute positioning for the heading so it sits inside the top ribbon shape */}
            <h2 className="font-['Fredoka'] font-bold text-lg sm:text-xl text-blue-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] absolute top-6 sm:top-7 left-0 right-0 flex items-center justify-center gap-2 z-10 pointer-events-none">
              <BookOpen size={20} /> Soal Evaluasi
            </h2>

            <motion.div
              key={current}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 flex flex-col justify-between overflow-y-auto"
            >
              <div className="px-10 sm:px-16 pt-20 sm:pt-24 select-none flex-1 flex flex-col justify-center">
                <p className="font-bold text-gray-900 text-sm sm:text-base leading-relaxed mb-6 text-center drop-shadow-sm">{q.soal}</p>
              </div>

            {/* Added pb-14 to avoid overlapping the bottom border */}
            <div className="px-10 sm:px-16 pb-14 sm:pb-16 space-y-3">
              {q.opsi.map((o, idx) => {
                const userAns = answers[current];
                let btnStyle =
                  "border-2 border-blue-200 bg-white/90 backdrop-blur-sm text-gray-800 hover:border-blue-500 hover:bg-blue-50 shadow-sm";

                if (userAns !== null) {
                  if (idx === q.jawaban) {
                    btnStyle = "border-2 border-green-500 bg-green-100/95 text-green-900 shadow-md shadow-green-200/50";
                  } else if (idx === userAns && userAns !== q.jawaban) {
                    btnStyle = "border-2 border-red-500 bg-red-100/95 text-red-900 shadow-md shadow-red-200/50";
                  } else {
                    btnStyle = "border-2 border-gray-200 bg-gray-50/80 text-gray-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    disabled={answers[current] !== null}
                    className={`w-full text-left rounded-2xl px-5 py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none leading-relaxed ${btnStyle}`}
                  >
                    <span className="font-bold mr-2 text-base">{String.fromCharCode(65 + idx)}.</span>
                    {o}
                  </button>
                );
              })}
            </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Modal Feedback Popup */}
      <AnimatePresence>
        {isAnswered && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative p-6 sm:p-10 w-[95%] max-w-md shadow-2xl flex flex-col"
              style={{
                backgroundImage: "url('/assets/papan-kayu.svg')",
                backgroundSize: "120% 135%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "transparent",
                minHeight: "350px"
              }}
            >
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm border-2 ${
                  answers[current] === q.jawaban ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                }`}>
                  {answers[current] === q.jawaban ? '✅' : '❌'}
                </div>
                <div>
                  <h3 className={`font-['Fredoka'] font-bold text-xl drop-shadow-sm ${
                    answers[current] === q.jawaban ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {answers[current] === q.jawaban ? 'Tepat Sekali!' : 'Kurang Tepat!'}
                  </h3>
                  <p className="text-amber-900/70 text-xs font-bold tracking-widest">PEMBAHASAN</p>
                </div>
              </div>
              
              <div className="bg-amber-50/90 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50 mb-6 max-h-48 overflow-y-auto custom-scrollbar shadow-inner">
                <p className="text-amber-950 text-sm leading-relaxed font-semibold">
                  {q.pembahasan || 'Jawaban telah direkam.'}
                </p>
              </div>
              
              <Btn onClick={handleNextQuestion} variant="blue" className="w-full py-3.5 text-base shadow-lg border-2 border-blue-300 mb-2">
                {current < POSTTEST_QUESTIONS.length - 1 ? 'Lanjut ke Soal Berikutnya' : 'Selesai Posttest'}
              </Btn>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PosttestScreen;
