import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type { AllowanceType, CreateAllowanceTypeDto, UpdateAllowanceTypeDto, PaginatedResponse } from "@/types";

export async function getAllowanceTypes(page = 1, pageSize = 10, search?: string): Promise<PaginatedResponse<AllowanceType>> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (search) params.append("search", search);
  const response = await axiosInstance.get(`${ApiUrls.allowanceTypes.LIST}?${params}`);
  return response.data;
}

export async function getAllowanceType(id: number): Promise<AllowanceType> {
  const response = await axiosInstance.get(ApiUrls.allowanceTypes.DETAILS(id));
  return response.data;
}

export async function createAllowanceType(data: CreateAllowanceTypeDto): Promise<AllowanceType> {
  const response = await axiosInstance.post(ApiUrls.allowanceTypes.LIST, data);
  return response.data;
}

export async function updateAllowanceType(id: number, data: UpdateAllowanceTypeDto): Promise<AllowanceType> {
  const response = await axiosInstance.put(ApiUrls.allowanceTypes.DETAILS(id), data);
  return response.data;
}

export async function deleteAllowanceType(id: number): Promise<void> {
  await axiosInstance.delete(ApiUrls.allowanceTypes.DETAILS(id));
}

export async function getAllowanceTypesLookup(): Promise<AllowanceType[]> {
  const response = await axiosInstance.get(`${ApiUrls.allowanceTypes.LIST}?page=1&pageSize=1000`);
  return response.data?.items ?? response.data ?? [];
}
