import React, { useState } from 'react';
import './UpgradeVoucherModal.css';
import adminAuthService from '../../services/adminAuthService';
import AsaasCheckoutModal from '../Checkout/AsaasCheckoutModal';

export default function UpgradeVoucherModal({ isOpen, onClose, onActivatePremium }) {
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('planos'); // 'planos' ou 'voucher'
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');
  const [validating, setValidating] = useState(false);

  const handleApplyVoucher = async (e) => {
    e.preventDefault();
    setVoucherError('');
    setVoucherSuccess('');
    const clean = voucherCode.trim().toUpperCase();

    if (!clean) {
      setVoucherError('Digite o código do seu convite.');
      return;
    }

    setValidating(true);
    const res = await adminAuthService.validateVoucherAsync(clean);
    setValidating(false);

    if (res.success) {
      setVoucherSuccess('Convite ativado com sucesso! Acesso completo liberado.');
      setTimeout(() => {
        onActivatePremium(clean);
        onClose();
      }, 1200);
    } else {
      setVoucherError(res.message || 'Código de convite inválido, pausado ou esgotado.');
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
            {/* Plano Básico */}
            <div className="uv-plan-card">
              <div className="uv-plan-tag">Básico</div>
              <h3 className="uv-plan-name">Plano Semente</h3>
              <p className="uv-plan-desc">Acesso completo ao ecossistema + 1 convite gratuito.</p>
              <div className="uv-plan-price">
                <span className="uv-currency">R$</span>
                <span className="uv-value">67</span>
                <span className="uv-period">/ano</span>
              </div>
              <ul className="uv-plan-features">
                <li>Bíblia ACF com Narração Imersiva</li>
                <li>Meditação Café com Deus (Leitura + Áudio)</li>
                <li>Treino Templo & Espaço Kids</li>
                <li><strong>1 Convite Gratuito</strong> para liberar o app a alguém</li>
              </ul>
              <button 
                onClick={() => setCheckoutPlan('basico')}
                className="uv-plan-btn"
              >
                Garantir Plano Básico
              </button>
            </div>

            {/* Plano Mais Popular */}
            <div className="uv-plan-card uv-featured">
              <div className="uv-badge-highlight">MAIS POPULAR</div>
              <div className="uv-plan-tag uv-tag-orange">Mais Popular</div>
              <h3 className="uv-plan-name">Plano Edificação</h3>
              <p className="uv-plan-desc">O plano ideal para você e para abençoar sua família e amigos.</p>
              <div className="uv-plan-price">
                <span className="uv-currency">R$</span>
                <span className="uv-value">97</span>
                <span className="uv-period">/ano</span>
              </div>
              <ul className="uv-plan-features">
                <li>Tudo do Plano Básico liberado</li>
                <li>Espaço Mulher Virtuosa & Biblioteca do Pregador</li>
                <li>Mentoria Bíblica & Estúdio de Cards</li>
                <li><strong>5 Convites Gratuitos</strong> com código exclusivo</li>
              </ul>
              <button 
                onClick={() => setCheckoutPlan('popular')}
                className="uv-plan-btn uv-btn-featured"
              >
                Garantir Plano Popular
              </button>
            </div>

            {/* Plano Avançado */}
            <div className="uv-plan-card">
              <div className="uv-plan-tag">Avançado</div>
              <h3 className="uv-plan-name">Plano Reino</h3>
              <p className="uv-plan-desc">Acesso completo para líderes, células e famílias.</p>
              <div className="uv-plan-price">
                <span className="uv-currency">R$</span>
                <span className="uv-value">147</span>
                <span className="uv-period">/ano</span>
              </div>
              <ul className="uv-plan-features">
                <li>Acesso Total a Todos os Módulos</li>
                <li>Todos os E-books & Guias em PDF</li>
                <li><strong>10 Convites Gratuitos</strong> para sua igreja/célula</li>
              </ul>
              <button 
                onClick={() => setCheckoutPlan('avancado')}
                className="uv-plan-btn"
              >
                Garantir Plano Avançado
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
      <AsaasCheckoutModal
        isOpen={Boolean(checkoutPlan)}
        planId={checkoutPlan}
        onClose={() => setCheckoutPlan(null)}
        onSuccess={() => {
          if (onActivatePremium) onActivatePremium('ASAAS_VIP');
        }}
      />
    </div>
  );
}
