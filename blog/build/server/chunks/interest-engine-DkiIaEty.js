import { getUserSeenPosts, getAllPosts, getPublishedFeedCandidates, getPostById, getCategoriesByPostId, incrementCollaborativeRelation, incrementUserInterest, upsertUserSeenPost } from './database-BjMeOB2B.js';

const SEEN_COOLDOWN_MS = 48 * 60 * 60 * 1e3;
const SEEN_COOKIE = "recently_seen_posts";
const SEEN_COOKIE_MAX_ENTRIES = 80;
const SEEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 14;
function parseSeenCookie(raw) {
  const map = /* @__PURE__ */ new Map();
  if (!raw) return map;
  for (const part of raw.split(",")) {
    const [idStr, tsStr] = part.split(":");
    const id = Number(idStr);
    const sec = Number(tsStr);
    if (!id || !sec) continue;
    map.set(id, sec * 1e3);
  }
  return map;
}
function serializeSeenCookie(map) {
  const now = Date.now();
  const alive = Array.from(map.entries()).filter(([, ts]) => now - ts < SEEN_COOLDOWN_MS * 2).sort((a, b) => b[1] - a[1]).slice(0, SEEN_COOKIE_MAX_ENTRIES);
  return alive.map(([id, ts]) => `${id}:${Math.floor(ts / 1e3)}`).join(",");
}
async function recordPostSeen(postId, locals, cookies, url) {
  if (!postId) return;
  const now = Date.now();
  if (locals?.user?.id) {
    await upsertUserSeenPost(locals.user.id, postId, now);
    return;
  }
  const map = parseSeenCookie(cookies.get(SEEN_COOKIE));
  map.set(postId, now);
  const value = serializeSeenCookie(map);
  if (!value) return;
  cookies.set(SEEN_COOKIE, value, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    maxAge: SEEN_COOKIE_MAX_AGE,
    secure: url.protocol === "https:"
  });
}
async function loadRecentlySeen(locals, cookies, cooldownMs = SEEN_COOLDOWN_MS) {
  if (locals?.user?.id) {
    return getUserSeenPosts(locals.user.id, cooldownMs);
  }
  const map = parseSeenCookie(cookies.get(SEEN_COOKIE));
  const now = Date.now();
  const active = /* @__PURE__ */ new Map();
  for (const [id, ts] of map) {
    if (now - ts < cooldownMs) active.set(id, ts);
  }
  return active;
}
async function trackRecommendationEvent(event, postId, locals, cookies, url) {
  let points = 0;
  if (event === "view") points = 1;
  else if (event === "scroll_50") points = 3;
  else if (event === "scroll_100") points = 5;
  else if (event === "time_3m") points = 3;
  else if (event === "share") points = 10;
  if (points === 0) return;
  const post = await getPostById(postId);
  if (!post) return;
  const postCategories = await getCategoriesByPostId(postId);
  const categories = postCategories.map((c) => c.name);
  const tags = post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  if (event === "view") {
    const lastViewedId = cookies.get("last_viewed_post_id");
    if (lastViewedId) {
      const fromId = Number(lastViewedId);
      if (!isNaN(fromId) && fromId !== postId) {
        await incrementCollaborativeRelation(fromId, postId);
      }
    }
    cookies.set("last_viewed_post_id", String(postId), {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 60,
      secure: url.protocol === "https:"
    });
    await recordPostSeen(postId, locals, cookies, url);
  }
  if (locals?.user) {
    const userId = locals.user.id;
    for (const cat of categories) {
      await incrementUserInterest(userId, "category", cat, points);
    }
    for (const tag of tags) {
      await incrementUserInterest(userId, "tag", tag, points);
    }
  } else {
    let interests = { categories: {}, tags: {} };
    const cookieVal = cookies.get("user_interests");
    if (cookieVal) {
      try {
        interests = JSON.parse(cookieVal);
      } catch {
      }
    }
    if (!interests.categories) interests.categories = {};
    if (!interests.tags) interests.tags = {};
    for (const cat of categories) {
      interests.categories[cat] = (interests.categories[cat] || 0) + points;
    }
    for (const tag of tags) {
      interests.tags[tag] = (interests.tags[tag] || 0) + points;
    }
    cookies.set("user_interests", JSON.stringify(interests), {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      secure: url.protocol === "https:"
    });
  }
}
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function seededShuffle(items, seed) {
  const arr = items.slice();
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = Math.imul(s, 1664525) + 1013904223 >>> 0;
    const j = s % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
function daysSince(dateStr) {
  if (!dateStr) return 999;
  const t = new Date(dateStr).getTime();
  if (Number.isNaN(t)) return 999;
  return Math.max(0, (Date.now() - t) / (1e3 * 60 * 60 * 24));
}
function parseList(value) {
  if (!value) return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}
function cappedInterest(raw) {
  if (raw <= 0) return 0;
  return Math.min(12, Math.log2(1 + raw));
}
function interestMatchScore(post, interests) {
  if (!interests) return 0;
  const cats = interests.categories || {};
  const tags = interests.tags || {};
  let score = 0;
  for (const cat of parseList(post.categories)) {
    score += cappedInterest(cats[cat] || 0) * 2;
  }
  for (const tag of parseList(post.tags)) {
    score += cappedInterest(tags[tag] || 0) * 1.5;
  }
  return score;
}
function freshnessScore(post) {
  const d = daysSince(post.created_at);
  if (d <= 1) return 20;
  if (d <= 3) return 14;
  if (d <= 7) return 9;
  if (d <= 14) return 5;
  if (d <= 30) return 2;
  return 0;
}
function topInterestNames(map, limit = 3) {
  if (!map) return [];
  return Object.entries(map).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([name]) => name);
}
function primaryCategory(post) {
  return parseList(post.categories)[0] || `__none_${post.id}`;
}
function applySeenCooldown(mixed, recentlySeen, cooldownMs = SEEN_COOLDOWN_MS) {
  if (!recentlySeen?.size || !mixed.length) return mixed;
  const now = Date.now();
  const active = [];
  const suppressed = [];
  for (const post of mixed) {
    const seenAt = recentlySeen.get(post.id);
    if (seenAt != null && now - seenAt < cooldownMs) {
      suppressed.push({ post: { ...post, recentlySeen: true }, seenAt });
    } else {
      active.push(post);
    }
  }
  suppressed.sort((a, b) => a.seenAt - b.seenAt);
  if (active.length === 0) {
    return suppressed.map((s) => s.post);
  }
  return [...active, ...suppressed.map((s) => s.post)];
}
function buildMixedFeed(candidates, userInterests, seedKey) {
  if (!candidates.length) return [];
  const seed = hashSeed(seedKey);
  const hasInterests = !!userInterests && (Object.keys(userInterests.categories || {}).length > 0 || Object.keys(userInterests.tags || {}).length > 0);
  if (!hasInterests) {
    const sorted = candidates.slice().sort((a, b) => {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      return tb - ta;
    });
    const head = sorted.slice(0, Math.min(12, sorted.length));
    const tail = seededShuffle(sorted.slice(head.length), seed);
    return [...head, ...tail].map((p) => ({
      ...p,
      feedBucket: daysSince(p.created_at) <= 7 ? "fresh" : "discover"
    }));
  }
  const topCats = new Set(topInterestNames(userInterests.categories, 3));
  const topTags = new Set(topInterestNames(userInterests.tags, 5));
  const scored = candidates.map((post) => {
    const relevance = interestMatchScore(post, userInterests);
    const fresh = freshnessScore(post);
    const postCats = parseList(post.categories);
    const postTags = parseList(post.tags);
    const inBubble = postCats.some((c) => topCats.has(c)) || postTags.some((t) => topTags.has(t));
    return { post, relevance, fresh, inBubble };
  });
  const freshPool = scored.slice().sort((a, b) => {
    if (b.fresh !== a.fresh) return b.fresh - a.fresh;
    return new Date(b.post.created_at).getTime() - new Date(a.post.created_at).getTime();
  }).map((s) => s.post);
  const relevantPool = scored.filter((s) => s.relevance > 0).sort((a, b) => {
    const sa = a.relevance * 3 + a.fresh;
    const sb = b.relevance * 3 + b.fresh;
    if (sb !== sa) return sb - sa;
    return new Date(b.post.created_at).getTime() - new Date(a.post.created_at).getTime();
  }).map((s) => s.post);
  const discoverPool = seededShuffle(
    scored.filter((s) => !s.inBubble || s.relevance < 2).sort(
      (a, b) => new Date(b.post.created_at).getTime() - new Date(a.post.created_at).getTime()
    ).map((s) => s.post),
    seed ^ 2654435769
  );
  const allChrono = scored.slice().sort(
    (a, b) => new Date(b.post.created_at).getTime() - new Date(a.post.created_at).getTime()
  ).map((s) => s.post);
  const pattern = [
    "fresh",
    "relevant",
    "fresh",
    "discover",
    "relevant",
    "fresh",
    "relevant",
    "discover",
    "fresh",
    "relevant"
  ];
  const pointers = {
    fresh: 0,
    relevant: 0,
    discover: 0
  };
  const pools = {
    fresh: freshPool,
    relevant: relevantPool.length ? relevantPool : allChrono,
    discover: discoverPool.length ? discoverPool : allChrono
  };
  const used = /* @__PURE__ */ new Set();
  const result = [];
  let lastCategory = null;
  let patternIdx = 0;
  let safety = 0;
  const maxSafety = candidates.length * 4;
  const takeNext = (bucket, respectDiversity) => {
    const pool = pools[bucket];
    while (pointers[bucket] < pool.length) {
      const post = pool[pointers[bucket]++];
      if (used.has(post.id)) continue;
      const cat = primaryCategory(post);
      if (respectDiversity && lastCategory && cat === lastCategory) {
        for (let k = pointers[bucket]; k < Math.min(pool.length, pointers[bucket] + 6); k++) {
          const alt = pool[k];
          if (!used.has(alt.id) && primaryCategory(alt) !== lastCategory) {
            pool[k] = post;
            pool[pointers[bucket] - 1] = alt;
            used.add(alt.id);
            return { ...alt, feedBucket: bucket };
          }
        }
      }
      used.add(post.id);
      return { ...post, feedBucket: bucket };
    }
    return null;
  };
  while (result.length < candidates.length && safety < maxSafety) {
    safety++;
    const preferred = pattern[patternIdx % pattern.length];
    patternIdx++;
    let picked = takeNext(preferred, true) || takeNext("fresh", true) || takeNext("relevant", true) || takeNext("discover", false);
    if (!picked) {
      for (const p of allChrono) {
        if (!used.has(p.id)) {
          picked = { ...p, feedBucket: "fresh" };
          used.add(p.id);
          break;
        }
      }
    }
    if (!picked) break;
    lastCategory = primaryCategory(picked);
    result.push(picked);
  }
  return result;
}
async function getHomeFeed(options) {
  const page = options.page || 1;
  const limit = options.limit || 7;
  const search = options.search?.trim() || "";
  const categorySlug = options.categorySlug;
  if (search || categorySlug) {
    const posts = await getAllPosts({
      page,
      limit,
      search: search || void 0,
      categorySlug
    });
    return posts;
  }
  if (!options.recommendationsEnabled) {
    const posts = await getAllPosts({ page, limit });
    return posts;
  }
  const candidates = await getPublishedFeedCandidates(2e3);
  const dayKey = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const interestKey = options.userInterests ? Object.entries({
    ...options.userInterests.categories || {},
    ...options.userInterests.tags || {}
  }).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${Math.floor(Number(v))}`).join("|") : "anon";
  let mixed = buildMixedFeed(candidates, options.userInterests, `${dayKey}|${interestKey}`);
  mixed = applySeenCooldown(mixed, options.recentlySeen, SEEN_COOLDOWN_MS);
  const offset = (page - 1) * limit;
  return mixed.slice(offset, offset + limit);
}
function getRecommendationReason(post, userInterests) {
  if (post.isCollaborative) {
    return "👥 Outros leitores também leram";
  }
  if (post.recentlySeen) {
    return null;
  }
  if (post.feedBucket === "discover") {
    return "✨ Descoberta para você";
  }
  if (post.feedBucket === "fresh") {
    const d = daysSince(post.created_at);
    if (d <= 3) return "🔥 Novidade";
    if (d <= 14) return "🆕 Recente";
  }
  if (!userInterests) {
    if (post.created_at && daysSince(post.created_at) <= 3) {
      return "🔥 Novidade";
    }
    return null;
  }
  const categories = userInterests.categories || {};
  const tags = userInterests.tags || {};
  if (post.feedBucket === "relevant" || !post.feedBucket) {
    if (post.tags) {
      const postTags = parseList(post.tags);
      let maxTag = "";
      let maxScore = 0;
      for (const tag of postTags) {
        const score = tags[tag] || 0;
        if (score > maxScore) {
          maxScore = score;
          maxTag = tag;
        }
      }
      if (maxScore >= 5) {
        return `🏷️ Tema que você acompanha: ${maxTag}`;
      }
    }
    if (post.categories) {
      const postCats = parseList(post.categories);
      let maxCat = "";
      let maxScore = 0;
      for (const cat of postCats) {
        const score = categories[cat] || 0;
        if (score > maxScore) {
          maxScore = score;
          maxCat = cat;
        }
      }
      if (maxScore >= 5) {
        return `💡 Relevante em ${maxCat}`;
      }
    }
  }
  if (post.created_at && daysSince(post.created_at) <= 3) {
    return "🔥 Novidade";
  }
  if (post.feedBucket === "relevant") {
    return "💡 Recomendado para você";
  }
  return null;
}

export { getRecommendationReason as a, getHomeFeed as g, loadRecentlySeen as l, parseSeenCookie as p, trackRecommendationEvent as t };
//# sourceMappingURL=interest-engine-DkiIaEty.js.map
