import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * Copia texto com fallback para WebViews Android onde navigator.clipboard pode falhar.
 */
export async function copyTextSafe(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback abaixo
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

/**
 * Salva ou compartilha imagem (Wallpaper 4K ou Card gerado em base64) no Capacitor, Mobile Browser e Desktop.
 */
export async function saveOrShareImage({ dataUrl, url, fileName = '1convite-imagem.jpg', title = '1Convite', isCapacitor = false }) {
  try {
    let base64Data = '';
    let blob = null;

    if (dataUrl) {
      base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      const res = await fetch(dataUrl);
      blob = await res.blob();
    } else if (url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Falha ao carregar imagem');
      blob = await res.blob();
      base64Data = await blobToBase64(blob);
    }

    if (isCapacitor && base64Data) {
      const saved = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });
      await Share.share({
        title,
        text: title,
        url: saved.uri,
        dialogTitle: 'Salvar ou Compartilhar Imagem',
      });
      return { ok: true, mode: 'capacitor-share' };
    }

    if (blob && navigator.share && navigator.canShare) {
      const mime = blob.type || 'image/jpeg';
      const file = new File([blob], fileName, { type: mime });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title });
        return { ok: true, mode: 'web-share' };
      }
    }

    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { ok: true, mode: 'anchor-download' };
    }
  } catch (err) {
    console.warn('[mobileActions] Fallback para download direto:', err?.message || err);
  }
  return { ok: false, mode: 'fallback-needed' };
}
