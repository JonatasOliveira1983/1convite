import { f as fail, r as redirect, e as error } from './index-BkmUvga9.js';
import { updateAd, getAdById } from './database-GQg0oTqt.js';
import { u as uploadImage } from './cloudinary-Dh2Q5Csf.js';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import fs from 'fs';
import path from 'path';
import 'crypto';
import 'cloudinary';

async function load({ params }) {
  const ad = await getAdById(params.id);
  if (!ad) {
    throw error(404, "Anúncio não encontrado");
  }
  if (ad.style && typeof ad.style === "string") {
    try {
      ad.style = JSON.parse(ad.style);
    } catch {
    }
  }
  return { ad };
}
const actions = {
  default: async ({ params, request }) => {
    const data = await request.formData();
    let image_url = data.get("image_url") || "";
    const image_file = data.get("image_file");
    if (image_file && image_file instanceof File && image_file.size > 0) {
      try {
        const isCloudinaryConfigured = !!(private_env.CLOUDINARY_CLOUD_NAME && private_env.CLOUDINARY_API_KEY && private_env.CLOUDINARY_API_SECRET);
        if (isCloudinaryConfigured) {
          image_url = await uploadImage(image_file, "blog/ads");
        } else {
          const buffer = Buffer.from(await image_file.arrayBuffer());
          const extension = image_file.name.split(".").pop() || "jpg";
          const filename = `ad-${Date.now()}.${extension}`;
          const uploadDir = path.join(process.cwd(), "static", "uploads", "ads");
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          fs.writeFileSync(path.join(uploadDir, filename), buffer);
          image_url = `/uploads/ads/${filename}`;
        }
      } catch (e) {
        console.error("Error uploading ad image:", e);
        return fail(500, { message: "Erro ao fazer upload da imagem" });
      }
    }
    const styleStr = data.get("style");
    let style = null;
    if (styleStr) {
      try {
        style = JSON.parse(styleStr);
      } catch {
      }
    }
    const ad = {
      name: data.get("name"),
      placement: data.get("placement"),
      type: data.get("type"),
      content: data.get("content") || "",
      image_url: image_url || null,
      link_url: data.get("link_url") || "",
      is_active: data.get("is_active") === "on" ? 1 : 0,
      weight: parseInt(data.get("weight")) || 1,
      style,
      youtube_video_url: data.get("youtube_video_url") || null
    };
    if (!ad.name || !ad.placement || !ad.type) {
      return fail(400, { message: "Nome, posicionamento e tipo são obrigatórios" });
    }
    if (ad.type === "video" && !ad.youtube_video_url) {
      return fail(400, { message: "A URL do vídeo do YouTube é obrigatória para anúncios do tipo Vídeo." });
    }
    await updateAd(params.id, ad);
    throw redirect(303, "/admin/ads");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CTkrm9M4.js')).default;
const server_id = "src/routes/admin/ads/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/7.CdKbTO52.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/CCgN62RU.js"];
const stylesheets = ["_app/immutable/assets/7.Ap7dY1pk.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-CGg4XBfv.js.map
