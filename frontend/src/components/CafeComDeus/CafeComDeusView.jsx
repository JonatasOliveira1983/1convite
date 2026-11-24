import React, { useState, useEffect, useRef } from 'react';
import { renderCardToHD } from '../../utils/cardCanvasGenerator';
import cafeData from '../../data/cafe_com_deus_365.json';
import sinteseData from '../../data/cafeComDeusSintese365.json';
import { playNeuralSpeech, stopNeuralSpeech, isNeuralSpeaking } from '../../services/neuralAudioPlayer';
import './CafeComDeusView.css';

export default function CafeComDeusView({ 
  onBack, 
  isPremium = true, 
  onOpenUpgrade, 
  isDarkMode, 
  onToggleDarkMode, 
  initialStep = 1,
  onNavigateTemplo 
}) {
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
  const [currentStep, setCurrentStep] = useState(initialStep || 1); // 1 = Meditação, 2 = Síntese, 3 = Oração, 4 = Criar 1Convite

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
  const [ambientPiano, setAmbientPiano] = useState(true);

  // Estados do Estúdio 1Convite (Passo 4)
  const [cardFormat, setCardFormat] = useState('square'); // 'square' (1:1) ou 'story' (9:16)
  const [cardSelectedIntent, setCardSelectedIntent] = useState('palavra'); // 'palavra', 'cafe', 'treino', 'igreja', 'custom'
  const [cardCustomText, setCardCustomText] = useState('');
  const [cardSelectedBg, setCardSelectedBg] = useState(0);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const cardPreviewRef = useRef(null);

  // Interrompe o áudio ao trocar de dia ou passo
  useEffect(() => {
    stopNeuralSpeech();
    setIsAudioPlaying(false);
    setIsAudioLoading(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
    setAudioDuration(0);
  }, [selectedDay, currentStep]);

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

  // Informações de data do dia selecionado
  const currentDateInfo = getDateInfo(selectedDay);
  const prevDateInfo = selectedDay > 1 ? getDateInfo(selectedDay - 1) : null;
  const nextDateInfo = selectedDay < 365 ? getDateInfo(selectedDay + 1) : null;

  // Busca a meditação e a síntese correspondentes
  const currentMeditation = cafeData.find(item => item.day === selectedDay) || cafeData[0];
  const currentSintese = sinteseData.find(item => item.day === selectedDay) || sinteseData[0];

  const isCompleted = completedDays.includes(selectedDay);

  // Acervo Curado de Imagens em Alta Resolução (Pelo menos 2 para cada categoria)
  const CARD_BACKGROUNDS = [
    // Categoria 1: Palavra de Hoje (2 imagens)
    {
      id: 'palavra_montanhas',
      label: 'Montanhas & Alvorada',
      category: 'palavra',
      type: 'image',
      url: '/assets/feed/hero_mountains.jpg'
    },
    {
      id: 'palavra_biblia',
      label: 'Bíblia & Luz Sagrada',
      category: 'palavra',
      type: 'image',
      url: '/assets/feed/palavra_biblia.jpg'
    },
    // Categoria 2: Café & Conversa (2 imagens)
    {
      id: 'cafe_xicara',
      label: 'Xícara Artesanal',
      category: 'cafe',
      type: 'image',
      url: '/assets/feed/cafe_xicara.jpg'
    },
    {
      id: 'cafe_conversa',
      label: 'Café & Comunhão',
      category: 'cafe',
      type: 'image',
      url: '/assets/feed/cafe_conversa.jpg'
    },
    // Categoria 3: Cuidar do Templo (2 imagens)
    {
      id: 'templo_atleta',
      label: 'Atleta no Cume',
      category: 'treino',
      type: 'image',
      url: '/assets/feed/treino_templo.jpg'
    },
    {
      id: 'templo_saude',
      label: 'Saúde & Vitalidade',
      category: 'treino',
      type: 'image',
      url: '/assets/feed/templo_saude.jpg'
    },
    // Categoria 4: Igreja & Fé (2 imagens)
    {
      id: 'igreja_santuario',
      label: 'Santuário Sagrado',
      category: 'igreja',
      type: 'image',
      url: '/assets/feed/igreja_santuario.jpg'
    },
    {
      id: 'igreja_adoracao',
      label: 'Celebração & Fé',
      category: 'igreja',
      type: 'image',
      url: '/assets/feed/igreja_adoracao.jpg'
    },
    // Gradientes Cinematográficos de Estúdio
    {
      id: 'dourado',
      label: 'Dourado Real',
      category: 'custom',
      type: 'gradient',
      colors: ['#2A1D0D', '#0F0A04'],
      css: 'linear-gradient(145deg, #2A1D0D 0%, #150E05 100%)'
    },
    {
      id: 'purpura',
      label: 'Púrpura Celestial',
      category: 'custom',
      type: 'gradient',
      colors: ['#221040', '#0A0414'],
      css: 'linear-gradient(145deg, #221040 0%, #0A0414 100%)'
    }
  ];

  const activeBg = CARD_BACKGROUNDS[cardSelectedBg] || CARD_BACKGROUNDS[0];

  // Filtra fundos da categoria ativa com destaque
  const categoryBgs = CARD_BACKGROUNDS.filter(bg => 
    cardSelectedIntent === 'custom' ? true : bg.category === cardSelectedIntent || bg.category === 'custom'
  );

  // Troca de intenção com seleção automática do fundo temático correspondente
  const handleSelectIntent = (intentKey) => {
    setCardSelectedIntent(intentKey);
    const firstMatchIdx = CARD_BACKGROUNDS.findIndex(bg => bg.category === intentKey);
    if (firstMatchIdx !== -1) {
      setCardSelectedBg(firstMatchIdx);
    }
  };

  // Textos para o Card baseado na intenção escolhida
  const getCardContent = () => {
    switch (cardSelectedIntent) {
      case 'cafe':
        return {
          title: 'CONVITE PARA UM CAFÉ',
          text: 'Que tal a gente tomar um café hoje ou esses dias para colocar a conversa em dia? Você é muito especial para mim.',
          ref: '1Convite • Relacionamento Intencional'
        };
      case 'treino':
        return {
          title: 'CUIDADO DO TEMPLO',
          text: 'Cuidar da saúde e do corpo é honrar o Templo do Espírito. Bora treinar ou fazer uma caminhada juntos?',
          ref: '1Convite • Saúde & Vitalidade'
        };
      case 'igreja':
        return {
          title: 'CONVITE ESPECIAL',
          text: 'Gostaria muito de te fazer um convite: vamos comigo à igreja neste fim de semana? Adoraria ter a sua companhia na casa de Deus.',
          ref: '1Convite • Comunhão & Fé'
        };
      case 'custom':
        return {
          title: 'MENSAGEM DO CORAÇÃO',
          text: cardCustomText || 'Escreva aqui a sua mensagem de carinho ou convite especial...',
          ref: '1Convite'
        };
      case 'palavra':
      default:
        return {
          title: 'A PALAVRA DE HOJE',
          text: currentMeditation.verse,
          ref: currentMeditation.title
        };
    }
  };

  const cardContent = getCardContent();

  const startAudioPlayback = (voiceToUse = selectedVoice, stepToUse = currentStep, ambientToUse = ambientPiano) => {
    stopNeuralSpeech();
    let textToSpeak = '';
    
    if (stepToUse === 3) {
      // Passo 3: Oração Guiada
      textToSpeak = `Oração do 1Convite para hoje. ${currentMeditation.prayer || currentSintese.oracao_sintese || 'Senhor Deus, abençoa este dia, enche o meu coração de paz e usa a minha vida como um instrumento de amor e convite para alcançar o próximo. Em nome de Jesus, amém.'}`;
    } else {
      // Passo 1: Meditação Diária
      textToSpeak = `Café com Deus. ${currentMeditation.title}. Versículo bíblico: ${currentMeditation.verse}. ${currentMeditation.body}`;
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
    startAudioPlayback(selectedVoice, currentStep, ambientPiano);
  };

  const handleSelectVoice = (voiceKey) => {
    setSelectedVoice(voiceKey);
    if (isAudioPlaying) {
      startAudioPlayback(voiceKey, currentStep, ambientPiano);
    }
  };

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

  const handlePrev = () => {
    if (selectedDay > 1) {
      setSelectedDay(selectedDay - 1);
      setCurrentStep(1);
    }
  };

  const handleNext = () => {
    if (selectedDay < 365) {
      setSelectedDay(selectedDay + 1);
      setCurrentStep(1);
    }
  };

  const goToStep = (step) => {
    stopNeuralSpeech();
    setIsAudioPlaying(false);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Exportação e Download do Card em Alta Definição (1080p Nativo)
  const handleExportCard = async (shareMode = 'download') => {
    if (isGeneratingCard) return;
    setIsGeneratingCard(true);
    try {
      const dataUrl = await renderCardToHD({
        format: cardFormat,
        bg: activeBg,
        content: {
          tag: cardContent.title,
          text: cardContent.text,
          ref: cardContent.ref,
          link: '1convite.com.br'
        }
      });

      if (shareMode === 'share') {
        const shareText = `*${cardContent.title}*\n\n"${cardContent.text}"\n\n${cardContent.ref ? `_${cardContent.ref}_\n\n` : ''}✨ Acesse e participe do movimento: https://1convite.com.br`;

        // Tenta compartilhar imagem nativamente se o dispositivo suportar Web Share API de arquivos
        let sharedNatively = false;
        if (navigator.share && navigator.canShare) {
          try {
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const file = new File([blob], `1convite-${cardFormat}-dia-${selectedDay}.jpg`, { type: 'image/jpeg' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: '1Convite',
                text: shareText
              });
              sharedNatively = true;
            }
          } catch (shareErr) {
            console.log('[Native share skipped]:', shareErr);
          }
        }

        // Se não compartilhou nativamente com arquivo, baixa a imagem HD e abre o WhatsApp com o texto
        if (!sharedNatively) {
          downloadDataUrl(dataUrl);
          const encodedText = encodeURIComponent(shareText);
          const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
          window.open(whatsappUrl, '_blank');
        }
      } else {
        downloadDataUrl(dataUrl);
      }
    } catch (err) {
      console.error('[Card Export Error]:', err);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const downloadDataUrl = (dataUrl) => {
    const link = document.createElement('a');
    link.download = `1convite-${cardFormat}-hd-dia-${selectedDay}.jpg`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
            <span>JORNADA DIÁRIA 1CONVITE</span>
          </div>
          <h1 className="cafe-main-title">Café com Deus</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="cafe-cal-btn"
              aria-label="Alternar modo claro ou escuro"
              title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            >
              {isDarkMode ? (
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

      {/* Calendário 365 Dias */}
      {showCalendar && (
        <div className="cafe-calendar-panel animate-scale-up">
          <div className="cafe-calendar-header">
            <h3>Calendário Diário das 365 Meditações</h3>
            <span className="cafe-cal-sub">{completedDays.length} de 365 dias concluídos</span>
          </div>

          <div className="cafe-quick-actions">
            <button 
              onClick={() => { setSelectedDay(todayDayNumber); setCurrentStep(1); setShowCalendar(false); }}
              className="cafe-btn-today"
            >
              Ir para Hoje ({getDateInfo(todayDayNumber).short} • Dia {todayDayNumber})
            </button>
          </div>

          <div className="cafe-days-grid">
            {Array.from({ length: 365 }, (_, i) => i + 1).map(day => (
              <button
                key={day}
                onClick={() => { setSelectedDay(day); setCurrentStep(1); setShowCalendar(false); }}
                className={`cafe-day-dot ${selectedDay === day ? 'selected' : ''} ${completedDays.includes(day) ? 'completed' : ''} ${day === todayDayNumber ? 'is-today' : ''}`}
                title={`Dia ${day}: ${getDateInfo(day).short}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navegação Dia a Dia */}
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

      {/* ════════════ STEPPER VISUAL DA JORNADA (4 PASSOS) ════════════ */}
      <nav className="cafe-stepper-wrap" aria-label="Progresso da Jornada Diária">
        <button
          onClick={() => goToStep(1)}
          className={`cafe-step-item ${currentStep === 1 ? 'is-active' : ''} ${currentStep > 1 ? 'is-passed' : ''}`}
          title="1. Meditação da Palavra"
        >
          <div className="cafe-step-circle">{currentStep > 1 ? '✓' : '1'}</div>
          <span className="cafe-step-label">1. Meditação</span>
        </button>

        <div className={`cafe-step-line ${currentStep >= 2 ? 'is-passed' : ''}`} />

        <button
          onClick={() => goToStep(2)}
          className={`cafe-step-item ${currentStep === 2 ? 'is-active' : ''} ${currentStep > 2 ? 'is-passed' : ''}`}
          title="2. Síntese e Prática"
        >
          <div className="cafe-step-circle">{currentStep > 2 ? '✓' : '2'}</div>
          <span className="cafe-step-label">2. Síntese</span>
        </button>

        <div className={`cafe-step-line ${currentStep >= 3 ? 'is-passed' : ''}`} />

        <button
          onClick={() => goToStep(3)}
          className={`cafe-step-item ${currentStep === 3 ? 'is-active' : ''} ${currentStep > 3 ? 'is-passed' : ''}`}
          title="3. Oração e Selagem"
        >
          <div className="cafe-step-circle">{currentStep > 3 ? '✓' : '3'}</div>
          <span className="cafe-step-label">3. Oração</span>
        </button>

        <div className={`cafe-step-line ${currentStep >= 4 ? 'is-passed' : ''}`} />

        <button
          onClick={() => goToStep(4)}
          className={`cafe-step-item ${currentStep === 4 ? 'is-active' : ''}`}
          title="4. Criar Card 1Convite"
        >
          <div className="cafe-step-circle">4</div>
          <span className="cafe-step-label">4. 1Convite</span>
        </button>
      </nav>

      {/* ════════════ PASSO 1: MEDITAÇÃO CAFÉ COM DEUS ════════════ */}
      {currentStep === 1 && (
        <div className="cafe-step-content animate-fade-in">
          {/* Player Devocional com Voz Neural de Estúdio */}
          <section className="cafe-audio-card" aria-label="Player de Áudio Devocional">
            <div className="cafe-audio-header">
              <div className="cafe-audio-title-group">
                <span className="cafe-audio-badge-ai">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  VOZ NEURAL HD
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
                aria-label={isAudioPlaying ? 'Pausar áudio' : 'Ouvir meditação'}
                title={isAudioPlaying ? 'Pausar narração' : 'Ouvir meditação do dia'}
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
                  Meditação: {currentMeditation.title}
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
                  <span>{isAudioLoading ? 'Conectando áudio...' : (audioDuration > 0 ? formatAudioTime(audioDuration) : 'Voz Humana')}</span>
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
                    <small>Serena & Acolhedora</small>
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

            {/* Alternador de Som Ambiente (Piano) */}
            <div className="cafe-audio-options-bar">
              <button
                onClick={() => {
                  const nextAmbient = !ambientPiano;
                  setAmbientPiano(nextAmbient);
                  if (isAudioPlaying) {
                    startAudioPlayback(selectedVoice, currentStep, nextAmbient);
                  }
                }}
                className={`cafe-opt-chip ${ambientPiano ? 'active' : ''}`}
                title="Ligar ou desligar música de piano de fundo"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                <span>{ambientPiano ? 'Piano Suave: Ligado' : 'Piano: Desligado'}</span>
              </button>
            </div>
          </section>

          {/* Card da Meditação */}
          <article className="cafe-card">
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

            {/* Botão de Transição para o Passo 2 */}
            <div className="cafe-next-action-wrap">
              <button 
                onClick={() => goToStep(2)}
                className="cafe-primary-action-btn"
              >
                <span>Avançar para Síntese & Ação (Passo 2)</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </article>
        </div>
      )}

      {/* ════════════ PASSO 2: SÍNTESE DO DIA & PRÁTICA ════════════ */}
      {currentStep === 2 && (
        <div className="cafe-step-content animate-fade-in">
          {/* Card 1: Pensamento Principal para o Coração */}
          <section className="cafe-sintese-card">
            <div className="cafe-sintese-header">
              <div className="cafe-sintese-icon-wrap" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#F97316' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <span className="cafe-sintese-tag">PENSAMENTO DO DIA</span>
                <h3 className="cafe-sintese-title">Grave isto no coração hoje</h3>
              </div>
            </div>

            <div className="cafe-pensamento-box">
              <p>"{currentSintese.pensamento_principal || currentMeditation.verse}"</p>
            </div>
          </section>

          {/* Card 2: Síntese Prática para o Cotidiano */}
          <section className="cafe-sintese-card">
            <div className="cafe-sintese-header">
              <div className="cafe-sintese-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <span className="cafe-sintese-tag" style={{ color: '#3B82F6', borderColor: 'rgba(59, 130, 246, 0.3)' }}>APLICAÇÃO NO HOJE</span>
                <h3 className="cafe-sintese-title">O que isso significa na prática</h3>
              </div>
            </div>

            <p className="cafe-sintese-text">
              {currentSintese.sintese || currentMeditation.body.substring(0, 320)}
            </p>
          </section>

          {/* Card 3: Cuidado do Templo (OpenGym & Vitalidade) */}
          <section className="cafe-templo-box">
            <div className="cafe-sintese-header">
              <div className="cafe-sintese-icon-wrap" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div>
                <span className="cafe-templo-tag">CUIDADO DO TEMPLO • SAÚDE & VITALIDADE</span>
                <h3 className="cafe-sintese-title">Ação Corporal & Mental de Hoje</h3>
              </div>
            </div>

            <p className="cafe-templo-text">
              {currentSintese.desafio_pratico || 'Faça 5 ciclos de respiração consciente, hidrate o seu corpo e reserve 15 minutos para movimentar o seu templo com gratidão.'}
            </p>

            {onNavigateTemplo && (
              <button 
                onClick={onNavigateTemplo}
                className="cafe-templo-shortcut-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4M6 12h12" />
                </svg>
                <span>Abrir Treino do Templo (OpenGym)</span>
              </button>
            )}
          </section>

          {/* Navegação Entre Passos */}
          <div className="cafe-step-nav-row">
            <button 
              onClick={() => goToStep(1)}
              className="cafe-secondary-step-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Passo 1: Meditação</span>
            </button>

            <button 
              onClick={() => goToStep(3)}
              className="cafe-primary-action-btn"
            >
              <span>Selar em Oração (Passo 3)</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ════════════ PASSO 3: ORAÇÃO GUIADA & SELAGEM DO DIA ════════════ */}
      {currentStep === 3 && (
        <div className="cafe-step-content animate-fade-in">
          {/* Card da Oração Guiada */}
          <section className="cafe-prayer-card">
            <div className="cafe-prayer-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <div>
                <span className="cafe-sintese-tag" style={{ color: '#A855F7', borderColor: 'rgba(168, 85, 247, 0.3)' }}>PASSO 3 • ORAÇÃO GUIADA</span>
                <h3 className="cafe-prayer-title">Consagração & Alinhamento com Deus</h3>
              </div>
            </div>

            {/* Mini Player de Áudio para a Oração */}
            <div className="cafe-mini-audio-row">
              <button
                onClick={togglePlayAudio}
                className={`cafe-mini-play-btn ${isAudioLoading ? 'is-loading' : ''}`}
                title="Ouvir oração narrada"
              >
                {isAudioLoading ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : isAudioPlaying ? (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '2px' }}>
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                  </svg>
                )}
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#F8FAFC' }}>
                  {isAudioPlaying ? 'Ouvindo Oração Guiada...' : 'Ouvir Oração em Áudio'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Voz de {selectedVoice === 'pt-BR-FranciscaNeural' ? 'Francisca' : 'Antônio'} com piano
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectVoice(selectedVoice === 'pt-BR-FranciscaNeural' ? 'pt-BR-AntonioNeural' : 'pt-BR-FranciscaNeural')}
                className="cafe-opt-chip"
                style={{ fontSize: '0.68rem', padding: '4px 8px' }}
                title="Trocar voz"
              >
                Trocar: {selectedVoice === 'pt-BR-FranciscaNeural' ? 'Antônio' : 'Francisca'}
              </button>
            </div>

            <p className="cafe-prayer-text">
              {currentMeditation.prayer || currentSintese.oracao_sintese}
            </p>
          </section>

          {/* Card de Conclusão do Dia (Meta Pessoal Concluída) */}
          <div className="cafe-completion-card">
            <div className="cafe-completion-top-row">
              <div className="cafe-completion-icon-badge">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="cafe-completion-info">
                <h4>Objetivo Espiritual Concluído!</h4>
                <p>Você alimentou a alma, entendeu a prática para hoje e orou na presença de Deus.</p>
              </div>
            </div>

            <button 
              onClick={toggleComplete}
              className={`cafe-complete-btn ${isCompleted ? 'is-done' : ''}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{isCompleted ? 'Jornada Concluída ✓' : 'Marcar como Concluída'}</span>
            </button>
          </div>

          {/* Convite Opcional para o Passo 4 (Criar Card) */}
          <div className="cafe-invite-cta-card">
            <div className="cafe-invite-cta-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span>PASSO 4 OPCIONAL • O SEU 1CONVITE</span>
            </div>
            <h3 className="cafe-invite-cta-title">Abençoe o dia de alguém hoje</h3>
            <p className="cafe-invite-cta-text">
              Crie um card visual em alta definição e convide alguém próximo para um café, para treinar o templo ou para a palavra de Deus.
            </p>

            <button 
              onClick={() => goToStep(4)}
              className="cafe-primary-action-btn"
            >
              <span>Criar Card do 1Convite (Passo 4)</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <button 
              onClick={() => goToStep(2)}
              className="cafe-secondary-step-btn"
              style={{ marginTop: '12px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Voltar para Passo 2 (Síntese)</span>
            </button>
          </div>
        </div>
      )}

      {/* ════════════ PASSO 4: ESTÚDIO 1CONVITE (CRIAR CARD VISUAL) ════════════ */}
      {currentStep === 4 && (
        <div className="cafe-step-content animate-fade-in">
          {/* Header do Estúdio de Cards */}
          <div className="cafe-studio-intro">
            <span className="cafe-sintese-tag" style={{ color: '#F97316' }}>ESTÚDIO 1CONVITE</span>
            <h2 className="cafe-studio-title">Crie o seu Card Visual do Dia</h2>
            <p className="cafe-studio-sub">
              Escolha a mensagem, selecione o fundo e compartilhe um convite elegante no WhatsApp ou Instagram.
            </p>
          </div>

          {/* Formato: Post Quadrado ou Story Vertical */}
          <div className="cafe-format-bar">
            <button
              onClick={() => setCardFormat('square')}
              className={`cafe-format-btn ${cardFormat === 'square' ? 'active' : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              <span>Post Quadrado (1:1)</span>
            </button>

            <button
              onClick={() => setCardFormat('story')}
              className={`cafe-format-btn ${cardFormat === 'story' ? 'active' : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="3" />
              </svg>
              <span>Story / Status (9:16)</span>
            </button>
          </div>

          {/* ── CARD VISUAL PREVIEW (GLASSMORPHISM & ALTA DEFINIÇÃO) ── */}
          <div className="cafe-card-preview-container">
            <div 
              ref={cardPreviewRef}
              className={`cafe-card-preview-art ${cardFormat === 'story' ? 'is-story' : 'is-square'}`}
              style={activeBg.type === 'gradient' ? { background: activeBg.css } : { backgroundColor: '#0F1422' }}
            >
              {/* Imagem de Fundo Real */}
              {activeBg.type === 'image' && (
                <img 
                  src={activeBg.url} 
                  alt={activeBg.label} 
                  className="cafe-card-bg-cover" 
                />
              )}

              {/* Overlay Escuro com Degradê Suave para Contraste Perfeito */}
              <div className="cafe-card-overlay-gradient" />

              {/* Moldura de Vidro Translúcida (Glassmorphism) */}
              <div className="cafe-card-glass-frame">
                <span className="cafe-card-badge-tag">
                  {cardContent.title}
                </span>

                <blockquote className="cafe-card-quote-text">
                  “{(cardContent.text || '').replace(/^["“”]+|["“”]+$/g, '').trim()}”
                </blockquote>

                <span className="cafe-card-ref-text">
                  {cardContent.ref}
                </span>

                {/* Marca d'água oficial 1Convite com link oficial */}
                <div className="cafe-card-watermark">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F97316">
                    <path d="M12 2C8 7 5 11 5 15C5 18.87 8.13 22 12 22C15.87 22 19 18.87 19 15C19 11 16 7 12 2ZM12 20C9.79 20 8 18.21 8 16C8 13.5 10.5 10 12 8.5C13.5 10 16 13.5 16 16C16 18.21 14.21 20 12 20Z" />
                  </svg>
                  <span>1CONVITE.COM.BR</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── CONTROLE 1: ESCOLHA DA INTENÇÃO / MENSAGEM ── */}
          <section className="cafe-studio-section">
            <label className="cafe-studio-label">1. Escolha a Mensagem do Card:</label>
            <div className="cafe-intent-grid">
              <button
                onClick={() => handleSelectIntent('palavra')}
                className={`cafe-intent-pill ${cardSelectedIntent === 'palavra' ? 'active' : ''}`}
                title="Versículo e tema de hoje"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <span>Palavra de Hoje</span>
              </button>

              <button
                onClick={() => handleSelectIntent('cafe')}
                className={`cafe-intent-pill ${cardSelectedIntent === 'cafe' ? 'active' : ''}`}
                title="Convite para um café"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                  <line x1="6" y1="1" x2="6" y2="4"/>
                  <line x1="10" y1="1" x2="10" y2="4"/>
                </svg>
                <span>Café & Conversa</span>
              </button>

              <button
                onClick={() => handleSelectIntent('treino')}
                className={`cafe-intent-pill ${cardSelectedIntent === 'treino' ? 'active' : ''}`}
                title="Cuidar do templo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4M6 12h12" />
                </svg>
                <span>Cuidar do Templo</span>
              </button>

              <button
                onClick={() => handleSelectIntent('igreja')}
                className={`cafe-intent-pill ${cardSelectedIntent === 'igreja' ? 'active' : ''}`}
                title="Convite para a igreja"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span>Igreja & Fé</span>
              </button>

              <button
                onClick={() => handleSelectIntent('custom')}
                className={`cafe-intent-pill is-full-width ${cardSelectedIntent === 'custom' ? 'active' : ''}`}
                title="Escrever mensagem própria"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                <span>Escrever Mensagem Própria</span>
              </button>
            </div>

            {/* Campo para texto próprio se selecionado */}
            {cardSelectedIntent === 'custom' && (
              <div className="cafe-custom-text-wrap animate-fade-in">
                <textarea
                  value={cardCustomText}
                  onChange={(e) => setCardCustomText(e.target.value)}
                  placeholder="Digite a sua mensagem personalizada para o card..."
                  rows={3}
                  className="cafe-custom-textarea"
                  maxLength={180}
                />
              </div>
            )}
          </section>

          {/* ── CONTROLE 2: ESCOLHA DO FUNDO VISUAL (2 IMAGENS POR CATEGORIA + GRADIENTES) ── */}
          <section className="cafe-studio-section">
            <label className="cafe-studio-label">2. Escolha o Fundo da Imagem (Pelo menos 2 por categoria):</label>
            <div className="cafe-bg-selector-grid">
              {categoryBgs.map((bg) => {
                const isSelected = activeBg.id === bg.id;
                const originalIndex = CARD_BACKGROUNDS.findIndex(b => b.id === bg.id);
                return (
                  <button
                    key={bg.id}
                    onClick={() => setCardSelectedBg(originalIndex)}
                    className={`cafe-bg-thumb-btn ${isSelected ? 'selected' : ''}`}
                    title={bg.label}
                  >
                    <div className="cafe-bg-thumb-preview">
                      {bg.type === 'image' ? (
                        <img 
                          src={bg.url} 
                          alt={bg.label} 
                          className="cafe-thumb-img" 
                        />
                      ) : (
                        <div 
                          className="cafe-thumb-grad" 
                          style={{ background: bg.css }} 
                        />
                      )}
                      {isSelected && (
                        <span className="cafe-bg-thumb-check">✓</span>
                      )}
                    </div>
                    <span className="cafe-bg-thumb-label">{bg.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── AÇÕES DE COMPARTILHAMENTO E DOWNLOAD ── */}
          <div className="cafe-studio-actions-row">
            <button
              onClick={() => handleExportCard('share')}
              disabled={isGeneratingCard}
              className="cafe-whatsapp-submit-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>{isGeneratingCard ? 'Gerando Imagem...' : 'Compartilhar no WhatsApp'}</span>
            </button>

            <button
              onClick={() => handleExportCard('download')}
              disabled={isGeneratingCard}
              className="cafe-download-card-btn"
              title="Baixar imagem em resolução 1080p para postar no Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Baixar Card HD (Instagram)</span>
            </button>

            <button 
              onClick={() => goToStep(3)}
              className="cafe-secondary-step-btn"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Voltar para Passo 3 (Oração)</span>
            </button>
          </div>
        </div>
      )}

      {copied && (
        <div className="cafe-toast animate-fade-in">
          Imagem salva com sucesso!
        </div>
      )}
    </div>
  );
}
