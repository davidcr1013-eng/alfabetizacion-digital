# Entrega final - Persona 2
## Guías educativas y API de consulta

Esta carpeta contiene el trabajo de la Persona 2 para la aplicación de alfabetización digital.

## 1. Contenido de la entrega

- `backend/data/guias.json`: tres guías, quince pasos y nueve preguntas acordadas.
- `backend/app/api/guias.py`: consultas GET para listar las guías y consultar una guía por su identificador.
- `backend/app/schemas/guias.py`: esquemas de respuesta de las consultas.
- `backend/tests/test_guias.py`: pruebas del listado, detalle, orden de pasos, preguntas y respuesta 404.
- `docs/preguntas_acordadas.md`: documento legible con las nueve preguntas, opciones y respuestas correctas.

## 2. Guías incluidas

1. Uso básico del celular.
2. Internet y comunicación.
3. Seguridad digital.

Cada guía tiene cinco pasos y tres preguntas. Las preguntas mantienen los enunciados, opciones y respuestas correctas compartidas por el equipo. Se añadieron explicaciones breves para apoyar la retroalimentación.

## 3. Endpoints de la Persona 2

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/guias` | Lista id, título y descripción de las guías. |
| GET | `/api/guias/{guia_id}` | Devuelve una guía con sus pasos ordenados. |

La consulta de una guía inexistente responde con código HTTP 404.

La API de preguntas, la calificación y el registro de intentos corresponden a la Persona 3, según el reparto del equipo.

## 4. Probar el módulo de manera independiente

Requisitos: Python, FastAPI y pytest.

Desde la carpeta `backend`, instalar las dependencias:

```bash
pip install fastapi pytest httpx
```

Ejecutar las pruebas:

```bash
python -m pytest tests/test_guias.py -v
```

Para probar la API localmente, crear temporalmente `backend/prueba_api.py` con este contenido:

```python
from fastapi import FastAPI
from app.api.guias import router

app = FastAPI()
app.include_router(router)
```

Instalar Uvicorn:

```bash
pip install uvicorn
```

Iniciar el servidor desde `backend`:

```bash
uvicorn prueba_api:app --reload
```

Abrir en el navegador:

`http://127.0.0.1:8000/docs`

Probar:
- `GET /api/guias`
- `GET /api/guias/1`
- `GET /api/guias/99` (debe responder 404)

## 5. Integración con la Persona 4

La versión incluida lee temporalmente `backend/data/guias.json` para permitir pruebas aisladas.

La guía del equipo establece que la versión integrada debe utilizar los modelos y la sesión PostgreSQL preparados por la Persona 4. Antes de integrar el router a `main`, coordinar con Persona 4:

- Nombre y ubicación del modelo de guía.
- Nombre y ubicación del modelo de paso.
- Dependencia que entrega la sesión de base de datos.
- Campos y relaciones reales de los modelos.

No crear una conexión independiente ni otro esquema de base de datos. La estructura JSON contiene también las preguntas acordadas para que la Persona 4 pueda preparar la carga inicial y la Persona 3 pueda coordinar la evaluación. La API de consulta de preguntas y la calificación no se implementan en este módulo.

## 6. Imágenes de referencia

La guía del equipo permite incluir una imagen de referencia cuando sea necesaria y pide registrar su procedencia. Esta entrega no incluye imágenes porque el equipo debe seleccionar capturas propias del dispositivo que utilizará y verificar que no contengan datos personales, contraseñas ni información privada.

Si se agregan imágenes, guardarlas en:

`frontend/public/guias`

Registrar en el proyecto la procedencia de cada imagen y completar el campo `imagen_url` del paso correspondiente si el contrato acordado lo utiliza.

## 7. Límites y comprobaciones

- Tres guías.
- Entre tres y cinco pasos por guía (esta entrega incluye cinco).
- Tres preguntas por guía.
- Tres opciones por pregunta.
- Una respuesta correcta por pregunta.
- Los pasos se devuelven ordenados por el campo `orden`.
- No se incluyen nombres, correos ni contraseñas de participantes.

## 8. Archivos sugeridos para Git

Ramas propuestas por la guía del equipo:
- `feat/p2-contenidos`
- `feat/p2-api-guias`

Crear una Issue y un Pull Request por tarea. Antes de integrar, coordinar la revisión con la Persona 4 y comprobar que el router coincide con los modelos y dependencias del backend compartido.
