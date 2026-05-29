import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Tu configuración de Supabase
import './Ranking.css';

const mostrarMenu = location.pathname !== '/ranking';

const Ranking = () => {
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const { data, error } = await supabase
        .from('jugadores')
        .select('nombre, ranking_elo')
        .order('ranking_elo', { ascending: false });

      if (error) console.error("Error al cargar ranking:", error);
      else setJugadores(data);
      setLoading(false);
    };

    fetchRanking();
  }, []);

  if (loading) return <div className="loading">Cargando Leyendas...</div>;

  return (
    <div className="ranking-page">
      <div className="ranking-header">
        <h1 className="neon-title">Ranking <span>PADELOCOS</span></h1>
        <p>Los mejores de la Guarida</p>
      </div>

      <div className="ranking-container">
        {jugadores.map((jugador, index) => (
          <div key={index} className={`ranking-card pos-${index + 1}`}>
            <div className="rank-number">{index + 1}</div>
            <div className="player-info">
              <span className="player-name">{jugador.nombre}</span>
            </div>
            <div className="elo-badge">
              <span className="elo-value">{jugador.ranking_elo}</span>
              <span className="elo-label">ELO</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;