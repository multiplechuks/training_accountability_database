import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type { LookupItemDto, AllLookupsDto } from "@/types";

export async function getAllLookups(): Promise<AllLookupsDto> {
  const response = await axiosInstance.get(ApiUrls.lookups.ALL);
  return response.data;
}

export async function getLookupItems(url: string, search?: string): Promise<LookupItemDto[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  const response = await axiosInstance.get(`${url}${params}`);
  return response.data;
}

export async function createLookupItem(url: string, data: { name: string; description?: string }): Promise<LookupItemDto> {
  const response = await axiosInstance.post(url, data);
  return response.data;
}

export async function updateLookupItem(url: string, id: number, data: { name?: string; description?: string; isActive?: boolean }): Promise<LookupItemDto> {
  const response = await axiosInstance.put(`${url}/${id}`, data);
  return response.data;
}

export async function deleteLookupItem(url: string, id: number): Promise<void> {
  await axiosInstance.delete(`${url}/${id}`);
}
