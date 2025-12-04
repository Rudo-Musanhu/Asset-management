<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from '../context/AuthContext';
import { LoginPage } from '../components/LoginPage';
import { Dashboard } from '../components/Dashboard';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

=======
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { LoginPage } from "../components/LoginPage";
import SignUpPage from "../components/SignUpPage";
import { Dashboard } from "../components/Dashboard";
import { useRouter, usePathname } from "next/navigation";

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isSignupPage = pathname === "/signup";

  // Loading screen
>>>>>>> Stashed changes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

<<<<<<< Updated upstream
  if (!isLoggedIn || !user) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
=======
  // NOT logged in
  if (!user) {
    if (isSignupPage) {
      return <SignUpPage />;
    }
    return <LoginPage onLoginSuccess={() => router.push("/")} />;
>>>>>>> Stashed changes
  }

  // Logged in → dashboard
  return <Dashboard />;
};

export default AppContent;
