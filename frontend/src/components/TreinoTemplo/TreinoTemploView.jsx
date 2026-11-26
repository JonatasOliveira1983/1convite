import React, { useState, useEffect, useRef, useMemo } from 'react';
import './TreinoTemplo.css';
import treinoTemploBanner from '../../assets/feed/treino_templo.jpg';
import MuscleMap from './MuscleMap';
import ExerciseAvatarPlayer from './ExerciseAvatarPlayer';
import BodyWeightCard from './BodyWeightCard';
import OpenGymVideoPlayer from './OpenGymVideoPlayer';
import { TEMPLOFIT_CATALOGUE } from '../../data/templofitCatalogue';
import { openGymCatalogueService, OPENGYM_BODYPARTS, OPENGYM_EQUIPMENTS } from '../../services/openGymCatalogueService';
import { templofitService } from '../../services/templofitService';

const PROGRAMAS_TEMPLOFIT = [
  {
    id: 'fase1-despertar',
    fase: 'fase-1',
    faseLabel: 'FASE 1 • SEMANAS 1–2',
    categoria: 'casa',
    titulo: 'Despertar TemploFit • Iniciante',
    duracao: '15 min',
    duracaoMinutos: 15,
    nivel: 'Iniciante',
    metaSessoes: 6,
    foco: 'Adaptação articular, respiração e base muscular em casa',
    calorias: 120,
    musculos: ['chest', 'quads', 'abs', 'calves'],
    exercicios: [
      { nome: 'Polichinelos (Aquecimento)', animType: 'jumping_jacks', gifUrl: '/templofit/gifs/jumping_jacks.gif', series: 3, reps: '30 seg', musculos: ['calves', 'shoulders'], descanso: 30, instrucao: 'Mantenha o ritmo constante e respire com calma.' },
      { nome: 'Agachamento Livre', animType: 'squat', gifUrl: '/templofit/gifs/squat.gif', series: 3, reps: '12', musculos: ['quads', 'glutes'], descanso: 45, instrucao: 'Pés na largura dos ombros, desça como se fosse sentar.' },
      { nome: 'Flexão de Braços (Parede ou Joelhos)', animType: 'pushup', gifUrl: '/templofit/gifs/pushup.gif', series: 3, reps: '10', musculos: ['chest', 'triceps', 'shoulders'], descanso: 45, instrucao: 'Abdômen contraído e cotovelos a 45 graus.' },
      { nome: 'Prancha Isométrica', animType: 'plank', gifUrl: '/templofit/gifs/plank.gif', series: 3, reps: '25 seg', musculos: ['abs'], descanso: 45, instrucao: 'Corpo alinhado dos calcanhares até a cabeça.' },
    ],
  },
  {
    id: 'fase2-fortaleza',
    fase: 'fase-2',
    faseLabel: 'FASE 2 • SEMANAS 3–4',
    categoria: 'casa',
    titulo: 'Fortaleza & Vigor • Intermediário',
    duracao: '25 min',
    duracaoMinutos: 25,
    nivel: 'Intermediário',
    metaSessoes: 8,
    foco: 'Aumento de volume, resistência e definição funcional',
    calorias: 220,
    musculos: ['chest', 'triceps', 'quads', 'abs', 'shoulders'],
    exercicios: [
      { nome: 'Polichinelos Rápidos (Cardio)', animType: 'jumping_jacks', gifUrl: '/templofit/gifs/jumping_jacks.gif', series: 3, reps: '45 seg', musculos: ['calves', 'quads'], descanso: 30, instrucao: 'Eleve o ritmo mantendo postura ereta.' },
      { nome: 'Afundo Alternado (Passada)', animType: 'lunge', gifUrl: '/templofit/gifs/lunge.gif', series: 3, reps: '12 por perna', musculos: ['quads', 'glutes', 'hamstrings'], descanso: 45, instrucao: 'Joelho de trás quase encosta no chão em 90°.' },
      { nome: 'Flexão de Braço Tradicional', animType: 'pushup', gifUrl: '/templofit/gifs/pushup.gif', series: 4, reps: '12', musculos: ['chest', 'triceps', 'shoulders'], descanso: 45, instrucao: 'Controle o movimento na descida.' },
      { nome: 'Mergulho de Tríceps (em Cadeira)', animType: 'tricep_dip', gifUrl: '/templofit/gifs/tricep_dip.gif', series: 3, reps: '12', musculos: ['triceps', 'shoulders'], descanso: 45, instrucao: 'Mãos firmes na borda, desça flexionando os cotovelos.' },
      { nome: 'Prancha Estabilizada', animType: 'plank', gifUrl: '/templofit/gifs/plank.gif', series: 3, reps: '35 seg', musculos: ['abs', 'shoulders'], descanso: 45, instrucao: 'Estabilize o quadril sem balançar.' },
    ],
  },
  {
    id: 'fase3-gigantes',
    fase: 'fase-3',
    faseLabel: 'FASE 3 • SEMANAS 5+',
    categoria: 'academia',
    titulo: 'Supere Gigantes • Força na Academia',
    duracao: '45 min',
    duracaoMinutos: 45,
    nivel: 'Avançado',
    metaSessoes: 12,
    foco: 'Hipertrofia, força máxima e progressão de carga (kg)',
    calorias: 350,
    musculos: ['chest', 'back', 'shoulders', 'triceps', 'quads'],
    exercicios: [
      { nome: 'Supino Reto com Barra ou Halteres', animType: 'bench_press', gifUrl: '/templofit/gifs/bench_press.gif', series: 4, reps: '10', musculos: ['chest', 'triceps', 'shoulders'], descanso: 60, instrucao: 'Escápulas travadas, movimento firme e seguro.' },
      { nome: 'Puxada Frontal na Polia', animType: 'lat_pulldown', gifUrl: '/templofit/gifs/lat_pulldown.gif', series: 4, reps: '10', musculos: ['back', 'biceps'], descanso: 60, instrucao: 'Puxe em direção ao peito alto focando nas costas.' },
      { nome: 'Leg Press 45° ou Agachamento', animType: 'leg_press', gifUrl: '/templofit/gifs/leg_press.gif', series: 4, reps: '12', musculos: ['quads', 'glutes'], descanso: 60, instrucao: 'Pés firmes na plataforma, amplitude segura.' },
      { nome: 'Desenvolvimento Militar com Halteres', animType: 'shoulder_press', gifUrl: '/templofit/gifs/shoulder_press.gif', series: 3, reps: '10', musculos: ['shoulders', 'triceps'], descanso: 60, instrucao: 'Elevação controlada sem arquear a lombar.' },
    ],
  },
  {
    id: 'mobilidade-coluna',
    fase: 'mobilidade',
    faseLabel: 'RECUPERAÇÃO & POSTURA',
    categoria: 'alongamento',
    titulo: 'Alívio & Mobilidade da Coluna',
    duracao: '12 min',
    duracaoMinutos: 12,
    nivel: 'Todos os níveis',
    metaSessoes: 4,
    foco: 'Alívio de dores lombares, postura e descompressão',
    calorias: 60,
    musculos: ['back', 'hamstrings', 'glutes'],
    exercicios: [
      { nome: 'Prancha Isométrica & Descompressão do Core', animType: 'plank', gifUrl: '/templofit/gifs/plank.gif', series: 3, reps: '30 seg', musculos: ['back', 'abs'], descanso: 20, instrucao: 'Sustente a prancha ativando o core e aliviando a carga sobre a lombar.' },
      { nome: 'Alongamento de Quadril em Afundo', animType: 'lunge', gifUrl: '/templofit/gifs/lunge.gif', series: 3, reps: '30 seg por lado', musculos: ['quads', 'glutes', 'hamstrings'], descanso: 20, instrucao: 'Mantenha o tronco ereto sentindo alongar os flexores do quadril.' },
    ],
  },
];

const MUSCLE_FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'chest', label: 'Peito' },
  { id: 'back', label: 'Costas' },
  { id: 'shoulders', label: 'Ombros' },
  { id: 'biceps', label: 'Bíceps' },
  { id: 'triceps', label: 'Tríceps' },
  { id: 'quads', label: 'Pernas' },
  { id: 'abs', label: 'Abdômen' },
];

export default function TreinoTemploView({ onBack, userContact = 'convidado@1convite.com.br' }) {
  const [abaAtiva, setAbaAtiva] = useState('programas'); // 'programas' | 'explorar' | 'custom' | 'evolucao'
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [rotinaSelecionada, setRotinaSelecionada] = useState(PROGRAMAS_TEMPLOFIT[0]);
  const [treinoEmAndamento, setTreinoEmAndamento] = useState(false);
  const [exercicioAtualIndex, setExercicioAtualIndex] = useState(0);
  const [seriesConcluidas, setSeriesConcluidas] = useState({});
  const [seriesLogs, setSeriesLogs] = useState({}); // { '0-1': { kg: '20', reps: '12' } }
  const [timerRest, setTimerRest] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [treinoConcluido, setTreinoConcluido] = useState(false);

  // Estado sincronizado com Turso
  const [historicoTreinos, setHistoricoTreinos] = useState([]);
  const [pesoHistorico, setPesoHistorico] = useState([]);
  const [rotinasCustom, setRotinasCustom] = useState([]);
  const [streakReal, setStreakReal] = useState(0);
  const [pesoCorporal, setPesoCorporal] = useState(() => localStorage.getItem('1convite_peso_corporal') || '74.5');
  const [showModalPeso, setShowModalPeso] = useState(false);
  const [inputPesoTemp, setInputPesoTemp] = useState('');
  const [syncStatus, setSyncStatus] = useState('');

  // Explorar Catálogo Completo OpenGym (5.600+ exercícios)
  const [buscaOpenGym, setBuscaOpenGym] = useState('');
  const [filtroBodyPart, setFiltroBodyPart] = useState('all');
  const [filtroEquipment, setFiltroEquipment] = useState('all');
  const [pageOpenGym, setPageOpenGym] = useState(1);
  const [exercicioDetalhe, setExercicioDetalhe] = useState(null);

  // Galeria de Todos os GIFs Clássicos Wger
  const [buscaGifs, setBuscaGifs] = useState('');
  const [filtroMusculoGifs, setFiltroMusculoGifs] = useState('todos');

  // Construtor de Rotina Personalizada
  const [customTitle, setCustomTitle] = useState('');
  const [customItems, setCustomItems] = useState([]);

  const timerIntervalRef = useRef(null);

  const carregarDadosTurso = async () => {
    try {
      const data = await templofitService.fetchState(userContact);
      setHistoricoTreinos(data.sessoes || []);
      setPesoHistorico(data.pesoHistorico || []);
      setRotinasCustom(data.rotinasCustom || []);
      setStreakReal(Number(data.streak || 0));
      if (data.pesoAtual) {
        setPesoCorporal(String(data.pesoAtual));
        localStorage.setItem('1convite_peso_corporal', String(data.pesoAtual));
      }
      setSyncStatus('Sincronizado com a nuvem');
    } catch {
      try {
        const saved = localStorage.getItem('1convite_treinos_historico');
        if (saved) setHistoricoTreinos(JSON.parse(saved));
      } catch {}
      setSyncStatus('Modo offline local');
    }
  };

  useEffect(() => {
    carregarDadosTurso();
  }, [userContact]);

  useEffect(() => {
    if (isTimerRunning && timerRest > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRest((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
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
    setSeriesLogs({});
    setTreinoConcluido(false);
    setTimerRest(0);
    setIsTimerRunning(false);
  };

  const updateSerieLog = (exIdx, sNum, field, val) => {
    const key = `${exIdx}-${sNum}`;
    setSeriesLogs((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [field]: val },
    }));
  };

  const toggleSerie = (exIdx, sNum) => {
    const key = `${exIdx}-${sNum}`;
    const nextState = !seriesConcluidas[key];
    const updated = { ...seriesConcluidas, [key]: nextState };
    setSeriesConcluidas(updated);

    if (nextState) {
      const ex = rotinaSelecionada.exercicios[exIdx];
      if (ex.descanso > 0) {
        setTimerRest(ex.descanso);
        setIsTimerRunning(true);
      }
    }

    const exAtual = rotinaSelecionada.exercicios[exIdx];
    let todasSeriesExFeitas = true;
    for (let s = 1; s <= exAtual.series; s++) {
      if (!updated[`${exIdx}-${s}`]) {
        todasSeriesExFeitas = false;
        break;
      }
    }

    if (todasSeriesExFeitas) {
      if (exIdx < rotinaSelecionada.exercicios.length - 1) {
        setTimeout(() => setExercicioAtualIndex(exIdx + 1), 600);
      } else {
        setTimeout(() => finalizarTreino(updated), 800);
      }
    }
  };

  const finalizarTreino = async (completedMap = seriesConcluidas) => {
    setTreinoEmAndamento(false);
    setTreinoConcluido(true);

    let totalVolumeKg = 0;
    Object.keys(completedMap).forEach((key) => {
      if (completedMap[key]) {
        const log = seriesLogs[key] || {};
        const kg = Number(String(log.kg || 0).replace(',', '.')) || 0;
        const reps = parseInt(log.reps || '10', 10) || 10;
        totalVolumeKg += kg * reps;
      }
    });

    const novoRegistro = {
      id: Date.now(),
      rotinaId: rotinaSelecionada.id,
      titulo: rotinaSelecionada.titulo,
      fase: rotinaSelecionada.fase || 'custom',
      duracao: rotinaSelecionada.duracao,
      calorias: rotinaSelecionada.calorias || 150,
      volumeKg: totalVolumeKg,
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      diaSemana: new Date().getDay(),
    };

    const novoHist = [novoRegistro, ...historicoTreinos].slice(0, 60);
    setHistoricoTreinos(novoHist);
    try {
      localStorage.setItem('1convite_treinos_historico', JSON.stringify(novoHist));
    } catch {}

    try {
      await templofitService.saveSession({
        contact: userContact,
        rotinaId: rotinaSelecionada.id,
        titulo: rotinaSelecionada.titulo,
        fase: rotinaSelecionada.fase || 'custom',
        duracaoMinutos: rotinaSelecionada.duracaoMinutos || 20,
        calorias: typeof rotinaSelecionada.calorias === 'number' ? rotinaSelecionada.calorias : 150,
        volumeKg: totalVolumeKg,
        series: seriesLogs,
      });
      await carregarDadosTurso();
    } catch {
      // mantém fallback local caso offline
    }
  };

  const salvarPeso = async () => {
    if (!inputPesoTemp) return;
    const clean = inputPesoTemp.replace(',', '.');
    setPesoCorporal(clean);
    localStorage.setItem('1convite_peso_corporal', clean);
    setShowModalPeso(false);
    try {
      await templofitService.saveWeight(userContact, clean);
      await carregarDadosTurso();
    } catch {}
  };

  const addExercicioAoConstrutor = (ex) => {
    setCustomItems((prev) => [
      ...prev,
      {
        nome: ex.nome,
        animType: ex.animType || 'squat',
        gifUrl: ex.gifUrl || '',
        clipUrl: ex.clipUrl || '',
        stillUrl: ex.stillUrl || '',
        series: 3,
        reps: '12',
        musculos: ex.musculos || (ex.secondaryMuscles && ex.secondaryMuscles.length > 0 ? ex.secondaryMuscles : [ex.target || ex.bodyPart || 'geral']),
        descanso: 45,
        instrucao: ex.instructions?.[0] || ex.instrucoes?.[0] || ex.descricao || 'Execute com postura firme e respiração controlada.',
      },
    ]);
    setExercicioDetalhe(null);
    setAbaAtiva('custom');
  };

  const salvarRotinaCustom = async (e) => {
    e.preventDefault();
    if (!customTitle.trim() || customItems.length === 0) return;
    try {
      await templofitService.createRoutine(userContact, customTitle.trim(), customItems);
      setCustomTitle('');
      setCustomItems([]);
      await carregarDadosTurso();
    } catch {}
  };

  const openGymResult = useMemo(() => {
    return openGymCatalogueService.search({
      query: buscaOpenGym,
      bodyPart: filtroBodyPart,
      equipment: filtroEquipment,
      page: pageOpenGym,
      limit: 28,
    });
  }, [buscaOpenGym, filtroBodyPart, filtroEquipment, pageOpenGym]);

  const catalogoFiltrado = openGymResult.items;
  const totalOpenGymEx = openGymCatalogueService.getTotalCount();

  const gifsFiltrados = useMemo(() => {
    const q = buscaGifs.trim().toLowerCase();
    return TEMPLOFIT_CATALOGUE.filter((ex) => {
      const matchText = !q || ex.nome.toLowerCase().includes(q) || (ex.origem || '').toLowerCase().includes(q) || (ex.gifUrl || '').toLowerCase().includes(q);
      const matchMusculo = filtroMusculoGifs === 'todos' || ex.musculos.includes(filtroMusculoGifs);
      return matchText && matchMusculo;
    });
  }, [buscaGifs, filtroMusculoGifs]);

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hojeDia = new Date().getDay();
  const rotinasFiltradas = PROGRAMAS_TEMPLOFIT.filter((r) => categoriaAtiva === 'todos' || r.categoria === categoriaAtiva);

  return (
    <div className="treino-templo-container animate-fade-in">
      <header className="treino-header">
        <button className="treino-back-btn" onClick={treinoEmAndamento ? () => setTreinoEmAndamento(false) : onBack}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="treino-header-titles">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <img src="/templofit/templofit-logo-darkbg.png" alt="TemploFit" style={{ height: '22px', width: 'auto', display: 'block' }} />
            <span className="treino-header-kicker" style={{ margin: 0 }}>• {syncStatus || '1CONVITE'}</span>
          </div>
          <h2 className="treino-header-main">Saúde, Treino &amp; Evolução</h2>
        </div>
      </header>

      {/* STATS BOARD NO TOPO */}
      {!treinoEmAndamento && (
        <div className="treino-stats-board">
          <div className="treino-stat-card">
            <span className="treino-stat-label">Sessões Concluídas</span>
            <div className="treino-stat-value-row">
              <span className="treino-stat-number">{historicoTreinos.length}</span>
              <span className="treino-stat-unit">treinos</span>
            </div>
            <span className="treino-stat-sub">salvos na nuvem</span>
          </div>

          <div className="treino-stat-card">
            <span className="treino-stat-label">Sequência Real</span>
            <div className="treino-stat-value-row">
              <span className="treino-stat-number" style={{ color: '#F97316' }}>{streakReal}</span>
              <span className="treino-stat-unit">dias seguidos</span>
            </div>
            <span className="treino-stat-sub">consistência ativa</span>
          </div>

          <div className="treino-stat-card" onClick={() => { setInputPesoTemp(pesoCorporal); setShowModalPeso(true); }} style={{ cursor: 'pointer' }}>
            <span className="treino-stat-label">Peso Corporal</span>
            <div className="treino-stat-value-row">
              <span className="treino-stat-number" style={{ color: '#38BDF8' }}>{pesoCorporal}</span>
              <span className="treino-stat-unit">kg</span>
            </div>
            <span className="treino-stat-sub" style={{ color: '#38BDF8', fontWeight: '700' }}>+ Registrar peso</span>
          </div>
        </div>
      )}

      {/* NAVEGAÇÃO PRINCIPAL DO TEMPLOFIT (5 ABAS) */}
      {!treinoEmAndamento && !treinoConcluido && (
        <div className="treino-chips-bar" style={{ marginBottom: '16px' }}>
          {[
            { id: 'programas', label: 'Programas & Fases' },
            { id: 'explorar', label: `Explorar (${totalOpenGymEx.toLocaleString('pt-BR')})` },
            { id: 'gifs', label: `Todos os GIFs (${TEMPLOFIT_CATALOGUE.length})` },
            { id: 'custom', label: `Meus Treinos (${rotinasCustom.length})` },
            { id: 'evolucao', label: 'Minha Evolução' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`treino-chip ${abaAtiva === tab.id ? 'active' : ''}`}
              onClick={() => setAbaAtiva(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {treinoEmAndamento ? (
        <div className="treino-active-session animate-fade-in">
          <div className="treino-active-card">
            <div className="treino-active-anatomy-wrap">
              {rotinaSelecionada.exercicios[exercicioAtualIndex].clipUrl ? (
                <div style={{ marginBottom: '12px' }}>
                  <OpenGymVideoPlayer
                    clipUrl={rotinaSelecionada.exercicios[exercicioAtualIndex].clipUrl}
                    stillUrl={rotinaSelecionada.exercicios[exercicioAtualIndex].stillUrl}
                    title={rotinaSelecionada.exercicios[exercicioAtualIndex].nome}
                  />
                </div>
              ) : (
                <div className="templofit-dual-visual">
                  <ExerciseAvatarPlayer
                    animType={rotinaSelecionada.exercicios[exercicioAtualIndex].animType}
                    gifUrl={rotinaSelecionada.exercicios[exercicioAtualIndex].gifUrl}
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
              )}
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
              <strong>Meta: {rotinaSelecionada.exercicios[exercicioAtualIndex].reps}</strong>
            </div>

            <p className="treino-active-tip">
              Dica: {rotinaSelecionada.exercicios[exercicioAtualIndex].instrucao}
            </p>

            {/* TABELA DE SÉRIES COM CARGA (KG) + REPS + CHECKBOX */}
            <div className="treino-series-table">
              {Array.from({ length: rotinaSelecionada.exercicios[exercicioAtualIndex].series }).map((_, sIdx) => {
                const sNum = sIdx + 1;
                const key = `${exercicioAtualIndex}-${sNum}`;
                const isDone = seriesConcluidas[key];
                const log = seriesLogs[key] || {};
                return (
                  <div key={sNum} className={`treino-serie-row ${isDone ? 'done' : ''}`} style={{ gap: '8px', flexWrap: 'wrap' }}>
                    <div className="treino-serie-info" style={{ minWidth: '80px' }}>
                      <span className="treino-serie-num">SÉRIE {sNum}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="kg"
                        value={log.kg || ''}
                        onChange={(e) => updateSerieLog(exercicioAtualIndex, sNum, 'kg', e.target.value)}
                        style={{ width: '58px', padding: '5px 6px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', background: '#0B0C10', color: '#FFF', fontSize: '0.78rem', textAlign: 'center' }}
                      />
                      <input
                        type="text"
                        placeholder={String(rotinaSelecionada.exercicios[exercicioAtualIndex].reps)}
                        value={log.reps || ''}
                        onChange={(e) => updateSerieLog(exercicioAtualIndex, sNum, 'reps', e.target.value)}
                        style={{ width: '64px', padding: '5px 6px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', background: '#0B0C10', color: '#FFF', fontSize: '0.78rem', textAlign: 'center' }}
                      />
                    </div>
                    <button type="button" className={`treino-serie-check-btn ${isDone ? 'checked' : ''}`} onClick={() => toggleSerie(exercicioAtualIndex, sNum)}>
                      {isDone ? '✓' : ''}
                    </button>
                  </div>
                );
              })}
            </div>

            {timerRest > 0 && (
              <div className="treino-timer-box">
                <span className="treino-timer-label">Tempo de Descanso</span>
                <span className="treino-timer-clock">{timerRest}s</span>
                <button className="treino-skip-timer-btn" onClick={() => { setTimerRest(0); setIsTimerRunning(false); }}>
                  Pular Descanso →
                </button>
              </div>
            )}

            <button className="treino-cancel-btn" onClick={() => setTreinoEmAndamento(false)}>
              Pausar / Sair do Treino
            </button>
          </div>
        </div>
      ) : treinoConcluido ? (
        <div className="treino-concluido-card animate-fade-in">
          <div className="treino-concluido-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3>Treino Registrado no Banco de Dados!</h3>
          <p>
            Você completou <strong>{rotinaSelecionada.titulo}</strong> e sua evolução já foi salva na sua conta.
          </p>
          <button className="treino-finish-btn" onClick={() => setTreinoConcluido(false)}>
            Voltar para o TemploFit
          </button>
        </div>
      ) : abaAtiva === 'programas' ? (
        <>
          <div className="treino-weekly-tracker">
            <div className="treino-weekly-header">
              <span>Sua Consistência Semanal</span>
              <span className="treino-weekly-goal">Meta: 4x/sem</span>
            </div>
            <div className="treino-weekly-days">
              {diasSemana.map((dia, idx) => {
                const treinouNesseDia = historicoTreinos.some((t) => t.diaSemana === idx);
                return (
                  <div key={dia} className={`treino-day-dot ${idx === hojeDia ? 'today' : ''} ${treinouNesseDia ? 'completed' : ''}`}>
                    <span className="treino-day-name">{dia}</span>
                    <div className="treino-day-circle">{treinouNesseDia ? '✓' : ''}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PAINEL DE EVOLUÇÃO DE PESO CORPORAL (GRÁFICO VERDE NEON ESTILO OPENGYM) */}
          <BodyWeightCard
            pesoAtual={pesoCorporal}
            metaPeso="75.0"
            historico={pesoHistorico}
            onOpenLogModal={() => {
              setInputPesoTemp(pesoCorporal);
              setShowModalPeso(true);
            }}
          />

          <div className="treino-hero-card">
            <img src={treinoTemploBanner} alt="TemploFit" className="treino-hero-img" />
            <div className="treino-hero-overlay">
              <span className="treino-hero-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <img src="/templofit/templofit-icon.png" alt="" style={{ height: '14px', width: 'auto' }} />
                PROGRAMA PROGRESSIVO • 3 FASES
              </span>
              <h3 className="treino-hero-title">TemploFit: Evolução Fase a Fase</h3>
              <p className="treino-hero-desc">
                Avance da Fase 1 (Despertar) à Fase 3 (Força Máxima) registrando séries, cargas em kg e peso corporal direto na nuvem.
              </p>
              <button className="treino-hero-cta" onClick={() => iniciarTreino(PROGRAMAS_TEMPLOFIT[0])}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                <span>Começar Fase 1 (15 min)</span>
              </button>
            </div>
          </div>

          <div className="treino-chips-bar">
            {[
              { id: 'todos', label: 'Todas as Fases' },
              { id: 'casa', label: 'Em Casa' },
              { id: 'alongamento', label: 'Mobilidade' },
              { id: 'academia', label: 'Academia & Força' },
            ].map((cat) => (
              <button key={cat.id} className={`treino-chip ${categoriaAtiva === cat.id ? 'active' : ''}`} onClick={() => setCategoriaAtiva(cat.id)}>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="treino-rotinas-grid">
            {rotinasFiltradas.map((rotina) => {
              const concluidasNaFase = historicoTreinos.filter((h) => h.fase === rotina.fase || h.rotinaId === rotina.id).length;
              const pct = Math.min(100, Math.round((concluidasNaFase / rotina.metaSessoes) * 100));
              return (
                <div key={rotina.id} className="treino-rotina-card">
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div className="treino-mini-anatomy">
                      <MuscleMap highlightMuscles={rotina.musculos || []} view="frente" size="sm" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="treino-rotina-top-tags">
                        <span className="treino-nivel-tag">{rotina.faseLabel}</span>
                        <span className="treino-duracao-tag">{rotina.duracao}</span>
                      </div>
                      <h4 className="treino-rotina-titulo">{rotina.titulo}</h4>
                      <p className="treino-rotina-foco">{rotina.foco}</p>
                      <div style={{ margin: '8px 0 10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94A3B8', marginBottom: '4px' }}>
                          <span>Progresso da Fase</span>
                          <strong style={{ color: '#34D399' }}>{concluidasNaFase}/{rotina.metaSessoes} sessões ({pct}%)</strong>
                        </div>
                        <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: '#10B981', borderRadius: '999px' }} />
                        </div>
                      </div>
                      <button className="treino-start-btn" onClick={() => iniciarTreino(rotina)}>
                        <span>Iniciar Sessão →</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : abaAtiva === 'explorar' ? (
        <div className="animate-fade-in">
          {/* HEADER COM CONTAGEM OFICIAL OPENGYM */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#10B981', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                • {totalOpenGymEx.toLocaleString('pt-BR')} EXERCÍCIOS COM ANIMAÇÕES 3D
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '700' }}>
              Biblioteca Oficial OpenGym
            </span>
          </div>

          {/* BARRA DE PESQUISA */}
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Buscar exercício por nome, aparelho ou músculo (ex: supino, bíceps, crossover)..."
              value={buscaOpenGym}
              onChange={(e) => {
                setBuscaOpenGym(e.target.value);
                setPageOpenGym(1);
              }}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.28)',
                background: '#0F172A',
                color: '#FFF',
                fontSize: '0.86rem',
                outline: 'none',
              }}
            />
          </div>

          {/* FILTRO 1: PARTES DO CORPO / MÚSCULOS (ROLAGEM HORIZONTAL) */}
          <div className="treino-chips-bar" style={{ marginBottom: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {OPENGYM_BODYPARTS.map((bp) => (
              <button
                key={bp.id}
                type="button"
                className={`treino-chip ${filtroBodyPart === bp.id ? 'active' : ''}`}
                onClick={() => {
                  setFiltroBodyPart(bp.id);
                  setPageOpenGym(1);
                }}
                style={{ whiteSpace: 'nowrap' }}
              >
                {bp.label}
              </button>
            ))}
          </div>

          {/* FILTRO 2: EQUIPAMENTOS (ROLAGEM HORIZONTAL) */}
          <div className="treino-chips-bar" style={{ marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
            {OPENGYM_EQUIPMENTS.map((eq) => (
              <button
                key={eq.id}
                type="button"
                className={`treino-chip ${filtroEquipment === eq.id ? 'active' : ''}`}
                onClick={() => {
                  setFiltroEquipment(eq.id);
                  setPageOpenGym(1);
                }}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.72rem',
                  padding: '5px 10px',
                  background: filtroEquipment === eq.id ? '#10B981' : 'rgba(255,255,255,0.04)',
                }}
              >
                {eq.label}
              </button>
            ))}
          </div>

          {/* GRADE DE EXERCÍCIOS ESTILO OPENGYM */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {catalogoFiltrado.map((ex) => (
              <div
                key={ex.id}
                className="treino-rotina-card"
                onClick={() => setExercicioDetalhe(ex)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '12px',
                  background: '#13161F',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '12px',
                      background: '#FFFFFF',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={ex.stillUrl}
                      alt={ex.nome}
                      loading="lazy"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '3px' }}>
                      <span className="treino-nivel-tag" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                        {ex.equipmentPt || ex.equipment}
                      </span>
                    </div>
                    <h4
                      style={{
                        margin: '0 0 2px',
                        fontSize: '0.86rem',
                        color: '#FFFFFF',
                        fontWeight: '700',
                        lineHeight: '1.25',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {ex.nome}
                    </h4>
                    <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', textTransform: 'capitalize' }}>
                      {ex.bodyPartPt} • {ex.target}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setExercicioDetalhe(ex)}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      background: 'rgba(255,255,255,0.04)',
                      color: '#E2E8F0',
                      fontSize: '0.74rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                    }}
                  >
                    Ver 3D
                  </button>
                  <button
                    type="button"
                    onClick={() => addExercicioAoConstrutor(ex)}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#10B981',
                      color: '#052E16',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    + Treino
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* BOTÃO CARREGAR MAIS */}
          {openGymResult.hasMore && (
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setPageOpenGym((prev) => prev + 1)}
                className="treino-chip active"
                style={{
                  padding: '10px 24px',
                  fontSize: '0.84rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  borderRadius: '12px',
                }}
              >
                Carregar Mais Exercícios ({openGymResult.total - catalogoFiltrado.length} restantes) ↓
              </button>
            </div>
          )}
        </div>
      ) : abaAtiva === 'custom' ? (
        <div className="animate-fade-in">
          <form onSubmit={salvarRotinaCustom} className="treino-rotina-card" style={{ marginBottom: '18px' }}>
            <h4 style={{ margin: '0 0 10px', color: '#FFF' }}>Montar Nova Rotina Personalizada</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <input
                type="text"
                required
                placeholder="Nome do seu treino (ex: Treino A - Peito e Core)"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                style={{ flex: 1, minWidth: '200px', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', background: '#0B0C10', color: '#FFF' }}
              />
              <button type="button" onClick={() => setAbaAtiva('explorar')} className="treino-chip active" style={{ cursor: 'pointer' }}>
                + Escolher Exercícios ({customItems.length})
              </button>
            </div>
            {customItems.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                {customItems.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: '8px', background: 'rgba(15,23,42,0.7)', fontSize: '0.8rem', color: '#E2E8F0' }}>
                    <span>{idx + 1}. {it.nome} ({it.series}x{it.reps})</span>
                    <button type="button" onClick={() => setCustomItems((prev) => prev.filter((_, i) => i !== idx))} style={{ background: 'transparent', border: 'none', color: '#F87171', cursor: 'pointer', fontWeight: '700' }}>
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type="submit" disabled={!customTitle.trim() || customItems.length === 0} className="treino-start-btn" style={{ width: '100%' }}>
              Salvar Rotina no Banco de Dados
            </button>
          </form>

          <div className="treino-rotinas-grid">
            {rotinasCustom.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                Você ainda não criou rotinas personalizadas. Vá em <strong>Explorar</strong> para montar a sua!
              </div>
            ) : (
              rotinasCustom.map((r) => (
                <div key={r.id} className="treino-rotina-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="treino-nivel-tag">Personalizado</span>
                    <button
                      type="button"
                      onClick={async () => { await templofitService.deleteRoutine(r.id); await carregarDadosTurso(); }}
                      style={{ background: 'transparent', border: 'none', color: '#F87171', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Excluir
                    </button>
                  </div>
                  <h4 className="treino-rotina-titulo">{r.titulo}</h4>
                  <p className="treino-rotina-foco">{r.exercicios.length} exercícios • {r.duracao}</p>
                  <button className="treino-start-btn" onClick={() => iniciarTreino(r)}>
                    Iniciar Meu Treino →
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : abaAtiva === 'gifs' ? (
        <div className="animate-fade-in">
          {/* HEADER INFORMATIVO */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,78,59,0.22))',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#10B981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  • AUDITORIA &amp; CONFERÊNCIA
                </span>
                <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '999px', fontWeight: '800' }}>
                  {TEMPLOFIT_CATALOGUE.length} GIFs Ativos
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF', fontWeight: '800' }}>
                Todos os GIFs de Exercícios • TemploFit
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94A3B8' }}>
                Veja cada exercício em loop contínuo, confira se o movimento corresponde ao nome e audite o arquivo físico.
              </p>
            </div>
          </div>

          {/* BUSCA E FILTROS */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Buscar por exercício, grupo muscular ou arquivo gif..."
              value={buscaGifs}
              onChange={(e) => setBuscaGifs(e.target.value)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.28)',
                background: '#0F172A',
                color: '#FFF',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div className="treino-chips-bar" style={{ marginBottom: '16px' }}>
            {MUSCLE_FILTERS.map((m) => (
              <button
                key={m.id}
                className={`treino-chip ${filtroMusculoGifs === m.id ? 'active' : ''}`}
                onClick={() => setFiltroMusculoGifs(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* GRID RESPONSIVO DE GIFS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '14px'
          }}>
            {gifsFiltrados.map((ex) => {
              const fileName = ex.gifUrl.split('/').pop();
              return (
                <div
                  key={ex.id}
                  className="treino-rotina-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: '#13161F',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  {/* CONTAINER DO GIF EM LOOP */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '170px',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}>
                    <img
                      src={ex.gifUrl}
                      alt={ex.nome}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      background: 'rgba(15, 23, 42, 0.88)',
                      backdropFilter: 'blur(4px)',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.62rem',
                      fontWeight: '800',
                      color: '#34D399',
                      border: '1px solid rgba(52, 211, 153, 0.3)'
                    }}>
                      <span className="templofit-live-dot" />
                      <span>GIF ATIVO</span>
                    </div>

                    <div style={{
                      position: 'absolute',
                      bottom: '6px',
                      right: '6px',
                      background: 'rgba(15, 23, 42, 0.92)',
                      color: '#38BDF8',
                      fontFamily: 'monospace',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      padding: '2px 7px',
                      borderRadius: '6px',
                      border: '1px solid rgba(56, 189, 248, 0.3)'
                    }}>
                      {fileName}
                    </div>
                  </div>

                  {/* INFORMAÇÕES */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span className="treino-nivel-tag" style={{ fontSize: '0.62rem' }}>
                        {ex.origem || (ex.ambiente === 'casa' ? 'Em Casa' : 'Academia')}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: '700' }}>
                        ID: {ex.id}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', color: '#FFFFFF', fontWeight: '700' }}>
                      {ex.nome}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.74rem', color: '#94A3B8', lineHeight: '1.3' }}>
                      {ex.descricao || 'Execução controlada com postura firme.'}
                    </p>
                  </div>

                  {/* MÚSCULOS */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                    {(ex.musculos || []).map((m) => (
                      <span
                        key={m}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          color: '#CBD5E1',
                          fontSize: '0.62rem',
                          fontWeight: '700',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* AÇÕES */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setExercicioDetalhe(ex)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(148,163,184,0.3)',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#E2E8F0',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Ver Detalhes
                    </button>
                    <button
                      type="button"
                      onClick={() => addExercicioAoConstrutor(ex)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#10B981',
                        color: '#052E16',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      + Meu Treino
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* GRÁFICO 1: EVOLUÇÃO DE PESO CORPORAL (LINHA + ÁREA SVG) */}
          <div className="treino-rotina-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h4 style={{ margin: 0, color: '#FFF' }}>Evolução de Peso Corporal (kg)</h4>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Peso atual: <strong style={{ color: '#38BDF8' }}>{pesoCorporal} kg</strong> • {pesoHistorico.length} registro(s)
                </span>
              </div>
              <button type="button" onClick={() => { setInputPesoTemp(pesoCorporal); setShowModalPeso(true); }} className="treino-chip active">
                + Registrar Hoje
              </button>
            </div>
            {pesoHistorico.length < 2 ? (
              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(56,189,248,0.08)', border: '1px dashed rgba(56,189,248,0.3)', fontSize: '0.8rem', color: '#CBD5E1' }}>
                Registre seu peso pelo menos 2 vezes em dias diferentes para desenhar sua curva de evolução aqui.
              </div>
            ) : (
              (() => {
                const pts = pesoHistorico.slice(-10);
                const minW = Math.min(...pts.map((p) => p.pesoKg)) - 1.5;
                const maxW = Math.max(...pts.map((p) => p.pesoKg)) + 1.5;
                const W = 300;
                const H = 95;
                const coords = pts.map((p, idx) => {
                  const x = pts.length === 1 ? W / 2 : 14 + (idx * (W - 28)) / (pts.length - 1);
                  const y = H - 18 - ((p.pesoKg - minW) / Math.max(1, maxW - minW)) * (H - 34);
                  return { ...p, x, y };
                });
                const polyline = coords.map((c) => `${c.x},${c.y}`).join(' ');
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '130px', overflow: 'visible' }}>
                    <polyline fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={polyline} />
                    {coords.map((c) => (
                      <g key={c.id}>
                        <circle cx={c.x} cy={c.y} r="4" fill="#0EA5E9" stroke="#FFF" strokeWidth="1.5" />
                        <text x={c.x} y={c.y - 9} textAnchor="middle" fill="#BAE6FD" fontSize="9" fontWeight="700">{c.pesoKg}</text>
                        <text x={c.x} y={H - 2} textAnchor="middle" fill="#94A3B8" fontSize="8">{c.label}</text>
                      </g>
                    ))}
                  </svg>
                );
              })()
            )}
          </div>

          {/* GRÁFICO 2: FREQUÊNCIA SEMANAL & VOLUME TOTAL (ESTILO OPENGYM) */}
          <div className="treino-rotina-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, color: '#FFF' }}>Frequência &amp; Volume Semanal</h4>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#34D399' }}>
                {historicoTreinos.reduce((acc, h) => acc + Number(h.volumeKg || 0), 0).toLocaleString('pt-BR')} kg totais
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '92px', paddingTop: '8px' }}>
              {diasSemana.map((dia, idx) => {
                const count = historicoTreinos.filter((t) => t.diaSemana === idx).length;
                const barH = count === 0 ? 12 : Math.min(100, 28 + count * 22);
                return (
                  <div key={dia} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.68rem', color: count > 0 ? '#34D399' : '#64748B', fontWeight: '700' }}>{count}</span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '28px',
                        height: `${barH}%`,
                        borderRadius: '6px 6px 2px 2px',
                        background: count > 0 ? 'linear-gradient(180deg, #10B981, #059669)' : 'rgba(148,163,184,0.16)',
                      }}
                    />
                    <span style={{ fontSize: '0.66rem', color: idx === hojeDia ? '#FFF' : '#94A3B8', fontWeight: idx === hojeDia ? '800' : '600' }}>{dia}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GRÁFICO 3: DISTRIBUIÇÃO DE FASES CONCLUÍDAS */}
          <div className="treino-rotina-card">
            <h4 style={{ margin: '0 0 12px', color: '#FFF' }}>Progresso por Fase &amp; Modalidade</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PROGRAMAS_TEMPLOFIT.map((prog) => {
                const done = historicoTreinos.filter((h) => h.fase === prog.fase || h.rotinaId === prog.id).length;
                const pct = Math.min(100, Math.round((done / prog.metaSessoes) * 100));
                return (
                  <div key={prog.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                      <span style={{ color: '#E2E8F0', fontWeight: '700' }}>{prog.titulo}</span>
                      <span style={{ color: '#FBBF24', fontWeight: '800' }}>{done}/{prog.metaSessoes} ({pct}%)</span>
                    </div>
                    <div style={{ height: '7px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #10B981)', borderRadius: '999px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="treino-rotina-card">
            <h4 style={{ margin: '0 0 12px', color: '#FFF' }}>Histórico Completo de Treinos ({historicoTreinos.length})</h4>
            {historicoTreinos.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: 0 }}>Nenhum treino registrado ainda.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {historicoTreinos.slice(0, 15).map((h) => (
                  <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '10px', background: 'rgba(15,23,42,0.65)', border: '1px solid rgba(148,163,184,0.14)' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.84rem', color: '#FFF' }}>{h.titulo}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{h.data} • {h.duracao || `${h.duracaoMinutos || 15} min`}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#34D399', display: 'block' }}>
                        {h.volumeKg > 0 ? `${h.volumeKg} kg mov.` : 'Concluído'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES DO EXERCÍCIO */}
      {exercicioDetalhe && (
        <div className="treino-modal-overlay" onClick={() => setExercicioDetalhe(null)}>
          <div className="treino-modal-card" style={{ maxWidth: '440px', maxHeight: '88vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: '1.05rem', color: '#FFF' }}>{exercicioDetalhe.nome}</h4>
                {exercicioDetalhe.nomeEn && exercicioDetalhe.nomeEn !== exercicioDetalhe.nome && (
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{exercicioDetalhe.nomeEn}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setExercicioDetalhe(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer', lineHeight: '1' }}
              >
                ✕
              </button>
            </div>

            {/* PLAYER DE VÍDEO OU GIF */}
            <div style={{ marginBottom: '14px' }}>
              {exercicioDetalhe.clipUrl ? (
                <OpenGymVideoPlayer
                  clipUrl={exercicioDetalhe.clipUrl}
                  stillUrl={exercicioDetalhe.stillUrl}
                  title={exercicioDetalhe.nome}
                />
              ) : (
                <div className="templofit-dual-visual">
                  <ExerciseAvatarPlayer
                    animType={exercicioDetalhe.animType}
                    gifUrl={exercicioDetalhe.gifUrl}
                    exerciseName={exercicioDetalhe.nome}
                  />
                  <div className="templofit-map-box">
                    <MuscleMap highlightMuscles={exercicioDetalhe.musculos || []} view="ambos" size="sm" />
                  </div>
                </div>
              )}
            </div>

            {/* TAGS DE MÚSCULOS E EQUIPAMENTOS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              <span className="treino-nivel-tag" style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399' }}>
                Equipamento: {exercicioDetalhe.equipmentPt || exercicioDetalhe.equipment || 'Livre'}
              </span>
              <span className="treino-nivel-tag" style={{ background: 'rgba(56,189,248,0.15)', color: '#38BDF8' }}>
                Alvo: {exercicioDetalhe.bodyPartPt || exercicioDetalhe.bodyPart || exercicioDetalhe.target || 'Geral'}
              </span>
            </div>

            {/* INSTRUÇÕES PASSO A PASSO */}
            {exercicioDetalhe.instructions && exercicioDetalhe.instructions.length > 0 ? (
              <div style={{ background: 'rgba(15, 23, 42, 0.65)', padding: '12px', borderRadius: '12px', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                  Passo a Passo de Execução:
                </span>
                <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#CBD5E1', lineHeight: '1.45' }}>
                  {exercicioDetalhe.instructions.map((step, sIdx) => (
                    <li key={sIdx} style={{ marginBottom: '4px' }}>{step}</li>
                  ))}
                </ol>
              </div>
            ) : exercicioDetalhe.descricao ? (
              <p style={{ fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '12px' }}>{exercicioDetalhe.descricao}</p>
            ) : null}

            <div className="treino-modal-actions">
              <button className="treino-modal-cancel" onClick={() => setExercicioDetalhe(null)}>Fechar</button>
              <button className="treino-modal-save" onClick={() => addExercicioAoConstrutor(exercicioDetalhe)}>+ Adicionar ao Meu Treino</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ATUALIZAÇÃO DE PESO CORPORAL */}
      {showModalPeso && (
        <div className="treino-modal-overlay" onClick={() => setShowModalPeso(false)}>
          <div className="treino-modal-card" onClick={(e) => e.stopPropagation()}>
            <h4>Registrar Peso Corporal</h4>
            <p>Salve no banco de dados para acompanhar sua evolução no gráfico:</p>
            <input
              type="number"
              step="0.1"
              value={inputPesoTemp}
              onChange={(e) => setInputPesoTemp(e.target.value)}
              placeholder="Ex: 74.5"
              className="treino-modal-input"
              autoFocus
            />
            <div className="treino-modal-actions">
              <button className="treino-modal-cancel" onClick={() => setShowModalPeso(false)}>Cancelar</button>
              <button className="treino-modal-save" onClick={salvarPeso}>Salvar no Banco</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
