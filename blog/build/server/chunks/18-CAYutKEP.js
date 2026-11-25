import { r as redirect } from './index-BkmUvga9.js';
import { destroySession } from './auth2-rxn-yo76.js';
import './shared-server-DaWdgxVh.js';
import './database-GQg0oTqt.js';
import 'crypto';
import 'bcryptjs';

const actions = {
  default: async ({ cookies }) => {
    const token = cookies.get("admin_session");
    if (token) {
      await destroySession(token);
    }
    cookies.delete("admin_session", { path: "/" });
    throw redirect(303, "/admin/login");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions
});

const index = 18;
const server_id = "src/routes/admin/logout/+page.server.ts";
const imports = [];
const stylesheets = [];
const fonts = [];

export { fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-CAYutKEP.js.map
