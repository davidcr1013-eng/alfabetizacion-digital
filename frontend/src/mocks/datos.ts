// Datos de ejemplo que respetan exactamente el contrato T0.
// Sirven para trabajar sin la API (VITE_USAR_MOCKS=true) y en las pruebas.
// El detalle de la guía 1 es el ejemplo literal de T0.

import type { GuiaDetalle, RespuestaCatalogo, RespuestaPreguntas } from '../services/tipos';

export const catalogoEjemplo: RespuestaCatalogo = {
  guias: [
    { id: 1, titulo: 'Conectarse a Wi-Fi', descripcion: 'Repasar la conexión a una red.' },
    {
      id: 2,
      titulo: 'Ajustar el tamaño del texto',
      descripcion: 'Agrandar la letra del celular para leer con comodidad.',
    },
    {
      id: 3,
      titulo: 'Enviar un mensaje',
      descripcion: 'Escribir y enviar un mensaje de texto a un contacto.',
    },
  ],
};

export const guiasEjemplo: Record<number, GuiaDetalle> = {
  1: {
    id: 1,
    titulo: 'Conectarse a Wi-Fi',
    descripcion: 'Repasar la conexión a una red.',
    pasos: [
      { id: 11, orden: 1, texto: 'Busca las opciones de conexión del celular.', imagen_url: null },
      { id: 12, orden: 2, texto: 'Elige la red indicada por el facilitador.', imagen_url: null },
      {
        id: 13,
        orden: 3,
        texto: 'Comprueba la conexión con ayuda del facilitador.',
        imagen_url: null,
      },
    ],
  },
  2: {
    id: 2,
    titulo: 'Ajustar el tamaño del texto',
    descripcion: 'Agrandar la letra del celular para leer con comodidad.',
    pasos: [
      { id: 21, orden: 1, texto: 'Abre los Ajustes del celular.', imagen_url: null },
      { id: 22, orden: 2, texto: 'Busca la opción Pantalla o Accesibilidad.', imagen_url: null },
      { id: 23, orden: 3, texto: 'Mueve la barra del tamaño hacia la derecha.', imagen_url: null },
    ],
  },
  3: {
    id: 3,
    titulo: 'Enviar un mensaje',
    descripcion: 'Escribir y enviar un mensaje de texto a un contacto.',
    pasos: [
      { id: 31, orden: 1, texto: 'Abre la aplicación de Mensajes.', imagen_url: null },
      { id: 32, orden: 2, texto: 'Elige a la persona y escribe tu mensaje.', imagen_url: null },
      { id: 33, orden: 3, texto: 'Toca el botón Enviar.', imagen_url: null },
    ],
  },
};

// ===== Práctica =====
// Las respuestas correctas solo existen aquí para simular al servidor:
// la API real nunca las envía al navegador.

function preguntasDe(
  guiaId: number,
  enunciados: [string, [string, string, string]][],
): RespuestaPreguntas {
  return {
    guia_id: guiaId,
    preguntas: enunciados.map(([enunciado, textos], i) => ({
      id: guiaId * 100 + i + 1,
      enunciado,
      opciones: [
        { id: 'a', texto: textos[0] },
        { id: 'b', texto: textos[1] },
        { id: 'c', texto: textos[2] },
      ],
    })),
  };
}

export const preguntasEjemplo: Record<number, RespuestaPreguntas> = {
  1: preguntasDe(1, [
    ['¿Qué red debes elegir en el taller?', ['La red que indicó el facilitador.', 'La primera red de la lista.', 'Cualquier red que no tenga contraseña.']],
    ['Si no encuentras la opción Wi-Fi, ¿qué puedes hacer?', ['Apagar el celular.', 'Pedir ayuda al facilitador.', 'Borrar una aplicación.']],
    ['¿Cómo compruebas que el celular ya tiene Internet?', ['Miro si la pantalla está encendida.', 'Abro una página o una aplicación que use Internet.', 'Reinicio el celular.']],
  ]),
  2: preguntasDe(2, [
    ['¿En qué parte del celular se cambia el tamaño del texto?', ['En los Ajustes.', 'En la cámara.', 'En la galería de fotos.']],
    ['Si mueves la barra hacia la derecha, ¿qué pasa?', ['La letra se hace más pequeña.', 'La letra se hace más grande.', 'El celular se apaga.']],
    ['¿Cambiar el tamaño del texto borra tus fotos?', ['Sí, borra todo.', 'Solo borra las fotos.', 'No, solo cambia cómo se ve la letra.']],
  ]),
  3: preguntasDe(3, [
    ['¿Qué debes elegir antes de escribir el mensaje?', ['La persona que lo va a recibir.', 'El fondo de pantalla.', 'El volumen del celular.']],
    ['¿Qué conviene hacer antes de tocar Enviar?', ['Apagar la pantalla.', 'Revisar lo que escribiste.', 'Cerrar la aplicación.']],
    ['¿Cómo sabes que el mensaje se envió?', ['El celular se reinicia.', 'La aplicación se cierra sola.', 'El mensaje aparece en la conversación.']],
  ]),
};

/** Solo para simular la calificación del servidor en modo de ejemplo. */
export const correctasEjemplo: Record<number, { opcion: 'a' | 'b' | 'c'; explicacion: string }> = {
  101: { opcion: 'a', explicacion: 'Elige la red indicada para el taller.' },
  102: { opcion: 'b', explicacion: 'Solicita ayuda a la persona responsable.' },
  103: { opcion: 'b', explicacion: 'Comprueba Internet abriendo una página.' },
  201: { opcion: 'a', explicacion: 'El tamaño del texto se cambia en los Ajustes.' },
  202: { opcion: 'b', explicacion: 'Hacia la derecha la letra crece.' },
  203: { opcion: 'c', explicacion: 'Es un ajuste de pantalla: no borra nada.' },
  301: { opcion: 'a', explicacion: 'Primero se elige a quién va el mensaje.' },
  302: { opcion: 'b', explicacion: 'Revisar ayuda a corregir errores antes de enviar.' },
  303: { opcion: 'c', explicacion: 'El mensaje enviado aparece en la conversación.' },
};
