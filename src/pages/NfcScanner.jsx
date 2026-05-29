import React, { useState } from 'react';
import './NfcScanner.css';

const NfcScanner = () => {
  const [escaneando, setEscaneando] = useState(true);

  // Un pequeño truco visual para la demo: 
  // Si le das clic al círculo, simula que leyó un chip.
  const simularLectura = () => {
    setEscaneando(false);
    setTimeout(() => {
      setEscaneando(true);
    }, 3000); // Vuelve a escanear después de 3 segundos
  };

  return (
    <div className="nfc-container">
      <h1 className="neon-text">CHECK-IN <span>NFC</span></h1>
      <p className="nfc-subtitle">Acerca tu pulsera o llavero Padelocos al dispositivo</p>

      <div className="scanner-area" onClick={simularLectura}>
        {escaneando ? (
          <div className="radar-box">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay"></div>
            <div className="nfc-icon">📲</div>
            <p className="status-text">Esperando llavero...</p>
          </div>
        ) : (
          <div className="success-box">
            <div className="success-icon">✅</div>
            <h2 className="success-name">¡Jugador Detectado!</h2>
            <p className="status-text success-text">ID #45 - Conectando con Supabase...</p>
          </div>
        )}
      </div>

      <div className="nfc-instructions">
        <p>⚡ <b>Fase 2 del Proyecto:</b> Esta pantalla conectará con el lector físico para registrar asistencias y actualizar el estatus en tiempo real.</p>
      </div>
    </div>
  );
};

export default NfcScanner;