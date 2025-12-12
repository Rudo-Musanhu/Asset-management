'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from '../components/LoginPage';
import { Dashboard } from '../components/Dashboard';
import { useRouter } from 'next/navigation';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    if (showSignUp) {
      return <SignUpPage onSignUpSuccess={() => router.push('/login')} />;
    }
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // Logged in → dashboard
  return <Dashboard />;
};

export default AppContent;
