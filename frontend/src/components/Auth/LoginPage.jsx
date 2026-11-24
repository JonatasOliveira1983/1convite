import React, { useState } from 'react';
import './LoginPage.css';

// Lista de códigos VIP coringas que liberam 6 meses (180 dias) de Acesso Total
const VALID_VIP_CODES = ['REINO6M', 'VIP2026', '1CONVITE6M', 'CONVITEVIP', 'FAMILIA1C', 'PAZ2026'];

export default function LoginPage({ onLoginSuccess, onExploreGuest }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [vipCode, setVipCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Formatação amigável de telefone brasileiro no input
  const handleContactChange = (e) => {
    let val = e.target.value;
    // Se for numérico, aplica máscara simples
    const numbersOnly = val.replace(/\D/g, '');
    if (numbersOnly.length > 2 && numbersOnly.length <= 11 && !val.includes('@')) {
      if (numbersOnly.length <= 6) {
        val = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
      } else if (numbersOnly.length <= 10) {
        val = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 6)}-${numbersOnly.slice(6)}`;
      } else {
        val = `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 7)}-${numbersOnly.slice(7, 11)}`;
      }
    }
    setContact(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanName = name.trim();
    const cleanContact = contact.trim();
    const cleanVip = vipCode.trim().toUpperCase();

    if (!cleanName) {
      setErrorMsg('Por favor, informe seu nome para personalizar sua jornada.');
      return;
    }

    if (!cleanContact) {
      setErrorMsg('Por favor, informe seu WhatsApp ou E-mail para identificação.');
      return;
    }

    setLoading(true);

    // Validação de Código VIP
    let isVipActivated = false;
    let planTitle = 'Membro Padrão';
    let daysValid = 0;

    if (cleanVip) {
      const isValidVip = VALID_VIP_CODES.includes(cleanVip) || cleanVip.startsWith('VIP') || cleanVip.length >= 5;
      if (isValidVip) {
        isVipActivated = true;
        planTitle = 'Membro Premium - Acesso Total (Voucher 6 Meses)';
        daysValid = 180; // 6 meses
      } else {
        setLoading(false);
        setErrorMsg('Código VIP não reconhecido. Verifique a digitação ou deixe em branco.');
        return;
      }
    }

    // Calcular data de expiração (180 dias)
    const now = new Date();
    const expiryTimestamp = now.getTime() + (daysValid * 24 * 60 * 60 * 1000);

    // Salvar no LocalStorage
    try {
      localStorage.setItem('1convite_logged_in', 'true');
      localStorage.setItem('1convite_user_name', cleanName);
      localStorage.setItem('1convite_user_email', cleanContact);
      localStorage.setItem('1convite_login_timestamp', now.getTime().toString());

      if (isVipActivated) {
        localStorage.setItem('1convite-premium', 'true');
        localStorage.setItem('1convite_premium_plan', planTitle);
        localStorage.setItem('1convite_premium_expiry', expiryTimestamp.toString());
        localStorage.setItem('1convite-voucher-used', cleanVip);
      }
    } catch (err) {
      console.warn('Erro ao gravar no localStorage:', err);
    }

    if (isVipActivated) {
      setSuccessMsg(`Código VIP aceito! 6 Meses de Acesso Total liberados com sucesso.`);
    } else {
      setSuccessMsg(`Bem-vindo, ${cleanName}! Carregando seu devocional...`);
    }

    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess({
          name: cleanName,
          contact: cleanContact,
          isPremium: isVipActivated,
          plan: planTitle,
          expiry: isVipActivated ? expiryTimestamp : null
        });
      }
    }, 1200);
  };

  const handleGuest = () => {
    try {
      localStorage.setItem('1convite_guest_mode', 'true');
    } catch (e) {
      console.warn(e);
    }
    if (onExploreGuest) {
      onExploreGuest();
    }
  };

  return (
    <div className="login-viewport">
      {/* Background Cinematográfico Local */}
      <img 
        src="/assets/auth/login_sunset_bg.jpg" 
        alt="Pôr do Sol no Campo" 
        className="login-bg-media"
      />
      <div className="login-bg-overlay" />

      {/* Card Flutuante de Vidro */}
      <div className="login-card">
        {/* Cabeçalho */}
        <div className="login-header">
          <div className="login-flame-badge">
            <img 
              src="/favicon.png" 
              alt="1Convite" 
              className="login-flame-img"
            />
          </div>
          <h1 className="login-title">
            1Convite <span>Diário</span>
          </h1>
          <p className="login-subtitle">
            Seu momento matinal de quietude, palavra, oração e cuidado com o corpo.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Campo Nome */}
          <div className="login-field">
            <label className="login-label">
              <span>Como podemos te chamar?</span>
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                className="login-input"
                placeholder="Ex: Jonathan Oliveira"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={loading}
              />
            </div>
          </div>

          {/* Campo WhatsApp / E-mail */}
          <div className="login-field">
            <label className="login-label">
              <span>WhatsApp ou E-mail</span>
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <input
                type="text"
                className="login-input"
                placeholder="(DDD) Celular ou seu e-mail"
                value={contact}
                onChange={handleContactChange}
                autoComplete="tel"
                disabled={loading}
              />
            </div>
          </div>

          {/* Campo Especial de Código VIP (6 Meses) */}
          <div className="login-vip-box">
            <div className="login-vip-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="6 3 18 3 22 9 12 22 2 9 6 3" />
              </svg>
              <span>Voucher Promocional Especial</span>
            </div>
            <div className="login-field">
              <label className="login-label">
                <span>Tem um Código VIP?</span>
                <span className="login-label-optional">6 Meses Acesso Total</span>
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="login-input login-input-vip"
                  placeholder="Ex: REINO6M"
                  value={vipCode}
                  onChange={(e) => setVipCode(e.target.value)}
                  maxLength={16}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Mensagens de Feedback */}
          {errorMsg && (
            <div className="login-feedback-msg login-feedback-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="login-feedback-msg login-feedback-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Botão de Entrar */}
          <button 
            type="submit" 
            className="login-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span>Entrando no 1Convite...</span>
            ) : (
              <>
                <span>Acessar o Aplicativo</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>

          {/* Botão de Visitante */}
          <button 
            type="button" 
            className="login-btn-guest"
            onClick={handleGuest}
            disabled={loading}
          >
            <span>Conhecer como Visitante</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </form>

        {/* Rodapé do Card */}
        <div className="login-footer-links">
          <span>1convite.com.br • Compartilhando o Reino</span>
        </div>
      </div>
    </div>
  );
}
