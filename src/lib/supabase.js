let supabaseClient = null;

export async function getSupabase() {
    if (supabaseClient) return supabaseClient;

    const { createClient } = await import("@supabase/supabase-js");

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    return supabaseClient;
}