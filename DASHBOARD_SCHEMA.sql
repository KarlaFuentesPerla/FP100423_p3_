-- Esquema actualizado para el Dashboard con estética tierna
-- Basado en tu estructura existente + mejoras para el Dashboard

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

-- TABLAS ADICIONALES PARA EL DASHBOARD:

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

-- 9. Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text default 'info', -- 'info', 'success', 'warning', 'error'
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 10. Tabla de categorías de recetas
CREATE TABLE IF NOT EXISTS recipe_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text,
  color text default '#E48FB4'
);

-- 11. Agregar columna type a recipes si no existe
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS type text default 'general';
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS prep_time integer default 15;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS cook_time integer default 30;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS servings integer default 4;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS difficulty text default 'easy';

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
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_categories ENABLE ROW LEVEL SECURITY;

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

-- Políticas para notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para recipe_categories
CREATE POLICY "Anyone can view recipe categories" ON recipe_categories
  FOR SELECT USING (true);

-- DATOS DE EJEMPLO

-- Insertar categorías de recetas
INSERT INTO recipe_categories (name, icon, color) VALUES 
  ('Desayuno', '🌅', '#FFB6C1'),
  ('Almuerzo', '🌞', '#98FB98'),
  ('Cena', '🌙', '#DDA0DD'),
  ('Snack', '🍿', '#F0E68C'),
  ('Postre', '🍰', '#FFA07A'),
  ('Bebida', '🥤', '#87CEEB')
ON CONFLICT (name) DO NOTHING;

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
  ('Arroz'),
  ('Quinoa'),
  ('Lentejas'),
  ('Garbanzos'),
  ('Pan integral'),
  ('Leche vegetal'),
  ('Azúcar'),
  ('Harina'),
  ('Nueces'),
  ('Semillas'),
  ('Salsa de soya')
ON CONFLICT DO NOTHING;

-- Insertar recetas de ejemplo con tipos
INSERT INTO recipes (title, description, steps, type, prep_time, cook_time, servings, difficulty, is_public, user_id) VALUES 
  (
    'Ensalada de Tomate y Cebolla',
    'Una ensalada fresca y simple con tomate y cebolla',
    '1. Cortar los tomates en rodajas\n2. Cortar la cebolla en juliana\n3. Mezclar con aceite de oliva y sal\n4. Servir fresco',
    'almuerzo',
    10,
    0,
    2,
    'easy',
    true,
    (SELECT id FROM profiles LIMIT 1)
  ),
  (
    'Sopa de Verduras',
    'Una sopa nutritiva con varias verduras',
    '1. Picar todas las verduras\n2. Sofreír en aceite de oliva\n3. Agregar agua y hervir\n4. Condimentar con sal y pimienta',
    'cena',
    15,
    30,
    4,
    'easy',
    true,
    (SELECT id FROM profiles LIMIT 1)
  ),
  (
    'Smoothie de Frutas',
    'Bebida refrescante con frutas frescas',
    '1. Lavar y cortar las frutas\n2. Agregar leche vegetal\n3. Licuar hasta obtener consistencia suave\n4. Servir frío',
    'desayuno',
    5,
    0,
    1,
    'easy',
    true,
    (SELECT id FROM profiles LIMIT 1)
  ),
  (
    'Hummus Casero',
    'Dip cremoso de garbanzos',
    '1. Cocinar los garbanzos\n2. Procesar con tahini y limón\n3. Agregar ajo y sal\n4. Servir con pan integral',
    'snack',
    20,
    0,
    6,
    'medium',
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

-- FUNCIONES ÚTILES

-- Función para buscar recetas por coincidencias de ingredientes
CREATE OR REPLACE FUNCTION recipes_by_ingredient_matches(ingredient_ids uuid[])
RETURNS TABLE(recipe_id uuid, title text, description text, matches int) 
LANGUAGE sql AS $$
  SELECT r.id, r.title, r.description, count(*) as matches
  FROM recipes r
  JOIN recipe_ingredients ri ON ri.recipe_id = r.id
  WHERE ri.ingredient_id = ANY (ingredient_ids)
  AND r.is_public = true
  GROUP BY r.id, r.title, r.description
  ORDER BY matches DESC, r.created_at DESC;
$$;

-- Función para obtener receta del día
CREATE OR REPLACE FUNCTION get_daily_recipe()
RETURNS TABLE(recipe_id uuid, title text, description text, steps text, type text) 
LANGUAGE sql AS $$
  SELECT r.id, r.title, r.description, r.steps, r.type
  FROM recipes r
  WHERE r.is_public = true
  ORDER BY RANDOM()
  LIMIT 1;
$$;

