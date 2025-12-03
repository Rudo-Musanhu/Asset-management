import React from 'react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-slate-900">
              {greeting}, {user?.full_name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-500">
              {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-900">{user?.full_name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role} Account</p>
          </div>
          <div className="w-10 h-10 bg-navy-600 rounded-full flex items-center justify-center text-white font-medium">
            {user?.full_name?.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
};