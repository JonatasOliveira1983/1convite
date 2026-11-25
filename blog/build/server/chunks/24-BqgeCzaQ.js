import { r as redirect, f as fail } from './index-BkmUvga9.js';
import { deletePost } from './database-BjMeOB2B.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const actions = {
  default: async ({ params }) => {
    const id = parseInt(params.id);
    try {
      await deletePost(id);
      throw redirect(303, "/admin/posts");
    } catch (error) {
      if (error.status === 303) {
        throw error;
      }
      return fail(500, { error: "Erro ao excluir post" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions
});

const index = 24;
const server_id = "src/routes/admin/posts/[id]/delete/+page.server.ts";
const imports = [];
const stylesheets = [];
const fonts = [];

export { fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=24-BqgeCzaQ.js.map
