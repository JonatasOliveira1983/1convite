import { e as error } from './index-BkmUvga9.js';
import { getLandingPageBySlug } from './database-BjMeOB2B.js';
import { p as parseAndSanitizeLandingContent } from './landing-pages-DRUTjZVo.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import './sanitize-beQ_Z907.js';
import 'jsdom';

const load = async ({ params, cookies }) => {
  const { slug } = params;
  if (!slug) {
    throw error(400, "Slug inválido.");
  }
  const landingPage = await getLandingPageBySlug(slug);
  if (!landingPage) {
    throw error(404, "Página não encontrada.");
  }
  if (landingPage.status === "draft") {
    const adminSession = cookies.get("admin_session");
    if (!adminSession) {
      throw error(404, "Página não encontrada.");
    }
  }
  return {
    landingPage: {
      ...landingPage,
      content: parseAndSanitizeLandingContent(landingPage.content || "[]")
    }
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 48;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-qapUc9NX.js')).default;
const server_id = "src/routes/p/[slug]/+page.server.ts";
const imports = ["_app/immutable/nodes/48.CNAB-ViI.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/uFF43Du1.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/7QtYz8kT.js","_app/immutable/chunks/B_tIvOFa.js"];
const stylesheets = ["_app/immutable/assets/LandingPageHeader.C-_zZJin.css","_app/immutable/assets/48.B46sCM3w.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=48-CkVhWcU0.js.map
