import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type {
  StartEnrollmentDto,
  StartEnrollmentResponse,
  EnrollmentProgressDto,
  UpdateProgressDto,
  UpdateProgressResponse,
  SaveProgressDto,
  SaveProgressResponse,
  CancelEnrollmentDto,
  EnrollmentStatistics,
  InProgressEnrollmentsResponse,
  Form2_NominationData
} from "@/types/nomination";

// Start a new enrollment/nomination process
export async function startEnrollment(data?: StartEnrollmentDto): Promise<StartEnrollmentResponse> {
  const response = await axiosInstance.post(ApiUrls.nomination.START, data ?? {});
  return response.data;
}

// Get enrollment progress by participant ID
export async function getEnrollmentProgressByParticipant(participantId: number): Promise<EnrollmentProgressDto> {
  const response = await axiosInstance.get(ApiUrls.nomination.GET_PROGRESS_BY_PARTICIPANT(participantId));
  return response.data;
}

// Get enrollment progress by progress ID
export async function getEnrollmentProgressById(progressId: number): Promise<EnrollmentProgressDto> {
  const response = await axiosInstance.get(ApiUrls.nomination.GET_PROGRESS_BY_ID(progressId));
  return response.data;
}

// Update enrollment progress - mark a step as complete
export async function updateEnrollmentStep(
  progressId: number,
  step: number,
  data: UpdateProgressDto
): Promise<UpdateProgressResponse> {
  const response = await axiosInstance.put(ApiUrls.nomination.UPDATE_STEP(progressId, step), data);
  return response.data;
}

// Save progress on current step without marking as complete
export async function saveProgress(progressId: number, data: SaveProgressDto): Promise<SaveProgressResponse> {
  const response = await axiosInstance.put(ApiUrls.nomination.SAVE_PROGRESS(progressId), data);
  return response.data;
}

// Save Form 2 (Nomination) data
export async function saveNominationForm(progressId: number, data: Form2_NominationData): Promise<{ message: string; nominationId: number }> {
  const response = await axiosInstance.post(ApiUrls.nomination.SAVE_FORM2(progressId), data);
  return response.data;
}

// Get Form 2 (Nomination) data
export async function getNominationForm(progressId: number): Promise<Form2_NominationData | null> {
  const response = await axiosInstance.get(ApiUrls.nomination.GET_FORM2(progressId));
  return response.data?.data || response.data;
}

// Cancel an enrollment process
export async function cancelEnrollment(progressId: number, data?: CancelEnrollmentDto): Promise<{ message: string }> {
  const response = await axiosInstance.put(ApiUrls.nomination.CANCEL(progressId), data || {});
  return response.data;
}

// Resume an enrollment from a specific step
export async function resumeEnrollment(progressId: number, step: number): Promise<{ message: string; currentStep: number }> {
  const response = await axiosInstance.put(ApiUrls.nomination.RESUME(progressId, step));
  return response.data;
}

// Get all in-progress enrollments
export async function getInProgressEnrollments(status?: string): Promise<InProgressEnrollmentsResponse> {
  const response = await axiosInstance.get(ApiUrls.nomination.IN_PROGRESS, {
    params: status ? { status } : undefined
  });
  return response.data;
}

// Get enrollment statistics
export async function getEnrollmentStatistics(): Promise<EnrollmentStatistics> {
  const response = await axiosInstance.get(ApiUrls.nomination.STATISTICS);
  return response.data;
}
