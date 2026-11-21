// Cliente HTTP compartido: todas las pantallas hablan con la API por aquí.
// Así la dirección de la API, el formato JSON y el manejo de errores están
// en un solo lugar (separación de responsabilidades).

/** Dirección de la API, leída de VITE_API_BASE_URL (frontend/.env). */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(
  /\/+$/,
  '',
);

const MENSAJE_SIN_CONEXION = 'No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.';
const MENSAJE_GENERICO = 'Ocurrió un problema. Inténtalo de nuevo.';

/** Error con un mensaje comprensible y el código HTTP (0 = sin conexión). */
export class ErrorApi extends Error {
  readonly estado: number;

  constructor(mensaje: string, estado: number) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.estado = estado;
  }
}

export interface OpcionesPeticion {
  metodo?: 'GET' | 'POST';
  /** Se envía como JSON. */
  cuerpo?: unknown;
  /** Permite cancelar la petición con un AbortController. */
  signal?: AbortSignal;
}

/** true si el error viene de cancelar la petición (no hay que mostrarlo). */
export function esCancelacion(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

/** Lee {"detail": "texto"} del cuerpo de un error (acuerdo T0). */
async function leerDetalle(respuesta: Response): Promise<string> {
  try {
    const datos: unknown = await respuesta.json();
    if (
      typeof datos === 'object' &&
      datos !== null &&
      'detail' in datos &&
      typeof datos.detail === 'string'
    ) {
      return datos.detail;
    }
  } catch {
    // El cuerpo no era JSON: se usa el mensaje genérico.
  }
  return MENSAJE_GENERICO;
}

/**
 * Hace una petición a la API y devuelve el JSON de la respuesta.
 * Lanza ErrorApi si no hay conexión o si la API responde con un error.
 */
export async function pedirJson<T>(ruta: string, opciones: OpcionesPeticion = {}): Promise<T> {
  const { metodo = 'GET', cuerpo, signal } = opciones;

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
      method: metodo,
      headers:
        cuerpo === undefined
          ? { Accept: 'application/json' }
          : { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
      signal,
    });
  } catch (error) {
    if (esCancelacion(error)) throw error;
    // fetch solo falla así cuando no llega a la API (servidor apagado, sin red, CORS).
    throw new ErrorApi(MENSAJE_SIN_CONEXION, 0);
  }

  if (!respuesta.ok) {
    throw new ErrorApi(await leerDetalle(respuesta), respuesta.status);
  }

  try {
    return (await respuesta.json()) as T;
  } catch {
    throw new ErrorApi(MENSAJE_GENERICO, respuesta.status);
  }
}

/**
 * Simula una respuesta de la API después de un momento, para trabajar con
 * datos de ejemplo (mocks). Respeta la cancelación igual que fetch.
 */
export function simularRespuesta<T>(datos: T, signal?: AbortSignal, demoraMs = 400): Promise<T> {
  return new Promise((resolver, rechazar) => {
    const temporizador = setTimeout(() => resolver(structuredClone(datos)), demoraMs);
    signal?.addEventListener('abort', () => {
      clearTimeout(temporizador);
      rechazar(new DOMException('Petición cancelada', 'AbortError'));
    });
  });
}

/** true cuando VITE_USAR_MOCKS=true: las pantallas usan datos de ejemplo. */
export const USAR_MOCKS = import.meta.env.VITE_USAR_MOCKS === 'true';
