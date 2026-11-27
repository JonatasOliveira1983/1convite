import React, { useState, useEffect } from 'react';
import './ConvitePortalLuz.css';
import appLogoWhite from '../../assets/logomarca_dark.png';

function getPortalApiBase() {
  const isCapacitor = Boolean(
    (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Capacitor'))
  );
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost && !isCapacitor
    ? 'http://localhost:3001/api/v1'
    : import.meta.env.VITE_API_URL || 'https://oneconvite.onrender.com/api/v1';
}

function formatDurationText(days) {
  const d = Number(days) || 180;
  if (d >= 360 && d <= 370) return '1 ano gratuito';
  if (d === 180) return '6 meses gratuitos';
  if (d % 365 === 0) {
    const yrs = d / 365;
    return `${yrs} ${yrs === 1 ? 'ano gratuito' : 'anos gratuitos'}`;
  }
  if (d % 30 === 0 && d >= 60) {
    const m = d / 30;
    return `${m} meses gratuitos`;
  }
  return `${d} dias gratuitos`;
}

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
  const [daysValid, setDaysValid] = useState(180);
  const [resolvedSender, setResolvedSender] = useState(senderName);

  useEffect(() => {
    setResolvedSender(senderName);
  }, [senderName]);

  useEffect(() => {
    const code = String(vipCode || '').trim().toUpperCase();
    if (!code) return;
    let cancelled = false;
    fetch(`${getPortalApiBase()}/vouchers/info/${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data?.success) return;
        if (data.daysValid) setDaysValid(Number(data.daysValid));
        if (data.giftedByName && (!senderName || senderName === 'Um Irmão em Cristo')) {
          setResolvedSender(data.giftedByName);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [vipCode, senderName]);

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
                <span className="gv-seal-big">{daysValid}</span>
                <span className="gv-seal-small">DIAS</span>
                <span className="gv-seal-small" style={{ marginTop: '1px', opacity: 0.85 }}>GRÁTIS</span>
              </div>
            </div>

            <div className="gv-kicker">GIFT VOUCHER • VIP</div>
            <h2 className="gv-serif-title">Você é Especial</h2>

            <div className="gv-sender-line">
              <img
                src={senderAvatar}
                alt={resolvedSender}
                className="gv-sender-avatar"
                onError={(e) => { e.target.src = '/favicon.png'; }}
              />
              <span className="gv-sender-text">
                Presente de <strong>{resolvedSender}</strong>
              </span>
            </div>

            <p className="gv-message">
              {customMessage || `Você foi presenteado com ${formatDurationText(daysValid)} no ecossistema 1Convite — fé, sabedoria e saúde todos os dias no seu celular.`}
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
                if (onAccept) onAccept({ vipCode, senderName: resolvedSender, action: 'download' });
              }}
            >
              <span>Baixar App & Ativar {daysValid} Dias</span>
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
                if (onAccept) onAccept({ vipCode, senderName: resolvedSender, action: 'register' });
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
