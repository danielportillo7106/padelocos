import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // <--- Importar useLocation
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const location = useLocation(); // <--- Leer lo que mandó Configuracion.jsx
  
  // Tomamos las canchas generadas. Si alguien entra directo a /admin por error, evitamos que crashee
  const canchasIniciales = location.state?.canchasGeneradas || []; 

  const [canchas, setCanchas] = useState(canchasIniciales);
  
  // Calculamos las victorias iniciales basándonos en los jugadores reales
  const [victorias, setVictorias] = useState(() => {
    const v = {};
    canchasIniciales.forEach(cancha => {
      [...cancha.equipoA, ...cancha.equipoB].forEach(jugador => {
        v[jugador.id] = { nombre: jugador.nombre, puntos: 0 };
      });
    });
    return v;
  });


  // // NUEVO: Estado para controlar el menú hamburguesa
  // const [menuAbierto, setMenuAbierto] = useState(false);

  const marcarGanador = (canchaId, equipo) => {
    setCanchas(canchas.map(c => 
      c.id === canchaId ? { ...c, ganador: equipo } : c
    ));
  };

  const finalizarRonda = () => {
    const todasListas = canchas.every(c => c.ganador !== null);
    if (!todasListas) {
      alert("¡Falta marcar ganadores en algunas canchas!");
      return;
    }

    const nuevasVictorias = { ...victorias };
    canchas.forEach(c => {
      const ganadores = c.ganador === 'A' ? c.equipoA : c.equipoB;
      ganadores.forEach(p => {
        nuevasVictorias[p.id] = {
          ...nuevasVictorias[p.id],
          puntos: nuevasVictorias[p.id].puntos + 1
        };
      });
    });
    setVictorias(nuevasVictorias);

    const nuevasCanchas = canchas.map((cancha, index) => {
      const esCancha1 = index === 0;
      const esCancha7 = index === 6;

      let lleganDeArriba = []; 
      let lleganDeAbajo = [];  

      if (esCancha1) {
        lleganDeArriba = cancha.ganador === 'A' ? cancha.equipoA : cancha.equipoB;
        lleganDeAbajo = canchas[1].ganador === 'A' ? canchas[1].equipoA : canchas[1].equipoB;
      } else if (esCancha7) {
        const canchaArriba = canchas[5];
        lleganDeArriba = canchaArriba.ganador === 'A' ? canchaArriba.equipoB : canchaArriba.equipoA;
        lleganDeAbajo = cancha.ganador === 'A' ? cancha.equipoB : cancha.equipoA;
      } else {
        const canchaArriba = canchas[index - 1];
        lleganDeArriba = canchaArriba.ganador === 'A' ? canchaArriba.equipoB : canchaArriba.equipoA;
        const canchaAbajo = canchas[index + 1];
        lleganDeAbajo = canchaAbajo.ganador === 'A' ? canchaAbajo.equipoA : canchaAbajo.equipoB;
      }

      return {
        id: cancha.id,
        equipoA: [lleganDeArriba[0], lleganDeAbajo[0]],
        equipoB: [lleganDeArriba[1], lleganDeAbajo[1]],
        ganador: null 
      };
    });

    setCanchas(nuevasCanchas);
  };

  // Busca esta función en Admin.jsx y reemplázala:
  //const irAResultados = () => navigate('/resultados', { state: { victorias } });
  const irAResultados = () => {
    const confirmar = window.confirm(
      "¿Estás seguro de que quieres finalizar la jornada? Ya no podrás registrar más rondas para esta jornada."
    );

    if (confirmar) {
      navigate('/resultados', { state: { victorias } });
    }
  };

  // // Función para abrir/cerrar menú
  // const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <div className="header-info">
          <h1 className="neon-text">JORNADA #27</h1>
          <p className='ubicacion-premium'>📍Padel San Mateo • Rey de la Cancha</p>
        </div>
      </header>

      <div className="courts-grid">
        {/* ... (El renderizado de las canchas se queda exactamente igual) ... */}
        {canchas.map((cancha) => (
          <div key={cancha.id} className="court-card">
            <div className="court-number">{cancha.id}</div>
            <div className="teams-container">
              <div className={`team ${cancha.ganador === 'A' ? 'winner-selected' : ''}`}>
                <div className="players-row">
                  {cancha.equipoA.map(jugador => (
                    <div key={jugador.id} className="player-slot">
                      <span className="player-id">#{jugador.id}</span>
                      <span className="player-name">{jugador.nombre}</span>
                    </div>
                  ))}
                </div>
                <button className={`win-btn ${cancha.ganador === 'A' ? 'active' : ''}`} onClick={() => marcarGanador(cancha.id, 'A')}>
                  {cancha.ganador === 'A' ? '✓ GANADOR' : 'GANÓ'}
                </button>
              </div>
              <div className="vs-divider">VS</div>
              <div className={`team ${cancha.ganador === 'B' ? 'winner-selected' : ''}`}>
                <div className="players-row">
                  {cancha.equipoB.map(jugador => (
                    <div key={jugador.id} className="player-slot">
                      <span className="player-id">#{jugador.id}</span>
                      <span className="player-name">{jugador.nombre}</span>
                    </div>
                  ))}
                </div>
                <button className={`win-btn ${cancha.ganador === 'B' ? 'active' : ''}`} onClick={() => marcarGanador(cancha.id, 'B')}>
                  {cancha.ganador === 'B' ? '✓ GANADOR' : 'GANÓ'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="admin-actions">
        {/* BOTONES REGRESADOS A SU POSICIÓN ORIGINAL */}
        <button className="action-btn secondary" onClick={irAResultados}>
          FINALIZAR JORNADA
        </button>
        <button 
          className="action-btn primary neon-border" 
          onClick={finalizarRonda}
        >
          SIGUIENTE RONDA
        </button>
      </footer>
    </div>
  );
}

export default Admin;