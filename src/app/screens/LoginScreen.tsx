import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext";
import { Btn } from "../components/Btn";
import { SkyBg } from "../components/SkyBg";
import { Role } from "../types";

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
    // Mock login with Google
    setError("");
    if (role === "guru") {
      loginGuru("Guru Google Demo", "guru.google@dedigma.edu");
    } else {
      loginSiswa("Siswa Google Demo");
    }
  };

  return (
    <SkyBg className="flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-6 select-none">
          <div className="text-6xl mb-2">🔍</div>
          <h1 className="font-['Fredoka'] font-bold text-4xl text-white drop-shadow-lg">DEDIGMA</h1>
          <p className="font-['Nunito'] text-blue-100 text-sm mt-1">Detektif Digital Budaya Magetan</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-4">
          <h2 className="font-['Fredoka'] font-semibold text-xl text-blue-800 text-center">Masuk sebagai</h2>

          <div className="grid grid-cols-2 gap-3">
            {(["siswa", "guru"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  playSFX("click");
                  setRole(r);
                  setError("");
                }}
                className={`p-4 rounded-2xl border-2 transition-all font-['Fredoka'] font-semibold text-lg flex flex-col items-center gap-1 cursor-pointer
                  ${
                    role === r
                      ? "border-blue-500 bg-blue-50 text-blue-700 scale-105 shadow-md"
                      : "border-gray-200 text-gray-500 hover:border-blue-300 bg-white"
                  }`}
              >
                <span className="text-3xl">{r === "siswa" ? "🧒" : "👩‍🏫"}</span>
                {r === "siswa" ? "Siswa" : "Guru"}
              </button>
            ))}
          </div>

          {role && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {role === "siswa" && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                  <label className="font-['Nunito'] font-semibold text-sm text-gray-600 block">Nama Kamu</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tulis nama kamu di sini..."
                    className="w-full border-2 border-blue-200 rounded-2xl px-4 py-2.5 font-['Nunito'] text-gray-700 focus:outline-none focus:border-blue-500 bg-blue-50"
                  />
                </motion.div>
              )}

              {role === "guru" && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-['Nunito'] font-semibold text-sm text-gray-600 block">Nama Guru</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap..."
                      className="w-full border-2 border-blue-200 rounded-2xl px-4 py-2.5 font-['Nunito'] text-gray-700 focus:outline-none focus:border-blue-500 bg-blue-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-['Nunito'] font-semibold text-sm text-gray-600 block">Alamat Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@sekolah.sch.id"
                      className="w-full border-2 border-blue-200 rounded-2xl px-4 py-2.5 font-['Nunito'] text-gray-700 focus:outline-none focus:border-blue-500 bg-blue-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-['Nunito'] font-semibold text-sm text-gray-600 block">Password Guru</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password..."
                      className="w-full border-2 border-blue-200 rounded-2xl px-4 py-2.5 font-['Nunito'] text-gray-700 focus:outline-none focus:border-blue-500 bg-blue-50"
                    />
                    <p className="text-[10px] text-gray-400 mt-1 font-['Nunito']">Password Demo: guru123</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <p className="text-red-500 text-sm font-['Nunito'] text-center bg-red-50 rounded-xl py-2 font-semibold">
                  {error}
                </p>
              )}

              <Btn type="submit" variant="primary" className="w-full text-xl py-3 justify-center">
                Masuk 🚀
              </Btn>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold">atau masuk dengan</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full border-2 border-gray-200 hover:border-blue-300 font-['Fredoka'] font-semibold rounded-2xl px-5 py-2.5 transition-all text-gray-600 hover:bg-blue-50 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.767 5.767 0 0 1 8.2 12.75a5.767 5.767 0 0 1 5.79-5.765c1.498 0 2.861.56 3.9 1.484l3.182-3.183a10.05 10.05 0 0 0-7.082-2.7C6.183 2.585 2 6.768 2 11.916 2 17.062 6.183 21.246 11.99 21.246c5.787 0 9.77-3.96 9.77-9.743 0-.616-.065-1.2-.178-1.764l-9.342.046Z"
                  />
                </svg>
                Google Account
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </SkyBg>
  );
};
export default LoginScreen;
