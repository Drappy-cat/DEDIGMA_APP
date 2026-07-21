import React, { useState } from "react";
import { LogOut, BarChart2, Users, Download, Award } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext";
import { MOCK_STUDENTS, MISSIONS } from "../data/missions";

export const GuruDashboardScreen: React.FC = () => {
  const { userName, logout } = useAuth();
  const { playSFX } = useAudio();
  const [filter, setFilter] = useState("Semua");
  const classes = ["Semua", "5A", "5B", "5C"];

  const filtered = filter === "Semua" ? MOCK_STUDENTS : MOCK_STUDENTS.filter((s) => s.kelas === filter);

  const activeStudents = MOCK_STUDENTS.filter((s) => s.misi1 || s.misi2 || s.misi3).length;
  const completedAll = MOCK_STUDENTS.filter((s) => s.misi1 && s.misi2 && s.misi3).length;

  const validScores = MOCK_STUDENTS.filter((s) => s.skor > 0);
  const avgScore =
    validScores.length > 0 ? Math.round(validScores.reduce((acc, curr) => acc + curr.skor, 0) / validScores.length) : 0;

  const stats = {
    total: MOCK_STUDENTS.length,
    active: activeStudents,
    selesai: completedAll,
    avgScore: avgScore
  };

  const handleLogout = () => {
    playSFX("click");
    logout();
  };

  const exportCSV = () => {
    playSFX("click");
    const headers = ["No", "Nama Siswa", "Kelas", "Misi 1", "Misi 2", "Misi 3", "Skor", "Durasi", "Tanggal"];
    const rows = MOCK_STUDENTS.map((s, i) => [
      i + 1,
      s.nama,
      s.kelas,
      s.misi1 ? "Selesai" : "Belum",
      s.misi2 ? "Selesai" : "Belum",
      s.misi3 ? "Selesai" : "Belum",
      s.skor,
      s.waktu,
      s.tanggal
    ]);

    const BOM = "\ufeff"; // Ensures Indonesian characters render correctly in Excel
    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Laporan_Aktivitas_DEDIGMA_${filter.replace(/\s+/g, "_")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-['Nunito'] select-none">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white px-5 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl filter drop-shadow">🔍</span>
          <div>
            <h1 className="font-['Fredoka'] font-bold text-xl leading-tight">DEDIGMA</h1>
            <p className="text-blue-200 text-xs font-semibold">Dashboard Guru | Pendidik: {userName}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-3 py-2 text-sm font-semibold cursor-pointer text-white"
        >
          <LogOut size={16} /> Keluar
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-4 overflow-y-auto">
        {/* Stats Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Siswa", value: stats.total, emoji: "👥", color: "from-blue-500 to-blue-600" },
            { label: "Sudah Aktif", value: stats.active, emoji: "✅", color: "from-green-500 to-emerald-600" },
            { label: "Selesai Semua", value: stats.selesai, emoji: "🏆", color: "from-amber-500 to-orange-500" },
            { label: "Rata-rata Skor", value: stats.avgScore, emoji: "⭐", color: "from-purple-500 to-indigo-500" }
          ].map((s, i) => (
            <div key={i} className={`bg-gradient-to-br ${s.color} text-white rounded-2xl p-4 shadow-lg`}>
              <span className="text-2xl filter drop-shadow">{s.emoji}</span>
              <p className="font-['Fredoka'] font-bold text-3xl mt-1 leading-tight">{s.value}</p>
              <p className="text-white/80 text-xs font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-2xl shadow p-4 flex flex-wrap items-center gap-3 border border-gray-100">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            <span className="font-['Fredoka'] font-semibold text-blue-700 text-sm">Filter Kelas:</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {classes.map((c) => (
              <button
                key={c}
                onClick={() => {
                  playSFX("click");
                  setFilter(c);
                }}
                className={`px-3 py-1.5 rounded-xl font-['Fredoka'] font-bold text-xs cursor-pointer transition-all
                  ${
                    filter === c
                      ? "bg-blue-600 text-white shadow-md scale-105"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-2 font-['Fredoka'] font-semibold text-xs transition-all shadow cursor-pointer"
            >
              <Download size={15} /> Export CSV
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-2 select-none">
            <BarChart2 size={18} />
            <span className="font-['Fredoka'] font-semibold text-sm">Aktivitas Siswa</span>
            <span className="ml-auto text-blue-200 text-xs font-semibold">{filtered.length} siswa</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50 border-b border-blue-100 select-none">
                  {["No", "Nama", "Kelas", "Misi 1", "Misi 2", "Misi 3", "Skor", "Durasi", "Tanggal"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left font-['Fredoka'] font-bold text-blue-700 text-xs whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-3 py-2.5 text-gray-400 text-xs select-none">{i + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-gray-800">{s.nama}</td>
                    <td className="px-3 py-2.5">
                      <span className="bg-blue-100 text-blue-700 font-['Fredoka'] font-bold text-[10px] px-2 py-0.5 rounded-full select-none">
                        {s.kelas}
                      </span>
                    </td>
                    {[s.misi1, s.misi2, s.misi3].map((done, mi) => (
                      <td key={mi} className="px-3 py-2.5 text-center select-none">
                        <span className={`text-sm ${done ? "text-green-500 font-bold" : "text-gray-300"}`}>
                          {done ? "✅" : "○"}
                        </span>
                      </td>
                    ))}
                    <td className="px-3 py-2.5">
                      <span
                        className={`font-['Fredoka'] font-bold text-sm ${
                          s.skor >= 85 ? "text-green-600" : s.skor >= 70 ? "text-amber-600" : s.skor > 0 ? "text-red-500" : "text-gray-300"
                        }`}
                      >
                        {s.skor > 0 ? s.skor : "-"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs select-none">{s.waktu}</td>
                    <td className="px-3 py-2.5 text-gray-400 text-xs whitespace-nowrap select-none">{s.tanggal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Completion Progress Chart */}
        <div className="bg-white rounded-2xl shadow p-4 border border-gray-100">
          <h3 className="font-['Fredoka'] font-semibold text-blue-700 text-base mb-3 flex items-center gap-2 select-none">
            <Award size={18} /> Progres Penyelesaian Misi
          </h3>
          <div className="space-y-3">
            {MISSIONS.map((m) => {
              const count = MOCK_STUDENTS.filter((s) => s[`misi${m.id}` as keyof typeof s]).length;
              const pct = Math.round((count / MOCK_STUDENTS.length) * 100);
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center select-none">{m.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span className="font-bold">{m.name}</span>
                      <span className="font-semibold">
                        {count}/{MOCK_STUDENTS.length} siswa ({pct}%)
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full bg-gradient-to-r ${m.gradient} rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default GuruDashboardScreen;
