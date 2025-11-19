import axiosInstance from "@/utils/axiosInstance";
import { ApiUrls } from "@/constants/apiUrls";
import type { 
  TrainingResponseDto, 
  CreateTrainingDto, 
  UpdateTrainingDto, 
  TrainingWithParticipantsDto, 
  TrainingOption,
  PaginatedResponse 
} from "@/types";

// Get all trainings with pagination
export async function getTrainings(page = 1, pageSize = 10): Promise<PaginatedResponse<TrainingResponseDto>> {
  const response = await axiosInstance.get(`${ApiUrls.trainings.LIST}?page=${page}&pageSize=${pageSize}`);
  return response.data;
}

// Get a single training by ID
export async function getTraining(id: number): Promise<TrainingResponseDto> {
  const response = await axiosInstance.get(ApiUrls.trainings.DETAILS(id));
  return response.data;
}

// Get a training with its participants
export async function getTrainingWithParticipants(id: number): Promise<TrainingWithParticipantsDto> {
  const response = await axiosInstance.get(ApiUrls.trainings.WITH_PARTICIPANTS(id));
  return response.data;
}

// Get active trainings (useful for enrollment forms)
export async function getActiveTrainings(): Promise<TrainingResponseDto[]> {
  const response = await axiosInstance.get(ApiUrls.trainings.ACTIVE);
  return response.data;
}

// Get trainings by financial year
export async function getTrainingsByFinancialYear(financialYear: string): Promise<TrainingResponseDto[]> {
  const response = await axiosInstance.get(ApiUrls.trainings.BY_FINANCIAL_YEAR(financialYear));
  return response.data;
}

// Search trainings
export async function searchTrainings(searchTerm: string, page = 1, pageSize = 10): Promise<PaginatedResponse<TrainingResponseDto>> {
  const response = await axiosInstance.get(`${ApiUrls.trainings.SEARCH}?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&pageSize=${pageSize}`);
  return response.data;
}

// Create a new training
export async function createTraining(trainingData: CreateTrainingDto): Promise<TrainingResponseDto> {
  const response = await axiosInstance.post(ApiUrls.trainings.LIST, trainingData);
  return response.data;
}

// Update an existing training
export async function updateTraining(id: number, trainingData: UpdateTrainingDto): Promise<TrainingResponseDto> {
  const response = await axiosInstance.put(ApiUrls.trainings.DETAILS(id), trainingData);
  return response.data;
}

// Delete a training
export async function deleteTraining(id: number): Promise<void> {
  await axiosInstance.delete(ApiUrls.trainings.DETAILS(id));
}

// Training selection helpers for enrollment forms

// Get training options formatted for select dropdowns in enrollment forms
export async function getTrainingOptions(): Promise<TrainingOption[]> {
  const trainings = await getActiveTrainings();
  
  return trainings.map(training => ({
    value: training.id,
    label: `${training.program} - ${training.institution}`,
    institution: training.institution,
    duration: training.duration,
    startDate: training.startDate,
    endDate: training.endDate,
    financialYear: training.financialYear
  }));
}

// Get training options for a specific financial year (useful for enrollment forms)
export async function getTrainingOptionsByFinancialYear(financialYear: string): Promise<TrainingOption[]> {
  const trainings = await getTrainingsByFinancialYear(financialYear);
  
  return trainings.map(training => ({
    value: training.id,
    label: `${training.program} - ${training.institution}`,
    institution: training.institution,
    duration: training.duration,
    startDate: training.startDate,
    endDate: training.endDate,
    financialYear: training.financialYear
  }));
}
