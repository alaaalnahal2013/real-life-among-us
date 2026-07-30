// ============================================================
//  SUPABASE CLIENT — Real-Time Multi-Device Sync
//  Project: alaaalnahal2013's Project
// ============================================================
const SUPABASE_URL = 'https://crtbhbmsebjvtsccaeby.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xhn6CVCXsWI6YUCoPCIKqQ_PIasF25v';

// Create the global client (available as window._supabase)
window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { params: { eventsPerSecond: 10 } }
});

console.log('[Supabase] Client initialized ✅');