import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type { NominationResponseDto, CreateNominationDto, UpdateNominationDto, UpdateNominationStatusDto, PaginatedResponse } from "@/types";

export async function getNominations(page = 1, pageSize = 10, search?: string, year?: number): Promise<PaginatedResponse<NominationResponseDto>> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (search) params.append("search", search);
  if (year) params.append("year", String(year));
  const response = await axiosInstance.get(`${ApiUrls.nominations.LIST}?${params}`);
  return response.data;
}

export async function getNomination(id: number): Promise<NominationResponseDto> {
  const response = await axiosInstance.get(ApiUrls.nominations.DETAILS(id));
  console.log("Fetched nomination:", response.data);
  return response.data;
}

export async function getNominationsByParticipant(participantId: number): Promise<NominationResponseDto[]> {
  const response = await axiosInstance.get(ApiUrls.nominations.BY_PARTICIPANT(participantId));
  return response.data;
}

export async function createNomination(data: CreateNominationDto): Promise<NominationResponseDto> {
  const response = await axiosInstance.post(ApiUrls.nominations.LIST, data);
  return response.data;
}

export async function updateNomination(id: number, data: UpdateNominationDto): Promise<NominationResponseDto> {
  const response = await axiosInstance.put(ApiUrls.nominations.DETAILS(id), data);
  return response.data;
}

export async function updateNominationStatus(id: number, data: UpdateNominationStatusDto): Promise<NominationResponseDto> {
  const response = await axiosInstance.patch(`${ApiUrls.nominations.DETAILS(id)}/status`, data);
  return response.data;
}

export async function deleteNomination(id: number): Promise<void> {
  await axiosInstance.delete(ApiUrls.nominations.DETAILS(id));
}

// Aliases for backward compatibility with existing pages
export const getTrainings = getNominations;
export const searchTrainings = (search: string, page = 1, pageSize = 10) => getNominations(page, pageSize, search);
export const getTraining = getNomination;
export const createTraining = createNomination;
export const updateTraining = updateNomination;
export const deleteTraining = deleteNomination;
export const getActiveTrainings = () => getNominations(1, 100);
