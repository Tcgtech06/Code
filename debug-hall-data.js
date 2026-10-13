import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jbmjdojclkgfjwygjzig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibWpkb2pjbGtnZmp3eWdqemlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDg3NDUsImV4cCI6MjA3OTM4NDc0NX0.LGp86FiPQ6ij3bkHwq-bmajxCawrRUAHPfc36xIeGwI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugHallData() {
  console.log('Fetching hall data...');
  
  try {
    // Fetch all halls to see what data we get
    const { data, error } = await supabase
      .from('meeting_halls')
      .select('*');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('All halls data:');
    console.table(data);
    
    // Also try fetching a specific hall (like Ganga)
    const { data: gangaData, error: gangaError } = await supabase
      .from('meeting_halls')
      .select('*')
      .eq('name', 'Ganga')
      .single();
    
    if (gangaError) {
      console.error('Ganga error:', gangaError);
    } else {
      console.log('\nGanga hall data:');
      console.log(gangaData);
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

debugHallData();
