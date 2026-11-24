// Controle diário de pendência da jornada (Meditação + Síntese + Oração)
// Ciclo de 1 a 12 dias: ao passar de 12 dias pendentes, reinicia em 1.
// Ao concluir os 3 passos no dia, zera o contador e limpa o ícone do app.

const LAST_COMPLETED_KEY = '1convite_last_completed_date';
const CYCLE_START_KEY = '1convite_badge_cycle_start';
const MAX_BADGE_DAYS = 12;

export function getTodayDateKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function diffCalendarDays(fromKey, toKey) {
  const [fy, fm, fd] = fromKey.split('-').map(Number);
  const [ty, tm, td] = toKey.split('-').map(Number);
  const fromUtc = Date.UTC(fy, fm - 1, fd);
  const toUtc = Date.UTC(ty, tm - 1, td);
  return Math.floor((toUtc - fromUtc) / (1000 * 60 * 60 * 24));
}

export function getPendingBadgeCount() {
  try {
    const today = getTodayDateKey();
    const lastCompleted = localStorage.getItem(LAST_COMPLETED_KEY);

    if (lastCompleted === today) {
      return 0;
    }

    let baseDate = lastCompleted;
    if (!baseDate) {
      baseDate = localStorage.getItem(CYCLE_START_KEY);
      if (!baseDate) {
        localStorage.setItem(CYCLE_START_KEY, today);
        return 1;
      }
      // Para quem nunca concluiu: dia inicial = 1, dia seguinte = 2...
      const elapsed = Math.max(0, diffCalendarDays(baseDate, today)) + 1;
      return ((elapsed - 1) % MAX_BADGE_DAYS) + 1;
    }

    const daysWithoutCompleting = Math.max(1, diffCalendarDays(baseDate, today));
    return ((daysWithoutCompleting - 1) % MAX_BADGE_DAYS) + 1;
  } catch {
    return 0;
  }
}

export function syncAppBadge() {
  const count = getPendingBadgeCount();
  try {
    if (typeof navigator !== 'undefined') {
      if (count > 0 && typeof navigator.setAppBadge === 'function') {
        navigator.setAppBadge(count).catch(() => {});
      } else if (count === 0 && typeof navigator.clearAppBadge === 'function') {
        navigator.clearAppBadge().catch(() => {});
      }
    }
  } catch {
    // Ignora em navegadores sem suporte à Badging API
  }
  return count;
}

export function markDailyJourneyCompleted(completed = true) {
  try {
    const today = getTodayDateKey();
    if (completed) {
      localStorage.setItem(LAST_COMPLETED_KEY, today);
      localStorage.removeItem(CYCLE_START_KEY);
    } else {
      const last = localStorage.getItem(LAST_COMPLETED_KEY);
      if (last === today) {
        localStorage.removeItem(LAST_COMPLETED_KEY);
      }
    }
  } catch {
    // noop
  }
  const nextCount = syncAppBadge();
  try {
    window.dispatchEvent(new CustomEvent('1convite-badge-updated', { detail: { count: nextCount } }));
  } catch {
    // noop
  }
  return nextCount;
}
