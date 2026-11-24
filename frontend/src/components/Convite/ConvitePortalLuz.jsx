import React from 'react';
import './ConvitePortalLuz.css';

export default function ConvitePortalLuz({ 
  senderName = 'Um Irmão em Cristo', 
  senderAvatar = '/favicon.png',
  conviteType = 'cafe',
  customMessage = '',
  vipCode = '',
  onAccept,
  onDismiss 
}) {
  const getConviteDetails = () => {
    switch (conviteType) {
      case 'cafe':
        return {
          tag: 'Café & Comunhão',
          title: 'Que tal um café hoje para conversarmos?',
          defaultMsg: 'Às vezes você só precisa de um momento sincero de comunhão e um bom papo. Separei este convite especial para você.'
        };
      case 'templo':
        return {
          tag: 'Cuidado do Templo',
          title: 'Bora treinar ou caminhar juntos hoje?',
          defaultMsg: 'Nosso corpo é templo sagrado. Te convido para nos movimentarmos com saúde, vitalidade e alegria hoje.'
        };
      case 'igreja':
        return {
          tag: 'Igreja & Fé',
          title: 'Quero te convidar para estar comigo no próximo culto!',
          defaultMsg: 'Será uma honra ter você ao meu lado celebrando a presença de Deus e ouvindo uma palavra de esperança.'
        };
      case 'palavra':
      default:
        return {
          tag: 'Palavra & Quietude',
          title: 'Separei uma mensagem inspiradora para o seu dia!',
          defaultMsg: 'Que esta quietude e reflexão tragam paz ao seu coração e força para enfrentar os desafios de hoje.'
        };
    }
  };

  const details = getConviteDetails();
  const displayMsg = customMessage || details.defaultMsg;

  return (
    <div className="portal-viewport">
      {/* Névoa de Luz Dourada */}
      <div className="portal-light-mist" />
      <div className="portal-particles-layer" />

      {/* Card Flutuante em 3D */}
      <div className="portal-card-3d-wrap">
        <div className="portal-card-surface">
          {/* Remetente do Convite */}
          <div className="portal-sender-row">
            <img 
              src={senderAvatar} 
              alt={senderName} 
              className="portal-sender-avatar"
              onError={(e) => { e.target.src = '/favicon.png'; }}
            />
            <div className="portal-sender-info">
              <div className="portal-sender-label">Você recebeu 1Convite de</div>
              <div className="portal-sender-name">{senderName}</div>
            </div>
          </div>

          {/* Selo da Chama */}
          <div className="portal-flame-crown">
            <img src="/favicon.png" alt="1Convite" />
          </div>

          {/* Categoria do Convite */}
          <div className="portal-convite-tag">
            {details.tag}
          </div>

          {/* Título Principal */}
          <h2 className="portal-convite-title">
            {details.title}
          </h2>

          {/* Mensagem Pessoal */}
          <div className="portal-convite-quote">
            "{displayMsg}"
          </div>

          {/* Botão de Aceitar Convite */}
          <button 
            type="button" 
            className="portal-accept-btn"
            onClick={() => {
              if (onAccept) onAccept({ vipCode, senderName });
            }}
          >
            <span>Aceitar Convite & Entrar</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {/* Descartar / Ver depois */}
          {onDismiss && (
            <button type="button" className="portal-dismiss-btn" onClick={onDismiss}>
              Continuar navegando no app
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
