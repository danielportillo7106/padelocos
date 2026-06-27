import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 
import './RegistrarJugador.css'; 

function RegistrarJugador() {
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(false);
  const [jugadores, setJugadores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerJugadores();
  }, []);

  const obtenerJugadores = async () => {
    const { data, error } = await supabase
      .from('jugadores')
      .select('*')
      .order('nombre', { ascending: true });
    
    if (!error && data) {
      setJugadores(data);
    }
  };

  const registrar = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert('¡Ingresa un nombre, crack!');

    setCargando(true);
    
    try {
      const { error } = await supabase
        .from('jugadores')
        .insert([{ nombre: nombre.trim() }]);

      if (error) throw error;

      alert(`¡${nombre} ha sido fichado con éxito! 🎾`);
      setNombre(''); 
      obtenerJugadores(); 
      
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Hubo un error al guardar en la base de datos.");
    } finally {
      setCargando(false);
    }
  };

  const darDeBaja = async (id, nombreJugador) => {
    const confirmar = window.confirm(`¿Seguro que quieres darle salida a ${nombreJugador}? 😢`);
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('jugadores')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setJugadores(jugadores.filter(j => j.id !== id));
      
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo dar de baja al jugador. Revisa la consola.");
    }
  };

  return (
    <div className="registro-container">
      
      <div className="registro-layout">
        {/* LA CAJA DEL FORMULARIO */}
        <div className="registro-box">
          <h1 className="registro-title">NUEVO FICHAJE</h1>
          <p className="registro-subtitle">Agrega un nuevo crack al club</p>

          <form onSubmit={registrar} className="registro-form">
            <input
              type="text"
              placeholder="Nombre del jugador..."
              className="registro-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              autoComplete="off"
            />
            
            <button type="submit" className="registro-btn" disabled={cargando}>
              {cargando ? 'FICHANDO...' : 'FICHAR JUGADOR'}
            </button>
          </form>
        </div>

        {/* LA CAJA DE LA LISTA */}
        <div className="jugadores-list-box">
          <h2 className="lista-title">PLANTILLA ACTUAL ({jugadores.length})</h2>
          
          <div className="lista-scroll">
            {jugadores.length === 0 && <p className="empty-msg">No hay cracks registrados aún.</p>}
            
            {jugadores.map(jugador => (
              <div key={jugador.id} className="jugador-item">
                {/* 2. Agrupamos el nombre y el ID */}
                <div className="jugador-info-group">
                  <span className="jugador-nombre">{jugador.nombre}</span>
                  <span className="jugador-id">#{jugador.id}</span>
                </div>
                
                <button 
                  className="btn-baja" 
                  onClick={() => darDeBaja(jugador.id, jugador.nombre)}
                  title="Dar de baja"
                >
                  ✕ Baja
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="back-btn" onClick={() => navigate('/home')}>
        Volver al Panel Principal
      </button>

    </div>
  );
}

export default RegistrarJugador;