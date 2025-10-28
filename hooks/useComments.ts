import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}

export const useComments = (recipeId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recipeId) {
      loadComments();
    }
  }, [recipeId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Por ahora, simular comentarios vacíos
      // En tu esquema actual no hay tabla comments
      // Podrías crear una tabla comments si necesitas esta funcionalidad
      setComments([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    try {
      // Por ahora, simular agregar comentario
      // En tu esquema actual no hay tabla comments
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    try {
      // Por ahora, simular actualizar comentario
      // En tu esquema actual no hay tabla comments
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      // Por ahora, simular eliminar comentario
      // En tu esquema actual no hay tabla comments
      return false;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const canComment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

      return profile?.plan === 'premium';
    } catch (err) {
      return false;
    }
  };

  return {
    comments,
    loading,
    error,
    loadComments,
    addComment,
    updateComment,
    deleteComment,
    canComment,
  };
};
