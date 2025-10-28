import { createClient } from '@supabase/supabase-js';

// Configuración directa para evitar problemas con variables de entorno
const supabaseUrl = 'https://askippbttqmzldbvtiij.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFza2lwcGJ0dHFtemxkYnZ0aWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzOTUwNjAsImV4cCI6MjA3Njk3MTA2MH0.V31b4EWV8UF_mj9Jji7zZocR8kc1pl1W6HRuEMWUDmE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
});


