import { r as redirect } from './index-BkmUvga9.js';
import { validateSession } from './auth2-rxn-yo76.js';
import './shared-server-DaWdgxVh.js';
import './database-GQg0oTqt.js';
import 'crypto';
import 'bcryptjs';

async function load({ cookies, url }) {
  if (url.pathname === "/admin/login") {
    return {};
  }
  const token = cookies.get("admin_session");
  const username = await validateSession(token || "");
  if (!username) {
    if (token) {
      cookies.delete("admin_session", { path: "/" });
    }
    throw redirect(303, "/admin/login");
  }
  return {
    admin: { username }
  };
}

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-DLoNnAmO.js')).default;
const server_id = "src/routes/admin/+layout.server.ts";
const imports = ["_app/immutable/nodes/2.BKI87Mil.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/B_tIvOFa.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/2.B6IAMKup.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-DbqzOPl0.js.map
