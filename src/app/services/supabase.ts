import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Read environment variables securely from Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

/**
 * Checks whether Supabase environment variables have been filled with valid values.
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes("your-project-ref") &&
    !supabaseAnonKey.includes("your-anon-key")
  );
};

/**
 * Service Helper: Reset Student Database (Danger)
 * Deletes all student progress, pretests, posttests, and profiles.
 */
export async function resetStudentDatabase() {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    // Delete progress
    const { error: err1 } = await supabase.from("progress_misi").delete().neq("id", 0);
    // Delete pretest
    const { error: err2 } = await supabase.from("pretest_results").delete().neq("id", 0);
    // Delete posttest
    const { error: err3 } = await supabase.from("posttest_results").delete().neq("id", 0);
    // Delete student profiles
    const { error: err4 } = await supabase.from("profiles").delete().eq("role", "siswa");

    if (err1 || err2 || err3 || err4) {
      console.error("Supabase reset database error:", err1, err2, err3, err4);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to reset student database:", err);
    return false;
  }
}

// Initialize Supabase Client if credentials exist, otherwise null (Hybrid Offline Mode)
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Interface definitions for Supabase Database Tables
 */
export interface SupabaseProfile {
  id?: string;
  user_name: string;
  role: "siswa" | "guru";
  kelas: string;
  created_at?: string;
}

export interface SupabaseProgress {
  id?: string;
  user_name: string;
  kelas: string;
  mission_id: number;
  mission_name: string;
  activity_score: number;
  reflection_text?: string;
  completed: boolean;
  updated_at?: string;
}

export interface SupabasePretest {
  id?: string;
  user_name: string;
  kelas: string;
  pretest_score: number;
  completed_at?: string;
}

export interface SupabasePosttest {
  id?: string;
  user_name: string;
  kelas: string;
  posttest_score: number;
  completed_at?: string;
}

export interface SupabaseClassLock {
  id?: string;
  kelas: string;
  mission_id: number;
  is_locked: boolean;
  updated_at?: string;
}

/**
 * Service Helper: Register/Upsert User Profile in Supabase
 */
export async function registerProfileToSupabase(data: {
  userName: string;
  role: "siswa" | "guru";
  kelas: string;
}) {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase.from("profiles").upsert(
      {
        user_name: data.userName,
        role: data.role,
        kelas: data.kelas
      },
      { onConflict: "user_name" }
    );

    if (error) {
      console.error("Supabase register profile error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to register profile to Supabase:", err);
    return false;
  }
}

/**
 * Service Helper: Authenticate Guru using Supabase Auth
 */
export async function loginGuruWithSupabase(email: string, password: string) {
  if (!supabase || !isSupabaseConfigured()) {
    return { success: false, message: "Koneksi Supabase belum dikonfigurasi." };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, message: err.message || "Gagal menghubungi server." };
  }
}

/**
 * Service Helper: Sync Student Mission Progress & Reflection to Supabase
 */
export async function syncProgressToSupabase(data: {
  userName: string;
  kelas: string;
  missionId: number;
  missionName: string;
  score: number;
  reflectionText?: string;
  completed: boolean;
}) {
  if (!supabase || !isSupabaseConfigured()) {
    console.log("Supabase not configured. Using local offline storage.");
    return false;
  }

  try {
    const payload: Record<string, any> = {
      user_name: data.userName,
      kelas: data.kelas,
      mission_id: data.missionId,
      mission_name: data.missionName,
      activity_score: data.score,
      completed: data.completed,
      updated_at: new Date().toISOString()
    };
    if (data.reflectionText !== undefined && data.reflectionText !== null) {
      payload.reflection_text = data.reflectionText;
    }

    const { error } = await supabase.from("progress_misi").upsert(
      payload,
      { onConflict: "user_name,mission_id" }
    );

    if (error) {
      if (error.message.includes("reflection_text")) {
        delete payload.reflection_text;
        const { error: fallbackErr } = await supabase.from("progress_misi").upsert(
          payload,
          { onConflict: "user_name,mission_id" }
        );
        if (fallbackErr) console.error("Supabase sync progress fallback error:", fallbackErr.message);
      } else {
        console.error("Supabase sync progress error:", error.message);
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to sync progress to Supabase:", err);
    return false;
  }
}

/**
 * Service Helper: Sync Pretest Results to Supabase
 */
export async function syncPretestToSupabase(data: {
  userName: string;
  kelas: string;
  score: number;
}) {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const { data: existing } = await supabase
      .from("pretest_results")
      .select("id")
      .eq("user_name", data.userName)
      .maybeSingle();

    let error;
    if (existing) {
      const res = await supabase.from("pretest_results").update({
        pretest_score: data.score,
        completed_at: new Date().toISOString()
      }).eq("user_name", data.userName);
      error = res.error;
    } else {
      const res = await supabase.from("pretest_results").insert({
        user_name: data.userName,
        kelas: data.kelas,
        pretest_score: data.score,
        completed_at: new Date().toISOString()
      });
      error = res.error;
    }

    if (error) {
      console.error("Supabase sync pretest error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to sync pretest to Supabase:", err);
    return false;
  }
}

/**
 * Service Helper: Sync Posttest Results to Supabase
 */
export async function syncPosttestToSupabase(data: {
  userName: string;
  kelas: string;
  score: number;
}) {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const { data: existing } = await supabase
      .from("posttest_results")
      .select("id")
      .eq("user_name", data.userName)
      .maybeSingle();

    let error;
    if (existing) {
      const res = await supabase.from("posttest_results").update({
        posttest_score: data.score,
        completed_at: new Date().toISOString()
      }).eq("user_name", data.userName);
      error = res.error;
    } else {
      const res = await supabase.from("posttest_results").insert({
        user_name: data.userName,
        kelas: data.kelas,
        posttest_score: data.score,
        completed_at: new Date().toISOString()
      });
      error = res.error;
    }

    if (error) {
      console.error("Supabase sync posttest error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to sync posttest to Supabase:", err);
    return false;
  }
}

/**
 * Service Helper: Fetch Student Data (Pretest, Posttest, Missions) from Supabase
 */
export async function fetchStudentDataFromSupabase(userName: string) {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const [progressRes, pretestRes, posttestRes] = await Promise.all([
      supabase.from("progress_misi").select("*").eq("user_name", userName),
      supabase.from("pretest_results").select("*").eq("user_name", userName).single(),
      supabase.from("posttest_results").select("*").eq("user_name", userName).single()
    ]);

    return {
      progress: (progressRes.data || []) as SupabaseProgress[],
      pretest: pretestRes.data ? (pretestRes.data as SupabasePretest) : null,
      posttest: posttestRes.data ? (posttestRes.data as SupabasePosttest) : null
    };
  } catch (err) {
    console.error("Failed to fetch student data from Supabase:", err);
    return null;
  }
}

/**
 * Service Helper: Fetch Combined Rekap Data for Guru Dashboard
 */
export async function fetchGuruRekapFromSupabase() {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const [profilesRes, progressRes, pretestRes, posttestRes] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("progress_misi").select("*"),
      supabase.from("pretest_results").select("*"),
      supabase.from("posttest_results").select("*")
    ]);

    if (profilesRes.error || progressRes.error) {
      console.error("Error fetching guru rekap from Supabase");
      return null;
    }

    return {
      profiles: (profilesRes.data || []) as SupabaseProfile[],
      progress: (progressRes.data || []) as SupabaseProgress[],
      pretests: (pretestRes.data || []) as SupabasePretest[],
      posttests: (posttestRes.data || []) as SupabasePosttest[]
    };
  } catch (err) {
    console.error("Failed to fetch guru rekap from Supabase:", err);
    return null;
  }
}

/**
 * Service Helper: Toggle Mission Lock State per Class
 */
export async function toggleSupabaseClassLock(kelas: string, missionId: number, isLocked: boolean) {
  if (!supabase || !isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase.from("class_locks").upsert(
      {
        kelas,
        mission_id: missionId,
        is_locked: isLocked,
        updated_at: new Date().toISOString()
      },
      { onConflict: "kelas,mission_id" }
    );

    if (error) {
      console.error("Error updating class lock in Supabase:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to update class lock in Supabase:", err);
    return false;
  }
}

/**
 * Service Helper: Fetch All Class Locks
 */
export async function fetchSupabaseClassLocks() {
  if (!supabase || !isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase.from("class_locks").select("*");
    if (error) {
      console.error("Error fetching class locks from Supabase:", error.message);
      return null;
    }
    return data as SupabaseClassLock[];
  } catch (err) {
    console.error("Failed to fetch class locks from Supabase:", err);
    return null;
  }
}

/**
 * Realtime Listener: Subscribe to Class Locks changes
 */
export function subscribeToClassLocks(onLockChange: (kelas: string, missionId: number, isLocked: boolean) => void) {
  if (!supabase || !isSupabaseConfigured()) return null;

  const channel = supabase
    .channel("public:class_locks")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "class_locks" },
      (payload) => {
        if (payload.new) {
          const { kelas, mission_id, is_locked } = payload.new as any;
          onLockChange(kelas, mission_id, is_locked);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Realtime Listener: Subscribe to a specific student's progress changes
 */
export function subscribeToStudentProgress(userName: string, onUpdate: () => void) {
  if (!supabase || !isSupabaseConfigured()) return null;

  // Since we can't easily filter by user_name on the client without complex setup in some cases,
  // we listen to all inserts/updates on these tables and filter locally.
  const channel = supabase
    .channel(`student_progress_${userName}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "progress_misi" },
      (payload) => {
        if (payload.new && (payload.new as any).user_name === userName) onUpdate();
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "pretest_results" },
      (payload) => {
        if (payload.new && (payload.new as any).user_name === userName) onUpdate();
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "posttest_results" },
      (payload) => {
        if (payload.new && (payload.new as any).user_name === userName) onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

