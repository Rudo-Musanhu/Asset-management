// Script to create a sample asset
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uhwasesfjdjdtvpensba.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjRjMDAwOTAxLWNjMTUtNDFlMC1hNmYwLWM1NTA1MWNjMzhmNCJ9.eyJwcm9qZWN0SWQiOiJ1aHdhc2VzZmpkamR0dnBlbnNiYSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY0NTMwMjA5LCJleHAiOjIwNzk4OTAyMDksImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.2ioBuiODahy8MKmSWfrQe8FkV4RmD1JjGZPEQO51Y1A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSampleAsset() {
  try {
    // Get existing categories and departments
    const { data: cats } = await supabase.from('asset_categories').select('id, name');
    const { data: depts } = await supabase.from('departments').select('id, name');
    const { data: users } = await supabase.from('app_users').select('id').limit(1);

    const adminUserId = users?.[0]?.id;

    // Create a sample asset
    const asset = {
      name: 'iPhone 15 Pro',
      category_id: cats?.find(c => c.name === 'Electronics')?.id,
      department_id: depts?.find(d => d.name === 'IT Department')?.id,
      date_purchased: '2024-10-01',
      cost: 999.00,
      created_by: adminUserId
    };

    const { error } = await supabase.from('assets').insert(asset);

    if (error) {
      console.error('Error creating asset:', error);
    } else {
      console.log('Sample asset "iPhone 15 Pro" created successfully!');
      console.log('Asset details:', asset);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

createSampleAsset();