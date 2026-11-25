import { f as fail } from './index-BkmUvga9.js';
import { regenerateCLIToken, getCLITokenStatus, getAllCategories, getPostsAdminPage } from './database-GQg0oTqt.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async () => {
  const [tokenStatus, categories, postPage] = await Promise.all([
    getCLITokenStatus(),
    getAllCategories(),
    getPostsAdminPage({ page: 1, limit: 10 })
  ]);
  const posts = postPage.posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    published: Boolean(p.published),
    created_at: p.created_at
  }));
  return {
    token: null,
    tokenConfigured: tokenStatus.configured,
    tokenExpiresAt: tokenStatus.expiresAt,
    categories,
    posts
  };
};
const actions = {
  regenerate: async () => {
    try {
      const token = await regenerateCLIToken();
      const status = await getCLITokenStatus();
      return { success: true, token, tokenExpiresAt: status.expiresAt };
    } catch (e) {
      return fail(500, { error: "Erro ao regenerar token" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 10;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CZrxOqhh.js')).default;
const server_id = "src/routes/admin/cli/+page.server.ts";
const imports = ["_app/immutable/nodes/10.CFYFpixS.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/CCgN62RU.js"];
const stylesheets = ["_app/immutable/assets/10.jZ-0nZTZ.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=10-BMQF5iuq.js.map
