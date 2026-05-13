import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { ManageLayout } from './components/layout/ManageLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './pages/Login';
import { BrowseRecipes } from './pages/BrowseRecipes';
import { RecipeDetail } from './pages/RecipeDetail';
import { DishFinder } from './pages/DishFinder';
import { ManageDashboard } from './pages/ManageDashboard';
import { ManageDishes } from './pages/ManageDishes';
import { CreateEditDish } from './pages/CreateEditDish';
import { ManageUsers } from './pages/ManageUsers';
export function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/recipes" replace />} />

        {/* Authenticated routes (any role) */}
        <Route
          element={
          <ProtectedRoute>
              <PublicLayout />
            </ProtectedRoute>
          }>
          
          <Route path="/recipes" element={<BrowseRecipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/dish-finder" element={<DishFinder />} />
        </Route>

        {/* Admin-only routes */}
        <Route
          path="/manage"
          element={
          <ProtectedRoute adminOnly>
              <ManageLayout />
            </ProtectedRoute>
          }>
          
          <Route index element={<Navigate to="/manage/dashboard" replace />} />
          <Route path="dashboard" element={<ManageDashboard />} />
          <Route path="dishes" element={<ManageDishes />} />
          <Route path="dishes/new" element={<CreateEditDish />} />
          <Route path="dishes/:id/edit" element={<CreateEditDish />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/recipes" replace />} />
      </Routes>
    </HashRouter>);

}