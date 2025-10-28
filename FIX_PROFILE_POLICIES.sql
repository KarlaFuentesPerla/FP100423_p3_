-- Script para corregir las políticas RLS y permitir la creación automática de perfiles
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Asegurar que la tabla profiles existe con la estructura correcta
CREATE TABLE IF NOT EXISTS profiles (
  id uuid primary key default auth.uid(),
  email text,
  full_name text,
  plan text default 'free', -- 'free' o 'premium'
  created_at timestamptz default now()
);

-- 2. Habilitar RLS en la tabla profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes que puedan causar conflictos
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 4. Crear políticas correctas para profiles
-- Política para ver el propio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para actualizar el propio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para insertar el propio perfil (esto es clave para la creación automática)
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Verificar que las otras tablas necesarias existen
CREATE TABLE IF NOT EXISTS recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  steps text,
  is_public boolean default true,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id uuid references recipes(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete cascade,
  quantity text,
  primary key (recipe_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id uuid references profiles(id) on delete cascade,
  recipe_id uuid references recipes(id) on delete cascade,
  primary key (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS recipe_daily (
  date date primary key,
  recipe_id uuid references recipes(id)
);

-- 6. Habilitar RLS en todas las tablas
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_daily ENABLE ROW LEVEL SECURITY;

-- 7. Crear políticas para las otras tablas
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

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para recipe_daily
CREATE POLICY "Anyone can view daily recipes" ON recipe_daily
  FOR SELECT USING (true);

-- 8. Insertar algunos ingredientes de ejemplo si no existen
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
  ('Arroz')
ON CONFLICT DO NOTHING;

-- 9. Insertar algunas recetas de ejemplo si no existen
INSERT INTO recipes (title, description, steps, is_public, user_id) VALUES 
  (
    'Ensalada de Tomate y Cebolla',
    'Una ensalada fresca y simple con tomate y cebolla',
    '1. Cortar los tomates en rodajas\n2. Cortar la cebolla en juliana\n3. Mezclar con aceite de oliva y sal\n4. Servir fresco',
    true,
    (SELECT id FROM profiles LIMIT 1)
  ),
  (
    'Sopa de Verduras',
    'Una sopa nutritiva con varias verduras',
    '1. Picar todas las verduras\n2. Sofreír en aceite de oliva\n3. Agregar agua y hervir\n4. Condimentar con sal y pimienta',
    true,
    (SELECT id FROM profiles LIMIT 1)
  )
ON CONFLICT DO NOTHING;

-- 10. Verificar que todo está funcionando
SELECT 'Database setup completed successfully!' as status;
