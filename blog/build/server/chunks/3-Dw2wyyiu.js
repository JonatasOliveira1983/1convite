import { getSettings, getUserInterests, countPosts, getAllCategories, getAllPosts, getAllProducts, hasUserPurchasedProduct, getActiveAdsByPlacement } from './database-BjMeOB2B.js';
import { s as sanitizeAds } from './sanitize-beQ_Z907.js';
import { l as loadRecentlySeen, g as getHomeFeed, a as getRecommendationReason } from './interest-engine-DkiIaEty.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'jsdom';

const load = async ({ url, locals, cookies }) => {
  const page = Number(url.searchParams.get("page")) || 1;
  const search = url.searchParams.get("q") || "";
  const limit = 7;
  const settings = await getSettings();
  const recommendationsEnabled = settings.enable_recommendations !== "0";
  let userInterests;
  let recentlySeen;
  if (recommendationsEnabled) {
    if (locals.user) {
      userInterests = await getUserInterests(locals.user.id);
    } else {
      const cookieVal = cookies.get("user_interests");
      if (cookieVal) {
        try {
          userInterests = JSON.parse(cookieVal);
        } catch {
        }
      }
    }
    recentlySeen = await loadRecentlySeen(locals, cookies);
  }
  const rawPosts = await getHomeFeed({
    page,
    limit,
    search,
    userInterests,
    recommendationsEnabled,
    recentlySeen
  });
  const posts = rawPosts.map((p) => ({
    ...p,
    recommendationReason: getRecommendationReason(p, userInterests)
  }));
  const totalPosts = await countPosts({ search });
  const totalPages = Math.ceil(totalPosts / limit);
  const categories = await getAllCategories();
  const popularPosts = await getAllPosts({ limit: 4 });
  const rawProducts = await getAllProducts();
  const products = await Promise.all(
    rawProducts.map(async (p) => {
      let hasPurchased = false;
      if (p.price_cents <= 0) {
        hasPurchased = true;
      } else if (locals.user) {
        if (locals.user.role === "admin") {
          hasPurchased = true;
        } else {
          hasPurchased = await hasUserPurchasedProduct(locals.user.id, p.id);
        }
      }
      return {
        ...p,
        hasPurchased
      };
    })
  );
  const sidebarAds = sanitizeAds(await getActiveAdsByPlacement("sidebar"));
  const homeMiddleAds = sanitizeAds(await getActiveAdsByPlacement("home_middle"));
  return {
    posts,
    currentPage: page,
    totalPages,
    searchQuery: search,
    categories,
    popularPosts,
    sidebarAds,
    homeMiddleAds,
    products
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CUjfb1XM.js')).default;
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/3.Bc0JPJI7.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/C2oiZHcT.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/Diyh2ob8.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/CxNVwNqx.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/7QtYz8kT.js","_app/immutable/chunks/5G-z3ydQ.js","_app/immutable/chunks/CdaOWOgq.js","_app/immutable/chunks/DIlIFEBx.js"];
const stylesheets = ["_app/immutable/assets/AdRenderer.DfbVOCHB.css","_app/immutable/assets/NewsletterSignup.9hCEwdVt.css","_app/immutable/assets/Alert.C3-170sm.css","_app/immutable/assets/Pagination.DmakeXk_.css","_app/immutable/assets/3.Bo28enl8.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-Dw2wyyiu.js.map
