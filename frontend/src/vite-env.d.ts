/// <reference types="vite/client" />

// Variables de entorno que usa el frontend (se leen de frontend/.env).
interface ImportMetaEnv {
  /** Dirección de la API, por ejemplo http://localhost:8000 (acuerdo T0). */
  readonly VITE_API_BASE_URL?: string;
  /** "true" para trabajar con datos de ejemplo sin la API. */
  readonly VITE_USAR_MOCKS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
