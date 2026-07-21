export type Role = "guru" | "siswa";

export type Screen =
  | "login"
  | "splash"
  | "petunjuk"
  | "profil"
  | "peta-misi"
  | "mission-flow"
  | "posttest"
  | "lencana"
  | "sertifikat"
  | "guru-dashboard";

export type MissionStage =
  | "materi"
  | "cari-fakta"
  | "cek-fakta"
  | "analisis-sumber"
  | "detektif-berita"
  | "ruang-refleksi"
  | "tantangan"
  | "selesai";

export type MateriTab = "pengertian" | "sejarah" | "tujuan" | "nilai-budaya" | "galeri" | "video";

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
}
