import React, { useState } from 'react';
import './LoginPage.css';
import adminAuthService from '../../services/adminAuthService';
import appLogoWhite from '../../assets/logomarca_dark.png';
import loginSunsetBg from '../../assets/auth/login_sunset_bg.jpg';

export default function LoginPage({ onLoginSuccess, onExploreGuest, onBackToLanding }) {
  const pendingVip = (() => {
    try {
      const urlVip = new URLSearchParams(window.location.search).get('vip');
      const storedVip = localStorage.getItem('1convite_pending_vip_code');
      return (urlVip || storedVip || '').trim().toUpperCase();
    } catch {
      return '';
    }
  })();

  // viewMode: 'initial' (estilo C6 Bank), 'login' (gaveta login), 'register' (gaveta cadastro)
  const [viewMode, setViewMode] = useState(pendingVip ? 'register' : 'initial');
  
  // Dados do formulário
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [vipCode, setVipCode] = useState(pendingVip);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Nome salvo previamente ou convidado padrão
  const savedName = localStorage.getItem('1convite_user_name') || 'Convidado';

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

  const handleLoginSubmit = async (e) => {
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

    const res = await adminAuthService.loginUserAsync({
      contact: contact.trim(),
      password: password.trim()
    });

    if (!res.success) {
      setLoading(false);
      setErrorMsg(res.message || 'Dados inválidos. Verifique as informações.');
      return;
    }

    if (res.isAdmin) {
      setSuccessMsg('Acesso Mestre Reconhecido! Entrando no Painel Administrativo...');
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
          expiry: res.user.expiryTimestamp || null,
          entitlements: Array.isArray(res.user.entitlements) ? res.user.entitlements : [],
          avatar: res.user.avatar || null,
          genero: res.user.genero || 'homem'
        });
      }
    }, 800);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Informe seu nome para personalizar sua experiência.');
      return;
    }
    if (!contact.trim()) {
      setErrorMsg('Informe seu WhatsApp ou E-mail.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Defina uma senha simples de acesso.');
      return;
    }

    setLoading(true);

    const res = await adminAuthService.registerUserAsync({
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
      setSuccessMsg(`Voucher aceito! 6 Meses de Acesso Total liberados.`);
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
    }, 900);
  };

  const handlePillarClick = (pillarName) => {
    try {
      localStorage.setItem('1convite_guest_mode', 'true');
    } catch (e) {
      console.warn(e);
    }
    if (onExploreGuest) {
      onExploreGuest(pillarName);
    }
  };

  return (
    <div className="c6-login-viewport">
      {/* Background com Movimento Ken Burns das Crianças no Pôr do Sol */}
      <img 
        src={loginSunsetBg} 
        alt="Crianças no Campo Florido ao Pôr do Sol" 
        className="c6-bg-media"
        loading="eager"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/assets/auth/login_sunset_bg.jpg';
        }}
      />
      <div className="c6-bg-overlay" />

      {/* ── TOPO: LOGOMARCA OFICIAL ── */}
      <header className="c6-top-header">
        {onBackToLanding && (
          <button
            type="button"
            className="c6-back-landing-btn"
            onClick={onBackToLanding}
          >
            ← Página Oficial
          </button>
        )}
        <img 
          src={appLogoWhite} 
          alt="1Convite" 
          className="c6-top-logo"
        />
        <div className="c6-top-tagline">
          Compartilhando o Reino
        </div>
      </header>

      {/* ── CENTRO: PALCO LIVRE PARA A CENA ── */}
      <div className="c6-center-stage" />

      {/* ── BASE: BOTTOM SHEET ESTILO C6 BANK ── */}
      <div className="c6-bottom-sheet">
        {/* MODO INICIAL (IDÊNTICO AO C6 BANK) */}
        {viewMode === 'initial' && (
          <>
            {/* Linha 1: Saudação */}
            <div className="c6-greeting-row">
              <button 
                type="button" 
                className="c6-greeting-btn"
                onClick={() => setViewMode('login')}
              >
                <span>Olá, {savedName}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="c6-greeting-chevron">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            {/* Linha 2: Os 3 Pilares com Divisórias Verticais Finas */}
            <div className="c6-pillars-row">
              <button 
                type="button" 
                className="c6-pillar-item"
                onClick={() => handlePillarClick('cafe')}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="c6-pillar-icon">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" />
                  <line x1="10" y1="1" x2="10" y2="4" />
                  <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
                <span className="c6-pillar-label">Café Diário</span>
              </button>

              <div className="c6-pillar-divider" />

              <button 
                type="button" 
                className="c6-pillar-item"
                onClick={() => handlePillarClick('oracao')}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="c6-pillar-icon">
                  <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
                <span className="c6-pillar-label">Orar Junto</span>
              </button>

              <div className="c6-pillar-divider" />

              <button 
                type="button" 
                className="c6-pillar-item"
                onClick={() => handlePillarClick('templo')}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="c6-pillar-icon">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="c6-pillar-label">Cuidar do Templo</span>
              </button>
            </div>

            {/* Linha 3: Botão Principal Dourado/Amarelo */}
            <button 
              type="button" 
              className="c6-btn-primary"
              onClick={() => { setViewMode('login'); setErrorMsg(''); }}
            >
              <span>Acessar conta</span>
            </button>

            {/* Linha 4: Botão Secundário Noturno */}
            <button 
              type="button" 
              className="c6-btn-secondary"
              onClick={() => { setViewMode('register'); setErrorMsg(''); }}
            >
              <span>Criar nova conta ou Ativar VIP</span>
            </button>
          </>
        )}

        {/* GAVETA: ACESSAR CONTA (LOGIN) */}
        {viewMode === 'login' && (
          <div className="c6-expanded-drawer">
            <div className="c6-drawer-header">
              <h2 className="c6-drawer-title">Acessar minha conta</h2>
              <button 
                type="button" 
                className="c6-drawer-back-btn"
                onClick={() => setViewMode('initial')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>Voltar</span>
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="c6-drawer-form">
              <div className="c6-drawer-field">
                <label className="c6-drawer-label">WhatsApp ou E-mail</label>
                <input
                  type="text"
                  className="c6-drawer-input"
                  placeholder="Seu WhatsApp ou e-mail"
                  value={contact}
                  onChange={handleContactChange}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>

              <div className="c6-drawer-field">
                <label className="c6-drawer-label">Senha</label>
                <input
                  type="password"
                  className="c6-drawer-input"
                  placeholder="Sua senha de acesso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              {errorMsg && (
                <div className="c6-alert-msg c6-alert-error">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="c6-alert-msg c6-alert-success">
                  {successMsg}
                </div>
              )}

              <button type="submit" className="c6-btn-primary" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar no 1Convite'}
              </button>
            </form>
          </div>
        )}

        {/* GAVETA: CRIAR CONTA OU ATIVAR VIP (CADASTRO) */}
        {viewMode === 'register' && (
          <div className="c6-expanded-drawer">
            <div className="c6-drawer-header">
              <h2 className="c6-drawer-title">Criar nova conta</h2>
              <button 
                type="button" 
                className="c6-drawer-back-btn"
                onClick={() => setViewMode('initial')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>Voltar</span>
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="c6-drawer-form">
              <div className="c6-drawer-field">
                <label className="c6-drawer-label">Seu Nome</label>
                <input
                  type="text"
                  className="c6-drawer-input"
                  placeholder="Ex: Jonathan Oliveira"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="c6-drawer-field">
                <label className="c6-drawer-label">WhatsApp ou E-mail</label>
                <input
                  type="text"
                  className="c6-drawer-input"
                  placeholder="(DDD) Celular ou E-mail"
                  value={contact}
                  onChange={handleContactChange}
                  disabled={loading}
                />
              </div>

              <div className="c6-drawer-field">
                <label className="c6-drawer-label">Defina uma Senha</label>
                <input
                  type="password"
                  className="c6-drawer-input"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="c6-vip-input-wrap">
                <div className="c6-drawer-field">
                  <label className="c6-drawer-label">
                    <span>Código VIP (Opcional)</span>
                    <span style={{ color: '#FACC15', fontWeight: '800' }}>6 Meses Grátis</span>
                  </label>
                  <input
                    type="text"
                    className="c6-drawer-input"
                    placeholder="Ex: REINO6M"
                    style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', color: '#FEF08A' }}
                    value={vipCode}
                    onChange={(e) => setVipCode(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="c6-alert-msg c6-alert-error">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="c6-alert-msg c6-alert-success">
                  {successMsg}
                </div>
              )}

              <button type="submit" className="c6-btn-primary" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Concluir Cadastro & Entrar'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
