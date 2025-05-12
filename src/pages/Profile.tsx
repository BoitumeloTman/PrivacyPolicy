import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { User, Camera } from 'lucide-react';
import { updateProfile, uploadProfileImage } from '../lib/supabase';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { user, profile, checkAuth } = useAuthStore((state) => ({
    user: state.user,
    profile: state.profile,
    checkAuth: state.checkAuth,
  }));
  
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [role, setRole] = useState(profile?.role || 'student');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  
  // Update form fields when profile changes
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setRole(profile.role || 'student');
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    setIsLoading(true);
    
    try {
      let avatarUrl = profile.avatar_url || null;
      
      // Upload new image if selected
      if (avatarFile) {
        const result = await uploadProfileImage(user.id, avatarFile);
        if (typeof result === 'string') {
          avatarUrl = result;
        } else {
          throw new Error('Failed to upload profile image');
        }
      }
      
      // Update profile
      const updates = {
        first_name: firstName,
        last_name: lastName,
        role,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await updateProfile(user.id, updates);
      if (error) throw error;
      
      await checkAuth(); // Refresh user data
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Your Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center mb-4">
              <div className="relative group">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-zinc-800"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User size={48} className="text-zinc-500" />
                  </div>
                )}
                
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-emerald-600 rounded-full p-2 cursor-pointer shadow-lg border-4 border-zinc-900 hover:bg-emerald-700 transition-colors"
                  title="Change profile picture"
                >
                  <Camera size={18} className="text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
                disabled={isLoading}
              />
              
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Input
                label="Email"
                value={user?.email || ''}
                disabled
                helperText="Email cannot be changed"
              />
            </div>
            
            <div>
              <Select
                label="Role"
                options={[
                  { value: 'student', label: 'Student' },
                  { value: 'employee', label: 'Employee' },
                  { value: 'employer', label: 'Employer' },
                ]}
                value={role}
                onChange={(value) => setRole(value as "employee" | "student" | "employer" | "admin")}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end border-t border-zinc-800 pt-4">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};