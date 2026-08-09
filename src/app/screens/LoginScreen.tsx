import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext";
import { Role } from "../types";
import { loginGuruWithSupabase } from "../services/supabase";

interface LoginScreenProps {
  onLoginSiswa: () => void;
  onLoginGuru: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSiswa, onLoginGuru }) => {
  const { loginSiswa, loginGuru } = useAuth();
  const { playSFX } = useAudio();
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kelas, setKelas] = useState("4");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
      loginSiswa(name.trim(), kelas);
      onLoginSiswa();
    } else if (role === "guru") {
      if (!email.trim()) {
        setError("Masukkan alamat email!");
        playSFX("fail");
        return;
      }
      if (!password) {
        setError("Masukkan password!");
        playSFX("fail");
        return;
      }

      setIsLoading(true);
      const authResult = await loginGuruWithSupabase(email.trim(), password);
      setIsLoading(false);

      if (!authResult.success) {
        setError(authResult.message || "Gagal masuk sebagai Guru!");
        playSFX("fail");
        return;
      }

      loginGuru("Guru", email.trim());
      onLoginGuru();
    }
  };

  // Remove handleGoogleLogin

  const selectRole = (r: Role) => {
    playSFX("click");
    setRole(r);
    setError("");
  };

  return (
    <div
      className="w-full h-full min-h-0 flex items-center justify-center p-3 sm:p-6 relative overflow-y-auto select-none font-['Nunito']"
      style={{
        backgroundImage: "url('/assets/bg-login.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
        className="w-full max-w-2xl max-h-full overflow-y-auto bg-[#f4ecd5] border-4 border-[#c2aa84] rounded-3xl shadow-[0_12px_35px_rgba(0,0,0,0.5)] p-4 sm:p-6 relative z-10 my-auto flex flex-col justify-center"
      >
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-[#e5f2d9] border-2 border-[#97c584] rounded-2xl p-4 pt-8 flex flex-col items-center justify-between relative shadow-md transition-all ${
              role === "siswa" ? "ring-4 ring-[#366635]" : ""
            }`}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] bg-[#366635] text-white font-['Fredoka'] font-extrabold text-sm sm:text-base py-1 text-center rounded-b-xl shadow-md border-b-2 border-x-2 border-[#244723]">
              SISWA
            </div>
            <div className="w-full bg-gradient-to-b from-[#d5ebd1] to-[#c2e4bb] rounded-xl p-2 flex justify-center items-center my-2 shadow-inner h-36 sm:h-40 overflow-hidden">
              <img
                src="/assets/dimas-login.png"
                alt="Dimas Siswa"
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain filter drop-shadow-md"
              />
            </div>
            <p className="font-['Nunito'] text-xs font-bold text-[#2a4725] text-center my-2 leading-snug px-1">
              Belajar, selesaikan misi, dan raih pencapaian seru!
            </p>
            <button
              type="button"
              onClick={() => selectRole("siswa")}
              className="w-full bg-[#366635] hover:bg-[#284d27] active:scale-95 text-white font-['Fredoka'] font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl shadow-md transition-all cursor-pointer text-center mt-1"
            >
              MASUK SEBAGAI SISWA
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-[#f7ead7] border-2 border-[#d9b596] rounded-2xl p-4 pt-8 flex flex-col items-center justify-between relative shadow-md transition-all ${
              role === "guru" ? "ring-4 ring-[#7e371b]" : ""
            }`}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] bg-[#7e371b] text-white font-['Fredoka'] font-extrabold text-sm sm:text-base py-1 text-center rounded-b-xl shadow-md border-b-2 border-x-2 border-[#572410]">
              GURU
            </div>
            <div className="w-full bg-gradient-to-b from-[#f2dfc6] to-[#ebd2b2] rounded-xl p-2 flex justify-center items-center my-2 shadow-inner h-36 sm:h-40 overflow-hidden">
              <img
                src="/assets/gita-login.png"
                alt="Gita Guru"
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain filter drop-shadow-md"
              />
            </div>
            <p className="font-['Nunito'] text-xs font-bold text-[#592f1a] text-center my-2 leading-snug px-1">
              Kelola pembelajaran, pantau perkembangan, dan bimbing siswa!
            </p>
            <button
              type="button"
              onClick={() => selectRole("guru")}
              className="w-full bg-[#7e371b] hover:bg-[#5e2712] active:scale-95 text-white font-['Fredoka'] font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl shadow-md transition-all cursor-pointer text-center mt-1"
            >
              MASUK SEBAGAI GURU
            </button>
          </motion.div>
        </div>

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
                    <div className="space-y-3">
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
                      <div className="space-y-1">
                        <label className="font-['Nunito'] font-bold text-xs text-[#4a3728] block">Pilih Kelas</label>
                        <select
                          value={kelas}
                          onChange={(e) => setKelas(e.target.value)}
                          className="w-full border-2 border-[#b59e7a] rounded-xl px-3 py-2 font-['Nunito'] text-sm text-gray-800 focus:outline-none focus:border-[#366635] bg-white/90 cursor-pointer"
                        >
                          <option value="4">Kelas 4</option>
                          <option value="4A">Kelas 4A</option>
                          <option value="4B">Kelas 4B</option>
                          <option value="5">Kelas 5</option>
                          <option value="5A">Kelas 5A</option>
                          <option value="5B">Kelas 5B</option>
                          <option value="6">Kelas 6</option>
                          <option value="6A">Kelas 6A</option>
                          <option value="6B">Kelas 6B</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {role === "guru" && (
                    <div className="space-y-2">
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
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password..."
                            className="w-full border-2 border-[#b59e7a] rounded-xl px-3 py-2 pr-10 font-['Nunito'] text-sm text-gray-800 focus:outline-none focus:border-[#7e371b] bg-white/90"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#7e371b] transition-colors focus:outline-none cursor-pointer"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-red-700 text-xs font-['Nunito'] text-center bg-red-100/90 rounded-xl py-1.5 font-bold">
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        playSFX("click");
                        setRole(null);
                        setError("");
                      }}
                      disabled={isLoading}
                      className="w-1/3 py-3 rounded-2xl font-['Fredoka'] font-bold text-sm transition-all bg-[#e6d5b8] text-[#7e371b] hover:bg-[#d4c3a3] cursor-pointer shadow-md disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-2/3 py-3 rounded-2xl font-['Fredoka'] font-bold text-lg transition-all text-white shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 ${
                        role === "siswa" ? "bg-[#366635] hover:bg-[#284d27]" : "bg-[#7e371b] hover:bg-[#5e2712]"
                      }`}
                    >
                      {isLoading ? "Memuat..." : "Masuk 🚀"}
                    </button>
                  </div>
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
