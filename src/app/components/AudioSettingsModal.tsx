import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Volume2, VolumeX, Music, Mic, Bell, Settings, Info } from "lucide-react";
import { useAudio } from "../contexts/AudioContext";

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfil?: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose, onOpenProfil }) => {
  const {
    audioEnabled,
    bgmEnabled,
    sfxEnabled,
    narratorEnabled,
    bgmVolume,
    sfxVolume,
    toggleAudio,
    toggleBGM,
    toggleSFX,
    toggleNarrator,
    setBgmVolume,
    setSfxVolume,
    playSFX
  } = useAudio();

  const [activeTab, setActiveTab] = useState<"audio" | "about">("audio");

  if (!isOpen) return null;

  const handleClose = () => {
    playSFX("click");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm font-['Nunito'] select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-gradient-to-b from-[#3b1e0a] via-[#4a270f] to-[#3b1e0a] border-4 border-[#8c4f27] text-[#f4ecd5] rounded-[2rem] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.85)] w-full max-w-sm relative space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#7a3d16] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="bg-[#572410] p-2 rounded-2xl border border-[#965529] text-amber-300 shadow-inner">
                <Settings size={20} />
              </span>
              <div>
                <h3 className="font-['Fredoka'] font-extrabold text-lg text-amber-300 leading-tight tracking-wide drop-shadow">
                  Pengaturan & Informasi
                </h3>
                <p className="text-[11px] text-[#cbb293] font-semibold">DEDIGMA — Detektif Digital</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-[#572410] hover:bg-[#733218] border border-[#965529] flex items-center justify-center text-[#d9c5a3] hover:text-white transition-colors cursor-pointer shadow-sm"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#261205] p-1 rounded-2xl border border-[#6b3615] relative">
            <button
              type="button"
              onClick={() => {
                playSFX("click");
                setActiveTab("audio");
              }}
              className={`py-2 rounded-xl font-['Fredoka'] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer relative z-10 ${
                activeTab === "audio" ? "text-[#3b1e0a]" : "text-[#cbb293] hover:text-white"
              }`}
            >
              <Volume2 size={14} /> Suara & Audio
              {activeTab === "audio" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl -z-10 shadow-md border border-amber-300"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                playSFX("click");
                setActiveTab("about");
              }}
              className={`py-2 rounded-xl font-['Fredoka'] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer relative z-10 ${
                activeTab === "about" ? "text-[#3b1e0a]" : "text-[#cbb293] hover:text-white"
              }`}
            >
              <Info size={14} /> Tentang Game
              {activeTab === "about" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl -z-10 shadow-md border border-amber-300"
                />
              )}
            </button>
          </div>

          {/* SLIDING TAB CONTENT TRACK */}
          <div className="overflow-hidden relative w-full">
            <motion.div
              className="flex w-[200%]"
              animate={{ x: activeTab === "audio" ? "0%" : "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* TAB 1: AUDIO SETTINGS */}
              <div className="w-1/2 pr-1 space-y-3 max-h-[360px] overflow-y-auto [scrollbar-width:none]">
                {/* Master Audio Toggle */}
                <div className="bg-[#2a1306]/90 rounded-2xl p-3 border border-[#6b3615] flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-2.5">
                    {audioEnabled ? <Volume2 size={20} className="text-emerald-400" /> : <VolumeX size={20} className="text-rose-400" />}
                    <div>
                      <p className="font-['Fredoka'] font-bold text-xs text-amber-200">Master Suara</p>
                      <p className="text-[10px] text-[#bda485]">Aktifkan/Matikan seluruh audio</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playSFX("click");
                      toggleAudio();
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer border border-[#6b3615] ${
                      audioEnabled ? "bg-[#366635]" : "bg-[#4a2e1d]"
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`w-5 h-5 rounded-full bg-[#f4ecd5] shadow-md ${
                        audioEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* BGM Controls */}
                <div className={`space-y-2 p-3 rounded-2xl border transition-all ${
                  bgmEnabled && audioEnabled ? "bg-[#361a0a]/90 border-amber-500/40" : "bg-[#2a1306]/40 border-[#4a2e1d] opacity-60"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music size={16} className="text-amber-400" />
                      <span className="font-['Fredoka'] font-semibold text-xs text-amber-200">Musik Latar (BGM)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playSFX("click");
                        toggleBGM();
                      }}
                      disabled={!audioEnabled}
                      className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 cursor-pointer border border-[#6b3615] ${
                        bgmEnabled && audioEnabled ? "bg-[#df9d3b]" : "bg-[#4a2e1d]"
                      }`}
                    >
                      <motion.div
                        layout
                        className={`w-4.5 h-4.5 rounded-full bg-[#f4ecd5] shadow-md ${
                          bgmEnabled && audioEnabled ? "translate-x-4.5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {bgmEnabled && audioEnabled && (
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-[10px] text-[#cbb293] font-semibold w-10">Volume</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={bgmVolume}
                        onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                        className="flex-1 accent-amber-400 h-1.5 bg-[#1f0d04] rounded-lg cursor-pointer"
                      />
                      <span className="text-[10px] text-amber-300 font-bold w-6 text-right">
                        {Math.round(bgmVolume * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* SFX Controls */}
                <div className={`space-y-2 p-3 rounded-2xl border transition-all ${
                  sfxEnabled && audioEnabled ? "bg-[#361a0a]/90 border-amber-500/40" : "bg-[#2a1306]/40 border-[#4a2e1d] opacity-60"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-amber-400" />
                      <span className="font-['Fredoka'] font-semibold text-xs text-amber-200">Efek Suara (SFX)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playSFX("click");
                        toggleSFX();
                      }}
                      disabled={!audioEnabled}
                      className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 cursor-pointer border border-[#6b3615] ${
                        sfxEnabled && audioEnabled ? "bg-[#df9d3b]" : "bg-[#4a2e1d]"
                      }`}
                    >
                      <motion.div
                        layout
                        className={`w-4.5 h-4.5 rounded-full bg-[#f4ecd5] shadow-md ${
                          sfxEnabled && audioEnabled ? "translate-x-4.5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {sfxEnabled && audioEnabled && (
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-[10px] text-[#cbb293] font-semibold w-10">Volume</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={sfxVolume}
                        onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                        className="flex-1 accent-amber-400 h-1.5 bg-[#1f0d04] rounded-lg cursor-pointer"
                      />
                      <span className="text-[10px] text-amber-300 font-bold w-6 text-right">
                        {Math.round(sfxVolume * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Narrator TTS Controls */}
                <div className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  narratorEnabled && audioEnabled ? "bg-[#361a0a]/90 border-amber-500/40" : "bg-[#2a1306]/40 border-[#4a2e1d] opacity-60"
                }`}>
                  <div className="flex items-center gap-2">
                    <Mic size={16} className="text-amber-400" />
                    <span className="font-['Fredoka'] font-semibold text-xs text-amber-200">Suara Narator (TTS)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playSFX("click");
                      toggleNarrator();
                    }}
                    disabled={!audioEnabled}
                    className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 cursor-pointer border border-[#6b3615] ${
                      narratorEnabled && audioEnabled ? "bg-[#df9d3b]" : "bg-[#4a2e1d]"
                    }`}
                  >
                    <motion.div
                      layout
                      className={`w-4.5 h-4.5 rounded-full bg-[#f4ecd5] shadow-md ${
                        narratorEnabled && audioEnabled ? "translate-x-4.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* TAB 2: ABOUT GAME ONLY */}
              <div className="w-1/2 pl-1 space-y-3.5 max-h-[360px] overflow-y-auto [scrollbar-width:none]">
                {/* About App Card */}
                <div className="bg-[#2a1306]/90 rounded-2xl p-4 border border-[#6b3615] space-y-3 shadow-inner">
                  <div className="flex items-center gap-3">
                    <img src="/assets/title-dedigma.png" alt="DEDIGMA" className="w-16 h-auto object-contain drop-shadow" />
                    <div>
                      <h4 className="font-['Fredoka'] font-bold text-base text-amber-300 leading-tight">DEDIGMA</h4>
                      <p className="text-[10px] text-[#cbb293] font-semibold">Detektif Digital Budaya Magetan v1.0.0</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#e6dbbf] leading-relaxed font-['Nunito'] pt-2 border-t border-[#6b3615]">
                    Game media pembelajaran interaktif berbasis <em>edutainment</em> untuk mengenalkan kebudayaan lokal Kabupaten Magetan (Larung Sesaji, Nyadaran, Ledhug Suro) sekaligus melatih literasi digital dan verifikasi berita bagi siswa.
                  </p>
                  <div className="bg-[#1a0b03]/80 p-2.5 rounded-xl text-[11px] text-amber-200 font-semibold space-y-1 border border-amber-500/30">
                    <p>✨ <strong>Fitur Utama:</strong> 3 Misi Kebudayaan, Cek Fakta Interaktif, Tantangan Budaya, & Posttest Evaluasi.</p>
                  </div>
                </div>

                {/* Dedicated Page Launch Button */}
                <button
                  type="button"
                  onClick={() => {
                    playSFX("click");
                    onClose();
                    if (onOpenProfil) onOpenProfil();
                  }}
                  className="w-full bg-gradient-to-r from-[#366635] via-[#468245] to-[#285027] hover:from-[#468245] hover:to-[#366635] text-white font-['Fredoka'] font-bold text-xs py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-[#58a057]"
                >
                  <span>👥 Lihat Profil Dosen & Tim Pengembang</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-[#df9d3b] via-[#e5aa4b] to-[#b87c27] hover:from-[#e5aa4b] hover:to-[#c6892e] text-[#3b1e0a] font-['Fredoka'] font-extrabold text-sm py-2.5 rounded-2xl shadow-lg border-2 border-[#ffdb7d] transition-all cursor-pointer active:scale-95"
          >
            Tutup Pengaturan
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
