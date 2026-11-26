import React, { useState, useEffect } from 'react';
import adminAuthService from '../../services/adminAuthService';

export default function SalesFunnelPipelineSection() {
  const [stages, setStages] = useState([]);
  const [selectedId, setSelectedId] = useState('landing');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const data = await adminAuthService.getSalesFunnelAsync();
        if (active && Array.isArray(data?.stages)) {
          setStages(data.stages);
          if (data.stages.length > 0) setSelectedId(data.stages[0].id);
        }
      } catch (err) {
        if (active) setErrorMsg(err?.message || 'Não foi possível carregar o funil de vendas.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const selected = stages.find((s) => s.id === selectedId) || stages[0] || null;
  const totalRevenue = stages.reduce((acc, s) => acc + Number(s.revenueReais || 0), 0);

  return (
    <section className="admin-card" style={{ marginTop: '24px' }}>
      <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span>Pipeline do Funil de Vendas (Order Bump, Upsell &amp; Downsell)</span>
          </h2>
          <p className="admin-card-sub">
            Clique em cada etapa do fluxo para acompanhar ofertas, gatilhos exclusivos do checkout e receita real no Turso.
          </p>
        </div>

        <span
          style={{
            fontSize: '0.74rem',
            fontWeight: '800',
            padding: '5px 12px',
            borderRadius: '999px',
            background: 'rgba(16, 185, 129, 0.16)',
            color: '#34D399',
            border: '1px solid rgba(16, 185, 129, 0.35)'
          }}
        >
          Receita Rastreada: R$ {totalRevenue.toFixed(2).replace('.', ',')}
        </span>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>Carregando pipeline de vendas...</div>
      ) : errorMsg ? (
        <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.12)', color: '#FCA5A5', fontSize: '0.84rem' }}>
          {errorMsg}
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
              marginBottom: '18px'
            }}
          >
            {stages.map((stage) => {
              const isSelected = selected?.id === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setSelectedId(stage.id)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid #34D399' : '1px solid rgba(148, 163, 184, 0.22)',
                    background: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.65)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: 'rgba(56, 189, 248, 0.14)',
                        color: '#38BDF8',
                        border: '1px solid rgba(56, 189, 248, 0.3)'
                      }}
                    >
                      {stage.badge}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: '800' }}>
                      {stage.priceLabel}
                    </span>
                  </div>
                  <div style={{ color: isSelected ? '#A7F3D0' : '#F8FAFC', fontWeight: '700', fontSize: '0.84rem' }}>
                    {stage.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                    {stage.stats?.converted || 0} convertidos • R$ {Number(stage.revenueReais || 0).toFixed(2).replace('.', ',')}
                  </div>
                </button>
              );
            })}
          </div>

          {selected && (
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.72)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '14px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700', marginBottom: '4px' }}>ETAPA DO FUNIL</div>
                <h3 style={{ margin: '0 0 10px', color: '#FFFFFF', fontSize: '1.05rem' }}>{selected.title}</h3>
                <div style={{ background: 'rgba(2, 6, 23, 0.55)', padding: '10px 12px', borderRadius: '8px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: '700', marginBottom: '2px' }}>GATILHO / ONDE APARECE</div>
                  <div style={{ fontSize: '0.82rem', color: '#E2E8F0' }}>{selected.trigger}</div>
                </div>
                <div style={{ background: 'rgba(2, 6, 23, 0.55)', padding: '10px 12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: '700', marginBottom: '2px' }}>O QUE ENTREGA AO CLIENTE</div>
                  <div style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>{selected.offersSummary}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '0.66rem', color: '#38BDF8', fontWeight: '700' }}>INICIADOS</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFFFFF' }}>{selected.stats?.initiated || 0}</div>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '0.66rem', color: '#34D399', fontWeight: '700' }}>PAGOS</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFFFFF' }}>{selected.stats?.converted || 0}</div>
                  </div>
                  <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '0.66rem', color: '#FBBF24', fontWeight: '700' }}>RECEITA</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFFFFF' }}>
                      R$ {Number(selected.revenueReais || 0).toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#94A3B8', background: 'rgba(2, 6, 23, 0.4)', padding: '10px 12px', borderRadius: '8px' }}>
                  Valor configurado nesta etapa: <strong style={{ color: '#34D399' }}>{selected.priceLabel}</strong>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
