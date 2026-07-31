import React, { createContext, useContext, useState, useEffect, useRef } from "react";

interface AudioContextType {
  audioEnabled: boolean;
  bgmEnabled: boolean;
  narratorEnabled: boolean;
  toggleAudio: () => void;
  toggleBGM: () => void;
  toggleNarrator: () => void;
  playNarrator: (text: string, mp3Path?: string) => void;
  stopNarrator: () => void;
  playSFX: (type: "success" | "fail" | "click" | "badge") => void;
  playBGM: (path?: string) => void;
  stopBGM: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);
  const [narratorEnabled, setNarratorEnabled] = useState<boolean>(true);
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
    if (savedAudio !== null) {
      setAudioEnabled(savedAudio === "true");
    }

    const savedBgm = localStorage.getItem("dedigma_bgm_enabled");
    if (savedBgm !== null) {
      setBgmEnabled(savedBgm === "true");
    }

    const savedNarrator = localStorage.getItem("dedigma_narrator_enabled");
    if (savedNarrator !== null) {
      setNarratorEnabled(savedNarrator === "true");
    }
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

  const stopNarrator = () => {
    // Stop MP3 if playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    // Stop SpeechSynthesis if talking
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const playNarrator = (text: string, mp3Path?: string) => {
    stopNarrator();
    if (!audioEnabled || !narratorEnabled) return;

    // Convert the first 20 characters of text to a safe filename slug
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
      // If the MP3 file is not found or fails to load, gracefully fall back to Indonesian TTS
      playTTS(text);
    });
  };

  const playTTS = (text: string) => {
    if (!synthRef.current || !narratorEnabled || !audioEnabled) return;

    // SpeechSynthesisUtterance setup for Indonesian language
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 1.0; // natural speed
    utterance.pitch = 1.1; // slightly friendly tone for kids

    // Get Indonesian voice if available
    const voices = synthRef.current.getVoices();
    const idVoice = voices.find((voice) => voice.lang.includes("id"));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const playSFX = (type: "success" | "fail" | "click" | "badge") => {
    if (!audioEnabled) return;

    const sfxPaths = {
      click: "/audio/sfx-click.mp3",
      success: "/audio/sfx-success.mp3",
      fail: "/audio/sfx-fail.mp3",
      badge: "/audio/sfx-badge.mp3"
    };

    const path = sfxPaths[type];
    const audio = new Audio(path);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Fallback: Silent failure or soft console log if assets don't exist yet
      console.log(`SFX played: ${type}`);
    });
  };

  const playBGM = (path: string = "/audio/backsound.mp3") => {
    if (!audioEnabled || !bgmEnabled) return;
    if (bgmRef.current) {
      bgmRef.current.pause();
    }
    const bgm = new Audio(path);
    bgm.loop = true;
    bgm.volume = 0.3; // Default volume for BGM, lower than SFX
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
        narratorEnabled,
        toggleAudio,
        toggleBGM,
        toggleNarrator,
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
