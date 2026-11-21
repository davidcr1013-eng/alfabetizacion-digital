import { Link, useParams } from 'react-router';

export function GuiaPage() {
  // useParams lee los parámetros de la URL. En /guias/1, guiaId vale "1" (es texto)
  const { guiaId } = useParams();

  return (
    <>
      <h1>Guía {guiaId}</h1>
      <p>Pantalla de ejemplo. La construye la Persona 5.</p>
      <Link to={`/guias/${guiaId}/practica`}>Ir a la práctica</Link>
    </>
  );
}