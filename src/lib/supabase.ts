import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ========================
// Authentication Functions
// ========================

export async function signUpWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error('User not returned from sign up');

  const { error: profileError } = await supabase.from('profile').insert({
    id: user.id,
    first_name: firstName,
    last_name: lastName,
    role,
    avatar_url: null
  });

  if (profileError) throw profileError;

  return { user };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error('Invalid login');

  return { user };
}

export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { user: null, error };

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user: { ...user, profile: profile || null }, error: profileError };
}

export async function updateProfile(userId: string, updates: any) {
  return await supabase.from('profile').update(updates).eq('id', userId).single();
}

export async function signOut() {
  return await supabase.auth.signOut();
}

// ========================
// Image Storage Functions
// ========================

/**
 * Uploads a profile image to the brand-logos bucket
 * @param userId The user's unique ID
 * @param file The image file to upload
 * @returns Promise<string> Public URL of the uploaded image
 */
export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/profile.${fileExt}`;
  const filePath = `${fileName}`;

  // First remove existing image if any
  await removeProfileImage(userId);

  const { error: uploadError } = await supabase
    .storage
    .from('brand-logos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error(uploadError.message);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('brand-logos')
    .getPublicUrl(filePath);

  return publicUrl;
};

/**
 * Removes all profile images for a user
 * @param userId The user's unique ID
 */
export const removeProfileImage = async (userId: string): Promise<void> => {
  try {
    // List all files for this user
    const { data: files, error: listError } = await supabase
      .storage
      .from('brand-logos')
      .list(`${userId}`);

    if (listError) {
      // If the folder doesn't exist, that's fine - nothing to delete
      if (!listError.message.includes('not found')) {
        throw listError;
      }
      return;
    }

    // Delete all files for this user
    if (files && files.length > 0) {
      const filePaths = files.map(f => `${userId}/${f.name}`);
      const { error: deleteError } = await supabase
        .storage
        .from('brand-logos')
        .remove(filePaths);

      if (deleteError) throw deleteError;
    }
  } catch (error) {
    console.error('Error removing profile image:', error);
    throw error;
  }
};

/**
 * Gets the public URL for a user's profile image
 * @param userId The user's unique ID
 * @returns string | null The public URL or null if no image exists
 */
export const getProfileImageUrl = (userId: string): string | null => {
  if (!userId) return null;
  
  const { data: { publicUrl } } = supabase
    .storage
    .from('brand-logos')
    .getPublicUrl(`${userId}/profile.png`); // Default extension

  // Check if the URL actually exists (you might need a more robust check)
  return publicUrl || null;
};

// ========================
// Helper Functions
// ========================

/**
 * Validates an image file before upload
 * @param file The file to validate
 * @throws Error if validation fails
 */
export const validateImageFile = (file: File): void => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG, WEBP, or GIF images are allowed');
  }

  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }
};