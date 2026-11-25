import { r as redirect, f as fail, i as isRedirect } from './index-BkmUvga9.js';
import { getPremiumPlanById, createSubscription, queryOne, getAllPremiumPlans, getSettings, getUserSubscription, isUserPremium } from './database-GQg0oTqt.js';
import { g as getActivePaymentGateway, r as requiresBrazilianProfileForCheckout, a as isAsaasConfigured, b as createCustomer, d as createSubscription$1, i as isAnyPaymentGatewayConfigured } from './payments-JiYPPeF0.js';
import { i as isStripeConfigured, a as createSubscriptionCheckout } from './stripe-b9tKoB12.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'stripe';

const load = async ({ locals }) => {
  const plans = await getAllPremiumPlans();
  const settings = await getSettings();
  const paymentGateway = await getActivePaymentGateway();
  let userSubscription = null;
  let userIsPremium = false;
  if (locals.user) {
    userSubscription = await getUserSubscription(locals.user.id);
    userIsPremium = await isUserPremium(locals.user.id);
  }
  return {
    plans,
    settings,
    userSubscription,
    userIsPremium,
    paymentGateway,
    paymentConfigured: await isAnyPaymentGatewayConfigured(),
    // keep legacy flag for templates that still check it
    asaasConfigured: paymentGateway === "asaas" ? await isAsaasConfigured() : await isStripeConfigured()
  };
};
const actions = {
  subscribe: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(303, "/members/login");
    }
    const data = await request.formData();
    const planId = data.get("plan_id");
    if (!planId) {
      return fail(400, { error: "PLAN_REQUIRED" });
    }
    const gateway = await getActivePaymentGateway();
    const needCpf = await requiresBrazilianProfileForCheckout();
    if (needCpf && (!locals.user.name || !locals.user.cpf)) {
      throw redirect(
        303,
        `/members/dashboard?redirectTo=${encodeURIComponent(`/premium?plan_id=${planId}&auto=1`)}&error=update_profile`
      );
    }
    if (gateway === "stripe" && !locals.user.username) {
      return fail(400, { error: "EMAIL_REQUIRED" });
    }
    const plan = await getPremiumPlanById(parseInt(planId));
    if (!plan) {
      return fail(400, { error: "PLAN_NOT_FOUND" });
    }
    if (gateway === "stripe") {
      if (!await isStripeConfigured()) {
        return fail(500, { error: "STRIPE_NOT_CONFIGURED" });
      }
      try {
        const checkout = await createSubscriptionCheckout({
          planName: plan.name,
          priceCents: plan.price_cents,
          intervalDays: plan.interval_days || 30,
          customerEmail: locals.user.username,
          userId: locals.user.id,
          planId: plan.id
        });
        await createSubscription({
          user_id: locals.user.id,
          plan_id: plan.id,
          status: "pending",
          started_at: (/* @__PURE__ */ new Date()).toISOString(),
          expires_at: new Date(
            Date.now() + (plan.interval_days || 30) * 24 * 60 * 60 * 1e3
          ).toISOString(),
          stripe_subscription_id: `cs_pending:${checkout.sessionId}`
        });
        throw redirect(303, checkout.url);
      } catch (e) {
        if (isRedirect(e)) throw e;
        console.error("Stripe Checkout Error:", e);
        return fail(500, { error: "STRIPE_CHECKOUT_FAIL" });
      }
    }
    if (!await isAsaasConfigured()) {
      return fail(500, { error: "ASAAS_NOT_CONFIGURED" });
    }
    try {
      let customerId = "";
      const existingSub = await queryOne(
        "SELECT asaas_customer_id FROM premium_subscriptions WHERE user_id = ? AND asaas_customer_id IS NOT NULL LIMIT 1",
        [locals.user.id]
      );
      if (existingSub && existingSub.asaas_customer_id) {
        customerId = existingSub.asaas_customer_id;
      } else {
        const email = locals.user.username;
        const name = locals.user.name || email.split("@")[0] || "Assinante";
        const cpf = locals.user.cpf || void 0;
        const customer = await createCustomer(name, email, cpf);
        customerId = customer.id;
      }
      const method = data.get("method") || "pix";
      const billingType = method === "credit_card" ? "CREDIT_CARD" : "PIX";
      const asaasSub = await createSubscription$1({
        planName: plan.name,
        value: plan.price_cents / 100,
        customerId,
        cycleDays: plan.interval_days || 30,
        billingType
      });
      await createSubscription({
        user_id: locals.user.id,
        plan_id: plan.id,
        status: "pending",
        started_at: (/* @__PURE__ */ new Date()).toISOString(),
        expires_at: new Date(
          Date.now() + (plan.interval_days || 30) * 24 * 60 * 60 * 1e3
        ).toISOString(),
        asaas_subscription_id: asaasSub.id,
        asaas_customer_id: customerId
      });
      if (asaasSub.invoiceUrl) {
        throw redirect(303, asaasSub.invoiceUrl);
      }
      return fail(500, { error: "ASAAS_CHECKOUT_URL" });
    } catch (e) {
      if (isRedirect(e)) throw e;
      console.error("Asaas Checkout Error:", e);
      return fail(500, { error: "ASAAS_CHECKOUT_FAIL" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 50;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-C7dJAn0X.js')).default;
const server_id = "src/routes/premium/+page.server.ts";
const imports = ["_app/immutable/nodes/50.i2eoZKHk.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/50.dtXHexUo.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=50-B5NtAppy.js.map
