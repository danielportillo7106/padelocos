import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const irANuevoJugador = () => {
    navigate('/registrar-jugador');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="neon-text title-glow">PADELOCOS</h1>
        <p className="subtitle">Panel de Control</p>

        <div className="home-actions">
          <button 
            className="home-btn btn-jornada" 
            onClick={() => navigate('/configurar')}
          >
            <span className="icon">🎾</span>
            <span className="text">NUEVA JORNADA</span>
            <span className="subtext">Arma el draft y empieza a jugar</span>
          </button>

          <button 
            className="home-btn btn-registro" 
            onClick={() => navigate('/registrar-jugador')}
          >
            <span className="icon">👤</span>
            <span className="text">JUGADORES</span>
            {/* <span className="subtext">Registra a alguien en el club</span> */}
            <span className="subtext">Mantenimiento de jugadores</span>
          </button>

          <a 
            href="/ranking" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-ranking-neon"
          >
            🏆 VER RANKING GLOBAL
          </a>
        </div>
        
        
      </div>
    </div>
  );
}

export default Home;