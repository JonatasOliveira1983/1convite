import { r as redirect } from './index-BkmUvga9.js';
import { deleteAd } from './database-BjMeOB2B.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const actions = {
  default: async ({ params }) => {
    deleteAd(params.id);
    throw redirect(303, "/admin/ads");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions
});

const index = 8;
const server_id = "src/routes/admin/ads/[id]/delete/+page.server.ts";
const imports = [];
const stylesheets = [];
const fonts = [];

export { fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-CvdoBgtT.js.map
