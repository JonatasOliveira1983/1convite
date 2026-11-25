import { queryOne, markManualDelivered, getSalesSummary, getSalesHistory, getUsersHoldings } from './database-BjMeOB2B.js';
import { b as sendManualAccessDeliveredEmail } from './resend-CHnsiKjZ.js';
import { f as fail } from './index-BkmUvga9.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async () => {
  const [summary, history, holdings] = await Promise.all([
    getSalesSummary(),
    getSalesHistory(),
    getUsersHoldings()
  ]);
  return {
    summary,
    history,
    holdings
  };
};
const actions = {
  markDelivered: async ({ request }) => {
    const data = await request.formData();
    const purchaseId = parseInt(data.get("purchase_id"));
    if (!purchaseId || isNaN(purchaseId)) {
      return fail(400, { message: "ID da compra inválido." });
    }
    const purchase = await queryOne(
      `SELECT pp.*, u.username as buyer_email, u.name as buyer_name, p.name as product_name, p.drive_instructions
             FROM product_purchases pp
             JOIN users u ON pp.user_id = u.id
             LEFT JOIN products p ON pp.product_id = p.id
             WHERE pp.id = ? AND pp.status = 'pending_delivery'`,
      [purchaseId]
    );
    if (!purchase) {
      return fail(404, { message: "Compra não encontrada ou já entregue." });
    }
    await markManualDelivered(purchaseId);
    try {
      const buyerName = purchase.buyer_name || purchase.buyer_email.split("@")[0];
      const productName = purchase.product_name || "seu produto";
      const instructions = purchase.drive_instructions || "Verifique sua área de membros ou entre em contato conosco caso não encontre o acesso.";
      const accessId = purchase.buyer_access_id || purchase.buyer_email;
      await sendManualAccessDeliveredEmail(
        purchase.buyer_email,
        buyerName,
        productName,
        accessId,
        instructions
      );
      console.log(`[SALES] Notificação de entrega enviada para ${purchase.buyer_email} (compra #${purchaseId})`);
    } catch (emailErr) {
      console.error("[SALES] Erro ao enviar e-mail de notificação de entrega:", emailErr);
    }
    return { success: true, message: "Entrega marcada com sucesso! O comprador foi notificado por e-mail." };
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 31;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BVhtAnC1.js')).default;
const server_id = "src/routes/admin/sales/+page.server.ts";
const imports = ["_app/immutable/nodes/31.BVbTepBM.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/4SgIdhTS.js"];
const stylesheets = ["_app/immutable/assets/31.Dq5SUml8.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=31-Cm00iBzU.js.map
