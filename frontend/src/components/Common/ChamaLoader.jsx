import React from 'react';
import './ChamaLoader.css';

export default function ChamaLoader({ size = 76, label = '', fullScreen = false }) {
  return (
    <div className={fullScreen ? 'chama-loader-fullscreen' : 'chama-loader-inline'} role="status" aria-live="polite">
      <div className="chama-loader-stage" style={{ width: size, height: size }}>
        <div className="chama-loader-ring" />
        <div className="chama-loader-halo" />
        <img
          src="/chama-1convite.png"
          alt="Carregando 1Convite"
          className="chama-loader-img"
        />
      </div>
      {label ? <span className="chama-loader-label">{label}</span> : null}
    </div>
  );
}
