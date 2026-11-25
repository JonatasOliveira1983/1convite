import { f as fail, r as redirect } from './index-BkmUvga9.js';
import { createAd } from './database-BjMeOB2B.js';
import { u as uploadImage } from './cloudinary-Dh2Q5Csf.js';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import fs from 'fs';
import path from 'path';
import 'crypto';
import 'cloudinary';

const actions = {
  default: async ({ request }) => {
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
    await createAd(ad);
    throw redirect(303, "/admin/ads");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-dWhUecHD.js')).default;
const server_id = "src/routes/admin/ads/new/+page.server.ts";
const imports = ["_app/immutable/nodes/6.BQrpiXBQ.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/4SgIdhTS.js"];
const stylesheets = ["_app/immutable/assets/6.BJ6zuB2Z.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-Cot_8-XI.js.map
