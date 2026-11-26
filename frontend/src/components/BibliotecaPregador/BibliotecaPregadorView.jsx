import React, { useState, useEffect, useMemo } from 'react';
import './BibliotecaPregadorView.css';
import { esbocosProntos } from '../../data/pregador/esbocosProntos';
import { estudosBiblicos } from '../../data/pregador/estudosBiblicos';
import { estudosTeologia } from '../../data/pregador/estudosTeologia';
import { mapasBiblicos } from '../../data/pregador/mapas';

const API_BASE = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001/api/v1'
    : 'https://oneconvite-api.onrender.com/api/v1'
);

export default function BibliotecaPregadorView({ onBack, userContact = 'convidado@1convite.com.br' }) {
  const [abaAtiva, setAbaAtiva] = useState('esbocos'); // 'esbocos' | 'criar' | 'estudos' | 'teologia' | 'mapas'
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [itemAberto, setItemAberto] = useState(null); // { kind, data }

  // Esboços personalizados salvos no Turso
  const [meusEsbocos, setMeusEsbocos] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [formTheme, setFormTheme] = useState('Fé & Conflitos');
  const [formVerse, setFormVerse] = useState('');
  const [formIntro, setFormIntro] = useState('');
  const [formPointsText, setFormPointsText] = useState('');
  const [formConclusion, setFormConclusion] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregarMeusEsbocos = async () => {
    try {
      const r = await fetch(`${API_BASE}/pregador/esbocos?contact=${encodeURIComponent(userContact)}`);
      const d = await r.json();
      if (d?.success && Array.isArray(d.esbocos)) {
        setMeusEsbocos(d.esbocos);
      }
    } catch {}
  };

  useEffect(() => {
    carregarMeusEsbocos();
  }, [userContact]);

  const handleSalvarEsboco = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    setSalvando(true);
    try {
      const pontosArr = formPointsText
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((desc, idx) => ({ num: String(idx + 1), title: `Ponto ${idx + 1}`, desc }));

      const res = await fetch(`${API_BASE}/pregador/esbocos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: userContact,
          title: formTitle.trim(),
          theme: formTheme,
          verse: formVerse.trim(),
          intro: formIntro.trim(),
          points: pontosArr,
          conclusion: formConclusion.trim(),
        }),
      });
      const d = await res.json();
      if (d?.success) {
        setFormTitle('');
        setFormVerse('');
        setFormIntro('');
        setFormPointsText('');
        setFormConclusion('');
        await carregarMeusEsbocos();
        setAbaAtiva('esbocos');
      }
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluirEsboco = async (id, e) => {
    e.stopPropagation();
    try {
      await fetch(`${API_BASE}/pregador/esbocos/${id}`, { method: 'DELETE' });
      await carregarMeusEsbocos();
    } catch {}
  };

  // Normaliza todos os esboços (21 oficiais + os criados pelo usuário)
  const todosEsbocos = useMemo(() => {
    const customNorm = meusEsbocos.map((m) => ({
      id: m.id,
      tema: m.title,
      categoria: m.theme || 'Meus Esboços',
      tipo: 'Personalizado',
      textoBase: m.verse || 'Livre',
      introducao: m.intro,
      desenvolvimento: (m.points || []).map((p) => (p.title ? `${p.title}: ${p.desc}` : p.desc || p)),
      conclusao: m.conclusion,
      aplicacao: '',
      isCustom: true,
    }));
    return [...customNorm, ...esbocosProntos];
  }, [meusEsbocos]);

  const categoriasAtuais = useMemo(() => {
    const qList =
      abaAtiva === 'esbocos' ? todosEsbocos :
      abaAtiva === 'estudos' ? estudosBiblicos :
      abaAtiva === 'teologia' ? estudosTeologia :
      abaAtiva === 'mapas' ? mapasBiblicos : [];
    const cats = Array.from(new Set(qList.map((i) => i.categoria).filter(Boolean)));
    return ['Todos', ...cats];
  }, [abaAtiva, todosEsbocos]);

  const listaFiltrada = useMemo(() => {
    const q = busca.trim().toLowerCase();
    const base =
      abaAtiva === 'esbocos' ? todosEsbocos :
      abaAtiva === 'estudos' ? estudosBiblicos :
      abaAtiva === 'teologia' ? estudosTeologia :
      abaAtiva === 'mapas' ? mapasBiblicos : [];

    return base.filter((item) => {
      if (categoriaFiltro !== 'Todos' && item.categoria !== categoriaFiltro) return false;
      if (!q) return true;
      const titulo = (item.titulo || item.tema || '').toLowerCase();
      const texto = (item.textoBase || item.descricao || item.periodo || '').toLowerCase();
      const cat = (item.categoria || '').toLowerCase();
      return titulo.includes(q) || texto.includes(q) || cat.includes(q);
    });
  }, [abaAtiva, busca, categoriaFiltro, todosEsbocos]);

  const compartilharWhatsApp = (item, kind) => {
    const titulo = item.titulo || item.tema;
    const ref = item.textoBase || item.versiculoChave || item.periodo || '';
    const intro = item.introducao || item.descricao || '';
    const dev = Array.isArray(item.desenvolvimento) ? item.desenvolvimento.map((p, i) => `*${i + 1}.* ${p}`).join('\n') : '';
    const conc = item.conclusao || '';
    const text = `📖 *${titulo}* ${ref ? `(${ref})` : ''}\n\n${intro}\n\n${dev}\n\n${conc ? `*Conclusão:* ${conc}\n\n` : ''}_Biblioteca do Pregador • 1Convite_`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bp-container animate-fade-in">
      <header className="bp-header">
        <button onClick={() => (itemAberto ? setItemAberto(null) : onBack())} className="bp-back-btn" aria-label="Voltar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="bp-header-info">
          <div className="bp-pill">
            <span className="bp-pill-dot" />
            <span>HOMILÉTICA &amp; TEOLOGIA COMPLETA</span>
          </div>
          <h1 className="bp-title">Biblioteca do Pregador</h1>
        </div>

        <div style={{ width: 40 }} />
      </header>

      {/* NAVEGAÇÃO DAS 5 ABAS */}
      {!itemAberto && (
        <div className="bp-themes-scroll" style={{ marginBottom: '12px' }}>
          {[
            { id: 'esbocos', label: `Esboços (${todosEsbocos.length})` },
            { id: 'estudos', label: `Estudos Bíblicos (${estudosBiblicos.length})` },
            { id: 'teologia', label: `Teologia (${estudosTeologia.length})` },
            { id: 'mapas', label: `Atlas & Mapas (${mapasBiblicos.length})` },
            { id: 'criar', label: '+ Criar Sermão' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setAbaAtiva(tab.id); setCategoriaFiltro('Todos'); setBusca(''); }}
              className={`bp-theme-chip ${abaAtiva === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* FORMULÁRIO CRIADOR DE SERMÕES (SALVO NO TURSO) */}
      {!itemAberto && abaAtiva === 'criar' ? (
        <form onSubmit={handleSalvarEsboco} className="bp-detail-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, color: '#FFF', fontSize: '1.05rem' }}>Criar Novo Esboço de Sermão</h3>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#94A3B8' }}>
            Seus esboços ficam salvos com segurança na nuvem da sua conta para pregar em qualquer lugar.
          </p>

          <input
            type="text"
            required
            placeholder="Título do Sermão (ex: O Poder da Fé Perseverante)"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.16)', background: '#0B0C10', color: '#FFF' }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Texto Base (ex: Hebreus 11:1-6)"
              value={formVerse}
              onChange={(e) => setFormVerse(e.target.value)}
              style={{ flex: 1, minWidth: '160px', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.16)', background: '#0B0C10', color: '#FFF' }}
            />
            <input
              type="text"
              placeholder="Categoria / Tema"
              value={formTheme}
              onChange={(e) => setFormTheme(e.target.value)}
              style={{ flex: 1, minWidth: '140px', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.16)', background: '#0B0C10', color: '#FFF' }}
            />
          </div>
          <textarea
            rows={3}
            placeholder="Introdução da mensagem..."
            value={formIntro}
            onChange={(e) => setFormIntro(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.16)', background: '#0B0C10', color: '#FFF' }}
          />
          <textarea
            rows={4}
            placeholder="Pontos do Desenvolvimento (um ponto por linha)..."
            value={formPointsText}
            onChange={(e) => setFormPointsText(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.16)', background: '#0B0C10', color: '#FFF' }}
          />
          <textarea
            rows={2}
            placeholder="Conclusão & Apelo..."
            value={formConclusion}
            onChange={(e) => setFormConclusion(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.16)', background: '#0B0C10', color: '#FFF' }}
          />
          <button type="submit" disabled={salvando} className="bp-share-btn" style={{ marginTop: '4px' }}>
            {salvando ? 'Salvando na Nuvem...' : 'Salvar Esboço no Banco de Dados'}
          </button>
        </form>
      ) : !itemAberto ? (
        <>
          {/* BUSCA & CATEGORIAS */}
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Buscar por tema, palavra-chave ou referência bíblica..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(15,23,42,0.7)',
                color: '#FFF',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div className="bp-themes-scroll" style={{ marginBottom: '14px' }}>
            {categoriasAtuais.map((c) => (
              <button
                key={c}
                onClick={() => setCategoriaFiltro(c)}
                className={`bp-theme-chip ${categoriaFiltro === c ? 'active' : ''}`}
                style={{ fontSize: '0.72rem', padding: '5px 11px' }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="bp-list">
            {listaFiltrada.map((item) => {
              const title = item.titulo || item.tema;
              const badge = item.categoria || item.tipo || 'Estudo';
              const ref = item.textoBase || item.periodo || '';
              const preview = item.introducao || item.descricao || '';
              return (
                <div
                  key={item.id}
                  onClick={() => setItemAberto({ kind: abaAtiva, data: item })}
                  className="bp-card"
                >
                  <div className="bp-card-top">
                    <span className="bp-theme-tag">{badge}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {ref && <span className="bp-verse-tag">{ref}</span>}
                      {item.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleExcluirEsboco(item.id, e)}
                          style={{ background: 'transparent', border: 'none', color: '#F87171', fontSize: '0.72rem', cursor: 'pointer', fontWeight: '700' }}
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </div>
                  <h3 className="bp-card-title">{title}</h3>
                  <p className="bp-card-preview">{preview.substring(0, 125)}...</p>
                  <div className="bp-card-footer">
                    <span>
                      {abaAtiva === 'mapas'
                        ? `${(item.localizacoes || []).length} localizações bíblicas`
                        : `${(item.desenvolvimento || []).length} pontos estruturados`}
                    </span>
                    <div className="bp-card-arrow">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* VISUALIZADOR DETALHADO (ESBOÇO, ESTUDO, TEOLOGIA OU MAPA) */
        <article className="bp-detail-card animate-fade-in">
          <div className="bp-detail-top">
            <span className="bp-theme-tag">{itemAberto.data.categoria || itemAberto.data.tipo}</span>
            {(itemAberto.data.textoBase || itemAberto.data.periodo) && (
              <span className="bp-verse-tag">{itemAberto.data.textoBase || itemAberto.data.periodo}</span>
            )}
          </div>

          <h2 className="bp-detail-title">{itemAberto.data.titulo || itemAberto.data.tema}</h2>

          {itemAberto.data.versiculoChave && (
            <div className="bp-section-block bp-illustration-box" style={{ marginBottom: '14px' }}>
              <h4 className="bp-section-header">Versículo-Chave</h4>
              <p className="bp-text" style={{ fontStyle: 'italic' }}>{itemAberto.data.versiculoChave}</p>
            </div>
          )}

          {(itemAberto.data.introducao || itemAberto.data.descricao) && (
            <div className="bp-section-block">
              <h4 className="bp-section-header">{itemAberto.kind === 'mapas' ? 'Contexto Histórico & Geográfico' : 'Introdução'}</h4>
              <p className="bp-text">{itemAberto.data.introducao || itemAberto.data.descricao}</p>
            </div>
          )}

          {Array.isArray(itemAberto.data.desenvolvimento) && itemAberto.data.desenvolvimento.length > 0 && (
            <div className="bp-section-block">
              <h4 className="bp-section-header">Desenvolvimento Estruturado</h4>
              <div className="bp-points-list">
                {itemAberto.data.desenvolvimento.map((pt, idx) => (
                  <div key={idx} className="bp-point-item">
                    <div className="bp-point-num">{idx + 1}</div>
                    <div>
                      <p className="bp-point-desc" style={{ margin: 0 }}>{pt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(itemAberto.data.localizacoes) && itemAberto.data.localizacoes.length > 0 && (
            <div className="bp-section-block">
              <h4 className="bp-section-header">Locais Estratégicos do Mapa</h4>
              <div className="bp-points-list">
                {itemAberto.data.localizacoes.map((loc, idx) => (
                  <div key={idx} className="bp-point-item">
                    <div className="bp-point-num">📍</div>
                    <div>
                      <h5 className="bp-point-title">{loc.nome}</h5>
                      <p className="bp-point-desc">{loc.importancia || loc.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {itemAberto.data.conclusao && (
            <div className="bp-section-block bp-conclusion-box">
              <h4 className="bp-section-header">Conclusão</h4>
              <p className="bp-text">{itemAberto.data.conclusao}</p>
            </div>
          )}

          {itemAberto.data.aplicacao && (
            <div className="bp-section-block bp-illustration-box">
              <h4 className="bp-section-header">Aplicação Prática</h4>
              <p className="bp-text">{itemAberto.data.aplicacao}</p>
            </div>
          )}

          {Array.isArray(itemAberto.data.referenciasBiblicas) && itemAberto.data.referenciasBiblicas.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {itemAberto.data.referenciasBiblicas.map((ref, idx) => (
                <span key={idx} className="bp-verse-tag" style={{ fontSize: '0.72rem' }}>{ref}</span>
              ))}
            </div>
          )}

          <button
            onClick={() => compartilharWhatsApp(itemAberto.data, itemAberto.kind)}
            className="bp-share-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>Compartilhar no WhatsApp</span>
          </button>
        </article>
      )}
    </div>
  );
}
