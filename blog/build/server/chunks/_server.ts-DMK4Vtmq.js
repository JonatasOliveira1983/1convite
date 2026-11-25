import { j as json } from './index-BkmUvga9.js';
import { u as uploadImage } from './cloudinary-Dh2Q5Csf.js';
import { r as requireCLIToken } from './auth-0IKf-_gf.js';
import 'cloudinary';
import './shared-server-DaWdgxVh.js';
import './database-GQg0oTqt.js';
import 'crypto';

async function hasValidImageSignature(file) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ascii = (start, end) => String.fromCharCode(...bytes.slice(start, end));
  if (file.type === "image/jpeg") return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (file.type === "image/png") {
    return [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value);
  }
  if (file.type === "image/gif") return ["GIF87a", "GIF89a"].includes(ascii(0, 6));
  if (file.type === "image/webp") return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
  if (file.type === "image/avif") {
    return ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12));
  }
  return false;
}
const POST = async ({ request, getClientAddress }) => {
  const authError = await requireCLIToken(request, getClientAddress());
  if (authError) return authError;
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return json({ error: 'Esperado multipart/form-data com campo "file".' }, { status: 400 });
  }
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return json({ error: 'Campo "file" ausente ou inválido. Envie um arquivo de imagem.' }, { status: 400 });
  }
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
  if (!allowed.includes(file.type)) {
    return json({
      error: `Tipo de arquivo não suportado: "${file.type}". Use: JPG, PNG, WEBP, GIF ou AVIF.`
    }, { status: 400 });
  }
  if (!await hasValidImageSignature(file)) {
    return json({ error: "O conteúdo do arquivo não corresponde ao tipo de imagem informado." }, { status: 400 });
  }
  const maxBytes = 20 * 1024 * 1024;
  if (file.size === 0) {
    return json({ error: "O arquivo está vazio." }, { status: 400 });
  }
  if (file.size > maxBytes) {
    return json({ error: `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo: 20MB.` }, { status: 400 });
  }
  const requestedFolder = String(formData.get("folder") || "blog").trim();
  const allowedFolders = /* @__PURE__ */ new Set(["blog", "blog/posts", "blog/pinterest", "blog/stories", "blog/landings"]);
  if (!allowedFolders.has(requestedFolder)) {
    return json({ error: "Pasta inválida.", allowed_folders: [...allowedFolders] }, { status: 400 });
  }
  const folder = requestedFolder;
  try {
    const url = await uploadImage(file, folder);
    return json({
      success: true,
      url,
      filename: file.name,
      size: file.size,
      type: file.type
    }, { status: 201 });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return json({ error: "Falha no upload para o Cloudinary. Verifique as credenciais no servidor." }, { status: 500 });
  }
};

export { POST };
//# sourceMappingURL=_server.ts-DMK4Vtmq.js.map
