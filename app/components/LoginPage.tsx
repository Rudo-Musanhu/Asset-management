import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const success = await login(email, password);
    if (success) {
      onLoginSuccess();
    } else {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Asset Manager</h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Enterprise Asset Management System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600 text-sm">{error}</p></div>}
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>Sign In</Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => window.location.href = '/signup'}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm sm:text-base"
              >
                Sign Up
              </button>
            </p>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg space-y-2">
            <p className="text-xs text-slate-500 font-medium">Demo Credentials:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 sm:p-3 bg-white rounded border border-slate-200">
                <p className="font-medium text-slate-700">Admin</p>
                <p className="text-slate-500">admin@eport.cloud</p>
                <p className="text-slate-500">admin123</p>
              </div>
              <div className="p-2 sm:p-3 bg-white rounded border border-slate-200">
                <p className="font-medium text-slate-700">User</p>
                <p className="text-slate-500">user@eport.cloud</p>
                <p className="text-slate-500">user123</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-500 text-xs mt-4 sm:mt-6">Eport (Pvt) Ltd - Developer Task</p>
      </div>
    </div>
  );
};