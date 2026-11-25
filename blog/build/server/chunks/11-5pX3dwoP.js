import { f as fail } from './index-BkmUvga9.js';
import { deleteCommunityTopic, togglePinCommunityTopic, getCommunityTopics, getCommunityStats } from './database-GQg0oTqt.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async () => {
  const topics = await getCommunityTopics("default");
  const stats = await getCommunityStats();
  return {
    topics,
    stats
  };
};
const actions = {
  togglePin: async ({ request }) => {
    const data = await request.formData();
    const topicId = parseInt(data.get("topic_id"));
    const isPinned = data.get("is_pinned") === "true";
    if (!topicId) return fail(400, { error: "ID do tópico inválido" });
    try {
      await togglePinCommunityTopic(topicId, !isPinned);
      return { success: true };
    } catch (e) {
      console.error("Error toggling pin:", e);
      return fail(500, { error: "Erro ao fixar tópico" });
    }
  },
  deleteTopic: async ({ request }) => {
    const data = await request.formData();
    const topicId = parseInt(data.get("topic_id"));
    if (!topicId) return fail(400, { error: "ID do tópico inválido" });
    try {
      await deleteCommunityTopic(topicId);
      return { success: true };
    } catch (e) {
      console.error("Error deleting topic:", e);
      return fail(500, { error: "Erro ao excluir tópico" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 11;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DrGZHPU1.js')).default;
const server_id = "src/routes/admin/community/+page.server.ts";
const imports = ["_app/immutable/nodes/11.DnaUgkSW.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/CCgN62RU.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/11.BvN-ewKz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-5pX3dwoP.js.map
