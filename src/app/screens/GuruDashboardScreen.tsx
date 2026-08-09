import React, { useState } from "react";
import { motion } from "motion/react";
import { LogOut, Download, Search, Lock, Unlock, FileText, RefreshCw } from "lucide-react";
import jsPDF from "jspdf";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext";
import { MISSIONS } from "../data/missions";

import { fetchGuruRekapFromSupabase, fetchSupabaseClassLocks, subscribeToClassLocks, toggleSupabaseClassLock, SupabaseClassLock, resetStudentDatabase } from "../services/supabase";

export const GuruDashboardScreen: React.FC = () => {
  const { userName, logout } = useAuth();
  const { playSFX } = useAudio();
  const [filter, setFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const classes = ["Semua", "4"];

  const [locks, setLocks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("dedigma_mission_locks");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading locks from localStorage:", e);
    }
    return {};
  });

  const [realData, setRealData] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRefleksiStudent, setSelectedRefleksiStudent] = useState<any>(null);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      // Fetch Locks
      const supabaseLocks = await fetchSupabaseClassLocks();
      if (supabaseLocks) {
        const locksMap: Record<string, boolean> = {};
        supabaseLocks.forEach((l: SupabaseClassLock) => {
          locksMap[`${l.kelas}-${l.mission_id}`] = l.is_locked;
        });
        setLocks(locksMap);
        localStorage.setItem("dedigma_mission_locks", JSON.stringify(locksMap));
      }

      // Fetch Student Data
      const rekap = await fetchGuruRekapFromSupabase();
      if (rekap) {
        const studentMap = new Map();

        // 1. Base from Profiles
        rekap.profiles.filter(p => p.role === "siswa").forEach(p => {
          studentMap.set(p.user_name, {
            id: p.id || p.user_name,
            nama: p.user_name,
            kelas: p.kelas,
            misi1: false, misi2: false, misi3: false,
            skor1: 0, skor2: 0, skor3: 0,
            skor: 0,
            pretest: "-",
            posttest: "-",
            waktu: "-",
            tanggal: p.created_at ? p.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            refleksi1: "",
            refleksi2: "",
            refleksi3: ""
          });
        });

        // 2. Add Progress
        rekap.progress.forEach(p => {
          if (!studentMap.has(p.user_name)) {
            studentMap.set(p.user_name, {
              id: p.user_name, nama: p.user_name, kelas: p.kelas,
              misi1: false, misi2: false, misi3: false,
              skor1: 0, skor2: 0, skor3: 0, skor: 0, pretest: "-", posttest: "-", waktu: "-", tanggal: p.updated_at ? p.updated_at.split("T")[0] : "-",
              refleksi1: "", refleksi2: "", refleksi3: ""
            });
          }
          const s = studentMap.get(p.user_name);
          if (p.mission_id === 1 && p.completed) { s.misi1 = true; s.skor1 = p.activity_score; s.refleksi1 = p.reflection_text || ""; }
          if (p.mission_id === 2 && p.completed) { s.misi2 = true; s.skor2 = p.activity_score; s.refleksi2 = p.reflection_text || ""; }
          if (p.mission_id === 3 && p.completed) { s.misi3 = true; s.skor3 = p.activity_score; s.refleksi3 = p.reflection_text || ""; }
          
          let completedCount = (s.misi1?1:0) + (s.misi2?1:0) + (s.misi3?1:0);
          if(completedCount > 0) {
            s.skor = Math.round((s.skor1 + s.skor2 + s.skor3) / completedCount);
          }
        });

        // 3. Add Pretests & Posttests
        rekap.pretests.forEach(p => {
          if (studentMap.has(p.user_name)) studentMap.get(p.user_name).pretest = p.pretest_score;
        });
        rekap.posttests.forEach(p => {
          if (studentMap.has(p.user_name)) studentMap.get(p.user_name).posttest = p.posttest_score;
        });

        setRealData(Array.from(studentMap.values()));
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    loadData();

    const unsubscribe = subscribeToClassLocks((updatedKelas, missionId, isLocked) => {
      setLocks((prev) => {
        const next = { ...prev, [`${updatedKelas}-${missionId}`]: isLocked };
        localStorage.setItem("dedigma_mission_locks", JSON.stringify(next));
        return next;
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const allStudents = realData;

  const toggleLock = (kelas: string, missionId: number) => {
    playSFX("click");
    const key = `${kelas}-${missionId}`;
    const newLockState = !locks[key];
    
    // Optimistic update locally
    setLocks((prev) => {
      const updated = { ...prev, [key]: newLockState };
      try {
        localStorage.setItem("dedigma_mission_locks", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Sync to Supabase
    toggleSupabaseClassLock(kelas, missionId, newLockState);
  };

  const handleLogout = () => {
    playSFX("click");
    logout();
  };

  const handleResetDatabase = async () => {
    playSFX("click");
    const confirmReset = window.prompt("PERINGATAN BAHAYA!\nTindakan ini akan MENGHAPUS SEMUA DATA SISWA (akun, progress, pretest, dan posttest).\nKetik 'RESET' untuk melanjutkan:");
    
    if (confirmReset === "RESET") {
      setIsRefreshing(true);
      const success = await resetStudentDatabase();
      if (success) {
        alert("Database siswa berhasil direset.");
        await loadData();
      } else {
        alert("Gagal mereset database. Periksa koneksi internet.");
      }
      setIsRefreshing(false);
    } else if (confirmReset !== null) {
      alert("Reset dibatalkan. Kata kunci tidak sesuai.");
    }
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
      "Skor Pretest",
      "Skor Posttest",
      "Status Kelulusan",
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
        s.pretest ?? "-",
        s.posttest ?? "-",
        status,
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

  const handleExportPDF = () => {
    playSFX("click");
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("REKAP NILAI DETEKTIF BUDAYA DEDIGMA", 14, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Kelas: ${filter} | Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`, 14, 26);
      
      let startY = 36;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("No", 14, startY);
      doc.text("Nama Siswa", 25, startY);
      doc.text("Kelas", 75, startY);
      doc.text("Pretest", 95, startY);
      doc.text("Misi 1", 115, startY);
      doc.text("Misi 2", 135, startY);
      doc.text("Misi 3", 155, startY);
      doc.text("Posttest", 175, startY);

      doc.line(14, startY + 2, 195, startY + 2);
      startY += 8;

      doc.setFont("helvetica", "normal");
      filtered.forEach((s, i) => {
        if (startY > 280) {
          doc.addPage();
          startY = 20;
        }
        doc.text(`${i + 1}`, 14, startY);
        doc.text(`${s.nama}`, 25, startY);
        doc.text(`${s.kelas}`, 75, startY);
        doc.text(`${s.pretest ?? "-"}`, 95, startY);
        doc.text(`${s.misi1 ? `${s.skor1}%` : "-"}`, 115, startY);
        doc.text(`${s.misi2 ? `${s.skor2}%` : "-"}`, 135, startY);
        doc.text(`${s.misi3 ? `${s.skor3}%` : "-"}`, 155, startY);
        doc.text(`${s.posttest ?? "-"}`, 175, startY);
        startY += 6;
      });

      doc.save(`Rekap-Nilai-DEDIGMA-Kelas-${filter}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] font-['Nunito'] p-4 md:p-6 select-none relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#EAB308] to-[#CA8A04] flex items-center justify-center text-white shadow-lg font-bold text-xl">
              👩‍🏫
            </div>
            <div>
              <h1 className="font-['Fredoka'] font-extrabold text-2xl text-white tracking-wide">
                Dashboard Monitoring Guru
              </h1>
              <p className="text-xs text-blue-200 font-semibold">
                Pantau progres belajar, hasil pretest/posttest, dan refleksi siswa secara realtime
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { playSFX("click"); loadData(); }}
              disabled={isRefreshing}
              className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer border border-blue-400/30"
              title="Refresh Data dari Server"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              <span>{isRefreshing ? "Memuat..." : "Refresh Data"}</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Ekspor PDF</span>
            </button>
            <button
              onClick={handleResetDatabase}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ml-1"
              title="Reset Semua Data Siswa"
            >
              <span className="text-lg leading-none">⚠️</span>
              <span className="hidden sm:inline">Reset DB</span>
            </button>

            <div className="h-8 w-px bg-white/20 mx-1"></div>

            <button
              onClick={handleLogout}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer border border-white/10"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

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
                  <th className="py-3 px-4 text-center">Pretest</th>
                  <th className="py-3 px-4 text-center">Misi 1</th>
                  <th className="py-3 px-4 text-center">Misi 2</th>
                  <th className="py-3 px-4 text-center">Misi 3</th>
                  <th className="py-3 px-4 text-center">Skor Rata-Rata</th>
                  <th className="py-3 px-4 text-center">Posttest</th>
                  <th className="py-3 px-4 text-center">Refleksi</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-slate-700 font-semibold">
                {filtered.map((s, idx) => {
                  const allDone = s.misi1 && s.misi2 && s.misi3;
                  const hasRefleksi = Boolean(s.refleksi1 || s.refleksi2 || s.refleksi3);

                  return (
                    <tr key={s.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-4">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{s.nama}</td>
                      <td className="py-3 px-4">{s.kelas}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-600">
                        {s.pretest ?? "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {s.misi1 ? (
                          <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                            {s.skor1}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {s.misi2 ? (
                          <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                            {s.skor2}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {s.misi3 ? (
                          <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                            {s.skor3}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-blue-700">
                        {s.skor > 0 ? `${s.skor}%` : "-"}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-purple-600">
                        {s.posttest ?? "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {hasRefleksi ? (
                          <button
                            onClick={() => { playSFX("click"); setSelectedRefleksiStudent(s); }}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <FileText size={12} />
                            <span>Lihat</span>
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
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

      {/* Modal Popup Detail Refleksi Siswa */}
      {selectedRefleksiStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <div>
                <h3 className="font-['Fredoka'] font-bold text-lg text-amber-400">
                  Refleksi Budaya: {selectedRefleksiStudent.nama}
                </h3>
                <p className="text-xs text-slate-400">Kelas: {selectedRefleksiStudent.kelas}</p>
              </div>
              <button
                onClick={() => setSelectedRefleksiStudent(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {[1, 2, 3].map((mId) => {
                const text = mId === 1 ? selectedRefleksiStudent.refleksi1 : mId === 2 ? selectedRefleksiStudent.refleksi2 : selectedRefleksiStudent.refleksi3;
                return (
                  <div key={mId} className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                      Misi {mId}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-['Nunito'] italic whitespace-pre-wrap">
                      {text ? `"${text}"` : "Belum ada catatan refleksi untuk misi ini."}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedRefleksiStudent(null)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs cursor-pointer shadow-md"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default GuruDashboardScreen;
