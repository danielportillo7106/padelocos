import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Configuracion from './pages/Configuracion';
import Admin from './pages/Admin';
import Resultados from './pages/Resultados';
import RegistrarJugador from './pages/RegistrarJugador';
import Sidebar from './components/Sidebar';
import Ranking from './pages/Ranking';
import NfcScanner from './pages/NfcScanner';

function AppContent() {
  const location = useLocation();
  
  // Ocultamos el menú si estamos en la raíz (/) o explícitamente en (/login)
  const mostrarMenu = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/ranking';

  return (
    <>
      {mostrarMenu && <Sidebar />}
      <Routes>
        {/* Ahora ambas rutas apuntan a tu Login perrón */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/configurar" element={<Configuracion />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/registrar-jugador" element={<RegistrarJugador />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/nfc" element={<NfcScanner />} />
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