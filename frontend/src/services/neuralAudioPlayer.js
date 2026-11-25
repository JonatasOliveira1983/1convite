// ═════════════════════════════════════════════════════════════════════
// MOTOR DE ÁUDIO NEURAL NATURAL (MICROSOFT EDGE TTS + SOM AMBIENTE)
// ═════════════════════════════════════════════════════════════════════
// Elimina vozes robóticas reproduzindo voz humana de estúdio (MP3)
// com ambientação suave de piano para meditações e orações no 1Convite.
// ═════════════════════════════════════════════════════════════════════

let currentAudio = null;
let currentAmbientAudio = null;
let currentSessionId = 0;
let isPlayingInternal = false;
let isPausedInternal = false;
let currentBlobUrl = null;

const getTtsEndpoint = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return '/api/v1/tts/synthesize';
    }
  }
  return 'https://oneconvite.onrender.com/api/v1/tts/synthesize';
};

// Fallback nativo calibrado em caso de falta de conexão
function speakWithBestNativeVoice(text, sessionId, onEnd, onError) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_`]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices() || [];
    const ptVoices = voices.filter(v => v.lang && (v.lang.includes('pt-BR') || v.lang.includes('pt_BR') || v.lang.startsWith('pt')));
    const bestVoice = ptVoices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Natural') || 
      v.name.includes('Francisca') || 
      v.name.includes('Online')
    ) || ptVoices[0];

    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onend = () => {
      if (sessionId === currentSessionId) {
        stopAmbientSound();
        isPlayingInternal = false;
        if (onEnd) onEnd();
      }
    };

    utterance.onerror = (e) => {
      if (sessionId === currentSessionId) {
        stopAmbientSound();
        isPlayingInternal = false;
        if (onError) onError(e);
      }
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    stopAmbientSound();
    isPlayingInternal = false;
    if (onEnd) onEnd();
  }
}

// Inicia música ambiente suave (Piano)
function startAmbientSound(volume = 0.12) {
  try {
    if (!currentAmbientAudio) {
      currentAmbientAudio = new Audio('/piano.mp3');
      currentAmbientAudio.loop = true;
    }
    currentAmbientAudio.volume = volume;
    currentAmbientAudio.play().catch(() => {
      // Autoplay de som secundário pode ser ignorado sem interromper a voz
    });
  } catch (_) {}
}

// Interrompe música ambiente com fade out suave
function stopAmbientSound() {
  if (currentAmbientAudio) {
    try {
      const audio = currentAmbientAudio;
      let vol = audio.volume;
      const fadeInterval = setInterval(() => {
        vol = Math.max(0, vol - 0.03);
        audio.volume = vol;
        if (vol <= 0.01) {
          clearInterval(fadeInterval);
          audio.pause();
          audio.currentTime = 0;
        }
      }, 50);
    } catch (_) {
      try {
        currentAmbientAudio.pause();
        currentAmbientAudio.currentTime = 0;
      } catch (e) {}
    }
  }
}

/**
 * Reproduz o texto com voz neural natural em MP3 e trilha instrumental suave
 * @param {string} text - Texto completo
 * @param {object} options - Opções e callbacks
 * @param {string} [options.voice='pt-BR-FranciscaNeural'] - 'pt-BR-FranciscaNeural' ou 'pt-BR-AntonioNeural'
 * @param {string} [options.rate='-4%'] - Velocidade de leitura meditativa
 * @param {boolean} [options.ambient=true] - Ativar piano suave de fundo
 * @param {number} [options.ambientVolume=0.12] - Volume da música ambiente
 * @param {function} [options.onStart]
 * @param {function} [options.onEnd]
 * @param {function} [options.onProgress] - (currentTime, duration, percent)
 * @param {function} [options.onError]
 */
export async function playNeuralSpeech(text, options = {}) {
  const {
    voice = 'pt-BR-FranciscaNeural',
    rate = '-4%',
    ambient = true,
    ambientVolume = 0.12,
    onStart,
    onEnd,
    onProgress,
    onError
  } = options;

  stopNeuralSpeech();

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  const sessionId = ++currentSessionId;
  isPlayingInternal = true;
  isPausedInternal = false;

  if (onStart) onStart();

  // Inicia som ambiente se solicitado
  if (ambient) {
    startAmbientSound(ambientVolume);
  }

  // Tenta obter o áudio sintetizado via API do Cloudflare Pages / Render
  try {
    let response;
    const requestBody = JSON.stringify({ text, voice, rate });
    const targetEndpoint = getTtsEndpoint();

    try {
      response = await fetch(targetEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      });
    } catch (netErr) {
      console.warn('[NeuralTTS] Erro de rede no endpoint primário:', netErr);
    }

    if (!response || !response.ok) {
      throw new Error(`Falha no servidor de áudio neural: ${response?.status || 'desconectado'}`);
    }

    const audioBlob = await response.blob();
    if (sessionId !== currentSessionId) return;

    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
    }
    currentBlobUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(currentBlobUrl);
    currentAudio = audio;

    // Monitora progresso da narração
    audio.ontimeupdate = () => {
      if (sessionId === currentSessionId && onProgress && audio.duration) {
        onProgress(audio.currentTime, audio.duration, (audio.currentTime / audio.duration) * 100);
      }
    };

    audio.onended = () => {
      if (sessionId === currentSessionId) {
        isPlayingInternal = false;
        stopAmbientSound();
        if (onEnd) onEnd();
      }
    };

    audio.onerror = (err) => {
      console.warn('[NeuralTTS] Erro no áudio recebido, usando voz nativa:', err);
      speakWithBestNativeVoice(text, sessionId, onEnd, onError);
    };

    await audio.play();

    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: 'Café com Deus • Meditação Diária',
          artist: '1Convite',
          album: 'A Palavra Viva',
          artwork: [{ src: '/og-1convite.jpg', sizes: '1200x630', type: 'image/jpeg' }],
        });
        navigator.mediaSession.playbackState = 'playing';
        navigator.mediaSession.setActionHandler('play', () => resumeNeuralSpeech());
        navigator.mediaSession.setActionHandler('pause', () => pauseNeuralSpeech());
        navigator.mediaSession.setActionHandler('stop', () => stopNeuralSpeech());
      } catch (_) {}
    }

  } catch (error) {
    console.warn('[NeuralTTS] Backend indisponível ou offline. Ativando voz nativa de fallback:', error);
    speakWithBestNativeVoice(text, sessionId, onEnd, onError);
  }
}

/**
 * Pausa a reprodução atual
 */
export function pauseNeuralSpeech() {
  isPausedInternal = true;
  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    try { navigator.mediaSession.playbackState = 'paused'; } catch (_) {}
  }
  if (currentAudio) {
    try { currentAudio.pause(); } catch (_) {}
  }
  if (currentAmbientAudio) {
    try { currentAmbientAudio.pause(); } catch (_) {}
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try { window.speechSynthesis.pause(); } catch (_) {}
  }
}

/**
 * Retoma a reprodução pausada
 */
export function resumeNeuralSpeech() {
  isPausedInternal = false;
  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    try { navigator.mediaSession.playbackState = 'playing'; } catch (_) {}
  }
  if (currentAudio) {
    try { currentAudio.play(); } catch (_) {}
  }
  if (currentAmbientAudio) {
    try { currentAmbientAudio.play(); } catch (_) {}
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try { window.speechSynthesis.resume(); } catch (_) {}
  }
}

/**
 * Interrompe imediatamente qualquer áudio em execução
 */
export function stopNeuralSpeech() {
  currentSessionId++;
  isPlayingInternal = false;
  isPausedInternal = false;
  if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
    try { navigator.mediaSession.playbackState = 'none'; } catch (_) {}
  }

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (_) {}
    currentAudio = null;
  }

  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }

  stopAmbientSound();

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
}

/**
 * Retorna se o áudio neural está tocando no momento
 */
export function isNeuralSpeaking() {
  return isPlayingInternal && !isPausedInternal;
}
