import { f as fail, r as redirect } from './index-BkmUvga9.js';
import { toggleCommunityLike, queryOne, createCommunityTopic, getSettings, getAllCourses, getUserCoursePurchases, getAllPremiumPlans, getCommunityTopics } from './database-BjMeOB2B.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async ({ locals, url }) => {
  const settings = await getSettings();
  if (settings.enable_member_login !== "1") throw redirect(303, "/");
  const selectedCategory = url.searchParams.get("category") || void 0;
  const userId = locals.user?.id || 0;
  const userRole = locals.user?.role || "guest";
  const courses = await getAllCourses(true);
  const coursePurchases = userId ? await getUserCoursePurchases(userId) : [];
  const premiumPlans = await getAllPremiumPlans();
  const cheapestPlan = premiumPlans && premiumPlans.length > 0 ? premiumPlans[0] : null;
  const subscription = userId ? await queryOne(
    `SELECT id FROM premium_subscriptions WHERE user_id = ? AND status = 'active' AND (expires_at IS NULL OR expires_at > datetime('now'))`,
    [userId]
  ) : null;
  const hasPremium = !!subscription || userRole === "admin";
  const communityTopics = hasPremium && userId ? await getCommunityTopics("default", selectedCategory, userId) : [];
  const purchasedCourseIds = new Set(coursePurchases.map((p) => p.course_id));
  const enrichedCourses = courses.map((c) => ({
    ...c,
    hasAccess: c.access_type === "free" || hasPremium || c.access_type === "paid" && purchasedCourseIds.has(c.id)
  }));
  return {
    user: locals.user,
    courses: enrichedCourses,
    communityTopics,
    hasPremium,
    cheapestPlan,
    selectedCategory,
    settings
  };
};
const actions = {
  createTopic: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Não autorizado" });
    const subscription = await queryOne(
      `SELECT id FROM premium_subscriptions WHERE user_id = ? AND status = 'active' AND (expires_at IS NULL OR expires_at > datetime('now'))`,
      [locals.user.id]
    );
    const hasPremium = !!subscription || locals.user.role === "admin";
    if (!hasPremium) return fail(403, { error: "Exclusivo para assinantes VIP" });
    const data = await request.formData();
    const title = (data.get("title") || "").trim();
    const content = (data.get("content") || "").trim();
    const category = (data.get("category") || "Geral").trim();
    const isPinned = data.get("is_pinned") === "on" && locals.user.role === "admin";
    if (!title || title.length < 5) {
      return fail(400, { error: "O título deve ter pelo menos 5 caracteres" });
    }
    if (!content || content.length < 10) {
      return fail(400, { error: "O conteúdo deve ter pelo menos 10 caracteres" });
    }
    try {
      const topicId = await createCommunityTopic({
        userId: locals.user.id,
        title,
        content,
        category,
        isPinned
      });
      return { success: true, topicId };
    } catch (e) {
      console.error("Error creating community topic:", e);
      return fail(500, { error: "Erro ao publicar tópico" });
    }
  },
  toggleLike: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Não autorizado" });
    const data = await request.formData();
    const topicId = parseInt(data.get("topic_id"));
    if (!topicId || isNaN(topicId)) return fail(400, { error: "Tópico inválido" });
    try {
      const liked = await toggleCommunityLike(topicId, locals.user.id);
      return { success: true, liked, topicId };
    } catch (e) {
      console.error("Error toggling topic like:", e);
      return fail(500, { error: "Erro ao curtir tópico" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 41;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Bvw3Cmze.js')).default;
const server_id = "src/routes/members/area/+page.server.ts";
const imports = ["_app/immutable/nodes/41.DQtN2AH7.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/4SgIdhTS.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/41.BZJh8xkv.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=41-C_49D22h.js.map
