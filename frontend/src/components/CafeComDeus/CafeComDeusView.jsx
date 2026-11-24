import React, { useState, useEffect } from 'react';
import cafeData from '../../data/cafe_com_deus_365.json';
import { playNeuralSpeech, stopNeuralSpeech, isNeuralSpeaking } from '../../services/neuralAudioPlayer';
import './CafeComDeusView.css';

export default function CafeComDeusView({ onBack, isPremium = true, onOpenUpgrade, isDarkMode, onToggleDarkMode }) {
  // Calcula o dia atual do ano (1 a 365)
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return Math.max(1, Math.min(365, day));
  };

  // Converte número do dia (1 a 365) para a data real do calendário
  const getDateInfo = (dayNum, year = new Date().getFullYear()) => {
    const date = new Date(year, 0, dayNum);
    const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('pt-BR', { month: 'long' });
    const capWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    const capMonth = month.charAt(0).toUpperCase() + month.slice(1);
    return {
      formatted: `${capWeekday}, ${day} de ${capMonth}`,
      short: `${day} de ${capMonth}`,
      dayMonth: `${day} ${month.substring(0, 3)}`,
      headerTag: `${day} DE ${capMonth.toUpperCase()}`
    };
  };

  const todayDayNumber = getDayOfYear();
  const [selectedDay, setSelectedDay] = useState(todayDayNumber);
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const saved = localStorage.getItem('cafe-com-deus-completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [copied, setCopied] = useState(false);

  // Estados do Player de Áudio Neural
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState('pt-BR-FranciscaNeural');
  const [audioMode, setAudioMode] = useState('meditacao'); // 'meditacao' ou 'oracao'
  const [ambientPiano, setAmbientPiano] = useState(true);

  // Interrompe o áudio ao trocar de dia
  useEffect(() => {
    stopNeuralSpeech();
    setIsAudioPlaying(false);
    setIsAudioLoading(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
    setAudioDuration(0);
  }, [selectedDay]);

  // Limpeza de áudio ao sair da tela
  useEffect(() => {
    return () => {
      stopNeuralSpeech();
    };
  }, []);

  const formatAudioTime = (sec) => {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startAudioPlayback = (voiceToUse = selectedVoice, modeToUse = audioMode, ambientToUse = ambientPiano) => {
    stopNeuralSpeech();
    let textToSpeak = '';
    if (modeToUse === 'oracao') {
      textToSpeak = currentMeditation.prayer
        ? `Oração do Café com Deus para hoje. ${currentMeditation.prayer}`
        : `Oração do dia. Senhor, abençoa o nosso dia e guia os nossos passos. Em nome de Jesus, amém.`;
    } else {
      textToSpeak = `Café com Deus. ${currentMeditation.title}. ${currentMeditation.verse}. ${currentMeditation.body}. Oração do dia: ${currentMeditation.prayer || ''}`;
    }

    setIsAudioLoading(true);
    setIsAudioPlaying(true);
    setAudioProgress(0);

    playNeuralSpeech(textToSpeak, {
      voice: voiceToUse,
      rate: '-4%',
      ambient: ambientToUse,
      ambientVolume: 0.12,
      onStart: () => {
        setIsAudioLoading(false);
        setIsAudioPlaying(true);
      },
      onProgress: (current, duration, percent) => {
        setAudioCurrentTime(current);
        setAudioDuration(duration);
        setAudioProgress(percent);
      },
      onEnd: () => {
        setIsAudioPlaying(false);
        setIsAudioLoading(false);
        setAudioProgress(100);
      },
      onError: () => {
        setIsAudioPlaying(false);
        setIsAudioLoading(false);
      }
    });
  };

  const togglePlayAudio = () => {
    if (isAudioPlaying) {
      stopNeuralSpeech();
      setIsAudioPlaying(false);
      setIsAudioLoading(false);
      return;
    }
    startAudioPlayback(selectedVoice, audioMode, ambientPiano);
  };

  const handleSelectVoice = (voiceKey) => {
    setSelectedVoice(voiceKey);
    if (isAudioPlaying) {
      startAudioPlayback(voiceKey, audioMode, ambientPiano);
    }
  };

  const handleSelectMode = (modeKey) => {
    setAudioMode(modeKey);
    if (isAudioPlaying) {
      startAudioPlayback(selectedVoice, modeKey, ambientPiano);
    }
  };

  // Informações de data do dia selecionado
  const currentDateInfo = getDateInfo(selectedDay);
  const prevDateInfo = selectedDay > 1 ? getDateInfo(selectedDay - 1) : null;
  const nextDateInfo = selectedDay < 365 ? getDateInfo(selectedDay + 1) : null;

  // Busca a meditação correspondente ao dia selecionado
  const currentMeditation = cafeData.find(item => item.day === selectedDay) || cafeData[0];

  const isCompleted = completedDays.includes(selectedDay);

  const toggleComplete = () => {
    let updated;
    if (isCompleted) {
      updated = completedDays.filter(d => d !== selectedDay);
    } else {
      updated = [...completedDays, selectedDay];
    }
    setCompletedDays(updated);
    try {
      localStorage.setItem('cafe-com-deus-completed', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `*Café com Deus • ${currentDateInfo.formatted} (Dia ${currentMeditation.day})*\n` +
      `*${currentMeditation.title}*\n\n` +
      `"${currentMeditation.verse}"\n\n` +
      `${currentMeditation.body.substring(0, 320)}...\n\n` +
      `☕ _Meditação diária no aplicativo 1Convite:_ https://1convite.com.br`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopy = () => {
    const fullText = `${currentMeditation.title}\n${currentDateInfo.formatted} (Dia ${currentMeditation.day})\n\n${currentMeditation.verse}\n\n${currentMeditation.body}\n\nOração:\n${currentMeditation.prayer}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrev = () => {
    if (selectedDay > 1) setSelectedDay(selectedDay - 1);
  };

  const handleNext = () => {
    if (selectedDay < 365) setSelectedDay(selectedDay + 1);
  };

  return (
    <div className="cafe-container animate-fade-in">
      {/* Topo / Header */}
      <header className="cafe-header">
        <button onClick={onBack} className="cafe-back-btn" aria-label="Voltar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="cafe-title-wrap">
          <div className="cafe-badge">
            <span className="cafe-badge-dot" />
            <span>DEVOCIONAL 365 DIAS</span>
          </div>
          <h1 className="cafe-main-title">Café com Deus</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Botão de Alternar Modo Claro / Escuro Rápido */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="cafe-cal-btn"
              aria-label="Alternar modo claro ou escuro"
              title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            >
              {isDarkMode ? (
                // Ícone Sol (Modo Claro)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                // Ícone Lua (Modo Escuro)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          )}

          <button 
            onClick={() => setShowCalendar(!showCalendar)} 
            className={`cafe-cal-btn ${showCalendar ? 'active' : ''}`}
            aria-label="Abrir calendário"
            title="Ver todos os 365 dias do ano"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </button>
        </div>
      </header>

      {/* Seletor / Dropdown de Calendário */}
      {showCalendar && (
        <div className="cafe-calendar-panel animate-scale-up">
          <div className="cafe-calendar-header">
            <h3>Calendário Diário das 365 Meditações</h3>
            <span className="cafe-cal-sub">{completedDays.length} de 365 dias concluídos</span>
          </div>

          <div className="cafe-quick-actions">
            <button 
              onClick={() => { setSelectedDay(todayDayNumber); setShowCalendar(false); }}
              className="cafe-btn-today"
            >
              Ir para Hoje ({getDateInfo(todayDayNumber).short} • Dia {todayDayNumber})
            </button>
          </div>

          <div className="cafe-days-grid">
            {Array.from({ length: 365 }, (_, i) => i + 1).map(day => (
              <button
                key={day}
                onClick={() => { setSelectedDay(day); setShowCalendar(false); }}
                className={`cafe-day-dot ${selectedDay === day ? 'selected' : ''} ${completedDays.includes(day) ? 'completed' : ''} ${day === todayDayNumber ? 'is-today' : ''}`}
                title={`Dia ${day}: ${getDateInfo(day).short}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navegação com Data do Calendário e Número do Dia */}
      <div className="cafe-nav-bar">
        <button 
          onClick={handlePrev} 
          disabled={selectedDay <= 1} 
          className="cafe-nav-arrow"
          aria-label="Dia anterior"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>{prevDateInfo ? prevDateInfo.dayMonth : 'Início'}</span>
        </button>

        <div className="cafe-current-indicator">
          <span className="cafe-day-tag">
            {selectedDay === todayDayNumber ? 'HOJE • ' : ''}{currentDateInfo.headerTag}
          </span>
          <span className="cafe-day-number-sub">DIA {selectedDay} / 365</span>
        </div>

        <button 
          onClick={handleNext} 
          disabled={selectedDay >= 365} 
          className="cafe-nav-arrow"
          aria-label="Próximo dia"
        >
          <span>{nextDateInfo ? nextDateInfo.dayMonth : 'Fim'}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Player Devocional com Voz Neural de Estúdio */}
      <section className="cafe-audio-card" aria-label="Player de Áudio Devocional">
        <div className="cafe-audio-header">
          <div className="cafe-audio-title-group">
            <span className="cafe-audio-badge-ai">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              VOZ NEURAL
            </span>
            <span className="cafe-audio-sub">Narração com Piano Instrumental</span>
          </div>

          {isAudioPlaying && !isAudioLoading && (
            <div className="cafe-equalizer" title="Áudio em reprodução">
              <span className="cafe-eq-bar" />
              <span className="cafe-eq-bar" />
              <span className="cafe-eq-bar" />
              <span className="cafe-eq-bar" />
            </div>
          )}
        </div>

        <div className="cafe-audio-main-row">
          <button
            onClick={togglePlayAudio}
            className={`cafe-audio-play-btn ${isAudioLoading ? 'is-loading' : ''}`}
            aria-label={isAudioPlaying ? 'Pausar áudio' : 'Ouvir devocional'}
            title={isAudioPlaying ? 'Pausar narração' : 'Ouvir narração do dia'}
          >
            {isAudioLoading ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : isAudioPlaying ? (
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '2px' }}>
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
              </svg>
            )}
          </button>

          <div className="cafe-audio-info-col">
            <div className="cafe-audio-track-name">
              {audioMode === 'meditacao' ? `Meditação: ${currentMeditation.title}` : `Oração do Dia ${selectedDay}`}
              <span className="cafe-audio-voice-badge">
                • Voz de {selectedVoice === 'pt-BR-FranciscaNeural' ? 'Francisca' : 'Antônio'}
              </span>
            </div>

            <div className="cafe-progress-track">
              <div 
                className="cafe-progress-fill" 
                style={{ width: `${Math.min(100, Math.max(0, audioProgress))}%` }} 
              />
            </div>

            <div className="cafe-audio-times">
              <span>{formatAudioTime(audioCurrentTime)}</span>
              <span>{isAudioLoading ? 'Carregando voz...' : (audioDuration > 0 ? formatAudioTime(audioDuration) : 'Voz Humana')}</span>
            </div>
          </div>
        </div>

        {/* Seletor Visível das Vozes: Francisca e Antônio Lado a Lado */}
        <div className="cafe-voice-bar">
          <span className="cafe-voice-bar-title">Escolha quem narra para você:</span>
          <div className="cafe-voice-pills-wrap">
            <button
              type="button"
              onClick={() => handleSelectVoice('pt-BR-FranciscaNeural')}
              className={`cafe-voice-pill ${selectedVoice === 'pt-BR-FranciscaNeural' ? 'is-active' : ''}`}
              title="Voz feminina serena, aveludada e reflexiva"
            >
              <span className="cafe-voice-avatar-badge fem">F</span>
              <div className="cafe-voice-pill-text">
                <strong>Francisca</strong>
                <small>Serena & Doce</small>
              </div>
              {selectedVoice === 'pt-BR-FranciscaNeural' && <span className="cafe-voice-pill-check">✓</span>}
            </button>

            <button
              type="button"
              onClick={() => handleSelectVoice('pt-BR-AntonioNeural')}
              className={`cafe-voice-pill ${selectedVoice === 'pt-BR-AntonioNeural' ? 'is-active' : ''}`}
              title="Voz masculina grave, acolhedora e pastoral"
            >
              <span className="cafe-voice-avatar-badge masc">A</span>
              <div className="cafe-voice-pill-text">
                <strong>Antônio</strong>
                <small>Pastoral & Firme</small>
              </div>
              {selectedVoice === 'pt-BR-AntonioNeural' && <span className="cafe-voice-pill-check">✓</span>}
            </button>
          </div>
        </div>

        {/* Barra de Ajustes Secundários: Modo e Piano */}
        <div className="cafe-audio-options-bar">
          {/* Seletor de Modo */}
          <button
            onClick={() => handleSelectMode('meditacao')}
            className={`cafe-opt-chip ${audioMode === 'meditacao' ? 'active' : ''}`}
            title="Ouvir reflexão bíblica e oração completas"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Meditação Completa</span>
          </button>

          <button
            onClick={() => handleSelectMode('oracao')}
            className={`cafe-opt-chip ${audioMode === 'oracao' ? 'active' : ''}`}
            title="Ouvir apenas a oração matinal"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span>Apenas Oração</span>
          </button>

          {/* Toggle de Piano Suave */}
          <button
            onClick={() => {
              const nextAmbient = !ambientPiano;
              setAmbientPiano(nextAmbient);
              if (isAudioPlaying) {
                startAudioPlayback(selectedVoice, audioMode, nextAmbient);
              }
            }}
            className={`cafe-opt-chip ${ambientPiano ? 'active' : ''}`}
            title="Ligar ou desligar piano de fundo"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            <span>{ambientPiano ? 'Piano: Ligado' : 'Piano: Desligado'}</span>
          </button>
        </div>
      </section>

      {/* Card da Meditação */}
      <article className="cafe-card">
        {/* Topo do Card com Data e Ícone */}
        <div className="cafe-card-top-row">
          <div className="cafe-icon-badge">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>

          <div className="cafe-date-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{currentDateInfo.formatted}</span>
          </div>
        </div>

        <h2 className="cafe-card-title">{currentMeditation.title}</h2>

        {/* Versículo Bíblico Chave */}
        <div className="cafe-verse-box">
          <svg className="cafe-quote-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
          </svg>
          <blockquote className="cafe-verse-text">
            {currentMeditation.verse}
          </blockquote>
        </div>

        {/* Corpo da Meditação */}
        <div className="cafe-body-content">
          {currentMeditation.body.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="cafe-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Bloco da Oração Matinal */}
        {currentMeditation.prayer && (
          <div className="cafe-prayer-card">
            <div className="cafe-prayer-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>Oração do Café com Deus</span>
            </div>
            <p className="cafe-prayer-text">{currentMeditation.prayer}</p>
          </div>
        )}

        {/* Barra de Ações: Concluir / Compartilhar / Copiar */}
        <div className="cafe-actions-row">
          <button 
            onClick={toggleComplete}
            className={`cafe-complete-btn ${isCompleted ? 'is-done' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{isCompleted ? 'Meditação Concluída' : 'Marcar como Concluída'}</span>
          </button>

          <div className="cafe-secondary-actions">
            <button 
              onClick={handleShareWhatsApp}
              className="cafe-icon-btn cafe-whatsapp-btn"
              title="Compartilhar no WhatsApp"
              aria-label="Compartilhar no WhatsApp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </button>

            <button 
              onClick={handleCopy}
              className="cafe-icon-btn"
              title="Copiar texto"
              aria-label="Copiar texto"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>

        {copied && (
          <div className="cafe-toast animate-fade-in">
            Meditação copiada para a área de transferência!
          </div>
        )}
      </article>
    </div>
  );
}
