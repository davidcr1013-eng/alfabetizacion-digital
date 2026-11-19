import type { ReactNode } from 'react';  // tipo para "cualquier cosa que React puede mostrar"
import './Boton.css';                    // estilos propios de este componente

// Contrato del componente: qué props acepta y de qué tipo
interface BotonProps {
  children: ReactNode;                   // lo que va entre <Boton> y </Boton> (el texto)
  onClick?: () => void;                  // función al pulsar; el "?" la hace opcional
  disabled?: boolean;                    // true = desactivado
  type?: 'button' | 'submit';            // unión: solo acepta uno de estos dos textos
  variante?: 'primario' | 'secundario';  // estilo visual del botón
}

// export permite usarlo desde otros archivos.
// Las llaves { } sacan cada prop por su nombre (desestructuración).
// "= valor" pone un valor por defecto si no se envía esa prop.
export function Boton({
  children,
  onClick,
  disabled = false,
  type = 'button',          // 'button' evita que envíe un formulario por accidente
  variante = 'primario',
}: BotonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`boton boton--${variante}`}  // en React se escribe className, no class
    >
      {children}
    </button>
  );
}