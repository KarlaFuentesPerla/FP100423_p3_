-- Script para crear recetas de ejemplo con todos los ingredientes disponibles
-- Ejecutar este script en el SQL Editor de Supabase

-- Primero, vamos a obtener algunos IDs de usuarios de ejemplo
-- (Asumiendo que ya tienes algunos perfiles creados)
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Obtener un usuario de ejemplo o crear uno si no existe
    SELECT id INTO sample_user_id FROM profiles LIMIT 1;
    
    IF sample_user_id IS NULL THEN
        -- Crear un usuario de ejemplo
        INSERT INTO profiles (id, email, full_name, plan) 
        VALUES (gen_random_uuid(), 'demo@example.com', 'Usuario Demo', 'free')
        RETURNING id INTO sample_user_id;
    END IF;

    -- Crear recetas de ejemplo
    INSERT INTO recipes (id, user_id, title, description, steps, is_public) VALUES 
    -- Recetas con Tomate
    (gen_random_uuid(), sample_user_id, 'Ensalada de Tomate Fresco', 'Una ensalada simple y refrescante con tomates maduros', '1. Cortar los tomates en rodajas\n2. Agregar sal y aceite de oliva\n3. Dejar reposar 10 minutos\n4. Servir fresco', true),
    (gen_random_uuid(), sample_user_id, 'Sopa de Tomate', 'Sopa cremosa y reconfortante de tomate', '1. Sofreír cebolla y ajo\n2. Agregar tomates cortados\n3. Cocinar hasta que se deshagan\n4. Licuar y colar\n5. Servir caliente', true),
    (gen_random_uuid(), sample_user_id, 'Tomates Rellenos', 'Tomates rellenos de arroz y verduras', '1. Vaciar los tomates\n2. Rellenar con arroz cocido y verduras\n3. Hornear 30 minutos\n4. Servir caliente', true),
    
    -- Recetas con Cebolla
    (gen_random_uuid(), sample_user_id, 'Sopa de Cebolla', 'Sopa clásica de cebolla caramelizada', '1. Cortar cebollas en juliana\n2. Caramelizar lentamente\n3. Agregar caldo\n4. Cocinar 20 minutos\n5. Servir con pan tostado', true),
    (gen_random_uuid(), sample_user_id, 'Cebollas Asadas', 'Cebollas asadas con hierbas', '1. Cortar cebollas por la mitad\n2. Rociar con aceite de oliva\n3. Asar 45 minutos\n4. Servir caliente', true),
    
    -- Recetas con Ajo
    (gen_random_uuid(), sample_user_id, 'Pan de Ajo', 'Pan tostado con ajo y perejil', '1. Mezclar ajo picado con aceite\n2. Untar en pan\n3. Tostar en horno\n4. Espolvorear perejil\n5. Servir caliente', true),
    (gen_random_uuid(), sample_user_id, 'Salsa de Ajo', 'Salsa cremosa de ajo para pasta', '1. Sofreír ajo en aceite\n2. Agregar crema\n3. Cocinar hasta espesar\n4. Servir con pasta', true),
    
    -- Recetas con Aceite de Oliva
    (gen_random_uuid(), sample_user_id, 'Alioli Casero', 'Mayonesa de ajo con aceite de oliva', '1. Batir huevo con ajo\n2. Agregar aceite lentamente\n3. Batir hasta emulsionar\n4. Condimentar con sal', true),
    (gen_random_uuid(), sample_user_id, 'Vinagreta Simple', 'Aderezo básico para ensaladas', '1. Mezclar aceite con vinagre\n2. Agregar sal y pimienta\n3. Batir hasta emulsionar\n4. Usar inmediatamente', true),
    
    -- Recetas con Sal
    (gen_random_uuid(), sample_user_id, 'Agua Salada', 'Bebida isotónica natural', '1. Disolver sal en agua\n2. Agregar limón\n3. Refrigerar\n4. Servir frío', true),
    
    -- Recetas con Pimienta
    (gen_random_uuid(), sample_user_id, 'Pimienta Negra Molida', 'Condimento básico para cualquier plato', '1. Moler granos de pimienta\n2. Usar inmediatamente\n3. Almacenar en recipiente hermético', true),
    
    -- Recetas con Perejil
    (gen_random_uuid(), sample_user_id, 'Pesto de Perejil', 'Salsa verde con perejil fresco', '1. Licuar perejil con ajo\n2. Agregar aceite de oliva\n3. Incorporar nueces\n4. Condimentar con sal', true),
    (gen_random_uuid(), sample_user_id, 'Té de Perejil', 'Infusión depurativa de perejil', '1. Hervir agua\n2. Agregar perejil fresco\n3. Dejar reposar 5 minutos\n4. Colar y servir', true),
    
    -- Recetas con Orégano
    (gen_random_uuid(), sample_user_id, 'Aceite de Orégano', 'Aceite aromatizado con orégano', '1. Calentar aceite de oliva\n2. Agregar orégano seco\n3. Dejar enfriar\n4. Colar y envasar', true),
    (gen_random_uuid(), sample_user_id, 'Té de Orégano', 'Infusión digestiva de orégano', '1. Hervir agua\n2. Agregar orégano\n3. Dejar reposar 10 minutos\n4. Colar y beber', true),
    
    -- Recetas con Albahaca
    (gen_random_uuid(), sample_user_id, 'Pesto de Albahaca', 'Salsa italiana clásica', '1. Licuar albahaca con ajo\n2. Agregar piñones\n3. Incorporar aceite\n4. Condimentar con sal', true),
    (gen_random_uuid(), sample_user_id, 'Ensalada Caprese', 'Ensalada italiana con albahaca', '1. Cortar tomate en rodajas\n2. Agregar mozzarella\n3. Decorar con albahaca\n4. Rociar con aceite', true),
    
    -- Recetas con Limón
    (gen_random_uuid(), sample_user_id, 'Limonada Natural', 'Bebida refrescante de limón', '1. Exprimir limones\n2. Agregar agua\n3. Endulzar al gusto\n4. Servir con hielo', true),
    (gen_random_uuid(), sample_user_id, 'Té de Limón', 'Infusión cítrica y refrescante', '1. Hervir agua\n2. Agregar cáscara de limón\n3. Dejar reposar 5 minutos\n4. Colar y servir', true),
    
    -- Recetas con Zanahoria
    (gen_random_uuid(), sample_user_id, 'Zanahorias Glaseadas', 'Zanahorias dulces y tiernas', '1. Cortar zanahorias en bastones\n2. Cocinar con mantequilla\n3. Agregar azúcar\n4. Cocinar hasta caramelizar', true),
    (gen_random_uuid(), sample_user_id, 'Sopa de Zanahoria', 'Sopa cremosa de zanahoria', '1. Sofreír zanahorias\n2. Agregar caldo\n3. Cocinar hasta ablandar\n4. Licuar y colar', true),
    
    -- Recetas con Apio
    (gen_random_uuid(), sample_user_id, 'Apio con Mantequilla', 'Apio cocido con mantequilla', '1. Cortar apio en trozos\n2. Cocinar en agua\n3. Escurrir y agregar mantequilla\n4. Servir caliente', true),
    (gen_random_uuid(), sample_user_id, 'Sopa de Apio', 'Sopa ligera de apio', '1. Sofreír apio\n2. Agregar caldo\n3. Cocinar 20 minutos\n4. Licuar y servir', true),
    
    -- Recetas con Pimiento
    (gen_random_uuid(), sample_user_id, 'Pimientos Asados', 'Pimientos asados con ajo', '1. Asar pimientos enteros\n2. Pelar y cortar\n3. Agregar ajo\n4. Rociar con aceite', true),
    (gen_random_uuid(), sample_user_id, 'Ensalada de Pimientos', 'Ensalada colorida de pimientos', '1. Cortar pimientos en tiras\n2. Agregar aceite y vinagre\n3. Dejar marinar\n4. Servir fresco', true),
    
    -- Recetas con Champiñones
    (gen_random_uuid(), sample_user_id, 'Champiñones Salteados', 'Champiñones con ajo y perejil', '1. Limpiar champiñones\n2. Saltear con ajo\n3. Agregar perejil\n4. Servir caliente', true),
    (gen_random_uuid(), sample_user_id, 'Sopa de Champiñones', 'Sopa cremosa de champiñones', '1. Sofreír champiñones\n2. Agregar caldo\n3. Cocinar 15 minutos\n4. Licuar y colar', true),
    
    -- Recetas con Espinacas
    (gen_random_uuid(), sample_user_id, 'Espinacas Salteadas', 'Espinacas con ajo y limón', '1. Lavar espinacas\n2. Saltear con ajo\n3. Agregar jugo de limón\n4. Servir caliente', true),
    (gen_random_uuid(), sample_user_id, 'Sopa de Espinacas', 'Sopa verde de espinacas', '1. Sofreír espinacas\n2. Agregar caldo\n3. Cocinar 10 minutos\n4. Licuar y servir', true),
    
    -- Recetas con Brócoli
    (gen_random_uuid(), sample_user_id, 'Brócoli al Vapor', 'Brócoli cocido al vapor', '1. Cortar brócoli en floretes\n2. Cocinar al vapor\n3. Rociar con aceite\n4. Servir caliente', true),
    (gen_random_uuid(), sample_user_id, 'Sopa de Brócoli', 'Sopa cremosa de brócoli', '1. Cocinar brócoli\n2. Agregar caldo\n3. Licuar hasta cremoso\n4. Servir caliente', true),
    
    -- Recetas con Calabacín
    (gen_random_uuid(), sample_user_id, 'Calabacín a la Plancha', 'Calabacín asado con hierbas', '1. Cortar calabacín en rodajas\n2. Asar en plancha\n3. Agregar hierbas\n4. Servir caliente', true),
    (gen_random_uuid(), sample_user_id, 'Sopa de Calabacín', 'Sopa ligera de calabacín', '1. Sofreír calabacín\n2. Agregar caldo\n3. Cocinar 15 minutos\n4. Licuar y servir', true),
    
    -- Recetas con Berenjena
    (gen_random_uuid(), sample_user_id, 'Berenjena Asada', 'Berenjena asada con ajo', '1. Cortar berenjena\n2. Asar en horno\n3. Agregar ajo\n4. Rociar con aceite', true),
    (gen_random_uuid(), sample_user_id, 'Baba Ganoush', 'Pasta de berenjena árabe', '1. Asar berenjena\n2. Pelar y triturar\n3. Agregar tahini\n4. Condimentar con limón', true),
    
    -- Recetas con Papa
    (gen_random_uuid(), sample_user_id, 'Papas Asadas', 'Papas asadas con hierbas', '1. Cortar papas\n2. Rociar con aceite\n3. Asar 45 minutos\n4. Agregar hierbas', true),
    (gen_random_uuid(), sample_user_id, 'Puré de Papas', 'Puré cremoso de papas', '1. Cocinar papas\n2. Triturar con mantequilla\n3. Agregar leche\n4. Condimentar con sal', true),
    
    -- Recetas con Arroz
    (gen_random_uuid(), sample_user_id, 'Arroz Blanco', 'Arroz básico cocido', '1. Lavar arroz\n2. Cocinar en agua\n3. Dejar reposar\n4. Servir caliente', true),
    (gen_random_uuid(), sample_user_id, 'Arroz con Verduras', 'Arroz con verduras mixtas', '1. Sofreír verduras\n2. Agregar arroz\n3. Cocinar con caldo\n4. Servir caliente', true),
    
    -- Recetas con Quinoa
    (gen_random_uuid(), sample_user_id, 'Quinoa Básica', 'Quinoa cocida simple', '1. Lavar quinoa\n2. Cocinar en agua\n3. Dejar reposar\n4. Servir caliente', true),
    (gen_random_uuid(), sample_user_id, 'Ensalada de Quinoa', 'Ensalada fresca de quinoa', '1. Cocinar quinoa\n2. Enfriar\n3. Agregar verduras\n4. Condimentar', true),
    
    -- Recetas con Lentejas
    (gen_random_uuid(), sample_user_id, 'Lentejas Guisadas', 'Lentejas con verduras', '1. Sofreír verduras\n2. Agregar lentejas\n3. Cocinar con caldo\n4. Servir caliente', true),
    (gen_random_uuid(), sample_user_id, 'Sopa de Lentejas', 'Sopa espesa de lentejas', '1. Cocinar lentejas\n2. Agregar verduras\n3. Cocinar 30 minutos\n4. Servir caliente', true),
    
    -- Recetas con Garbanzos
    (gen_random_uuid(), sample_user_id, 'Hummus', 'Pasta de garbanzos', '1. Cocinar garbanzos\n2. Licuar con tahini\n3. Agregar limón\n4. Condimentar', true),
    (gen_random_uuid(), sample_user_id, 'Garbanzos Salteados', 'Garbanzos con especias', '1. Sofreír garbanzos\n2. Agregar especias\n3. Cocinar 10 minutos\n4. Servir caliente', true),
    
    -- Recetas con Pan Integral
    (gen_random_uuid(), sample_user_id, 'Tostadas Integrales', 'Pan tostado con aceite', '1. Tostar pan\n2. Rociar con aceite\n3. Agregar sal\n4. Servir caliente', true),
    (gen_random_uuid(), sample_user_id, 'Bruschetta', 'Pan tostado con tomate', '1. Tostar pan\n2. Agregar tomate\n3. Rociar con aceite\n4. Servir fresco', true),
    
    -- Recetas con Leche Vegetal
    (gen_random_uuid(), sample_user_id, 'Smoothie Verde', 'Batido con leche vegetal', '1. Licuar espinacas\n2. Agregar leche vegetal\n3. Endulzar\n4. Servir frío', true),
    (gen_random_uuid(), sample_user_id, 'Avena con Leche', 'Desayuno con avena', '1. Cocinar avena\n2. Agregar leche vegetal\n3. Endulzar\n4. Servir caliente', true),
    
    -- Recetas con Azúcar
    (gen_random_uuid(), sample_user_id, 'Caramelo Simple', 'Caramelo básico', '1. Calentar azúcar\n2. Agregar agua\n3. Cocinar hasta dorar\n4. Dejar enfriar', true),
    
    -- Recetas con Harina
    (gen_random_uuid(), sample_user_id, 'Pan Casero', 'Pan básico de harina', '1. Mezclar harina con agua\n2. Amasar\n3. Dejar leudar\n4. Hornear', true),
    
    -- Recetas con Nueces
    (gen_random_uuid(), sample_user_id, 'Nueces Tostadas', 'Nueces tostadas con sal', '1. Tostar nueces\n2. Agregar sal\n3. Dejar enfriar\n4. Servir', true),
    
    -- Recetas con Semillas
    (gen_random_uuid(), sample_user_id, 'Granola Casera', 'Mezcla de semillas y frutos', '1. Mezclar semillas\n2. Agregar miel\n3. Tostar en horno\n4. Dejar enfriar', true),
    
    -- Recetas con Salsa de Soya
    (gen_random_uuid(), sample_user_id, 'Arroz con Salsa de Soya', 'Arroz oriental con salsa', '1. Cocinar arroz\n2. Agregar salsa de soya\n3. Mezclar bien\n4. Servir caliente', true);

    -- Ahora vamos a agregar los ingredientes a las recetas
    -- Primero, vamos a obtener los IDs de las recetas y ingredientes
    WITH recipe_ingredients_data AS (
        SELECT 
            r.id as recipe_id,
            i.id as ingredient_id,
            CASE 
                WHEN r.title LIKE '%Tomate%' AND i.name = 'Tomate' THEN '2 unidades'
                WHEN r.title LIKE '%Cebolla%' AND i.name = 'Cebolla' THEN '1 unidad'
                WHEN r.title LIKE '%Ajo%' AND i.name = 'Ajo' THEN '2 dientes'
                WHEN r.title LIKE '%Aceite%' AND i.name = 'Aceite de oliva' THEN '2 cucharadas'
                WHEN r.title LIKE '%Sal%' AND i.name = 'Sal' THEN 'al gusto'
                WHEN r.title LIKE '%Pimienta%' AND i.name = 'Pimienta' THEN 'al gusto'
                WHEN r.title LIKE '%Perejil%' AND i.name = 'Perejil' THEN '1 rama'
                WHEN r.title LIKE '%Orégano%' AND i.name = 'Orégano' THEN '1 cucharadita'
                WHEN r.title LIKE '%Albahaca%' AND i.name = 'Albahaca' THEN '5 hojas'
                WHEN r.title LIKE '%Limón%' AND i.name = 'Limón' THEN '1 unidad'
                WHEN r.title LIKE '%Zanahoria%' AND i.name = 'Zanahoria' THEN '2 unidades'
                WHEN r.title LIKE '%Apio%' AND i.name = 'Apio' THEN '2 tallos'
                WHEN r.title LIKE '%Pimiento%' AND i.name = 'Pimiento' THEN '1 unidad'
                WHEN r.title LIKE '%Champiñones%' AND i.name = 'Champiñones' THEN '200g'
                WHEN r.title LIKE '%Espinacas%' AND i.name = 'Espinacas' THEN '200g'
                WHEN r.title LIKE '%Brócoli%' AND i.name = 'Brócoli' THEN '1 cabeza'
                WHEN r.title LIKE '%Calabacín%' AND i.name = 'Calabacín' THEN '2 unidades'
                WHEN r.title LIKE '%Berenjena%' AND i.name = 'Berenjena' THEN '1 unidad'
                WHEN r.title LIKE '%Papa%' AND i.name = 'Papa' THEN '4 unidades'
                WHEN r.title LIKE '%Arroz%' AND i.name = 'Arroz' THEN '1 taza'
                WHEN r.title LIKE '%Quinoa%' AND i.name = 'Quinoa' THEN '1 taza'
                WHEN r.title LIKE '%Lentejas%' AND i.name = 'Lentejas' THEN '1 taza'
                WHEN r.title LIKE '%Garbanzos%' AND i.name = 'Garbanzos' THEN '1 taza'
                WHEN r.title LIKE '%Pan%' AND i.name = 'Pan integral' THEN '4 rebanadas'
                WHEN r.title LIKE '%Leche%' AND i.name = 'Leche vegetal' THEN '1 taza'
                WHEN r.title LIKE '%Azúcar%' AND i.name = 'Azúcar' THEN '2 cucharadas'
                WHEN r.title LIKE '%Harina%' AND i.name = 'Harina' THEN '2 tazas'
                WHEN r.title LIKE '%Nueces%' AND i.name = 'Nueces' THEN '50g'
                WHEN r.title LIKE '%Semillas%' AND i.name = 'Semillas' THEN '2 cucharadas'
                WHEN r.title LIKE '%Salsa%' AND i.name = 'Salsa de soya' THEN '2 cucharadas'
                ELSE NULL
            END as quantity
        FROM recipes r
        CROSS JOIN ingredients i
        WHERE r.is_public = true
        AND (
            (r.title LIKE '%Tomate%' AND i.name = 'Tomate') OR
            (r.title LIKE '%Cebolla%' AND i.name = 'Cebolla') OR
            (r.title LIKE '%Ajo%' AND i.name = 'Ajo') OR
            (r.title LIKE '%Aceite%' AND i.name = 'Aceite de oliva') OR
            (r.title LIKE '%Sal%' AND i.name = 'Sal') OR
            (r.title LIKE '%Pimienta%' AND i.name = 'Pimienta') OR
            (r.title LIKE '%Perejil%' AND i.name = 'Perejil') OR
            (r.title LIKE '%Orégano%' AND i.name = 'Orégano') OR
            (r.title LIKE '%Albahaca%' AND i.name = 'Albahaca') OR
            (r.title LIKE '%Limón%' AND i.name = 'Limón') OR
            (r.title LIKE '%Zanahoria%' AND i.name = 'Zanahoria') OR
            (r.title LIKE '%Apio%' AND i.name = 'Apio') OR
            (r.title LIKE '%Pimiento%' AND i.name = 'Pimiento') OR
            (r.title LIKE '%Champiñones%' AND i.name = 'Champiñones') OR
            (r.title LIKE '%Espinacas%' AND i.name = 'Espinacas') OR
            (r.title LIKE '%Brócoli%' AND i.name = 'Brócoli') OR
            (r.title LIKE '%Calabacín%' AND i.name = 'Calabacín') OR
            (r.title LIKE '%Berenjena%' AND i.name = 'Berenjena') OR
            (r.title LIKE '%Papa%' AND i.name = 'Papa') OR
            (r.title LIKE '%Arroz%' AND i.name = 'Arroz') OR
            (r.title LIKE '%Quinoa%' AND i.name = 'Quinoa') OR
            (r.title LIKE '%Lentejas%' AND i.name = 'Lentejas') OR
            (r.title LIKE '%Garbanzos%' AND i.name = 'Garbanzos') OR
            (r.title LIKE '%Pan%' AND i.name = 'Pan integral') OR
            (r.title LIKE '%Leche%' AND i.name = 'Leche vegetal') OR
            (r.title LIKE '%Azúcar%' AND i.name = 'Azúcar') OR
            (r.title LIKE '%Harina%' AND i.name = 'Harina') OR
            (r.title LIKE '%Nueces%' AND i.name = 'Nueces') OR
            (r.title LIKE '%Semillas%' AND i.name = 'Semillas') OR
            (r.title LIKE '%Salsa%' AND i.name = 'Salsa de soya')
        )
    )
    INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
    SELECT recipe_id, ingredient_id, quantity
    FROM recipe_ingredients_data
    WHERE quantity IS NOT NULL
    ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;

END $$;

-- Verificar que las recetas se crearon correctamente
SELECT 'Recetas creadas exitosamente!' as status;
SELECT COUNT(*) as total_recetas FROM recipes WHERE is_public = true;
SELECT COUNT(*) as total_ingredientes FROM ingredients;
SELECT COUNT(*) as total_relaciones FROM recipe_ingredients;
