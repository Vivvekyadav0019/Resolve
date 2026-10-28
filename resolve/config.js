// Public (browser-safe) Supabase settings. The anon key is meant to be public;
// access is controlled by Row Level Security in Supabase.
// Leave blank to run in offline/local-storage mode.
window.RESOLVE_CONFIG = {
  SUPABASE_URL: '',       // e.g. https://abcdxyz.supabase.co
  SUPABASE_ANON_KEY: ''   // Settings -> API -> anon public key
};
