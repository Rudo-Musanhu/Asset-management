// Run migration script
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntjrwuytloxrequjrceu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50anJ3dXl0bG94cmVxdWpyY2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTI0NzUsImV4cCI6MjA3OTk4ODQ3NX0.7tlGkIYW6I3siDrbHxBzYwB06HnoYiqKPYASRHPzlKM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('Running migration: Add icon_name column to assets table...');

    // Execute the ALTER TABLE statement
    const { error } = await supabase
      .from('assets')
      .select('id')
      .limit(1); // Just to test connection

    if (error) {
      console.error('Connection test failed:', error);
      return;
    }

    // Since we can't execute DDL directly, we'll try to insert a test asset with icon_name
    // If it fails, the column doesn't exist
    const testData = {
      name: 'Test Asset for Migration',
      category_id: null,
      department_id: null,
      date_purchased: '2023-01-01',
      cost: 100,
      created_by: null,
      icon_name: 'Package'
    };

    const { error: insertError } = await supabase
      .from('assets')
      .insert(testData);

    if (insertError && insertError.message.includes('icon_name')) {
      console.log('Column icon_name does not exist. Please run the migration manually in Supabase dashboard:');
      console.log('ALTER TABLE assets ADD COLUMN IF NOT EXISTS icon_name text DEFAULT \'Package\';');
      console.log('COMMENT ON COLUMN assets.icon_name IS \'Icon name from lucide-react library (Package, Laptop, Monitor, etc.)\';');
    } else if (insertError) {
      console.error('Insert test failed for other reason:', insertError);
    } else {
      console.log('Migration appears to be already applied or column exists.');
      // Clean up test asset
      await supabase.from('assets').delete().eq('name', 'Test Asset for Migration');
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

runMigration();