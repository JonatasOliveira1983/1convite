import { e as error } from './index-BkmUvga9.js';
import { getAllCategories } from './database-BjMeOB2B.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

async function load() {
  try {
    const categories = await getAllCategories();
    return {
      categories
    };
  } catch (e) {
    console.error("Error loading categories:", e);
    throw error(500, "Erro ao carregar categorias");
  }
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 36;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CB8Ou0Fx.js')).default;
const server_id = "src/routes/categories/+page.server.ts";
const imports = ["_app/immutable/nodes/36.DimP0Va9.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DxJrjgDp.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/7QtYz8kT.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/Diyh2ob8.js","_app/immutable/chunks/CdaOWOgq.js","_app/immutable/chunks/C3Y6fntU.js"];
const stylesheets = ["_app/immutable/assets/ToastContainer.VrDMKRQc.css","_app/immutable/assets/AdRenderer.DfbVOCHB.css","_app/immutable/assets/Alert.C3-170sm.css","_app/immutable/assets/Toast.IPh-0y4o.css","_app/immutable/assets/36.D9w--uKX.css","_app/immutable/assets/NewsletterSignup.9hCEwdVt.css","_app/immutable/assets/Pagination.DmakeXk_.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=36-Czoig4pt.js.map
