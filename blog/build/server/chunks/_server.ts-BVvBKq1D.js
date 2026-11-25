import { e as error, j as json } from './index-BkmUvga9.js';
import { validateSession } from './auth2-B20dP8z5.js';
import { u as uploadImage } from './cloudinary-Dh2Q5Csf.js';
import fs from 'fs';
import path from 'path';
import './shared-server-DaWdgxVh.js';
import './database-BjMeOB2B.js';
import 'crypto';
import 'bcryptjs';
import 'cloudinary';

const POST = async ({ request, cookies }) => {
  const token = cookies.get("admin_session");
  const username = await validateSession(token || "");
  if (!username) {
    throw error(401, "Não autorizado");
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || file.size === 0) {
      throw error(400, "Nenhum arquivo enviado");
    }
    const rawFolder = String(formData.get("folder") || "blog/newsletter").trim();
    const allowedFolders = /* @__PURE__ */ new Set([
      "blog/newsletter",
      "blog/stories",
      "blog/posts",
      "blog/ads",
      "blog/products"
    ]);
    const folder = allowedFolders.has(rawFolder) ? rawFolder : "blog/newsletter";
    const localSubdir = folder.split("/").pop() || "uploads";
    try {
      const url = await uploadImage(file, folder);
      return json({ url, folder });
    } catch (cloudinaryErr) {
      console.warn("[UPLOAD API] Cloudinary failed or not configured, falling back to local storage:", cloudinaryErr);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const uploadDir = path.join(process.cwd(), "static", "uploads", localSubdir);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      return json({ url: `/uploads/${localSubdir}/${filename}`, folder });
    }
  } catch (err) {
    console.error("[UPLOAD API] Error processing upload:", err);
    throw error(500, err?.message || "Falha ao processar upload");
  }
};

export { POST };
//# sourceMappingURL=_server.ts-BVvBKq1D.js.map
