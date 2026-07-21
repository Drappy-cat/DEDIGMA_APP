import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Award, Download, FileText, RefreshCw } from "lucide-react";
import { MISSIONS } from "../data/missions";
import { ScreenHeader } from "../components/ScreenHeader";
import { Btn } from "../components/Btn";
import { SkyBg } from "../components/SkyBg";
import { useAudio } from "../contexts/AudioContext";

interface SertifikatScreenProps {
  studentName: string;
  missionScores: Record<number, number>;
  onBack: () => void;
}

type Orientation = "landscape" | "portrait";

export const SertifikatScreen: React.FC<SertifikatScreenProps> = ({
  studentName,
  missionScores,
  onBack
}) => {
  const { playNarrator, stopNarrator, playSFX } = useAudio();
  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [isGenerating, setIsGenerating] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const scoreValues = Object.values(missionScores);
  const avg = scoreValues.length > 0 ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) : 0;
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  useEffect(() => {
    playNarrator(
      `Ini adalah sertifikat kelulusan digitalmu, ${studentName}! Pilih orientasi sertifikat mendatar atau tegak, lalu ketuk tombol Simpan Sertifikat.`
    );
    return () => {
      stopNarrator();
    };
  }, []);

  const handleDownloadPdf = async () => {
    const el = certRef.current;
    if (!el) return;

    playSFX("click");
    setIsGenerating(true);

    try {
      // Small delay to ensure rendering completes
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Capture the element as canvas
      const canvas = await html2canvas(el, {
        scale: 2, // high quality
        useCORS: true, // handles external images
        allowTaint: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");

      // Set up PDF properties
      const isLandscape = orientation === "landscape";
      const pdfFormat = [297, 210]; // A4 size in mm
      const pdf = new jsPDF({
        orientation: isLandscape ? "landscape" : "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = isLandscape ? 297 : 210;
      const pdfHeight = isLandscape ? 210 : 297;

      // Draw the image onto the page fitting the A4 bounds
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Save the PDF
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
        backgroundImage: "url('/assets/bg-lobby.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <ScreenHeader title="Sertifikat Digital 🎓" onBack={onBack} />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center gap-4">
        {/* Orientation Toggle Options */}
        <div className="bg-white rounded-2xl shadow-md p-2.5 flex items-center gap-3 w-full max-w-sm border border-blue-100/40 select-none">
          <span className="font-['Fredoka'] font-semibold text-blue-800 text-sm flex-1 pl-1.5">
            Orientasi Sertifikat:
          </span>
          <div className="flex bg-blue-50 p-1 rounded-xl gap-1">
            <button
              onClick={() => {
                playSFX("click");
                setOrientation("landscape");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-['Fredoka'] font-bold transition-all cursor-pointer ${
                orientation === "landscape" ? "bg-blue-600 text-white shadow-sm" : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              Landscape
            </button>
            <button
              onClick={() => {
                playSFX("click");
                setOrientation("portrait");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-['Fredoka'] font-bold transition-all cursor-pointer ${
                orientation === "portrait" ? "bg-blue-600 text-white shadow-sm" : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              Portrait
            </button>
          </div>
        </div>

        {/* Certificate Container Wrapper */}
        <div className="w-full flex justify-center items-center flex-1 max-h-[60vh] md:max-h-[65vh]">
          {/* Certificate View Container (Forces layout sizes for canvas capture) */}
          <div className="shadow-2xl rounded-2xl overflow-hidden border-2 border-amber-300 bg-white max-w-full max-h-full aspect-auto flex justify-center items-center">
            {/* The element we convert to image */}
            <div
              ref={certRef}
              className={`bg-white border-[12px] border-amber-400 p-6 flex flex-col justify-between items-center text-center font-['Nunito'] relative flex-shrink-0`}
              style={{
                width: orientation === "landscape" ? "842px" : "595px",
                height: orientation === "landscape" ? "595px" : "842px"
              }}
            >
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-2 left-2 text-2xl opacity-40 select-none">🔍</div>
              <div className="absolute top-2 right-2 text-2xl opacity-40 select-none">🗺️</div>
              <div className="absolute bottom-2 left-2 text-2xl opacity-40 select-none">⭐</div>
              <div className="absolute bottom-2 right-2 text-2xl opacity-40 select-none">🏆</div>

              {/* Certificate Header Banner */}
              <div className="w-full bg-gradient-to-r from-blue-700 via-blue-800 to-blue-700 text-white py-4 px-6 rounded-xl shadow-md flex flex-col items-center">
                <p className="font-['Fredoka'] font-bold text-3xl tracking-widest text-yellow-300 drop-shadow-sm">DEDIGMA</p>
                <p className="text-blue-200 text-xs font-['Fredoka'] font-medium tracking-wide mt-0.5">
                  DETEKTIF DIGITAL BUDAYA MAGETAN
                </p>
              </div>

              {/* Core Text Body */}
              <div className="my-auto space-y-4 px-4 w-full">
                <div className="space-y-1">
                  <p className="text-gray-400 text-xs tracking-widest font-extrabold uppercase">Sertifikat Kelulusan</p>
                  <p className="text-gray-500 text-xs font-semibold">Diberikan kepada siswa berprestasi:</p>
                </div>

                <div className="border-b-4 border-double border-amber-400 pb-2 inline-block px-8 max-w-full">
                  <h2 className="font-['Fredoka'] font-bold text-3xl text-blue-700 drop-shadow-sm truncate">
                    {studentName}
                  </h2>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed max-w-xl mx-auto">
                  Telah berhasil menyelesaikan seluruh misi petualangan budaya dalam media pembelajaran interaktif{" "}
                  <strong>DEDIGMA (Detektif Digital Budaya Magetan)</strong> dan membuktikan kompetensi berpikir kritis,
                  literasi digital, serta kecintaan yang mendalam terhadap budaya lokal Magetan.
                </p>
              </div>

              {/* Badges and Scores Row */}
              <div
                className={`grid gap-4 w-full max-w-lg mb-4 ${
                  orientation === "landscape" ? "grid-cols-4 items-center" : "grid-cols-2"
                }`}
              >
                {MISSIONS.map((m) => (
                  <div key={m.id} className="bg-blue-50/70 border border-blue-100/40 rounded-xl p-2 flex flex-col items-center">
                    <span className="text-2xl filter drop-shadow select-none">{m.emoji}</span>
                    <p className="font-['Fredoka'] text-blue-700 text-[10px] font-bold mt-1 truncate max-w-full">
                      {m.name}
                    </p>
                    <p className="text-[10px] text-gray-500 font-semibold font-['Nunito']">
                      Skor: {missionScores[m.id] ?? 0}
                    </p>
                  </div>
                ))}

                {/* Avg Badge */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 flex flex-col items-center justify-center">
                  <span className="text-2xl filter drop-shadow select-none">🏆</span>
                  <p className="font-['Fredoka'] text-amber-700 text-[10px] font-bold mt-1">Rata-rata</p>
                  <p className="text-[10px] text-amber-600 font-bold">{avg}</p>
                </div>
              </div>

              {/* Signatures Footer Row */}
              <div className="w-full flex justify-between items-end px-4 mt-auto">
                <div className="text-left">
                  <p className="text-gray-400 text-[10px] font-semibold">{today}</p>
                  <p className="text-gray-500 text-[11px] font-bold border-t border-gray-200 pt-1 mt-1">Tanggal</p>
                </div>

                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200 shadow-sm">
                  <span className="text-lg">🏅</span>
                  <span className="text-xs font-['Fredoka'] font-bold text-amber-800">Detektif Resmi</span>
                </div>

                <div className="text-right">
                  <div className="text-2xl filter drop-shadow select-none">👩‍🏫</div>
                  <p className="text-gray-500 text-[11px] font-bold border-t border-gray-200 pt-1 mt-1">Pengajar Kelas</p>
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
