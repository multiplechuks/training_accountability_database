import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type { AdmissionResponseDto, CreateAdmissionDto, UpdateAdmissionDto, PaginatedResponse } from "@/types";

export async function getAdmissions(page = 1, pageSize = 10, search?: string): Promise<PaginatedResponse<AdmissionResponseDto>> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (search) params.append("search", search);
  const response = await axiosInstance.get(`${ApiUrls.admissions.LIST}?${params}`);
  return response.data;
}

export async function getAdmission(id: number): Promise<AdmissionResponseDto> {
  const response = await axiosInstance.get(ApiUrls.admissions.DETAILS(id));
  return response.data;
}

export async function getAdmissionByNomination(nominationId: number): Promise<AdmissionResponseDto | null> {
  const response = await axiosInstance.get(ApiUrls.admissions.BY_NOMINATION(nominationId));
  return response.data;
}

export async function createAdmission(data: CreateAdmissionDto | FormData): Promise<AdmissionResponseDto> {
  const response = await axiosInstance.post(ApiUrls.admissions.LIST, data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
}

export async function updateAdmission(id: number, data: UpdateAdmissionDto | FormData): Promise<AdmissionResponseDto> {
  const response = await axiosInstance.put(ApiUrls.admissions.DETAILS(id), data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
}

export async function deleteAdmission(id: number): Promise<void> {
  await axiosInstance.delete(ApiUrls.admissions.DETAILS(id));
}

