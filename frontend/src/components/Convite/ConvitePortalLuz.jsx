import React, { useState } from 'react';
import './ConvitePortalLuz.css';
import appLogoWhite from '../../assets/logomarca_dark.png';

export default function ConvitePortalLuz({ 
  senderName = 'Um Irmão em Cristo', 
  senderAvatar = '/favicon.png',
  conviteType = 'vip',
  customMessage = '',
  vipCode = '',
  onAccept,
  onDismiss 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!vipCode) return;
    navigator.clipboard?.writeText(vipCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="portal-viewport">
      <div className="portal-light-mist" />
      <div className="portal-particles-layer" />

      <div className="portal-card-3d-wrap">
        <div className="gv-card">
          <div className="gv-inner-frame">
            <div className="gv-gold-bars" aria-hidden="true">
              <div className="gv-gold-bar gv-gold-bar-1" />
              <div className="gv-gold-bar gv-gold-bar-2" />
            </div>

            <div className="gv-header-row">
              <img
                src={appLogoWhite}
                alt="1Convite"
                className="gv-logo"
              />
              <div className="gv-seal-circle">
                <span className="gv-seal-big">180</span>
                <span className="gv-seal-small">Dias Grátis</span>
              </div>
            </div>

            <div className="gv-kicker">GIFT VOUCHER • VIP</div>
            <h2 className="gv-serif-title">Você é Especial</h2>

            <div className="gv-sender-line">
              <img
                src={senderAvatar}
                alt={senderName}
                className="gv-sender-avatar"
                onError={(e) => { e.target.src = '/favicon.png'; }}
              />
              <span className="gv-sender-text">
                Presente de <strong>{senderName}</strong>
              </span>
            </div>

            <p className="gv-message">
              {customMessage || 'Você foi presenteado com 6 meses gratuitos no ecossistema 1Convite — fé, sabedoria e saúde todos os dias no seu celular.'}
            </p>

            <div className="gv-pillars-line">
              Bíblia em Áudio • Meditação Narrada • Exercícios Templo • Mentores
            </div>

            <div className="gv-coupon-divider" />

            {vipCode && (
              <div className="gv-code-box">
                <div className="gv-code-label">Código do Seu Convite</div>
                <div className="gv-code-row">
                  <span className="gv-code-value">{vipCode}</span>
                  <button type="button" className="gv-copy-btn" onClick={handleCopyCode}>
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              className="gv-btn-gold"
              onClick={() => {
                if (onAccept) onAccept({ vipCode, senderName, action: 'download' });
              }}
            >
              <span>Baixar App & Ativar 180 Dias</span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>

            <button
              type="button"
              className="gv-btn-outline"
              onClick={() => {
                if (onAccept) onAccept({ vipCode, senderName, action: 'register' });
              }}
            >
              Já baixei • Criar Minha Conta com Código
            </button>

            {onDismiss && (
              <button type="button" className="portal-dismiss-btn" onClick={onDismiss} style={{ marginTop: '10px' }}>
                Entrar depois
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
