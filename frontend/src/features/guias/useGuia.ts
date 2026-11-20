import { useCallback, useEffect, useState } from 'react';
import { ErrorApi, esCancelacion } from '../../services/api';
import { obtenerGuia } from '../../services/guias';
import type { GuiaDetalle } from '../../services/tipos';
import { ListaPasos } from '../../tad/ListaPasos';

export type EstadoGuia =
  | { tipo: 'cargando' }
  | { tipo: 'no-encontrada' }
  | { tipo: 'error' }
  | { tipo: 'exito'; guia: GuiaDetalle; pasos: ListaPasos };

/** T0: el identificador de la guía es un entero positivo. */
export function esIdValido(guiaId: string): boolean {
  return /^[1-9]\d*$/.test(guiaId);
}

/** Pide GET /api/guias/{id} y construye la ListaPasos con los pasos recibidos. */
export function useGuia(guiaId: string) {
  const idValido = esIdValido(guiaId);
  const [estado, setEstado] = useState<EstadoGuia>(
    idValido ? { tipo: 'cargando' } : { tipo: 'no-encontrada' },
  );
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!idValido) return;
    const controlador = new AbortController();

    async function cargar() {
      try {
        const guia = await obtenerGuia(guiaId, controlador.signal);
        setEstado({ tipo: 'exito', guia, pasos: ListaPasos.desde(guia.pasos) });
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
