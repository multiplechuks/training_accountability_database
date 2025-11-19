// Environment Configuration
export const ENV = {
  APP_TITLE: import.meta.env.VITE_APP_TITLE || "Training Management System",
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || "development",
  
  // Database
  DB_TYPE: import.meta.env.VITE_DB_TYPE || "sqlite",
  
  // Feature Flags
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === "true",
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === "true",
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  
  // Authentication
  AUTH_TOKEN_EXPIRY: parseInt(import.meta.env.VITE_AUTH_TOKEN_EXPIRY || "3600"),
  AUTH_REFRESH_THRESHOLD: parseInt(import.meta.env.VITE_AUTH_REFRESH_THRESHOLD || "300"),
  
  // UI Configuration
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || "10"),
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || "5242880"), // 5MB
  SUPPORTED_FILE_TYPES: (import.meta.env.VITE_SUPPORTED_FILE_TYPES || "pdf,doc,docx").split(","),
  
  // Botswana Specific
  COUNTRY_CODE: import.meta.env.VITE_COUNTRY_CODE || "BW",
  CURRENCY: import.meta.env.VITE_CURRENCY || "BWP",
  TIMEZONE: import.meta.env.VITE_TIMEZONE || "Africa/Gaborone",
  LANGUAGE: import.meta.env.VITE_LANGUAGE || "en",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VALIDATE: "/auth/validate",
    PROFILE: "/auth/profile",
  },
  PARTICIPANTS: {
    LIST: "/participants",
    CREATE: "/participants",
    UPDATE: "/participants",
    DELETE: "/participants",
    SEARCH: "/participants/search",
  },
  TRAINING: {
    LIST: "/training",
    CREATE: "/training",
    UPDATE: "/training",
    DELETE: "/training",
    SEARCH: "/training/search",
  },
  ENROLLMENT: {
    LIST: "/enrollment",
    CREATE: "/enrollment",
    UPDATE: "/enrollment",
    DELETE: "/enrollment",
    PARTICIPANT: "/enrollment/participant",
  },
  LOOKUPS: {
    DEPARTMENTS: "/lookups/departments",
    LOCATIONS: "/lookups/locations",
    TRAINING_TYPES: "/lookups/training-types",
    ALLOWANCE_TYPES: "/lookups/allowance-types",
  },
  REPORTS: {
    PARTICIPANTS: "/reports/participants",
    TRAINING: "/reports/training",
    ENROLLMENT: "/reports/enrollment",
    EXPORT: "/reports/export",
  },
} as const;

// UI Constants
export const UI_CONSTANTS = {
  COLORS: {
    PRIMARY: "#1e40af",
    SECONDARY: "#0c4a6e",
    SUCCESS: "#059669", 
    WARNING: "#d97706",
    ERROR: "#dc2626",
    INFO: "#0891b2",
    LIGHT: "#f8fafc",
    DARK: "#1f2937",
  },
  BOTSWANA_FLAG: {
    BLUE: "#0066cc",
    WHITE: "#ffffff", 
    BLACK: "#000000",
  },
  BREAKPOINTS: {
    SM: "640px",
    MD: "768px", 
    LG: "1024px",
    XL: "1280px",
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 1050,
    TOOLTIP: 1100,
    SIDEBAR: 1200,
  },
} as const;

// Application Routes
export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
  },
  PARTICIPANTS: {
    LIST: "/participants",
    CREATE: "/participants/create",
    EDIT: "/participants/edit/:id",
    VIEW: "/participants/view/:id",
  },
  TRAINING: {
    LIST: "/training",
    CREATE: "/training/create", 
    EDIT: "/training/edit/:id",
    VIEW: "/training/view/:id",
  },
  ENROLLMENT: {
    LIST: "/enrollment",
    CREATE: "/enrollment/create",
    EDIT: "/enrollment/edit/:id",
    VIEW: "/enrollment/view/:id",
  },
  REPORTS: {
    LIST: "/reports",
    PARTICIPANTS: "/reports/participants",
    TRAINING: "/reports/training",
    ENROLLMENT: "/reports/enrollment",
  },
  CONFIGURATION: "/configuration",
} as const;
