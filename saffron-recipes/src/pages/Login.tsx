import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  EyeOffIcon,
  LoaderIcon,
  AlertCircleIcon,
  LockIcon,
  UserIcon } from
'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // If already logged in, send them to the right place
  if (isAuthenticated) {
    const from = (
    location.state as {
      from?: string;
    })?.
    from;
    return (
      <Navigate
        to={from || (isAdmin ? '/manage/dashboard' : '/recipes')}
        replace />);


  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const from = (
    location.state as {
      from?: string;
    })?.
    from;
    navigate(
      from || (result.user.role === 'admin' ? '/manage/dashboard' : '/recipes'),
      {
        replace: true
      }
    );
  };
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6 py-12">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/[0.03]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/[0.04]" />
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 16
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4
        }}
        className="relative w-full max-w-md">
        
        {/* Branding */}
        <div className="text-center mb-10">
          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            transition={{
              delay: 0.1,
              duration: 0.3
            }}
            className="inline-flex items-center justify-center mb-5">
            
            <Logo className="w-14 h-14" />
          </motion.div>
          <h1 className="text-4xl font-serif font-semibold text-text-dark tracking-tight mb-1">
            Saffron
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold italic">
            Recipes, refined
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-xl shadow-card border border-border p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-semibold text-text-dark mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-text-muted">
              Sign in to your account to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs uppercase tracking-widest text-text-muted font-semibold mb-2">
                
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-3 py-2.5 bg-canvas border border-border-strong rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  required
                  autoFocus />
                
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-widest text-text-muted font-semibold mb-2">
                
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-canvas border border-border-strong rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  required />
                
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-text-muted hover:text-text-dark transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  
                  {showPassword ?
                  <EyeOffIcon className="w-4 h-4" /> :

                  <EyeIcon className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error &&
            <motion.div
              initial={{
                opacity: 0,
                y: -4
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="flex items-start gap-2 px-3 py-2.5 bg-tomato/5 border border-tomato/20 rounded-md">
              
                <AlertCircleIcon className="w-4 h-4 text-tomato flex-shrink-0 mt-0.5" />
                <p className="text-sm text-tomato">{error}</p>
              </motion.div>
            }

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5">
              
              {isLoading ?
              <>
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                  Signing in...
                </> :

              'Sign In'
              }
            </Button>
          </form>
        </div>

        {/* Footer message */}
        <p className="text-center text-xs text-text-muted mt-6">
          Having issues signing in? Please contact your system administrator.
        </p>
      </motion.div>
    </div>);

}