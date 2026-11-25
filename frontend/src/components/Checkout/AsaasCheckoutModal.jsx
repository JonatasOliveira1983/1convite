import React, { useState, useEffect, useRef } from 'react';
import './AsaasCheckoutModal.css';

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
  const pollRef = useRef(null);

  const plan = PLANOS_MAP[planId] || PLANOS_MAP.popular;

  useEffect(() => {
    if (!isOpen) {
      if (pollRef.current) clearInterval(pollRef.current);
      setError('');
      setChargeData(null);
      setPaidResult(null);
      setLoading(false);
    }
  }, [isOpen, planId]);

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
    if (cleanDigits && cleanDigits.length !== 11 && cleanDigits.length !== 14) {
      setError('Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.');
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
        <button type="button" className="ac-close" onClick={onClose} aria-label="Fechar checkout">
          ×
        </button>

        <div className="ac-header">
          <span className="ac-kicker">CHECKOUT SEGURO ASAAS</span>
          <h3 className="ac-title">{plan.titulo}</h3>
          <p className="ac-subtitle">
            {plan.valor} • Inclui {plan.convites} código{plan.convites > 1 ? 's' : ''} de convite (180 dias grátis cada)
          </p>
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
                <label>CPF / CNPJ</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                />
              </div>
              <div className="ac-field">
                <label>WhatsApp</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="ac-method-toggle">
              <button
                type="button"
                className={billingType === 'PIX' ? 'active' : ''}
                onClick={() => setBillingType('PIX')}
              >
                PIX Instantâneo
              </button>
              <button
                type="button"
                className={billingType === 'UNDEFINED' ? 'active' : ''}
                onClick={() => setBillingType('UNDEFINED')}
              >
                Cartão / Link Asaas
              </button>
            </div>

            {error && <div className="ac-error">{error}</div>}

            <button type="submit" className="ac-btn-primary" disabled={loading}>
              {loading ? 'Gerando cobrança...' : `Continuar para Pagamento (${plan.valor})`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
