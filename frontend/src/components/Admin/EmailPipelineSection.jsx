import React, { useState, useEffect } from 'react';
import adminAuthService from '../../services/adminAuthService';

const LAUNCH_VOUCHERS_META = [
  {
    code: 'REINO8M',
    defaultNotes: 'Voucher Especial de Lançamento (8 Meses / Plano Reino)',
    defaultDays: 240,
    defaultMaxUses: 100
  },
  {
    code: 'VIP2026',
    defaultNotes: 'Voucher Promocional de Lançamento 2026',
    defaultDays: 180,
    defaultMaxUses: 50
  },
  {
    code: 'FAMILIA1C',
    defaultNotes: 'Acesso Especial para Família',
    defaultDays: 180,
    defaultMaxUses: 10
  }
];

const STATUS_BADGE_MAP = {
  active: { label: 'Ativo no Fluxo', bg: 'rgba(16, 185, 129, 0.16)', color: '#34D399', border: 'rgba(16, 185, 129, 0.35)' },
  ready: { label: 'Pronto p/ Ativar', bg: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: 'rgba(56, 189, 248, 0.35)' },
  seasonal: { label: 'Campanha Sazonal', bg: 'rgba(245, 158, 11, 0.16)', color: '#FBBF24', border: 'rgba(245, 158, 11, 0.35)' }
};

export default function EmailPipelineSection({ vouchers = [], onCopyLink, onSendWhatsApp }) {
  const [pipelineData, setPipelineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedStageId, setSelectedStageId] = useState('cobranca_gerada');
  const [launchVouchersOpen, setLaunchVouchersOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('jonatasprojetos2013@gmail.com');
  const [sendingTest, setSendingTest] = useState(false);
  const [testFeedback, setTestFeedback] = useState(null);

  const loadPipeline = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await adminAuthService.getEmailPipelineAsync();
      setPipelineData(data);
      if (data?.stages?.length && !data.stages.some((s) => s.id === selectedStageId)) {
        setSelectedStageId(data.stages[0].id);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Não foi possível carregar o pipeline de e-mails.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, []);

  const stages = pipelineData?.stages || [];
  const selectedStage = stages.find((s) => s.id === selectedStageId) || stages[0] || null;
  const limits = pipelineData?.resendFreeLimits || { monthlyLimit: 3000, dailyLimit: 100, contactsLimit: 1000 };

  const localPreviewHtml = selectedStage?.previewHtml
    ? selectedStage.previewHtml.replaceAll('https://1convite.com.br/', `${window.location.origin}/`)
    : '';

  const handleSendTest = async (e) => {
    e.preventDefault();
    if (!selectedStage || !testEmail.trim()) return;
    setSendingTest(true);
    setTestFeedback(null);
    try {
      const res = await adminAuthService.sendPipelineTestEmailAsync({
        templateId: selectedStage.id,
        to: testEmail.trim()
      });
      setTestFeedback({
        ok: true,
        text: `E-mail de teste enviado para ${res.to} (ID: ${res.id || 'ok'}). Confira sua caixa de entrada.`
      });
    } catch (err) {
      setTestFeedback({
        ok: false,
        text: err?.message || 'Erro ao enviar e-mail de teste.'
      });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <section className="admin-card" style={{ marginTop: '24px' }}>
      <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>Pipeline de E-mails & Sazonais (Resend)</span>
          </h2>
          <p className="admin-card-sub">
            Clique em qualquer etapa abaixo para inspecionar gatilho, assunto, pré-visualização real e disparar e-mail de teste.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              padding: '5px 10px',
              borderRadius: '999px',
              background: 'rgba(148, 163, 184, 0.12)',
              color: '#CBD5E1',
              border: '1px solid rgba(148, 163, 184, 0.25)'
            }}
          >
            Resend Free: {limits.monthlyLimit.toLocaleString('pt-BR')}/mês • {limits.dailyLimit}/dia
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              padding: '5px 10px',
              borderRadius: '999px',
              background: pipelineData?.resendConfigured ? 'rgba(16, 185, 129, 0.16)' : 'rgba(239, 68, 68, 0.16)',
              color: pipelineData?.resendConfigured ? '#34D399' : '#F87171',
              border: pipelineData?.resendConfigured ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)'
            }}
          >
            {pipelineData?.resendConfigured ? 'Resend Conectado' : 'Resend Pendente'}
          </span>
        </div>
      </div>

      {/* Card Expansível (recolhido por padrão) dos 3 Vouchers de Lançamento */}
      <div
        style={{
          marginBottom: '18px',
          borderRadius: '12px',
          border: '1px solid rgba(251, 191, 36, 0.28)',
          background: 'rgba(251, 191, 36, 0.05)',
          overflow: 'hidden'
        }}
      >
        <button
          type="button"
          onClick={() => setLaunchVouchersOpen((prev) => !prev)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'transparent',
            border: 'none',
            color: '#FDE68A',
            cursor: 'pointer',
            textAlign: 'left',
            fontWeight: '700',
            fontSize: '0.86rem'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12v10H4V12" />
              <path d="M2 7h20v5H2z" />
              <path d="M12 22V7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
            <span>Vouchers de Lançamento Reservados (REINO8M • VIP2026 • FAMILIA1C)</span>
            <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#94A3B8' }}>
              (Opcional — clique para {launchVouchersOpen ? 'recolher' : 'expandir'})
            </span>
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="2.2"
            style={{ transform: launchVouchersOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {launchVouchersOpen && (
          <div
            style={{
              padding: '0 16px 16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px'
            }}
          >
            {LAUNCH_VOUCHERS_META.map((meta) => {
              const dbVoucher = vouchers.find((v) => String(v.code).toUpperCase() === meta.code);
              const used = dbVoucher?.usedCount ?? 0;
              const max = dbVoucher?.maxUses ?? meta.defaultMaxUses;
              const days = dbVoucher?.daysValid ?? meta.defaultDays;
              const notes = dbVoucher?.notes || meta.defaultNotes;
              const isActive = dbVoucher ? dbVoucher.active !== false : false;

              return (
                <div
                  key={meta.code}
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px dashed rgba(251, 191, 36, 0.45)',
                    borderRadius: '10px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ color: '#FBBF24', fontSize: '1rem', letterSpacing: '1px' }}>{meta.code}</strong>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: isActive ? 'rgba(16, 185, 129, 0.16)' : 'rgba(148, 163, 184, 0.15)',
                        color: isActive ? '#34D399' : '#94A3B8'
                      }}
                    >
                      {dbVoucher ? (isActive ? 'Ativo no Banco' : 'Pausado') : 'Referência'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#CBD5E1', marginBottom: '8px', minHeight: '32px' }}>{notes}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '10px' }}>
                    Usos: <strong style={{ color: '#F8FAFC' }}>{used}/{max}</strong> • Validade: <strong style={{ color: '#F8FAFC' }}>{days} dias</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {onCopyLink && (
                      <button
                        type="button"
                        onClick={() => onCopyLink(meta.code)}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(56, 189, 248, 0.35)',
                          background: 'rgba(56, 189, 248, 0.12)',
                          color: '#38BDF8',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Copiar Link
                      </button>
                    )}
                    {onSendWhatsApp && (
                      <button
                        type="button"
                        onClick={() => onSendWhatsApp(meta.code, notes)}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(34, 197, 94, 0.35)',
                          background: 'rgba(34, 197, 94, 0.12)',
                          color: '#4ADE80',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>Carregando pipeline de e-mails...</div>
      ) : errorMsg ? (
        <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', color: '#FCA5A5', fontSize: '0.84rem' }}>
          {errorMsg}
        </div>
      ) : (
        <>
          {/* Fluxo Horizontal de Etapas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            {stages.map((stage) => {
              const isSelected = selectedStage?.id === stage.id;
              const badge = STATUS_BADGE_MAP[stage.status] || STATUS_BADGE_MAP.ready;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    setSelectedStageId(stage.id);
                    setTestFeedback(null);
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid #FBBF24' : '1px solid rgba(148, 163, 184, 0.22)',
                    background: isSelected ? 'rgba(251, 191, 36, 0.1)' : 'rgba(15, 23, 42, 0.65)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`
                      }}
                    >
                      {badge.label}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '700' }}>
                      {stage.stats?.sent || 0} env.
                    </span>
                  </div>
                  <div style={{ color: isSelected ? '#FEF08A' : '#F8FAFC', fontWeight: '700', fontSize: '0.84rem', lineHeight: '1.3' }}>
                    {stage.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detalhes e Preview da Etapa Selecionada */}
          {selectedStage && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                gap: '18px',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.72)',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}
            >
              {/* Coluna Esquerda: Metadados + Teste */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700', marginBottom: '4px' }}>
                    Etapa Selecionada
                  </div>
                  <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.05rem' }}>{selectedStage.title}</h3>
                </div>

                <div style={{ background: 'rgba(2, 6, 23, 0.55)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.14)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700', marginBottom: '2px' }}>GATILHO DE DISPARO</div>
                  <div style={{ fontSize: '0.82rem', color: '#E2E8F0' }}>{selectedStage.trigger}</div>
                </div>

                <div style={{ background: 'rgba(2, 6, 23, 0.55)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.14)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700', marginBottom: '2px' }}>REMETENTE</div>
                  <div style={{ fontSize: '0.82rem', color: '#38BDF8', fontFamily: 'monospace' }}>{selectedStage.sender}</div>
                </div>

                <div style={{ background: 'rgba(2, 6, 23, 0.55)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.14)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700', marginBottom: '2px' }}>ASSUNTO DO E-MAIL</div>
                  <div style={{ fontSize: '0.84rem', color: '#F8FAFC', fontWeight: '600' }}>{selectedStage.subject}</div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '8px 10px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#34D399', fontWeight: '700' }}>ENVIADOS</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFFFFF' }}>{selectedStage.stats?.sent || 0}</div>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', padding: '8px 10px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#F87171', fontWeight: '700' }}>FALHAS</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFFFFF' }}>{selectedStage.stats?.failed || 0}</div>
                  </div>
                </div>

                {/* Formulário de Disparo de Teste */}
                <form onSubmit={handleSendTest} style={{ marginTop: '4px', paddingTop: '12px', borderTop: '1px solid rgba(148, 163, 184, 0.16)' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                    Disparar E-mail de Teste desta Etapa
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                      type="email"
                      required
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="seu@email.com"
                      style={{
                        flex: 1,
                        minWidth: '180px',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(148, 163, 184, 0.28)',
                        background: '#020617',
                        color: '#FFFFFF',
                        fontSize: '0.84rem'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={sendingTest || !pipelineData?.resendConfigured}
                      style={{
                        padding: '9px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: sendingTest ? '#64748B' : '#F59E0B',
                        color: '#09090B',
                        fontWeight: '800',
                        fontSize: '0.82rem',
                        cursor: sendingTest ? 'wait' : 'pointer'
                      }}
                    >
                      {sendingTest ? 'Enviando...' : 'Enviar Teste Agora'}
                    </button>
                  </div>
                  {testFeedback && (
                    <div
                      style={{
                        marginTop: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        background: testFeedback.ok ? 'rgba(16, 185, 129, 0.14)' : 'rgba(239, 68, 68, 0.14)',
                        color: testFeedback.ok ? '#34D399' : '#FCA5A5',
                        border: testFeedback.ok ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      {testFeedback.text}
                    </div>
                  )}
                </form>
              </div>

              {/* Coluna Direita: Pré-visualização HTML Real */}
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700', marginBottom: '6px' }}>
                  Pré-visualização do E-mail (Como o cliente recebe)
                </div>
                <iframe
                  title={selectedStage.title}
                  srcDoc={localPreviewHtml}
                  sandbox="allow-same-origin"
                  style={{
                    width: '100%',
                    height: '460px',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '10px',
                    background: '#09090B'
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
