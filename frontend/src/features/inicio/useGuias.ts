import { useCallback, useEffect, useState } from 'react';
import { esCancelacion } from '../../services/api';
import { obtenerCatalogo } from '../../services/guias';
import type { GuiaResumen } from '../../services/tipos';

// Unión discriminada: la propiedad `tipo` dice en qué estado está el catálogo,
// y TypeScript solo deja usar `guias` cuando tipo es 'exito'.
export type EstadoCatalogo =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'vacio' }
  | { tipo: 'exito'; guias: GuiaResumen[] };

export const MENSAJE_ERROR_CATALOGO =
  'No pudimos cargar las guías. Revisa tu conexión e inténtalo de nuevo.';

/** Custom hook: pide el catálogo a la API y expone su estado y una forma de reintentar. */
export function useGuias() {
  const [estado, setEstado] = useState<EstadoCatalogo>({ tipo: 'cargando' });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // Si la pantalla se cierra antes de que llegue la respuesta, se cancela la petición.
    const controlador = new AbortController();

    async function cargar() {
      try {
        const { guias } = await obtenerCatalogo(controlador.signal);
        setEstado(guias.length === 0 ? { tipo: 'vacio' } : { tipo: 'exito', guias });
      } catch (error) {
        if (esCancelacion(error)) return;
        setEstado({ tipo: 'error', mensaje: MENSAJE_ERROR_CATALOGO });
      }
    }

    void cargar();
    return () => controlador.abort();
  }, [intento]);

  const reintentar = useCallback(() => {
    setEstado({ tipo: 'cargando' });
    setIntento((anterior) => anterior + 1);
  }, []);

  return { estado, reintentar };
}
