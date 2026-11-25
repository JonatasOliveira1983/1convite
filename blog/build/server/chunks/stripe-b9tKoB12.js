import Stripe from 'stripe';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import { getSettings } from './database-GQg0oTqt.js';

async function getStripeSettings() {
  const settings = await getSettings();
  const currency = (private_env.STRIPE_CURRENCY || settings.stripe_currency || "brl").toLowerCase().trim() || "brl";
  return {
    secretKey: private_env.STRIPE_SECRET_KEY || settings.stripe_secret_key || "",
    webhookSecret: private_env.STRIPE_WEBHOOK_SECRET || settings.stripe_webhook_secret || "",
    publishableKey: private_env.STRIPE_PUBLISHABLE_KEY || settings.stripe_publishable_key || "",
    siteUrl: private_env.SITE_URL || settings.site_url || "https://seusite.com",
    currency
  };
}
async function isStripeConfigured() {
  const s = await getStripeSettings();
  return !!s.secretKey;
}
async function getStripeClient() {
  const s = await getStripeSettings();
  if (!s.secretKey) throw new Error("Stripe secret key not configured");
  return new Stripe(s.secretKey);
}
function mapIntervalDays(days) {
  if (days <= 7) return { interval: "week", interval_count: 1 };
  if (days <= 31) return { interval: "month", interval_count: 1 };
  if (days <= 93) return { interval: "month", interval_count: 3 };
  if (days <= 186) return { interval: "month", interval_count: 6 };
  return { interval: "year", interval_count: 1 };
}
async function createSubscriptionCheckout(params) {
  const stripe = await getStripeClient();
  const settings = await getStripeSettings();
  const site = settings.siteUrl.replace(/\/$/, "");
  const recurring = mapIntervalDays(params.intervalDays);
  const currency = (params.currency || settings.currency || "brl").toLowerCase();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: params.priceCents,
          recurring: {
            interval: recurring.interval,
            interval_count: recurring.interval_count
          },
          product_data: {
            name: params.planName
          }
        },
        quantity: 1
      }
    ],
    success_url: `${site}/members/dashboard?checkout=success`,
    cancel_url: `${site}/premium?checkout=cancelled`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    metadata: {
      type: "premium_subscription",
      user_id: String(params.userId),
      plan_id: String(params.planId)
    },
    subscription_data: {
      metadata: {
        user_id: String(params.userId),
        plan_id: String(params.planId)
      }
    }
  });
  if (!session.url) throw new Error("Stripe Checkout session missing URL");
  return { sessionId: session.id, url: session.url };
}
async function createOneTimeCheckout(params) {
  const stripe = await getStripeClient();
  const settings = await getStripeSettings();
  const site = settings.siteUrl.replace(/\/$/, "");
  const currency = (params.currency || settings.currency || "brl").toLowerCase();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: params.priceCents,
          product_data: { name: params.productName }
        },
        quantity: 1
      }
    ],
    success_url: `${site}${params.successPath || "/members/dashboard?checkout=success"}`,
    cancel_url: `${site}${params.cancelPath || "/products?checkout=cancelled"}`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    metadata: {
      type: params.kind === "product" ? "product_purchase" : "course_purchase",
      user_id: String(params.userId),
      product_id: params.productId != null ? String(params.productId) : "",
      course_id: params.courseId != null ? String(params.courseId) : "",
      buyer_access_id: params.buyerAccessId || ""
    }
  });
  if (!session.url) throw new Error("Stripe Checkout session missing URL");
  return { sessionId: session.id, url: session.url };
}
async function cancelStripeSubscription(stripeSubscriptionId) {
  const stripe = await getStripeClient();
  await stripe.subscriptions.cancel(stripeSubscriptionId);
}
async function constructStripeEvent(rawBody, signature) {
  const stripe = await getStripeClient();
  const settings = await getStripeSettings();
  if (!settings.webhookSecret) {
    throw new Error("Stripe webhook secret not configured");
  }
  return stripe.webhooks.constructEvent(rawBody, signature, settings.webhookSecret);
}

export { createSubscriptionCheckout as a, createOneTimeCheckout as b, cancelStripeSubscription as c, constructStripeEvent as d, isStripeConfigured as i };
//# sourceMappingURL=stripe-b9tKoB12.js.map
