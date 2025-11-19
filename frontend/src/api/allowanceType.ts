import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type {
  AllowanceType,
  CreateAllowanceTypeDto,
  UpdateAllowanceTypeDto,
  PaginatedResponse
} from "@/types";

// Get all allowance types with pagination
export async function getAllowanceTypes(page = 1, pageSize = 10, searchTerm?: string): Promise<PaginatedResponse<AllowanceType>> {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  if (searchTerm) {
    params.append("searchTerm", searchTerm);
  }
  
  const response = await axiosInstance.get(`${ApiUrls.allowanceTypes.LIST}?${params.toString()}`);
  return response.data;
}

// Get a single allowance type by ID
export async function getAllowanceType(id: number): Promise<AllowanceType> {
  const response = await axiosInstance.get(ApiUrls.allowanceTypes.DETAILS(id));
  return response.data;
}

// Get allowance types for lookup/dropdown
export async function getAllowanceTypesLookup(searchTerm?: string): Promise<AllowanceType[]> {
  const params = searchTerm ? `?searchTerm=${encodeURIComponent(searchTerm)}` : "";
  const response = await axiosInstance.get(`${ApiUrls.allowanceTypes.LOOKUP}${params}`);
  return response.data;
}

// Create a new allowance type
export async function createAllowanceType(data: CreateAllowanceTypeDto): Promise<AllowanceType> {
  const response = await axiosInstance.post(ApiUrls.allowanceTypes.CREATE, data);
  return response.data;
}

// Update an existing allowance type
export async function updateAllowanceType(id: number, data: UpdateAllowanceTypeDto): Promise<AllowanceType> {
  const response = await axiosInstance.put(ApiUrls.allowanceTypes.UPDATE(id), data);
  return response.data;
}

// Delete an allowance type
export async function deleteAllowanceType(id: number): Promise<void> {
  await axiosInstance.delete(ApiUrls.allowanceTypes.DELETE(id));
}
