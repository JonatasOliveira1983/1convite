import { f as fail, r as redirect, e as error } from './index-BkmUvga9.js';
import { toggleCommunityLike, queryOne, deleteCommunityTopic, deleteCommunityComment, createCommunityComment, getCommunityTopicById, getCommunityComments } from './database-BjMeOB2B.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async ({ params, locals }) => {
  if (!locals.user) throw redirect(303, "/members/login?redirectTo=/members/area");
  const subscription = await queryOne(
    `SELECT id FROM premium_subscriptions WHERE user_id = ? AND status = 'active' AND (expires_at IS NULL OR expires_at > datetime('now'))`,
    [locals.user.id]
  );
  const hasPremium = !!subscription || locals.user.role === "admin";
  if (!hasPremium) throw redirect(303, "/members/area");
  const topicId = parseInt(params.id);
  if (isNaN(topicId)) throw error(404, "Tópico inválido");
  const topic = await getCommunityTopicById(topicId, locals.user.id);
  if (!topic) throw error(404, "Tópico não encontrado");
  const comments = await getCommunityComments(topicId);
  return {
    user: locals.user,
    topic,
    comments,
    hasPremium
  };
};
const actions = {
  addComment: async ({ request, params, locals }) => {
    if (!locals.user) return fail(401, { error: "Não autorizado" });
    const topicId = parseInt(params.id);
    const data = await request.formData();
    const content = (data.get("content") || "").trim();
    if (!content || content.length < 2) {
      return fail(400, { error: "O comentário deve ter pelo menos 2 caracteres" });
    }
    try {
      await createCommunityComment({
        topicId,
        userId: locals.user.id,
        content
      });
      return { success: true };
    } catch (e) {
      console.error("Error adding comment:", e);
      return fail(500, { error: "Erro ao enviar comentário" });
    }
  },
  deleteComment: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Não autorizado" });
    const data = await request.formData();
    const commentId = parseInt(data.get("comment_id"));
    const topicId = parseInt(data.get("topic_id"));
    if (!commentId || !topicId) return fail(400, { error: "Dados inválidos" });
    const comment = await queryOne(`SELECT user_id FROM community_comments WHERE id = ?`, [commentId]);
    if (!comment) return fail(404, { error: "Comentário não encontrado" });
    if (comment.user_id !== locals.user.id && locals.user.role !== "admin") {
      return fail(403, { error: "Sem permissão" });
    }
    try {
      await deleteCommunityComment(commentId, topicId);
      return { success: true };
    } catch (e) {
      console.error("Error deleting comment:", e);
      return fail(500, { error: "Erro ao excluir comentário" });
    }
  },
  deleteTopic: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: "Não autorizado" });
    const data = await request.formData();
    const topicId = parseInt(data.get("topic_id"));
    if (!topicId) return fail(400, { error: "Tópico inválido" });
    const topic = await queryOne(`SELECT user_id FROM community_topics WHERE id = ?`, [topicId]);
    if (!topic) return fail(404, { error: "Tópico não encontrado" });
    if (topic.user_id !== locals.user.id && locals.user.role !== "admin") {
      return fail(403, { error: "Sem permissão" });
    }
    try {
      await deleteCommunityTopic(topicId);
      throw redirect(303, "/members/area");
    } catch (e) {
      if (e?.status === 303) throw e;
      console.error("Error deleting topic:", e);
      return fail(500, { error: "Erro ao excluir tópico" });
    }
  },
  toggleLike: async ({ params, locals }) => {
    if (!locals.user) return fail(401, { error: "Não autorizado" });
    const topicId = parseInt(params.id);
    try {
      const liked = await toggleCommunityLike(topicId, locals.user.id);
      return { success: true, liked };
    } catch (e) {
      console.error("Error toggling like:", e);
      return fail(500, { error: "Erro ao curtir" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 42;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-D-H79Tdd.js')).default;
const server_id = "src/routes/members/area/topic/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/42.CmTDttm-.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/4SgIdhTS.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/42.FM7alHVw.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=42-By3rU_ru.js.map
