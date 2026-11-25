import { getAllProducts, getProductCategories, getSettings } from './database-BjMeOB2B.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async ({ locals }) => {
  const [products, categories, settings] = await Promise.all([
    getAllProducts(),
    getProductCategories(),
    getSettings()
  ]);
  const safeProducts = products.map((product) => ({
    ...product,
    file_url: void 0,
    external_link: void 0
  }));
  return {
    products: safeProducts,
    // Full catalog from product_categories (not only categories already used by products)
    categories,
    settings,
    user: locals.user ?? null
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 53;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DlVov5XP.js')).default;
const server_id = "src/routes/products/+page.server.ts";
const imports = ["_app/immutable/nodes/53.6b5d4UWU.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/C2oiZHcT.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/53.BttaFyqS.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=53-e0ir7SLa.js.map
