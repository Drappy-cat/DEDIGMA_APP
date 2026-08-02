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

// Initialize Supabase Client if credentials exist, otherwise null (Hybrid Offline Mode)
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Interface definitions for Supabase Database Tables
 */
export interface SupabaseProfile {
  id: string;
  nama: string;
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
  completed: boolean;
  updated_at?: string;
}

export interface SupabaseClassLock {
  id?: string;
  kelas: string;
  mission_id: number;
  is_locked: boolean;
  updated_at?: string;
}

/**
 * Service Helper: Sync Student Progress to Supabase
 */
export async function syncProgressToSupabase(data: {
  userName: string;
  kelas: string;
  missionId: number;
  missionName: string;
  score: number;
  completed: boolean;
}) {
  if (!supabase || !isSupabaseConfigured()) {
    console.log("Supabase not configured. Using local offline storage.");
    return false;
  }

  try {
    const { error } = await supabase.from("progress_misi").upsert(
      {
        user_name: data.userName,
        kelas: data.kelas,
        mission_id: data.missionId,
        mission_name: data.missionName,
        activity_score: data.score,
        completed: data.completed,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_name,mission_id" }
    );

    if (error) {
      console.error("Supabase sync progress error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to sync progress to Supabase:", err);
    return false;
  }
}

/**
 * Service Helper: Fetch Student Rekap Data for Guru Dashboard
 */
export async function fetchGuruRekapFromSupabase() {
  if (!supabase || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("progress_misi")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching progress from Supabase:", error.message);
      return null;
    }

    return data as SupabaseProgress[];
  } catch (err) {
    console.error("Failed to fetch guru rekap from Supabase:", err);
    return null;
  }
}

/**
 * Service Helper: Toggle Mission Lock State per Class
 */
export async function toggleSupabaseClassLock(kelas: string, missionId: number, isLocked: boolean) {
  if (!supabase || !isSupabaseConfigured()) {
    return false;
  }

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
 * Realtime Listener: Subscribe to Class Locks changes
 */
export function subscribeToClassLocks(onLockChange: (kelas: string, missionId: number, isLocked: boolean) => void) {
  if (!supabase || !isSupabaseConfigured()) {
    return null;
  }

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
