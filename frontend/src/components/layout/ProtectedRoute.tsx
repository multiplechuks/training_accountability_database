import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Login } from "@/components/ui";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  fallback 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login, error } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || <Login onLogin={login} loading={isLoading} error={error || undefined} />;
  }

  return <>{children}</>;
}
