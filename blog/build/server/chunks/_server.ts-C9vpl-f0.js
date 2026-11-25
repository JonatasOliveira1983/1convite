import { j as json } from './index-BkmUvga9.js';
import { getSettings, getUserInterests, countPosts } from './database-BjMeOB2B.js';
import { l as loadRecentlySeen, g as getHomeFeed, a as getRecommendationReason } from './interest-engine-DkiIaEty.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const GET = async ({ url, locals, cookies }) => {
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const search = url.searchParams.get("q") || "";
  const limit = 7;
  const settings = await getSettings();
  const recommendationsEnabled = settings.enable_recommendations !== "0";
  let userInterests;
  let recentlySeen;
  if (recommendationsEnabled) {
    if (locals.user) {
      userInterests = await getUserInterests(locals.user.id);
    } else {
      const cookieVal = cookies.get("user_interests");
      if (cookieVal) {
        try {
          userInterests = JSON.parse(cookieVal);
        } catch {
        }
      }
    }
    recentlySeen = await loadRecentlySeen(locals, cookies);
  }
  const rawPosts = await getHomeFeed({
    page,
    limit,
    search,
    userInterests,
    recommendationsEnabled,
    recentlySeen
  });
  const posts = rawPosts.map((p) => ({
    ...p,
    recommendationReason: getRecommendationReason(p, userInterests)
  }));
  const totalPosts = await countPosts({ search });
  const totalPages = Math.ceil(totalPosts / limit);
  return json({
    posts,
    currentPage: page,
    totalPages
  });
};

export { GET };
//# sourceMappingURL=_server.ts-C9vpl-f0.js.map
