/**
 * Serviço de integração com a API v3 do Asaas (PIX, Checkout/Cartão e Webhook).
 * Portado e adaptado da arquitetura do Dezafira para o ecossistema 1Convite.
 */

const ASAAS_PRODUCTION_URL = 'https://api.asaas.com/v3';
const ASAAS_SANDBOX_URL = 'https://sandbox.asaas.com/api/v3';

export const PAID_EVENTS = new Set([
  'PAYMENT_CONFIRMED',
  'PAYMENT_RECEIVED',
  'PAYMENT_CREDIT_CARD_CAPTURED',
]);

export const PAID_STATUSES = new Set([
  'RECEIVED',
  'CONFIRMED',
  'RECEIVED_IN_CASH',
]);

export const PLANOS_1CONVITE = {
  basico: {
    id: 'basico',
    nome: 'Plano Básico — Semente',
    tituloCurto: 'Plano Semente',
    valorCentavos: 6700,
    valorReais: 67,
    diasValidade: 365,
    convites: 1,
    conviteDias: 180,
  },
  popular: {
    id: 'popular',
    nome: 'Plano Mais Popular — Edificação',
    tituloCurto: 'Plano Edificação',
    valorCentavos: 9700,
    valorReais: 97,
    diasValidade: 365,
    convites: 3,
    conviteDias: 180,
  },
  avancado: {
    id: 'avancado',
    nome: 'Plano Avançado — Reino',
    tituloCurto: 'Plano Reino',
    valorCentavos: 14700,
    valorReais: 147,
    diasValidade: 365,
    convites: 5,
    conviteDias: 180,
  },
};

export const FUNNEL_OFFERS = {
  order_bump_ebooks: {
    id: 'order_bump_ebooks',
    stage: 'order_bump',
    nome: 'Coleção 5 E-books Premium',
    valorCentavos: 1990,
    valorReais: 19.9,
    entitlements: ['ebooks'],
  },
  upsell_combo: {
    id: 'upsell_combo',
    stage: 'upsell',
    nome: 'Combo Ministério & Lar (Pregador + Mulher Virtuosa)',
    valorCentavos: 4700,
    valorReais: 47,
    entitlements: ['pregador', 'mulher_virtuosa'],
  },
  downsell_mulher: {
    id: 'downsell_mulher',
    stage: 'downsell',
    nome: 'Planner da Mulher Virtuosa (Oferta Especial)',
    valorCentavos: 2490,
    valorReais: 24.9,
    entitlements: ['mulher_virtuosa'],
  },
  downsell_pregador: {
    id: 'downsell_pregador',
    stage: 'downsell',
    nome: 'Biblioteca do Pregador (Oferta Especial)',
    valorCentavos: 2490,
    valorReais: 24.9,
    entitlements: ['pregador'],
  },
  convite_extra: {
    id: 'convite_extra',
    stage: 'convite',
    nome: 'Convite VIP 1Convite (180 Dias)',
    valorCentavos: 2499,
    valorReais: 24.99,
    convites: 1,
    conviteDias: 180,
    entitlements: [],
  },
  convite_pacote_10: {
    id: 'convite_pacote_10',
    stage: 'convite',
    nome: 'Pacote Sementeira — 10 Convites VIP (5% OFF)',
    valorCentavos: 23740,
    valorReais: 237.4,
    convites: 10,
    conviteDias: 180,
    entitlements: [],
  },
  convite_pacote_15: {
    id: 'convite_pacote_15',
    stage: 'convite',
    nome: 'Pacote Colheita — 15 Convites VIP (10% OFF)',
    valorCentavos: 33735,
    valorReais: 337.35,
    convites: 15,
    conviteDias: 180,
    entitlements: [],
  },
  convite_pacote_20: {
    id: 'convite_pacote_20',
    stage: 'convite',
    nome: 'Pacote Embaixadores do Reino — 20 Convites VIP (15% OFF)',
    valorCentavos: 42483,
    valorReais: 424.83,
    convites: 20,
    conviteDias: 180,
    entitlements: [],
  },
};

export function getPlanById(planId) {
  return PLANOS_1CONVITE[String(planId || '').toLowerCase()] || null;
}

export function getFunnelOfferById(offerId) {
  return FUNNEL_OFFERS[String(offerId || '').toLowerCase()] || null;
}

export function getAsaasApiKey() {
  return (process.env.ASAAS_API_KEY || '').trim();
}

export function isAsaasConfigured() {
  return Boolean(getAsaasApiKey());
}

export function isSandboxKey(token = getAsaasApiKey()) {
  if (!token) return true;
  return !token.startsWith('$aact_prod_');
}

function getBaseUrl() {
  if (process.env.ASAAS_API_URL) {
    return process.env.ASAAS_API_URL.replace(/\/$/, '');
  }
  return isSandboxKey() ? ASAAS_SANDBOX_URL : ASAAS_PRODUCTION_URL;
}

function centsToAsaasValue(cents) {
  return Number((Number(cents) / 100).toFixed(2));
}

function getBrazilDateString(offsetDays = 0) {
  const target = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(target);
}

function dueDateDaysFromNow(days = 1) {
  return getBrazilDateString(days);
}

function onlyDigits(str = '') {
  return String(str).replace(/\D/g, '');
}

export function isValidCpfCnpj(value = '') {
  const digits = onlyDigits(value);
  if (!digits) return false;
  if (digits.length === 11) {
    if (/^(\d)\1{10}$/.test(digits)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
    let d1 = (sum * 10) % 11;
    if (d1 === 10) d1 = 0;
    if (d1 !== Number(digits[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
    let d2 = (sum * 10) % 11;
    if (d2 === 10) d2 = 0;
    return d2 === Number(digits[10]);
  }
  if (digits.length === 14) {
    if (/^(\d)\1{13}$/.test(digits)) return false;
    const calc = (len) => {
      const weights = len === 12 ? [5,4,3,2,9,8,7,6,5,4,3,2] : [6,5,4,3,2,9,8,7,6,5,4,3,2];
      let sum = 0;
      for (let i = 0; i < len; i++) sum += Number(digits[i]) * weights[i];
      const rem = sum % 11;
      return rem < 2 ? 0 : 11 - rem;
    };
    return calc(12) === Number(digits[12]) && calc(13) === Number(digits[13]);
  }
  return false;
}

async function asaasRequest(path, options = {}) {
  const apiKey = getAsaasApiKey();
  if (!apiKey) {
    throw new Error('ASAAS_API_KEY não configurado no servidor.');
  }

  const url = `${getBaseUrl()}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      access_token: apiKey,
      'Content-Type': 'application/json',
      'User-Agent': '1Convite/3.0',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const errMsg = data?.errors?.map((e) => e.description).join('; ') || text.slice(0, 300);
    throw new Error(`Asaas ${response.status}: ${errMsg}`);
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const errMsg = data.errors.map((e) => e.description).join('; ');
    throw new Error(`Asaas erros: ${errMsg}`);
  }

  return data;
}

export async function findCustomerByEmail(email) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!cleanEmail) return null;
  const data = await asaasRequest(`/customers?email=${encodeURIComponent(cleanEmail)}&limit=1`);
  return data?.data?.[0] || null;
}

export async function upsertCustomer({ name, email, cpfCnpj, phone, externalReference }) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const existing = await findCustomerByEmail(cleanEmail);
  if (existing) {
    // Garante notificationDisabled=true para o Asaas não enviar e-mails genéricos ao cliente
    const digitsCpf = onlyDigits(cpfCnpj);
    const updateBody = {};
    if (digitsCpf && !existing.cpfCnpj) updateBody.cpfCnpj = digitsCpf;
    if (!existing.notificationDisabled) updateBody.notificationDisabled = true;
    if (Object.keys(updateBody).length > 0) {
      try {
        return await asaasRequest(`/customers/${existing.id}`, {
          method: 'PUT',
          body: JSON.stringify(updateBody),
        });
      } catch {
        return existing;
      }
    }
    return existing;
  }

  const payload = {
    name: String(name || '').trim() || 'Membro 1Convite',
    email: cleanEmail,
    notificationDisabled: true,
  };
  const digitsCpf = onlyDigits(cpfCnpj);
  const digitsPhone = onlyDigits(phone);
  if (digitsCpf) payload.cpfCnpj = digitsCpf;
  if (digitsPhone) payload.mobilePhone = digitsPhone;
  if (externalReference) payload.externalReference = externalReference;

  return asaasRequest('/customers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createCharge({
  customerId,
  valueCents,
  description,
  externalReference,
  billingType = 'PIX',
  dueDays = 1,
}) {
  const normalizedType = billingType === 'UNDEFINED' || billingType === 'CREDIT_CARD'
    ? 'UNDEFINED'
    : 'PIX';

  const payment = await asaasRequest('/payments', {
    method: 'POST',
    body: JSON.stringify({
      customer: customerId,
      billingType: normalizedType,
      value: centsToAsaasValue(valueCents),
      dueDate: dueDateDaysFromNow(dueDays),
      description: String(description || 'Assinatura 1Convite').slice(0, 200),
      externalReference,
    }),
  });

  let pix = null;
  if (normalizedType === 'PIX') {
    try {
      pix = await asaasRequest(`/payments/${payment.id}/pixQrCode`);
    } catch (err) {
      console.warn('[ASAAS] Falha ao obter QR Code PIX:', err.message);
    }
  }

  return {
    paymentId: payment.id,
    status: payment.status,
    invoiceUrl: payment.invoiceUrl || '',
    billingType: normalizedType,
    value: payment.value,
    dueDate: payment.dueDate,
    pix,
  };
}

export async function getPayment(paymentId) {
  return asaasRequest(`/payments/${encodeURIComponent(paymentId)}`);
}

export async function confirmSandboxPayment(paymentId, valueReais) {
  if (!isSandboxKey()) {
    throw new Error('Simulação disponível apenas em ambiente Sandbox.');
  }
  const today = getBrazilDateString(0);
  return asaasRequest(`/payments/${encodeURIComponent(paymentId)}/receiveInCash`, {
    method: 'POST',
    body: JSON.stringify({
      paymentDate: today,
      value: Number(valueReais),
      notifyCustomer: false,
    }),
  });
}
