import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Award, BookOpen, UserCheck, Code, Sparkles, GraduationCap, ShieldCheck, Heart } from "lucide-react";
import { useAudio } from "../contexts/AudioContext";
import { ScreenHeader } from "../components/ScreenHeader";
import { MascotDimas, MascotGita } from "../components/Mascot";

interface ProfilScreenProps {
  onBack: () => void;
}

export const ProfilScreen: React.FC<ProfilScreenProps> = ({ onBack }) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();

  useEffect(() => {
    playNarrator("Selamat datang di halaman Tentang Aplikasi dan Profil Tim Pengembang DEDIGMA.");
    return () => {
      stopNarrator();
    };
  }, []);

  return (
    <div
      className="h-full flex flex-col overflow-hidden font-['Nunito'] select-none"
      style={{
        backgroundImage: "url('/assets/bg-lobby.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <ScreenHeader title="Tentang & Tim Pengembang 👥" onBack={onBack} />

      <div className="flex-1 w-full p-4 max-w-3xl mx-auto space-y-6 overflow-y-auto">
        
        {/* Banner Tentang DEDIGMA */}
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-white/20"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-5">
            <img
              src="/assets/logo.png"
              alt="DEDIGMA Logo"
              className="w-20 h-20 object-contain drop-shadow-xl animate-pulse"
            />
            <div className="text-center md:text-left space-y-1.5 flex-1">
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-amber-400/30 tracking-wider">
                Media Pembelajaran Interaktif Edutainment
              </span>
              <h1 className="font-['Fredoka'] font-bold text-3xl text-amber-300 drop-shadow">DEDIGMA</h1>
              <p className="font-['Fredoka'] text-blue-200 text-sm font-semibold">
                Detektif Digital Budaya Magetan — Versi 1.0.0
              </p>
              <p className="text-xs text-blue-100/90 leading-relaxed pt-1">
                DEDIGMA dirancang untuk mengenalkan nilai-nilai kearifan lokal kebudayaan Kabupaten Magetan (Larung Sesaji, Nyadaran, dan Ledhug Suro) sekaligus melatih literasi digital dan kemampuan verifikasi berita (cek fakta) bagi siswa sekolah dasar.
              </p>
            </div>
          </div>
          {/* Subtle background glow decorative circle */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />
        </motion.div>

        {/* UTAMA: Dosen Pembimbing / Advisor Section */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border-2 border-amber-400/40 relative overflow-hidden space-y-4"
        >
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 p-2 rounded-2xl">
                <GraduationCap size={22} />
              </span>
              <div>
                <h3 className="font-['Fredoka'] font-bold text-lg text-amber-900 leading-tight">
                  Dosen Pembimbing / Advisor Utama
                </h3>
                <p className="text-[11px] text-amber-700 font-semibold">Penanggung Jawab & Pengarah Riset</p>
              </div>
            </div>
            <span className="bg-amber-500 text-white font-['Fredoka'] font-bold text-xs px-3 py-1 rounded-full shadow flex items-center gap-1">
              <Award size={13} /> Pembimbing Utama
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-5">
            {/* Avatar Frame Dosen */}
            <div className="relative group flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-1 shadow-lg">
                <div className="w-full h-full rounded-[14px] bg-amber-50 overflow-hidden flex items-center justify-center relative text-amber-700">
                  <GraduationCap size={48} />
                </div>
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-300 text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/50 shadow whitespace-nowrap">
                Dosen Pembimbing
              </span>
            </div>

            {/* Detail Dosen */}
            <div className="text-center md:text-left space-y-2 flex-1">
              <div>
                <h4 className="font-['Fredoka'] font-bold text-xl text-slate-800">
                  [ Nama Dosen Pembimbing, M.Pd. ]
                </h4>
                <p className="text-xs font-bold text-amber-700 mt-0.5">
                  NIP. [ Masukkan Nomor NIP Dosen ]
                </p>
              </div>

              <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/60 space-y-1">
                <p className="text-xs text-amber-900 font-semibold italic leading-relaxed">
                  "Pengembangan media edutainment DEDIGMA ini diharapkan dapat melahirkan generasi muda Magetan yang berwawasan budaya luhur sekaligus bijak dan kritis di era digital."
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 justify-center md:justify-start text-[11px] font-semibold text-slate-600">
                <span className="bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  [ Nama Fakultas / Universitas ]
                </span>
                <span className="bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  Pakar Teknologi Pembelajaran
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3 Pengembang / Developers Grid Layout */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="text-amber-500" size={20} />
            <h3 className="font-['Fredoka'] font-bold text-xl text-slate-800">Tim Pengembang (3 Developers)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Pengembang 1 */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-3xl p-4 shadow-lg border border-blue-100 flex flex-col items-center text-center space-y-3 hover:shadow-xl transition-shadow"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-1 shadow-md">
                <div className="w-full h-full rounded-[12px] bg-blue-50 flex items-center justify-center text-blue-600">
                  <Code size={36} />
                </div>
              </div>
              <div>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Lead Developer / Peneliti
                </span>
                <h4 className="font-['Fredoka'] font-bold text-base text-slate-800 mt-1">
                  [ Nama Pengembang 1 ]
                </h4>
                <p className="text-[11px] text-gray-500 font-semibold">NIM. [ Masukkan NIM ]</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-blue-50/50 p-2.5 rounded-2xl w-full">
                Merancang arsitektur aplikasi, logika game state, dan integrasi fitur kuis interaktif DEDIGMA.
              </p>
            </motion.div>

            {/* Pengembang 2 */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-3xl p-4 shadow-lg border border-emerald-100 flex flex-col items-center text-center space-y-3 hover:shadow-xl transition-shadow"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 p-1 shadow-md">
                <div className="w-full h-full rounded-[12px] bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <BookOpen size={36} />
                </div>
              </div>
              <div>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Spesialis Konten & Materi
                </span>
                <h4 className="font-['Fredoka'] font-bold text-base text-slate-800 mt-1">
                  [ Nama Pengembang 2 ]
                </h4>
                <p className="text-[11px] text-gray-500 font-semibold">NIM. [ Masukkan NIM ]</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50/50 p-2.5 rounded-2xl w-full">
                Menyusun materi kearifan lokal Magetan, narasi petualangan, serta instrumen kisi-kisi soal evaluasi.
              </p>
            </motion.div>

            {/* Pengembang 3 */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="bg-white rounded-3xl p-4 shadow-lg border border-purple-100 flex flex-col items-center text-center space-y-3 hover:shadow-xl transition-shadow"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-400 p-1 shadow-md">
                <div className="w-full h-full rounded-[12px] bg-purple-50 flex items-center justify-center text-purple-600">
                  <UserCheck size={36} />
                </div>
              </div>
              <div>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Desainer UI/UX & Media
                </span>
                <h4 className="font-['Fredoka'] font-bold text-base text-slate-800 mt-1">
                  [ Nama Pengembang 3 ]
                </h4>
                <p className="text-[11px] text-gray-500 font-semibold">NIM. [ Masukkan NIM ]</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-purple-50/50 p-2.5 rounded-2xl w-full">
                Mengembangkan tata letak antarmuka (UI), aset visual budaya, serta pengalaman pengguna (UX) ramah anak.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Maskot DEDIGMA & Hak Cipta */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-slate-100 space-y-4">
          <h4 className="font-['Fredoka'] font-bold text-lg text-slate-800 flex items-center gap-2">
            <Heart className="text-rose-500" size={18} /> Maskot Pembelajaran
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-blue-50/70 rounded-2xl p-3.5 flex items-center gap-3 border border-blue-100">
              <MascotDimas size="sm" animate={true} />
              <div>
                <h5 className="font-['Fredoka'] font-bold text-sm text-blue-800">Dimas — Detektif Digital</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Simbol kecerdasan digital, berwawasan kritis, dan bijak memverifikasi informasi.
                </p>
              </div>
            </div>

            <div className="bg-amber-50/70 rounded-2xl p-3.5 flex items-center gap-3 border border-amber-100">
              <MascotGita size="sm" animate={true} />
              <div>
                <h5 className="font-['Fredoka'] font-bold text-sm text-amber-800">Gita — Detektif Budaya</h5>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  Simbol kecintaan budaya lokal, bangga warisan tradisi Magetan dan melestarikannya.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500">
              © 2026 DEDIGMA. Hak Cipta Dilindungi Undang-Undang.
            </p>
            <p className="text-[10px] text-slate-400">
              Diterbitkan untuk Kepentingan Pendidikan & Kebudayaan Kabupaten Magetan.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ProfilScreen;
