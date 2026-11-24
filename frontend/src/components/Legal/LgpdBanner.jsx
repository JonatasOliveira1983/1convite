import React, { useState } from 'react';

export default function LgpdBanner({ onOpenLegal }) {
  const [accepted, setAccepted] = useState(() => {
    try {
      return localStorage.getItem('1convite_lgpd_consent') === 'accepted';
    } catch {
      return false;
    }
  });

  if (accepted) return null;

  const handleAccept = () => {
    try {
      localStorage.setItem('1convite_lgpd_consent', 'accepted');
    } catch {
      // noop
    }
    setAccepted(true);
  };

  return (
    <div
      role="dialog"
      aria-label="Aviso de Privacidade e LGPD"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '720px',
        zIndex: 99990,
        background: 'rgba(16, 17, 24, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(249, 115, 22, 0.4)',
        borderRadius: '16px',
        padding: '14px 18px',
        boxShadow: '0 16px 45px rgba(0, 0, 0, 0.65)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        color: '#E2E8F0',
        fontSize: '0.8rem'
      }}
    >
      <div style={{ flex: '1 1 320px', lineHeight: '1.45' }}>
        Usamos armazenamento local essencial para manter sua sessão, tema e progresso diário em conformidade com a <strong>LGPD (Lei 13.709/2018)</strong>.{' '}
        <button
          type="button"
          onClick={() => onOpenLegal && onOpenLegal('privacidade')}
          style={{ background: 'none', border: 'none', color: '#FDBA74', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 'inherit', fontWeight: '700' }}
        >
          Política de Privacidade
        </button>
        {' • '}
        <button
          type="button"
          onClick={() => onOpenLegal && onOpenLegal('termos')}
          style={{ background: 'none', border: 'none', color: '#FDBA74', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 'inherit', fontWeight: '700' }}
        >
          Termos de Uso
        </button>
      </div>

      <button
        type="button"
        onClick={handleAccept}
        style={{
          background: 'linear-gradient(135deg, #F97316, #EA580C)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '10px',
          padding: '9px 18px',
          fontSize: '0.8rem',
          fontWeight: '800',
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        Entendi e Aceito
      </button>
    </div>
  );
}
