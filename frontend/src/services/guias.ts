// Peticiones de guías (endpoints de la Persona 2).

import { catalogoEjemplo, guiasEjemplo } from '../mocks/datos';
import { ErrorApi, USAR_MOCKS, pedirJson, simularRespuesta } from './api';
import type { GuiaDetalle, RespuestaCatalogo } from './tipos';

const MENSAJE_FORMATO = 'La respuesta de la API no tiene el formato acordado.';

/** Comprueba que llegó {"guias": [...]} y no otra forma (por ejemplo una lista suelta). */
export function validarCatalogo(datos: unknown): RespuestaCatalogo {
  if (
    typeof datos === 'object' &&
    datos !== null &&
    'guias' in datos &&
    Array.isArray(datos.guias)
  ) {
    return datos as RespuestaCatalogo;
  }
  throw new ErrorApi(MENSAJE_FORMATO, 200);
}

/** GET /api/guias */
export async function obtenerCatalogo(signal?: AbortSignal): Promise<RespuestaCatalogo> {
  const datos = USAR_MOCKS
    ? await simularRespuesta(catalogoEjemplo, signal)
    : await pedirJson<unknown>('/api/guias', { signal });
  return validarCatalogo(datos);
}

/** GET /api/guias/{id} */
export async function obtenerGuia(guiaId: string, signal?: AbortSignal): Promise<GuiaDetalle> {
  if (USAR_MOCKS) {
    const guia = guiasEjemplo[Number(guiaId)];
    if (!guia) {
      await simularRespuesta(null, signal);
      throw new ErrorApi('La guía no existe.', 404);
    }
    return simularRespuesta(guia, signal);
  }
  return pedirJson<GuiaDetalle>(`/api/guias/${encodeURIComponent(guiaId)}`, { signal });
}
