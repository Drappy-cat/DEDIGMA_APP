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
      // A4 Landscape in pixels at 150dpi
      const W = 1122;
      const H = 794;

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

      // 4. Draw student name centered at ~43% height
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#1b3d82";
      ctx.font = `bold ${Math.round(H * 0.075)}px 'Fredoka', 'Nunito', sans-serif`;
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 8;
      ctx.fillText(studentName, W / 2, H * 0.445, W * 0.75);
      ctx.restore();

      // 5. Draw description text
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#4a3728";
      ctx.font = `700 ${Math.round(H * 0.027)}px 'Nunito', sans-serif`;
      ctx.fillText(
        "ATAS KEBERHASILANNYA MENYELESAIKAN SELURUH MISI DALAM PETUALANGAN DEDIGMA.",
        W / 2,
        H * 0.72,
        W * 0.65
      );
      ctx.restore();

      // 6. Draw date
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#888888";
      ctx.font = `italic ${Math.round(H * 0.022)}px 'Nunito', sans-serif`;
      ctx.fillText(`yang dilaksanakan pada tanggal ${today}.`, W / 2, H * 0.755);
      ctx.restore();

      // 7. Draw Pretest card (left)
      const cardW = 200;
      const cardH = 90;
      const cardY = H * 0.81;
      const pretestX = W / 2 - cardW - 20;
      const posttestX = W / 2 + 20;

      const drawScoreCard = (x: number, label: string, score: number, color: string) => {
        ctx.save();
        ctx.fillStyle = "#f8f3e6";
        ctx.strokeStyle = "#d9c5a3";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x, cardY, cardW, cardH, 14);
        ctx.fill();
        ctx.stroke();

        // Inner card
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.strokeStyle = "#c2aa84";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x + 5, cardY + 5, cardW - 10, cardH - 10, 10);
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = "#7e371b";
        ctx.font = `800 ${Math.round(H * 0.022)}px 'Fredoka', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(label.toUpperCase(), x + cardW / 2, cardY + 28);

        // Divider
        ctx.strokeStyle = "#d9c5a3";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 20, cardY + 38);
        ctx.lineTo(x + cardW - 20, cardY + 38);
        ctx.stroke();

        // Score
        ctx.fillStyle = color;
        ctx.font = `800 ${Math.round(H * 0.065)}px 'Fredoka', sans-serif`;
        ctx.fillText(String(score), x + cardW / 2, cardY + 78);
        ctx.restore();
      };

      drawScoreCard(pretestX, "Pretest", pretestScore, "#1b3d82");
      drawScoreCard(posttestX, "Posttest", posttestScore, "#366635");

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
                
                {/* Student Name (Positioned over the purple line) */}
                <div className="absolute top-[42.5%] left-1/2 -translate-x-1/2 w-[80%] text-center">
                  <h2 className="font-['Fredoka'] font-bold text-5xl text-[#1b3d82] drop-shadow-md capitalize truncate">
                    {studentName}
                  </h2>
                </div>

                {/* Content Below Name (Centered) */}
                <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 flex flex-col items-center w-full">
                  
                  {/* Description */}
                  <p className="text-[#4a3728] font-bold text-sm leading-relaxed max-w-xl px-4 uppercase text-center mb-1">
                    ATAS KEBERHASILANNYA MENYELESAIKAN SELURUH MISI DALAM PETUALANGAN DEDIGMA.
                  </p>
                  <p className="text-gray-500 font-medium text-xs mt-0 italic mb-6">
                    yang dilaksanakan pada tanggal {today}.
                  </p>

                  {/* Scores Cards (Pretest & Posttest) */}
                  <div className="flex gap-10">
                    <div className="bg-[#f8f3e6] border-2 border-[#d9c5a3] rounded-2xl p-1 shadow-lg w-[160px]">
                      <div className="border border-[#c2aa84] rounded-xl py-3 px-4 flex flex-col items-center justify-center bg-white/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100/40 rounded-full blur-xl -mr-8 -mt-8"></div>
                        <p className="font-['Fredoka'] font-extrabold text-[#7e371b] text-xs uppercase tracking-widest relative z-10">Pretest</p>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d9c5a3] to-transparent my-1.5 relative z-10"></div>
                        <p className="font-['Fredoka'] font-extrabold text-4xl text-[#1b3d82] relative z-10 drop-shadow-sm">{pretestScore}</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#f8f3e6] border-2 border-[#d9c5a3] rounded-2xl p-1 shadow-lg w-[160px]">
                      <div className="border border-[#c2aa84] rounded-xl py-3 px-4 flex flex-col items-center justify-center bg-white/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-green-100/40 rounded-full blur-xl -mr-8 -mt-8"></div>
                        <p className="font-['Fredoka'] font-extrabold text-[#7e371b] text-xs uppercase tracking-widest relative z-10">Posttest</p>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d9c5a3] to-transparent my-1.5 relative z-10"></div>
                        <p className="font-['Fredoka'] font-extrabold text-4xl text-[#366635] relative z-10 drop-shadow-sm">{posttestScore}</p>
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
