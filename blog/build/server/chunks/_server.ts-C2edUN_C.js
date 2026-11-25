import { e as error } from './index-BkmUvga9.js';
import { getWebStoryBySlug, getWebStorySlides, getSettings } from './database-BjMeOB2B.js';
import { b as buildAmpWebStoryHtml } from './web-story-amp-CYl1MDtS.js';
import { b as private_env } from './shared-server-DaWdgxVh.js';
import 'crypto';

const GET = async ({ params, url }) => {
  const slug = (params.slug || "").trim().toLowerCase();
  if (!slug) throw error(404, "Story não encontrada");
  const story = await getWebStoryBySlug(slug);
  if (!story || story.published !== 1) {
    throw error(404, "Story não encontrada");
  }
  const slides = await getWebStorySlides(story.id);
  const settings = await getSettings();
  const rawSiteUrl = private_env.SITE_URL || settings.site_url || `${url.protocol}//${url.host}`;
  const siteUrl = rawSiteUrl.replace(/\/$/, "");
  const siteTitle = settings.site_title || "Blog";
  const siteLogo = settings.site_logo || "/favicon.svg";
  const html = buildAmpWebStoryHtml({
    story,
    slides,
    siteUrl,
    siteTitle,
    siteLogo,
    publisherName: siteTitle
  });
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
      // AMP stories are their own document; avoid framing surprises
      "X-Content-Type-Options": "nosniff"
    }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-C2edUN_C.js.map
