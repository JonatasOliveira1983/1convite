import { f as fail, r as redirect } from './index-BkmUvga9.js';
import { generateUniqueProductSlug, createProduct, getProductCategories, getAllPremiumPlans } from './database-BjMeOB2B.js';
import { v as validateFileUpload } from './auth-enhanced-Di8gdTaW.js';
import { u as uploadImage, a as uploadFile } from './cloudinary-Dh2Q5Csf.js';
import fs from 'fs';
import path from 'path';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'isomorphic-dompurify';
import 'zod';
import 'bcryptjs';
import 'cloudinary';

const load = async () => {
  const categories = await getProductCategories();
  const premiumPlans = await getAllPremiumPlans();
  return { categories, premiumPlans };
};
const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name");
    const description = data.get("description");
    const price_cents = parseInt(data.get("price_cents")) || 0;
    const resource_type = data.get("resource_type");
    const external_link = data.get("external_link");
    const product_image = data.get("product_image");
    const product_file = data.get("product_file");
    const customSlug = data.get("slug");
    const categoryIdStr = data.get("category_id");
    const category_id = categoryIdStr ? parseInt(categoryIdStr) : null;
    const youtube_video_url = data.get("youtube_video_url");
    const access_label = data.get("access_label");
    const drive_instructions = data.get("drive_instructions");
    const delivery_deadline = data.get("delivery_deadline");
    if (!name) {
      return fail(400, { message: "O nome do produto é obrigatório" });
    }
    if (price_cents > 0 && price_cents < 500) {
      return fail(400, { message: "O Asaas exige um valor mínimo de R$ 5,00 para cobranças. Defina o valor como R$ 0 (grátis) ou maior que R$ 5,00." });
    }
    let final_youtube_video_url = null;
    if (youtube_video_url && youtube_video_url.trim()) {
      const urlTrimmed = youtube_video_url.trim();
      if (!urlTrimmed.includes("youtube.com") && !urlTrimmed.includes("youtu.be")) {
        return fail(400, { message: "A URL do vídeo deve ser um link válido do YouTube (youtube.com ou youtu.be)." });
      }
      final_youtube_video_url = urlTrimmed;
    }
    const slug = customSlug ? await generateUniqueProductSlug(customSlug) : await generateUniqueProductSlug(name);
    let file_url = null;
    let final_external_link = null;
    let image_url = null;
    if (product_image && product_image instanceof File && product_image.size > 0) {
      if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(product_image.type)) {
        return fail(400, { message: "Tipo de imagem inválido. Use JPG, PNG, GIF ou WebP." });
      }
      if (product_image.size > 5 * 1024 * 1024) {
        return fail(400, { message: "A imagem é muito grande. O limite máximo é 5MB." });
      }
      try {
        image_url = await uploadImage(product_image, "blog/products");
      } catch (e) {
        console.error("Error uploading product image to Cloudinary:", e);
        return fail(500, { message: "Erro ao fazer upload da imagem do produto." });
      }
    }
    if (resource_type === "file") {
      if (!product_file || !(product_file instanceof File) || product_file.size === 0) {
        return fail(400, { message: "Arquivo de upload inválido ou ausente" });
      }
      const allowedTypes = [
        "application/pdf",
        "application/zip",
        "application/x-zip-compressed",
        "application/x-rar-compressed",
        "application/vnd.rar",
        "application/x-7z-compressed",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "audio/mpeg",
        "audio/mp3",
        "video/mp4",
        "text/plain"
      ];
      const allowedExtensions = ["pdf", "zip", "rar", "7z", "png", "jpg", "jpeg", "gif", "webp", "mp3", "mp4", "txt"];
      const validation = validateFileUpload(product_file, {
        maxSize: 30 * 1024 * 1024,
        // 30MB limit
        allowedTypes,
        allowedExtensions
      });
      if (!validation.valid) {
        return fail(400, { message: validation.error || "Arquivo de upload inválido." });
      }
      try {
        const buffer = Buffer.from(await product_file.arrayBuffer());
        const ext = product_file.name.split(".").pop()?.toLowerCase() || "";
        const nameWithoutExt = product_file.name.substring(0, product_file.name.lastIndexOf("."));
        const cleanName = nameWithoutExt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s.-]/g, "").replace(/[\s_]+/g, "_").substring(0, 80);
        const uniqueSuffix = Math.random().toString(36).substring(2, 8);
        const filename = ext ? `${cleanName}_${uniqueSuffix}.${ext}` : `${cleanName}_${uniqueSuffix}`;
        const uploadDir = process.env.PRODUCT_UPLOADS_DIR ? process.env.PRODUCT_UPLOADS_DIR : path.join(process.cwd(), "static", "uploads", "products");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadDir, filename), buffer);
        file_url = `/uploads/products/${filename}`;
      } catch (e) {
        console.error("Error uploading product file:", e);
        return fail(500, { message: "Erro ao salvar arquivo de produto no servidor." });
      }
    } else if (resource_type === "cloudinary") {
      if (!product_file || !(product_file instanceof File) || product_file.size === 0) {
        return fail(400, { message: "Selecione um arquivo para enviar ao Cloudinary." });
      }
      if (product_file.size > 100 * 1024 * 1024) {
        return fail(400, { message: "O arquivo é muito grande. O limite para Cloudinary é 100MB." });
      }
      const cloudinaryAllowedExts = ["pdf", "zip", "rar", "7z", "txt"];
      const ext = product_file.name.split(".").pop()?.toLowerCase() || "";
      if (!cloudinaryAllowedExts.includes(ext)) {
        return fail(400, { message: "Formato não suportado para Cloudinary. Use PDF, ZIP, RAR, 7Z ou TXT." });
      }
      try {
        file_url = await uploadFile(product_file, "blog/products/files");
      } catch (e) {
        console.error("Error uploading product file to Cloudinary:", e);
        return fail(500, { message: "Erro ao enviar arquivo para o Cloudinary." });
      }
    } else if (resource_type === "link") {
      if (!external_link) {
        return fail(400, { message: "A URL do link externo é obrigatória" });
      }
      final_external_link = external_link.trim();
    } else if (resource_type === "manual") {
      if (!external_link) {
        return fail(400, { message: "O link do recurso (Drive/GitHub) é obrigatório para entrega manual." });
      }
      try {
        new URL(external_link.trim());
      } catch {
        return fail(400, { message: "Insira uma URL válida para o link do recurso." });
      }
      final_external_link = external_link.trim();
    } else {
      return fail(400, { message: "Tipo de recurso inválido" });
    }
    const is_premium_included = parseInt(data.get("is_premium_included")) || 0;
    const has_extra_service = data.get("has_extra_service") === "on" || data.get("has_extra_service") === "1" ? 1 : 0;
    const extra_service_title = data.get("extra_service_title");
    const extra_service_price_cents = Math.max(0, parseInt(data.get("extra_service_price_cents")) || 0);
    const extra_service_description = data.get("extra_service_description");
    if (has_extra_service === 1 && (!extra_service_title || !extra_service_title.trim())) {
      return fail(400, { message: "Defina o título do serviço extra ofertado." });
    }
    try {
      await createProduct({
        name: name.trim(),
        slug,
        description: description ? description.trim() : void 0,
        price_cents,
        file_url: file_url || void 0,
        external_link: final_external_link || void 0,
        image_url: image_url || void 0,
        category_id: category_id && !isNaN(category_id) ? category_id : null,
        youtube_video_url: final_youtube_video_url || void 0,
        resource_type: resource_type || "file",
        access_label: access_label?.trim() || null,
        drive_instructions: drive_instructions?.trim() || null,
        delivery_deadline: delivery_deadline?.trim() || null,
        is_premium_included,
        has_extra_service,
        extra_service_title: extra_service_title?.trim() || null,
        extra_service_price_cents,
        extra_service_description: extra_service_description?.trim() || null
      });
    } catch (e) {
      console.error("Error creating product in DB:", e);
      return fail(500, { message: "Erro ao salvar o produto no banco de dados." });
    }
    throw redirect(303, "/admin/products");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 29;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BsCbwTsA.js')).default;
const server_id = "src/routes/admin/products/new/+page.server.ts";
const imports = ["_app/immutable/nodes/29.Bg4W6NpA.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/4SgIdhTS.js"];
const stylesheets = ["_app/immutable/assets/29.C7xCt2qM.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=29-BUgHrRkh.js.map
