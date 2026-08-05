-- ====================================================================
-- SKEMA DATABASE SUPABASE UNTUK APLIKASI DEDIGMA (Detektif Digital Budaya Magetan)
-- Salin dan jalankan seluruh SQL ini di menu: Supabase Dashboard -> SQL Editor
-- ====================================================================

-- 1. TABEL PROFIL SISWA & GURU
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'siswa' CHECK (role IN ('siswa', 'guru')),
  kelas TEXT NOT NULL DEFAULT '5A',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABEL PROGRES & SKOR MISI BUDAYA
CREATE TABLE IF NOT EXISTS public.progress_misi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  kelas TEXT NOT NULL DEFAULT '5A',
  mission_id INT NOT NULL CHECK (mission_id IN (1, 2, 3)),
  mission_name TEXT NOT NULL,
  activity_score INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_mission UNIQUE (user_name, mission_id)
);

-- 3. TABEL HASIL POSTTEST KUIS
CREATE TABLE IF NOT EXISTS public.posttest_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  kelas TEXT NOT NULL DEFAULT '5A',
  posttest_score INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABEL KONTROL LOCK/UNLOCK MISI PER KELAS (DASHBOARD GURU)
CREATE TABLE IF NOT EXISTS public.class_locks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kelas TEXT NOT NULL,
  mission_id INT NOT NULL CHECK (mission_id IN (1, 2, 3)),
  is_locked BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_class_mission_lock UNIQUE (kelas, mission_id)
);

-- ====================================================================
-- KEBIJAKAN KEAMANAN ROW LEVEL SECURITY (RLS) UNTUK AKSES PUBLIK ANONYMOUS
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_misi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posttest_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_locks ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Publik (Semua pengguna Anonim dapat membaca dan menulis)
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Progress" ON public.progress_misi FOR SELECT USING (true);
CREATE POLICY "Public Write Progress" ON public.progress_misi FOR ALL USING (true);

CREATE POLICY "Public Read Posttest" ON public.posttest_results FOR SELECT USING (true);
CREATE POLICY "Public Write Posttest" ON public.posttest_results FOR ALL USING (true);

CREATE POLICY "Public Read Class Locks" ON public.class_locks FOR SELECT USING (true);
CREATE POLICY "Public Write Class Locks" ON public.class_locks FOR ALL USING (true);

-- ====================================================================
-- BENIH DATA AWAL (SEED INITIAL DATA FOR CLASS LOCKS)
-- ====================================================================
INSERT INTO public.class_locks (kelas, mission_id, is_locked)
VALUES 
  ('5A', 1, false), ('5A', 2, false), ('5A', 3, false),
  ('5B', 1, false), ('5B', 2, false), ('5B', 3, false),
  ('5C', 1, false), ('5C', 2, false), ('5C', 3, false)
ON CONFLICT (kelas, mission_id) DO NOTHING;
