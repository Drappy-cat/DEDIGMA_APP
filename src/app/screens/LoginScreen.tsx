import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext";
import { Role } from "../types";
import { MascotDimas, MascotGita } from "../components/Mascot";

export const LoginScreen: React.FC = () => {
  const { loginSiswa, loginGuru } = useAuth();
  const { playSFX } = useAudio();
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Pilih peran terlebih dahulu!");
      playSFX("fail");
      return;
    }

    if (role === "siswa") {
      if (!name.trim()) {
        setError("Masukkan nama kamu!");
        playSFX("fail");
        return;
      }
      loginSiswa(name.trim());
    } else if (role === "guru") {
      if (!name.trim()) {
        setError("Masukkan nama Guru!");
        playSFX("fail");
        return;
      }
      if (!email.trim()) {
        setError("Masukkan alamat email!");
        playSFX("fail");
        return;
      }
      if (password !== "guru123") {
        setError("Password salah! (Gunakan: guru123)");
        playSFX("fail");
        return;
      }
      loginGuru(name.trim(), email.trim());
    }
  };

  const handleGoogleLogin = () => {
    setError("");
    if (role === "guru") {
      loginGuru("Guru Google Demo", "guru.google@dedigma.edu");
    } else {
      loginSiswa("Siswa Google Demo");
    }
  };

  const selectRole = (r: Role) => {
    playSFX("click");
    setRole(r);
    setError("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-3 sm:p-6 relative overflow-hidden select-none font-['Nunito']"
      style={{
        backgroundImage: "url('/assets/bg-login.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Main Parchment Paper Board */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
        className="w-full max-w-2xl bg-[#f4ecd5] border-4 border-[#c2aa84] rounded-3xl shadow-[0_12px_35px_rgba(0,0,0,0.5)] p-4 sm:p-6 relative z-10 overflow-hidden"
      >
        {/* Top Header Card */}
        <div className="border-2 border-dashed border-[#bda682] rounded-2xl bg-[#eee4c5]/60 p-3 text-center mb-5">
          <h1 className="font-['Fredoka'] font-extrabold text-2xl sm:text-3xl text-[#2f5632] tracking-wide drop-shadow-xs">
            SELAMAT DATANG!
          </h1>
          <p className="font-['Fredoka'] font-bold text-xs sm:text-sm text-[#4a3728] mt-0.5">
            Pilih peran Anda untuk memulai
          </p>
          <p className="font-['Fredoka'] font-extrabold text-xs sm:text-sm text-[#a83d2a] mt-0.5 flex items-center justify-center gap-1">
            <span>⇒</span> petualanganmu! <span>⇐</span>
          </p>
        </div>

        {/* Selection Cards (Siswa vs Guru) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* SISWA CARD */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-[#e5f2d9] border-2 border-[#97c584] rounded-2xl p-4 pt-8 flex flex-col items-center justify-between relative shadow-md transition-all ${
              role === "siswa" ? "ring-4 ring-[#366635]" : ""
            }`}
          >
            {/* Top Ribbon */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] bg-[#366635] text-white font-['Fredoka'] font-extrabold text-sm sm:text-base py-1 text-center rounded-b-xl shadow-md border-b-2 border-x-2 border-[#244723]">
              SISWA
            </div>

            {/* Illustration */}
            <div className="w-full bg-gradient-to-b from-[#d5ebd1] to-[#c2e4bb] rounded-xl p-2 flex justify-center items-center my-2 shadow-inner h-36 sm:h-40 overflow-hidden">
              <img
                src="/assets/dimas-login.png"
                alt="Dimas Siswa"
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain filter drop-shadow-md"
              />
            </div>

            {/* Description */}
            <p className="font-['Nunito'] text-xs font-bold text-[#2a4725] text-center my-2 leading-snug px-1">
              Belajar, selesaikan misi, dan raih pencapaian seru!
            </p>

            {/* Button */}
            <button
              type="button"
              onClick={() => selectRole("siswa")}
              className="w-full bg-[#366635] hover:bg-[#284d27] active:scale-95 text-white font-['Fredoka'] font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl shadow-md transition-all cursor-pointer text-center mt-1"
            >
              MASUK SEBAGAI SISWA
            </button>
          </motion.div>

          {/* GURU CARD */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-[#f7ead7] border-2 border-[#d9b596] rounded-2xl p-4 pt-8 flex flex-col items-center justify-between relative shadow-md transition-all ${
              role === "guru" ? "ring-4 ring-[#7e371b]" : ""
            }`}
          >
            {/* Top Ribbon */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] bg-[#7e371b] text-white font-['Fredoka'] font-extrabold text-sm sm:text-base py-1 text-center rounded-b-xl shadow-md border-b-2 border-x-2 border-[#572410]">
              GURU
            </div>

            {/* Illustration */}
            <div className="w-full bg-gradient-to-b from-[#f2dfc6] to-[#ebd2b2] rounded-xl p-2 flex justify-center items-center my-2 shadow-inner h-36 sm:h-40 overflow-hidden">
              <img
                src="/assets/gita-login.png"
                alt="Gita Guru"
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain filter drop-shadow-md"
              />
            </div>

            {/* Description */}
            <p className="font-['Nunito'] text-xs font-bold text-[#592f1a] text-center my-2 leading-snug px-1">
              Kelola pembelajaran, pantau perkembangan, dan bimbing siswa!
            </p>

            {/* Button */}
            <button
              type="button"
              onClick={() => selectRole("guru")}
              className="w-full bg-[#7e371b] hover:bg-[#5e2712] active:scale-95 text-white font-['Fredoka'] font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl shadow-md transition-all cursor-pointer text-center mt-1"
            >
              MASUK SEBAGAI GURU
            </button>
          </motion.div>

        </div>

        {/* Input Form Modal / Overlay when role is selected */}
        <AnimatePresence>
          {role && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
              onClick={() => setRole(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#f7f1df] border-4 border-[#c2aa84] rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl relative"
              >
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#d4c3a3]">
                  <h3 className="font-['Fredoka'] font-bold text-lg text-[#4a3728] flex items-center gap-1.5">
                    <span>{role === "siswa" ? "🧒" : "👩‍🏫"}</span>
                    {role === "siswa" ? "Masuk sebagai Siswa" : "Masuk sebagai Guru"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setRole(null)}
                    className="text-[#8c7456] hover:text-[#4a3728] text-xs font-bold bg-[#e3d8bd] rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {role === "siswa" && (
                    <div className="space-y-1">
                      <label className="font-['Nunito'] font-bold text-xs text-[#4a3728] block">Nama Kamu</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tulis nama kamu di sini..."
                        autoFocus
                        className="w-full border-2 border-[#b59e7a] rounded-xl px-3 py-2 font-['Nunito'] text-sm text-gray-800 focus:outline-none focus:border-[#366635] bg-white/90"
                      />
                    </div>
                  )}

                  {role === "guru" && (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="font-['Nunito'] font-bold text-xs text-[#4a3728] block">Nama Guru</label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Masukkan nama lengkap..."
                          autoFocus
                          className="w-full border-2 border-[#b59e7a] rounded-xl px-3 py-2 font-['Nunito'] text-sm text-gray-800 focus:outline-none focus:border-[#7e371b] bg-white/90"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-['Nunito'] font-bold text-xs text-[#4a3728] block">Alamat Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="nama@sekolah.sch.id"
                          className="w-full border-2 border-[#b59e7a] rounded-xl px-3 py-2 font-['Nunito'] text-sm text-gray-800 focus:outline-none focus:border-[#7e371b] bg-white/90"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-['Nunito'] font-bold text-xs text-[#4a3728] block">Password Guru</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan password..."
                          className="w-full border-2 border-[#b59e7a] rounded-xl px-3 py-2 font-['Nunito'] text-sm text-gray-800 focus:outline-none focus:border-[#7e371b] bg-white/90"
                        />
                        <p className="text-[10px] text-gray-500 font-['Nunito']">Password Demo: guru123</p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-red-700 text-xs font-['Nunito'] text-center bg-red-100/90 rounded-xl py-1.5 font-bold">
                      {error}
                    </p>
                  )}

                  <div className="pt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRole(null)}
                      className="w-1/3 bg-[#e3d8bd] hover:bg-[#d5c7a5] text-[#4a3728] font-['Fredoka'] font-bold py-2 rounded-xl text-xs cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className={`w-2/3 ${
                        role === "siswa" ? "bg-[#366635] hover:bg-[#284d27]" : "bg-[#7e371b] hover:bg-[#5e2712]"
                      } text-white font-['Fredoka'] font-bold py-2 rounded-xl text-xs sm:text-sm shadow-md cursor-pointer transition-all`}
                    >
                      Masuk 🚀
                    </button>
                  </div>

                  <div className="relative flex py-1 items-center select-none">
                    <div className="flex-grow border-t border-[#d4c3a3]"></div>
                    <span className="flex-shrink mx-2 text-gray-500 text-[10px] font-semibold">atau</span>
                    <div className="flex-grow border-t border-[#d4c3a3]"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full border-2 border-[#b59e7a] hover:border-[#7e371b] font-['Fredoka'] font-semibold rounded-xl px-4 py-2 transition-all text-gray-700 hover:bg-amber-50 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs bg-white"
                  >
                    <svg className="w-4 h-4 select-none" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.767 5.767 0 0 1 8.2 12.75a5.767 5.767 0 0 1 5.79-5.765c1.498 0 2.861.56 3.9 1.484l3.182-3.183a10.05 10.05 0 0 0-7.082-2.7C6.183 2.585 2 6.768 2 11.916 2 17.062 6.183 21.246 11.99 21.246c5.787 0 9.77-3.96 9.77-9.743 0-.616-.065-1.2-.178-1.764l-9.342.046Z"
                      />
                    </svg>
                    Google Account
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
