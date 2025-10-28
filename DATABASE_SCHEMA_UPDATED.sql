-- Esquema actualizado para trabajar con tu estructura existente
-- Basado en las tablas que ya tienes en Supabase

-- 1. Tabla de perfiles de usuario (ya existe)
-- create table profiles (
--   id uuid primary key default auth.uid(),
--   email text,
--   full_name text,
--   plan text default 'free', -- 'free' o 'premium'
--   created_at timestamptz default now()
-- );

-- 2. Tabla recetas (ya existe)
-- create table recipes (
--   id uuid primary key default gen_random_uuid(),
--   user_id uuid references profiles(id) on delete cascade,
--   title text not null,
--   description text,
--   steps text,
--   is_public boolean default true,
--   created_at timestamptz default now()
-- );

-- 3. Ingredientes (ya existe)
-- create table ingredients (
--   id uuid primary key default gen_random_uuid(),
--   name text not null
-- );

-- 4. Relación receta-ingrediente (ya existe)
-- create table recipe_ingredients (
--   recipe_id uuid references recipes(id) on delete cascade,
--   ingredient_id uuid references ingredients(id) on delete cascade,
--   quantity text,
--   primary key (recipe_id, ingredient_id)
-- );

-- 5. Favoritos (ya existe)
-- create table favorites (
--   user_id uuid references profiles(id) on delete cascade,
--   recipe_id uuid references recipes(id) on delete cascade,
--   primary key (user_id, recipe_id)
-- );

-- 6. Receta del día (ya existe)
-- create table recipe_daily (
--   date date primary key,
--   recipe_id uuid references recipes(id)
-- );

-- TABLAS ADICIONALES NECESARIAS PARA LAS FUNCIONALIDADES:

-- 7. Tabla de ingredientes del usuario (para la funcionalidad de selección)
CREATE TABLE IF NOT EXISTS user_ingredients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, ingredient_id)
);

-- 8. Tabla de comentarios (para usuarios premium)
CREATE TABLE IF NOT EXISTS comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  recipe_id uuid references recipes(id) on delete cascade,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. Tabla de ingredientes disponibles (categorías)
CREATE TABLE IF NOT EXISTS available_ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text default 'general'
);

-- POLÍTICAS DE SEGURIDAD (RLS)

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_ingredients ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

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

-- Políticas para user_ingredients
CREATE POLICY "Users can view own ingredients" ON user_ingredients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own ingredients" ON user_ingredients
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para comments
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para available_ingredients
CREATE POLICY "Anyone can view available ingredients" ON available_ingredients
  FOR SELECT USING (true);

-- DATOS DE EJEMPLO

-- Insertar ingredientes de ejemplo
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

-- Insertar ingredientes disponibles con categorías
INSERT INTO available_ingredients (name, category) VALUES 
  ('Tomate', 'vegetales'),
  ('Cebolla', 'vegetales'),
  ('Ajo', 'vegetales'),
  ('Aceite de oliva', 'condimentos'),
  ('Sal', 'condimentos'),
  ('Pimienta', 'condimentos'),
  ('Perejil', 'hierbas'),
  ('Orégano', 'hierbas'),
  ('Albahaca', 'hierbas'),
  ('Limón', 'frutas'),
  ('Zanahoria', 'vegetales'),
  ('Apio', 'vegetales'),
  ('Pimiento', 'vegetales'),
  ('Champiñones', 'vegetales'),
  ('Espinacas', 'vegetales'),
  ('Brócoli', 'vegetales'),
  ('Calabacín', 'vegetales'),
  ('Berenjena', 'vegetales'),
  ('Papa', 'vegetales'),
  ('Arroz', 'cereales')
ON CONFLICT DO NOTHING;

-- Insertar recetas de ejemplo
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

-- Insertar ingredientes para las recetas
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES 
  -- Para Ensalada de Tomate y Cebolla
  (
    (SELECT id FROM recipes WHERE title = 'Ensalada de Tomate y Cebolla' LIMIT 1),
    (SELECT id FROM ingredients WHERE name = 'Tomate' LIMIT 1),
    '2 unidades'
  ),
  (
    (SELECT id FROM recipes WHERE title = 'Ensalada de Tomate y Cebolla' LIMIT 1),
    (SELECT id FROM ingredients WHERE name = 'Cebolla' LIMIT 1),
    '1 unidad'
  ),
  (
    (SELECT id FROM recipes WHERE title = 'Ensalada de Tomate y Cebolla' LIMIT 1),
    (SELECT id FROM ingredients WHERE name = 'Aceite de oliva' LIMIT 1),
    '2 cucharadas'
  ),
  (
    (SELECT id FROM recipes WHERE title = 'Ensalada de Tomate y Cebolla' LIMIT 1),
    (SELECT id FROM ingredients WHERE name = 'Sal' LIMIT 1),
    'al gusto'
  ),
  -- Para Sopa de Verduras
  (
    (SELECT id FROM recipes WHERE title = 'Sopa de Verduras' LIMIT 1),
    (SELECT id FROM ingredients WHERE name = 'Zanahoria' LIMIT 1),
    '2 unidades'
  ),
  (
    (SELECT id FROM recipes WHERE title = 'Sopa de Verduras' LIMIT 1),
    (SELECT id FROM ingredients WHERE name = 'Apio' LIMIT 1),
    '2 tallos'
  ),
  (
    (SELECT id FROM recipes WHERE title = 'Sopa de Verduras' LIMIT 1),
    (SELECT id FROM ingredients WHERE name = 'Cebolla' LIMIT 1),
    '1 unidad'
  ),
  (
    (SELECT id FROM recipes WHERE title = 'Sopa de Verduras' LIMIT 1),
    (SELECT id FROM ingredients WHERE name = 'Aceite de oliva' LIMIT 1),
    '1 cucharada'
  ),
  (
    (SELECT id FROM recipes WHERE title = 'Sopa de Verduras' LIMIT 1),
    (SELECT id FROM ingredients WHERE name = 'Sal' LIMIT 1),
    'al gusto'
  ),
  (
    (SELECT id FROM recipes WHERE title = 'Sopa de Verduras' LIMIT 1),
    (SELECT id FROM ingredients WHERE name = 'Pimienta' LIMIT 1),
    'al gusto'
  )
ON CONFLICT DO NOTHING;

-- TRIGGERS

-- Trigger para actualizar updated_at en comments
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comments_updated_at 
  BEFORE UPDATE ON comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
