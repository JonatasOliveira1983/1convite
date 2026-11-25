import { f as fail } from './index-BkmUvga9.js';
import { deleteCategory, updateCategory, createCategory, getAllCategories } from './database-GQg0oTqt.js';
import { g as getTenantId } from './tenant-TKHyoVq1.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async () => {
  const categories = await getAllCategories();
  return { categories };
};
function generateSlug(name) {
  return name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
const actions = {
  create: async ({ request }) => {
    const tenantId = getTenantId();
    const data = await request.formData();
    const name = data.get("name")?.trim();
    if (!name || name.length < 2) {
      return fail(400, { error: "O nome deve ter pelo menos 2 caracteres", action: "create" });
    }
    const slug = generateSlug(name);
    try {
      await createCategory(name, slug, tenantId);
      return { success: true, message: "Categoria criada com sucesso!" };
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
      return fail(400, {
        error: err.message?.includes("UNIQUE") ? "Categoria já existe com este nome" : "Erro ao criar categoria: " + err.message,
        action: "create"
      });
    }
  },
  update: async ({ request }) => {
    const tenantId = getTenantId();
    const data = await request.formData();
    const id = parseInt(data.get("id"));
    const name = data.get("name")?.trim();
    const pinterestEnabled = data.get("pinterest_enabled") === "on";
    if (!name || name.length < 2) {
      return fail(400, { error: "O nome deve ter pelo menos 2 caracteres", action: "update" });
    }
    const slug = generateSlug(name);
    try {
      await updateCategory(id, tenantId, name, slug, pinterestEnabled);
      return { success: true, message: "Categoria atualizada!" };
    } catch (err) {
      console.error("Erro ao atualizar categoria:", err);
      return fail(400, { error: "Erro ao atualizar categoria: " + err.message, action: "update" });
    }
  },
  delete: async ({ request }) => {
    const tenantId = getTenantId();
    const data = await request.formData();
    const id = parseInt(data.get("id"));
    try {
      await deleteCategory(id, tenantId);
      return { success: true, message: "Categoria excluída!" };
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
      return fail(400, { error: "Erro ao excluir categoria: " + err.message, action: "delete" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-f9XcS2O7.js')).default;
const server_id = "src/routes/admin/categories/+page.server.ts";
const imports = ["_app/immutable/nodes/9.C_dvPe4c.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/CCgN62RU.js"];
const stylesheets = ["_app/immutable/assets/9.hR0byFKr.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-DnalFuzT.js.map
