import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
}

interface Favorite {
  recipe_id: string;
  recipes: Recipe;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          recipe_id,
          recipes (
            id,
            title,
            description
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error cargando favoritos:', error);
        setError(error.message);
        setFavorites([]);
        return;
      }

      setFavorites(data || []);
    } catch (err: any) {
      console.error('Error inesperado cargando favoritos:', err);
      setError(err.message);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (recipeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          recipe_id: recipeId
        });

      if (error) {
        setError(error.message);
        return false;
      }

      await loadFavorites();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const removeFromFavorites = async (recipeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);

      if (error) {
        setError(error.message);
        return false;
      }

      await loadFavorites();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const isFavorite = (recipeId: string) => {
    return favorites.some(favorite => favorite.recipes.id === recipeId);
  };

  const toggleFavorite = async (recipeId: string) => {
    if (isFavorite(recipeId)) {
      return await removeFromFavorites(recipeId);
    } else {
      return await addToFavorites(recipeId);
    }
  };

  return {
    favorites,
    loading,
    error,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
};
