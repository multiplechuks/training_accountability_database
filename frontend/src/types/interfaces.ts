// Shared interfaces and types for the Training Management System
import React from "react";

export interface BaseEntity {
  pk?: number;
  created?: string;
  modified?: string;
  deleted?: boolean;
}

// Lookup DTOs
export interface LookupDto {
  pk: number;
  name: string;
  code?: string;
  description?: string;
}

export interface Department extends LookupDto {
  // Additional department-specific fields
}

export interface Facility extends LookupDto {
  location: string;
}

export interface Designation extends LookupDto {
  title: string;
  level: string;
}

export interface SalaryScale extends LookupDto {
  grade: string;
  minSalary: number;
  maxSalary: number;
}

export interface Sponsor extends LookupDto {
  type: string; // Government, Private, International, etc.
}

// Participant and Training interfaces
export interface Participant extends BaseEntity {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone?: string;
  nationalId: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

// Participant DTOs that match backend structure
export interface ParticipantResponseDto {
  id: number;
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
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateParticipantDto {
  title?: string;
  firstname: string;
  lastname: string;
  middlename?: string;
  idNo: string;
  sex: string;
  dob: string;
  idType: string;
  phone: string;
  email: string;
}

export interface UpdateParticipantDto {
  title?: string;
  firstname?: string;
  lastname?: string;
  middlename?: string;
  sex?: string;
  dob?: string;
  idType?: string;
  phone?: string;
  email?: string;
}

export interface ParticipantWithEnrollmentsDto extends ParticipantResponseDto {
  enrollments: EnrollmentSummaryDto[];
}

export interface EnrollmentSummaryDto {
  id: number;
  trainingId: number;
  trainingProgram: string;
  institution: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface Training extends BaseEntity {
  title: string;
  description?: string;
  duration: number;
  startDate: string;
  endDate: string;
  venue?: string;
  capacity?: number;
  cost?: number;
  status: TrainingStatus;
}

// Training DTOs that match backend structure
export interface TrainingResponseDto {
  id: number;
  institution: string;
  program: string;
  countryOfStudy: string;
  startDate: string;
  endDate: string;
  duration: number;
  departureDate?: string;
  arrivalDate?: string;
  vacationEmploymentPeriod?: string;
  resumptionDate?: string;
  extensionPeriod?: string;
  dateBondSigned?: string;
  bondServingPeriod?: string;
  sponsorFK?: number;
  modeOfStudy: string;
  registrationDate: string;
  trainingStatus: string;
  financialYear: string;
  campusType: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrainingDto {
  institution: string;
  program: string;
  countryOfStudy: string;
  startDate: string;
  endDate: string;
  duration: number;
  departureDate?: string;
  arrivalDate?: string;
  vacationEmploymentPeriod?: string;
  resumptionDate?: string;
  extensionPeriod?: string;
  dateBondSigned?: string;
  bondServingPeriod?: string;
  sponsorFK?: number;
  modeOfStudy: string;
  trainingStatus: string;
  financialYear: string;
  campusType: string;
}

export interface UpdateTrainingDto {
  institution?: string;
  program?: string;
  countryOfStudy?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
  departureDate?: string;
  arrivalDate?: string;
  vacationEmploymentPeriod?: string;
  resumptionDate?: string;
  extensionPeriod?: string;
  dateBondSigned?: string;
  bondServingPeriod?: string;
  sponsorFK?: number;
  modeOfStudy?: string;
  trainingStatus?: string;
  financialYear?: string;
  campusType?: string;
}

export interface TrainingWithParticipantsDto extends TrainingResponseDto {
  participants: TrainingParticipantSummaryDto[];
}

export interface TrainingParticipantSummaryDto {
  id: number;
  fullName: string;
  idNo: string;
  email: string;
  phone: string;
  enrollmentDate: string;
}

// Training selection helpers for enrollment forms
export interface TrainingOption {
  value: number;
  label: string;
  institution: string;
  duration: number;
  startDate: string;
  endDate: string;
  financialYear: string;
}

// Enrollment Form DTO
export interface ParticipantEnrollmentDto {
  // Section 1 - Participant and Training Selection
  participantFK: number;
  trainingFK: number;

  // Section 2 - Employment Information
  designationFK?: number;
  salaryScaleFK?: number;
  departmentFK?: number;
  facilityFK?: number;

  payrollDate?: string;
  studyLeaveDate?: string;
  allowanceStoppageDate?: string;

  // Section 3 - Study Information
  startDate: string;
  endDate: string;
  duration: number;
  needingTravel: boolean;
  departureDate?: string;
  arrivalDate?: string;

  // Section 4 - Bond Information
  dateBondSigned?: string;
  bondServingPeriod?: string;

  // Section 5 - Others
  sponsorFK?: number;
  modeOfStudy: string;
  registrationDate: string;
  trainingStatus: string;
  financialYear: string;
  campusType: string;
}

export interface ParticipantEnrollmentResponseDto extends ParticipantEnrollmentDto {
  pk?: number;
  CreatedAt?: string;
  CreatedBy?: string;
  UpdatedAt?: string;
  UpdatedBy?: string;

  // Navigation properties (using backend DTO names)
  participant?: ParticipantSummaryDto;
  training?: TrainingSummaryDto;
  department?: LookupDto;
  facility?: LookupDto;
  designation?: LookupDto;
  salaryScale?: LookupDto;
  sponsor?: LookupDto;
}

// Backend DTO types to match the C# response
export interface ParticipantSummaryDto {
  pk: number;
  title: string;
  firstname: string;
  lastname: string;
  middlename?: string;
  idNo: string;
  email: string;
  phone: string;
  fullName: string;
}

export interface TrainingSummaryDto {
  pk: number;
  institution: string;
  program: string;
  countryOfStudy: string;
  startDate: string;
  endDate: string;
  duration: number;
  financialYear: string;
}

// Allowance interfaces
export interface AllowanceType extends LookupDto {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface AllowanceStatus extends LookupDto {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateAllowanceTypeDto {
  name: string;
  description?: string;
}

export interface UpdateAllowanceTypeDto {
  name?: string;
  description?: string;
}

export interface CreateAllowanceStatusDto {
  name: string;
  description?: string;
}

export interface UpdateAllowanceStatusDto {
  name?: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type AllowanceTypeResponse = AllowanceType[];
export type AllowanceStatusResponse = AllowanceStatus[];

export interface Allowance extends BaseEntity {
  amount: number;
  startDate: string;
  endDate: string;
  comments?: string;
  trainingFK: number;
  statusFK: number;
  participantFK: number;
  allowanceTypeFK: number;

  // Navigation properties
  training?: Training;
  allowanceStatus?: AllowanceStatus;
  participant?: Participant;
  allowanceType?: AllowanceType;
}

export interface CreateAllowanceDto {
  amount: number;
  startDate: string;
  endDate: string;
  comments?: string;
  trainingFK: number;
  statusFK: number;
  participantFK: number;
  allowanceTypeFK: number;
}

export interface UpdateAllowanceDto extends Partial<CreateAllowanceDto> {
  pk: number;
}

export interface AllowanceResponseDto extends Allowance {
  pk: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// Component Props Interfaces
export interface SidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

export interface LayoutProps {
  children: React.ReactNode;
  activeMenuItem: string;
  onMenuItemClick: (itemId: string) => void;
}

export interface SearchableSelectProps {
  options?: LookupDto[];
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  loading?: boolean;
  error?: string;
  onSearch?: (searchTerm: string) => Promise<LookupDto[]>;
  searchable?: boolean;
  minSearchLength?: number;
  searchDelay?: number;
  preloadOptions?: boolean; // Whether to load initial options on mount
}

export interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// Enums

export enum TrainingStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Configuration interfaces
export interface ConfigurationItem {
  key: string;
  value: string;
  description?: string;
  category: string;
  isEditable: boolean;
}

export interface ConfigurationCategory {
  name: string;
  description?: string;
  items: ConfigurationItem[];
}

// Menu item interface
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  children?: MenuItem[];
}

// Form validation
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  loading: boolean;
  dirty: boolean;
}

// API Response interfaces
export interface BaseApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Lookup API responses (using existing interfaces with proper typing)
export type DepartmentResponse = Department[];
export type FacilityResponse = Facility[];
export type DesignationResponse = Designation[];
export type SalaryScaleResponse = SalaryScale[];
export type SponsorResponse = Sponsor[];

// Enrollment API interfaces
export interface EnrollmentResponse {
  id: number;
  participant: Participant;
  training: Training;
  enrollmentDate: string;
  status: string;
  department?: Department;
  facility?: Facility;
  designation?: Designation;
  salaryScale?: SalaryScale;
  sponsor?: Sponsor;
}

export interface CreateEnrollmentRequest {
  participantFK: number;
  trainingFK: number;
  designationFK?: number;
  salaryScaleFK?: number;
  departmentFK?: number;
  facilityFK?: number;
  sponsorFK?: number;
  accomodationRequired: boolean;
  transportRequired: boolean;
  specialRequirements?: string;
}

export interface UpdateEnrollmentRequest extends CreateEnrollmentRequest {
  id: number;
}
