import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOutIcon,
  UserIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ChevronDownIcon } from
'lucide-react';
import { Logo } from '../Logo';
import { useAuth } from '../../hooks/useAuth';
export function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const isActive = (path: string) => {
    if (path === '/manage') return location.pathname.startsWith('/manage');
    return location.pathname === path;
  };
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };
  return (
    <nav className="sticky top-0 z-30 bg-surface border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link
              to={isAdmin ? '/manage/dashboard' : '/recipes'}
              className="flex items-center gap-2.5 group">
              
              <Logo className="w-7 h-7" />
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-serif font-semibold text-text-dark tracking-tight">
                  Saffron
                </span>
                <span className="text-xs text-text-muted hidden sm:inline italic">
                  Recipes, refined
                </span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-7">
              <Link
                to="/recipes"
                className={`text-sm transition-colors ${isActive('/recipes') ? 'text-primary font-semibold' : 'text-text-dark hover:text-primary'}`}>
                
                Browse Recipes
              </Link>
              {isAdmin &&
              <Link
                to="/manage"
                className={`text-sm transition-colors ${isActive('/manage') ? 'text-primary font-semibold' : 'text-text-dark hover:text-primary'}`}>
                
                  Manage
                </Link>
              }
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dish-finder')}
              className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${isActive('/dish-finder') ? 'bg-primary text-white border-primary shadow-sm' : 'bg-canvas text-text-dark border-border hover:border-accent hover:bg-accent/5'}`}>
              
              <SparklesIcon
                className={`w-4 h-4 ${isActive('/dish-finder') ? 'text-white' : 'text-accent'}`} />
              
              AI Dish Finder
            </button>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-canvas transition-colors"
                aria-label="User menu">
                
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${isAdmin ? 'bg-primary/10 text-primary' : 'bg-forest/10 text-forest'}`}>
                  
                  {isAdmin ?
                  <ShieldCheckIcon className="w-4 h-4" /> :

                  <UserIcon className="w-4 h-4" />
                  }
                </div>
                <span className="text-sm font-medium text-text-dark hidden sm:inline">
                  {user?.username}
                </span>
                <ChevronDownIcon
                  className={`w-3.5 h-3.5 text-text-muted transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                
              </button>
              {menuOpen &&
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-md shadow-card-hover py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-semibold text-text-dark">
                      {user?.username}
                    </p>
                    <p className="text-xs text-text-muted capitalize mt-0.5">
                      {user?.role} account
                    </p>
                  </div>
                  <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-dark hover:bg-canvas transition-colors text-left">
                  
                    <LogOutIcon className="w-4 h-4 text-text-muted" />
                    Sign out
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </nav>);

}