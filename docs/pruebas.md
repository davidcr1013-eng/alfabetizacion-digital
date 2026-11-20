# Registro de pruebas de accesibilidad (P1-04)

P1-04 se cierra cuando este archivo registra **los dispositivos utilizados, los problemas encontrados y sus correcciones**, y las imágenes informativas tienen texto alternativo. Solo se anota lo que de verdad se probó.

## Cómo preparar la prueba

1. Levantar la API y el frontend (ver `README.md`) con las tres guías cargadas.
2. Probar en una **ventana de incógnito** (`Ctrl + Shift + N`) para que las extensiones del navegador no cambien los estilos.
3. Para el celular real: conectar el celular a la misma red Wi-Fi que el computador y ejecutar `npm run dev -- --host`. Abrir en el celular la dirección `Network` que muestra la terminal. La API debe permitir ese origen: poner esa dirección en `FRONTEND_ORIGIN` y la IP del computador en `VITE_API_BASE_URL`.

## Lista de comprobación por pantalla

Marcar en cada pantalla: catálogo, guía, práctica, resultado y estados de error.

| # | Prueba | Cómo se hace | Esperado |
| --- | --- | --- | --- |
| 1 | Teclado | Recorrer todo solo con `Tab`, `Shift + Tab`, `Enter` y `Espacio` | Se llega a todo y en orden lógico |
| 2 | Foco visible | Mirar el contorno mientras se usa `Tab` | Siempre se ve dónde está el foco, también sobre el encabezado azul |
| 3 | Texto base | DevTools → Computed → `font-size` de un párrafo | 20 px |
| 4 | Controles | DevTools → Computed → alto y ancho de botones, enlaces y opciones | 48 px o más |
| 5 | Ampliación 200 % | `Ctrl` + `+` hasta 200 % | Nada se corta ni obliga a desplazarse de lado |
| 6 | Color | Mirar el resultado | "Correcta" e "Incorrecta" están escritas |
| 7 | Imágenes | Revisar `alt` de cada imagen en Elements | Toda imagen informativa tiene texto alternativo |
| 8 | Errores | Apagar la API y recargar cada pantalla | Mensaje comprensible y botón Reintentar |
| 9 | Celular real | Recorrer una guía completa y su práctica | Se lee sin hacer zoom y se toca cada control sin equivocarse |

## Dispositivos utilizados

| Fecha | Dispositivo | Sistema y navegador | Quién probó |
| --- | --- | --- | --- |
| | | | |

## Problemas encontrados y correcciones

| Fecha | Pantalla | Prueba | Problema | Corrección | Estado |
| --- | --- | --- | --- | --- | --- |
| 2026-11-16 | Todas | Estilos | Una extensión del navegador estiraba el botón de prueba (`injected stylesheet` en DevTools) | Probar siempre en incógnito; no era un error de la app | Resuelto |
| | | | | | |

## Imágenes

Por ahora ningún paso tiene imagen (`imagen_url` es `null` en las tres guías). Cuando la Persona 2 agregue capturas en `frontend/public/guias`, la guía muestra el texto alternativo "Imagen de referencia del paso N: {texto del paso}". Revisarlo aquí al agregar cada imagen.

| Imagen | Paso | Texto alternativo revisado |
| --- | --- | --- |
| | | |
