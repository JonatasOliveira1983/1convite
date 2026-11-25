import { getAllPremiumPlans } from './database-GQg0oTqt.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async () => {
  const plans = await getAllPremiumPlans();
  return { plans };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 25;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DkK2DD83.js')).default;
const server_id = "src/routes/admin/premium/plans/+page.server.ts";
const imports = ["_app/immutable/nodes/25.BYq4KMiM.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/25.oULeZzZa.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=25-DPi8pFer.js.map
