// Nomination and Enrollment Wizard Types

export interface EnrollmentProgressDto {
  id: number;
  participantId: number;
  currentStep: number;
  enrollmentStatus: string;
  form1Complete: boolean;
  form2Complete: boolean;
  form3Complete: boolean;
  form4Complete: boolean;
  form5Complete: boolean;
  form6Complete: boolean;
  lastUpdated: string;
  completedDate?: string;
  nominationId?: number;
  enrollmentId?: number;
  notes?: string;
  stage2_NextOfKinData?: string;
  stage3_NominationData?: string;
  stage4_AdmissionData?: string;
  stage5_BondingData?: string;
  stage6_TrainingCostsData?: string;
}

export interface EnrollmentProgressSummaryDto {
  progressId: number;
  participantId: number;
  participantName: string;
  currentStep: number;
  lastUpdated: string;
  percentComplete: number;
  status: string;
}

export interface StartEnrollmentDto {
  participantId?: number;
}

export interface StartEnrollmentResponse {
  progressId: number;
  message: string;
  currentStep: number;
  nextAction?: string;
  alreadyExists?: boolean;
}

export interface UpdateProgressDto {
  participantId?: number;
  nominationId?: number;
  enrollmentId?: number;
  notes?: string;
}

export interface UpdateProgressResponse {
  message: string;
  currentStep: number;
  completed: boolean;
  nextStep?: number;
  nextAction?: string;
}

export interface SaveProgressDto {
  notes?: string;
}

export interface SaveProgressResponse {
  message: string;
  currentStep: number;
}

export interface CancelEnrollmentDto {
  reason?: string;
}

export interface EnrollmentStatistics {
  total: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  byStep: {
    step1: number;
    step2: number;
    step3: number;
    step4: number;
    step5: number;
    step6: number;
  };
  recentCompletions: Array<{
    participantId: number;
    completedDate: string;
  }>;
}

export interface InProgressEnrollmentsResponse {
  total: number;
  enrollments: EnrollmentProgressSummaryDto[];
}

// Form data interfaces for each step
export interface Form1_ParticipantProfileData {
  // Option to select existing or create new
  participantId?: number;
  selectedParticipantName?: string; // Name captured when selecting an existing participant
  
  // If creating new participant
  title?: string;
  firstname?: string;
  lastname?: string;
  middlename?: string;
  idNo?: string;
  sex?: string;
  dob?: string;
  idType?: string;
  phone?: string;
  email?: string;
  postalAddress?: string;
  
  // Employment information
  workTelephone?: string;
  designationFK?: number;
  departmentOrFacility?: string;
  dutyStation?: string;
}

export interface Form2_NextOfKinData {
  nextOfKinName?: string;
  nextOfKinRelationship?: string;
  nextOfKinContactNo?: string;
}

export interface Form3_NominationData {
  currentQualifications?: string[]; // Array to allow multiple qualifications
  nominatedProgram?: string;
  sponsorType?: string; // Govt sponsor, etc.
  yearOfNomination?: number;
  estimatedBudget?: number;
  professionalBody?: string; // BHPC, etc.
}

export interface Form4_AdmissionData {
  dateOfAdmission?: string;
  programName?: string; // Can re-enter to link with nominated program
  trainingFK?: number; // Training ID for database foreign key
  institution?: string; // Display only - from selected training
  country?: string; // Display only - from selected training
  modeOfStudy?: string; // Full-time, Part-time, Online, etc.
  releaseStartDate?: string;
  releaseEndDate?: string;
  startDate?: string;
  endDate?: string;
  lengthOfStudy?: number;
}

export interface Form5_BondingData {
  bondSigned?: string; // Yes/No dropdown
  dateSigned?: string;
  reasonsNotSigned?: string;
  departureDate?: string;
  travelMode?: string; // Road/Air dropdown
}

export interface AllowanceItem {
  allowanceTypeFK: number;
  allowanceTypeName?: string;
  statusFK: number;
  amount: number;
  startDate: string;
  endDate: string;
  frequency: string;
  comments?: string;
}

export interface Form6_TrainingCostsData {
  allowances: AllowanceItem[];
}

export interface Form7_CompletionData {
  completionNotes?: string;
}
