import { f as fail, r as redirect, i as isRedirect } from './index-BkmUvga9.js';
import { updateSetting, getSettings } from './database-BjMeOB2B.js';
import { g as getTenantId } from './tenant-TKHyoVq1.js';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import { u as uploadImage } from './cloudinary-Dh2Q5Csf.js';
import 'crypto';
import 'cloudinary';

async function load() {
  const settings = await getSettings();
  return {
    settings,
    hasEnvApiKey: !!private_env.GEMINI_API_KEY,
    envApiModel: private_env.GEMINI_API_MODEL || "gemini-2.5-flash"
  };
}
const actions = {
  general: async ({ request }) => {
    try {
      const tenantId = getTenantId();
      const data = await request.formData();
      const site_title = data.get("site_title");
      const site_description = data.get("site_description");
      const site_keywords = data.get("site_keywords");
      const feed_loading_mode = data.get("feed_loading_mode");
      const enable_recommendations = data.get("enable_recommendations");
      let site_logo = data.get("site_logo") || "";
      let site_favicon = data.get("site_favicon") || "";
      let seo_image = data.get("seo_image") || "";
      const site_logo_file = data.get("site_logo_file");
      const site_favicon_file = data.get("site_favicon_file");
      const seo_image_file = data.get("seo_image_file");
      const isCloudinaryConfigured = !!(private_env.CLOUDINARY_CLOUD_NAME && private_env.CLOUDINARY_API_KEY && private_env.CLOUDINARY_API_SECRET);
      if (site_logo_file && site_logo_file instanceof File && site_logo_file.size > 0) {
        try {
          if (isCloudinaryConfigured) {
            site_logo = await uploadImage(site_logo_file, "blog/settings");
          } else {
            const buffer = Buffer.from(await site_logo_file.arrayBuffer());
            const extension = site_logo_file.name.split(".").pop() || "png";
            const filename = `logo-${Date.now()}.${extension}`;
            const fs = await import('fs');
            const path = await import('path');
            const uploadDir = path.join(process.cwd(), "static", "uploads");
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
            }
            fs.writeFileSync(path.join(uploadDir, filename), buffer);
            site_logo = `/uploads/${filename}`;
          }
        } catch (e) {
          console.error("Error uploading site logo:", e);
          return fail(500, { message: "Erro ao fazer upload do logo" });
        }
      }
      if (site_favicon_file && site_favicon_file instanceof File && site_favicon_file.size > 0) {
        try {
          if (isCloudinaryConfigured) {
            site_favicon = await uploadImage(site_favicon_file, "blog/settings");
          } else {
            const buffer = Buffer.from(await site_favicon_file.arrayBuffer());
            const extension = site_favicon_file.name.split(".").pop() || "png";
            const filename = `favicon-${Date.now()}.${extension}`;
            const fs = await import('fs');
            const path = await import('path');
            const uploadDir = path.join(process.cwd(), "static", "uploads");
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
            }
            fs.writeFileSync(path.join(uploadDir, filename), buffer);
            site_favicon = `/uploads/${filename}`;
          }
        } catch (e) {
          console.error("Error uploading site favicon:", e);
          return fail(500, { message: "Erro ao fazer upload do favicon" });
        }
      }
      if (seo_image_file && seo_image_file instanceof File && seo_image_file.size > 0) {
        try {
          if (isCloudinaryConfigured) {
            seo_image = await uploadImage(seo_image_file, "blog/settings");
          } else {
            const buffer = Buffer.from(await seo_image_file.arrayBuffer());
            const extension = seo_image_file.name.split(".").pop() || "png";
            const filename = `og-image-${Date.now()}.${extension}`;
            const fs = await import('fs');
            const path = await import('path');
            const uploadDir = path.join(process.cwd(), "static", "uploads");
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
            }
            fs.writeFileSync(path.join(uploadDir, filename), buffer);
            seo_image = `/uploads/${filename}`;
          }
        } catch (e) {
          console.error("Error uploading SEO image:", e);
          return fail(500, { message: "Erro ao fazer upload da imagem" });
        }
      }
      const og_app_id = data.get("og_app_id");
      const twitter_handle = data.get("twitter_handle");
      const footer_text = data.get("footer_text");
      const admin_email = data.get("admin_email");
      const default_theme = data.get("default_theme");
      const custom_head_script = data.get("custom_head_script");
      const custom_body_script = data.get("custom_body_script");
      const whatsapp_enable = data.get("whatsapp_enable") === "1" || data.get("whatsapp_enable") === "on" ? "1" : "0";
      const whatsapp_number = data.get("whatsapp_number");
      const whatsapp_message = data.get("whatsapp_message");
      const site_language = data.get("site_language");
      await updateSetting("site_title", site_title || "", tenantId);
      await updateSetting("site_description", site_description || "", tenantId);
      await updateSetting("site_keywords", site_keywords || "", tenantId);
      await updateSetting(
        "feed_loading_mode",
        feed_loading_mode === "infinite" ? "infinite" : "pagination",
        tenantId
      );
      await updateSetting("enable_recommendations", enable_recommendations === "0" ? "0" : "1", tenantId);
      await updateSetting("site_logo", site_logo || "", tenantId);
      await updateSetting("site_favicon", site_favicon || "", tenantId);
      await updateSetting("seo_image", seo_image || "", tenantId);
      await updateSetting("og_app_id", og_app_id || "", tenantId);
      await updateSetting("twitter_handle", twitter_handle || "", tenantId);
      await updateSetting("footer_text", footer_text || "", tenantId);
      await updateSetting("admin_email", admin_email || "", tenantId);
      await updateSetting("default_theme", default_theme === "dark" ? "dark" : "light", tenantId);
      await updateSetting("custom_head_script", custom_head_script || "", tenantId);
      await updateSetting("custom_body_script", custom_body_script || "", tenantId);
      await updateSetting("whatsapp_enable", whatsapp_enable, tenantId);
      await updateSetting("whatsapp_number", whatsapp_number || "", tenantId);
      await updateSetting("whatsapp_message", whatsapp_message || "", tenantId);
      await updateSetting("site_language", site_language === "en" || site_language === "es" ? site_language : "pt", tenantId);
      throw redirect(303, "/admin/settings?tab=general&success=true");
    } catch (e) {
      if (isRedirect(e)) throw e;
      console.error("Error saving settings:", e);
      return fail(500, { message: "Erro ao salvar configurações" });
    }
  },
  api: async ({ request }) => {
    const data = await request.formData();
    const gemini_api_key = data.get("gemini_api_key");
    const gemini_api_model = data.get("gemini_api_model");
    const site_url = data.get("site_url");
    const payment_gateway_raw = data.get("payment_gateway") || "asaas";
    const payment_gateway = payment_gateway_raw === "stripe" ? "stripe" : "asaas";
    const asaas_api_key = data.get("asaas_api_key");
    const asaas_api_url = data.get("asaas_api_url");
    const asaas_webhook_secret = data.get("asaas_webhook_secret");
    const stripe_secret_key = data.get("stripe_secret_key");
    const stripe_publishable_key = data.get("stripe_publishable_key");
    const stripe_webhook_secret = data.get("stripe_webhook_secret");
    const stripe_currency_raw = (data.get("stripe_currency") || "brl").toLowerCase().trim();
    const stripe_currency = /^[a-z]{3}$/.test(stripe_currency_raw) ? stripe_currency_raw : "brl";
    const enable_member_login = data.get("enable_member_login") === "1" || data.get("enable_member_login") === "on" ? "1" : "0";
    const resend_api_key = data.get("resend_api_key");
    const resend_from_email = data.get("resend_from_email");
    const enable_otp_login = data.get("enable_otp_login") === "1" || data.get("enable_otp_login") === "on" ? "1" : "0";
    const sidebar_products_display_mode = data.get("sidebar_products_display_mode");
    const microsoft_clarity_project_id = data.get("microsoft_clarity_project_id");
    await updateSetting("gemini_api_key", gemini_api_key || "");
    await updateSetting("gemini_api_model", gemini_api_model || "gemini-2.5-flash");
    await updateSetting("site_url", site_url || "");
    await updateSetting("payment_gateway", payment_gateway);
    await updateSetting("asaas_api_key", asaas_api_key || "");
    await updateSetting("asaas_api_url", asaas_api_url || "https://api-sandbox.asaas.com/v3");
    await updateSetting("asaas_webhook_secret", asaas_webhook_secret || "");
    await updateSetting("stripe_secret_key", stripe_secret_key || "");
    await updateSetting("stripe_publishable_key", stripe_publishable_key || "");
    await updateSetting("stripe_webhook_secret", stripe_webhook_secret || "");
    await updateSetting("stripe_currency", stripe_currency);
    await updateSetting("enable_member_login", enable_member_login);
    await updateSetting("resend_api_key", resend_api_key || "");
    await updateSetting("resend_from_email", resend_from_email || "onboarding@resend.dev");
    await updateSetting("enable_otp_login", enable_otp_login);
    await updateSetting("sidebar_products_display_mode", sidebar_products_display_mode || "carousel");
    await updateSetting("microsoft_clarity_project_id", microsoft_clarity_project_id || "");
    throw redirect(303, "/admin/settings?tab=api&success=true");
  },
  seo: async ({ request }) => {
    const data = await request.formData();
    const rss_feed_title = data.get("rss_feed_title");
    const rss_feed_description = data.get("rss_feed_description");
    const sitemap_priority_home = data.get("sitemap_priority_home");
    const sitemap_priority_posts = data.get("sitemap_priority_posts");
    const sitemap_priority_categories = data.get("sitemap_priority_categories");
    const sitemap_changefreq_home = data.get("sitemap_changefreq_home");
    const sitemap_changefreq_posts = data.get("sitemap_changefreq_posts");
    const google_news_keywords = data.get("google_news_keywords");
    const google_news_image_min_width = data.get("google_news_image_min_width");
    const ads_txt = data.get("ads_txt");
    await updateSetting("rss_feed_title", rss_feed_title || "");
    await updateSetting("rss_feed_description", rss_feed_description || "");
    await updateSetting("sitemap_priority_home", sitemap_priority_home || "1.0");
    await updateSetting("sitemap_priority_posts", sitemap_priority_posts || "0.9");
    await updateSetting(
      "sitemap_priority_categories",
      sitemap_priority_categories || "0.6"
    );
    await updateSetting("sitemap_changefreq_home", sitemap_changefreq_home || "daily");
    await updateSetting("sitemap_changefreq_posts", sitemap_changefreq_posts || "weekly");
    await updateSetting(
      "google_news_keywords",
      google_news_keywords || "noticia, artigo, blog"
    );
    await updateSetting("google_news_image_min_width", google_news_image_min_width || "1600");
    await updateSetting("ads_txt", ads_txt || "");
    throw redirect(303, "/admin/settings?tab=seo&success=true");
  },
  security: async ({ request, cookies }) => {
    try {
      const { validateSession, verifyLogin, hashPassword, validatePasswordStrength } = await import('./auth2-B20dP8z5.js');
      const token = cookies.get("admin_session");
      const username = await validateSession(token || "");
      if (!username) {
        return fail(401, { message: "Não autorizado" });
      }
      const data = await request.formData();
      const current_password = data.get("current_password");
      const new_password = data.get("new_password");
      const confirm_password = data.get("confirm_password");
      if (!current_password || !new_password || !confirm_password) {
        return fail(400, { message: "Preencha todos os campos" });
      }
      if (new_password !== confirm_password) {
        return fail(400, { message: "A nova senha e a confirmação não coincidem" });
      }
      const strength = validatePasswordStrength(new_password);
      if (!strength.valid) {
        return fail(400, { message: strength.message });
      }
      const valid = await verifyLogin(username, current_password);
      if (!valid) {
        return fail(400, { message: "Senha atual incorreta" });
      }
      const hashedPassword = await hashPassword(new_password);
      const { updateUserPassword } = await import('./database-BjMeOB2B.js');
      await updateUserPassword(username, hashedPassword);
      throw redirect(303, "/admin/settings?tab=security&success=true");
    } catch (e) {
      if (isRedirect(e)) throw e;
      console.error("Error changing admin password:", e);
      return fail(500, { message: "Erro ao alterar a senha" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 32;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Cj8BwWFj.js')).default;
const server_id = "src/routes/admin/settings/+page.server.ts";
const imports = ["_app/immutable/nodes/32.Bux5ExbN.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/4SgIdhTS.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/B4_EO2I8.js"];
const stylesheets = ["_app/immutable/assets/32.B73dTOvK.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=32-C4B-NCEH.js.map
