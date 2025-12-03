// Seed script to add sample data
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntjrwuytloxrequjrceu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50anJ3dXl0bG94cmVxdWpyY2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTI0NzUsImV4cCI6MjA3OTk4ODQ3NX0.7tlGkIYW6I3siDrbHxBzYwB06HnoYiqKPYASRHPzlKM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  try {
    // Get existing categories and departments
    const { data: existingCats } = await supabase.from('asset_categories').select('id, name');
    const { data: existingDepts } = await supabase.from('departments').select('id, name');
    const { data: existingUsers } = await supabase.from('app_users').select('id').limit(1);

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

    // Create sample users if they don't exist
    const users = [
      { email: 'admin@eport.cloud', password: 'admin123', full_name: 'Admin User', role: 'admin', is_active: true },
      { email: 'user@eport.cloud', password: 'user123', full_name: 'Regular User', role: 'user', is_active: true },
    ];

    for (const user of users) {
      const { data: existingUser } = await supabase.from('app_users').select('id').eq('email', user.email).single();
      if (!existingUser) {
        const { error } = await supabase.from('app_users').insert(user);
        if (error) console.error('Error inserting user:', error);
        else console.log(`Added user: ${user.email}`);
      }
    }

    // Get admin user for assets
    const { data: adminUser } = await supabase.from('app_users').select('id').eq('email', 'admin@eport.cloud').single();
    let adminUserId = adminUser?.id || null;

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