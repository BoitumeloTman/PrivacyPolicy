import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Home,
  Database,
  ClipboardList,
  Users,
  User,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <aside className="w-64 bg-zinc-900 text-zinc-300 flex-shrink-0">
      <div className="p-6 font-bold text-xl text-white">Bokamoso Farm</div>
      <nav className="flex-1 px-4 space-y-2">
        <Link
          to="/dashboard"
          className="flex items-center px-3 py-2 rounded hover:bg-zinc-800"
        >
          <Home className="h-5 w-5 mr-3" />
          Dashboard
        </Link>

        <Link
          to="/livestock"
          className="flex items-center px-3 py-2 rounded hover:bg-zinc-800"
        >
          <Database className="h-5 w-5 mr-3" />
          Goat Registry
        </Link>

        <Link
          to="/livestock/health-records"
          className="flex items-center px-3 py-2 rounded hover:bg-zinc-800"
        >
          <ClipboardList className="h-5 w-5 mr-3" />
          Health Records
        </Link>

        <Link
          to="/payroll"
          className="flex items-center px-3 py-2 rounded hover:bg-zinc-800"
        >
          <Users className="h-5 w-5 mr-3" />
          Payroll
        </Link>

        <Link
          to="/profile"
          className="flex items-center px-3 py-2 rounded hover:bg-zinc-800"
        >
          <User className="h-5 w-5 mr-3" />
          Profile
        </Link>

        <button
          onClick={signOut}
          className="w-full flex items-center px-3 py-2 rounded hover:bg-zinc-800 text-left"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </nav>
    </aside>
  );
};