// ═══════════════════════════════════════════════════════════════════════════════
// SERVIÇO DE AUTENTICAÇÃO, CONTROLE ADMIN E GESTÃO DINÂMICA DE VOUCHERS
// ═══════════════════════════════════════════════════════════════════════════════

const ADMIN_CREDENTIALS = {
  email: 'jonatasprojetos2013@gmail.com',
  password: 'adm123',
  name: 'Jonatas',
  role: 'admin'
};

const isLocalHost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE = isLocalHost
  ? 'http://localhost:3001/api/v1'
  : (import.meta.env.VITE_API_URL || 'https://oneconvite.onrender.com/api/v1');

const getAdminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-email': ADMIN_CREDENTIALS.email
});

const STORAGE_KEYS = {
  ADMIN_LOGGED: '1convite_admin_logged',
  CURRENT_USER: '1convite_current_user',
  USERS_LIST: '1convite_users_db',
  VOUCHERS_LIST: '1convite_vouchers_db'
};

// Vouchers iniciais padrão
const INITIAL_VOUCHERS = [
  {
    code: 'REINO6M',
    maxUses: 100,
    usedCount: 0,
    daysValid: 180,
    active: true,
    createdAt: new Date().toISOString(),
    notes: 'Código de Boas-Vindas do Reino (6 Meses)'
  },
  {
    code: 'VIP2026',
    maxUses: 50,
    usedCount: 0,
    daysValid: 180,
    active: true,
    createdAt: new Date().toISOString(),
    notes: 'Voucher Promocional de Lançamento 2026'
  },
  {
    code: 'FAMILIA1C',
    maxUses: 10,
    usedCount: 0,
    daysValid: 180,
    active: true,
    createdAt: new Date().toISOString(),
    notes: 'Acesso Especial para Família'
  }
];

export const adminAuthService = {
  // ── AUTENTICAÇÃO GERAL ───────────────────────────────────────────────
  
  isAdmin(email, password) {
    if (!email || !password) return false;
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    return cleanEmail === ADMIN_CREDENTIALS.email && cleanPass === ADMIN_CREDENTIALS.password;
  },

  isCurrentSessionAdmin() {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED) === 'true';
    } catch {
      return false;
    }
  },

  setAdminSession(isAdm) {
    try {
      if (isAdm) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED, 'true');
        localStorage.setItem('1convite_logged_in', 'true');
        localStorage.removeItem('1convite_guest_mode');
        localStorage.setItem('1convite_user_name', ADMIN_CREDENTIALS.name);
        localStorage.setItem('1convite_user_email', ADMIN_CREDENTIALS.email);
        localStorage.setItem('1convite-premium', 'true');
        localStorage.setItem('1convite_premium_plan', 'Administrador Mestre • Acesso Total Vitalício');
        localStorage.setItem('1convite_entitlements', JSON.stringify(['ebooks', 'pregador', 'mulher_virtuosa']));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED);
      }
    } catch (e) {
      console.warn(e);
    }
  },

  logout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED);
      localStorage.removeItem('1convite_logged_in');
      localStorage.removeItem('1convite_guest_mode');
      localStorage.removeItem('1convite_user_name');
      localStorage.removeItem('1convite_user_email');
      localStorage.removeItem('1convite-premium');
      localStorage.removeItem('1convite_premium_plan');
      localStorage.removeItem('1convite_premium_expiry');
      localStorage.removeItem('1convite_entitlements');
      localStorage.removeItem('1convite_custom_avatar');
      localStorage.removeItem('1convite_custom_avatar_uploaded');
      localStorage.removeItem('1convite_user_gender');
      localStorage.removeItem('1convite_user_uuid');
      localStorage.removeItem('1convite_is_admin');
    } catch (e) {
      console.warn(e);
    }
  },

  // ── GESTÃO DE USUÁRIOS ───────────────────────────────────────────────
  
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn(e);
    }
    // Lista padrão inicial com o Admin
    const initialUsers = [
      {
        id: 'usr_admin',
        name: ADMIN_CREDENTIALS.name,
        contact: ADMIN_CREDENTIALS.email,
        type: 'admin', // 'admin', 'vip', 'gratis'
        plan: 'Administrador Mestre (Vitalício)',
        createdAt: '2026-11-24T12:00:00.000Z',
        lastLogin: new Date().toISOString()
      }
    ];
    this.saveUsers(initialUsers);
    return initialUsers;
  },

  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
    } catch (e) {
      console.warn(e);
    }
  },

  registerUser({ name, contact, password = '', vipCode = '' }) {
    const cleanName = name.trim();
    const cleanContact = contact.trim();
    const cleanVip = vipCode.trim().toUpperCase();

    // Se tentar cadastrar o email de admin com a senha correta
    if (cleanContact.toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      this.setAdminSession(true);
      return { success: true, isAdmin: true, user: ADMIN_CREDENTIALS };
    }

    // Validar Voucher se informado
    let isVip = false;
    let daysValid = 0;
    let plan = 'Membro Gratuito (Visitante)';

    if (cleanVip) {
      const voucherRes = this.useVoucher(cleanVip, cleanContact);
      if (!voucherRes.success) {
        return { success: false, message: voucherRes.message };
      }
      isVip = true;
      daysValid = voucherRes.daysValid || 180;
      plan = `Membro VIP 6 Meses (${cleanVip})`;
    }

    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.contact.toLowerCase() === cleanContact.toLowerCase());

    const expiryTimestamp = isVip ? (Date.now() + daysValid * 24 * 60 * 60 * 1000) : null;

    const userObj = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: cleanName,
      contact: cleanContact,
      password: password,
      type: isVip ? 'vip' : 'gratis',
      plan: plan,
      vipCode: cleanVip || null,
      expiryTimestamp: expiryTimestamp,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      // Atualiza usuário existente
      users[existingIndex] = { ...users[existingIndex], ...userObj };
    } else {
      users.push(userObj);
    }

    this.saveUsers(users);

    // Salvar sessão ativa
    try {
      localStorage.setItem('1convite_logged_in', 'true');
      localStorage.setItem('1convite_user_name', cleanName);
      localStorage.setItem('1convite_user_email', cleanContact);
      localStorage.setItem('1convite-premium', isVip ? 'true' : 'false');
      if (isVip) {
        localStorage.setItem('1convite_premium_plan', plan);
        localStorage.setItem('1convite_premium_expiry', expiryTimestamp.toString());
      }
    } catch (e) {
      console.warn(e);
    }

    return { 
      success: true, 
      isAdmin: false, 
      user: userObj,
      isVip,
      expiryTimestamp
    };
  },

  loginUser({ contact, password = '' }) {
    const cleanContact = contact.trim().toLowerCase();
    const cleanPass = password.trim();

    // Verifica se é o Admin
    if (cleanContact === ADMIN_CREDENTIALS.email && cleanPass === ADMIN_CREDENTIALS.password) {
      this.setAdminSession(true);
      return { success: true, isAdmin: true, user: ADMIN_CREDENTIALS };
    }

    const users = this.getUsers();
    const user = users.find(u => u.contact.toLowerCase() === cleanContact);

    if (!user) {
      return { 
        success: false, 
        message: 'Usuário não encontrado. Se for sua primeira vez, clique em "Cadastrar-se".' 
      };
    }

    // Atualiza last login
    user.lastLogin = new Date().toISOString();
    this.saveUsers(users);

    const isVip = user.type === 'vip' || user.type === 'admin';
    try {
      localStorage.setItem('1convite_logged_in', 'true');
      localStorage.setItem('1convite_user_name', user.name);
      localStorage.setItem('1convite_user_email', user.contact);
      localStorage.setItem('1convite-premium', isVip ? 'true' : 'false');
      if (user.expiryTimestamp) {
        localStorage.setItem('1convite_premium_expiry', user.expiryTimestamp.toString());
      }
      if (user.plan) {
        localStorage.setItem('1convite_premium_plan', user.plan);
      }
    } catch (e) {
      console.warn(e);
    }

    return { success: true, isAdmin: false, user, isVip };
  },

  // ── GESTÃO DE VOUCHERS DINÂMICOS ────────────────────────────────────

  getVouchers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOUCHERS_LIST);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn(e);
    }
    this.saveVouchers(INITIAL_VOUCHERS);
    return INITIAL_VOUCHERS;
  },

  saveVouchers(vouchers) {
    try {
      localStorage.setItem(STORAGE_KEYS.VOUCHERS_LIST, JSON.stringify(vouchers));
    } catch (e) {
      console.warn(e);
    }
  },

  createVoucher({ code, maxUses = 1, daysValid = 180, notes = '' }) {
    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode || cleanCode.length < 3) {
      return { success: false, message: 'O código deve conter pelo menos 3 caracteres alfanuméricos.' };
    }

    const vouchers = this.getVouchers();
    if (vouchers.some(v => v.code === cleanCode)) {
      return { success: false, message: 'Já existe um código cadastrado com este nome.' };
    }

    const newVoucher = {
      code: cleanCode,
      maxUses: parseInt(maxUses, 10) || 1,
      usedCount: 0,
      daysValid: parseInt(daysValid, 10) || 180,
      active: true,
      createdAt: new Date().toISOString(),
      notes: notes.trim() || 'Criado via Painel Administrativo'
    };

    vouchers.unshift(newVoucher);
    this.saveVouchers(vouchers);
    return { success: true, voucher: newVoucher };
  },

  useVoucher(code, userContact = '') {
    const cleanCode = code.trim().toUpperCase();
    const vouchers = this.getVouchers();
    const voucher = vouchers.find(v => v.code === cleanCode);

    if (!voucher) {
      return { success: false, message: 'Código de convite não encontrado.' };
    }

    if (!voucher.active) {
      return { success: false, message: 'Este código foi desativado pelo administrador.' };
    }

    if (voucher.maxUses > 0 && voucher.usedCount >= voucher.maxUses) {
      return { success: false, message: 'Este código atingiu o limite máximo de utilizações permitidas.' };
    }

    // Incrementa contagem de uso
    voucher.usedCount = (voucher.usedCount || 0) + 1;
    this.saveVouchers(vouchers);

    return { 
      success: true, 
      daysValid: voucher.daysValid || 180,
      voucher 
    };
  },

  toggleVoucherStatus(code) {
    const vouchers = this.getVouchers();
    const v = vouchers.find(item => item.code === code);
    if (v) {
      v.active = !v.active;
      this.saveVouchers(vouchers);
      return { success: true, active: v.active };
    }
    return { success: false };
  },

  deleteVoucher(code) {
    let vouchers = this.getVouchers();
    vouchers = vouchers.filter(v => v.code !== code);
    this.saveVouchers(vouchers);
    return { success: true };
  },

  // ── ESTATÍSTICAS PARA O DASHBOARD DO ADMIN ──────────────────────────

  getDashboardStats() {
    const users = this.getUsers();
    const vouchers = this.getVouchers();

    const totalUsers = users.length;
    const adminCount = users.filter(u => u.type === 'admin').length;
    const vipCount = users.filter(u => u.type === 'vip').length;
    const gratisCount = users.filter(u => u.type === 'gratis').length;

    const totalVouchers = vouchers.length;
    const activeVouchers = vouchers.filter(v => v.active).length;
    const totalVoucherUses = vouchers.reduce((acc, curr) => acc + (curr.usedCount || 0), 0);

    return {
      totalUsers,
      adminCount,
      vipCount,
      gratisCount,
      totalVouchers,
      activeVouchers,
      totalVoucherUses,
      recentUsers: [...users].reverse().slice(0, 50),
      vouchers
    };
  },

  // ── MÉTODOS SINCRONIZADOS COM O BACKEND (NUVEM) ─────────────────────

  async registerUserAsync({ name, contact, password = '', vipCode = '' }) {
    try {
      const resp = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, password, vipCode })
      });
      const data = await resp.json();
      if (data && typeof data.success === 'boolean') {
        if (data.success) {
          if (data.isAdmin) {
            this.setAdminSession(true);
          } else {
            localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED);
            localStorage.removeItem('1convite_guest_mode');
            localStorage.setItem('1convite_logged_in', 'true');
            localStorage.setItem('1convite_user_name', data.user?.name || name.trim());
            localStorage.setItem('1convite_user_email', data.user?.contact || contact.trim());
            localStorage.setItem('1convite-premium', data.isVip ? 'true' : 'false');
            if (data.user?.plan) localStorage.setItem('1convite_premium_plan', data.user.plan);
            if (data.expiryTimestamp) localStorage.setItem('1convite_premium_expiry', String(data.expiryTimestamp));
          }
        }
        return data;
      }
    } catch (e) {
      console.warn('Fallback local em registerUserAsync:', e);
    }
    return this.registerUser({ name, contact, password, vipCode });
  },

  async loginUserAsync({ contact, password = '' }) {
    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, password })
      });
      const data = await resp.json();
      if (data && typeof data.success === 'boolean') {
        if (data.success) {
          if (data.isAdmin) {
            this.setAdminSession(true);
          } else {
            localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED);
            localStorage.removeItem('1convite_guest_mode');
            localStorage.setItem('1convite_logged_in', 'true');
            localStorage.setItem('1convite_user_name', data.user?.name || 'Membro');
            localStorage.setItem('1convite_user_email', data.user?.contact || contact.trim());
            localStorage.setItem('1convite-premium', data.isVip ? 'true' : 'false');
            localStorage.setItem('1convite_entitlements', JSON.stringify(Array.isArray(data.user?.entitlements) ? data.user.entitlements : []));
            localStorage.setItem('1convite_user_gender', data.user?.genero || 'homem');
            if (data.user?.avatar) {
              localStorage.setItem('1convite_custom_avatar', data.user.avatar);
              localStorage.setItem('1convite_custom_avatar_uploaded', 'true');
            } else {
              localStorage.removeItem('1convite_custom_avatar');
              localStorage.removeItem('1convite_custom_avatar_uploaded');
            }
            if (data.user?.plan) localStorage.setItem('1convite_premium_plan', data.user.plan);
            if (data.user?.expiryTimestamp) localStorage.setItem('1convite_premium_expiry', String(data.user.expiryTimestamp));
          }
        }
        return data;
      }
    } catch (e) {
      console.warn('Fallback local em loginUserAsync:', e);
    }
    return this.loginUser({ contact, password });
  },

  async getDashboardStatsAsync() {
    try {
      const resp = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: getAdminHeaders()
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data?.success) return data;
      }
    } catch (e) {
      console.warn('Fallback local em getDashboardStatsAsync:', e);
    }
    return this.getDashboardStats();
  },

  async getEmailPipelineAsync() {
    const resp = await fetch(`${API_BASE}/admin/email-pipeline`, {
      headers: getAdminHeaders()
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) {
      throw new Error(data?.message || 'Erro ao carregar pipeline de e-mails.');
    }
    return data;
  },

  async sendPipelineTestEmailAsync({ templateId, to }) {
    const resp = await fetch(`${API_BASE}/admin/email-pipeline/test`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ templateId, to })
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) {
      throw new Error(data?.message || 'Falha ao enviar e-mail de teste.');
    }
    return data;
  },

  async getSalesFunnelAsync() {
    const resp = await fetch(`${API_BASE}/admin/sales-funnel`, {
      headers: getAdminHeaders()
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) {
      throw new Error(data?.message || 'Erro ao carregar funil de vendas.');
    }
    return data;
  },

  async toggleUserBlockAsync({ contact, blocked }) {
    const resp = await fetch(`${API_BASE}/admin/usuarios/bloquear`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ contact, blocked })
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) throw new Error(data?.message || 'Erro ao alterar bloqueio.');
    return data;
  },

  async setUserPasswordAsync({ contact, newPassword }) {
    const resp = await fetch(`${API_BASE}/admin/usuarios/senha`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ contact, newPassword })
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) throw new Error(data?.message || 'Erro ao alterar senha.');
    return data;
  },

  async setUserModulesAsync({ contact, entitlements }) {
    const resp = await fetch(`${API_BASE}/admin/usuarios/modulos`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ contact, entitlements })
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) throw new Error(data?.message || 'Erro ao atualizar módulos.');
    return data;
  },

  async giftUserInvitesAsync({ contact, quantity }) {
    const resp = await fetch(`${API_BASE}/admin/usuarios/presentear-convites`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ contact, quantity })
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) throw new Error(data?.message || 'Erro ao gerar convites.');
    return data;
  },

  async deleteUserAsync(contact) {
    const resp = await fetch(`${API_BASE}/admin/usuarios/${encodeURIComponent(contact)}`, {
      method: 'DELETE',
      headers: getAdminHeaders()
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) throw new Error(data?.message || 'Erro ao excluir usuário.');
    return data;
  },

  async resetTestDataAsync(scope = 'vendas') {
    const resp = await fetch(`${API_BASE}/admin/reset-testes`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ scope })
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) throw new Error(data?.message || 'Erro ao limpar dados de teste.');
    return data;
  },

  async createVoucherAsync({ code, maxUses = 1, daysValid = 180, notes = '' }) {
    try {
      const resp = await fetch(`${API_BASE}/admin/vouchers`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ code, maxUses, daysValid, notes })
      });
      const data = await resp.json();
      if (data && typeof data.success === 'boolean') return data;
    } catch (e) {
      console.warn('Fallback local em createVoucherAsync:', e);
    }
    return this.createVoucher({ code, maxUses, daysValid, notes });
  },

  async toggleVoucherStatusAsync(code) {
    try {
      const resp = await fetch(`${API_BASE}/admin/vouchers/${encodeURIComponent(code)}/toggle`, {
        method: 'PATCH',
        headers: getAdminHeaders()
      });
      const data = await resp.json();
      if (data && typeof data.success === 'boolean') return data;
    } catch (e) {
      console.warn('Fallback local em toggleVoucherStatusAsync:', e);
    }
    return this.toggleVoucherStatus(code);
  },

  async deleteVoucherAsync(code) {
    try {
      const resp = await fetch(`${API_BASE}/admin/vouchers/${encodeURIComponent(code)}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      const data = await resp.json();
      if (data && typeof data.success === 'boolean') return data;
    } catch (e) {
      console.warn('Fallback local em deleteVoucherAsync:', e);
    }
    return this.deleteVoucher(code);
  },

  async validateVoucherAsync(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    try {
      const resp = await fetch(`${API_BASE}/vouchers/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data && typeof data.success === 'boolean') return data;
      }
    } catch (e) {
      console.warn('Fallback local em validateVoucherAsync:', e);
    }
    return this.useVoucher(cleanCode);
  },

  async setUserPlanAsync({ contact, action = 'vip', days = 180, planLabel = '' }) {
    const resp = await fetch(`${API_BASE}/admin/usuarios/plano`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ contact, action, days, planLabel })
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) throw new Error(data?.message || 'Erro ao atualizar plano');
    return data;
  },

  async confirmPaymentManualAsync(paymentId) {
    const resp = await fetch(`${API_BASE}/admin/vendas/${encodeURIComponent(paymentId)}/confirmar-manual`, {
      method: 'POST',
      headers: getAdminHeaders()
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) throw new Error(data?.message || 'Erro ao confirmar pagamento');
    return data;
  },

  async resendPaymentEmailAsync(paymentId) {
    const resp = await fetch(`${API_BASE}/admin/vendas/${encodeURIComponent(paymentId)}/reenviar-email`, {
      method: 'POST',
      headers: getAdminHeaders()
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) throw new Error(data?.message || 'Erro ao reenviar e-mail');
    return data;
  },

  async sendEmailCampaignAsync({ templateId, segment = 'pendentes' }) {
    const resp = await fetch(`${API_BASE}/admin/email-pipeline/campanha`, {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ templateId, segment })
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) throw new Error(data?.message || 'Erro ao disparar campanha');
    return data;
  },

  async getSystemHealthAsync() {
    const resp = await fetch(`${API_BASE}/admin/system-health`, {
      headers: getAdminHeaders()
    });
    const data = await resp.json();
    if (!resp.ok || !data?.success) throw new Error(data?.message || 'Erro ao carregar saúde do sistema');
    return data;
  }
};

export default adminAuthService;
