import { r as redirect, f as fail, i as isRedirect } from './index-BkmUvga9.js';
import { run, queryOne, updateSubscriptionByAsaasId, query } from './database-BjMeOB2B.js';
import { r as requiresBrazilianProfileForCheckout, c as cancelSubscription, g as getActivePaymentGateway, a as isAsaasConfigured } from './payments-Baxj4Vkq.js';
import { c as cancelStripeSubscription } from './stripe-DWKSHlDH.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'stripe';

const load = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, "/members/login");
  }
  const subscription = await queryOne(`
    SELECT s.*, p.name as plan_name, p.price_cents, p.interval_days 
    FROM premium_subscriptions s 
    LEFT JOIN premium_plans p ON s.plan_id = p.id 
    WHERE s.user_id = ? 
    ORDER BY s.id DESC 
    LIMIT 1
  `, [locals.user.id]);
  const payments = await query(`
    SELECT * FROM (
      SELECT 
        'subscription' as type,
        p.amount_cents,
        p.status,
        p.payment_method,
        p.created_at
      FROM premium_payments p
      JOIN premium_subscriptions s ON p.subscription_id = s.id
      WHERE s.user_id = ?

      UNION ALL

      SELECT 
        'product' as type,
        COALESCE(prod.price_cents, 0) as amount_cents,
        pp.status,
        CASE WHEN pp.stripe_session_id IS NOT NULL AND pp.stripe_session_id != '' THEN 'stripe' ELSE 'card_pix' END as payment_method,
        pp.created_at
      FROM product_purchases pp
      LEFT JOIN products prod ON pp.product_id = prod.id
      WHERE pp.user_id = ?

      UNION ALL

      SELECT 
        'course' as type,
        COALESCE(cp.amount_cents, mc.price_cents, 0) as amount_cents,
        cp.status,
        CASE WHEN cp.stripe_session_id IS NOT NULL AND cp.stripe_session_id != '' THEN 'stripe' ELSE 'card_pix' END as payment_method,
        cp.created_at
      FROM course_purchases cp
      LEFT JOIN member_courses mc ON cp.course_id = mc.id
      WHERE cp.user_id = ?
    ) AS combined_payments
    ORDER BY created_at DESC
    LIMIT 20
  `, [locals.user.id, locals.user.id, locals.user.id]);
  const purchasedProducts = await query(`
    SELECT p.*, pp.created_at as purchased_at
    FROM products p
    JOIN product_purchases pp ON p.id = pp.product_id
    WHERE pp.user_id = ? AND pp.status = 'completed'
    ORDER BY pp.id DESC
  `, [locals.user.id]);
  const paymentGateway = await getActivePaymentGateway();
  return {
    user: locals.user,
    subscription,
    payments,
    purchasedProducts,
    paymentGateway,
    requiresCpf: await requiresBrazilianProfileForCheckout(),
    asaasConfigured: paymentGateway === "asaas" ? await isAsaasConfigured() : true
  };
};
const actions = {
  cancel: async ({ locals }) => {
    if (!locals.user) {
      throw redirect(303, "/members/login");
    }
    const subscription = await queryOne(`
      SELECT * FROM premium_subscriptions 
      WHERE user_id = ? AND status = 'active' 
      ORDER BY id DESC 
      LIMIT 1
    `, [locals.user.id]);
    if (!subscription) {
      return fail(400, { error: "SUB_NOT_FOUND" });
    }
    if (subscription.asaas_subscription_id) {
      try {
        await cancelSubscription(subscription.asaas_subscription_id);
        await updateSubscriptionByAsaasId(subscription.asaas_subscription_id, {
          status: "cancelled",
          expires_at: subscription.expires_at
        });
        return { success: "SUB_CANCEL_SUCCESS" };
      } catch (e) {
        console.error("Error cancelling subscription:", e);
        return fail(500, { error: "SUB_CANCEL_GATEWAY" });
      }
    }
    if (subscription.stripe_subscription_id && !String(subscription.stripe_subscription_id).startsWith("cs_pending:")) {
      try {
        await cancelStripeSubscription(subscription.stripe_subscription_id);
        await run(
          "UPDATE premium_subscriptions SET status = 'cancelled' WHERE stripe_subscription_id = ?",
          [subscription.stripe_subscription_id]
        );
        return { success: "SUB_CANCEL_SUCCESS" };
      } catch (e) {
        console.error("Error cancelling Stripe subscription:", e);
        return fail(500, { error: "SUB_CANCEL_GATEWAY" });
      }
    }
    return fail(400, { error: "SUB_CANCEL_NOT_AUTO" });
  },
  updateProfile: async ({ request, locals, url }) => {
    if (!locals.user) {
      throw redirect(303, "/members/login");
    }
    const data = await request.formData();
    const name = (data.get("name") || "").trim();
    const cpf = (data.get("cpf") || "").trim().replace(/\D/g, "");
    const phone = (data.get("phone") || "").trim();
    const needCpf = await requiresBrazilianProfileForCheckout();
    if (!name) {
      return fail(400, { error: needCpf ? "PROFILE_NAME_CPF_REQUIRED" : "PROFILE_NAME_REQUIRED" });
    }
    if (needCpf) {
      if (!cpf) {
        return fail(400, { error: "PROFILE_NAME_CPF_REQUIRED" });
      }
      if (cpf.length !== 11) {
        return fail(400, { error: "PROFILE_CPF_INVALID" });
      }
    } else if (cpf && cpf.length > 0 && cpf.length !== 11) {
      return fail(400, { error: "PROFILE_CPF_INVALID" });
    }
    try {
      await run("UPDATE users SET name = ?, cpf = ?, phone = ? WHERE id = ?", [
        name,
        cpf || null,
        phone,
        locals.user.id
      ]);
      const redirectTo = (data.get("redirectTo") || url.searchParams.get("redirectTo") || "").trim();
      if (redirectTo) {
        throw redirect(303, redirectTo);
      }
      return { success: "PROFILE_UPDATE_SUCCESS" };
    } catch (e) {
      if (isRedirect(e)) throw e;
      console.error("Error updating user profile:", e);
      return fail(500, { error: "PROFILE_UPDATE_FAIL" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 44;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DekuTf-a.js')).default;
const server_id = "src/routes/members/dashboard/+page.server.ts";
const imports = ["_app/immutable/nodes/44.BoLtctM_.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/4SgIdhTS.js"];
const stylesheets = ["_app/immutable/assets/44.nFAxdLO1.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=44-DYRgQpwh.js.map
