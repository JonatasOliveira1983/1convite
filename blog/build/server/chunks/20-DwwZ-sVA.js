import { getAllPostsAdmin } from './database-BjMeOB2B.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async () => {
  const posts = await getAllPostsAdmin();
  return { posts };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 20;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-OZR069aX.js')).default;
const server_id = "src/routes/admin/posts/+page.server.ts";
const imports = ["_app/immutable/nodes/20.D4kaMA_O.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/20.woCM47_4.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=20-DwwZ-sVA.js.map
