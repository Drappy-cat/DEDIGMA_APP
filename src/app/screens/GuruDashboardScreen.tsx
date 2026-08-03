import React, { useState } from "react";
import { motion } from "motion/react";
import { LogOut, BarChart2, Users, Download, Award, Search, Lock, Unlock, FileText } from "lucide-react";
import jsPDF from "jspdf";
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
  const [locks, setLocks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("dedigma_mission_locks");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading locks from localStorage:", e);
    }
    return {};
  });

  // Merge real student data from localStorage if available
  const allStudents = React.useMemo(() => {
    try {
      const savedState = localStorage.getItem("dedigma_game_state");
      const savedUser = localStorage.getItem("dedigma_username") || "Siswa Terdaftar";
      const savedKelas = localStorage.getItem("dedigma_kelas") || "5A";
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
          kelas: savedKelas,
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
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("dedigma_mission_locks", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving locks to localStorage:", e);
      }
      return updated;
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
        s.tantangan ?? "-",
        s.posttest ?? "-",
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

  const exportPDF = () => {
    playSFX("click");
    try {
      const doc = new jsPDF();
      const dateStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      
      // Document Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("LAPORAN REKAP HASIL BELAJAR DETEKTIF DIGITAL (DEDIGMA)", 14, 18);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Filter Kelas: ${filter} | Tanggal Cetak: ${dateStr}`, 14, 25);
      doc.text(`Total Siswa: ${filtered.length} | Rata-rata Skor Keseluruhan: ${stats.avgScore}`, 14, 31);

      doc.setLineWidth(0.5);
      doc.line(14, 34, 196, 34);

      // Table Headers
      let y = 42;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("No", 14, y);
      doc.text("Nama Siswa", 24, y);
      doc.text("Kelas", 80, y);
      doc.text("Misi 1", 95, y);
      doc.text("Misi 2", 115, y);
      doc.text("Misi 3", 135, y);
      doc.text("Skor Rata", 155, y);
      doc.text("Posttest", 175, y);

      y += 3;
      doc.line(14, y, 196, y);
      y += 6;

      // Rows
      doc.setFont("helvetica", "normal");
      filtered.forEach((s, i) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(String(i + 1), 14, y);
        doc.text(s.nama.slice(0, 24), 24, y);
        doc.text(s.kelas, 80, y);
        doc.text(s.misi1 ? "Selesai" : "-", 95, y);
        doc.text(s.misi2 ? "Selesai" : "-", 115, y);
        doc.text(s.misi3 ? "Selesai" : "-", 135, y);
        doc.text(s.skor > 0 ? `${s.skor}%` : "-", 155, y);
        doc.text(String(s.posttest ?? "-"), 175, y);
        y += 6.5;
      });

      doc.save(`Laporan_Rekap_DEDIGMA_${filter.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    }
  };

  return (
    <div className="w-full h-full min-h-0 bg-[#183655] flex flex-col font-['Nunito'] select-none">
      {/* Top Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-[#EAB308] rounded-full p-2 border-2 border-[#183655] ring-2 ring-[#EAB308] text-[#183655]">
            <Users size={20} />
          </div>
          <div>
            <h1 className="font-['Fredoka'] font-bold text-xl leading-tight text-[#EAB308]">MARKAS DETEKTIF</h1>
            <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase">Panel Guru</p>
          </div>
        </div>

        <div className="hidden md:flex items-center bg-[#1E40AF] px-4 py-2 rounded-full border border-blue-600/50">
          <span className="text-sm font-semibold text-blue-100">"Selamat bertugas! {activeStudents} detektif cilik sedang aktif."</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 bg-[#F59E0B] hover:bg-[#D97706] transition-colors rounded-full px-3.5 py-1.5 text-xs font-bold cursor-pointer text-[#183655] shadow"
          >
            <Download size={14} /> Excel (CSV)
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white transition-colors rounded-full px-3.5 py-1.5 text-xs font-bold cursor-pointer shadow"
          >
            <FileText size={14} /> Export PDF
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-transparent hover:bg-white/10 border-2 border-white/20 transition-colors rounded-full px-3.5 py-1.5 text-xs font-bold cursor-pointer text-white ml-1"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
        {/* Class Filter Bar & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e40af]/40 p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Pilih Kelas:</span>
            <div className="flex gap-2">
              {classes.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    playSFX("click");
                    setFilter(c);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filter === c ? "bg-[#EAB308] text-[#183655] shadow-md scale-105" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" size={16} />
            <input
              type="text"
              placeholder="Cari nama detektif..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/10 text-white text-xs font-semibold placeholder:text-white/40 pl-9 pr-4 py-2 rounded-full border border-white/20 focus:outline-none focus:border-[#EAB308] w-full md:w-64"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4 text-white"
          >
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-300">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-blue-200 font-semibold">Total Siswa Terdaftar</p>
              <h3 className="font-['Fredoka'] text-2xl font-bold text-white">{stats.total} Siswa</h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4 text-white"
          >
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-300">
              <BarChart2 size={24} />
            </div>
            <div>
              <p className="text-xs text-emerald-200 font-semibold">Siswa Aktif Misi</p>
              <h3 className="font-['Fredoka'] text-2xl font-bold text-emerald-300">{stats.active} Siswa</h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4 text-white"
          >
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-300">
              <Award size={24} />
            </div>
            <div>
              <p className="text-xs text-amber-200 font-semibold">Lulus 3 Misi (Sertifikat)</p>
              <h3 className="font-['Fredoka'] text-2xl font-bold text-amber-300">{stats.selesai} Siswa</h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center gap-4 text-white"
          >
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300">
              <BarChart2 size={24} />
            </div>
            <div>
              <p className="text-xs text-purple-200 font-semibold">Rata-rata Skor Misi</p>
              <h3 className="font-['Fredoka'] text-2xl font-bold text-purple-300">{stats.avgScore}%</h3>
            </div>
          </motion.div>
        </div>

        {/* Mission Lock Control Panel */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-4 text-white space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-['Fredoka'] font-bold text-base text-[#EAB308] flex items-center gap-2">
              <Lock size={18} /> Kontrol Kunci Misi (Kelas {filter})
            </h3>
            <span className="text-[11px] text-blue-200">Klik ikon gembok untuk mengunci/membuka akses siswa</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MISSIONS.map((m) => {
              const lockKey = `${filter}-${m.id}`;
              const isLocked = Boolean(locks[lockKey]);

              return (
                <div
                  key={m.id}
                  className="bg-black/20 rounded-xl p-3 flex items-center justify-between border border-white/10"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{m.emoji}</span>
                    <div>
                      <p className="font-['Fredoka'] font-bold text-xs text-white">Misi {m.id}: {m.name}</p>
                      <p className="text-[10px] text-blue-200">{isLocked ? "🔒 Terkunci" : "🔓 Terbuka"}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLock(filter, m.id)}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      isLocked ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
                    }`}
                    title={isLocked ? "Buka Akses Misi" : "Kunci Akses Misi"}
                  >
                    {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="p-4 bg-slate-100 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-['Fredoka'] font-bold text-slate-800 text-base">Rekap Progres Detektif Siswa</h3>
            <span className="text-xs font-semibold text-slate-500">Menampilkan {filtered.length} Siswa</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-gray-200 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4 text-center">Misi 1</th>
                  <th className="py-3 px-4 text-center">Misi 2</th>
                  <th className="py-3 px-4 text-center">Misi 3</th>
                  <th className="py-3 px-4 text-center">Skor Rata-Rata</th>
                  <th className="py-3 px-4 text-center">Tantangan</th>
                  <th className="py-3 px-4 text-center">Posttest</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-slate-700 font-semibold">
                {filtered.map((s, idx) => {
                  const allDone = s.misi1 && s.misi2 && s.misi3;

                  return (
                    <tr key={s.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-4">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{s.nama}</td>
                      <td className="py-3 px-4">{s.kelas}</td>
                      <td className="py-3 px-4 text-center">
                        {s.misi1 ? (
                          <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                            ✓ Selesai
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {s.misi2 ? (
                          <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                            ✓ Selesai
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {s.misi3 ? (
                          <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                            ✓ Selesai
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-blue-700">
                        {s.skor > 0 ? `${s.skor}%` : "-"}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-[#D97706] text-amber-600">
                        {s.tantangan ?? "-"}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-purple-600">
                        {s.posttest ?? "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {allDone ? (
                          <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[10px] font-bold shadow-sm">
                            🏆 Lulus
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px]">
                            Progres
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GuruDashboardScreen;
