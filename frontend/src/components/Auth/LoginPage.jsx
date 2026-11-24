import React, { useState } from 'react';
import './LoginPage.css';
import adminAuthService from '../../services/adminAuthService';

export default function LoginPage({ onLoginSuccess, onExploreGuest }) {
  const [mode, setMode] = useState('login'); // 'login' ou 'register'
  
  // Estados do formulário
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [vipCode, setVipCode] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Formatação de telefone / WhatsApp
  const handleContactChange = (e) => {
    let val = e.target.value;
    const nums = val.replace(/\D/g, '');
    if (nums.length > 2 && nums.length <= 11 && !val.includes('@')) {
      if (nums.length <= 6) {
        val = `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
      } else if (nums.length <= 10) {
        val = `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
      } else {
        val = `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`;
      }
    }
    setContact(val);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!contact.trim()) {
      setErrorMsg('Informe seu e-mail ou WhatsApp cadastrado.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Informe sua senha de acesso.');
      return;
    }

    setLoading(true);

    const res = adminAuthService.loginUser({
      contact: contact.trim(),
      password: password.trim()
    });

    if (!res.success) {
      setLoading(false);
      setErrorMsg(res.message || 'Dados inválidos. Verifique as informações.');
      return;
    }

    if (res.isAdmin) {
      setSuccessMsg('Acesso Mestre Concedido! Entrando no Painel Administrativo...');
    } else {
      setSuccessMsg(`Bem-vindo de volta, ${res.user.name}!`);
    }

    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess({
          name: res.user.name,
          contact: res.user.contact,
          isAdmin: res.isAdmin,
          isPremium: res.isVip || res.isAdmin,
          plan: res.user.plan || 'Membro Convidado',
          expiry: res.user.expiryTimestamp || null
        });
      }
    }, 900);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Informe seu nome para personalizar seu devocional.');
      return;
    }
    if (!contact.trim()) {
      setErrorMsg('Informe seu WhatsApp ou E-mail.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Defina uma senha simples para seu acesso.');
      return;
    }

    setLoading(true);

    const res = adminAuthService.registerUser({
      name: name.trim(),
      contact: contact.trim(),
      password: password.trim(),
      vipCode: vipCode.trim()
    });

    if (!res.success) {
      setLoading(false);
      setErrorMsg(res.message || 'Não foi possível concluir o cadastro.');
      return;
    }

    if (res.isAdmin) {
      setSuccessMsg('Conta de Administrador reconhecida! Entrando...');
    } else if (res.isVip) {
      setSuccessMsg(`Voucher aceito! 6 Meses de Acesso Total liberados com sucesso.`);
    } else {
      setSuccessMsg(`Cadastro realizado com sucesso, ${res.user.name}!`);
    }

    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess({
          name: res.user.name,
          contact: res.user.contact,
          isAdmin: res.isAdmin,
          isPremium: res.isVip || res.isAdmin,
          plan: res.user.plan,
          expiry: res.expiryTimestamp
        });
      }
    }, 1100);
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
      {/* Background com Movimento Ken Burns Contínuo */}
      <img 
        src="/assets/auth/login_sunset_bg.jpg" 
        alt="Pôr do Sol no Campo" 
        className="login-bg-media"
      />
      <div className="login-bg-overlay" />

      {/* Card Flutuante Translúcido em Vidro */}
      <div className="login-card">
        {/* Cabeçalho Minimalista com Frase de Impacto */}
        <div className="login-header">
          <div className="login-flame-icon-wrap">
            <img 
              src="/favicon.png" 
              alt="Chama 1Convite" 
              className="login-flame-icon-img" 
            />
          </div>
          <h1 className="login-impact-phrase">
            Seu momento matinal com <span>Deus</span>
          </h1>
          <p className="login-sub-phrase">
            Palavra, quietude, oração e cuidado com o corpo.
          </p>
        </div>

        {/* Abas Alternadoras (Entrar vs Cadastrar) */}
        <div className="login-tab-switcher">
          <button 
            type="button"
            className={`login-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Entrar
          </button>
          <button 
            type="button"
            className={`login-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Cadastrar-se
          </button>
        </div>

        {/* Formulário: MODO LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="login-field">
              <label className="login-label">WhatsApp ou E-mail</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="login-input-clean"
                  placeholder="Seu e-mail ou WhatsApp"
                  value={contact}
                  onChange={handleContactChange}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Senha</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  className="login-input-clean"
                  placeholder="Sua senha de acesso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="login-alert-box login-alert-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="login-alert-box login-alert-success">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{successMsg}</span>
              </div>
            )}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <span>Acessando...</span>
              ) : (
                <>
                  <span>Entrar no 1Convite</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

            <button type="button" className="login-guest-btn" onClick={handleGuest} disabled={loading}>
              <span>Explorar como Visitante</span>
            </button>
          </form>
        )}

        {/* Formulário: MODO CADASTRO */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="login-form">
            <div className="login-field">
              <label className="login-label">Seu Nome</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="login-input-clean"
                  placeholder="Ex: Jonathan Oliveira"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">WhatsApp ou E-mail</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="login-input-clean"
                  placeholder="(DDD) Celular ou E-mail"
                  value={contact}
                  onChange={handleContactChange}
                  autoComplete="tel"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Crie uma Senha</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  className="login-input-clean"
                  placeholder="Defina sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Código VIP Opcional no Cadastro */}
            <div className="login-vip-container">
              <div className="login-field">
                <label className="login-label">
                  <span>Tem um Código VIP?</span>
                  <span className="login-label-highlight">6 Meses Grátis</span>
                </label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="6 3 18 3 22 9 12 22 2 9 6 3" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="login-input-clean login-input-vip"
                    placeholder="Ex: REINO6M"
                    value={vipCode}
                    onChange={(e) => setVipCode(e.target.value)}
                    maxLength={16}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="login-alert-box login-alert-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="login-alert-box login-alert-success">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{successMsg}</span>
              </div>
            )}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <span>Criando Conta...</span>
              ) : (
                <>
                  <span>Concluir Cadastro & Entrar</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

            <button type="button" className="login-guest-btn" onClick={handleGuest} disabled={loading}>
              <span>Explorar como Visitante</span>
            </button>
          </form>
        )}

        <div className="login-brand-footer">
          1convite.com.br • Compartilhando o Reino
        </div>
      </div>
    </div>
  );
}
