import { e as error, r as redirect } from './index-BkmUvga9.js';
import { getShortlinkBySlug, incrementShortlinkClicks, query, getSettings } from './database-BjMeOB2B.js';
import { s as sanitizeAds } from './sanitize-beQ_Z907.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'jsdom';

const load = async ({ params, setHeaders }) => {
  const { slug } = params;
  if (!slug) {
    throw error(404, "Link não especificado");
  }
  const link = await getShortlinkBySlug(slug);
  if (!link) {
    throw error(404, "Link não encontrado");
  }
  if (link.is_indexed === 0) {
    setHeaders({
      "X-Robots-Tag": "noindex, nofollow"
    });
  }
  incrementShortlinkClicks(slug).catch((err) => {
    console.error("Error incrementing shortlink clicks:", err);
  });
  if (link.use_ad_interstitial === 0) {
    throw redirect(302, link.destination_url);
  }
  let selectedAd = null;
  if (link.fixed_ad_id) {
    const fixedAds = await query("SELECT * FROM ads WHERE id = ? AND is_active = 1", [
      link.fixed_ad_id
    ]);
    if (fixedAds && fixedAds.length > 0) {
      selectedAd = fixedAds[0];
    } else {
      console.log(
        `Fixed ad ${link.fixed_ad_id} not available for /l/${slug}, falling back to random.`
      );
      const activeAds = await query("SELECT * FROM ads WHERE is_active = 1");
      if (activeAds && activeAds.length > 0) {
        selectedAd = activeAds[Math.floor(Math.random() * activeAds.length)];
      }
    }
  } else {
    const activeAds = await query("SELECT * FROM ads WHERE is_active = 1");
    if (activeAds && activeAds.length > 0) {
      selectedAd = activeAds[Math.floor(Math.random() * activeAds.length)];
    }
  }
  if (!selectedAd) {
    console.log(`Fallback redirect for shortlink /l/${slug}: no ads available.`);
    throw redirect(302, link.destination_url);
  }
  const settings = await getSettings();
  const siteTitle = settings.site_title || "Blog";
  const siteLogo = settings.site_logo || "/favicon.svg";
  const [safeAd] = sanitizeAds([selectedAd]);
  return {
    link: {
      slug: link.slug,
      destination_url: link.destination_url,
      ad_duration_seconds: link.ad_duration_seconds,
      is_indexed: link.is_indexed,
      meta_title: link.meta_title,
      meta_description: link.meta_description
    },
    ad: safeAd || selectedAd,
    siteTitle,
    siteLogo
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 40;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte--rdeP7hF.js')).default;
const server_id = "src/routes/l/[slug]/+page.server.ts";
const imports = ["_app/immutable/nodes/40.BsUgBmev.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B7xp-7Z6.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/CcBqecmB.js","_app/immutable/chunks/fxnfYmop.js","_app/immutable/chunks/BUMpZ6bS.js","_app/immutable/chunks/CA4WzGrZ.js","_app/immutable/chunks/Diyh2ob8.js","_app/immutable/chunks/RDz6Ocgh.js","_app/immutable/chunks/B4_EO2I8.js","_app/immutable/chunks/B0FVEYD7.js","_app/immutable/chunks/DURbl5Xu.js"];
const stylesheets = ["_app/immutable/assets/AdRenderer.DfbVOCHB.css","_app/immutable/assets/40.CB7Fgz1S.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=40-DK-JI-IW.js.map
