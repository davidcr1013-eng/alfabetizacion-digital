# Frontend · Alfabetización Digital

Interfaz web en React + TypeScript + Vite.

## Requisitos

- Node.js 22.22 o posterior (`node -v` para revisarlo).

## Instalación

Desde la raíz del repositorio:

    cd frontend
    npm install

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

La conexión con la API (`VITE_API_BASE_URL`) se configura en la tarea P1-03.