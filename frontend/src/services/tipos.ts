// Tipos de las respuestas de la API, copiados del contrato T0 (docs/acuerdos.md).
// Si el contrato cambia, se cambian aquí y TypeScript avisa dónde se rompe algo.

export interface GuiaResumen {
  id: number;
  titulo: string;
  descripcion: string;
}

/** GET /api/guias */
export interface RespuestaCatalogo {
  guias: GuiaResumen[];
}

export interface Paso {
  id: number;
  orden: number;
  texto: string;
  imagen_url: string | null;
}

/** GET /api/guias/{id} */
export interface GuiaDetalle extends GuiaResumen {
  pasos: Paso[];
}

export type IdOpcion = 'a' | 'b' | 'c';

export interface Opcion {
  id: IdOpcion;
  texto: string;
}

export interface PreguntaPublica {
  id: number;
  enunciado: string;
  opciones: Opcion[];
}

/** GET /api/guias/{id}/preguntas */
export interface RespuestaPreguntas {
  guia_id: number;
  preguntas: PreguntaPublica[];
}

export interface RespuestaElegida {
  pregunta_id: number;
  opcion_id: IdOpcion;
}

/** Cuerpo de POST /api/guias/{id}/intentos */
export interface EnvioIntento {
  respuestas: RespuestaElegida[];
}

export interface Retroalimentacion {
  pregunta_id: number;
  correcta: boolean;
  explicacion: string;
}

/** Respuesta 201 de POST /api/guias/{id}/intentos */
export interface ResultadoIntento {
  intento_id: string;
  aciertos: number;
  total: number;
  retroalimentacion: Retroalimentacion[];
}
