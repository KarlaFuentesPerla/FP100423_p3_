-- ===========================================
-- RECETAS VEGETARIANAS - DATABASE SETUP
-- ===========================================
-- 
-- Este archivo contiene la configuración completa de la base de datos
-- para la aplicación Recetas Vegetarianas.
--
-- IMPORTANTE: Ejecuta estos scripts en el orden indicado en Supabase SQL Editor
--
-- ===========================================

-- 1. CREAR TABLAS PRINCIPALES
-- ===========================================

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recetas
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  steps TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ingredientes
CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de relación recetas-ingredientes
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity TEXT NOT NULL,
  UNIQUE(recipe_id, ingredient_id)
);

-- Tabla de favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- ===========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 3. CREAR POLÍTICAS DE SEGURIDAD
-- ===========================================

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

-- 4. CREAR FUNCIONES AUXILIARES
-- ===========================================

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. INSERTAR DATOS INICIALES
-- ===========================================

-- Insertar ingredientes básicos
INSERT INTO ingredients (name) VALUES
('Aceite de oliva'),
('Aceite vegetal'),
('Zanahoria'),
('Cebolla'),
('Ajo'),
('Tomate'),
('Lechuga'),
('Pepino'),
('Pimiento'),
('Limón'),
('Lima'),
('Perejil'),
('Cilantro'),
('Albahaca'),
('Orégano'),
('Sal'),
('Pimienta'),
('Comino'),
('Paprika'),
('Cúrcuma'),
('Jengibre'),
('Ajo en polvo'),
('Cebolla en polvo'),
('Vinagre'),
('Vinagre balsámico'),
('Salsa de soja'),
('Miso'),
('Tahini'),
('Aguacate'),
('Pan blanco'),
('Avena'),
('Arroz'),
('Miel'),
('Azúcar'),
('Canela'),
('Vainilla'),
('Coco rallado'),
('Nueces'),
('Almendras'),
('Pistachos'),
('Semillas de chía'),
('Semillas de girasol'),
('Semillas de sésamo'),
('Quinoa'),
('Lentejas'),
('Garbanzos'),
('Frijoles'),
('Tofu'),
('Tempeh'),
('Leche de almendras'),
('Leche de coco'),
('Yogur griego')
ON CONFLICT (name) DO NOTHING;

-- Insertar recetas de ejemplo
INSERT INTO recipes (title, description, steps, is_public) VALUES
('Ensalada Simple', 'Ensalada básica con pocos ingredientes', '1. Lava y corta la lechuga y el tomate. 2. Mezcla con aceite de oliva y sal.', true),
('Pan Tostado con Tomate', 'Desayuno simple y saludable', '1. Tosta el pan. 2. Frota tomate y añade aceite de oliva y sal.', true),
('Avena con Miel', 'Desayuno nutritivo y simple', '1. Cocina la avena con agua. 2. Añade miel y un chorrito de limón.', true),
('Té con Limón', 'Bebida refrescante y simple', '1. Prepara té. 2. Añade rodajas de limón y miel al gusto.', true),
('Zanahorias Glaseadas', 'Acompañamiento dulce y simple', '1. Cocina las zanahorias. 2. Glasea con miel y aceite de oliva.', true);

-- Insertar ingredientes para las recetas de ejemplo
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
-- Ensalada Simple (ID: 1)
(1, 7, '1 cabeza'), -- Lechuga
(1, 6, '2 unidades'), -- Tomate
(1, 1, '2 cucharadas'), -- Aceite de oliva
-- Pan Tostado con Tomate (ID: 2)
(2, 30, '2 rebanadas'), -- Pan blanco
(2, 6, '1 unidad'), -- Tomate
(2, 1, '1 cucharada'), -- Aceite de oliva
-- Avena con Miel (ID: 3)
(3, 31, '1 taza'), -- Avena
(3, 33, '2 cucharadas'), -- Miel
(3, 10, '1 chorrito'), -- Limón
-- Té con Limón (ID: 4)
(4, 10, '1 rodaja'), -- Limón
(4, 33, '1 cucharadita'), -- Miel
-- Zanahorias Glaseadas (ID: 5)
(5, 3, '4 medianas'), -- Zanahoria
(5, 33, '2 cucharadas'), -- Miel
(5, 1, '1 cucharada'); -- Aceite de oliva

-- ===========================================
-- CONFIGURACIÓN COMPLETADA
-- ===========================================
-- 
-- Tu base de datos está lista para usar con la aplicación.
-- 
-- Próximos pasos:
-- 1. Configura las variables de entorno en tu archivo .env
-- 2. Ejecuta la aplicación con: npm start
-- 3. ¡Disfruta cocinando! 🥗
--
-- ===========================================
