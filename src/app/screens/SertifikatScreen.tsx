import React, { useRef, useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Download, RefreshCw } from "lucide-react";
import { ScreenHeader } from "../components/ScreenHeader";
import { Btn } from "../components/Btn";
import { useAudio } from "../contexts/AudioContext";

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
        const scaleX = clientWidth / 842;
        const scaleY = clientHeight / 595;
        // Set scale so it fits inside the container (limit max scale to 1)
        setScale(Math.min(scaleX, scaleY, 1));
      }
    };

    // Small delay to ensure layout is ready
    setTimeout(updateScale, 100);
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const handleDownloadPdf = async () => {
    setIsGenerating(true);

    try {
      // A4 Landscape at 300dpi for sharp print quality (2x)
      const W = 2480;
      const H = 1754;

      // 1. Load the SVG background as an Image
      const svgImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `/assets/bg-sertifikat.svg?v=${Date.now()}`;
      });

      // 2. Create an offscreen canvas
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // 3. Draw SVG background
      ctx.drawImage(svgImg, 0, 0, W, H);

      // Scale factor: canvas is 2480px wide, HTML preview is 842px wide → 2.946x
      // All sizes are calculated as: HTML_px * 2.946 / H for H-relative values
      const SCALE = W / 842; // = 2.946

      // 4. Draw student name — Glossy 3D style
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const nameY = H * 0.485;
      const fontSp = Math.round(36 * SCALE);
      ctx.font = `900 ${fontSp}px 'Fredoka', 'Nunito', sans-serif`;

      // 3D Depth Layer (dark bronze extrusion shadow for high contrast)
      const depth = Math.round(3 * (SCALE / 2.946));
      ctx.fillStyle = "#3d2400";
      for (let i = depth; i > 0; i--) {
        ctx.fillText(studentName, W / 2, nameY + i, W * 0.65);
      }

      // Linear Gradient Fill (Rich Golden Yellow)
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

      // Dark thin outline stroke to make yellow text pop crystal clear
      ctx.strokeStyle = "#3d2400";
      ctx.lineWidth = Math.round(1 * SCALE);
      ctx.strokeText(studentName, W / 2, nameY, W * 0.65);

      ctx.restore();

      // 5. Draw description text — text-xs = 12px in HTML
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

      // 6. Draw date — text-[11px] in HTML
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#888888";
      ctx.font = `italic ${Math.round(11 * SCALE)}px 'Nunito', sans-serif`;
      ctx.fillText(`yang dilaksanakan pada tanggal ${today}.`, W / 2, H * 0.645);
      ctx.restore();

      // 7. Circular medal badges — w-20 h-20 = 80px in HTML → R = 40 * SCALE
      const R = Math.round(40 * SCALE); // medal radius in canvas pixels
      const medalY = H * 0.72;
      const pretestCX = W / 2 - R - Math.round(16 * SCALE);
      const posttestCX = W / 2 + R + Math.round(16 * SCALE);

      const drawMedal = (cx: number, label: string, score: number, darkColor: string, lightColor: string) => {
        ctx.save();

        // Outer gold ring
        const gradient = ctx.createRadialGradient(cx, medalY, R * 0.5, cx, medalY, R);
        gradient.addColorStop(0, "#f5e6a3");
        gradient.addColorStop(0.5, "#d4a82a");
        gradient.addColorStop(1, "#a07820");
        ctx.beginPath();
        ctx.arc(cx, medalY, R, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Inner filled circle
        const innerGrad = ctx.createRadialGradient(cx - R * 0.2, medalY - R * 0.2, R * 0.05, cx, medalY, R * 0.82);
        innerGrad.addColorStop(0, lightColor);
        innerGrad.addColorStop(1, darkColor);
        ctx.beginPath();
        ctx.arc(cx, medalY, R * 0.82, 0, Math.PI * 2);
        ctx.fillStyle = innerGrad;
        ctx.fill();

        // Label text — text-[8px] in HTML
        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.font = `900 ${Math.round(8 * SCALE)}px 'Fredoka', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label.toUpperCase(), cx, medalY - R * 0.32);

        // Score text — text-2xl = 24px in HTML
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = Math.round(4 * SCALE);
        ctx.font = `900 ${Math.round(24 * SCALE)}px 'Fredoka', sans-serif`;
        ctx.fillText(String(score), cx, medalY + R * 0.22);

        // Bottom star ornament — text-[8px]
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.font = `${Math.round(8 * SCALE)}px serif`;
        ctx.fillText("★", cx, medalY + R * 0.70);

        ctx.restore();
      };

      drawMedal(pretestCX, "Pretest", pretestScore, "#1b3d82", "#3a65c0");
      drawMedal(posttestCX, "Posttest", posttestScore, "#1d5c1d", "#368a36");

      // 8. Convert canvas to PDF
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(`Sertifikat_DEDIGMA_${studentName.replace(/\s+/g, "_")}.pdf`);
      playSFX("badge");
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Terjadi kesalahan saat mengunduh PDF. Silakan coba kembali.");
    } finally {
      setIsGenerating(false);
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

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center gap-4">
        {/* Certificate Container Wrapper */}
        <div ref={containerRef} className="w-full flex justify-center items-center flex-1 max-h-[60vh] md:max-h-[65vh] overflow-hidden">
          
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
                        <span className="font-['Fredoka'] text-white text-2xl font-black leading-tight drop-shadow">{pretestScore}</span>
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
                        <span className="font-['Fredoka'] text-white text-2xl font-black leading-tight drop-shadow">{posttestScore}</span>
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
        <div className="w-full max-w-sm space-y-2 mt-auto">
          <Btn
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            variant="amber"
            className="w-full text-lg py-3.5 justify-center shadow-lg font-bold"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={20} className="animate-spin" /> Menyiapkan PDF...
              </>
            ) : (
              <>
                <Download size={20} /> Simpan Sertifikat (.PDF)
              </>
            )}
          </Btn>
          <div className="flex justify-center">
            <Btn onClick={onBack} variant="kembali" disabled={isGenerating} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SertifikatScreen;
