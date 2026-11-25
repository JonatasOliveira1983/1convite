import { f as fail, r as redirect } from './index-BkmUvga9.js';
import { createPremiumPlan } from './database-GQg0oTqt.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const name = (data.get("name") || "").trim();
    const slug = (data.get("slug") || "").trim();
    const description = (data.get("description") || "").trim();
    const price_cents = parseInt(String(data.get("price_cents") || "0"), 10) || 0;
    const interval_days = parseInt(String(data.get("interval_days") || "30"), 10) || 30;
    const featuresRaw = data.get("features") || "";
    const is_active = data.get("is_active") === "on" ? 1 : 0;
    if (!name || !slug || !price_cents) {
      return fail(400, { message: "PREMIUM_REQUIRED_FIELDS" });
    }
    let features = [];
    if (featuresRaw) {
      try {
        features = JSON.parse(featuresRaw);
      } catch {
        features = featuresRaw.split("\n").map((s) => s.trim()).filter(Boolean);
      }
    }
    await createPremiumPlan({
      name,
      slug,
      description,
      price_cents,
      interval_days,
      features,
      is_active
    });
    throw redirect(303, "/admin/premium/plans");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions
});

const index = 26;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BOUIBfYo.js')).default;
const server_id = "src/routes/admin/premium/plans/new/+page.server.ts";
const imports = ["_app/immutable/nodes/26.DqdHxAzv.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/CCgN62RU.js"];
const stylesheets = ["_app/immutable/assets/26.CMY9bNAR.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=26-sfv9_ZQN.js.map
