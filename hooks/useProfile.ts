import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  plan: 'free' | 'premium';
  created_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // Si el perfil no existe, crearlo
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...');
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
              plan: 'free'
            })
            .select()
            .single();
          
          if (insertError) {
            setError(insertError.message);
            return;
          }
          
          setProfile(newProfile);
        } else {
          setError(error.message);
          return;
        }
      } else {
        setProfile(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!profile) return;

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) {
        setError(error.message);
        return false;
      }

      setProfile({ ...profile, ...updates });
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const upgradeToPremium = async () => {
    return await updateProfile({ plan: 'premium' });
  };

  const isPremium = () => {
    return profile?.plan === 'premium';
  };

  const isFree = () => {
    return profile?.plan === 'free';
  };

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
    upgradeToPremium,
    isPremium,
    isFree,
  };
};
