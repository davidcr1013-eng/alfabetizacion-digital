import { useCallback, useEffect, useState } from 'react';
import { ErrorApi, esCancelacion } from '../../services/api';
import { obtenerPreguntas } from '../../services/practicas';
import type { PreguntaPublica } from '../../services/tipos';
import { esIdValido } from '../guias/useGuia';

export type EstadoPreguntas =
  | { tipo: 'cargando' }
  | { tipo: 'no-encontrada' }
  | { tipo: 'error' }
  | { tipo: 'exito'; preguntas: PreguntaPublica[] };

/** Pide GET /api/guias/{id}/preguntas (sin las respuestas correctas). */
export function usePreguntas(guiaId: string) {
  const idValido = esIdValido(guiaId);
  const [estado, setEstado] = useState<EstadoPreguntas>(
    idValido ? { tipo: 'cargando' } : { tipo: 'no-encontrada' },
  );
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!idValido) return;
    const controlador = new AbortController();

    async function cargar() {
      try {
        const { preguntas } = await obtenerPreguntas(guiaId, controlador.signal);
        setEstado({ tipo: 'exito', preguntas });
      } catch (error) {
        if (esCancelacion(error)) return;
        const noExiste = error instanceof ErrorApi && error.estado === 404;
        setEstado(noExiste ? { tipo: 'no-encontrada' } : { tipo: 'error' });
      }
    }

    void cargar();
    return () => controlador.abort();
  }, [guiaId, idValido, intento]);

  const reintentar = useCallback(() => {
    setEstado({ tipo: 'cargando' });
    setIntento((anterior) => anterior + 1);
  }, []);

  return { estado, reintentar };
}
