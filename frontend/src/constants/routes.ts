// Navigation routes for programmatic navigation
export const NavigationRoutes = {
  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  
  // Dashboard
  DASHBOARD: "/dashboard",
  
  // Participant routes
  PARTICIPANTS: "/participants",
  PARTICIPANT_DETAILS: (id: number | string) => `/participants/view/${id}`,
  PARTICIPANT_CREATE: "/participants/create",
  PARTICIPANT_EDIT: (id: number | string) => `/participants/edit/${id}`,
  PARTICIPANT_ADMISSIONS: (id: number | string) => `/participants/${id}/admissions`,
  PARTICIPANT_HISTORY: "/participants/history",
  
  // Training routes
  TRAININGS: "/training",
  TRAINING_DETAILS: (id: number | string) => `/training/view/${id}`,
  TRAINING_CREATE: "/training/create",
  TRAINING_EDIT: (id: number | string) => `/training/edit/${id}`,
  
  // Admission routes
  ADMISSIONS: "/admission",
  ADMISSION_CREATE: "/admission/create",
  ADMISSION_DETAILS: (id: number | string) => `/admission/view/${id}`,
  ADMISSION_EDIT: (id: number | string) => `/admission/edit/${id}`,
  
  // Nomination routes
  NOMINATIONS: "/nomination/list",
  NOMINATION_START: "/nomination/start",
  NOMINATION_VIEW: (id: number | string) => `/nomination/view/${id}`,
  NOMINATION_PROGRESS: (progressId: number | string) => `/nomination/progress/${progressId}`,

  // Allowance routes
  ALLOWANCES: "/allowances",
  ALLOWANCE_DETAILS: (id: number | string) => `/allowances/view/${id}`,
  ALLOWANCE_CREATE: "/allowances/create",
  ALLOWANCE_EDIT: (id: number | string) => `/allowances/edit/${id}`,
  ALLOWANCE_DASHBOARD: "/allowances/dashboard",

  // Reports and Admin
  REPORTS: "/reports",
  REPORTS_PARTICIPANTS: "/reports/participants",
  REPORTS_TRAINING: "/reports/training",
  REPORTS_ADMISSION: "/reports/admission",
  CONFIGURATION: "/configuration",
} as const;

// Route helpers for navigation
export const RouteHelpers = {
  goToParticipantDetails: (id: number | string) => NavigationRoutes.PARTICIPANT_DETAILS(id),
  goToParticipantEdit: (id: number | string) => NavigationRoutes.PARTICIPANT_EDIT(id),
  goToTrainingDetails: (id: number | string) => NavigationRoutes.TRAINING_DETAILS(id),
  goToTrainingEdit: (id: number | string) => NavigationRoutes.TRAINING_EDIT(id),
  goToAdmissionDetails: (id: number | string) => NavigationRoutes.ADMISSION_DETAILS(id),
  goToAdmissionEdit: (id: number | string) => NavigationRoutes.ADMISSION_EDIT(id),
} as const;
