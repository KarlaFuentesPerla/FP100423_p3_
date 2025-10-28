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
  const [matchingRecipes, setMatchingRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile, isPremium, isFree } = useProfile();

  useEffect(() => {
    loadUserIngredients();
    loadAvailableIngredients();
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
        console.error('Error cargando ingredientes:', error);
        setError(error.message);
        setAvailableIngredients([]);
        return;
      }

      const ingredients = data?.map(item => ({
        id: parseInt(item.id),
        name: item.name,
        category: 'general' // Categoría por defecto
      })) || [];

      setAvailableIngredients(ingredients);
    } catch (err: any) {
      console.error('Error inesperado cargando ingredientes:', err);
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
    if (userIngredients.length === 0) {
      setMatchingRecipes([]);
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);

      const ingredientIds = userIngredients.map(ing => ing.id);

      // Buscar recetas que contengan al menos uno de los ingredientes seleccionados
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          id,
          title,
          description,
          steps,
          recipe_ingredients(
            ingredient_id,
            quantity,
            ingredients(name)
          )
        `)
        .eq('is_public', true)
        .in('recipe_ingredients.ingredient_id', ingredientIds);

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

      // Filtrar y transformar las recetas
      const maxIngredients = isPremium() ? 10 : 3;
      const transformedRecipes = recipes
        .filter(recipe => 
          recipe.recipe_ingredients && 
          recipe.recipe_ingredients.length <= maxIngredients
        )
        .map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.recipe_ingredients ? recipe.recipe_ingredients.map(ri => 
            `${ri.quantity || ''} ${ri.ingredients?.name || ''}`.trim()
          ) : [],
          instructions: recipe.steps ? recipe.steps.split('\n').filter(step => step.trim()) : [],
          prep_time: 15,
          cook_time: 30,
          servings: 4,
          difficulty: 'easy' as const,
          is_public: true,
          user_id: recipe.user_id || '',
          created_at: new Date().toISOString()
        }))
        .sort((a, b) => {
          // Ordenar por número de ingredientes coincidentes (mayor a menor)
          const aMatches = a.ingredients.filter(ing => 
            userIngredients.some(ui => ing.toLowerCase().includes(ui.name.toLowerCase()))
          ).length;
          const bMatches = b.ingredients.filter(ing => 
            userIngredients.some(ui => ing.toLowerCase().includes(ui.name.toLowerCase()))
          ).length;
          return bMatches - aMatches;
        });

      setMatchingRecipes(transformedRecipes);
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
    if (userIngredients.length > 0) {
      searchRecipesByIngredients();
    } else {
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
