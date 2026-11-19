import type { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;   // el contenido propio de cada pantalla
}

export function Layout({ children }: LayoutProps) {
  return (
    // <> </> es un "fragmento": agrupa varios elementos sin añadir una etiqueta extra.
    // React exige que un componente devuelva un solo elemento raíz.
    <>
      {/* header: el lector de pantalla lo reconoce como encabezado del sitio */}
      <header className="layout__encabezado">
        <p className="layout__marca">Alfabetización Digital</p>
      </header>

      {/* main: el contenido principal. Debe haber UNO solo por página */}
      <main className="layout__contenido">{children}</main>
    </>
  );
}