/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENVIRONMENT: string;
  readonly VITE_DB_TYPE: string;
  readonly VITE_ENABLE_DEBUG: string;
  readonly VITE_ENABLE_MOCK_DATA: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_AUTH_TOKEN_EXPIRY: string;
  readonly VITE_AUTH_REFRESH_THRESHOLD: string;
  readonly VITE_DEFAULT_PAGE_SIZE: string;
  readonly VITE_MAX_FILE_SIZE: string;
  readonly VITE_SUPPORTED_FILE_TYPES: string;
  readonly VITE_COUNTRY_CODE: string;
  readonly VITE_CURRENCY: string;
  readonly VITE_TIMEZONE: string;
  readonly VITE_LANGUAGE: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
