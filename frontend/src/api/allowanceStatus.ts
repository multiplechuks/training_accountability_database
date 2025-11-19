import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type {
  AllowanceStatus,
  CreateAllowanceStatusDto,
  UpdateAllowanceStatusDto,
  PaginatedResponse
} from "@/types";

// Get all allowance statuses with pagination
export async function getAllowanceStatuses(page = 1, pageSize = 10, searchTerm?: string): Promise<PaginatedResponse<AllowanceStatus>> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  if (searchTerm) {
    params.append("searchTerm", searchTerm);
  }
  
  const response = await axiosInstance.get(`${ApiUrls.allowanceStatuses.LIST}?${params.toString()}`);
  return response.data;
}

// Get a single allowance status by ID
export async function getAllowanceStatus(id: number): Promise<AllowanceStatus> {
  const response = await axiosInstance.get(ApiUrls.allowanceStatuses.DETAILS(id));
  return response.data;
}

// Get allowance statuses for lookup/dropdown
export async function getAllowanceStatusesLookup(searchTerm?: string): Promise<AllowanceStatus[]> {
  const params = searchTerm ? `?searchTerm=${encodeURIComponent(searchTerm)}` : "";
  const response = await axiosInstance.get(`${ApiUrls.allowanceStatuses.LOOKUP}${params}`);
  return response.data;
}

// Create a new allowance status
export async function createAllowanceStatus(data: CreateAllowanceStatusDto): Promise<AllowanceStatus> {
  const response = await axiosInstance.post(ApiUrls.allowanceStatuses.CREATE, data);
  return response.data;
}

// Update an existing allowance status
export async function updateAllowanceStatus(id: number, data: UpdateAllowanceStatusDto): Promise<AllowanceStatus> {
  const response = await axiosInstance.put(ApiUrls.allowanceStatuses.UPDATE(id), data);
  return response.data;
}

// Delete an allowance status
export async function deleteAllowanceStatus(id: number): Promise<void> {
  await axiosInstance.delete(ApiUrls.allowanceStatuses.DELETE(id));
}
