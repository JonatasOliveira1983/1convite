import { f as fail } from './index-BkmUvga9.js';
import { getAllPremiumPlans, grantPremiumAccessManual, revokePremiumAccessManual, deleteUser, query } from './database-BjMeOB2B.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async () => {
  const members = await query(`
    SELECT u.id, u.username, u.created_at, 
           s.status as sub_status, s.expires_at as sub_expires_at, s.plan_id,
           p.name as plan_name
    FROM users u
    LEFT JOIN premium_subscriptions s ON u.id = s.user_id 
      AND s.id = (SELECT MAX(id) FROM premium_subscriptions WHERE user_id = u.id)
    LEFT JOIN premium_plans p ON s.plan_id = p.id
    WHERE u.role = 'member'
    ORDER BY u.created_at DESC
  `);
  const plans = await getAllPremiumPlans();
  return {
    members,
    plans
  };
};
const actions = {
  delete: async ({ request }) => {
    const data = await request.formData();
    const userIdStr = data.get("user_id");
    if (!userIdStr) {
      return fail(400, { error: "ID do usuário não fornecido" });
    }
    const userId = parseInt(userIdStr);
    try {
      await deleteUser(userId);
      return { success: "Usuário excluído com sucesso" };
    } catch (e) {
      console.error("Error deleting user:", e);
      return fail(500, { error: "Erro ao excluir usuário" });
    }
  },
  togglePremium: async ({ request }) => {
    const data = await request.formData();
    const userIdStr = data.get("user_id");
    const action = data.get("action");
    const planIdStr = data.get("plan_id");
    if (!userIdStr) {
      return fail(400, { error: "ID do usuário não fornecido" });
    }
    const userId = parseInt(userIdStr);
    try {
      if (action === "grant") {
        const plans = await getAllPremiumPlans();
        const activePlans = plans.filter((p) => p.is_active !== 0);
        let planId = planIdStr ? parseInt(planIdStr) : null;
        if (!planId && activePlans.length > 0) {
          planId = activePlans[0].id;
        }
        if (!planId) {
          return fail(400, { error: "Nenhum plano premium ativo cadastrado" });
        }
        await grantPremiumAccessManual(userId, planId, 30);
        return { success: "Acesso Premium concedido por 30 dias" };
      } else if (action === "revoke") {
        await revokePremiumAccessManual(userId);
        return { success: "Acesso Premium revogado" };
      }
      return fail(400, { error: "Ação inválida" });
    } catch (e) {
      console.error("Error toggling premium access:", e);
      return fail(500, { error: "Erro ao alterar acesso premium" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 34;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DM4eRX1e.js')).default;
const server_id = "src/routes/admin/users/+page.server.ts";
const imports = ["_app/immutable/nodes/34.B2Hj9Ojf.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/4SgIdhTS.js"];
const stylesheets = ["_app/immutable/assets/34.BKxc9YzJ.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=34-Bz9O5wdy.js.map
