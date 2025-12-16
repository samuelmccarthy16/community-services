import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://rurqgqxngfllvbadfyes.supabase.co';
const supabaseKey = 'sb_publishable_bK-XK0EO5jIM8UHtoHtEWg_r_q9KyOA';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };