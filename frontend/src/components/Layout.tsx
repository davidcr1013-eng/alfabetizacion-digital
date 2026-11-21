import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;   // el contenido propio de cada pantalla
}

export function Layout({ children }: LayoutProps) {
  // En el catálogo no se muestra "Inicio" porque ya estamos ahí.
  const { pathname } = useLocation();
  const enInicio = pathname === '/';

  return (
    // <> </> es un "fragmento": agrupa varios elementos sin añadir una etiqueta extra.
    <>
      {/* header: el lector de pantalla lo reconoce como encabezado del sitio */}
      <header className="layout__encabezado">
        <div className="layout__barra">
          <p className="layout__marca">Alfabetización Digital</p>
          {!enInicio && (
            <nav aria-label="Navegación principal">
              <Link to="/" className="layout__inicio">
                Inicio
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* main: el contenido principal. Debe haber UNO solo por página */}
      <main className="layout__contenido">{children}</main>
    </>
  );
}
