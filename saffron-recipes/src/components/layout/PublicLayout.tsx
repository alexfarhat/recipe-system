import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
export function PublicLayout() {
  return (
    <div className="min-h-screen bg-parchment">
      <TopNav />
      <main>
        <Outlet />
      </main>
    </div>);

}