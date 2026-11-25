import { r as redirect, f as fail } from './index-BkmUvga9.js';
import { duplicateLandingPage, deleteLandingPage, getLandingPageBySlug, getLandingPageById, updateLandingPage, createLandingPage, regenerateCLIToken, getCLITokenStatus, getLandingPagesPage } from './database-GQg0oTqt.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async ({ cookies, url }) => {
  const adminSession = cookies.get("admin_session");
  if (!adminSession) {
    throw redirect(302, "/admin/login");
  }
  const requestedPage = Math.max(1, Number.parseInt(url.searchParams.get("page") || "1", 10) || 1);
  const search = (url.searchParams.get("q") || "").trim().slice(0, 100);
  const [landingResult, cliTokenStatus] = await Promise.all([
    getLandingPagesPage({ page: requestedPage, limit: 20, search }),
    getCLITokenStatus()
  ]);
  if (landingResult.total > 0 && requestedPage > landingResult.totalPages) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    params.set("page", String(landingResult.totalPages));
    throw redirect(302, `/admin/landing-pages?${params}`);
  }
  return {
    landingPages: landingResult.pages,
    search,
    pagination: {
      page: landingResult.page,
      limit: landingResult.limit,
      total: landingResult.total,
      totalPages: landingResult.totalPages
    },
    cliTokenConfigured: cliTokenStatus.configured,
    cliTokenExpiresAt: cliTokenStatus.expiresAt
  };
};
const actions = {
  regenerateCliToken: async ({ cookies }) => {
    const adminSession = cookies.get("admin_session");
    if (!adminSession) throw redirect(302, "/admin/login");
    try {
      const token = await regenerateCLIToken();
      const status = await getCLITokenStatus();
      return { cliTokenSuccess: true, cliToken: token, cliTokenExpiresAt: status.expiresAt };
    } catch (e) {
      console.error("Erro ao regenerar token da CLI de landings:", e);
      return fail(500, { error: "Erro ao regenerar o token da CLI." });
    }
  },
  create: async ({ request, cookies }) => {
    const adminSession = cookies.get("admin_session");
    if (!adminSession) {
      throw redirect(302, "/admin/login");
    }
    const data = await request.formData();
    const title = data.get("title");
    let slug = data.get("slug");
    if (!title || title.trim() === "") {
      return fail(400, { error: "O título é obrigatório." });
    }
    if (!slug || slug.trim() === "") {
      slug = title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").substring(0, 60);
    } else {
      slug = slug.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-");
    }
    if (!slug) {
      return fail(400, { error: "O slug gerado é inválido." });
    }
    const existing = await getLandingPageBySlug(slug);
    if (existing) {
      return fail(400, { error: "Este slug de página já está em uso." });
    }
    try {
      const pageId = await createLandingPage(title, slug);
      throw redirect(303, `/admin/landing-pages/${pageId}`);
    } catch (e) {
      if (e.status === 303) throw e;
      console.error("Erro ao criar landing page:", e);
      return fail(500, { error: "Erro interno ao salvar no banco de dados." });
    }
  },
  update: async ({ request, cookies }) => {
    const adminSession = cookies.get("admin_session");
    if (!adminSession) {
      throw redirect(302, "/admin/login");
    }
    const data = await request.formData();
    const id = parseInt(data.get("id"));
    const title = data.get("title");
    let slug = data.get("slug");
    const status = data.get("status");
    if (isNaN(id)) {
      return fail(400, { error: "ID inválido." });
    }
    if (!title || title.trim() === "") {
      return fail(400, { error: "O título é obrigatório." });
    }
    if (!slug || slug.trim() === "") {
      return fail(400, { error: "O slug é obrigatório." });
    }
    slug = slug.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-");
    const existing = await getLandingPageBySlug(slug);
    if (existing && existing.id !== id) {
      return fail(400, { error: "Este slug de página já está em uso." });
    }
    try {
      const pageToUpdate = await getLandingPageById(id);
      if (!pageToUpdate) {
        return fail(404, { error: "Landing page não encontrada." });
      }
      await updateLandingPage(id, title, slug, status);
      return { success: true };
    } catch (e) {
      console.error("Erro ao atualizar landing page:", e);
      return fail(500, { error: "Erro interno ao atualizar no banco de dados." });
    }
  },
  delete: async ({ request, cookies }) => {
    const adminSession = cookies.get("admin_session");
    if (!adminSession) {
      throw redirect(302, "/admin/login");
    }
    const data = await request.formData();
    const id = parseInt(data.get("id"));
    if (isNaN(id)) {
      return fail(400, { error: "ID inválido." });
    }
    try {
      await deleteLandingPage(id);
      return { success: true };
    } catch (e) {
      console.error("Erro ao excluir landing page:", e);
      return fail(500, { error: "Erro interno ao excluir no banco de dados." });
    }
  },
  duplicate: async ({ request, cookies }) => {
    const adminSession = cookies.get("admin_session");
    if (!adminSession) {
      throw redirect(302, "/admin/login");
    }
    const data = await request.formData();
    const id = parseInt(data.get("id"));
    if (isNaN(id)) {
      return fail(400, { error: "ID inválido." });
    }
    try {
      const newId = await duplicateLandingPage(id);
      throw redirect(303, `/admin/landing-pages/${newId}`);
    } catch (e) {
      if (e?.status === 303) throw e;
      console.error("Erro ao duplicar landing page:", e);
      return fail(500, { error: "Erro ao duplicar a página." });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 15;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-mqZvWgRB.js')).default;
const server_id = "src/routes/admin/landing-pages/+page.server.ts";
const imports = ["_app/immutable/nodes/15.DXCYgips.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/CCgN62RU.js","_app/immutable/chunks/7QtYz8kT.js","_app/immutable/chunks/26RjRg4l.js"];
const stylesheets = ["_app/immutable/assets/Pagination.DmakeXk_.css","_app/immutable/assets/15.DPhnIfes.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-BMyg3-hO.js.map
