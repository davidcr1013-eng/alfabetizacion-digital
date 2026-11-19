import { Link } from 'react-router';   // Link cambia de ruta SIN recargar la página

export function CatalogoPage() {
  return (
    <>
      <h1>Catálogo de guías</h1>
      <p>Contenido de ejemplo. El catálogo real se construye en P1-03.</p>
      <Link to="/guias/1">Abrir guía: Conectarse a Wi-Fi</Link>
    </>
  );
}