import React, { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from '../context/AuthContext';
import { LoginPage } from '../components/LoginPage';
import { SignUpPage } from '../components/SignUpPage';
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

  useEffect(() => {
    // Check if we're on a signup route
    if (window.location.pathname === '/signup') {
      setShowSignUp(true);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    if (showSignUp) {
      return <SignUpPage onSignUpSuccess={() => router.push('/login')} />;
    }
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return <Dashboard />;
};

const AppLayout: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default AppLayout;