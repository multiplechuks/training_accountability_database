import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type { AllowanceResponseDto, CreateAllowanceDto, UpdateAllowanceDto, PaginatedResponse } from "@/types";

export async function getAllowances(page = 1, pageSize = 10, search?: string): Promise<PaginatedResponse<AllowanceResponseDto>> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (search) params.append("search", search);
  const response = await axiosInstance.get(`${ApiUrls.allowances.LIST}?${params}`);
  return response.data;
}

export async function getAllowance(id: number): Promise<AllowanceResponseDto> {
  const response = await axiosInstance.get(ApiUrls.allowances.DETAILS(id));
  return response.data;
}

export async function getAllowancesByParticipant(participantId: number): Promise<AllowanceResponseDto[]> {
  const response = await axiosInstance.get(ApiUrls.allowances.BY_PARTICIPANT(participantId));
  return response.data;
}

export async function getAllowancesByAdmission(admissionId: number): Promise<AllowanceResponseDto[]> {
  const response = await axiosInstance.get(ApiUrls.allowances.BY_ADMISSION(admissionId));
  return response.data;
}

export async function createAllowance(data: CreateAllowanceDto): Promise<AllowanceResponseDto> {
  const response = await axiosInstance.post(ApiUrls.allowances.LIST, data);
  return response.data;
}

export async function updateAllowance(id: number, data: UpdateAllowanceDto): Promise<AllowanceResponseDto> {
  const response = await axiosInstance.put(ApiUrls.allowances.DETAILS(id), data);
  return response.data;
}

export async function deleteAllowance(id: number): Promise<void> {
  await axiosInstance.delete(ApiUrls.allowances.DETAILS(id));
}
