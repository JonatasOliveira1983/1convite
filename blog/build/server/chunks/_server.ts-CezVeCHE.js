import { r as redirect, e as error } from './index-BkmUvga9.js';
import { getSettings, getProductById, hasUserPurchasedProduct, queryOne, recordProductDownload } from './database-GQg0oTqt.js';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const GET = async ({ params, locals, url }) => {
  const settings = await getSettings();
  if (!locals.user) {
    throw redirect(303, `/members/login?redirectTo=${encodeURIComponent(url.pathname)}`);
  }
  const productId = parseInt(params.productId);
  if (isNaN(productId)) {
    throw error(400, "ID do produto inválido.");
  }
  const product = await getProductById(productId);
  if (!product) {
    throw error(404, "Produto não encontrado.");
  }
  if (!product.file_url && !product.external_link) {
    throw error(404, "Este produto não possui arquivo para download.");
  }
  let hasAccess = false;
  if (locals.user.role === "admin") {
    hasAccess = true;
  } else if (product.price_cents <= 0) {
    hasAccess = true;
  } else {
    const purchased = await hasUserPurchasedProduct(locals.user.id, product.id);
    if (purchased) {
      hasAccess = true;
    } else if (settings.enable_member_login === "1" && product.is_premium_included && product.is_premium_included >= 1) {
      let subscription;
      if (product.is_premium_included === 1) {
        subscription = await queryOne(
          `SELECT id FROM premium_subscriptions
                     WHERE user_id = ?
                       AND status = 'active'
                       AND (expires_at IS NULL OR expires_at > datetime('now'))`,
          [locals.user.id]
        );
      } else {
        subscription = await queryOne(
          `SELECT id FROM premium_subscriptions
                     WHERE user_id = ?
                       AND plan_id = ?
                       AND status = 'active'
                       AND (expires_at IS NULL OR expires_at > datetime('now'))`,
          [locals.user.id, product.is_premium_included]
        );
      }
      hasAccess = !!subscription;
    }
  }
  if (!hasAccess) {
    throw redirect(303, `/product/${product.slug}?error=no_access`);
  }
  if (product.file_url) {
    if (product.file_url.startsWith("http")) {
      await recordProductDownload(locals.user.id, product.id);
      const urlPath = product.file_url.split("?")[0];
      let remoteFilename = path.basename(urlPath);
      try {
        remoteFilename = decodeURIComponent(remoteFilename);
        const newPatternMatch = remoteFilename.match(/^(.+)_[a-zA-Z0-9]{6}__([a-zA-Z0-9]+)$/);
        if (newPatternMatch) {
          remoteFilename = `${newPatternMatch[1]}.${newPatternMatch[2]}`;
        } else {
          remoteFilename = remoteFilename.replace(/_[a-zA-Z0-9]{6}(\.[a-zA-Z0-9]+)$/i, "$1");
        }
      } catch (e) {
      }
      if (!remoteFilename || !remoteFilename.includes(".")) {
        const cleanNameRemote = product.name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s.-]/g, "").replace(/[\s_]+/g, "_").substring(0, 100);
        const remoteExt = urlPath.match(/\.([a-z0-9]+)$/i)?.[1] || "zip";
        remoteFilename = `${cleanNameRemote}.${remoteExt}`;
      }
      const urlDomain = (() => {
        try {
          return new URL(product.file_url).hostname;
        } catch {
          return "unknown";
        }
      })();
      console.log(`[Secure Download] Serving product ${product.id} (${product.name}) from Cloudinary`);
      console.log(`[Secure Download] Storage domain: ${urlDomain} | URL length: ${product.file_url.length} | Filename: ${remoteFilename}`);
      let cloudRes;
      try {
        cloudRes = await fetch(product.file_url);
      } catch (fetchErr) {
        console.error(`[Secure Download] Network error fetching from ${urlDomain}:`, fetchErr.message);
        throw error(502, "Não foi possível conectar ao servidor de armazenamento.");
      }
      if (!cloudRes.ok) {
        console.error(`[Secure Download] Storage returned HTTP ${cloudRes.status} for product ${product.id}`);
        throw error(502, "O arquivo não está mais disponível no servidor de armazenamento. Contacte o administrador.");
      }
      const headers = new Headers();
      headers.set("Content-Disposition", `attachment; filename="${remoteFilename}"`);
      headers.set("Content-Type", "application/octet-stream");
      headers.set("x-download-source", "cloudinary");
      headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      headers.set("Pragma", "no-cache");
      headers.set("Expires", "0");
      const contentLength = cloudRes.headers.get("content-length");
      if (contentLength) headers.set("Content-Length", contentLength);
      return new Response(cloudRes.body, { status: 200, headers });
    }
    const filename = path.basename(product.file_url);
    const persistentPath = process.env.PRODUCT_UPLOADS_DIR ? path.join(process.env.PRODUCT_UPLOADS_DIR, filename) : null;
    const relativePath = product.file_url.startsWith("/") ? product.file_url.substring(1) : product.file_url;
    const staticPath = path.join(process.cwd(), "static", relativePath);
    let finalPath = "";
    if (persistentPath && fs.existsSync(persistentPath)) {
      finalPath = persistentPath;
    } else if (fs.existsSync(staticPath)) {
      finalPath = staticPath;
    }
    if (finalPath) {
      const nodeStream = fs.createReadStream(finalPath);
      const webStream = Readable.toWeb(nodeStream);
      let downloadFilename = path.basename(finalPath);
      downloadFilename = downloadFilename.replace(/_[a-zA-Z0-9]{6}(\.[a-zA-Z0-9]+)$/i, "$1");
      if (!downloadFilename || !downloadFilename.includes(".")) {
        const cleanName = product.name.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s.-]/g, "").replace(/[\s_]+/g, "_").substring(0, 100);
        const ext = path.extname(finalPath) || ".zip";
        downloadFilename = cleanName.toLowerCase().endsWith(ext.toLowerCase()) ? cleanName : `${cleanName}${ext}`;
      }
      console.log(`[Secure Download] Serving product ${product.id} (${product.name}) from Local Disk`);
      const headers = new Headers();
      headers.set("Content-Disposition", `attachment; filename="${downloadFilename}"`);
      headers.set("Content-Type", "application/octet-stream");
      headers.set("x-download-source", "local-disk");
      headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      headers.set("Pragma", "no-cache");
      headers.set("Expires", "0");
      try {
        const stats = fs.statSync(finalPath);
        headers.set("Content-Length", stats.size.toString());
      } catch (e) {
        console.error("Error reading file stats:", e);
      }
      await recordProductDownload(locals.user.id, product.id);
      return new Response(webStream, {
        status: 200,
        headers
      });
    }
  }
  if (product.external_link) {
    await recordProductDownload(locals.user.id, product.id);
    throw redirect(302, product.external_link);
  }
  throw error(500, "Erro ao localizar arquivo do produto.");
};

export { GET };
//# sourceMappingURL=_server.ts-CezVeCHE.js.map
