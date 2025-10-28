// Script para crear usuario de prueba con plan premium
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTestUser() {
  try {
    // Crear usuario de prueba
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'premium@test.com',
      password: 'password123',
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return;
    }

    console.log('Usuario creado:', authData.user?.id);

    // Crear perfil con plan premium
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: 'premium@test.com',
        full_name: 'Usuario Premium',
        plan: 'premium'
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return;
    }

    console.log('Perfil creado con plan premium');
    console.log('Email: premium@test.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error:', error);
  }
}

setupTestUser();
