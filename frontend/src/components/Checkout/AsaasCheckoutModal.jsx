import React, { useState, useEffect, useRef } from 'react';
import './AsaasCheckoutModal.css';
import appLogoDark from '../../assets/logomarca_dark.png';

function formatCpfCnpj(val = '') {
  const d = String(val).replace(/\D/g, '').slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  }
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function formatPhone(val = '') {
  const d = String(val).replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const PLANOS_MAP = {
  basico: {
    id: 'basico',
    titulo: 'Plano Básico — Semente',
    valorReais: 67,
    valor: 'R$ 67/ano',
    convites: 1,
  },
  popular: {
    id: 'popular',
    titulo: 'Plano Mais Popular — Edificação',
    valorReais: 97,
    valor: 'R$ 97/ano',
    convites: 3,
  },
  avancado: {
    id: 'avancado',
    titulo: 'Plano Avançado — Reino',
    valorReais: 147,
    valor: 'R$ 147/ano',
    convites: 5,
  },
};

const OFFERS_MAP = {
  order_bump_ebooks: {
    id: 'order_bump_ebooks',
    titulo: 'Coleção 5 E-books Premium',
    valorReais: 19.9,
    desc: 'Acesso completo aos 5 E-books em PDF para leitura e download no app.',
  },
  upsell_combo: {
    id: 'upsell_combo',
    titulo: 'Combo Ministério & Lar',
    valorReais: 47,
    desc: 'Biblioteca do Pregador + Planner da Mulher Virtuosa liberados por 1 ano.',
  },
  downsell_mulher: {
    id: 'downsell_mulher',
    titulo: 'Planner da Mulher Virtuosa',
    valorReais: 24.9,
    desc: 'Acesso exclusivo ao espaço devocional e organizador da Mulher Virtuosa.',
  },
  downsell_pregador: {
    id: 'downsell_pregador',
    titulo: 'Biblioteca do Pregador',
    valorReais: 24.9,
    desc: 'Esboços, referências e ferramentas práticas de pregação e ensino.',
  },
};

function saveLocalEntitlements(ents = []) {
  try {
    const prev = JSON.parse(localStorage.getItem('1convite_entitlements') || '[]');
    const merged = Array.from(new Set([...(Array.isArray(prev) ? prev : []), ...(Array.isArray(ents) ? ents : [])]));
    localStorage.setItem('1convite_entitlements', JSON.stringify(merged));
  } catch {
    // ignore storage errors
  }
}

function getApiBase() {
  const isCapacitor = Boolean(
    window.Capacitor ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Capacitor'))
  );
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost && !isCapacitor
    ? 'http://localhost:3001/api/v1'
    : import.meta.env.VITE_API_URL || 'https://oneconvite.onrender.com/api/v1';
}

export default function AsaasCheckoutModal({ isOpen, planId, offerId = null, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [billingType, setBillingType] = useState('PIX');
  const [includeOrderBump, setIncludeOrderBump] = useState(false);
  const [activeOfferId, setActiveOfferId] = useState(offerId);
  const [funnelStep, setFunnelStep] = useState('upsell'); // 'upsell' | 'downsell' | 'done'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chargeData, setChargeData] = useState(null);
  const [paidResult, setPaidResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(899);
  const [urgencyIdx, setUrgencyIdx] = useState(0);
  const pollRef = useRef(null);

  const plan = PLANOS_MAP[planId] || PLANOS_MAP.popular;
  const activeOffer = activeOfferId ? OFFERS_MAP[activeOfferId] : null;
  const totalCheckoutReais = activeOffer
    ? activeOffer.valorReais
    : plan.valorReais + (includeOrderBump ? 19.9 : 0);

  useEffect(() => {
    setActiveOfferId(offerId);
  }, [offerId]);

  useEffect(() => {
    if (!isOpen) {
      if (pollRef.current) clearInterval(pollRef.current);
      setError('');
      setChargeData(null);
      setPaidResult(null);
      setIncludeOrderBump(false);
      setActiveOfferId(offerId);
      setFunnelStep('upsell');
      setLoading(false);
      setSecondsLeft(899);
      setUrgencyIdx(0);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    const rot = setInterval(() => {
      setUrgencyIdx((prev) => (prev + 1) % 3);
    }, 4500);
    return () => {
      clearInterval(timer);
      clearInterval(rot);
    };
  }, [isOpen, planId, offerId]);

  const countdownLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;
  const urgencyMessages = [
    `Condição reservada por ${countdownLabel} • 5 E-books PDF + Convites inclusos`,
    `Últimas vagas com bônus liberado • Expira em ${countdownLabel}`,
    `Oferta especial ativa por ${countdownLabel} • Acesso VIP imediato`,
  ];

  const handlePaidSuccess = (data) => {
    if (data?.entitlements?.length) {
      saveLocalEntitlements(data.entitlements);
    }
    setPaidResult((prev) => {
      const mergedVouchers = (data?.vouchers && data.vouchers.length > 0) ? data.vouchers : (prev?.vouchers || []);
      return { ...data, vouchers: mergedVouchers };
    });
    if (activeOfferId) {
      setFunnelStep('done');
    }
    if (onSuccess) onSuccess(data);
  };

  useEffect(() => {
    if (!chargeData?.paymentId || paidResult) return;
    const apiBase = getApiBase();

    const checkStatus = async () => {
      try {
        const res = await fetch(`${apiBase}/pagamentos/status/${encodeURIComponent(chargeData.paymentId)}`);
        const data = await res.json();
        if (data?.paid) {
          if (pollRef.current) clearInterval(pollRef.current);
          handlePaidSuccess(data);
        }
      } catch {
        // ignora erro temporário de polling
      }
    };

    pollRef.current = setInterval(checkStatus, 4000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [chargeData?.paymentId, paidResult, onSuccess]);

  if (!isOpen) return null;

  const startOfferCharge = async (nextOfferId) => {
    setError('');
    setLoading(true);
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/pagamentos/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: nextOfferId,
          name: name.trim(),
          email: email.trim(),
          cpfCnpj: cpfCnpj.trim(),
          phone: phone.trim(),
          billingType: 'PIX',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Não foi possível gerar a oferta.');
      }
      setActiveOfferId(nextOfferId);
      setPaidResult(null);
      setChargeData(data);
    } catch (err) {
      setError(err.message || 'Erro ao gerar cobrança da oferta.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleanDigits = cpfCnpj.replace(/\D/g, '');
    if (cleanDigits.length !== 11 && cleanDigits.length !== 14) {
      setError('Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido para emissão no Asaas.');
      return;
    }
    setLoading(true);
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/pagamentos/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: activeOffer ? undefined : plan.id,
          offerId: activeOffer ? activeOffer.id : undefined,
          includeOrderBump: activeOffer ? false : includeOrderBump,
          name: name.trim(),
          email: email.trim(),
          cpfCnpj: cpfCnpj.trim(),
          phone: phone.trim(),
          billingType,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Não foi possível iniciar o pagamento.');
      }
      setChargeData(data);
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor de pagamentos.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheck = async () => {
    if (!chargeData?.paymentId) return;
    setLoading(true);
    setError('');
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/pagamentos/status/${encodeURIComponent(chargeData.paymentId)}`);
      const data = await res.json();
      if (data?.paid) {
        handlePaidSuccess(data);
      } else {
        setError('Pagamento ainda aguardando confirmação. Se acabou de pagar via PIX, aguarde alguns segundos.');
      }
    } catch {
      setError('Erro ao verificar status do pagamento.');
    } finally {
      setLoading(false);
    }
  };

  const handleSandboxConfirm = async () => {
    if (!chargeData?.paymentId) return;
    setLoading(true);
    setError('');
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/pagamentos/sandbox-confirm/${encodeURIComponent(chargeData.paymentId)}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok || !data?.paid) {
        throw new Error(data?.message || 'Não foi possível simular a confirmação.');
      }
      handlePaidSuccess(data);
    } catch (err) {
      setError(err.message || 'Erro ao confirmar pagamento Sandbox.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (value, label) => {
    navigator.clipboard?.writeText(value);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="ac-overlay" onClick={onClose}>
      <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ac-scarcity-bar">
          <span className="ac-scarcity-dot" aria-hidden="true" />
          <span>{urgencyMessages[urgencyIdx]}</span>
        </div>

        <button type="button" className="ac-close" onClick={onClose} aria-label="Fechar checkout">
          ×
        </button>

        <div className="ac-brand-row">
          <img src={appLogoDark} alt="1Convite" className="ac-brand-logo" />
          <span className="ac-ssl-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Ambiente Seguro SSL
          </span>
        </div>

        <div className="ac-header">
          <span className="ac-kicker">CHECKOUT SEGURO ASAAS</span>
          <h3 className="ac-title">{activeOffer ? activeOffer.titulo : plan.titulo}</h3>
          <div className="ac-order-summary">
            {activeOffer ? (
              <span><strong>R$ {activeOffer.valorReais.toFixed(2).replace('.', ',')}</strong> • {activeOffer.desc}</span>
            ) : (
              <span>
                <strong>R$ {totalCheckoutReais.toFixed(2).replace('.', ',')}</strong> • 365 dias VIP + {plan.convites} convite{plan.convites > 1 ? 's' : ''} (180 dias)
                {includeOrderBump ? ' + 5 E-books PDF' : ''}
              </span>
            )}
          </div>
        </div>

        {paidResult && !activeOfferId && funnelStep === 'upsell' ? (
          <div className="ac-success-box" style={{ textAlign: 'left' }}>
            <div className="ac-badge-ok" style={{ marginBottom: '10px' }}>PAGAMENTO PRINCIPAL CONFIRMADO</div>
            <h4 style={{ margin: '0 0 8px', color: '#FFFFFF', fontSize: '1.1rem' }}>
              Espere! Desbloqueie o Combo Ministério & Lar com 50% OFF
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: '1.5', margin: '0 0 14px' }}>
              Apenas agora, adicione a <strong>Biblioteca do Pregador</strong> (esboços e estudos) + o <strong>Planner da Mulher Virtuosa</strong> diretamente no seu app por apenas <strong style={{ color: '#FBBF24' }}>R$ 47,00</strong> (pagamento único).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="ac-btn-primary"
                disabled={loading}
                onClick={() => startOfferCharge('upsell_combo')}
              >
                {loading ? 'Gerando PIX do Combo...' : 'Sim! Liberar os 2 Apps por R$ 47,00'}
              </button>
              <button
                type="button"
                onClick={() => setFunnelStep('downsell')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(148,163,184,0.28)',
                  color: '#94A3B8',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Não, obrigado. Seguir sem o combo
              </button>
            </div>
          </div>
        ) : paidResult && !activeOfferId && funnelStep === 'downsell' ? (
          <div className="ac-success-box" style={{ textAlign: 'left' }}>
            <div className="ac-badge-ok" style={{ background: 'rgba(245,158,11,0.18)', color: '#FBBF24', marginBottom: '10px' }}>
              ÚLTIMA OPORTUNIDADE • R$ 24,90
            </div>
            <h4 style={{ margin: '0 0 8px', color: '#FFFFFF', fontSize: '1.05rem' }}>
              Leve apenas 1 dos aplicativos extras com condição especial
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#CBD5E1', lineHeight: '1.5', margin: '0 0 14px' }}>
              Escolha qual deles faz mais sentido para você hoje por apenas <strong style={{ color: '#FBBF24' }}>R$ 24,90</strong>:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                className="ac-btn-primary"
                disabled={loading}
                onClick={() => startOfferCharge('downsell_mulher')}
              >
                Liberar Planner da Mulher Virtuosa • R$ 24,90
              </button>
              <button
                type="button"
                className="ac-btn-primary"
                disabled={loading}
                onClick={() => startOfferCharge('downsell_pregador')}
                style={{ background: '#38BDF8', color: '#09090B' }}
              >
                Liberar Biblioteca do Pregador • R$ 24,90
              </button>
              <button
                type="button"
                onClick={() => setFunnelStep('done')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  padding: '8px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                Não quero nenhum agora, ir para o meu acesso →
              </button>
            </div>
          </div>
        ) : paidResult ? (
          <div className="ac-success-box">
            <div className="ac-badge-ok">PAGAMENTO CONFIRMADO</div>
            <h4>Seu acesso VIP está liberado!</h4>
            <p>
              Enviamos uma cópia para <strong>{paidResult.customerEmail}</strong>. Abaixo estão seus dados de acesso e códigos de convite:
            </p>
            {paidResult.tempPassword && (
              <div className="ac-voucher-item" style={{ marginBottom: '12px', borderColor: 'rgba(16,185,129,0.45)' }}>
                <span>Senha: <strong>{paidResult.tempPassword}</strong></span>
                <button type="button" onClick={() => copyText(paidResult.tempPassword, 'pass')}>
                  {copiedCode === 'pass' ? 'Copiada!' : 'Copiar'}
                </button>
              </div>
            )}
            <div className="ac-vouchers-list">
              {(paidResult.vouchers || []).map((code) => (
                <div key={code} className="ac-voucher-item">
                  <span>{code}</span>
                  <button type="button" onClick={() => copyText(code, code)}>
                    {copiedCode === code ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              ))}
            </div>
            <a
              href="/app"
              className="ac-btn-primary"
              style={{ textDecoration: 'none', textAlign: 'center', display: 'block' }}
            >
              Concluir e Acessar App
            </a>
          </div>
        ) : chargeData ? (
          <div className="ac-payment-step">
            {chargeData.billingType === 'PIX' && chargeData.pix?.encodedImage ? (
              <>
                <p className="ac-instruction">Escaneie o QR Code abaixo com o app do seu banco:</p>
                <div className="ac-qr-wrap">
                  <img
                    src={`data:image/png;base64,${chargeData.pix.encodedImage}`}
                    alt="QR Code PIX Asaas"
                    className="ac-qr-img"
                  />
                </div>
                {chargeData.pix.payload && (
                  <div className="ac-copy-box">
                    <input type="text" readOnly value={chargeData.pix.payload} />
                    <button type="button" onClick={() => copyText(chargeData.pix.payload, 'pix')}>
                      {copiedCode === 'pix' ? 'Copiado!' : 'Copiar PIX'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="ac-link-step">
                <p className="ac-instruction">
                  Sua fatura segura foi gerada no Asaas. Clique abaixo para pagar com Cartão de Crédito, PIX ou Boleto:
                </p>
                {chargeData.invoiceUrl && (
                  <a
                    href={chargeData.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ac-btn-primary"
                    style={{ textDecoration: 'none', textAlign: 'center', display: 'block' }}
                  >
                    Abrir Pagamento Seguro Asaas
                  </a>
                )}
              </div>
            )}

            {error && <div className="ac-error">{error}</div>}

            <div className="ac-actions-row">
              <button type="button" className="ac-btn-secondary" onClick={handleManualCheck} disabled={loading}>
                {loading ? 'Verificando...' : 'Já paguei, verificar agora'}
              </button>
              {chargeData.sandbox && (
                <button
                  type="button"
                  className="ac-btn-sandbox"
                  onClick={handleSandboxConfirm}
                  disabled={loading}
                >
                  {loading ? 'Confirmando...' : 'Simular Pagamento Aprovado (Sandbox)'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <form className="ac-form" onSubmit={handleSubmit}>
            <div className="ac-field">
              <label>Nome completo *</label>
              <input
                type="text"
                required
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="ac-field">
              <label>E-mail (para receber acesso e convites) *</label>
              <input
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="ac-row-2">
              <div className="ac-field">
                <label>CPF / CNPJ *</label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
                />
              </div>
              <div className="ac-field">
                <label>WhatsApp</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                />
              </div>
            </div>

            <div className="ac-method-toggle">
              <button
                type="button"
                className={billingType === 'PIX' ? 'active' : ''}
                onClick={() => setBillingType('PIX')}
              >
                <span>PIX Instantâneo</span>
                <small>Liberação imediata</small>
              </button>
              <button
                type="button"
                className={billingType === 'UNDEFINED' ? 'active' : ''}
                onClick={() => setBillingType('UNDEFINED')}
              >
                <span>Cartão / Link Asaas</span>
                <small>Crédito ou Boleto</small>
              </button>
            </div>

            {!activeOffer && (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: includeOrderBump ? '1.5px solid #F59E0B' : '1px dashed rgba(251, 191, 36, 0.45)',
                  background: includeOrderBump ? 'rgba(245, 158, 11, 0.14)' : 'rgba(245, 158, 11, 0.06)',
                  cursor: 'pointer',
                  marginBottom: '12px',
                }}
              >
                <input
                  type="checkbox"
                  checked={includeOrderBump}
                  onChange={(e) => setIncludeOrderBump(e.target.checked)}
                  style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#F59E0B' }}
                />
                <div style={{ fontSize: '0.8rem', lineHeight: '1.35', color: '#F8FAFC' }}>
                  <div style={{ fontWeight: '800', color: '#FBBF24' }}>
                    SIM! Adicionar Coleção 5 E-books Premium (+ R$ 19,90)
                  </div>
                  <div style={{ color: '#CBD5E1', marginTop: '2px', fontSize: '0.74rem' }}>
                    De R$ 67,00 por apenas R$ 19,90 — leitura e download em PDF liberados direto no seu app.
                  </div>
                </div>
              </label>
            )}

            {error && <div className="ac-error">{error}</div>}

            <button type="submit" className="ac-btn-primary ac-btn-lock" disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>
                {loading
                  ? 'Gerando cobrança segura...'
                  : `Pagar com Segurança • R$ ${totalCheckoutReais.toFixed(2).replace('.', ',')}`}
              </span>
            </button>
          </form>
        )}

        {/* ── SELOS DE CREDIBILIDADE, BANDEIRAS & GARANTIA (SVG) ── */}
        <div className="ac-trust-footer">
          <div className="ac-payment-brands" aria-label="Meios de pagamento aceitos">
            <span className="ac-brand-pill ac-brand-pix">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 12l10 10 10-10L12 2z"/></svg>
              PIX
            </span>
            <span className="ac-brand-pill">VISA</span>
            <span className="ac-brand-pill">Mastercard</span>
            <span className="ac-brand-pill">Elo</span>
            <span className="ac-brand-pill">Amex</span>
          </div>

          <div className="ac-trust-badges">
            <div className="ac-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              <span>7 Dias de Garantia</span>
            </div>
            <div className="ac-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>Processado por <strong>Asaas</strong></span>
            </div>
            <div className="ac-trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span>SSL 256-bit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
