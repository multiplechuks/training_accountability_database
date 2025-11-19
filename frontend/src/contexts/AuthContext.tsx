import { createContext, useState, useEffect, ReactNode } from "react";
import type { User, LoginCredentials } from "@/types";
import { apiService } from "@/api/apiService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // eslint-disable-next-line no-unused-vars
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Check for existing token on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = apiService.getAuthToken();
        if (token) {
          // Validate token with backend
          const response = await apiService.validateToken();
          if (response.success) {
            const profile = await apiService.getProfile();
            setUser({
              id: profile.id,
              email: profile.email,
              firstName: profile.firstName,
              lastName: profile.lastName,
              fullName: profile.fullName,
              roles: profile.roles
            });
          } else {
            // Token is invalid, remove it
            apiService.removeAuthToken();
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        apiService.removeAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.login({
        email: credentials.email,
        password: credentials.password,
      });

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      // Store token
      if (response.token) {
        apiService.setAuthToken(response.token);
      }

      // Set user data
      if (response.user) {
        setUser({
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          fullName: response.user.fullName,
          roles: response.user.roles
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    apiService.removeAuthToken();
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
