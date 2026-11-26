import React, { useState, useEffect, useRef } from 'react';
import './TreinoTemplo.css';
import treinoTemploBanner from '../../assets/feed/treino_templo.jpg';
import MuscleMap from './MuscleMap';
import ExerciseAvatarPlayer from './ExerciseAvatarPlayer';

// ── BANCO DE ROTINAS COM GRUPOS MUSCULARES E DEMONSTRAÇÃO EM LOOP (TEMPLOFIT) ──
const ROTINAS_TEMPLO = [
  {
    id: 'casa-iniciante',
    categoria: 'casa',
    titulo: 'Despertar TemploFit • Iniciante',
    duracao: '15 min',
    nivel: 'Iniciante',
    foco: 'Mobilidade, circulação e tônus corporal',
    calorias: '~120 kcal',
    musculos: ['chest', 'quads', 'abs', 'calves'],
    exercicios: [
      { nome: 'Polichinelos (Aquecimento)', animType: 'jumping_jacks', series: 3, reps: '30 seg', musculos: ['calves', 'shoulders'], descanso: 30, instrucao: 'Mantenha o ritmo constante e respire com calma.' },
      { nome: 'Agachamento Livre', animType: 'squat', series: 3, reps: '12 repetições', musculos: ['quads', 'glutes'], descanso: 45, instrucao: 'Pés na largura dos ombros, desça como se fosse sentar.' },
      { nome: 'Flexão de Braços na Parede ou Joelhos', animType: 'pushup', series: 3, reps: '10 repetições', musculos: ['chest', 'triceps', 'shoulders'], descanso: 45, instrucao: 'Mantenha o abdômen contraído e cotovelos a 45 graus.' },
      { nome: 'Prancha Isométrica', animType: 'plank', series: 3, reps: '20 seg', musculos: ['abs'], descanso: 45, instrucao: 'Corpo alinhado dos calcanhares até a cabeça.' },
      { nome: 'Alongamento de Coluna & Glória a Deus', animType: 'stretch', series: 1, reps: '2 min', musculos: ['back', 'hamstrings'], descanso: 0, instrucao: 'Respire fundo, agradeça a Deus pela saúde e fôlego de vida.' }
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
    musculos: ['chest', 'triceps', 'quads', 'abs', 'shoulders'],
    exercicios: [
      { nome: 'Corrida Estacionária com Elevação', animType: 'high_knees', series: 3, reps: '40 seg', musculos: ['calves', 'quads'], descanso: 30, instrucao: 'Eleve os joelhos mantendo postura ereta.' },
      { nome: 'Afundo Alternado (Passada)', animType: 'lunge', series: 3, reps: '10 por perna', musculos: ['quads', 'glutes', 'hamstrings'], descanso: 45, instrucao: 'Joelho de trás quase encosta no chão, 90 graus.' },
      { nome: 'Flexão de Braço Tradicional', animType: 'pushup', series: 3, reps: '12 repetições', musculos: ['chest', 'triceps', 'shoulders'], descanso: 45, instrucao: 'Controle o movimento na descida.' },
      { nome: 'Mergulho de Tríceps (em Cadeira)', animType: 'tricep_dip', series: 3, reps: '12 repetições', musculos: ['triceps', 'shoulders'], descanso: 45, instrucao: 'Mãos firmes na borda, desça flexionando os cotovelos.' },
      { nome: 'Prancha com Toque nos Ombros', animType: 'plank', series: 3, reps: '16 toques', musculos: ['abs', 'shoulders'], descanso: 45, instrucao: 'Estabilize o quadril sem balançar.' }
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
    musculos: ['back', 'hamstrings', 'glutes'],
    exercicios: [
      { nome: 'Gato e Vaca (Cat-Cow)', animType: 'cat_cow', series: 3, reps: '10 ciclos', musculos: ['back', 'abs'], descanso: 20, instrucao: 'Arredonde e arqueie as costas suavemente com a respiração.' },
      { nome: 'Postura da Criança (Descompressão)', animType: 'child_pose', series: 2, reps: '45 seg', musculos: ['back', 'shoulders'], descanso: 15, instrucao: 'Sente nos calcanhares e estenda os braços à frente.' },
      { nome: 'Torção Suave de Tronco Deitado', animType: 'torso_twist', series: 2, reps: '30 seg por lado', musculos: ['back', 'glutes'], descanso: 20, instrucao: 'Mantenha os ombros no chão e olhe para o lado oposto.' },
      { nome: 'Alongamento de Isquiotibiais com Toalha', animType: 'stretch', series: 2, reps: '30 seg por perna', musculos: ['hamstrings'], descanso: 15, instrucao: 'Puxe a perna reta suavemente em direção ao peito.' }
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
    musculos: ['chest', 'back', 'shoulders', 'triceps', 'quads'],
    exercicios: [
      { nome: 'Supino Reto com Barra ou Halteres', animType: 'bench_press', series: 4, reps: '8 a 10 reps', musculos: ['chest', 'triceps', 'shoulders'], descanso: 60, instrucao: 'Escápulas travadas, movimento firme e seguro.' },
      { nome: 'Puxada Frontal na Polia', animType: 'lat_pulldown', series: 4, reps: '10 reps', musculos: ['back', 'biceps'], descanso: 60, instrucao: 'Puxe em direção ao peito alto focando nas costas.' },
      { nome: 'Leg Press 45° ou Agachamento Guiado', animType: 'leg_press', series: 4, reps: '12 reps', musculos: ['quads', 'glutes'], descanso: 60, instrucao: 'Pés firmes na plataforma, amplitude segura.' },
      { nome: 'Desenvolvimento Militar com Halteres', animType: 'shoulder_press', series: 3, reps: '10 reps', musculos: ['shoulders', 'triceps'], descanso: 60, instrucao: 'Elevação controlada sem arquear excessivamente a lombar.' }
    ]
  }
];

export default function TreinoTemploView({ onBack }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState('casa');
  const [rotinaSelecionada, setRotinaSelecionada] = useState(ROTINAS_TEMPLO[0]);
  const [treinoEmAndamento, setTreinoEmAndamento] = useState(false);
  const [exercicioAtualIndex, setExercicioAtualIndex] = useState(0);
  const [seriesConcluidas, setSeriesConcluidas] = useState({}); // { '0-1': true, '0-2': true }
  const [timerRest, setTimerRest] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [treinoConcluido, setTreinoConcluido] = useState(false);
  const [historicoTreinos, setHistoricoTreinos] = useState([]);
  
  // Métricas do Usuário (OpenGym Stats)
  const [pesoCorporal, setPesoCorporal] = useState(() => localStorage.getItem('1convite_peso_corporal') || '74.5');
  const [showModalPeso, setShowModalPeso] = useState(false);
  const [inputPesoTemp, setInputPesoTemp] = useState('');
  
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
    setSeriesConcluidas({});
    setTreinoConcluido(false);
    setTimerRest(0);
    setIsTimerRunning(false);
  };

  // Alterna checkbox de uma série específica
  const toggleSerie = (exIdx, sNum) => {
    const key = `${exIdx}-${sNum}`;
    const nextState = !seriesConcluidas[key];
    const updated = { ...seriesConcluidas, [key]: nextState };
    setSeriesConcluidas(updated);

    // Se marcou a série como feita, dispara o timer de descanso do exercício
    if (nextState) {
      const ex = rotinaSelecionada.exercicios[exIdx];
      if (ex.descanso > 0) {
        setTimerRest(ex.descanso);
        setIsTimerRunning(true);
      }
    }

    // Verifica se completou todas as séries do exercício atual
    const exAtual = rotinaSelecionada.exercicios[exIdx];
    let todasSeriesExFeitas = true;
    for (let s = 1; s <= exAtual.series; s++) {
      if (!updated[`${exIdx}-${s}`]) {
        todasSeriesExFeitas = false;
        break;
      }
    }

    // Se completou todas as séries do exercício, passa para o próximo ou finaliza
    if (todasSeriesExFeitas) {
      if (exIdx < rotinaSelecionada.exercicios.length - 1) {
        setTimeout(() => {
          setExercicioAtualIndex(exIdx + 1);
        }, 600);
      } else {
        // Todas as séries de todos os exercícios concluídas!
        setTimeout(() => {
          finalizarTreino();
        }, 800);
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
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      diaSemana: new Date().getDay()
    };
    const novoHist = [novoRegistro, ...historicoTreinos].slice(0, 30);
    setHistoricoTreinos(novoHist);
    try {
      localStorage.setItem('1convite_treinos_historico', JSON.stringify(novoHist));
    } catch (e) {
      console.error(e);
    }
  };

  const salvarPeso = () => {
    if (!inputPesoTemp) return;
    setPesoCorporal(inputPesoTemp);
    try {
      localStorage.setItem('1convite_peso_corporal', inputPesoTemp);
    } catch (e) {
      console.error(e);
    }
    setShowModalPeso(false);
  };

  // Dias da Semana para o Weekly Tracker (OpenGym Style)
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hojeDia = new Date().getDay();

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
          <span className="treino-header-kicker">TEMPLOFIT • 1CONVITE</span>
          <h2 className="treino-header-main">Saúde, Treino & Vitalidade</h2>
        </div>
      </header>

      {/* ── PAINEL 1: STATS BOARD DO OPENGYM (MÉTRICAS NO TOPO) ── */}
      {!treinoEmAndamento && (
        <div className="treino-stats-board">
          <div className="treino-stat-card">
            <span className="treino-stat-label">Sessões Concluídas</span>
            <div className="treino-stat-value-row">
              <span className="treino-stat-number">{historicoTreinos.length}</span>
              <span className="treino-stat-unit">treinos</span>
            </div>
            <span className="treino-stat-sub">consistência ativa</span>
          </div>

          <div className="treino-stat-card">
            <span className="treino-stat-label">Sequência do Templo</span>
            <div className="treino-stat-value-row">
              <span className="treino-stat-number" style={{ color: '#F97316' }}>
                {historicoTreinos.length > 0 ? `${Math.min(historicoTreinos.length, 7)}` : '0'}
              </span>
              <span className="treino-stat-unit">dias seguidos</span>
            </div>
            <span className="treino-stat-sub">meta: 4x semana</span>
          </div>

          <div className="treino-stat-card" onClick={() => { setInputPesoTemp(pesoCorporal); setShowModalPeso(true); }} style={{ cursor: 'pointer' }}>
            <span className="treino-stat-label">Peso Corporal</span>
            <div className="treino-stat-value-row">
              <span className="treino-stat-number" style={{ color: '#38BDF8' }}>{pesoCorporal}</span>
              <span className="treino-stat-unit">kg</span>
            </div>
            <span className="treino-stat-sub" style={{ color: '#38BDF8', fontWeight: '700' }}>+ Atualizar</span>
          </div>
        </div>
      )}

      {/* ── PAINEL 2: WEEKLY STREAK TRACKER (RÉGUA DOS 7 DIAS) ── */}
      {!treinoEmAndamento && (
        <div className="treino-weekly-tracker">
          <div className="treino-weekly-header">
            <span className="treino-weekly-title">Ritmo da Semana</span>
            <span className="treino-weekly-info">
              {historicoTreinos.filter(h => h.diaSemana === hojeDia).length > 0 ? 'Treino de Hoje Concluído!' : 'Treino de Hoje Pendente'}
            </span>
          </div>
          <div className="treino-weekly-days">
            {diasSemana.map((dia, idx) => {
              const treinouNesseDia = historicoTreinos.some(h => h.diaSemana === idx);
              const isToday = idx === hojeDia;
              return (
                <div key={dia} className={`treino-day-pill ${isToday ? 'today' : ''} ${treinouNesseDia ? 'done' : ''}`}>
                  <span className="treino-day-name">{dia}</span>
                  <div className="treino-day-dot">
                    {treinouNesseDia ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MODO 1: SESSÃO ATIVA DE TREINO (COM MUSCLE MAP & CHECKBOXES) ── */}
      {treinoEmAndamento ? (
        <div className="treino-active-session animate-fade-in">
          <div className="treino-active-card">
            
            {/* DEMONSTRAÇÃO ANIMADA + MUSCLE MAP INTERATIVO DO EXERCÍCIO ATUAL */}
            <div className="treino-active-anatomy-wrap">
              <div className="templofit-dual-visual">
                <ExerciseAvatarPlayer
                  animType={rotinaSelecionada.exercicios[exercicioAtualIndex].animType}
                  exerciseName={rotinaSelecionada.exercicios[exercicioAtualIndex].nome}
                />
                <div className="templofit-map-box">
                  <MuscleMap 
                    highlightMuscles={rotinaSelecionada.exercicios[exercicioAtualIndex].musculos || []} 
                    view="ambos"
                    size="md"
                  />
                </div>
              </div>
              <span className="treino-anatomy-caption">
                Músculos Recrutados: {(rotinaSelecionada.exercicios[exercicioAtualIndex].musculos || []).join(', ')}
              </span>
            </div>

            <div className="treino-active-header">
              <span className="treino-active-step">
                Exercício {exercicioAtualIndex + 1} de {rotinaSelecionada.exercicios.length}
              </span>
              <span className="treino-active-series">
                {rotinaSelecionada.exercicios[exercicioAtualIndex].series} Séries
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

            {/* TABELA DE SÉRIES COM CHECKBOXES INTERATIVOS */}
            <div className="treino-series-table">
              {Array.from({ length: rotinaSelecionada.exercicios[exercicioAtualIndex].series }).map((_, sIdx) => {
                const sNum = sIdx + 1;
                const isDone = seriesConcluidas[`${exercicioAtualIndex}-${sNum}`];
                return (
                  <div 
                    key={sNum} 
                    className={`treino-serie-row ${isDone ? 'done' : ''}`}
                    onClick={() => toggleSerie(exercicioAtualIndex, sNum)}
                  >
                    <div className="treino-serie-info">
                      <span className="treino-serie-num">SÉRIE {sNum}</span>
                      <span className="treino-serie-target">{rotinaSelecionada.exercicios[exercicioAtualIndex].reps}</span>
                    </div>
                    <button className={`treino-serie-check-btn ${isDone ? 'checked' : ''}`}>
                      {isDone ? '✓' : ''}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* REST TIMER DO OPENGYM */}
            {timerRest > 0 && (
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
        /* ── MODO 3: FEED PRINCIPAL DE ROTINAS DO TEMPLO COM MUSCLE MAP ── */
        <>
          {/* BANNER HERO DE VITALIDADE */}
          <div className="treino-hero-card">
            <img src={treinoTemploBanner} alt="Treino do Templo" className="treino-hero-img" />
            <div className="treino-hero-overlay">
              <span className="treino-hero-pill">TEMPLOFIT • VITALIDADE</span>
              <h3 className="treino-hero-title">TemploFit: Fortaleça o Seu Templo</h3>
              <p className="treino-hero-desc">
                Rotinas guiadas por nível com demonstração animada em loop, mapa muscular anatômico e timer de descanso. Cuidando da saúde que Deus te deu.
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

          {/* LISTA DE ROTINAS COM O MINI MUSCLE MAP DO OPENGYM */}
          <div className="treino-rotinas-grid">
            {rotinasFiltradas.map(rotina => (
              <div key={rotina.id} className="treino-rotina-card">
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  
                  {/* MINI MUSCLE MAP DA ROTINA */}
                  <div className="treino-mini-anatomy">
                    <MuscleMap 
                      highlightMuscles={rotina.musculos || []} 
                      view="frente" 
                      size="sm" 
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
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

      {/* ── MODAL DE ATUALIZAÇÃO DE PESO CORPORAL (OPENGYM BODY WEIGHT TRACKER) ── */}
      {showModalPeso && (
        <div className="treino-modal-overlay" onClick={() => setShowModalPeso(false)}>
          <div className="treino-modal-card" onClick={e => e.stopPropagation()}>
            <h3>Registrar Peso Corporal</h3>
            <p>Acompanhe a sua evolução e cuide da saúde com consistência.</p>
            <div className="treino-input-weight-wrap">
              <input 
                type="number" 
                step="0.1" 
                value={inputPesoTemp} 
                onChange={e => setInputPesoTemp(e.target.value)} 
                placeholder="Ex: 75.5"
                autoFocus
              />
              <span>kg</span>
            </div>
            <div className="treino-modal-actions">
              <button className="treino-modal-cancel" onClick={() => setShowModalPeso(false)}>Cancelar</button>
              <button className="treino-modal-save" onClick={salvarPeso}>Salvar Peso</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
