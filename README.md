# Alfabetización Digital

Aplicación web para que adultos mayores de un taller comunitario repasen tres tareas básicas del celular: **conectarse a Wi-Fi**, **ajustar el tamaño del texto** y **enviar un mensaje**. La persona elige una guía, recorre sus pasos, responde tres preguntas y recibe una explicación de su resultado. La API califica y guarda cada intento de forma anónima en PostgreSQL.

## Estructura

| Carpeta | Contenido | Coordina |
| --- | --- | --- |
| `frontend/` | Interfaz en React + TypeScript + Vite | Persona 1 |
| `backend/` | API en Python + FastAPI, modelos, migraciones y carga de datos | Persona 4 |
| `docs/` | Acuerdos (`acuerdos.md`), diseño de interfaz y registro de pruebas | Todo el equipo |

## Requisitos

- **Node.js** 22.22 o posterior (`node -v`).
- **Python** 3.12 o posterior (`python --version`).
- **PostgreSQL** 16 o posterior, con una base vacía llamada `alfabetizacion_digital`.
- **Git**.

## Puesta en marcha (Windows, PowerShell)

### 1. Backend (terminal 1)

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Abre `backend\.env` y escribe tu contraseña de PostgreSQL en `DATABASE_URL`. Luego:

```powershell
alembic upgrade head
python -m scripts.cargar_datos
uvicorn app.main:app --reload --port 8000
```

- `http://localhost:8000/health` debe responder `{"estado":"ok"}`.
- `http://localhost:8000/docs` abre la documentación interactiva.
- Pruebas: `pytest` (desde `backend`, con el entorno activado).

### Comprobar que un intento quedó guardado (sustentación)

1. Responde una práctica en la aplicación.
2. Detén la API (`Ctrl + C`) y vuelve a iniciarla con `uvicorn app.main:app --reload --port 8000`.
3. Consulta la base en `psql` o pgAdmin:

```sql
SELECT id, guia_id, aciertos, total, creado_en
FROM intentos
ORDER BY creado_en DESC
LIMIT 5;
```

El intento debe seguir ahí después del reinicio. La tabla solo guarda puntaje y fecha, sin datos de la persona.

> Si tu base se creó con la primera migración (`426062012cd5`), `alembic upgrade head` aplica `7c1f2a9d4b3e`, que reemplaza las tablas por la versión de T0. Después vuelve a ejecutar `python -m scripts.cargar_datos`.

### 2. Frontend (terminal 2)

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Abre `http://localhost:5173`. Pruebas: `npm run test:run`.

## Variables de entorno (acuerdo T0)

| Variable | Archivo | Para qué |
| --- | --- | --- |
| `DATABASE_URL` | `backend/.env` | Dirección de PostgreSQL |
| `FRONTEND_ORIGIN` | `backend/.env` | Origen del frontend permitido por CORS |
| `VITE_API_BASE_URL` | `frontend/.env` | Dirección de la API que usa el frontend |

Los archivos `.env` nunca se suben; solo los `.env.example`, con valores de ejemplo.

## Forma de trabajo

- Una Issue y una rama por tarea, nacida de `main` actualizada.
- Pull Request con qué cambia, cómo probarlo y qué Issue resuelve; otro integrante revisa antes de integrar.
- Los contratos de la API están en [`docs/acuerdos.md`](docs/acuerdos.md). Si cambian, se actualiza ese archivo y se avisa a quien consume el endpoint.

## Equipo

| Persona | Integrante | Responsabilidad |
| --- | --- | --- |
| 1 | Cristian Camilo Diaz Rairan | Interfaz general, componentes compartidos y accesibilidad |
| 2 | Juan Esteban Rincon Alonso | Contenidos de las guías y API de consulta |
| 3 | Santiago Andres Avila Parra | Preguntas, evaluación y resultado |
| 4 | Julian David Cortes Ramirez | Repositorio, backend, base de datos y persistencia |
| 5 | Shneider Chiquiza Rueda | TAD ListaPasos y navegación |
