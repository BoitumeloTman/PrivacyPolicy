// src/App.tsx
import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { Layout } from './components/layout/Layout';
import { LoadingScreen } from './components/LoadingScreen';

// Pages
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import { Dashboard } from './pages/dashboard/Dashboard';
import { HealthRecords } from './pages/livestock/HealthRecord';
import LivestockRegistry from './pages/livestock/LivestockRegistry';
import { Payroll } from './pages/payroll/Payroll';
import { Profile } from './pages/Profile';





// Supabase client (from lib)
import { supabase } from './lib/supabase';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;
  return isAuthenticated ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default function App() {
  const { checkAuth, setSession } = useAuthStore();

  useEffect(() => {
    // 1) On startup, get current session
    checkAuth();

    // 2) Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth, setSession]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/livestock"
          element={
            <ProtectedRoute>
              <LivestockRegistry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/livestock/health-records"
          element={
            <ProtectedRoute>
              <HealthRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <ProtectedRoute>
              <Payroll />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #374151',
          },
        }}
      />
    </BrowserRouter>
  );
}
