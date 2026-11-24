import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import adminAuthService from '../../services/adminAuthService';

export default function AdminPanel({ onOpenApp, onOpenLanding, onLogout }) {
  const [stats, setStats] = useState(() => adminAuthService.getDashboardStats());
  const [newCode, setNewCode] = useState('');
  const [newMaxUses, setNewMaxUses] = useState('1');
  const [newDays, setNewDays] = useState('180');
  const [newNotes, setNewNotes] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [msgFeedback, setMsgFeedback] = useState('');
  const [accessFilter, setAccessFilter] = useState('todos'); // 'todos' | 'acessaram' | 'nao_acessaram'

  const refreshStats = async () => {
    const data = await adminAuthService.getDashboardStatsAsync();
    if (data) setStats(data);
  };

  useEffect(() => {
    refreshStats();
  }, []);

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
      setMsgFeedback(`Código ${res.voucher.code} criado com sucesso com limite de ${res.voucher.maxUses} cadastros.`);
      setNewCode('');
      setNewNotes('');
      await refreshStats();
      setTimeout(() => setMsgFeedback(''), 4000);
    } else {
      setMsgFeedback(res.message);
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
    const origin = window.location.origin;
    const link = `${origin}?convite=vip&de=Jonatas&vip=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const handleSendWhatsApp = (code, notes = '') => {
    const origin = window.location.origin;
    const link = `${origin}?convite=vip&de=Jonatas&vip=${code}`;
    const saudacao = notes ? `Olá ${notes}! ` : 'Olá! ';
    const msg = `${saudacao}Separei um Vale-Presente Digital do 1Convite para você: 6 meses (180 dias) gratuitos de acesso completo! Abra seu convite aqui: ${link} (Código: ${code})`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="admin-viewport">
      <div className="admin-container">
        {/* Cabeçalho do Painel */}
        <header className="admin-header">
          <div className="admin-header-left">
            <div className="admin-badge-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="admin-header-title">Painel de Controle Mestre</h1>
              <p className="admin-header-subtitle">
                Gestão de Usuários, Vouchers e Acessos VIP • jonatasprojetos2013@gmail.com
              </p>
            </div>
          </div>

          <div className="admin-header-actions">
            {onOpenLanding && (
              <button type="button" className="admin-btn-outline" onClick={onOpenLanding}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span>Página de Vendas</span>
              </button>
            )}
            <button type="button" className="admin-btn-outline" onClick={onOpenApp}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Acessar o App (Modo Admin)</span>
            </button>
            <button type="button" className="admin-btn-danger" onClick={onLogout}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </header>

        {/* Grid de Métricas */}
        <div className="admin-stats-grid">
          {/* Total Usuários */}
          <div className="admin-stat-card" style={{ '--stat-accent': '#38BDF8' }}>
            <div className="admin-stat-header">
              <span className="admin-stat-label">Total de Usuários</span>
              <span className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
            </div>
            <div className="admin-stat-value">{stats.totalUsers}</div>
            <div className="admin-stat-sub">Cadastrados no ecossistema</div>
          </div>

          {/* Usuários Gratuitos */}
          <div className="admin-stat-card" style={{ '--stat-accent': '#94A3B8' }}>
            <div className="admin-stat-header">
              <span className="admin-stat-label">Usuários Gratuitos</span>
              <span className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </div>
            <div className="admin-stat-value">{stats.gratisCount}</div>
            <div className="admin-stat-sub">Modo visitante / degustação</div>
          </div>

          {/* Usuários VIPs / Pagantes */}
          <div className="admin-stat-card" style={{ '--stat-accent': '#FACC15' }}>
            <div className="admin-stat-header">
              <span className="admin-stat-label">Usuários VIPs (6M) / Pagantes</span>
              <span className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
            </div>
            <div className="admin-stat-value">{stats.vipCount}</div>
            <div className="admin-stat-sub">Com Acesso Total ativo</div>
          </div>

          {/* Vouchers Ativos */}
          <div className="admin-stat-card" style={{ '--stat-accent': '#10B981' }}>
            <div className="admin-stat-header">
              <span className="admin-stat-label">Vouchers Ativos / Usos</span>
              <span className="admin-stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
            </div>
            <div className="admin-stat-value">{stats.activeVouchers} <span style={{ fontSize: '1rem', color: '#94A3B8' }}>({stats.totalVoucherUses} resgates)</span></div>
            <div className="admin-stat-sub">Códigos em circulação</div>
          </div>
        </div>

        {/* Gerador de Códigos VIP */}
        <section className="admin-section-card">
          <h2 className="admin-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#F97316">
              <polygon points="6 3 18 3 22 9 12 22 2 9 6 3" />
            </svg>
            <span>Gerar Novo Código de Acesso VIP</span>
          </h2>
          <p className="admin-section-desc">
            Crie um código exclusivo, defina o limite de pessoas que podem se cadastrar com ele e envie o link para amigos, familiares ou membros.
          </p>

          <form onSubmit={handleCreateVoucher} className="admin-voucher-form">
            <div className="admin-form-group">
              <label className="admin-form-label">Nome do Código</label>
              <input 
                type="text" 
                className="admin-form-input" 
                placeholder="Ex: FAMILIA-SILVA" 
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Limite de Cadastros</label>
              <select 
                className="admin-form-select"
                value={newMaxUses}
                onChange={(e) => setNewMaxUses(e.target.value)}
              >
                <option value="1">1 pessoa (Uso individual único)</option>
                <option value="5">5 pessoas</option>
                <option value="10">10 pessoas</option>
                <option value="25">25 pessoas</option>
                <option value="100">100 pessoas</option>
                <option value="999999">Ilimitado</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Período Gratuito</label>
              <select 
                className="admin-form-select"
                value={newDays}
                onChange={(e) => setNewDays(e.target.value)}
              >
                <option value="180">6 Meses (180 dias)</option>
                <option value="365">1 Ano (365 dias)</option>
                <option value="90">3 Meses (90 dias)</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Anotação / Destinatário</label>
              <input 
                type="text" 
                className="admin-form-input" 
                placeholder="Ex: Para meu irmão Marcos" 
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="admin-btn-create">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Criar Código VIP</span>
            </button>
          </form>

          {msgFeedback && (
            <div style={{ marginTop: '12px', fontSize: '0.82rem', color: '#FDBA74', background: 'rgba(249, 115, 22, 0.15)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
              {msgFeedback}
            </div>
          )}
        </section>

        {/* Tabela de Vouchers Cadastrados */}
        <section className="admin-section-card">
          <h2 className="admin-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#10B981">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Códigos VIP Cadastrados ({stats.vouchers.length})</span>
          </h2>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Utilizações</th>
                  <th>Validade</th>
                  <th>Destinatário / Nota</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {stats.vouchers.map((v) => {
                  const maxDisplay = v.maxUses >= 999999 ? 'Ilimitado' : v.maxUses;
                  const percent = v.maxUses >= 999999 ? 100 : Math.min(100, Math.round(((v.usedCount || 0) / v.maxUses) * 100));
                  return (
                    <tr key={v.code}>
                      <td>
                        <span className="admin-code-badge">{v.code}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: '700' }}>
                          {v.usedCount || 0} / {maxDisplay}
                        </div>
                        <div className="admin-progress-bar-bg">
                          <div className="admin-progress-bar-fill" style={{ width: `${percent}%` }} />
                        </div>
                      </td>
                      <td>{v.daysValid} dias (6M)</td>
                      <td style={{ color: '#94A3B8' }}>{v.notes || '—'}</td>
                      <td>
                        <button 
                          onClick={() => handleToggleStatus(v.code)}
                          style={{
                            background: v.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: v.active ? '#34D399' : '#F87171',
                            border: '1px solid currentColor',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {v.active ? 'Ativo' : 'Pausado'}
                        </button>
                      </td>
                      <td>
                        <button 
                          className="admin-btn-copy-link"
                          onClick={() => window.open(`${window.location.origin}?convite=vip&de=Jonatas&vip=${v.code}`, '_blank')}
                          style={{ background: 'rgba(212, 175, 55, 0.16)', color: '#FDE68A', borderColor: 'rgba(212, 175, 55, 0.4)', marginRight: '6px' }}
                          title="Abrir o Gift Voucher desse código"
                        >
                          <span>Ver Voucher</span>
                        </button>
                        <button 
                          className="admin-btn-copy-link"
                          onClick={() => handleSendWhatsApp(v.code, v.notes)}
                          style={{ background: 'rgba(37, 211, 102, 0.16)', color: '#4ADE80', borderColor: 'rgba(37, 211, 102, 0.35)', marginRight: '6px' }}
                        >
                          <span>WhatsApp</span>
                        </button>
                        <button 
                          className="admin-btn-copy-link"
                          onClick={() => handleCopyLink(v.code)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span>{copiedCode === v.code ? 'Copiado!' : 'Copiar Link'}</span>
                        </button>
                        <button 
                          className="admin-btn-del"
                          onClick={() => handleDelete(v.code)}
                          title="Remover Código"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tabela de Usuários e Controle de Acessos */}
        <section className="admin-section-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
            <h2 className="admin-section-title" style={{ margin: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="#38BDF8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <span>Controle de Acessos ({stats.totalUsers})</span>
            </h2>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'todos', label: 'Todos que Acessaram' },
                { id: 'acessaram', label: 'Com Código VIP' },
                { id: 'nao_acessaram', label: `Códigos Não Acessados (${stats.vouchers.filter(v => (v.usedCount || 0) === 0).length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAccessFilter(tab.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: accessFilter === tab.id ? '1px solid #38BDF8' : '1px solid rgba(148, 163, 184, 0.25)',
                    background: accessFilter === tab.id ? 'rgba(56, 189, 248, 0.18)' : 'rgba(15, 23, 42, 0.5)',
                    color: accessFilter === tab.id ? '#38BDF8' : '#94A3B8',
                    fontSize: '0.76rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {accessFilter === 'nao_acessaram' ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Código Criado</th>
                    <th>Destinatário / Nota</th>
                    <th>Validade</th>
                    <th>Status</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.vouchers.filter(v => (v.usedCount || 0) === 0).length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#94A3B8', padding: '18px' }}>
                        Todos os códigos criados já tiveram pelo menos 1 acesso.
                      </td>
                    </tr>
                  ) : (
                    stats.vouchers
                      .filter(v => (v.usedCount || 0) === 0)
                      .map((v) => (
                        <tr key={v.code}>
                          <td><span className="admin-code-badge">{v.code}</span></td>
                          <td style={{ color: '#E2E8F0' }}>{v.notes || 'Sem destinatário informado'}</td>
                          <td>{v.daysValid} dias</td>
                          <td>{v.active ? 'Ativo' : 'Pausado'}</td>
                          <td>
                            <span style={{ color: '#FBBF24', fontWeight: '700', fontSize: '0.78rem' }}>
                              Ainda não acessou (0 / {v.maxUses >= 999999 ? '∞' : v.maxUses})
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Contato (WhatsApp / E-mail)</th>
                    <th>Tipo / Plano</th>
                    <th>Código Usado</th>
                    <th>Acessos</th>
                    <th>Último Acesso</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers
                    .filter((u) => accessFilter === 'todos' || Boolean(u.vipCode))
                    .map((u) => (
                      <tr key={u.id || u.contact}>
                        <td style={{ fontWeight: '700', color: '#FFFFFF' }}>{u.name}</td>
                        <td>{u.contact}</td>
                        <td>
                          <span className={`admin-type-badge admin-type-${u.type}`}>
                            {u.type === 'admin' ? 'Administrador Mestre' : u.type === 'vip' ? 'VIP' : 'Gratuito'}
                          </span>
                        </td>
                        <td>{u.vipCode ? <span className="admin-code-badge" style={{ fontSize: '0.7rem' }}>{u.vipCode}</span> : '—'}</td>
                        <td style={{ fontWeight: '700', color: '#38BDF8' }}>{u.accessCount || 1}x</td>
                        <td style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                          {u.lastLogin ? new Date(u.lastLogin).toLocaleString('pt-BR') : 'Hoje'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
