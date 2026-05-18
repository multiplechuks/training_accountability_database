import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserProfile,
  ChangePasswordRequest,
} from "@/types";

class ApiService {
  // Authentication APIs
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post(ApiUrls.auth.LOGIN, credentials);
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post(ApiUrls.auth.REGISTER, userData);
    return response.data;
  }

  async getProfile(): Promise<UserProfile> {
    const response = await axiosInstance.get(ApiUrls.auth.PROFILE);
    return response.data;
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post(ApiUrls.auth.CHANGE_PASSWORD, passwordData);
    return response.data;
  }

  async logout(): Promise<AuthResponse> {
    const response = await axiosInstance.post(ApiUrls.auth.LOGOUT);
    this.removeAuthToken();
    return response.data;
  }

  async validateToken(): Promise<AuthResponse> {
    const response = await axiosInstance.get(ApiUrls.auth.VALIDATE_TOKEN);
    return response.data;
  }

  // Utility methods
  setAuthToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  removeAuthToken(): void {
    localStorage.removeItem("auth_token");
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }
}

export const apiService = new ApiService();

