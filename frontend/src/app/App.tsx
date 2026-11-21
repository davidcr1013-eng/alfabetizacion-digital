import { Routes, Route } from 'react-router';
import { Layout } from '../components/Layout';
import { CatalogoPage } from '../features/inicio/CatalogoPage';
import { GuiaPage } from '../features/guias/GuiaPage';
import { PracticaPage } from '../features/practicas/PracticaPage';
import { ResultadoPage } from '../features/practicas/ResultadoPage';

export default function App() {
  return (
    // Layout queda fuera de Routes: el marco se mantiene y solo cambia el contenido
    <Layout>
      {/* Routes elige UNA ruta según la dirección actual */}
      <Routes>
        <Route path="/" element={<CatalogoPage />} />                          {/* Persona 1 */}
        <Route path="/guias/:guiaId" element={<GuiaPage />} />                 {/* Persona 5 */}
        <Route path="/guias/:guiaId/practica" element={<PracticaPage />} />    {/* Persona 3 */}
        <Route path="/guias/:guiaId/resultado" element={<ResultadoPage />} />  {/* Persona 3 */}
      </Routes>
    </Layout>
  );
}