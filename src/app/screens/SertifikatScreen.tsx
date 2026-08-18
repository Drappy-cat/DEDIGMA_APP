import React, { useRef, useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Download, RefreshCw, FileText, Image as ImageIcon, Share2, X } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
import { Btn } from "../components/Btn";
import { useAudio } from "../contexts/AudioContext";
import { toast } from "sonner";

interface SertifikatScreenProps {
  studentName: string;
  missionScores: Record<number, number>;
  pretestScore?: number;
  posttestScore?: number;
  onBack: () => void;
}

export const SertifikatScreen: React.FC<SertifikatScreenProps> = ({
  studentName,
  missionScores,
  pretestScore = 0,
  posttestScore = 0,
  onBack
}) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [isGenerating, setIsGenerating] = useState(false);
  const [scale, setScale] = useState(1);
  const [showImageModal, setShowImageModal] = useState<{ pngUrl: string; pdfBlob?: Blob } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const certRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  useEffect(() => {
    playNarrator(
      `Ini adalah sertifikat kelulusan digitalmu, ${studentName}! Nilai Pretest dan Posttest-mu juga tercatat di sini. Ketuk tombol Simpan Sertifikat untuk mengunduhnya.`
    );
    return () => {
      stopNarrator();
    };
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        // Add padding offset so the cert doesn't touch edges
        const availW = clientWidth - 16;
        const availH = clientHeight - 16;
        const scaleX = availW / 842;
        const scaleY = availH / 595;
        setScale(Math.min(scaleX, scaleY, 1));
      }
    };

    // Delay to ensure layout is painted after orientation change
    let timeout: ReturnType<typeof setTimeout>;
    const debouncedUpdate = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateScale, 150);
    };

    debouncedUpdate();
    window.addEventListener("resize", debouncedUpdate);
    window.addEventListener("orientationchange", debouncedUpdate);
    // Also watch for screen.orientation API (modern browsers)
    screen.orientation?.addEventListener?.("change", debouncedUpdate);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", debouncedUpdate);
      window.removeEventListener("orientationchange", debouncedUpdate);
      screen.orientation?.removeEventListener?.("change", debouncedUpdate);
    };
  }, []);

  // Helper to trigger direct browser file download
  const triggerBrowserDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 200);
  };

  const generateCertificateCanvas = async () => {
    const W = 2480;
    const H = 1754;

    const svgImg = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = `/assets/bg-sertifikat.svg?v=${Date.now()}`;
    });

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(svgImg, 0, 0, W, H);
    const SCALE = W / 842;

    // Student Name
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const nameY = H * 0.485;
    const fontSp = Math.round(36 * SCALE);
    ctx.font = `900 ${fontSp}px 'Fredoka', 'Nunito', sans-serif`;

    const depth = Math.round(3 * (SCALE / 2.946));
    ctx.fillStyle = "#3d2400";
    for (let i = depth; i > 0; i--) {
      ctx.fillText(studentName, W / 2, nameY + i, W * 0.65);
    }

    const textGrad = ctx.createLinearGradient(0, nameY - fontSp / 2, 0, nameY + fontSp / 2);
    textGrad.addColorStop(0, "#fff7ad");
    textGrad.addColorStop(0.35, "#ffd700");
    textGrad.addColorStop(0.7, "#d49b00");
    textGrad.addColorStop(1, "#996d00");

    ctx.fillStyle = textGrad;
    ctx.shadowColor = "rgba(61, 36, 0, 0.5)";
    ctx.shadowBlur = Math.round(6 * SCALE);
    ctx.shadowOffsetY = Math.round(3 * SCALE);
    ctx.fillText(studentName, W / 2, nameY, W * 0.65);

    ctx.strokeStyle = "#3d2400";
    ctx.lineWidth = Math.round(1 * SCALE);
    ctx.strokeText(studentName, W / 2, nameY, W * 0.65);
    ctx.restore();

    // Description text
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#4a3728";
    ctx.font = `700 ${Math.round(12 * SCALE)}px 'Nunito', sans-serif`;
    ctx.fillText(
      "ATAS KEBERHASILANNYA MENYELESAIKAN SELURUH MISI DALAM PETUALANGAN DEDIGMA.",
      W / 2,
      H * 0.61,
      W * 0.60
    );
    ctx.restore();

    // Date
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#888888";
    ctx.font = `italic ${Math.round(11 * SCALE)}px 'Nunito', sans-serif`;
    ctx.fillText(`yang dilaksanakan pada tanggal ${today}.`, W / 2, H * 0.645);
    ctx.restore();

    // Medal Badges
    const R = Math.round(40 * SCALE);
    const medalY = H * 0.72;
    const pretestCX = W / 2 - R - Math.round(16 * SCALE);
    const posttestCX = W / 2 + R + Math.round(16 * SCALE);

    const drawMedal = (cx: number, label: string, score: number, darkColor: string, lightColor: string) => {
      ctx.save();

      const gradient = ctx.createRadialGradient(cx, medalY, R * 0.5, cx, medalY, R);
      gradient.addColorStop(0, "#f5e6a3");
      gradient.addColorStop(0.5, "#d4a82a");
      gradient.addColorStop(1, "#a07820");
      ctx.beginPath();
      ctx.arc(cx, medalY, R, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      const innerGrad = ctx.createRadialGradient(cx - R * 0.2, medalY - R * 0.2, R * 0.05, cx, medalY, R * 0.82);
      innerGrad.addColorStop(0, lightColor);
      innerGrad.addColorStop(1, darkColor);
      ctx.beginPath();
      ctx.arc(cx, medalY, R * 0.82, 0, Math.PI * 2);
      ctx.fillStyle = innerGrad;
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.font = `900 ${Math.round(8 * SCALE)}px 'Fredoka', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label.toUpperCase(), cx, medalY - R * 0.32);

      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = Math.round(4 * SCALE);
      ctx.font = `900 ${Math.round(24 * SCALE)}px 'Fredoka', sans-serif`;
      ctx.fillText(String(score), cx, medalY + R * 0.22);

      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = `${Math.round(8 * SCALE)}px serif`;
      ctx.fillText("★", cx, medalY + R * 0.70);

      ctx.restore();
    };

    drawMedal(pretestCX, "Pretest", pretestScore ?? 0, "#1b3d82", "#3a65c0");
    drawMedal(posttestCX, "Posttest", posttestScore ?? 0, "#1d5c1d", "#368a36");

    return canvas;
  };

  const handleDownloadPdf = async () => {
    setIsGenerating(true);

    try {
      const canvas = await generateCertificateCanvas();
      const imgData = canvas.toDataURL("image/png", 1.0);
      const safeName = studentName.trim().replace(/\s+/g, "_") || "Siswa";
      const fileName = `Sertifikat_DEDIGMA_${safeName}.pdf`;
      const pngName = `Sertifikat_DEDIGMA_${safeName}.png`;

      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      const pdfBlob = pdf.output("blob");

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // Trigger standard PDF download
      pdf.save(fileName);
      playSFX("badge");
      toast.success("Sertifikat berhasil diunduh!");

      // On mobile, also display the modal with direct save & share options so users have 100% guarantee
      if (isMobile) {
        setShowImageModal({ pngUrl: imgData, pdfBlob });
      }
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast.error("Terjadi kesalahan saat mengunduh sertifikat.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPng = (pngUrl: string) => {
    const safeName = studentName.trim().replace(/\s+/g, "_") || "Siswa";
    triggerBrowserDownload(pngUrl, `Sertifikat_DEDIGMA_${safeName}.png`);
    toast.success("Gambar PNG berhasil diunduh!");
  };

  const handleDownloadPdfBlob = (pdfBlob?: Blob) => {
    if (!pdfBlob) return;
    const safeName = studentName.trim().replace(/\s+/g, "_") || "Siswa";
    const blobUrl = URL.createObjectURL(pdfBlob);
    triggerBrowserDownload(blobUrl, `Sertifikat_DEDIGMA_${safeName}.pdf`);
    toast.success("File PDF berhasil diunduh!");
  };

  const handleNativeShare = async (pngUrl: string, pdfBlob?: Blob) => {
    const safeName = studentName.trim().replace(/\s+/g, "_") || "Siswa";
    try {
      if (navigator.share) {
        if (pdfBlob && navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], `Sertifikat_${safeName}.pdf`, { type: "application/pdf" })] })) {
          const file = new File([pdfBlob], `Sertifikat_DEDIGMA_${safeName}.pdf`, { type: "application/pdf" });
          await navigator.share({
            title: "Sertifikat Kelulusan DEDIGMA",
            text: `Selamat kepada ${studentName} atas kelulusan Petualangan Budaya DEDIGMA!`,
            files: [file]
          });
          return;
        }

        // Fallback share URL/text
        await navigator.share({
          title: "Sertifikat DEDIGMA",
          text: `Sertifikat Kelulusan DEDIGMA - ${studentName}`
        });
      } else {
        toast.info("Fitur berbagi tidak didukung di browser ini. Gunakan tombol unduh di atas.");
      }
    } catch (e) {
      console.log("Share cancelled or not supported", e);
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        backgroundImage: "url('/assets/bg-lobby.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <ScreenHeader title="Sertifikat Digital 🎓" onBack={onBack} />

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 flex flex-col items-center gap-2 sm:gap-4">
        {/* Certificate Container Wrapper */}
        <div ref={containerRef} className="w-full flex justify-center items-center flex-1 min-h-0 overflow-hidden">
          
          <div 
            className="shadow-2xl rounded-sm overflow-hidden bg-white flex justify-center items-center relative group origin-center transition-transform duration-300"
            style={{ 
              width: "842px", 
              height: "595px",
              transform: `scale(${scale})`
            }}
          >
            {/* The element we convert to image (A4 Landscape ratio) */}
            <div
              ref={certRef}
              className="relative flex-shrink-0 flex flex-col justify-center items-center text-center font-['Nunito'] w-full h-full overflow-hidden"
            >
              {/* Background Image Layer */}
              <img 
                src="/assets/bg-sertifikat.svg" 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                crossOrigin="anonymous"
              />

              {/* Fallback border if no image is uploaded yet */}
              <div className="absolute inset-0 border-[12px] border-[#1b3d82] pointer-events-none z-0 opacity-10" />

              {/* Dynamic Content */}
              <div className="relative z-10 w-full px-20 flex flex-col items-center justify-center h-full">
                
                {/* Student Name (Glossy 3D Style) */}
                <div className="absolute top-[48.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] text-center">
                  <h2 
                    className="font-['Fredoka'] font-black text-4xl capitalize truncate tracking-wide py-1"
                    style={{
                      background: "linear-gradient(180deg, #fff7ad 0%, #ffd700 35%, #d49b00 70%, #996d00 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 2px 0px #3d2400) drop-shadow(0 3px 6px rgba(61, 36, 0, 0.5))"
                    }}
                  >
                    {studentName}
                  </h2>
                </div>

                {/* Content Below Name (Centered) */}
                <div className="absolute bottom-[16%] left-1/2 -translate-x-1/2 flex flex-col items-center w-full">
                  
                  {/* Description */}
                  <p className="text-[#4a3728] font-bold text-xs leading-relaxed max-w-xl px-4 uppercase text-center mb-0.5">
                    ATAS KEBERHASILANNYA MENYELESAIKAN SELURUH MISI DALAM PETUALANGAN DEDIGMA.
                  </p>
                  <p className="text-gray-500 font-medium text-[11px] mt-0 italic mb-4">
                    yang dilaksanakan pada tanggal {today}.
                  </p>

                  {/* Scores — Circular Medal Badges */}
                  <div className="flex gap-8 mt-2">
                    {/* Pretest Medal */}
                    <div className="relative flex flex-col items-center">
                      <div
                        className="w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg"
                        style={{
                          background: "radial-gradient(circle at 35% 35%, #3a65c0, #1b3d82)",
                          border: "4px solid #d4a82a",
                          boxShadow: "0 0 0 2px #a07820, 0 6px 18px rgba(27,61,130,0.35)"
                        }}
                      >
                        <span className="font-['Fredoka'] text-white text-[8px] font-black uppercase tracking-widest leading-none mt-1">Pretest</span>
                        <span className="font-['Fredoka'] text-white text-2xl font-black leading-tight drop-shadow">{pretestScore ?? 0}</span>
                        <span className="text-yellow-200 text-[8px] leading-none">★</span>
                      </div>
                    </div>

                    {/* Posttest Medal */}
                    <div className="relative flex flex-col items-center">
                      <div
                        className="w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg"
                        style={{
                          background: "radial-gradient(circle at 35% 35%, #368a36, #1d5c1d)",
                          border: "4px solid #d4a82a",
                          boxShadow: "0 0 0 2px #a07820, 0 6px 18px rgba(29,92,29,0.35)"
                        }}
                      >
                        <span className="font-['Fredoka'] text-white text-[8px] font-black uppercase tracking-widest leading-none mt-1">Posttest</span>
                        <span className="font-['Fredoka'] text-white text-2xl font-black leading-tight drop-shadow">{posttestScore ?? 0}</span>
                        <span className="text-yellow-200 text-[8px] leading-none">★</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Buttons Action Bar */}
        <div className="w-full max-w-sm space-y-1.5 sm:space-y-2 mt-auto pb-1 flex-shrink-0">
          <Btn
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            variant="amber"
            className="w-full text-sm sm:text-lg py-2.5 sm:py-3.5 justify-center shadow-lg font-bold"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Menyiapkan...
              </>
            ) : (
              <>
                <Download size={18} /> Simpan Sertifikat
              </>
            )}
          </Btn>
          <div className="flex justify-center">
            <Btn onClick={onBack} variant="kembali" disabled={isGenerating} />
          </div>
        </div>
      </div>

      {/* Full Screen Action Modal for Mobile Users */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex flex-col items-center justify-center p-3 sm:p-6 select-none overflow-y-auto">
          <div className="bg-[#1e293b] border border-white/20 rounded-3xl p-4 sm:p-6 w-full max-w-lg shadow-2xl flex flex-col items-center text-center space-y-4">
            
            {/* Header */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-['Fredoka'] font-extrabold text-base sm:text-lg">
                <span>🎓</span>
                <span>Sertifikat Berhasil Dibuat!</span>
              </div>
              <button
                onClick={() => setShowImageModal(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview Image */}
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 shadow-lg bg-white">
              <img
                src={showImageModal.pngUrl}
                alt="Sertifikat DEDIGMA"
                className="w-full h-auto object-contain max-h-[35vh]"
              />
            </div>

            <p className="text-slate-300 font-['Nunito'] text-xs sm:text-sm">
              Sertifikat telah otomatis diunduh ke HP Anda. Jika belum tersimpan, pilih salah satu opsi di bawah:
            </p>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
              <button
                onClick={() => handleDownloadPdfBlob(showImageModal.pdfBlob)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-['Fredoka'] font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <FileText size={16} />
                <span>Unduh File PDF</span>
              </button>

              <button
                onClick={() => handleDownloadPng(showImageModal.pngUrl)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-['Fredoka'] font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <ImageIcon size={16} />
                <span>Simpan Gambar PNG</span>
              </button>

              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={() => handleNativeShare(showImageModal.pngUrl, showImageModal.pdfBlob)}
                  className="sm:col-span-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-['Fredoka'] font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <Share2 size={16} />
                  <span>Simpan ke File / Bagikan (Share)</span>
                </button>
              )}
            </div>

            {/* Mobile Long Press Hint */}
            <p className="text-[11px] text-slate-400 font-medium italic">
              💡 Tips: Anda juga dapat menekan & menahan gambar di atas lalu pilih <b>"Download Image"</b>.
            </p>

            <button
              onClick={() => setShowImageModal(null)}
              className="text-xs text-slate-400 hover:text-white underline pt-1 cursor-pointer"
            >
              Kembali ke Aplikasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SertifikatScreen;
