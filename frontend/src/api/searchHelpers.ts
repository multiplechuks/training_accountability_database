import { searchParticipants } from "./participant";
import { searchTrainings } from "./training";
import { apiService } from "./apiService";
import type { ParticipantResponseDto, TrainingResponseDto, PaginatedResponse, LookupDto, DesignationResponse, SalaryScaleResponse, DepartmentResponse, FacilityResponse, SponsorResponse } from "../types";

export async function searchParticipantsForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const response: PaginatedResponse<ParticipantResponseDto> = await searchParticipants(searchTerm, 1, 10);
    
    if (response) {
      return response.data.map((participant: ParticipantResponseDto) => ({
        pk: participant.id,
        name: `${participant.firstname} ${participant.lastname}`,
        code: participant.email,
        description: participant.email
      }));
    }
    
    return [];
  } catch {
    return [];
  }
}

export async function searchTrainingsForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const response: PaginatedResponse<TrainingResponseDto> = await searchTrainings(searchTerm, 1, 10);
    
    if (response) {
      return response.data.map((training: TrainingResponseDto) => ({
        pk: training.id,
        name: training.program,
        code: training.institution,
        description: `${training.program} at ${training.institution}`
      }));
    }
    
    return [];
  } catch {
    return [];
  }
}

export async function searchDesignationsForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const response: DesignationResponse = await apiService.getDesignations();
    
    if (response && Array.isArray(response)) {
      const filtered = response.filter((designation) => 
        designation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (designation.code && designation.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (designation.description && designation.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      return filtered.map((designation) => ({
        pk: designation.pk,
        name: designation.name,
        code: designation.code,
        description: designation.description
      }));
    }
    
    return [];
  } catch {
    return [];
  }
}

export async function searchSalaryScalesForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const response: SalaryScaleResponse = await apiService.getSalaryScales();
    
    if (response && Array.isArray(response)) {
      const filtered = response.filter((scale) =>
        scale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (scale.code && scale.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (scale.description && scale.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      return filtered.map((scale) => ({
        pk: scale.pk,
        name: scale.name,
        code: scale.code,
      }));
    }
    
    return [];
  } catch {
    return [];
  }
}

export async function searchDepartmentsForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    // const response: DepartmentResponse = await apiService.getDepartments();
    const response: DepartmentResponse = [
      {
        pk: 1,
        name: "Primary Health Care",
        code: "PHC",
        description: "Primary Health Care Department"
      },
      {
        pk: 2,
        name: "Nursing and Midwifery",
        code: "NM",
        description: "Nursing and Midwifery Department"
      },
      {
        pk: 3,
        name: "Public Health",
        code: "PH",
        description: "Public Health Department"
      },
      {
        pk: 4,
        name: "Specialized Health Care",
        code: "SHC",
        description: "Specialized Health Care Department"
      }
    ];

    if (response && Array.isArray(response)) {
      const filtered = response.filter((department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (department.code && department.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (department.description && department.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      return filtered.map((department) => ({
        pk: department.pk,
        name: department.name,
        code: department.code,
      }));
    }
    
    return [];
  } catch {
    return [];
  }
}

export async function searchMinistriesForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const response: DepartmentResponse = await apiService.getDepartments();

    if (response && Array.isArray(response)) {
      const filtered = response.filter((department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (department.code && department.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (department.description && department.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      return filtered.map((department) => ({
        pk: department.pk,
        name: department.name,
        code: department.code,
      }));
    }
    
    return [];
  } catch {
    return [];
  }
}

export async function searchFacilitiesForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const response: FacilityResponse = await apiService.getFacilities();

    if (response && Array.isArray(response)) {
      const filtered = response.filter((facility) =>
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (facility.code && facility.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (facility.description && facility.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      return filtered.map((facility) => ({
        pk: facility.pk,
        name: facility.name,
        code: facility.code,
      }));
    }
    
    return [];
  } catch {
    return [];
  }
}

export async function searchSponsorsForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const response: SponsorResponse = await apiService.getSponsors();

    if (response && Array.isArray(response)) {
      const filtered = response.filter((sponsor) =>
        sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sponsor.code && sponsor.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sponsor.description && sponsor.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      return filtered.map((sponsor) => ({
        pk: sponsor.pk,
        name: sponsor.name,
        code: sponsor.code,
      }));
    }
    
    return [];
  } catch {
    return [];
  }
}

export async function searchAllowanceTypesForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const response = await apiService.getAllowanceTypes();

    if (response && Array.isArray(response)) {
      const filtered = response.filter((type) =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      return filtered.map((type) => ({
        pk: type.pk,
        name: type.name,
        description: type.description,
      }));
    }
    
    return [];
  } catch {
    return [];
  }
}

export async function searchAllowanceStatusesForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const response = await apiService.getAllowanceStatuses();

    if (response && Array.isArray(response)) {
      const filtered = response.filter((status) =>
        status.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (status.description && status.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      return filtered.map((status) => ({
        pk: status.pk,
        name: status.name,
        description: status.description,
      }));
    }
    
    return [];
  } catch {
    return [];
  }
}
