import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScreenHeader } from "../components/ScreenHeader";
import { useAudio } from "../contexts/AudioContext";
import { usePerformance } from "../hooks/usePerformance";

interface ProfilScreenProps {
  onBack: () => void;
}

export const ProfilScreen: React.FC<ProfilScreenProps> = ({ onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const perf = usePerformance();
  const [activeTab, setActiveTab] = useState<
    "tentang" | "tim" | "tujuan" | "fitur" | "petunjuk" | "privasi"
  >("tentang");

  useEffect(() => {
    playNarrator("Selamat datang di halaman Tentang DEDIGMA dan Profil Tim Pengembang.");
    return () => {
      stopNarrator();
    };
  }, []);

  const menuItems = [
    {
      id: "tentang" as const,
      icon: "ℹ️",
      title: "Tentang",
      desc: "Tentang DEDIGMA"
    },
    {
      id: "tim" as const,
      icon: "👥",
      title: "Tim Pengembang",
      desc: "Kenali tim di balik DEDIGMA"
    },
    {
      id: "tujuan" as const,
      icon: "🎯",
      title: "Tujuan Pembelajaran",
      desc: "Capaian & manfaat"
    },
    {
      id: "fitur" as const,
      icon: "🧩",
      title: "Fitur Game",
      desc: "Fitur menarik di DEDIGMA"
    },
    {
      id: "petunjuk" as const,
      icon: "📖",
      title: "Petunjuk Penggunaan",
      desc: "Cara bermain DEDIGMA"
    },
    {
      id: "privasi" as const,
      icon: "🛡️",
      title: "Kebijakan & Privasi",
      desc: "Kebijakan & privasi data"
    }
  ];

  const handleTabClick = (id: typeof activeTab) => {
    playSFX("click");
    setActiveTab(id);
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden select-none font-['Nunito'] relative"
      style={{
        backgroundImage: "url('/assets/bg-login.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/35 z-0" />

      {/* Screen Header */}
      <div className="relative z-20">
        <ScreenHeader title="Tentang & Tim Pengembang" onBack={onBack} onHome={onBack} />
      </div>

      {/* Main Content Layout (Sidebar Menu + Main Signpost Board) */}
      <div className="flex-1 w-full max-w-6xl mx-auto p-3 sm:p-5 relative z-10 overflow-hidden flex flex-col md:flex-row gap-4">

        {/* LEFT SIDEBAR MENU (Wooden Board Panel) */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-[#6b3117] border-4 border-[#451e0c] rounded-[2rem] p-2.5 sm:p-3 shadow-[0_12px_35px_rgba(0,0,0,0.6)] w-full md:w-64 flex flex-col gap-2 flex-shrink-0"
        >
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`w-full p-2.5 sm:p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left border ${
                  isActive
                    ? "bg-[#f4ecd5] border-2 border-[#df9d3b] shadow-md text-[#3b1e0a]"
                    : "bg-[#e6dbbf]/70 border-[#cbb293] text-[#5c4a3a] hover:bg-[#f4ecd5]/80"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#366635] text-white flex items-center justify-center text-base flex-shrink-0 border border-[#244723] shadow-xs">
                  <span>{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-['Fredoka'] font-extrabold text-xs sm:text-sm leading-tight truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] font-semibold text-[#6e5847] leading-tight truncate mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </motion.div>

        {/* RIGHT MAIN CONTENT BOARD (Wooden Signpost Frame & Parchment) */}
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#6b3117] border-4 border-[#451e0c] rounded-[2rem] p-2.5 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex-1 relative overflow-hidden flex flex-col min-h-0"
        >
          {/* Main Parchment Paper Container */}
          <div className="bg-[#f4ecd5] border-2 border-[#c2aa84] rounded-3xl p-4 sm:p-6 flex-1 overflow-y-auto space-y-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative">



            {/* Wooden Header Sign Banner */}
            <div className="flex justify-center mb-4">
              <div className="bg-[#7e371b] border-2 border-[#572410] rounded-2xl py-1.5 px-6 shadow-md border-b-4 border-r-2 flex items-center justify-center">
                <h1 className="font-['Fredoka'] font-extrabold text-xl sm:text-2xl text-white tracking-wider drop-shadow-md uppercase">
                  {menuItems.find((m) => m.id === activeTab)?.title || "TENTANG DEDIGMA"}
                </h1>
              </div>
            </div>

            {/* TAB CONTENT RENDERER */}
            <AnimatePresence mode="wait">
              {activeTab === "tentang" && (
                <motion.div
                  key="tentang"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  {/* APP TITLE & DESCRIPTION CARD */}
                  <div className="bg-[#f8f3e6] border-2 border-[#d9c5a3] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4 text-[#4a3728]">
                    <img
                      src="/assets/title-dedigma.png"
                      alt="DEDIGMA Logo"
                      className="w-28 sm:w-36 h-auto object-contain flex-shrink-0 drop-shadow-md"
                    />
                    <div className="space-y-1 text-center sm:text-left flex-1">
                      <h2 className="font-['Fredoka'] font-extrabold text-2xl sm:text-3xl text-[#1b3d82] tracking-wide">
                        DEDIGMA
                      </h2>
                      <p className="font-['Fredoka'] font-bold text-xs sm:text-sm text-[#7e371b]">
                        Detektif Digital Budaya Magetan — Versi 1.0.0
                      </p>
                      <p className="font-['Nunito'] font-semibold text-xs text-[#4a3728] leading-relaxed pt-1">
                        DEDIGMA dirancang untuk mengenalkan nilai-nilai kearifan lokal kebudayaan Kabupaten Magetan (Larung Sesaji, Nyadaran, dan Ledhug Suro) sekaligus melatih literasi digital dan kemampuan verifikasi berita (cek fakta) bagi siswa sekolah dasar.
                      </p>
                    </div>
                  </div>

                  {/* SECTION: TUJUAN PEMBELAJARAN */}
                  <div className="bg-[#e6dbbf]/70 border-2 border-[#d0c09d] rounded-2xl p-3 sm:p-4 relative mt-5 pt-6 shadow-xs">
                    <div className="absolute -top-3 left-4 bg-[#7e371b] text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm py-0.5 px-4 rounded-lg shadow-sm border border-[#572410]">
                      TUJUAN PEMBELAJARAN
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                      <div className="bg-[#f6eed9] border border-[#d8c7a5] rounded-2xl p-3 flex flex-col gap-1.5 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📖</span>
                          <h4 className="font-['Fredoka'] font-extrabold text-xs text-[#1b3d82] leading-tight">
                            Mengenal Budaya Lokal
                          </h4>
                        </div>
                        <p className="font-['Nunito'] font-semibold text-[11px] text-[#5c4a3a] leading-snug">
                          Memahami tradisi dan kearifan lokal Kabupaten Magetan.
                        </p>
                      </div>

                      <div className="bg-[#f6eed9] border border-[#d8c7a5] rounded-2xl p-3 flex flex-col gap-1.5 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🛡️</span>
                          <h4 className="font-['Fredoka'] font-extrabold text-xs text-[#366635] leading-tight">
                            Literasi Digital & Anti-Hoax
                          </h4>
                        </div>
                        <p className="font-['Nunito'] font-semibold text-[11px] text-[#5c4a3a] leading-snug">
                          Mengembangkan kemampuan berpikir kritis dan verifikasi informasi digital.
                        </p>
                      </div>

                      <div className="bg-[#f6eed9] border border-[#d8c7a5] rounded-2xl p-3 flex flex-col gap-1.5 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎯</span>
                          <h4 className="font-['Fredoka'] font-extrabold text-xs text-[#7e371b] leading-tight">
                            Detektif Digital Budaya
                          </h4>
                        </div>
                        <p className="font-['Nunito'] font-semibold text-[11px] text-[#5c4a3a] leading-snug">
                          Membedakan berita fakta dan hoaks yang berkaitan dengan budaya lokal.
                        </p>
                      </div>

                      <div className="bg-[#f6eed9] border border-[#d8c7a5] rounded-2xl p-3 flex flex-col gap-1.5 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">💡</span>
                          <h4 className="font-['Fredoka'] font-extrabold text-xs text-[#5a2e8c] leading-tight">
                            Refleksi & Apresiasi Budaya
                          </h4>
                        </div>
                        <p className="font-['Nunito'] font-semibold text-[11px] text-[#5c4a3a] leading-snug">
                          Menumbuhkan rasa cinta dan apresiasi nilai-nilai luhur budaya lokal.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION: MASKOT DEDIGMA */}
                  <div className="bg-[#e6dbbf]/70 border-2 border-[#d0c09d] rounded-2xl p-3 sm:p-4 relative mt-6 pt-6 shadow-xs">
                    <div className="absolute -top-3 left-4 bg-[#7e371b] text-white font-['Fredoka'] font-extrabold text-xs sm:text-sm py-0.5 px-4 rounded-lg shadow-sm border border-[#572410]">
                      MASKOT DEDIGMA
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Mascots Side by Side */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <img
                          src="/assets/mascot/Dimas-Petunjuk.svg"
                          alt="Dimas"
                          className="w-16 sm:w-20 h-auto object-contain drop-shadow"
                        />
                        <img
                          src="/assets/mascot/Gita-Tujuan.svg"
                          alt="Gita"
                          className="w-16 sm:w-20 h-auto object-contain drop-shadow"
                        />
                      </div>

                      {/* Mascot Intro Text */}
                      <div className="flex-1 text-center sm:text-left space-y-1">
                        <h4 className="font-['Fredoka'] font-extrabold text-base text-[#4a3728]">
                          Dimas & Gita
                        </h4>
                        <p className="font-['Nunito'] font-semibold text-xs text-[#5c4a3a] leading-relaxed">
                          Dimas si Detektif Digital dan Gita Penjaga Budaya siap menemani petualanganmu menjelajahi dunia budaya lokal dan menjadi detektif digital yang hebat!
                        </p>
                      </div>

                      {/* Heart Quote Box */}
                      <div className="bg-[#f8f3e6] border-2 border-[#d9c5a3] rounded-2xl p-3 shadow-xs flex items-center gap-2 max-w-[220px] flex-shrink-0">
                        <span className="text-xl">❤️</span>
                        <p className="font-['Nunito'] font-bold text-[11px] text-[#7e371b] leading-snug">
                          Mari belajar, bermain, dan lestarikan budaya lokal bersama DEDIGMA!
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "tim" && (
                <motion.div
                  key="tim"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    {/* MAHASISWA */}
                    <div className="bg-[#f6eed9] border border-[#d8c7a5] rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col items-center text-center justify-center space-y-3">
                      {perf.showBlurEffects && <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/40 rounded-full blur-2xl -mr-10 -mt-10"></div>}
                      {perf.showBlurEffects && <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-200/40 rounded-full blur-2xl -ml-10 -mb-10"></div>}
                      
                      <div className="relative z-10 w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-blue-300 overflow-hidden group">
                        <img 
                          src="/assets/profile-hadi.svg" 
                          alt="Muhammad Sofwan Hadi" 
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <span className="hidden">🎓</span>
                      </div>
                      
                      <div className="space-y-1 relative z-10">
                        <h3 className="font-['Fredoka'] font-extrabold text-sm text-[#7e371b] bg-amber-200/50 px-3 py-1 rounded-full inline-block mb-1">
                          Tim Pengembang (Mahasiswa)
                        </h3>
                        <h4 className="font-['Fredoka'] font-bold text-lg text-[#1b3d82]">
                          Muhammad Sofwan Hadi
                        </h4>
                        <p className="font-['Nunito'] font-bold text-xs text-[#7e371b]">NIM: 25010855138</p>
                        <p className="font-['Nunito'] font-semibold text-xs text-[#5c4a3a] leading-snug mt-1">
                          Peneliti & Pengembang Utama Aplikasi DEDIGMA.
                        </p>
                      </div>
                    </div>

                    {/* DOSEN PEMBIMBING */}
                    <div className="bg-[#f6eed9] border border-[#d8c7a5] rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-center">
                      {perf.showBlurEffects && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl -mr-16 -mt-16"></div>}
                      
                      <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-xl shadow-inner border border-amber-200 shrink-0">
                          👨‍🏫
                        </div>
                        <div>
                          <h3 className="font-['Fredoka'] font-extrabold text-base text-[#7e371b]">
                            Dosen Pembimbing
                          </h3>
                          <p className="text-[11px] text-[#5c4a3a] font-semibold">Penasihat Riset & Pengembangan</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-4 relative z-10 border-t border-[#d8c7a5] pt-4">
                        <div className="space-y-1 text-[#4a3728]">
                          <h4 className="font-['Fredoka'] font-extrabold text-sm text-[#1b3d82]">
                            Prof. Drs. Nasution, M.Hum., M.Ed., Ph.D.
                          </h4>
                          <p className="font-['Nunito'] font-bold text-[11px] text-[#7e371b]">NIP. 196608021992121001</p>
                          <p className="font-['Nunito'] font-semibold text-[10px] bg-white/50 px-2 py-0.5 rounded-md inline-block">Dosen Pembimbing 1</p>
                        </div>
                        <div className="space-y-1 text-[#4a3728]">
                          <h4 className="font-['Fredoka'] font-extrabold text-sm text-[#1b3d82]">
                            Dr. Putri Rachmadyanti, S.Pd., M.Pd.
                          </h4>
                          <p className="font-['Nunito'] font-bold text-[11px] text-[#7e371b]">NIP. 198906022015042001</p>
                          <p className="font-['Nunito'] font-semibold text-[10px] bg-white/50 px-2 py-0.5 rounded-md inline-block">Dosen Pembimbing 2</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "tujuan" && (
                <motion.div
                  key="tujuan"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="bg-[#f8f3e6] border-2 border-[#d9c5a3] rounded-2xl p-4 shadow-sm space-y-2 text-[#4a3728]">
                    <h3 className="font-['Fredoka'] font-extrabold text-lg text-[#1b3d82]">
                      Tujuan Pembelajaran Utama
                    </h3>
                    <ul className="list-disc list-inside space-y-1.5 font-['Nunito'] font-semibold text-xs leading-relaxed text-[#5c4a3a]">
                      <li>Mengenalkan 3 tradisi utama Kabupaten Magetan (Larung Sesaji, Nyadaran, Ledhug Suro).</li>
                      <li>Mengembangkan keterampilan berpikit kritis dan verifikasi berita hoaks.</li>
                      <li>Menanamkan sikap apresiasi dan rasa bangga terhadap kebudayaan daerah.</li>
                      <li>Memberikan pengalaman belajar interaktif berbasis edutainment gamifikasi.</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === "fitur" && (
                <motion.div
                  key="fitur"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#f6eed9] border border-[#d8c7a5] rounded-2xl p-3.5 space-y-1 shadow-xs">
                      <h4 className="font-['Fredoka'] font-extrabold text-sm text-[#7e371b]">🗺️ 3 Misi Budaya Magetan</h4>
                      <p className="font-['Nunito'] font-semibold text-xs text-[#5c4a3a]">Petualangan interaktif menjelajahi tradisi lokal.</p>
                    </div>
                    <div className="bg-[#f6eed9] border border-[#d8c7a5] rounded-2xl p-3.5 space-y-1 shadow-xs">
                      <h4 className="font-['Fredoka'] font-extrabold text-sm text-[#366635]">🏅 Koleksi Lencana</h4>
                      <p className="font-['Nunito'] font-semibold text-xs text-[#5c4a3a]">Raih lencana penghargaan di tiap pencapaian.</p>
                    </div>
                    <div className="bg-[#f6eed9] border border-[#d8c7a5] rounded-2xl p-3.5 space-y-1 shadow-xs">
                      <h4 className="font-['Fredoka'] font-extrabold text-sm text-[#5a2e8c]">🔊 Narasi & Audio Interaktif</h4>
                      <p className="font-['Nunito'] font-semibold text-xs text-[#5c4a3a]">Suara narator ramah anak dan musik latar daerah.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "petunjuk" && (
                <motion.div
                  key="petunjuk"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="bg-[#f8f3e6] border-2 border-[#d9c5a3] rounded-2xl p-4 shadow-sm space-y-2 text-[#4a3728]">
                    <h3 className="font-['Fredoka'] font-extrabold text-lg text-[#366635]">
                      Petunjuk Bermain DEDIGMA
                    </h3>
                    <p className="font-['Nunito'] font-semibold text-xs text-[#5c4a3a] leading-relaxed">
                      1. Tekan tombol **Mulai Misi** di Lobby Utama.<br />
                      2. Pelajari materi budaya dengan cermat sebelum menjawab pertanyaan.<br />
                      3. Selesaikan Misi 1 hingga Misi 3 secara berurutan.<br />
                      4. Dapatkan poin tertinggi dan kumpulkan seluruh lencana Detektif Digital!
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "privasi" && (
                <motion.div
                  key="privasi"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="bg-[#f8f3e6] border-2 border-[#d9c5a3] rounded-2xl p-4 shadow-sm space-y-2 text-[#4a3728]">
                    <h3 className="font-['Fredoka'] font-extrabold text-lg text-[#7e371b]">
                      Kebijakan & Privasi Data
                    </h3>
                    <p className="font-['Nunito'] font-semibold text-xs text-[#5c4a3a] leading-relaxed">
                      DEDIGMA berkomitmen menjaga kerahasiaan data siswa. Seluruh progres belajar disimpan secara lokal dan aman untuk kepentingan edukasi sekolah tanpa menjual data pengguna.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilScreen;
