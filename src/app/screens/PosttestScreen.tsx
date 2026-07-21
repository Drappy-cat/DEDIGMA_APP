import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Award, BookOpen, ChevronRight } from "lucide-react";
import { Btn } from "../components/Btn";
import { ScreenHeader } from "../components/ScreenHeader";
import { useAudio } from "../contexts/AudioContext";

interface PosttestScreenProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface Question {
  soal: string;
  opsi: string[];
  jawaban: number;
}

const POSTTEST_QUESTIONS: Question[] = [
  {
    soal: "Di mana tradisi Larung Sesaji khas Magetan biasanya dilaksanakan?",
    opsi: ["Pantai Prigi", "Telaga Sarangan", "Waduk Gajah Mungkur", "Telaga Ngebel"],
    jawaban: 1
  },
  {
    soal: "Kapan masyarakat Magetan umumnya menyelenggarakan tradisi ziarah kubur Nyadaran?",
    opsi: ["Tahun Baru Masehi", "Menjelang Bulan Ramadan/Puasa", "Hari Raya Idul Adha", "Malam Tahun Baru Jawa"],
    jawaban: 1
  },
  {
    soal: "Dari manakah asal usul istilah kata 'Ledhug' pada perayaan festival Ledhug Suro?",
    opsi: ["Dari suara bedug/gendang yang ditabuh", "Dari tarian khas reog", "Dari suara petasan tahun baru", "Dari nama makanan khas Magetan"],
    jawaban: 0
  },
  {
    soal: "Manakah di bawah ini yang merupakan sumber informasi digital paling terpercaya untuk mencari kebenaran budaya lokal Magetan?",
    opsi: [
      "Pesan berantai di grup WhatsApp tanpa sumber penulis",
      "Situs resmi pemerintah daerah Magetan (.go.id) atau jurnal ilmiah",
      "Komentar anonim di media sosial TikTok",
      "Halaman blog pribadi yang bebas ditulis siapa saja"
    ],
    jawaban: 1
  },
  {
    soal: "Apa tindakan utama seorang 'Detektif Digital' yang bijak jika menemui berita budaya yang mencurigakan atau janggal?",
    opsi: [
      "Langsung membagikan berita tersebut agar viral",
      "Membiarkannya saja tanpa mencari tahu kebenarannya",
      "Melakukan verifikasi fakta (cek fakta) dan menganalisis kredibilitas sumber beritanya",
      "Membuat postingan balasan berisi berita palsu lainnya"
    ],
    jawaban: 2
  }
];

export const PosttestScreen: React.FC<PosttestScreenProps> = ({ onComplete, onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(POSTTEST_QUESTIONS.map(() => null));
  const [done, setDone] = useState(false);

  useEffect(() => {
    playNarrator(
      "Selamat datang di Posttest Interaktif DEDIGMA. Jawab 5 pertanyaan evaluasi akhir ini dengan teliti untuk mendapatkan sertifikat kelulusanmu."
    );
    return () => {
      stopNarrator();
    };
  }, []);

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

    setTimeout(() => {
      if (current < POSTTEST_QUESTIONS.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        setDone(true);
        const correctCount = newAnswers.filter((a, i) => a === POSTTEST_QUESTIONS[i].jawaban).length;
        const finalScore = Math.round((correctCount / POSTTEST_QUESTIONS.length) * 100);

        playSFX("badge");
        playNarrator(`Luar biasa! Kamu menyelesaikan Posttest dengan skor akhir ${finalScore}. Ketuk tombol di bawah untuk melihat sertifikat kelulusanmu.`);
      }
    }, 1000);
  };

  const correctCount = answers.filter((a, i) => a === POSTTEST_QUESTIONS[i].jawaban).length;
  const score = Math.round((correctCount / POSTTEST_QUESTIONS.length) * 100);

  const q = POSTTEST_QUESTIONS[current];
  const totalQ = POSTTEST_QUESTIONS.length;

  if (done) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center p-6 text-center select-none font-['Nunito']"
        style={{
          backgroundImage: "url('/assets/bg-lobby.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
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

        <Btn onClick={() => onComplete(score)} variant="lanjut" className="w-full max-w-xs" />
      </div>
    );
  }

  return (
    <div
      className="h-full flex flex-col overflow-hidden font-['Nunito']"
      style={{
        backgroundImage: "url('/assets/bg-lobby.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
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
          className="w-full max-w-md p-6 shadow-2xl relative flex flex-col justify-between"
          style={{
            backgroundImage: "url('/assets/content-bg.png')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundColor: "transparent",
            minHeight: "420px"
          }}
        >
          <div className="px-3 pt-4 select-none">
            <h2 className="font-['Fredoka'] font-bold text-base text-blue-800 flex items-center gap-1.5 mb-3">
              <BookOpen size={18} /> Soal Evaluasi
            </h2>
            <p className="font-bold text-gray-800 text-sm leading-relaxed mb-4">{q.soal}</p>
          </div>

          <div className="px-3 pb-6 space-y-2.5">
            {q.opsi.map((o, idx) => {
              const userAns = answers[current];
              let btnStyle =
                "border-2 border-blue-150 bg-blue-50/20 text-gray-700 hover:border-blue-400 hover:bg-blue-50/50";

              if (userAns !== null) {
                if (idx === q.jawaban) {
                  btnStyle = "border-2 border-green-400 bg-green-100 text-green-800 shadow shadow-green-100";
                } else if (idx === userAns && userAns !== q.jawaban) {
                  btnStyle = "border-2 border-red-400 bg-red-100 text-red-700 shadow shadow-red-100";
                } else {
                  btnStyle = "border-2 border-gray-100 bg-gray-50/50 text-gray-400 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  disabled={answers[current] !== null}
                  className={`w-full text-left rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer select-none leading-relaxed ${btnStyle}`}
                >
                  <span className="font-bold mr-1.5">{String.fromCharCode(65 + idx)}.</span>
                  {o}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PosttestScreen;
