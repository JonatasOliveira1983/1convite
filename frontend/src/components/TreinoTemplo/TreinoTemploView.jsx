import React, { useState, useEffect, useRef } from 'react';
import './TreinoTemplo.css';
import treinoTemploBanner from '../../assets/feed/treino_templo.jpg';

// ── BANCO DE ROTINAS DE TREINO (INSPIRADO NO OPENGYM - ZERO CUSTO, 100% OFFLINE) ──
const ROTINAS_TEMPLO = [
  {
    id: 'casa-iniciante',
    categoria: 'casa',
    titulo: 'Despertar do Templo • Iniciante',
    duracao: '15 min',
    nivel: 'Iniciante',
    foco: 'Mobilidade, circulação e tônus corporal',
    calorias: '~120 kcal',
    exercicios: [
      { nome: 'Polichinelos (Aquecimento)', series: 3, reps: '30 seg', descanso: 30, instrucao: 'Mantenha o ritmo constante e respire com calma.' },
      { nome: 'Agachamento Livre', series: 3, reps: '12 repetições', descanso: 45, instrucao: 'Pés na largura dos ombros, desça como se fosse sentar.' },
      { nome: 'Flexão de Braços na Parede ou Joelhos', series: 3, reps: '10 repetições', descanso: 45, instrucao: 'Mantenha o abdômen contraído e cotovelos a 45 graus.' },
      { nome: 'Prancha Isométrica', series: 3, reps: '20 seg', descanso: 45, instrucao: 'Corpo alinhado dos calcanhares até a cabeça.' },
      { nome: 'Alongamento de Coluna & Glória a Deus', series: 1, reps: '2 min', descanso: 0, instrucao: 'Respire fundo, agradeça a Deus pela saúde e fôlego de vida.' }
    ]
  },
  {
    id: 'casa-intermediario',
    categoria: 'casa',
    titulo: 'Fortaleza & Vigor • Intermediário',
    duracao: '25 min',
    nivel: 'Intermediário',
    foco: 'Resistência muscular e queima calórica',
    calorias: '~220 kcal',
    exercicios: [
      { nome: 'Corrida Estacionária com Elevação', series: 3, reps: '40 seg', descanso: 30, instrucao: 'Eleve os joelhos mantendo postura ereta.' },
      { nome: 'Afundo Alternado (Passada)', series: 3, reps: '10 por perna', descanso: 45, instrucao: 'Joelho de trás quase encosta no chão, 90 graus.' },
      { nome: 'Flexão de Braço Tradicional', series: 3, reps: '12 repetições', descanso: 45, instrucao: 'Controle o movimento na descida.' },
      { nome: 'Mergulho de Tríceps (em Cadeira)', series: 3, reps: '12 repetições', descanso: 45, instrucao: 'Mãos firmes na borda, desça flexionando os cotovelos.' },
      { nome: 'Prancha com Toque nos Ombros', series: 3, reps: '16 toques', descanso: 45, instrucao: 'Estabilize o quadril sem balançar.' }
    ]
  },
  {
    id: 'mobilidade-coluna',
    categoria: 'alongamento',
    titulo: 'Alívio & Mobilidade da Coluna',
    duracao: '12 min',
    nivel: 'Todos os níveis',
    foco: 'Alívio de dores lombares, postura e descompressão',
    calorias: '~60 kcal',
    exercicios: [
      { nome: 'Gato e Vaca (Cat-Cow)', series: 3, reps: '10 ciclos', descanso: 20, instrucao: 'Arredonde e arqueie as costas suavemente com a respiração.' },
      { nome: 'Postura da Criança (Descompressão)', series: 2, reps: '45 seg', descanso: 15, instrucao: 'Sente nos calcanhares e estenda os braços à frente.' },
      { nome: 'Torção Suave de Tronco Deitado', series: 2, reps: '30 seg por lado', descanso: 20, instrucao: 'Mantenha os ombros no chão e olhe para o lado oposto.' },
      { nome: 'Alongamento de Isquiotibiais com Toalha', series: 2, reps: '30 seg por perna', descanso: 15, instrucao: 'Puxe a perna reta suavemente em direção ao peito.' }
    ]
  },
  {
    id: 'academia-forca',
    categoria: 'academia',
    titulo: 'Supere Gigantes • Força na Academia',
    duracao: '45 min',
    nivel: 'Avançado',
    foco: 'Hipertrofia, densidade óssea e força máxima',
    calorias: '~350 kcal',
    exercicios: [
      { nome: 'Supino Reto com Barra ou Halteres', series: 4, reps: '8 a 10 reps', descanso: 60, instrucao: 'Escápulas travadas, movimento firme e seguro.' },
      { nome: 'Puxada Frontal na Polia', series: 4, reps: '10 reps', descanso: 60, instrucao: 'Puxe em direção ao peito alto focando nas costas.' },
      { nome: 'Leg Press 45° ou Agachamento Guiado', series: 4, reps: '12 reps', descanso: 60, instrucao: 'Pés firmes na plataforma, amplitude segura.' },
      { nome: 'Desenvolvimento Militar com Halteres', series: 3, reps: '10 reps', descanso: 60, instrucao: 'Elevação controlada sem arquear excessivamente a lombar.' }
    ]
  }
];

export default function TreinoTemploView({ onBack }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState('casa');
  const [rotinaSelecionada, setRotinaSelecionada] = useState(ROTINAS_TEMPLO[0]);
  const [treinoEmAndamento, setTreinoEmAndamento] = useState(false);
  const [exercicioAtualIndex, setExercicioAtualIndex] = useState(0);
  const [serieAtual, setSerieAtual] = useState(1);
  const [timerRest, setTimerRest] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [treinoConcluido, setTreinoConcluido] = useState(false);
  const [historicoTreinos, setHistoricoTreinos] = useState([]);
  const timerIntervalRef = useRef(null);

  // Carrega histórico salvo no localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('1convite_treinos_historico');
      if (saved) setHistoricoTreinos(JSON.parse(saved));
    } catch (e) {
      console.error('Erro ao ler histórico de treinos:', e);
    }
  }, []);

  // Timer de descanso
  useEffect(() => {
    if (isTimerRunning && timerRest > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRest(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerRest]);

  const iniciarTreino = (rotina) => {
    setRotinaSelecionada(rotina);
    setTreinoEmAndamento(true);
    setExercicioAtualIndex(0);
    setSerieAtual(1);
    setTreinoConcluido(false);
    setTimerRest(0);
    setIsTimerRunning(false);
  };

  const concluirSerie = () => {
    const exAtual = rotinaSelecionada.exercicios[exercicioAtualIndex];
    if (serieAtual < exAtual.series) {
      setSerieAtual(prev => prev + 1);
      if (exAtual.descanso > 0) {
        setTimerRest(exAtual.descanso);
        setIsTimerRunning(true);
      }
    } else {
      // Avança para o próximo exercício
      if (exercicioAtualIndex < rotinaSelecionada.exercicios.length - 1) {
        setExercicioAtualIndex(prev => prev + 1);
        setSerieAtual(1);
        const proximoEx = rotinaSelecionada.exercicios[exercicioAtualIndex + 1];
        if (proximoEx.descanso > 0) {
          setTimerRest(proximoEx.descanso);
          setIsTimerRunning(true);
        }
      } else {
        // Treino concluído!
        finalizarTreino();
      }
    }
  };

  const finalizarTreino = () => {
    setTreinoEmAndamento(false);
    setTreinoConcluido(true);
    const novoRegistro = {
      id: Date.now(),
      titulo: rotinaSelecionada.titulo,
      duracao: rotinaSelecionada.duracao,
      calorias: rotinaSelecionada.calorias,
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    };
    const novoHist = [novoRegistro, ...historicoTreinos].slice(0, 30);
    setHistoricoTreinos(novoHist);
    try {
      localStorage.setItem('1convite_treinos_historico', JSON.stringify(novoHist));
    } catch (e) {
      console.error(e);
    }
  };

  const rotinasFiltradas = ROTINAS_TEMPLO.filter(r => categoriaAtiva === 'todos' || r.categoria === categoriaAtiva);

  return (
    <div className="treino-templo-container animate-fade-in">
      {/* ── HEADER SUPERIOR ── */}
      <header className="treino-header">
        <button className="treino-back-btn" onClick={treinoEmAndamento ? () => setTreinoEmAndamento(false) : onBack}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div className="treino-header-titles">
          <span className="treino-header-kicker">O TEMPLO DO ESPÍRITO</span>
          <h2 className="treino-header-main">Saúde, Treino & Vitalidade</h2>
        </div>
        <div className="treino-streak-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#F97316">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
          <span>{historicoTreinos.length} Treinos</span>
        </div>
      </header>

      {/* ── MODO 1: SESSÃO ATIVA DE TREINO (OPENGYM GUIDED WORKOUT) ── */}
      {treinoEmAndamento ? (
        <div className="treino-active-session animate-fade-in">
          <div className="treino-active-card">
            <div className="treino-progress-bar-wrap">
              <div 
                className="treino-progress-bar-fill" 
                style={{ width: `${((exercicioAtualIndex + (serieAtual / rotinaSelecionada.exercicios[exercicioAtualIndex].series)) / rotinaSelecionada.exercicios.length) * 100}%` }}
              />
            </div>

            <div className="treino-active-header">
              <span className="treino-active-step">
                Exercício {exercicioAtualIndex + 1} de {rotinaSelecionada.exercicios.length}
              </span>
              <span className="treino-active-series">
                Série {serieAtual} de {rotinaSelecionada.exercicios[exercicioAtualIndex].series}
              </span>
            </div>

            <h3 className="treino-active-name">
              {rotinaSelecionada.exercicios[exercicioAtualIndex].nome}
            </h3>

            <div className="treino-active-reps-badge">
              <strong>{rotinaSelecionada.exercicios[exercicioAtualIndex].reps}</strong>
            </div>

            <p className="treino-active-tip">
              Dica: {rotinaSelecionada.exercicios[exercicioAtualIndex].instrucao}
            </p>

            {/* REST TIMER DO OPENGYM */}
            {timerRest > 0 ? (
              <div className="treino-timer-box">
                <span className="treino-timer-label">Tempo de Descanso</span>
                <span className="treino-timer-clock">{timerRest}s</span>
                <button 
                  className="treino-skip-timer-btn" 
                  onClick={() => { setTimerRest(0); setIsTimerRunning(false); }}
                >
                  Pular Descanso →
                </button>
              </div>
            ) : (
              <button className="treino-concluir-serie-btn" onClick={concluirSerie}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Concluir Série {serieAtual}</span>
              </button>
            )}

            <button className="treino-cancelar-btn" onClick={() => setTreinoEmAndamento(false)}>
              Pausar / Sair do Treino
            </button>
          </div>
        </div>
      ) : treinoConcluido ? (
        /* ── MODO 2: CELEBRAÇÃO DE TREINO CONCLUÍDO ── */
        <div className="treino-concluido-box animate-fade-in">
          <div className="treino-concluido-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3>Corpo Cuidado & Glória a Deus!</h3>
          <p>Você completou o treino <strong>{rotinaSelecionada.titulo}</strong> com dedicação e disciplina.</p>
          <div className="treino-concluido-stats">
            <div>
              <span>Duração</span>
              <strong>{rotinaSelecionada.duracao}</strong>
            </div>
            <div>
              <span>Gasto Estimado</span>
              <strong>{rotinaSelecionada.calorias}</strong>
            </div>
          </div>
          <blockquote className="treino-verse-quote">
            "Não sabeis vós que o vosso corpo é o templo do Espírito Santo, que habita em vós, proveniente de Deus?"
            <cite>— 1 Coríntios 6:19</cite>
          </blockquote>
          <button className="treino-voltar-feed-btn" onClick={() => setTreinoConcluido(false)}>
            Voltar para as Rotinas
          </button>
        </div>
      ) : (
        /* ── MODO 3: FEED PRINCIPAL DE TREINOS DO TEMPLO ── */
        <>
          {/* BANNER HERO DE VITALIDADE */}
          <div className="treino-hero-card">
            <img src={treinoTemploBanner} alt="Treino do Templo" className="treino-hero-img" />
            <div className="treino-hero-overlay">
              <span className="treino-hero-pill">VITALIDADE & DISCIPLINA</span>
              <h3 className="treino-hero-title">Fortaleça o Seu Templo</h3>
              <p className="treino-hero-desc">
                Rotinas guiadas baseadas no OpenGym para fazer em casa ou academia. Sem equipamentos obrigatórios, foco no seu bem-estar diário.
              </p>
              <button 
                className="treino-hero-cta" 
                onClick={() => iniciarTreino(ROTINAS_TEMPLO[0])}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Treino Rápido de Hoje (15 min)</span>
              </button>
            </div>
          </div>

          {/* FILTRO DE CATEGORIAS */}
          <div className="treino-chips-bar">
            {[
              { id: 'casa', label: 'Em Casa (Peso do Corpo)' },
              { id: 'alongamento', label: 'Mobilidade & Coluna' },
              { id: 'academia', label: 'Academia & Força' },
              { id: 'todos', label: 'Todas as Rotinas' }
            ].map(cat => (
              <button
                key={cat.id}
                className={`treino-chip ${categoriaAtiva === cat.id ? 'active' : ''}`}
                onClick={() => setCategoriaAtiva(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* LISTA DE ROTINAS */}
          <div className="treino-rotinas-grid">
            {rotinasFiltradas.map(rotina => (
              <div key={rotina.id} className="treino-rotina-card">
                <div className="treino-rotina-meta">
                  <span className="treino-badge-duracao">⏱ {rotina.duracao}</span>
                  <span className="treino-badge-nivel">{rotina.nivel}</span>
                </div>
                <h4 className="treino-rotina-titulo">{rotina.titulo}</h4>
                <p className="treino-rotina-foco">{rotina.foco}</p>
                <div className="treino-rotina-footer">
                  <span className="treino-rotina-cal">{rotina.calorias}</span>
                  <button 
                    className="treino-start-btn" 
                    onClick={() => iniciarTreino(rotina)}
                  >
                    <span>Iniciar</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* HISTÓRICO RECENTE */}
          {historicoTreinos.length > 0 && (
            <div className="treino-history-section">
              <h4 className="treino-history-title">Últimos Treinos Concluídos</h4>
              <div className="treino-history-list">
                {historicoTreinos.slice(0, 3).map(item => (
                  <div key={item.id} className="treino-history-item">
                    <div className="treino-history-check">✓</div>
                    <div className="treino-history-info">
                      <strong>{item.titulo}</strong>
                      <span>{item.data} • {item.duracao}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
