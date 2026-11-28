import React, { useState, useEffect, useRef, useMemo } from 'react';
import './IdeEstudosView.css';
import { IDE_BLOCKS, IDE_LESSONS } from '../../data/ideCurriculum';
import ideLogo from '../../assets/ide/ide-logo.jpg';
import ideStudioImg from '../../assets/ide/ide-podcast-studio.jpg';

const MARCO_ZERO = {
  id: 'marco_zero_iasd_parque_claudia',
  name: 'IASD Parque Cláudia (Marco Zero)',
  denominationOrNote: 'Marco Zero do Projeto 1Convite / I.D.E. • Comunidade Cristã',
  address: 'Parque Cláudia — Zona Sul de São Paulo, SP',
  lat: -23.7042,
  lon: -46.7628,
  nextBaptismInfo: 'Celebrações batismais mensais • Agendamento pastoral aberto',
  pastoralContact: '1convite.com.br • Recepção Pastoral Parque Cláudia',
  isMarcoZero: true,
};

const CURATED_CHURCHES = [
  MARCO_ZERO,
  {
    id: 'curated_jardim_angela',
    name: 'Comunidade Cristã do Jardim Ângela',
    denominationOrNote: 'Igreja Cristã — Evangelho da Graça',
    address: "Estrada do M'Boi Mirim — Zona Sul, São Paulo, SP",
    lat: -23.6948,
    lon: -46.7714,
    nextBaptismInfo: 'Próximas datas aos sábados e domingos • Consultar secretaria',
    pastoralContact: 'Secretaria Pastoral Local • 1Convite',
  },
  {
    id: 'curated_capao_redondo',
    name: 'Igreja Cristã da Graça — Capão Redondo',
    denominationOrNote: 'Comunidade Cristã Evangélica',
    address: "Av. Comendador Sant'Anna — Capão Redondo, São Paulo, SP",
    lat: -23.6695,
    lon: -46.7796,
    nextBaptismInfo: 'Batismos abertos mensalmente • Sem pré-requisitos burocráticos',
    pastoralContact: 'Acolhimento Batismal • Zona Sul SP',
  },
  {
    id: 'curated_santo_amaro',
    name: 'Igreja Cristã Central de Santo Amaro',
    denominationOrNote: 'Comunidade Cristã Histórica',
    address: 'Largo Treze de Maio — Santo Amaro, São Paulo, SP',
    lat: -23.6524,
    lon: -46.7098,
    nextBaptismInfo: 'Consulte calendário quinzenal de batismos',
    pastoralContact: 'Coordenação Pastoral Santo Amaro',
  },
];

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function IdeEstudosView({ userEmail, userName, onBack, onOpenBible }) {
  const storageKey = useMemo(() => {
    const id = String(userEmail || 'guest').trim().toLowerCase() || 'guest';
    return `1convite_ide_progress_v1_${id}`;
  }, [userEmail]);

  const [progressMap, setProgressMap] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setProgressMap(raw ? JSON.parse(raw) : {});
    } catch {
      setProgressMap({});
    }
  }, [storageKey]);

  const saveLessonProgress = (lessonNum, patch) => {
    setProgressMap((prev) => {
      const current = prev[lessonNum] || {};
      const next = {
        ...prev,
        [lessonNum]: {
          ...current,
          ...patch,
          updatedAt: Date.now(),
        },
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  };

  const [subTab, setSubTab] = useState('trail'); // 'trail' | 'journal' | 'baptism' | 'certificate'
  const [selectedBlock, setSelectedBlock] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLessonNum, setActiveLessonNum] = useState(null);
  const [showScript, setShowScript] = useState(true);

  // Podcast Audio Player state
  const audioRef = useRef(null);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Baptism / GPS Locator state
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [churches, setChurches] = useState(() =>
    CURATED_CHURCHES.map((c) => ({ ...c, distanceKm: null }))
  );
  const [selectedChurch, setSelectedChurch] = useState(MARCO_ZERO);

  const activeLesson = useMemo(
    () => IDE_LESSONS.find((l) => l.lessonNumber === activeLessonNum) || null,
    [activeLessonNum]
  );

  useEffect(() => {
    setAudioAvailable(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [activeLessonNum]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const completedCount = useMemo(
    () =>
      IDE_LESSONS.filter((l) => progressMap[l.lessonNumber]?.status === 'concluida').length,
    [progressMap]
  );

  const filteredLessons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return IDE_LESSONS.filter((l) => {
      if (selectedBlock > 0 && l.blockNumber !== selectedBlock) return false;
      if (!q) return true;
      return (
        l.title.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q) ||
        l.bibleReferences.some((r) => r.toLowerCase().includes(q))
      );
    });
  }, [selectedBlock, searchQuery]);

  const journalEntries = useMemo(
    () =>
      IDE_LESSONS.filter((l) => (progressMap[l.lessonNumber]?.reflectionText || '').trim().length > 0).map(
        (l) => ({
          lesson: l,
          text: progressMap[l.lessonNumber].reflectionText,
          updatedAt: progressMap[l.lessonNumber].updatedAt,
        })
      ),
    [progressMap]
  );

  const toggleAudioPlay = () => {
    const el = audioRef.current;
    if (!el || !audioAvailable) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play()
        .then(() => setIsPlaying(true))
        .catch(() => setAudioAvailable(false));
    }
  };

  const seekAudioBy = (deltaSec) => {
    const el = audioRef.current;
    if (!el || !audioAvailable) return;
    const next = Math.max(0, Math.min(el.duration || 0, (el.currentTime || 0) + deltaSec));
    el.currentTime = next;
    setCurrentTime(next);
  };

  const handleLocateChurches = () => {
    if (!navigator.geolocation) {
      setGeoError('Seu navegador não suporta geolocalização. Exibindo igrejas de referência.');
      return;
    }
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserCoords({ lat, lon });

        const marcoZeroWithDist = {
          ...MARCO_ZERO,
          distanceKm: haversineKm(lat, lon, MARCO_ZERO.lat, MARCO_ZERO.lon),
        };

        try {
          const query = `[out:json][timeout:12];(node["amenity"="place_of_worship"]["religion"="christian"](around:12000,${lat},${lon});way["amenity"="place_of_worship"]["religion"="christian"](around:12000,${lat},${lon}););out center 18;`;
          const resp = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
          });
          const data = await resp.json();
          const elements = Array.isArray(data?.elements) ? data.elements : [];
          const found = elements
            .map((el, idx) => {
              const cLat = el.lat ?? el.center?.lat;
              const cLon = el.lon ?? el.center?.lon;
              if (cLat == null || cLon == null) return null;
              const tags = el.tags || {};
              const name = tags.name || 'Comunidade Cristã Local';
              const addrParts = [tags['addr:street'], tags['addr:housenumber'], tags['addr:suburb'], tags['addr:city']]
                .filter(Boolean);
              const address = addrParts.length ? addrParts.join(', ') : 'Endereço aproximado no mapa';
              return {
                id: `osm_${el.id || idx}`,
                name,
                denominationOrNote: tags.denomination
                  ? `Comunidade Cristã • ${tags.denomination}`
                  : 'Igreja Cristã Local',
                address,
                lat: cLat,
                lon: cLon,
                distanceKm: haversineKm(lat, lon, cLat, cLon),
                nextBaptismInfo: 'Consulte a secretaria local sobre o próximo batismo',
                pastoralContact: tags.phone || tags['contact:phone'] || tags.website || 'Contato presencial no endereço',
                isMarcoZero: false,
              };
            })
            .filter(Boolean)
            .sort((a, b) => a.distanceKm - b.distanceKm)
            .slice(0, 12);

          const merged = [marcoZeroWithDist, ...found];
          setChurches(merged);
          setSelectedChurch(found[0] || marcoZeroWithDist);
        } catch {
          const fallback = CURATED_CHURCHES.map((c) => ({
            ...c,
            distanceKm: haversineKm(lat, lon, c.lat, c.lon),
          })).sort((a, b) => a.distanceKm - b.distanceKm);
          setChurches(fallback);
          setSelectedChurch(fallback[0]);
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setGeoLoading(false);
        setGeoError('Não foi possível acessar sua localização. Permita o GPS no navegador ou escolha uma igreja abaixo.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePrintLesson = (lesson) => {
    const notes = progressMap[lesson.lessonNumber]?.reflectionText || '';
    const win = window.open('', '_blank', 'width=820,height=920');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>I.D.E. Boas Notícias • Aula ${lesson.lessonNumber}</title>
          <style>
            body { font-family: Georgia, serif; padding: 32px; color: #111827; line-height: 1.6; max-width: 760px; margin: 0 auto; }
            h1 { color: #92400e; margin-bottom: 4px; }
            .sub { color: #4b5563; font-size: 14px; margin-bottom: 20px; }
            .box { background: #fef3c7; border-left: 4px solid #d97706; padding: 12px 16px; margin: 16px 0; }
            h2 { color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 24px; }
          </style>
        </head>
        <body>
          <h1>I.D.E. Boas Notícias — Aula ${lesson.lessonNumber}</h1>
          <div class="sub">${lesson.blockTitle}</div>
          <h2>${lesson.title}</h2>
          <p><strong>Textos Bíblicos:</strong> ${lesson.bibleReferences.join(' • ')}</p>
          <p>${lesson.overview}</p>
          <h2>Pilares do Estudo</h2>
          ${lesson.pillars.map((p) => `<p><strong>${p.title}:</strong> ${p.body}</p>`).join('')}
          <h2>Versículos para Meditação</h2>
          ${lesson.meditationVerses.map((v) => `<div class="box">“${v.text}”<br/><strong>— ${v.reference}</strong></div>`).join('')}
          <h2>Passo Prático</h2>
          <p>${lesson.practicalStep}</p>
          <h2>Minhas Anotações</h2>
          <p>${notes ? notes.replace(/\n/g, '<br/>') : '____________________________________________________'}</p>
          <div class="box"><strong>Apelo:</strong> ${lesson.appealHeadline}<br/>${lesson.appealBody}</div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  // ── TELA DE DETALHE DA AULA ─────────────────────────────────────────────
  if (activeLesson) {
    const p = progressMap[activeLesson.lessonNumber] || {};
    const selectedQuiz = Array.isArray(p.selectedQuizAnswers) ? p.selectedQuizAnswers : [-1, -1, -1];
    const isCompleted = p.status === 'concluida';

    return (
      <div className="ide-container">
        <div className="ide-top-bar">
          <button type="button" className="ide-back-btn" onClick={() => setActiveLessonNum(null)}>
            ← Voltar para a Trilha
          </button>
          <span className="ide-lesson-pill">
            Aula {activeLesson.lessonNumber} de {IDE_LESSONS.length}
          </span>
        </div>

        <div className="ide-lesson-header">
          <span className="ide-block-tag">Bloco {activeLesson.blockNumber} • {activeLesson.blockTitle}</span>
          <h1>{activeLesson.title}</h1>
          <p>{activeLesson.summary}</p>
          <div className="ide-refs-row">
            {activeLesson.bibleReferences.map((ref) => (
              <span key={ref} className="ide-ref-chip">{ref}</span>
            ))}
            {onOpenBible && (
              <button type="button" className="ide-open-bible-btn" onClick={onOpenBible}>
                📖 Abrir Bíblia no 1Convite
              </button>
            )}
          </div>
        </div>

        {/* Player de Podcast com Pedro & Lívia */}
        <section className="ide-podcast-card">
          <div className="ide-studio-banner">
            <img src={ideStudioImg} alt="Podcast I.D.E. Boas Notícias — Lívia e Pedro" className="ide-studio-img" />
            <div className="ide-studio-overlay">
              <div className="ide-hosts-badges">
                <span className="ide-host-pill">🎙️ Lívia • Conexões Práticas & Graça</span>
                <span className="ide-host-pill">🎙️ Pedro • Guia Histórico & Teológico</span>
              </div>
              <h3>Podcast I.D.E. — Episódio {activeLesson.lessonNumber}</h3>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={activeLesson.audioUrl}
            preload="metadata"
            onLoadedMetadata={(e) => {
              setDuration(e.currentTarget.duration || 0);
              setAudioAvailable(true);
            }}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime || 0)}
            onEnded={() => {
              setIsPlaying(false);
              saveLessonProgress(activeLesson.lessonNumber, { status: 'concluida' });
            }}
            onError={() => setAudioAvailable(false)}
          />

          {audioAvailable ? (
            <div className="ide-player-controls">
              <div className="ide-progress-wrap">
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (audioRef.current) audioRef.current.currentTime = val;
                    setCurrentTime(val);
                  }}
                />
                <span>{formatTime(duration)}</span>
              </div>
              <div className="ide-player-buttons">
                <button type="button" className="ide-ctrl-btn" onClick={() => seekAudioBy(-15)}>
                  ↺ 15s
                </button>
                <button type="button" className="ide-play-btn" onClick={toggleAudioPlay}>
                  {isPlaying ? '⏸ Pausar Episódio' : '▶ Ouvir Podcast'}
                </button>
                <button type="button" className="ide-ctrl-btn" onClick={() => seekAudioBy(15)}>
                  15s ↻
                </button>
                <div className="ide-speed-group">
                  {[1.0, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      className={`ide-speed-btn ${playbackSpeed === spd ? 'active' : ''}`}
                      onClick={() => setPlaybackSpeed(spd)}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="ide-audio-pending">
              <span>🎧 Áudio de estúdio (Pedro & Lívia) preparado para publicação</span>
              <small>Enquanto os MP3s de estúdio são gerados, acompanhe o diálogo completo abaixo.</small>
            </div>
          )}

          <div className="ide-script-toggle-row">
            <button type="button" className="ide-script-toggle" onClick={() => setShowScript((v) => !v)}>
              {showScript ? 'Ocultar Roteiro do Episódio ▲' : 'Ler Roteiro Completo (Pedro & Lívia) ▼'}
            </button>
            <button type="button" className="ide-pdf-btn" onClick={() => handlePrintLesson(activeLesson)}>
              📄 Baixar / Imprimir Guia
            </button>
          </div>

          {showScript && (
            <div className="ide-script-box">
              <div className="ide-dialogue-line is-welcome">
                <strong>Pedro & Lívia (Boas-vindas):</strong>
                <p>
                  “Seja bem-vindo ao I.D.E. Boas Notícias! Pegue sua Bíblia física (ou abra aqui no App 1Convite) e tenha em mãos seu caderno e caneta — ou use o campo de anotações logo abaixo no Guia de Estudos para registrar tudo o que Deus falar ao seu coração hoje.”
                </p>
              </div>
              {activeLesson.podcastScript.map((line, idx) => (
                <div
                  key={idx}
                  className={`ide-dialogue-line ${line.speaker === 'Pedro' ? 'is-pedro' : 'is-livia'}`}
                >
                  <strong>{line.speaker}:</strong>
                  <p>{line.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Guia de Estudo */}
        <section className="ide-study-section">
          <h2>Visão Geral do Estudo</h2>
          <p className="ide-overview-text">{activeLesson.overview}</p>

          <h3>Pilares da Palavra</h3>
          <div className="ide-pillars-grid">
            {activeLesson.pillars.map((pil, i) => (
              <div key={i} className="ide-pillar-card">
                <span className="ide-pillar-num">{i + 1}</span>
                <h4>{pil.title}</h4>
                <p>{pil.body}</p>
              </div>
            ))}
          </div>

          <h3>Versículos para Meditação</h3>
          <div className="ide-verses-list">
            {activeLesson.meditationVerses.map((v, i) => (
              <blockquote key={i} className="ide-verse-quote">
                <p>“{v.text}”</p>
                <cite>— {v.reference}</cite>
              </blockquote>
            ))}
          </div>

          <div className="ide-practical-box">
            <h4>Passo Prático de Hoje</h4>
            <p>{activeLesson.practicalStep}</p>
          </div>
        </section>

        {/* Campo de Anotações Pessoais */}
        <section className="ide-notes-section">
          <h3>✍️ Minhas Anotações do Guia de Estudos</h3>
          <p className="ide-notes-prompt">{activeLesson.reflectionPrompt}</p>
          <textarea
            className="ide-notes-textarea"
            rows={5}
            placeholder="Escreva aqui suas anotações, versículos que marcaram você ou decisões de oração..."
            value={p.reflectionText || ''}
            onChange={(e) =>
              saveLessonProgress(activeLesson.lessonNumber, {
                reflectionText: e.target.value,
                status: p.status === 'concluida' ? 'concluida' : 'em_andamento',
              })
            }
          />
        </section>

        {/* Quiz Interativo */}
        <section className="ide-quiz-section">
          <h3>Fixação do Estudo (Quiz)</h3>
          {activeLesson.quiz.map((q, qIdx) => {
            const chosen = selectedQuiz[qIdx] ?? -1;
            return (
              <div key={qIdx} className="ide-quiz-card">
                <p className="ide-quiz-q">{qIdx + 1}. {q.question}</p>
                <div className="ide-quiz-opts">
                  {q.options.map((opt, oIdx) => {
                    const isPicked = chosen === oIdx;
                    const isRight = oIdx === q.correctIndex;
                    let cls = 'ide-quiz-opt';
                    if (chosen >= 0) {
                      if (isRight) cls += ' is-correct';
                      else if (isPicked) cls += ' is-wrong';
                    }
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        className={cls}
                        onClick={() => {
                          const nextQuiz = [...selectedQuiz];
                          nextQuiz[qIdx] = oIdx;
                          saveLessonProgress(activeLesson.lessonNumber, {
                            selectedQuizAnswers: nextQuiz,
                            status: p.status === 'concluida' ? 'concluida' : 'em_andamento',
                          });
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {chosen >= 0 && <div className="ide-quiz-feedback">{q.feedback}</div>}
              </div>
            );
          })}
        </section>

        {/* Apelo ao Batismo + Conclusão */}
        <section className="ide-appeal-card">
          <span className="ide-appeal-badge">Decisão & Batismo • Marcos 16:15–16</span>
          <h3>{activeLesson.appealHeadline}</h3>
          <p>{activeLesson.appealBody}</p>
          <div className="ide-appeal-actions">
            <button
              type="button"
              className="ide-btn-gold"
              onClick={() => {
                setActiveLessonNum(null);
                setSubTab('baptism');
                handleLocateChurches();
              }}
            >
              📍 Buscar Igreja & Batismo Perto de Mim →
            </button>
            <button
              type="button"
              className={`ide-btn-complete ${isCompleted ? 'is-done' : ''}`}
              onClick={() =>
                saveLessonProgress(activeLesson.lessonNumber, {
                  status: isCompleted ? 'em_andamento' : 'concluida',
                })
              }
            >
              {isCompleted ? '✓ Aula Concluída' : 'Marcar Aula como Concluída'}
            </button>
          </div>
        </section>
      </div>
    );
  }

  // ── TELA PRINCIPAL DO MÓDULO I.D.E. ─────────────────────────────────────
  return (
    <div className="ide-container">
      <div className="ide-top-bar">
        {onBack && (
          <button type="button" className="ide-back-btn" onClick={onBack}>
            ← Voltar ao Início
          </button>
        )}
        <span className="ide-lesson-pill">
          {completedCount} / {IDE_LESSONS.length} aulas concluídas
        </span>
      </div>

      {/* Hero I.D.E. Boas Notícias */}
      <section className="ide-hero-banner">
        <div className="ide-hero-left">
          <img src={ideLogo} alt="I.D.E. Boas Notícias" className="ide-hero-logo" />
          <p className="ide-hero-desc">
            Estudo bíblico completo de <strong>Gênesis ao Apocalipse em 28 aulas</strong> com Podcast em dupla (<strong>Pedro & Lívia</strong>), Guia de Anotações, Quiz e Localizador de Batismo.
          </p>
          <div className="ide-progress-bar-bg">
            <div
              className="ide-progress-bar-fill"
              style={{ width: `${Math.round((completedCount / IDE_LESSONS.length) * 100)}%` }}
            />
          </div>
        </div>
        <div className="ide-hero-right">
          <img src={ideStudioImg} alt="Pedro e Lívia no Podcast I.D.E." className="ide-hero-studio" />
        </div>
      </section>

      {/* Navegação Interna */}
      <div className="ide-subtabs">
        <button type="button" className={subTab === 'trail' ? 'active' : ''} onClick={() => setSubTab('trail')}>
          Trilha (28 Aulas)
        </button>
        <button type="button" className={subTab === 'journal' ? 'active' : ''} onClick={() => setSubTab('journal')}>
          Meu Diário ({journalEntries.length})
        </button>
        <button type="button" className={subTab === 'baptism' ? 'active' : ''} onClick={() => setSubTab('baptism')}>
          Igrejas & Batismo
        </button>
        <button type="button" className={subTab === 'certificate' ? 'active' : ''} onClick={() => setSubTab('certificate')}>
          Certificado
        </button>
      </div>

      {/* ABA 1: TRILHA DAS 28 AULAS */}
      {subTab === 'trail' && (
        <div className="ide-trail-wrap">
          <div className="ide-filters-row">
            <input
              type="search"
              className="ide-search-input"
              placeholder="Buscar aula, tema ou livro bíblico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="ide-block-chips">
              <button
                type="button"
                className={selectedBlock === 0 ? 'active' : ''}
                onClick={() => setSelectedBlock(0)}
              >
                Todos os Blocos
              </button>
              {IDE_BLOCKS.map((b) => (
                <button
                  key={b.blockNumber}
                  type="button"
                  className={selectedBlock === b.blockNumber ? 'active' : ''}
                  onClick={() => setSelectedBlock(b.blockNumber)}
                >
                  Bloco {b.blockNumber}
                </button>
              ))}
            </div>
          </div>

          <div className="ide-lessons-grid">
            {filteredLessons.map((lesson) => {
              const st = progressMap[lesson.lessonNumber]?.status || 'nao_iniciada';
              return (
                <button
                  key={lesson.lessonNumber}
                  type="button"
                  className={`ide-lesson-card ${st === 'concluida' ? 'is-done' : ''}`}
                  onClick={() => {
                    setActiveLessonNum(lesson.lessonNumber);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="ide-lesson-card-top">
                    <span className="ide-num-badge">Aula {lesson.lessonNumber}</span>
                    <span className={`ide-status-tag ${st}`}>
                      {st === 'concluida' ? '✓ Concluída' : st === 'em_andamento' ? 'Em andamento' : 'Iniciar'}
                    </span>
                  </div>
                  <h4>{lesson.title}</h4>
                  <p>{lesson.summary}</p>
                  <div className="ide-lesson-meta">
                    <span>🎙️ Podcast Pedro & Lívia</span>
                    <span>•</span>
                    <span>{lesson.bibleReferences[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 2: MEU DIÁRIO */}
      {subTab === 'journal' && (
        <div className="ide-journal-wrap">
          {journalEntries.length === 0 ? (
            <div className="ide-empty-state">
              <h3>Seu Diário de Estudos está vazio</h3>
              <p>Abra qualquer aula e escreva suas reflexões no campo de anotações para vê-las organizadas aqui.</p>
            </div>
          ) : (
            <div className="ide-journal-list">
              {journalEntries.map(({ lesson, text }) => (
                <div key={lesson.lessonNumber} className="ide-journal-card">
                  <div className="ide-journal-head">
                    <strong>Aula {lesson.lessonNumber}: {lesson.title}</strong>
                    <button type="button" onClick={() => setActiveLessonNum(lesson.lessonNumber)}>
                      Abrir Aula →
                    </button>
                  </div>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ABA 3: IGREJAS & BATISMO (GPS + MAPA + MARCO ZERO) */}
      {subTab === 'baptism' && (
        <div className="ide-baptism-wrap">
          <div className="ide-baptism-hero">
            <div>
              <h2>“Quem crer e for batizado será salvo” (Marcos 16:16)</h2>
              <p>
                Use sua localização atual para encontrar igrejas cristãs perto de você, ver o endereço no mapa, conferir a distância até a <strong>Igreja Marco Zero</strong> e falar com a recepção pastoral.
              </p>
            </div>
            <button
              type="button"
              className="ide-btn-gold"
              disabled={geoLoading}
              onClick={handleLocateChurches}
            >
              {geoLoading ? 'Buscando igrejas próximas...' : '📍 Usar Minha Localização (GPS)'}
            </button>
          </div>

          {geoError && <div className="ide-geo-error">{geoError}</div>}

          {userCoords && (
            <div className="ide-marco-zero-bar">
              <span>
                📌 Distância da sua localização até a <strong>Igreja Marco Zero (IASD Parque Cláudia)</strong>:{' '}
                <strong>{haversineKm(userCoords.lat, userCoords.lon, MARCO_ZERO.lat, MARCO_ZERO.lon).toFixed(1)} km</strong>
              </span>
            </div>
          )}

          <div className="ide-baptism-grid">
            <div className="ide-church-list">
              {churches.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  className={`ide-church-card ${selectedChurch?.id === ch.id ? 'active' : ''} ${ch.isMarcoZero ? 'is-marco-zero' : ''}`}
                  onClick={() => setSelectedChurch(ch)}
                >
                  <div className="ide-church-top">
                    <strong>{ch.name}</strong>
                    {ch.distanceKm != null && (
                      <span className="ide-dist-badge">{ch.distanceKm.toFixed(1)} km</span>
                    )}
                  </div>
                  <small className="ide-church-denom">{ch.denominationOrNote}</small>
                  <p className="ide-church-addr">📍 {ch.address}</p>
                  <p className="ide-church-baptism">💧 {ch.nextBaptismInfo}</p>
                  <p className="ide-church-contact">📞 {ch.pastoralContact}</p>
                </button>
              ))}
            </div>

            {selectedChurch && (
              <div className="ide-map-panel">
                <h3>{selectedChurch.name}</h3>
                <p>{selectedChurch.address}</p>
                <div className="ide-map-frame-wrap">
                  <iframe
                    title={`Mapa ${selectedChurch.name}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedChurch.lon - 0.015}%2C${selectedChurch.lat - 0.012}%2C${selectedChurch.lon + 0.015}%2C${selectedChurch.lat + 0.012}&layer=mapnik&marker=${selectedChurch.lat}%2C${selectedChurch.lon}`}
                    loading="lazy"
                  />
                </div>
                <div className="ide-map-actions">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedChurch.lat},${selectedChurch.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ide-btn-gold"
                  >
                    🗺️ Abrir Rota no Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 4: CERTIFICADO */}
      {subTab === 'certificate' && (
        <div className="ide-cert-wrap">
          <div className="ide-cert-card">
            <img src={ideLogo} alt="I.D.E. Boas Notícias" className="ide-cert-logo" />
            <span className="ide-cert-kicker">CERTIFICADO DE JORNADA BÍBLICA</span>
            <h2>{userName || 'Membro 1Convite'}</h2>
            <p>
              {completedCount === IDE_LESSONS.length
                ? 'Concluiu com êxito todas as 28 aulas do curso I.D.E. — Boas Notícias (de Gênesis ao Apocalipse), compreendendo Identidade, Destino e Eternidade em Cristo Jesus.'
                : `Você já concluiu ${completedCount} de ${IDE_LESSONS.length} aulas. Conclua toda a trilha para selar o seu certificado oficial!`}
            </p>
            <div className="ide-cert-footer">
              <span>1Convite • I.D.E. Boas Notícias</span>
              <span>Progresso: {Math.round((completedCount / IDE_LESSONS.length) * 100)}%</span>
            </div>
            {completedCount > 0 && (
              <button type="button" className="ide-btn-gold" onClick={() => window.print()}>
                🖨️ Imprimir / Salvar Certificado
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
