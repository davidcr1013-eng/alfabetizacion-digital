// Datos de ejemplo que respetan exactamente el contrato T0.
// Sirven para trabajar sin la API (VITE_USAR_MOCKS=true) y en las pruebas.
// El detalle de la guía 1 es el ejemplo literal de T0.

import type { GuiaDetalle, RespuestaCatalogo } from '../services/tipos';

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
