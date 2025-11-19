export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// API Request/Response interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  expiresAt?: string;
  user?: UserProfile;
}

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  profilePictureUrl?: string;
  roles: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
