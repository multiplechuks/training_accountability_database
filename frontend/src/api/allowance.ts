import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type { 
  AllowanceResponseDto, 
  CreateAllowanceDto, 
  UpdateAllowanceDto, 
  PaginatedResponse 
} from "@/types";

// Get all allowances with pagination
export async function getAllowances(page = 1, pageSize = 10, searchTerm?: string): Promise<PaginatedResponse<AllowanceResponseDto>> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  if (searchTerm) {
    params.append("searchTerm", searchTerm);
  }
  
  const response = await axiosInstance.get(`${ApiUrls.allowances.LIST}?${params.toString()}`);
  return response.data;
}

// Get a single allowance by ID
export async function getAllowance(id: number): Promise<AllowanceResponseDto> {
  const response = await axiosInstance.get(ApiUrls.allowances.DETAILS(id));
  return response.data;
}

// Get allowances by participant ID
export async function getAllowancesByParticipant(participantId: number): Promise<AllowanceResponseDto[]> {
  const response = await axiosInstance.get(ApiUrls.allowances.BY_PARTICIPANT(participantId));
  return response.data;
}

// Get allowances by training ID
export async function getAllowancesByTraining(trainingId: number): Promise<AllowanceResponseDto[]> {
  const response = await axiosInstance.get(ApiUrls.allowances.BY_TRAINING(trainingId));
  return response.data;
}

// Get allowances by status
export async function getAllowancesByStatus(statusId: number): Promise<AllowanceResponseDto[]> {
  const response = await axiosInstance.get(ApiUrls.allowances.BY_STATUS(statusId));
  return response.data;
}

// Get allowances by type
export async function getAllowancesByType(typeId: number): Promise<AllowanceResponseDto[]> {
  const response = await axiosInstance.get(ApiUrls.allowances.BY_TYPE(typeId));
  return response.data;
}

// Get allowances in date range
export async function getAllowancesInDateRange(startDate: string, endDate: string): Promise<AllowanceResponseDto[]> {
  const response = await axiosInstance.get(`${ApiUrls.allowances.DATE_RANGE}?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
}

// Get total allowances by participant
export async function getTotalAllowancesByParticipant(participantId: number): Promise<{ total: number }> {
  const response = await axiosInstance.get(ApiUrls.allowances.TOTAL_BY_PARTICIPANT(participantId));
  return response.data;
}

// Create a new allowance
export async function createAllowance(allowanceData: CreateAllowanceDto): Promise<AllowanceResponseDto> {
  const response = await axiosInstance.post(ApiUrls.allowances.CREATE, allowanceData);
  return response.data;
}

// Update an existing allowance
export async function updateAllowance(id: number, allowanceData: UpdateAllowanceDto): Promise<AllowanceResponseDto> {
  const response = await axiosInstance.put(ApiUrls.allowances.UPDATE(id), allowanceData);
  return response.data;
}

// Delete an allowance
export async function deleteAllowance(id: number): Promise<void> {
  await axiosInstance.delete(ApiUrls.allowances.DELETE(id));
}
