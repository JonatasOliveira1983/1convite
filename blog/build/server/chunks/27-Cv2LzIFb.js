import { f as fail } from './index-BkmUvga9.js';
import { getProductById, deleteProduct, getAllProducts } from './database-GQg0oTqt.js';
import fs from 'fs';
import path from 'path';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const load = async () => {
  const products = await getAllProducts();
  return { products };
};
const actions = {
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = parseInt(data.get("id"));
    if (isNaN(id)) {
      return fail(400, { message: "ID do produto inválido" });
    }
    try {
      const product = await getProductById(id);
      if (product && product.file_url) {
        try {
          const filename = path.basename(product.file_url);
          const pathsToDelete = [];
          if (process.env.PRODUCT_UPLOADS_DIR) {
            pathsToDelete.push(path.join(process.env.PRODUCT_UPLOADS_DIR, filename));
          }
          pathsToDelete.push(path.join(process.cwd(), "static", "uploads", "products", filename));
          for (const p of pathsToDelete) {
            if (fs.existsSync(p)) {
              fs.unlinkSync(p);
            }
          }
        } catch (err) {
          console.error("Error deleting product file from disk:", err);
        }
      }
      await deleteProduct(id);
      return { success: true };
    } catch (e) {
      console.error("Error deleting product:", e);
      return fail(500, { message: "Erro ao deletar produto" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 27;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-LzWoeqS-.js')).default;
const server_id = "src/routes/admin/products/+page.server.ts";
const imports = ["_app/immutable/nodes/27.QmAhPmZD.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/CCgN62RU.js"];
const stylesheets = ["_app/immutable/assets/27.CujHgUue.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=27-Cv2LzIFb.js.map
