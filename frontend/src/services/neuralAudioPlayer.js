// ═════════════════════════════════════════════════════════════════════
// MOTOR DE ÁUDIO NEURAL NATURAL (ESTÚDIO & DEVOCIONAL)
// ═════════════════════════════════════════════════════════════════════
// Elimina vozes robóticas reproduzindo áudio natural de alta definição (MP3)
// em celulares (Android/iOS) e navegadores desktop (Chrome/Edge/Firefox).
// ═════════════════════════════════════════════════════════════════════

let currentAudio = null;
let currentSessionId = 0;
let isPlayingInternal = false;

// Divide o texto em fragmentos naturais de fala respeitando pontuações (máx ~160 chars)
function splitIntoNaturalChunks(text) {
  if (!text) return [];
  // Limpa espaços extras e quebras excessivas
  const clean = text.replace(/\s+/g, ' ').trim();
  
  // Divide por pontuação forte ou pausas naturais
  const rawSentences = clean.match(/[^.!?:]+[.!?:]+/g) || [clean];
  const chunks = [];

  for (let s of rawSentences) {
    s = s.trim();
    if (!s) continue;
    
    // Se a sentença for maior que 160 caracteres, divide por vírgula ou ponto-e-vírgula
    if (s.length > 160) {
      const subParts = s.split(/([,;]|\s+e\s+|\s+mas\s+)/);
      let buffer = '';
      for (const p of subParts) {
        if ((buffer + p).length > 160 && buffer.trim()) {
          chunks.push(buffer.trim());
          buffer = p;
        } else {
          buffer += p;
        }
      }
      if (buffer.trim()) chunks.push(buffer.trim());
    } else {
      chunks.push(s);
    }
  }

  return chunks.filter(c => c.length > 0);
}

// Gera a URL de áudio natural MP3 do Google TTS Neural (pt-BR)
function getAudioUrl(textChunk) {
  const encoded = encodeURIComponent(textChunk);
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=pt-BR&client=tw-ob&q=${encoded}`;
}

// Fallback com Web Speech API usando a melhor voz neural disponível
function speakWithBestNativeVoice(text, sessionId, onEnd, onError) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.88; // Cadência calma e meditativa
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices() || [];
    const ptVoices = voices.filter(v => v.lang && (v.lang.includes('pt-BR') || v.lang.includes('pt_BR') || v.lang.startsWith('pt')));
    
    // Prioriza vozes neurais e de alta fidelidade
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
        isPlayingInternal = false;
        if (onEnd) onEnd();
      }
    };

    utterance.onerror = (e) => {
      if (sessionId === currentSessionId) {
        isPlayingInternal = false;
        if (onError) onError(e);
      }
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    isPlayingInternal = false;
    if (onEnd) onEnd();
  }
}

/**
 * Reproduz o texto com voz neural natural em sequência contínua
 * @param {string} text - Texto completo da reflexão ou oração
 * @param {object} callbacks - { onStart, onEnd, onChunkChange, onError }
 */
export function playNeuralSpeech(text, callbacks = {}) {
  const { onStart, onEnd, onChunkChange, onError } = callbacks;

  // Interrompe qualquer reprodução anterior
  stopNeuralSpeech();

  const sessionId = ++currentSessionId;
  const chunks = splitIntoNaturalChunks(text);

  if (chunks.length === 0) {
    if (onEnd) onEnd();
    return;
  }

  isPlayingInternal = true;
  if (onStart) onStart();

  let currentIndex = 0;

  // Função interna que toca o chunk da vez e pré-carrega o seguinte
  const playNextChunk = () => {
    if (sessionId !== currentSessionId) return;

    if (currentIndex >= chunks.length) {
      isPlayingInternal = false;
      currentAudio = null;
      if (onEnd) onEnd();
      return;
    }

    const chunk = chunks[currentIndex];
    if (onChunkChange) onChunkChange(currentIndex, chunks.length, chunk);

    const url = getAudioUrl(chunk);
    const audio = new Audio(url);
    currentAudio = audio;

    // Pré-carrega o próximo áudio para transição instantânea
    if (currentIndex + 1 < chunks.length) {
      const nextUrl = getAudioUrl(chunks[currentIndex + 1]);
      const preloadAudio = new Audio();
      preloadAudio.src = nextUrl;
      preloadAudio.preload = 'auto';
    }

    audio.onended = () => {
      if (sessionId === currentSessionId) {
        currentIndex++;
        // Pequena pausa natural de 150ms entre frases para respiração
        setTimeout(playNextChunk, 150);
      }
    };

    audio.onerror = (err) => {
      console.warn('[NeuralTTS] Falha ao carregar áudio MP3, acionando voz nativa calibrada:', err);
      // Se o endpoint MP3 for bloqueado no dispositivo, usa o fallback nativo com a melhor voz pt-BR
      const remainingText = chunks.slice(currentIndex).join(' ');
      speakWithBestNativeVoice(remainingText, sessionId, onEnd, onError);
    };

    audio.play().catch(playErr => {
      console.warn('[NeuralTTS] Autoplay restrito ou erro no play, acionando fallback nativo:', playErr);
      const remainingText = chunks.slice(currentIndex).join(' ');
      speakWithBestNativeVoice(remainingText, sessionId, onEnd, onError);
    });
  };

  playNextChunk();
}

/**
 * Interrompe imediatamente qualquer áudio ou voz neural em execução
 */
export function stopNeuralSpeech() {
  currentSessionId++;
  isPlayingInternal = false;

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (_) {}
    currentAudio = null;
  }

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
}

/**
 * Retorna se o motor está reproduzindo áudio no momento
 */
export function isNeuralSpeaking() {
  return isPlayingInternal;
}
