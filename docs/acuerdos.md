# Acuerdos T0 · Alcance y contratos

Este archivo es la fuente de verdad del equipo. Si un contrato cambia, se actualiza aquí en el mismo Pull Request que cambia el código y se avisa a quien lo consume.

## Alcance de la primera versión

- Aplicación web pública con tres guías breves del celular, resultados anónimos y sin historial personal.
- Cada guía tiene entre **tres y cinco pasos** y **exactamente tres preguntas** de selección única, con tres opciones (`a`, `b`, `c`).
- La aplicación orienta acciones que se hacen en el celular; no cambia sus ajustes ni envía mensajes por la persona.
- No se guardan nombres, correos, contraseñas ni datos de redes Wi-Fi.
- Fuera de alcance: registro de usuarios, roles, historial, editor de contenidos, solicitudes de ayuda, reportes y uso sin conexión.

| ID | Guía | Decisión |
| --- | --- | --- |
| 1 | Conectarse a Wi-Fi | Primera guía integrada de principio a fin |
| 2 | Ajustar el tamaño del texto | Se incorpora cuando funcione la primera |
| 3 | Enviar un mensaje | Usa la misma estructura de pantallas |

## Pantallas del frontend

| Ruta | Comportamiento | Responsable |
| --- | --- | --- |
| `/` | Catálogo de las tres guías | Persona 1 |
| `/guias/:guiaId` | Un paso a la vez, con Anterior y Siguiente | Persona 5 |
| `/guias/:guiaId/practica` | Tres preguntas y envío de respuestas | Persona 3 |
| `/guias/:guiaId/resultado` | Aciertos, total y explicación de cada respuesta | Persona 3 |

- Al cambiar de guía, el índice del paso vuelve a cero. Al terminar, se ofrece **Ir a la práctica**.
- El resultado vive en la sesión de React; si se recarga su pantalla sin ese estado, se ofrece repetir la práctica.
- Estados de carga, error y ausencia de datos con mensaje y acción comprensibles.
- Respuestas editables antes del envío; botón desactivado mientras se procesa; respuestas conservadas si falla el guardado.
- Accesibilidad: texto base de 20 px, controles de al menos 48 × 48 px, teclado, foco visible, ampliación al 200 % e imágenes con texto alternativo.

## Herramientas

| Parte | Elección |
| --- | --- |
| Interfaz | React, TypeScript, Vite, CSS, React Router y `fetch` |
| API | Python, FastAPI, Pydantic y Uvicorn |
| Persistencia | PostgreSQL; SQLAlchemy, psycopg y Alembic |
| Pruebas | pytest (backend) y Vitest (frontend) |

Frontend en `http://localhost:5173`, API en `http://localhost:8000`. Variables: `VITE_API_BASE_URL`, `DATABASE_URL` y `FRONTEND_ORIGIN`.

## Modelo de datos

| Tabla | Campos y reglas |
| --- | --- |
| `guias` | `id` INTEGER PK; `titulo` VARCHAR(120); `descripcion` TEXT. Todos obligatorios |
| `pasos` | `id` INTEGER PK; `guia_id` FK; `orden` INTEGER; `texto` TEXT; `imagen_url` TEXT anulable. `UNIQUE(guia_id, orden)` y orden positivo |
| `preguntas` | `id` INTEGER PK; `guia_id` FK; `enunciado` TEXT; `opciones` JSONB; `opcion_correcta` VARCHAR(1); `explicacion` TEXT |
| `intentos` | `id` UUID PK; `guia_id` FK; `aciertos` INTEGER; `total` INTEGER; `creado_en` TIMESTAMPTZ. Total positivo y `0 <= aciertos <= total` |

En esta versión `total` es siempre 3. El backend calcula el puntaje; el navegador solo envía identificadores. El intento se confirma en una transacción antes de responder con éxito.

## TAD ListaPasos

Lista ordenada en TypeScript con un arreglo privado: `agregar(paso)`, `obtener(indice)`, `cantidad()`, `estaVacia()`. Índice desde cero; un índice inválido lanza `RangeError`. El campo `orden` de la base empieza en uno y la API entrega los pasos ya ordenados.

## Contratos de la API

JSON con nombres en español y snake_case. `{id}` es un entero positivo.

| Método y ruta | Responsable | Respuesta |
| --- | --- | --- |
| `GET /health` | Persona 4 | 200 `{"estado": "ok"}` |
| `GET /api/guias` | Persona 2 | 200 `{"guias": [{"id", "titulo", "descripcion"}]}` |
| `GET /api/guias/{id}` | Persona 2 | 200 `{"id", "titulo", "descripcion", "pasos": [{"id", "orden", "texto", "imagen_url"}]}` |
| `GET /api/guias/{id}/preguntas` | Persona 3 | 200 `{"guia_id", "preguntas": [{"id", "enunciado", "opciones": [{"id", "texto"}]}]}` sin respuesta correcta ni explicación |
| `POST /api/guias/{id}/intentos` | Persona 3 | 201 `{"intento_id", "aciertos", "total", "retroalimentacion": [{"pregunta_id", "correcta", "explicacion"}]}` |

Cuerpo del envío:

```json
{
  "respuestas": [
    {"pregunta_id": 101, "opcion_id": "a"},
    {"pregunta_id": 102, "opcion_id": "b"},
    {"pregunta_id": 103, "opcion_id": "a"}
  ]
}
```

Validaciones: la guía existe; exactamente tres respuestas, una por pregunta de la guía y sin duplicados; cada `opcion_id` existe en su pregunta.

| Código | Formato |
| --- | --- |
| 404 | `{"detail": "La guía no existe."}` |
| 422 | `{"detail": "Revisa las tres respuestas de la práctica."}` |
| 500 | `{"detail": "No se pudo guardar el resultado. Inténtalo de nuevo."}` |

Los errores de validación de FastAPI también se normalizan a `{"detail": "texto"}`.

## Identificadores de los datos iniciales

- Pasos: `guía × 10 + orden` (guía 1: 11, 12, 13…).
- Preguntas: `guía × 100 + número` (guía 1: 101, 102, 103).

## Decisiones pendientes

- [ ] Validar los pasos y las capturas con el facilitador y los dispositivos del taller (P2-01).
- [ ] Ruta para direcciones que no existen (`path="*"`): no está en T0.
- [ ] Campo de texto alternativo para `imagen_url` (por ahora el frontend usa el texto del paso).
- [ ] Confirmar en la rúbrica si se exige herencia, polimorfismo o una lista con nodos.
