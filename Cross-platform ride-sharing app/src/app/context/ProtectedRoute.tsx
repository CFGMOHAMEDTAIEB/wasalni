import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth, UserRole } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated || user?.role === 'guest') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasAccess = user && roles.includes(user.role);
    
    if (!hasAccess) {
      return fallback || <AccessDeniedView />;
    }
  }

  return children;
}

function AccessDeniedView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  );
}
