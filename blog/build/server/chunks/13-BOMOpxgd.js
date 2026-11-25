import { f as fail, r as redirect } from './index-BkmUvga9.js';
import { generateUniqueCourseSlug, createCourse } from './database-GQg0oTqt.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async () => {
  return {};
};
const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const title = data.get("title")?.trim();
    const description = data.get("description")?.trim() || null;
    const cover_image = data.get("cover_image")?.trim() || null;
    const access_type = data.get("access_type") || "premium";
    const price_str = data.get("price")?.replace(",", ".") || "0";
    const price_cents = Math.round(parseFloat(price_str) * 100) || 0;
    const published = data.get("published") === "1" ? 1 : 0;
    if (!title) return fail(400, { error: "Título obrigatório", values: Object.fromEntries(data) });
    const slug = await generateUniqueCourseSlug(title);
    try {
      await createCourse({ title, slug, description, cover_image, access_type, price_cents, published });
      throw redirect(303, "/admin/courses");
    } catch (e) {
      if (e?.status === 303) throw e;
      console.error(e);
      return fail(500, { error: "Erro ao criar curso" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 13;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BgYiMVX8.js')).default;
const server_id = "src/routes/admin/courses/new/+page.server.ts";
const imports = ["_app/immutable/nodes/13.C7QBLhTo.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/13.BSrFlQak.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-BOMOpxgd.js.map
