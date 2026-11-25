import { getCategoryBySlug, getPostsForPinterestByCategory, getSettings } from './database-GQg0oTqt.js';
import { b as sanitizeHtml } from './sanitize-beQ_Z907.js';
import { e as error } from './index-BkmUvga9.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'jsdom';

const GET = async ({ url, params }) => {
  const categorySlug = params.category;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) {
    throw error(404, "Categoria não encontrada");
  }
  if (!category.pinterest_enabled) {
    throw error(403, "Feed do Pinterest não habilitado para esta categoria");
  }
  const posts = await getPostsForPinterestByCategory(categorySlug);
  const settings = await getSettings();
  const siteTitle = settings.site_title || "Blog";
  settings.site_description || "";
  const siteURL = (settings.site_url || url.origin).replace(/\/$/, "");
  const feedTitle = `${siteTitle} - ${category.name}`;
  const feedDescription = category.description || `Posts da categoria ${category.name}`;
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(feedTitle)}</title>
  <description>${escapeXml(feedDescription)}</description>
  <link>${siteURL}/category/${categorySlug}</link>
  <atom:link href="${siteURL}/pinterest.xml/${categorySlug}" rel="self" type="application/rss+xml" />
  <language>pt-br</language>
  <lastBuildDate>${(/* @__PURE__ */ new Date()).toUTCString()}</lastBuildDate>
  <generator>Tube Writer - SvelteKit Blog</generator>
  <category>${escapeXml(category.name)}</category>
  ${posts.map((post) => {
    const imageUrl = toAbsoluteUrl(post.pinterest_image || post.cover_image || "", siteURL);
    const sanitizedContent = sanitizeHtml(post.content || post.excerpt || post.title);
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.excerpt || post.title)}</description>
      <link>${siteURL}/post/${post.slug}</link>
      <guid isPermaLink="true">${siteURL}/post/${post.slug}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <category>${escapeXml(category.name)}</category>
      <content:encoded><![CDATA[${sanitizedContent}]]></content:encoded>
      ${imageUrl ? `
      <media:content url="${escapeXml(imageUrl)}" medium="image" width="1000" height="1500">
        <media:title type="plain">${escapeXml(post.title)}</media:title>
        <media:description type="plain">${escapeXml(post.excerpt || post.title)}</media:description>
      </media:content>
      <enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" />
      ` : ""}
    </item>`;
  }).join("")}
</channel>
</rss>`;
  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
};
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}
function toAbsoluteUrl(value, siteURL) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return `${siteURL}${value}`;
  return `${siteURL}/${value}`;
}

export { GET };
//# sourceMappingURL=_server.ts-waknrqyp.js.map
