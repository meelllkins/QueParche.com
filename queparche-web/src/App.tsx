import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProveedorActor } from './contexto/ActorContext';
import { Navbar } from './componentes/Navbar';
import { Footer } from './componentes/Footer';
import { Explorar } from './paginas/Explorar';
import { DetalleServicio } from './paginas/DetalleServicio';
import { Emprendedores } from './paginas/Emprendedores';
import { PerfilEmprendedor } from './paginas/PerfilEmprendedor';
import { PanelEmprendedor } from './paginas/PanelEmprendedor';
import { FormularioServicio } from './paginas/FormularioServicio';
import { EditarPerfil } from './paginas/EditarPerfil';
import { EstadoVacio } from './componentes/Estados';

export default function App() {
  return (
    <BrowserRouter>
      <ProveedorActor>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
            <Routes>
              <Route path="/" element={<Explorar />} />
              <Route path="/servicios/:id" element={<DetalleServicio />} />
              <Route path="/emprendedores" element={<Emprendedores />} />
              <Route path="/emprendedores/:id" element={<PerfilEmprendedor />} />
              <Route path="/panel" element={<PanelEmprendedor />} />
              <Route path="/panel/nuevo" element={<FormularioServicio />} />
              <Route path="/panel/:id/editar" element={<FormularioServicio />} />
              <Route path="/panel/perfil" element={<EditarPerfil />} />
              <Route
                path="*"
                element={
                  <EstadoVacio
                    titulo="Esta página no existe"
                    detalle="Parece que te perdiste por los lados de El Poblado. Vuelve al inicio para seguir explorando."
                  />
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </ProveedorActor>
    </BrowserRouter>
  );
}
