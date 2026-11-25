import { f as fail, r as redirect, e as error } from './index-BkmUvga9.js';
import { slugExists, generateUniqueSlug, updatePost, assignCategoriesToPost, assignProductsToPost, getPostById, getAllCategories, getCategoriesByPostId, getAllProducts, getProductsByPostId } from './database-GQg0oTqt.js';
import { v as validateFileUpload, g as generateSafeFilename } from './auth-enhanced-Di8gdTaW.js';
import { u as uploadImage } from './cloudinary-Dh2Q5Csf.js';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import fs from 'fs';
import path from 'path';
import 'crypto';
import 'isomorphic-dompurify';
import 'zod';
import 'bcryptjs';
import 'cloudinary';

const load = async ({ params }) => {
  const post = await getPostById(parseInt(params.id));
  if (!post) {
    throw error(404, "Post não encontrado");
  }
  const categories = await getAllCategories();
  const postCategories = await getCategoriesByPostId(post.id);
  const products = await getAllProducts();
  const postProducts = await getProductsByPostId(post.id);
  return {
    post,
    categories,
    postCategoryIds: postCategories.map((c) => c.id),
    products,
    postProductIds: postProducts.map((p) => p.id)
  };
};
function sanitizeInput(input) {
  if (!input) return "";
  return input.trim().slice(0, 1e4);
}
function sanitizeContent(content) {
  if (!content) return "";
  return content.slice(0, 1e5);
}
const actions = {
  default: async ({ request, params }) => {
    const postId = parseInt(params.id);
    const data = await request.formData();
    const title = sanitizeInput(data.get("title"));
    const content = sanitizeContent(data.get("content"));
    console.log(`[DEBUG] Atualizando post ${postId} - Título: "${title.slice(0, 50)}...", Tamanho Conteúdo: ${content.length} bytes`);
    const excerpt = sanitizeInput(data.get("excerpt"));
    const published = data.get("published") === "on" ? 1 : 0;
    const customSlug = sanitizeInput(data.get("slug"));
    let cover_image = sanitizeInput(data.get("cover_image"));
    const cover_image_file = data.get("cover_image_file");
    const pinterest_enabled = data.get("pinterest_enabled") === "on" ? 1 : 0;
    const is_18_plus = data.get("is_18_plus") === "on" ? 1 : 0;
    const youtube_video_url = sanitizeInput(data.get("youtube_video_url"));
    const tags = sanitizeInput(data.get("tags"));
    let pinterest_image = sanitizeInput(data.get("pinterest_image"));
    const pinterest_image_file = data.get("pinterest_image_file");
    const categoryIds = data.getAll("categories").map((id) => parseInt(id)).filter((id) => !isNaN(id));
    const productIds = data.getAll("products").map((id) => parseInt(id)).filter((id) => !isNaN(id));
    if (cover_image_file && cover_image_file instanceof File && cover_image_file.size > 0) {
      const validation = validateFileUpload(cover_image_file, {
        maxSize: 8 * 1024 * 1024,
        allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"]
      });
      if (!validation.valid) {
        return fail(400, {
          error: validation.error || "Arquivo de imagem de capa inválido",
          post: {
            id: postId,
            title,
            slug: customSlug,
            content,
            excerpt,
            cover_image,
            published,
            pinterest_enabled,
            pinterest_image,
            youtube_video_url
          }
        });
      }
      try {
        const isCloudinaryConfigured = !!(private_env.CLOUDINARY_CLOUD_NAME && private_env.CLOUDINARY_API_KEY && private_env.CLOUDINARY_API_SECRET);
        if (isCloudinaryConfigured) {
          cover_image = await uploadImage(cover_image_file, "blog/posts");
        } else {
          const buffer = Buffer.from(await cover_image_file.arrayBuffer());
          const filename = generateSafeFilename(cover_image_file.name);
          const uploadDir = path.join(process.cwd(), "static", "uploads", "posts");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          fs.writeFileSync(path.join(uploadDir, filename), buffer);
          cover_image = `/uploads/posts/${filename}`;
        }
      } catch (err) {
        console.error("Error uploading cover image:", err);
        return fail(500, {
          error: "Erro ao fazer upload da imagem de capa",
          post: { id: postId, title, slug: customSlug, content, excerpt, cover_image, published, pinterest_enabled, pinterest_image, youtube_video_url }
        });
      }
    }
    if (pinterest_image_file && pinterest_image_file instanceof File && pinterest_image_file.size > 0) {
      const validation = validateFileUpload(pinterest_image_file, {
        maxSize: 8 * 1024 * 1024,
        allowedTypes: ["image/jpeg", "image/png", "image/webp"]
      });
      if (!validation.valid) {
        return fail(400, {
          error: validation.error || "Arquivo inválido",
          post: {
            id: postId,
            title,
            slug: customSlug,
            content,
            excerpt,
            cover_image,
            published,
            pinterest_enabled,
            pinterest_image,
            youtube_video_url
          }
        });
      }
      try {
        const isCloudinaryConfigured = !!(private_env.CLOUDINARY_CLOUD_NAME && private_env.CLOUDINARY_API_KEY && private_env.CLOUDINARY_API_SECRET);
        if (isCloudinaryConfigured) {
          pinterest_image = await uploadImage(pinterest_image_file, "blog/pinterest");
        } else {
          const buffer = Buffer.from(await pinterest_image_file.arrayBuffer());
          const filename = generateSafeFilename(pinterest_image_file.name);
          const uploadDir = path.join(process.cwd(), "static", "uploads", "pinterest");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          fs.writeFileSync(path.join(uploadDir, filename), buffer);
          pinterest_image = `/uploads/pinterest/${filename}`;
        }
      } catch (err) {
        console.error("Error uploading Pinterest image:", err);
        return fail(500, {
          error: "Erro ao fazer upload da imagem do Pinterest",
          post: { id: postId, title, slug: customSlug, content, excerpt, cover_image, published, pinterest_enabled, pinterest_image, youtube_video_url }
        });
      }
    }
    if (!title || !content) {
      return fail(400, {
        error: "Título e conteúdo são obrigatórios",
        post: {
          id: postId,
          title,
          slug: customSlug,
          content,
          excerpt,
          cover_image,
          published,
          pinterest_enabled,
          pinterest_image,
          youtube_video_url
        }
      });
    }
    if (title.length < 3) {
      return fail(400, {
        error: "O título deve ter pelo menos 3 caracteres",
        post: { id: postId, title, slug: customSlug, content, excerpt, cover_image, published, pinterest_enabled, pinterest_image, youtube_video_url }
      });
    }
    if (title.length > 200) {
      return fail(400, {
        error: "O título deve ter no máximo 200 caracteres",
        post: { id: postId, title, slug: customSlug, content, excerpt, cover_image, published, pinterest_enabled, pinterest_image, youtube_video_url }
      });
    }
    let slug;
    if (customSlug) {
      if (await slugExists(customSlug, postId)) {
        return fail(400, {
          error: "Este slug já está em uso por outro post",
          post: { id: postId, title, slug: customSlug, content, excerpt, cover_image, published, pinterest_enabled, pinterest_image, youtube_video_url }
        });
      }
      slug = await generateUniqueSlug(customSlug);
    } else {
      slug = await generateUniqueSlug(title);
    }
    try {
      await updatePost(postId, {
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
      await assignCategoriesToPost(postId, categoryIds);
      await assignProductsToPost(postId, productIds);
      throw redirect(303, "/admin/posts");
    } catch (err) {
      if (err.status === 303) {
        throw err;
      }
      return fail(500, {
        error: "Erro ao atualizar post. Tente novamente.",
        post: { id: postId, title, slug, content, excerpt, published, pinterest_enabled, pinterest_image, youtube_video_url }
      });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 23;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CZT33fZJ.js')).default;
const server_id = "src/routes/admin/posts/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/23.BER5io6y.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/DDxGXZt_.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/CCgN62RU.js"];
const stylesheets = ["_app/immutable/assets/23.CWSgP6nF.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=23-uPhfjsd4.js.map
