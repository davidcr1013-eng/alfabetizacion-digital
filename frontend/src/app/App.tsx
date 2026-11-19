import { Boton } from '../components/Boton';  // ".." sube de app/ a src/

export default function App() {
  return (
    <main>
      <h1>Alfabetización Digital</h1>
      <p>Base del frontend lista.</p>

      {/* Prueba temporal de las tres formas del botón */}
      <Boton onClick={() => alert('¡Funciona!')}>Siguiente</Boton>
      <Boton variante="secundario">Anterior</Boton>
      <Boton disabled>Enviando…</Boton>
    </main>
  );
}