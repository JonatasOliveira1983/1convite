import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import html2canvas from 'html2canvas';
import { App as CapApp } from '@capacitor/app';
import { copyTextSafe, saveOrShareImage } from './utils/mobileActions';
const lazyWithRetry = (importer) =>
  lazy(() =>
    importer().catch((err) => {
      const key = '1convite_chunk_reload';
      if (typeof window !== 'undefined' && !sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        window.location.reload();
        return new Promise(() => {});
      }
      throw err;
    })
  );

const LandingPage = lazyWithRetry(() => import('./components/LandingPage/LandingPage'));
import { ARCADE_QUIZ_QUESTIONS, ARCADE_CHARADAS_QUESTIONS, ARCADE_FORCA_WORDS, ARCADE_CACA_PALAVRAS_LIST, generateCacaPalavrasGrid, generateMemoriaDeck } from './data/arcadeData';
const TrailHome = lazyWithRetry(() => import('./components/trail/TrailHome'));
import { LAYA_MENTORES, LAYA_CONSELHOS, LAYA_TEMAS_ORACULO, consultarOraculoLocal, gerarRespostaMentor } from './data/layaData';
const CafeComDeusView = lazyWithRetry(() => import('./components/CafeComDeus/CafeComDeusView'));
const MulherVirtuosaView = lazyWithRetry(() => import('./components/MulherVirtuosa/MulherVirtuosaView'));
const BibliotecaPregadorView = lazyWithRetry(() => import('./components/BibliotecaPregador/BibliotecaPregadorView'));
const BibliotecaEbooksView = lazyWithRetry(() => import('./components/BibliotecaEbooks/BibliotecaEbooksView'));
const ConvitesVipView = lazyWithRetry(() => import('./components/Convites/ConvitesVipView'));
const UpgradeVoucherModal = lazyWithRetry(() => import('./components/Upgrade/UpgradeVoucherModal'));
import cafeData from './data/cafe_com_deus_365.json';
import cafeSinteseData from './data/cafeComDeusSintese365.json';
import { playNeuralSpeech, stopNeuralSpeech, isNeuralSpeaking } from './services/neuralAudioPlayer';
import { TRILHAS_DATA, getTrilhaPorTema, getConteudoDiaTrilha } from './data/trilhasCrescimentoData';
import { DEFAULT_AVATAR_MAN, DEFAULT_AVATAR_WOMAN, getDefaultAvatar } from './utils/defaultAvatars';
import appLogomarcaLight from './assets/logomarca_oficial.png';
import appLogomarcaDark from './assets/logomarca_dark.png';
import banner1 from './assets/banners/1.png';
import banner2 from './assets/banners/2.png';
import banner3 from './assets/banners/3.png';
import heroMountainsImg from './assets/feed/hero_mountains.jpg';
import treinoTemploImg from './assets/feed/treino_templo.jpg';
import bibliaSunsetBg from './assets/biblia/biblia_sunset_bg.jpg';
import conviteVipCardBg from './assets/landing/convite_vip.jpg';
const TreinoTemploView = lazy(() => import('./components/TreinoTemplo/TreinoTemploView'));
import LoginPage from './components/Auth/LoginPage';
const AdminPanel = lazy(() => import('./components/Admin/AdminPanel'));
const IdeEstudosView = lazy(() => import('./components/Ide/IdeEstudosView'));
import './components/Ide/IdeEstudosView.css';
import 'leaflet/dist/leaflet.css';
import ConvitePortalLuz from './components/Convite/ConvitePortalLuz';
import adminAuthService from './services/adminAuthService';
import { syncAppBadge } from './utils/dailyBadgeTracker';
const LegalModalPage = lazy(() => import('./components/Legal/LegalModalPage'));
const AsaasCheckoutModal = lazy(() => import('./components/Checkout/AsaasCheckoutModal'));
import LgpdBanner from './components/Legal/LgpdBanner';
import ChamaLoader from './components/Common/ChamaLoader';

function AppBootFallback() {
  return <ChamaLoader size={74} label="Carregando 1Convite..." fullScreen />;
}

// ═══ IDENTIFICADOR DE USUÁRIO E PERSISTÊNCIA ═══
function getUserUuid() {
  try {
    let id = localStorage.getItem('1convite_user_uuid');
    if (!id) {
      id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('1convite_user_uuid', id);
    }
    return id;
  } catch (e) {
    return 'usr_guest';
  }
}

// ═══ COMPRESSOR DE AVATAR CLIENT-SIDE (ANTI-OVERFLOW & ALTA PERFORMANCE) ═══
function compressAvatarImage(file, maxSize = 360, quality = 0.88) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}
// ═══ COMPONENTE REWARD POPUP (CHAMINHA) ═══
function RewardPopup({ amount, title, message, onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)',
      zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="glass-panel text-center" style={{
        maxWidth: '320px', width: '100%', padding: '32px 24px', borderRadius: '24px',
        border: '1px solid var(--slate-border)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-app)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)', animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        {/* Estilo local para animações */}
        <style>{`
          @keyframes bounceChaminha {
            0% { transform: translateY(0); }
            100% { transform: translateY(-12px); }
          }
          @keyframes scaleUp {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>

        {/* Chaminha Animado */}
        <div style={{ animation: 'bounceChaminha 0.8s infinite alternate ease-in-out' }}>
          <ChaminhaVideo size={100} />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>{title}</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>{message}</p>
        
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.1)',
          padding: '8px 18px', borderRadius: '30px', border: '1px solid var(--orange)', margin: '4px 0'
        }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--orange)' }}>+{amount}</span>
          <ChaminhaCoin size={22} />
        </div>

        <button className="btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={onClose}>
          Glória a Deus!
        </button>
      </div>
    </div>
  );
}

// ═══ COMPONENTE CHAMINHA FIXO (MASCOTE OFICIAL) ═══
function ChaminhaFixo({ size = 80, style = {}, className = '' }) {
  return (
    <img 
      src="/mascote-chaminha.png" 
      alt="Mascote Chaminha" 
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        display: 'inline-block',
        filter: 'drop-shadow(0 6px 16px rgba(249, 115, 22, 0.3))',
        ...style
      }} 
    />
  );
}

// ═══ COMPONENTE CHAMINHA COIN ═══

// ═══ COMPONENTE CHAMINHA VIDEO (MASCOTE 3D) ═══
function ChaminhaVideo({ size = 100, style = {} }) {
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const processFrame = () => {
      if (video.paused || video.ended) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = frame.data;
        const length = data.length;

        for (let i = 0; i < length; i += 4) {
          const r = data[i + 0];
          const g = data[i + 1];
          const b = data[i + 2];

          // Detecção de tela verde (Chroma Key)
          if (g > 90 && g > r * 1.15 && g > b * 1.15) {
            data[i + 3] = 0; // Torna o pixel transparente
          }
        }
        ctx.putImageData(frame, 0, 0);
      } catch (e) {}

      animationFrameId = requestAnimationFrame(processFrame);
    };

    const handlePlay = () => {
      processFrame();
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('playing', handlePlay);
    video.addEventListener('loadedmetadata', handlePlay);
    video.addEventListener('canplay', handlePlay);

    if (!video.paused) {
      processFrame();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('playing', handlePlay);
    };
  }, []);

  return (
    <div style={{
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'visible',
      ...style
    }}>
      <video
        ref={videoRef}
        src="/Imagens/Chaminha.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', pointerEvents: 'none' }}
      />
      <canvas
        ref={canvasRef}
        width={160}
        height={160}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
}

function ChaminhaCoin({ size = 22, style = {} }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"
      width={size} height={size} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <defs>
        <radialGradient id="cgCoin" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFE566"/>
          <stop offset="40%" stopColor="#F5C842"/>
          <stop offset="100%" stopColor="#C8860A"/>
        </radialGradient>
        <linearGradient id="cgRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#B8860B"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <radialGradient id="cgFlame" cx="50%" cy="65%" r="55%">
          <stop offset="0%" stopColor="#FFF0A0"/>
          <stop offset="40%" stopColor="#FFB300"/>
          <stop offset="100%" stopColor="#E85500"/>
        </radialGradient>
        <linearGradient id="cgTip" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FF6000"/>
          <stop offset="100%" stopColor="#FFB300"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="114" rx="28" ry="5" fill="rgba(0,0,0,0.18)"/>
      <circle cx="60" cy="62" r="48" fill="url(#cgRim)"/>
      <circle cx="60" cy="62" r="42" fill="url(#cgCoin)"/>
      <ellipse cx="48" cy="45" rx="14" ry="8" fill="rgba(255,255,255,0.25)" transform="rotate(-20,48,45)"/>
      <circle cx="60" cy="62" r="46" fill="none" stroke="#C8860A" strokeWidth="1" strokeDasharray="3,3.7" opacity="0.5"/>
      <path d="M60 24 C56 30 50 33 50 40 C50 47 55 50 60 52 C65 50 70 47 70 40 C70 33 64 30 60 24Z" fill="url(#cgTip)"/>
      <path d="M54 35 C51 39 50 44 52 47 C54 44 55 41 57 39Z" fill="#FF8C00" opacity="0.7"/>
      <path d="M66 35 C69 39 70 44 68 47 C66 44 65 41 63 39Z" fill="#FF8C00" opacity="0.7"/>
      <ellipse cx="60" cy="72" rx="14" ry="18" fill="url(#cgFlame)"/>
      <ellipse cx="55" cy="65" rx="4" ry="5" fill="rgba(255,255,200,0.35)" transform="rotate(-10,55,65)"/>
      <ellipse cx="55.5" cy="70" rx="3.5" ry="3.8" fill="#3D1A00"/>
      <ellipse cx="64.5" cy="70" rx="3.5" ry="3.8" fill="#3D1A00"/>
      <circle cx="54.2" cy="68.5" r="1.2" fill="white" opacity="0.9"/>
      <circle cx="63.2" cy="68.5" r="1.2" fill="white" opacity="0.9"/>
      <ellipse cx="51" cy="73.5" rx="3" ry="1.8" fill="#FF7B00" opacity="0.45"/>
      <ellipse cx="69" cy="73.5" rx="3" ry="1.8" fill="#FF7B00" opacity="0.45"/>
      <path d="M56 75.5 Q60 79 64 75.5" fill="none" stroke="#3D1A00" strokeWidth="1.4" strokeLinecap="round"/>
      <ellipse cx="54" cy="88.5" rx="5" ry="3" fill="#E8720A"/>
      <ellipse cx="66" cy="88.5" rx="5" ry="3" fill="#E8720A"/>
      <text x="60" y="106" textAnchor="middle" fontFamily="'Arial Black', Arial, sans-serif"
        fontSize="8" fontWeight="900" letterSpacing="1.5" fill="#7A4500">CHAMINHA</text>
    </svg>
  );
}

const LOJINHA_ITEMS = [
  { 
    id: 'font-premium-1', 
    type: 'font', 
    name: 'Fonte Cursiva Elegante', 
    price: 200, 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7"/>
        <line x1="9" y1="20" x2="15" y2="20"/>
        <line x1="12" y1="4" x2="12" y2="20"/>
      </svg>
    ), 
    desc: 'Desbloqueia uma linda fonte manuscrita no Studio de Cards.' 
  },
  { 
    id: 'font-premium-2', 
    type: 'font', 
    name: 'Fonte Papiro Antigo', 
    price: 300, 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ), 
    desc: 'Desbloqueia uma fonte estilo épico medieval.' 
  },
  { 
    id: 'bg-premium-1', 
    type: 'bg', 
    name: 'Fundo Ouro Velho', 
    price: 250, 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ), 
    desc: 'Textura premium dourada para fundos de cartões.' 
  },
  { 
    id: 'bg-premium-2', 
    type: 'bg', 
    name: 'Fundo Jardim do Éden', 
    price: 350, 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ), 
    desc: 'Background com folhas vibrantes e luz celestial.' 
  },
  { 
    id: 'sticker-1', 
    type: 'sticker', 
    name: 'Sticker: Pomba da Paz', 
    price: 100, 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z"/>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
      </svg>
    ), 
    desc: 'Adicione este selo aos seus convites.' 
  },
  { 
    id: 'sticker-2', 
    type: 'sticker', 
    name: 'Sticker: Cruz Minimalista', 
    price: 100, 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22"/>
        <line x1="5" y1="8" x2="19" y2="8"/>
      </svg>
    ), 
    desc: 'Um toque clássico e elegante de fé.' 
  }
];

const COUNSELORS = [
  { id: 'jesus', name: 'Mestre Jesus', title: 'Amor & Esperança', isPremium: false, price: 0, systemPrompt: 'Você é Jesus Cristo. Responda com amor, perdão e parábolas.' },
  { id: 'paulo', name: 'Apóstolo Paulo', title: 'Graça & Fé', isPremium: true, price: 300, systemPrompt: 'Você é o Apóstolo Paulo. Responda com teologia, graça e perseverança.' },
  { id: 'pedro', name: 'Apóstolo Pedro', title: 'Liderança & Coragem', isPremium: true, price: 200, systemPrompt: 'Você é o Apóstolo Pedro. Responda com impetuosidade, arrependimento e esperança.' },
  { id: 'davi', name: 'Rei Davi', title: 'Adoração & Conforto', isPremium: true, price: 250, systemPrompt: 'Você é o Rei Davi. Responda com foco em adoração, salmos e conforto na angústia.' },
  { id: 'salomao', name: 'Rei Salomão', title: 'Sabedoria Prática', isPremium: true, price: 400, systemPrompt: 'Você é o Rei Salomão. Responda com sabedoria prática e provérbios.' },
  { id: 'ester', name: 'Rainha Ester', title: 'Propósito & Coragem', isPremium: true, price: 300, systemPrompt: 'Você é a Rainha Ester. Responda com foco em coragem e propósito divino.' }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cafeInitialStep, setCafeInitialStep] = useState(1);
  const [feedFilter, setFeedFilter] = useState('todos'); // 'todos', 'palavra', 'treino', 'mentores', 'desafios'

  const openCafeStep = (step = 1) => {
    setCafeInitialStep(step);
    setActiveTab('cafe-com-deus');
  };
  const [userCoins, setUserCoins] = useState(() => parseInt(localStorage.getItem('app-coins') || localStorage.getItem('arcade-coins')) || 0);
  const [unlockedItems, setUnlockedItems] = useState(() => JSON.parse(localStorage.getItem('unlocked-items') || '[]'));
  const gamificacaoLoadedRef = useRef(false);

  const handleEarnCoins = (amount) => {
    const val = Number(amount || 0);
    if (!val) return;
    setUserCoins((prev) => {
      const next = Math.max(0, prev + val);
      localStorage.setItem('app-coins', next);
      return next;
    });
  };
  
  // Controle de Acesso Premium & Vouchers VIP (180 dias)
  const [isPremiumUser, setIsPremiumUser] = useState(() => {
    return localStorage.getItem('1convite-premium') === 'true' || true;
  });
  const [userVipExpiry, setUserVipExpiry] = useState(() => {
    const exp = localStorage.getItem('1convite_premium_expiry');
    return exp ? parseInt(exp, 10) : null;
  });
  const [isAdminMode, setIsAdminMode] = useState(() => adminAuthService.isCurrentSessionAdmin());
  const [showAdminPanel, setShowAdminPanel] = useState(() => adminAuthService.isCurrentSessionAdmin());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dailyPendingBadge, setDailyPendingBadge] = useState(() => syncAppBadge());
  const [legalModalTab, setLegalModalTab] = useState(() => {
    if (typeof window === 'undefined') return null;
    const p = new URLSearchParams(window.location.search).get('pagina');
    return ['termos', 'privacidade', 'lgpd'].includes(p) ? p : null;
  });
  const [isBooting, setIsBooting] = useState(true);
  const [previewWallpaper, setPreviewWallpaper] = useState(null);
  const [wallpaperStatus, setWallpaperStatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateBadge = () => setDailyPendingBadge(syncAppBadge());
    const onVisibility = () => {
      if (document.visibilityState === 'visible') updateBadge();
    };
    window.addEventListener('1convite-badge-updated', updateBadge);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('1convite-badge-updated', updateBadge);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  
  // Detecção de Link de Convite Recebido (Experiência Portal de Luz)
  const [portalConviteData, setPortalConviteData] = useState(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    if (params.get('convite') || params.get('tipo') || params.get('de')) {
      return {
        senderName: params.get('de') || 'Jonathan Oliveira',
        senderAvatar: params.get('avatar') || '/favicon.png',
        conviteType: params.get('tipo') || params.get('convite') || 'cafe',
        customMessage: params.get('msg') || '',
        vipCode: params.get('vip') || ''
      };
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'true' || urlParams.get('vip')) return false;
    try { localStorage.removeItem('1convite_guest_mode'); } catch {}
    return localStorage.getItem('1convite_logged_in') === 'true';
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [unlockOfferId, setUnlockOfferId] = useState(null);
  const [userEntitlements, setUserEntitlements] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('1convite_entitlements') || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const hasModuleAccess = (entKey) => {
    if (!entKey) return true;
    try {
      if (isAdminMode || adminAuthService.isCurrentSessionAdmin()) return true;
      if (localStorage.getItem('1convite_is_admin') === 'true') return true;
      const em = (localStorage.getItem('1convite_user_email') || '').toLowerCase();
      if (em.includes('spcompensa') || em.includes('jonatas')) return true;
    } catch {}
    return userEntitlements.includes(entKey);
  };

  // Dia Atual para Café com Deus
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.max(1, Math.min(365, Math.floor(diff / oneDay)));
  };
  const todayDayNumber = getDayOfYear();
  const todayMeditation = cafeData.find(item => item.day === todayDayNumber) || cafeData[0];
  const todaySintese = cafeSinteseData.find(item => item.day === todayDayNumber) || cafeSinteseData[0];
  const getTodayDateFormatted = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleDateString('pt-BR', { month: 'long' });
    const capMonth = month.charAt(0).toUpperCase() + month.slice(1);
    return `${day} de ${capMonth}`;
  };
  
  // --- RESTORED ARCADE STATES ---
  const [arcadeActiveGame, setArcadeActiveGame] = useState('lobby');

  const [arcadeSelectedGame, setArcadeSelectedGame] = useState(null);
  const [arcadeDifficulty, setArcadeDifficulty] = useState('facil');
  const [arcadeQuizList, setArcadeQuizList] = useState([]);
  const [arcadeQuizCurrentQuestion, setArcadeQuizCurrentQuestion] = useState(0);
  const [arcadeQuizFeedback, setArcadeQuizFeedback] = useState(null);
  const [arcadeQuizTimer, setArcadeQuizTimer] = useState(15);
  const [arcadeQuizGameOver, setArcadeQuizGameOver] = useState(false);
  const [arcadeQuizScore, setArcadeQuizScore] = useState(0);
  const [arcadeCharadasList, setArcadeCharadasList] = useState([]);
  const [arcadeCharadasCurrent, setArcadeCharadasCurrent] = useState(0);
  const [arcadeCharadasFeedback, setArcadeCharadasFeedback] = useState(null);
  const [arcadeCharadasTimer, setArcadeCharadasTimer] = useState(20);
  const [arcadeCharadasGameOver, setArcadeCharadasGameOver] = useState(false);
  const [arcadeCharadasScore, setArcadeCharadasScore] = useState(0);
  const [arcadeForcaList, setArcadeForcaList] = useState([]);
  const [arcadeForcaCurrent, setArcadeForcaCurrent] = useState(0);
  const [arcadeForcaGuesses, setArcadeForcaGuesses] = useState([]);
  const [arcadeForcaFeedback, setArcadeForcaFeedback] = useState(null);
  const [arcadeForcaMistakes, setArcadeForcaMistakes] = useState(0);
  const [arcadeForcaGameOver, setArcadeForcaGameOver] = useState(false);
  const [arcadeForcaScore, setArcadeForcaScore] = useState(0);
  const [arcadeCacaWords, setArcadeCacaWords] = useState([]);
  const [arcadeCacaGrade, setArcadeCacaGrade] = useState([]);
  const [arcadeCacaFound, setArcadeCacaFound] = useState([]);
  const [arcadeCacaSelected, setArcadeCacaSelected] = useState([]);
  const [arcadeCacaScore, setArcadeCacaScore] = useState(0);
  const [arcadeCacaGameOver, setArcadeCacaGameOver] = useState(false);
  const [arcadeMemoriaCards, setArcadeMemoriaCards] = useState([]);
  const [arcadeMemoriaFlipped, setArcadeMemoriaFlipped] = useState([]);
  const [arcadeMemoriaMatched, setArcadeMemoriaMatched] = useState([]);
  const [arcadeMemoriaMoves, setArcadeMemoriaMoves] = useState(0);
  const [arcadeMemoriaGameOver, setArcadeMemoriaGameOver] = useState(false);
  // --- END RESTORED ARCADE STATES ---

  const [user, setUser] = useState(null);
  const [codigoDia, setCodigoDia] = useState(null);
  const [contatos, setContatos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Studio de Compartilhamento
  // Studio de Compartilhamento
  const [cardCategory, setCardCategory] = useState('bomdia');
  const [cardSelectedText, setCardSelectedText] = useState('');
  const [cardBg, setCardBg] = useState(0);
  const [cardBgCategory, setCardBgCategory] = useState('paisagem');
  const [cardFormat, setCardFormat] = useState('square');
  const [cardFont, setCardFont] = useState('Georgia, serif');
  const [cardFontSize, setCardFontSize] = useState('md');
  const [cardTextColor, setCardTextColor] = useState('#ffffff');
  const [cardTextStyle, setCardTextStyle] = useState('italic');
  const [cardOverlay, setCardOverlay] = useState(0.65);
  const [cardGenerating, setCardGenerating] = useState(false);
  const cardPreviewRef = useRef(null);

  // Carregar fontes do Google dinamicamente
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&family=Cormorant+Garamond:ital@0;1&family=Lora:ital@0;1&family=Merriweather:ital@0;1&family=Cinzel&family=Dancing+Script&family=Satisfy&family=Great+Vibes&family=Pacifico&family=Raleway:wght@400;700&family=Montserrat:wght@400;700&family=Josefin+Sans:wght@400;700&family=Quicksand:wght@400;700&family=Nunito:wght@400;700&family=Oswald:wght@400;700&family=Lobster&family=EB+Garamond:ital@0;1&family=Libre+Baskerville:ital@0;1&family=Crimson+Text:ital@0;1&display=swap';
    if (!document.querySelector('link[href*="googleapis.com/css2?family=Playfair"]')) {
      document.head.appendChild(link);
    }
  }, []);

  const CARD_FONTS = [
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Playfair Display', value: 'Playfair Display, serif' },
    { label: 'Cormorant', value: 'Cormorant Garamond, serif' },
    { label: 'EB Garamond', value: 'EB Garamond, serif' },
    { label: 'Libre Baskerville', value: 'Libre Baskerville, serif' },
    { label: 'Crimson Text', value: 'Crimson Text, serif' },
    { label: 'Lora', value: 'Lora, serif' },
    { label: 'Merriweather', value: 'Merriweather, serif' },
    { label: 'Cinzel', value: 'Cinzel, serif' },
    { label: 'Dancing Script', value: 'Dancing Script, cursive' },
    { label: 'Satisfy', value: 'Satisfy, cursive' },
    { label: 'Great Vibes', value: 'Great Vibes, cursive' },
    { label: 'Lobster', value: 'Lobster, cursive' },
    { label: 'Pacifico', value: 'Pacifico, cursive' },
    { label: 'Raleway', value: 'Raleway, sans-serif' },
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
    { label: 'Josefin Sans', value: 'Josefin Sans, sans-serif' },
    { label: 'Quicksand', value: 'Quicksand, sans-serif' },
    { label: 'Nunito', value: 'Nunito, sans-serif' },
    { label: 'Oswald', value: 'Oswald, sans-serif' },
  ];

  const CARD_TEXT_COLORS = [
    { label: 'Branco', value: '#ffffff' },
    { label: 'Creme', value: '#fef9e7' },
    { label: 'Dourado', value: '#FFD700' },
    { label: 'Ouro Rosa', value: '#F4C2C2' },
    { label: 'Azul Claro', value: '#B3D9FF' },
    { label: 'Mint', value: '#B3FFD9' },
    { label: 'Lavanda', value: '#E0B3FF' },
    { label: 'Laranja', value: '#FFB347' },
  ];

  const CARD_FONT_SIZES = [
    { label: 'P', value: 'sm', size: '0.88rem' },
    { label: 'M', value: 'md', size: '1.1rem' },
    { label: 'G', value: 'lg', size: '1.35rem' },
    { label: 'GG', value: 'xl', size: '1.65rem' },
  ];

  const CARD_BG_CATEGORIES = [
    {
      id: 'paisagem', label: 'Paisagem',
      items: [
        { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', label: 'Montanha' },
        { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', label: 'Vale Verde' },
        { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', label: 'Cume' },
        { url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80', label: 'Lago' },
        { url: 'https://images.unsplash.com/photo-1476673160081-cf065607f449?w=800&q=80', label: 'Trigo' },
        { url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=800&q=80', label: 'Flores' },
        { url: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80', label: 'Floresta' },
        { url: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=80', label: 'Oceano' },
        { url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&q=80', label: 'Luz na Mata' },
        { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80', label: 'Colinas' },
        { url: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80', label: 'Praia' },
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80', label: 'Cachoeira' },
      ]
    },
    {
      id: 'universo', label: 'Universo',
      items: [
        { url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80', label: 'Galáxia' },
        { url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80', label: 'Nebulosa' },
        { url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80', label: 'Lua' },
        { url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80', label: 'Estrelas' },
        { url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80', label: 'Via Láctea' },
        { url: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&q=80', label: 'Cosmos' },
        { url: 'https://images.unsplash.com/photo-1537420327992-d6e192287183?w=800&q=80', label: 'Aurora Boreal' },
        { url: 'https://images.unsplash.com/photo-1605106702734-205df224ecce?w=800&q=80', label: 'Espaço Azul' },
      ]
    },
    {
      id: 'solar', label: 'Sol',
      items: [
        { url: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80', label: 'Nascer' },
        { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', label: 'Aurora' },
        { url: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=800&q=80', label: 'Pôr do Sol' },
        { url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80', label: 'Horizonte' },
        { url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80', label: 'Dourado' },
        { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80', label: 'Raios de Sol' },
        { url: 'https://images.unsplash.com/photo-1498429152472-9a433d9ddf3b?w=800&q=80', label: 'Crepúsculo' },
        { url: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&q=80', label: 'Manhã' },
      ]
    },
    {
      id: 'cachorro', label: 'Cachorro',
      items: [
        { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80', label: 'Golden' },
        { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', label: 'Fofo' },
        { url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80', label: 'Filhote' },
        { url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80', label: 'Correndo' },
        { url: 'https://images.unsplash.com/photo-1593134257782-e89567b7718a?w=800&q=80', label: 'Labrador' },
        { url: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=800&q=80', label: 'Sorrindo' },
      ]
    },
    {
      id: 'gato', label: 'Gato',
      items: [
        { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80', label: 'Olhos' },
        { url: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=800&q=80', label: 'Fofo' },
        { url: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&q=80', label: 'Sentado' },
        { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80', label: 'Curioso' },
        { url: 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=800&q=80', label: 'Listrado' },
        { url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80', label: 'Filhote' },
      ]
    },
    {
      id: 'passaro', label: 'Pássaro',
      items: [
        { url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=80', label: 'Bando' },
        { url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80', label: 'Colorido' },
        { url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80', label: 'No Galho' },
        { url: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=800&q=80', label: 'Águia' },
        { url: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80', label: 'Papagaio' },
        { url: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=800&q=80', label: 'Beija-flor' },
      ]
    },
  ];

  const CARD_PHRASES = {
    bomdia: [
      { text: 'Que este novo dia seja cheio da paz que só Deus pode dar.', ref: 'Salmos 118:24' },
      { text: 'Cada manhã são renovadas as Suas misericórdias. Grande é a Tua fidelidade.', ref: 'Lamentações 3:23' },
      { text: 'Desperta, ó minha alma! O Senhor abriu mais um dia para que você floresça.', ref: null },
      { text: 'Bom dia! Que hoje você experimente o amor de Deus em cada detalhe.', ref: null },
      { text: 'Antes que o mundo te fale, deixe Deus falar primeiro. Bom dia!', ref: null },
    ],
    boatarde: [
      { text: 'No meio do dia, lembre-se: Deus cuida de você com cuidado e ternura.', ref: 'Mateus 6:26' },
      { text: 'Boa tarde! Que o seu descanso de hoje seja tão produtivo quanto o seu trabalho.', ref: null },
      { text: 'A metade do dia passou. Que a segunda parte seja guiada por Ele.', ref: null },
      { text: 'Seja forte e corajoso! O Senhor, seu Deus, está com você por onde quer que você vá.', ref: 'Josué 1:9' },
      { text: 'Boa tarde! Um sorriso pode ser o seu maior testemunho hoje.', ref: null },
    ],
    boanoite: [
      { text: 'Que o Senhor te guarde em teu repouso e que Seus anjos velem sobre você.', ref: 'Salmos 91:11' },
      { text: 'Em paz deitarei e logo dormirei, pois só Tu, Senhor, me fazes habitar em segurança.', ref: 'Salmos 4:8' },
      { text: 'Boa noite! Entregue ao Senhor o que ficou por fazer. Ele é fiel.', ref: null },
      { text: 'Descanse. Amanhã é uma nova chance de recomeçar com Deus.', ref: null },
      { text: 'Feche os olhos em paz. O mesmo Deus que cuidou hoje, cuidará amanhã.', ref: null },
    ],
    versiculo: [
      { text: 'Ninguém tem maior amor do que este: de dar alguém a própria vida pelos seus amigos.', ref: 'João 15:13' },
      { text: 'Não andeis ansiosos por coisa alguma, mas em tudo pela oração fazei os vossos pedidos.', ref: 'Filipenses 4:6' },
      { text: 'Tudo posso naquele que me fortalece.', ref: 'Filipenses 4:13' },
      { text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.', ref: 'João 3:16' },
      { text: 'O Senhor é o meu pastor e nada me faltará.', ref: 'Salmos 23:1' },
      { text: 'Eu sou o caminho, a verdade e a vida; ninguém vem ao Pai senão por mim.', ref: 'João 14:6' },
    ],
    convite: [
      { text: 'Você tem um convite para fazer parte de algo maior. 1 convite pode mudar uma vida.', ref: 'Mateus 24:14' },
      { text: 'Compartilhe a boa notícia! O Evangelho foi feito para ser levado a todos.', ref: 'Marcos 16:15' },
      { text: 'Quem salva uma alma, salva o mundo. Faça o seu 1Convite hoje.', ref: null },
      { text: 'Seja o instrumento de Deus nas mãos de alguém que precisa de esperança.', ref: null },
      { text: 'Uma boa palavra no momento certo pode mudar uma eternidade.', ref: 'Provérbios 15:23' },
    ],
  };

  const triggerDownload = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `1convite-card-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateCard = async (mode) => {
    if (!cardPreviewRef.current) return;
    setCardGenerating(true);
    try {
      const width = 1080;
      const height = cardFormat === 'square' ? 1080 : 1920;

      // Container offscreen em resolução nativa 1080p sem borderRadius (elimina bordas brancas)
      const offscreenDiv = document.createElement('div');
      offscreenDiv.style.position = 'fixed';
      offscreenDiv.style.left = '-9999px';
      offscreenDiv.style.top = '0';
      offscreenDiv.style.width = `${width}px`;
      offscreenDiv.style.height = `${height}px`;
      offscreenDiv.style.borderRadius = '0px';
      offscreenDiv.style.overflow = 'hidden';
      offscreenDiv.style.boxSizing = 'border-box';
      offscreenDiv.style.margin = '0';
      offscreenDiv.style.padding = '0';

      const clone = cardPreviewRef.current.cloneNode(true);
      clone.style.width = `${width}px`;
      clone.style.height = `${height}px`;
      clone.style.paddingTop = '0';
      clone.style.borderRadius = '0px';
      clone.style.boxShadow = 'none';

      // Font size escalado para 1080px
      const baseFontSizeMap = { sm: 38, md: 52, lg: 66, xl: 82 };
      const targetFontSize = baseFontSizeMap[cardFontSize] || 52;

      const textP = clone.querySelector('p');
      if (textP) {
        textP.style.fontSize = `${targetFontSize}px`;
        textP.style.lineHeight = '1.6';
      }

      const refSpan = clone.querySelector('span');
      if (refSpan) {
        refSpan.style.fontSize = `${Math.round(targetFontSize * 0.42)}px`;
        refSpan.style.marginTop = '24px';
      }

      const textContainer = clone.children[1];
      if (textContainer) {
        textContainer.style.padding = '60px 50px';
      }

      const footerDiv = textContainer ? textContainer.children[textContainer.children.length - 1] : null;
      if (footerDiv) {
        footerDiv.style.marginTop = '32px';
        const footerSvg = footerDiv.querySelector('svg');
        if (footerSvg) {
          footerSvg.setAttribute('width', '24');
          footerSvg.setAttribute('height', '24');
        }
        const footerSpan = footerDiv.querySelector('span');
        if (footerSpan) {
          footerSpan.style.fontSize = '20px';
        }
      }

      offscreenDiv.appendChild(clone);
      document.body.appendChild(offscreenDiv);

      const canvas = await html2canvas(offscreenDiv, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        width: width,
        height: height,
        windowWidth: width,
        windowHeight: height,
        backgroundColor: '#000000',
        logging: false
      });

      document.body.removeChild(offscreenDiv);

      const dataUrl = canvas.toDataURL('image/png');
      if (isCapacitor) {
        await saveOrShareImage({
          dataUrl,
          fileName: `1convite-card-${Date.now()}.png`,
          title: '1Convite Card',
          isCapacitor: true,
        });
        setCardGenerating(false);
        return;
      }

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setCardGenerating(false);
          return;
        }
        const file = new File([blob], '1convite-card.png', { type: 'image/png' });

        if (mode === 'share' && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: '1Convite Card',
              text: 'Confira este cartão do 1Convite!',
              files: [file]
            });
          } catch (shareErr) {
            triggerDownload(blob);
          }
        } else {
          triggerDownload(blob);
        }
        setCardGenerating(false);
      }, 'image/png');
    } catch (e) {
      console.error('Erro ao gerar card:', e);
      setCardGenerating(false);
    }
  };


  // Customização de Temas & Cores
  const [rewardPopup, setRewardPopup] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'theme-green');
  const [fontSizeScale, setFontSizeScale] = useState(() => parseInt(localStorage.getItem('app-font-size') || '16'));
  const [enableCustomFontSize, setEnableCustomFontSize] = useState(() => localStorage.getItem('app-enable-font-size') === 'true');
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  // CONFIGURAÇÃO DO WHATSAPP COMERCIAL (FUNIL DE VENDAS)
  const COMMERCIAL_WHATSAPP_NUMBER = '5511999999999'; // Modifique aqui com o seu número de WhatsApp comercial

  const iniciarCheckoutWhatsApp = () => {
    const text = `Olá! Quero assinar o Plano Premium do 1Convite para o e-mail: ${profileEmail}`;
    const url = `https://wa.me/${COMMERCIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getBestVoiceForGender = (gender) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const ptVoices = voices.filter(v => v.lang.startsWith('pt'));
    if (ptVoices.length === 0) return null;

    // Prioriza vozes naturais/neurais de alta fidelidade
    const naturalPtVoices = ptVoices.filter(v => 
      v.name.includes('Natural') || 
      v.name.includes('Neural') || 
      v.name.includes('Online') || 
      v.name.toLowerCase().includes('google português')
    );

    const targetList = naturalPtVoices.length > 0 ? naturalPtVoices : ptVoices;

    const maleKeywords = ['daniel', 'antonio', 'felipe', 'antónio', 'ricardo', 'helio', 'thiago', 'antônio', 'francisco', 'jorge'];
    const femaleKeywords = ['francisca', 'luciana', 'maria', 'joana', 'helena', 'zira', 'google', 'lecia', 'solene', 'thaisa', 'leticia'];

    if (gender === 'masculino') {
      const maleVoice = targetList.find(v => maleKeywords.some(keyword => v.name.toLowerCase().includes(keyword))) ||
                        ptVoices.find(v => maleKeywords.some(keyword => v.name.toLowerCase().includes(keyword)));
      if (maleVoice) return maleVoice;
    } else {
      const femaleVoice = targetList.find(v => femaleKeywords.some(keyword => v.name.toLowerCase().includes(keyword))) ||
                          ptVoices.find(v => femaleKeywords.some(keyword => v.name.toLowerCase().includes(keyword)));
      if (femaleVoice) return femaleVoice;
    }

    return targetList[0] || ptVoices[0];
  };

  const themeColors = {
    'theme-orange': {
      primary: '#F97316',
      dark: '#EA580C',
      light: '#FFF7ED',
      mid: '#FFEDD5',
      glow: 'rgba(249, 115, 22, 0.20)',
      grad: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      shadow: '0 8px 24px rgba(249, 115, 22, 0.15)'
    },
    'theme-blue': {
      primary: '#3B82F6',
      dark: '#2563EB',
      light: '#EFF6FF',
      mid: '#DBEAFE',
      glow: 'rgba(59, 130, 246, 0.20)',
      grad: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      shadow: '0 8px 24px rgba(59, 130, 246, 0.15)'
    },
    'theme-green': {
      primary: '#10B981',
      dark: '#059669',
      light: '#ECFDF5',
      mid: '#D1FAE5',
      glow: 'rgba(16, 185, 129, 0.20)',
      grad: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      shadow: '0 8px 24px rgba(16, 185, 129, 0.15)'
    },
    'theme-purple': {
      primary: '#8B5CF6',
      dark: '#7C3AED',
      light: '#F5F3FF',
      mid: '#EDE9FE',
      glow: 'rgba(139, 92, 246, 0.20)',
      grad: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      shadow: '0 8px 24px rgba(139, 92, 246, 0.15)'
    },
    'theme-sepia': {
      primary: '#D97706',
      dark: '#B45309',
      light: '#FFFBEB',
      mid: '#FEF3C7',
      glow: 'rgba(217, 119, 6, 0.20)',
      grad: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
      shadow: '0 8px 24px rgba(217, 119, 6, 0.15)'
    }
  };

  useEffect(() => {
    const themeClasses = ['theme-orange', 'theme-blue', 'theme-green', 'theme-purple', 'theme-sepia'];
    themeClasses.forEach(c => {
      document.body.classList.remove(c);
      document.documentElement.classList.remove(c);
    });
    document.body.classList.add(theme);
    document.documentElement.classList.add(theme);
    localStorage.setItem('app-theme', theme);

    const cfg = themeColors[theme] || themeColors['theme-green'];
    const r = document.documentElement;
    r.style.setProperty('--orange', cfg.primary);
    r.style.setProperty('--orange-dark', cfg.dark);
    r.style.setProperty('--orange-light', cfg.light);
    r.style.setProperty('--orange-mid', cfg.mid);
    r.style.setProperty('--orange-glow', cfg.glow);
    r.style.setProperty('--grad-orange', cfg.grad);
    r.style.setProperty('--shadow-orange', cfg.shadow);
    r.style.setProperty('--primary-color', cfg.primary);
  }, [theme]);

  useEffect(() => {
    const scale = enableCustomFontSize ? fontSizeScale : 16;
    document.documentElement.style.fontSize = `${scale}px`;
    document.documentElement.style.setProperty('--app-base-font', `${scale}px`);
    document.documentElement.style.setProperty('--reading-font-size', `${scale * 1.05}px`);
    document.documentElement.style.setProperty('--verse-font-size', `${scale * 1.05}px`);
    localStorage.setItem('app-font-size', fontSizeScale);
    localStorage.setItem('app-enable-font-size', enableCustomFontSize);
  }, [enableCustomFontSize, fontSizeScale]);

  // ── LAYA ENGINE — SABEDORIA BÍBLICA & ORÁCULO EM CPU ──
  const [activeCounselor, setActiveCounselor] = useState(null);
  const [unlockedCounselors, setUnlockedCounselors] = useState(() => JSON.parse(localStorage.getItem('unlocked-counselors') || '["jesus"]'));
  const [layaSubTab, setLayaSubTab] = useState('mentores'); // 'mentores' | 'oraculo'
  const [layaActiveCategory, setLayaActiveCategory] = useState('TODOS');
  const [layaOraculoQuery, setLayaOraculoQuery] = useState('');
  const [layaOraculoResult, setLayaOraculoResult] = useState(() => consultarOraculoLocal(''));
  const [layaSelectedThemeSlug, setLayaSelectedThemeSlug] = useState('ansiedade-medo');
  const [layaMentorTheme, setLayaMentorTheme] = useState('ansiedade');
  const [layaCopied, setLayaCopied] = useState(false);
  const [layaSearching, setLayaSearching] = useState(false);

  // ── CHAT INTERATIVO COM O MENTOR BÍBLICO ──
  const [mentorChatHistory, setMentorChatHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mentor-chat-history') || '{}');
    } catch {
      return {};
    }
  });
  const [mentorInputText, setMentorInputText] = useState('');
  const [mentorIsThinking, setMentorIsThinking] = useState(false);
  const mentorChatEndRef = useRef(null);

  const handleResetMentorChat = (mentorId = null) => {
    const targetId = mentorId || activeCounselor;
    if (!targetId) return;
    const currentMentor = LAYA_MENTORES.find(m => m.id === targetId) || LAYA_MENTORES[0];
    const initialList = [
      { id: 'welcome', sender: 'mentor', text: currentMentor.saudacao_chat, time: 'Início' }
    ];
    setMentorChatHistory(prev => {
      const next = { ...prev, [targetId]: initialList };
      try { localStorage.setItem('mentor-chat-history', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const handleSendMentorMessage = async (customQuestion = null) => {
    const textToSend = (typeof customQuestion === 'string' ? customQuestion : mentorInputText || '').trim();
    if (!textToSend || !activeCounselor || mentorIsThinking) return;

    const currentMentor = LAYA_MENTORES.find(m => m.id === activeCounselor) || LAYA_MENTORES[0];
    const prevList = mentorChatHistory[currentMentor.id] || [
      { id: 'welcome', sender: 'mentor', text: currentMentor.saudacao_chat, time: 'Início' }
    ];

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: nowTime
    };

    const updatedWithUser = [...prevList, userMsg];
    setMentorChatHistory(prev => {
      const next = { ...prev, [currentMentor.id]: updatedWithUser };
      try { localStorage.setItem('mentor-chat-history', JSON.stringify(next)); } catch {}
      return next;
    });

    setMentorInputText('');
    setMentorIsThinking(true);

    try {
      // 1. Tenta chamar o Cloudflare Workers AI no Edge
      let aiResponse = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch('/api/mentor-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mentorId: currentMentor.id,
            pergunta: textToSend,
            historico: updatedWithUser.slice(-4)
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.texto && !data.fallback) {
            aiResponse = data;
          }
        }
      } catch (e) {
        // Fallback para LAYA semântica local
      }

      // 2. Se a IA do Cloudflare não respondeu ou deu fallback, usa a inteligência semântica local
      const resp = aiResponse || gerarRespostaMentor(currentMentor.id, textToSend);

      const mentorMsg = {
        id: Date.now() + 1,
        sender: 'mentor',
        text: resp.texto,
        versiculo: resp.versiculo,
        acao: resp.acao,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMentorChatHistory(prev => {
        const currentList = prev[currentMentor.id] || updatedWithUser;
        const next = { ...prev, [currentMentor.id]: [...currentList, mentorMsg] };
        try { localStorage.setItem('mentor-chat-history', JSON.stringify(next)); } catch {}
        return next;
      });
    } finally {
      setMentorIsThinking(false);
    }
  };

  const [countdown, setCountdown] = useState(12);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [pedagioErro, setPedagioErro] = useState('');
  const [pedagioIniciado, setPedagioIniciado] = useState(false);

  const [showAddContato, setShowAddContato] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newRelacao, setNewRelacao] = useState('');
  const [newPrioritario, setNewPrioritario] = useState(false);
  const [contatoErro, setContatoErro] = useState('');

  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const [breathState, setBreathState] = useState('Toque para iniciar');
  const [breathTimer, setBreathTimer] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathClass, setBreathClass] = useState('');
  const [breathTechnique, setBreathTechnique] = useState('simple');
  const [breathRounds, setBreathRounds] = useState(5);
  const [currentRound, setCurrentRound] = useState(1);
  const breathIntervalRef = useRef(null);
  const isBreathingActiveRef = useRef(false);

  const [paymentPreferenceId, setPaymentPreferenceId] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselImages = [banner1, banner2, banner3];

  const [showLanding, setShowLanding] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isCap = Boolean(
      (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) || 
      window.location.protocol === 'capacitor:' || 
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Capacitor'))
    );
    if (isCap) return false;
    const path = (window.location.pathname || '/').toLowerCase();
    if (path === '/artigos' || path.startsWith('/artigos/')) {
      window.location.replace('/blog/');
      return true;
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('app') === 'true') return false;
    if (urlParams.get('landing') === 'true' || urlParams.get('vendas') === 'true') return true;
    if (path === '/app' || path.startsWith('/app/')) return false;
    return true;
  });

  const navigateAppRoute = (enterApp) => {
    setShowLanding(!enterApp);
    if (typeof window === 'undefined') return;
    const isCap = Boolean(
      (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) ||
      window.location.protocol === 'capacitor:' ||
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Capacitor'))
    );
    if (!isCap && window.history && window.history.pushState) {
      const targetPath = enterApp ? '/app' : '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ app: enterApp }, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const path = (window.location.pathname || '/').toLowerCase();
      const urlParams = new URLSearchParams(window.location.search);
      const shouldOpenApp = urlParams.get('app') === 'true' || path === '/app' || path.startsWith('/app/');
      setShowLanding(!shouldOpenApp);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Bíblia
  const [bibleViewMode, setBibleViewMode] = useState('reading');
  const [bibleBooks, setBibleBooks] = useState([]);
  const [bibleSelectedBook, setBibleSelectedBook] = useState({ livro_abrev: 'gn', livro_nome: 'Gênesis' });
  const [bibleChaptersCount, setBibleChaptersCount] = useState(50);
  const [bibleSelectedChapter, setBibleSelectedChapter] = useState(1);
  const [bibleVerses, setBibleVerses] = useState([]);
  const [bibleSelectedVerse, setBibleSelectedVerse] = useState(null);
  const [bibleSearchQuery, setBibleSearchQuery] = useState('');
  const [bibleResults, setBibleResults] = useState([]);
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleError, setBibleError] = useState('');

  // Dicionário Teológico
  const [dicionario, setDicionario] = useState({});
  const [selectedDicionarioTermo, setSelectedDicionarioTermo] = useState(null);

  // Áudio da Bíblia
  const [bibleAudioUrl, setBibleAudioUrl] = useState('');
  const [bibleAudioPlaying, setBibleAudioPlaying] = useState(false);
  const [bibleAudioDuration, setBibleAudioDuration] = useState(0);
  const [bibleAudioCurrentTime, setBibleAudioCurrentTime] = useState(0);
  const bibleAudioRef = useRef(null);

  // Destaques, Comentários e Progresso da Bíblia
  const [bibleHighlights, setBibleHighlights] = useState(() => JSON.parse(localStorage.getItem('bible-highlights')) || {});
  const [bibleComments, setBibleComments] = useState(() => JSON.parse(localStorage.getItem('bible-comments')) || {});
  const [bibleProgress, setBibleProgress] = useState(() => JSON.parse(localStorage.getItem('bible-progress')) || {});

  // Calcula progresso de um livro: { percent, readChapters, totalChapters }
  const calcBookProgress = (bookAbrev, totalChapters) => {
    const read = bibleProgress[bookAbrev];
    if (!read || !totalChapters) return { percent: 0, readCount: 0, totalChapters };
    const readCount = Object.keys(read).filter(k => read[k]).length;
    return { percent: Math.round((readCount / totalChapters) * 100), readCount, totalChapters };
  };

  // Marca um capítulo como lido/não lido
  const markChapterAsRead = (bookAbrev, chapter, value = true) => {
    setBibleProgress(prev => {
      const updated = {
        ...prev,
        [bookAbrev]: { ...(prev[bookAbrev] || {}), [chapter]: value }
      };
      localStorage.setItem('bible-progress', JSON.stringify(updated));
      return updated;
    });
  };

  // Verifica se um capítulo está marcado como lido
  const isChapterRead = (bookAbrev, chapter) => !!(bibleProgress[bookAbrev]?.[chapter]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [bibleShowAudioPlayer, setBibleShowAudioPlayer] = useState(true);
  const [activeSabadoBlock, setActiveSabadoBlock] = useState('menu');
  const [isNarrating, setIsNarrating] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Estados específicos para o player de Meditação Guiada TTS
  const [meditationPlaying, setMeditationPlaying] = useState(false);
  const [meditationCurrentTime, setMeditationCurrentTime] = useState(0);
  const [meditationDuration, setMeditationDuration] = useState(120);
  const [showMeditationLyrics, setShowMeditationLyrics] = useState(false);
  const meditationIntervalRef = useRef(null);
  const [meditationCompleted, setMeditationCompleted] = useState(false);
  
  // Som ambiente de fundo e velocidade para Meditação
  const [activeAmbient, setActiveAmbient] = useState('none');
  const [ambientVolume, setAmbientVolume] = useState(0.25);
  const [narrationRate, setNarrationRate] = useState(0.82);
  const [meditationVoice, setMeditationVoice] = useState('pt-BR-FranciscaNeural');
  const ambientAudioRef = useRef(null);
  const meditationTimeoutRef = useRef(null);
  const currentSegmentIndexRef = useRef(0);
  const meditationVideoRef = useRef(null);

  useEffect(() => {
    if (meditationVideoRef.current) {
      if (meditationPlaying) {
        meditationVideoRef.current.play().catch(() => {});
      } else {
        meditationVideoRef.current.pause();
      }
    }
  }, [meditationPlaying]);

  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState(localStorage.getItem('preferred_voice') || '');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const ptVoices = voices.filter(v => v.lang.startsWith('pt'));
        setAvailableVoices(ptVoices);
        if (!localStorage.getItem('preferred_voice') && ptVoices.length > 0) {
          const best = ptVoices.find(v => v.name.includes('Natural')) || 
                       ptVoices.find(v => v.name.includes('Google')) || 
                       ptVoices[0];
          setSelectedVoiceName(best.name);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Trilhas de Crescimento
  const [trilhaAtiva, setTrilhaAtiva] = useState(null);
  const [listaTrilhas, setListaTrilhas] = useState([]);
  const [trilhaLoading, setTrilhaLoading] = useState(false);

  // Modo Escuro & Perfil
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('1convite_dark_mode');
    if (saved !== null) return saved === 'true';
    return true;
  });

  const [profileName, setProfileName] = useState(() => localStorage.getItem('1convite_user_name') || 'Membro Convidado');
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('1convite_user_email') || 'membro@1convite.com');

  // Carrega Chaminhas & Itens da Lojinha do Turso Cloud (isolado por usuário e somente no /app)
  useEffect(() => {
    if (!isCapacitor && currentPath !== '/app') return;
    const contact = (profileEmail || 'convidado@1convite.com.br').trim().toLowerCase();
    gamificacaoLoadedRef.current = false;
    fetch(`${API_BASE}/gamificacao/state?contact=${encodeURIComponent(contact)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.success) {
          const cachedEmail = (localStorage.getItem('1convite_gamificacao_email') || '').trim().toLowerCase();
          const sameAccountCache = cachedEmail === contact;
          const localCoins = sameAccountCache ? (parseInt(localStorage.getItem('app-coins') || '0', 10) || 0) : 0;
          const serverCoins = Number(data.chaminhas || 0);
          const finalCoins = sameAccountCache ? Math.max(localCoins, serverCoins) : serverCoins;
          setUserCoins(finalCoins);
          localStorage.setItem('app-coins', String(finalCoins));

          const localItems = sameAccountCache ? JSON.parse(localStorage.getItem('unlocked-items') || '[]') : [];
          const serverItems = Array.isArray(data.itensDesbloqueados) ? data.itensDesbloqueados : [];
          const finalItems = sameAccountCache ? Array.from(new Set([...localItems, ...serverItems])) : serverItems;
          setUnlockedItems(finalItems);
          localStorage.setItem('unlocked-items', JSON.stringify(finalItems));
          localStorage.setItem('1convite_gamificacao_email', contact);
        }
        gamificacaoLoadedRef.current = true;
      })
      .catch(() => {
        gamificacaoLoadedRef.current = true;
      });
  }, [profileEmail, currentPath]);

  // Sincroniza alterações de Chaminhas ou Compras na Lojinha com o Turso Cloud
  useEffect(() => {
    if (!gamificacaoLoadedRef.current) return;
    const contact = profileEmail || 'convidado@1convite.com.br';
    const timer = setTimeout(() => {
      fetch(`${API_BASE}/gamificacao/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact,
          chaminhas: userCoins,
          itensDesbloqueados: unlockedItems,
        }),
      }).catch(() => {});
    }, 600);
    return () => clearTimeout(timer);
  }, [userCoins, unlockedItems, profileEmail]);
  const [userGender, setUserGender] = useState(() => localStorage.getItem('1convite_user_gender') || 'homem');
  const [isCustomAvatar, setIsCustomAvatar] = useState(() => localStorage.getItem('1convite_custom_avatar_uploaded') === 'true');
  const [profileAvatar, setProfileAvatar] = useState(() => {
    const custom = localStorage.getItem('1convite_custom_avatar');
    if (custom) return custom;
    const gender = localStorage.getItem('1convite_user_gender') || 'homem';
    return getDefaultAvatar(gender);
  });
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  // ── Versão do Sistema & Atualizações Automáticas em Tempo Real ────────────────
  const CURRENT_APP_VERSION = 'v3.3.0';
  const CURRENT_APP_BUILD = 2026112423;
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatusMsg, setUpdateStatusMsg] = useState('');
  const [showChangelog, setShowChangelog] = useState(false);
  const [autoUpdateToast, setAutoUpdateToast] = useState('');

  // Sincronização contínua em segundo plano
  useEffect(() => {
    let isChecking = false;

    const checkRemoteVersion = async () => {
      if (isChecking) return;
      isChecking = true;
      try {
        const res = await fetch('/version.json?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          const remote = await res.json();
          const localBuild = parseInt(localStorage.getItem('app_installed_build') || '0', 10);
          
          if (remote.build && remote.build > localBuild) {
            localStorage.setItem('app_installed_build', String(remote.build));
            localStorage.setItem('app_installed_version', remote.version);
            
            // Limpa caches antigos do Service Worker
            if ('caches' in window) {
              const keys = await caches.keys();
              await Promise.all(keys.map(k => caches.delete(k)));
            }

            if ('serviceWorker' in navigator) {
              const reg = await navigator.serviceWorker.getRegistration();
              if (reg) await reg.update();
            }

            // Notifica e recarrega para aplicar a atualização na hora
            setAutoUpdateToast(`Nova versão aplicada (${remote.version})! Sincronizando...`);
            setTimeout(() => {
              window.location.reload();
            }, 800);
          } else if (!localBuild) {
            localStorage.setItem('app_installed_build', String(CURRENT_APP_BUILD));
            localStorage.setItem('app_installed_version', CURRENT_APP_VERSION);
          }
        }
      } catch (e) {
        // Silencioso em caso de ausência de rede temporária
      } finally {
        isChecking = false;
      }
    };

    // Checa na inicialização imediata
    checkRemoteVersion();

    // Checa a cada 45 segundos enquanto o app estiver em execução
    const intervalId = setInterval(checkRemoteVersion, 45000);

    // Checa automaticamente quando a tela ganha foco ou volta a ficar visível
    const onFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        checkRemoteVersion();
      }
    };
    window.addEventListener('focus', onFocusOrVisible);
    document.addEventListener('visibilitychange', onFocusOrVisible);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', onFocusOrVisible);
      document.removeEventListener('visibilitychange', onFocusOrVisible);
    };
  }, []);

  const handleCheckForUpdates = async () => {
    setCheckingUpdate(true);
    setUpdateStatusMsg('Limpando dados em cache e sincronizando com a nuvem...');
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          await reg.unregister();
        }
      }
      try {
        localStorage.removeItem('app_installed_build');
        localStorage.removeItem('app_installed_version');
      } catch (e) {}

      setUpdateStatusMsg('Atualização aplicada com sucesso! Reiniciando o aplicativo...');
      setTimeout(() => {
        window.location.href = window.location.pathname + '?v=' + Date.now();
      }, 700);
    } catch (e) {
      setUpdateStatusMsg('Recarregando o aplicativo...');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  // Login Dedicado
  const [loginEmail, setLoginEmail] = useState('');
  const [loginNome, setLoginNome] = useState('');
  const [loginMethod, setLoginMethod] = useState('google'); // 'google' ou 'email'
  const [loginError, setLoginError] = useState('');

  // Estados do Motor de Animação do Canvas por Scroll
  const [scrollPercent, setScrollPercent] = useState(0);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginNome) {
      setLoginError('Por favor, preencha todos os campos.');
      return;
    }
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(loginNome)}`;

    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: loginNome, email: loginEmail, avatar })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfileName(data.user.nome);
        setProfileEmail(data.user.email);
        setProfileAvatar(data.user.avatar);
        setLoginEmail('');
        setLoginNome('');
        setLoginError('');
      } else {
        setLoginError('Erro ao fazer o login.');
      }
    } catch {
      setLoginError('Erro de conexão ao servidor.');
    }
  };

  // Auxiliar para decodificar JWT do Google no Frontend
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Erro ao fazer parse do JWT', e);
      return null;
    }
  };

  useEffect(() => {
    // DESABILITADO: só deve rodar para a LandingPage da Techla
    // if (profileEmail !== 'membro@1convite.com') return;
    return;
    
    // Forçar fundo preto no body e transparente no root para o vídeo de background aparecer
    const originalBodyBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#030303';
    
    const rootEl = document.getElementById('root');
    let originalRootBg = '';
    if (rootEl) {
      originalRootBg = rootEl.style.backgroundColor;
      rootEl.style.backgroundColor = 'transparent';
    }

    const video = document.getElementById("lp-bg-video");
    if (video) {
      video.load();
      video.currentTime = 0.01;
      
      const initScrollTrigger = () => {
        if (window.gsap && window.ScrollTrigger) {
          const gsap = window.gsap;
          const ScrollTrigger = window.ScrollTrigger;
          
          gsap.registerPlugin(ScrollTrigger);
          
          ScrollTrigger.create({
            trigger: ".lp-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
            onUpdate: (self) => {
              if (video.duration) {
                const targetTime = self.progress * video.duration;
                gsap.to(video, {
                  currentTime: targetTime,
                  duration: 0.1,
                  overwrite: "auto",
                  ease: "none"
                });
              }
            }
          });
        }
      };

      if (video.readyState >= 1) {
        initScrollTrigger();
      } else {
        video.addEventListener('loadedmetadata', initScrollTrigger);
      }

      return () => {
        document.body.style.backgroundColor = originalBodyBg;
        if (rootEl) rootEl.style.backgroundColor = originalRootBg;
        video.removeEventListener('loadedmetadata', initScrollTrigger);
      };
    }
  }, [profileEmail]);

  useEffect(() => {
    document.body.style.removeProperty('background-color');
    document.body.style.removeProperty('backgroundColor');
    const rootEl = document.documentElement;
    localStorage.setItem('1convite_dark_mode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      rootEl.classList.add('dark-mode');
      rootEl.classList.remove('light-mode');
      rootEl.setAttribute('data-theme', 'dark');
      rootEl.style.colorScheme = 'dark';
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      rootEl.classList.remove('dark-mode');
      rootEl.classList.add('light-mode');
      rootEl.setAttribute('data-theme', 'light');
      rootEl.style.colorScheme = 'light';
    }
  }, [darkMode]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedAvatar = await compressAvatarImage(file, 360, 0.88);
        setProfileAvatar(compressedAvatar);
        setIsCustomAvatar(true);
        try {
          localStorage.setItem('1convite_custom_avatar', compressedAvatar);
          localStorage.setItem('1convite_custom_avatar_uploaded', 'true');
        } catch (lsErr) {
          console.warn('LocalStorage limit:', lsErr);
        }
        setProfileSavedMsg('Foto de perfil atualizada com sucesso!');
        setTimeout(() => setProfileSavedMsg(''), 4000);
        
        // Sincroniza imediatamente com o banco de dados dos usuários (Turso)
        const userUuid = getUserUuid();
        try {
          const res = await fetch(`${API_BASE}/usuario/perfil`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-user-uuid': userUuid
            },
            body: JSON.stringify({ 
              uuid: userUuid,
              nome: profileName, 
              email: profileEmail, 
              avatar: compressedAvatar,
              genero: userGender 
            })
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          }
        } catch (err) {
          console.log('Salvo localmente no dispositivo');
        }
      } catch (err) {
        console.error('Erro ao processar e comprimir avatar:', err);
      }
    }
  };

  const handleSelectDefaultAvatar = (gender) => {
    setUserGender(gender);
    localStorage.setItem('1convite_user_gender', gender);
    if (!isCustomAvatar) {
      const av = getDefaultAvatar(gender);
      setProfileAvatar(av);
      localStorage.setItem('1convite_custom_avatar', av);
    }
    const userUuid = getUserUuid();
    fetch(`${API_BASE}/usuario/perfil`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-uuid': userUuid },
      body: JSON.stringify({ uuid: userUuid, email: profileEmail, genero: gender })
    }).catch(() => {});
    setProfileSavedMsg(`Avatar padrão (${gender === 'mulher' ? 'Mulher' : 'Homem'}) selecionado!`);
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  const handleResetToDefaultAvatar = () => {
    setIsCustomAvatar(false);
    localStorage.removeItem('1convite_custom_avatar_uploaded');
    localStorage.removeItem('1convite_custom_avatar');
    const av = getDefaultAvatar(userGender);
    setProfileAvatar(av);
    setProfileSavedMsg('Foto redefinida para o avatar padrão.');
    setTimeout(() => setProfileSavedMsg(''), 3000);

    const userUuid = getUserUuid();
    fetch(`${API_BASE}/usuario/perfil`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-uuid': userUuid },
      body: JSON.stringify({ uuid: userUuid, email: profileEmail, clearAvatar: true, genero: userGender })
    }).catch(() => {});
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    localStorage.setItem('1convite_user_name', profileName);
    localStorage.setItem('1convite_user_email', profileEmail);
    const userUuid = getUserUuid();
    try {
      const res = await fetch(`${API_BASE}/usuario/perfil`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-uuid': userUuid
        },
        body: JSON.stringify({ 
          uuid: userUuid,
          nome: profileName, 
          email: profileEmail, 
          avatar: profileAvatar,
          genero: userGender 
        })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.log('Salvo localmente');
    }
    setProfileSavedMsg('Dados atualizados com sucesso!');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  // Google Login Callback
  const handleGoogleLoginResponse = async (response) => {
    const payload = parseJwt(response.credential);
    if (!payload) return;
    
    const googleUser = {
      nome: payload.name,
      email: payload.email,
      avatar: payload.picture
    };

    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUser)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfileName(data.user.nome);
        setProfileEmail(data.user.email);
        setProfileAvatar(data.user.avatar);
      }
    } catch (err) {
      console.error('Erro de rede ao logar com o Google:', err);
    }
  };

  // Simular Login Google para desenvolvimento/testes locais imediatos
  const handleSimularLoginGoogle = async () => {
    const nome = prompt("Digite seu nome completo do Google:", "Jônatas Oliveira");
    if (!nome) return;
    const email = prompt("Digite seu e-mail do Google:", "jonatas.oliveira@gmail.com");
    if (!email) return;
    
    // Avatar default dinâmico
    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(nome)}`;

    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, avatar })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfileName(data.user.nome);
        setProfileEmail(data.user.email);
        setProfileAvatar(data.user.avatar);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: "Convidado Visitante",
          email: "visitante@1convite.com",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Visitante"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfileName(data.user.nome);
        setProfileEmail(data.user.email);
        setProfileAvatar(data.user.avatar);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    if (!confirm('Deseja realmente sair da conta e voltar para a tela de login?')) return;
    try {
      localStorage.removeItem('1convite_logged_in');
      localStorage.removeItem('1convite_guest_mode');
      localStorage.removeItem('1convite_user_auth');
      localStorage.removeItem('1convite_active_tab');
      localStorage.removeItem('1convite_admin_session');
      localStorage.removeItem('1convite_custom_avatar');
      localStorage.removeItem('1convite_custom_avatar_uploaded');
      localStorage.removeItem('1convite_entitlements');
      localStorage.removeItem('1convite_user_gender');
      localStorage.removeItem('1convite_user_name');
      localStorage.removeItem('1convite_user_email');
      localStorage.removeItem('1convite_user_uuid');
      localStorage.removeItem('1convite_is_admin');
      localStorage.removeItem('app-coins');
      localStorage.removeItem('unlocked-items');
      localStorage.removeItem('1convite_gamificacao_email');
      localStorage.removeItem('1convite_trilha_ativa');
      adminAuthService.logout();
    } catch (e) {
      console.warn(e);
    }
    gamificacaoLoadedRef.current = false;
    setUserCoins(0);
    setUnlockedItems([]);
    setTrilhaAtiva(null);
    setIsAdminMode(false);
    setShowAdminPanel(false);
    setIsLoggedIn(false);
    setUserEntitlements([]);
    setIsCustomAvatar(false);
    setProfileAvatar(getDefaultAvatar('homem'));
    setProfileName('Membro Convidado');
    setProfileEmail('membro@1convite.com');
    setActiveTab('dashboard');
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Efeito para inicializar o botão do Google Identity Services
  useEffect(() => {
    // Desativado botão oficial para evitar erros de 403 no console local com ID dummy.
    // Usamos o botão customizado abaixo que simula o login com 100% de sucesso local.
    /*
    if (window.google) {
      setTimeout(() => {
        const container = document.getElementById("google-signin-btn-container") || document.getElementById("google-login-screen-container");
        if (container) {
          try {
            window.google.accounts.id.initialize({
              client_id: "777777777777-dummygoogleclientid.apps.googleusercontent.com",
              callback: handleGoogleLoginResponse
            });
            window.google.accounts.id.renderButton(
              container,
              { theme: "outline", size: "large", width: 320 }
            );
          } catch (err) {
            console.warn('Erro ao inicializar botão do Google:', err);
          }
        }
      }, 400);
    }
    */
  }, [activeTab, profileEmail, loginMethod]);

  const isCapacitor = Boolean(
    (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform()) || 
    window.location.protocol === 'capacitor:' || 
    window.location.protocol === 'file:' ||
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Capacitor'))
  );
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const API_BASE = (isLocalhost && !isCapacitor)
    ? 'http://localhost:3001/api/v1' 
    : (import.meta.env.VITE_API_URL || 'https://oneconvite.onrender.com/api/v1');

  // ── TIMERS DOS JOGOS ──────────────────────────────────────
  // Timer do Quiz
  useEffect(() => {
    if (arcadeActiveGame !== 'quiz' || arcadeQuizGameOver || arcadeQuizFeedback || arcadeQuizTimer <= 0) return;
    const interval = setInterval(() => {
      setArcadeQuizTimer(prev => {
        if (prev <= 1) {
          // Tempo esgotado - avança para próxima pergunta ou game over
          clearInterval(interval);
          setArcadeQuizFeedback('wrong');
          setTimeout(() => {
            setArcadeQuizFeedback(null);
            const resetTime = arcadeDifficulty === 'facil' ? 30 : (arcadeDifficulty === 'avancado' ? 7 : 15);
            setArcadeQuizTimer(resetTime);
            if (arcadeQuizCurrentQuestion + 1 < arcadeQuizList.length) {
              setArcadeQuizCurrentQuestion(prev => prev + 1);
            } else {
              setArcadeQuizGameOver(true);
            }
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [arcadeActiveGame, arcadeQuizGameOver, arcadeQuizFeedback, arcadeQuizTimer, arcadeQuizCurrentQuestion, arcadeQuizList.length, arcadeDifficulty]);

  // Timer das Charadas
  useEffect(() => {
    if (arcadeActiveGame !== 'charadas' || arcadeCharadasGameOver || arcadeCharadasFeedback || arcadeCharadasTimer === null || arcadeCharadasTimer <= 0) return;
    const interval = setInterval(() => {
      setArcadeCharadasTimer(prev => {
        if (prev <= 1) {
          // Tempo esgotado - avança ou game over
          clearInterval(interval);
          setArcadeCharadasFeedback('wrong');
          setTimeout(() => {
            setArcadeCharadasFeedback(null);
            if (arcadeCharadasCurrent + 1 < arcadeCharadasList.length) {
              setArcadeCharadasCurrent(prev => prev + 1);
              const resetTime = arcadeDifficulty === 'facil' ? null : (arcadeDifficulty === 'avancado' ? 7 : 15);
              setArcadeCharadasTimer(resetTime);
            } else {
              setArcadeCharadasGameOver(true);
            }
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [arcadeActiveGame, arcadeCharadasGameOver, arcadeCharadasFeedback, arcadeCharadasTimer, arcadeCharadasCurrent, arcadeCharadasList.length, arcadeDifficulty]);

  // ── LAYA ENGINE — INTEGRAÇÃO NATIVA (SEM APIS EXTERNAS) ──
  const handleLayaConsultar = async (queryText = null, categoryFilter = null) => {
    const q = queryText !== null ? queryText : layaOraculoQuery;
    const cat = categoryFilter !== null ? categoryFilter : layaActiveCategory;
    setLayaSearching(true);

    const localMatch = consultarOraculoLocal(q, cat === 'TODOS' ? null : cat);
    setLayaOraculoResult(localMatch);

    try {
      const res = await fetch(`${API_BASE}/laya/consultar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: q, categoria: cat === 'TODOS' ? null : cat }),
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.oraculo) {
          setLayaOraculoResult({
            resultado: data.oraculo,
            mentorSugerido: data.mentorSugerido,
            matchScore: data.matchScore
          });
        }
      }
    } catch {
      // Offline fallback perfeito já ativo com localMatch
    } finally {
      setLayaSearching(false);
    }
  };

  const handleSelectLayaTheme = (themeSlug) => {
    const theme = LAYA_TEMAS_ORACULO.find(t => t.slug === themeSlug);
    if (theme) {
      setLayaSelectedThemeSlug(themeSlug);
      handleLayaConsultar(theme.titulo, theme.categoria);
    }
  };

  const handleUnlockLayaMentor = (mentor) => {
    if (userCoins >= mentor.preco_desbloqueio) {
      if (confirm(`Deseja desbloquear a mentoria de ${mentor.nome} por ${mentor.preco_desbloqueio} Talentos?`)) {
        setUserCoins(prev => {
          const val = prev - mentor.preco_desbloqueio;
          localStorage.setItem('app-coins', val);
          return val;
        });
        setUnlockedCounselors(prev => {
          const arr = [...prev, mentor.id];
          localStorage.setItem('unlocked-counselors', JSON.stringify(arr));
          return arr;
        });
        setActiveCounselor(mentor.id);
      }
    } else {
      alert(`Talentos insuficientes! Você tem ${userCoins} e precisa de ${mentor.preco_desbloqueio}. Complete o Desafio do Dia para ganhar mais.`);
    }
  };

  const handleCopyLayaConselho = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setLayaCopied(true);
      setTimeout(() => setLayaCopied(false), 2500);
    }
  };

  // ── Bíblia ──────────────────────────────────────────────────
  const searchBible = async (e) => {
    e.preventDefault();
    if (!bibleSearchQuery || bibleSearchQuery.length < 3) { setBibleError('Digite pelo menos 3 letras.'); return; }
    setBibleLoading(true); setBibleError('');
    try {
      const res = await fetch(`${API_BASE}/biblia/busca?q=${encodeURIComponent(bibleSearchQuery)}`);
      const data = await res.json();
      if (res.ok) { setBibleResults(data); if (!data.length) setBibleError('Nenhum versículo encontrado.'); }
      else setBibleError(data.error);
    } catch { setBibleError('Erro de conexão.'); }
    finally { setBibleLoading(false); }
  };

  const getRandomVerse = async () => {
    setBibleLoading(true); setBibleError('');
    try {
      const res = await fetch(`${API_BASE}/biblia/aleatorio`);
      const data = await res.json();
      if (res.ok) { setBibleResults([data]); setBibleSearchQuery(''); }
    } catch { setBibleError('Erro ao puxar versículo.'); }
    finally { setBibleLoading(false); }
  };

  const copyToClipboard = async (text) => {
    const ok = await copyTextSafe(text);
    if (ok) alert('Versículo copiado!');
  };

  // Botão Voltar Físico do Android (Capacitor): navega internamente em vez de fechar o app
  useEffect(() => {
    if (!isCapacitor) return;
    let listenerHandle = null;
    CapApp.addListener('backButton', () => {
      if (previewWallpaper) {
        setPreviewWallpaper(null);
        return;
      }
      if (showUpgradeModal) {
        setShowUpgradeModal(false);
        return;
      }
      if (commentModalOpen) {
        setCommentModalOpen(false);
        return;
      }
      if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
        setBibleAudioPlaying(false);
        if (bibleAudioRef.current) bibleAudioRef.current.pause();
        if (ambientAudioRef.current) ambientAudioRef.current.pause();
        return;
      }
      CapApp.minimizeApp();
    }).then((h) => {
      listenerHandle = h;
    }).catch(() => {});

    return () => {
      if (listenerHandle && typeof listenerHandle.remove === 'function') {
        listenerHandle.remove();
      }
    };
  }, [isCapacitor, previewWallpaper, showUpgradeModal, commentModalOpen, activeTab]);

  // ── Carrossel ───────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setCarouselIndex(p => (p + 1) % carouselImages.length), 8000);
    return () => clearInterval(t);
  }, []);

  // ── Helper de Requisição Segura ──────────────────────────────────
  const fetchJson = async (url, options) => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) return null;
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  // ── Dados iniciais ──────────────────────────────────────────
  const loadAppData = async () => {
    try {
      const userUuid = getUserUuid();
      const d = await fetchJson(`${API_BASE}/codigo-dia`, {
        headers: {
          'x-user-uuid': userUuid,
          'x-user-email': profileEmail
        }
      });
      if (d) {
        setUser(d.user); 
        setCodigoDia(d.code);
        if (d.user) {
          if (d.user.nome && d.user.nome !== 'Membro Convidado') {
            setProfileName(d.user.nome);
            localStorage.setItem('1convite_user_name', d.user.nome);
          }
          if (d.user.email && d.user.email !== 'membro@1convite.com') {
            setProfileEmail(d.user.email);
            localStorage.setItem('1convite_user_email', d.user.email);
          }
        }
        // Sincronizar entitlements, avatar e gênero diretamente da conta autenticada no banco (tb_acessos_usuarios)
        const storedEmail = (localStorage.getItem('1convite_user_email') || d?.user?.email || '').trim().toLowerCase();
        if (storedEmail && storedEmail !== 'membro@1convite.com' && storedEmail !== 'convidado@1convite.com.br') {
          try {
            const meData = await fetchJson(`${API_BASE}/auth/me?contact=${encodeURIComponent(storedEmail)}`);
            if (meData && meData.success && meData.user) {
              const ents = Array.isArray(meData.user.entitlements) ? meData.user.entitlements : [];
              setUserEntitlements(ents);
              localStorage.setItem('1convite_entitlements', JSON.stringify(ents));
              if (meData.user.name) {
                setProfileName(meData.user.name);
                localStorage.setItem('1convite_user_name', meData.user.name);
              }
              const userGen = meData.user.genero || 'homem';
              setUserGender(userGen);
              localStorage.setItem('1convite_user_gender', userGen);
              if (meData.user.avatar) {
                setProfileAvatar(meData.user.avatar);
                setIsCustomAvatar(true);
                localStorage.setItem('1convite_custom_avatar', meData.user.avatar);
                localStorage.setItem('1convite_custom_avatar_uploaded', 'true');
              } else {
                localStorage.removeItem('1convite_custom_avatar');
                localStorage.removeItem('1convite_custom_avatar_uploaded');
                setProfileAvatar(getDefaultAvatar(userGen));
                setIsCustomAvatar(false);
              }
            }
          } catch {}
        } else {
          const gender = localStorage.getItem('1convite_user_gender') || userGender || 'homem';
          setProfileAvatar(getDefaultAvatar(gender));
          setIsCustomAvatar(false);
        }
      }
      const contatosData = await fetchJson(`${API_BASE}/contatos`);
      if (contatosData) setContatos(contatosData);
      
      const historicoData = await fetchJson(`${API_BASE}/historico`);
      if (historicoData) setHistorico(historicoData.rows || []);
      
      await loadTrilhaStatus();
      await loadDicionario();
    } catch (e) { console.error(e); }
  };

  const loadDicionario = async () => {
    try {
      const data = await fetchJson(`${API_BASE}/dicionario/termos`);
      if (data) setDicionario(data);
    } catch (e) { console.error(e); }
  };

  const loadTrilhaStatus = async () => {
    // Carrega lista base de trilhas
    setListaTrilhas(['Ansiedade', 'Família', 'Finanças', 'Propósito']);
    
    // Tenta primeiro carregar do localStorage
    const savedTrilha = localStorage.getItem('1convite_trilha_ativa');
    if (savedTrilha) {
      try {
        const parsed = JSON.parse(savedTrilha);
        if (parsed && parsed.ativa) setTrilhaAtiva(parsed);
      } catch (e) {}
    }

    try {
      const dataAtiva = await fetchJson(`${API_BASE}/trilhas/ativa`);
      if (dataAtiva && dataAtiva.ativa) setTrilhaAtiva(dataAtiva);
    } catch (e) { /* modo offline */ }
  };

  const loadBibleBooks = async () => {
    try {
      const books = await fetchJson(`${API_BASE}/biblia/livros`);
      if (books) setBibleBooks(books);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!isCapacitor && currentPath !== '/app') return;
    loadAppData();
    loadBibleBooks();
  }, [currentPath]);

  useEffect(() => {
    if (activeTab !== 'biblia') return;
    const load = async () => {
      const bookAbrev = bibleSelectedBook?.livro_abrev || 'gn';
      const capNum = bibleSelectedChapter || 1;
      const cacheKey = `bible-cache-${bookAbrev}-${capNum}`;

      // 1. Tenta carregar do cache local imediatamente para resposta instantânea
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBibleVerses(parsed);
            setBibleLoading(false);
          }
        } catch (e) {}
      } else {
        setBibleLoading(true);
      }

      setBibleAudioPlaying(false);
      setBibleAudioUrl('');

      try {
        const dc = await fetchJson(`${API_BASE}/biblia/capitulos/${bookAbrev}`);
        if (dc) setBibleChaptersCount(dc.total || 50);
        
        const verses = await fetchJson(`${API_BASE}/biblia/texto/${bookAbrev}/${capNum}`);
        if (verses && Array.isArray(verses) && verses.length > 0) {
          setBibleVerses(verses);
          try {
            localStorage.setItem(cacheKey, JSON.stringify(verses));
          } catch (e) {}
        }

        // Carrega o áudio garantindo HTTPS apenas em domínios externos (preserva http://localhost)
        const dataAudio = await fetchJson(`${API_BASE}/biblia/audio/${bookAbrev}/${capNum}`);
        if (dataAudio) {
          let secureAudio = dataAudio.proxy || dataAudio.url || '/piano.mp3';
          if (secureAudio.startsWith('http://') && !secureAudio.includes('localhost') && !secureAudio.includes('127.0.0.1')) {
            secureAudio = secureAudio.replace('http://', 'https://');
          }
          setBibleAudioUrl(secureAudio);
        } else {
          setBibleAudioUrl('/piano.mp3');
        }
      } catch (e) {
        console.error('[Bíblia] Erro ao carregar dados:', e);
      } finally {
        setBibleLoading(false);
      }
    };
    load();
  }, [bibleSelectedBook, bibleSelectedChapter, activeTab]);

  // ── Pedágio ─────────────────────────────────────────────────
  const iniciarPedagio = async () => {
    try { setPedagioIniciado(true); setCountdown(12); setIsCountdownActive(true); await fetch(`${API_BASE}/checkpoint/start`, { method: 'POST' }); }
    catch (e) { console.error(e); }
  };

  useEffect(() => {
    let t;
    if (activeTab === 'pedagio' && isCountdownActive && countdown > 0) t = setTimeout(() => setCountdown(p => p - 1), 1000);
    else if (countdown === 0) setIsCountdownActive(false);
    return () => clearTimeout(t);
  }, [countdown, activeTab, isCountdownActive]);

  const destravarAgora = async () => {
    try {
      const res = await fetch(`${API_BASE}/sync-checkpoint`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setPedagioIniciado(false);
        setPedagioErro('');
        setUser(prev => prev ? { ...prev, checkpoint_completado: true } : { ...data.user, checkpoint_completado: true });
        setActiveTab('sabado');
        loadAppData();
      } else {
        setPedagioErro(data.error || 'Erro ao destravar');
      }
    } catch {
      setPedagioErro('Erro de comunicação.');
    }
  };

  // ── Contatos ────────────────────────────────────────────────
  const handleAddContato = async (e) => {
    e.preventDefault(); setContatoErro('');
    if (!newNome || !newRelacao) { setContatoErro('Preencha todos os campos.'); return; }
    try {
      const res = await fetch(`${API_BASE}/contatos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: newNome, relacao: newRelacao, prioritario: newPrioritario }) });
      const data = await res.json();
      if (res.ok) { setNewNome(''); setNewRelacao(''); setNewPrioritario(false); setShowAddContato(false); loadAppData(); }
      else setContatoErro(data.error || 'Erro ao cadastrar.');
    } catch { setContatoErro('Falha de conexão.'); }
  };

  const deletarContato = async (id) => {
    if (!confirm('Remover este contato?')) return;
    try { await fetch(`${API_BASE}/contatos/${id}`, { method: 'DELETE' }); loadAppData(); } catch (e) { console.error(e); }
  };

  const registrarAcao = async (id, tipoAcao) => {
    try { await fetch(`${API_BASE}/contatos/${id}/acao`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipoAcao }) }); loadAppData(); }
    catch (e) { console.error(e); }
  };

  const verificarAlerta48h = (c) => {
    if (!c.prioritario) return false;
    if (c.ultimo_convite_timestamp === 0) return true;
    return (Date.now() - c.ultimo_convite_timestamp) / 3600000 >= 48;
  };

  // ── Respiração (Botão do Descanso Pró) ──────────────────────
  const playChime = (freq = 440, type = 'sine', duration = 1.2) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('AudioContext bloqueado:', e);
    }
  };

  const triggerHaptic = (ms = 50) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const pararRespiracao = () => {
    isBreathingActiveRef.current = false;
    setIsBreathing(false);
    setBreathState('Toque para iniciar');
    setBreathClass('');
    if (breathIntervalRef.current) {
      clearInterval(breathIntervalRef.current);
      breathIntervalRef.current = null;
    }
  };

  const iniciarRespiracao = () => {
    if (isBreathing) return;
    isBreathingActiveRef.current = true;
    setIsBreathing(true);
    setCurrentRound(1);
    
    let phases = [];
    if (breathTechnique === 'box') {
      phases = [
        { text: 'Inspire...', cls: 'inhaling', d: 4, freq: 528, osc: 'sine' },
        { text: 'Segure...', cls: 'holding', d: 4, freq: 639, osc: 'sine' },
        { text: 'Expire...', cls: 'exhaling', d: 4, freq: 396, osc: 'triangle' },
        { text: 'Aguarde...', cls: 'holding-empty', d: 4, freq: 432, osc: 'sine' }
      ];
    } else if (breathTechnique === 'relax') {
      phases = [
        { text: 'Inspire...', cls: 'inhaling', d: 4, freq: 528, osc: 'sine' },
        { text: 'Segure...', cls: 'holding', d: 7, freq: 639, osc: 'sine' },
        { text: 'Expire...', cls: 'exhaling', d: 8, freq: 396, osc: 'triangle' }
      ];
    } else {
      phases = [
        { text: 'Inspire...', cls: 'inhaling', d: 4, freq: 528, osc: 'sine' },
        { text: 'Segure...', cls: 'holding', d: 4, freq: 639, osc: 'sine' },
        { text: 'Expire...', cls: 'exhaling', d: 4, freq: 396, osc: 'triangle' }
      ];
    }

    let round = 1;
    let step = 0;

    const run = () => {
      if (!isBreathingActiveRef.current) return;
      
      if (round > breathRounds) {
        playChime(528, 'sine', 1.8);
        setTimeout(() => playChime(432, 'sine', 2.0), 100);
        triggerHaptic([80, 50, 80]);
        setBreathState('Desfrute Completo!');
        setBreathClass('');
        setIsBreathing(false);
        isBreathingActiveRef.current = false;
        return;
      }

      if (step >= phases.length) {
        step = 0;
        round++;
        if (round <= breathRounds) {
          setCurrentRound(round);
          run();
        } else {
          // Finalização
          playChime(528, 'sine', 1.8);
          setTimeout(() => playChime(432, 'sine', 2.0), 100);
          triggerHaptic([80, 50, 80]);
          setBreathState('Desfrute Completo!');
          setBreathClass('');
          setIsBreathing(false);
          isBreathingActiveRef.current = false;
        }
        return;
      }

      const ph = phases[step];
      setBreathState(ph.text);
      setBreathClass(ph.cls);
      setBreathTimer(ph.d);
      
      playChime(ph.freq, ph.osc, 1.2);
      triggerHaptic(50);

      let cv = ph.d;
      breathIntervalRef.current = setInterval(() => {
        if (!isBreathingActiveRef.current) {
          clearInterval(breathIntervalRef.current);
          return;
        }
        cv--;
        setBreathTimer(cv);
        if (cv <= 0) {
          clearInterval(breathIntervalRef.current);
          step++;
          run();
        }
      }, 1000);
    };

    run();
  };

  // ── Áudio Sabático ──────────────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) return;
    if (audioPlaying) audioRef.current.play().catch(() => setAudioPlaying(false));
    else audioRef.current.pause();
  }, [audioPlaying]);

  const onAudioTimeUpdate = () => { if (audioRef.current) setAudioCurrentTime(audioRef.current.currentTime); };
  const onAudioLoadedMetadata = () => { if (audioRef.current) setAudioDuration(audioRef.current.duration); };
  const formatTime = (s) => { if (s === null || s === undefined || isNaN(s) || !isFinite(s)) return '0:00'; return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`; };
  const handleProgressBarClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (audioRef.current) { audioRef.current.currentTime = ((e.clientX - r.left) / r.width) * audioDuration; setAudioCurrentTime(audioRef.current.currentTime); }
  };

  const speakReflection = () => {
    if (isNarrating) {
      stopNeuralSpeech();
      setIsNarrating(false);
      return;
    }

    const title = todaySintese?.title || todayMeditation?.title || 'Reflexão do Dia';
    const verse = todaySintese?.verse || todayMeditation?.verse || '';
    const pensamento = todaySintese?.pensamento_principal || '';
    const sintese = todaySintese?.sintese || '';
    const desafio = todaySintese?.desafio_pratico || '';

    const texto = `Reflexão do Dia. ${title}. ${verse}. Pensamento principal: ${pensamento}. Síntese: ${sintese}. Desafio de hoje: ${desafio}.`;

    setIsNarrating(true);
    playNeuralSpeech(texto, {
      onStart: () => setIsNarrating(true),
      onEnd: () => setIsNarrating(false),
      onError: () => setIsNarrating(false)
    });
  };

  const generateDailyReflectionWithAI = async () => {
    if (!codigoDia) return;
    try {
      setAiGenerating(true);
      const prompt = `Você é o teólogo e historiador oficial do aplicativo 1Convite.
Gere um devocional cristão inspirador e um script de Oração Guiada no Estilo de Jesus (Ação de Graças, Certeza de que o Pai ouve e Alinhamento com o Propósito) para o Dia ${codigoDia.dia_id}.
O pilar bíblico deste dia é ${codigoDia.pilar_origem === 'PROPÓSITO_M2414' ? 'Mateus 24:14 (Propósito)' : 'Apocalipse 3:21 (Recompensa)'}.

Você deve responder EXCLUSIVAMENTE em formato JSON (sem formatação markdown fora do JSON ou explicações extras):
{
  "codigo_verbal": "Código ${codigoDia.dia_id}: [Escreva um título/código curto e impactante sobre relacionamento intencional, mesa, comunhão, desacelerar ou servir]",
  "versiculo_chave": "[Insira um versículo bíblico real e sua referência no formato Livro Capítulo:Versículo]",
  "texto_reflexao": "[Escreva a reflexão prática do dia inspirada no versículo. Após a reflexão, insira duas quebras de linha e conte uma história real e verídica da história do cristianismo que exemplifique perfeitamente este tema (ex: biographies de heróis da fé, missionários, momentos de avivamento). Insira a história sob o título 'HISTÓRIA CRISTÃ REAL:\\n[sua história aqui]']",
  "texto_meditacao": "[Escreva um Roteiro de Oração Guiada no Estilo de Jesus com cerca de 4 blocos. Use os seguintes títulos de blocos no roteiro: 'Bloco 1. O Ponto de Partida: Ação de Graças pelo Hoje' (Tom de voz: Calmo, grato, pausado), 'Bloco 2. O Alinhamento: Tudo o que Tenho é Suficiente', 'Bloco 3. O Propósito e o Mover no Agora' (Tom de voz: Firme, consciente, de governo), 'Bloco 4. A Selagem do Convite' (Tom de voz: Decidido, pronto para a ação). Insira marcadores de silêncio programados como '(Pausa de 3 segundos)' ou '(Pausa de 4 segundos)' de forma estratégica entre os parágrafos para simular pausas reais na leitura.]"
}

Importante: O JSON deve ser 100% válido.`;

      const res = await fetch(`${API_BASE}/chatgpt/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'Você é um assistente teológico que responde estritamente no formato JSON puro especificado pelo usuário.' },
            { role: 'user', content: prompt }
          ]
        }),
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        const contentText = data.choices[0].message.content;
        const cleanJson = contentText.replace(/```json|```/g, '').trim();
        const generated = JSON.parse(cleanJson);

        const saveRes = await fetch(`${API_BASE}/codigo-dia/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dia_id: codigoDia.dia_id,
            codigo_verbal: generated.codigo_verbal,
            versiculo_chave: generated.versiculo_chave,
            texto_reflexao: generated.texto_reflexao,
            texto_meditacao: generated.texto_meditacao
          })
        });

        if (saveRes.ok) {
          setCodigoDia({
            ...codigoDia,
            codigo_verbal: generated.codigo_verbal,
            versiculo_chave: generated.versiculo_chave,
            texto_reflexao: generated.texto_reflexao,
            texto_meditacao: generated.texto_meditacao
          });
        } else {
          alert('Erro ao salvar reflexão gerada.');
        }
      } else {
        alert('Erro ao solicitar resposta do ChatGPT.');
      }
    } catch (err) {
      console.error('Erro na geração com IA:', err);
      alert('Falha na geração: verifique sua conexão com o ChatGPT.');
    } finally {
      setAiGenerating(false);
    }
  };

  const ambientTracks = [
    { id: 'none', label: 'Silêncio', url: '' },
    { id: 'chuva', label: 'Chuva', url: '/rain.mp3' },
    { id: 'mar', label: 'Ondas', url: '/ocean.mp3' },
    { id: 'piano', label: 'Piano', url: '/piano.mp3' }
  ];

  const handleSelectAmbient = (id) => {
    setActiveAmbient(id);
    if (!ambientAudioRef.current) return;
    if (id === 'none') {
      ambientAudioRef.current.pause();
      ambientAudioRef.current.currentTime = 0;
      return;
    }
    const track = ambientTracks.find(t => t.id === id);
    if (track && track.url) {
      if (!ambientAudioRef.current.src.endsWith(track.url)) {
        ambientAudioRef.current.src = track.url;
      }
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.volume = ambientVolume;
      ambientAudioRef.current.play().catch(e => {
        console.warn('[Ambient Audio] Play direto prevenido:', e);
      });
    }
  };

  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = ambientVolume;
    }
  }, [ambientVolume]);

  useEffect(() => {
    if (!ambientAudioRef.current) return;
    if (activeAmbient === 'none') {
      ambientAudioRef.current.pause();
      return;
    }
    const track = ambientTracks.find(t => t.id === activeAmbient);
    if (track && track.url) {
      if (!ambientAudioRef.current.src.endsWith(track.url)) {
        ambientAudioRef.current.src = track.url;
      }
      ambientAudioRef.current.loop = true;
      ambientAudioRef.current.volume = ambientVolume;
      if (activeTab === 'biblia' || meditationPlaying) {
        ambientAudioRef.current.play().catch(() => {});
      }
    }
  }, [activeAmbient, activeTab, meditationPlaying]);

  const stopMeditation = () => {
    stopNeuralSpeech();
    setMeditationPlaying(false);
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
    }
    if (meditationIntervalRef.current) {
      clearInterval(meditationIntervalRef.current);
      meditationIntervalRef.current = null;
    }
    if (meditationTimeoutRef.current) {
      clearTimeout(meditationTimeoutRef.current);
      meditationTimeoutRef.current = null;
    }
  };

  const getTodayMeditationPrayerScript = () => {
    const title = todaySintese?.title || todayMeditation?.title || 'Comunhão Sagrada';
    const verse = todaySintese?.verse || todayMeditation?.verse || '';
    const prayer = todaySintese?.oracao_sintese || todayMeditation?.prayer || 'Senhor Deus, abençoa este dia em Tua doce presença.';

    return `Respire fundo... e silencie as preocupações do mundo por alguns instantes.
(Pausa de 3 segundos)
Pai celestial de infinita graça, nesta manhã eu Te agradeço pelo dom da vida e pelas Tuas misericórdias que se renovam hoje sobre nós.
(Pausa de 2 segundos)
A Tua Palavra nos lembra hoje a promessa de: ${title}.
(Pausa de 2 segundos)
Nas Escrituras Sagradas está escrito: ${verse}.
(Pausa de 3 segundos)
${prayer}
(Pausa de 3 segundos)
Que a Tua paz, que excede todo o entendimento humano, guarde o meu coração e a minha mente ao longo de todo este dia.
Consagro a Ti cada decisão, cada encontro e cada palavra que sair dos meus lábios.
Usa a minha vida como um canal de bênção e esperança para abençoar o meu próximo com o amor de Cristo através do meu 1Convite.
Em nome de Jesus, Amém.`;
  };

  const toggleMeditationTTS = () => {
    if (meditationPlaying) {
      stopMeditation();
      return;
    }

    const rawText = getTodayMeditationPrayerScript();
    
    // Parser que limpa rótulos de guia para a voz fluir naturalmente
    const cleanPrayerSpeech = rawText
      .split('\n')
      .filter(line => {
        const l = line.trim();
        return l && !l.startsWith('Roteiro') && !l.startsWith('Duração') && !l.startsWith('Trilha') && !l.startsWith('Bloco') && !l.startsWith('(Tom de voz') && !l.includes('Pausa de');
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Duração estimada em segundos
    const wordCount = cleanPrayerSpeech.split(' ').length;
    const estimatedDuration = Math.max(30, Math.round(wordCount * 0.48));
    setMeditationDuration(estimatedDuration);
    setMeditationCurrentTime(0);
    setMeditationPlaying(true);
    setMeditationCompleted(false);

    // Toca som ambiente de fundo
    if (activeAmbient !== 'none' && ambientAudioRef.current) {
      const track = ambientTracks.find(t => t.id === activeAmbient);
      if (track && track.url) {
        ambientAudioRef.current.src = track.url;
        ambientAudioRef.current.loop = true;
        ambientAudioRef.current.volume = ambientVolume;
        ambientAudioRef.current.play().catch(() => {});
      }
    }

    const startTime = Date.now();
    meditationIntervalRef.current = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      setMeditationCurrentTime(Math.min(elapsed, estimatedDuration));
    }, 1000);

    const neuralRate = narrationRate <= 0.75 ? '-12%' : narrationRate <= 0.82 ? '-6%' : narrationRate <= 0.95 ? '0%' : '+6%';

    playNeuralSpeech(cleanPrayerSpeech, {
      voice: meditationVoice,
      rate: neuralRate,
      ambient: false,
      onStart: () => setMeditationPlaying(true),
      onProgress: (current, duration) => {
        if (duration) {
          setMeditationDuration(Math.round(duration));
          setMeditationCurrentTime(Math.round(current));
        }
      },
      onEnd: () => {
        setMeditationCompleted(true);
        // Mantém som ambiente por mais 10s antes de concluir
        meditationTimeoutRef.current = setTimeout(() => {
          stopMeditation();
          setMeditationCurrentTime(estimatedDuration);
        }, 10000);
      },
      onError: () => {
        stopMeditation();
      }
    });
  };

  // ── Áudio da Bíblia ─────────────────────────────────────────
  useEffect(() => {
    if (!bibleAudioRef.current) return;
    if (bibleAudioPlaying) {
      setAudioPlaying(false);
      bibleAudioRef.current.play().catch(() => setBibleAudioPlaying(false));
      // Se houver som de fundo selecionado, garante que também continue tocando suavemente
      if (activeAmbient !== 'none' && ambientAudioRef.current && ambientAudioRef.current.paused) {
        ambientAudioRef.current.play().catch(() => {});
      }
    } else {
      bibleAudioRef.current.pause();
    }
  }, [bibleAudioPlaying, activeAmbient]);

  const onBibleAudioTimeUpdate = () => { if (bibleAudioRef.current) setBibleAudioCurrentTime(bibleAudioRef.current.currentTime); };
  const onBibleAudioLoadedMetadata = () => { if (bibleAudioRef.current) setBibleAudioDuration(bibleAudioRef.current.duration); };
  const handleBibleAudioProgressBarClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (bibleAudioRef.current) {
      bibleAudioRef.current.currentTime = ((e.clientX - r.left) / r.width) * bibleAudioDuration;
      setBibleAudioCurrentTime(bibleAudioRef.current.currentTime);
    }
  };

  // ── Trilhas de Crescimento (Ansiedade, Família, Finanças, Propósito) ────
  const iniciarTrilha = (tema) => {
    setTrilhaLoading(true);
    const conteudoDia1 = getConteudoDiaTrilha(tema, 1);
    const trilhaObj = {
      ativa: true,
      tema: tema,
      dia_progresso: 1,
      conteudo: conteudoDia1
    };
    setTrilhaAtiva(trilhaObj);
    localStorage.setItem('1convite_trilha_ativa', JSON.stringify(trilhaObj));
    setTrilhaLoading(false);
  };

  const completarDiaTrilha = () => {
    if (!trilhaAtiva) return;
    const proxDia = trilhaAtiva.dia_progresso + 1;
    if (proxDia > 30) {
      alert('Glória a Deus! Você concluiu com vitória todos os 30 dias desta Trilha de Crescimento!');
      setUserCoins(prev => {
        const n = prev + 50;
        localStorage.setItem('app-coins', n);
        return n;
      });
      cancelarTrilha(false);
      return;
    }
    const proxConteudo = getConteudoDiaTrilha(trilhaAtiva.tema, proxDia);
    const novaTrilha = {
      ...trilhaAtiva,
      dia_progresso: proxDia,
      conteudo: proxConteudo
    };
    setTrilhaAtiva(novaTrilha);
    localStorage.setItem('1convite_trilha_ativa', JSON.stringify(novaTrilha));
    setUserCoins(prev => {
      const n = prev + 15;
      localStorage.setItem('app-coins', n);
      return n;
    });
  };

  const cancelarTrilha = (confirmar = true) => {
    if (confirmar && !confirm('Deseja realmente trocar ou reiniciar a trilha ativa?')) return;
    setTrilhaAtiva(null);
    localStorage.removeItem('1convite_trilha_ativa');
  };

  // ── Dicionário Teológico ─────────────────────────────────────
  const formatVerseText = (text) => {
    if (!dicionario || Object.keys(dicionario).length === 0) return text;
    
    const termos = Object.keys(dicionario).sort((a, b) => b.length - a.length);
    const pattern = termos.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
    if (!pattern) return text;
    
    const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      const lowerPart = part.toLowerCase();
      if (dicionario[lowerPart]) {
        return (
          <span 
            key={i} 
            className="dict-term" 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDicionarioTermo({ termo: part, significado: dicionario[lowerPart] });
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // ── Pagamento ───────────────────────────────────────────────
  const iniciarCheckoutMercadoPago = async () => {
    try { setIsPaying(true); const res = await fetch(`${API_BASE}/pagamentos/criar-preferencia`, { method: 'POST' }); const d = await res.json(); if (res.ok) { setPaymentPreferenceId(d.preferenceId); setActiveTab('simular-pagamento'); } }
    catch (e) { console.error(e); } finally { setIsPaying(false); }
  };

  const finalizarPagamentoSimulado = async () => {
    try {
      const res = await fetch(`${API_BASE}/pagamentos/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'payment.created', pref_id: paymentPreferenceId }) });
      if (res.ok) { alert('Pagamento aprovado! Plano Premium ativado.'); loadAppData(); setActiveTab('sabado'); }
    } catch (e) { console.error(e); }
  };

  // ── Admin ───────────────────────────────────────────────────
  const avancarDia = async () => { try { const r = await fetch(`${API_BASE}/avancar-dia`, { method: 'POST' }); if (r.ok) { loadAppData(); alert('Dia avançado!'); } else alert('Erro ao avançar.'); } catch (e) { console.error(e); } };
  const reiniciarJornada = async () => { if (!confirm('Reiniciar ao Dia 1?')) return; try { await fetch(`${API_BASE}/reiniciar-jornada`, { method: 'POST' }); loadAppData(); } catch (e) { console.error(e); } };
  const alterarPlanoAdmin = async (p) => { try { await fetch(`${API_BASE}/admin/definir-plano`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plano: p }) }); loadAppData(); } catch (e) { console.error(e); } };

  if (currentPath === '/baixar') {
    return (
      <div style={{
        background: 'var(--bg-app, #090B10)',
        color: 'var(--text-primary, #F8FAFC)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box'
      }}>
        <div style={{ maxWidth: '520px', width: '100%' }}>
          {/* Cabeçalho com Logomarca Oficial */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img
              src={darkMode ? appLogomarcaDark : appLogomarcaLight}
              alt="1Convite"
              style={{ height: '44px', width: 'auto', margin: '0 auto 12px', display: 'block', objectFit: 'contain' }}
            />
            <h1 style={{ fontSize: '1.35rem', fontWeight: '700', margin: '0 0 6px', color: 'var(--text-primary, #FFFFFF)' }}>
              Instale o 1Convite no seu celular
            </h1>
            <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
              Tenha a Bíblia Narrada, Café com Deus, TemploFit e seus devocionais sempre à mão.
            </p>
          </div>

          {/* Card Principal Unslop */}
          <div style={{
            width: '100%',
            padding: '24px 22px',
            borderRadius: '18px',
            border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.09))',
            background: 'var(--surface-card, #141720)',
            boxShadow: 'var(--shadow-card, 0 10px 30px rgba(0, 0, 0, 0.35))',
            marginBottom: '20px',
            boxSizing: 'border-box'
          }}>
            <a
              href="https://github.com/JonatasOliveira1983/1convite/releases/latest/download/1convite.apk"
              download
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  fontSize: '0.98rem',
                  background: 'var(--orange, #10B981)',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Baixar Aplicativo Android (APK)</span>
              </button>
            </a>

            <button
              type="button"
              onClick={() => {
                setCurrentPath('/app');
                navigateAppRoute(true);
              }}
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '13px 20px',
                fontSize: '0.92rem',
                background: 'var(--surface-subtle, rgba(255, 255, 255, 0.06))',
                color: 'var(--text-primary, #FFFFFF)',
                fontWeight: '600',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.14))',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>Acessar Agora pelo Desktop / Navegador</span>
            </button>

            {/* Instruções Android */}
            <div style={{ marginTop: '24px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '0.96rem', color: 'var(--text-primary, #FFFFFF)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--orange, #10B981)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
                <span>Passo a passo para Android</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  <>Toque no botão verde acima para iniciar o download oficial.</>,
                  <>Ao concluir, abra a notificação do arquivo <strong>1convite.apk</strong>.</>,
                  <>Se solicitado, ative <strong>Permitir desta fonte</strong> para o seu navegador.</>,
                  <>Toque em <strong>Instalar</strong> e depois em <strong>Abrir</strong>.</>,
                ].map((stepNode, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '11px' }}>
                    <span style={{
                      background: 'var(--surface-subtle, rgba(255,255,255,0.08))',
                      color: 'var(--orange, #10B981)',
                      border: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.76rem',
                      flexShrink: 0,
                      marginTop: '1px'
                    }}>
                      {idx + 1}
                    </span>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary, #94A3B8)', lineHeight: '1.5' }}>
                      {stepNode}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Instruções iOS */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.08))', textAlign: 'left' }}>
              <h3 style={{ fontSize: '0.96rem', color: 'var(--text-primary, #FFFFFF)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.59.69-1.12 1.83-.98 2.94 1.08.08 2.14-.56 2.79-1.28z" />
                </svg>
                <span>Para iPhone (iOS)</span>
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary, #94A3B8)', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                Adicione o 1Convite direto na tela inicial sem ocupar memória:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.83rem', color: 'var(--text-secondary, #94A3B8)' }}>
                <div>1. Abra <strong>1convite.com.br</strong> no navegador <strong>Safari</strong>.</div>
                <div>2. Toque no ícone de <strong>Compartilhar</strong> (quadrado com seta para cima).</div>
                <div>3. Selecione <strong>Adicionar à Tela de Início</strong>.</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => { window.location.href = '/'; }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--orange, #10B981)',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: '600',
              }}
            >
              ← Voltar para a Página Inicial
            </button>
          </div>
        </div>
      </div>
    );
  }


  // ── Renderização da Experiência Visual do 1Convite (Portal de Luz / Vale-Presente) ──
  if (portalConviteData) {
    return (
      <ConvitePortalLuz 
        senderName={portalConviteData.senderName}
        senderAvatar={portalConviteData.senderAvatar}
        conviteType={portalConviteData.conviteType}
        customMessage={portalConviteData.customMessage}
        vipCode={portalConviteData.vipCode}
        onAccept={({ vipCode, action }) => {
          if (vipCode) {
            try { localStorage.setItem('1convite_pending_vip_code', vipCode); } catch (e) {}
          }
          if (action === 'download') {
            window.open('https://github.com/JonatasOliveira1983/1convite/releases/latest/download/1convite.apk', '_blank');
          }
          setPortalConviteData(null);
          setIsLoggedIn(false);
        }}
        onDismiss={() => {
          setPortalConviteData(null);
        }}
      />
    );
  }

  if (isBooting) {
    return <ChamaLoader size={84} label="1Convite" fullScreen />;
  }

  if (showLanding) {
    return (
      <Suspense fallback={<AppBootFallback />}>
        <LandingPage onEnterApp={() => {
          navigateAppRoute(true);
          setActiveTab('dashboard');
          try { localStorage.setItem('1convite_visited_app', 'true'); } catch (e) {}
        }} />
      </Suspense>
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginPage 
        onBackToLanding={!isCapacitor ? () => navigateAppRoute(false) : undefined}
        onGoToPlans={!isCapacitor ? () => {
          navigateAppRoute(false);
          window.location.hash = '#planos';
          let tries = 0;
          const scrollTimer = setInterval(() => {
            tries += 1;
            const el = document.getElementById('planos');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              clearInterval(scrollTimer);
            } else if (tries >= 20) {
              clearInterval(scrollTimer);
            }
          }, 120);
        } : undefined}
        onLoginSuccess={(userData) => {
          setIsLoggedIn(true);
          setProfileName(userData.name);
          setProfileEmail(userData.contact);
          const nextEnts = userData.isAdmin
            ? ['ebooks', 'pregador', 'mulher_virtuosa']
            : (Array.isArray(userData.entitlements) ? userData.entitlements : []);
          setUserEntitlements(nextEnts);
          try {
            localStorage.setItem('1convite_entitlements', JSON.stringify(nextEnts));
          } catch {}
          const nextGender = userData.genero || 'homem';
          setUserGender(nextGender);
          if (userData.avatar) {
            setProfileAvatar(userData.avatar);
            setIsCustomAvatar(true);
          } else {
            setProfileAvatar(getDefaultAvatar(nextGender));
            setIsCustomAvatar(false);
          }
          if (userData.isAdmin) {
            setIsAdminMode(true);
            setShowAdminPanel(false);
            setIsPremiumUser(true);
            setActiveTab('admin-panel');
            return;
          } else {
            setIsAdminMode(false);
            setShowAdminPanel(false);
            if (userData.isPremium) {
              setIsPremiumUser(true);
              setUserVipExpiry(userData.expiry);
            }
          }
          setActiveTab('dashboard');
        }}
        onExploreGuest={() => {
          setIsLoggedIn(true);
          setIsAdminMode(false);
          setShowAdminPanel(false);
          setActiveTab('dashboard');
        }}
      />
    );
  }

  return (
    <div 
      className={`${isCapacitor ? 'app-container is-capacitor' : 'app-container'} ${darkMode ? 'dark-mode' : 'light-mode'} ${theme} ${isSidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}
      data-theme={darkMode ? 'dark' : 'light'}
    >
      <audio ref={ambientAudioRef} />

      {/* Botão Hambúrguer Flutuante para Mobile / Capacitor */}
      {!isSidebarOpen && (
        <button
          type="button"
          className="mobile-menu-fab"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Abrir menu lateral"
          title="Abrir menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`desktop-sidebar ${isSidebarOpen ? 'is-open' : ''} ${isSidebarCollapsed ? 'is-collapsed' : ''}`} aria-label="Navegação 1Convite">
        <div className="desktop-sidebar-brand">
          {!isSidebarCollapsed && (
            <img src={darkMode ? appLogomarcaDark : appLogomarcaLight} alt="1Convite" className="desktop-sidebar-logo" />
          )}
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => {
              if (window.innerWidth < 960 || isCapacitor) {
                setIsSidebarOpen(false);
              } else {
                setIsSidebarCollapsed((prev) => !prev);
              }
            }}
            aria-label={isSidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
            title={isSidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="desktop-sidebar-nav">
            {[
              {
                id: 'dashboard',
                label: 'Início',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              },
              {
                id: 'biblia',
                label: 'Bíblia Sagrada',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              },
              {
                id: 'cafe-com-deus',
                label: 'Café com Deus',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
              },
              {
                id: 'ide-estudos',
                label: 'I.D.E. Boas Notícias',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
              },
              {
                id: 'treino-templo',
                label: 'Corpo & Treino',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4M6 12h12"/></svg>
              },
              {
                id: 'chat',
                label: 'Mentores Bíblicos',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              },
              {
                id: 'ebooks-premium',
                label: 'Ebooks & Estudos',
                entitlementKey: 'ebooks',
                offerId: 'order_bump_ebooks',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              },
              {
                id: 'mulher-virtuosa',
                label: 'Mulher Virtuosa',
                entitlementKey: 'mulher_virtuosa',
                offerId: 'downsell_mulher',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              },
              {
                id: 'biblioteca-pregador',
                label: 'Bib. do Pregador',
                entitlementKey: 'pregador',
                offerId: 'downsell_pregador',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              },
              {
                id: 'convites-vip',
                label: 'Convites VIP',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
              },
              {
                id: 'conta',
                label: 'Minha Conta',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className={`desktop-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  if (item.entitlementKey && !hasModuleAccess(item.entitlementKey)) {
                    setUnlockOfferId(item.offerId);
                    setIsSidebarOpen(false);
                    return;
                  }
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                  if (item.id === 'biblia') {
                    setBibleViewMode('reading');
                    setBibleSelectedVerse(null);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                title={item.label}
              >
                <span className="desktop-nav-icon">{item.icon}</span>
                <span className="desktop-nav-label">{item.label}</span>
              </button>
            ))}

            <div className="desktop-sidebar-divider" />

            <a href="/blog/" className="desktop-nav-item" onClick={() => setIsSidebarOpen(false)} title="Blog 1Convite">
              <span className="desktop-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
              </span>
              <span className="desktop-nav-label">Blog 1Convite</span>
            </a>
            <button
              type="button"
              className="desktop-nav-item"
              onClick={() => { setIsSidebarOpen(false); navigateAppRoute(false); }}
              title="Página Oficial & Planos"
            >
              <span className="desktop-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </span>
              <span className="desktop-nav-label">Página Oficial & Planos</span>
            </button>
            {(isAdminMode || adminAuthService.isCurrentSessionAdmin() || (profileEmail || '').trim().toLowerCase() === 'jonatasprojetos2013@gmail.com') && (
              <button
                type="button"
                className={`desktop-nav-item ${activeTab === 'admin-panel' ? 'active' : ''}`}
                onClick={() => {
                  setIsAdminMode(true);
                  setActiveTab('admin-panel');
                  setIsSidebarOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ color: '#fbbf24', marginTop: '4px' }}
                title="Painel ADM"
              >
                <span className="desktop-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </span>
                <span className="desktop-nav-label">Painel ADM</span>
              </button>
            )}
            <button
              type="button"
              className="desktop-nav-item"
              onClick={() => setDarkMode((prev) => !prev)}
              title={darkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            >
              <span className="desktop-nav-icon">
                {darkMode ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </span>
              <span className="desktop-nav-label">{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
            <button
              type="button"
              className="desktop-nav-item"
              onClick={() => { setIsSidebarOpen(false); handleLogout(); }}
              style={{ color: '#f87171', marginTop: '4px' }}
              title="Sair da Conta"
            >
              <span className="desktop-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </span>
              <span className="desktop-nav-label">Sair da Conta</span>
            </button>
          </nav>

          <button
            type="button"
            className="desktop-sidebar-user"
            onClick={() => { setActiveTab('conta'); setIsSidebarOpen(false); }}
            title="Minha Conta"
          >
            <img src={profileAvatar} alt={profileName} className="desktop-user-avatar" />
            <div className="desktop-user-meta">
              <strong>{profileName || 'Membro 1Convite'}</strong>
              <span>{isPremiumUser ? 'Acesso VIP Ativo' : 'Modo Convidado'}</span>
            </div>
          </button>
        </aside>
      <header className="app-header" style={{
        display: (activeTab === 'cafe-com-deus' || activeTab === 'treino-templo' || activeTab === 'ebooks-premium') ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 16px',
        minHeight: '62px',
        height: '62px',
        boxSizing: 'border-box'
      }}>
        {activeTab === 'dashboard' ? (
          /* Header Ultra Clean: Apenas a imagem do usuário com acesso direto à Conta */
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-start' }}>
            <div 
              onClick={() => setActiveTab('conta')}
              style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer',
                border: isCustomAvatar ? '2px solid #EAB308' : '2px solid var(--orange)',
                background: 'var(--slate-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isCustomAvatar ? '0 2px 8px rgba(234, 179, 8, 0.35)' : '0 2px 8px rgba(249, 115, 22, 0.25)',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              title={isCustomAvatar ? "Minha Conta (Foto Personalizada)" : "Minha Conta • Toque para colocar sua foto"}
            >
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                <img src={profileAvatar} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {!isCustomAvatar && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#F97316',
                  border: '2px solid var(--bg-app)',
                  boxShadow: '0 0 6px #F97316'
                }} />
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Esquerda: Botão Voltar */}
            <button 
              onClick={() => {
                stopNeuralSpeech();
                setIsNarrating(false);
                setMeditationPlaying(false);
                if (meditationIntervalRef.current) clearInterval(meditationIntervalRef.current);
                if (activeTab === 'sabado' && activeSabadoBlock !== 'menu') {
                  setActiveSabadoBlock('menu');
                  setAudioPlaying(false);
                  if (audioRef.current) audioRef.current.pause();
                } else {
                  setActiveTab('dashboard');
                  setBibleAudioPlaying(false);
                  if (bibleAudioRef.current) bibleAudioRef.current.pause();
                  if (ambientAudioRef.current) ambientAudioRef.current.pause();
                  setActiveAmbient('none');
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.4rem',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%'
              }}
              className="back-btn"
            >
              ←
            </button>

            {/* Centro: Título ou Dropdown da Bíblia */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              {activeTab === 'biblia' ? (
                <button
                  className="bible-select-btn"
                  onClick={() => setBibleViewMode(bibleViewMode === 'select-book' ? 'reading' : 'select-book')}
                  style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                  <span>{bibleSelectedBook.livro_nome} {bibleSelectedChapter} ▼</span>
                </button>
              ) : (
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)', textAlign: 'center' }}>
                  {activeTab === 'sabado' && (
                    activeSabadoBlock === 'menu' ? 'Desafio do Dia' :
                    activeSabadoBlock === 'reflexao' ? 'Reflexão do Dia' :
                    activeSabadoBlock === 'meditacao' ? 'Oração Guiada' :
                    activeSabadoBlock === 'descanso' ? 'O Botão do Descanso' :
                    'Trilha de Conhecimento'
                  )}
                  {activeTab === 'chat' && 'Mentores Bíblicos'}
                  {activeTab === 'contatos' && 'Conexões & Contatos'}
                  {activeTab === 'conta' && 'Minha Conta'}
                  {activeTab === 'criar-card' && 'Studio de Cards'}
                  {activeTab === 'arcade' && 'Jogos & Kids'}
                  {activeTab === 'trail' && 'Trilha do Reino'}
                </h2>
              )}
            </div>

            {/* Direita: Controles especiais da Bíblia */}
            {activeTab === 'biblia' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setBibleShowAudioPlayer(!bibleShowAudioPlayer)}
                  style={{
                    background: bibleShowAudioPlayer ? 'var(--orange-light)' : 'transparent',
                    border: bibleShowAudioPlayer ? '1px solid var(--orange)' : 'none',
                    fontSize: '1.1rem',
                    color: bibleShowAudioPlayer ? 'var(--orange)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  title="Ouvir Áudio do Capítulo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/>
                    <circle cx="6" cy="18" r="3"/>
                    <circle cx="18" cy="16" r="3"/>
                  </svg>
                </button>
                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Opções"
                >
                  ⋮
                </button>
              </div>
            ) : (
              <div style={{ width: '36px' }}></div>
            )}
          </>
        )}
      </header>

      {/* ── MODAIS BÍBLIA ─────────────────────── */}
      {commentModalOpen && bibleSelectedVerse && (
        <div className="bible-modal-overlay" style={{ zIndex: 999 }}>
          <div className="bible-modal" style={{
            backgroundColor: darkMode ? '#1c1c1e' : '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              {bibleSelectedBook.livro_nome} {bibleSelectedChapter}:{bibleSelectedVerse.versiculo}
            </h3>
            
            <textarea
              className="input-field"
              rows="4"
              placeholder="Digite seu comentário ou anotação pessoal..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid var(--slate-border)',
                backgroundColor: darkMode ? '#2c2c2e' : '#ffffff',
                color: 'var(--text-primary)',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                style={{ padding: '10px 20px', borderRadius: '12px' }}
                onClick={() => setCommentModalOpen(false)}
              >
                FECHAR
              </button>
              <button
                className="btn-primary"
                style={{ padding: '10px 20px', borderRadius: '12px' }}
                onClick={() => {
                  const key = `${bibleSelectedBook.livro_abrev}-${bibleSelectedChapter}-${bibleSelectedVerse.versiculo}`;
                  const newComments = { ...bibleComments };
                  if (commentText.trim() === '') {
                    delete newComments[key];
                  } else {
                    newComments[key] = commentText;
                  }
                  setBibleComments(newComments);
                  localStorage.setItem('bible-comments', JSON.stringify(newComments));
                  setCommentModalOpen(false);
                }}
              >
                SALVAR
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'biblia' && bibleViewMode === 'select-book' && (() => {
        // Calcula progresso geral AT e NT
        const atBooks = bibleBooks.filter((_, i) => i < 39);
        const ntBooks = bibleBooks.filter((_, i) => i >= 39);
        const chaptersPerBook = { gn:50,ex:40,lv:27,nm:36,dt:34,js:24,jz:21,rt:4,'1sm':31,'2sm':24,'1rs':22,'2rs':25,'1cr':29,'2cr':36,ed:10,ne:13,et:10,jó:42,sl:150,pv:31,ec:12,ct:8,is:66,jr:52,lm:5,ez:48,dn:12,os:14,jl:3,am:9,ob:1,jn:4,mq:7,na:3,hc:3,sf:3,ag:2,zc:14,ml:4,mt:28,mc:16,lc:24,jo:21,at:28,rm:16,'1co':16,'2co':13,gl:6,ef:6,fp:4,cl:4,'1ts':5,'2ts':3,'1tm':6,'2tm':4,tt:3,fm:1,hb:13,tg:5,'1pe':5,'2pe':3,'1jo':5,'2jo':1,'3jo':1,jd:1,ap:22 };
        const calcTotal = (books) => books.reduce((acc, bk) => {
          const total = chaptersPerBook[bk.livro_abrev] || bk.capitulos || 0;
          const prog = calcBookProgress(bk.livro_abrev, total);
          return { read: acc.read + prog.readCount, total: acc.total + total };
        }, { read: 0, total: 0 });
        const atStats = calcTotal(atBooks);
        const ntStats = calcTotal(ntBooks);
        const atPercent = atStats.total > 0 ? Math.round((atStats.read / atStats.total) * 100) : 0;
        const ntPercent = ntStats.total > 0 ? Math.round((ntStats.read / ntStats.total) * 100) : 0;
        const totalPercent = (atStats.total + ntStats.total) > 0 ? Math.round(((atStats.read + ntStats.read) / (atStats.total + ntStats.total)) * 100) : 0;

        return (
          <div className="bible-modal-overlay">
            <div className="bible-modal-header">
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Selecione o Livro</h3>
              <button className="btn-secondary" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setBibleViewMode('reading')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
            <div className="bible-modal-content">

              {/* Painel Resumo Global */}
              <div style={{ margin: '0 0 16px 0', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Progresso Total da Bíblia</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--orange)' }}>{totalPercent}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ height: '100%', width: `${totalPercent}%`, background: 'linear-gradient(90deg, var(--orange), #f97316)', borderRadius: '99px', transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#f59e0b' }}>{atPercent}%</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Antigo Testamento</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{atStats.read}/{atStats.total} capítulos</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: '#3b82f6' }}>{ntPercent}%</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Novo Testamento</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{ntStats.read}/{ntStats.total} capítulos</div>
                  </div>
                </div>
              </div>

              <div className="bible-testament-title">Antigo Testamento</div>
              {atBooks.map((bk, idx) => {
                const total = chaptersPerBook[bk.livro_abrev] || bk.capitulos || 0;
                const prog = calcBookProgress(bk.livro_abrev, total);
                const isDone = prog.percent === 100;
                return (
                  <div key={idx} style={{ padding: '10px 14px', marginBottom: '2px', cursor: 'pointer', borderRadius: '10px', background: isDone ? 'rgba(34,197,94,0.08)' : 'transparent', border: isDone ? '1px solid rgba(34,197,94,0.2)' : '1px solid transparent', transition: 'all 0.2s' }}
                    onClick={() => { setBibleSelectedBook(bk); setBibleViewMode('select-chapter'); }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: isDone ? '700' : '500', color: isDone ? '#22c55e' : 'var(--text-primary)' }}>{bk.livro_nome}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isDone && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: isDone ? '#22c55e' : 'var(--text-muted)' }}>{prog.percent}%</span>
                      </div>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${prog.percent}%`, background: isDone ? '#22c55e' : 'var(--orange)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                );
              })}

              <div className="bible-testament-title" style={{ marginTop: '8px' }}>Novo Testamento</div>
              {ntBooks.map((bk, idx) => {
                const total = chaptersPerBook[bk.livro_abrev] || bk.capitulos || 0;
                const prog = calcBookProgress(bk.livro_abrev, total);
                const isDone = prog.percent === 100;
                return (
                  <div key={idx} style={{ padding: '10px 14px', marginBottom: '2px', cursor: 'pointer', borderRadius: '10px', background: isDone ? 'rgba(34,197,94,0.08)' : 'transparent', border: isDone ? '1px solid rgba(34,197,94,0.2)' : '1px solid transparent', transition: 'all 0.2s' }}
                    onClick={() => { setBibleSelectedBook(bk); setBibleViewMode('select-chapter'); }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: isDone ? '700' : '500', color: isDone ? '#22c55e' : 'var(--text-primary)' }}>{bk.livro_nome}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isDone && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: isDone ? '#22c55e' : 'var(--text-muted)' }}>{prog.percent}%</span>
                      </div>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${prog.percent}%`, background: isDone ? '#22c55e' : '#3b82f6', borderRadius: '99px', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {activeTab === 'biblia' && bibleViewMode === 'select-chapter' && (() => {
        const chaptersPerBook = { gn:50,ex:40,lv:27,nm:36,dt:34,js:24,jz:21,rt:4,'1sm':31,'2sm':24,'1rs':22,'2rs':25,'1cr':29,'2cr':36,ed:10,ne:13,et:10,jó:42,sl:150,pv:31,ec:12,ct:8,is:66,jr:52,lm:5,ez:48,dn:12,os:14,jl:3,am:9,ob:1,jn:4,mq:7,na:3,hc:3,sf:3,ag:2,zc:14,ml:4,mt:28,mc:16,lc:24,jo:21,at:28,rm:16,'1co':16,'2co':13,gl:6,ef:6,fp:4,cl:4,'1ts':5,'2ts':3,'1tm':6,'2tm':4,tt:3,fm:1,hb:13,tg:5,'1pe':5,'2pe':3,'1jo':5,'2jo':1,'3jo':1,jd:1,ap:22 };
        const total = chaptersPerBook[bibleSelectedBook.livro_abrev] || bibleChaptersCount;
        const prog = calcBookProgress(bibleSelectedBook.livro_abrev, total);
        return (
          <div className="bible-modal-overlay">
            <div className="bible-modal-header">
              <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={() => setBibleViewMode('select-book')}>← Livros</button>
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{bibleSelectedBook.livro_nome}</h3>
              <div style={{ width: '72px' }} />
            </div>
            <div className="bible-modal-content">
              {/* Barra de progresso do livro */}
              <div style={{ padding: '8px 4px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{prog.readCount} de {total} capítulos lidos</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: prog.percent === 100 ? '#22c55e' : 'var(--orange)' }}>{prog.percent}%</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${prog.percent}%`, background: prog.percent === 100 ? '#22c55e' : 'var(--orange)', borderRadius: '99px', transition: 'width 0.4s ease' }} />
                </div>
              </div>
              <div className="bible-chapter-grid">
                {Array.from({ length: bibleChaptersCount }).map((_, i) => {
                  const chNum = i + 1;
                  const read = isChapterRead(bibleSelectedBook.livro_abrev, chNum);
                  return (
                    <div key={i}
                      onClick={() => { setBibleSelectedChapter(chNum); setBibleViewMode('reading'); }}
                      style={{
                        position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '44px', height: '44px', borderRadius: '10px',
                        cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600',
                        background: read ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                        border: read ? '1.5px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.06)',
                        color: read ? '#22c55e' : 'var(--text-primary)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {chNum}
                      {read && (
                        <div style={{ position: 'absolute', top: '2px', right: '2px', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── MODAL DICIONÁRIO TEOLÓGICO ────────── */}
      {selectedDicionarioTermo && (
        <div className="dict-modal">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ color: 'var(--orange)', fontSize: '1.1rem', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              {selectedDicionarioTermo.termo}
            </h3>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={() => setSelectedDicionarioTermo(null)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Fechar</button>
          </div>
          <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>{selectedDicionarioTermo.significado}</p>
        </div>
      )}

      {/* ── MAIN ──────────────────────────────── */}
      <main className="main-content" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 92px)' }}>
        <Suspense fallback={<AppBootFallback />}>

        {/* ════════════ TELA DASHBOARD PRINCIPAL (FEED IMERSIVO 1CONVITE 3.0) ════════════ */}
        {activeTab === 'dashboard' && (
          <div className="page-enter animate-fade-in desktop-dashboard-shell">
            
            {/* 1. CHIPS DE NAVEGAÇÃO RÁPIDA / FILTRO */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '14px', marginBottom: '8px', scrollbarWidth: 'none' }}>
              {[
                { id: 'todos', label: '✦ Todos' },
                { id: 'palavra', label: 'Palavra & Oração' },
                { id: 'treino', label: 'TemploFit' },
                { id: 'mentores', label: 'Mentores Canônicos' },
                { id: 'desafios', label: 'Desafios & Reino' }
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => setFeedFilter(chip.id)}
                  style={{
                    whiteSpace: 'nowrap',
                    background: feedFilter === chip.id ? 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' : 'rgba(255, 255, 255, 0.05)',
                    color: feedFilter === chip.id ? '#FFF' : 'rgba(255, 255, 255, 0.75)',
                    border: feedFilter === chip.id ? '1px solid #F97316' : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: feedFilter === chip.id ? '0 4px 14px rgba(249, 115, 22, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* 2. CARD HERO IMERSIVO: "O CONVITE DE HOJE" (ESTILO VANAHEIM DA REFERÊNCIA) */}
            {(feedFilter === 'todos' || feedFilter === 'palavra') && (
              <div 
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  marginBottom: '22px',
                  height: '280px',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer'
                }}
                onClick={() => openCafeStep(1)}
              >
                <img 
                  src={heroMountainsImg} 
                  alt="O Convite de Hoje" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(11, 12, 16, 0.98) 12%, rgba(11, 12, 16, 0.55) 55%, rgba(11, 12, 16, 0.1) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '20px',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      color: '#FDBA74',
                      background: 'rgba(249, 115, 22, 0.25)',
                      border: '1px solid rgba(249, 115, 22, 0.45)',
                      padding: '4px 10px',
                      borderRadius: '999px'
                    }}>
                      ✦ O CONVITE DE HOJE • {getTodayDateFormatted()}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '1.35rem', fontWeight: '900', color: '#FFF', textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}>
                    {todayMeditation.title}
                  </h3>

                  <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.45', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    “{String(todayMeditation.verse || '').replace(/^["“]+|["”]+$/g, '')}”
                  </p>

                  <div style={{ display: 'flex', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => openCafeStep(1)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        minHeight: '44px',
                        background: '#F97316',
                        color: '#FFF',
                        fontWeight: '800',
                        fontSize: '0.84rem',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>Ouvir Reflexão</span>
                    </button>

                    <button 
                      onClick={() => {
                        setActiveTab('biblia');
                        setBibleViewMode('reading');
                        setBibleSelectedVerse(null);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        minHeight: '44px',
                        background: 'rgba(255, 255, 255, 0.14)',
                        backdropFilter: 'blur(10px)',
                        color: '#FFF',
                        fontWeight: '700',
                        fontSize: '0.84rem',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <span>Abrir Escrituras</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CARROSSEL DOS GIGANTES DA FÉ (MENTORES BÍBLICOS CANÔNICOS) */}
            {(feedFilter === 'todos' || feedFilter === 'mentores') && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#F97316', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      SABEDORIA CANÔNICA
                    </span>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#FFF' }}>
                      Conselho dos Mentores
                    </h4>
                  </div>
                  <button 
                    onClick={() => setActiveTab('chat')}
                    style={{ background: 'transparent', border: 'none', color: '#F97316', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Ver Todos →
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                  {LAYA_MENTORES.map(mentor => (
                    <div 
                      key={mentor.id}
                      onClick={() => {
                        setActiveCounselor(mentor.id);
                        setActiveTab('chat');
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        flexShrink: 0,
                        cursor: 'pointer',
                        width: '74px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        padding: '2px',
                        background: 'linear-gradient(135deg, #F97316 0%, rgba(249, 115, 22, 0.2) 100%)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                        transition: 'transform 0.2s ease'
                      }}>
                        <img 
                          src={mentor.avatar} 
                          alt={mentor.nome} 
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }} 
                        />
                      </div>
                      <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {mentor.id === 'salomao' ? 'Salomão' : mentor.id === 'davi' ? 'Davi' : mentor.id === 'paulo' ? 'Paulo' : mentor.id === 'moises' ? 'Moisés' : mentor.id === 'ester' ? 'Ester' : mentor.id === 'maria' ? 'Maria' : 'Jesus'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. CARD DESTAQUE CUIDADO DO TEMPLO (OPENGYM INTEGRADO) */}
            {(feedFilter === 'todos' || feedFilter === 'treino') && (
              <div 
                style={{
                  position: 'relative',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  marginBottom: '24px',
                  height: '220px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab('treino-templo')}
              >
                <img 
                  src={treinoTemploImg} 
                  alt="TemploFit" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(11, 12, 16, 0.96) 18%, rgba(11, 12, 16, 0.5) 65%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '18px',
                  boxSizing: 'border-box'
                }}>
                  <span style={{
                    fontSize: '0.64rem',
                    fontWeight: '800',
                    color: '#10B981',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    alignSelf: 'flex-start',
                    marginBottom: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <img src="/templofit/templofit-logo-darkbg.png" alt="TemploFit" style={{ height: '16px', width: 'auto' }} />
                    <span>• SAÚDE &amp; FORÇA</span>
                  </span>

                  <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: '800', color: '#FFF' }}>
                    Treino do Dia: Fortalecimento & Vitalidade
                  </h3>

                  <p style={{ margin: '0 0 12px', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                    15 min • Sem Equipamentos • Rotinas Guiadas TemploFit
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveTab('treino-templo'); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#10B981',
                        color: '#0B0C10',
                        fontWeight: '800',
                        fontSize: '0.8rem',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>Iniciar Treino</span>
                    </button>
                    <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                      Cuidando do Templo de Deus
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4B. BLOCO DEDICADO: CONVITES VIP (EM DESTAQUE LOGO ABAIXO DO TEMPLOFIT) */}
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '26px',
                minHeight: '196px',
                border: '1px solid rgba(217, 119, 6, 0.38)',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.45)',
                cursor: 'pointer'
              }}
              onClick={() => {
                setActiveTab('convites-vip');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img
                src={conviteVipCardBg}
                alt="Convites VIP 1Convite"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  minHeight: '196px',
                  background: 'linear-gradient(95deg, rgba(9, 10, 14, 0.94) 0%, rgba(12, 13, 18, 0.84) 55%, rgba(15, 12, 8, 0.52) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '22px 20px',
                  boxSizing: 'border-box'
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    letterSpacing: '0.04em',
                    color: '#FBBF24',
                    background: 'rgba(245, 158, 11, 0.14)',
                    border: '1px solid rgba(245, 158, 11, 0.32)',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    alignSelf: 'flex-start',
                    marginBottom: '10px'
                  }}
                >
                  Vale-Presente Oficial • 180 dias grátis
                </span>

                <h3 style={{ margin: '0 0 6px', fontSize: '1.22rem', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  Convites VIP: Abençoe quem você ama
                </h3>

                <p style={{ margin: '0 0 14px', fontSize: '0.84rem', lineHeight: '1.5', color: 'rgba(244, 244, 245, 0.86)', maxWidth: '520px' }}>
                  Gerencie seus Vales-Presente dourados, personalize com dedicatória e QR Code, baixe em PDF ou envie pelo WhatsApp.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('convites-vip');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#1C1917',
                      fontWeight: '800',
                      fontSize: '0.84rem',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '999px',
                      cursor: 'pointer'
                    }}
                  >
                    <span>Abrir Meus Convites VIP →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 5. SEÇÃO BIBLIOTECA & FERRAMENTAS (COM IMAGENS DE FUNDO — DESKTOP & APP) */}
            <div style={{ marginBottom: '26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.5)' }}>
                    Módulos principais
                  </span>
                  <h4 style={{ margin: '2px 0 0', fontSize: '1.08rem', fontWeight: '600', color: '#FFF' }}>
                    Biblioteca e Ferramentas
                  </h4>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(205px, 1fr))',
                gap: '12px',
              }}>
                {[
                  { 
                    id: 'biblia', 
                    label: 'Bíblia Sagrada', 
                    sub: 'ACF com Áudio & Estudo',
                    bgImage: '/landing-cards/biblia-audio.jpg',
                    accent: '#F97316',
                    icon: (
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )
                  },
                  { 
                    id: 'sabado', 
                    label: 'Desafio do Dia', 
                    sub: 'Prática & Meditação',
                    bgImage: '/landing-cards/oracao-365.jpg',
                    accent: '#EAB308',
                    icon: (
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                      </svg>
                    )
                  },
                  { 
                    id: 'trail', 
                    label: 'Trilha do Reino', 
                    sub: '365 Dias Cronológicos',
                    bgImage: '/landing-cards/trilha-reino.jpg',
                    accent: '#10B981',
                    icon: (
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    )
                  },
                  { 
                    id: 'arcade', 
                    label: 'Jogos & Kids', 
                    sub: 'Quiz & Caça-Palavras',
                    tag: 'INFANTIL',
                    bgImage: '/landing-cards/mentores-sabedoria.jpg',
                    accent: '#06B6D4',
                    icon: (
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  },
                  { 
                    id: 'contatos', 
                    label: 'Conexões do Reino', 
                    sub: 'Grupos & Irmãos',
                    bgImage: heroMountainsImg,
                    accent: '#14B8A6',
                    icon: (
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )
                  },
                  { 
                    id: 'criar-card', 
                    label: 'Criar Card', 
                    sub: 'Compartilhe Versículos',
                    bgImage: '/landing-cards/studio-cards.jpg',
                    accent: '#A855F7',
                    icon: (
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="3" ry="3" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )
                  },
                  { 
                    id: 'lojinha', 
                    label: 'Lojinha do Reino', 
                    sub: 'Itens & Recompensas',
                    bgImage: '/landing-cards/trilha-reino.jpg',
                    accent: '#F59E0B',
                    icon: (
                      <ChaminhaCoin size={24} />
                    )
                  }
                ].map(card => (
                  <div
                    key={card.id}
                    onClick={() => {
                      if (card.id === 'sabado') {
                        openCafeStep(2);
                        return;
                      }
                      setActiveTab(card.id);
                      if (card.id === 'biblia') {
                        setBibleViewMode('reading');
                        setBibleSelectedVerse(null);
                      }
                      if (card.id === 'criar-card') {
                        setCardSelectedText('');
                        setCardCategory('bomdia');
                      }
                    }}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundImage: `linear-gradient(180deg, rgba(11, 12, 16, 0.42) 0%, rgba(11, 12, 16, 0.9) 72%, rgba(11, 12, 16, 0.98) 100%), url(${card.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '18px',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '126px',
                      boxShadow: '0 8px 22px rgba(0, 0, 0, 0.45)',
                      transition: 'transform 0.2s ease, border-color 0.2s ease'
                    }}
                  >
                    {card.tag === 'INFANTIL' && (
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        fontSize: '0.58rem',
                        fontWeight: '800',
                        color: '#22D3EE',
                        background: 'rgba(6, 182, 212, 0.18)',
                        border: '1px solid rgba(6, 182, 212, 0.38)',
                        padding: '2px 7px',
                        borderRadius: '999px'
                      }}>
                        KIDS
                      </span>
                    )}

                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '11px',
                      background: `${card.accent}28`,
                      backdropFilter: 'blur(6px)',
                      border: `1px solid ${card.accent}44`,
                      color: card.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px'
                    }}>
                      {card.icon}
                    </div>

                    <div>
                      <h5 style={{ margin: '0 0 2px', fontSize: '0.92rem', fontWeight: '800', color: '#FFF' }}>
                        {card.label}
                      </h5>
                      <span style={{ fontSize: '0.73rem', color: 'rgba(255, 255, 255, 0.72)' }}>
                        {card.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. VITRINE DE OFERTAS & EXPANSÕES EXCLUSIVAS (SEPARADA — DESKTOP & APP) */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.5)' }}>
                    Conteúdo adicional
                  </span>
                  <h4 style={{ margin: '2px 0 0', fontSize: '1.08rem', fontWeight: '600', color: '#FFF' }}>
                    Ofertas e Bibliotecas
                  </h4>
                </div>
                {(!hasModuleAccess('mulher_virtuosa') || !hasModuleAccess('pregador')) && (
                  <button
                    type="button"
                    onClick={() => setUnlockOfferId('upsell_combo')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#E2E8F0',
                      fontSize: '0.74rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Combo Pregador + Mulher • R$ 47,00
                  </button>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px',
              }}>
                {[
                  {
                    id: 'ebooks-premium',
                    label: 'Coleção 5 E-books Premium',
                    sub: 'Leitura e download em PDF direto no app',
                    entitlementKey: 'ebooks',
                    offerId: 'order_bump_ebooks',
                    priceLabel: 'R$ 19,90',
                    bgImage: '/offers/ebooks-pack.jpg',
                  },
                  {
                    id: 'mulher-virtuosa',
                    label: 'Planner da Mulher Virtuosa',
                    sub: 'Graça, família e organização espiritual',
                    entitlementKey: 'mulher_virtuosa',
                    offerId: 'downsell_mulher',
                    priceLabel: 'R$ 24,90',
                    bgImage: '/offers/mulher-virtuosa.jpg',
                  },
                  {
                    id: 'biblioteca-pregador',
                    label: 'Biblioteca do Pregador',
                    sub: 'Esboços, sermões e referências bíblicas',
                    entitlementKey: 'pregador',
                    offerId: 'downsell_pregador',
                    priceLabel: 'R$ 24,90',
                    bgImage: '/offers/biblioteca-pregador.jpg',
                  },
                ].map((offerCard) => {
                  const unlocked = hasModuleAccess(offerCard.entitlementKey);
                  return (
                    <div
                      key={offerCard.id}
                      onClick={() => {
                        if (unlocked) {
                          setActiveTab(offerCard.id);
                        } else {
                          setUnlockOfferId(offerCard.offerId);
                        }
                      }}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundImage: `linear-gradient(180deg, rgba(9, 10, 15, 0.35) 0%, rgba(9, 10, 15, 0.9) 62%, rgba(9, 10, 15, 0.98) 100%), url(${offerCard.bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: unlocked ? '1px solid rgba(16, 185, 129, 0.42)' : '1px solid rgba(251, 191, 36, 0.35)',
                        borderRadius: '18px',
                        padding: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '164px',
                        boxShadow: '0 10px 26px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: '600',
                          color: unlocked ? '#34D399' : '#E2E8F0',
                          background: 'rgba(15, 23, 42, 0.78)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}>
                          {unlocked ? (
                            <>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>
                              Liberado
                            </>
                          ) : (
                            <>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                              {offerCard.priceLabel}
                            </>
                          )}
                        </span>
                      </div>

                      <div style={{ marginTop: '36px' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.98rem', color: '#FFFFFF', marginBottom: '4px' }}>
                          {offerCard.label}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '12px' }}>
                          {offerCard.sub}
                        </div>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.74rem',
                          fontWeight: '600',
                          background: unlocked ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.1)',
                          border: unlocked ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.16)',
                          color: unlocked ? '#34D399' : '#FFFFFF',
                        }}>
                          {unlocked ? 'Abrir biblioteca →' : `Liberar acesso • ${offerCard.priceLabel}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ════════════ ABA DESAFIO DO DIA ════════════ */}
        {activeTab === 'sabado' && (
          <div className="page-enter" style={{ padding: '16px', boxSizing: 'border-box' }}>
            
            {/* MENU PRINCIPAL DO DESAFIO */}
            {activeSabadoBlock === 'menu' && (
              <div className="animate-fade-in" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                paddingBottom: '20px'
              }}>
                {[
                  {
                    id: 'reflexao',
                    title: 'Reflexão do Dia',
                    desc: 'Código verbal e reflexão.',
                    icon: (
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                      </svg>
                    )
                  },
                  {
                    id: 'meditacao',
                    title: 'Oração Guiada',
                    desc: 'Alinhamento e ação de graças.',
                    icon: (
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    )
                  },
                  {
                    id: 'descanso',
                    title: 'Botão do Descanso',
                    desc: 'Pausa de respiração.',
                    icon: (
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5C7.8 10.5 10.5 7.8 10.5 4.5M19.5 10.5C16.2 10.5 13.5 7.8 13.5 4.5M4.5 13.5C7.8 13.5 10.5 16.2 10.5 19.5M19.5 13.5C16.2 13.5 13.5 16.2 13.5 19.5" />
                      </svg>
                    )
                  },
                  {
                    id: 'trilha',
                    title: 'Trilha Temática',
                    desc: 'Estudo ativo de 30 dias.',
                    icon: (
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    )
                  }
                ].map(block => (
                  <div
                    key={block.id}
                    onClick={() => setActiveSabadoBlock(block.id)}
                    className="dashboard-card"
                    style={{
                      backgroundColor: 'var(--white)',
                      border: '1px solid var(--slate-border)',
                      borderRadius: '20px',
                      padding: '24px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease-in-out',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div className="dashboard-card-icon" style={{ color: 'var(--orange)' }}>
                      {block.icon}
                    </div>
                    <span className="dashboard-card-label" style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', textAlign: 'center' }}>
                      {block.title}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textAlign: 'center', opacity: 0.8 }}>
                      {block.desc}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 1. REFLEXÃO DO DIA */}
            {activeSabadoBlock === 'reflexao' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Barra de Navegação Interna */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <button
                    onClick={() => {
                      stopNeuralSpeech();
                      setIsNarrating(false);
                      setActiveSabadoBlock('menu');
                    }}
                    style={{
                      background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                      border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                      borderRadius: '12px',
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    <span>Voltar ao Menu</span>
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--orange-dark)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>Dia {todaySintese?.day || todayDayNumber} de 365</span>
                  </div>
                </div>

                {/* Hero Card da Reflexão do Dia */}
                <div style={{
                  background: darkMode 
                    ? 'linear-gradient(135deg, #1c1408 0%, #2a1a06 50%, #151007 100%)' 
                    : 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 50%, #FEF3C7 100%)',
                  borderRadius: '24px',
                  padding: '24px 20px',
                  border: darkMode ? '1px solid rgba(249, 115, 22, 0.3)' : '1.5px solid rgba(249, 115, 22, 0.25)',
                  boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.4)' : '0 8px 24px rgba(249, 115, 22, 0.12)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Selo Devocional Diário & Botão de Voz Neural */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: darkMode ? 'rgba(249, 115, 22, 0.2)' : 'rgba(249, 115, 22, 0.15)',
                      color: 'var(--orange-dark)',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(249, 115, 22, 0.3)'
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                      Café com Deus • {getTodayDateFormatted()}
                      {dailyPendingBadge > 0 && (
                        <span
                          title={`${dailyPendingBadge} dia(s) pendente(s) nos 3 passos`}
                          style={{
                            marginLeft: '6px',
                            background: '#EF4444',
                            color: '#FFFFFF',
                            borderRadius: '999px',
                            padding: '1px 7px',
                            fontSize: '0.68rem',
                            fontWeight: '900'
                          }}
                        >
                          {dailyPendingBadge}
                        </span>
                      )}
                    </span>

                    <button
                      onClick={speakReflection}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--orange)',
                        background: isNarrating ? 'var(--orange)' : (darkMode ? 'rgba(249,115,22,0.15)' : '#ffffff'),
                        color: isNarrating ? '#ffffff' : 'var(--orange-dark)',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(249,115,22,0.15)'
                      }}
                    >
                      {isNarrating ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
                          <span>Pausar Voz</span>
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                          <span>Ouvir Reflexão</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Título da Reflexão */}
                  <h2 style={{
                    fontSize: '1.35rem',
                    fontWeight: '900',
                    lineHeight: '1.3',
                    margin: '0 0 14px 0',
                    color: darkMode ? '#F8FAFC' : '#1E293B'
                  }}>
                    {todaySintese?.title || todayMeditation?.title}
                  </h2>

                  {/* Versículo de Ancoragem */}
                  <div style={{
                    background: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)',
                    borderLeft: '4px solid var(--orange)',
                    padding: '12px 14px',
                    borderRadius: '0 12px 12px 0',
                    marginBottom: '4px'
                  }}>
                    <p style={{
                      fontSize: '0.92rem',
                      fontStyle: 'italic',
                      lineHeight: '1.5',
                      margin: 0,
                      color: darkMode ? '#E2E8F0' : '#475569'
                    }}>
                      "{todaySintese?.verse || todayMeditation?.verse}"
                    </p>
                  </div>
                </div>

                {/* 1. CARD: PENSAMENTO PRINCIPAL DO DIA (A IDEIA-FORÇA) */}
                <div style={{
                  background: darkMode 
                    ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(20, 16, 10, 0.95) 100%)' 
                    : 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
                  borderRadius: '20px',
                  padding: '20px',
                  border: darkMode ? '1.5px solid rgba(249, 115, 22, 0.35)' : '1.5px solid #FCD34D',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--orange-dark)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span style={{ fontSize: '0.78rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      Pensamento Central de Hoje
                    </span>
                  </div>
                  <p style={{
                    fontSize: '1.08rem',
                    fontWeight: '800',
                    lineHeight: '1.5',
                    color: darkMode ? '#FFFFFF' : '#78350F',
                    margin: 0
                  }}>
                    "{todaySintese?.pensamento_principal}"
                  </p>
                </div>

                {/* 2. CARD: SÍNTESE DA MEDITAÇÃO (REFLEXÃO OBJETIVA) */}
                <div style={{
                  background: darkMode ? 'var(--dark-card, #13121d)' : '#FFFFFF',
                  borderRadius: '24px',
                  padding: '22px 20px',
                  border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--orange-dark)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>Síntese da Meditação</h3>
                  </div>

                  <p style={{
                    fontSize: '0.96rem',
                    lineHeight: '1.75',
                    color: 'var(--text-primary)',
                    margin: '0 0 18px 0',
                    textAlign: 'left'
                  }}>
                    {todaySintese?.sintese}
                  </p>

                  {/* 3. CARD: DESAFIO PRÁTICO PARA AS PRÓXIMAS 24 HORAS */}
                  <div style={{
                    background: darkMode ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5',
                    border: darkMode ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid #A7F3D0',
                    padding: '16px',
                    borderRadius: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#059669' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <strong style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Desafio Prático do Dia:
                      </strong>
                    </div>
                    <p style={{
                      fontSize: '0.92rem',
                      lineHeight: '1.5',
                      color: darkMode ? '#ECFDF5' : '#065F46',
                      margin: 0,
                      fontWeight: '600'
                    }}>
                      {todaySintese?.desafio_pratico}
                    </p>
                  </div>

                  {/* 4. CAIXA: ORAÇÃO DE ENTREGA SINTÉTICA */}
                  {todaySintese?.oracao_sintese && (
                    <div style={{
                      background: darkMode ? 'rgba(249, 115, 22, 0.08)' : '#FFFBEB',
                      border: darkMode ? '1px solid rgba(249, 115, 22, 0.2)' : '1px solid #FDE68A',
                      padding: '16px',
                      borderRadius: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--orange-dark)' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        <strong style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Oração de Alinhamento:
                        </strong>
                      </div>
                      <p style={{
                        fontSize: '0.9rem',
                        fontStyle: 'italic',
                        lineHeight: '1.6',
                        color: darkMode ? '#F1F5F9' : '#78350F',
                        margin: 0
                      }}>
                        "{todaySintese?.oracao_sintese}"
                      </p>
                    </div>
                  )}

                  {/* Botão de Conexão Rápida com a Oração Guiada */}
                  <div style={{ marginTop: '22px' }}>
                    <button
                      onClick={() => {
                        stopNeuralSpeech();
                        setIsNarrating(false);
                        setActiveSabadoBlock('meditacao');
                      }}
                      className="btn-primary"
                      style={{
                        width: '100%',
                        padding: '14px 20px',
                        borderRadius: '16px',
                        fontSize: '0.95rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                      <span>Fazer a Oração Guiada de Hoje</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ORAÇÃO GUIADA */}
            {activeSabadoBlock === 'meditacao' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Barra de Navegação Interna */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <button
                    onClick={() => {
                      if (window.speechSynthesis) window.speechSynthesis.cancel();
                      setMeditationPlaying(false);
                      if (ambientAudioRef.current) ambientAudioRef.current.pause();
                      setActiveSabadoBlock('menu');
                    }}
                    style={{
                      background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                      border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                      borderRadius: '12px',
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    <span>Voltar ao Menu</span>
                  </button>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#8B5CF6' }}>
                    Alinhamento & Blindagem Espiritual
                  </span>
                </div>

                {/* Card Principal da Oração Guiada (Adaptativo Claro / Escuro) */}
                <div style={{
                  background: darkMode
                    ? 'linear-gradient(145deg, #100c22 0%, #191238 60%, #0d0a1b 100%)'
                    : 'linear-gradient(145deg, #FFFFFF 0%, #F5F3FF 50%, #EDE9FE 100%)',
                  padding: '24px 20px',
                  borderRadius: '24px',
                  border: darkMode ? '1px solid rgba(139, 92, 246, 0.25)' : '1.5px solid rgba(139, 92, 246, 0.25)',
                  boxShadow: darkMode ? '0 12px 35px rgba(0,0,0,0.5)' : '0 10px 30px rgba(139, 92, 246, 0.12)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Fundo decorativo animado em Gradiente Líquido */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: darkMode
                      ? 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)'
                      : 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 65%)',
                    animation: meditationPlaying ? 'pulse 8s infinite ease-in-out' : 'none',
                    pointerEvents: 'none',
                    zIndex: 0
                  }} />

                  {/* Ilustração / Vídeo Meditativo */}
                  <div style={{
                    width: '100%',
                    maxWidth: '220px',
                    aspectRatio: '1',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    marginBottom: '18px',
                    boxShadow: darkMode ? '0 8px 30px rgba(0,0,0,0.6)' : '0 8px 24px rgba(139, 92, 246, 0.2)',
                    border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1.5px solid rgba(139, 92, 246, 0.25)',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <video
                      ref={meditationVideoRef}
                      src="/Imagens/oraçãoguiada.mp4"
                      loop
                      muted
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: meditationPlaying ? 'none' : 'grayscale(25%) contrast(95%)',
                        transition: 'filter 0.5s ease'
                      }}
                    />
                  </div>

                  <h3 style={{
                    margin: '0 0 6px 0',
                    fontSize: '1.25rem',
                    fontWeight: '900',
                    color: darkMode ? '#F8FAFC' : '#1E1B4B',
                    zIndex: 1
                  }}>
                    {todayMeditation?.title || `Oração do Dia ${todayDayNumber}`}
                  </h3>

                  <span style={{
                    fontSize: '0.8rem',
                    color: '#8B5CF6',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    marginBottom: '18px',
                    zIndex: 1
                  }}>
                    {todayMeditation?.verse || 'Dia ' + (todayMeditation?.day || todayDayNumber) + ' de 365'}
                  </span>

                  {/* Controle de Progresso */}
                  <div style={{ width: '100%', marginBottom: '20px', zIndex: 1 }}>
                    <div style={{
                      height: '6px',
                      width: '100%',
                      background: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(139, 92, 246, 0.15)',
                      borderRadius: '3px',
                      position: 'relative'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(meditationCurrentTime / (meditationDuration || 1)) * 100}%`,
                        background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
                        borderRadius: '3px',
                        transition: 'width 0.25s linear'
                      }} />
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      color: darkMode ? '#94A3B8' : '#64748B',
                      marginTop: '6px',
                      fontWeight: '600'
                    }}>
                      <span>{formatTime(meditationCurrentTime)}</span>
                      <span>{formatTime(meditationDuration)}</span>
                    </div>
                  </div>

                  {/* Painel de Controles */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', zIndex: 1 }}>
                    {/* Botão de Transcrição / Roteiro */}
                    <button
                      onClick={() => setShowMeditationLyrics(!showMeditationLyrics)}
                      style={{
                        background: showMeditationLyrics
                          ? (darkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)')
                          : (darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                        border: '1.5px solid rgba(139, 92, 246, 0.3)',
                        padding: '10px 16px',
                        borderRadius: '20px',
                        color: darkMode ? '#E2E8F0' : '#4C1D95',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      <span>Roteiro</span>
                    </button>

                    {/* Botão Play/Pause Principal */}
                    <button
                      onClick={toggleMeditationTTS}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                        border: 'none',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 6px 24px rgba(139, 92, 246, 0.45)',
                        transition: 'transform 0.2s',
                        transform: 'scale(1)'
                      }}
                      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {meditationPlaying ? (
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                        </svg>
                      ) : (
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '3px' }}>
                          <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                        </svg>
                      )}
                    </button>

                    {/* Velocidade da Narração */}
                    <button
                      onClick={() => {
                        const rates = [0.75, 0.82, 0.95, 1.05];
                        const nextIndex = (rates.indexOf(narrationRate) + 1) % rates.length;
                        setNarrationRate(rates[nextIndex]);
                        if (meditationPlaying) {
                          stopNeuralSpeech();
                          setMeditationPlaying(false);
                          setTimeout(() => toggleMeditationTTS(), 100);
                        }
                      }}
                      style={{
                        background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                        border: '1.5px solid rgba(139, 92, 246, 0.3)',
                        padding: '10px 14px',
                        borderRadius: '20px',
                        color: darkMode ? '#CBD5E1' : '#4C1D95',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                      title="Velocidade de fala"
                    >
                      {narrationRate === 0.75 ? 'Lento' : narrationRate === 0.82 ? 'Sereno' : narrationRate === 0.95 ? 'Normal' : 'Rápido'}
                    </button>

                    {/* Seletor de Vozes: Francisca e Antônio Lado a Lado */}
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => {
                          const target = 'pt-BR-FranciscaNeural';
                          const changed = meditationVoice !== target;
                          setMeditationVoice(target);
                          if (meditationPlaying && changed) {
                            stopNeuralSpeech();
                            setMeditationPlaying(false);
                            setTimeout(() => toggleMeditationTTS(), 100);
                          }
                        }}
                        style={{
                          background: meditationVoice === 'pt-BR-FranciscaNeural'
                            ? (darkMode ? 'rgba(236, 72, 153, 0.25)' : 'rgba(236, 72, 153, 0.15)')
                            : (darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                          border: meditationVoice === 'pt-BR-FranciscaNeural'
                            ? '1.5px solid #EC4899'
                            : '1.5px solid rgba(255,255,255,0.1)',
                          padding: '8px 12px',
                          borderRadius: '16px',
                          color: meditationVoice === 'pt-BR-FranciscaNeural' ? '#F472B6' : (darkMode ? '#94A3B8' : '#64748B'),
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        title="Voz de Francisca (Serena e Doce)"
                      >
                        <span>Francisca</span>
                        {meditationVoice === 'pt-BR-FranciscaNeural' && <span>✓</span>}
                      </button>

                      <button
                        onClick={() => {
                          const target = 'pt-BR-AntonioNeural';
                          const changed = meditationVoice !== target;
                          setMeditationVoice(target);
                          if (meditationPlaying && changed) {
                            stopNeuralSpeech();
                            setMeditationPlaying(false);
                            setTimeout(() => toggleMeditationTTS(), 100);
                          }
                        }}
                        style={{
                          background: meditationVoice === 'pt-BR-AntonioNeural'
                            ? (darkMode ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)')
                            : (darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                          border: meditationVoice === 'pt-BR-AntonioNeural'
                            ? '1.5px solid #3B82F6'
                            : '1.5px solid rgba(255,255,255,0.1)',
                          padding: '8px 12px',
                          borderRadius: '16px',
                          color: meditationVoice === 'pt-BR-AntonioNeural' ? '#60A5FA' : (darkMode ? '#94A3B8' : '#64748B'),
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        title="Voz de Antônio (Pastoral e Firme)"
                      >
                        <span>Antônio</span>
                        {meditationVoice === 'pt-BR-AntonioNeural' && <span>✓</span>}
                      </button>
                    </div>
                  </div>

                  {/* Som Ambiente de Fundo (Paisagem Sonora) */}
                  <div style={{
                    width: '100%',
                    background: darkMode ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.6)',
                    border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(139, 92, 246, 0.2)',
                    padding: '16px',
                    borderRadius: '18px',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                    zIndex: 1,
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.82rem', color: darkMode ? '#94A3B8' : '#64748B', fontWeight: '800' }}>Paisagem Sonora</span>
                      <span style={{ fontSize: '0.78rem', color: '#8B5CF6', fontWeight: '800' }}>
                        {activeAmbient === 'none' ? 'Silêncio' : activeAmbient === 'chuva' ? 'Chuva de Paz' : activeAmbient === 'mar' ? 'Ondas do Mar' : 'Piano Devocional'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {ambientTracks.map(track => (
                        <button
                          key={track.id}
                          onClick={() => handleSelectAmbient(track.id)}
                          style={{
                            background: activeAmbient === track.id ? '#8B5CF6' : (darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                            border: '1px solid',
                            borderColor: activeAmbient === track.id ? '#8B5CF6' : (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                            borderRadius: '12px',
                            padding: '6px 12px',
                            color: activeAmbient === track.id ? '#FFFFFF' : (darkMode ? '#CBD5E1' : '#475569'),
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {track.label}
                        </button>
                      ))}
                    </div>

                    {activeAmbient !== 'none' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.72rem', color: darkMode ? '#94A3B8' : '#64748B', fontWeight: '600' }}>Volume do Fundo:</span>
                        <input
                          type="range"
                          min="0.05"
                          max="0.4"
                          step="0.05"
                          value={ambientVolume}
                          onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                          style={{ flex: 1, accentColor: '#8B5CF6', cursor: 'pointer' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Mensagem de Conclusão da Oração */}
                  {meditationCompleted && (
                    <div className="animate-fade-in" style={{
                      marginTop: '4px',
                      marginBottom: '16px',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(30, 215, 96, 0.15))',
                      border: '1.5px solid rgba(30, 215, 96, 0.4)',
                      padding: '18px',
                      borderRadius: '18px',
                      zIndex: 1,
                      textAlign: 'center',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: '#1ED760' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#1ED760' }}>
                        Sua oração de blindagem e gratidão foi elevada.
                      </p>
                      <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: darkMode ? '#CBD5E1' : '#334155', lineHeight: '1.5' }}>
                        Agora, qual é o seu pão espiritual a ser compartilhado hoje? Quem você vai alcançar com o seu 1Convite agora?
                      </p>
                    </div>
                  )}

                  {/* Transcrição da Oração Guiada */}
                  {showMeditationLyrics && (
                    <div className="animate-fade-in" style={{
                      padding: '18px',
                      background: darkMode ? 'rgba(0, 0, 0, 0.35)' : '#FFFFFF',
                      border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '18px',
                      width: '100%',
                      textAlign: 'left',
                      boxSizing: 'border-box',
                      zIndex: 1
                    }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', fontWeight: '800', color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Roteiro da Oração do Dia
                      </h4>
                      <p style={{
                        fontSize: '0.92rem',
                        color: darkMode ? '#E2E8F0' : '#334155',
                        lineHeight: '1.8',
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}>
                        {getTodayMeditationPrayerScript()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. O BOTÃO DO DESCANSO */}
            {activeSabadoBlock === 'descanso' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Barra de Navegação Interna */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <button
                    onClick={() => {
                      pararRespiracao();
                      setActiveSabadoBlock('menu');
                    }}
                    style={{
                      background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                      border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                      borderRadius: '12px',
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    <span>Voltar ao Menu</span>
                  </button>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--orange-dark)' }}>
                    Pausa Restauradora & Aquietamento
                  </span>
                </div>

                {/* Card Educativo e Explicativo do Descanso */}
                {!isBreathing && (
                  <div style={{
                    background: darkMode ? 'var(--dark-card, #13121d)' : '#FFFFFF',
                    borderRadius: '24px',
                    padding: '22px 20px',
                    border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'rgba(249, 115, 22, 0.15)',
                        color: 'var(--orange-dark)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 0 1 8 0"/></svg>
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                          Como Funciona o Aquietamento?
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          "Aquietai-vos e sabei que Eu sou Deus." — Salmo 46:10
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 18px 0' }}>
                      Quando você desacelera a respiração de forma rítmica, seu cérebro envia um sinal ao nervo vago, reduzindo o cortisol em minutos, diminuindo a frequência cardíaca e abrindo espaço mental para ouvir a voz de Deus sem a interferência da ansiedade.
                    </p>

                    {/* Explicação e Seleção das 3 Técnicas */}
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                      Escolha a Técnica de Respiração:
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                      {[
                        {
                          id: 'simple',
                          label: 'Micro-Pausa Rápida (4-4-4)',
                          tempo: 'Inspira 4s • Segura 4s • Expira 4s',
                          beneficio: 'Ideal para o meio do dia. Desativa o estresse instantâneo e renova o foco mental.'
                        },
                        {
                          id: 'box',
                          label: 'Box Breathing / Quadrada (4-4-4-4)',
                          tempo: 'Inspira 4s • Segura 4s • Expira 4s • Vazio 4s',
                          beneficio: 'Técnica de alta performance. Neutraliza a ansiedade e traz equilíbrio imediato ao sistema nervoso.'
                        },
                        {
                          id: 'relax',
                          label: 'Relaxamento Profundo (4-7-8)',
                          tempo: 'Inspira 4s • Segura 7s • Expira 8s',
                          beneficio: 'Técnica calmante milenar. Ideal para momentos de angústia, oração noturna e preparo para o sono.'
                        }
                      ].map(t => {
                        const isSelected = breathTechnique === t.id;
                        return (
                          <div
                            key={t.id}
                            onClick={() => setBreathTechnique(t.id)}
                            style={{
                              padding: '14px 16px',
                              borderRadius: '16px',
                              border: '1.5px solid',
                              borderColor: isSelected ? 'var(--orange)' : (darkMode ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
                              background: isSelected
                                ? (darkMode ? 'rgba(249, 115, 22, 0.15)' : '#FFF7ED')
                                : (darkMode ? 'rgba(255,255,255,0.02)' : '#F8FAFC'),
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px'
                            }}
                          >
                            <div style={{
                              width: '18px', height: '18px', borderRadius: '50%',
                              border: isSelected ? '5px solid var(--orange)' : '2px solid var(--text-secondary)',
                              marginTop: '2px',
                              boxSizing: 'border-box'
                            }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                                <strong style={{ fontSize: '0.9rem', color: isSelected ? 'var(--orange-dark)' : 'var(--text-primary)' }}>
                                  {t.label}
                                </strong>
                              </div>
                              <div style={{ fontSize: '0.76rem', color: isSelected ? 'var(--orange)' : 'var(--text-secondary)', fontWeight: '700', marginTop: '2px' }}>
                                {t.tempo}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                                {t.beneficio}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Duração / Ciclos */}
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>
                          Duração do Exercício:
                        </span>
                        <span style={{ fontSize: '0.88rem', color: 'var(--orange-dark)', fontWeight: '800' }}>
                          {breathRounds} Ciclos (~{Math.round(breathRounds * (breathTechnique === 'relax' ? 19 : breathTechnique === 'box' ? 16 : 12))}s)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="15"
                        step="1"
                        value={breathRounds}
                        onChange={(e) => setBreathRounds(parseInt(e.target.value, 10))}
                        style={{ width: '100%', accentColor: 'var(--orange)', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                )}

                {/* Painel Central do Círculo de Respiração (Imersivo) */}
                <div style={{
                  background: darkMode ? 'var(--dark-card, #13121d)' : '#FFFFFF',
                  borderRadius: '24px',
                  padding: '30px 20px',
                  border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  {isBreathing && (
                    <div className="animate-fade-in" style={{ marginBottom: '16px' }}>
                      <span style={{
                        background: darkMode ? 'rgba(249, 115, 22, 0.2)' : '#FFEDD5',
                        color: 'var(--orange-dark)',
                        fontWeight: '800',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '0.82rem'
                      }}>
                        Ciclo {currentRound} de {breathRounds}
                      </span>
                    </div>
                  )}

                  {/* Círculo Interativo com Animação e Estados Suaves */}
                  <div
                    className={`breath-circle ${breathClass}`}
                    onClick={!isBreathing ? iniciarRespiracao : undefined}
                    style={{
                      border: '3px solid',
                      borderColor: isBreathing
                        ? (breathClass === 'inhaling' ? '#3B82F6' : breathClass === 'holding' ? 'var(--orange)' : breathClass === 'holding-empty' ? '#8B5CF6' : '#10B981')
                        : 'var(--orange)',
                      boxShadow: isBreathing
                        ? (breathClass === 'inhaling' ? '0 0 35px rgba(59, 130, 246, 0.35)' : breathClass === 'holding' ? '0 0 35px rgba(249, 115, 22, 0.35)' : '0 0 35px rgba(16, 185, 129, 0.35)')
                        : '0 8px 24px rgba(249, 115, 22, 0.2)',
                      background: !isBreathing
                        ? (darkMode ? 'rgba(249, 115, 22, 0.1)' : '#FFF7ED')
                        : (darkMode ? 'rgba(0,0,0,0.3)' : '#FFFFFF'),
                      cursor: isBreathing ? 'default' : 'pointer',
                      width: '190px',
                      height: '190px',
                      borderRadius: '50%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all 0.5s ease-in-out',
                      position: 'relative'
                    }}
                  >
                    {isBreathing && (
                      <div style={{
                        position: 'absolute',
                        top: -6, left: -6, right: -6, bottom: -6,
                        borderRadius: '50%',
                        border: '2px dashed',
                        borderColor: breathClass === 'inhaling' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(249, 115, 22, 0.5)',
                        animation: 'spin 12s linear infinite',
                        pointerEvents: 'none'
                      }} />
                    )}

                    <span style={{
                      fontSize: '1rem',
                      fontWeight: '900',
                      color: 'var(--text-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      padding: '0 10px'
                    }}>
                      {breathState}
                    </span>

                    {isBreathing && (
                      <span style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--orange-dark)', marginTop: '4px' }}>
                        {breathTimer}s
                      </span>
                    )}

                    {!isBreathing && (
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--orange-dark)', marginTop: '6px' }}>
                        Toque para Começar
                      </span>
                    )}
                  </div>

                  {/* Botões de Ação */}
                  <div style={{ marginTop: '24px', width: '100%', maxWidth: '300px' }}>
                    {isBreathing ? (
                      <button
                        onClick={pararRespiracao}
                        style={{
                          width: '100%',
                          padding: '12px 24px',
                          borderRadius: '16px',
                          fontSize: '0.9rem',
                          fontWeight: '800',
                          border: darkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid #E2E8F0',
                          cursor: 'pointer',
                          background: darkMode ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
                        <span>Parar Exercício</span>
                      </button>
                    ) : (
                      <button
                        onClick={iniciarRespiracao}
                        className="btn-primary"
                        style={{
                          width: '100%',
                          padding: '14px 24px',
                          borderRadius: '16px',
                          fontSize: '0.95rem',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)'
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        <span>Iniciar Respiração Guiada</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. TRILHA TEMÁTICA (30 DIAS) */}
            {activeSabadoBlock === 'trilha' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Barra de Navegação Interna */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <button
                    onClick={() => setActiveSabadoBlock('menu')}
                    style={{
                      background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                      border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                      borderRadius: '12px',
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    <span>Voltar ao Menu</span>
                  </button>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#10B981' }}>
                    Jornada de 30 Dias de Sabedoria
                  </span>
                </div>

                {/* Seletor Rápido de Trilhas (Navegação Instantânea entre as 4) */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                  scrollbarWidth: 'none'
                }}>
                  {['Ansiedade', 'Família', 'Finanças', 'Propósito'].map(tema => {
                    const isCurrent = trilhaAtiva && trilhaAtiva.tema === tema;
                    return (
                      <button
                        key={tema}
                        onClick={() => iniciarTrilha(tema)}
                        style={{
                          flexShrink: 0,
                          padding: '8px 14px',
                          borderRadius: '14px',
                          border: isCurrent ? '1.5px solid #10B981' : (darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E2E8F0'),
                          background: isCurrent
                            ? (darkMode ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5')
                            : (darkMode ? 'rgba(255,255,255,0.04)' : '#FFFFFF'),
                          color: isCurrent ? '#10B981' : 'var(--text-secondary)',
                          fontSize: '0.82rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>Trilha de {tema}</span>
                        {isCurrent && <span style={{ fontSize: '0.7rem', background: '#10B981', color: '#fff', padding: '2px 6px', borderRadius: '8px' }}>Ativa</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Exibição da Trilha Selecionada / Ativa */}
                {trilhaAtiva ? (
                  <div style={{
                    background: darkMode ? 'var(--dark-card, #13121d)' : '#FFFFFF',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {/* Imagem de Topo Temática da Trilha */}
                    <div style={{ width: '100%', height: '150px', position: 'relative' }}>
                      <img
                        src={
                          trilhaAtiva.tema === 'Ansiedade' ? 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=700&q=80' :
                          trilhaAtiva.tema === 'Família' ? 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=700&q=80' :
                          trilhaAtiva.tema === 'Finanças' ? 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=700&q=80' :
                          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=80'
                        }
                        alt={trilhaAtiva.tema}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Trilha Ativa de 30 Dias
                          </span>
                          <h4 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontWeight: '900', color: '#FFFFFF' }}>
                            Trilha de {trilhaAtiva.tema}
                          </h4>
                        </div>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: '800',
                          background: 'rgba(255,255,255,0.2)',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          color: '#FFFFFF',
                          backdropFilter: 'blur(6px)'
                        }}>
                          Dia {trilhaAtiva.dia_progresso}/30
                        </span>
                      </div>
                    </div>

                    {/* Barra de Progresso Visual dos 30 Dias */}
                    <div style={{ padding: '16px 20px 0 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        <span>Progresso da Jornada</span>
                        <span>{Math.round((trilhaAtiva.dia_progresso / 30) * 100)}% Concluído</span>
                      </div>
                      <div style={{ height: '8px', background: darkMode ? 'rgba(255,255,255,0.1)' : '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${(trilhaAtiva.dia_progresso / 30) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>

                    {/* Conteúdo da Lição do Dia */}
                    <div style={{ padding: '20px' }}>
                      {trilhaAtiva.conteudo && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{
                              background: darkMode ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5',
                              color: '#10B981',
                              fontWeight: '800',
                              fontSize: '0.75rem',
                              padding: '4px 10px',
                              borderRadius: '12px'
                            }}>
                              Lição de Hoje
                            </span>
                          </div>

                          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', fontWeight: '900', color: 'var(--text-primary)' }}>
                            {trilhaAtiva.conteudo.titulo}
                          </h3>

                          <div style={{
                            background: darkMode ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                            borderLeft: '4px solid #10B981',
                            padding: '10px 14px',
                            borderRadius: '0 12px 12px 0',
                            marginBottom: '16px'
                          }}>
                            <p style={{ fontStyle: 'italic', margin: 0, fontSize: '0.9rem', color: darkMode ? '#CBD5E1' : '#475569', lineHeight: '1.5' }}>
                              "{trilhaAtiva.conteudo.versiculo}"
                            </p>
                          </div>

                          <p style={{ marginBottom: '18px', fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text-primary)' }}>
                            {trilhaAtiva.conteudo.reflexao}
                          </p>

                          {/* Card Dourado de Ação Prática */}
                          <div style={{
                            background: darkMode ? 'rgba(249, 115, 22, 0.1)' : '#FFFBEB',
                            border: darkMode ? '1.5px solid rgba(249, 115, 22, 0.3)' : '1.5px solid #FDE68A',
                            padding: '16px',
                            marginBottom: '20px',
                            borderRadius: '16px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--orange-dark)' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                              <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Ação Prática do Dia (+15 Chaminhas):
                              </strong>
                            </div>
                            <p style={{ fontSize: '0.92rem', color: darkMode ? '#F1F5F9' : '#78350F', margin: 0, lineHeight: '1.5', fontWeight: '500' }}>
                              {trilhaAtiva.conteudo.acao_pratica}
                            </p>
                          </div>
                        </>
                      )}

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          className="btn-primary"
                          style={{
                            padding: '14px',
                            borderRadius: '14px',
                            flex: 2,
                            fontWeight: '800',
                            fontSize: '0.92rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                          }}
                          onClick={completarDiaTrilha}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>Concluir Ação de Hoje</span>
                        </button>
                        <button
                          className="btn-secondary"
                          style={{
                            padding: '14px',
                            borderRadius: '14px',
                            flex: 1,
                            background: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                            color: '#EF4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            fontWeight: '700',
                            fontSize: '0.85rem'
                          }}
                          onClick={cancelarTrilha}
                        >
                          Abandonar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Painel para Escolher uma das 4 Trilhas */
                  <div style={{
                    background: darkMode ? 'var(--dark-card, #13121d)' : '#FFFFFF',
                    padding: '24px 20px',
                    borderRadius: '24px',
                    border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <h3 style={{ marginBottom: '6px', fontSize: '1.15rem', fontWeight: '900', color: 'var(--text-primary)' }}>
                      Escolha Sua Trilha de Crescimento (30 Dias)
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                      Cada trilha entrega 30 doses diárias de sabedoria teológica aplicada com uma ação prática para transformar sua rotina.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }} className="lp-grid-mobile-single">
                      {[
                        {
                          tema: 'Ansiedade',
                          desc: 'Paz que excede o entendimento. Controle o estresse e descanse em Deus.',
                          icon: (
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          ),
                          color: '#0EA5E9',
                          bg: 'rgba(14, 165, 233, 0.12)',
                          border: 'rgba(14, 165, 233, 0.25)'
                        },
                        {
                          tema: 'Família',
                          desc: 'Harmonia, perdão, autoridade espiritual e laços inabaláveis no seu lar.',
                          icon: (
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          ),
                          color: '#F43F5E',
                          bg: 'rgba(244, 63, 94, 0.12)',
                          border: 'rgba(244, 63, 94, 0.25)'
                        },
                        {
                          tema: 'Finanças',
                          desc: 'Mordomia cristã, prosperidade com propósito e quebra de escassez.',
                          icon: (
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ),
                          color: '#10B981',
                          bg: 'rgba(16, 185, 129, 0.12)',
                          border: 'rgba(16, 185, 129, 0.25)'
                        },
                        {
                          tema: 'Propósito',
                          desc: 'Ativação de chamado, autoridade espiritual e governança para sua vida.',
                          icon: (
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          ),
                          color: '#8B5CF6',
                          bg: 'rgba(139, 92, 246, 0.12)',
                          border: 'rgba(139, 92, 246, 0.25)'
                        }
                      ].map(item => (
                        <div
                          key={item.tema}
                          onClick={() => iniciarTrilha(item.tema)}
                          style={{
                            padding: '18px 16px',
                            borderRadius: '18px',
                            border: `1.5px solid ${item.border}`,
                            background: darkMode ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                          }}
                        >
                          <div style={{
                            width: '42px', height: '42px', borderRadius: '12px',
                            background: item.bg, color: item.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            {item.icon}
                          </div>
                          <div>
                            <strong style={{ fontSize: '0.98rem', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                              Trilha de {item.tema}
                            </strong>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                              {item.desc}
                            </p>
                          </div>
                          <span style={{
                            marginTop: 'auto',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            color: item.color,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            Iniciar 30 Dias →
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ════════════ ABA BÍBLIA ════════════ */}
        {activeTab === 'biblia' && bibleViewMode === 'reading' && (
          <div className="bible-reader page-enter">
            {/* Hero da Bíblia com Paisagem de Pôr do Sol e Player Integrado */}
            <div
              className="page-hero hero-biblia"
              style={{
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: `linear-gradient(180deg, rgba(10, 12, 18, 0.25) 0%, rgba(10, 12, 18, 0.82) 72%, rgba(10, 12, 18, 0.96) 100%), url(${bibliaSunsetBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                paddingBottom: (bibleShowAudioPlayer && bibleAudioUrl) ? '20px' : '28px',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
                <div className="hero-label">Bíblia Sagrada</div>
                <div className="hero-title">{bibleSelectedBook.livro_nome}</div>
                <div className="hero-sub">Capítulo {bibleSelectedChapter}</div>

                {/* Player de Áudio Integrado na Paisagem */}
                {bibleShowAudioPlayer && bibleAudioUrl && (
                  <div
                    className="player-container"
                    style={{
                      marginTop: '16px',
                      padding: '10px 14px',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'rgba(12, 14, 20, 0.58)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      borderRadius: '16px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
                    }}
                  >
                    <audio
                      ref={bibleAudioRef}
                      src={bibleAudioUrl}
                      preload="metadata"
                      onTimeUpdate={onBibleAudioTimeUpdate}
                      onLoadedMetadata={onBibleAudioLoadedMetadata}
                      onError={() => {
                        console.warn('[Audio] Falha ao carregar narração, aplicando música instrumental suave...');
                        if (bibleAudioUrl !== '/piano.mp3') {
                          setBibleAudioUrl('/piano.mp3');
                          if (bibleAudioPlaying && bibleAudioRef.current) {
                            setTimeout(() => bibleAudioRef.current?.play().catch(() => {}), 200);
                          }
                        }
                      }}
                      onEnded={() => {
                        markChapterAsRead(bibleSelectedBook.livro_abrev, bibleSelectedChapter);
                        setBibleAudioPlaying(false);
                      }}
                    />
                    <button
                      className="play-btn"
                      style={{ width: '46px', height: '46px', flexShrink: 0, background: '#10B981', color: '#052E16' }}
                      onClick={() => setBibleAudioPlaying(!bibleAudioPlaying)}
                      aria-label={bibleAudioPlaying ? 'Pausar áudio' : 'Ouvir capítulo'}
                    >
                      {bibleAudioPlaying
                        ? <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" /></svg>
                        : <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '2px' }}><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" /></svg>
                      }
                    </button>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div className="progress-bar-container" onClick={handleBibleAudioProgressBarClick} style={{ height: '5px', background: 'rgba(255,255,255,0.22)' }}>
                        <div className="progress-bar-fill" style={{ width: `${(bibleAudioCurrentTime / (bibleAudioDuration || 1)) * 100}%`, background: '#34D399' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: '600', color: 'rgba(255,255,255,0.85)' }}>
                        <span>{formatTime(bibleAudioCurrentTime)}</span>
                        <span>{formatTime(bibleAudioDuration)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fundos Sonoros de Paz na Bíblia Sagrada (Chuva, Ondas, Piano) */}
                <div
                  style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    background: 'rgba(12, 14, 20, 0.45)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'rgba(255,255,255,0.75)', marginRight: '2px' }}>
                      Fundo:
                    </span>
                    {[
                      { id: 'none', label: 'Silêncio' },
                      { id: 'chuva', label: 'Chuva' },
                      { id: 'mar', label: 'Ondas' },
                      { id: 'piano', label: 'Piano' },
                    ].map((tr) => (
                      <button
                        key={tr.id}
                        type="button"
                        onClick={() => handleSelectAmbient(tr.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: '1px solid',
                          fontSize: '0.72rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          background: activeAmbient === tr.id ? '#10B981' : 'rgba(255,255,255,0.06)',
                          borderColor: activeAmbient === tr.id ? '#10B981' : 'rgba(255,255,255,0.12)',
                          color: activeAmbient === tr.id ? '#052E16' : '#E2E8F0',
                        }}
                      >
                        {tr.label}
                      </button>
                    ))}
                  </div>
                  {activeAmbient !== 'none' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Vol</span>
                      <input
                        type="range"
                        min="0.05"
                        max="0.6"
                        step="0.05"
                        value={ambientVolume}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setAmbientVolume(val);
                          if (ambientAudioRef.current) ambientAudioRef.current.volume = val;
                        }}
                        style={{ width: '68px', accentColor: '#10B981', cursor: 'pointer' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {bibleResults.length > 0 ? (
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3>Resultados ({bibleResults.length})</h3>
                  <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.82rem' }} onClick={() => { setBibleResults([]); setBibleSearchQuery(''); }}>Limpar</button>
                </div>
                {bibleResults.map((v, idx) => (
                  <div key={idx} className="glass-panel" style={{ position: 'relative', paddingTop: '42px' }}>
                    <span className="section-chip" style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '0.62rem' }}>
                      {v.livro_nome} {v.capitulo}:{v.versiculo}
                    </span>
                    <p style={{ fontStyle: 'italic', lineHeight: '1.80', fontSize: '1rem' }}>"{formatVerseText(v.texto)}"</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                      <button className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }} onClick={() => copyToClipboard(`"${v.texto}" - ${v.livro_nome} ${v.capitulo}:${v.versiculo}`)}>
                        Copiar
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`*"${v.texto}"*\n_${v.livro_nome} ${v.capitulo}:${v.versiculo}_\n\n*1Convite:* https://1convite.com.br`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ flex: 2, padding: '10px', textAlign: 'center', textDecoration: 'none' }}
                      >
                        Enviar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {bibleLoading ? (
                  <div style={{ padding: '44px 20px' }}>
                    <ChamaLoader size={56} label={`Carregando ${bibleSelectedBook?.livro_nome || 'Bíblia'} ${bibleSelectedChapter}...`} />
                  </div>
                ) : (
                  <div style={{ padding: '16px 20px 0' }}>
                    {bibleVerses.map(v => {
                      const key = `${bibleSelectedBook.livro_abrev}-${bibleSelectedChapter}-${v.versiculo}`;
                      const highlightColor = bibleHighlights[key];
                      const comment = bibleComments[key];
                      return (
                        <div
                          key={v.id || v.versiculo}
                          className={`bible-verse-row${(bibleSelectedVerse?.id === v.id || bibleSelectedVerse?.versiculo === v.versiculo) ? ' selected' : ''}`}
                          onClick={() => setBibleSelectedVerse((bibleSelectedVerse?.id === v.id || bibleSelectedVerse?.versiculo === v.versiculo) ? null : v)}
                          style={{
                            backgroundColor: highlightColor || undefined,
                            borderRadius: highlightColor ? '8px' : '0',
                            padding: highlightColor ? '8px 10px' : '6px 0',
                            margin: highlightColor ? '4px 0' : '0',
                            transition: 'all 0.2s',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'flex-start'
                          }}
                        >
                          <span className="bible-verse-num" style={{ flexShrink: 0, fontWeight: '700', fontSize: '0.85rem', color: 'var(--orange)' }}>
                            {v.versiculo}
                          </span>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ lineHeight: '1.75', fontSize: '1.02rem', color: 'var(--text-primary)' }}>
                              {formatVerseText(v.texto)}
                            </span>
                            {comment && (
                              <div style={{
                                padding: '6px 10px',
                                background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                                borderRadius: '8px',
                                borderLeft: '3px solid var(--orange)',
                                fontSize: '0.82rem',
                                color: 'var(--text-secondary)',
                                marginTop: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                <span>{comment}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {/* Botão de Próximo Capítulo com Recompensa */}
                    {bibleVerses.length > 0 && (
                      <button
                        onClick={() => {
                          setUserCoins(prev => {
                            const val = prev + 10;
                            localStorage.setItem('app-coins', val);
                            return val;
                          });
                          setRewardPopup({ amount: 10, title: 'Capítulo Concluído!', message: 'Amém! Você meditou na Palavra e seu coração foi aquecido.' });
                          setBibleSelectedChapter(prev => prev + 1);
                        }}
                        style={{
                          width: '100%',
                          marginTop: '20px',
                          padding: '16px',
                          background: 'rgba(245,158,11,0.1)',
                          border: '1px dashed var(--orange)',
                          color: 'var(--orange)',
                          borderRadius: '16px',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        Concluir Capítulo (+10 Chamas)
                      </button>
                    )}
                  </div>
                )}
 
                {!bibleSelectedVerse && (
                  <div style={{ padding: '28px 20px', marginTop: '20px', borderTop: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)' }}>
                    <form onSubmit={searchBible} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                      <input type="text" className="input-field" placeholder="Buscar versículo (ex: amor, fé)..." value={bibleSearchQuery} onChange={e => setBibleSearchQuery(e.target.value)} />
                      <button type="submit" className="btn-secondary" disabled={bibleLoading} style={{ flexShrink: 0, padding: '0 16px' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
                    </form>
                    {bibleError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{bibleError}</p>}
                    <button className="btn-orange-outline" onClick={getRandomVerse}>Versículo Aleatório</button>
                  </div>
                )}
              </>
            )}
 
            {/* Menu flutuante de versículo selecionado */}
            {bibleSelectedVerse && bibleResults.length === 0 && (
              <div 
                className="bible-action-menu-panel animate-slide-up"
                style={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: darkMode ? '#1c1c1e' : '#ffffff',
                  borderTop: '1px solid var(--slate-border)',
                  boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
                  padding: '16px 20px',
                  zIndex: 100,
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxSizing: 'border-box'
                }}
              >
                {/* Fileira 1: Botões de Ação */}
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Versículo Bíblico',
                          text: `"${bibleSelectedVerse.texto}" - ${bibleSelectedBook.livro_nome} ${bibleSelectedChapter}:${bibleSelectedVerse.versiculo}`
                        });
                      } else {
                        copyToClipboard(`"${bibleSelectedVerse.texto}" - ${bibleSelectedBook.livro_nome} ${bibleSelectedChapter}:${bibleSelectedVerse.versiculo}`);
                      }
                    }}
                    style={{ flex: 1, padding: '10px 4px', fontSize: '0.82rem', fontWeight: 'bold', borderRadius: '12px', border: '1px solid var(--slate-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    Compartilhar
                  </button>
                  <button 
                    onClick={() => {
                      alert('Link de compartilhamento copiado!');
                      copyToClipboard(`"${bibleSelectedVerse.texto}" - ${bibleSelectedBook.livro_nome} ${bibleSelectedChapter}:${bibleSelectedVerse.versiculo}`);
                    }}
                    style={{ flex: 1, padding: '10px 4px', fontSize: '0.82rem', fontWeight: 'bold', borderRadius: '12px', border: '1px solid var(--slate-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    Imagem
                  </button>
                  <button 
                    onClick={() => {
                      setCommentText(bibleComments[`${bibleSelectedBook.livro_abrev}-${bibleSelectedChapter}-${bibleSelectedVerse.versiculo}`] || '');
                      setCommentModalOpen(true);
                    }}
                    style={{ flex: 1, padding: '10px 4px', fontSize: '0.82rem', fontWeight: 'bold', borderRadius: '12px', border: '1px solid var(--slate-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    Comentário
                  </button>
                  <button 
                    onClick={() => {
                      copyToClipboard(`"${bibleSelectedVerse.texto}" - ${bibleSelectedBook.livro_nome} ${bibleSelectedChapter}:${bibleSelectedVerse.versiculo}`);
                    }}
                    style={{ flex: 1, padding: '10px 4px', fontSize: '0.82rem', fontWeight: 'bold', borderRadius: '12px', border: '1px solid var(--slate-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}
                  >
                    Copiar
                  </button>
                </div>

                {/* Fileira 2: Círculos Coloridos de Destaque */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', padding: '0 8px' }}>
                  {[
                    { id: 'clear', color: 'transparent', dotColor: '#2c2c2e', label: '✕', isClear: true },
                    { id: 'blue', color: 'rgba(59, 130, 246, 0.22)', dotColor: '#3b82f6' },
                    { id: 'purple', color: 'rgba(139, 92, 246, 0.22)', dotColor: '#8b5cf6' },
                    { id: 'gray', color: 'rgba(107, 114, 128, 0.22)', dotColor: '#6b7280' },
                    { id: 'teal', color: 'rgba(20, 184, 166, 0.22)', dotColor: '#14b8a6' },
                    { id: 'green', color: 'rgba(34, 197, 94, 0.22)', dotColor: '#22c55e' },
                    { id: 'orange', color: 'rgba(249, 115, 22, 0.22)', dotColor: '#f97316' }
                  ].map(colorOpt => {
                    const key = `${bibleSelectedBook.livro_abrev}-${bibleSelectedChapter}-${bibleSelectedVerse.versiculo}`;
                    const currentHighlight = bibleHighlights[key];
                    const isSelected = colorOpt.isClear ? !currentHighlight : currentHighlight === colorOpt.color;

                    return (
                      <button
                        key={colorOpt.id}
                        onClick={() => {
                          const newHighlights = { ...bibleHighlights };
                          if (colorOpt.isClear) {
                            delete newHighlights[key];
                          } else {
                            newHighlights[key] = colorOpt.color;
                          }
                          setBibleHighlights(newHighlights);
                          localStorage.setItem('bible-highlights', JSON.stringify(newHighlights));
                        }}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: colorOpt.isClear ? (darkMode ? '#2c2c2e' : '#f4f4f5') : colorOpt.dotColor,
                          border: isSelected ? '3px solid var(--orange)' : '2px solid transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: colorOpt.isClear ? '#ef4444' : '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          padding: 0,
                          boxSizing: 'border-box'
                        }}
                      >
                        {colorOpt.isClear && '✕'}
                      </button>
                    );
                  })}
                </div>

                {/* Salvar */}
                <button
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.95rem' }}
                  onClick={() => setBibleSelectedVerse(null)}
                >
                  Salvar
                </button>
              </div>
            )}

            {/* Botão Flutuante Seletor de Livros (≡) */}
            <button
              onClick={() => setBibleViewMode(bibleViewMode === 'select-book' ? 'reading' : 'select-book')}
              style={{
                position: 'fixed',
                bottom: bibleSelectedVerse ? '215px' : '88px',
                right: '24px',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                zIndex: 90,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              title="Lista de Livros/Capítulos"
            >
              ☰
            </button>

            {/* Botão Flutuante: Marcar Capítulo como Lido */}
            {!bibleSelectedVerse && (() => {
              const alreadyRead = isChapterRead(bibleSelectedBook.livro_abrev, bibleSelectedChapter);
              return (
                <button
                  onClick={() => markChapterAsRead(bibleSelectedBook.livro_abrev, bibleSelectedChapter, !alreadyRead)}
                  style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    height: '52px',
                    padding: '0 18px',
                    borderRadius: '26px',
                    backgroundColor: alreadyRead ? 'rgba(34,197,94,0.15)' : '#22c55e',
                    color: alreadyRead ? '#22c55e' : '#fff',
                    border: alreadyRead ? '1.5px solid rgba(34,197,94,0.4)' : 'none',
                    boxShadow: alreadyRead ? 'none' : '0 4px 14px rgba(34,197,94,0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    zIndex: 90,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  title={alreadyRead ? 'Capítulo já lido – clique para desmarcar' : 'Marcar capítulo como lido'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {alreadyRead ? 'Lido' : 'Marcar como Lido'}
                </button>
              );
            })()}
          </div>
        )}

        {/* ════════════ ABA CONTATOS ════════════ */}
        {activeTab === 'contatos' && (
          <div className="page-enter">
            {/* Hero */}
            <div className="page-hero hero-contatos">
              <div className="hero-orb" style={{ width: 200, height: 200, top: -40, left: -40, background: 'rgba(249,115,22,0.15)' }} />
              <div className="hero-content">
                <div className="hero-label">Mateus 24:14</div>
                <div className="hero-title">Meus Próximos</div>
                <div className="hero-sub">{contatos.length} {contatos.length === 1 ? 'pessoa' : 'pessoas'} no seu círculo de influência</div>
              </div>
            </div>

            <div className="page-content" style={{ paddingTop: '4px' }}>
              {/* Alertas */}
              {contatos.filter(verificarAlerta48h).map(c => (
                <div key={`alert-${c.id}`} className="glass-panel" style={{ padding: '14px 18px', marginBottom: '12px', borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(254,242,242,0.80)' }}>
                  <p style={{ color: '#dc2626', fontWeight: '600', fontSize: '0.9rem' }}>
                    Aviso: Você tem notado <strong>{c.nome}</strong> ({c.relacao})? Já se passaram 48h.
                  </p>
                </div>
              ))}

              {/* Botão adicionar */}
              <button
                className={showAddContato ? 'btn-secondary' : 'btn-primary'}
                style={{ marginBottom: '16px' }}
                onClick={() => setShowAddContato(!showAddContato)}
              >
                {showAddContato ? 'Fechar Formulário' : '+ Adicionar Próximo'}
              </button>

              {/* Form */}
              {showAddContato && (
                <form onSubmit={handleAddContato} className="glass-panel" style={{ marginBottom: '16px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Novo Contato</h3>
                  {contatoErro && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{contatoErro}</p>}
                  <div className="input-group">
                    <label>Nome Completo</label>
                    <input type="text" className="input-field" value={newNome} onChange={e => setNewNome(e.target.value)} placeholder="Ex: Maria da Silva" required />
                  </div>
                  <div className="input-group">
                    <label>Relação / Vínculo</label>
                    <input type="text" className="input-field" value={newRelacao} onChange={e => setNewRelacao(e.target.value)} placeholder="Ex: Família, Vizinho, Trabalho" required />
                  </div>
                  <div className="input-group">
                    <label className="checkbox-label">
                      <input type="checkbox" checked={newPrioritario} onChange={e => setNewPrioritario(e.target.checked)} />
                      <span>Contato Prioritário <span style={{ color: '#A8A29E', fontSize: '0.85rem' }}>(alerta a cada 48h)</span></span>
                    </label>
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '4px' }}>Salvar no Reino</button>
                </form>
              )}

              {/* Lista */}
              {contatos.length === 0 && !showAddContato ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', margin: '24px 0', padding: '0 12px' }}>
                  <ChaminhaVideo size={80} style={{ flexShrink: 0 }} />
                  <div className="glass-panel animate-fade-in" style={{
                    padding: '12px 18px',
                    borderRadius: '16px',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    position: 'relative',
                    maxWidth: '360px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    textAlign: 'left'
                  }}>
                    <div style={{
                      position: 'absolute', top: '50%', left: '-6px', transform: 'translateY(-50%) rotate(45deg)',
                      width: '10px', height: '10px', background: 'var(--bg-app)', borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)', zIndex: 1
                    }} />
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sp-green, #1ED760)" strokeWidth="2" style={{display:"inline-block", verticalAlign:"middle", marginRight:4}}><path d="M12 2c1.1 4 4.5 6 4.5 10a6.5 6.5 0 0 1-13 0c0-4 3.4-6 4.5-10 1 2 2.5 3 4 0z"/></svg> <strong>Chaminha:</strong> "Nenhum Próximo adicionado ainda! Adicione pessoas do seu convívio diário aqui para começar a notá-las e interagir com intenção!"
                  </div>
                </div>
              ) : (
                contatos.map(c => (
                  <div key={c.id} className="glass-panel" style={{ marginBottom: '12px', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #FB923C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem', color: '#fff', flexShrink: 0 }}>
                          {c.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {c.nome}
                            {c.prioritario && <span className="section-chip" style={{ fontSize: '0.60rem' }}>⭐ Prior.</span>}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#78716C', marginTop: '2px' }}>{c.relacao}</div>
                        </div>
                      </div>
                      <button onClick={() => deletarContato(c.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '1.1rem', padding: '4px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: '0.75rem', color: '#A8A29E' }}>
                        Último: {c.ultimo_convite_timestamp > 0 ? new Date(c.ultimo_convite_timestamp).toLocaleDateString('pt-BR') : 'Nunca'}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '10px' }} onClick={() => registrarAcao(c.id, 'mensagem')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>
                        <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '10px' }} onClick={() => registrarAcao(c.id, 'cafe')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg></button>
                        <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '10px' }} onClick={() => registrarAcao(c.id, 'casa_igreja')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {user?.status_plano === 'FREE' && contatos.length >= 3 && (
                <div className="glass-panel orange-card" style={{ textAlign: 'center', marginTop: '8px' }}>
                  <p style={{ marginBottom: '14px', fontWeight: '500' }}>Limite de 3 contatos no plano gratuito.</p>
                  <button className="btn-primary" onClick={() => setActiveTab('upgrade')}>Desbloquear Ilimitados</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════ ABA HISTÓRICO ════════════ */}
        {activeTab === 'historico' && (
          <div className="page-enter">
            <div className="page-hero hero-contatos" style={{ background: 'linear-gradient(135deg, #475569 0%, #64748B 100%)' }}>
              <div className="hero-content">
                <div className="hero-label">Jornada</div>
                <div className="hero-title">Histórico de Códigos</div>
                <div className="hero-sub">Mural de revelações da sua caminhada</div>
              </div>
            </div>

            <div className="page-content" style={{ paddingTop: '4px' }}>
              {user?.status_plano === 'FREE' ? (
                <div className="premium-lock-card" style={{ padding: '36px 24px' }}>
                  <div className="premium-lock-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                  <h4 style={{ margin: '8px 0 4px 0', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Mural Completo de Códigos</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>Acesse a linha do tempo completa de todas as suas revelações e códigos diários destravados.</p>
                  <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem', width: 'auto' }} onClick={() => setActiveTab('upgrade')}>Destravar Histórico</button>
                </div>
              ) : (
                <>
                  <input type="text" className="input-field" placeholder="Pesquisar código, versículo..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ marginBottom: '16px' }} />
                  {historico
                    .filter(item => item.codigo_verbal.toLowerCase().includes(searchQuery.toLowerCase()) || item.versiculo_chave.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(item => (
                      <div key={item.dia_id} className="glass-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span className="section-chip" style={{ fontSize: '0.68rem' }}>Dia {item.dia_id}</span>
                          <span style={{ fontSize: '0.72rem', color: '#A8A29E', fontWeight: '600' }}>{item.pilar_origem?.replace('_', ' ')}</span>
                        </div>
                        <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>{item.codigo_verbal}</h3>
                        <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#78716C' }}>{item.versiculo_chave}</p>
                      </div>
                    ))}
                  {historico.length === 0 && (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <div style={{ display:"flex", justifyContent:"center", marginBottom: "10px" }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                      <p>Nenhum código registrado ainda. Complete mais dias!</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ════════════ ABA LAYA • SABEDORIA BÍBLICA & ORÁCULO ════════════ */}
        {activeTab === 'chat' && (
          <div className="page-enter flex-column" style={{ height: 'calc(100vh - 76px)', overflowY: 'auto', padding: '16px', boxSizing: 'border-box', paddingBottom: '90px' }}>
            
            {/* Top Selector: Oráculo vs Mentores */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'inline-flex',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '30px',
                padding: '4px',
                border: '1px solid var(--slate-border)'
              }}>
                <button
                  onClick={() => setLayaSubTab('mentores')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    background: layaSubTab === 'mentores' ? 'var(--orange)' : 'transparent',
                    color: layaSubTab === 'mentores' ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                >
                  Mentores Bíblicos
                </button>
                <button
                  onClick={() => { setLayaSubTab('oraculo'); setActiveCounselor(null); }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    background: layaSubTab === 'oraculo' ? 'var(--orange)' : 'transparent',
                    color: layaSubTab === 'oraculo' ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                >
                  Discernimento Bíblico
                </button>
              </div>

              {/* Saldo de Moedas */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(245,158,11,0.12)',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid var(--orange)'
              }}>
                <ChaminhaCoin size={20} />
                <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--orange)' }}>{userCoins}</span>
              </div>
            </div>

            {/* ──────── SUB-ABA 1: ORÁCULO BÍBLICO (BUSCA POR VIDA) ──────── */}
            {layaSubTab === 'oraculo' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Hero / Introdução */}
                <div className="glass-panel" style={{
                  padding: '20px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(5,150,105,0.02) 100%)',
                  border: '1px solid var(--slate-border)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', background: 'var(--orange)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: '800' }}>
                      Discernimento Bíblico
                    </h3>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Apresente a sua situação, angústia ou dúvida. Encontre a tríade bíblica em frações de segundo: promessa, oração e ação fundamentadas nas Escrituras.
                  </p>
                </div>

                {/* Input de Busca Semântica */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLayaConsultar(layaOraculoQuery);
                  }}
                  style={{ display: 'flex', gap: '8px' }}
                >
                  <input
                    type="text"
                    className="chat-input-field"
                    placeholder="Ex: Estou com medo do futuro, com dívidas, briga no lar..."
                    value={layaOraculoQuery}
                    onChange={(e) => setLayaOraculoQuery(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '14px 16px',
                      borderRadius: '16px',
                      border: '1px solid var(--slate-border)',
                      background: 'var(--white)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={layaSearching}
                    style={{
                      padding: '0 20px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {layaSearching ? 'Consultando...' : 'Consultar'}
                  </button>
                </form>

                {/* Chips de Categorias de Vida */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                  scrollbarWidth: 'none'
                }}>
                  {[
                    { id: 'TODOS', label: 'Todos os Temas' },
                    { id: 'EMOCAO', label: 'Emoções & Medo' },
                    { id: 'VIDA_PRATICA', label: 'Finanças & Trabalho' },
                    { id: 'RELACIONAMENTO', label: 'Casamento & Família' },
                    { id: 'ESPIRITUAL', label: 'Propósito & Fé' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setLayaActiveCategory(cat.id);
                        handleLayaConsultar(layaOraculoQuery, cat.id);
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: layaActiveCategory === cat.id ? 'var(--orange)' : 'var(--slate-border)',
                        background: layaActiveCategory === cat.id ? 'rgba(16,185,129,0.15)' : 'transparent',
                        color: layaActiveCategory === cat.id ? 'var(--orange)' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Grid de Atalhos de Situações Reais */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {LAYA_TEMAS_ORACULO
                    .filter(t => layaActiveCategory === 'TODOS' || t.categoria === layaActiveCategory)
                    .map(tema => (
                      <div
                        key={tema.slug}
                        onClick={() => handleSelectLayaTheme(tema.slug)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '14px',
                          border: layaSelectedThemeSlug === tema.slug ? '1.5px solid var(--orange)' : '1px solid var(--slate-border)',
                          background: layaSelectedThemeSlug === tema.slug ? 'rgba(16,185,129,0.08)' : 'var(--white)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {tema.titulo}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {tema.versiculo_chave}
                        </span>
                      </div>
                    ))}
                </div>

                {/* CARD DE RESPOSTA DO ORÁCULO LAYA */}
                {layaOraculoResult && layaOraculoResult.resultado && (
                  <div className="glass-panel" style={{
                    padding: '24px 20px',
                    borderRadius: '20px',
                    border: '1.5px solid var(--orange)',
                    background: 'var(--white)',
                    boxShadow: 'var(--shadow-md)',
                    marginTop: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px'
                  }}>
                    {/* Header do Card */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-border)', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: 'var(--orange-light)', color: 'var(--orange)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase' }}>
                          Revelação Bíblica
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {layaOraculoResult.resultado.categoria}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleCopyLayaConselho(
                          `${layaOraculoResult.resultado.versiculo_chave}\n\n"${layaOraculoResult.resultado.promessa_biblica}"\n\nDIRECIONAMENTO BÍBLICO:\n${layaOraculoResult.resultado.direcionamento_laya}\n\nORAÇÃO:\n${layaOraculoResult.resultado.oracao_resposta}\n\nAÇÃO:\n${layaOraculoResult.resultado.acao_pratica}`
                        )}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: layaCopied ? 'var(--orange)' : 'var(--text-secondary)',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {layaCopied ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>

                    {/* Versículo Âncora */}
                    <div style={{
                      background: 'rgba(16,185,129,0.06)',
                      padding: '16px',
                      borderRadius: '16px',
                      borderLeft: '4px solid var(--orange)'
                    }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Versículo Âncora: {layaOraculoResult.resultado.versiculo_chave}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: '600', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.5' }}>
                        "{layaOraculoResult.resultado.promessa_biblica}"
                      </p>
                    </div>

                    {/* Direcionamento LAYA */}
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Sabedoria & Direcionamento
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {layaOraculoResult.resultado.direcionamento_laya}
                      </p>
                    </div>

                    {/* Oração de Poder */}
                    <div style={{
                      background: 'var(--slate-light)',
                      padding: '16px',
                      borderRadius: '16px',
                      border: '1px solid var(--slate-border)'
                    }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Oração de Alinhamento
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', fontStyle: 'italic' }}>
                        "{layaOraculoResult.resultado.oracao_resposta}"
                      </p>
                    </div>

                    {/* Ação Prática de Hoje */}
                    <div style={{
                      background: 'rgba(245,158,11,0.08)',
                      padding: '14px 16px',
                      borderRadius: '16px',
                      border: '1px solid rgba(245,158,11,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--orange)', textTransform: 'uppercase' }}>
                          Ação Prática de Hoje
                        </div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                          {layaOraculoResult.resultado.acao_pratica}
                        </div>
                      </div>
                    </div>

                    {/* Atalho para o Mentor Recomendado */}
                    {layaOraculoResult.mentorSugerido && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '8px',
                        borderTop: '1px solid var(--slate-border)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={layaOraculoResult.mentorSugerido.avatar}
                            alt={layaOraculoResult.mentorSugerido.nome}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mentor Bíblico Recomendado:</div>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{layaOraculoResult.mentorSugerido.nome}</strong>
                          </div>
                        </div>

                        <button
                          className="btn-secondary"
                          onClick={() => {
                            setLayaSubTab('mentores');
                            setActiveCounselor(layaOraculoResult.mentorSugerido.id);
                          }}
                          style={{ padding: '8px 14px', fontSize: '0.8rem', borderRadius: '12px' }}
                        >
                          Ver Mentoria →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ──────── SUB-ABA 2: MENTORES DE FÉ CANÔNICOS ──────── */}
            {layaSubTab === 'mentores' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {!activeCounselor ? (
                  <>
                    <div style={{ marginBottom: '4px' }}>
                      <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 4px 0', fontWeight: '800' }}>
                        Escolha seu Mentor Bíblico
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0 }}>
                        Conselhos fundamentados nas Escrituras Sagradas.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                      {LAYA_MENTORES.map(mentor => {
                        const isUnlocked = unlockedCounselors.includes(mentor.id);
                        return (
                          <div
                            key={mentor.id}
                            className="dashboard-card"
                            style={{
                              position: 'relative',
                              padding: '18px 12px 14px',
                              borderRadius: '20px',
                              border: isUnlocked ? '1px solid var(--slate-border)' : '1px dashed var(--slate-border)',
                              opacity: isUnlocked ? 1 : 0.9,
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              textAlign: 'center',
                              gap: '10px',
                              background: 'var(--white)',
                              boxShadow: 'var(--shadow-sm)',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => {
                              if (isUnlocked) {
                                setActiveCounselor(mentor.id);
                              } else {
                                handleUnlockLayaMentor(mentor);
                              }
                            }}
                          >
                            {!isUnlocked && (
                              <div style={{
                                position: 'absolute', top: 10, right: 10,
                                background: 'var(--orange)', color: '#fff',
                                padding: '2px 8px', borderRadius: '10px',
                                fontSize: '0.7rem', fontWeight: '800',
                                display: 'flex', alignItems: 'center', gap: '3px'
                              }}>
                                <span>{mentor.preco_desbloqueio}</span>
                                <ChaminhaCoin size={12} />
                              </div>
                            )}

                            <div style={{
                              width: '68px',
                              height: '68px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              border: '2px solid var(--orange)',
                              boxShadow: '0 4px 12px rgba(249,115,22,0.2)',
                              flexShrink: 0
                            }}>
                              <img
                                src={mentor.avatar}
                                alt={mentor.nome}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>

                            <div style={{ width: '100%' }}>
                              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '800', lineHeight: 1.2 }}>
                                {mentor.nome}
                              </strong>
                              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginTop: '3px' }}>
                                {mentor.titulo}
                              </span>
                            </div>

                            <button
                              style={{
                                width: '100%',
                                minHeight: '44px',
                                padding: '8px 10px',
                                borderRadius: '12px',
                                border: 'none',
                                background: isUnlocked ? 'var(--orange)' : 'var(--slate-light)',
                                color: isUnlocked ? '#fff' : 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                              <span>{isUnlocked ? 'Conversar' : 'Desbloquear'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  /* ── VISUALIZAÇÃO DO MENTOR SELECIONADO ── */
                  (() => {
                    const currentMentor = LAYA_MENTORES.find(m => m.id === activeCounselor) || LAYA_MENTORES[0];
                    const mentorConselhos = LAYA_CONSELHOS.filter(c => c.mentor_id === currentMentor.id);
                    const conselhoAtivo = mentorConselhos.find(c => c.tema === layaMentorTheme) || mentorConselhos[0] || LAYA_CONSELHOS[0];
                    const chatHistoryList = mentorChatHistory[currentMentor.id] || [
                      { id: 'welcome', sender: 'mentor', text: currentMentor.saudacao_chat, time: 'Início' }
                    ];

                    return (
                      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        {/* Barra Superior de Navegação */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <button
                            onClick={() => setActiveCounselor(null)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--orange)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 0',
                              fontSize: '0.92rem',
                              fontWeight: '700'
                            }}
                          >
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                            Voltar aos Mentores
                          </button>
                          
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                            {currentMentor.periodo}
                          </span>
                        </div>

                        {/* ══ 1. TOPO / PARTE SUPERIOR: HERO DO MENTOR COM FOTO DESTACADA ══ */}
                        <div className="glass-panel" style={{
                          padding: '24px 20px',
                          borderRadius: '24px',
                          background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(245,158,11,0.03) 100%)',
                          border: '1.5px solid var(--orange)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          gap: '14px',
                          boxShadow: 'var(--shadow-md)',
                          position: 'relative'
                        }}>
                          {/* Imagem do Mentor na Parte Superior */}
                          <div style={{
                            width: '92px',
                            height: '92px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '3.5px solid var(--orange)',
                            boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
                            flexShrink: 0
                          }}>
                            <img
                              src={currentMentor.avatar}
                              alt={currentMentor.nome}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>

                          <div>
                            <span style={{
                              display: 'inline-block',
                              background: 'var(--orange)',
                              color: '#fff',
                              fontSize: '0.72rem',
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              padding: '3px 10px',
                              borderRadius: '12px',
                              marginBottom: '6px'
                            }}>
                              {currentMentor.titulo}
                            </span>
                            <h2 style={{ margin: '2px 0 6px 0', fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '800' }}>
                              {currentMentor.nome}
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', maxWidth: '460px' }}>
                              "{currentMentor.frase_destaque}"
                            </p>
                          </div>
                        </div>

                        {/* ══ 2. PERFIL ROBUSTO: QUEM FOI & PILARES DE SABEDORIA ══ */}
                        <div className="glass-panel" style={{
                          padding: '20px',
                          borderRadius: '20px',
                          border: '1px solid var(--slate-border)',
                          background: 'var(--white)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px'
                        }}>
                          <div>
                            <h3 style={{ margin: '0 0 6px 0', fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                              Quem Foi & Trajetória Bíblica
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                              {currentMentor.biografia}
                            </p>
                            {currentMentor.contexto_historico && (
                              <p style={{ margin: '8px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.45', fontStyle: 'italic' }}>
                                Contexto Histórico: {currentMentor.contexto_historico}
                              </p>
                            )}
                          </div>

                          {/* 3 Pilares Fundamentais de Sabedoria */}
                          {currentMentor.pilares_sabedoria && (
                            <div>
                              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                                Pilares de Sabedoria do Mentor
                              </h4>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                                {currentMentor.pilares_sabedoria.map((pilar, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      padding: '10px 12px',
                                      borderRadius: '12px',
                                      background: 'var(--slate-light)',
                                      border: '1px solid var(--slate-border)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '2px'
                                    }}
                                  >
                                    <strong style={{ fontSize: '0.84rem', color: 'var(--orange)' }}>
                                      {idx + 1}. {pilar.titulo}
                                    </strong>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                      {pilar.desc}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Versículo Âncora */}
                          <div style={{
                            background: 'rgba(249,115,22,0.06)',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            borderLeft: '3.5px solid var(--orange)'
                          }}>
                            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--orange)', textTransform: 'uppercase', display: 'block' }}>
                              Versículo Âncora da Vida
                            </span>
                            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                              {currentMentor.versiculo_chave}
                            </span>
                          </div>
                        </div>

                        {/* ══ 3. MEIO: ENSINAMENTOS DOUTRINÁRIOS & ORAÇÃO ══ */}
                        {conselhoAtivo && (
                          <div className="glass-panel" style={{
                            padding: '20px',
                            borderRadius: '20px',
                            border: '1px solid var(--slate-border)',
                            background: 'var(--white)',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ background: 'var(--orange-light)', color: 'var(--orange)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>
                                {conselhoAtivo.versiculo_referencia}
                              </span>
                              <button
                                onClick={() => handleCopyLayaConselho(
                                  `MENTORIA COM ${currentMentor.nome.toUpperCase()}\nTema: ${conselhoAtivo.titulo}\nVersículo: ${conselhoAtivo.versiculo_referencia}\n\n"${conselhoAtivo.texto_biblico}"\n\nCONSELHO DOUTRINÁRIO:\n${conselhoAtivo.conselho_doutrinario}\n\nORAÇÃO:\n${conselhoAtivo.oracao_guiada}\n\nDESAFIO PRÁTICO:\n${conselhoAtivo.desafio_pratico}`
                                )}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: layaCopied ? 'var(--orange)' : 'var(--text-secondary)',
                                  fontSize: '0.82rem',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                {layaCopied ? 'Copiado!' : 'Copiar'}
                              </button>
                            </div>

                            {/* Texto Bíblico */}
                            <div style={{
                              background: 'rgba(16,185,129,0.05)',
                              padding: '12px 14px',
                              borderRadius: '12px',
                              borderLeft: '3.5px solid var(--orange)'
                            }}>
                              <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: '600', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: '1.5' }}>
                                "{conselhoAtivo.texto_biblico}"
                              </p>
                            </div>

                            {/* Princípio Doutrinário */}
                            <div>
                              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.86rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                                Ensinamento de {currentMentor.nome}
                              </h4>
                              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                                {conselhoAtivo.conselho_doutrinario}
                              </p>
                            </div>

                            {/* Oração com o Mentor */}
                            <div style={{
                              background: 'var(--slate-light)',
                              padding: '14px',
                              borderRadius: '14px',
                              border: '1px solid var(--slate-border)'
                            }}>
                              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                                Oração Guiada
                              </h4>
                              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5', fontStyle: 'italic' }}>
                                "{conselhoAtivo.oracao_guiada}"
                              </p>
                            </div>

                            {/* Desafio Prático */}
                            <div style={{
                              background: 'rgba(245,158,11,0.08)',
                              padding: '12px 14px',
                              borderRadius: '12px',
                              border: '1px solid rgba(245,158,11,0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                              <div>
                                <div style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--orange)', textTransform: 'uppercase' }}>
                                  Desafio Prático
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                                  {conselhoAtivo.desafio_pratico}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ══ 4. PARTE INFERIOR: CHAT PRINCIPAL COM O MENTOR BÍBLICO ══ */}
                        <div className="glass-panel" style={{
                          padding: '20px',
                          borderRadius: '24px',
                          border: '2px solid var(--orange)',
                          background: 'var(--white)',
                          boxShadow: 'var(--shadow-md)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                          marginTop: '4px'
                        }}>
                          {/* Cabeçalho do Chat */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-border)', paddingBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={currentMentor.avatar}
                                alt={currentMentor.nome}
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--orange)' }}
                              />
                              <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '800' }}>
                                  Conversar com {currentMentor.nome}
                                </h3>
                                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                                  Disponível nas Escrituras • Resposta Imediata
                                </span>
                              </div>
                            </div>

                            {/* Botão para Nova Conversa */}
                            <button
                              onClick={() => handleResetMentorChat(currentMentor.id)}
                              title="Iniciar Nova Conversa"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'var(--slate-light)',
                                border: '1px solid var(--slate-border)',
                                borderRadius: '14px',
                                padding: '6px 12px',
                                color: 'var(--text-secondary)',
                                fontSize: '0.76rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                              <span>Nova Conversa</span>
                            </button>
                          </div>

                          {/* Chips de Perguntas Rápidas */}
                          {currentMentor.exemplos_perguntas && (
                            <div>
                              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                                Sugestões de perguntas para iniciar:
                              </span>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {currentMentor.exemplos_perguntas.map((perg, pIdx) => (
                                  <button
                                    key={pIdx}
                                    onClick={() => handleSendMentorMessage(perg)}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '16px',
                                      background: 'var(--slate-light)',
                                      border: '1px solid var(--slate-border)',
                                      color: 'var(--text-primary)',
                                      fontSize: '0.76rem',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" style={{ marginRight: '6px', flexShrink: 0 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                    <span>{perg}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Feed de Mensagens do Chat */}
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            maxHeight: '380px',
                            overflowY: 'auto',
                            padding: '6px 2px',
                            scrollbarWidth: 'thin'
                          }}>
                            {chatHistoryList.map(msg => (
                              <div
                                key={msg.id}
                                style={{
                                  display: 'flex',
                                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                                  alignItems: 'flex-start',
                                  gap: '8px'
                                }}
                              >
                                {msg.sender === 'mentor' && (
                                  <img
                                    src={currentMentor.avatar}
                                    alt={currentMentor.nome}
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginTop: '2px' }}
                                  />
                                )}

                                <div style={{
                                  maxWidth: '82%',
                                  padding: '12px 14px',
                                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                  background: msg.sender === 'user' ? 'var(--orange)' : 'var(--slate-light)',
                                  color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                                  border: msg.sender === 'user' ? 'none' : '1px solid var(--slate-border)',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '6px'
                                }}>
                                  <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: '1.5' }}>
                                    {msg.text}
                                  </p>

                                  {/* Versículo de Fundamentação da Resposta */}
                                  {msg.versiculo && (
                                    <div style={{
                                      fontSize: '0.75rem',
                                      fontWeight: '700',
                                      color: 'var(--orange)',
                                      padding: '4px 8px',
                                      borderRadius: '8px',
                                      background: 'rgba(249,115,22,0.1)',
                                      marginTop: '2px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                                      <span>{msg.versiculo}</span>
                                    </div>
                                  )}

                                  {/* Ação Prática Sugerida */}
                                  {msg.acao && (
                                    <div style={{
                                      fontSize: '0.76rem',
                                      color: 'var(--text-secondary)',
                                      fontStyle: 'italic',
                                      borderTop: '1px solid rgba(0,0,0,0.06)',
                                      paddingTop: '4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                                      <span>{msg.acao}</span>
                                    </div>
                                  )}

                                  <span style={{
                                    fontSize: '0.66rem',
                                    color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                                  }}>
                                    {msg.time}
                                  </span>
                                </div>
                              </div>
                            ))}

                            {/* Indicador de Digitando / Formulando Resposta */}
                            {mentorIsThinking && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img
                                  src={currentMentor.avatar}
                                  alt={currentMentor.nome}
                                  style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <div style={{
                                  padding: '8px 14px',
                                  borderRadius: '16px',
                                  background: 'var(--slate-light)',
                                  color: 'var(--text-muted)',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}>
                                  <span>{currentMentor.nome} está discernindo a resposta...</span>
                                </div>
                              </div>
                            )}

                            <div ref={mentorChatEndRef} />
                          </div>

                          {/* Barra de Entrada / Input do Chat */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleSendMentorMessage();
                            }}
                            style={{ display: 'flex', gap: '8px', marginTop: '4px' }}
                          >
                            <input
                              type="text"
                              value={mentorInputText}
                              onChange={(e) => setMentorInputText(e.target.value)}
                              placeholder={`Pergunte algo a ${currentMentor.nome}...`}
                              style={{
                                flex: 1,
                                padding: '12px 16px',
                                borderRadius: '16px',
                                border: '1px solid var(--slate-border)',
                                background: 'var(--slate-light)',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem',
                                outline: 'none'
                              }}
                            />

                            <button
                              type="submit"
                              disabled={!mentorInputText.trim() || mentorIsThinking}
                              style={{
                                padding: '0 18px',
                                borderRadius: '16px',
                                border: 'none',
                                background: mentorInputText.trim() ? 'var(--orange)' : 'var(--slate-border)',
                                color: '#fff',
                                cursor: mentorInputText.trim() ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                              }}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            </button>
                          </form>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════════ ABA UPGRADE ════════════ */}
        {activeTab === 'upgrade' && (
          <div className="page-enter">
            <div className="page-hero hero-premium">
              <div className="hero-orb" style={{ width: 250, height: 250, top: -60, right: -50, background: 'rgba(249,115,22,0.25)' }} />
              <div className="hero-content">
                <div className="hero-label">⭐ Plano Premium</div>
                <div className="hero-title">Entre no Governo do Reino</div>
                <div className="hero-sub">Ferramentas completas de transformação espiritual</div>
              </div>
            </div>

            <div className="page-content" style={{ paddingTop: '4px' }}>
              <div className="glass-panel dark-card" style={{ marginBottom: '16px' }}>
                {[
                  { icon: 'audio', feat: 'Meditações Guiadas', val: '365 áudios', desc: 'Um áudio por dia de alinhamento' },
                  { icon: 'users', feat: 'Contatos Ilimitados', val: 'Sem limites', desc: 'Todo o seu círculo de influência' },
                  { icon: 'alert', feat: 'Alertas de Conexão', val: 'Automáticos', desc: 'Notificação a cada 48h por prioritário' },
                  { icon: 'book', feat: 'Histórico Completo', val: 'Liberado', desc: 'Mural de todos os códigos' },
                ].map(({ icon, feat, val, desc }) => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff' }}>{feat}</div>
                      <div style={{ fontSize: '0.80rem', color: 'rgba(255,255,255,0.60)' }}>{desc}</div>
                    </div>
                    <span style={{ fontWeight: '700', color: '#FCD34D', fontSize: '0.85rem', flexShrink: 0 }}>{val}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  {
                    tag: 'Básico',
                    name: 'Plano Semente',
                    price: '67',
                    invites: '1 Convite Gratuito',
                    desc: 'Acesso completo ao aplicativo + 1 código de convite para liberar gratuitamente para alguém especial.',
                    featured: false
                  },
                  {
                    tag: 'Mais Popular',
                    name: 'Plano Edificação',
                    price: '97',
                    invites: '5 Convites Gratuitos',
                    desc: 'O mais escolhido: acesso total + 5 códigos de convite para abençoar família e amigos.',
                    featured: true
                  },
                  {
                    tag: 'Avançado',
                    name: 'Plano Reino',
                    price: '147',
                    invites: '10 Convites Gratuitos',
                    desc: 'Para líderes, células e famílias: acesso total + 10 códigos de convite para distribuir.',
                    featured: false
                  }
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`glass-panel ${plan.featured ? 'orange-card' : ''}`}
                    style={{
                      textAlign: 'center',
                      border: plan.featured ? '2px solid var(--orange)' : '1px solid var(--slate-border)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                      {plan.tag} • {plan.invites}
                    </div>
                    <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem' }}>{plan.name}</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: '1.45' }}>{plan.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>R$</span>
                      <span style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--orange)', lineHeight: 1 }}>{plan.price}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}>/ano</span>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Olá! Quero adquirir o ${plan.name} (R$ ${plan.price} com ${plan.invites}) do 1Convite.`)}`, '_blank')}
                      style={{
                        background: plan.featured ? 'linear-gradient(135deg, var(--orange), #ea580c)' : 'linear-gradient(135deg, #25D366, #128C7E)',
                        color: '#fff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%'
                      }}
                    >
                      Garantir {plan.name}
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigateAppRoute(false)}
                  style={{ width: '100%', marginTop: '4px' }}
                >
                  Ver Página Completa de Apresentação e Vendas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ TELA PAGAMENTO ════════════ */}
        {activeTab === 'simular-pagamento' && (
          <div className="page-enter" style={{ padding: '20px', paddingBottom: '40px' }}>
            <div className="glass-panel" style={{ borderTop: '4px solid #009ee3', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#009ee3', fontWeight: '800', fontSize: '1.2rem' }}>mercado pago</span>
                <span style={{ fontSize: '0.75rem', color: '#A8A29E', fontWeight: '700', border: '1px solid #E5E7EB', padding: '2px 8px', borderRadius: '4px' }}>SANDBOX</span>
              </div>
              <h3 style={{ marginBottom: '14px' }}>Resumo da Assinatura</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', marginBottom: '18px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: '500' }}>1Convite Premium — Mensal</span>
                <strong style={{ color: '#1C1917' }}>R$ 19,90</strong>
              </div>
              <p style={{ fontSize: '0.88rem', marginBottom: '20px', color: '#78716C', lineHeight: '1.65' }}>
                Ambiente de checkout seguro. Clique no botão abaixo para simular a aprovação instantânea do pagamento.
              </p>
              <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #009ee3, #0088CC)' }} onClick={finalizarPagamentoSimulado}>
                Confirmar e Simular Aprovação
              </button>
              <button className="btn-secondary" style={{ marginTop: '10px', width: '100%' }} onClick={() => setActiveTab('upgrade')}>Cancelar</button>
            </div>
          </div>
        )}

        {/* ── ABA MINHA CONTA & PERFIL ────────────────────────── */}
        {activeTab === 'conta' && (
          <div className="page-enter flex-column gap-md">
            <div className="page-hero hero-sabado" style={{ textAlign: 'center', padding: '22px 16px 26px', position: 'relative' }}>
              <div className="hero-content">
                <div className="profile-avatar-container" style={{ position: 'relative', display: 'inline-block', margin: '0 auto 10px' }}>
                  <img 
                    src={profileAvatar} 
                    alt="Foto de Perfil" 
                    className="profile-avatar-img" 
                    style={{ 
                      width: '76px', 
                      height: '76px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: isCustomAvatar ? '3px solid #EAB308' : '3px solid var(--orange)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
                    }} 
                  />
                  <label 
                    className="profile-avatar-upload-btn" 
                    title="Alterar foto de perfil"
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--orange)',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '2px solid var(--bg-app)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                  </label>
                </div>

                <h2 className="hero-title" style={{ fontSize: '1.35rem', marginBottom: '6px' }}>
                  {isAdminMode
                    ? 'Jonatas'
                    : (localStorage.getItem('1convite_guest_mode') === 'true' || !profileName || profileName.includes('Administrador Mestre'))
                      ? 'Visitante'
                      : profileName}
                </h2>
                <span className="pedagio-badge badge-proposito" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span>
                    {isAdminMode 
                      ? 'Administrador Mestre • Acesso Total'
                      : userVipExpiry 
                        ? `Membro VIP • Até ${new Date(userVipExpiry).toLocaleDateString('pt-BR')}` 
                        : localStorage.getItem('1convite_guest_mode') === 'true'
                          ? 'Modo Visitante'
                          : 'Membro Convidado'}
                  </span>
                </span>

                {(isAdminMode || adminAuthService.isCurrentSessionAdmin() || (profileEmail || '').trim().toLowerCase() === 'jonatasprojetos2013@gmail.com') && (
                  <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', position: 'relative', zIndex: 3 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdminMode(true);
                        setShowAdminPanel(false);
                        setActiveTab('admin-panel');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1.5px solid #F59E0B',
                        color: '#FCD34D',
                        borderRadius: '24px',
                        minHeight: '44px',
                        padding: '10px 16px',
                        fontSize: '0.84rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.35)'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                      <span>Abrir Painel Administrativo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateAppRoute(false)}
                      style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1.5px solid rgba(255, 255, 255, 0.45)',
                        color: '#FFFFFF',
                        borderRadius: '24px',
                        minHeight: '44px',
                        padding: '10px 16px',
                        fontSize: '0.84rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.35)'
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      <span>Página de Vendas</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="page-content" style={{ paddingTop: '14px' }}>
              {/* 1. Aparência & Leitura (Unificado: Cores, Dark Mode e Tamanho da Letra) */}
              <div className="glass-panel" style={{ marginBottom: '16px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>Aparência & Leitura</h3>
                </div>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', alignItems: 'center', margin: '6px 0 16px' }}>
                  {[
                    { id: 'theme-orange', color: '#f97316', name: 'Laranja' },
                    { id: 'theme-blue', color: '#3b82f6', name: 'Azul' },
                    { id: 'theme-green', color: '#10B981', name: 'Verde' },
                    { id: 'theme-purple', color: '#8b5cf6', name: 'Roxo' },
                    { id: 'theme-sepia', color: '#b58900', name: 'Sépia' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      title={t.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: t.color,
                        border: theme === t.id ? '3px solid var(--text-primary)' : '2px solid rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        transform: theme === t.id ? 'scale(1.12)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                        boxShadow: theme === t.id ? '0 4px 10px rgba(0,0,0,0.15)' : 'none'
                      }}
                    />
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--slate-border)', paddingTop: '12px', paddingBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {darkMode ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    )}
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem' }}>Modo Escuro</strong>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Alternar aparência da interface</span>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div style={{ borderTop: '1px solid var(--slate-border)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', width: '18px', textAlign: 'center' }}>Aa</span>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem' }}>Tamanho da letra</strong>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Ajuste personalizado de leitura</span>
                    </div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '22px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={enableCustomFontSize}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEnableCustomFontSize(checked);
                        localStorage.setItem('app-enable-font-size', checked);
                      }}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: enableCustomFontSize ? 'var(--orange)' : 'rgba(255,255,255,0.1)',
                      border: enableCustomFontSize ? 'none' : '1px solid var(--slate-border)',
                      transition: 'all 0.3s ease', borderRadius: '22px'
                    }}>
                      <span style={{
                        position: 'absolute', content: '""', height: '16px', width: '16px', left: enableCustomFontSize ? '23px' : '2px', bottom: enableCustomFontSize ? '3px' : '2px',
                        backgroundColor: enableCustomFontSize ? 'white' : 'var(--text-secondary)', transition: 'all 0.3s ease', borderRadius: '50%'
                      }} />
                    </span>
                  </label>
                </div>

                {enableCustomFontSize && (
                  <div className="animate-fade-in" style={{ marginTop: '16px', padding: '0 4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.85rem', opacity: 0.6, fontWeight: '500' }}>Aa</span>
                      <input
                        type="range"
                        min="13"
                        max="22"
                        value={fontSizeScale}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setFontSizeScale(val);
                          localStorage.setItem('app-font-size', val);
                        }}
                        style={{
                          flex: 1,
                          accentColor: 'var(--orange)',
                          height: '5px',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Aa</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '12px 0 0', textAlign: 'center', opacity: 0.9 }}>
                      Ajusta o tamanho dos textos de leitura do aplicativo.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Informações Pessoais */}
              <div className="glass-panel" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, textAlign: 'left' }}>Informações da Conta</h3>
                </div>
                <form onSubmit={handleSaveProfile} className="flex-column gap-sm">
                  <div className="input-group">
                    <label>Nome</label>
                    <input type="text" className="input-field" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Seu nome" />
                  </div>
                  <div className="input-group">
                    <label>E-mail ou WhatsApp</label>
                    <input type="text" className="input-field" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} placeholder="seu.email@exemplo.com" />
                  </div>

                  {profileSavedMsg && (
                    <div style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 'bold', margin: '4px 0' }}>
                      {profileSavedMsg}
                    </div>
                  )}

                  <button type="submit" className="btn-primary" style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Salvar Alterações
                  </button>
                </form>
              </div>

              {/* 4. Papéis de Parede Exclusivos 1Convite (Celular & Área de Trabalho) */}
              <div className="glass-panel" style={{ marginBottom: '16px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>Papéis de Parede 1Convite</h3>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                      Fundos exclusivos para celular e área de trabalho.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    {
                      id: 'celular',
                      url: '/wallpapers/1convite-celular-alvorada.jpg',
                      filename: '1Convite-Wallpaper-Celular.jpg',
                      title: 'Celular (9:16)',
                      alt: 'Wallpaper Celular 1Convite'
                    },
                    {
                      id: 'desktop',
                      url: '/wallpapers/1convite-desktop-obsidiana.jpg',
                      filename: '1Convite-Wallpaper-Desktop.jpg',
                      title: 'PC / Desktop (16:9)',
                      alt: 'Wallpaper Desktop 1Convite'
                    }
                  ].map((wp) => (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => setPreviewWallpaper(wp)}
                      style={{
                        display: 'flex', flexDirection: 'column', gap: '8px',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid var(--slate-border)',
                        borderRadius: '14px', padding: '10px', color: 'var(--text-primary)',
                        cursor: 'pointer', textAlign: 'center', width: '100%'
                      }}
                    >
                      <img
                        src={wp.url}
                        alt={wp.alt}
                        style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '10px' }}
                      />
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--orange)', padding: '4px 0' }}>
                        Salvar {wp.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Versão do Sistema & Forçar Atualização */}
              <div className="glass-panel" style={{ marginBottom: '16px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                    </svg>
                    <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Versão & Atualização</h3>
                  </div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    color: '#10B981',
                    background: 'rgba(16, 185, 129, 0.12)',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                    Live Cloud Sync
                  </span>
                </div>

                <div style={{ background: 'var(--slate-light)', borderRadius: '12px', padding: '12px 14px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Versão Atual:</span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{CURRENT_APP_VERSION}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status da Nuvem:</span>
                    <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: '600' }}>Cloudflare Pages (Sincronizado)</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: '1.4' }}>
                  Toque no botão abaixo para limpar dados residuais de cache do seu navegador e forçar o carregamento imediato da versão mais recente na nuvem.
                </p>

                {updateStatusMsg && (
                  <div style={{
                    marginBottom: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    fontWeight: '600'
                  }}>
                    {updateStatusMsg}
                  </div>
                )}

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCheckForUpdates}
                  disabled={checkingUpdate}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    fontWeight: '700',
                    fontSize: '0.88rem'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: checkingUpdate ? 'spin 1s linear infinite' : 'none' }}>
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                  <span>{checkingUpdate ? 'Sincronizando com a Nuvem...' : 'Forçar Atualização do Aplicativo'}</span>
                </button>
              </div>

              {/* 6. Card Destacado: Sair da Conta (Logout) */}
              <div className="glass-panel" style={{ 
                marginBottom: '16px', 
                textAlign: 'center',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                background: 'rgba(239, 68, 68, 0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, textAlign: 'left', color: '#F87171' }}>Sessão Ativa</h3>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px', textAlign: 'left', lineHeight: '1.4' }}>
                  Conectado como <strong>{profileEmail || profileName || 'Convidado'}</strong>. Ao sair, você voltará para a tela inicial de entrada e login.
                </p>

                <button 
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '13px 18px',
                    fontSize: '0.92rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
                    transition: 'all 0.2s'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Sair da Conta (Logout)</span>
                </button>
              </div>

              {/* 7. Rodapé da Conta: Apenas a Logomarca Oficial */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '30px 0 24px',
                margin: '10px 0'
              }}>
                <img 
                  src={darkMode ? appLogomarcaDark : appLogomarcaLight} 
                  alt="1Convite - Compartilhando o Reino" 
                  style={{ 
                    width: '180px', 
                    maxWidth: '65%', 
                    height: 'auto', 
                    objectFit: 'contain'
                  }} 
                />
                <div style={{ 
                  fontSize: '0.72rem', 
                  color: 'var(--text-tertiary)', 
                  marginTop: '8px', 
                  letterSpacing: '0.5px' 
                }}>
                  1convite.com.br • Compartilhando o Reino
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
                  <button type="button" onClick={() => setLegalModalTab('termos')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.74rem', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
                    Termos de Uso
                  </button>
                  <button type="button" onClick={() => setLegalModalTab('privacidade')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.74rem', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
                    Privacidade
                  </button>
                  <button type="button" onClick={() => setLegalModalTab('lgpd')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.74rem', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
                    LGPD
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ ABA STUDIO DE CARDS ════════════ */}
        {activeTab === 'criar-card' && (() => {
          const phrases = CARD_PHRASES[cardCategory] || [];
          const activeBgCat = CARD_BG_CATEGORIES.find(c => c.id === cardBgCategory);
          const activeBgItems = activeBgCat?.items || [];
          const bg = activeBgItems[cardBg] || activeBgItems[0] || { url: '', label: '' };
          const selectedPhrase = cardSelectedText || (phrases[0] ? phrases[0].text : '');
          const selectedRef = phrases.find(p => p.text === selectedPhrase)?.ref;
          const fontSizeMap = { sm: '0.88rem', md: '1.1rem', lg: '1.35rem', xl: '1.65rem' };
          const fontStyleMap = {
            normal: { fontStyle: 'normal', fontWeight: '400' },
            italic: { fontStyle: 'italic', fontWeight: '400' },
            bold: { fontStyle: 'normal', fontWeight: '700' },
            bolditalic: { fontStyle: 'italic', fontWeight: '700' },
          };
          const MSG_CATS = [
            { id: 'bomdia', label: 'Bom Dia' },
            { id: 'boatarde', label: 'Boa Tarde' },
            { id: 'boanoite', label: 'Boa Noite' },
            { id: 'versiculo', label: 'Versículo' },
            { id: 'convite', label: '1Convite' },
          ];

          return (
            <div className="page-enter" style={{ paddingBottom: '40px' }}>
              <div className="page-content" style={{ paddingTop: '16px' }}>

                {/* ── PREVIEW STICKY ── */}
                <div style={{ padding: '0 20px 16px', position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-primary)' }}>
                  <div ref={cardPreviewRef} style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: cardFormat === 'square' ? '100%' : '177%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundImage: bg.url ? `url(${bg.url})` : 'linear-gradient(135deg,#1a1a2e,#16213e)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.40)',
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,${cardOverlay}) 0%, rgba(0,0,0,${(cardOverlay*0.4).toFixed(2)}) 50%, rgba(0,0,0,${(cardOverlay*0.1).toFixed(2)}) 100%)` }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '24px 20px', textAlign: 'center' }}>
                      <p style={{
                        fontFamily: cardFont,
                        fontSize: fontSizeMap[cardFontSize],
                        color: cardTextColor,
                        lineHeight: '1.65',
                        ...fontStyleMap[cardTextStyle],
                        textShadow: '0 2px 14px rgba(0,0,0,0.85)',
                        margin: 0,
                        letterSpacing: '0.01em',
                      }}>
                        &ldquo;{selectedPhrase}&rdquo;
                      </p>
                      {selectedRef && (
                        <span style={{ marginTop: '10px', fontSize: '0.75rem', color: cardTextColor, opacity: 0.8, fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.8)', fontFamily: cardFont }}>
                          — {selectedRef}
                        </span>
                      )}
                      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '5px', opacity: 0.55 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                        <span style={{ fontSize: '0.6rem', color: '#fff', fontWeight: '700', letterSpacing: '0.1em' }}>1CONVITE.COM.BR</span>
                      </div>
                    </div>
                  </div>
                  {/* Formato */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    {[{ id: 'square', label: 'Post (1:1)' }, { id: 'story', label: 'Story (9:16)' }].map(f => (
                      <button key={f.id} onClick={() => setCardFormat(f.id)} style={{
                        flex: 1, padding: '7px', fontSize: '0.8rem', fontWeight: '600', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
                        background: cardFormat === f.id ? 'var(--orange)' : 'transparent',
                        color: cardFormat === f.id ? '#000' : 'var(--text-secondary)',
                        border: cardFormat === f.id ? 'none' : '1px solid rgba(255,255,255,0.12)',
                      }}>{f.label}</button>
                    ))}
                  </div>
                </div>

                {/* ── EDITOR DE TEXTO (Canva) ── */}
                <div className="glass-panel" style={{ margin: '0 20px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>Estilo do Texto</h3>
                  </div>

                  {/* Fonte */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>FONTE</label>
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                      {CARD_FONTS.map(f => (
                        <button key={f.value} onClick={() => setCardFont(f.value)}
                          style={{
                            flexShrink: 0, padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', border: 'none',
                            background: cardFont === f.value ? 'var(--orange)' : 'rgba(255,255,255,0.06)',
                            color: cardFont === f.value ? '#000' : 'var(--text-secondary)',
                            fontFamily: f.value, fontSize: '0.82rem',
                          }}
                        >{f.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Tamanho, Estilo e Overlay na mesma linha */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    {/* Tamanho */}
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>TAMANHO</label>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {CARD_FONT_SIZES.map(s => (
                          <button key={s.value} onClick={() => setCardFontSize(s.value)}
                            style={{
                              flex: 1, padding: '7px 4px', borderRadius: '8px', cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                              background: cardFontSize === s.value ? 'var(--orange)' : 'rgba(255,255,255,0.06)',
                              color: cardFontSize === s.value ? '#000' : 'var(--text-secondary)',
                              fontSize: s.value === 'xl' ? '0.9rem' : s.value === 'sm' ? '0.7rem' : '0.8rem', fontWeight: '700',
                            }}
                          >{s.label}</button>
                        ))}
                      </div>
                    </div>

                    {/* Estilo */}
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>ESTILO</label>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[{ id: 'normal', label: 'A', style: {} }, { id: 'italic', label: 'A', style: { fontStyle: 'italic' } }, { id: 'bold', label: 'A', style: { fontWeight: '700' } }, { id: 'bolditalic', label: 'A', style: { fontStyle: 'italic', fontWeight: '700' } }].map(s => (
                          <button key={s.id} onClick={() => setCardTextStyle(s.id)}
                            style={{
                              flex: 1, padding: '7px 4px', borderRadius: '8px', cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                              background: cardTextStyle === s.id ? 'var(--orange)' : 'rgba(255,255,255,0.06)',
                              color: cardTextStyle === s.id ? '#000' : 'var(--text-secondary)',
                              fontSize: '0.88rem', ...s.style,
                            }}
                          >{s.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cores do texto */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '8px' }}>COR DO TEXTO</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {CARD_TEXT_COLORS.map(c => (
                        <button key={c.value} onClick={() => setCardTextColor(c.value)} title={c.label}
                          style={{
                            width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', padding: 0,
                            background: c.value,
                            border: cardTextColor === c.value ? '3px solid var(--orange)' : '2px solid rgba(255,255,255,0.15)',
                            transform: cardTextColor === c.value ? 'scale(1.2)' : 'scale(1)',
                            transition: 'all 0.2s', boxSizing: 'border-box',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Escuridão do overlay */}
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>ESCURIDÃO DO FUNDO: {Math.round(cardOverlay * 100)}%</label>
                    <input type="range" min="0" max="100" value={Math.round(cardOverlay * 100)}
                      onChange={e => setCardOverlay(Number(e.target.value) / 100)}
                      style={{ width: '100%', accentColor: 'var(--orange)' }}
                    />
                  </div>
                </div>

                {/* ── GALERIA DE FUNDOS ── */}
                <div className="glass-panel" style={{ margin: '0 20px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>Escolha o Fundo</h3>
                  </div>
                  {/* Abas de categoria de fundo */}
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '12px' }}>
                    {CARD_BG_CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => { setCardBgCategory(cat.id); setCardBg(0); }}
                        style={{
                          flexShrink: 0, padding: '5px 12px', fontSize: '0.78rem', fontWeight: '600',
                          borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', border: 'none',
                          background: cardBgCategory === cat.id ? 'var(--orange)' : 'rgba(255,255,255,0.06)',
                          color: cardBgCategory === cat.id ? '#000' : 'var(--text-secondary)',
                        }}
                      >{cat.label}</button>
                    ))}
                  </div>
                  {/* Grid de imagens */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {activeBgItems.map((item, idx) => (
                      <div key={idx} onClick={() => setCardBg(idx)}
                        style={{
                          position: 'relative', paddingTop: '100%', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
                          backgroundImage: `url(${item.url})`, backgroundSize: 'cover', backgroundPosition: 'center',
                          border: cardBg === idx ? '2.5px solid var(--orange)' : '2px solid transparent',
                          transition: 'all 0.2s',
                          transform: cardBg === idx ? 'scale(1.06)' : 'scale(1)',
                        }}
                      >
                        {cardBg === idx && (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.25)', paddingBottom: '4px' }}>
                            <span style={{ fontSize: '0.6rem', color: '#fff', fontWeight: '700', background: 'rgba(0,0,0,0.5)', padding: '1px 5px', borderRadius: '4px' }}>{item.label}</span>
                          </div>
                        )}
                        {cardBg !== idx && (
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2px 4px', background: 'rgba(0,0,0,0.4)' }}>
                            <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: '600' }}>{item.label}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── MENSAGEM ── */}
                <div className="glass-panel" style={{ margin: '0 20px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>Escolha a Mensagem</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '12px' }}>
                    {MSG_CATS.map(c => (
                      <button key={c.id} onClick={() => { setCardCategory(c.id); setCardSelectedText(''); }}
                        style={{
                          flexShrink: 0, padding: '6px 12px', fontSize: '0.78rem', fontWeight: '600',
                          borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', border: 'none',
                          background: cardCategory === c.id ? 'var(--orange)' : 'rgba(255,255,255,0.06)',
                          color: cardCategory === c.id ? '#000' : 'var(--text-secondary)',
                        }}
                      >{c.label}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {phrases.map((p, idx) => (
                      <div key={idx} onClick={() => setCardSelectedText(p.text)}
                        style={{
                          padding: '12px 14px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                          background: (cardSelectedText || phrases[0]?.text) === p.text ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.04)',
                          border: (cardSelectedText || phrases[0]?.text) === p.text ? '1.5px solid var(--orange)' : '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: '1.55', color: 'var(--text-primary)', fontStyle: 'italic' }}>&ldquo;{p.text}&rdquo;</p>
                        {p.ref && <span style={{ marginTop: '6px', display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>{p.ref}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── AÇÕES ── */}
                <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button className="btn-primary" onClick={() => handleGenerateCard('share')} disabled={cardGenerating}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', fontSize: '1rem', fontWeight: '700', borderRadius: '14px' }}
                  >
                    {cardGenerating
                      ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    }
                    {cardGenerating ? 'Gerando...' : 'Compartilhar no WhatsApp / Redes'}
                  </button>
                  <button className="btn-secondary" onClick={() => handleGenerateCard('download')} disabled={cardGenerating}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', fontSize: '0.92rem', fontWeight: '600', borderRadius: '14px' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Baixar Imagem PNG
                  </button>
                </div>

              </div>
            </div>
          );
        })()}

        {/* ════════════ ABA ARCADE BÍBLICO ════════════ */}
        {activeTab === 'arcade' && (
          <div className="page-enter" style={{ padding: '20px', paddingBottom: '40px' }}>
            {arcadeActiveGame === 'lobby' && (
              <>
                {/* Cabeçalho do Arcade com ChaminhaCoin */}
                <div className="arcade-header-card">
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Seu Progresso</h2>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Divirta-se e aprenda a Palavra!</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(249,115,22,0.12)', padding: '6px 14px', borderRadius: '12px', border: '1.5px solid rgba(249,115,22,0.3)' }}>
                      <ChaminhaCoin size={22} />
                      <strong style={{ color: 'var(--orange)', fontSize: '1.15rem' }}>{userCoins}</strong>
                    </div>
                  </div>
                </div>

                {/* Chaminha no lobby de jogos */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '28px', padding: '0 8px' }}>
                  <ChaminhaVideo size={76} style={{ flexShrink: 0 }} />
                  <div className="glass-panel animate-fade-in" style={{
                    padding: '14px 18px',
                    borderRadius: '16px',
                    fontSize: '0.92rem',
                    color: 'var(--text-primary)',
                    border: '1.5px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                    position: 'relative',
                    maxWidth: '380px',
                    background: darkMode ? 'rgba(24, 24, 27, 0.85)' : '#ffffff',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sp-green, #10B981)" strokeWidth="2.5" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 6 }}>
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <strong>Chaminha:</strong> "Escolha um jogo bíblico abaixo para testar sua sabedoria e ganhar muitas Chaminhas!"
                  </div>
                </div>

                {/* Grade dos 5 Jogos Unificados */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  
                  {/* Jogo 1: Quiz Bíblico */}
                  <div className="arcade-game-card" onClick={() => { setArcadeSelectedGame('quiz'); setArcadeActiveGame('difficulty'); }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px', boxShadow: '0 6px 14px rgba(124, 58, 237, 0.35)' }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="arcade-card-title">Quiz Bíblico</h3>
                      <p className="arcade-card-subtitle">Perguntas e respostas</p>
                    </div>
                    <div className="arcade-play-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      JOGAR
                    </div>
                  </div>

                  {/* Jogo 2: Caça-Palavras */}
                  <div className="arcade-game-card" onClick={() => { setArcadeSelectedGame('cacapalavras'); setArcadeActiveGame('difficulty'); }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px', boxShadow: '0 6px 14px rgba(5, 150, 105, 0.35)' }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="arcade-card-title">Caça Palavras</h3>
                      <p className="arcade-card-subtitle">Encontre termos sagrados</p>
                    </div>
                    <div className="arcade-play-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      JOGAR
                    </div>
                  </div>

                  {/* Jogo 3: Quem Sou Eu? (Adivinha Kids & Bíblia) */}
                  <div className="arcade-game-card" onClick={() => { setArcadeSelectedGame('charadas'); setArcadeActiveGame('difficulty'); }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #db2777, #f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px', boxShadow: '0 6px 14px rgba(219, 39, 119, 0.35)' }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="arcade-card-title">Quem Sou Eu?</h3>
                      <p className="arcade-card-subtitle">Adivinha Kids & Bíblia</p>
                    </div>
                    <div className="arcade-play-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      JOGAR
                    </div>
                  </div>

                  {/* Jogo 4: Forca Bíblica */}
                  <div className="arcade-game-card" onClick={() => { setArcadeSelectedGame('forca'); setArcadeActiveGame('difficulty'); }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #d97706, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px', boxShadow: '0 6px 14px rgba(217, 119, 6, 0.35)' }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 22h14" />
                        <path d="M9 22V2" />
                        <path d="M9 2h6" />
                        <path d="M15 2v4" />
                        <circle cx="15" cy="8" r="2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="arcade-card-title">Forca Bíblica</h3>
                      <p className="arcade-card-subtitle">Adivinhe a palavra secreta</p>
                    </div>
                    <div className="arcade-play-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      JOGAR
                    </div>
                  </div>

                  {/* Jogo 5: Jogo da Memória Bíblico (Arca de Noé & Símbolos) */}
                  <div 
                    className="arcade-game-card" 
                    onClick={() => {
                      setArcadeSelectedGame('memoria');
                      setArcadeMemoriaCards(generateMemoriaDeck());
                      setArcadeMemoriaFlipped([]);
                      setArcadeMemoriaMatched([]);
                      setArcadeMemoriaMoves(0);
                      setArcadeMemoriaGameOver(false);
                      setArcadeActiveGame('memoria');
                    }}
                    style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left', padding: '18px 20px', gap: '16px' }}
                  >
                    <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 16px rgba(2, 132, 199, 0.35)' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="9" height="13" rx="2" />
                        <rect x="13" y="8" width="9" height="13" rx="2" />
                        <path d="M6 7h1" />
                        <path d="M17 12h1" />
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#10B981', color: '#fff', padding: '2px 8px', borderRadius: '8px', letterSpacing: '0.05em' }}>NOVO</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--orange)' }}>ARCA DE NOÉ</span>
                      </div>
                      <h3 className="arcade-card-title" style={{ fontSize: '1.15rem' }}>Jogo da Memória</h3>
                      <p className="arcade-card-subtitle" style={{ margin: 0 }}>Encontre os pares dos animais e símbolos sagrados</p>
                    </div>
                    <div className="arcade-play-badge" style={{ margin: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      JOGAR
                    </div>
                  </div>

                </div>
              </>
            )}

            {/* ════════════ TELA DE DIFICULDADE (ALTO CONTRASTE) ════════════ */}
            {arcadeActiveGame === 'difficulty' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '20px', padding: '20px 10px' }}>
                <ChaminhaFixo size={110} style={{ animation: 'bounceChaminha 1s infinite alternate ease-in-out' }} />
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ color: 'var(--orange)', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px' }}>Selecione o Nível</h2>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    {arcadeSelectedGame === 'charadas' && 'Adivinhe os personagens das histórias bíblicas!'}
                    {arcadeSelectedGame === 'quiz' && 'Responda no tempo e acumule Chaminhas!'}
                    {arcadeSelectedGame === 'forca' && 'Adivinhe as letras sem errar o boneco!'}
                    {arcadeSelectedGame === 'cacapalavras' && 'Procure os termos sagrados na grade!'}
                    {arcadeSelectedGame === 'memoria' && 'Encontre os pares sagrados da Arca de Noé!'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '340px' }}>
                  
                  {/* NÍVEL BÁSICO / KIDS */}
                  <button onClick={() => {
                    setArcadeDifficulty('facil');
                    if (arcadeSelectedGame === 'quiz') {
                      setArcadeQuizList(ARCADE_QUIZ_QUESTIONS.filter(q => q.difficulty === 'facil').sort(() => Math.random() - 0.5));
                      setArcadeQuizTimer(30);
                      setArcadeQuizCurrentQuestion(0); setArcadeQuizScore(0); setArcadeQuizGameOver(false); setArcadeQuizFeedback(null);
                    } else if (arcadeSelectedGame === 'cacapalavras') {
                      const filtered = ARCADE_CACA_PALAVRAS_LIST.filter(q => q.difficulty === 'facil');
                      const { grid, words } = generateCacaPalavrasGrid(filtered, 10, 5);
                      setArcadeCacaGrade(grid); setArcadeCacaWords(words); setArcadeCacaFound([]); setArcadeCacaSelected([]); setArcadeCacaScore(0); setArcadeCacaGameOver(false);
                    } else if (arcadeSelectedGame === 'charadas') {
                      setArcadeCharadasList(ARCADE_CHARADAS_QUESTIONS.filter(q => q.difficulty === 'facil').sort(() => Math.random() - 0.5));
                      setArcadeCharadasTimer(null);
                      setArcadeCharadasCurrent(0); setArcadeCharadasScore(0); setArcadeCharadasGameOver(false); setArcadeCharadasFeedback(null);
                    } else if (arcadeSelectedGame === 'forca') {
                      setArcadeForcaList(ARCADE_FORCA_WORDS.filter(q => q.difficulty === 'facil').sort(() => Math.random() - 0.5));
                      setArcadeForcaCurrent(0); setArcadeForcaScore(0); setArcadeForcaGameOver(false); setArcadeForcaGuesses([]); setArcadeForcaMistakes(0); setArcadeForcaFeedback(null);
                    }
                    setArcadeActiveGame(arcadeSelectedGame);
                  }} style={{
                    background: darkMode ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                    border: '2px solid #10b981',
                    color: darkMode ? '#34d399' : '#065f46',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.12)',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                        {arcadeSelectedGame === 'charadas' ? 'Nível Kids / Básico' : 'Nível Básico'}
                      </span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, opacity: 0.9 }}>
                      {arcadeSelectedGame === 'charadas' ? 'Personagens famosos (Noé, Davi, Moisés, Jonas...)' : 'Perfeito para crianças e iniciantes'}
                    </span>
                  </button>

                  {/* NÍVEL MÉDIO */}
                  <button onClick={() => {
                    setArcadeDifficulty('medio');
                    if (arcadeSelectedGame === 'quiz') {
                      setArcadeQuizList(ARCADE_QUIZ_QUESTIONS.filter(q => q.difficulty === 'medio').sort(() => Math.random() - 0.5));
                      setArcadeQuizTimer(15);
                      setArcadeQuizCurrentQuestion(0); setArcadeQuizScore(0); setArcadeQuizGameOver(false); setArcadeQuizFeedback(null);
                    } else if (arcadeSelectedGame === 'cacapalavras') {
                      const filtered = ARCADE_CACA_PALAVRAS_LIST.filter(q => q.difficulty === 'medio');
                      const { grid, words } = generateCacaPalavrasGrid(filtered, 12, 6);
                      setArcadeCacaGrade(grid); setArcadeCacaWords(words); setArcadeCacaFound([]); setArcadeCacaSelected([]); setArcadeCacaScore(0); setArcadeCacaGameOver(false);
                    } else if (arcadeSelectedGame === 'charadas') {
                      setArcadeCharadasList(ARCADE_CHARADAS_QUESTIONS.filter(q => q.difficulty === 'medio').sort(() => Math.random() - 0.5));
                      setArcadeCharadasTimer(15);
                      setArcadeCharadasCurrent(0); setArcadeCharadasScore(0); setArcadeCharadasGameOver(false); setArcadeCharadasFeedback(null);
                    } else if (arcadeSelectedGame === 'forca') {
                      setArcadeForcaList(ARCADE_FORCA_WORDS.filter(q => q.difficulty === 'medio').sort(() => Math.random() - 0.5));
                      setArcadeForcaCurrent(0); setArcadeForcaScore(0); setArcadeForcaGameOver(false); setArcadeForcaGuesses([]); setArcadeForcaMistakes(0); setArcadeForcaFeedback(null);
                    }
                    setArcadeActiveGame(arcadeSelectedGame);
                  }} style={{
                    background: darkMode ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb',
                    border: '2px solid #f59e0b',
                    color: darkMode ? '#fbbf24' : '#92400e',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.12)',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>Nível Médio</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, opacity: 0.9 }}>
                      {arcadeSelectedGame === 'charadas' ? 'Heróis da Fé e histórias marcantes' : 'Desafio equilibrado para quem estuda a Bíblia'}
                    </span>
                  </button>

                  {/* NÍVEL AVANÇADO */}
                  <button onClick={() => {
                    setArcadeDifficulty('avancado');
                    if (arcadeSelectedGame === 'quiz') {
                      setArcadeQuizList(ARCADE_QUIZ_QUESTIONS.filter(q => q.difficulty === 'avancado').sort(() => Math.random() - 0.5));
                      setArcadeQuizTimer(7);
                      setArcadeQuizCurrentQuestion(0); setArcadeQuizScore(0); setArcadeQuizGameOver(false); setArcadeQuizFeedback(null);
                    } else if (arcadeSelectedGame === 'cacapalavras') {
                      const filtered = ARCADE_CACA_PALAVRAS_LIST.filter(q => q.difficulty === 'avancado');
                      const { grid, words } = generateCacaPalavrasGrid(filtered, 14, 8);
                      setArcadeCacaGrade(grid); setArcadeCacaWords(words); setArcadeCacaFound([]); setArcadeCacaSelected([]); setArcadeCacaScore(0); setArcadeCacaGameOver(false);
                    } else if (arcadeSelectedGame === 'charadas') {
                      setArcadeCharadasList(ARCADE_CHARADAS_QUESTIONS.filter(q => q.difficulty === 'avancado').sort(() => Math.random() - 0.5));
                      setArcadeCharadasTimer(7);
                      setArcadeCharadasCurrent(0); setArcadeCharadasScore(0); setArcadeCharadasGameOver(false); setArcadeCharadasFeedback(null);
                    } else if (arcadeSelectedGame === 'forca') {
                      setArcadeForcaList(ARCADE_FORCA_WORDS.filter(q => q.difficulty === 'avancado').sort(() => Math.random() - 0.5));
                      setArcadeForcaCurrent(0); setArcadeForcaScore(0); setArcadeForcaGameOver(false); setArcadeForcaGuesses([]); setArcadeForcaMistakes(0); setArcadeForcaFeedback(null);
                    }
                    setArcadeActiveGame(arcadeSelectedGame);
                  }} style={{
                    background: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                    border: '2px solid #ef4444',
                    color: darkMode ? '#f87171' : '#991b1b',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.12)',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>Nível Avançado</span>
                      <span style={{ fontSize: '0.72rem', background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '8px', fontWeight: 800 }}>2x MOEDAS</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, opacity: 0.9 }}>
                      {arcadeSelectedGame === 'charadas' ? 'Profetas, mestres e detalhes profundos' : 'Para profundos conhecedores da Palavra'}
                    </span>
                  </button>

                </div>

                <button onClick={() => setArcadeActiveGame('lobby')} className="arcade-back-btn" style={{ width: 'auto', height: 'auto', padding: '10px 20px', borderRadius: '12px', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Voltar ao Lobby</span>
                </button>
              </div>
            )}

            {/* ════════════ JOGO 1: QUIZ BÍBLICO ════════════ */}
            {arcadeActiveGame === 'quiz' && (() => {
              const q = arcadeQuizList[arcadeQuizCurrentQuestion];
              
              const handleAnswer = (index) => {
                if (arcadeQuizFeedback) return;
                
                if (index === q.answer) {
                  setArcadeQuizFeedback('correct');
                  setArcadeQuizScore(prev => prev + 10 + arcadeQuizTimer);
                  setUserCoins(prev => {
                    const multiplier = arcadeDifficulty === 'avancado' ? 2 : 1;
                    const newCoins = prev + (5 * multiplier);
                    localStorage.setItem('app-coins', newCoins);
                    return newCoins;
                  });
                } else {
                  setArcadeQuizFeedback('wrong');
                }
                
                setTimeout(() => {
                  setArcadeQuizFeedback(null);
                  const resetTime = arcadeDifficulty === 'facil' ? 30 : (arcadeDifficulty === 'avancado' ? 7 : 15);
                  setArcadeQuizTimer(resetTime);
                  if (arcadeQuizCurrentQuestion + 1 < arcadeQuizList.length) {
                    setArcadeQuizCurrentQuestion(prev => prev + 1);
                  } else {
                    setArcadeQuizGameOver(true);
                  }
                }, 1800);
              };

              if (arcadeQuizGameOver) {
                return (
                  <div style={{ textAlign: 'center', paddingTop: '30px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <ChaminhaFixo size={120} style={{ animation: 'bounceChaminha 0.8s infinite alternate ease-in-out' }} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--orange)' }}>Quiz Concluído!</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '30px' }}>
                      Sua pontuação final: <strong style={{ color: 'var(--text-primary)' }}>{arcadeQuizScore} pontos</strong>
                    </p>
                    
                    <button className="btn-primary" onClick={() => {
                      setArcadeActiveGame('lobby');
                      setArcadeQuizCurrentQuestion(0);
                      setArcadeQuizScore(0);
                      setArcadeQuizGameOver(false);
                      const resetTime = arcadeDifficulty === 'facil' ? 30 : (arcadeDifficulty === 'avancado' ? 7 : 15);
                      setArcadeQuizTimer(resetTime);
                    }} style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '14px', width: '100%', maxWidth: '340px' }}>
                      Voltar ao Lobby
                    </button>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Header do Jogo */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <button onClick={() => setArcadeActiveGame('lobby')} className="arcade-back-btn" aria-label="Voltar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--orange)', background: 'rgba(249,115,22,0.12)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(249,115,22,0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        {arcadeQuizScore}
                      </div>
                      <div style={{ fontWeight: 800, color: arcadeQuizTimer <= 5 ? '#ef4444' : '#10b981', background: arcadeQuizTimer <= 5 ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', padding: '6px 14px', borderRadius: '20px', border: `1px solid ${arcadeQuizTimer <= 5 ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {arcadeQuizTimer}s
                      </div>
                    </div>
                  </div>

                  {/* Pergunta */}
                  <div className="arcade-question-card">
                    <div style={{ fontSize: '0.82rem', color: 'var(--orange)', fontWeight: 800, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Pergunta {arcadeQuizCurrentQuestion + 1} de {arcadeQuizList.length}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', lineHeight: '1.4', fontWeight: 800, color: 'var(--text-primary)' }}>{q?.question}</h3>
                  </div>

                  {/* Alternativas */}
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {q?.options.map((opt, idx) => {
                      let statusClass = '';
                      if (arcadeQuizFeedback) {
                        if (idx === q.answer) statusClass = 'correct';
                        else if (arcadeQuizFeedback === 'wrong' && idx !== q.answer) statusClass = 'wrong';
                      }

                      return (
                        <button 
                          key={idx} 
                          onClick={() => handleAnswer(idx)} 
                          disabled={!!arcadeQuizFeedback}
                          className={`arcade-option-btn ${statusClass}`}
                        >
                          <span style={{ display: 'inline-block', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.06)', textAlign: 'center', lineHeight: '28px', marginRight: '10px', fontSize: '0.85rem' }}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ════════════ JOGO 2: QUEM SOU EU? (ADIVINHA KIDS & BÍBLIA) ════════════ */}
            {arcadeActiveGame === 'charadas' && (() => {
              const q = arcadeCharadasList[arcadeCharadasCurrent];
              
              const handleAnswer = (index) => {
                if (arcadeCharadasFeedback) return;
                
                if (index === q.answer) {
                  setArcadeCharadasFeedback('correct');
                  setArcadeCharadasScore(prev => prev + 15);
                  setUserCoins(prev => {
                    const multiplier = arcadeDifficulty === 'avancado' ? 2 : 1;
                    const newCoins = prev + (10 * multiplier);
                    localStorage.setItem('app-coins', newCoins);
                    return newCoins;
                  });
                } else {
                  setArcadeCharadasFeedback('wrong');
                }
                
                setTimeout(() => {
                  setArcadeCharadasFeedback(null);
                  if (arcadeCharadasCurrent + 1 < arcadeCharadasList.length) {
                    setArcadeCharadasCurrent(prev => prev + 1);
                    const resetTime = arcadeDifficulty === 'facil' ? null : (arcadeDifficulty === 'avancado' ? 7 : 15);
                    setArcadeCharadasTimer(resetTime);
                  } else {
                    setArcadeCharadasGameOver(true);
                  }
                }, 1800);
              };

              if (arcadeCharadasGameOver) {
                return (
                  <div style={{ textAlign: 'center', paddingTop: '30px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <ChaminhaFixo size={120} style={{ animation: 'bounceChaminha 0.8s infinite alternate ease-in-out' }} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--orange)' }}>Parabéns!</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '30px' }}>
                      Sua pontuação: <strong style={{ color: 'var(--text-primary)' }}>{arcadeCharadasScore} pontos</strong>
                    </p>
                    
                    <button className="btn-primary" onClick={() => {
                      setArcadeActiveGame('lobby');
                      setArcadeCharadasCurrent(0);
                      setArcadeCharadasScore(0);
                      setArcadeCharadasGameOver(false);
                    }} style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '14px', width: '100%', maxWidth: '340px' }}>
                      Voltar ao Lobby
                    </button>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Header do Jogo */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <button onClick={() => setArcadeActiveGame('lobby')} className="arcade-back-btn" aria-label="Voltar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {arcadeCharadasTimer !== null && (
                        <div style={{ fontWeight: 800, color: arcadeCharadasTimer <= 3 ? '#ef4444' : 'var(--text-primary)', background: darkMode ? 'rgba(255,255,255,0.1)' : '#f3f4f6', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-color, #e5e7eb)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {arcadeCharadasTimer}s
                        </div>
                      )}
                      <div style={{ fontWeight: 800, color: 'var(--orange)', background: 'rgba(249,115,22,0.12)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(249,115,22,0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        {arcadeCharadasScore}
                      </div>
                    </div>
                  </div>

                  {/* Dicas */}
                  <div className="arcade-question-card" style={{ textAlign: 'left', padding: '24px 20px' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--orange)', fontWeight: 800, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
                      Quem Sou Eu? ({arcadeCharadasCurrent + 1} de {arcadeCharadasList.length})
                    </div>
                    
                    <ul style={{ margin: 0, paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {q?.clues.map((clue, idx) => (
                        <li key={idx} style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: '1.45', fontWeight: 600 }}>{clue}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Alternativas */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {q?.options.map((opt, idx) => {
                      let statusClass = '';
                      if (arcadeCharadasFeedback) {
                        if (idx === q.answer) statusClass = 'correct';
                        else if (arcadeCharadasFeedback === 'wrong' && idx !== q.answer) statusClass = 'wrong';
                      }

                      return (
                        <button 
                          key={idx} 
                          onClick={() => handleAnswer(idx)} 
                          disabled={!!arcadeCharadasFeedback}
                          className={`arcade-option-btn ${statusClass}`}
                          style={{ textAlign: 'center', padding: '16px 12px' }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ════════════ JOGO 3: FORCA BÍBLICA (MODO CLARO E ESCURO 100% NÍTIDO) ════════════ */}
            {arcadeActiveGame === 'forca' && (() => {
              const currentWordObj = arcadeForcaList[arcadeForcaCurrent];
              const word = currentWordObj ? currentWordObj.word.toUpperCase() : '';
              
              const isWordGuessed = word && word.split('').every(char => char === ' ' || arcadeForcaGuesses.includes(char));
              const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
              
              const maxMistakes = arcadeDifficulty === 'facil' ? 8 : (arcadeDifficulty === 'avancado' ? 4 : 6);

              const handleGuess = (letter) => {
                if (arcadeForcaFeedback || arcadeForcaGuesses.includes(letter)) return;
                
                const newGuesses = [...arcadeForcaGuesses, letter];
                setArcadeForcaGuesses(newGuesses);
                
                if (!word.includes(letter)) {
                  setArcadeForcaMistakes(prev => {
                    const newMistakes = prev + 1;
                    if (newMistakes >= maxMistakes) {
                      setTimeout(() => setArcadeForcaFeedback('lost'), 600);
                    }
                    return newMistakes;
                  });
                } else {
                  const updatedWord = word.split('');
                  const willBeGuessed = updatedWord.every(char => char === ' ' || newGuesses.includes(char));
                  if (willBeGuessed) {
                    setTimeout(() => setArcadeForcaFeedback('won'), 600);
                  }
                }
              };

              const handleNextWord = () => {
                if (arcadeForcaFeedback === 'won') {
                  setArcadeForcaScore(prev => prev + 20);
                  setUserCoins(prev => {
                    const multiplier = arcadeDifficulty === 'avancado' ? 2 : 1;
                    const newCoins = prev + (15 * multiplier);
                    localStorage.setItem('app-coins', newCoins);
                    return newCoins;
                  });
                }
                
                if (arcadeForcaCurrent + 1 < arcadeForcaList.length) {
                  setArcadeForcaCurrent(prev => prev + 1);
                  setArcadeForcaGuesses([]);
                  setArcadeForcaMistakes(0);
                  setArcadeForcaFeedback(null);
                } else {
                  setArcadeForcaGameOver(true);
                }
              };

              if (arcadeForcaGameOver) {
                return (
                  <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(217,119,6,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#d97706' }}>
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--orange)' }}>Fim do Jogo!</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '30px' }}>
                      Sua pontuação final: <strong style={{ color: 'var(--text-primary)' }}>{arcadeForcaScore} pontos</strong>
                    </p>
                    
                    <button className="btn-primary" onClick={() => {
                      setArcadeActiveGame('lobby');
                      setArcadeForcaCurrent(0);
                      setArcadeForcaScore(0);
                      setArcadeForcaGameOver(false);
                      setArcadeForcaGuesses([]);
                      setArcadeForcaMistakes(0);
                      setArcadeForcaFeedback(null);
                    }} style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '14px', width: '100%', maxWidth: '340px' }}>
                      Voltar ao Lobby
                    </button>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Header do Jogo */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <button onClick={() => setArcadeActiveGame('lobby')} className="arcade-back-btn" aria-label="Voltar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--orange)', background: 'rgba(249,115,22,0.12)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(249,115,22,0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        {arcadeForcaScore}
                      </div>
                      <div style={{ fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.12)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        {maxMistakes - arcadeForcaMistakes} vidas
                      </div>
                    </div>
                  </div>

                  {/* Dica da Palavra */}
                  <div className="arcade-tip-panel">
                    <div style={{ fontSize: '0.82rem', color: 'var(--orange)', fontWeight: 800, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Dica da Palavra ({arcadeForcaCurrent + 1} de {arcadeForcaList.length})
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      "{currentWordObj?.tip}"
                    </h3>
                  </div>

                  {/* Palavra Oculta */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
                    {word.split('').map((char, idx) => {
                      if (char === ' ') return <div key={idx} style={{ width: '100%', height: '8px' }}></div>;
                      const isRevealed = arcadeForcaGuesses.includes(char) || arcadeForcaFeedback === 'lost';
                      const isMissed = arcadeForcaFeedback === 'lost' && !arcadeForcaGuesses.includes(char);
                      
                      return (
                        <div key={idx} style={{
                          width: '40px', height: '52px', 
                          borderBottom: `3.5px solid ${darkMode ? '#ffffff' : '#111827'}`,
                          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                          fontSize: '1.85rem', fontWeight: 900, paddingBottom: '4px',
                          color: isMissed ? '#ef4444' : (darkMode ? '#ffffff' : '#111827')
                        }}>
                          {isRevealed ? char : ''}
                        </div>
                      );
                    })}
                  </div>

                  {/* Feedback Modal / Overlay */}
                  {arcadeForcaFeedback && (
                    <div style={{ 
                      background: arcadeForcaFeedback === 'won' ? (darkMode ? 'rgba(16,185,129,0.2)' : '#ecfdf5') : (darkMode ? 'rgba(239,68,68,0.2)' : '#fef2f2'), 
                      border: `2px solid ${arcadeForcaFeedback === 'won' ? '#10b981' : '#ef4444'}`, 
                      borderRadius: '16px', padding: '18px', textAlign: 'center', marginBottom: '20px' 
                    }}>
                      <h3 style={{ margin: '0 0 10px', color: arcadeForcaFeedback === 'won' ? '#10b981' : '#ef4444', fontSize: '1.35rem', fontWeight: 800 }}>
                        {arcadeForcaFeedback === 'won' ? 'Parabéns, você acertou!' : 'Que pena, você esgotou as vidas!'}
                      </h3>
                      <button className="btn-primary" onClick={handleNextWord} style={{ padding: '10px 24px', fontSize: '0.95rem', borderRadius: '12px' }}>
                        Próxima Palavra
                      </button>
                    </div>
                  )}

                  {/* Teclado Virtual (100% Legível no Modo Claro e Escuro) */}
                  {!arcadeForcaFeedback && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px' }}>
                      {ALPHABET.map((letter) => {
                        const isGuessed = arcadeForcaGuesses.includes(letter);
                        const isCorrect = isGuessed && word.includes(letter);
                        const isWrong = isGuessed && !word.includes(letter);
                        
                        let keyClass = '';
                        if (isCorrect) keyClass = 'correct';
                        else if (isWrong) keyClass = 'wrong';

                        return (
                          <button 
                            key={letter} 
                            onClick={() => handleGuess(letter)} 
                            disabled={isGuessed}
                            className={`forca-key ${keyClass}`}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ════════════ JOGO 4: CAÇA-PALAVRAS BÍBLICO ════════════ */}
            {arcadeActiveGame === 'cacapalavras' && (() => {
              const size = Math.sqrt(arcadeCacaGrade.length) || 10;
              
              const handleLetterClick = (id, r, c, char) => {
                if (arcadeCacaGameOver) return;
                
                let newSelected = [...arcadeCacaSelected];
                
                if (newSelected.length === 2) {
                  newSelected = [{ id, r, c, char }];
                } else if (newSelected.length === 1) {
                  newSelected.push({ id, r, c, char });
                  
                  const first = newSelected[0];
                  const second = newSelected[1];
                  
                  const rDiff = second.r - first.r;
                  const cDiff = second.c - first.c;
                  
                  const absR = Math.abs(rDiff);
                  const absC = Math.abs(cDiff);
                  if (first.r === second.r || first.c === second.c || absR === absC) {
                    const stepR = rDiff === 0 ? 0 : rDiff / Math.abs(rDiff);
                    const stepC = cDiff === 0 ? 0 : cDiff / Math.abs(cDiff);
                    
                    const length = Math.max(Math.abs(rDiff), Math.abs(cDiff)) + 1;
                    
                    let formedWord = "";
                    const formedIndices = [];
                    
                    for (let i = 0; i < length; i++) {
                      const currR = first.r + (i * stepR);
                      const currC = first.c + (i * stepC);
                      const cell = arcadeCacaGrade.find(c => c.r === currR && c.c === currC);
                      if (cell) {
                        formedWord += cell.char;
                        formedIndices.push(cell.id);
                      }
                    }
                    
                    const normalize = s => s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    const wordObj = arcadeCacaWords.find(w => normalize(w.word) === formedWord || normalize(w.word) === formedWord.split('').reverse().join(''));
                    
                    if (wordObj && !wordObj.found) {
                      const newFound = [...arcadeCacaFound, ...formedIndices];
                      setArcadeCacaFound(newFound);
                      
                      const newWords = arcadeCacaWords.map(w => normalize(w.word) === normalize(wordObj.word) ? { ...w, found: true } : w);
                      setArcadeCacaWords(newWords);
                      
                      const allFound = newWords.every(w => w.found);
                      if (allFound) {
                        setArcadeCacaScore(prev => prev + 50);
                        setUserCoins(prev => {
                          const multiplier = arcadeDifficulty === 'avancado' ? 2 : 1;
                          const newCoins = prev + (50 * multiplier);
                          localStorage.setItem('app-coins', newCoins);
                          return newCoins;
                        });
                        setTimeout(() => setArcadeCacaGameOver(true), 1000);
                      }
                    }
                  }
                  
                  setTimeout(() => setArcadeCacaSelected([]), 400);
                } else {
                  newSelected = [{ id, r, c, char }];
                }
                
                setArcadeCacaSelected(newSelected);
              };

              if (arcadeCacaGameOver) {
                return (
                  <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(5,150,105,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#059669' }}>
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--orange)' }}>Parabéns!</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '30px' }}>
                      Você encontrou todas as palavras e ganhou <strong style={{ color: 'var(--text-primary)' }}>50 ChaminhaCoins</strong>!
                    </p>
                    
                    <button className="btn-primary" onClick={() => {
                      setArcadeActiveGame('lobby');
                      setArcadeCacaGrade([]);
                      setArcadeCacaWords([]);
                      setArcadeCacaFound([]);
                      setArcadeCacaSelected([]);
                      setArcadeCacaGameOver(false);
                    }} style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '14px', width: '100%', maxWidth: '340px' }}>
                      Voltar ao Lobby
                    </button>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Header do Jogo */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <button onClick={() => setArcadeActiveGame('lobby')} className="arcade-back-btn" aria-label="Voltar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--orange)', background: 'rgba(249,115,22,0.12)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(249,115,22,0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        {arcadeCacaWords.filter(w => w.found).length} / {arcadeCacaWords.length}
                      </div>
                    </div>
                  </div>

                  {/* Instrução */}
                  <div style={{ textAlign: 'center', marginBottom: '14px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Toque na 1ª e na última letra da palavra para selecioná-la
                  </div>

                  {/* Grade */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: `repeat(${size}, 1fr)`, 
                    gap: '4px', 
                    background: darkMode ? 'rgba(0,0,0,0.3)' : '#f3f4f6', 
                    border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#d1d5db'}`,
                    padding: '8px', 
                    borderRadius: '16px',
                    marginBottom: '20px'
                  }}>
                    {arcadeCacaGrade.map((cell) => {
                      const isFound = arcadeCacaFound.includes(cell.id);
                      const isSelected = arcadeCacaSelected.some(s => s.id === cell.id);
                      
                      let cellBg = darkMode ? 'rgba(255,255,255,0.06)' : '#ffffff';
                      let cellColor = darkMode ? '#ffffff' : '#111827';
                      let cellWeight = 700;
                      
                      if (isFound) {
                        cellBg = '#f97316';
                        cellColor = '#ffffff';
                        cellWeight = 900;
                      } else if (isSelected) {
                        cellBg = '#10b981';
                        cellColor = '#ffffff';
                        cellWeight = 900;
                      }

                      return (
                        <div 
                          key={cell.id} 
                          onClick={() => handleLetterClick(cell.id, cell.r, cell.c, cell.char)}
                          style={{
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: cellBg,
                            color: cellColor,
                            fontWeight: cellWeight,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: size > 12 ? '1rem' : '1.15rem',
                            userSelect: 'none',
                            boxShadow: isFound || isSelected ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {cell.char}
                        </div>
                      );
                    })}
                  </div>

                  {/* Lista de Palavras */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {arcadeCacaWords.map((w, idx) => (
                      <div key={idx} style={{ 
                        padding: '6px 14px', 
                        borderRadius: '20px', 
                        background: w.found ? (darkMode ? 'rgba(249,115,22,0.2)' : '#ffedd5') : (darkMode ? 'rgba(255,255,255,0.08)' : '#ffffff'),
                        border: `1px solid ${w.found ? '#f97316' : (darkMode ? 'rgba(255,255,255,0.1)' : '#d1d5db')}`,
                        color: w.found ? '#ea580c' : (darkMode ? '#ffffff' : '#1f2937'),
                        textDecoration: w.found ? 'line-through' : 'none',
                        fontWeight: 700,
                        fontSize: '0.82rem'
                      }}>
                        {w.word}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ════════════ JOGO 5: JOGO DA MEMÓRIA BÍBLICO (ARCA DE NOÉ) ════════════ */}
            {arcadeActiveGame === 'memoria' && (() => {
              const handleCardClick = (index) => {
                if (arcadeMemoriaFlipped.length === 2) return;
                if (arcadeMemoriaFlipped.includes(index)) return;
                const clickedCard = arcadeMemoriaCards[index];
                if (arcadeMemoriaMatched.includes(clickedCard.cardId)) return;

                const newFlipped = [...arcadeMemoriaFlipped, index];
                setArcadeMemoriaFlipped(newFlipped);

                if (newFlipped.length === 2) {
                  setArcadeMemoriaMoves(prev => prev + 1);
                  const firstCard = arcadeMemoriaCards[newFlipped[0]];
                  const secondCard = arcadeMemoriaCards[newFlipped[1]];

                  if (firstCard.cardId === secondCard.cardId) {
                    const newMatched = [...arcadeMemoriaMatched, firstCard.cardId];
                    setArcadeMemoriaMatched(newMatched);
                    setArcadeMemoriaFlipped([]);

                    if (newMatched.length === 8) {
                      setUserCoins(prev => {
                        const newCoins = prev + 25;
                        localStorage.setItem('app-coins', newCoins);
                        return newCoins;
                      });
                      setTimeout(() => setArcadeMemoriaGameOver(true), 600);
                    }
                  } else {
                    setTimeout(() => {
                      setArcadeMemoriaFlipped([]);
                    }, 850);
                  }
                }
              };

              const renderIcon = (type, color) => {
                if (type === 'boat') {
                  return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 19h20M4 19l2-7h12l2 7M12 4v8M12 4l5 3-5 3" />
                    </svg>
                  );
                }
                if (type === 'dove') {
                  return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 4a5 5 0 0 1 5 5c0 3.5-3 6-7 9-4-3-7-5.5-7-9a5 5 0 0 1 9-2.5" />
                      <path d="M14 9l4-3M16 11l4-1" />
                    </svg>
                  );
                }
                if (type === 'sheep') {
                  return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="12" r="3.5" /><circle cx="15" cy="12" r="3.5" /><circle cx="12" cy="9" r="3.5" /><circle cx="12" cy="15" r="3.5" />
                    </svg>
                  );
                }
                if (type === 'music') {
                  return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                    </svg>
                  );
                }
                if (type === 'fish') {
                  return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6z" />
                      <path d="M18 12l4-3v6z" /><circle cx="9.5" cy="10.5" r="1" fill={color} />
                    </svg>
                  );
                }
                if (type === 'book') {
                  return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  );
                }
                if (type === 'cross') {
                  return (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="2" x2="12" y2="22" /><line x1="7" y1="8" x2="17" y2="8" />
                    </svg>
                  );
                }
                return (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  </svg>
                );
              };

              if (arcadeMemoriaGameOver) {
                return (
                  <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(2,132,199,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#0284c7' }}>
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--orange)' }}>Glória a Deus!</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '8px' }}>
                      Você salvou todos os símbolos da Arca em <strong style={{ color: 'var(--text-primary)' }}>{arcadeMemoriaMoves} tentativas</strong>!
                    </p>
                    <p style={{ color: '#10b981', fontSize: '1rem', fontWeight: 700, marginBottom: '30px' }}>
                      +25 ChaminhaCoins adicionadas à sua conta!
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                      <button className="btn-primary" onClick={() => {
                        setArcadeMemoriaCards(generateMemoriaDeck());
                        setArcadeMemoriaFlipped([]);
                        setArcadeMemoriaMatched([]);
                        setArcadeMemoriaMoves(0);
                        setArcadeMemoriaGameOver(false);
                      }} style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '14px', width: '100%', maxWidth: '340px' }}>
                        Jogar Novamente
                      </button>
                      <button onClick={() => setArcadeActiveGame('lobby')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '10px 20px', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>
                        Voltar ao Lobby
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Header do Jogo */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <button onClick={() => setArcadeActiveGame('lobby')} className="arcade-back-btn" aria-label="Voltar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', background: darkMode ? 'rgba(255,255,255,0.08)' : '#f3f4f6', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-color, #e5e7eb)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                        {arcadeMemoriaMoves} tentativas
                      </div>
                      <div style={{ fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.12)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        {arcadeMemoriaMatched.length} / 8 pares
                      </div>
                    </div>
                  </div>

                  {/* Instrução */}
                  <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Encontre os 8 pares dos animais e símbolos sagrados da Arca
                  </div>

                  {/* Grade 4x4 de Cartas */}
                  <div className="memoria-grid">
                    {arcadeMemoriaCards.map((card, idx) => {
                      const isFlipped = arcadeMemoriaFlipped.includes(idx);
                      const isMatched = arcadeMemoriaMatched.includes(card.cardId);
                      const isOpen = isFlipped || isMatched;

                      return (
                        <div 
                          key={card.uniqueId} 
                          className="memoria-card-container"
                          onClick={() => handleCardClick(idx)}
                        >
                          <div className={`memoria-card-inner ${isOpen ? 'flipped' : ''}`}>
                            {/* Frente da Carta (Oculta) */}
                            <div className="memoria-card-front">
                              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--orange, #f97316)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v12M6 12h12" />
                              </svg>
                            </div>

                            {/* Verso da Carta (Revelada) */}
                            <div 
                              className="memoria-card-back"
                              style={{
                                background: darkMode ? card.bgDark : card.bgLight,
                                borderColor: isMatched ? '#10b981' : card.color
                              }}
                            >
                              {renderIcon(card.iconType, card.color)}
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: darkMode ? '#ffffff' : '#111827', marginTop: '4px', textAlign: 'center', lineHeight: 1.1 }}>
                                {card.name}
                              </span>
                              <span style={{ fontSize: '0.58rem', fontWeight: 600, color: card.color, marginTop: '2px' }}>
                                {card.verse}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {activeTab === 'trail' && (
          <div className="page-enter animate-fade-in" style={{ paddingBottom: '100px' }}>
            <TrailHome
              onBack={() => setActiveTab('dashboard')}
              userCoins={userCoins}
              setUserCoins={setUserCoins}
            />
          </div>
        )}

        {activeTab === 'lojinha' && (
          <div className="lojinha-container" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
            
            {/* Chaminha no topo da lojinha com layout horizontal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '32px', padding: '0 12px' }}>
              <ChaminhaVideo size={80} style={{ flexShrink: 0 }} />
              <div className="glass-panel animate-fade-in" style={{
                padding: '12px 18px',
                borderRadius: '16px',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative',
                maxWidth: '360px',
                background: 'rgba(255, 255, 255, 0.02)'
              }}>
                <div style={{
                  position: 'absolute', top: '50%', left: '-6px', transform: 'translateY(-50%) rotate(45deg)',
                  width: '10px', height: '10px', background: 'var(--bg-app)', borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)', zIndex: 1
                }} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sp-green, #1ED760)" strokeWidth="2" style={{display:"inline-block", verticalAlign:"middle", marginRight:4}}><path d="M12 2c1.1 4 4.5 6 4.5 10a6.5 6.5 0 0 1-13 0c0-4 3.4-6 4.5-10 1 2 2.5 3 4 0z"/></svg> <strong>Chaminha:</strong> "Bem-vindo à minha Lojinha! Use suas Chaminhas para liberar fundos lindos e fontes incríveis!"
              </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '2rem', color: 'var(--orange)', marginBottom: '8px' }}>Lojinha 1Convite</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Use suas moedas ganhas para desbloquear itens exclusivos para o Studio de Cards!</p>
              <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,158,11,0.15)', padding: '12px 24px', borderRadius: '30px', border: '1px solid var(--orange)' }}>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Seu saldo:</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'1.5rem', fontWeight:'bold', color:'var(--orange)' }}><ChaminhaCoin size={28}/> {userCoins}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {LOJINHA_ITEMS.map(item => {
                const isUnlocked = unlockedItems.includes(item.id);
                return (
                  <div key={item.id} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: isUnlocked ? '1px solid var(--orange)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '16px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'transform 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {isUnlocked && (
                      <div style={{ position: 'absolute', top: 6, right: 6, background: 'var(--orange)', color: '#fff', padding: '2px 8px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 'bold' }}>
                        ADQUIRIDO
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '48px', marginTop: isUnlocked ? '10px' : '0' }}>{item.icon}</div>
                    <h3 style={{ fontSize: '0.95rem', margin: 0, textAlign: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center', flex: 1, margin: 0, lineHeight: '1.3' }}>{item.desc}</p>
                    
                    <button
                      onClick={() => {
                        if (isUnlocked) return;
                        if (userCoins >= item.price) {
                          setUserCoins(prev => {
                            const val = prev - item.price;
                            localStorage.setItem('app-coins', val);
                            return val;
                          });
                          setUnlockedItems(prev => {
                            const arr = [...prev, item.id];
                            localStorage.setItem('unlocked-items', JSON.stringify(arr));
                            return arr;
                          });
                          alert('Compra realizada com sucesso! O item já está disponível no Studio de Cards.');
                        } else {
                          alert('Moedas insuficientes! Jogue mais Arcade ou complete o Desafio do Dia para ganhar mais moedas.');
                        }
                      }}
                      disabled={isUnlocked}
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        padding: '10px 6px',
                        borderRadius: '10px',
                        border: 'none',
                        background: isUnlocked ? 'rgba(255,255,255,0.1)' : (userCoins >= item.price ? 'var(--orange)' : 'rgba(255,255,255,0.05)'),
                        color: isUnlocked ? 'var(--text-secondary)' : (userCoins >= item.price ? '#fff' : 'var(--text-secondary)'),
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        cursor: isUnlocked ? 'default' : (userCoins >= item.price ? 'pointer' : 'not-allowed'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {isUnlocked ? 'Já Possui' : <span style={{display:'inline-flex',alignItems:'center',gap:'4px'}}><ChaminhaCoin size={14}/> {item.price}</span>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════ ABA MINI-APP: CAFÉ COM DEUS (365 DIAS) ════════════ */}
        {activeTab === 'cafe-com-deus' && (
          <CafeComDeusView 
            onBack={() => setActiveTab('dashboard')} 
            isPremium={isPremiumUser}
            onOpenUpgrade={() => setShowUpgradeModal(true)}
            isDarkMode={darkMode}
            initialStep={cafeInitialStep || 1}
            onNavigateTemplo={() => setActiveTab('treino-templo')}
          />
        )}

        {/* ════════════ ABA ESPAÇO MULHER VIRTUOSA (PREMIUM) ════════════ */}
        {activeTab === 'mulher-virtuosa' && (
          <MulherVirtuosaView 
            onBack={() => setActiveTab('dashboard')}
            userContact={profileEmail || 'convidado@1convite.com.br'}
          />
        )}

        {/* ════════════ ABA BIBLIOTECA DO PREGADOR (PREMIUM) ════════════ */}
        {activeTab === 'biblioteca-pregador' && (
          <BibliotecaPregadorView 
            onBack={() => setActiveTab('dashboard')}
            userContact={profileEmail || 'convidado@1convite.com.br'}
          />
        )}

        {/* ════════════ ABA E-BOOKS & LIVROS DIGITAIS (PREMIUM) ════════════ */}
        {activeTab === 'ebooks-premium' && (
          <BibliotecaEbooksView 
            onBack={() => setActiveTab('dashboard')} 
          />
        )}

        {/* ════════════ ABA I.D.E. BOAS NOTÍCIAS (28 AULAS + PODCAST PEDRO & LÍVIA) ════════════ */}
        {activeTab === 'ide-estudos' && (
          <IdeEstudosView
            userEmail={profileEmail}
            userName={profileName}
            onBack={() => setActiveTab('dashboard')}
            onOpenBible={() => {
              setActiveTab('biblia');
              setBibleViewMode('reading');
              setBibleSelectedVerse(null);
            }}
          />
        )}

        {/* ════════════ ABA CONVITES VIP (CONTROLE E COMPRA DE CONVITES) ════════════ */}
        {activeTab === 'convites-vip' && (
          <ConvitesVipView
            userEmail={profileEmail}
            userName={profileName}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {/* ════════════ ABA TEMPLOFIT (OPENGYM INTEGRADO + TURSO) ════════════ */}
        {activeTab === 'treino-templo' && (
          <TreinoTemploView 
            onBack={() => setActiveTab('dashboard')}
            userContact={profileEmail || 'convidado@1convite.com.br'}
            onEarnCoins={handleEarnCoins}
          />
        )}

        {/* ════════════ ABA PAINEL ADM INTEGRADO AO LAYOUT ════════════ */}
        {activeTab === 'admin-panel' && (isAdminMode || adminAuthService.isCurrentSessionAdmin() || (profileEmail || '').trim().toLowerCase() === 'jonatasprojetos2013@gmail.com') && (
          <AdminPanel
            onOpenApp={() => setActiveTab('dashboard')}
            onOpenLanding={() => navigateAppRoute(false)}
            onLogout={handleLogout}
          />
        )}

        </Suspense>
      </main>

      {/* ════════════ MODAL DE UPGRADE & RESGATE DE VOUCHER ════════════ */}
      <Suspense fallback={null}>
        <UpgradeVoucherModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onActivatePremium={(code) => {
            setIsPremiumUser(true);
            try {
              localStorage.setItem('1convite-premium', 'true');
              localStorage.setItem('1convite-voucher-used', code);
            } catch (e) {
              console.error(e);
            }
          }}
        />
        {/* Modais Legais e Banner LGPD */}
        {legalModalTab && (
          <LegalModalPage initialTab={legalModalTab} onClose={() => setLegalModalTab(null)} />
        )}
        <AsaasCheckoutModal
          isOpen={Boolean(unlockOfferId)}
          offerId={unlockOfferId}
          onClose={() => setUnlockOfferId(null)}
          onSuccess={(data) => {
            if (Array.isArray(data?.entitlements)) {
              setUserEntitlements((prev) => Array.from(new Set([...prev, ...data.entitlements])));
            }
          }}
        />
      </Suspense>
      <LgpdBanner onOpenLegal={(tab) => setLegalModalTab(tab)} />

      {/* Modal Visualizador de Papel de Parede (Compatível com Android WebView / iOS / PC) */}
      {previewWallpaper && (
        <div
          onClick={() => setPreviewWallpaper(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(10px)', zIndex: 10060,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '400px', background: '#121215',
              border: '1px solid rgba(255,255,255,0.14)', borderRadius: '20px',
              padding: '20px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1rem' }}>{previewWallpaper.title}</strong>
              <button
                type="button"
                onClick={() => setPreviewWallpaper(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none',
                  width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <img
              src={previewWallpaper.url}
              alt={previewWallpaper.alt}
              style={{
                width: '100%', maxHeight: '52vh', objectFit: 'contain',
                borderRadius: '12px', background: '#070A10'
              }}
            />
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#a1a1aa', textAlign: 'center', lineHeight: 1.4 }}>
              Qualidade <strong>4K</strong> • No celular, toque em <strong>Baixar 4K</strong> ou segure na imagem acima para salvar.
            </p>
            {wallpaperStatus && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.14)', border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399', borderRadius: '10px', padding: '8px 12px', fontSize: '0.78rem',
                fontWeight: '700', textAlign: 'center'
              }}>
                {wallpaperStatus}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={async () => {
                  const fileName = previewWallpaper.url.split('/').pop();
                  setWallpaperStatus('Preparando imagem 4K...');
                  const res = await saveOrShareImage({
                    url: previewWallpaper.url,
                    fileName: previewWallpaper.filename || fileName,
                    title: previewWallpaper.title,
                    isCapacitor,
                  });
                  if (res.ok) {
                    setWallpaperStatus('Pronto! Escolha "Salvar imagem" ou seu app.');
                    return;
                  }
                  setWallpaperStatus('Iniciando download 4K...');
                  window.location.assign(`${API_BASE}/download-wallpaper/${encodeURIComponent(fileName)}`);
                }}
                style={{
                  minHeight: '46px', borderRadius: '12px', border: 'none',
                  background: '#F97316', color: '#fff', fontWeight: '800', fontSize: '0.82rem', cursor: 'pointer'
                }}
              >
                Salvar / Compartilhar
              </button>
              <button
                type="button"
                onClick={() => {
                  const fileName = previewWallpaper.url.split('/').pop();
                  setWallpaperStatus('Baixando imagem 4K...');
                  window.location.assign(`${API_BASE}/download-wallpaper/${encodeURIComponent(fileName)}`);
                }}
                style={{
                  minHeight: '46px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: '700', fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Baixar 4K
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
