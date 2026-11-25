import { j as json } from './index-BkmUvga9.js';
import { validateCLIToken } from './database-GQg0oTqt.js';

const buckets = /* @__PURE__ */ new Map();
function getBucket(key) {
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }
  return bucket;
}
async function checkRateLimit(identifier, config) {
  const key = `${config.keyPrefix}:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;
  const bucket = getBucket(key);
  bucket.timestamps = bucket.timestamps.filter((t) => t > windowStart);
  const count = bucket.timestamps.length;
  if (count >= config.maxRequests) {
    const oldest2 = bucket.timestamps[0];
    const resetAt2 = oldest2 ? oldest2 + config.windowMs : now + config.windowMs;
    return { allowed: false, remaining: 0, resetAt: resetAt2, limit: config.maxRequests };
  }
  bucket.timestamps.push(now);
  const remaining = config.maxRequests - bucket.timestamps.length;
  const oldest = bucket.timestamps[0];
  const resetAt = oldest ? oldest + config.windowMs : now + config.windowMs;
  return { allowed: true, remaining, resetAt, limit: config.maxRequests };
}
const CLI_RATE_LIMIT = {
  windowMs: 60 * 1e3,
  maxRequests: 120,
  keyPrefix: "rl:cli",
  message: "Muitas requisições à API CLI. Aguarde um minuto."
};
async function requireCLIToken(request, identifier = "unknown") {
  const rateLimit = await checkRateLimit(identifier, CLI_RATE_LIMIT);
  const headers = {
    "X-RateLimit-Limit": String(rateLimit.limit),
    "X-RateLimit-Remaining": String(rateLimit.remaining),
    "X-RateLimit-Reset": new Date(rateLimit.resetAt).toISOString()
  };
  if (!rateLimit.allowed) {
    return json({ error: CLI_RATE_LIMIT.message }, { status: 429, headers });
  }
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return json(
      { error: "Authorization header missing. Use: Authorization: Bearer <token>" },
      { status: 401, headers }
    );
  }
  const token = auth.slice(7).trim();
  if (!await validateCLIToken(token)) {
    return json(
      { error: "Token inválido ou expirado. Regenere o token no painel admin." },
      { status: 403, headers }
    );
  }
  return null;
}

export { requireCLIToken as r };
//# sourceMappingURL=auth-0IKf-_gf.js.map
