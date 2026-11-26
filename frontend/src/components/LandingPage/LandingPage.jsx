import React, { useState } from 'react';
import './LandingPage.css';
import { sendLeadWebhook } from '../../services/webhookService';
import appLogoWhite from '../../assets/logomarca_dark.png';
import imgTreinoTemplo from '../../assets/landing/treino_templo.jpg';
import imgMeditacaoNarrada from '../../assets/landing/meditacao_narrada.jpg';
import imgConviteVip from '../../assets/landing/convite_vip.jpg';
import imgHeroMockup from '../../assets/landing/hero_mockup_1convite.jpg';
import LegalModalPage from '../Legal/LegalModalPage';
import LgpdBanner from '../Legal/LgpdBanner';
import AsaasCheckoutModal from '../Checkout/AsaasCheckoutModal';

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
  const [legalTab, setLegalTab] = useState(null);
  const [checkoutPlan, setCheckoutPlan] = useState(() => {
    if (typeof window === 'undefined') return null;
    const path = (window.location.pathname || '/').toLowerCase();
    const params = new URLSearchParams(window.location.search);
    const paramPlano = (params.get('plano') || params.get('checkout') || '').toLowerCase();
    if (path === '/checkout' || path.startsWith('/checkout/') || paramPlano) {
      if (['semente', 'edificacao', 'familia'].includes(paramPlano)) return paramPlano;
      return 'edificacao';
    }
    return null;
  });

  const [openFaq, setOpenFaq] = useState(0);
  const [recentPurchases, setRecentPurchases] = useState(() => {
    const pool = [
      { name: 'Mariana S.', planTitle: 'Plano Edificação', convites: 3, timeLabel: 'há 6 min' },
      { name: 'Lucas M.', planTitle: 'Plano Reino', convites: 5, timeLabel: 'há 14 min' },
      { name: 'Fernanda R.', planTitle: 'Plano Edificação', convites: 3, timeLabel: 'há 19 min' },
      { name: 'Rafael O.', planTitle: 'Plano Reino', convites: 5, timeLabel: 'há 27 min' },
      { name: 'Camila P.', planTitle: 'Plano Edificação', convites: 3, timeLabel: 'há 34 min' },
      { name: 'Gabriel A.', planTitle: 'Plano Edificação', convites: 3, timeLabel: 'há 41 min' },
      { name: 'Juliana C.', planTitle: 'Plano Reino', convites: 5, timeLabel: 'há 49 min' },
      { name: 'Thiago N.', planTitle: 'Plano Edificação', convites: 3, timeLabel: 'há 58 min' },
      { name: 'Patrícia L.', planTitle: 'Plano Reino', convites: 5, timeLabel: 'há 1h' },
      { name: 'Bruno V.', planTitle: 'Plano Edificação', convites: 3, timeLabel: 'há 1h' },
      { name: 'Aline B.', planTitle: 'Plano Edificação', convites: 3, timeLabel: 'há 2h' },
      { name: 'Rodrigo G.', planTitle: 'Plano Reino', convites: 5, timeLabel: 'há 2h' },
      { name: 'Beatriz F.', planTitle: 'Plano Edificação', convites: 3, timeLabel: 'há 2h' },
      { name: 'Daniel K.', planTitle: 'Plano Reino', convites: 5, timeLabel: 'há 3h' },
      { name: 'Larissa T.', planTitle: 'Plano Edificação', convites: 3, timeLabel: 'há 3h' },
      { name: 'Eduardo H.', planTitle: 'Plano Edificação', convites: 3, timeLabel: 'há 4h' },
      { name: 'Vanessa D.', planTitle: 'Plano Reino', convites: 5, timeLabel: 'há 4h' },
      { name: 'Felipe W.', planTitle: 'Plano Edificação', convites: 3, timeLabel: 'há 5h' },
      { name: 'Priscila Z.', planTitle: 'Plano Reino', convites: 5, timeLabel: 'há 5h' },
      { name: 'Henrique J.', planTitle: 'Plano Edificação', convites: 3, timeLabel: 'há 6h' },
    ];
    return [...pool].sort(() => Math.random() - 0.5);
  });
  const [socialIdx, setSocialIdx] = useState(0);
  const [socialVisible, setSocialVisible] = useState(false);
  const [socialDismissed, setSocialDismissed] = useState(false);
  const particlesCanvasRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = (window.location.pathname || '/').toLowerCase();
    if (path === '/checkout' || path.startsWith('/checkout/')) {
      const el = document.getElementById('planos');
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150);
    }

    const revealEls = document.querySelectorAll('.sp-section, .sp-plan-card, .sp-bento-card, .sp-mentor-card');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sp-revealed');
          }
        });
      },
      { threshold: 0.08 }
    );
    revealEls.forEach((el) => {
      el.classList.add('sp-reveal');
      io.observe(el);
    });

    const glowTargets = document.querySelectorAll('.sp-plan-card, .sp-bento-card, .sp-download-box');
    const onGlowMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };
    glowTargets.forEach((el) => el.addEventListener('mousemove', onGlowMove));

    return () => {
      io.disconnect();
      glowTargets.forEach((el) => el.removeEventListener('mousemove', onGlowMove));
    };
  }, []);

  React.useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiBase = isLocalhost
      ? 'http://localhost:3001/api/v1'
      : (import.meta.env.VITE_API_URL || 'https://oneconvite.onrender.com/api/v1');

    fetch(`${apiBase}/pagamentos/recentes`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.recent) && data.recent.length > 0) {
          const filtered = data.recent.filter((p) => p.convites >= 3);
          if (filtered.length > 0) {
            setRecentPurchases((prev) => [...filtered, ...prev]);
          }
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    if (recentPurchases.length === 0 || socialDismissed) return;
    let showTimer;
    let hideTimer;
    let cancelled = false;

    const scheduleCycle = (initialDelayMs) => {
      showTimer = setTimeout(() => {
        if (cancelled) return;
        setSocialVisible(true);
        hideTimer = setTimeout(() => {
          if (cancelled) return;
          setSocialVisible(false);
          setSocialIdx((prev) => (prev + 1) % recentPurchases.length);
          const nextPause = 22000 + Math.floor(Math.random() * 16000);
          scheduleCycle(nextPause);
        }, 6000);
      }, initialDelayMs);
    };

    scheduleCycle(9000);
    return () => {
      cancelled = true;
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [recentPurchases.length, socialDismissed]);

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
          <div className="sp-brand" onClick={onEnterApp} style={{ cursor: 'pointer' }}>
            <img src={appLogoWhite} alt="1Convite - Compartilhando o Reino" style={{ height: '38px', width: 'auto', objectFit: 'contain' }} />
          </div>

          <nav className="sp-nav-links">
            <a href="#recursos">Recursos</a>
            <a href="#planos">Planos & Convites</a>
            <a href="#mentores">Mentores</a>
            <a href="/blog/">Blog</a>
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
              <span style={{ color: '#F97316' }}>O Reino no seu </span>
              <span style={{ color: '#1ED760' }}>bolso.</span>
            </h1>

            <p className="sp-hero-sub">
              Seu ecossistema diário completo: Bíblia Sagrada ACF com áudio, meditações que você pode ler ou ouvir narradas, Treino Templo para saúde física, Oração Guiada, Mentores Bíblicos, Espaço Kids e Convites para abençoar vidas.
            </p>

            <div className="sp-hero-actions">
              <a href="#planos" className="sp-btn-cta-green" style={{ textDecoration: 'none' }}>
                <IconFlame />
                <span>Escolher Meu Plano</span>
              </a>

              <button type="button" onClick={handleDownloadApp} className="sp-btn-cta-dark" style={{ cursor: 'pointer' }}>
                <IconDownload />
                <span>Baixar o aplicativo</span>
              </button>
            </div>

            <div className="sp-hero-stats">
              <div className="sp-stat-item">
                <span className="sp-stat-num">31.106</span>
                <span className="sp-stat-label">Versículos & Áudio</span>
              </div>
              <div className="sp-stat-divider" />
              <div className="sp-stat-item">
                <span className="sp-stat-num">365</span>
                <span className="sp-stat-label">Meditações Narradas</span>
              </div>
              <div className="sp-stat-divider" />
              <div className="sp-stat-item">
                <span className="sp-stat-num">10+</span>
                <span className="sp-stat-label">Módulos do Reino</span>
              </div>
            </div>
          </div>

          <div className="sp-hero-media">
            <div className="sp-card-frame">
              <img
                src={imgHeroMockup}
                alt="1Convite Mobile Experience"
                className="sp-mockup-img"
              />
              <div className="sp-floating-player-chip">
                <div className="sp-player-icon-pulse">
                  <IconHeadphones />
                </div>
                <div>
                  <div className="sp-chip-title">Meditação do Dia — Narrada</div>
                  <div className="sp-chip-subtitle">Leia ou ouça onde estiver</div>
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

      {/* ── SEÇÃO: DESTAQUES VISUAIS DO ECOSSISTEMA ── */}
      <section id="recursos" className="sp-section">
        <div className="sp-container">
          <div className="sp-section-heading">
            <span className="sp-kicker">CORPO, ALMA & ESPÍRITO</span>
            <h2 className="sp-title">Tudo o que você vive dentro do 1Convite</h2>
            <p className="sp-desc">Uma plataforma completa que une Palavra, meditação narrada, saúde física e compartilhamento do Reino.</p>
          </div>

          <div className="sp-showcase-grid" style={{ marginBottom: '40px' }}>
            <div className="sp-showcase-card">
              <div className="sp-showcase-img-wrap">
                <img src={imgMeditacaoNarrada} alt="Meditação Diária para ler e ouvir narrada" className="sp-showcase-img" />
                <span className="sp-showcase-badge">Leitura + Narração</span>
              </div>
              <div className="sp-showcase-body">
                <h3>Meditação Diária & Café com Deus</h3>
                <p>Leia o devocional do dia ou aperte o play para ouvir de forma narrativa e imersiva — ideal para começar a manhã, dirigir ou descansar.</p>
              </div>
            </div>

            <div className="sp-showcase-card">
              <div className="sp-showcase-img-wrap">
                <img src={imgTreinoTemplo} alt="Treino Templo - Exercícios Físicos" className="sp-showcase-img" />
                <span className="sp-showcase-badge">Treino Templo</span>
              </div>
              <div className="sp-showcase-body">
                <h3>Exercícios Físicos & Saúde</h3>
                <p>Cuide do seu corpo como templo do Espírito Santo com treinos guiados, mapeamento muscular e rotina prática para manter disposição e disciplina.</p>
              </div>
            </div>

            <div className="sp-showcase-card">
              <div className="sp-showcase-img-wrap">
                <img src={imgConviteVip} alt="Convites Exclusivos do Reino" className="sp-showcase-img" />
                <span className="sp-showcase-badge">1Convite VIP</span>
              </div>
              <div className="sp-showcase-body">
                <h3>Convites Gratuitos para Presentear</h3>
                <p>Cada plano libera códigos de convite exclusivos. Quem recebe o seu código entra no aplicativo com acesso total e gratuito a tudo!</p>
              </div>
            </div>
          </div>

          <div className="sp-cards-grid">
            <div className="sp-card sp-card-featured">
              <div className="sp-card-icon-circle">
                <IconBible />
              </div>
              <span className="sp-card-tag">CANÔNICO</span>
              <h3>Bíblia ACF Completa & Áudio</h3>
              <p>Texto fidedigno com 31.106 versículos, busca instantânea, anotações e narração em áudio para ouvir qualquer capítulo.</p>
              <div className="sp-card-footer">
                <span>66 Livros • VT & NT</span>
              </div>
            </div>

            <div className="sp-card">
              <div className="sp-card-icon-circle">
                <IconShield />
              </div>
              <span className="sp-card-tag">365 DIAS</span>
              <h3>Oração Guiada & Matriz Anual</h3>
              <p>Códigos práticos de domínio próprio, oração guiada em fases, Espaço Mulher Virtuosa, Biblioteca do Pregador e Espaço Kids.</p>
              <div className="sp-card-footer">
                <span>Para Toda a Família</span>
              </div>
            </div>

            <div className="sp-card">
              <div className="sp-card-icon-circle">
                <IconSparkles />
              </div>
              <span className="sp-card-tag">SABEDORIA</span>
              <h3>Mentores Bíblicos</h3>
              <p>Conselhos e discernimento fundamentados nas Escrituras com os 7 grandes mentores da história da fé.</p>
              <div className="sp-card-footer">
                <span>7 Mentores Canônicos</span>
              </div>
            </div>

            <div className="sp-card">
              <div className="sp-card-icon-circle">
                <IconCrown />
              </div>
              <span className="sp-card-tag">CRONOLOGIA</span>
              <h3>Trilha do Reino & E-books</h3>
              <p>Plano cronológico de leitura com marcos de fé, acervo de e-books edificantes e acompanhamento diário.</p>
              <div className="sp-card-footer">
                <span>Crescimento Contínuo</span>
              </div>
            </div>

            <div className="sp-card">
              <div className="sp-card-icon-circle">
                <IconPalette />
              </div>
              <span className="sp-card-tag">ESTÚDIO</span>
              <h3>Studio de Cards & Convites</h3>
              <p>Crie cartões bíblicos visuais em segundos e envie seu código de convite pelo WhatsApp para transformar vidas.</p>
              <div className="sp-card-footer">
                <span>Compartilhamento Ágil</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO: BÔNUS INCLUSOS — 5 E-BOOKS PREMIUM COM CAPAS OFICIAIS ── */}
      <section id="bonus-ebooks" className="sp-section sp-section-elevated">
        <div className="sp-container">
          <div className="sp-section-heading">
            <span className="sp-kicker">BÔNUS INCLUSOS NOS PLANOS</span>
            <h2 className="sp-title">Biblioteca Digital com 5 E-books Completos</h2>
            <p className="sp-desc">
              Além de todo o aplicativo, você recebe acesso imediato e download em PDF dos 5 livros digitais oficiais do ecossistema 1Convite.
            </p>
          </div>

          <div className="sp-ebooks-showcase">
            {[
              {
                title: 'As Parábolas de Jesus',
                tag: 'Estudo Teológico',
                cover: '/ebooks/covers/as-parabolas-de-jesus.jpg',
              },
              {
                title: 'Cristo como Centro das Escrituras',
                tag: 'Teologia Bíblica',
                cover: '/ebooks/covers/cristo-centro-escrituras.jpg',
              },
              {
                title: 'O Poder da Oração do Salmo 91',
                tag: 'Proteção & Fé',
                cover: '/ebooks/covers/poder-oracao-salmo-91.jpg',
              },
              {
                title: 'Tesouros do Conhecimento Bíblico',
                tag: 'História & Contexto',
                cover: '/ebooks/covers/tesouros-conhecimento-biblico.jpg',
              },
              {
                title: 'Devocional Café com Deus',
                tag: 'Devocional Diário',
                cover: '/ebooks/covers/devocional-cafe-com-deus.jpg',
              },
            ].map((eb, idx) => (
              <a href="#planos" key={idx} className="sp-ebook-bonus-card">
                <div className="sp-ebook-bonus-cover-wrap">
                  <img src={eb.cover} alt={eb.title} className="sp-ebook-bonus-cover" loading="lazy" />
                  <span className="sp-ebook-bonus-pill">Bônus Incluso</span>
                </div>
                <div className="sp-ebook-bonus-info">
                  <span className="sp-ebook-bonus-tag">{eb.tag}</span>
                  <h4>{eb.title}</h4>
                  <span className="sp-ebook-bonus-meta">PDF Completo + Leitura no App</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO: OS 3 PLANOS & CONVITES GRATUITOS ── */}
      <section id="planos" className="sp-section sp-section-elevated">
        <div className="sp-container">
          <div className="sp-section-heading">
            <span className="sp-kicker">PLANOS & CONVITES DO REINO</span>
            <h2 className="sp-title">Escolha seu Plano e Abençoe Outras Vidas</h2>
            <p className="sp-desc">Ao adquirir qualquer plano, você recebe códigos de convite para liberar o acesso completo gratuitamente para quem você ama.</p>
          </div>

          <div className="sp-plans-grid">
            {/* Plano Básico */}
            <div className="sp-plan-card">
              <span className="sp-plan-tier">Plano Básico • Anual</span>
              <h3 className="sp-plan-title">Semente</h3>
              <p className="sp-plan-subtitle">Ideal para sua jornada diária pessoal + 1 pessoa especial.</p>
              <div className="sp-plan-price-row">
                <span className="sp-plan-currency">R$</span>
                <span className="sp-plan-amount">67</span>
                <span className="sp-plan-period">/ano</span>
              </div>
              <div className="sp-plan-invites-pill">
                <IconCheck />
                <span>Inclui 1 Vale-Presente (180 dias grátis)</span>
              </div>
              <div className="sp-plan-vouchers-preview" aria-label="1 convite incluído">
                <div className="sp-plan-vouchers-grid sp-plan-vouchers-grid-1">
                  <div className="sp-plan-voucher-thumb">
                    <div className="sp-mini-gv-top">
                      <img src={appLogoWhite} alt="1Convite" className="sp-mini-gv-brand" />
                      <span className="sp-mini-gv-seal">180</span>
                    </div>
                    <div>
                      <div className="sp-mini-gv-kicker">GIFT VOUCHER</div>
                      <span className="sp-mini-gv-title">Você é Especial</span>
                    </div>
                    <span className="sp-mini-gv-bar" />
                  </div>
                </div>
              </div>
              <ul className="sp-plan-features">
                <li><IconCheck /><span>Acesso anual completo à Bíblia ACF + Áudio</span></li>
                <li><IconCheck /><span>Meditação Diária (Leitura + Narração)</span></li>
                <li><IconCheck /><span>Treino Templo, Mentores e Espaço Kids</span></li>
                <li><IconCheck /><span>1 código exclusivo para liberar 6 meses grátis a um convidado</span></li>
              </ul>
              <button
                type="button"
                className="sp-btn-cta-dark"
                style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => setCheckoutPlan('basico')}
              >
                <span>Garantir Plano Básico</span>
                <IconArrowRight />
              </button>
            </div>

            {/* Plano Mais Popular */}
            <div className="sp-plan-card sp-plan-card-featured">
              <div className="sp-plan-popular-pill">MAIS POPULAR</div>
              <span className="sp-plan-tier">Mais Popular • Anual</span>
              <h3 className="sp-plan-title">Edificação</h3>
              <p className="sp-plan-subtitle">Perfeito para sua casa, família e amigos próximos.</p>
              <div className="sp-plan-price-row">
                <span className="sp-plan-currency">R$</span>
                <span className="sp-plan-amount">97</span>
                <span className="sp-plan-period">/ano</span>
              </div>
              <div className="sp-plan-invites-pill">
                <IconCheck />
                <span>Inclui 3 Vales-Presente (180 dias grátis)</span>
              </div>
              <div className="sp-plan-vouchers-preview" aria-label="3 convites incluídos">
                <div className="sp-plan-vouchers-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="sp-plan-voucher-thumb">
                      <div className="sp-mini-gv-top">
                        <img src={appLogoWhite} alt="1Convite" className="sp-mini-gv-brand" />
                        <span className="sp-mini-gv-seal">180</span>
                      </div>
                      <span className="sp-mini-gv-title">Especial</span>
                      <span className="sp-mini-gv-bar" />
                    </div>
                  ))}
                </div>
              </div>
              <ul className="sp-plan-features">
                <li><IconCheck /><span>Tudo do Plano Básico por 1 ano</span></li>
                <li><IconCheck /><span>Mulher Virtuosa, Biblioteca do Pregador & E-books</span></li>
                <li><IconCheck /><span>Studio de Cards e Oração Guiada completa</span></li>
                <li><IconCheck /><span>3 códigos exclusivos para seus convidados usarem 6 meses grátis</span></li>
              </ul>
              <button
                type="button"
                className="sp-btn-cta-green"
                style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => setCheckoutPlan('popular')}
              >
                <span>Garantir Plano Popular</span>
                <IconArrowRight />
              </button>
            </div>

            {/* Plano Avançado */}
            <div className="sp-plan-card">
              <span className="sp-plan-tier">Plano Avançado • Anual</span>
              <h3 className="sp-plan-title">Reino</h3>
              <p className="sp-plan-subtitle">Para líderes, células, ministérios e famílias grandes.</p>
              <div className="sp-plan-price-row">
                <span className="sp-plan-currency">R$</span>
                <span className="sp-plan-amount">147</span>
                <span className="sp-plan-period">/ano</span>
              </div>
              <div className="sp-plan-invites-pill">
                <IconCheck />
                <span>Inclui 5 Vales-Presente (180 dias grátis)</span>
              </div>
              <div className="sp-plan-vouchers-preview" aria-label="5 convites incluídos">
                <div className="sp-plan-vouchers-grid sp-plan-vouchers-grid-5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="sp-plan-voucher-thumb">
                      <div className="sp-mini-gv-top">
                        <img src={appLogoWhite} alt="1Convite" className="sp-mini-gv-brand" style={{ height: '7px' }} />
                        <span className="sp-mini-gv-seal" style={{ width: '13px', height: '13px', fontSize: '0.3rem' }}>180</span>
                      </div>
                      <span className="sp-mini-gv-title" style={{ fontSize: '0.44rem' }}>VIP</span>
                      <span className="sp-mini-gv-bar" style={{ height: '5px' }} />
                    </div>
                  ))}
                </div>
              </div>
              <ul className="sp-plan-features">
                <li><IconCheck /><span>Acesso anual total a todos os recursos</span></li>
                <li><IconCheck /><span>Todos os E-books, Trilhas e Mentores Bíblicos</span></li>
                <li><IconCheck /><span>5 códigos exclusivos para distribuir na sua célula ou igreja</span></li>
                <li><IconCheck /><span>Cada convidado ganha 6 meses gratuitos no app</span></li>
              </ul>
              <button
                type="button"
                className="sp-btn-cta-dark"
                style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => setCheckoutPlan('avancado')}
              >
                <span>Garantir Plano Avançado</span>
                <IconArrowRight />
              </button>
            </div>
          </div>

          <div className="sp-trust-bar">
            <span><IconCheck /> Pagamento seguro via PIX ou Cartão (Asaas)</span>
            <span><IconCheck /> Acesso VIP e convites enviados na hora por e-mail</span>
            <span><IconCheck /> 7 dias de garantia incondicional</span>
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

      {/* ── SEÇÃO: FAQ COMPACTO (LEI DE JAKOB & REDUÇÃO DE ATRITO) ── */}
      <section className="sp-section">
        <div className="sp-container" style={{ maxWidth: '780px' }}>
          <div className="sp-section-heading" style={{ marginBottom: '28px' }}>
            <span className="sp-kicker">DÚVIDAS FREQUENTES</span>
            <h2 className="sp-title">Perguntas Comuns</h2>
          </div>
          <div className="sp-faq-list">
            {[
              {
                q: 'Como funcionam os convites gratuitos de 180 dias?',
                a: 'Ao assinar qualquer plano, você recebe códigos exclusivos: 1 convite no Plano Básico (Semente), 3 convites no Plano Popular (Edificação) ou 5 convites no Plano Avançado (Reino). Basta enviar o código para um amigo ou familiar usar no cadastro e ele ganha 6 meses gratuitos no app.'
              },
              {
                q: 'Como recebo meu acesso após pagar?',
                a: 'Assim que o PIX ou cartão é confirmado pelo Asaas, seu acesso VIP é liberado automaticamente e você recebe seu e-mail de confirmação com todos os códigos de convite na hora.'
              },
              {
                q: 'Funciona no computador (Desktop), Android e iPhone?',
                a: 'Sim! No computador você acessa a versão Desktop completa em 1convite.com.br/app com navegação lateral dedicada, e no celular pode baixar o aplicativo oficial para Android ou usar no iPhone.'
              },
              {
                q: 'Tem garantia caso eu não me adapte?',
                a: 'Sim, você tem 7 dias de garantia incondicional a partir da compra.'
              }
            ].map((item, idx) => (
              <div key={idx} className={`sp-faq-item ${openFaq === idx ? 'open' : ''}`}>
                <button
                  type="button"
                  className="sp-faq-q"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                >
                  <span>{item.q}</span>
                  <span>{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && <p className="sp-faq-a">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CANÔNICO (PADRÃO SPOTIFY FOOTER) ── */}
      <footer className="sp-footer">
        <div className="sp-container">
          <div className="sp-footer-main">
            <div className="sp-footer-col-brand">
              <div className="sp-brand" onClick={onEnterApp} style={{ cursor: 'pointer' }}>
                <img src={appLogoWhite} alt="1Convite - Compartilhando o Reino" style={{ height: '38px', width: 'auto', objectFit: 'contain' }} />
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
              <a href="#planos" className="sp-footer-link">Planos & Convites</a>
              <a href="/blog/" className="sp-footer-link">Blog 1Convite</a>
            </div>

            <div className="sp-footer-col">
              <h4>Legal & LGPD</h4>
              <button type="button" className="sp-footer-link" onClick={() => setLegalTab('termos')}>Termos de Uso</button>
              <button type="button" className="sp-footer-link" onClick={() => setLegalTab('privacidade')}>Política de Privacidade</button>
              <button type="button" className="sp-footer-link" onClick={() => setLegalTab('lgpd')}>LGPD (Seus Dados)</button>
            </div>
          </div>

          <div className="sp-footer-bottom">
            <span>© 2026 1Convite • Todos os direitos reservados • Fiel à Palavra</span>
            <div className="sp-footer-badges">
              <span className="sp-micro-badge">Conforme LGPD</span>
              <span className="sp-micro-badge">SSL 256-Bit</span>
            </div>
          </div>
        </div>
      </footer>

      {legalTab && (
        <LegalModalPage initialTab={legalTab} onClose={() => setLegalTab(null)} />
      )}
      <AsaasCheckoutModal
        isOpen={Boolean(checkoutPlan)}
        planId={checkoutPlan}
        onClose={() => setCheckoutPlan(null)}
      />
      {!socialDismissed && socialVisible && recentPurchases.length > 0 && (
        <div className="sp-social-toast" role="status" aria-live="polite">
          <div className="sp-social-toast-icon">
            <IconCheck />
          </div>
          <div className="sp-social-toast-body">
            <strong>{recentPurchases[socialIdx]?.name}</strong> garantiu o{' '}
            <span>{recentPurchases[socialIdx]?.planTitle}</span>
            <small>
              {recentPurchases[socialIdx]?.convites} convite{recentPurchases[socialIdx]?.convites > 1 ? 's' : ''} • {recentPurchases[socialIdx]?.timeLabel}
            </small>
          </div>
          <button
            type="button"
            className="sp-social-toast-close"
            onClick={() => setSocialDismissed(true)}
            aria-label="Fechar aviso"
          >
            ×
          </button>
        </div>
      )}
      <LgpdBanner onOpenLegal={(tab) => setLegalTab(tab)} />
    </div>
  );
}
