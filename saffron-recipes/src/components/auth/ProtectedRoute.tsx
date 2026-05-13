import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoaderIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDbStatus } from '../../hooks/useDb';
interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}
export function ProtectedRoute({
  children,
  adminOnly = false
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const { ready, error } = useDbStatus();
  const location = useLocation();
  // While the very first API load is in flight, don't make routing decisions —
  // otherwise a logged-in user who refreshes on /manage/dishes would briefly
  // appear unauthenticated and get bounced to /login.
  if (!ready) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-text-muted">
          <LoaderIcon className="w-6 h-6 animate-spin text-primary" />
          <p className="text-xs uppercase tracking-widest">Loading</p>
        </div>
      </div>);

  }
  // If the API itself failed (DB offline, config wrong), surface that clearly
  if (error) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-serif font-semibold text-tomato mb-2">
            Cannot reach the database
          </h1>
          <p className="text-sm text-text-muted mb-4">{error}</p>
          <p className="text-xs text-text-muted">
            Check <code>api/config.php</code> on the server, then reload.
          </p>
        </div>
      </div>);

  }
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname
        }}
        replace />);


  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/recipes" replace />;
  }
  return <>{children}</>;
}