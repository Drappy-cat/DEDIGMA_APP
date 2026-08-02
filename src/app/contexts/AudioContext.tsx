import React, { createContext, useContext, useState, useEffect, useRef } from "react";

interface VoiceOptions {
  pitch?: number;
  rate?: number;
}

interface AudioContextType {
  audioEnabled: boolean;
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  narratorEnabled: boolean;
  bgmVolume: number;
  sfxVolume: number;
  toggleAudio: () => void;
  toggleBGM: () => void;
  toggleSFX: () => void;
  toggleNarrator: () => void;
  setBgmVolume: (val: number) => void;
  setSfxVolume: (val: number) => void;
  playNarrator: (text: string, mp3Path?: string, options?: VoiceOptions) => void;
  stopNarrator: () => void;
  playSFX: (type: "success" | "fail" | "click" | "badge") => void;
  playBGM: (path?: string) => void;
  stopBGM: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);
  const [narratorEnabled, setNarratorEnabled] = useState<boolean>(true);
  const [bgmVolume, setBgmVolumeState] = useState<number>(0.3);
  const [sfxVolume, setSfxVolumeState] = useState<number>(0.5);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize SpeechSynthesis and saved audio preferences
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    const savedAudio = localStorage.getItem("dedigma_audio_enabled");
    if (savedAudio !== null) setAudioEnabled(savedAudio === "true");

    const savedBgm = localStorage.getItem("dedigma_bgm_enabled");
    if (savedBgm !== null) setBgmEnabled(savedBgm === "true");

    const savedSfx = localStorage.getItem("dedigma_sfx_enabled");
    if (savedSfx !== null) setSfxEnabled(savedSfx === "true");

    const savedNarrator = localStorage.getItem("dedigma_narrator_enabled");
    if (savedNarrator !== null) setNarratorEnabled(savedNarrator === "true");

    const savedBgmVol = localStorage.getItem("dedigma_bgm_volume");
    if (savedBgmVol !== null) setBgmVolumeState(parseFloat(savedBgmVol));

    const savedSfxVol = localStorage.getItem("dedigma_sfx_volume");
    if (savedSfxVol !== null) setSfxVolumeState(parseFloat(savedSfxVol));
  }, []);

  const toggleAudio = () => {
    setAudioEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("dedigma_audio_enabled", String(next));
      if (!next) {
        stopNarrator();
        stopBGM();
      } else {
        if (bgmEnabled && bgmRef.current) {
          bgmRef.current.play().catch(() => {});
        }
      }
      return next;
    });
  };

  const toggleBGM = () => {
    setBgmEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("dedigma_bgm_enabled", String(next));
      if (!next) {
        stopBGM();
      } else if (audioEnabled) {
        playBGM();
      }
      return next;
    });
  };

  const toggleSFX = () => {
    setSfxEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("dedigma_sfx_enabled", String(next));
      return next;
    });
  };

  const toggleNarrator = () => {
    setNarratorEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("dedigma_narrator_enabled", String(next));
      if (!next) {
        stopNarrator();
      }
      return next;
    });
  };

  const setBgmVolume = (val: number) => {
    setBgmVolumeState(val);
    localStorage.setItem("dedigma_bgm_volume", String(val));
    if (bgmRef.current) {
      bgmRef.current.volume = val;
    }
  };

  const setSfxVolume = (val: number) => {
    setSfxVolumeState(val);
    localStorage.setItem("dedigma_sfx_volume", String(val));
  };

  const stopNarrator = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const playNarrator = (text: string, mp3Path?: string, options?: VoiceOptions) => {
    stopNarrator();
    if (!audioEnabled || !narratorEnabled) return;

    const cleanSlug = text
      .toLowerCase()
      .slice(0, 20)
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_");
    
    const fallbackPath = `/audio/narasi/${cleanSlug}.mp3`;
    const targetPath = mp3Path || fallbackPath;

    const audio = new Audio(targetPath);
    currentAudioRef.current = audio;
    
    audio.play().catch(() => {
      playTTS(text, options);
    });
  };

  const playTTS = (text: string, options?: VoiceOptions) => {
    if (!synthRef.current || !narratorEnabled || !audioEnabled) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.1;

    const voices = synthRef.current.getVoices();
    const idVoice = voices.find((voice) => voice.lang.includes("id"));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const playSFX = (type: "success" | "fail" | "click" | "badge") => {
    if (!audioEnabled || !sfxEnabled) return;

    const sfxPaths = {
      click: "/audio/sfx-click.mp3",
      success: "/audio/sfx-success.mp3",
      fail: "/audio/sfx-fail.mp3",
      badge: "/audio/sfx-badge.mp3"
    };

    const path = sfxPaths[type];
    const audio = new Audio(path);
    audio.volume = sfxVolume;
    audio.play().catch(() => {
      console.log(`SFX played: ${type}`);
    });
  };

  const playBGM = (path: string = "/audio/backsound.mp3") => {
    if (!audioEnabled || !bgmEnabled) return;
    
    if (bgmRef.current) {
      // Ambil path dari sumber yang sedang diputar (menghindari absolute URL)
      const currentSrc = new URL(bgmRef.current.src, window.location.href).pathname;
      
      // Jika lagu yang sama sudah ada, pastikan saja dia dimainkan (tidak dari awal)
      if (currentSrc === path) {
        if (bgmRef.current.paused) {
          bgmRef.current.play().catch(() => {});
        }
        return;
      }
      
      // Jika lagunya berbeda, berhentikan lagu sebelumnya
      bgmRef.current.pause();
    }
    
    // Mulai lagu baru dari awal
    const bgm = new Audio(path);
    bgm.loop = true;
    bgm.volume = bgmVolume;
    bgmRef.current = bgm;
    bgm.play().catch(() => {
      console.log(`BGM failed to play. Browsers usually require user interaction first.`);
    });
  };

  const stopBGM = () => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
  };

  return (
    <AudioContext.Provider
      value={{
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
        playNarrator,
        stopNarrator,
        playSFX,
        playBGM,
        stopBGM
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

