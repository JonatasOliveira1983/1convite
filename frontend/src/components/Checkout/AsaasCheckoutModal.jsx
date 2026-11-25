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
    valor: 'R$ 67/ano',
    convites: 1,
  },
  popular: {
    id: 'popular',
    titulo: 'Plano Mais Popular — Edificação',
    valor: 'R$ 97/ano',
    convites: 3,
  },
  avancado: {
    id: 'avancado',
    titulo: 'Plano Avançado — Reino',
    valor: 'R$ 147/ano',
    convites: 5,
  },
};

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

export default function AsaasCheckoutModal({ isOpen, planId, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [billingType, setBillingType] = useState('PIX');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chargeData, setChargeData] = useState(null);
  const [paidResult, setPaidResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(899);
  const pollRef = useRef(null);

  const plan = PLANOS_MAP[planId] || PLANOS_MAP.popular;

  useEffect(() => {
    if (!isOpen) {
      if (pollRef.current) clearInterval(pollRef.current);
      setError('');
      setChargeData(null);
      setPaidResult(null);
      setLoading(false);
      setSecondsLeft(899);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, planId]);

  const countdownLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  useEffect(() => {
    if (!chargeData?.paymentId || paidResult) return;
    const apiBase = getApiBase();

    const checkStatus = async () => {
      try {
        const res = await fetch(`${apiBase}/pagamentos/status/${encodeURIComponent(chargeData.paymentId)}`);
        const data = await res.json();
        if (data?.paid) {
          if (pollRef.current) clearInterval(pollRef.current);
          setPaidResult(data);
          if (onSuccess) onSuccess(data);
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
          planId: plan.id,
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
        setPaidResult(data);
        if (onSuccess) onSuccess(data);
      } else {
        setError('Pagamento ainda aguardando confirmação. Se acabou de pagar via PIX, aguarde alguns segundos.');
      }
    } catch {
      setError('Erro ao verificar status do pagamento.');
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Condição reservada por <strong>{countdownLabel}</strong> • 5 E-books PDF + Convites inclusos</span>
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
          <h3 className="ac-title">{plan.titulo}</h3>
          <div className="ac-order-summary">
            <span><strong>{plan.valor}</strong> • 365 dias VIP + {plan.convites} convite{plan.convites > 1 ? 's' : ''} (180 dias) + 5 E-books PDF</span>
          </div>
        </div>

        {paidResult ? (
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

            {error && <div className="ac-error">{error}</div>}

            <button type="submit" className="ac-btn-primary ac-btn-lock" disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>{loading ? 'Gerando cobrança segura...' : `Pagar com Segurança • ${plan.valor}`}</span>
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
