import { createClient } from '@supabase/supabase-js';


// Initialize the database client
const supabaseUrl = 'https://uhwasesfjdjdtvpensba.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjRjMDAwOTAxLWNjMTUtNDFlMC1hNmYwLWM1NTA1MWNjMzhmNCJ9.eyJwcm9qZWN0SWQiOiJ1aHdhc2VzZmpkamR0dnBlbnNiYSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY0NTMwMjA5LCJleHAiOjIwNzk4OTAyMDksImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.2ioBuiODahy8MKmSWfrQe8FkV4RmD1JjGZPEQO51Y1A';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase }