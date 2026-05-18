import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type { AllowanceStatus, CreateAllowanceStatusDto, UpdateAllowanceStatusDto, PaginatedResponse } from "@/types";

export async function getAllowanceStatuses(page = 1, pageSize = 10, search?: string): Promise<PaginatedResponse<AllowanceStatus>> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (search) params.append("search", search);
  const response = await axiosInstance.get(`${ApiUrls.allowanceStatuses.LIST}?${params}`);
  return response.data;
}

export async function getAllowanceStatus(id: number): Promise<AllowanceStatus> {
  const response = await axiosInstance.get(ApiUrls.allowanceStatuses.DETAILS(id));
  return response.data;
}

export async function createAllowanceStatus(data: CreateAllowanceStatusDto): Promise<AllowanceStatus> {
  const response = await axiosInstance.post(ApiUrls.allowanceStatuses.LIST, data);
  return response.data;
}

export async function updateAllowanceStatus(id: number, data: UpdateAllowanceStatusDto): Promise<AllowanceStatus> {
  const response = await axiosInstance.put(ApiUrls.allowanceStatuses.DETAILS(id), data);
  return response.data;
}

export async function deleteAllowanceStatus(id: number): Promise<void> {
  await axiosInstance.delete(ApiUrls.allowanceStatuses.DETAILS(id));
}

export async function getAllowanceStatusesLookup(): Promise<AllowanceStatus[]> {
  const response = await axiosInstance.get(`${ApiUrls.allowanceStatuses.LIST}?page=1&pageSize=1000`);
  return response.data?.items ?? response.data ?? [];
}
