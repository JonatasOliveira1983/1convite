const isCapacitor = Boolean(
  typeof window !== 'undefined' &&
    (window.Capacitor ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('Capacitor')))
);
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE =
  isLocalhost && !isCapacitor
    ? 'http://localhost:3001/api/v1'
    : import.meta.env.VITE_API_URL || 'https://oneconvite.onrender.com/api/v1';

export const templofitService = {
  async fetchState(contact) {
    const cleanContact = (contact || 'convidado@1convite.com.br').trim().toLowerCase();
    const res = await fetch(`${API_BASE}/templofit/state?contact=${encodeURIComponent(cleanContact)}`);
    const data = await res.json();
    if (!res.ok || !data?.success) throw new Error(data?.message || 'Erro ao carregar TemploFit');
    return data;
  },

  async saveSession(payload) {
    const res = await fetch(`${API_BASE}/templofit/sessoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data?.success) throw new Error(data?.message || 'Erro ao salvar sessão');
    return data;
  },

  async saveWeight(contact, pesoKg) {
    const res = await fetch(`${API_BASE}/templofit/peso`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, pesoKg }),
    });
    const data = await res.json();
    if (!res.ok || !data?.success) throw new Error(data?.message || 'Erro ao salvar peso');
    return data;
  },

  async createRoutine(contact, titulo, exercicios) {
    const res = await fetch(`${API_BASE}/templofit/rotinas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, titulo, exercicios }),
    });
    const data = await res.json();
    if (!res.ok || !data?.success) throw new Error(data?.message || 'Erro ao salvar rotina');
    return data;
  },

  async deleteRoutine(id) {
    const res = await fetch(`${API_BASE}/templofit/rotinas/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data?.success) throw new Error(data?.message || 'Erro ao remover rotina');
    return data;
  },

  async resetProgress(contact, includeRoutines = false) {
    const cleanContact = (contact || 'convidado@1convite.com.br').trim().toLowerCase();
    const res = await fetch(`${API_BASE}/templofit/reset`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact: cleanContact, includeRoutines }),
    });
    const data = await res.json();
    if (!res.ok || !data?.success) throw new Error(data?.message || 'Erro ao resetar registros');
    return data;
  },
};
