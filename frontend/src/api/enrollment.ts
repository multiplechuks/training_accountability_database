import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type {
  ParticipantEnrollmentDto,
  ParticipantEnrollmentResponseDto,
  PaginatedResponse,
  Stage1ParticipantDto,
  Stage2NextOfKinDto,
  Stage3NominationDto,
  Stage4AdmissionDto,
  Stage5BondDto,
  Stage6TrainingCostDto,
  EnrollmentProgressDto,
  StartEnrollmentResponse,
  SaveStageResponse
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

// Enrollment Wizard API
export const enrollmentWizard = {
  // Start enrollment
  async startEnrollment(participantId?: number): Promise<StartEnrollmentResponse> {
    const response = await axiosInstance.post("/enrollment-wizard/start", {
      participantId
    });
    return response.data;
  },

  // Create participant and start enrollment in one call
  // Accepts full Stage1ParticipantDto with all employment fields
  async createAndEnroll(data: Stage1ParticipantDto): Promise<StartEnrollmentResponse> {
    const response = await axiosInstance.post("/participants/create-and-enroll", data);
    return response.data;
  },

  // Get enrollment progress
  async getProgress(progressId: number): Promise<EnrollmentProgressDto> {
    const response = await axiosInstance.get(`/enrollment-wizard/progress/id/${progressId}`);
    return response.data;
  },

  // Save Stage 1: Participant
  async saveStage1(progressId: number, data: Stage1ParticipantDto): Promise<SaveStageResponse> {
    const response = await axiosInstance.post(`/enrollment-stages/${progressId}/stage1`, data);
    return response.data;
  },

  // Save Stage 2: Next of Kin
  async saveStage2(progressId: number, data: Stage2NextOfKinDto): Promise<SaveStageResponse> {
    const response = await axiosInstance.post(`/enrollment-stages/${progressId}/stage2`, data);
    return response.data;
  },

  // Save Stage 3: Nomination
  async saveStage3(progressId: number, data: Stage3NominationDto): Promise<SaveStageResponse> {
    const response = await axiosInstance.post(`/enrollment-stages/${progressId}/stage3`, data);
    return response.data;
  },

  // Save Stage 4: Admission
  async saveStage4(progressId: number, data: Stage4AdmissionDto): Promise<SaveStageResponse> {
    const response = await axiosInstance.post(`/enrollment-stages/${progressId}/stage4`, data);
    return response.data;
  },

  // Save Stage 5: Bonding
  async saveStage5(progressId: number, data: Stage5BondDto): Promise<SaveStageResponse> {
    const response = await axiosInstance.post(`/enrollment-stages/${progressId}/stage5`, data);
    return response.data;
  },

  // Save Stage 6: Training Costs
  async saveStage6(progressId: number, data: Stage6TrainingCostDto): Promise<SaveStageResponse> {
    const response = await axiosInstance.post(`/enrollment-stages/${progressId}/stage6`, data);
    return response.data;
  }
};
