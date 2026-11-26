import React, { useMemo } from 'react';

/**
 * AnnualHeatmap — Mapa de Calor de Consistência Anual/Semestral (estilo GitHub / OpenGym).
 * Lê o histórico de treinos salvos e exibe os dias treinados nos últimos 5 meses (22 semanas).
 */
export default function AnnualHeatmap({ historico = [] }) {
  const weeksCount = 22; // 22 semanas = ~154 dias (ótimo para mobile & desktop)

  const { grid, totalAtivos } = useMemo(() => {
    const countsByDay = {};
    historico.forEach((h) => {
      // Tenta extrair YYYY-MM-DD de createdAt ou data
      const rawDate = h.createdAt || h.criadoEm || h.created_at;
      let key = '';
      if (rawDate) {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          key = d.toISOString().slice(0, 10);
        }
      }
      if (!key) {
        // Fallback: hoje
        key = new Date().toISOString().slice(0, 10);
      }
      countsByDay[key] = (countsByDay[key] || 0) + 1;
    });

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Dom..6=Sab
    const totalDays = weeksCount * 7;
    const startOffset = totalDays - 1 - (6 - dayOfWeek);

    const cols = [];
    let ativos = 0;
    for (let w = 0; w < weeksCount; w++) {
      const col = [];
      for (let d = 0; d < 7; d++) {
        const offset = startOffset - (w * 7 + d);
        const cellDate = new Date(today);
        cellDate.setDate(today.getDate() - offset);
        const key = cellDate.toISOString().slice(0, 10);
        const count = countsByDay[key] || 0;
        if (count > 0) ativos++;
        col.push({
          key,
          count,
          isFuture: cellDate > today,
          label: cellDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        });
      }
      cols.push(col);
    }

    return { grid: cols.reverse(), totalAtivos: ativos };
  }, [historico]);

  const getColor = (count, isFuture) => {
    if (isFuture) return 'transparent';
    if (count === 0) return 'var(--surface-subtle, rgba(255, 255, 255, 0.06))';
    if (count === 1) return '#059669';
    if (count === 2) return '#10B981';
    return '#34D399';
  };

  return (
    <div className="treino-rotina-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h4 style={{ margin: 0, color: 'var(--text-primary, #FFF)', fontSize: '0.96rem' }}>Mapa de Calor • Consistência</h4>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #94A3B8)' }}>
            {totalAtivos} dia(s) com treino concluído nos últimos 5 meses
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.66rem', color: 'var(--text-muted, #64748B)' }}>
          <span>Menos</span>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--surface-subtle, rgba(255,255,255,0.06))', border: '1px solid var(--border-subtle)' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#059669' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10B981' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#34D399' }} />
          <span>Mais</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
        {grid.map((col, wIdx) => (
          <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
            {col.map((cell) => (
              <div
                key={cell.key}
                title={`${cell.label}: ${cell.count} treino(s)`}
                style={{
                  width: '13px',
                  height: '13px',
                  borderRadius: '3px',
                  background: getColor(cell.count, cell.isFuture),
                  border: cell.count > 0 ? '1px solid rgba(52, 211, 153, 0.4)' : 'none',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
