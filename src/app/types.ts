export type Role = "guru" | "siswa";

export type Screen =
  | "login"
  | "splash"
  | "petunjuk"
  | "tujuan"
  | "profil"
  | "peta-misi"
  | "mission-flow"
  | "tantangan"
  | "posttest"
  | "lencana"
  | "sertifikat"
  | "guru-dashboard";

export type MissionStage =
  | "orientasi"
  | "materi"
  | "aktivitas"
  | "refleksi"
  | "selesai";

export type MateriTab = "pengertian" | "sejarah" | "tujuan" | "nilai-budaya" | "galeri" | "video";

// Activity variant per mission
export type ActivityType = "cek-fakta" | "analisis-sumber" | "detektif-berita";

export interface Mission {
  id: number;
  name: string;
  emoji: string;
  location: string;
  gradient: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  desc: string;
  activityType: ActivityType;
  orientasi: {
    narasi: string;
    videoQuery?: string;
  };
  content: {
    pengertian: string;
    sejarah: string;
    tujuan: string;
    nilaiBudaya: string[];
  };
  faktaItems: string[];
  faktaQuestions: {
    soal: string;
    kunci: string[];
  }[];
  cekFakta: {
    text: string;
    benar: boolean;
  }[];
  sumberAnalisis: {
    nama: string;
    jenis: string;
    terpercaya: boolean;
    icon: string;
  }[];
  beritaItems: {
    judul: string;
    isFakta: boolean;
  }[];
  refleksiPertanyaan: string[];
  kuis: {
    soal: string;
    opsi: string[];
    jawaban: number;
  }[];
  galeri: {
    photoId: string;
    caption: string;
  }[];
  video: {
    title: string;
    desc: string;
    thumbId: string;
    query: string;
  }[];
}

export interface Student {
  id: number;
  nama: string;
  kelas: string;
  misi1: boolean;
  misi2: boolean;
  misi3: boolean;
  skor: number;
  waktu: string;
  tanggal: string;
  activeMission?: string;
  activeStage?: string;
  loginTime?: string;
}

// Badge system
export type BadgeId = "detektif_teliti" | "detektif_utama" | "detektif_budaya";

export interface Badge {
  id: BadgeId;
  name: string;
  desc: string;
  emoji: string;
  threshold: string;
}

// Mission progress tracking per mission
export interface MissionProgress {
  visitedOrientasi: boolean;
  visitedMateri: boolean;
  activityScore: number;
  reflectionText: string;
  completed: boolean;
}

// Centralized game state
export interface GameState {
  missions: Record<number, MissionProgress>;
  totalScore: number;
  badges: BadgeId[];
  tantanganScore: number | null;
  posttest: {
    answers: Record<number, number>;
    score: number | null;
  };
}

// Badge definitions
export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: "detektif_budaya",
    name: "Detektif Budaya",
    desc: "Menyelesaikan semua misi dengan skor kumulatif ≥ 70",
    emoji: "🔍",
    threshold: "totalScore >= 70"
  },
  {
    id: "detektif_teliti",
    name: "Detektif Teliti",
    desc: "Semua skor aktivitas misi ≥ 80",
    emoji: "🎯",
    threshold: "allMissionScores >= 80"
  },
  {
    id: "detektif_utama",
    name: "Detektif Utama",
    desc: "Skor kumulatif tertinggi ≥ 90",
    emoji: "🏆",
    threshold: "totalScore >= 90"
  }
];

// Calculate badges based on mission scores
export function calculateBadges(missionScores: Record<number, number>): BadgeId[] {
  const badges: BadgeId[] = [];
  const scores = Object.values(missionScores);

  if (scores.length === 0) return badges;

  const totalScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const allAbove80 = scores.length >= 3 && scores.every((s) => s >= 80);

  if (totalScore >= 70) badges.push("detektif_budaya");
  if (allAbove80) badges.push("detektif_teliti");
  if (totalScore >= 90) badges.push("detektif_utama");

  return badges;
}

// Default empty game state
export function createDefaultGameState(): GameState {
  return {
    missions: {
      1: { visitedOrientasi: false, visitedMateri: false, activityScore: 0, reflectionText: "", completed: false },
      2: { visitedOrientasi: false, visitedMateri: false, activityScore: 0, reflectionText: "", completed: false },
      3: { visitedOrientasi: false, visitedMateri: false, activityScore: 0, reflectionText: "", completed: false }
    },
    totalScore: 0,
    badges: [],
    tantanganScore: null,
    posttest: { answers: {}, score: null }
  };
}
