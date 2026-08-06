-- ====================================================================
-- SKEMA DATABASE SUPABASE UNTUK APLIKASI DEDIGMA (Detektif Digital Budaya Magetan)
-- Salin dan jalankan seluruh SQL ini di menu: Supabase Dashboard -> SQL Editor
-- ====================================================================

-- 1. TABEL PROFIL SISWA & GURU
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'siswa' CHECK (role IN ('siswa', 'guru')),
  kelas TEXT NOT NULL DEFAULT '5',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABEL PROGRES & SKOR MISI BUDAYA
CREATE TABLE IF NOT EXISTS public.progress_misi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  kelas TEXT NOT NULL DEFAULT '5',
  mission_id INT NOT NULL CHECK (mission_id IN (1, 2, 3)),
  mission_name TEXT NOT NULL,
  activity_score INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_mission UNIQUE (user_name, mission_id)
);

-- 3. TABEL HASIL PRETEST KUIS
CREATE TABLE IF NOT EXISTS public.pretest_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  kelas TEXT NOT NULL DEFAULT '5',
  pretest_score INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABEL HASIL POSTTEST KUIS
CREATE TABLE IF NOT EXISTS public.posttest_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  kelas TEXT NOT NULL DEFAULT '5',
  posttest_score INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABEL KONTROL LOCK/UNLOCK MISI PER KELAS (DASHBOARD GURU)
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
ALTER TABLE public.pretest_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posttest_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_locks ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Publik (Semua pengguna dapat membaca dan menulis)
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Write Profiles" ON public.profiles;
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Write Profiles" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Progress" ON public.progress_misi;
DROP POLICY IF EXISTS "Public Write Progress" ON public.progress_misi;
CREATE POLICY "Public Read Progress" ON public.progress_misi FOR SELECT USING (true);
CREATE POLICY "Public Write Progress" ON public.progress_misi FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Pretest" ON public.pretest_results;
DROP POLICY IF EXISTS "Public Write Pretest" ON public.pretest_results;
CREATE POLICY "Public Read Pretest" ON public.pretest_results FOR SELECT USING (true);
CREATE POLICY "Public Write Pretest" ON public.pretest_results FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Posttest" ON public.posttest_results;
DROP POLICY IF EXISTS "Public Write Posttest" ON public.posttest_results;
CREATE POLICY "Public Read Posttest" ON public.posttest_results FOR SELECT USING (true);
CREATE POLICY "Public Write Posttest" ON public.posttest_results FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Class Locks" ON public.class_locks;
DROP POLICY IF EXISTS "Public Write Class Locks" ON public.class_locks;
CREATE POLICY "Public Read Class Locks" ON public.class_locks FOR SELECT USING (true);
CREATE POLICY "Public Write Class Locks" ON public.class_locks FOR ALL USING (true);

-- ====================================================================
-- BENIH DATA AWAL (SEED INITIAL DATA FOR CLASS LOCKS GRADES 4-6)
-- ====================================================================
INSERT INTO public.class_locks (kelas, mission_id, is_locked)
VALUES 
  ('4', 1, false), ('4', 2, false), ('4', 3, false),
  ('5', 1, false), ('5', 2, false), ('5', 3, false),
  ('6', 1, false), ('6', 2, false), ('6', 3, false)
ON CONFLICT (kelas, mission_id) DO NOTHING;
