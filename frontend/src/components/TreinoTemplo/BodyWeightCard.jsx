import React from 'react';

/**
 * BodyWeightCard — Painel de Evolução de Peso Corporal idêntico ao OpenGym (Home).
 * Exibe o peso atual em destaque, variação recente, meta de perda/ganho e gráfico de área verde neon.
 */
export default function BodyWeightCard({
  pesoAtual = '78.5',
  metaPeso = '75.0',
  historico = [],
  onOpenLogModal,
}) {
  const currentWeight = parseFloat(pesoAtual) || 78.5;
  const targetWeight = parseFloat(metaPeso) || 75.0;
  const diffToGoal = Math.abs(currentWeight - targetWeight).toFixed(1);
  const isLoss = currentWeight > targetWeight;

  // Monta histórico garantindo pelo menos 5 pontos para a curva verde neon
  let points = [...historico];
  if (points.length === 0) {
    points = [
      { pesoKg: currentWeight + 1.2, label: '3 sem' },
      { pesoKg: currentWeight + 0.8, label: '2 sem' },
      { pesoKg: currentWeight + 0.5, label: 'Sem pass.' },
      { pesoKg: currentWeight + 0.2, label: 'Ontem' },
      { pesoKg: currentWeight, label: 'Hoje' },
    ];
  } else if (points.length === 1) {
    points = [
      { pesoKg: currentWeight + 0.8, label: 'Início' },
      { pesoKg: currentWeight + 0.4, label: 'Ant.' },
      { pesoKg: points[0].pesoKg, label: 'Hoje' },
    ];
  } else {
    points = points.slice(-8);
  }

  // Variação recente (último vs penúltimo)
  const last = points[points.length - 1]?.pesoKg || currentWeight;
  const prev = points[points.length - 2]?.pesoKg || last;
  const delta = (last - prev).toFixed(1);
  const deltaNum = parseFloat(delta);

  // Dimensões do SVG
  const W = 360;
  const H = 110;
  const paddingX = 16;
  const paddingY = 16;

  const weights = points.map((p) => parseFloat(p.pesoKg) || currentWeight);
  const minW = Math.min(...weights, targetWeight) - 0.8;
  const maxW = Math.max(...weights) + 0.8;
  const rangeW = Math.max(1, maxW - minW);

  const coords = points.map((p, idx) => {
    const x = paddingX + (idx * (W - paddingX * 2)) / Math.max(1, points.length - 1);
    const val = parseFloat(p.pesoKg) || currentWeight;
    const y = H - paddingY - ((val - minW) / rangeW) * (H - paddingY * 2);
    return { ...p, x, y, val };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${H} L ${coords[0].x.toFixed(1)} ${H} Z`;

  return (
    <div
      style={{
        background: '#13161F',
        borderRadius: '18px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px 18px 12px',
        marginBottom: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* CABEÇALHO COM TÍTULO E BOTÃO LOG */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Body Weight • Evolução de Peso
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: '1' }}>
              {currentWeight.toFixed(1)}
            </span>
            <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: '700' }}>kg</span>

            {/* VARIAÇÃO */}
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                color: deltaNum <= 0 ? '#34D399' : '#F87171',
                background: deltaNum <= 0 ? 'rgba(52, 211, 153, 0.12)' : 'rgba(248, 113, 113, 0.12)',
                padding: '2px 6px',
                borderRadius: '6px',
              }}
            >
              {deltaNum <= 0 ? '↓' : '↑'} {Math.abs(deltaNum).toFixed(1)} kg
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#FBBF24', fontWeight: '800' }}>• Meta: {targetWeight} kg</span>
            <span>• {diffToGoal} kg para {isLoss ? 'eliminar' : 'alcançar'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenLogModal}
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34D399',
            borderRadius: '10px',
            padding: '6px 12px',
            fontSize: '0.78rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s ease',
          }}
        >
          <span>+ Log</span>
        </button>
      </div>

      {/* GRÁFICO VERDE NEON ESTILO OPENGYM */}
      <div style={{ width: '100%', height: '110px', marginTop: '4px' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="neonGreenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Linhas guias horizontais sutis */}
          <line x1="0" y1={paddingY} x2={W} y2={paddingY} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="0" y1={H - paddingY} x2={W} y2={H - paddingY} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

          {/* Área preenchida */}
          <path d={areaPath} fill="url(#neonGreenGrad)" />

          {/* Linha neon principal */}
          <path d={linePath} fill="none" stroke="#10B981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

          {/* Pontos com valor */}
          {coords.map((c, idx) => {
            const isLast = idx === coords.length - 1;
            return (
              <g key={idx}>
                {isLast && (
                  <circle cx={c.x} cy={c.y} r="8" fill="#10B981" fillOpacity="0.25" className="animate-pulse" />
                )}
                <circle cx={c.x} cy={c.y} r={isLast ? '4.5' : '3'} fill={isLast ? '#34D399' : '#10B981'} stroke="#FFFFFF" strokeWidth={isLast ? '2' : '1'} />
                <text x={c.x} y={c.y - 8} textAnchor="middle" fill={isLast ? '#34D399' : '#94A3B8'} fontSize="8" fontWeight="800">
                  {c.val.toFixed(1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
