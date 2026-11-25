import { f as fail, r as redirect } from './index-BkmUvga9.js';
import { checkRateLimit, verifyLogin, resetRateLimit, createSession, validateSession } from './auth2-B20dP8z5.js';
import './shared-server-DaWdgxVh.js';
import './database-BjMeOB2B.js';
import 'crypto';
import 'bcryptjs';

const load = async ({ cookies }) => {
  const sessionToken = cookies.get("admin_session");
  if (sessionToken && await validateSession(sessionToken)) {
    throw redirect(303, "/admin");
  }
  return {};
};
const actions = {
  login: async ({ request, cookies, getClientAddress, url }) => {
    const data = await request.formData();
    const username = data.get("username");
    const password = data.get("password");
    const clientIp = getClientAddress() || "unknown";
    if (!username || !password) {
      return fail(400, { error: "Preencha todos os campos" });
    }
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return fail(429, {
        error: `Muitas tentativas. Aguarde ${rateLimit.waitSeconds} segundos`,
        waitSeconds: rateLimit.waitSeconds
      });
    }
    const valid = await verifyLogin(username, password);
    if (!valid) {
      return fail(400, { error: "Usuário ou senha incorretos", remaining: rateLimit.remaining });
    }
    resetRateLimit(clientIp);
    const sessionToken = await createSession(username);
    cookies.set("admin_session", sessionToken, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      // 30 dias
      secure: url.protocol === "https:"
    });
    throw redirect(303, "/admin");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 17;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Dn1XfdAU.js')).default;
const server_id = "src/routes/admin/login/+page.server.ts";
const imports = ["_app/immutable/nodes/17.BqjaaYlA.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/4SgIdhTS.js"];
const stylesheets = ["_app/immutable/assets/17.D0tgY9Bg.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-COOcBbTJ.js.map
