import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type { 
  ParticipantEnrollmentDto, 
  ParticipantEnrollmentResponseDto, 
  PaginatedResponse 
} from "@/types";

// Get all enrollments with pagination
export async function getEnrollments(page = 1, pageSize = 10): Promise<PaginatedResponse<ParticipantEnrollmentResponseDto>> {
  const response = await axiosInstance.get(ApiUrls.enrollment.LIST, {
    params: { page, pageSize }
  });
  return response.data;
}

// Get enrollment by ID
export async function getEnrollment(id: number): Promise<ParticipantEnrollmentResponseDto> {
  const response = await axiosInstance.get(ApiUrls.enrollment.BY_ID(id));
  return response.data;
}

// Get enrollments by participant ID
export async function getEnrollmentsByParticipant(participantId: number): Promise<ParticipantEnrollmentResponseDto[]> {
  const response = await axiosInstance.get(ApiUrls.enrollment.BY_PARTICIPANT(participantId));
  return response.data;
}

// Get enrollments by training ID
export async function getEnrollmentsByTraining(trainingId: number): Promise<ParticipantEnrollmentResponseDto[]> {
  const response = await axiosInstance.get(ApiUrls.enrollment.BY_TRAINING(trainingId));
  return response.data;
}

// Create new enrollment
export async function createEnrollment(enrollmentData: ParticipantEnrollmentDto): Promise<ParticipantEnrollmentResponseDto> {
  const response = await axiosInstance.post(ApiUrls.enrollment.CREATE, enrollmentData);
  return response.data;
}

// Update existing enrollment
export async function updateEnrollment(id: number, enrollmentData: ParticipantEnrollmentDto): Promise<ParticipantEnrollmentResponseDto> {
  const response = await axiosInstance.put(ApiUrls.enrollment.UPDATE(id), enrollmentData);
  return response.data;
}

// Delete enrollment
export async function deleteEnrollment(id: number): Promise<{ message: string }> {
  const response = await axiosInstance.delete(ApiUrls.enrollment.DELETE(id));
  return response.data;
}