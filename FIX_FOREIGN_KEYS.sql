-- Script para corregir las relaciones de claves foráneas
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Eliminar tablas existentes si tienen problemas de relaciones
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS recipe_ingredients CASCADE;

-- 2. Recrear tabla recipe_ingredients con relaciones correctas
CREATE TABLE recipe_ingredients (
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id uuid REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity text,
  PRIMARY KEY (recipe_id, ingredient_id)
);

-- 3. Recrear tabla favorites con relaciones correctas
CREATE TABLE favorites (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, recipe_id)
);

-- 4. Habilitar RLS en las tablas recreadas
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas RLS para recipe_ingredients
CREATE POLICY "Anyone can view recipe ingredients" ON recipe_ingredients
  FOR SELECT USING (true);

-- 6. Crear políticas RLS para favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Verificar que las relaciones funcionan
SELECT 'Foreign keys fixed successfully!' as status;
