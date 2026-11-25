import { getAllPosts, countPosts, getAllCategories, getSettings, getActiveAdsByPlacement } from './database-BjMeOB2B.js';
import { s as sanitizeAds } from './sanitize-beQ_Z907.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'jsdom';

const load = async ({ params, url }) => {
  const categorySlug = params.slug;
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = 7;
  const posts = await getAllPosts({ page, limit, categorySlug });
  const totalPosts = await countPosts({ categorySlug });
  const totalPages = Math.ceil(totalPosts / limit);
  const categories = await getAllCategories();
  const currentCategory = categories.find((c) => c.slug === categorySlug);
  const popularPosts = await getAllPosts({ limit: 4 });
  const settings = await getSettings();
  const sidebarAds = sanitizeAds(await getActiveAdsByPlacement("sidebar"));
  return {
    posts,
    currentPage: page,
    totalPages,
    categorySlug,
    currentCategory,
    categories,
    popularPosts,
    settings,
    sidebarAds
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 37;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BJzGolrY.js')).default;
const server_id = "src/routes/category/[slug]/+page.server.ts";
const imports = ["_app/immutable/nodes/37.1MXjxIoE.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/C2oiZHcT.js","_app/immutable/chunks/Diyh2ob8.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/5G-z3ydQ.js","_app/immutable/chunks/DIlIFEBx.js","_app/immutable/chunks/7QtYz8kT.js"];
const stylesheets = ["_app/immutable/assets/AdRenderer.DfbVOCHB.css","_app/immutable/assets/Pagination.DmakeXk_.css","_app/immutable/assets/37.wO0BeQsK.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=37-r4K-nKhu.js.map
