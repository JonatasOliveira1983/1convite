import { f as fail, r as redirect, e as error } from './index-BkmUvga9.js';
import { getProductById, generateUniqueProductSlug, updateProduct, getProductBuyerEmails, getSettings, getProductCategories, getAllPremiumPlans } from './database-GQg0oTqt.js';
import { v as validateFileUpload } from './auth-enhanced-Di8gdTaW.js';
import { u as uploadImage, g as getPublicIdFromUrl, d as deleteFile, a as uploadFile } from './cloudinary-Dh2Q5Csf.js';
import { i as isResendConfigured, a as sendProductUpdateEmail } from './resend-DJzwJZYF.js';
import fs from 'fs';
import path from 'path';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'isomorphic-dompurify';
import 'zod';
import 'bcryptjs';
import 'cloudinary';

const load = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    throw error(400, "ID do produto inválido");
  }
  const product = await getProductById(id);
  if (!product) {
    throw error(404, "Produto não encontrado");
  }
  const categories = await getProductCategories();
  const premiumPlans = await getAllPremiumPlans();
  return { product, categories, premiumPlans };
};
const actions = {
  default: async ({ request, params, url }) => {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return fail(400, { message: "ID do produto inválido" });
    }
    const product = await getProductById(id);
    if (!product) {
      return fail(404, { message: "Produto não encontrado" });
    }
    const data = await request.formData();
    const name = data.get("name");
    const description = data.get("description");
    const price_cents = parseInt(data.get("price_cents")) || 0;
    const resource_type = data.get("resource_type");
    const external_link = data.get("external_link");
    const product_file = data.get("product_file");
    const product_image = data.get("product_image");
    const customSlug = data.get("slug");
    const notify_buyers = data.get("notify_buyers") === "on";
    const update_message = data.get("update_message") || "";
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
    const slug = customSlug ? await generateUniqueProductSlug(customSlug, id) : await generateUniqueProductSlug(name, id);
    let file_url = product.file_url;
    let final_external_link = null;
    let image_url = product.image_url;
    const remove_image = data.get("remove_image") === "1";
    const remove_file = data.get("remove_file") === "1";
    if (remove_image) {
      image_url = null;
    } else if (product_image && product_image instanceof File && product_image.size > 0) {
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
      if (product_file && product_file instanceof File && product_file.size > 0) {
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
          // 30MB
          allowedTypes,
          allowedExtensions
        });
        if (!validation.valid) {
          return fail(400, { message: validation.error || "Arquivo inválido." });
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
          if (product.file_url) {
            const oldFilename = path.basename(product.file_url);
            const pathsToDelete = [];
            if (process.env.PRODUCT_UPLOADS_DIR) {
              pathsToDelete.push(path.join(process.env.PRODUCT_UPLOADS_DIR, oldFilename));
            }
            pathsToDelete.push(path.join(process.cwd(), "static", "uploads", "products", oldFilename));
            for (const p of pathsToDelete) {
              if (fs.existsSync(p)) {
                fs.unlinkSync(p);
              }
            }
          }
          fs.writeFileSync(path.join(uploadDir, filename), buffer);
          file_url = `/uploads/products/${filename}`;
        } catch (e) {
          console.error("Error uploading product file:", e);
          return fail(500, { message: "Erro ao salvar arquivo no servidor." });
        }
      } else if (remove_file) {
        return fail(400, { message: 'Você não pode remover o arquivo digital sem enviar um novo arquivo para substituí-lo. Caso queira usar um link, altere o "Tipo de Recurso" para "Link de Terceiros".' });
      } else {
        if (!file_url || file_url.startsWith("http")) {
          return fail(400, { message: "Você mudou para Upload no Servidor, então precisa enviar um arquivo local, pois o arquivo atual está no Cloudinary ou ausente." });
        }
      }
      final_external_link = null;
    } else if (resource_type === "cloudinary") {
      if (product_file && product_file instanceof File && product_file.size > 0) {
        if (product_file.size > 100 * 1024 * 1024) {
          return fail(400, { message: "O arquivo é muito grande. O limite para Cloudinary é 100MB." });
        }
        const cloudinaryAllowedExts = ["pdf", "zip", "rar", "7z", "txt"];
        const ext = product_file.name.split(".").pop()?.toLowerCase() || "";
        if (!cloudinaryAllowedExts.includes(ext)) {
          return fail(400, { message: "Formato não suportado para Cloudinary. Use PDF, ZIP, RAR, 7Z ou TXT." });
        }
        if (product.file_url && product.file_url.startsWith("http")) {
          const oldPublicId = getPublicIdFromUrl(product.file_url);
          if (oldPublicId) {
            try {
              await deleteFile(oldPublicId);
            } catch (e) {
              console.error("Failed to delete old Cloudinary file:", e);
            }
          }
        }
        try {
          file_url = await uploadFile(product_file, "blog/products/files");
        } catch (e) {
          console.error("Error uploading product file to Cloudinary:", e);
          return fail(500, { message: "Erro ao enviar arquivo para o Cloudinary." });
        }
      } else if (remove_file) {
        return fail(400, { message: "Você não pode remover o arquivo sem enviar um novo." });
      } else {
        if (!file_url || !file_url.startsWith("http")) {
          return fail(400, { message: "Você mudou para Upload no Cloudinary, então precisa enviar um arquivo para o Cloudinary, pois o arquivo atual está local no servidor ou ausente." });
        }
      }
      final_external_link = null;
    } else if (resource_type === "link") {
      if (!external_link) {
        return fail(400, { message: "A URL do link externo é obrigatória" });
      }
      final_external_link = external_link.trim();
      if (product.file_url) {
        if (product.file_url.startsWith("http")) {
          const oldPublicId = getPublicIdFromUrl(product.file_url);
          if (oldPublicId) {
            try {
              await deleteFile(oldPublicId);
            } catch (e) {
              console.error("Failed to delete old Cloudinary file:", e);
            }
          }
        } else {
          try {
            const oldFilename = path.basename(product.file_url);
            const pathsToDelete = [];
            if (process.env.PRODUCT_UPLOADS_DIR) {
              pathsToDelete.push(path.join(process.env.PRODUCT_UPLOADS_DIR, oldFilename));
            }
            pathsToDelete.push(path.join(process.cwd(), "static", "uploads", "products", oldFilename));
            for (const p of pathsToDelete) {
              if (fs.existsSync(p)) fs.unlinkSync(p);
            }
          } catch (e) {
            console.error("Failed to clean old file during transition to link:", e);
          }
        }
      }
      file_url = null;
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
      if (product.file_url) {
        if (product.file_url.startsWith("http")) {
          const oldPublicId = getPublicIdFromUrl(product.file_url);
          if (oldPublicId) {
            try {
              await deleteFile(oldPublicId);
            } catch (e) {
              console.error("Failed to delete old Cloudinary file:", e);
            }
          }
        } else {
          try {
            const oldFilename = path.basename(product.file_url);
            const pathsToDelete = [
              path.join(process.cwd(), "static", "uploads", "products", oldFilename)
            ];
            if (process.env.PRODUCT_UPLOADS_DIR) {
              pathsToDelete.push(path.join(process.env.PRODUCT_UPLOADS_DIR, oldFilename));
            }
            for (const p of pathsToDelete) {
              if (fs.existsSync(p)) fs.unlinkSync(p);
            }
          } catch (e) {
            console.error("Failed to clean old file during transition to manual:", e);
          }
        }
      }
      file_url = null;
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
      await updateProduct(id, {
        name: name.trim(),
        slug,
        description: description ? description.trim() : null,
        price_cents,
        file_url,
        external_link: final_external_link,
        image_url,
        category_id: category_id && !isNaN(category_id) ? category_id : null,
        youtube_video_url: final_youtube_video_url,
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
      console.error("Error updating product in DB:", e);
      return fail(500, { message: "Erro ao atualizar o produto no banco de dados." });
    }
    let notifyQuery = "";
    if (notify_buyers) {
      try {
        const resendOk = await isResendConfigured();
        if (!resendOk) {
          console.warn("[NOTIFICATION] Resend não configurado (API key). Produto salvo sem e-mails.");
          notifyQuery = "?notify=no_resend";
        } else {
          const buyerEmails = await getProductBuyerEmails(id);
          console.log(`[NOTIFICATION] Product #${id}: ${buyerEmails.length} destinatário(s)`);
          if (buyerEmails.length === 0) {
            notifyQuery = "?notify=no_buyers";
          } else {
            const settings = await getSettings();
            const siteName = settings.site_title || settings.site_name || "Blog";
            const siteUrl = (url.origin || settings.site_url || "").replace(/\/$/, "");
            const result = await sendProductUpdateEmail(
              buyerEmails,
              name.trim(),
              slug,
              siteName,
              siteUrl,
              update_message.trim()
            );
            if (result.ok) {
              notifyQuery = `?notify=ok&sent=${result.sent}`;
            } else {
              console.error("[NOTIFICATION] Resend falhou:", result.error);
              notifyQuery = `?notify=fail&sent=${result.sent}&failed=${result.failed}`;
            }
          }
        }
      } catch (notificationErr) {
        console.error("[NOTIFICATION] Error preparing product update notification:", notificationErr);
        notifyQuery = "?notify=error";
      }
    }
    throw redirect(303, `/admin/products${notifyQuery}`);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 30;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DLneP63P.js')).default;
const server_id = "src/routes/admin/products/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/30.DT7KKmPt.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/CCgN62RU.js"];
const stylesheets = ["_app/immutable/assets/30.B3FYNjiJ.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=30-BXWK-rJr.js.map
