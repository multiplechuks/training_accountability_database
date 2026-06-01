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

export interface AdmissionProgressDto {
  id: number;
  participantId: number | null;
  currentStep: number;
  admissionStatus: string;
  form1Complete: boolean;
  form2Complete: boolean;
  form3Complete: boolean;
  form4Complete: boolean;
  form5Complete: boolean;
  form6Complete: boolean;
  lastUpdated: string;
  completedDate?: string;
  nominationId?: number;
  admissionId?: number;
  notes?: string;
}

export interface StartAdmissionResponse {
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
  admissionId?: number;
  bondId?: number;
  allowanceIds?: number[];
  admissionComplete?: boolean;
}
