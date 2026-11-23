import React, { useState } from 'react';
import './KidsView.css';

const QUIZ_KIDS = [
  {
    pergunta: 'Quem construiu a grande arca para salvar os animais do dilúvio?',
    opcoes: ['Moisés', 'Noé', 'Davi', 'Abraão'],
    correta: 1,
    explicacao: 'Noé obedeceu a Deus com fé e construiu a arca para sua família e os animais!'
  },
  {
    pergunta: 'Qual jovem pastor venceu o gigante Golias com uma funda e uma pedra?',
    opcoes: ['Salomão', 'Sansão', 'Davi', 'José'],
    correta: 2,
    explicacao: 'Davi confiava no Senhor dos Exércitos e venceu o gigante com a força de Deus!'
  },
  {
    pergunta: 'Quem foi jogado na cova dos leões mas foi protegido pelo anjo de Deus?',
    opcoes: ['Daniel', 'Jonas', 'Elias', 'Pedro'],
    correta: 0,
    explicacao: 'Daniel orava três vezes ao dia e Deus fechou a boca dos leões famintos!'
  },
  {
    pergunta: 'Quem foi engolido por um grande peixe e orou a Deus de dentro dele?',
    opcoes: ['Paulo', 'Gideão', 'Jonas', 'Josué'],
    correta: 2,
    explicacao: 'Jonas se arrependeu e foi levado pelo peixe para pregar a mensagem de Deus em Nínive!'
  }
];

export default function KidsView({ onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQ = QUIZ_KIDS[currentIdx];

  const handleSelect = (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === currentQ.correta) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_KIDS.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="kids-container animate-fade-in">
      <header className="kids-header">
        <button onClick={onBack} className="kids-back-btn" aria-label="Voltar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="kids-header-info">
          <div className="kids-pill">
            <span className="kids-pill-dot" />
            <span>ESPAÇO INFANTIL</span>
          </div>
          <h1 className="kids-title">1Convite Kids</h1>
        </div>

        <div style={{ width: 40 }} />
      </header>

      {!showResult ? (
        <div className="kids-quiz-card animate-fade-in">
          <div className="kids-progress-row">
            <span>Pergunta {currentIdx + 1} de {QUIZ_KIDS.length}</span>
            <span className="kids-score-tag">{score} acertos</span>
          </div>

          <h2 className="kids-question">{currentQ.pergunta}</h2>

          <div className="kids-options-list">
            {currentQ.opcoes.map((opt, idx) => {
              let stateClass = '';
              if (selectedOpt !== null) {
                if (idx === currentQ.correta) stateClass = 'correct';
                else if (idx === selectedOpt) stateClass = 'wrong';
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`kids-opt-btn ${stateClass}`}
                >
                  <span className="kids-opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="kids-opt-text">{opt}</span>
                </button>
              );
            })}
          </div>

          {selectedOpt !== null && (
            <div className="kids-expl-box animate-fade-in">
              <p className="kids-expl-text">{currentQ.explicacao}</p>
              <button onClick={handleNext} className="kids-next-btn">
                {currentIdx + 1 < QUIZ_KIDS.length ? 'Próxima Pergunta' : 'Ver Meu Resultado'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="kids-result-card animate-scale-up">
          <div className="kids-trophy-badge">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
              <path d="M6 4h12v7a6 6 0 0 1-12 0V4z" />
            </svg>
          </div>

          <h2 className="kids-congrats-title">Parabéns, Pequeno Campeão!</h2>
          <p className="kids-congrats-sub">
            Você acertou <strong>{score}</strong> de {QUIZ_KIDS.length} perguntas bíblicas!
          </p>

          <button onClick={restartQuiz} className="kids-restart-btn">
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
}
