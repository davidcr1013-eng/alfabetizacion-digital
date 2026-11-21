# Diseño de interfaz (P1-01)

Recorrido de cuatro pantallas pensado para adultos mayores: una acción principal por pantalla, textos cortos, botones grandes y mensajes en lenguaje cotidiano. Cada elemento visible sale de un campo del contrato T0 (`docs/acuerdos.md`) o es un texto fijo de la interfaz.

## Recorrido

```
Catálogo (/) ──Abrir guía──▶ Guía (/guias/:guiaId) ──Ir a la práctica──▶ Práctica (/guias/:guiaId/practica)
    ▲                                                                              │
    │                                                                   Enviar respuestas (201)
    │                                                                              ▼
    └──────────── Volver al inicio ◀──── Resultado (/guias/:guiaId/resultado) ──Repetir la práctica──▶ Práctica
```

El enlace **Inicio** del encabezado aparece en las pantallas 2, 3 y 4.

## Criterios generales

| Criterio | Valor | Dónde se cumple |
| --- | --- | --- |
| Texto base | 20 px (`html { font-size: 125% }`) | `styles/global.css` |
| Controles | Mínimo 48 × 48 px | `--control-min` en `Boton`, `EnlaceBoton`, opciones de la práctica y enlace Inicio |
| Foco | Contorno de 3 px; blanco sobre el encabezado azul | `:focus-visible` en `global.css` y `Layout.css` |
| Teclado | Todo con Tab, Enter y Espacio | Elementos nativos: `button`, `a`, `input type="radio"` |
| Ampliación 200 % | Una columna, botones que bajan de línea | `Layout.css`, `GuiaPage.css` (`flex-wrap`) |
| Color | Nunca es la única señal | "✓ Correcta" / "✗ Incorrecta" escrito en el resultado |
| Enlace vs. botón | Lo que cambia de pantalla es enlace; lo que actúa en la pantalla es botón | `EnlaceBoton` y `Boton` |

## Pantalla 1 · Catálogo (`/`) · Persona 1

Datos: `GET /api/guias` → `{"guias": [{id, titulo, descripcion}]}`.

- Título "Elige una guía" y bienvenida.
- Una tarjeta por guía con `titulo`, `descripcion` y el enlace **Abrir guía: {titulo}** (el título en el texto permite al lector de pantalla distinguir los tres enlaces).

| Estado | Mensaje | Acción |
| --- | --- | --- |
| Cargando | "Cargando las guías…" | — |
| Error (API caída o 500) | "No pudimos cargar las guías. Revisa tu conexión e inténtalo de nuevo." | Reintentar |
| Vacío | "Todavía no hay guías disponibles." | Reintentar |

## Pantalla 2 · Guía (`/guias/:guiaId`) · Persona 5

Datos: `GET /api/guias/{id}` → guía con `pasos`, recorridos con `ListaPasos`.

- Título de la guía, recuadro con "Paso X de Y", imagen (si `imagen_url` no es null) y texto del paso.
- **Anterior** (desactivado en el primer paso) y **Siguiente**; en el último paso, Siguiente se reemplaza por **Ir a la práctica**.
- Al cambiar de paso, el foco pasa al recuadro del paso para que se lea el texto nuevo.

| Estado | Mensaje | Acción |
| --- | --- | --- |
| Cargando | "Cargando la guía…" | — |
| 404 o id inválido | "No encontramos esta guía." | Volver al inicio |
| Error de conexión o 500 | "No pudimos cargar la guía. Inténtalo de nuevo." | Reintentar |
| Sin pasos | "Esta guía todavía no tiene pasos." | Volver al inicio |

## Pantalla 3 · Práctica (`/guias/:guiaId/practica`) · Persona 3

Datos: `GET /api/guias/{id}/preguntas`; envío `POST /api/guias/{id}/intentos`.

- Cada pregunta es un `fieldset` con su `legend`; cada opción es una fila completa de 48 px que se puede tocar.
- **Revisar respuestas**: las respuestas quedan visibles y editables hasta enviar, y un contador dice "Respondiste X de 3 preguntas".
- **Enviar respuestas** se desactiva y dice "Enviando…" mientras se procesa.

| Estado | Mensaje | Acción |
| --- | --- | --- |
| Cargando | "Cargando la práctica…" | — |
| Faltan respuestas | "Responde las tres preguntas antes de enviar." | Completar |
| 422 | "Revisa las tres respuestas de la práctica." | Corregir y enviar |
| 500 o sin conexión | Mensaje de la API; las respuestas siguen marcadas | Enviar de nuevo |

## Pantalla 4 · Resultado (`/guias/:guiaId/resultado`) · Persona 3

Datos: la respuesta 201 del envío, que la práctica pasa en la navegación (sesión de React).

- "{aciertos} de {total} respuestas correctas".
- Por pregunta: enunciado, "✓ Correcta" o "✗ Incorrecta" y la `explicacion`.
- **Repetir la práctica** (nuevo intento) y **Volver al inicio**.
- Si se abre sin resultado: "No encontramos tu resultado. Puedes volver a hacer la práctica." con el enlace **Hacer la práctica**.

## Componentes compartidos (`frontend/src/components`)

| Componente | Uso |
| --- | --- |
| `Layout` | Encabezado con el nombre de la app y el enlace Inicio; `<main>` con márgenes y separación |
| `Boton` | Acciones en la misma pantalla: Reintentar, Anterior, Siguiente, Enviar respuestas |
| `EnlaceBoton` | Navegación con apariencia de botón: Abrir guía, Ir a la práctica, Volver al inicio, Repetir la práctica |
| `MensajeEstado` | Cargando (`role="status"`), vacío (`role="status"`) y error (`role="alert"`), con acción opcional |

## Decisiones tomadas

- Los elementos ocupan todo el ancho del contenido (máximo 40 rem): botones grandes, más fáciles de ver y de tocar.
- El catálogo no muestra "5 pasos · 3 preguntas" porque `GET /api/guias` no envía esos datos.
- El resultado no muestra cuál era la opción correcta como dato aparte: la API solo envía `correcta` y `explicacion`, así que la explicación debe redactarse para que se entienda la respuesta.

## Pendientes

- Ruta para direcciones que no existen (`path="*"`): no está en T0; proponer al equipo.
- Campo de texto alternativo para las imágenes de los pasos (hoy se usa el texto del paso).
