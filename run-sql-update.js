import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
// You can find these in your Supabase dashboard under Settings > API
const supabaseUrl = 'https://jbmjdojclkgfjwygjzig.supabase.co'; // Replace with your project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibWpkb2pjbGtnZmp3eWdqemlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDg3NDUsImV4cCI6MjA3OTM4NDc0NX0.LGp86FiPQ6ij3bkHwq-bmajxCawrRUAHPfc36xIeGwI'; // Replace with your anon key

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMinimumCapacityUpdate() {
  console.log('Starting minimum capacity update...');
  
  try {
    // First, update any existing NULL values in minimum_capacity to a default (e.g., 1)
    console.log('Updating NULL values...');
    const { error: error1 } = await supabase
      .from('meeting_halls')
      .update({ minimum_capacity: 1 })
      .is('minimum_capacity', null);
    
    if (error1) {
      console.error('Error updating NULL values:', error1);
    } else {
      console.log('NULL values updated successfully');
    }

    // Update minimum_capacity based on hall descriptions
    const halls = [
      { name: 'PRANAN', capacity: 5 },
      { name: 'SIRUVANI', capacity: 10 },
      { name: 'GANGA', capacity: 2 },
      { name: 'ANANTA', capacity: 2 },
      { name: 'VICHITRAM', capacity: 5 }
    ];

    for (const hall of halls) {
      console.log(`Updating ${hall.name} to minimum capacity ${hall.capacity}...`);
      const { error } = await supabase
        .from('meeting_halls')
        .update({ minimum_capacity: hall.capacity })
        .eq('name', hall.name);
      
      if (error) {
        console.error(`Error updating ${hall.name}:`, error);
      } else {
        console.log(`${hall.name} updated successfully`);
      }
    }

    console.log('Minimum capacity update completed!');
    
    // Verify the updates
    const { data: hallsData, error: fetchError } = await supabase
      .from('meeting_halls')
      .select('name, capacity, minimum_capacity')
      .order('name');
    
    if (fetchError) {
      console.error('Error fetching updated data:', fetchError);
    } else {
      console.log('\nUpdated hall capacities:');
      console.table(hallsData);
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

runMinimumCapacityUpdate();
