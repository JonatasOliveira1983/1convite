import { f as fail, r as redirect } from './index-BkmUvga9.js';
import { validateSession } from './auth2-B20dP8z5.js';
import { deleteShortlink, getShortlinkBySlug, updateShortlink, createShortlink, getPaginatedShortlinks, getShortlinksCount, getAllAds, getSettings } from './database-BjMeOB2B.js';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import 'bcryptjs';
import 'crypto';

const load = async ({ cookies, url }) => {
  const token = cookies.get("admin_session");
  const username = await validateSession(token || "");
  if (!username) {
    throw redirect(302, "/admin/login");
  }
  const q = url.searchParams.get("q") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 10;
  const offset = (page - 1) * limit;
  const shortlinks = await getPaginatedShortlinks(q, limit, offset);
  const totalCount = await getShortlinksCount(q);
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const ads = await getAllAds();
  const activeAdsCount = ads.filter((a) => a.is_active === 1).length;
  const settings = await getSettings();
  const rawSiteUrl = private_env.SITE_URL || settings.site_url || "https://seusite.com";
  const siteUrl = rawSiteUrl.endsWith("/") ? rawSiteUrl.slice(0, -1) : rawSiteUrl;
  return {
    shortlinks,
    activeAdsCount,
    ads,
    siteUrl,
    q,
    currentPage: page,
    totalPages,
    totalCount
  };
};
const actions = {
  create: async ({ request, cookies }) => {
    const token = cookies.get("admin_session");
    const username = await validateSession(token || "");
    if (!username) {
      return fail(401, { message: "UNAUTHORIZED" });
    }
    const data = await request.formData();
    const slug = (data.get("slug") || "").trim().toLowerCase();
    const destinationUrl = (data.get("destination_url") || "").trim();
    const useAdInterstitial = data.get("use_ad_interstitial") === "on" || data.get("use_ad_interstitial") === "true";
    const adDurationSeconds = parseInt(data.get("ad_duration_seconds") || "5");
    const isIndexed = data.get("is_indexed") === "on" || data.get("is_indexed") === "true";
    const metaTitle = (data.get("meta_title") || "").trim();
    const metaDescription = (data.get("meta_description") || "").trim();
    const fixedAdIdRaw = data.get("fixed_ad_id");
    const fixedAdId = fixedAdIdRaw && fixedAdIdRaw !== "" ? parseInt(fixedAdIdRaw, 10) : null;
    if (!slug || !destinationUrl) {
      return fail(400, { message: "SL_REQUIRED" });
    }
    if (!/^[a-z0-9-_]+$/i.test(slug)) {
      return fail(400, { message: "SL_INVALID_SLUG" });
    }
    const reservedSlugs = ["admin", "api", "members", "login", "logout", "post", "category", "categories", "premium", "robots", "sitemap", "rss"];
    if (reservedSlugs.includes(slug)) {
      return fail(400, { message: "SL_RESERVED" });
    }
    try {
      const existing = await getShortlinkBySlug(slug);
      if (existing) {
        return fail(400, { message: "SL_SLUG_IN_USE", slug });
      }
      await createShortlink({
        slug,
        destinationUrl,
        useAdInterstitial,
        adDurationSeconds,
        isIndexed,
        metaTitle,
        metaDescription,
        fixedAdId
      });
      return { success: true, action: "create" };
    } catch (e) {
      console.error("Error creating shortlink:", e);
      return fail(500, { message: "SL_CREATE_FAIL" });
    }
  },
  update: async ({ request, cookies }) => {
    const token = cookies.get("admin_session");
    const username = await validateSession(token || "");
    if (!username) {
      return fail(401, { message: "UNAUTHORIZED" });
    }
    const data = await request.formData();
    const id = data.get("id");
    const slug = (data.get("slug") || "").trim().toLowerCase();
    const destinationUrl = (data.get("destination_url") || "").trim();
    const useAdInterstitial = data.get("use_ad_interstitial") === "on" || data.get("use_ad_interstitial") === "true";
    const adDurationSeconds = parseInt(data.get("ad_duration_seconds") || "5");
    const isIndexed = data.get("is_indexed") === "on" || data.get("is_indexed") === "true";
    const metaTitle = (data.get("meta_title") || "").trim();
    const metaDescription = (data.get("meta_description") || "").trim();
    const fixedAdIdRaw = data.get("fixed_ad_id");
    const fixedAdId = fixedAdIdRaw && fixedAdIdRaw !== "" ? parseInt(fixedAdIdRaw, 10) : null;
    if (!id || !slug || !destinationUrl) {
      return fail(400, { message: "SL_INCOMPLETE" });
    }
    if (!/^[a-z0-9-_]+$/i.test(slug)) {
      return fail(400, { message: "SL_INVALID_SLUG" });
    }
    try {
      const existing = await getShortlinkBySlug(slug);
      if (existing && existing.id.toString() !== id) {
        return fail(400, { message: "SL_SLUG_IN_USE", slug });
      }
      await updateShortlink(id, {
        slug,
        destinationUrl,
        useAdInterstitial,
        adDurationSeconds,
        isIndexed,
        metaTitle,
        metaDescription,
        fixedAdId
      });
      return { success: true, action: "update" };
    } catch (e) {
      console.error("Error updating shortlink:", e);
      return fail(500, { message: "SL_UPDATE_FAIL" });
    }
  },
  delete: async ({ request, cookies }) => {
    const token = cookies.get("admin_session");
    const username = await validateSession(token || "");
    if (!username) {
      return fail(401, { message: "UNAUTHORIZED" });
    }
    const data = await request.formData();
    const id = data.get("id");
    if (!id) {
      return fail(400, { message: "SL_ID_REQUIRED" });
    }
    try {
      await deleteShortlink(id);
      return { success: true, action: "delete" };
    } catch (e) {
      console.error("Error deleting shortlink:", e);
      return fail(500, { message: "SL_DELETE_FAIL" });
    }
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 33;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CfUrVEZg.js')).default;
const server_id = "src/routes/admin/shortlinks/+page.server.ts";
const imports = ["_app/immutable/nodes/33.DEQn_EHN.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/BQOwFY6C.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/C0mErb-h.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/bbHv8owl.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js","_app/immutable/chunks/4SgIdhTS.js","_app/immutable/chunks/DIlIFEBx.js","_app/immutable/chunks/7QtYz8kT.js"];
const stylesheets = ["_app/immutable/assets/Pagination.DmakeXk_.css","_app/immutable/assets/33.CGFsLmFA.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=33-Dr_UC4ng.js.map
