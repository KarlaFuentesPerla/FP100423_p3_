-- Esquema de base de datos para app de recetas vegetarianas
-- Ejecutar estos comandos en el SQL Editor de Supabase

-- 1. Tabla de perfiles de usuario
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de recetas
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  prep_time INTEGER, -- en minutos
  cook_time INTEGER, -- en minutos
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  image_url TEXT,
  is_public BOOLEAN DEFAULT true,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de favoritos
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- 4. Tabla de comentarios (solo para usuarios premium)
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de ingredientes disponibles (para la funcionalidad de recetas aleatorias)
CREATE TABLE available_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT, -- vegetales, especias, granos, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla de ingredientes del usuario (para recetas aleatorias)
CREATE TABLE user_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES available_ingredients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ingredient_id)
);

-- Políticas de seguridad (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ingredients ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para recipes
CREATE POLICY "Anyone can view public recipes" ON recipes FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own recipes" ON recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recipes" ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recipes" ON recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipes" ON recipes FOR DELETE USING (auth.uid() = user_id);

-- Políticas para favorites
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Políticas para comments
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Políticas para available_ingredients
CREATE POLICY "Anyone can view ingredients" ON available_ingredients FOR SELECT USING (true);

-- Políticas para user_ingredients
CREATE POLICY "Users can view own ingredients" ON user_ingredients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ingredients" ON user_ingredients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own ingredients" ON user_ingredients FOR DELETE USING (auth.uid() = user_id);

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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insertar ingredientes básicos
INSERT INTO available_ingredients (name, category) VALUES
('Tomate', 'vegetales'),
('Cebolla', 'vegetales'),
('Ajo', 'vegetales'),
('Pimiento', 'vegetales'),
('Zanahoria', 'vegetales'),
('Brócoli', 'vegetales'),
('Espinaca', 'vegetales'),
('Champiñones', 'vegetales'),
('Papa', 'vegetales'),
('Calabacín', 'vegetales'),
('Arroz', 'granos'),
('Quinoa', 'granos'),
('Avena', 'granos'),
('Lentejas', 'legumbres'),
('Garbanzos', 'legumbres'),
('Frijoles', 'legumbres'),
('Tofu', 'proteínas'),
('Tempeh', 'proteínas'),
('Aceite de oliva', 'grasas'),
('Sal', 'condimentos'),
('Pimienta', 'condimentos'),
('Orégano', 'especias'),
('Albahaca', 'especias'),
('Comino', 'especias'),
('Cúrcuma', 'especias');

-- Insertar algunas recetas de ejemplo
INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, is_public) VALUES
('Ensalada de Quinoa', 'Una ensalada fresca y nutritiva con quinoa y vegetales', 
 ARRAY['Quinoa', 'Tomate', 'Cebolla', 'Aceite de oliva', 'Sal', 'Pimienta'],
 ARRAY['Cocinar la quinoa según las instrucciones del paquete', 'Cortar los tomates y cebolla en cubos', 'Mezclar todos los ingredientes', 'Aliñar con aceite de oliva, sal y pimienta'],
 15, 20, 2, 'easy', true),
 
('Curry de Lentejas', 'Un curry cremoso y especiado con lentejas', 
 ARRAY['Lentejas', 'Cebolla', 'Ajo', 'Tomate', 'Cúrcuma', 'Comino', 'Aceite de oliva', 'Sal'],
 ARRAY['Cocinar las lentejas hasta que estén tiernas', 'Sofreír la cebolla y el ajo', 'Agregar los tomates y especias', 'Incorporar las lentejas cocidas', 'Cocinar a fuego lento por 15 minutos'],
 20, 30, 4, 'medium', true),
 
('Tofu a la Plancha', 'Tofu marinado y cocinado a la plancha', 
 ARRAY['Tofu', 'Ajo', 'Aceite de oliva', 'Sal', 'Pimienta', 'Orégano'],
 ARRAY['Cortar el tofu en cubos', 'Marinar con ajo, aceite, sal, pimienta y orégano', 'Dejar marinar por 30 minutos', 'Cocinar a la plancha hasta dorar'],
 35, 15, 2, 'easy', true);
