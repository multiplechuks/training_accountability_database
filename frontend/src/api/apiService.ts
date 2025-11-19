import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserProfile,
  ChangePasswordRequest,
  DepartmentResponse,
  FacilityResponse,
  DesignationResponse,
  SalaryScaleResponse,
  SponsorResponse,
  EnrollmentResponse,
  CreateEnrollmentRequest,
  UpdateEnrollmentRequest,
  AllowanceTypeResponse,
  AllowanceStatusResponse
} from "@/types";

class ApiService {
  // Authentication APIs
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post("/auth/login", credentials);
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  }

  async getProfile(): Promise<UserProfile> {
    const response = await axiosInstance.get("/auth/profile");
    return response.data;
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post("/auth/change-password", passwordData);
    return response.data;
  }

  async logout(): Promise<AuthResponse> {
    const response = await axiosInstance.post("/auth/logout");
    this.removeAuthToken();
    return response.data;
  }

  async validateToken(): Promise<AuthResponse> {
    const response = await axiosInstance.get("/auth/validate-token");
    return response.data;
  }

  // Lookup APIs
  async getDepartments(): Promise<DepartmentResponse> {
    const response = await axiosInstance.get(ApiUrls.lookup.DEPARTMENTS);
    return response.data;
  }

  async getFacilities(): Promise<FacilityResponse> {
    const response = await axiosInstance.get(ApiUrls.lookup.FACILITIES);
    return response.data;
  }

  async getDesignations(): Promise<DesignationResponse> {
    const response = await axiosInstance.get(ApiUrls.lookup.DESIGNATIONS);
    return response.data;
  }

  async getSalaryScales(): Promise<SalaryScaleResponse> {
    const response = await axiosInstance.get(ApiUrls.lookup.SALARY_SCALES);
    return response.data;
  }

  async getSponsors(): Promise<SponsorResponse> {
    const response = await axiosInstance.get(ApiUrls.lookup.SPONSORS);
    return response.data;
  }

  async getAllowanceTypes(): Promise<AllowanceTypeResponse> {
    const response = await axiosInstance.get(ApiUrls.lookup.ALLOWANCE_TYPES);
    return response.data;
  }

  async getAllowanceStatuses(): Promise<AllowanceStatusResponse> {
    const response = await axiosInstance.get(ApiUrls.lookup.ALLOWANCE_STATUSES);
    return response.data;
  }

  // Training Enrollment APIs
  async getEnrollments(): Promise<EnrollmentResponse[]> {
    const response = await axiosInstance.get("/training-enrollment");
    return response.data;
  }

  async createEnrollment(enrollmentData: CreateEnrollmentRequest): Promise<EnrollmentResponse> {
    const response = await axiosInstance.post("/training-enrollment", enrollmentData);
    return response.data;
  }

  async updateEnrollment(id: number, enrollmentData: UpdateEnrollmentRequest): Promise<EnrollmentResponse> {
    const response = await axiosInstance.put(`/training-enrollment/${id}`, enrollmentData);
    return response.data;
  }

  async deleteEnrollment(id: number): Promise<void> {
    await axiosInstance.delete(`/training-enrollment/${id}`);
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
