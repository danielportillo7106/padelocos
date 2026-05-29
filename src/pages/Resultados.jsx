import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase  } from '../supabase';
import './Resultados.css';

function Resultados() {
  const location = useLocation();
  const navigate = useNavigate();
  const { victorias } = location.state || { victorias: {} };

  // --- ESTADOS PARA LA IA ---
  const [resumen, setResumen] = useState('');
  const [generando, setGenerando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // --- LÓGICA DE ORDENAMIENTO ---
  const ranking = Object.entries(victorias)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.puntos - a.puntos);

  const top3 = ranking.slice(0, 3);
  const resto = ranking.slice(3);

  // --- LÓGICA DE REPARTO DE PUNTOS ELO ---
  const [puntosRepartidos, setPuntosRepartidos] = useState(false);

  const repartirPuntosElo = async () => {
    if (ranking.length === 0 || puntosRepartidos) return;

    try {
      console.log("Iniciando reparto de puntos ELO...");
      
      for (let i = 0; i < ranking.length; i++) {
        const jugador = ranking[i];
        let puntosGanados = jugador.puntos * 5; // 5 puntos por cada ronda ganada

        // Bonos para el podio
        if (i === 0) puntosGanados += 30; // 1er Lugar
        if (i === 1) puntosGanados += 20; // 2do Lugar
        if (i === 2) puntosGanados += 10; // 3er Lugar

        // 1. Obtener el ELO actual del jugador desde la base de datos
        const { data: dataJugador, error: errorFetch } = await supabase
            .from('jugadores')
            .select('ranking_elo')
            .eq('id', jugador.id)
            .single();
            
        if (errorFetch) {
            console.error(`Error al obtener ELO de ${jugador.nombre}:`, errorFetch);
            continue; // Si falla uno, pasamos al siguiente
        }

        const eloActual = dataJugador?.ranking_elo || 0;
        const nuevoElo = eloActual + puntosGanados;

        // 2. Actualizar el jugador con el nuevo ELO
        const { error: errorUpdate } = await supabase
          .from('jugadores')
          .update({ ranking_elo: nuevoElo })
          .eq('id', jugador.id);

        if (errorUpdate) {
            console.error(`Error al actualizar ELO de ${jugador.nombre}:`, errorUpdate);
        } else {
            console.log(`✅ ${jugador.nombre} ha recibido ${puntosGanados} puntos ELO. Nuevo ELO: ${nuevoElo}`);
        }
      }
      
      setPuntosRepartidos(true);
      alert("¡Los puntos ELO de esta jornada se han repartido con éxito en el Ranking! 🏆📈");
    } catch (error) {
      console.error("Error al repartir puntos ELO:", error);
    }
  };

  // --- LA FUNCIÓN DE INTELIGENCIA ARTIFICIAL REAL 🤖 ---
  const generarCronica = async () => {
    if (top3.length === 0) return;
    setGenerando(true);
    
    const campeon = top3[0].nombre;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 

    if (!apiKey) {
      alert("¡Falta la API Key de Gemini en el archivo .env!");
      setGenerando(false);
      return;
    }

    const prompt = `Eres un comentarista deportivo muy entusiasta y exagerado. Escribe un mensaje corto de WhatsApp anunciando que el jugador ${campeon} acaba de ganar la Jornada actual del torneo de pádel "Padelocos". 
    Invéntate un resumen épico de cómo jugó (juego inteligente, voleas mortales, etc). 
    Corónalo como el MVP. 
    Usa muchos emojis. 
    El formato debe parecerse a esto:
    "👑🔥MVP PADELOCOS🔥👑\nLa jornada ya tiene dueño...\n¡[Nombre] se lleva la corona!"`;

    try {
      // 1. ACTUALIZAMOS EL MODELO A LA VERSIÓN MÁS RECIENTE (gemini-3-flash) 👇
      const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      // 2. NUEVO CAZADOR DE ERRORES: Si Google se queja, leemos su mente
      if (!respuesta.ok) {
        const errorGoogle = await respuesta.json();
        console.error("Detalles del error de Google:", errorGoogle);
        throw new Error(`Google dice: ${errorGoogle.error?.message || 'Error de conexión'}`);
      }

      const datos = await respuesta.json();
      
      if (datos.candidates && datos.candidates.length > 0) {
        const textoIA = datos.candidates[0].content.parts[0].text;
        setResumen(textoIA);
      } else {
        throw new Error("La IA pensó mucho pero no devolvió texto.");
      }

    } catch (error) {
      console.error("Error al generar con IA:", error);
      // Ahora la alerta en pantalla te dirá exactamente cuál es el problema real
      alert(`Hubo un problema: ${error.message}`);
    } finally {
      setGenerando(false);
    }
  };

  // --- FUNCIÓN PARA COPIAR TEXTO ---
  const copiarAlPortapapeles = () => {
    navigator.clipboard.writeText(resumen);
    setCopiado(true); // Cambiamos el estado a copiado
    
    // Regresamos el botón a la normalidad después de 3 segundos
    setTimeout(() => {
      setCopiado(false);
    }, 3000);
  };


  return (
    <div className="results-container">
      <div className="confetti-bg"></div>
      
      <h1 className="neon-text title-resultados">SALÓN DE LA FAMA 🏆</h1>
      <p className="subtitle-resultados">Resultados finales de la jornada</p>

      {/* --- EL PODIO VISUAL --- */}
      {top3.length > 0 && (
        <div className="podium-container">
          {top3[1] && (
            <div className="podium-step step-2">
              <div className="podium-avatar silver-glow">🥈</div>
              <span className="podium-name">{top3[1].nombre}</span>
              <span className="podium-pts">{top3[1].puntos} pts</span>
              <div className="podium-block block-2">2</div>
            </div>
          )}

          {top3[0] && (
            <div className="podium-step step-1">
              <div className="podium-avatar gold-glow">👑</div>
              <span className="podium-name winner-name">{top3[0].nombre}</span>
              <span className="podium-pts">{top3[0].puntos} pts</span>
              <div className="podium-block block-1">1</div>
            </div>
          )}

          {top3[2] && (
            <div className="podium-step step-3">
              <div className="podium-avatar bronze-glow">🥉</div>
              <span className="podium-name">{top3[2].nombre}</span>
              <span className="podium-pts">{top3[2].puntos} pts</span>
              <div className="podium-block block-3">3</div>
            </div>
          )}
        </div>
      )}

      {/* --- SECCIÓN DE LA IA REAL 🤖 --- */}
      {top3.length > 0 && (
        <div className="ia-section">
          {!resumen ? (
            <button 
              className="ia-btn" 
              onClick={generarCronica} 
              disabled={generando}
            >
              {generando ? '🤖 CONECTANDO CON LA IA...' : '✨ GENERAR RESUMEN ÉPICO'}
            </button>
          ) : (
            <div className="ia-result-box">
              <p className="ia-texto">{resumen}</p>
              <button 
                className={`copy-btn ${copiado ? 'copiado-success' : ''}`} 
                onClick={copiarAlPortapapeles}
              >
                {copiado ? '✅ ¡COPIADO AL PORTAPAPELES!' : '📋 COPIAR PARA WHATSAPP'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- LA TABLA PARA EL RESTO --- */}
      {resto.length > 0 && (
        <div className="table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>POS</th>
                <th>JUGADOR</th>
                <th>VICTORIAS</th>
              </tr>
            </thead>
            <tbody>
              {resto.map((jugador, index) => (
                <tr key={jugador.id}>
                  <td className="pos-col">{index + 4}º</td>
                  <td className="name-col">{jugador.nombre} <span className="id-col">#{jugador.id}</span></td>
                  <td className="points-col">{jugador.puntos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Botón para repartir puntos ELO */}
      {!puntosRepartidos && (
        <button 
          className="action-btn primary neon-border" 
          onClick={repartirPuntosElo}
          style={{marginBottom: '20px', width: '100%', maxWidth: '400px'}}
        >
          REPARTIR PUNTOS ELO 🏆
        </button>
      )}

      {/* Tu botón original para volver (ahora un poco más gris si aún no repartes los puntos, o brillante si ya lo hiciste) */}
      <button 
        className={`main-button return-btn ${puntosRepartidos ? 'neon-button' : 'secondary'}`} 
        onClick={() => navigate('/home')}
      >
        CERRAR JORNADA Y VOLVER
      </button>
    </div>
  );
}

export default Resultados;