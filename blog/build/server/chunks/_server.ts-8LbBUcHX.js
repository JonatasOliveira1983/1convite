import { getPinterestEnabledCategories, getSettings } from './database-BjMeOB2B.js';
import { j as json } from './index-BkmUvga9.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const GET = async ({ url }) => {
  const categories = await getPinterestEnabledCategories();
  const settings = await getSettings();
  const siteURL = (settings.site_url || url.origin).replace(/\/$/, "");
  const feeds = categories.map((category) => ({
    name: category.name,
    slug: category.slug,
    description: category.description || `Feed da categoria ${category.name}`,
    feedUrl: `${siteURL}/pinterest_${category.slug}.xml`,
    legacyFeedUrl: `${siteURL}/pinterest.xml/${category.slug}`,
    categoryUrl: `${siteURL}/category/${category.slug}`
  }));
  return json({
    feeds,
    mainFeedUrl: `${siteURL}/pinterest.xml`,
    totalCategories: feeds.length
  });
};

export { GET };
//# sourceMappingURL=_server.ts-8LbBUcHX.js.map
