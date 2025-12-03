import { createClient } from '@supabase/supabase-js';


// Initialize the database client
const supabaseUrl = 'https://ntjrwuytloxrequjrceu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50anJ3dXl0bG94cmVxdWpyY2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTI0NzUsImV4cCI6MjA3OTk4ODQ3NX0.7tlGkIYW6I3siDrbHxBzYwB06HnoYiqKPYASRHPzlKM';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase }