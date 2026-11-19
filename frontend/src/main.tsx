import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';   // activa el enrutamiento con la URL del navegador
import App from './app/App';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter envuelve TODA la app para que cualquier parte pueda usar rutas */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
