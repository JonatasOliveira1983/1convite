/**
 * Teste automatizado de ponta a ponta do Checkout Asaas (1Convite v3.0.0).
 * Uso:
 *   node tests/test-asaas.js
 */

const BASE_URL = process.env.BACKEND_URL || 'http://127.0.0.1:3001';

async function req(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function run() {
  console.log('=== TESTE CHECKOUT ASAAS 1CONVITE ===');
  const health = await req('/api/v1/health');
  console.log('1. Health:', health.status, health.data);

  const planos = await req('/api/v1/pagamentos/planos');
  console.log('2. Planos:', planos.status, 'asaasConfigured=', planos.data.asaasConfigured, 'resendConfigured=', planos.data.resendConfigured);
  for (const p of planos.data.planos || []) {
    console.log(`   - ${p.id}: R$ ${p.valorReais} (${p.convites} convites)`);
  }

  if (!planos.data.asaasConfigured) {
    console.log('3. Checkout: pulado porque ASAAS_API_KEY nao esta configurada neste ambiente.');
    return;
  }

  const checkout = await req('/api/v1/pagamentos/checkout', {
    method: 'POST',
    body: JSON.stringify({
      planId: 'popular',
      name: 'Teste Automatizado 1Convite',
      email: 'teste.asaas@1convite.com.br',
      cpfCnpj: '24971563792',
      phone: '11999999999',
      billingType: 'PIX',
    }),
  });
  console.log('3. Checkout PIX:', checkout.status, checkout.data.paymentId || checkout.data.message);
}

run().catch((err) => {
  console.error('ERRO NO TESTE:', err);
  process.exit(1);
});
