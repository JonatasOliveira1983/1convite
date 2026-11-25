import 'isomorphic-dompurify';
import { z } from 'zod';
import 'bcryptjs';
import './index-BkmUvga9.js';

({
  /**
   * Post validation schema
   */
  post: z.object({
    title: z.string().min(1, "Title is required").max(500, "Title too long"),
    slug: z.string().min(1, "Slug is required").max(200, "Slug too long").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().max(500, "Excerpt too long").optional(),
    cover_image: z.string().url("Invalid image URL").optional().or(z.literal("")),
    status: z.enum(["draft", "pending", "approved", "published", "archived"]),
    is_premium: z.boolean().optional().default(false),
    pinterest_enabled: z.boolean().optional().default(false),
    pinterest_image: z.string().url("Invalid Pinterest image URL").optional().or(z.literal("")),
    seo_title: z.string().max(70, "SEO title too long (max 70 characters)").optional(),
    seo_description: z.string().max(160, "SEO description too long (max 160 characters)").optional(),
    seo_keywords: z.string().optional(),
    category_ids: z.array(z.number().int().positive()).optional(),
    scheduled_at: z.string().datetime().optional().or(z.literal(""))
  }),
  /**
   * User validation schema
   */
  user: z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(100, "Username too long").regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username must contain only letters, numbers, underscores, and hyphens"
    ),
    email: z.string().email("Invalid email address").max(255, "Email too long"),
    password: z.string().min(12, "Password must be at least 12 characters").max(128, "Password too long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
    role: z.enum(["super_admin", "admin", "editor", "author"]).optional()
  }),
  /**
   * User update schema (password optional)
   */
  userUpdate: z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(100, "Username too long").regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username must contain only letters, numbers, underscores, and hyphens"
    ).optional(),
    email: z.string().email("Invalid email address").max(255, "Email too long").optional(),
    password: z.string().min(12, "Password must be at least 12 characters").max(128, "Password too long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ).optional(),
    role: z.enum(["super_admin", "admin", "editor", "author"]).optional()
  }),
  /**
   * Category validation schema
   */
  category: z.object({
    name: z.string().min(1, "Category name is required").max(100, "Category name too long"),
    slug: z.string().min(1, "Slug is required").max(100, "Slug too long").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    description: z.string().max(500, "Description too long").optional(),
    parent_id: z.number().int().positive().optional().or(z.null())
  }),
  /**
   * API key validation schema
   */
  apiKey: z.object({
    name: z.string().min(1, "API key name is required").max(100, "Name too long"),
    permissions: z.array(z.string()).optional().default([]),
    rate_limit: z.number().int().min(1, "Rate limit must be at least 1").max(1e4, "Rate limit too high").optional().default(1e3),
    expires_at: z.string().datetime().optional().or(z.null())
  }),
  /**
   * Settings validation schema
   */
  settings: z.object({
    key: z.string().min(1, "Setting key is required").max(100, "Key too long").regex(/^[a-z0-9_]+$/, "Key must contain only lowercase letters, numbers, and underscores"),
    value: z.string(),
    type: z.enum(["string", "number", "boolean", "json"]).optional().default("string")
  }),
  /**
   * Ad validation schema
   */
  ad: z.object({
    name: z.string().min(1, "Ad name is required").max(255, "Name too long"),
    placement: z.enum(["sidebar", "home_middle", "post_inline", "in_article"]),
    type: z.enum(["html", "image", "text", "native"]),
    content: z.string().optional(),
    image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
    link_url: z.string().url("Invalid link URL").optional().or(z.literal("")),
    is_active: z.boolean().optional().default(true),
    weight: z.number().int().min(1).max(100).optional().default(1)
  }),
  /**
   * Login validation schema
   */
  login: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
  }),
  /**
   * Newsletter subscription schema
   */
  newsletter: z.object({
    email: z.string().email("Invalid email address").max(255, "Email too long")
  })
});
function validateFileUpload(file, options = {}) {
  const maxSize = options.maxSize || 10 * 1024 * 1024;
  const allowedTypes = options.allowedTypes || [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml"
  ];
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`
    };
  }
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`
    };
  }
  if (options.allowedExtensions) {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !options.allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File extension .${extension} is not allowed. Allowed extensions: ${options.allowedExtensions.join(", ")}`
      };
    }
  }
  return { valid: true };
}
function generateSafeFilename(originalFilename) {
  const extension = originalFilename.split(".").pop()?.toLowerCase() || "";
  const randomName = crypto.randomUUID();
  return extension ? `${randomName}.${extension}` : randomName;
}
async function query(sql, params = []) {
  return [];
}
async function cleanExpiredSessions() {
  const now = Date.now();
  await query("DELETE FROM sessions WHERE expires_at < $1", [now]);
}
if (typeof setInterval !== "undefined") {
  setInterval(cleanExpiredSessions, 30 * 60 * 1e3);
}

export { generateSafeFilename as g, validateFileUpload as v };
//# sourceMappingURL=auth-enhanced-Di8gdTaW.js.map
