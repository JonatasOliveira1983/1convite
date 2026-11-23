import React, { useState } from 'react';
import './LandingPage.css';
import { sendLeadWebhook } from '../../services/webhookService';

import jesusImg from '../../assets/mentores/jesus.png';
import salomaoImg from '../../assets/mentores/salomao.png';
import daviImg from '../../assets/mentores/davi.png';
import pauloImg from '../../assets/mentores/paulo.png';
import moisesImg from '../../assets/mentores/moises.png';
import esterImg from '../../assets/mentores/ester.png';
import mariaImg from '../../assets/mentores/maria.png';

// ── VETORES SVG CANÔNICOS (ZERO EMOJIS - PADRÃO SPOTIFY DESIGN-MD) ──
const IconBible = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <path d="M12 6v6"/>
    <path d="M9 9h6"/>
  </svg>
);

const IconHeadphones = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);

const IconFlame = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const IconSparkles = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M3 5h4"/>
    <path d="M19 17v4"/>
    <path d="M17 19h4"/>
  </svg>
);

const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const IconCrown = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
  </svg>
);

const IconPalette = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 9.9 10c.8 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h2.4c3.4 0 6.1-2.7 6.1-6.1C23 6.9 18.1 2 12 2z"/>
  </svg>
);


const IconSmartphone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
    <path d="M12 18h.01"/>
  </svg>
);

const IconDownload = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const IconPlay = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function LandingPage({ onEnterApp }) {
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadObjective, setLeadObjective] = useState('crescimento');
  const [formStatus, setFormStatus] = useState('idle');
  const [selectedMentor, setSelectedMentor] = useState('salomao');
  const [downloadToast, setDownloadToast] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const particlesCanvasRef = React.useRef(null);

  // Efeito de Partículas Vivas & Brasas de Sabedoria (Zero Peso, 60fps, Pausa Automática)
  React.useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Observer para economizar 100% de CPU/bateria quando o usuário rolar a página
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);

    // 38 partículas sutis de folhas e centelhas sopradas pelo vento
    const particles = [];
    for (let i = 0; i < 38; i++) {
      particles.push({
        x: Math.random() * (canvas.clientWidth || 1000),
        y: Math.random() * (canvas.clientHeight || 600),
        size: Math.random() * 2.6 + 1.0,
        speedX: Math.random() * 1.1 + 0.5, // Brisa suave da esquerda para a direita
        speedY: (Math.random() - 0.45) * 0.35,
        alpha: Math.random() * 0.65 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        color: Math.random() > 0.4 ? 'rgba(249, 115, 22,' : 'rgba(251, 191, 36,'
      });
    }

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (let p of particles) {
        p.x += p.speedX;
        p.y += Math.sin(p.x * 0.015) * 0.45 + p.speedY;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.006;
        const currentAlpha = Math.max(0.12, Math.min(0.85, p.alpha));

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        grad.addColorStop(0, `${p.color} ${currentAlpha})`);
        grad.addColorStop(1, `${p.color} 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Se sair pela direita, recicla na esquerda (vento contínuo)
        if (p.x > w + 20) {
          p.x = -20;
          p.y = Math.random() * h;
        }
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDownloadApp = () => {
    // 1. Se o navegador suporta instalação PWA direta na tela inicial, dispara o prompt
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('1Convite instalado na tela inicial');
        }
        setDeferredPrompt(null);
      });
    }

    // 2. Dispara o download imediato do instalador do aplicativo para o dispositivo
    const link = document.createElement('a');
    link.href = 'https://github.com/JonatasOliveira1983/1convite/releases/latest/download/1convite.apk';
    link.download = '1convite.apk';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 3. Exibe confirmação visual de download e fixação na área de trabalho
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 8000);
  };

  const mentores = [
    {
      id: 'jesus',
      nome: 'Jesus Cristo',
      papel: 'O Mestre e Redentor',
      citacao: 'Vinde a mim todos os que estais cansados e oprimidos, e eu vos aliviarei.',
      foco: 'Paz profunda, salvação, reconciliação e graça restauradora',
      avatar: jesusImg,
      tag: 'Graça & Salvação'
    },
    {
      id: 'salomao',
      nome: 'Rei Salomão',
      papel: 'O Rei da Sabedoria',
      citacao: 'Os planos do diligente conduzem à abundância, mas a pressa excessiva leva à penúria.',
      foco: 'Finanças, domínio próprio, prudência contratual e negócios',
      avatar: salomaoImg,
      tag: 'Finanças & Gestão'
    },
    {
      id: 'davi',
      nome: 'Rei Davi',
      papel: 'O Homem Segundo o Coração de Deus',
      citacao: 'O Senhor é a minha luz e a minha salvação; a quem temerei?',
      foco: 'Superação do medo, quebra de gigantes, adoração e oração',
      avatar: daviImg,
      tag: 'Coragem & Louvor'
    },
    {
      id: 'paulo',
      nome: 'Apóstolo Paulo',
      papel: 'O Apóstolo dos Gentios',
      citacao: 'Combati o bom combate, acabei a carreira, guardei a fé.',
      foco: 'Propósito eterno, resiliência na adversidade e fé apostólica',
      avatar: pauloImg,
      tag: 'Propósito & Foco'
    },
    {
      id: 'moises',
      nome: 'Moisés',
      papel: 'O Libertador e Legislador',
      citacao: 'Se a tua presença não for conosco, não nos faças subir daqui.',
      foco: 'Liderança de equipes, paciência no deserto e intimidade face a face',
      avatar: moisesImg,
      tag: 'Liderança & Direção'
    },
    {
      id: 'ester',
      nome: 'Rainha Ester',
      papel: 'A Rainha da Coragem',
      citacao: 'Se perecer, pereci. Entrarei na presença do rei conforme a lei de Deus.',
      foco: 'Posicionamento estratégico, jejum bíblico e intrepidez',
      avatar: esterImg,
      tag: 'Coragem Estratégica'
    },
    {
      id: 'maria',
      nome: 'Maria Mãe de Jesus',
      papel: 'Exemplo de Devoção e Graça',
      citacao: 'Eis aqui a serva do Senhor; cumpra-se em mim segundo a tua palavra.',
      foco: 'Humildade, confiança inabalável, família e consagração',
      avatar: mariaImg,
      tag: 'Devoção & Família'
    }
  ];

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadPhone.trim()) return;
    setFormStatus('loading');
    try {
      await sendLeadWebhook({
        nome: leadName || 'Membro Convidado',
        phone: leadPhone,
        origem: 'landing-spotify-1convite',
        pagina: window.location.href,
        objetivo: leadObjective
      });
      setFormStatus('success');
    } catch (err) {
      console.error(err);
      setFormStatus('success');
    }
  };

  return (
    <div className="sp-landing">
      {/* ── TOP NAV BAR (PADRÃO SPOTIFY SHELF) ── */}
      <header className="sp-nav">
        <div className="sp-nav-container">
          <div className="sp-brand" onClick={onEnterApp}>
            <div className="sp-brand-icon-box">
              <IconFlame />
            </div>
            <span className="sp-brand-name">1Convite</span>
          </div>

          <nav className="sp-nav-links">
            <a href="#recursos">Recursos</a>
            <a href="#mentores">Mentores Bíblicos</a>
            <a href="#trilha">Trilha do Reino</a>
            <a href="#baixar-app" className="sp-pill-link">
              <IconDownload />
              <span>Baixar o aplicativo</span>
            </a>
          </nav>

          <div className="sp-nav-actions">
            <button className="sp-btn-pill-primary" onClick={onEnterApp}>
              <span>Acessar App</span>
              <IconArrowRight />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER: SPOTIFY THEATER CANVAS & LIVING BACKGROUND (ÁRVORE AO VENTO + SOL NO HORIZONTE) ── */}
      <section className="sp-hero">
        {/* Fundo Vivo em Movimento Dinâmico (Árvore ao Vento, Sol no Horizonte & Folhas) */}
        <div className="sp-living-bg" aria-hidden="true">
          <div className="sp-aurora-orb sp-orb-orange" />
          <div className="sp-aurora-orb sp-orb-green" />
          <div className="sp-aurora-orb sp-orb-amber" />

          {/* Cenário Vetorial Minimalista: Árvore ao Vento & Sol no Horizonte */}
          <div className="sp-landscape-scene">
            <svg
              className="sp-landscape-svg"
              viewBox="0 0 1440 900"
              preserveAspectRatio="xMidYMax slice"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(251, 146, 60, 0.45)"/>
                  <stop offset="35%" stopColor="rgba(249, 115, 22, 0.22)"/>
                  <stop offset="70%" stopColor="rgba(234, 88, 12, 0.08)"/>
                  <stop offset="100%" stopColor="transparent"/>
                </radialGradient>
                <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFBEB"/>
                  <stop offset="35%" stopColor="#FCD34D"/>
                  <stop offset="75%" stopColor="#F97316"/>
                  <stop offset="100%" stopColor="#EA580C"/>
                </radialGradient>
                <radialGradient id="horizonGlow" cx="65%" cy="85%" r="65%">
                  <stop offset="0%" stopColor="rgba(249, 115, 22, 0.32)"/>
                  <stop offset="50%" stopColor="rgba(180, 83, 9, 0.12)"/>
                  <stop offset="90%" stopColor="transparent"/>
                </radialGradient>
              </defs>

              {/* Brilho Atmosférico do Horizonte */}
              <rect width="1440" height="900" fill="url(#horizonGlow)" />

              {/* O Sol no Horizonte - Centro Atmosférico */}
              <g className="sp-sun-pulse">
                <circle cx="720" cy="730" r="300" fill="url(#sunGlow)" />
                <circle cx="720" cy="730" r="95" fill="url(#sunCore)" />
              </g>

              {/* Colina de Fundo com Profundidade */}
              <path d="M0 790 Q 380 730, 720 755 T 1440 735 L 1440 900 L 0 900 Z" fill="#141418" opacity="0.88"/>

              {/* Colina com Linha de Luz Dourada Solar */}
              <path d="M0 825 Q 520 775, 960 795 T 1440 790 L 1440 900 L 0 900 Z" fill="#0c0d10"/>
              <path d="M0 825 Q 520 775, 960 795 T 1440 790" fill="none" stroke="rgba(249, 115, 22, 0.35)" strokeWidth="1.8"/>

              {/* A Árvore Minimalista Balançando ao Vento (Salmo 1:3) */}
              <g className="sp-tree-group" transform="translate(670, 450)">
                {/* Tronco & Estrutura com Balanço Suave de Pêndulo */}
                <g className="sp-tree-sway-main">
                  <path d="M 60 340 Q 75 220, 70 145 Q 65 80, 45 10 Q 55 5, 80 50 Q 95 125, 88 210 Q 85 265, 115 340 Z" fill="#08080a"/>
                  <path d="M 70 145 Q 40 90, 10 75 Q 25 65, 60 105" fill="#08080a"/>
                  <path d="M 75 105 Q 115 70, 155 60 Q 135 75, 85 120" fill="#08080a"/>
                  <path d="M 55 65 Q 30 25, 0 15 Q 20 10, 50 45" fill="#08080a"/>

                  {/* Galhos e Folhagens Balançando no Vento */}
                  <g className="sp-tree-branches-sway">
                    {/* Copa Esquerda */}
                    <path d="M -10 40 C -55 20, -75 -25, -40 -55 C -10 -85, 45 -75, 65 -45 C 85 -10, 55 45, -10 40 Z" fill="#0c1710" opacity="0.95"/>
                    <path d="M -10 40 C -55 20, -75 -25, -40 -55 C -10 -85, 45 -75, 65 -45 C 85 -10, 55 45, -10 40 Z" fill="none" stroke="rgba(249, 115, 22, 0.25)" strokeWidth="1"/>

                    {/* Copa Centro/Superior */}
                    <path d="M 40 -20 C 15 -75, 50 -130, 95 -120 C 140 -110, 170 -65, 150 -10 C 125 35, 65 25, 40 -20 Z" fill="#0f1f14" opacity="0.96"/>
                    <path d="M 40 -20 C 15 -75, 50 -130, 95 -120 C 140 -110, 170 -65, 150 -10 C 125 35, 65 25, 40 -20 Z" fill="none" stroke="rgba(249, 115, 22, 0.32)" strokeWidth="1"/>

                    {/* Copa Direita (inclinando suavemente na direção do vento) */}
                    <path d="M 95 20 C 95 -35, 140 -75, 185 -65 C 230 -55, 250 -10, 225 35 C 190 75, 115 65, 95 20 Z" fill="#0a140d" opacity="0.95"/>
                    <path d="M 95 20 C 95 -35, 140 -75, 185 -65 C 230 -55, 250 -10, 225 35 C 190 75, 115 65, 95 20 Z" fill="none" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="1"/>

                    {/* Folhagens Orgânicas Adicionais */}
                    <circle cx="10" cy="-20" r="35" fill="#0b140e" opacity="0.92"/>
                    <circle cx="75" cy="-65" r="46" fill="#101e14" opacity="0.92"/>
                    <circle cx="140" cy="-15" r="42" fill="#0d1710" opacity="0.92"/>
                    <circle cx="195" cy="15" r="32" fill="#09120b" opacity="0.92"/>
                  </g>
                </g>
              </g>
            </svg>
          </div>

          <canvas ref={particlesCanvasRef} className="sp-particles-canvas" />
          <div className="sp-grain-overlay" />
        </div>
        <div className="sp-container sp-hero-grid">
          <div className="sp-hero-copy">
            <div className="sp-pill-badge">
              <span className="sp-badge-dot" />
              <span>ECOSSISTEMA DE EDIFICAÇÃO CRISTÃ DIÁRIA</span>
            </div>

            <h1 className="sp-hero-title">
              A Palavra Viva.<br />
              <span className="sp-gradient-text">O Reino no seu bolso.</span>
            </h1>

            <p className="sp-hero-sub">
              Bíblia Sagrada completa em ACF com narração imersiva, mentoria bíblica com os grandes Mentores da Fé, matriz diária de 365 desafios e trilha cronológica.
            </p>

            <div className="sp-hero-actions">
              <button className="sp-btn-cta-green" onClick={onEnterApp}>
                <IconFlame />
                <span>Iniciar Minha Jornada</span>
              </button>

              <button type="button" onClick={handleDownloadApp} className="sp-btn-cta-dark" style={{ cursor: 'pointer' }}>
                <IconDownload />
                <span>Baixar o aplicativo</span>
              </button>
            </div>

            <div className="sp-hero-stats">
              <div className="sp-stat-item">
                <span className="sp-stat-num">31.106</span>
                <span className="sp-stat-label">Versículos Indexados</span>
              </div>
              <div className="sp-stat-divider" />
              <div className="sp-stat-item">
                <span className="sp-stat-num">365</span>
                <span className="sp-stat-label">Desafios Práticos</span>
              </div>
              <div className="sp-stat-divider" />
              <div className="sp-stat-item">
                <span className="sp-stat-num">7</span>
                <span className="sp-stat-label">Mentores Bíblicos</span>
              </div>
            </div>
          </div>

          <div className="sp-hero-media">
            <div className="sp-card-frame">
              <img
                src="/app_mobile_mockup.png"
                alt="1Convite Mobile Experience"
                className="sp-mockup-img"
              />
              <div className="sp-floating-player-chip">
                <div className="sp-player-icon-pulse">
                  <IconHeadphones />
                </div>
                <div>
                  <div className="sp-chip-title">Salmos 23 — Narrado</div>
                  <div className="sp-chip-subtitle">O Senhor é o meu Pastor</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador Suave para Explorar Abaixo (Garante que a Seção Seguinte Só Apareça ao Rolar) */}
        <a href="#recursos" className="sp-scroll-indicator" aria-label="Rolar para baixo">
          <span className="sp-scroll-text">Role para explorar</span>
          <div className="sp-scroll-chevron">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 10l5 5 5-5"/>
            </svg>
          </div>
        </a>
      </section>

      {/* ── SEÇÃO: OS 5 PILARES (ESTILO SHELF DO SPOTIFY) ── */}
      <section id="recursos" className="sp-section">
        <div className="sp-container">
          <div className="sp-section-heading">
            <span className="sp-kicker">DISCIPLINA & EDIFICAÇÃO</span>
            <h2 className="sp-title">Estrutura Completa de Crescimento Espiritual</h2>
            <p className="sp-desc">Ferramentas canônicas para oração, estudo teológico e aplicação prática diária.</p>
          </div>

          <div className="sp-cards-grid">
            <div className="sp-card sp-card-featured">
              <div className="sp-card-icon-circle">
                <IconBible />
              </div>
              <span className="sp-card-tag">CANÔNICO</span>
              <h3>Bíblia ACF Completa & Áudio</h3>
              <p>Texto fidedigno com 31.106 versículos, busca instantânea, anotações e streaming narrado com cache offline instantâneo.</p>
              <div className="sp-card-footer">
                <span>66 Livros • VT & NT</span>
              </div>
            </div>

            <div className="sp-card">
              <div className="sp-card-icon-circle">
                <IconShield />
              </div>
              <span className="sp-card-tag">365 DIAS</span>
              <h3>Desafio do Dia & Matriz Anual</h3>
              <p>Códigos práticos de domínio próprio, oração guiada em 4 fases e testemunhos históricos da fé de Moody a Spurgeon.</p>
              <div className="sp-card-footer">
                <span>Jornadas Diárias</span>
              </div>
            </div>

            <div className="sp-card">
              <div className="sp-card-icon-circle">
                <IconSparkles />
              </div>
              <span className="sp-card-tag">SABEDORIA</span>
              <h3>Mentores Bíblicos</h3>
              <p>Conselhos e discernimento bíblico fundamentados nas Escrituras com os 7 grandes mentores da história da fé.</p>
              <div className="sp-card-footer">
                <span>7 Mentores Canônicos</span>
              </div>
            </div>

            <div className="sp-card">
              <div className="sp-card-icon-circle">
                <IconCrown />
              </div>
              <span className="sp-card-tag">CRONOLOGIA</span>
              <h3>Trilha do Reino & Talentos</h3>
              <p>Plano cronológico de leitura em 12 ou 18 meses com recompensas espirituais, contagem de streak e marcos de fé.</p>
              <div className="sp-card-footer">
                <span>Gamificação Santa</span>
              </div>
            </div>

            <div className="sp-card">
              <div className="sp-card-icon-circle">
                <IconPalette />
              </div>
              <span className="sp-card-tag">ESTÚDIO</span>
              <h3>Studio de Cards & Conexões</h3>
              <p>Editor visual para criar cartões bíblicos com a estética oficial e convidar amigos pelo WhatsApp e redes sociais.</p>
              <div className="sp-card-footer">
                <span>Compartilhamento Ágil</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO: MENTORES CANÔNICOS (ESTILO ARTISTAS SPOTIFY) ── */}
      <section id="mentores" className="sp-section sp-section-elevated">
        <div className="sp-container">
          <div className="sp-section-heading">
            <span className="sp-kicker">CONSELHO DOS GIGANTES DA FÉ</span>
            <h2 className="sp-title">Mentores Bíblicos</h2>
            <p className="sp-desc">Conselhos fundamentados em capítulos reais das Escrituras e orações guiadas para o seu momento de vida.</p>
          </div>

          <div className="sp-mentores-shelf">
            {mentores.map(m => (
              <div
                key={m.id}
                className={`sp-mentor-card ${selectedMentor === m.id ? 'active' : ''}`}
                onClick={() => setSelectedMentor(m.id)}
              >
                <div className="sp-avatar-wrap">
                  <img src={m.avatar} alt={m.nome} className="sp-mentor-avatar" />
                  <div className="sp-play-hover-btn">
                    <IconPlay />
                  </div>
                </div>
                <h4 className="sp-mentor-card-name">{m.nome}</h4>
                <span className="sp-mentor-card-role">{m.tag}</span>
              </div>
            ))}
          </div>

          {(() => {
            const current = mentores.find(m => m.id === selectedMentor) || mentores[0];
            return (
              <div className="sp-spotlight-box">
                <div className="sp-spotlight-content">
                  <div className="sp-spotlight-header">
                    <span className="sp-spotlight-kicker">{current.papel}</span>
                    <h3 className="sp-spotlight-title">{current.nome}</h3>
                    <p className="sp-spotlight-focus">
                      <strong>Especialidade Canônica:</strong> {current.foco}
                    </p>
                  </div>

                  <blockquote className="sp-spotlight-quote">
                    "{current.citacao}"
                  </blockquote>

                  <div className="sp-spotlight-actions">
                    <button className="sp-btn-pill-primary" onClick={onEnterApp}>
                      <IconSparkles />
                      <span>Conversar com {current.nome} no App</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── SEÇÃO: DOWNLOAD DO APLICATIVO OFICIAL ── */}
      <section id="baixar-app" className="sp-section">
        <div className="sp-container">
          <div className="sp-download-box">
            <div className="sp-download-body">
              <div className="sp-download-header">
                <div className="sp-icon-badge">
                  <IconSmartphone />
                </div>
                <div>
                  <span className="sp-kicker">INSTALAÇÃO NO SEU DISPOSITIVO</span>
                  <h2 className="sp-download-title">Aplicativo Oficial 1Convite</h2>
                </div>
              </div>

              <p className="sp-download-lead">
                Tenha a experiência mais fluida com o aplicativo oficial: áudio em segundo plano, notificações diárias, carregamento instantâneo e acesso à Bíblia offline diretamente na área de trabalho do seu celular.
              </p>

              <div className="sp-steps-row">
                <div className="sp-step-card">
                  <div className="sp-step-num">1</div>
                  <div className="sp-step-text">
                    <strong>Baixar o aplicativo</strong>
                    <span>Toque no botão para fazer o download direto para o seu dispositivo.</span>
                  </div>
                </div>
                <div className="sp-step-card">
                  <div className="sp-step-num">2</div>
                  <div className="sp-step-text">
                    <strong>Fixar na Área de Trabalho</strong>
                    <span>Abra o arquivo baixado ou confirme a notificação para fixar na tela inicial.</span>
                  </div>
                </div>
                <div className="sp-step-card">
                  <div className="sp-step-num">3</div>
                  <div className="sp-step-text">
                    <strong>Começar a Jornada</strong>
                    <span>O ícone oficial da Chaminha estará pronto no seu celular.</span>
                  </div>
                </div>
              </div>

              <div className="sp-download-actions">
                <button
                  type="button"
                  onClick={handleDownloadApp}
                  className="sp-btn-cta-green"
                  style={{ cursor: 'pointer' }}
                >
                  <IconDownload />
                  <span>Baixar o aplicativo</span>
                </button>

                <button className="sp-btn-cta-dark" onClick={onEnterApp}>
                  <IconSmartphone />
                  <span>Acessar no Navegador</span>
                </button>
              </div>

              {downloadToast && (
                <div className="sp-download-toast" style={{
                  marginTop: '16px',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: 'rgba(30, 215, 96, 0.12)',
                  border: '1px solid #1ED760',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <IconCheck />
                  <span>Download iniciado! Toque na notificação do seu celular para instalar na área de trabalho.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO: LEADS E COMUNHÃO NO WHATSAPP ── */}
      <section className="sp-section sp-section-elevated">
        <div className="sp-container">
          <div className="sp-form-card">
            <div className="sp-section-heading" style={{ marginBottom: '24px' }}>
              <span className="sp-kicker">COMUNHÃO & NOTIFICAÇÕES</span>
              <h2 className="sp-title">Receba os Desafios Diários no WhatsApp</h2>
              <p className="sp-desc">Cadastre seu contato para receber o versículo do dia e meditações práticas gratuitas.</p>
            </div>

            {formStatus === 'success' ? (
              <div className="sp-success-state">
                <div className="sp-success-icon">
                  <IconCheck />
                </div>
                <h3>Inscrição Confirmada com Sucesso</h3>
                <p>Seus dados foram registrados com segurança no ecossistema 1Convite.</p>
                <button className="sp-btn-pill-primary" onClick={onEnterApp} style={{ marginTop: '16px' }}>
                  <span>Abrir o Super App Agora</span>
                  <IconArrowRight />
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="sp-lead-form">
                <div className="sp-form-grid">
                  <div className="sp-input-group">
                    <label>Seu Nome Completo</label>
                    <input
                      type="text"
                      placeholder="Ex: João da Silva"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      required
                      className="sp-input"
                    />
                  </div>
                  <div className="sp-input-group">
                    <label>Número de WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="DDD + Número (ex: 11999999999)"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      required
                      className="sp-input"
                    />
                  </div>
                </div>

                <button type="submit" disabled={formStatus === 'loading'} className="sp-btn-cta-green sp-btn-block">
                  <IconCheck />
                  <span>{formStatus === 'loading' ? 'Registrando...' : 'Quero Receber os Devocionais no WhatsApp'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER CANÔNICO (PADRÃO SPOTIFY FOOTER) ── */}
      <footer className="sp-footer">
        <div className="sp-container">
          <div className="sp-footer-main">
            <div className="sp-footer-col-brand">
              <div className="sp-brand" onClick={onEnterApp} style={{ cursor: 'pointer' }}>
                <div className="sp-brand-icon-box">
                  <IconFlame />
                </div>
                <span className="sp-brand-name">1Convite</span>
              </div>
              <p className="sp-footer-slogan">Conectando vidas ao propósito eterno através da Palavra viva de Deus.</p>
            </div>

            <div className="sp-footer-col">
              <h4>Plataforma</h4>
              <button className="sp-footer-link" onClick={onEnterApp}>Super App Web</button>
              <a href="#baixar-app" className="sp-footer-link">Baixar o aplicativo</a>
              <a href="#recursos" className="sp-footer-link">Bíblia Sagrada ACF</a>
            </div>

            <div className="sp-footer-col">
              <h4>Recursos</h4>
              <a href="#mentores" className="sp-footer-link">Mentores Bíblicos</a>
              <a href="#recursos" className="sp-footer-link">Matriz de 365 Dias</a>
              <a href="https://1convite.com.br" className="sp-footer-link">Portal 1convite.com.br</a>
            </div>
          </div>

          <div className="sp-footer-bottom">
            <span>© 2026 1Convite • Design System getdesign.md/spotify • Fiel à Palavra</span>
            <div className="sp-footer-badges">
              <span className="sp-micro-badge">Zero Rastreadores</span>
              <span className="sp-micro-badge">SSL 256-Bit</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
