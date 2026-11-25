import { b as private_env } from './shared-server-DaWdgxVh.js';
import { getSettings } from './database-GQg0oTqt.js';
import { i as isStripeConfigured } from './stripe-b9tKoB12.js';

async function getAsaasSettings() {
  const settings = await getSettings();
  let apiUrl = private_env.ASAAS_API_URL || settings.asaas_api_url || "https://api-sandbox.asaas.com/v3";
  if (apiUrl.includes("api.asaas.com/api/v3")) {
    apiUrl = "https://api.asaas.com/v3";
  } else if (apiUrl.includes("sandbox.asaas.com/api/v3")) {
    apiUrl = "https://api-sandbox.asaas.com/v3";
  } else if (apiUrl.includes("sandbox.asaas.com/v3")) {
    apiUrl = "https://api-sandbox.asaas.com/v3";
  }
  return {
    apiKey: private_env.ASAAS_API_KEY || settings.asaas_api_key || "",
    apiUrl,
    webhookSecret: private_env.ASAAS_WEBHOOK_SECRET || settings.asaas_webhook_secret || "",
    siteUrl: private_env.SITE_URL || settings.site_url || "https://seusite.com"
  };
}
async function isAsaasConfigured() {
  const settings = await getAsaasSettings();
  return !!settings.apiKey;
}
async function request(path, options = {}) {
  const settings = await getAsaasSettings();
  if (!settings.apiKey) {
    throw new Error("Asaas API key not configured");
  }
  const url = `${settings.apiUrl.replace(/\/$/, "")}${path}`;
  const headers = {
    "access_token": settings.apiKey,
    "Content-Type": "application/json",
    ...options.headers
  };
  const response = await fetch(url, {
    ...options,
    headers
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Asaas API error on ${path}:`, errorText);
    throw new Error(`Asaas API error: ${response.statusText} (${response.status}) - ${errorText}`);
  }
  return response.json();
}
async function createCustomer(name, email, cpfCnpj) {
  try {
    const data = await request("/customers", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        cpfCnpj: cpfCnpj || void 0
      })
    });
    return { id: data.id };
  } catch (e) {
    console.error("Error creating customer on Asaas:", e);
    throw e;
  }
}
async function createSubscription(params) {
  try {
    let cycle = "MONTHLY";
    if (params.cycleDays === 7) cycle = "WEEKLY";
    else if (params.cycleDays === 14) cycle = "BIWEEKLY";
    else if (params.cycleDays === 30) cycle = "MONTHLY";
    else if (params.cycleDays === 60) cycle = "BIMONTHLY";
    else if (params.cycleDays === 90) cycle = "QUARTERLY";
    else if (params.cycleDays === 180) cycle = "SEMIANNUALLY";
    else if (params.cycleDays === 365) cycle = "YEARLY";
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDueDate = tomorrow.toISOString().split("T")[0];
    const settings = await getAsaasSettings();
    let data;
    try {
      data = await request("/subscriptions", {
        method: "POST",
        body: JSON.stringify({
          customer: params.customerId,
          billingType: params.billingType || "UNDEFINED",
          // Let user choose credit card, bank slip, or PIX
          value: params.value,
          nextDueDate,
          cycle,
          description: `Plano Premium: ${params.planName}`,
          updatePendingPayments: true,
          callback: {
            successUrl: `${settings.siteUrl.replace(/\/$/, "")}/members/dashboard`,
            autoRedirect: true
          }
        })
      });
    } catch (err) {
      if (err.message && (err.message.includes("domínio") || err.message.includes("domain") || err.message.includes("invalid_object"))) {
        console.warn("Asaas domain check failed, retrying subscription creation without callback redirect...");
        data = await request("/subscriptions", {
          method: "POST",
          body: JSON.stringify({
            customer: params.customerId,
            billingType: params.billingType || "UNDEFINED",
            value: params.value,
            nextDueDate,
            cycle,
            description: `Plano Premium: ${params.planName}`,
            updatePendingPayments: true
          })
        });
      } else {
        throw err;
      }
    }
    const payments = await request(`/subscriptions/${data.id}/payments`);
    const invoiceUrl = payments.data?.[0]?.invoiceUrl || data.bankSlipUrl || `https://sandbox.asaas.com/checkoutSession/show?id=${data.id}`;
    return {
      id: data.id,
      invoiceUrl
    };
  } catch (e) {
    console.error("Error creating subscription on Asaas:", e);
    throw e;
  }
}
async function cancelSubscription(asaasSubscriptionId) {
  try {
    await request(`/subscriptions/${asaasSubscriptionId}`, {
      method: "DELETE"
    });
  } catch (e) {
    console.error(`Error deleting subscription ${asaasSubscriptionId} on Asaas:`, e);
    throw e;
  }
}
async function createPayment(params) {
  try {
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDate = tomorrow.toISOString().split("T")[0];
    const settings = await getAsaasSettings();
    let data;
    try {
      data = await request("/payments", {
        method: "POST",
        body: JSON.stringify({
          customer: params.customerId,
          billingType: params.billingType || "UNDEFINED",
          // PIX, Boleto, Cartão de Crédito
          value: params.value,
          dueDate,
          description: `Produto Digital: ${params.productName}`,
          externalReference: params.externalReference || void 0,
          callback: {
            successUrl: `${settings.siteUrl.replace(/\/$/, "")}/members/dashboard`,
            autoRedirect: true
          }
        })
      });
    } catch (err) {
      if (err.message && (err.message.includes("domínio") || err.message.includes("domain") || err.message.includes("invalid_object"))) {
        console.warn("Asaas domain check failed, retrying payment creation without callback redirect...");
        data = await request("/payments", {
          method: "POST",
          body: JSON.stringify({
            customer: params.customerId,
            billingType: params.billingType || "UNDEFINED",
            value: params.value,
            dueDate,
            description: `Produto Digital: ${params.productName}`,
            externalReference: params.externalReference || void 0
          })
        });
      } else {
        throw err;
      }
    }
    return {
      id: data.id,
      invoiceUrl: data.invoiceUrl || data.bankSlipUrl
    };
  } catch (e) {
    console.error("Error creating payment on Asaas:", e);
    throw e;
  }
}
async function getConfiguredPaymentGatewaySetting() {
  const settings = await getSettings();
  return (private_env.PAYMENT_GATEWAY || settings.payment_gateway || "asaas").toLowerCase().trim();
}
async function getActivePaymentGateway() {
  const preferred = await getConfiguredPaymentGatewaySetting();
  if (preferred === "stripe") {
    if (await isStripeConfigured()) return "stripe";
    if (await isAsaasConfigured()) {
      console.warn(
        "[payments] payment_gateway=stripe but Stripe is not configured; falling back to asaas"
      );
      return "asaas";
    }
    return "stripe";
  }
  return "asaas";
}
async function isAnyPaymentGatewayConfigured() {
  const gw = await getActivePaymentGateway();
  if (gw === "stripe") return isStripeConfigured();
  return isAsaasConfigured();
}
async function requiresBrazilianProfileForCheckout() {
  return await getActivePaymentGateway() === "asaas";
}

export { isAsaasConfigured as a, createCustomer as b, cancelSubscription as c, createSubscription as d, createPayment as e, getActivePaymentGateway as g, isAnyPaymentGatewayConfigured as i, requiresBrazilianProfileForCheckout as r };
//# sourceMappingURL=payments-JiYPPeF0.js.map
