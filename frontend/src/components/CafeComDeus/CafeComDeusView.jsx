import React, { useState, useEffect } from 'react';
import cafeData from '../../data/cafe_com_deus_365.json';
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
