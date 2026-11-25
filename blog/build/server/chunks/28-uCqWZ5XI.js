import { f as fail, r as redirect } from './index-BkmUvga9.js';
import { deleteProductCategory, updateProductCategory, createProductCategory, getProductCategories } from './database-BjMeOB2B.js';
import { validateSession } from './auth2-B20dP8z5.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'bcryptjs';

const load = async ({ cookies }) => {
  const token = cookies.get("admin_session");
  const username = await validateSession(token || "");
  if (!username) {
    throw redirect(303, "/admin/login");
  }
  const categories = await getProductCategories();
  return { categories };
};
const actions = {
  create: async ({ request, cookies }) => {
    const token = cookies.get("admin_session");
    const username = await validateSession(token || "");
    if (!username) {
      return fail(403, { error: "Acesso negado" });
    }
    const data = await request.formData();
    const name = data.get("name");
    const description = data.get("description");
    if (!name || name.trim().length < 2) {
      return fail(400, { error: "O nome da categoria é obrigatório e deve ter pelo menos 2 caracteres." });
    }
    try {
      await createProductCategory(name, description);
      return { success: true, message: "Categoria de produto criada com sucesso!" };
    } catch (e) {
      console.error("Error creating product category:", e);
      if (e.message?.includes("UNIQUE")) {
        return fail(400, { error: "Já existe uma categoria com este nome." });
      }
      return fail(500, { error: "Erro ao criar a categoria no banco de dados." });
    }
  },
  update: async ({ request, cookies }) => {
    const token = cookies.get("admin_session");
    const username = await validateSession(token || "");
    if (!username) {
      return fail(403, { error: "Acesso negado" });
    }
    const data = await request.formData();
    const id = parseInt(data.get("id"));
    const name = data.get("name");
    const description = data.get("description");
    if (isNaN(id) || !name || name.trim().length < 2) {
      return fail(400, { error: "Dados inválidos para atualização da categoria." });
    }
    try {
      await updateProductCategory(id, name, description);
      return { success: true, message: "Categoria de produto atualizada com sucesso!" };
    } catch (e) {
      console.error("Error updating product category:", e);
      if (e.message?.includes("UNIQUE")) {
        return fail(400, { error: "Já existe outra categoria com este nome." });
      }
      return fail(500, { error: "Erro ao atualizar a categoria." });
    }
  },
  delete: async ({ request, cookies }) => {
    const token = cookies.get("admin_session");
    const username = await validateSession(token || "");
    if (!username) {
      return fail(403, { error: "Acesso negado" });
    }
    const data = await request.formData();
    const id = parseInt(data.get("id"));
    if (isNaN(id)) {
      return fail(400, { error: "ID da categoria inválido." });
    }
    try {
      await deleteProductCategory(id);
      return { success: true, message: "Categoria de produto excluída com sucesso!" };
    } catch (e) {
      console.error("Error deleting product category:", e);
      return fail(500, { error: "Erro ao excluir a categoria." });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 28;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-D27zkTmO.js')).default;
const server_id = "src/routes/admin/products/categories/+page.server.ts";
const imports = ["_app/immutable/nodes/28.DRTRqk7B.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/4SgIdhTS.js"];
const stylesheets = ["_app/immutable/assets/28.O-3Ul4MA.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=28-uCqWZ5XI.js.map
