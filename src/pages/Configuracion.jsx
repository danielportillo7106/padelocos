import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 
import './Configuracion.css';

function Configuracion() {
  const navigate = useNavigate();
  const [disponibles, setDisponibles] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true); 
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const obtenerJugadores = async () => {
      const { data, error } = await supabase
        .from('jugadores')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) {
        console.error("Hubo un error trayendo los jugadores:", error);
      } else {
        setDisponibles(data);
      }
      setCargando(false);
    };

    obtenerJugadores();
  }, []);

  const seleccionarJugador = (jugador) => {
    if (seleccionados.length >= 28) return alert("¡Ya tienes a los 28 jugadores!");
    setDisponibles(disponibles.filter(j => j.id !== jugador.id));
    setSeleccionados([...seleccionados, jugador]);
  };

  const quitarJugador = (jugador) => {
    setSeleccionados(seleccionados.filter(j => j.id !== jugador.id));
    setDisponibles([...disponibles, jugador]);
  };

  // --- FUNCIÓN FUSIONADA (NUBE + CANCHAS) ---
  const iniciarJornada = async () => {
    if (seleccionados.length !== 28) return;

    try {
      // 1. Mandamos la lista a Supabase
      const { data, error } = await supabase
        .from('jornadas')
        .insert([
          { 
            jugadores: seleccionados, // Usamos tu variable 'seleccionados'
            estatus: 'En curso' 
          }
        ])
        .select();

      if (error) throw error;
      console.log("¡Jornada guardada en la BD!", data);

      // 2. Armamos las canchas como lo tenías originalmente
      const canchasGeneradas = [];
      let indexJugador = 0;

      for (let i = 0; i < 7; i++) {
        canchasGeneradas.push({
          id: i + 1,
          equipoA: [seleccionados[indexJugador], seleccionados[indexJugador + 1]],
          equipoB: [seleccionados[indexJugador + 2], seleccionados[indexJugador + 3]],
          ganador: null
        });
        indexJugador += 4;
      }

      // 3. Brincamos a la pantalla de Admin con los datos listos
      navigate('/admin', { state: { canchasGeneradas } });

    } catch (error) {
      console.error("Error al guardar la jornada:", error);
      alert("Hubo un error al guardar en la base de datos.");
    }
  };

  const jugadoresFiltrados = disponibles.filter(jugador => 
    jugador.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="config-container">
      <header className="config-header">
        <h1 className="neon-text">DRAFT DE JORNADA</h1>
        <p>Selecciona a los 28 jugadores que participarán hoy</p>
        <div className={`counter ${seleccionados.length === 28 ? 'ready' : ''}`}>
          {seleccionados.length} / 28
        </div>
      </header>

      {/* Aquí metimos el cargando correctamente */}
      {cargando && <h2 style={{ textAlign: 'center', color: '#39FF14' }}>Cargando cracks...</h2>}

      <div className="draft-grid">
        <div className="draft-column">
          <h2>CLUB (Disponibles)</h2>
          
          <div className="search-box">
            <input 
              type="text" 
              placeholder="🔍 Buscar crack..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="player-list">
            {jugadoresFiltrados.map(jugador => (
              <div key={jugador.id} className="draft-card" onClick={() => seleccionarJugador(jugador)}>
                <span>{jugador.nombre}</span>
                <span className="add-btn">+</span>
              </div>
            ))}
            
            {jugadoresFiltrados.length === 0 && busqueda !== "" && (
              <p className="empty-msg">No se encontró a ese jugador...</p>
            )}
          </div>
        </div>

        <div className="draft-column">
          <h2>CONVOCADOS (Juegan Hoy)</h2>
          <div className="player-list selected-list">
            {seleccionados.length === 0 && <p className="empty-msg">No hay jugadores seleccionados</p>}
            {seleccionados.map(jugador => (
              <div key={jugador.id} className="draft-card active" onClick={() => quitarJugador(jugador)}>
                <span>{jugador.nombre}</span>
                <span className="remove-btn">✕</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="config-footer">
        <button 
          className={`btn-rey ${seleccionados.length === 28 ? '' : 'disabled'}`} 
          onClick={iniciarJornada}
          disabled={seleccionados.length !== 28}
        >
          ¡QUE EMPIECE EL REY!
        </button>
      </footer>
    </div>
  );
}

export default Configuracion;