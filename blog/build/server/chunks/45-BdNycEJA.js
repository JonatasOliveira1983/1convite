import { f as fail, r as redirect } from './index-BkmUvga9.js';
import { checkRateLimit, resetRateLimit, hashPassword, createSession, verifyLogin, validateSession } from './auth2-rxn-yo76.js';
import { getSettings, verifyOtpCode, getUserByUsername, createUser, mergeAnonymousInterests, mergeAnonymousSeenPosts, createOtp } from './database-GQg0oTqt.js';
import { c as sendOtpEmail } from './resend-DJzwJZYF.js';
import { p as parseSeenCookie } from './interest-engine-B2U744d7.js';
import './shared-server-DaWdgxVh.js';
import 'bcryptjs';
import 'crypto';

const load = async ({ cookies, url }) => {
  const settings = await getSettings();
  if (settings.enable_member_login !== "1") {
    throw redirect(303, "/");
  }
  const redirectTo = url.searchParams.get("redirectTo") || "";
  const sessionToken = cookies.get("member_session");
  if (sessionToken && await validateSession(sessionToken)) {
    throw redirect(303, redirectTo || "/members/dashboard");
  }
  return {
    enableOtpLogin: settings.enable_otp_login === "1",
    redirectTo
  };
};
const actions = {
  // Traditional password-based login
  login: async ({ request, cookies, getClientAddress, url }) => {
    const settings = await getSettings();
    if (settings.enable_otp_login === "1") {
      return fail(400, { error: "O login por senha está desativado. Use o login por e-mail." });
    }
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");
    const clientIp = getClientAddress() || "unknown";
    const redirectTo = url.searchParams.get("redirectTo") || "";
    if (!email || !password) {
      return fail(400, { error: "Preencha todos os campos" });
    }
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return fail(429, {
        error: `Muitas tentativas. Aguarde ${rateLimit.waitSeconds} segundos`,
        waitSeconds: rateLimit.waitSeconds
      });
    }
    const valid = await verifyLogin(email, password);
    if (!valid) {
      return fail(400, { error: "E-mail ou senha incorretos", remaining: rateLimit.remaining });
    }
    resetRateLimit(clientIp);
    const sessionToken = await createSession(email);
    cookies.set("member_session", sessionToken, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      // 30 days
      secure: url.protocol === "https:"
    });
    const user = await getUserByUsername(email);
    if (user) {
      const anonInterests = cookies.get("user_interests");
      if (anonInterests) {
        await mergeAnonymousInterests(user.id, anonInterests);
        cookies.delete("user_interests", { path: "/" });
      }
      const anonSeen = cookies.get("recently_seen_posts");
      if (anonSeen) {
        await mergeAnonymousSeenPosts(user.id, parseSeenCookie(anonSeen));
        cookies.delete("recently_seen_posts", { path: "/" });
      }
    }
    throw redirect(303, redirectTo || "/members/dashboard");
  },
  // OTP Phase 1: Send OTP Code
  sendOtp: async ({ request, getClientAddress }) => {
    const settings = await getSettings();
    if (settings.enable_otp_login !== "1") {
      return fail(400, { error: "Login via e-mail desativado." });
    }
    const data = await request.formData();
    const email = (data.get("email") || "").trim().toLowerCase();
    const clientIp = getClientAddress() || "unknown";
    if (!email) {
      return fail(400, { error: "Por favor, insira o seu e-mail" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, { error: "Formato de e-mail inválido" });
    }
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return fail(429, {
        error: `Muitas tentativas. Aguarde ${rateLimit.waitSeconds} segundos`,
        waitSeconds: rateLimit.waitSeconds
      });
    }
    const code = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1e3).toISOString().replace("T", " ").substring(0, 19);
    try {
      await createOtp(email, code, expiresAt);
      console.log(`
--- [OTP LOG BYPASS] ---`);
      console.log(`Destinatário: ${email}`);
      console.log(`Código OTP: ${code}`);
      console.log(`Expiração: ${expiresAt}`);
      console.log(`-------------------------
`);
      const sent = await sendOtpEmail(email, code);
      if (!sent) {
        console.warn("[RESEND] API key or configuration missing/failed. OTP email was not sent. Use the bypass log above to test.");
        return {
          otpSent: true,
          email,
          error: "Falha ao enviar e-mail. Se você tiver acesso ao terminal do servidor, use o código OTP gerado lá para entrar."
        };
      }
      return { otpSent: true, email };
    } catch (e) {
      console.error("Error generating/sending OTP:", e);
      return fail(500, { error: "Erro ao gerar código de acesso" });
    }
  },
  // OTP Phase 2: Verify OTP Code and Login (or register)
  verifyOtp: async ({ request, cookies, getClientAddress, url }) => {
    const settings = await getSettings();
    if (settings.enable_otp_login !== "1") {
      return fail(400, { error: "Login via e-mail desativado." });
    }
    const data = await request.formData();
    const email = (data.get("email") || "").trim().toLowerCase();
    const code = (data.get("code") || "").trim();
    const clientIp = getClientAddress() || "unknown";
    const redirectTo = url.searchParams.get("redirectTo") || "";
    if (!email || !code) {
      return fail(400, { error: "Preencha todos os campos", otpSent: true, email });
    }
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return fail(429, {
        error: `Muitas tentativas. Aguarde ${rateLimit.waitSeconds} segundos`,
        waitSeconds: rateLimit.waitSeconds,
        otpSent: true,
        email
      });
    }
    try {
      const isValid = await verifyOtpCode(email, code);
      if (!isValid) {
        return fail(400, { error: "Código inválido ou expirado", otpSent: true, email });
      }
      resetRateLimit(clientIp);
      let user = await getUserByUsername(email);
      if (!user) {
        const randomPassword = Math.random().toString(36).substring(2, 12);
        const hashedPassword = await hashPassword(randomPassword);
        await createUser(email, hashedPassword, "member");
      }
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
      console.error("Error verifying OTP:", e);
      return fail(500, { error: "Erro ao validar código de acesso", otpSent: true, email });
    }
    throw redirect(303, redirectTo || "/members/dashboard");
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 45;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CmTVJj3s.js')).default;
const server_id = "src/routes/members/login/+page.server.ts";
const imports = ["_app/immutable/nodes/45.DKcDxzAY.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/CCgN62RU.js","_app/immutable/chunks/BLAixN2f.js","_app/immutable/chunks/D5_HPCL3.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/45.rMXauuf3.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=45-BdNycEJA.js.map
