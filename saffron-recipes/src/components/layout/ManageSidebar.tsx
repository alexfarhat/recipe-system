import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeftIcon,
  LayoutDashboardIcon,
  UtensilsCrossedIcon,
  UsersIcon } from
'lucide-react';
const navItems = [
{
  path: '/manage/dashboard',
  label: 'Dashboard',
  icon: LayoutDashboardIcon
},
{
  path: '/manage/dishes',
  label: 'Dishes',
  icon: UtensilsCrossedIcon
},
{
  path: '/manage/users',
  label: 'Users',
  icon: UsersIcon
}];

export function ManageSidebar() {
  const location = useLocation();
  return (
    <aside className="w-60 bg-canvas border-r border-border min-h-[calc(100vh-4rem)] p-5 flex-shrink-0">
      <Link
        to="/"
        className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted hover:text-text-dark transition-colors mb-8">
        
        <ArrowLeftIcon className="w-3.5 h-3.5" />
        Back to site
      </Link>
      <h2 className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-3 px-3">
        Manage
      </h2>
      <nav className="space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
          location.pathname === item.path ||
          item.path === '/manage/dishes' &&
          location.pathname.startsWith('/manage/dishes');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive ? 'bg-surface text-text-dark font-semibold border-l-2 border-primary shadow-card' : 'text-text-muted hover:text-text-dark hover:bg-surface/60'}`}>
              
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>);

        })}
      </nav>
    </aside>);

}