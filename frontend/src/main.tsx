import { StrictMode } from 'react';             // modo de React que avisa de malas prácticas en desarrollo
import { createRoot } from 'react-dom/client';  // función que conecta React con el HTML
import App from './app/App';                    // nuestro componente principal, ahora en src/app
import './styles/global.css';                   // estilos globales de toda la aplicación

// Busca <div id="root"> en index.html y dibuja App dentro.
// El "!" le dice a TypeScript: "confía, ese elemento sí existe".
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
