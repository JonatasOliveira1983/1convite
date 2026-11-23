import React, { useState } from 'react';
import './UpgradeVoucherModal.css';

export default function UpgradeVoucherModal({ isOpen, onClose, onActivatePremium }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('planos'); // 'planos' ou 'voucher'
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    setVoucherError('');
    setVoucherSuccess('');
    const clean = voucherCode.trim().toUpperCase();

    if (!clean) {
      setVoucherError('Digite o código do seu convite.');
      return;
    }

    // Aceita qualquer código com formato de voucher ou palavras-chave
    if (clean.length >= 3) {
      setVoucherSuccess('Convite ativado com sucesso! Você ganhou acesso Premium.');
      setTimeout(() => {
        onActivatePremium(clean);
        onClose();
      }, 1500);
    } else {
      setVoucherError('Código de convite inválido ou expirado.');
    }
  };

  return (
    <div className="uv-overlay animate-fade-in" onClick={onClose}>
      <div className="uv-modal animate-scale-up" onClick={e => e.stopPropagation()}>
        <button className="uv-close-btn" onClick={onClose} aria-label="Fechar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Topo / Banner */}
        <div className="uv-top-banner">
          <div className="uv-crown-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
          </div>
          <h2 className="uv-title">Ecossistema 1Convite Premium</h2>
          <p className="uv-subtitle">Desbloqueie todos os módulos ou resgate um convite oficial de um irmão.</p>
        </div>

        {/* Abas: Escolher Plano vs Resgatar Voucher */}
        <div className="uv-tabs-row">
          <button 
            onClick={() => setActiveTab('planos')}
            className={`uv-tab-chip ${activeTab === 'planos' ? 'active' : ''}`}
          >
            Conhecer os Planos
          </button>
          <button 
            onClick={() => setActiveTab('voucher')}
            className={`uv-tab-chip ${activeTab === 'voucher' ? 'active' : ''}`}
          >
            Resgatar Convite (Voucher)
          </button>
        </div>

        {/* Conteúdo: Planos */}
        {activeTab === 'planos' && (
          <div className="uv-plans-scroll animate-fade-in">
            {/* Plano Semente */}
            <div className="uv-plan-card">
              <div className="uv-plan-tag">Básico</div>
              <h3 className="uv-plan-name">Plano Semente</h3>
              <p className="uv-plan-desc">Acesso individual completo ao ecossistema.</p>
              <div className="uv-plan-price">
                <span className="uv-currency">R$</span>
                <span className="uv-value">37</span>
                <span className="uv-period">/ano</span>
              </div>
              <ul className="uv-plan-features">
                <li>Bíblia com Narração Imersiva</li>
                <li>Mini-App Café com Deus (365 Dias)</li>
                <li>1 Convite de Cortesia para presentear um amigo</li>
              </ul>
              <button 
                onClick={() => {
                  window.open('https://api.whatsapp.com/send?text=Ol%C3%A1%2C+quero+adquirir+o+Plano+Semente+do+1Convite', '_blank');
                }}
                className="uv-plan-btn"
              >
                Garantir Plano Semente
              </button>
            </div>

            {/* Plano Edificação (Popular / Recomendado) */}
            <div className="uv-plan-card uv-featured">
              <div className="uv-badge-highlight">MAIS ESCOLHIDO</div>
              <div className="uv-plan-tag uv-tag-orange">Carro-Chefe</div>
              <h3 className="uv-plan-name">Plano Edificação</h3>
              <p className="uv-plan-desc">O plano ideal para você e para abençoar quem você ama.</p>
              <div className="uv-plan-price">
                <span className="uv-currency">R$</span>
                <span className="uv-value">57</span>
                <span className="uv-period">/ano</span>
              </div>
              <ul className="uv-plan-features">
                <li>Tudo do Plano Semente</li>
                <li>Espaço Mulher Virtuosa & Biblioteca do Pregador</li>
                <li>Mentoria Neural Ilimitada com IA LAYLA</li>
                <li><strong>3 a 5 Vouchers / Convites Oficiais</strong> para presentear</li>
              </ul>
              <button 
                onClick={() => {
                  window.open('https://api.whatsapp.com/send?text=Ol%C3%A1%2C+quero+adquirir+o+Plano+Edifica%C3%A7%C3%A3o+do+1Convite', '_blank');
                }}
                className="uv-plan-btn uv-btn-featured"
              >
                Garantir Plano Edificação
              </button>
            </div>

            {/* Plano Reino */}
            <div className="uv-plan-card">
              <div className="uv-plan-tag">Completo VIP</div>
              <h3 className="uv-plan-name">Plano Reino</h3>
              <p className="uv-plan-desc">Acesso total e vitalício com acervo para ministérios.</p>
              <div className="uv-plan-price">
                <span className="uv-currency">R$</span>
                <span className="uv-value">97</span>
                <span className="uv-period">/vitalício</span>
              </div>
              <ul className="uv-plan-features">
                <li>Acesso Completo & Vitalício</li>
                <li>Todos os E-books & Guias em PDF</li>
                <li><strong>10 Vouchers Digitais</strong> para sua igreja/célula</li>
              </ul>
              <button 
                onClick={() => {
                  window.open('https://api.whatsapp.com/send?text=Ol%C3%A1%2C+quero+adquirir+o+Plano+Reino+do+1Convite', '_blank');
                }}
                className="uv-plan-btn"
              >
                Garantir Acesso Vitalício
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo: Resgatar Voucher */}
        {activeTab === 'voucher' && (
          <form onSubmit={handleApplyVoucher} className="uv-voucher-box animate-fade-in">
            <div className="uv-voucher-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>

            <h3 className="uv-voucher-heading">Você recebeu um convite?</h3>
            <p className="uv-voucher-desc">
              Digite abaixo o código que você recebeu pelo WhatsApp ou e-mail de um irmão para liberar seu acesso Premium gratuitamente.
            </p>

            <div className="uv-input-wrap">
              <input 
                type="text" 
                placeholder="Ex: CONVITE-7A8B ou PAZ" 
                value={voucherCode}
                onChange={e => setVoucherCode(e.target.value)}
                className="uv-voucher-input"
              />
              <button type="submit" className="uv-voucher-submit">
                Ativar Presente
              </button>
            </div>

            {voucherError && <p className="uv-msg-error">{voucherError}</p>}
            {voucherSuccess && <p className="uv-msg-success">{voucherSuccess}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
