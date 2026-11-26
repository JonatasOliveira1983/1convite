import React from 'react';

/**
 * BodyWeightCard — Painel de Evolução de Peso Corporal idêntico ao OpenGym (Home).
 * Gráfico em largura total (100% de ponta a ponta), rótulos laterais e área verde neon.
 */
export default function BodyWeightCard({
  pesoAtual = '74.5',
  metaPeso = '72.0',
  historico = [],
  onOpenLogModal,
}) {
  const currentWeight = parseFloat(pesoAtual) || 74.5;
  const targetWeight = parseFloat(metaPeso) || 72.0;
  const diffToGoal = Math.abs(currentWeight - targetWeight).toFixed(1);
  const isLoss = currentWeight > targetWeight;

  // Garante pontos suficientes para uma curva contínua elegante
  let points = [...historico];
  if (points.length === 0) {
    points = [
      { pesoKg: currentWeight + 1.4, label: 'Sem 1' },
      { pesoKg: currentWeight + 1.1, label: 'Sem 2' },
      { pesoKg: currentWeight + 0.7, label: 'Sem 3' },
      { pesoKg: currentWeight + 0.4, label: 'Ontem' },
      { pesoKg: currentWeight, label: 'Hoje' },
    ];
  } else if (points.length === 1) {
    points = [
      { pesoKg: currentWeight + 0.8, label: 'Início' },
      { pesoKg: currentWeight + 0.4, label: 'Ant.' },
      { pesoKg: points[0].pesoKg, label: 'Hoje' },
    ];
  } else {
    points = points.slice(-10);
  }

  const last = parseFloat(points[points.length - 1]?.pesoKg || currentWeight);
  const prev = parseFloat(points[points.length - 2]?.pesoKg || last);
  const deltaNum = last - prev;

  // Eixo Y dinâmico
  const weights = points.map((p) => parseFloat(p.pesoKg) || currentWeight);
  const minW = Math.floor((Math.min(...weights, targetWeight) - 0.5) * 2) / 2;
  const maxW = Math.ceil((Math.max(...weights) + 0.5) * 2) / 2;
  const midW = ((minW + maxW) / 2).toFixed(1);
  const rangeW = Math.max(1, maxW - minW);

  const W = 600;
  const H = 120;
  const padTop = 14;
  const padBottom = 10;

  const coords = points.map((p, idx) => {
    const xPct = points.length === 1 ? 50 : (idx / (points.length - 1)) * 100;
    const x = (xPct / 100) * W;
    const val = parseFloat(p.pesoKg) || currentWeight;
    const yPct = 1 - (val - minW) / rangeW;
    const y = padTop + yPct * (H - padTop - padBottom);
    return { ...p, x, y, xPct, yPct: (y / H) * 100, val };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div
      style={{
        background: 'var(--surface-card, #13161F)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
        padding: '18px 20px 16px',
        marginBottom: '16px',
        boxShadow: 'var(--shadow-card, 0 4px 16px rgba(0, 0, 0, 0.25))',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* CABEÇALHO 100% PORTUGUÊS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #94A3B8)', fontWeight: '600' }}>
            Peso Corporal
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary, #FFFFFF)', letterSpacing: '-0.02em', lineHeight: '1' }}>
              {currentWeight.toFixed(1)}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #94A3B8)', fontWeight: '600' }}>kg</span>

            <span
              style={{
                fontSize: '0.76rem',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                color: deltaNum <= 0 ? '#059669' : '#DC2626',
                background: deltaNum <= 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              {deltaNum <= 0 ? '↓' : '↑'} {Math.abs(deltaNum).toFixed(1)} kg
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#D97706', fontWeight: '700' }}>Meta: {targetWeight.toFixed(1)} kg</span>
            <span>• {diffToGoal} kg para {isLoss ? 'eliminar' : 'alcançar'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenLogModal}
          style={{
            background: 'var(--orange-light, rgba(16, 185, 129, 0.14))',
            border: '1px solid var(--orange, rgba(16, 185, 129, 0.4))',
            color: 'var(--orange, #10B981)',
            borderRadius: '10px',
            padding: '7px 14px',
            fontSize: '0.78rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>+ Registrar</span>
        </button>
      </div>

      {/* ÁREA DO GRÁFICO OCUPANDO 100% DA LARGURA (PONTA A PONTA) */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '8px', width: '100%' }}>
        {/* EIXO Y À ESQUERDA IGUAL OPENGYM */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontSize: '0.68rem',
            color: '#64748B',
            fontWeight: '700',
            padding: '4px 0',
            userSelect: 'none',
            minWidth: '30px',
          }}
        >
          <span>{maxW.toFixed(1)}</span>
          <span>{midW}</span>
          <span>{minW.toFixed(1)}</span>
        </div>

        {/* SVG ESTICADO DE PONTA A PONTA + PONTOS NITIDOS */}
        <div style={{ position: 'relative', flex: 1, height: '130px' }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="neonGreenGradFull" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                <stop offset="65%" stopColor="#10B981" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grade horizontal */}
            <line x1="0" y1={padTop} x2={W} y2={padTop} stroke="var(--border-subtle, rgba(255,255,255,0.06))" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="var(--border-subtle, rgba(255,255,255,0.06))" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1={H - padBottom} x2={W} y2={H - padBottom} stroke="var(--border-subtle, rgba(255,255,255,0.06))" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />

            {/* Área preenchida */}
            <path d={areaPath} fill="url(#neonGreenGradFull)" />

            {/* Linha principal */}
            <path
              d={linePath}
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Marcadores HTML sobrepostos para não distorcerem */}
          {coords.map((c, idx) => {
            const isLast = idx === coords.length - 1;
            return (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: `${c.xPct}%`,
                  top: `${c.yPct}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    width: isLast ? '11px' : '7px',
                    height: isLast ? '11px' : '7px',
                    borderRadius: '50%',
                    background: isLast ? '#34D399' : '#10B981',
                    border: isLast ? '2px solid #FFFFFF' : '1.5px solid #0B0C10',
                    boxShadow: isLast ? '0 0 10px rgba(52, 211, 153, 0.8)' : 'none',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '4px',
                    fontSize: '0.64rem',
                    fontWeight: '800',
                    color: isLast ? '#34D399' : '#94A3B8',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.val.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
