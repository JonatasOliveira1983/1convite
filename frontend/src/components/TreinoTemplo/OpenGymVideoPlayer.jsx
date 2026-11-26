import React, { useState } from 'react';

/**
 * OpenGymVideoPlayer — Player nativo de alta performance para os clipes e stills do OpenGym.
 * Renderiza o clipe MP4 em loop contínuo de 180px com fallback automático para WebP.
 */
export default function OpenGymVideoPlayer({ clipUrl, stillUrl, title = 'Exercício' }) {
  const [videoError, setVideoError] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '380px',
        margin: '0 auto',
        background: '#FFFFFF',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '220px',
      }}
    >
      {!videoError && clipUrl ? (
        <video
          src={clipUrl}
          poster={stillUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '280px',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      ) : (
        <img
          src={stillUrl}
          alt={title}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '280px',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      )}

      {/* Selo oficial de loop */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(4px)',
          padding: '3px 9px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.64rem',
          fontWeight: '800',
          color: '#34D399',
          border: '1px solid rgba(52, 211, 153, 0.35)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        <span className="templofit-live-dot" />
        <span>OPENGYM 3D • LOOP</span>
      </div>
    </div>
  );
}
