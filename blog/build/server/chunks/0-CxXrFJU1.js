import { getSettings, getUserByUsername, isUserPremium, getActiveAdsByPlacement, getAllPosts, getPublishedWebStories } from './database-GQg0oTqt.js';
import { validateSession } from './auth2-rxn-yo76.js';
import { s as sanitizeAds } from './sanitize-beQ_Z907.js';
import { g as getActivePaymentGateway, i as isAnyPaymentGatewayConfigured } from './payments-JiYPPeF0.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'bcryptjs';
import 'jsdom';
import './stripe-b9tKoB12.js';
import 'stripe';

async function load({ cookies }) {
  const settings = await getSettings();
  const token = cookies.get("member_session");
  let user = null;
  let isPremium = false;
  if (token) {
    const username = await validateSession(token);
    if (username) {
      const dbUser = await getUserByUsername(username);
      if (dbUser) {
        user = {
          id: dbUser.id,
          username: dbUser.username,
          role: dbUser.role || "member",
          createdAt: dbUser.created_at
        };
        isPremium = await isUserPremium(dbUser.id);
      }
    }
  }
  const sidebarAds = sanitizeAds(await getActiveAdsByPlacement("sidebar"));
  const popularPosts = await getAllPosts({ limit: 4 });
  let webStories = [];
  if (settings.enable_web_stories_bar === "1") {
    try {
      webStories = await getPublishedWebStories(24);
    } catch {
      webStories = [];
    }
  }
  let paymentGateway = "asaas";
  let paymentConfigured = false;
  try {
    paymentGateway = await getActivePaymentGateway();
    paymentConfigured = await isAnyPaymentGatewayConfigured();
  } catch {
    paymentGateway = "asaas";
    paymentConfigured = false;
  }
  const stripeCurrency = (settings.stripe_currency || "brl").toUpperCase();
  const displayCurrency = paymentGateway === "stripe" ? stripeCurrency || "USD" : "BRL";
  return {
    settings,
    user,
    isPremium,
    sidebarAds,
    popularPosts,
    webStories,
    language: settings.site_language || "pt",
    paymentGateway,
    paymentConfigured,
    displayCurrency
  };
}

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-DxbW9szH.js')).default;
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.CprEycSJ.js","_app/immutable/chunks/BkNKlVbO.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/B_tIvOFa.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/DRa3Z_YE.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/7QtYz8kT.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/C2oiZHcT.js"];
const stylesheets = ["_app/immutable/assets/Toast.IPh-0y4o.css","_app/immutable/assets/0.D0vHhETT.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=0-CxXrFJU1.js.map
