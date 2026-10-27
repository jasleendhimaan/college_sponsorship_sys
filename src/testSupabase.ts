import { supabase } from './lib/supabase';

async function testSupabase() {
  const { data, error } = await supabase
    .from('events')
    .select('*');

  if (error) {
    console.error('❌ Supabase connection error:', error);
    return;
  }

  console.log('✅ Supabase connected successfully!');
  console.log('Events:', data);
}

testSupabase();