import React, { useState } from "react";
import { LogOut, BarChart2, Users, Download, Award, Search, Lock, Unlock, Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext";
import { MOCK_STUDENTS, MISSIONS } from "../data/missions";

export const GuruDashboardScreen: React.FC = () => {
  const { userName, logout } = useAuth();
  const { playSFX } = useAudio();
  const [filter, setFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const classes = ["Semua", "5A", "5B", "5C"];

  // Lock state: key is `${kelas}-${missionId}`, value is boolean (true = locked, false = open)
  const [locks, setLocks] = useState<Record<string, boolean>>({});

  // Merge real student data from localStorage if available
  const allStudents = React.useMemo(() => {
    try {
      const savedState = localStorage.getItem("dedigma_game_state");
      const savedUser = localStorage.getItem("dedigma_username") || "Siswa Terdaftar";
      if (savedState) {
        const parsed = JSON.parse(savedState);
        const m1 = Boolean(parsed.missions?.[1]?.completed);
        const m2 = Boolean(parsed.missions?.[2]?.completed);
        const m3 = Boolean(parsed.missions?.[3]?.completed);
        const totalScore = parsed.totalScore || 0;
        const tantanganScore = parsed.tantanganScore !== null && parsed.tantanganScore !== undefined ? parsed.tantanganScore : "-";
        const posttestScore = parsed.posttest?.score !== null && parsed.posttest?.score !== undefined ? parsed.posttest.score : "-";
        
        const realStudent = {
          id: 999,
          nama: savedUser,
          kelas: "5A",
          misi1: m1,
          misi2: m2,
          misi3: m3,
          skor: totalScore,
          tantangan: tantanganScore,
          posttest: posttestScore,
          waktu: "15 Menit",
          tanggal: new Date().toISOString().split("T")[0]
        };

        // Filter out if duplicate or prepend as active student
        return [realStudent, ...MOCK_STUDENTS.filter((s) => s.nama !== savedUser)];
      }
    } catch (e) {
      console.error("Error reading student localStorage:", e);
    }
    return MOCK_STUDENTS;
  }, []);

  const toggleLock = (kelas: string, missionId: number) => {
    playSFX("click");
    setLocks((prev) => {
      const key = `${kelas}-${missionId}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const handleLogout = () => {
    playSFX("click");
    logout();
  };

  const filtered = allStudents.filter((s) => {
    const matchClass = filter === "Semua" || s.kelas === filter;
    const matchSearch = s.nama.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  const activeStudents = allStudents.filter((s) => s.misi1 || s.misi2 || s.misi3).length;
  const completedAll = allStudents.filter((s) => s.misi1 && s.misi2 && s.misi3).length;

  const validScores = allStudents.filter((s) => s.skor > 0);
  const avgScore =
    validScores.length > 0 ? Math.round(validScores.reduce((acc, curr) => acc + curr.skor, 0) / validScores.length) : 0;

  const stats = {
    total: allStudents.length,
    active: activeStudents,
    selesai: completedAll,
    avgScore: avgScore
  };

  // Find students who have an active mission
  const activeNowStudents = allStudents.filter((s) => s.misi1 || s.misi2 || s.misi3);

  const exportCSV = () => {
    playSFX("click");
    const headers = [
      "No",
      "Nama Detektif",
      "Kelas",
      "Misi 1 (Larung Sesaji)",
      "Misi 2 (Nyadaran)",
      "Misi 3 (Ledhug Suro)",
      "Skor Rata-Rata Misi (%)",
      "Skor Tantangan",
      "Skor Posttest",
      "Status Kelulusan",
      "Durasi Belajar",
      "Tanggal Akses"
    ];

    const rows = filtered.map((s, i) => {
      const allDone = s.misi1 && s.misi2 && s.misi3;
      const status = allDone ? "LULUS (3 Misi Selesai)" : "Dalam Proses";
      return [
        i + 1,
        s.nama,
        s.kelas,
        s.misi1 ? "Selesai" : "Belum",
        s.misi2 ? "Selesai" : "Belum",
        s.misi3 ? "Selesai" : "Belum",
        s.skor > 0 ? `${s.skor}%` : "0%",
        (s as any).tantangan ?? "-",
        (s as any).posttest ?? "-",
        status,
        s.waktu || "-",
        s.tanggal || new Date().toISOString().split("T")[0]
      ];
    });

    const BOM = "\ufeff";
    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Laporan_Rekap_DEDIGMA_${filter.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#183655] flex flex-col font-['Nunito'] select-none">
      {/* Top Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-[#EAB308] rounded-full p-2 border-2 border-[#183655] ring-2 ring-[#EAB308]">
            <Search className="text-[#183655]" size={20} />
          </div>
          <div>
            <h1 className="font-['Fredoka'] font-bold text-xl leading-tight text-[#EAB308]">MARKAS DETEKTIF</h1>
            <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase">Panel Guru</p>
          </div>
        </div>

        <div className="hidden md:flex items-center bg-[#1E40AF] px-4 py-2 rounded-full border border-blue-600/50">
          <span className="text-sm font-semibold text-blue-100">"Selamat bertugas! {activeNowStudents.length} detektif cilik sedang aktif."</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] transition-colors rounded-full px-4 py-2 text-sm font-bold cursor-pointer text-[#183655]"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-transparent hover:bg-white/10 border-2 border-white/20 transition-colors rounded-full px-4 py-2 text-sm font-bold cursor-pointer text-white"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6 overflow-y-auto">

        {/* Stats Cards (4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#FDF7E6] rounded-3xl overflow-hidden shadow-lg border-2 border-[#2563EB]">
            <div className="bg-[#2563EB] text-white px-4 py-2 flex items-center gap-2 font-['Fredoka'] font-semibold">
              Total Detektif
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[#8B4513] font-['Fredoka'] font-bold text-4xl">{stats.total}</span>
              <span className="text-[#8B4513]/70 text-sm font-semibold">terdaftar</span>
            </div>
          </div>

          <div className="bg-[#FDF7E6] rounded-3xl overflow-hidden shadow-lg border-2 border-[#16A34A]">
            <div className="bg-[#16A34A] text-white px-4 py-2 flex items-center gap-2 font-['Fredoka'] font-semibold">
              Sedang Bertugas
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[#8B4513] font-['Fredoka'] font-bold text-4xl">{activeNowStudents.length}</span>
              <span className="text-[#8B4513]/70 text-sm font-semibold">aktif sekarang</span>
            </div>
          </div>

          <div className="bg-[#FDF7E6] rounded-3xl overflow-hidden shadow-lg border-2 border-[#D97706]">
            <div className="bg-[#D97706] text-white px-4 py-2 flex items-center gap-2 font-['Fredoka'] font-semibold">
              Misi Tuntas
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[#8B4513] font-['Fredoka'] font-bold text-4xl">{stats.selesai}</span>
              <span className="text-[#8B4513]/70 text-sm font-semibold">selesai 3 misi</span>
            </div>
          </div>

          <div className="bg-[#FDF7E6] rounded-3xl overflow-hidden shadow-lg border-2 border-[#EAB308]">
            <div className="bg-[#EAB308] text-[#8B4513] px-4 py-2 flex items-center gap-2 font-['Fredoka'] font-bold">
              Rata-rata Skor
            </div>
            <div className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[#8B4513] font-['Fredoka'] font-bold text-4xl">{stats.avgScore}</span>
              <span className="text-[#8B4513]/70 text-sm font-semibold">keseluruhan</span>
            </div>
          </div>
        </div>

        {/* Detektif Sedang Menjalankan Misi */}
        <div className="bg-[#FDF7E6] rounded-3xl p-5 shadow-lg border-4 border-[#D97706]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Fredoka'] font-bold text-xl text-[#8B4513] flex items-center gap-2">
              <span className="bg-[#10B981] w-3 h-3 rounded-full animate-pulse"></span>
              Detektif Sedang Menjalankan Misi
            </h3>
            <span className="bg-[#D1FAE5] text-[#065F46] font-bold px-3 py-1 rounded-full text-xs border border-[#10B981]">
              {activeNowStudents.length} aktif
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {activeNowStudents.map((s, i) => (
              <div key={i} className="bg-white border-2 border-emerald-200 rounded-2xl p-3 min-w-[240px] flex items-start gap-3 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-[#1E293B] text-sm">{s.nama}</h4>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">
                    {s.activeMission} • <span className="text-orange-500">{s.activeStage}</span> • login {s.loginTime}
                  </p>
                </div>
              </div>
            ))}
            {activeNowStudents.length === 0 && (
              <p className="text-gray-500 text-sm italic py-2">Tidak ada detektif yang sedang login.</p>
            )}
          </div>
        </div>

        {/* Lock / Unlock Misi per Kelas */}
        <div className="bg-[#FDF7E6] rounded-3xl p-5 shadow-lg border-4 border-[#D97706]/20">
          <h3 className="font-['Fredoka'] font-bold text-xl text-[#8B4513] flex items-center gap-2 mb-4">
            Lock / Unlock Misi per Kelas
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#8B4513]/10">
                  <th className="text-left font-['Fredoka'] text-[#8B4513] pb-2 px-2 w-24">Kelas</th>
                  <th className="text-left font-['Fredoka'] text-[#8B4513] pb-2 px-2">Larung Sesaji</th>
                  <th className="text-left font-['Fredoka'] text-[#8B4513] pb-2 px-2">Nyadaran</th>
                  <th className="text-left font-['Fredoka'] text-[#8B4513] pb-2 px-2">Ledhug Suro</th>
                </tr>
              </thead>
              <tbody>
                {["5A", "5B", "5C"].map((cls) => (
                  <tr key={cls} className="border-b border-[#8B4513]/5 last:border-0">
                    <td className="py-4 px-2">
                      <span className="bg-[#1D4ED8] text-white font-bold px-4 py-1.5 rounded-full text-sm">
                        {cls}
                      </span>
                    </td>
                    {[1, 2, 3].map((mId) => {
                      const isLocked = locks[`${cls}-${mId}`];
                      return (
                        <td key={mId} className="py-4 px-2">
                          <button
                            onClick={() => toggleLock(cls, mId)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border-2
                              ${isLocked
                                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                              }
                            `}
                          >
                            {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                            {isLocked ? "Terkunci" : "Terbuka"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Filters and List */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-[#EAB308] text-[#183655] font-['Fredoka'] font-bold rounded-full px-4 py-2 text-sm shadow-md border-2 border-transparent flex items-center gap-2">
              Per Siswa
            </button>
            <button className="bg-transparent text-blue-200 border border-blue-400/30 hover:bg-white/5 font-['Fredoka'] font-semibold rounded-full px-4 py-2 text-sm flex items-center gap-2 transition-colors">
              Per Kelas
            </button>

            <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block"></div>

            <div className="flex gap-2">
              {classes.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`font-['Fredoka'] font-bold rounded-full px-4 py-1.5 text-sm transition-all
                    ${filter === c
                      ? "bg-[#2563EB] text-white shadow border-2 border-blue-400"
                      : "bg-[#1E3A8A] text-blue-200 border border-transparent hover:bg-blue-800"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex-1 relative ml-2 min-w-[200px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={14} className="text-blue-300" />
              </div>
              <input
                type="text"
                placeholder="Cari nama detektif..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1E3A8A] text-white border border-blue-500/50 rounded-full py-1.5 pl-9 pr-4 text-sm font-semibold focus:outline-none focus:border-blue-300 focus:bg-[#1E40AF] placeholder-blue-300/70"
              />
            </div>
          </div>

          <div className="bg-[#1E3A8A] rounded-3xl overflow-hidden border border-blue-600/30 shadow-xl">
            <div className="px-5 py-3 border-b border-blue-600/30 flex justify-between items-center bg-[#1E40AF]">
              <h3 className="font-['Fredoka'] font-bold text-white flex items-center gap-2">
                Daftar Detektif Cilik
              </h3>
              <span className="text-blue-200 text-xs font-semibold">{filtered.length} siswa</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-600/30 text-blue-300 text-xs font-['Fredoka'] text-left">
                    <th className="px-5 py-3 font-semibold">No</th>
                    <th className="px-5 py-3 font-semibold">Nama Detektif</th>
                    <th className="px-5 py-3 font-semibold text-center">Kelas</th>
                    <th className="px-5 py-3 font-semibold text-center">Misi 1</th>
                    <th className="px-5 py-3 font-semibold text-center">Misi 2</th>
                    <th className="px-5 py-3 font-semibold text-center">Misi 3</th>
                    <th className="px-5 py-3 font-semibold text-center">Skor Akhir</th>
                    <th className="px-5 py-3 font-semibold">Login Terakhir</th>
                  </tr>
                </thead>
                <tbody className="text-white/90 font-['Nunito']">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-blue-300 font-semibold">
                        Tidak ada siswa yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s, i) => (
                      <tr key={s.id} className="border-b border-blue-800 hover:bg-[#2563EB]/40 transition-colors">
                        <td className="px-5 py-3 text-blue-300/70">{i + 1}</td>
                        <td className="px-5 py-3 font-bold text-white">
                          {s.nama}
                          {s.activeMission && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> {s.activeMission}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="bg-[#1D4ED8] text-blue-100 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-500/30">
                            {s.kelas}
                          </span>
                        </td>
                        {[s.misi1, s.misi2, s.misi3].map((done, mi) => (
                          <td key={mi} className="px-5 py-3 text-center">
                            {done ? (
                              <span className="text-emerald-400 font-bold">Selesai</span>
                            ) : (
                              <span className="text-blue-300/40 text-xs">Belum</span>
                            )}
                          </td>
                        ))}
                        <td className="px-5 py-3 text-center">
                          <span className={`font-['Fredoka'] font-bold text-base ${s.skor >= 85 ? "text-emerald-400" : s.skor >= 70 ? "text-amber-400" : s.skor > 0 ? "text-rose-400" : "text-blue-300/30"
                            }`}>
                            {s.skor > 0 ? s.skor : "-"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-blue-200/60 text-xs">
                          {s.tanggal} {s.loginTime ? `• ${s.loginTime}` : ""}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default GuruDashboardScreen;
