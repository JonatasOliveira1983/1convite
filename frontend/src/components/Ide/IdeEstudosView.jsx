import React, { useState, useEffect, useRef, useMemo } from 'react';
import './IdeEstudosView.css';
import { IDE_BLOCKS, IDE_LESSONS } from '../../data/ideCurriculum';
import ideLogo from '../../assets/ide/ide-logo.jpg';
import ideStudioImg from '../../assets/ide/ide-podcast-studio.jpg';
import BaptismMap from './BaptismMap';

function getIdeApiBase() {
  const isCapacitor = Boolean(
    (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Capacitor'))
  );
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost && !isCapacitor
    ? 'http://localhost:3001/api/v1'
    : import.meta.env.VITE_API_URL || 'https://oneconvite.onrender.com/api/v1';
}

const MARCO_ZERO = {
  id: 'marco_zero_iasd_parque_claudia',
  name: 'IASD Parque Cláudia (Marco Zero)',
  denominationOrNote: 'Marco Zero do Projeto 1Convite / IDE • Igreja Adventista do Sétimo Dia',
  address: 'Rua Durval Guerra de Azevedo, 1177 — Parque Santo Antônio / Parque Cláudia, São Paulo - SP, CEP 05852-440',
  lat: -23.7042,
  lon: -46.7628,
  nextBaptismInfo: 'Celebrações batismais mensais • Agendamento pastoral aberto',
  pastoralContact: 'Recepção Pastoral Parque Cláudia • Facebook Oficial',
  facebookUrl: 'https://web.facebook.com/IasdPqClaudia/',
  isMarcoZero: true,
  isAdventist: true,
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

  // Podcast Audio Player state
  const audioRef = useRef(null);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Baptism / GPS Locator state (aba separada)
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [addressInput, setAddressInput] = useState('');
  const [searchRadius, setSearchRadius] = useState(15);
  const [onlyAdventist, setOnlyAdventist] = useState(false);
  const [originLabel, setOriginLabel] = useState('');
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
    () => IDE_LESSONS.filter((l) => progressMap[l.lessonNumber]?.status === 'concluida').length,
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

  const fetchChurchesFromApi = async ({ lat, lon, cep, q, radius = searchRadius, adventist = onlyAdventist }) => {
    setGeoLoading(true);
    setGeoError('');
    try {
      const params = new URLSearchParams();
      if (lat != null && lon != null) {
        params.set('lat', String(lat));
        params.set('lon', String(lon));
      }
      if (cep) params.set('cep', cep);
      if (q) params.set('q', q);
      params.set('radius', String(radius));
      if (adventist) params.set('adventist', 'true');

      const resp = await fetch(`${getIdeApiBase()}/igrejas/proximas?${params.toString()}`);
      const data = await resp.json();
      if (data?.success && Array.isArray(data.churches) && data.churches.length > 0) {
        if (data.originCoords) setUserCoords(data.originCoords);
        if (data.originLabel) setOriginLabel(data.originLabel);
        setChurches(data.churches);
        const firstNonMarco = data.churches.find((c) => !c.isMarcoZero) || data.churches[0];
        setSelectedChurch(firstNonMarco);
      } else {
        setGeoError(data?.message || 'Nenhuma igreja encontrada nessa região.');
      }
    } catch {
      if (lat != null && lon != null) {
        const fallback = CURATED_CHURCHES.map((c) => ({
          ...c,
          distanceKm: haversineKm(lat, lon, c.lat, c.lon),
        })).sort((a, b) => a.distanceKm - b.distanceKm);
        setChurches(fallback);
        setSelectedChurch(fallback[0]);
      } else {
        setGeoError('Erro de conexão ao consultar igrejas próximas.');
      }
    } finally {
      setGeoLoading(false);
    }
  };

  const handleLocateChurches = () => {
    if (!navigator.geolocation) {
      setGeoError('Seu navegador não suporta geolocalização. Digite seu CEP ou cidade abaixo.');
      return;
    }
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserCoords({ lat, lon });
        setOriginLabel('Sua localização atual (GPS)');
        fetchChurchesFromApi({ lat, lon });
      },
      () => {
        setGeoLoading(false);
        setGeoError('Não foi possível acessar o GPS. Digite seu CEP ou cidade abaixo para buscar igrejas.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearchByAddress = (e) => {
    if (e) e.preventDefault();
    const raw = addressInput.trim();
    if (!raw) return;
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 8) {
      fetchChurchesFromApi({ cep: digits });
    } else {
      fetchChurchesFromApi({ q: raw });
    }
  };

  const handlePrintLesson = (lesson) => {
    const notes = progressMap[lesson.lessonNumber]?.reflectionText || '';
    const qaList = Array.isArray(lesson.questionsAndAnswers) ? lesson.questionsAndAnswers : [];
    const bannerSrc = lesson.bannerImage ? `${window.location.origin}${lesson.bannerImage}` : '';
    const logoSrc = ideLogo;

    const win = window.open('', '_blank', 'width=900,height=1040');
    if (!win) return;
    win.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="utf-8" />
          <title>Guia de Estudos IDE Boas Notícias • Aula ${lesson.lessonNumber}</title>
          <style>
            @page { size: A4; margin: 16mm 15mm; }
            * { box-sizing: border-box; }
            body {
              font-family: Georgia, 'Times New Roman', serif;
              color: #111827;
              background: #ffffff;
              line-height: 1.65;
              font-size: 12.5pt;
              margin: 0;
              padding: 0;
            }
            .doc-wrap { max-width: 100%; margin: 0 auto; }
            .doc-brand {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #d97706;
              padding-bottom: 10px;
              margin-bottom: 14px;
            }
            .doc-brand img { height: 48px; border-radius: 8px; }
            .doc-brand-meta { text-align: right; font-family: Arial, sans-serif; font-size: 10pt; color: #4b5563; }
            .doc-hero-img {
              width: 100%;
              height: 210px;
              object-fit: cover;
              border-radius: 12px;
              margin-bottom: 16px;
              border: 1px solid #e5e7eb;
            }
            .block-kicker {
              font-family: Arial, sans-serif;
              font-size: 9.5pt;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              color: #b45309;
              margin-bottom: 4px;
            }
            h1 {
              font-size: 20pt;
              color: #111827;
              margin: 0 0 8px;
              line-height: 1.25;
            }
            .summary { font-size: 11.5pt; color: #374151; margin: 0 0 12px; }
            .refs {
              font-family: Arial, sans-serif;
              font-size: 10.5pt;
              background: #fffbeb;
              border: 1px solid #fcd34d;
              padding: 9px 13px;
              border-radius: 8px;
              margin-bottom: 18px;
            }
            h2 {
              font-family: Arial, sans-serif;
              font-size: 13pt;
              color: #92400e;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
              margin: 22px 0 12px;
              break-after: avoid;
            }
            .list-item {
              margin-bottom: 13px;
              padding: 11px 14px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              break-inside: avoid;
            }
            .list-item strong { display: block; margin-bottom: 4px; color: #111827; }
            .qa-item {
              margin-bottom: 14px;
              padding: 12px 15px;
              border: 1px solid #e5e7eb;
              border-left: 4px solid #b91c1c;
              border-radius: 8px;
              background: #fff;
              break-inside: avoid;
            }
            .qa-q {
              font-weight: 700;
              color: #111827;
              margin-bottom: 6px;
            }
            .qa-a {
              color: #b91c1c;
              font-weight: 600;
              margin: 0;
            }
            .verse-box {
              background: #fffbeb;
              border-left: 4px solid #d97706;
              padding: 10px 14px;
              margin-bottom: 10px;
              border-radius: 0 8px 8px 0;
              break-inside: avoid;
            }
            .notes-box {
              border: 1.5px dashed #9ca3af;
              border-radius: 10px;
              padding: 14px;
              min-height: 115px;
              background: #fcfcfd;
              break-inside: avoid;
            }
            .appeal-box {
              margin-top: 20px;
              background: #fef3c7;
              border: 1.5px solid #d97706;
              border-radius: 10px;
              padding: 14px 16px;
              break-inside: avoid;
            }
          </style>
        </head>
        <body>
          <div class="doc-wrap">
            <div class="doc-brand">
              <img src="${logoSrc}" alt="IDE Boas Notícias" />
              <div class="doc-brand-meta">
                <strong>Guia de Estudos Oficial • 1Convite</strong><br/>
                Aula ${lesson.lessonNumber} de ${IDE_LESSONS.length}
              </div>
            </div>

            ${bannerSrc ? `<img src="${bannerSrc}" alt="${lesson.title}" class="doc-hero-img" />` : ''}

            <div class="block-kicker">Bloco ${lesson.blockNumber} • ${lesson.blockTitle}</div>
            <h1>${lesson.title}</h1>
            <p class="summary">${lesson.summary}</p>
            <div class="refs"><strong>Textos Bíblicos para Leitura:</strong> ${lesson.bibleReferences.join(' • ')}</div>

            <h2>1. Visão Geral do Estudo</h2>
            <p>${lesson.overview}</p>

            <h2>2. Pilares da Palavra</h2>
            ${lesson.pillars
              .map(
                (p, idx) =>
                  `<div class="list-item"><strong>${idx + 1}. ${p.title}</strong><span>${p.body}</span></div>`
              )
              .join('')}

            <h2>3. Perguntas & Respostas do Estudo</h2>
            ${qaList
              .map(
                (qa, idx) =>
                  `<div class="qa-item"><div class="qa-q">Pergunta ${idx + 1}: ${qa.question}</div><p class="qa-a">Resposta: ${qa.answer}</p></div>`
              )
              .join('')}

            <h2>4. Versículos para Meditação</h2>
            ${lesson.meditationVerses
              .map(
                (v) =>
                  `<div class="verse-box">“${v.text}”<br/><strong>— ${v.reference}</strong></div>`
              )
              .join('')}

            <h2>5. Passo Prático</h2>
            <div class="list-item">${lesson.practicalStep}</div>

            <h2>6. Minhas Anotações Pessoais</h2>
            <p style="font-size:10.5pt;color:#4b5563;margin-top:0;"><em>${lesson.reflectionPrompt}</em></p>
            <div class="notes-box">${
              notes
                ? notes.replace(/\n/g, '<br/>')
                : '<br/><br/><br/><br/>'
            }</div>

            <div class="appeal-box">
              <strong style="color:#92400e;">Chamado de Fé & Batismo (Marcos 16:15–16):</strong><br/>
              <strong>${lesson.appealHeadline}</strong><br/>
              <span>${lesson.appealBody}</span>
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  // ── TELA DE DETALHE DA AULA ─────────────────────────────────────────────
  if (activeLesson) {
    const p = progressMap[activeLesson.lessonNumber] || {};
    const selectedQuiz = Array.isArray(p.selectedQuizAnswers) ? p.selectedQuizAnswers : [-1, -1, -1];
    const isCompleted = p.status === 'concluida';
    const qaList = Array.isArray(activeLesson.questionsAndAnswers)
      ? activeLesson.questionsAndAnswers
      : [];

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

        {/* Player de Podcast com Pedro & Lívia sempre no topo */}
        <section className="ide-podcast-card">
          <div className="ide-studio-banner">
            <img src={ideStudioImg} alt="Podcast IDE Boas Notícias — Lívia e Pedro" className="ide-studio-img" />
            <div className="ide-studio-overlay">
              <div className="ide-hosts-badges">
                <span className="ide-host-pill">🎙️ Lívia • Perguntas & Leitura</span>
                <span className="ide-host-pill">🎙️ Pedro • Instrutor Bíblico</span>
              </div>
              <h3>Podcast IDE Boas Notícias — Episódio {activeLesson.lessonNumber}</h3>
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
              <span>🎧 Episódio {activeLesson.lessonNumber} em preparação final de áudio</span>
              <small>Acompanhe todo o Guia de Estudos completo logo abaixo e baixe o PDF.</small>
            </div>
          )}

          <div className="ide-script-toggle-row">
            <span className="ide-guide-tip">
              📖 Pegue sua Bíblia física (ou abra no app) e faça suas anotações abaixo.
            </span>
            <button type="button" className="ide-pdf-btn" onClick={() => handlePrintLesson(activeLesson)}>
              📄 Baixar Guia em PDF
            </button>
          </div>
        </section>

        {/* Imagem Horizontal Temática do Estudo do Dia (logo abaixo do Podcast) */}
        <div className="ide-lesson-hero-image-wrap">
          <img
            src={activeLesson.bannerImage || ideStudioImg}
            alt={activeLesson.title}
            className="ide-lesson-hero-image"
            onError={(e) => {
              e.currentTarget.src = ideStudioImg;
            }}
          />
        </div>

        <div className="ide-lesson-header">
          <span className="ide-block-tag">
            Bloco {activeLesson.blockNumber} • {activeLesson.blockTitle}
          </span>
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

        {/* Guia de Estudo em Lista Única Vertical */}
        <section className="ide-study-section">
          <h2>1. Visão Geral do Estudo</h2>
          <p className="ide-overview-text">{activeLesson.overview}</p>

          <h2>2. Pilares da Palavra</h2>
          <div className="ide-pillars-list">
            {activeLesson.pillars.map((pil, i) => (
              <div key={i} className="ide-pillar-item">
                <div className="ide-pillar-head">
                  <span className="ide-pillar-num">{i + 1}</span>
                  <h4>{pil.title}</h4>
                </div>
                <p>{pil.body}</p>
              </div>
            ))}
          </div>

          <h2>3. Perguntas & Respostas do Estudo</h2>
          <div className="ide-qa-list">
            {qaList.map((qa, idx) => (
              <div key={idx} className="ide-qa-item">
                <p className="ide-qa-question">
                  <strong>Pergunta {idx + 1}:</strong> {qa.question}
                </p>
                <p className="ide-qa-answer">
                  <strong>Resposta:</strong> {qa.answer}
                </p>
              </div>
            ))}
          </div>

          <h2>4. Versículos para Meditação</h2>
          <div className="ide-verses-list">
            {activeLesson.meditationVerses.map((v, i) => (
              <blockquote key={i} className="ide-verse-quote">
                <p>“{v.text}”</p>
                <cite>— {v.reference}</cite>
              </blockquote>
            ))}
          </div>

          <h2>5. Passo Prático</h2>
          <div className="ide-practical-box">
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

        {/* Apelo ao Batismo (sem GPS/mapa aqui — GPS fica na aba separada) */}
        <section className="ide-appeal-card">
          <span className="ide-appeal-badge">Decisão & Batismo • Marcos 16:15–16</span>
          <h3>{activeLesson.appealHeadline}</h3>
          <p>{activeLesson.appealBody}</p>
          <div className="ide-appeal-actions">
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
            <button
              type="button"
              className="ide-pdf-btn"
              onClick={() => handlePrintLesson(activeLesson)}
            >
              📄 Baixar Guia em PDF
            </button>
          </div>
        </section>
      </div>
    );
  }

  // ── TELA PRINCIPAL DO MÓDULO IDE ────────────────────────────────────────
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

      {/* Hero IDE Boas Notícias */}
      <section className="ide-hero-banner">
        <div className="ide-hero-left">
          <div className="ide-hero-brand-row">
            <img src={ideLogo} alt="IDE Boas Notícias" className="ide-hero-logo" />
            <div className="ide-hero-title-group">
              <span className="ide-podcast-tag">🎙️ PODCAST • 28 EPISÓDIOS</span>
              <h1 className="ide-hero-title">IDE Boas Notícias</h1>
              <span className="ide-hero-verse">“Ide e pregai o evangelho a toda criatura” (Mc 16:15)</span>
            </div>
          </div>

          <div className="ide-acronym-row">
            <div className="ide-acronym-pill">
              <strong>I</strong>
              <div>
                <span>Identidade</span>
                <small>Filhos à imagem de Deus</small>
              </div>
            </div>
            <div className="ide-acronym-pill">
              <strong>D</strong>
              <div>
                <span>Destino</span>
                <small>Propósito pela graça</small>
              </div>
            </div>
            <div className="ide-acronym-pill">
              <strong>E</strong>
              <div>
                <span>Eternidade</span>
                <small>O Reino que não terá fim</small>
              </div>
            </div>
          </div>

          <p className="ide-hero-desc">
            Estudo bíblico completo de <strong>Gênesis ao Apocalipse</strong> com <strong>Pedro & Lívia</strong>, Guia de Estudos em PDF, Anotações, Quiz e Certificado.
          </p>
          <div className="ide-progress-bar-bg">
            <div
              className="ide-progress-bar-fill"
              style={{ width: `${Math.round((completedCount / IDE_LESSONS.length) * 100)}%` }}
            />
          </div>
        </div>
        <div className="ide-hero-right">
          <img src={ideStudioImg} alt="Pedro e Lívia no Podcast IDE" className="ide-hero-studio" />
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
                  {lesson.bannerImage && (
                    <img
                      src={lesson.bannerImage}
                      alt={lesson.title}
                      className="ide-lesson-card-thumb"
                      loading="lazy"
                    />
                  )}
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

      {/* ABA 3: IGREJAS & BATISMO (ABA SEPARADA DEDICADA) */}
      {subTab === 'baptism' && (
        <div className="ide-baptism-wrap">
          <div className="ide-baptism-hero">
            <div>
              <h2>“Quem crer e for batizado será salvo” (Marcos 16:16)</h2>
              <p>
                Encontre igrejas cristãs perto de você pelo <strong>GPS</strong> ou digitando seu <strong>CEP / Cidade</strong>, veja todas no mapa interativo, confira a distância até a <strong>Igreja Marco Zero (IASD Parque Cláudia)</strong> e acesse o contato pastoral.
              </p>
            </div>
            <button
              type="button"
              className="ide-btn-gold"
              disabled={geoLoading}
              onClick={handleLocateChurches}
            >
              {geoLoading ? 'Buscando igrejas...' : '📍 Usar Minha Localização (GPS)'}
            </button>
          </div>

          <div className="ide-baptism-controls">
            <form onSubmit={handleSearchByAddress} className="ide-baptism-search-row">
              <input
                type="text"
                placeholder="Digite seu CEP (ex: 05852-440) ou Cidade / Bairro..."
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
              />
              <button type="submit" className="ide-btn-gold" disabled={geoLoading}>
                Buscar Endereço
              </button>
            </form>

            <div className="ide-baptism-filters-row">
              {[5, 15, 30].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`ide-filter-chip ${searchRadius === r ? 'active' : ''}`}
                  onClick={() => {
                    setSearchRadius(r);
                    if (userCoords) fetchChurchesFromApi({ lat: userCoords.lat, lon: userCoords.lon, radius: r });
                  }}
                >
                  Raio {r} km
                </button>
              ))}
              <button
                type="button"
                className={`ide-filter-chip ${onlyAdventist ? 'active' : ''}`}
                onClick={() => {
                  const nextAdv = !onlyAdventist;
                  setOnlyAdventist(nextAdv);
                  if (userCoords) {
                    fetchChurchesFromApi({ lat: userCoords.lat, lon: userCoords.lon, adventist: nextAdv });
                  }
                }}
              >
                {onlyAdventist ? '✓ Somente Adventistas (IASD)' : 'Filtrar: Adventistas (IASD)'}
              </button>
            </div>
          </div>

          {geoError && <div className="ide-geo-error">{geoError}</div>}

          {userCoords && (
            <div className="ide-marco-zero-bar">
              <span>
                📌 <strong>{originLabel || 'Origem'}</strong> • Distância até a <strong>Igreja Marco Zero (IASD Parque Cláudia)</strong>:{' '}
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
                <BaptismMap
                  churches={churches}
                  selectedChurch={selectedChurch}
                  userCoords={userCoords}
                  onSelectChurch={setSelectedChurch}
                />
                <div className="ide-map-actions">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedChurch.lat},${selectedChurch.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ide-btn-gold"
                  >
                    🗺️ Abrir Rota no Google Maps
                  </a>
                  {selectedChurch.facebookUrl && (
                    <a
                      href={selectedChurch.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ide-pdf-btn"
                    >
                      📘 Página Oficial (IASD Parque Cláudia)
                    </a>
                  )}
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
            <img src={ideLogo} alt="IDE Boas Notícias" className="ide-cert-logo" />
            <span className="ide-cert-kicker">CERTIFICADO DE JORNADA BÍBLICA</span>
            <h2>{userName || 'Membro 1Convite'}</h2>
            <p>
              {completedCount === IDE_LESSONS.length
                ? 'Concluiu com êxito todas as 28 aulas do curso IDE — Boas Notícias (de Gênesis ao Apocalipse), compreendendo Identidade, Destino e Eternidade em Cristo Jesus.'
                : `Você já concluiu ${completedCount} de ${IDE_LESSONS.length} aulas. Conclua toda a trilha para selar o seu certificado oficial!`}
            </p>
            <div className="ide-cert-footer">
              <span>1Convite • IDE Boas Notícias</span>
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
