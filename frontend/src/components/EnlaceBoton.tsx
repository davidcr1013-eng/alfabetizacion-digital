import type { ReactNode } from 'react';
import { Link } from 'react-router';
import './Boton.css';

interface EnlaceBotonProps {
  to: string;
  children: ReactNode;
  variante?: 'primario' | 'secundario';
}

// Lleva a otra pantalla (por eso es un enlace), pero se ve como Boton:
// mismo tamaño mínimo de 48 × 48 px y mismo foco visible.
export function EnlaceBoton({ to, children, variante = 'primario' }: EnlaceBotonProps) {
  return (
    <Link to={to} className={`boton boton--${variante} enlace-boton`}>
      {children}
    </Link>
  );
}
