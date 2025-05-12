import { supabase } from './supabase.ts';

export const getCurrentUser = async (): Promise<{
  user: any | null;
  profile: any | null;
  error: Error | null;
}> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, profile: null, error: userError ?? new Error('User not found') };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profile') // change to 'users' if that's your table
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      user,
      profile,
      error: profileError ?? null,
    };
  } catch (err: any) {
    return {
      user: null,
      profile: null,
      error: err,
    };
  }
};
