import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LogOut,
  Download,
  Search,
  Lock,
  Unlock,
  FileText,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Printer,
  ExternalLink,
  Share2,
  Award,
  HelpCircle
} from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useAudio } from "../contexts/AudioContext";
import { MISSIONS } from "../data/missions";
import { PRETEST_QUESTIONS } from "../data/pretestQuestions";
import { POSTTEST_QUESTIONS } from "../data/posttestQuestions";

import {
  fetchGuruRekapFromSupabase,
  fetchSupabaseClassLocks,
  subscribeToClassLocks,
  toggleSupabaseClassLock,
  SupabaseClassLock,
  resetStudentDatabase
} from "../services/supabase";

export const GuruDashboardScreen: React.FC = () => {
  const { userName, logout } = useAuth();
  const { playSFX } = useAudio();
  const [filter, setFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const classes = ["Semua", "4", "4A", "4B", "5", "5A", "5B", "6", "6A", "6B"];

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
  const [selectedTestDetail, setSelectedTestDetail] = useState<{
    student: any;
    type: "pretest" | "posttest";
  } | null>(null);

  const [pdfExportModal, setPdfExportModal] = useState<{
    blobUrl: string;
    pdfBlob?: Blob;
    fileName: string;
    title: string;
  } | null>(null);

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
        rekap.profiles
          .filter((p) => p.role === "siswa")
          .forEach((p) => {
            studentMap.set(p.user_name, {
              id: p.id || p.user_name,
              nama: p.user_name,
              kelas: p.kelas,
              misi1: false,
              misi2: false,
              misi3: false,
              skor1: 0,
              skor2: 0,
              skor3: 0,
              skor: 0,
              pretest: "-",
              posttest: "-",
              pretestAnswers: null,
              posttestAnswers: null,
              pretestDate: "-",
              posttestDate: "-",
              waktu: "-",
              tanggal: p.created_at ? p.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
              refleksi1: "",
              refleksi2: "",
              refleksi3: ""
            });
          });

        // 2. Add Progress
        rekap.progress.forEach((p) => {
          if (!studentMap.has(p.user_name)) {
            studentMap.set(p.user_name, {
              id: p.user_name,
              nama: p.user_name,
              kelas: p.kelas,
              misi1: false,
              misi2: false,
              misi3: false,
              skor1: 0,
              skor2: 0,
              skor3: 0,
              skor: 0,
              pretest: "-",
              posttest: "-",
              pretestAnswers: null,
              posttestAnswers: null,
              pretestDate: "-",
              posttestDate: "-",
              waktu: "-",
              tanggal: p.updated_at ? p.updated_at.split("T")[0] : "-",
              refleksi1: "",
              refleksi2: "",
              refleksi3: ""
            });
          }
          const s = studentMap.get(p.user_name);
          if (p.mission_id === 1 && p.completed) {
            s.misi1 = true;
            s.skor1 = p.activity_score;
            s.refleksi1 = p.reflection_text || "";
          }
          if (p.mission_id === 2 && p.completed) {
            s.misi2 = true;
            s.skor2 = p.activity_score;
            s.refleksi2 = p.reflection_text || "";
          }
          if (p.mission_id === 3 && p.completed) {
            s.misi3 = true;
            s.skor3 = p.activity_score;
            s.refleksi3 = p.reflection_text || "";
          }

          let completedCount = (s.misi1 ? 1 : 0) + (s.misi2 ? 1 : 0) + (s.misi3 ? 1 : 0);
          if (completedCount > 0) {
            s.skor = Math.round((s.skor1 + s.skor2 + s.skor3) / completedCount);
          }
        });

        // 3. Add Pretests & Posttests
        rekap.pretests.forEach((p) => {
          if (studentMap.has(p.user_name)) {
            const s = studentMap.get(p.user_name);
            s.pretest = p.pretest_score;
            s.pretestAnswers = p.answers || null;
            s.pretestDate = p.completed_at ? p.completed_at.split("T")[0] : "-";
          }
        });
        rekap.posttests.forEach((p) => {
          if (studentMap.has(p.user_name)) {
            const s = studentMap.get(p.user_name);
            s.posttest = p.posttest_score;
            s.posttestAnswers = p.answers || null;
            s.posttestDate = p.completed_at ? p.completed_at.split("T")[0] : "-";
          }
        });

        // 4. Check localStorage fallback for answers if not in Supabase yet
        studentMap.forEach((s) => {
          if (!s.pretestAnswers && typeof window !== "undefined") {
            try {
              const localPre = localStorage.getItem(`dedigma_pretest_answers_${s.nama}`);
              if (localPre) s.pretestAnswers = JSON.parse(localPre);
            } catch (e) {}
          }
          if (!s.posttestAnswers && typeof window !== "undefined") {
            try {
              const localPost = localStorage.getItem(`dedigma_posttest_answers_${s.nama}`);
              if (localPost) s.posttestAnswers = JSON.parse(localPost);
            } catch (e) {}
          }
        });

        setRealData(Array.from(studentMap.values()));
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
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
    const confirmReset = window.prompt(
      "PERINGATAN BAHAYA!\nTindakan ini akan MENGHAPUS SEMUA DATA SISWA (akun, progress, pretest, dan posttest).\nKetik 'RESET' untuk melanjutkan:"
    );

    if (confirmReset === "RESET") {
      setIsRefreshing(true);
      const success = await resetStudentDatabase();
      if (success) {
        toast.success("Database siswa berhasil direset.");
        await loadData();
      } else {
        toast.error("Gagal mereset database. Periksa koneksi internet.");
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

  // Browser download trigger helper
  const triggerBrowserDownload = (url: string, filename: string) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        try {
          document.body.removeChild(link);
        } catch {}
      }, 300);
    } catch (e) {
      console.warn("Direct link download failed, opening in new tab:", e);
      window.open(url, "_blank");
    }
  };

  // Native share handler
  const handleNativeShare = async (modalData: { pdfBlob?: Blob; fileName: string; title: string }) => {
    try {
      if (typeof navigator !== "undefined" && navigator.share && modalData.pdfBlob && navigator.canShare) {
        const file = new File([modalData.pdfBlob], modalData.fileName, { type: "application/pdf" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: modalData.title,
            text: `Laporan Hasil Evaluasi DEDIGMA: ${modalData.title}`,
            files: [file]
          });
          toast.success("Dokumen berhasil dibagikan!");
          return;
        }
      }
      toast.info("Fitur berbagi langsung tidak didukung di browser ini. Gunakan tombol unduh atau buka tab baru.");
    } catch (e) {
      console.warn("Native share error:", e);
    }
  };

  // 1. Export CSV
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
        s.misi1 ? `${s.skor1}%` : "Belum",
        s.misi2 ? `${s.skor2}%` : "Belum",
        s.misi3 ? `${s.skor3}%` : "Belum",
        s.skor > 0 ? `${s.skor}%` : "0%",
        s.pretest ?? "-",
        s.posttest ?? "-",
        status,
        s.tanggal || new Date().toISOString().split("T")[0]
      ];
    });

    const BOM = "\ufeff";
    const csvContent = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    triggerBrowserDownload(
      url,
      `Laporan_Rekap_DEDIGMA_${filter.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("File CSV rekap nilai berhasil diunduh!");
  };

  // 2. Export Class PDF (Landscape, clean, multi-page, robust)
  const handleExportPDF = () => {
    playSFX("click");
    try {
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageWidth = 297;
      const pageHeight = 210;
      const margin = 14;

      // Header Banner
      doc.setFillColor(24, 54, 85); // Navy Dark
      doc.rect(margin, 12, pageWidth - margin * 2, 20, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("REKAPITULASI NILAI & EVALUASI BELAJAR SISWA - DEDIGMA", margin + 6, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(203, 213, 225);
      doc.text(
        "Media Pembelajaran Detektif Digital Budaya Magetan | Laporan Resmi Guru",
        margin + 6,
        26
      );

      // Meta Stats Box
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, 35, pageWidth - margin * 2, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);

      const printDate = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      doc.text(`Kelas: ${filter}   |   Tanggal Cetak: ${printDate}`, margin + 4, 41);
      doc.text(
        `Total Siswa: ${filtered.length}   |   Selesai Semua Misi: ${stats.selesai}   |   Rata-rata Skor Misi: ${stats.avgScore}%`,
        pageWidth - margin - 4,
        41,
        { align: "right" }
      );

      // Table Settings
      let startY = 49;
      const colWidths = [12, 60, 16, 22, 20, 20, 20, 28, 22, 39];
      const headers = [
        "No",
        "Nama Siswa",
        "Kelas",
        "Pretest",
        "Misi 1",
        "Misi 2",
        "Misi 3",
        "Rata-rata Misi",
        "Posttest",
        "Status Kelulusan"
      ];

      const drawTableHeader = (y: number) => {
        doc.setFillColor(30, 64, 175); // Blue-800
        doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);

        let currentX = margin;
        headers.forEach((h, idx) => {
          const w = colWidths[idx];
          const align = idx === 0 || idx === 1 ? "left" : "center";
          const textX = align === "left" ? currentX + 2 : currentX + w / 2;
          doc.text(h, textX, y + 5.5, { align: align as any });
          currentX += w;
        });
      };

      drawTableHeader(startY);
      startY += 8;

      // Table Rows
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);

      filtered.forEach((s, idx) => {
        if (startY > pageHeight - 20) {
          doc.addPage();
          startY = 16;
          drawTableHeader(startY);
          startY += 8;
        }

        const rowBg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
        doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
        doc.rect(margin, startY, pageWidth - margin * 2, 7, "F");

        // Subtle row bottom border
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, startY + 7, pageWidth - margin, startY + 7);

        doc.setTextColor(15, 23, 42);

        let currentX = margin;
        const allDone = s.misi1 && s.misi2 && s.misi3;
        const statusText = allDone ? "LULUS (3 Misi)" : "Dalam Proses";

        // Truncate name if too long
        let displayName = s.nama;
        if (displayName.length > 28) {
          displayName = displayName.substring(0, 26) + "...";
        }

        const rowValues = [
          `${idx + 1}`,
          displayName,
          `${s.kelas}`,
          s.pretest !== "-" ? `${s.pretest}` : "-",
          s.misi1 ? `${s.skor1}%` : "-",
          s.misi2 ? `${s.skor2}%` : "-",
          s.misi3 ? `${s.skor3}%` : "-",
          s.skor > 0 ? `${s.skor}%` : "-",
          s.posttest !== "-" ? `${s.posttest}` : "-",
          statusText
        ];

        rowValues.forEach((val, cIdx) => {
          const w = colWidths[cIdx];
          const align = cIdx === 0 || cIdx === 1 ? "left" : "center";
          const textX = align === "left" ? currentX + 2 : currentX + w / 2;

          if (cIdx === 1) {
            doc.setFont("helvetica", "bold");
          } else {
            doc.setFont("helvetica", "normal");
          }

          if (cIdx === 9) {
            doc.setTextColor(allDone ? 22 : 100, allDone ? 101 : 116, allDone ? 52 : 139);
          } else {
            doc.setTextColor(15, 23, 42);
          }

          doc.text(val, textX, startY + 4.8, { align: align as any });
          currentX += w;
        });

        startY += 7;
      });

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(
          "DEDIGMA - Detektif Digital Budaya Magetan © 2026",
          margin,
          pageHeight - 8
        );
        doc.text(`Halaman ${p} dari ${totalPages}`, pageWidth - margin, pageHeight - 8, {
          align: "right"
        });
      }

      const pdfBlob = doc.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      const safeFilter = filter.trim().replace(/\s+/g, "_");
      const fileName = `Rekap_Nilai_DEDIGMA_Kelas_${safeFilter}_${new Date().toISOString().split("T")[0]}.pdf`;

      // Trigger direct download
      triggerBrowserDownload(blobUrl, fileName);

      // Open interactive fallback modal
      setPdfExportModal({
        blobUrl,
        pdfBlob,
        fileName,
        title: `Rekap Nilai Siswa (Kelas ${filter})`
      });

      toast.success("Laporan PDF berhasil dibuat! Dokumen siap disimpan/dicetak.");
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      toast.error("Gagal membuat dokumen PDF. Silakan coba kembali.");
    }
  };

  // 3. Export Single Student Pretest/Posttest Detail PDF
  const handleExportStudentTestPDF = (student: any, type: "pretest" | "posttest") => {
    playSFX("click");
    try {
      const isPretest = type === "pretest";
      const questions = isPretest ? PRETEST_QUESTIONS : POSTTEST_QUESTIONS;
      const rawAnswers = isPretest ? student.pretestAnswers : student.posttestAnswers;
      const score = isPretest ? student.pretest : student.posttest;
      const testDate = isPretest ? student.pretestDate : student.posttestDate;

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 14;

      // Header Banner
      doc.setFillColor(24, 54, 85);
      doc.rect(margin, 12, pageWidth - margin * 2, 22, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text(
        `LEMBAR HASIL ${isPretest ? "PRETEST (EVALUASI AWAL)" : "POSTTEST (EVALUASI AKHIR)"}`,
        margin + 6,
        21
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(203, 213, 225);
      doc.text("Detektif Digital Budaya Magetan (DEDIGMA)", margin + 6, 28);

      // Student Meta Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, 38, pageWidth - margin * 2, 22, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`Nama Siswa: ${student.nama}`, margin + 5, 45);
      doc.text(`Kelas: ${student.kelas}`, margin + 5, 52);

      let correctCount = 0;
      if (Array.isArray(rawAnswers)) {
        correctCount = rawAnswers.filter((a, i) => a === questions[i]?.jawaban).length;
      } else if (typeof score === "number") {
        correctCount = Math.round((score / 100) * questions.length);
      }
      const wrongCount = questions.length - correctCount;

      doc.text(`Skor Evaluasi: ${score} / 100`, pageWidth - margin - 5, 45, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.text(
        `Benar: ${correctCount}   |   Salah: ${wrongCount}   |   Tanggal: ${testDate || "-"}`,
        pageWidth - margin - 5,
        52,
        { align: "right" }
      );

      // Questions Table
      let startY = 66;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setFillColor(30, 64, 175);
      doc.rect(margin, startY, pageWidth - margin * 2, 7, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("No", margin + 3, startY + 4.8);
      doc.text("Pertanyaan Soal", margin + 14, startY + 4.8);
      doc.text("Jawaban Siswa", margin + 95, startY + 4.8);
      doc.text("Kunci Jawaban", margin + 140, startY + 4.8);
      doc.text("Hasil", margin + 175, startY + 4.8, { align: "center" });

      startY += 7;

      questions.forEach((q, idx) => {
        const studentAnsIdx = Array.isArray(rawAnswers) ? rawAnswers[idx] : null;
        const isCorrect = studentAnsIdx !== null && studentAnsIdx === q.jawaban;
        const studentAnswerText =
          studentAnsIdx !== null && studentAnsIdx !== undefined ? q.opsi[studentAnsIdx] : "-";
        const correctAnswerText = q.opsi[q.jawaban];

        // Truncate strings to prevent overflow
        let shortSoal = q.soal.length > 55 ? q.soal.substring(0, 52) + "..." : q.soal;
        let shortStudent =
          studentAnswerText.length > 25 ? studentAnswerText.substring(0, 23) + "..." : studentAnswerText;
        let shortCorrect =
          correctAnswerText.length > 24 ? correctAnswerText.substring(0, 22) + "..." : correctAnswerText;

        const rowBg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
        doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
        doc.rect(margin, startY, pageWidth - margin * 2, 14, "F");

        doc.setDrawColor(226, 232, 240);
        doc.line(margin, startY + 14, pageWidth - margin, startY + 14);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(`${idx + 1}`, margin + 3, startY + 5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.text(shortSoal, margin + 14, startY + 5);

        // Explanation snippet
        doc.setFont("helvetica", "italic");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        let shortPembahasan =
          q.pembahasan && q.pembahasan.length > 60
            ? q.pembahasan.substring(0, 58) + "..."
            : q.pembahasan || "";
        doc.text(`Ref: ${shortPembahasan}`, margin + 14, startY + 10);

        // Student Answer
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        if (studentAnsIdx !== null) {
          doc.setTextColor(isCorrect ? 22 : 220, isCorrect ? 101 : 38, isCorrect ? 52 : 38);
        } else {
          doc.setTextColor(100, 116, 139);
        }
        doc.text(shortStudent, margin + 95, startY + 7);

        // Correct Answer
        doc.setTextColor(22, 101, 52);
        doc.text(shortCorrect, margin + 140, startY + 7);

        // Status Badge
        doc.setFont("helvetica", "bold");
        if (studentAnsIdx !== null) {
          if (isCorrect) {
            doc.setTextColor(22, 101, 52);
            doc.text("BENAR [V]", margin + 175, startY + 7, { align: "center" });
          } else {
            doc.setTextColor(220, 38, 38);
            doc.text("SALAH [X]", margin + 175, startY + 7, { align: "center" });
          }
        } else {
          doc.setTextColor(100, 116, 139);
          doc.text("-", margin + 175, startY + 7, { align: "center" });
        }

        startY += 14;
      });

      // Footer
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "Laporan ini dibuat otomatis melalui Aplikasi Edukasi Budaya DEDIGMA Magetan.",
        margin,
        pageHeight - 8
      );

      const pdfBlob = doc.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      const safeName = student.nama.trim().replace(/\s+/g, "_");
      const fileName = `Hasil_${isPretest ? "Pretest" : "Posttest"}_${safeName}.pdf`;

      triggerBrowserDownload(blobUrl, fileName);

      setPdfExportModal({
        blobUrl,
        pdfBlob,
        fileName,
        title: `Hasil ${isPretest ? "Pretest" : "Posttest"}: ${student.nama}`
      });

      toast.success(`Hasil ${isPretest ? "Pretest" : "Posttest"} ${student.nama} berhasil disiapkan!`);
    } catch (err) {
      console.error("Failed to generate student test PDF:", err);
      toast.error("Gagal membuat dokumen PDF hasil siswa.");
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
                Pantau progres belajar, hasil detail pretest/posttest, dan refleksi siswa secara realtime
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => {
                playSFX("click");
                loadData();
              }}
              disabled={isRefreshing}
              className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer border border-blue-400/30"
              title="Refresh Data dari Server"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
              <span>{isRefreshing ? "Memuat..." : "Refresh"}</span>
            </button>

            <button
              onClick={exportCSV}
              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer border border-white/10"
              title="Unduh format spreadsheet CSV"
            >
              <Download size={14} />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              title="Ekspor Rekap Laporan PDF"
            >
              <Download size={14} />
              <span>Ekspor PDF</span>
            </button>

            <button
              onClick={handleResetDatabase}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ml-1"
              title="Reset Semua Data Siswa"
            >
              <span className="text-sm leading-none">⚠️</span>
              <span className="hidden sm:inline">Reset DB</span>
            </button>

            <div className="h-8 w-px bg-white/20 mx-1 hidden sm:block"></div>

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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white">Pilih Kelas:</span>
            <div className="flex gap-2 flex-wrap">
              {classes.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    playSFX("click");
                    setFilter(c);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filter === c
                      ? "bg-[#EAB308] text-[#183655] shadow-md scale-105"
                      : "bg-white/10 text-white hover:bg-white/20"
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
            <div>
              <h3 className="font-['Fredoka'] font-bold text-slate-800 text-base">
                Rekap Progres Detektif Siswa
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Klik tombol <span className="font-bold text-blue-600">Detail</span> pada Pretest / Posttest untuk
                melihat nomor soal yang dijawab benar dan salah oleh murid.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-200 px-3 py-1 rounded-full">
              {filtered.length} Siswa
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-gray-200 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-3">Nama Siswa</th>
                  <th className="py-3 px-3 text-center">Kelas</th>
                  <th className="py-3 px-3 text-center">Pretest</th>
                  <th className="py-3 px-3 text-center">Misi 1</th>
                  <th className="py-3 px-3 text-center">Misi 2</th>
                  <th className="py-3 px-3 text-center">Misi 3</th>
                  <th className="py-3 px-3 text-center">Rata-Rata Misi</th>
                  <th className="py-3 px-3 text-center">Posttest</th>
                  <th className="py-3 px-3 text-center">Refleksi</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-slate-700 font-semibold">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-400 font-medium italic">
                      Tidak ada data siswa yang sesuai filter atau pencarian.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, idx) => {
                    const allDone = s.misi1 && s.misi2 && s.misi3;
                    const hasRefleksi = Boolean(s.refleksi1 || s.refleksi2 || s.refleksi3);
                    const hasPretest = s.pretest !== "-" && s.pretest !== undefined && s.pretest !== null;
                    const hasPosttest = s.posttest !== "-" && s.posttest !== undefined && s.posttest !== null;

                    return (
                      <tr key={s.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="py-3 px-3">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{s.nama}</td>
                        <td className="py-3 px-3 text-center">{s.kelas}</td>

                        {/* Pretest Column with Score & Detail View Button */}
                        <td className="py-3 px-3 text-center">
                          {hasPretest ? (
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-extrabold text-blue-900 text-xs">{s.pretest}</span>
                              <button
                                onClick={() => {
                                  playSFX("click");
                                  setSelectedTestDetail({ student: s, type: "pretest" });
                                }}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                                title="Lihat rincian butir jawaban pretest"
                              >
                                <Eye size={10} />
                                <span>Detail</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* Misi 1 */}
                        <td className="py-3 px-3 text-center">
                          {s.misi1 ? (
                            <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                              {s.skor1}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* Misi 2 */}
                        <td className="py-3 px-3 text-center">
                          {s.misi2 ? (
                            <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                              {s.skor2}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* Misi 3 */}
                        <td className="py-3 px-3 text-center">
                          {s.misi3 ? (
                            <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                              {s.skor3}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* Rata-Rata */}
                        <td className="py-3 px-3 text-center font-bold text-blue-700">
                          {s.skor > 0 ? `${s.skor}%` : "-"}
                        </td>

                        {/* Posttest Column with Score & Detail View Button */}
                        <td className="py-3 px-3 text-center">
                          {hasPosttest ? (
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-extrabold text-purple-900 text-xs">{s.posttest}</span>
                              <button
                                onClick={() => {
                                  playSFX("click");
                                  setSelectedTestDetail({ student: s, type: "posttest" });
                                }}
                                className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                                title="Lihat rincian butir jawaban posttest"
                              >
                                <Eye size={10} />
                                <span>Detail</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* Refleksi */}
                        <td className="py-3 px-3 text-center">
                          {hasRefleksi ? (
                            <button
                              onClick={() => {
                                playSFX("click");
                                setSelectedRefleksiStudent(s);
                              }}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 mx-auto cursor-pointer shadow-2xs"
                            >
                              <FileText size={11} />
                              <span>Lihat</span>
                            </button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 text-center">
                          {allDone ? (
                            <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[10px] font-bold shadow-xs">
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
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. Modal Popup Detail Jawaban Pretest / Posttest Siswa (Benar / Salah) */}
      {/* ========================================================================= */}
      {selectedTestDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[9999] overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-4 sm:p-6 text-white space-y-4 shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
            {/* Header Modal */}
            <div className="flex justify-between items-start border-b border-slate-700 pb-3 flex-shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {selectedTestDetail.type === "pretest" ? "📝" : "🎯"}
                  </span>
                  <h3 className="font-['Fredoka'] font-bold text-lg text-amber-400">
                    Hasil {selectedTestDetail.type === "pretest" ? "Pretest" : "Posttest"}:{" "}
                    {selectedTestDetail.student.nama}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-semibold">
                  Kelas: {selectedTestDetail.student.kelas} | Tanggal Evaluasi:{" "}
                  {selectedTestDetail.type === "pretest"
                    ? selectedTestDetail.student.pretestDate || "-"
                    : selectedTestDetail.student.posttestDate || "-"}
                </p>
              </div>
              <button
                onClick={() => setSelectedTestDetail(null)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
                title="Tutup Modal"
              >
                ✕
              </button>
            </div>

            {/* Score & Accuracy Summary Card */}
            {(() => {
              const isPretest = selectedTestDetail.type === "pretest";
              const questions = isPretest ? PRETEST_QUESTIONS : POSTTEST_QUESTIONS;
              const rawAnswers = isPretest
                ? selectedTestDetail.student.pretestAnswers
                : selectedTestDetail.student.posttestAnswers;
              const scoreVal = isPretest
                ? selectedTestDetail.student.pretest
                : selectedTestDetail.student.posttest;

              let correctCount = 0;
              if (Array.isArray(rawAnswers)) {
                correctCount = rawAnswers.filter((a, i) => a === questions[i]?.jawaban).length;
              } else if (typeof scoreVal === "number") {
                correctCount = Math.round((scoreVal / 100) * questions.length);
              }
              const wrongCount = questions.length - correctCount;

              return (
                <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 flex items-center justify-between gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-['Fredoka'] font-black text-xl text-white shadow-md">
                      {scoreVal}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Skor Akhir Evaluasi
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {scoreVal >= 75
                          ? "Sangat Baik (Lulus Indikator)"
                          : "Perlu Pendalaman Materi"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>{correctCount} Benar</span>
                    </span>
                    <span className="bg-rose-950/80 border border-rose-500/40 text-rose-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <XCircle size={13} className="text-rose-400" />
                      <span>{wrongCount} Salah</span>
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Questions Breakdown List (Scrollable) */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[50vh]">
              {(() => {
                const isPretest = selectedTestDetail.type === "pretest";
                const questions = isPretest ? PRETEST_QUESTIONS : POSTTEST_QUESTIONS;
                const rawAnswers = isPretest
                  ? selectedTestDetail.student.pretestAnswers
                  : selectedTestDetail.student.posttestAnswers;
                const scoreVal = isPretest
                  ? selectedTestDetail.student.pretest
                  : selectedTestDetail.student.posttest;

                const hasRecordedAnswers = Array.isArray(rawAnswers) && rawAnswers.length > 0;

                if (!hasRecordedAnswers) {
                  return (
                    <div className="space-y-3">
                      <div className="bg-amber-950/50 border border-amber-600/50 rounded-xl p-3 text-amber-200 text-xs font-medium leading-relaxed">
                        ⚠️ <strong>Catatan:</strong> Siswa ini menyelesaikan kuis sebelum sistem perekaman butir
                        jawaban per-nomor diaktifkan (Skor tercatat:{" "}
                        <span className="font-bold text-white">{scoreVal}%</span>). Di bawah ini adalah daftar soal
                        dan kunci jawaban kuis sebagai referensi:
                      </div>

                      {questions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl space-y-2 text-xs"
                        >
                          <div className="font-bold text-amber-300">
                            Soal {idx + 1} dari {questions.length}
                          </div>
                          <p className="text-slate-200 leading-relaxed">{q.soal}</p>
                          <div className="bg-emerald-950/40 border border-emerald-600/40 p-2 rounded-lg text-emerald-200 text-[11px]">
                            <span className="font-bold text-emerald-300">Kunci Jawaban:</span> {q.opsi[q.jawaban]}
                          </div>
                          {q.pembahasan && (
                            <div className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2 rounded-lg">
                              💡 <strong>Pembahasan:</strong> {q.pembahasan}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }

                return questions.map((q, idx) => {
                  const studentAnsIdx = rawAnswers[idx];
                  const hasAnswered = studentAnsIdx !== null && studentAnsIdx !== undefined;
                  const isCorrect = hasAnswered && studentAnsIdx === q.jawaban;
                  const studentAnswerText = hasAnswered ? q.opsi[studentAnsIdx] : "Tidak Dijawab";
                  const correctAnswerText = q.opsi[q.jawaban];

                  return (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-xl border space-y-2.5 transition-all text-xs ${
                        isCorrect
                          ? "bg-slate-800/90 border-emerald-500/40"
                          : "bg-slate-800/90 border-rose-500/40"
                      }`}
                    >
                      {/* Question Header & Correct/Wrong Tag */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-2">
                        <span className="font-bold text-slate-300 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <span>Pertanyaan {idx + 1}</span>
                        </span>

                        {isCorrect ? (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                            <CheckCircle2 size={11} className="text-emerald-400" />
                            <span>Jawaban Benar (+10)</span>
                          </span>
                        ) : (
                          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                            <XCircle size={11} className="text-rose-400" />
                            <span>Jawaban Salah (0)</span>
                          </span>
                        )}
                      </div>

                      {/* Question Text */}
                      <p className="text-slate-100 font-medium leading-relaxed">{q.soal}</p>

                      {/* Answer Breakdown Box */}
                      <div className="space-y-1.5 pt-1">
                        {/* Student Choice */}
                        <div
                          className={`p-2 rounded-lg text-[11px] font-semibold flex items-start gap-2 ${
                            isCorrect
                              ? "bg-emerald-950/50 border border-emerald-600/40 text-emerald-200"
                              : "bg-rose-950/50 border border-rose-600/40 text-rose-200"
                          }`}
                        >
                          <span className="font-bold flex-shrink-0">
                            {isCorrect ? "✅ Jawaban Siswa:" : "❌ Jawaban Siswa:"}
                          </span>
                          <span>{studentAnswerText}</span>
                        </div>

                        {/* Show Correct Answer if Student was wrong */}
                        {!isCorrect && (
                          <div className="p-2 rounded-lg text-[11px] font-semibold bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-start gap-2">
                            <span className="font-bold text-emerald-400 flex-shrink-0">
                              💡 Kunci yang Benar:
                            </span>
                            <span>{correctAnswerText}</span>
                          </div>
                        )}

                        {/* Explanation */}
                        {q.pembahasan && (
                          <div className="text-[10px] text-slate-300 italic bg-slate-900/60 p-2 rounded-lg border border-slate-700/50 leading-relaxed">
                            <span className="font-bold text-amber-300 not-italic">📖 Pembahasan: </span>
                            {q.pembahasan}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-2 border-t border-slate-700 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                onClick={() =>
                  handleExportStudentTestPDF(
                    selectedTestDetail.student,
                    selectedTestDetail.type
                  )
                }
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-md flex items-center gap-1.5 transition-all"
                title="Cetak atau Unduh PDF Hasil Siswa Ini"
              >
                <Printer size={13} />
                <span>Cetak / Unduh Hasil PDF</span>
              </button>

              <button
                onClick={() => setSelectedTestDetail(null)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer shadow-md transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. Modal Popup Detail Refleksi Siswa */}
      {/* ========================================================================= */}
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
                const text =
                  mId === 1
                    ? selectedRefleksiStudent.refleksi1
                    : mId === 2
                    ? selectedRefleksiStudent.refleksi2
                    : selectedRefleksiStudent.refleksi3;
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

      {/* ========================================================================= */}
      {/* 3. Modal Unduh & Cetak Laporan PDF (Solusi Pasti Muncul di Semua Device) */}
      {/* ========================================================================= */}
      {pdfExportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-2xl">
              📄
            </div>

            <div className="space-y-1">
              <h3 className="font-['Fredoka'] font-bold text-lg text-emerald-400">
                Laporan PDF Berhasil Dibuat!
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {pdfExportModal.title}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {pdfExportModal.fileName}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() =>
                  triggerBrowserDownload(pdfExportModal.blobUrl, pdfExportModal.fileName)
                }
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <Download size={14} />
                <span>Unduh File PDF Sekarang</span>
              </button>

              <button
                onClick={() => window.open(pdfExportModal.blobUrl, "_blank")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <ExternalLink size={14} />
                <span>Buka / Cetak di Tab Baru</span>
              </button>

              {typeof navigator !== "undefined" && navigator.share && (
                <button
                  onClick={() => handleNativeShare(pdfExportModal)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-700 transition-all"
                >
                  <Share2 size={14} />
                  <span>Bagikan File PDF</span>
                </button>
              )}

              <button
                onClick={() => setPdfExportModal(null)}
                className="w-full bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-xl text-xs cursor-pointer transition-all mt-1"
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
