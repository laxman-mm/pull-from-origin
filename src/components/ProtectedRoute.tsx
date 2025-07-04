import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requireAuth = true,
  redirectTo = '/auth' 
}: ProtectedRouteProps) {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    // If not logged in, redirect to auth
    if (!user) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
    
    // If logged in but not admin, show access denied
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have administrator privileges to access this page.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Logged in as: <span className="font-medium">{profile?.email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Role: <span className="font-medium">{profile?.role || 'user'}</span>
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={() => window.history.back()}
              className="text-primary hover:underline text-sm"
            >
              ← Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
