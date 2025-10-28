import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useProfile } from './useProfile';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  image_url?: string;
  is_public: boolean;
  user_id: string;
  created_at: string;
}

interface UserIngredient {
  id: number;
  name: string;
  category: string;
}

export const useRandomRecipe = () => {
  const [randomRecipe, setRandomRecipe] = useState<Recipe | null>(null);
  const [userIngredients, setUserIngredients] = useState<UserIngredient[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<UserIngredient[]>([]);
  const [ingredientsLoaded, setIngredientsLoaded] = useState(false);
  const [matchingRecipes, setMatchingRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile, isPremium, isFree } = useProfile();

  useEffect(() => {
    loadAvailableIngredients();
  }, []);

  useEffect(() => {
    loadUserIngredients();
  }, [profile]);

  const loadUserIngredients = async () => {
    try {
      // Por ahora, simular ingredientes del usuario
      // En tu esquema actual no hay tabla user_ingredients
      // Podrías crear una tabla user_ingredients si necesitas esta funcionalidad
      setUserIngredients([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadAvailableIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('id, name')
        .order('name');

      if (error) {
        setError(error.message);
        setAvailableIngredients([]);
        return;
      }

      const ingredients = data?.map(item => ({
        id: parseInt(item.id),
        name: item.name,
        category: 'general'
      })) || [];

      setAvailableIngredients(ingredients);
      setIngredientsLoaded(true);
    } catch (err: any) {
      setError(err.message);
      setAvailableIngredients([]);
    }
  };

  const generateRandomRecipe = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener todas las recetas públicas
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          id,
          title,
          description,
          steps
        `)
        .eq('is_public', true);

      if (recipesError) {
        console.error('Error cargando recetas:', recipesError);
        setError(recipesError.message);
        setRandomRecipe(null);
        return;
      }

      if (!recipes || recipes.length === 0) {
        setError('No hay recetas disponibles');
        setRandomRecipe(null);
        return;
      }

      // Seleccionar receta aleatoria
      const randomIndex = Math.floor(Math.random() * recipes.length);
      const selectedRecipe = recipes[randomIndex];

      // Obtener ingredientes de la receta por separado
      const { data: recipeIngredients, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select(`
          quantity,
          ingredients(name)
        `)
        .eq('recipe_id', selectedRecipe.id);

      if (ingredientsError) {
        console.error('Error cargando ingredientes:', ingredientsError);
      }

      // Transformar la receta al formato esperado
      const transformedRecipe = {
        id: selectedRecipe.id.toString(),
        title: selectedRecipe.title,
        description: selectedRecipe.description,
        ingredients: recipeIngredients ? recipeIngredients.map(ri => 
          `${ri.quantity || ''} ${ri.ingredients?.name || ''}`.trim()
        ) : [],
        instructions: selectedRecipe.steps ? selectedRecipe.steps.split('\n').filter(step => step.trim()) : [],
        prep_time: 15, // Valor por defecto
        cook_time: 30, // Valor por defecto
        servings: 4, // Valor por defecto
        difficulty: 'easy' as const, // Valor por defecto
        is_public: true,
        user_id: selectedRecipe.user_id?.toString() || '',
        created_at: new Date().toISOString()
      };

      setRandomRecipe(transformedRecipe);
    } catch (err: any) {
      console.error('Error inesperado generando receta:', err);
      setError(err.message);
      setRandomRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = async (ingredientId: number) => {
    try {
      // Por ahora, simular agregar ingrediente
      // En tu esquema actual no hay tabla user_ingredients
      const ingredient = availableIngredients.find(ing => ing.id === ingredientId);
      if (ingredient && canAddMoreIngredients()) {
        setUserIngredients(prev => [...prev, ingredient]);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const removeIngredient = async (ingredientId: number) => {
    try {
      // Por ahora, simular quitar ingrediente
      setUserIngredients(prev => prev.filter(ing => ing.id !== ingredientId));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const getMaxIngredients = () => {
    return isPremium() ? 10 : 3;
  };

  const canAddMoreIngredients = () => {
    return userIngredients.length < getMaxIngredients();
  };

  const searchRecipesByIngredients = async () => {
    console.log('searchRecipesByIngredients ejecutándose');
    if (userIngredients.length === 0) {
      console.log('No hay ingredientes del usuario, limpiando recetas');
      setMatchingRecipes([]);
      return;
    }

    try {
      console.log('Iniciando búsqueda de recetas...');
      setSearchLoading(true);
      setError(null);

      const ingredientIds = userIngredients.map(ing => ing.id);
      console.log('IDs de ingredientes a buscar:', ingredientIds);

      // Buscar recetas que contengan al menos uno de los ingredientes seleccionados
      const { data: recipeIds, error: recipeIdsError } = await supabase
        .from('recipe_ingredients')
        .select('recipe_id')
        .in('ingredient_id', ingredientIds);

      if (recipeIdsError) {
        console.error('Error buscando IDs de recetas:', recipeIdsError);
        setError(recipeIdsError.message);
        setMatchingRecipes([]);
        return;
      }

      if (!recipeIds || recipeIds.length === 0) {
        console.log('No se encontraron recetas con esos ingredientes');
        setMatchingRecipes([]);
        return;
      }

      const uniqueRecipeIds = [...new Set(recipeIds.map(ri => ri.recipe_id))];
      console.log('IDs únicos de recetas encontradas:', uniqueRecipeIds);

      // Obtener las recetas
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          id,
          title,
          description,
          steps
        `)
        .eq('is_public', true)
        .in('id', uniqueRecipeIds);

      if (recipesError) {
        console.error('Error buscando recetas:', recipesError);
        setError(recipesError.message);
        setMatchingRecipes([]);
        return;
      }

      if (!recipes || recipes.length === 0) {
        setMatchingRecipes([]);
        return;
      }

      // Transformar las recetas y obtener ingredientes por separado
      console.log('Transformando', recipes.length, 'recetas...');
      const transformedRecipes = await Promise.all(
        recipes.map(async (recipe) => {
          console.log('Procesando receta:', recipe.id, recipe.title);
          // Obtener ingredientes de la receta
          const { data: recipeIngredients, error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .select(`
              quantity,
              ingredients(name)
            `)
            .eq('recipe_id', recipe.id);

          if (ingredientsError) {
            console.error('Error cargando ingredientes para receta:', recipe.id, ingredientsError);
          }

          const ingredients = recipeIngredients ? recipeIngredients.map(ri => 
            `${ri.quantity || ''} ${ri.ingredients?.name || ''}`.trim()
          ) : [];

          console.log('Receta', recipe.id, 'tiene', ingredients.length, 'ingredientes:', ingredients);

          return {
            id: recipe.id.toString(),
            title: recipe.title,
            description: recipe.description,
            ingredients,
            instructions: recipe.steps ? recipe.steps.split('\n').filter(step => step.trim()) : [],
            prep_time: 15,
            cook_time: 30,
            servings: 4,
            difficulty: 'easy' as const,
            is_public: true,
            user_id: recipe.user_id?.toString() || '',
            created_at: new Date().toISOString()
          };
        })
      );

      // Filtrar y ordenar por coincidencias (más flexible)
      console.log('Filtrando recetas por coincidencias...');
      console.log('Recetas antes del filtro:', transformedRecipes.length);
      
      const filteredRecipes = transformedRecipes
        .map(recipe => {
          // Calcular coincidencias para cada receta
          const matches = recipe.ingredients.filter(ing => 
            userIngredients.some(ui => ing.toLowerCase().includes(ui.name.toLowerCase()))
          ).length;
          
          console.log(`Receta ${recipe.id} (${recipe.title}): ${recipe.ingredients.length} ingredientes total, ${matches} coincidencias`);
          
          return { ...recipe, matches };
        })
        .filter(recipe => recipe.matches > 0) // Solo recetas con al menos 1 coincidencia
        .sort((a, b) => b.matches - a.matches); // Ordenar por coincidencias (mayor a menor)

      console.log('Recetas finales encontradas:', filteredRecipes.length);
      setMatchingRecipes(filteredRecipes);
    } catch (err: any) {
      console.error('Error inesperado buscando recetas:', err);
      setError(err.message);
      setMatchingRecipes([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Buscar recetas automáticamente cuando cambien los ingredientes del usuario
  useEffect(() => {
    console.log('useEffect userIngredients ejecutándose, ingredientes:', userIngredients.length);
    if (userIngredients.length > 0) {
      console.log('Buscando recetas para ingredientes:', userIngredients.map(ing => ing.name));
      searchRecipesByIngredients();
    } else {
      console.log('No hay ingredientes, limpiando recetas');
      setMatchingRecipes([]);
    }
  }, [userIngredients]);

  return {
    randomRecipe,
    userIngredients,
    availableIngredients,
    matchingRecipes,
    loading,
    searchLoading,
    error,
    ingredientsLoaded,
    generateRandomRecipe,
    addIngredient,
    removeIngredient,
    searchRecipesByIngredients,
    getMaxIngredients,
    canAddMoreIngredients,
    isPremium,
    isFree,
  };
};
