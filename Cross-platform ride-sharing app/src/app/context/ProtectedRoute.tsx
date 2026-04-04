import { ReactNode } from 'react';
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
  const { user } = useAuth();

  if (!requiredRole) {
    // Only check if authenticated (not guest)
    if (user?.role === 'guest') {
      return fallback || <GuestOnlyView />;
    }
    return children;
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const hasAccess = user && roles.includes(user.role);

  return hasAccess ? children : fallback || <AccessDeniedView />;
}

function GuestOnlyView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Please Sign In
        </h2>
        <p className="text-gray-600 mb-6">
          You need to create an account or log in to access this feature.
        </p>
      </div>
    </div>
  );
}

function AccessDeniedView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    </div>
  );
}
