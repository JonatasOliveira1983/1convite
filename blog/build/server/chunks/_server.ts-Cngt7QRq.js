import { j as json } from './index-BkmUvga9.js';
import { getSettings, getSubscriptionByAsaasId, getPaymentByAsaasId, createPayment, queryOne, updateSubscriptionByAsaasId, run } from './database-BjMeOB2B.js';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import 'crypto';

const POST = async ({ request }) => {
  try {
    const asaasToken = request.headers.get("asaas-access-token");
    const settings = await getSettings();
    const webhookSecret = private_env.ASAAS_WEBHOOK_SECRET || settings.asaas_webhook_secret || "";
    if (!webhookSecret || asaasToken !== webhookSecret) {
      console.warn("[ASAAS WEBHOOK] Unauthorized request received");
      return json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const event = body.event;
    console.log(`[ASAAS WEBHOOK] Received event: ${event}`);
    if (event === "PAYMENT_RECEIVED" || event === "PAYMENT_CONFIRMED") {
      const payment = body.payment;
      if (payment.subscription) {
        const subscription = await getSubscriptionByAsaasId(payment.subscription);
        if (subscription) {
          const existingPayment = await getPaymentByAsaasId(payment.id);
          if (!existingPayment) {
            await createPayment({
              subscription_id: subscription.id,
              amount_cents: Math.round(payment.value * 100),
              status: "approved",
              payment_method: payment.billingType || "UNDEFINED",
              asaas_payment_id: payment.id
            });
          }
          const planInfo = await queryOne(`
            SELECT p.interval_days 
            FROM premium_subscriptions s 
            JOIN premium_plans p ON s.plan_id = p.id 
            WHERE s.asaas_subscription_id = ?
          `, [payment.subscription]);
          const intervalDays = planInfo?.interval_days || 30;
          const expiresAt = /* @__PURE__ */ new Date();
          expiresAt.setDate(expiresAt.getDate() + intervalDays + 2);
          const expiresAtStr = expiresAt.toISOString().replace("T", " ").substring(0, 19);
          await updateSubscriptionByAsaasId(payment.subscription, {
            status: "active",
            expires_at: expiresAtStr
          });
          console.log(`[ASAAS WEBHOOK] Updated subscription ${payment.subscription} to active. Expires at: ${expiresAtStr}`);
        } else {
          console.warn(`[ASAAS WEBHOOK] Subscription ${payment.subscription} not found in database`);
        }
      } else {
        const purchase = await queryOne("SELECT pp.*, p.resource_type FROM product_purchases pp LEFT JOIN products p ON pp.product_id = p.id WHERE pp.asaas_payment_id = ?", [payment.id]);
        if (purchase) {
          const newStatus = purchase.resource_type === "manual" ? "pending_delivery" : "completed";
          await run("UPDATE product_purchases SET status = ? WHERE asaas_payment_id = ?", [newStatus, payment.id]);
          console.log(`[ASAAS WEBHOOK] Updated product purchase ${purchase.id} to ${newStatus} (resource_type: ${purchase.resource_type || "file"})`);
        } else {
          const coursePurchase = await queryOne("SELECT * FROM course_purchases WHERE asaas_payment_id = ?", [payment.id]);
          if (coursePurchase) {
            await run("UPDATE course_purchases SET status = 'approved' WHERE asaas_payment_id = ?", [payment.id]);
            console.log(`[ASAAS WEBHOOK] Updated course purchase ${coursePurchase.id} to approved`);
          } else {
            console.warn(`[ASAAS WEBHOOK] One-off payment ${payment.id} not associated with subscription, product purchase or course purchase`);
          }
        }
      }
    } else if (event === "SUBSCRIPTION_DELETED") {
      const subscription = body.subscription;
      if (subscription && subscription.id) {
        const result = await run(
          "UPDATE premium_subscriptions SET status = 'cancelled' WHERE asaas_subscription_id = ?",
          [subscription.id]
        );
        if (result.changes > 0) {
          console.log(`[ASAAS WEBHOOK] Subscription ${subscription.id} marked as cancelled`);
        } else {
          console.warn(`[ASAAS WEBHOOK] Subscription ${subscription.id} not found to cancel`);
        }
      }
    }
    return json({ received: true });
  } catch (e) {
    console.error("[ASAAS WEBHOOK] Error handling webhook:", e);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export { POST };
//# sourceMappingURL=_server.ts-Cngt7QRq.js.map
