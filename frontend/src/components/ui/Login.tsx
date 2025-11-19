import React, { useState } from "react";
import type { LoginCredentials } from "@/types";

interface LoginProps {
  // eslint-disable-next-line no-unused-vars
  onLogin: (credentials: LoginCredentials) => void;
  loading?: boolean;
  error?: string;
}

export default function Login({ onLogin: _onLogin, loading = false, error }: LoginProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    _onLogin(credentials);
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="d-flex flex-column align-items-center gap-3">
            <div className="login-title text-center">
              <h1>Training Management System</h1>
              <p>Ministry of Health, Republic of Botswana</p>
            </div>
          </div>
        </div>

        <div className="login-form-container">
          <div className="welcome-text">
            <h2>Welcome Back</h2>
            <p>Please sign in to your account</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={credentials.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-control"
                  value={credentials.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  style={{ paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{ textDecoration: "none", zIndex: 10 }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="form-check-input"
                  checked={credentials.rememberMe}
                  onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="rememberMe" className="form-check-label">
                  Remember me
                </label>
              </div>
              
              <a href="#forgot" className="text-decoration-none">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-login"
              disabled={loading || !credentials.email || !credentials.password}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-4 pt-3 border-top">
            <p className="text-muted mb-0">
              Need help? Contact{" "}
              <a href="mailto:support@health.gov.bw" className="text-decoration-none">IT Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
