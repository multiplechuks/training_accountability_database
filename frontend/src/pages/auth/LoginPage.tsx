import { Login } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();

  return (
    <Login 
      onLogin={login} 
      loading={isLoading} 
      error={error || undefined} 
    />
  );
}
