// Seed script to add sample data
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uhwasesfjdjdtvpensba.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjRjMDAwOTAxLWNjMTUtNDFlMC1hNmYwLWM1NTA1MWNjMzhmNCJ9.eyJwcm9qZWN0SWQiOiJ1aHdhc2VzZmpkamR0dnBlbnNiYSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY0NTMwMjA5LCJleHAiOjIwNzk4OTAyMDksImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.2ioBuiODahy8MKmSWfrQe8FkV4RmD1JjGZPEQO51Y1A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  try {
    // Get existing categories and departments
    const { data: existingCats } = await supabase.from('asset_categories').select('id, name');
    const { data: existingDepts } = await supabase.from('departments').select('id, name');
    const { data: existingUsers } = await supabase.from('app_users').select('id').limit(1);

    const adminUserId = existingUsers?.[0]?.id || null;

    // Create sample categories if they don't exist
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and equipment' },
      { name: 'Furniture', description: 'Office furniture and seating' },
      { name: 'Vehicles', description: 'Company vehicles and transportation' }
    ];

    for (const category of categories) {
      if (!existingCats.find(c => c.name === category.name)) {
        const { error } = await supabase.from('asset_categories').insert(category);
        if (error) console.error('Error inserting category:', error);
        else console.log(`Added category: ${category.name}`);
      }
    }

    // Create sample departments if they don't exist
    const departments = [
      { name: 'IT Department', description: 'Information Technology' },
      { name: 'HR Department', description: 'Human Resources' },
      { name: 'Finance Department', description: 'Financial Operations' }
    ];

    for (const department of departments) {
      if (!existingDepts.find(d => d.name === department.name)) {
        const { error } = await supabase.from('departments').insert(department);
        if (error) console.error('Error inserting department:', error);
        else console.log(`Added department: ${department.name}`);
      }
    }

    // Get all categories and departments
    const { data: cats } = await supabase.from('asset_categories').select('id, name');
    const { data: depts } = await supabase.from('departments').select('id, name');

    // Create sample assets
    const assets = [
      {
        name: 'Dell Laptop',
        category_id: cats.find(c => c.name === 'Electronics')?.id,
        department_id: depts.find(d => d.name === 'IT Department')?.id,
        date_purchased: '2024-01-15',
        cost: 1200.00,
        created_by: adminUserId
      },
      {
        name: 'Office Desk',
        category_id: cats.find(c => c.name === 'Furniture')?.id,
        department_id: depts.find(d => d.name === 'HR Department')?.id,
        date_purchased: '2024-02-20',
        cost: 350.00,
        created_by: adminUserId
      },
      {
        name: 'Company Van',
        category_id: cats.find(c => c.name === 'Vehicles')?.id,
        department_id: depts.find(d => d.name === 'Finance Department')?.id,
        date_purchased: '2024-03-10',
        cost: 25000.00,
        created_by: adminUserId
      }
    ];

    for (const asset of assets) {
      const { error } = await supabase.from('assets').insert(asset);
      if (error) console.error('Error inserting asset:', error);
      else console.log(`Added asset: ${asset.name}`);
    }

    console.log('Sample data seeding completed!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData();