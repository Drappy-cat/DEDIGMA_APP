require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('posttest_results').select('*');
  if (error) console.error('Error:', error);
  else console.log('Posttest Results:', data);
  
  const { data: pre, error: err2 } = await supabase.from('pretest_results').select('*');
  if (err2) console.error('Error pre:', err2);
  else console.log('Pretest Results:', pre);
}
test();
