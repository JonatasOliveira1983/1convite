import React, { useState } from 'react';
import './MulherVirtuosaView.css';

export default function MulherVirtuosaView({ onBack }) {
  const [activeSubTab, setActiveSubTab] = useState('diario');
  const [prayers, setPrayers] = useState(() => {
    try {
      const s = localStorage.getItem('mulher-virtuosa-prayers');
      return s ? JSON.parse(s) : [
        { id: 1, title: 'Pela minha família e lar', text: 'Senhor, blinda a minha casa com a Tua paz e união.', answered: false },
        { id: 2, title: 'Sabedoria e mansidão diária', text: 'Que as minhas palavras edifiquem e tragam vida a todos ao redor.', answered: true }
      ];
    } catch {
      return [];
    }
  });

  const [newPrayerTitle, setNewPrayerTitle] = useState('');
  const [newPrayerText, setNewPrayerText] = useState('');
  const [showNewPrayerForm, setShowNewPrayerForm] = useState(false);

  const [habits, setHabits] = useState(() => {
    try {
      const s = localStorage.getItem('mulher-virtuosa-habits');
      return s ? JSON.parse(s) : {
        devocional: true,
        oracaoFilhos: false,
        louvorMatinal: true,
        leituraProverbios: false
      };
    } catch {
      return { devocional: true, oracaoFilhos: false, louvorMatinal: true, leituraProverbios: false };
    }
  });

  const toggleHabit = (key) => {
    const updated = { ...habits, [key]: !habits[key] };
    setHabits(updated);
    try {
      localStorage.setItem('mulher-virtuosa-habits', JSON.stringify(updated));
    } catch (e) { console.error(e); }
  };

  const handleAddPrayer = (e) => {
    e.preventDefault();
    if (!newPrayerTitle.trim()) return;
    const item = {
      id: Date.now(),
      title: newPrayerTitle.trim(),
      text: newPrayerText.trim(),
      answered: false
    };
    const updated = [item, ...prayers];
    setPrayers(updated);
    try {
      localStorage.setItem('mulher-virtuosa-prayers', JSON.stringify(updated));
    } catch (err) { console.error(err); }
    setNewPrayerTitle('');
    setNewPrayerText('');
    setShowNewPrayerForm(false);
  };

  const togglePrayerAnswered = (id) => {
    const updated = prayers.map(p => p.id === id ? { ...p, answered: !p.answered } : p);
    setPrayers(updated);
    try {
      localStorage.setItem('mulher-virtuosa-prayers', JSON.stringify(updated));
    } catch (e) { console.error(e); }
  };

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
            <span>ESPAÇO MULHER VIRTUOSA</span>
          </div>
          <h1 className="mv-title">Planner & Edificação</h1>
        </div>

        <div style={{ width: 40 }} />
      </header>

      {/* Sub-abas */}
      <div className="mv-tabs-nav">
        <button 
          onClick={() => setActiveSubTab('diario')} 
          className={`mv-tab-btn ${activeSubTab === 'diario' ? 'active' : ''}`}
        >
          Rotina Diária
        </button>
        <button 
          onClick={() => setActiveSubTab('oracoes')} 
          className={`mv-tab-btn ${activeSubTab === 'oracoes' ? 'active' : ''}`}
        >
          Caderno de Orações
        </button>
        <button 
          onClick={() => setActiveSubTab('proverbios')} 
          className={`mv-tab-btn ${activeSubTab === 'proverbios' ? 'active' : ''}`}
        >
          Provérbios 31
        </button>
      </div>

      {/* Aba 1: Rotina Diária & Hábitos */}
      {activeSubTab === 'diario' && (
        <div className="mv-tab-content animate-fade-in">
          {/* Card Versículo Feminino */}
          <div className="mv-quote-card">
            <p className="mv-quote-verse">
              "Mulher virtuosa, quem a achará? O seu valor muito excede o de rubis."
            </p>
            <span className="mv-quote-ref">Provérbios 31:10</span>
          </div>

          <h3 className="mv-section-title">Hábitos Espirituais de Hoje</h3>
          <div className="mv-habits-list">
            {[
              { key: 'devocional', label: 'Devocional com Deus pela manhã' },
              { key: 'oracaoFilhos', label: 'Oração específica pela família e filhos' },
              { key: 'louvorMatinal', label: 'Momento de louvor e gratidão no lar' },
              { key: 'leituraProverbios', label: 'Meditação na sabedoria da mulher sábia' }
            ].map(item => (
              <div 
                key={item.key} 
                onClick={() => toggleHabit(item.key)}
                className={`mv-habit-item ${habits[item.key] ? 'done' : ''}`}
              >
                <div className={`mv-habit-check ${habits[item.key] ? 'checked' : ''}`}>
                  {habits[item.key] && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="mv-habit-label">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Dica da Mulher Sábia */}
          <div className="mv-wisdom-card">
            <h4 className="mv-wisdom-title">Princípio da Mansidão</h4>
            <p className="mv-wisdom-body">
              "A mulher sábia edifica a sua casa." A sua postura espiritual tem autoridade no mundo espiritual para trazer paz, ordem e harmonia para o seu lar hoje.
            </p>
          </div>
        </div>
      )}

      {/* Aba 2: Caderno de Orações */}
      {activeSubTab === 'oracoes' && (
        <div className="mv-tab-content animate-fade-in">
          <div className="mv-prayer-top">
            <div>
              <h3 className="mv-section-title" style={{ margin: 0 }}>Meus Motivos de Oração</h3>
              <span className="mv-prayer-sub">{prayers.filter(p => p.answered).length} orações respondidas</span>
            </div>
            <button 
              onClick={() => setShowNewPrayerForm(!showNewPrayerForm)}
              className="mv-add-prayer-btn"
            >
              + Novo Pedido
            </button>
          </div>

          {showNewPrayerForm && (
            <form onSubmit={handleAddPrayer} className="mv-new-prayer-box animate-scale-up">
              <input
                type="text"
                placeholder="Título da oração (ex: Pela saúde da minha mãe)"
                value={newPrayerTitle}
                onChange={e => setNewPrayerTitle(e.target.value)}
                className="mv-input"
                required
              />
              <textarea
                placeholder="Detalhes ou promessa bíblica de apoio..."
                value={newPrayerText}
                onChange={e => setNewPrayerText(e.target.value)}
                className="mv-textarea"
                rows={3}
              />
              <div className="mv-form-btns">
                <button type="button" onClick={() => setShowNewPrayerForm(false)} className="mv-cancel-btn">
                  Cancelar
                </button>
                <button type="submit" className="mv-save-btn">
                  Salvar Oração
                </button>
              </div>
            </form>
          )}

          <div className="mv-prayers-list">
            {prayers.map(p => (
              <div key={p.id} className={`mv-prayer-card ${p.answered ? 'answered' : ''}`}>
                <div className="mv-prayer-card-header">
                  <h4 className="mv-prayer-title">{p.title}</h4>
                  <button 
                    onClick={() => togglePrayerAnswered(p.id)}
                    className={`mv-answer-tag ${p.answered ? 'is-answered' : ''}`}
                  >
                    {p.answered ? 'Graça Alcançada' : 'Em Oração'}
                  </button>
                </div>
                {p.text && <p className="mv-prayer-desc">{p.text}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aba 3: Provérbios 31 */}
      {activeSubTab === 'proverbios' && (
        <div className="mv-tab-content animate-fade-in">
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
                { title: '7. O Temor do Senhor', desc: 'Enganosa é a beleza e vã a formosura, mas a mulher que teme ao Senhor, essa sim será louvada.' }
              ].map(m => (
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
