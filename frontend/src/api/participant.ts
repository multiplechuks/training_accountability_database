import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type { ParticipantResponseDto, CreateParticipantDto, UpdateParticipantDto, ParticipantWithEnrollmentsDto, PaginatedResponse } from "@/types";

// Get all participants with pagination
export async function getParticipants(page = 1, pageSize = 10): Promise<PaginatedResponse<ParticipantResponseDto>> {
  const response = await axiosInstance.get(`${ApiUrls.participants.LIST}?page=${page}&pageSize=${pageSize}`);
  return response.data;
}

// Get a single participant by ID
export async function getParticipant(id: number): Promise<ParticipantResponseDto> {
  const response = await axiosInstance.get(ApiUrls.participants.DETAILS(id));
  return response.data;
}

// Get a participant with their enrollments
export async function getParticipantWithEnrollments(id: number): Promise<ParticipantWithEnrollmentsDto> {
  const response = await axiosInstance.get(ApiUrls.participants.WITH_ENROLLMENTS(id));
  return response.data;
}

// Create a new participant
export async function createParticipant(participantData: CreateParticipantDto): Promise<ParticipantResponseDto> {
  const response = await axiosInstance.post(ApiUrls.participants.LIST, participantData);
  return response.data;
}

// Update an existing participant
export async function updateParticipant(id: number, participantData: UpdateParticipantDto): Promise<ParticipantResponseDto> {
  const response = await axiosInstance.put(ApiUrls.participants.DETAILS(id), participantData);
  return response.data;
}

// Delete a participant
export async function deleteParticipant(id: number): Promise<void> {
  await axiosInstance.delete(ApiUrls.participants.DETAILS(id));
}

// Search participants
export async function searchParticipants(searchTerm: string, page = 1, pageSize = 10): Promise<PaginatedResponse<ParticipantResponseDto>> {
  const response = await axiosInstance.get(`${ApiUrls.participants.SEARCH}?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}`);
  return response.data;
}
