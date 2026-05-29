import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const irA = (ruta) => {
    navigate(ruta);
    setAbierto(false); // Cierra el menú al cambiar de pantalla
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioLogueado');
    setAbierto(false); 
    navigate('/'); 
  };

  if(location.pathname === '/resultados'){
    return null;
  }

  return (
    <>
      {/* 1. LA MAGIA: Si 'abierto' es falso, dibuja la hamburguesa. Si es verdadero, se oculta sola. */}
      {!abierto && (
        <button className="global-menu-button" onClick={() => setAbierto(true)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hamburger-svg">
            <rect x="2" y="5" width="20" height="3" rx="1.5" fill="white"/>
            <rect x="2" y="11" width="20" height="3" rx="1.5" fill="white"/>
            <rect x="2" y="17" width="20" height="3" rx="1.5" fill="white"/>
          </svg>
        </button>
      )}

      {/* 2. EL MENÚ DESLIZABLE */}
      <div className={`sidebar ${abierto ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setAbierto(false)}>✕</button>
        
        <h2 className="sidebar-title">MENÚ</h2>
        
        <div className="sidebar-links">
          <button onClick={() => irA('/home')}>🏠 Panel Principal</button>
          <button onClick={() => irA('/configurar')}>🎾 Nueva Jornada</button>
          <button onClick={() => irA('/registrar-jugador')}>👤 Nuevo Fichaje</button>
          <button onClick={() => irA('/nfcscanner')}> NFC Lector</button>
        </div>

        <div className="sidebar-footer">
          <button className="logout-link" onClick={cerrarSesion}>🚪 Cerrar Sesión</button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;