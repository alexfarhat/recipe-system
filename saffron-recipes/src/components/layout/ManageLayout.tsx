import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { ManageSidebar } from './ManageSidebar';
export function ManageLayout() {
  return (
    <div className="min-h-screen bg-canvas">
      <TopNav />
      <div className="flex">
        <ManageSidebar />
        <main className="flex-1 min-w-0">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>);

}