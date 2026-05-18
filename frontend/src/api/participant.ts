import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type { ParticipantResponseDto, CreateParticipantDto, UpdateParticipantDto, NextOfKinResponseDto, UpsertNextOfKinDto, PaginatedResponse } from "@/types";

export async function getParticipants(page = 1, pageSize = 10, search?: string): Promise<PaginatedResponse<ParticipantResponseDto>> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (search) params.append("search", search);
  const response = await axiosInstance.get(`${ApiUrls.participants.LIST}?${params}`);
  return response.data;
}

export async function getParticipant(id: number): Promise<ParticipantResponseDto> {
  const response = await axiosInstance.get(ApiUrls.participants.DETAILS(id));
  return response.data;
}

export async function createParticipant(data: CreateParticipantDto): Promise<ParticipantResponseDto> {
  const response = await axiosInstance.post(ApiUrls.participants.LIST, data);
  return response.data;
}

export async function updateParticipant(id: number, data: UpdateParticipantDto): Promise<ParticipantResponseDto> {
  const response = await axiosInstance.put(ApiUrls.participants.DETAILS(id), data);
  return response.data;
}

export async function deleteParticipant(id: number): Promise<void> {
  await axiosInstance.delete(ApiUrls.participants.DETAILS(id));
}

export async function searchParticipants(searchTerm: string, page = 1, pageSize = 10): Promise<PaginatedResponse<ParticipantResponseDto>> {
  return getParticipants(page, pageSize, searchTerm);
}

export async function getNextOfKin(participantId: number): Promise<NextOfKinResponseDto | null> {
  const response = await axiosInstance.get(ApiUrls.participants.NEXT_OF_KIN(participantId));
  return response.data;
}

export async function upsertNextOfKin(participantId: number, data: UpsertNextOfKinDto): Promise<NextOfKinResponseDto> {
  const response = await axiosInstance.put(ApiUrls.participants.NEXT_OF_KIN(participantId), data);
  return response.data;
}
