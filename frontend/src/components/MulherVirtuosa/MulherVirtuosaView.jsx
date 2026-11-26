import React, { useState, useEffect } from 'react';
import './MulherVirtuosaView.css';
import { MULHER_VIRTUOSA_DEVOTIONALS } from '../../data/mulherVirtuosaDevotionals';

const API_BASE = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001/api/v1'
    : 'https://oneconvite-api.onrender.com/api/v1'
);

const PLANO_LEITURA_MULHER = [
  { id: 'pl-1', dia: 'Dia 1', titulo: 'A Mulher Virtuosa', leitura: 'Provérbios 31:10-31', foco: 'Valor, diligência e temor ao Senhor' },
  { id: 'pl-2', dia: 'Dia 2', titulo: 'Lealdade e Fé', leitura: 'Rute 1 e 2', foco: 'Fidelidade familiar e provisão de Deus' },
  { id: 'pl-3', dia: 'Dia 3', titulo: 'Coragem no Propósito', leitura: 'Ester 4 e 5', foco: 'Posicionamento espiritual e intercessão' },
  { id: 'pl-4', dia: 'Dia 4', titulo: 'Oração de Ana', leitura: '1 Samuel 1 e 2:1-10', foco: 'Entrega de sonhos no altar' },
  { id: 'pl-5', dia: 'Dia 5', titulo: 'Paz que Guarda a Mente', leitura: 'Filipenses 4:4-13', foco: 'Combate à ansiedade e gratidão' },
  { id: 'pl-6', dia: 'Dia 6', titulo: 'A Escolha de Maria', leitura: 'Lucas 10:38-42', foco: 'Priorizar a presença de Jesus acima da correria' },
  { id: 'pl-7', dia: 'Dia 7', titulo: 'Salmo da Proteção do Lar', leitura: 'Salmos 91 e 127', foco: 'Cobertura espiritual sobre a família' },
];

export default function MulherVirtuosaView({ onBack, userContact = 'convidado@1convite.com.br' }) {
  const [activeSubTab, setActiveSubTab] = useState('planner'); // 'planner' | 'devocional' | 'oracoes' | 'leitura' | 'proverbios'
  const [devocionalIdx, setDevocionalIdx] = useState(() => {
    const dayOfMonth = new Date().getDate();
    return (dayOfMonth - 1) % MULHER_VIRTUOSA_DEVOTIONALS.length;
  });

  // Dados sincronizados com o Turso
  const [cloudItems, setCloudItems] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('08:00');
  const [newPrayerTitle, setNewPrayerTitle] = useState('');
  const [newPrayerText, setNewPrayerText] = useState('');
  const [showNewPrayerForm, setShowNewPrayerForm] = useState(false);

  const [leituraConcluida, setLeituraConcluida] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mv_leitura_done') || '[]'); } catch { return []; }
  });

  const [habits, setHabits] = useState(() => {
    try {
      const s = localStorage.getItem('mulher-virtuosa-habits');
      return s ? JSON.parse(s) : {
        devocional: true,
        oracaoFilhos: false,
        louvorMatinal: true,
        leituraProverbios: false,
        aguaSaude: false,
      };
    } catch {
      return { devocional: true, oracaoFilhos: false, louvorMatinal: true, leituraProverbios: false, aguaSaude: false };
    }
  });

  const carregarNuvem = async () => {
    try {
      const r = await fetch(`${API_BASE}/mulher-virtuosa/state?contact=${encodeURIComponent(userContact)}`);
      const d = await r.json();
      if (d?.success && Array.isArray(d.items)) {
        setCloudItems(d.items);
      }
    } catch {}
  };

  useEffect(() => {
    carregarNuvem();
  }, [userContact]);

  const tarefas = cloudItems.filter((i) => i.tipo === 'tarefa');
  const prayers = cloudItems.filter((i) => i.tipo === 'oracao');

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await fetch(`${API_BASE}/mulher-virtuosa/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: userContact,
          tipo: 'tarefa',
          titulo: newTaskTitle.trim(),
          horario: newTaskTime,
        }),
      });
      setNewTaskTitle('');
      await carregarNuvem();
    } catch {}
  };

  const handleAddPrayer = async (e) => {
    e.preventDefault();
    if (!newPrayerTitle.trim()) return;
    try {
      await fetch(`${API_BASE}/mulher-virtuosa/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: userContact,
          tipo: 'oracao',
          titulo: newPrayerTitle.trim(),
          conteudo: newPrayerText.trim(),
        }),
      });
      setNewPrayerTitle('');
      setNewPrayerText('');
      setShowNewPrayerForm(false);
      await carregarNuvem();
    } catch {}
  };

  const handleToggleItem = async (id) => {
    try {
      await fetch(`${API_BASE}/mulher-virtuosa/item/${id}/toggle`, { method: 'POST' });
      await carregarNuvem();
    } catch {}
  };

  const handleDeleteItem = async (id) => {
    try {
      await fetch(`${API_BASE}/mulher-virtuosa/item/${id}`, { method: 'DELETE' });
      await carregarNuvem();
    } catch {}
  };

  const toggleHabit = (key) => {
    const updated = { ...habits, [key]: !habits[key] };
    setHabits(updated);
    try {
      localStorage.setItem('mulher-virtuosa-habits', JSON.stringify(updated));
    } catch {}
  };

  const toggleLeitura = (id) => {
    setLeituraConcluida((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem('mv_leitura_done', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const devAtual = MULHER_VIRTUOSA_DEVOTIONALS[devocionalIdx] || MULHER_VIRTUOSA_DEVOTIONALS[0];

  return (
    <div className="mv-container animate-fade-in">
      <header className="mv-header">
        <button onClick={onBack} className="mv-back-btn" aria-label="Voltar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="mv-header-info">
          <div className="mv-pill">
            <span className="mv-pill-dot" />
            <span>Espaço Mulher Virtuosa</span>
          </div>
          <h1 className="mv-title">Planner &amp; Edificação</h1>
        </div>

        <div style={{ width: 40 }} />
      </header>

      {/* 5 Sub-abas Completas */}
      <div className="mv-tabs-nav" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'planner', label: `Planner (${tarefas.length})` },
          { id: 'devocional', label: 'Devocional Diário' },
          { id: 'oracoes', label: `Orações (${prayers.length})` },
          { id: 'leitura', label: 'Plano de Leitura' },
          { id: 'proverbios', label: 'Hábitos & Pv 31' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id)}
            className={`mv-tab-btn ${activeSubTab === t.id ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ABA 1: PLANNER DIÁRIO COM HORÁRIOS (SALVO NO TURSO) */}
      {activeSubTab === 'planner' && (
        <div className="mv-tab-content animate-fade-in">
          <div className="mv-quote-card">
            <p className="mv-quote-verse">
              "Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos."
            </p>
            <span className="mv-quote-ref">Provérbios 16:3</span>
          </div>

          <form onSubmit={handleAddTask} className="mv-new-prayer-box" style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px', color: 'var(--text-primary, #FFF)', fontSize: '0.92rem' }}>Organizar Meu Dia</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="mv-input"
                style={{ width: '110px' }}
              />
              <input
                type="text"
                placeholder="Ex: Devocional, Organizar casa, Reunião..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="mv-input"
                style={{ flex: 1, minWidth: '160px' }}
                required
              />
              <button type="submit" className="mv-save-btn">
                + Adicionar
              </button>
            </div>
          </form>

          <div className="mv-habits-list">
            {tarefas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#94A3B8', fontSize: '0.84rem' }}>
                Nenhuma tarefa cadastrada ainda para hoje. Adicione seu primeiro compromisso acima!
              </div>
            ) : (
              tarefas.map((t) => (
                <div key={t.id} className={`mv-habit-item ${t.concluido ? 'done' : ''}`} style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, cursor: 'pointer' }} onClick={() => handleToggleItem(t.id)}>
                    <div className={`mv-habit-check ${t.concluido ? 'checked' : ''}`}>
                      {t.concluido ? '✓' : ''}
                    </div>
                    <div>
                      {t.horario && <span style={{ fontSize: '0.7rem', color: '#F472B6', fontWeight: '800', marginRight: '6px' }}>{t.horario}</span>}
                      <span className="mv-habit-label">{t.titulo}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(t.id)}
                    style={{ background: 'transparent', border: 'none', color: '#F87171', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '700' }}
                  >
                    Excluir
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ABA 2: DEVOCIONAL FEMININO DIÁRIO (15 DEVOCIONAIS DO ZIP) */}
      {activeSubTab === 'devocional' && devAtual && (
        <div className="mv-tab-content animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => setDevocionalIdx((prev) => (prev - 1 + MULHER_VIRTUOSA_DEVOTIONALS.length) % MULHER_VIRTUOSA_DEVOTIONALS.length)}
              className="mv-cancel-btn"
            >
              ← Anterior
            </button>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#F472B6' }}>
              Devocional {devocionalIdx + 1} de {MULHER_VIRTUOSA_DEVOTIONALS.length}
            </span>
            <button
              type="button"
              onClick={() => setDevocionalIdx((prev) => (prev + 1) % MULHER_VIRTUOSA_DEVOTIONALS.length)}
              className="mv-cancel-btn"
            >
              Próximo →
            </button>
          </div>

          <div className="mv-proverbs-card" style={{ padding: '18px' }}>
            <h3 className="mv-proverbs-header" style={{ marginBottom: '10px' }}>{devAtual.title}</h3>
            <div className="mv-quote-card" style={{ marginBottom: '14px' }}>
              <p className="mv-quote-verse">"{devAtual.verse}"</p>
              <span className="mv-quote-ref">{devAtual.reference}</span>
            </div>
            <p className="reading-scalable" style={{ fontSize: '0.92rem', lineHeight: '1.7', color: 'var(--text-primary, #E2E8F0)', marginBottom: '16px' }}>
              {devAtual.message}
            </p>
            <div className="mv-wisdom-card">
              <h4 className="mv-wisdom-title">Oração do Dia</h4>
              <p className="mv-wisdom-body" style={{ fontStyle: 'italic' }}>{devAtual.prayer}</p>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: CADERNO DE ORAÇÕES (SALVO NO TURSO) */}
      {activeSubTab === 'oracoes' && (
        <div className="mv-tab-content animate-fade-in">
          <div className="mv-prayer-top">
            <div>
              <h3 className="mv-section-title" style={{ margin: 0 }}>Meus Motivos de Oração</h3>
              <span className="mv-prayer-sub">{prayers.filter((p) => p.concluido).length} orações respondidas • salvo na nuvem</span>
            </div>
            <button onClick={() => setShowNewPrayerForm(!showNewPrayerForm)} className="mv-add-prayer-btn">
              + Novo Pedido
            </button>
          </div>

          {showNewPrayerForm && (
            <form onSubmit={handleAddPrayer} className="mv-new-prayer-box animate-scale-up">
              <input
                type="text"
                placeholder="Título da oração (ex: Pela saúde da minha família)"
                value={newPrayerTitle}
                onChange={(e) => setNewPrayerTitle(e.target.value)}
                className="mv-input"
                required
              />
              <textarea
                placeholder="Detalhes ou promessa bíblica de apoio..."
                value={newPrayerText}
                onChange={(e) => setNewPrayerText(e.target.value)}
                className="mv-textarea"
                rows={3}
              />
              <div className="mv-form-btns">
                <button type="button" onClick={() => setShowNewPrayerForm(false)} className="mv-cancel-btn">
                  Cancelar
                </button>
                <button type="submit" className="mv-save-btn">
                  Salvar pedido
                </button>
              </div>
            </form>
          )}

          <div className="mv-prayers-list">
            {prayers.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.84rem' }}>
                Seu caderno de orações está pronto. Clique em "+ Novo Pedido" acima para registrar seu primeiro clamor.
              </p>
            ) : (
              prayers.map((p) => (
                <div key={p.id} className={`mv-prayer-card ${p.concluido ? 'answered' : ''}`}>
                  <div className="mv-prayer-card-header">
                    <h4 className="mv-prayer-title">{p.titulo}</h4>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        onClick={() => handleToggleItem(p.id)}
                        className={`mv-answer-tag ${p.concluido ? 'is-answered' : ''}`}
                      >
                        {p.concluido ? 'Graça Alcançada' : 'Em Oração'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(p.id)}
                        style={{ background: 'transparent', border: 'none', color: '#F87171', fontSize: '0.72rem', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  {p.conteudo && <p className="mv-prayer-desc">{p.conteudo}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ABA 4: PLANO DE LEITURA DA MULHER */}
      {activeSubTab === 'leitura' && (
        <div className="mv-tab-content animate-fade-in">
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="mv-section-title" style={{ margin: 0 }}>Jornada Bíblica da Mulher</h3>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#10B981' }}>
              {leituraConcluida.length}/{PLANO_LEITURA_MULHER.length} concluídos
            </span>
          </div>
          <div className="mv-habits-list">
            {PLANO_LEITURA_MULHER.map((item) => {
              const done = leituraConcluida.includes(item.id);
              return (
                <div key={item.id} onClick={() => toggleLeitura(item.id)} className={`mv-habit-item ${done ? 'done' : ''}`}>
                  <div className={`mv-habit-check ${done ? 'checked' : ''}`}>{done ? '✓' : ''}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#F472B6' }}>{item.dia} • {item.leitura}</div>
                    <div className="mv-habit-label">{item.titulo}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{item.foco}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 5: HÁBITOS & PROVÉRBIOS 31 */}
      {activeSubTab === 'proverbios' && (
        <div className="mv-tab-content animate-fade-in">
          <h3 className="mv-section-title">Hábitos Espirituais de Hoje</h3>
          <div className="mv-habits-list" style={{ marginBottom: '18px' }}>
            {[
              { key: 'devocional', label: 'Devocional com Deus pela manhã' },
              { key: 'oracaoFilhos', label: 'Oração específica pela família e filhos' },
              { key: 'louvorMatinal', label: 'Momento de louvor e gratidão no lar' },
              { key: 'leituraProverbios', label: 'Meditação na sabedoria da mulher sábia' },
              { key: 'aguaSaude', label: 'Cuidado com o corpo (Templo do Espírito)' },
            ].map((item) => (
              <div key={item.key} onClick={() => toggleHabit(item.key)} className={`mv-habit-item ${habits[item.key] ? 'done' : ''}`}>
                <div className={`mv-habit-check ${habits[item.key] ? 'checked' : ''}`}>{habits[item.key] ? '✓' : ''}</div>
                <span className="mv-habit-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mv-proverbs-card">
            <h3 className="mv-proverbs-header">As 7 Marcas da Mulher Virtuosa</h3>
            <div className="mv-marks-list">
              {[
                { title: '1. Confiança Inabalável', desc: 'O coração do seu marido e da sua família está em segurança nela.' },
                { title: '2. Diligência & Sabedoria', desc: 'Trabalha com alegria de suas mãos e administra os recursos do lar.' },
                { title: '3. Força & Dignidade', desc: 'A força e a honra são seu vestido, e se alegra com o dia de amanhã.' },
                { title: '4. Palavras de Bondade', desc: 'Abre a boca com sabedoria, e a instrução da bondade está na sua língua.' },
                { title: '5. Vigilância com Amor', desc: 'Olha pelo governo de sua casa e não come o pão da preguiça.' },
                { title: '6. Legado Abençoado', desc: 'Levantam-se seus filhos e chamam-na bem-aventurada.' },
                { title: '7. O Temor do Senhor', desc: 'Enganosa é a beleza e vã a formosura, mas a mulher que teme ao Senhor, essa sim será louvada.' },
              ].map((m) => (
                <div key={m.title} className="mv-mark-row">
                  <span className="mv-mark-title">{m.title}</span>
                  <p className="mv-mark-desc">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
