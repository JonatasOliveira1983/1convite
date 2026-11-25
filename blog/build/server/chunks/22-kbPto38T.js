import { r as redirect, f as fail } from './index-BkmUvga9.js';
import { generateUniqueSlug, createPost, assignCategoriesToPost, assignProductsToPost, getAllCategories, getAllProducts } from './database-BjMeOB2B.js';
import { u as uploadImage } from './cloudinary-Dh2Q5Csf.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'cloudinary';

const load = async () => {
  const categories = await getAllCategories();
  const products = await getAllProducts();
  return { categories, products };
};
function sanitizeInput(input) {
  if (!input) return "";
  return input.trim().slice(0, 1e4);
}
function sanitizeContent(content) {
  if (!content) return "";
  return content.slice(0, 1e5);
}
function failWithFields(status, error, fields) {
  return fail(status, { error, ...fields });
}
const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const title = sanitizeInput(data.get("title"));
    const content = sanitizeContent(data.get("content"));
    console.log(`[DEBUG] Recebendo post - Título: "${title.slice(0, 50)}...", Tamanho Conteúdo: ${content.length} bytes`);
    const excerpt = sanitizeInput(data.get("excerpt"));
    const published = data.get("published") === "on" ? 1 : 0;
    const customSlug = sanitizeInput(data.get("slug"));
    let cover_image = sanitizeInput(data.get("cover_image"));
    const cover_image_file = data.get("cover_image_file");
    const pinterest_enabled = data.get("pinterest_enabled") === "on" ? 1 : 0;
    const pinterest_image = sanitizeInput(data.get("pinterest_image"));
    const is_18_plus = data.get("is_18_plus") === "on" ? 1 : 0;
    const youtube_video_url = sanitizeInput(data.get("youtube_video_url"));
    const tags = sanitizeInput(data.get("tags"));
    const categoryIds = data.getAll("categories").map((id) => parseInt(id)).filter((id) => !isNaN(id));
    const productIds = data.getAll("products").map((id) => parseInt(id)).filter((id) => !isNaN(id));
    const fieldSnapshot = {
      title,
      content,
      excerpt,
      cover_image,
      published: published === 1,
      pinterest_enabled: pinterest_enabled === 1,
      pinterest_image,
      youtube_video_url,
      tags,
      is_18_plus: is_18_plus === 1,
      slug: customSlug
    };
    if (cover_image_file && cover_image_file instanceof File && cover_image_file.size > 0) {
      if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(cover_image_file.type)) {
        return failWithFields(400, "INVALID_FILE", fieldSnapshot);
      }
      if (cover_image_file.size > 5 * 1024 * 1024) {
        return failWithFields(400, "FILE_TOO_LARGE", fieldSnapshot);
      }
      try {
        cover_image = await uploadImage(cover_image_file, "blog/posts");
        fieldSnapshot.cover_image = cover_image;
      } catch {
        return failWithFields(500, "UPLOAD_FAILED", fieldSnapshot);
      }
    }
    if (!title || !content) {
      return failWithFields(400, "TITLE_CONTENT_REQUIRED", fieldSnapshot);
    }
    if (title.length < 3) {
      return failWithFields(400, "TITLE_TOO_SHORT", fieldSnapshot);
    }
    if (title.length > 200) {
      return failWithFields(400, "TITLE_TOO_LONG", fieldSnapshot);
    }
    const slug = customSlug ? await generateUniqueSlug(customSlug) : await generateUniqueSlug(title);
    try {
      const result = await createPost({
        title,
        slug,
        content,
        excerpt,
        cover_image,
        published,
        pinterest_enabled,
        pinterest_image,
        is_18_plus,
        youtube_video_url,
        tags
      });
      if (result.lastInsertRowid) {
        const postId = Number(result.lastInsertRowid);
        if (categoryIds.length > 0) {
          await assignCategoriesToPost(postId, categoryIds);
        }
        if (productIds.length > 0) {
          await assignProductsToPost(postId, productIds);
        }
      }
      throw redirect(303, "/admin/posts");
    } catch (e) {
      if (e?.status === 303) throw e;
      return failWithFields(500, "CREATE_FAILED", fieldSnapshot);
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 22;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Bi1LJXZ6.js')).default;
const server_id = "src/routes/admin/posts/new/+page.server.ts";
const imports = ["_app/immutable/nodes/22.B_LRSOMt.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/DDxGXZt_.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/4SgIdhTS.js"];
const stylesheets = ["_app/immutable/assets/22.DdisII-q.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=22-kbPto38T.js.map
