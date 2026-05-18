import axiosInstance from "@/utils/axiosInstance";
import { searchParticipants, getParticipants } from "./participant";
import { getNominations } from "./training";
import { getAdmissions } from "./enrollment";
import { getAllowanceTypesLookup } from "./allowanceType";
import { getAllowanceStatusesLookup } from "./allowanceStatus";
import { ApiUrls } from "@/constants/apiUrls";
import type { ParticipantResponseDto, NominationResponseDto, AdmissionResponseDto, PaginatedResponse, LookupDto, LookupItemDto } from "../types";

// ─── Participants ────────────────────────────────────────────────────────────
export async function searchParticipantsForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const response: PaginatedResponse<ParticipantResponseDto> = searchTerm
      ? await searchParticipants(searchTerm, 1, 10)
      : await getParticipants(1, 50);
    return (response?.data ?? []).map((p) => ({
      pk: p.pk,
      name: p.fullName ?? `${p.firstname} ${p.lastname}`,
      code: p.idNumber,
      description: p.email,
    }));
  } catch {
    return [];
  }
}

// ─── Nominations (used as "Trainings" in legacy pages) ──────────────────────
export async function searchTrainingsForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const response: PaginatedResponse<NominationResponseDto> = searchTerm
      ? await getNominations(1, 10, searchTerm)
      : await getNominations(1, 50);
    return (response?.data ?? []).map((n) => ({
      pk: n.pk,
      name: n.nominatedProgramName ?? `Nomination #${n.pk}`,
      code: String(n.yearOfNomination ?? ""),
      description: n.participantName ?? "",
    }));
  } catch {
    return [];
  }
}

// ─── Admissions ──────────────────────────────────────────────────────────────
export async function searchAdmissionsForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const response: PaginatedResponse<AdmissionResponseDto> = await getAdmissions(1, 50);
    const all = response?.data ?? [];
    const filtered = searchTerm
      ? all.filter((a) =>
          String(a.pk).includes(searchTerm) ||
          (a.admissionProgramName ?? "").toLowerCase().includes(searchTerm.toLowerCase())
        )
      : all;
    return filtered.map((a) => ({
      pk: a.pk,
      name: a.admissionProgramName ? `#${a.pk} – ${a.admissionProgramName}` : `Admission #${a.pk}`,
      code: String(a.nominationFK),
      description: a.modeOfStudyName ?? "",
    }));
  } catch {
    return [];
  }
}

// ─── Lookups via backend /lookups/* ──────────────────────────────────────────
async function fetchLookup(url: string, searchTerm: string): Promise<LookupDto[]> {
  try {
    const res = await axiosInstance.get<LookupItemDto[]>(url);
    const items: LookupItemDto[] = Array.isArray(res.data) ? res.data : (res.data as { items?: LookupItemDto[] })?.items ?? [];
    const lower = searchTerm.toLowerCase();
    return items
      .filter((item) => !searchTerm || item.name.toLowerCase().includes(lower))
      .map((item) => ({ pk: item.pk, name: item.name, description: item.description }));
  } catch {
    return [];
  }
}

export async function searchDepartmentsForSelect(searchTerm: string): Promise<LookupDto[]> {
  return fetchLookup(ApiUrls.lookups.DEPARTMENTS, searchTerm);
}

export async function searchSalaryScalesForSelect(searchTerm: string): Promise<LookupDto[]> {
  return fetchLookup(ApiUrls.lookups.SALARY_SCALES, searchTerm);
}

export async function searchDesignationsForSelect(searchTerm: string): Promise<LookupDto[]> {
  // No designations endpoint in new backend – return empty
  return [];
}

export async function searchMinistriesForSelect(searchTerm: string): Promise<LookupDto[]> {
  return fetchLookup(ApiUrls.lookups.DEPARTMENTS, searchTerm);
}

export async function searchFacilitiesForSelect(searchTerm: string): Promise<LookupDto[]> {
  // No facilities endpoint in new backend – return empty
  return [];
}

export async function searchSponsorsForSelect(searchTerm: string): Promise<LookupDto[]> {
  return fetchLookup(ApiUrls.lookups.SPONSOR_TYPES, searchTerm);
}

export async function searchAllowanceTypesForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const items = await getAllowanceTypesLookup();
    const lower = searchTerm.toLowerCase();
    return items
      .filter((t) => !searchTerm || t.name.toLowerCase().includes(lower))
      .map((t) => ({ pk: t.pk, name: t.name, description: t.description }));
  } catch {
    return [];
  }
}

export async function searchAllowanceStatusesForSelect(searchTerm: string): Promise<LookupDto[]> {
  try {
    const items = await getAllowanceStatusesLookup();
    const lower = searchTerm.toLowerCase();
    return items
      .filter((s) => !searchTerm || s.name.toLowerCase().includes(lower))
      .map((s) => ({ pk: s.pk, name: s.name, description: s.description }));
  } catch {
    return [];
  }
}
