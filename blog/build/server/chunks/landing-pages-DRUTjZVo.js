import { a as sanitizeText, b as sanitizeHtml } from './sanitize-beQ_Z907.js';

const LANDING_BLOCK_TYPES = /* @__PURE__ */ new Set([
  "section",
  "container",
  "columns",
  "column",
  "text",
  "image",
  "button",
  "video",
  "divider",
  "spacer",
  "html",
  "cta",
  "testimonial",
  "pricing",
  "faq",
  "hero",
  "product-showcase",
  "posts-grid",
  "trust-bar"
]);
const MAX_BLOCKS = 250;
const MAX_DEPTH = 8;
function cleanValue(value, depth = 0) {
  if (depth > 6) return void 0;
  if (typeof value === "string") return sanitizeText(value).slice(0, 2e4);
  if (typeof value === "number" || typeof value === "boolean" || value === null) return value;
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => cleanValue(item, depth + 1));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).slice(0, 100).map(([key, item]) => [sanitizeText(key).slice(0, 80), cleanValue(item, depth + 1)]).filter(([key, item]) => key && item !== void 0)
    );
  }
  return void 0;
}
function sanitizeLandingBlocks(input) {
  if (!Array.isArray(input)) throw new Error("content deve ser uma lista de blocos.");
  let count = 0;
  function walk(raw, depth) {
    if (!raw || typeof raw !== "object") throw new Error("Bloco inválido.");
    if (depth > MAX_DEPTH) throw new Error(`A árvore excede ${MAX_DEPTH} níveis.`);
    if (++count > MAX_BLOCKS) throw new Error(`A landing excede ${MAX_BLOCKS} blocos.`);
    const block = raw;
    const type = String(block.type || "");
    if (!LANDING_BLOCK_TYPES.has(type)) throw new Error(`Tipo de bloco não permitido: ${type || "(vazio)"}.`);
    const result = {
      id: sanitizeText(String(block.id || "")).slice(0, 100) || `block-${count}`,
      type
    };
    if (typeof block.content === "string") {
      result.content = type === "text" || type === "html" ? sanitizeHtml(block.content).slice(0, 25e4) : sanitizeText(block.content).slice(0, 2e4);
    }
    if (block.styles && typeof block.styles === "object") result.styles = cleanValue(block.styles);
    if (block.properties && typeof block.properties === "object") result.properties = cleanValue(block.properties);
    if (block.children !== void 0) {
      if (!Array.isArray(block.children)) throw new Error("children deve ser uma lista.");
      result.children = block.children.map((child) => walk(child, depth + 1));
    }
    return result;
  }
  return input.map((block) => walk(block, 0));
}
function parseAndSanitizeLandingContent(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("O JSON dos blocos é inválido.");
  }
  return JSON.stringify(sanitizeLandingBlocks(parsed));
}

export { parseAndSanitizeLandingContent as p, sanitizeLandingBlocks as s };
//# sourceMappingURL=landing-pages-DRUTjZVo.js.map
