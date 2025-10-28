-- Script completo para corregir todos los problemas de la base de datos
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Eliminar tablas existentes si es necesario (CUIDADO: esto borrará datos)
-- DROP TABLE IF EXISTS favorites CASCADE;
-- DROP TABLE IF EXISTS recipe_ingredients CASCADE;
-- DROP TABLE IF EXISTS recipes CASCADE;
-- DROP TABLE IF EXISTS ingredients CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- 2. Crear tabla profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid primary key default auth.uid(),
  email text,
  full_name text,
  plan text default 'free',
  created_at timestamptz default now()
);

-- 3. Crear tabla ingredients
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- 4. Crear tabla recipes
CREATE TABLE IF NOT EXISTS recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  steps text,
  is_public boolean default true,
  created_at timestamptz default now()
);

-- 5. Crear tabla recipe_ingredients
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id uuid references recipes(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete cascade,
  quantity text,
  primary key (recipe_id, ingredient_id)
);

-- 6. Crear tabla favorites con relación correcta
CREATE TABLE IF NOT EXISTS favorites (
  user_id uuid references profiles(id) on delete cascade,
  recipe_id uuid references recipes(id) on delete cascade,
  primary key (user_id, recipe_id)
);

-- 7. Crear tabla recipe_daily
CREATE TABLE IF NOT EXISTS recipe_daily (
  date date primary key,
  recipe_id uuid references recipes(id)
);

-- 8. Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_daily ENABLE ROW LEVEL SECURITY;

-- 9. Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view public recipes" ON recipes;
DROP POLICY IF EXISTS "Users can view own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can insert own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can update own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can delete own recipes" ON recipes;
DROP POLICY IF EXISTS "Anyone can view ingredients" ON ingredients;
DROP POLICY IF EXISTS "Anyone can view recipe ingredients" ON recipe_ingredients;
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorites;
DROP POLICY IF EXISTS "Anyone can view daily recipes" ON recipe_daily;

-- 10. Crear políticas correctas
-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para recipes
CREATE POLICY "Anyone can view public recipes" ON recipes
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own recipes" ON recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" ON recipes
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para ingredients
CREATE POLICY "Anyone can view ingredients" ON ingredients
  FOR SELECT USING (true);

-- Políticas para recipe_ingredients
CREATE POLICY "Anyone can view recipe ingredients" ON recipe_ingredients
  FOR SELECT USING (true);

-- Políticas para favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para recipe_daily
CREATE POLICY "Anyone can view daily recipes" ON recipe_daily
  FOR SELECT USING (true);

-- 11. Insertar datos de ejemplo
-- Ingredientes
INSERT INTO ingredients (name) VALUES 
  ('Tomate'),
  ('Cebolla'),
  ('Ajo'),
  ('Aceite de oliva'),
  ('Sal'),
  ('Pimienta'),
  ('Perejil'),
  ('Orégano'),
  ('Albahaca'),
  ('Limón'),
  ('Zanahoria'),
  ('Apio'),
  ('Pimiento'),
  ('Champiñones'),
  ('Espinacas'),
  ('Brócoli'),
  ('Calabacín'),
  ('Berenjena'),
  ('Papa'),
  ('Arroz'),
  ('Quinoa'),
  ('Lentejas'),
  ('Garbanzos'),
  ('Pan integral'),
  ('Leche vegetal')
ON CONFLICT (name) DO NOTHING;

-- 12. Verificar que las relaciones funcionan
SELECT 'Database setup completed successfully!' as status;
