import { getAllAds } from './database-BjMeOB2B.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

async function load() {
  const ads = await getAllAds();
  return { ads };
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DTX9egtd.js')).default;
const server_id = "src/routes/admin/ads/+page.server.ts";
const imports = ["_app/immutable/nodes/5.hUnOMbc5.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/4SgIdhTS.js"];
const stylesheets = ["_app/immutable/assets/5.CYhCPPBc.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-CHBI5cOl.js.map
