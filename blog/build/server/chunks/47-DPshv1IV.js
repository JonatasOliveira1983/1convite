import { f as fail, r as redirect } from './index-BkmUvga9.js';
import { getSettings, getUserByUsername, createUser, mergeAnonymousInterests, mergeAnonymousSeenPosts } from './database-GQg0oTqt.js';
import { hashPassword, createSession, validateSession } from './auth2-rxn-yo76.js';
import { p as parseSeenCookie } from './interest-engine-B2U744d7.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'bcryptjs';

const load = async ({ cookies }) => {
  const settings = await getSettings();
  if (settings.enable_member_login !== "1") {
    throw redirect(303, "/");
  }
  const sessionToken = cookies.get("member_session");
  if (sessionToken && await validateSession(sessionToken)) {
    throw redirect(303, "/members/dashboard");
  }
  return {};
};
const actions = {
  default: async ({ request, cookies, url }) => {
    const settings = await getSettings();
    if (settings.enable_member_login !== "1") {
      return fail(403, { error: "O cadastro de membros está desativado" });
    }
    const data = await request.formData();
    const email = (data.get("email") || "").trim();
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    if (!email || !password || !confirmPassword) {
      return fail(400, { error: "Preencha todos os campos" });
    }
    if (password !== confirmPassword) {
      return fail(400, { error: "As senhas não coincidem" });
    }
    if (password.length < 6) {
      return fail(400, { error: "A senha deve conter no mínimo 6 caracteres" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, { error: "Por favor, insira um e-mail válido" });
    }
    try {
      const existingUser = await getUserByUsername(email);
      if (existingUser) {
        return fail(400, { error: "Este e-mail já está sendo utilizado" });
      }
      const hashedPassword = await hashPassword(password);
      await createUser(email, hashedPassword, "member");
      const sessionToken = await createSession(email);
      cookies.set("member_session", sessionToken, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        // 30 days
        secure: url.protocol === "https:"
      });
      const dbUser = await getUserByUsername(email);
      if (dbUser) {
        const anonInterests = cookies.get("user_interests");
        if (anonInterests) {
          await mergeAnonymousInterests(dbUser.id, anonInterests);
          cookies.delete("user_interests", { path: "/" });
        }
        const anonSeen = cookies.get("recently_seen_posts");
        if (anonSeen) {
          await mergeAnonymousSeenPosts(dbUser.id, parseSeenCookie(anonSeen));
          cookies.delete("recently_seen_posts", { path: "/" });
        }
      }
    } catch (e) {
      console.error("Error registering member:", e);
      return fail(500, { error: "Erro interno ao realizar o cadastro. Tente novamente mais tarde." });
    }
    throw redirect(303, "/members/dashboard");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 47;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DQ9sf5eB.js')).default;
const server_id = "src/routes/members/register/+page.server.ts";
const imports = ["_app/immutable/nodes/47.B0DNLeFe.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/CCgN62RU.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/47.CdyUtcd8.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=47-DPshv1IV.js.map
