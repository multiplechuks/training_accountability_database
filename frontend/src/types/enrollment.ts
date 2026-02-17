// Enrollment Stage Types
export interface Stage1ParticipantDto {
  title: string;
  firstname: string;
  lastname: string;
  middlename?: string;
  idNo: string;
  sex: string;
  dob: string;
  idType: string;
  phone: string;
  email: string;
  workTelephone?: string;
  designationFK?: number;
  departmentOrFacility?: string;
  dutyStation?: string;
}

export interface Stage2NextOfKinDto {
  firstname: string;
  lastname: string;
  relationship: string;
  phone: string;
  email: string;
  idNo: string;
}

export interface Stage3NominationDto {
  currentQualifications: string;
  nominatedProgram: string;
  specialty?: string;
  sponsorType: string;
  sponsorFK?: number;
  yearOfNomination: number;
  estimatedBudget: number;
  currency: string;
  professionalBody?: string;
  nominationStatus: string;
  statusReason?: string;
  nominationDate: string;
  approvalDate?: string;
  approvedBy?: string;
  notes?: string;
}

export interface Stage4AdmissionDto {
  institution: string;
  program: string;
  specialty?: string;
  countryOfStudy: string;
  startDate: string;
  endDate: string;
  duration: number;
  modeOfStudy: string;
  campusType: string;
  designationFK?: number;
  salaryScaleFK?: number;
  departmentFK?: number;
  facilityFK?: number;
  payrollDate?: string;
  studyLeaveDate?: string;
  allowanceStoppageDate?: string;
  needingTravel: boolean;
  departureDate?: string;
  arrivalDate?: string;
  sponsorFK?: number;
  registrationDate: string;
  trainingStatus: string;
  financialYear: string;
}

export interface Stage5BondDto {
  bondStartDate: string;
  bondEndDate: string;
  bondPeriodMonths: number;
  bondSigned: boolean;
  dateSigned?: string;
  bondStatus: string;
  bondAmount: number;
  bondConditions?: string;
  inductionCompleted: boolean;
  inductionDate?: string;
}

export interface AllowanceItemDto {
  allowanceTypeFK: number;
  allowanceTypeName: string;
  amount: number;
  startDate: string;
  endDate: string;
  frequency: string;
  allowanceStoppageDate?: string;
  comments?: string;
  statusFK: number;
}

export interface Stage6TrainingCostDto {
  allowances: AllowanceItemDto[];
}

export interface EnrollmentProgressDto {
  id: number;
  participantId: number | null; // Can be null if participant not created yet
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
}

export interface StartEnrollmentResponse {
  progressId: number;
  participantId?: number;
  message: string;
  currentStep: number;
  nextAction: string;
  alreadyExists?: boolean;
  isNewParticipant?: boolean;
}

export interface SaveStageResponse {
  message: string;
  nextStage?: number;
  participantId?: number;
  nominationId?: number;
  trainingId?: number;
  enrollmentId?: number;
  bondId?: number;
  allowanceIds?: number[];
  enrollmentComplete?: boolean;
}
