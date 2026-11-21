// Peticiones de la práctica (endpoints de la Persona 3).

import { correctasEjemplo, preguntasEjemplo } from '../mocks/datos';
import { ErrorApi, USAR_MOCKS, pedirJson, simularRespuesta } from './api';
import type { EnvioIntento, RespuestaPreguntas, ResultadoIntento } from './tipos';

/** GET /api/guias/{id}/preguntas */
export async function obtenerPreguntas(
  guiaId: string,
  signal?: AbortSignal,
): Promise<RespuestaPreguntas> {
  if (USAR_MOCKS) {
    const preguntas = preguntasEjemplo[Number(guiaId)];
    if (!preguntas) {
      await simularRespuesta(null, signal);
      throw new ErrorApi('La guía no existe.', 404);
    }
    return simularRespuesta(preguntas, signal);
  }
  return pedirJson<RespuestaPreguntas>(`/api/guias/${encodeURIComponent(guiaId)}/preguntas`, {
    signal,
  });
}

/** POST /api/guias/{id}/intentos: el servidor califica y guarda. */
export async function enviarIntento(
  guiaId: string,
  envio: EnvioIntento,
  signal?: AbortSignal,
): Promise<ResultadoIntento> {
  if (USAR_MOCKS) {
    return simularRespuesta(calificarEjemplo(envio), signal, 800);
  }
  return pedirJson<ResultadoIntento>(`/api/guias/${encodeURIComponent(guiaId)}/intentos`, {
    metodo: 'POST',
    cuerpo: envio,
    signal,
  });
}

/** Imita la calificación del servidor solo para el modo de datos de ejemplo. */
function calificarEjemplo({ respuestas }: EnvioIntento): ResultadoIntento {
  const retroalimentacion = respuestas.map(({ pregunta_id, opcion_id }) => ({
    pregunta_id,
    correcta: correctasEjemplo[pregunta_id]?.opcion === opcion_id,
    explicacion: correctasEjemplo[pregunta_id]?.explicacion ?? '',
  }));
  return {
    intento_id: '00000000-0000-4000-8000-000000000001',
    aciertos: retroalimentacion.filter((r) => r.correcta).length,
    total: retroalimentacion.length,
    retroalimentacion,
  };
}
