import type { PreguntaPublica, ResultadoIntento } from '../../services/tipos';

/**
 * Lo que la práctica le pasa a la pantalla de resultado al navegar.
 * Vive en la sesión de React (acuerdo T0): no se guarda en el navegador.
 */
export interface EstadoResultado {
  guiaId: string;
  resultado: ResultadoIntento;
  preguntas: PreguntaPublica[];
}

/** Comprueba que el estado recibido tiene la forma esperada y es de esta guía. */
export function esEstadoResultado(valor: unknown, guiaId: string): valor is EstadoResultado {
  if (typeof valor !== 'object' || valor === null) return false;
  const estado = valor as Partial<EstadoResultado>;
  return (
    estado.guiaId === guiaId &&
    typeof estado.resultado?.aciertos === 'number' &&
    typeof estado.resultado?.total === 'number' &&
    Array.isArray(estado.resultado?.retroalimentacion) &&
    Array.isArray(estado.preguntas)
  );
}

/** Cuenta cuántas preguntas tienen respuesta elegida. */
export function contarRespondidas(respuestas: Record<number, string>, ids: number[]): number {
  return ids.filter((id) => respuestas[id] !== undefined).length;
}
