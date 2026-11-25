import { e as error } from './index-BkmUvga9.js';
import { getPostBySlug, isUserPremium, getSettings, getAllCategories, getAllPosts, getProductsByPostId, hasUserPurchasedProduct, getUserInterests, getCollaborativeRecommendations, getRelatedPosts, getActiveAdsByPlacement } from './database-GQg0oTqt.js';
import { a as getRecommendationReason } from './interest-engine-B2U744d7.js';
import { b as sanitizeHtml, s as sanitizeAds } from './sanitize-beQ_Z907.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'jsdom';

const load = async ({ params, locals, cookies }) => {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    throw error(404, "Post não encontrado");
  }
  let hasAccess = true;
  if (post.is_premium === 1) {
    if (!locals.user) {
      hasAccess = false;
    } else if (locals.user.role !== "admin") {
      const userIsPremium = await isUserPremium(locals.user.id);
      if (!userIsPremium) {
        hasAccess = false;
      }
    }
  }
  const previewContent = post.excerpt ? post.excerpt : post.content.replace(/<[^>]*>/g, "").substring(0, 350) + "...";
  const sanitizedPost = {
    ...post,
    content: hasAccess ? sanitizeHtml(post.content) : sanitizeHtml(previewContent),
    excerpt: post.excerpt ? sanitizeHtml(post.excerpt) : null
  };
  const settings = await getSettings();
  const categories = await getAllCategories();
  const popularPosts = await getAllPosts({ limit: 4 });
  const rawProducts = await getProductsByPostId(post.id);
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
  let userInterests = void 0;
  let collaborativePosts = [];
  if (settings.enable_recommendations !== "0") {
    if (locals.user) {
      userInterests = await getUserInterests(locals.user.id);
    } else {
      const cookieVal = cookies.get("user_interests");
      if (cookieVal) {
        try {
          userInterests = JSON.parse(cookieVal);
        } catch (e) {
        }
      }
    }
    try {
      collaborativePosts = await getCollaborativeRecommendations(post.id, 3);
    } catch (e) {
      console.error("Error fetching collaborative recommendations:", e);
    }
  }
  const collaborativeIds = new Set(collaborativePosts.map((p) => p.id));
  const sanitizedCollaborative = collaborativePosts.map((p) => ({
    ...p,
    excerpt: p.excerpt ? sanitizeHtml(p.excerpt) : null,
    recommendationReason: getRecommendationReason(p, userInterests)
  }));
  const normalRelated = (await getRelatedPosts(post.id, 6, userInterests)).filter((p) => !collaborativeIds.has(p.id)).map((p) => ({
    ...p,
    excerpt: p.excerpt ? sanitizeHtml(p.excerpt) : null,
    recommendationReason: getRecommendationReason(p, userInterests)
  }));
  const relatedPosts = [...sanitizedCollaborative, ...normalRelated].slice(0, 3);
  const sidebarAds = sanitizeAds(await getActiveAdsByPlacement("sidebar"));
  const postInlineAds = sanitizeAds(await getActiveAdsByPlacement("post_inline"));
  return {
    post: sanitizedPost,
    hasAccess,
    settings,
    categories,
    popularPosts,
    sidebarAds,
    postInlineAds,
    relatedPosts,
    products
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 49;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DYgbmzlO.js')).default;
const server_id = "src/routes/post/[slug]/+page.server.ts";
const imports = ["_app/immutable/nodes/49.a6MSaipY.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/C2oiZHcT.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/5G-z3ydQ.js","_app/immutable/chunks/qWZI6F1S.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/nxeceyZq.js","_app/immutable/chunks/7QtYz8kT.js"];
const stylesheets = ["_app/immutable/assets/AdRenderer.DfbVOCHB.css","_app/immutable/assets/NewsletterSignup.9hCEwdVt.css","_app/immutable/assets/49.aeNfKiaP.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=49-BJZILWcS.js.map
