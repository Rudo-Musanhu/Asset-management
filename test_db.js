// Quick database test script
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntjrwuytloxrequjrceu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50anJ3dXl0bG94cmVxdWpyY2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTI0NzUsImV4cCI6MjA3OTk4ODQ3NX0.7tlGkIYW6I3siDrbHxBzYwB06HnoYiqKPYASRHPzlKM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('=== TESTING DATABASE ===\n');

  // Check users
  const { data: users, error: usersError } = await supabase.from('app_users').select('*');
  console.log('Users in DB:', users?.length || 0);
  if (users) {
    users.forEach(u => console.log(`  - ${u.email} (ID: ${u.id})`));
  }
  if (usersError) console.error('Users error:', usersError);

  console.log('\n');

  // Check assets - simple query first
  const { data: simpleAssets, error: simpleError } = await supabase
    .from('assets')
    .select('id, name, cost, created_by, created_at, date_purchased');
  
  console.log('Assets (simple query):', simpleAssets?.length || 0);
  if (simpleAssets) {
    simpleAssets.forEach(a => {
      console.log(`  - ${a.name} (ID: ${a.id}, created_by: ${a.created_by})`);
    });
  }
  if (simpleError) console.error('Simple assets error:', simpleError);

  console.log('\n');

  // Try with joins
  const { data: joinedAssets, error: joinError } = await supabase
    .from('assets')
    .select('id, name, cost, created_by');
  
  console.log('Assets (joined query):', joinedAssets?.length || 0);

  console.log('\n=== TEST COMPLETE ===');
}

test().catch(console.error);
