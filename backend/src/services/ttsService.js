import { EdgeTTS } from 'node-edge-tts';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretório de cache de áudio para evitar regeração desnecessária
const CACHE_DIR = path.join(__dirname, '../../.audio_cache');
if (!fs.existsSync(CACHE_DIR)) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch (_) {}
}

// Cache em memória para os últimos 50 áudios gerados
const memoryCache = new Map();

/**
 * Limpa o texto para garantir uma pronúncia natural e sem artefatos
 */
export function sanitizeTextForTTS(text) {
  if (!text) return '';
  return text
    // Remove cabeçalhos markdown e asteriscos
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    // Substitui traços e marcadores por pausas naturais
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s*–\s*/g, ', ')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove múltiplos espaços e quebras repetidas
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Sintetiza o texto em áudio neural MP3 de alta fidelidade
 * @param {object} options
 * @param {string} options.text - Texto a ser falado
 * @param {string} [options.voice='pt-BR-FranciscaNeural'] - Voz neural ('pt-BR-FranciscaNeural' ou 'pt-BR-AntonioNeural')
 * @param {string} [options.rate='-4%'] - Ajuste de velocidade (-50% a +50%)
 * @param {string} [options.pitch='0%'] - Ajuste de tom
 * @returns {Promise<Buffer>} Buffer binário do arquivo MP3
 */
export async function synthesizeNeuralTTS({ text, voice = 'pt-BR-FranciscaNeural', rate = '-4%', pitch = '0%' }) {
  const clean = sanitizeTextForTTS(text);
  if (!clean) {
    throw new Error('Texto vazio para síntese de áudio.');
  }

  // Validação de voz autorizada
  const allowedVoices = ['pt-BR-FranciscaNeural', 'pt-BR-AntonioNeural', 'pt-BR-BrendaNeural', 'pt-BR-DonatoNeural'];
  const selectedVoice = allowedVoices.includes(voice) ? voice : 'pt-BR-FranciscaNeural';

  // Chave de cache baseada em hash MD5 do conteúdo + parâmetros
  const cacheKey = crypto.createHash('md5').update(`${selectedVoice}:${rate}:${pitch}:${clean}`).digest('hex');
  const cacheFilePath = path.join(CACHE_DIR, `${cacheKey}.mp3`);

  // 1. Verifica cache em memória
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  // 2. Verifica cache em disco
  if (fs.existsSync(cacheFilePath)) {
    try {
      const buffer = fs.readFileSync(cacheFilePath);
      memoryCache.set(cacheKey, buffer);
      return buffer;
    } catch (_) {}
  }

  // 3. Sintetiza via Microsoft Edge Neural TTS
  const tempFile = path.join(CACHE_DIR, `temp_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`);
  try {
    const tts = new EdgeTTS({
      voice: selectedVoice,
      lang: 'pt-BR',
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
    });

    await tts.ttsPromise(clean, tempFile);

    const audioBuffer = fs.readFileSync(tempFile);

    // Salva no cache permanente e na memória
    try {
      fs.renameSync(tempFile, cacheFilePath);
    } catch (_) {
      try { fs.writeFileSync(cacheFilePath, audioBuffer); } catch (e) {}
    }

    // Gerencia tamanho do cache em memória (máx 50 itens)
    if (memoryCache.size >= 50) {
      const firstKey = memoryCache.keys().next().value;
      memoryCache.delete(firstKey);
    }
    memoryCache.set(cacheKey, audioBuffer);

    return audioBuffer;
  } finally {
    // Garante remoção do arquivo temporário se ainda existir
    if (fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch (_) {}
    }
  }
}
