import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
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

  const handleDownloadPdf = async () => {
    const el = certRef.current;
    if (!el) return;

    setIsGenerating(true);

    try {
      // Small delay to ensure rendering completes
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(el, {
        scale: 2, 
        useCORS: true, 
        allowTaint: true,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

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
        <div className="w-full flex justify-center items-center flex-1 max-h-[60vh] md:max-h-[65vh]">
          
          <div className="shadow-2xl rounded-sm overflow-hidden bg-white max-w-full max-h-full aspect-[1.414] flex justify-center items-center relative group">
            {/* The element we convert to image (A4 Landscape ratio) */}
            <div
              ref={certRef}
              className="relative flex-shrink-0 flex flex-col justify-center items-center text-center font-['Nunito']"
              style={{
                width: "842px",
                height: "595px",
                backgroundImage: "url('/assets/bg-sertifikat.svg')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            >
              {/* Fallback border if no image is uploaded yet */}
              <div className="absolute inset-0 border-[12px] border-[#1b3d82] pointer-events-none z-0 opacity-10" />

              {/* Dynamic Content */}
              <div className="relative z-10 w-full px-20 flex flex-col items-center justify-center h-full">
                
                {/* Certificate Title Area */}
                <div className="mt-8 mb-6">
                  <h1 className="font-['Fredoka'] font-extrabold text-5xl text-[#1b3d82] tracking-widest drop-shadow-sm">
                    SERTIFIKAT
                  </h1>
                  <p className="text-[#7e371b] font-bold text-sm tracking-[0.2em] mt-2">
                    DETEKTIF DIGITAL BUDAYA MAGETAN
                  </p>
                </div>

                {/* Recipient Area */}
                <p className="text-gray-600 font-semibold text-lg mb-4">Diberikan Kepada:</p>
                
                <div className="border-b-2 border-[#7e371b] pb-2 px-12 mb-6 min-w-[60%]">
                  <h2 className="font-['Fredoka'] font-bold text-4xl text-[#1b3d82] drop-shadow-sm capitalize">
                    {studentName}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-[#4a3728] font-bold text-[15px] leading-relaxed max-w-2xl px-4 uppercase">
                  ATAS KEBERHASILANNYA MENYELESAIKAN SELURUH MISI DALAM PETUALANGAN DEDIGMA.
                </p>
                <p className="text-gray-500 font-medium text-sm mt-2 italic">
                  yang dilaksanakan pada tanggal {today}.
                </p>

                {/* Scores Cards (Pretest & Posttest) */}
                <div className="flex gap-8 mt-10">
                  <div className="bg-white/80 backdrop-blur-sm border-2 border-[#1b3d82] rounded-xl py-3 px-8 shadow-sm flex flex-col items-center min-w-[140px]">
                    <p className="font-['Fredoka'] font-bold text-[#7e371b] text-xs uppercase tracking-wide">Pretest</p>
                    <p className="font-['Fredoka'] font-extrabold text-3xl text-[#1b3d82] mt-1">{pretestScore}</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border-2 border-[#366635] rounded-xl py-3 px-8 shadow-sm flex flex-col items-center min-w-[140px]">
                    <p className="font-['Fredoka'] font-bold text-[#7e371b] text-xs uppercase tracking-wide">Posttest</p>
                    <p className="font-['Fredoka'] font-extrabold text-3xl text-[#366635] mt-1">{posttestScore}</p>
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
