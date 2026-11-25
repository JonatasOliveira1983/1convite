import { f as fail, e as error } from './index-BkmUvga9.js';
import { getProductBySlug, getSettings, hasUserPurchasedProduct, queryOne, hasUserReviewedProduct, createProductReview, getProductPurchaseForUser, getProductReviews, getProductReviewSummary, getRelatedProducts } from './database-GQg0oTqt.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async ({ params, locals }) => {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    throw error(404, "Produto não encontrado");
  }
  const settings = await getSettings();
  let hasPurchased = false;
  let isPremiumAccess = false;
  let purchaseStatus = null;
  let hasReviewed = false;
  if (product.price_cents <= 0) {
    hasPurchased = true;
  } else if (locals.user) {
    if (locals.user.role === "admin") {
      hasPurchased = true;
    } else {
      hasPurchased = await hasUserPurchasedProduct(locals.user.id, product.id);
      if (hasPurchased) {
        const purchaseRecord = await getProductPurchaseForUser(locals.user.id, product.id);
        purchaseStatus = purchaseRecord?.status || null;
      }
      if (!hasPurchased && settings.enable_member_login === "1" && product.is_premium_included && product.is_premium_included >= 1) {
        let subscription;
        if (product.is_premium_included === 1) {
          subscription = await queryOne(
            `SELECT id FROM premium_subscriptions
                         WHERE user_id = ?
                           AND status = 'active'
                           AND (expires_at IS NULL OR expires_at > datetime('now'))`,
            [locals.user.id]
          );
        } else {
          subscription = await queryOne(
            `SELECT id FROM premium_subscriptions
                         WHERE user_id = ?
                           AND plan_id = ?
                           AND status = 'active'
                           AND (expires_at IS NULL OR expires_at > datetime('now'))`,
            [locals.user.id, product.is_premium_included]
          );
        }
        if (subscription) {
          hasPurchased = true;
          isPremiumAccess = true;
        }
      }
    }
  }
  const [reviews, reviewSummary] = await Promise.all([
    getProductReviews(product.id),
    getProductReviewSummary(product.id)
  ]);
  if (locals.user) {
    hasReviewed = await hasUserReviewedProduct(locals.user.id, product.id);
  }
  const isManual = product.resource_type === "manual";
  const safeProduct = {
    ...product,
    file_url: hasPurchased ? product.file_url : void 0,
    // external_link: apenas para tipos 'link' (não para 'manual' — esse é link privado do admin)
    external_link: hasPurchased && !isManual ? product.external_link : void 0
  };
  const relatedProducts = await getRelatedProducts(product.id, product.category_id || null, 3);
  const safeRelatedProducts = relatedProducts.map((p) => ({
    ...p,
    file_url: void 0,
    external_link: void 0
  }));
  return {
    product: safeProduct,
    hasPurchased,
    isPremiumAccess,
    purchaseStatus,
    hasReviewed,
    reviews,
    reviewSummary,
    user: locals.user ?? null,
    settings,
    relatedProducts: safeRelatedProducts
  };
};
const actions = {
  addReview: async ({ request, locals, params }) => {
    if (!locals.user) {
      return fail(401, { message: "Você precisa estar logado para avaliar." });
    }
    const product = await getProductBySlug(params.slug);
    if (!product) {
      return fail(404, { message: "Produto não encontrado." });
    }
    const settings = await getSettings();
    let canReview = false;
    if (product.price_cents <= 0) {
      canReview = true;
    } else if (locals.user.role === "admin") {
      canReview = true;
    } else {
      canReview = await hasUserPurchasedProduct(locals.user.id, product.id);
      if (!canReview && settings.enable_member_login === "1") {
        const subscription = await queryOne(
          `SELECT id FROM premium_subscriptions
                     WHERE user_id = ? AND status = 'active'
                     AND (expires_at IS NULL OR expires_at > datetime('now'))`,
          [locals.user.id]
        );
        if (subscription) canReview = true;
      }
    }
    if (!canReview) {
      return fail(403, { message: "Apenas compradores deste produto podem deixar uma avaliação." });
    }
    const alreadyReviewed = await hasUserReviewedProduct(locals.user.id, product.id);
    if (alreadyReviewed) {
      return fail(400, { message: "Você já deixou uma avaliação para este produto." });
    }
    const data = await request.formData();
    const rating = parseInt(data.get("rating"));
    const comment = data.get("comment");
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return fail(400, { message: "A nota deve ser entre 1 e 5 estrelas." });
    }
    try {
      await createProductReview({
        productId: product.id,
        userId: locals.user.id,
        rating,
        comment: comment ? comment.trim() : null
      });
    } catch (e) {
      console.error("Error creating product review:", e);
      return fail(500, { message: "Erro interno ao salvar sua avaliação." });
    }
    return { success: true, message: "Avaliação enviada com sucesso! Obrigado por avaliar." };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 52;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BUPM7CC-.js')).default;
const server_id = "src/routes/product/[slug]/+page.server.ts";
const imports = ["_app/immutable/nodes/52.CQaETL1P.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/CCgN62RU.js","_app/immutable/chunks/C2oiZHcT.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/52.D-ICHv7K.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=52-DtP9N86H.js.map
