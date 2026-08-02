import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Volume2, VolumeX, Music, Mic, Bell, Settings, Info, User, Award } from "lucide-react";
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
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-['Nunito'] select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-slate-900 border-2 border-amber-400/40 text-white rounded-3xl p-5 shadow-2xl w-full max-w-sm relative space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 p-2 rounded-2xl border border-amber-400/40 text-amber-300">
                <Settings size={18} />
              </span>
              <div>
                <h3 className="font-['Fredoka'] font-bold text-lg text-amber-300 leading-tight">
                  Pengaturan & Informasi
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold">DEDIGMA — Detektif Digital</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-1 rounded-2xl border border-slate-700">
            <button
              type="button"
              onClick={() => {
                playSFX("click");
                setActiveTab("audio");
              }}
              className={`py-1.5 rounded-xl font-['Fredoka'] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "audio"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Volume2 size={14} /> Suara & Audio
            </button>

            <button
              type="button"
              onClick={() => {
                playSFX("click");
                setActiveTab("about");
              }}
              className={`py-1.5 rounded-xl font-['Fredoka'] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "about"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Info size={14} /> Tentang & Kredit
            </button>
          </div>

          {/* TAB 1: AUDIO SETTINGS */}
          {activeTab === "audio" && (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {/* Master Audio Toggle */}
              <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {audioEnabled ? <Volume2 size={20} className="text-emerald-400" /> : <VolumeX size={20} className="text-rose-400" />}
                  <div>
                    <p className="font-['Fredoka'] font-bold text-xs">Master Suara</p>
                    <p className="text-[10px] text-slate-400">Aktifkan/Matikan seluruh audio</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSFX("click");
                    toggleAudio();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    audioEnabled ? "bg-emerald-500" : "bg-slate-600"
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`w-5 h-5 rounded-full bg-white shadow-md ${
                      audioEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* BGM Controls */}
              <div className={`space-y-2 p-3 rounded-2xl border transition-all ${
                bgmEnabled && audioEnabled ? "bg-amber-950/30 border-amber-500/30" : "bg-slate-800/40 border-slate-800 opacity-60"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music size={16} className="text-amber-400" />
                    <span className="font-['Fredoka'] font-semibold text-xs">Musik Latar (BGM)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playSFX("click");
                      toggleBGM();
                    }}
                    disabled={!audioEnabled}
                    className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                      bgmEnabled && audioEnabled ? "bg-amber-500" : "bg-slate-700"
                    }`}
                  >
                    <motion.div
                      layout
                      className={`w-4.5 h-4.5 rounded-full bg-white shadow-md ${
                        bgmEnabled && audioEnabled ? "translate-x-4.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {bgmEnabled && audioEnabled && (
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[10px] text-amber-200/70 font-semibold w-10">Volume</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={bgmVolume}
                      onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                      className="flex-1 accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-amber-300 font-bold w-6 text-right">
                      {Math.round(bgmVolume * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* SFX Controls */}
              <div className={`space-y-2 p-3 rounded-2xl border transition-all ${
                sfxEnabled && audioEnabled ? "bg-cyan-950/30 border-cyan-500/30" : "bg-slate-800/40 border-slate-800 opacity-60"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-cyan-400" />
                    <span className="font-['Fredoka'] font-semibold text-xs">Efek Suara (SFX)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playSFX("click");
                      toggleSFX();
                    }}
                    disabled={!audioEnabled}
                    className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                      sfxEnabled && audioEnabled ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                  >
                    <motion.div
                      layout
                      className={`w-4.5 h-4.5 rounded-full bg-white shadow-md ${
                        sfxEnabled && audioEnabled ? "translate-x-4.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {sfxEnabled && audioEnabled && (
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[10px] text-cyan-200/70 font-semibold w-10">Volume</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={sfxVolume}
                      onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                      className="flex-1 accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-cyan-300 font-bold w-6 text-right">
                      {Math.round(sfxVolume * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Narrator TTS Controls */}
              <div className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                narratorEnabled && audioEnabled ? "bg-purple-950/30 border-purple-500/30" : "bg-slate-800/40 border-slate-800 opacity-60"
              }`}>
                <div className="flex items-center gap-2">
                  <Mic size={16} className="text-purple-400" />
                  <span className="font-['Fredoka'] font-semibold text-xs">Suara Narator (TTS)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSFX("click");
                    toggleNarrator();
                  }}
                  disabled={!audioEnabled}
                  className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    narratorEnabled && audioEnabled ? "bg-purple-500" : "bg-slate-700"
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-4.5 h-4.5 rounded-full bg-white shadow-md ${
                      narratorEnabled && audioEnabled ? "translate-x-4.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT GAME ONLY */}
          {activeTab === "about" && (
            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {/* About App Card */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/assets/logo.png" alt="DEDIGMA" className="w-12 h-12 object-contain drop-shadow" />
                  <div>
                    <h4 className="font-['Fredoka'] font-bold text-base text-amber-300 leading-tight">DEDIGMA</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">Detektif Digital Budaya Magetan v1.0.0</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-['Nunito'] pt-2 border-t border-slate-700/60">
                  Game media pembelajaran interaktif berbasis <em>edutainment</em> untuk mengenalkan kebudayaan lokal Kabupaten Magetan (Larung Sesaji, Nyadaran, Ledhug Suro) sekaligus melatih literasi digital dan verifikasi berita bagi siswa.
                </p>
                <div className="bg-slate-900/60 p-2.5 rounded-xl text-[11px] text-amber-200/90 font-semibold space-y-1 border border-amber-400/20">
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
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-['Fredoka'] font-bold text-xs py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-blue-400/40"
              >
                <span>👥 Lihat Profil Dosen & Tim Pengembang</span>
              </button>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-['Fredoka'] font-bold text-xs py-2.5 rounded-2xl shadow-lg transition-all cursor-pointer"
          >
            Tutup Pengaturan
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

