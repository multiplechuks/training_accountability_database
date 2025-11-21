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
  PARTICIPANT_ENROLLMENTS: (id: number | string) => `/participants/${id}/enrollments`,
  
  // Training routes
  TRAININGS: "/training",
  TRAINING_DETAILS: (id: number | string) => `/training/view/${id}`,
  TRAINING_CREATE: "/training/create",
  TRAINING_EDIT: (id: number | string) => `/training/edit/${id}`,
  
  // Enrollment routes
  ENROLLMENTS: "/enrollment",
  ENROLLMENT_CREATE: "/enrollment/create",
  ENROLLMENT_DETAILS: (id: number | string) => `/enrollment/view/${id}`,
  ENROLLMENT_EDIT: (id: number | string) => `/enrollment/edit/${id}`,
  
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
  REPORTS_ENROLLMENT: "/reports/enrollment",
  CONFIGURATION: "/configuration",
} as const;

// Route helpers for navigation
export const RouteHelpers = {
  goToParticipantDetails: (id: number | string) => NavigationRoutes.PARTICIPANT_DETAILS(id),
  goToParticipantEdit: (id: number | string) => NavigationRoutes.PARTICIPANT_EDIT(id),
  goToTrainingDetails: (id: number | string) => NavigationRoutes.TRAINING_DETAILS(id),
  goToTrainingEdit: (id: number | string) => NavigationRoutes.TRAINING_EDIT(id),
  goToEnrollmentDetails: (id: number | string) => NavigationRoutes.ENROLLMENT_DETAILS(id),
  goToEnrollmentEdit: (id: number | string) => NavigationRoutes.ENROLLMENT_EDIT(id),
} as const;
