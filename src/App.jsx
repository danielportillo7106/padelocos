import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Configuracion from './pages/Configuracion';
import Admin from './pages/Admin';
import Resultados from './pages/Resultados';
import RegistrarJugador from './pages/RegistrarJugador';
import Sidebar from './components/Sidebar'; // <--- Importamos tu nuevo componente

// Creamos un sub-componente para poder usar "useLocation"
function AppContent() {
  const location = useLocation();
  // Mostramos el menú siempre y cuando NO estemos en el login
  const mostrarMenu = location.pathname !== '/';

  return (
    <>
      {mostrarMenu && <Sidebar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/configurar" element={<Configuracion />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/registrar-jugador" element={<RegistrarJugador />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;