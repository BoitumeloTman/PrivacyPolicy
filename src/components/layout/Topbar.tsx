import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut } from 'lucide-react';

export const Topbar: React.FC = () => {
  const signOut = useAuthStore((s) => s.signOut);
  return (
    <header className="flex justify-between items-center bg-zinc-900 px-6 py-3">
      <h1 className="text-xl font-semibold text-white">Bokamoso Farm</h1>
      <button
        onClick={signOut}
        className="flex items-center space-x-2 text-sm text-white hover:text-gray-300"
      >
        <LogOut className="h-5 w-5" />
        <span>Sign Out</span>
      </button>
    </header>
  );
};