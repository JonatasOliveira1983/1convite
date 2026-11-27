import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import adminAuthService from '../../services/adminAuthService';
import EmailPipelineSection from './EmailPipelineSection';
import SalesFunnelPipelineSection from './SalesFunnelPipelineSection';
import heroMountainsImg from '../../assets/feed/hero_mountains.jpg';
import appLogomarcaDark from '../../assets/logomarca_dark.png';

const ADMIN_TABS = [
  { id: 'visao', label: 'Visão Geral' },
  { id: 'usuarios', label: 'Usuários & Planos' },
  { id: 'vendas', label: 'Vendas Asaas' },
  { id: 'emails', label: 'Fluxo de E-mails' },
  { id: 'vouchers', label: 'Vouchers VIP' },
  { id: 'sistema', label: 'Funil & Saúde' },
];

export default function AdminPanel({ onOpenApp, onOpenLanding, onLogout }) {
  const [activeTab, setActiveTab] = useState('visao');
  const [stats, setStats] = useState(() => adminAuthService.getDashboardStats());
  const [systemHealth, setSystemHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  // Vouchers
  const [newCode, setNewCode] = useState('');
  const [newMaxUses, setNewMaxUses] = useState('1');
  const [newDays, setNewDays] = useState('180');
  const [newNotes, setNewNotes] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [msgFeedback, setMsgFeedback] = useState('');

  // Filtros e Busca
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('todos'); // 'todos' | 'vip' | 'gratis'
  const [salesSearch, setSalesSearch] = useState('');
  const [salesFilter, setSalesFilter] = useState('todos'); // 'todos' | 'pagos' | 'pendentes' | 'falha_email'
  const [actionBusyId, setActionBusyId] = useState('');

  // Campanha de E-mail
  const [campaignTemplate, setCampaignTemplate] = useState('cobranca_gerada');
  const [campaignSegment, setCampaignSegment] = useState('pendentes');
  const [campaignBusy, setCampaignBusy] = useState(false);
  const [campaignResult, setCampaignResult] = useState(null);

  const refreshStats = async () => {
    const data = await adminAuthService.getDashboardStatsAsync();
    if (data) setStats(data);
  };

  const loadHealth = async () => {
    setLoadingHealth(true);
    try {
      const data = await adminAuthService.getSystemHealthAsync();
      setSystemHealth(data);
    } catch {
      setSystemHealth(null);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    refreshStats();
    loadHealth();
  }, []);

  const showToast = (msg) => {
    setMsgFeedback(msg);
    setTimeout(() => setMsgFeedback(''), 4500);
  };

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    const res = await adminAuthService.createVoucherAsync({
      code: newCode,
      maxUses: parseInt(newMaxUses, 10),
      daysValid: parseInt(newDays, 10),
      notes: newNotes
    });
    if (res.success) {
      showToast(`Código ${res.voucher.code} criado com limite de ${res.voucher.maxUses} cadastros.`);
      setNewCode('');
      setNewNotes('');
      await refreshStats();
    } else {
      showToast(res.message);
    }
  };

  const handleToggleStatus = async (code) => {
    await adminAuthService.toggleVoucherStatusAsync(code);
    await refreshStats();
  };

  const handleDelete = async (code) => {
    if (window.confirm(`Deseja realmente remover o código ${code}?`)) {
      await adminAuthService.deleteVoucherAsync(code);
      await refreshStats();
    }
  };

  const handleCopyLink = (code) => {
    const link = `${window.location.origin}?convite=vip&de=Jonatas&vip=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const handleSendWhatsApp = (code, notes = '') => {
    const link = `${window.location.origin}?convite=vip&de=Jonatas&vip=${code}`;
    const saudacao = notes ? `Olá ${notes}! ` : 'Olá! ';
    const msg = `${saudacao}Separei um Vale-Presente Digital do 1Convite para você: 6 meses (180 dias) gratuitos de acesso completo! Abra seu convite aqui: ${link} (Código: ${code})`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleUserPlanAction = async (contact, action, days = 180) => {
    setActionBusyId(contact);
    try {
      await adminAuthService.setUserPlanAsync({ contact, action, days });
      await refreshStats();
      showToast(action === 'vip' ? `Acesso VIP (${days} dias) liberado para ${contact}.` : `Plano alterado para Gratuito em ${contact}.`);
    } catch (err) {
      showToast(err?.message || 'Erro ao alterar plano.');
    } finally {
      setActionBusyId('');
    }
  };

  const handleToggleBlock = async (user) => {
    setActionBusyId(user.contact);
    try {
      const nextBlocked = !user.blocked;
      await adminAuthService.toggleUserBlockAsync({ contact: user.contact, blocked: nextBlocked });
      await refreshStats();
      showToast(nextBlocked ? `Usuário ${user.contact} bloqueado.` : `Usuário ${user.contact} desbloqueado.`);
    } catch (err) {
      showToast(err?.message || 'Erro ao bloquear usuário.');
    } finally {
      setActionBusyId('');
    }
  };

  const handleChangePassword = async (user) => {
    const nextPass = window.prompt(`Nova senha para ${user.name} (${user.contact}):`, user.password || '');
    if (!nextPass || !nextPass.trim()) return;
    setActionBusyId(user.contact);
    try {
      await adminAuthService.setUserPasswordAsync({ contact: user.contact, newPassword: nextPass.trim() });
      await refreshStats();
      showToast(`Senha de ${user.contact} atualizada!`);
    } catch (err) {
      showToast(err?.message || 'Erro ao alterar senha.');
    } finally {
      setActionBusyId('');
    }
  };

  const handleToggleModule = async (user, modKey) => {
    const current = Array.isArray(user.entitlements) ? user.entitlements : [];
    const next = current.includes(modKey)
      ? current.filter((k) => k !== modKey)
      : [...current, modKey];
    setActionBusyId(user.contact);
    try {
      await adminAuthService.setUserModulesAsync({ contact: user.contact, entitlements: next });
      await refreshStats();
      showToast(`Módulos de ${user.contact} atualizados.`);
    } catch (err) {
      showToast(err?.message || 'Erro ao atualizar módulos.');
    } finally {
      setActionBusyId('');
    }
  };

  const handleGiftInvites = async (user) => {
    const raw = window.prompt(`Quantos Convites VIP (180 dias) deseja enviar para ${user.name} (${user.contact})?`, '1');
    const qty = parseInt(raw || '0', 10);
    if (!qty || qty < 1) return;
    setActionBusyId(user.contact);
    try {
      const res = await adminAuthService.giftUserInvitesAsync({ contact: user.contact, quantity: qty });
      await refreshStats();
      showToast(`${res.created?.length || qty} convite(s) adicionado(s) à conta de ${user.contact}!`);
    } catch (err) {
      showToast(err?.message || 'Erro ao gerar convites.');
    } finally {
      setActionBusyId('');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Excluir permanentemente o usuário ${user.name} (${user.contact})?`)) return;
    setActionBusyId(user.contact);
    try {
      await adminAuthService.deleteUserAsync(user.contact);
      await refreshStats();
      showToast(`Usuário ${user.contact} excluído.`);
    } catch (err) {
      showToast(err?.message || 'Erro ao excluir usuário.');
    } finally {
      setActionBusyId('');
    }
  };

  const handleCopyCredentials = (user) => {
    const info = `Acesso 1Convite\nLink: https://1convite.com.br/app\nLogin: ${user.contact}\nSenha: ${user.password || '(sem senha definida)'}`;
    navigator.clipboard?.writeText(info).catch(() => {});
    showToast(`Credenciais de ${user.contact} copiadas!`);
  };

  const handleResetTestData = async (scope) => {
    const labels = {
      vendas: 'TODAS as vendas/pagamentos registrados no painel',
      usuarios: 'TODOS os usuários e vouchers de teste (mantendo apenas Admin e REINO6M/VIP2026/FAMILIA1C)',
      tudo: 'TODAS as vendas, usuários e vouchers de teste (mantendo apenas Admin e códigos base)',
    };
    if (!window.confirm(`ATENÇÃO: Deseja realmente apagar ${labels[scope]}? Esta ação não pode ser desfeita.`)) return;
    setActionBusyId(`reset_${scope}`);
    try {
      await adminAuthService.resetTestDataAsync(scope);
      await refreshStats();
      showToast('Dados de teste limpos com sucesso!');
    } catch (err) {
      showToast(err?.message || 'Erro ao limpar dados.');
    } finally {
      setActionBusyId('');
    }
  };

  const downloadCsv = (filename, headers, rows) => {
    const csvLines = [
      headers.join(';'),
      ...rows.map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(';')),
    ];
    const blob = new Blob(['\uFEFF' + csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfirmPaymentManual = async (paymentId) => {
    if (!window.confirm('Confirmar pagamento manualmente e liberar acesso VIP + e-mail ao cliente?')) return;
    setActionBusyId(paymentId);
    try {
      await adminAuthService.confirmPaymentManualAsync(paymentId);
      await refreshStats();
      showToast('Pagamento confirmado manualmente e acesso VIP liberado!');
    } catch (err) {
      showToast(err?.message || 'Erro ao confirmar pagamento.');
    } finally {
      setActionBusyId('');
    }
  };

  const handleResendPaymentEmail = async (paymentId) => {
    setActionBusyId(paymentId);
    try {
      const res = await adminAuthService.resendPaymentEmailAsync(paymentId);
      await refreshStats();
      showToast(res.message || 'E-mail reenviado com sucesso!');
    } catch (err) {
      showToast(err?.message || 'Falha ao reenviar e-mail.');
    } finally {
      setActionBusyId('');
    }
  };

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    if (!window.confirm('Deseja disparar esta campanha de e-mail para todos os usuários do segmento selecionado?')) return;
    setCampaignBusy(true);
    setCampaignResult(null);
    try {
      const res = await adminAuthService.sendEmailCampaignAsync({
        templateId: campaignTemplate,
        segment: campaignSegment,
      });
      setCampaignResult({ ok: true, text: res.message });
    } catch (err) {
      setCampaignResult({ ok: false, text: err?.message || 'Erro ao disparar campanha.' });
    } finally {
      setCampaignBusy(false);
    }
  };

  const filteredUsers = (stats.recentUsers || []).filter((u) => {
    const matchFilter = userFilter === 'todos' || u.type === userFilter;
    const q = userSearch.trim().toLowerCase();
    const matchSearch = !q || (u.name || '').toLowerCase().includes(q) || (u.contact || '').toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const filteredPayments = (stats.recentPayments || []).filter((p) => {
    const isPaid = ['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH', 'PAID'].includes(String(p.status || '').toUpperCase());
    const matchFilter =
      salesFilter === 'todos' ||
      (salesFilter === 'pagos' && isPaid) ||
      (salesFilter === 'pendentes' && !isPaid) ||
      (salesFilter === 'falha_email' && isPaid && !p.emailSent);
    const q = salesSearch.trim().toLowerCase();
    const matchSearch = !q || (p.customerName || '').toLowerCase().includes(q) || (p.customerEmail || '').toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const receitaConfirmada = Number(stats.totalRevenueReais || 0);

  return (
    <div className="admin-viewport">
      <div className="admin-container">
        {/* BANNER HERO COM BRANDING DO SISTEMA */}
        <header
          className="admin-hero-banner"
          style={{
            backgroundImage: `linear-gradient(125deg, rgba(10, 14, 23, 0.92) 0%, rgba(16, 24, 39, 0.78) 55%, rgba(16, 185, 129, 0.25) 100%), url(${heroMountainsImg})`,
          }}
        >
          <div className="admin-hero-left">
            <div className="admin-hero-brand-row">
              <img src={appLogomarcaDark} alt="1Convite" className="admin-hero-logo" />
              <span className="admin-hero-pill">Painel Mestre</span>
            </div>
            <h1 className="admin-hero-title">Centro de Controle do Sistema</h1>
            <p className="admin-hero-subtitle">
              Gerencie usuários, vendas Asaas, envios no Resend, códigos VIP e saúde das integrações em tempo real.
            </p>
          </div>

          <div className="admin-header-actions">
            <button type="button" className="admin-btn-hero-outline" onClick={refreshStats}>
              Atualizar Dados
            </button>
            {onOpenLanding && (
              <button type="button" className="admin-btn-hero-outline" onClick={onOpenLanding}>
                Página de Vendas
              </button>
            )}
            <button type="button" className="admin-btn-hero-primary" onClick={onOpenApp}>
              Acessar o App (Admin)
            </button>
            <button type="button" className="admin-btn-hero-danger" onClick={onLogout}>
              Sair
            </button>
          </div>
        </header>

        {msgFeedback && (
          <div className="admin-toast-banner">{msgFeedback}</div>
        )}

        {/* NAVEGAÇÃO POR ABAS LIMPAS (UNSLOP) */}
        <nav className="admin-tabs-bar" aria-label="Navegação Administrativa">
          {ADMIN_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`admin-tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* ABA 1: VISÃO GERAL */}
        {activeTab === 'visao' && (
          <div className="admin-tab-content">
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span className="admin-stat-label">Total de Usuários</span>
                <div className="admin-stat-value">{stats.totalUsers}</div>
                <div className="admin-stat-sub">{stats.gratisCount} gratuitos • {stats.vipCount} VIPs</div>
              </div>

              <div className="admin-stat-card">
                <span className="admin-stat-label">Receita Confirmada</span>
                <div className="admin-stat-value" style={{ color: '#10B981' }}>
                  R$ {receitaConfirmada.toFixed(2).replace('.', ',')}
                </div>
                <div className="admin-stat-sub">{stats.pendingPaymentsCount || 0} pagamento(s) aguardando Pix/Boleto</div>
              </div>

              <div className="admin-stat-card">
                <span className="admin-stat-label">Vouchers Ativos</span>
                <div className="admin-stat-value">{stats.activeVouchers}</div>
                <div className="admin-stat-sub">{stats.totalVoucherUses} resgates efetuados</div>
              </div>

              <div className="admin-stat-card">
                <span className="admin-stat-label">Integrações</span>
                <div className="admin-stat-value" style={{ fontSize: '1.1rem', marginTop: '6px' }}>
                  {systemHealth?.database?.ok ? 'Turso Online' : 'Verificando...'}
                </div>
                <div className="admin-stat-sub">
                  Asaas: {systemHealth?.asaas?.configured ? (systemHealth.asaas.sandbox ? 'Sandbox' : 'Produção') : 'Inativo'} • Resend: {systemHealth?.resend?.configured ? 'Ativo' : 'Inativo'}
                </div>
              </div>
            </div>

            <div className="admin-overview-grid">
              <section className="admin-section">
                <div className="admin-section-header">
                  <h2>Últimos Cadastros</h2>
                  <button type="button" className="admin-link-btn" onClick={() => setActiveTab('usuarios')}>
                    Gerenciar todos →
                  </button>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Contato</th>
                        <th>Plano</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats.recentUsers || []).slice(0, 6).map((u) => (
                        <tr key={u.id || u.contact}>
                          <td className="admin-cell-strong">{u.name}</td>
                          <td>{u.contact}</td>
                          <td>
                            <span className={`admin-type-badge admin-type-${u.type}`}>
                              {u.type === 'admin' ? 'Admin' : u.type === 'vip' ? 'VIP' : 'Gratuito'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(!stats.recentUsers || stats.recentUsers.length === 0) && (
                        <tr><td colSpan="3" className="admin-empty-cell">Nenhum usuário cadastrado ainda.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="admin-section">
                <div className="admin-section-header">
                  <h2>Últimas Vendas Asaas</h2>
                  <button type="button" className="admin-link-btn" onClick={() => setActiveTab('vendas')}>
                    Abrir financeiro →
                  </button>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Valor</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats.recentPayments || []).slice(0, 6).map((p) => {
                        const isPaid = ['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH', 'PAID'].includes(String(p.status || '').toUpperCase());
                        return (
                          <tr key={p.paymentId}>
                            <td className="admin-cell-strong">{p.customerName}</td>
                            <td>R$ {Number(p.valueReais || 0).toFixed(2)}</td>
                            <td>
                              <span className={`admin-status-pill ${isPaid ? 'paid' : 'pending'}`}>
                                {isPaid ? 'Pago' : p.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {(!stats.recentPayments || stats.recentPayments.length === 0) && (
                        <tr><td colSpan="3" className="admin-empty-cell">Nenhuma venda registrada ainda.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ABA 2: USUÁRIOS & PLANOS */}
        {activeTab === 'usuarios' && (
          <section className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2>Gestão de Usuários & Liberação Manual</h2>
                <p className="admin-section-sub">Busque clientes e libere ou remova o acesso VIP instantaneamente.</p>
              </div>
              <div className="admin-controls-row">
                <input
                  type="text"
                  className="admin-input admin-search-input"
                  placeholder="Buscar por nome ou e-mail..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <div className="admin-filter-group">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'vip', label: 'VIPs' },
                    { id: 'gratis', label: 'Gratuitos' },
                    { id: 'bloqueados', label: 'Bloqueados' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`admin-filter-chip ${userFilter === f.id ? 'active' : ''}`}
                      onClick={() => setUserFilter(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="admin-mini-btn info"
                  onClick={() =>
                    downloadCsv(
                      'clientes-1convite.csv',
                      ['Nome', 'Contato', 'Senha', 'Tipo', 'Plano', 'Bloqueado', 'Modulos', 'Acessos'],
                      (stats.recentUsers || []).map((u) => [
                        u.name,
                        u.contact,
                        u.password || '',
                        u.type,
                        u.plan || '',
                        u.blocked ? 'Sim' : 'Nao',
                        (u.entitlements || []).join(', '),
                        u.accessCount || 1,
                      ])
                    )
                  }
                >
                  Exportar CSV
                </button>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Contato &amp; Senha</th>
                    <th>Plano &amp; Módulos</th>
                    <th>Acessos</th>
                    <th>Ações Diretas</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.recentUsers || []).filter((u) => {
                    const q = userSearch.trim().toLowerCase();
                    const matchQ = !q || String(u.name || '').toLowerCase().includes(q) || String(u.contact || '').toLowerCase().includes(q);
                    if (!matchQ) return false;
                    if (userFilter === 'bloqueados') return Boolean(u.blocked);
                    if (userFilter === 'vip') return u.type === 'vip' || u.type === 'admin';
                    if (userFilter === 'gratis') return u.type === 'gratis';
                    return true;
                  }).map((u) => {
                    const ents = Array.isArray(u.entitlements) ? u.entitlements : [];
                    return (
                    <tr key={u.id || u.contact} style={u.blocked ? { opacity: 0.6 } : undefined}>
                      <td className="admin-cell-strong">
                        {u.name}
                        {u.blocked && (
                          <div style={{ fontSize: '0.68rem', color: '#f87171', fontWeight: 700 }}>SUSPENSO</div>
                        )}
                      </td>
                      <td>
                        <div>{u.contact}</div>
                        {u.type !== 'admin' && (
                          <div style={{ fontSize: '0.74rem', color: '#fbbf24', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>Senha: <code>{u.password || '—'}</code></span>
                            <button type="button" className="admin-mini-btn info" style={{ padding: '2px 6px', fontSize: '0.66rem' }} onClick={() => handleCopyCredentials(u)}>
                              Copiar
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`admin-type-badge admin-type-${u.type}`}>
                          {u.type === 'admin' ? 'Admin Mestre' : u.type === 'vip' ? (u.plan || 'VIP') : 'Gratuito'}
                        </span>
                        {u.type !== 'admin' && (
                          <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                            {[
                              { key: 'ebooks', label: 'E-books' },
                              { key: 'mulher_virtuosa', label: 'Mulher' },
                              { key: 'pregador', label: 'Pregador' },
                            ].map((m) => {
                              const active = ents.includes(m.key);
                              return (
                                <button
                                  key={m.key}
                                  type="button"
                                  disabled={actionBusyId === u.contact}
                                  onClick={() => handleToggleModule(u, m.key)}
                                  style={{
                                    fontSize: '0.65rem',
                                    padding: '2px 7px',
                                    borderRadius: '999px',
                                    cursor: 'pointer',
                                    border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.16)',
                                    background: active ? 'rgba(16,185,129,0.2)' : 'transparent',
                                    color: active ? '#34d399' : '#9ca3af',
                                    fontWeight: 700,
                                  }}
                                >
                                  {active ? '✓ ' : '+ '}{m.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      <td>{u.accessCount || 1}x</td>
                      <td>
                        {u.type === 'admin' ? (
                          <span className="admin-muted-text">Protegido</span>
                        ) : (
                          <div className="admin-actions-inline" style={{ flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              disabled={actionBusyId === u.contact}
                              className="admin-mini-btn success"
                              onClick={() => handleUserPlanAction(u.contact, 'vip', 180)}
                            >
                              Liberar 6M
                            </button>
                            <button
                              type="button"
                              disabled={actionBusyId === u.contact}
                              className="admin-mini-btn info"
                              onClick={() => handleUserPlanAction(u.contact, 'vip', 365)}
                            >
                              Liberar 1 Ano
                            </button>
                            <button
                              type="button"
                              disabled={actionBusyId === u.contact}
                              className="admin-mini-btn info"
                              onClick={() => handleChangePassword(u)}
                            >
                              Senha
                            </button>
                            <button
                              type="button"
                              disabled={actionBusyId === u.contact}
                              className="admin-mini-btn success"
                              onClick={() => handleGiftInvites(u)}
                            >
                              +Convites
                            </button>
                            <button
                              type="button"
                              disabled={actionBusyId === u.contact}
                              className={`admin-mini-btn ${u.blocked ? 'success' : 'danger'}`}
                              onClick={() => handleToggleBlock(u)}
                            >
                              {u.blocked ? 'Desbloquear' : 'Bloquear'}
                            </button>
                            {u.type === 'vip' && (
                              <button
                                type="button"
                                disabled={actionBusyId === u.contact}
                                className="admin-mini-btn danger"
                                onClick={() => handleUserPlanAction(u.contact, 'gratis')}
                              >
                                Remover VIP
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={actionBusyId === u.contact}
                              className="admin-mini-btn danger"
                              onClick={() => handleDeleteUser(u)}
                            >
                              Excluir
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan="5" className="admin-empty-cell">Nenhum usuário encontrado para este filtro.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ABA 3: VENDAS ASAAS */}
        {activeTab === 'vendas' && (
          <section className="admin-section">
            <div className="admin-section-header">
              <div>
                <h2>Vendas Asaas & Controle Financeiro</h2>
                <p className="admin-section-sub">Confirme pedidos manuais (comprovante no WhatsApp) e reenvie credenciais por e-mail.</p>
              </div>
              <div className="admin-controls-row">
                <input
                  type="text"
                  className="admin-input admin-search-input"
                  placeholder="Buscar cliente..."
                  value={salesSearch}
                  onChange={(e) => setSalesSearch(e.target.value)}
                />
                <div className="admin-filter-group">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'pagos', label: 'Pagos' },
                    { id: 'pendentes', label: 'Pendentes' },
                    { id: 'falha_email', label: 'Falha E-mail' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`admin-filter-chip ${salesFilter === f.id ? 'active' : ''}`}
                      onClick={() => setSalesFilter(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="admin-mini-btn info"
                  onClick={() =>
                    downloadCsv(
                      'vendas-asaas-1convite.csv',
                      ['PedidoID', 'Cliente', 'Email', 'Plano/Oferta', 'Valor', 'Metodo', 'Status', 'EmailEnviado', 'Data'],
                      (stats.recentPayments || []).map((p) => [
                        p.paymentId,
                        p.customerName,
                        p.customerEmail,
                        p.planId,
                        Number(p.valueReais || 0).toFixed(2),
                        p.billingType,
                        p.status,
                        p.emailSent ? 'Sim' : 'Nao',
                        p.createdAt || '',
                      ])
                    )
                  }
                >
                  Exportar CSV
                </button>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Plano / Valor</th>
                    <th>Pagamento</th>
                    <th>E-mail Resend</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => {
                    const isPaid = ['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH', 'PAID'].includes(String(p.status || '').toUpperCase());
                    return (
                      <tr key={p.paymentId}>
                        <td>
                          <div className="admin-cell-strong">{p.customerName}</div>
                          <div className="admin-muted-text">{p.customerEmail}</div>
                        </td>
                        <td>
                          <div className="admin-cell-strong" style={{ textTransform: 'capitalize' }}>{p.planId}</div>
                          <div className="admin-muted-text">R$ {Number(p.valueReais || 0).toFixed(2)} • {p.billingType}</div>
                        </td>
                        <td>
                          <span className={`admin-status-pill ${isPaid ? 'paid' : 'pending'}`}>
                            {isPaid ? 'Pago & VIP Ativo' : p.status}
                          </span>
                        </td>
                        <td>
                          {p.emailSent ? (
                            <span style={{ color: '#10B981', fontWeight: 600, fontSize: '0.8rem' }}>Enviado</span>
                          ) : (
                            <div>
                              <span style={{ color: '#EF4444', fontWeight: 600, fontSize: '0.8rem' }}>Não enviado</span>
                              {p.emailError && <div className="admin-muted-text">{p.emailError}</div>}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="admin-actions-inline">
                            {!isPaid && (
                              <button
                                type="button"
                                disabled={actionBusyId === p.paymentId}
                                className="admin-mini-btn success"
                                onClick={() => handleConfirmPaymentManual(p.paymentId)}
                              >
                                Liberar Manual
                              </button>
                            )}
                            {isPaid && (
                              <button
                                type="button"
                                disabled={actionBusyId === p.paymentId}
                                className="admin-mini-btn info"
                                onClick={() => handleResendPaymentEmail(p.paymentId)}
                              >
                                Reenviar E-mail
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredPayments.length === 0 && (
                    <tr><td colSpan="5" className="admin-empty-cell">Nenhuma venda encontrada.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ABA 4: FLUXO DE E-MAILS & CAMPANHAS */}
        {activeTab === 'emails' && (
          <div>
            <section className="admin-section" style={{ marginBottom: '20px' }}>
              <div className="admin-section-header">
                <div>
                  <h2>Disparo de Campanha & Recuperação</h2>
                  <p className="admin-section-sub">Envie e-mails em lote (até 50 por disparo) para recuperar pendentes ou engajar usuários.</p>
                </div>
              </div>
              <form onSubmit={handleSendCampaign} className="admin-campaign-form">
                <div className="admin-input-group">
                  <label>Template do E-mail</label>
                  <select className="admin-input" value={campaignTemplate} onChange={(e) => setCampaignTemplate(e.target.value)}>
                    <option value="cobranca_gerada">Recuperação de Cobrança / Pix Pendente</option>
                    <option value="boas_vindas_vip">Boas-Vindas VIP</option>
                    <option value="campanha_natal">Campanha Especial de Natal</option>
                    <option value="campanha_ano_novo">Campanha Especial de Ano Novo</option>
                  </select>
                </div>
                <div className="admin-input-group">
                  <label>Público-Alvo</label>
                  <select className="admin-input" value={campaignSegment} onChange={(e) => setCampaignSegment(e.target.value)}>
                    <option value="pendentes">Pagamentos Pendentes (Recuperação)</option>
                    <option value="gratuitos">Usuários Gratuitos (Upgrade)</option>
                    <option value="vips">Todos os Usuários VIPs</option>
                  </select>
                </div>
                <button type="submit" disabled={campaignBusy} className="admin-btn-primary">
                  {campaignBusy ? 'Disparando...' : 'Disparar Campanha'}
                </button>
              </form>
              {campaignResult && (
                <div className={`admin-campaign-feedback ${campaignResult.ok ? 'ok' : 'err'}`}>
                  {campaignResult.text}
                </div>
              )}
            </section>

            <EmailPipelineSection
              vouchers={stats.vouchers || []}
              onCopyLink={handleCopyLink}
              onSendWhatsApp={handleSendWhatsApp}
            />
          </div>
        )}

        {/* ABA 5: VOUCHERS VIP */}
        {activeTab === 'vouchers' && (
          <div>
            <section className="admin-section" style={{ marginBottom: '20px' }}>
              <div className="admin-section-header">
                <div>
                  <h2>Gerar Novo Código de Acesso VIP</h2>
                  <p className="admin-section-sub">Crie códigos exclusivos para presentear amigos, famílias ou membros da igreja.</p>
                </div>
              </div>
              <form onSubmit={handleCreateVoucher} className="admin-form-grid">
                <div className="admin-input-group">
                  <label>Nome do Código</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Ex: FAMILIA-SILVA"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>
                <div className="admin-input-group">
                  <label>Limite de Cadastros</label>
                  <select className="admin-input" value={newMaxUses} onChange={(e) => setNewMaxUses(e.target.value)}>
                    <option value="1">1 pessoa (Uso individual)</option>
                    <option value="2">2 pessoas</option>
                    <option value="5">5 pessoas</option>
                    <option value="10">10 pessoas</option>
                    <option value="50">50 pessoas</option>
                    <option value="999999">Ilimitado</option>
                  </select>
                </div>
                <div className="admin-input-group">
                  <label>Período Gratuito</label>
                  <select className="admin-input" value={newDays} onChange={(e) => setNewDays(e.target.value)}>
                    <option value="30">1 Mês (30 dias)</option>
                    <option value="90">3 Meses (90 dias)</option>
                    <option value="180">6 Meses (180 dias)</option>
                    <option value="365">1 Ano (365 dias)</option>
                  </select>
                </div>
                <div className="admin-input-group">
                  <label>Anotação / Destinatário</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Ex: Para meu irmão Marcos"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                  />
                </div>
                <button type="submit" className="admin-btn-primary" style={{ gridColumn: '1 / -1' }}>
                  + Criar Código VIP
                </button>
              </form>
            </section>

            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Códigos VIP Cadastrados ({stats.vouchers.length})</h2>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Utilizações</th>
                      <th>Validade</th>
                      <th>Nota</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.vouchers.map((v) => {
                      const isUnlimited = v.maxUses >= 999999;
                      const pct = isUnlimited ? 0 : Math.min(100, Math.round(((v.usedCount || 0) / v.maxUses) * 100));
                      return (
                        <tr key={v.code}>
                          <td><span className="admin-code-badge">{v.code}</span></td>
                          <td>
                            <div className="admin-cell-strong">{v.usedCount} / {isUnlimited ? '∞' : v.maxUses}</div>
                            {!isUnlimited && (
                              <div className="admin-progress-track">
                                <div className="admin-progress-fill" style={{ width: `${pct}%` }} />
                              </div>
                            )}
                          </td>
                          <td>{v.daysValid} dias</td>
                          <td>{v.notes || '—'}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(v.code)}
                              className={`admin-status-pill ${v.active ? 'paid' : 'pending'}`}
                              style={{ cursor: 'pointer', border: 'none' }}
                            >
                              {v.active ? 'Ativo' : 'Pausado'}
                            </button>
                          </td>
                          <td>
                            <div className="admin-actions-inline">
                              <button type="button" className="admin-mini-btn success" onClick={() => handleSendWhatsApp(v.code, v.notes)}>
                                WhatsApp
                              </button>
                              <button type="button" className="admin-mini-btn info" onClick={() => handleCopyLink(v.code)}>
                                {copiedCode === v.code ? 'Copiado!' : 'Copiar Link'}
                              </button>
                              <button type="button" className="admin-mini-btn danger" onClick={() => handleDelete(v.code)}>
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ABA 6: FUNIL DE VENDAS & SAÚDE DO SISTEMA */}
        {activeTab === 'sistema' && (
          <div>
            <section className="admin-section" style={{ marginBottom: '20px' }}>
              <div className="admin-section-header">
                <div>
                  <h2>Saúde das Integrações & Servidor</h2>
                  <p className="admin-section-sub">Diagnóstico em tempo real das chaves e serviços conectados ao backend.</p>
                </div>
                <button type="button" className="admin-mini-btn info" onClick={loadHealth} disabled={loadingHealth}>
                  {loadingHealth ? 'Verificando...' : 'Testar Conexões'}
                </button>
              </div>
              {systemHealth && (
                <div className="admin-health-grid">
                  <div className="admin-health-item">
                    <span className="admin-health-label">Banco de Dados</span>
                    <strong className={systemHealth.database?.ok ? 'ok' : 'err'}>
                      {systemHealth.database?.ok ? `Conectado (${systemHealth.database.provider})` : 'Desconectado'}
                    </strong>
                  </div>
                  <div className="admin-health-item">
                    <span className="admin-health-label">Gateway Asaas</span>
                    <strong className={systemHealth.asaas?.configured ? 'ok' : 'err'}>
                      {systemHealth.asaas?.configured ? (systemHealth.asaas.sandbox ? 'Ativo (Modo Sandbox)' : 'Ativo (Produção Real)') : 'Não configurado'}
                    </strong>
                  </div>
                  <div className="admin-health-item">
                    <span className="admin-health-label">E-mails (Resend)</span>
                    <strong className={systemHealth.resend?.configured ? 'ok' : 'err'}>
                      {systemHealth.resend?.configured ? `Ativo (${systemHealth.resend.from})` : 'RESEND_API_KEY ausente'}
                    </strong>
                  </div>
                  <div className="admin-health-item">
                    <span className="admin-health-label">Inteligência Artificial (OpenAI)</span>
                    <strong className={systemHealth.openai?.configured ? 'ok' : 'warn'}>
                      {systemHealth.openai?.configured ? 'Chave Configurada' : 'Modo CPU Local (Laya)'}
                    </strong>
                  </div>
                </div>
              )}
            </section>

            <SalesFunnelPipelineSection />

            <section className="admin-section" style={{ marginTop: '20px', borderColor: 'rgba(239, 68, 68, 0.35)' }}>
              <div className="admin-section-header">
                <div>
                  <h2 style={{ color: '#fca5a5' }}>Limpeza &amp; Reset de Dados de Teste (Pré-Lançamento)</h2>
                  <p className="admin-section-sub">
                    Zere vendas ou cadastros de teste antes de iniciar as vendas reais. Sua conta Administrador e os códigos base (REINO6M, VIP2026, FAMILIA1C) são sempre preservados.
                  </p>
                </div>
              </div>
              <div className="admin-actions-inline" style={{ flexWrap: 'wrap', gap: '10px' }}>
                <button
                  type="button"
                  className="admin-mini-btn danger"
                  disabled={actionBusyId === 'reset_vendas'}
                  onClick={() => handleResetTestData('vendas')}
                >
                  {actionBusyId === 'reset_vendas' ? 'Limpando...' : 'Limpar Vendas de Teste'}
                </button>
                <button
                  type="button"
                  className="admin-mini-btn danger"
                  disabled={actionBusyId === 'reset_usuarios'}
                  onClick={() => handleResetTestData('usuarios')}
                >
                  {actionBusyId === 'reset_usuarios' ? 'Limpando...' : 'Limpar Usuários & Vouchers de Teste'}
                </button>
                <button
                  type="button"
                  className="admin-mini-btn danger"
                  disabled={actionBusyId === 'reset_tudo'}
                  onClick={() => handleResetTestData('tudo')}
                >
                  {actionBusyId === 'reset_tudo' ? 'Zerando...' : 'Zerar Tudo para Lançamento'}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
