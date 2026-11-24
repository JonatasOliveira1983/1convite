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
        <div
          className="portal-card-surface"
          style={{
            background: 'linear-gradient(155deg, #141418 0%, #09090d 60%, #1a1409 100%)',
            border: '1.5px solid rgba(251, 191, 36, 0.55)',
            boxShadow: '0 28px 80px rgba(0,0,0,0.85), 0 0 50px rgba(245, 158, 11, 0.22)'
          }}
        >
          {/* Logomarca Oficial 1Convite */}
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
            <img
              src={appLogoWhite}
              alt="1Convite - Compartilhando o Reino"
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Selo Vale-Presente Digital */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(249, 115, 22, 0.2))',
              border: '1px solid rgba(251, 191, 36, 0.5)',
              color: '#FCD34D',
              fontSize: '0.72rem',
              fontWeight: '800',
              letterSpacing: '0.08em',
              padding: '5px 14px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              marginBottom: '16px'
            }}
          >
            <span>Vale-Presente Digital • 6 Meses (180 Dias) Grátis</span>
          </div>

          {/* Remetente */}
          <div className="portal-sender-row" style={{ marginBottom: '14px' }}>
            <img
              src={senderAvatar}
              alt={senderName}
              className="portal-sender-avatar"
              onError={(e) => { e.target.src = '/favicon.png'; }}
            />
            <div className="portal-sender-info">
              <div className="portal-sender-label">Presente exclusivo enviado por</div>
              <div className="portal-sender-name" style={{ color: '#FDE68A' }}>{senderName}</div>
            </div>
          </div>

          {/* Título Principal */}
          <h2 className="portal-convite-title" style={{ fontSize: '1.38rem', marginBottom: '8px' }}>
            Você é uma pessoa especial!
          </h2>

          <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: '1.5', margin: '0 0 16px' }}>
            {customMessage || 'Você recebeu um convite exclusivo para acessar o aplicativo 1Convite gratuitamente por 180 dias — mais espiritualidade, conhecimento e saúde no seu dia a dia.'}
          </p>

          {/* Pontos Principais do Sistema */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginBottom: '18px',
            textAlign: 'left'
          }}>
            {[
              'Bíblia ACF (Ler & Ouvir)',
              'Meditações Narradas',
              'Treino Templo (Exercícios)',
              'Mentores & Espaço Família'
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#F8FAFC'
                }}
              >
                • {item}
              </div>
            ))}
          </div>

          {/* Bloco do Código do Voucher */}
          {vipCode && (
            <div
              style={{
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1.5px dashed #F59E0B',
                borderRadius: '14px',
                padding: '12px 14px',
                marginBottom: '18px'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#FDE68A', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                Seu Código de Acesso (180 Dias Grátis)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '0.12em', color: '#FFFFFF' }}>
                  {vipCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  style={{
                    background: 'rgba(251, 191, 36, 0.2)',
                    border: '1px solid rgba(251, 191, 36, 0.5)',
                    color: '#FCD34D',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          )}

          {/* Botão Principal: Baixar Aplicativo */}
          <button
            type="button"
            className="portal-accept-btn"
            style={{
              background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
              color: '#FFFFFF',
              marginBottom: '10px'
            }}
            onClick={() => {
              if (onAccept) onAccept({ vipCode, senderName, action: 'download' });
            }}
          >
            <span>Baixar Aplicativo & Ativar Voucher</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onAccept) onAccept({ vipCode, senderName, action: 'register' });
            }}
            style={{
              width: '100%',
              padding: '11px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              fontSize: '0.86rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Criar Minha Conta com este Código
          </button>

          {onDismiss && (
            <button type="button" className="portal-dismiss-btn" onClick={onDismiss} style={{ marginTop: '10px' }}>
              Entrar depois
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
