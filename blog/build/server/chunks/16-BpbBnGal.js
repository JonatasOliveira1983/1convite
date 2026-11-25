import { f as fail, r as redirect, e as error } from './index-BkmUvga9.js';
import { getLandingPageBySlug, updateLandingPage, getLandingPageById, getAllProducts, getLandingBuilderPosts } from './database-BjMeOB2B.js';
import { p as parseAndSanitizeLandingContent } from './landing-pages-DRUTjZVo.js';
import { u as uploadImage } from './cloudinary-Dh2Q5Csf.js';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import fs from 'fs';
import path from 'path';
import 'crypto';
import './sanitize-beQ_Z907.js';
import 'jsdom';
import 'cloudinary';

const load = async ({ params, cookies }) => {
  const adminSession = cookies.get("admin_session");
  if (!adminSession) {
    throw redirect(302, "/admin/login");
  }
  const id = parseInt(params.id);
  if (isNaN(id)) {
    throw error(400, "ID da página inválido.");
  }
  const landingPage = await getLandingPageById(id);
  if (!landingPage) {
    throw error(404, "Landing page não encontrada.");
  }
  let products = [];
  let posts = [];
  try {
    [products, posts] = await Promise.all([getAllProducts(), getLandingBuilderPosts()]);
  } catch {
    products = [];
  }
  return {
    landingPage,
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price_cents: p.price_cents,
      description: p.description || "",
      image_url: p.image_url || "",
      external_link: p.external_link || ""
    })),
    posts
  };
};
const actions = {
  save: async ({ request, params, cookies }) => {
    const adminSession = cookies.get("admin_session");
    if (!adminSession) {
      throw redirect(302, "/admin/login");
    }
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return fail(400, { error: "ID inválido." });
    }
    const data = await request.formData();
    const title = data.get("title");
    let slug = data.get("slug");
    const status = data.get("status");
    const content = data.get("content");
    const settings = data.get("settings");
    if (!title || title.trim() === "") {
      return fail(400, { error: "O título é obrigatório." });
    }
    if (!slug || slug.trim() === "") {
      return fail(400, { error: "O slug é obrigatório." });
    }
    slug = slug.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-");
    const existing = await getLandingPageBySlug(slug);
    if (existing && existing.id !== id) {
      return fail(400, { error: "Este slug já está em uso por outra página." });
    }
    try {
      const safeContent = parseAndSanitizeLandingContent(content || "[]");
      await updateLandingPage(id, title, slug, status === "published" ? "published" : "draft", safeContent, settings);
      return { success: true };
    } catch (e) {
      console.error("Erro ao salvar landing page:", e);
      return fail(500, { error: "Erro interno ao salvar no banco de dados." });
    }
  },
  uploadImage: async ({ request, cookies }) => {
    const adminSession = cookies.get("admin_session");
    if (!adminSession) {
      return fail(401, { error: "Não autorizado." });
    }
    const data = await request.formData();
    const file = data.get("file");
    if (!file || !(file instanceof File) || file.size === 0) {
      return fail(400, { error: "Nenhum arquivo enviado." });
    }
    if (file.size > 20 * 1024 * 1024) {
      return fail(413, { error: "A imagem excede o limite de 20 MB." });
    }
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      return fail(400, { error: "Formato não permitido. Use JPG, PNG, WebP ou GIF." });
    }
    try {
      const isCloudinaryConfigured = !!(private_env.CLOUDINARY_CLOUD_NAME && private_env.CLOUDINARY_API_KEY && private_env.CLOUDINARY_API_SECRET);
      if (isCloudinaryConfigured) {
        const imageUrl = await uploadImage(file, "blog/landings");
        return { success: true, url: imageUrl };
      } else {
        const buffer = Buffer.from(await file.arrayBuffer());
        const extension = file.name.split(".").pop() || "jpg";
        const filename = `landing-img-${Date.now()}.${extension}`;
        const uploadDir = path.join(process.cwd(), "static", "uploads", "landings");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadDir, filename), buffer);
        const imageUrl = `/uploads/landings/${filename}`;
        return { success: true, url: imageUrl };
      }
    } catch (e) {
      console.error("Erro ao fazer upload da imagem no builder:", e);
      return fail(500, { error: "Erro interno ao fazer upload." });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 16;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-xhxqO5b0.js')).default;
const server_id = "src/routes/admin/landing-pages/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/16.CFAvU_Cl.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/DDxGXZt_.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/uFF43Du1.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/7QtYz8kT.js","_app/immutable/chunks/B_tIvOFa.js"];
const stylesheets = ["_app/immutable/assets/LandingPageHeader.C-_zZJin.css","_app/immutable/assets/16.CaleDixt.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-BpbBnGal.js.map
