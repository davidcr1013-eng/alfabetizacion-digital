# Frontend · Alfabetización Digital

Interfaz web en React + TypeScript + Vite.

## Requisitos

- Node.js 22.22 o posterior (`node -v` para revisarlo).

## Instalación

Desde la raíz del repositorio:

    cd frontend
    npm install
    Copy-Item .env.example .env

En `.env`, `VITE_API_BASE_URL` es la dirección de la API (por defecto `http://localhost:8000`). Para trabajar sin la API, pon `VITE_USAR_MOCKS=true`: las pantallas usarán los datos de ejemplo de `src/mocks/datos.ts`, que respetan el contrato T0. Después de cambiar `.env`, reinicia `npm run dev`.

## Comandos

| Comando | Para qué |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo en http://localhost:5173 |
| `npm run build` | Revisa los tipos y genera la versión final en `dist/` |
| `npm run test:run` | Ejecuta las pruebas una vez |
| `npm test` | Ejecuta las pruebas en modo vigilancia |

## Rutas

| Ruta | Pantalla | Responsable |
| --- | --- | --- |
| `/` | Catálogo | Persona 1 |
| `/guias/:guiaId` | Guía | Persona 5 |
| `/guias/:guiaId/practica` | Práctica | Persona 3 |
| `/guias/:guiaId/resultado` | Resultado | Persona 3 |

## Estructura

- `src/app`: componente principal y enrutador.
- `src/components`: componentes compartidos (`Boton`, `MensajeEstado`, `Layout`).
- `src/features`: una carpeta por pantalla y responsable.
- `src/styles`: estilos globales y tokens de diseño.
- `src/services`: cliente HTTP compartido (`api.ts`), tipos del contrato (`tipos.ts`) y peticiones por tema.
- `src/mocks`: datos de ejemplo con la forma exacta del contrato T0.

## Cómo pedir datos a la API

Usa siempre el cliente compartido, nunca `fetch` directo:

```ts
import { pedirJson, ErrorApi } from '../../services/api';

const datos = await pedirJson<RespuestaPreguntas>(`/api/guias/${guiaId}/preguntas`, { signal });
```

Si la API responde con error, `pedirJson` lanza un `ErrorApi` cuyo `message` es el `detail` de la API y cuyo `estado` es el código HTTP (`0` si no hubo conexión).