import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase.ts';
import { useAuthStore } from '../../store/useAuthStore';
import { LoadingScreen } from '../../components/LoadingScreen';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data?.session) {
          await checkAuth();
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error during auth callback:', error);
        navigate('/login');
      }
    };
    
    handleAuthCallback();
  }, [navigate, checkAuth]);
  
  return <LoadingScreen />;
};