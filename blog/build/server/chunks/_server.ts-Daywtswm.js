import { j as json } from './index-BkmUvga9.js';
import { getLandingPagesPage, getLandingPageBySlug, createLandingPage, updateLandingPage, deleteLandingPage } from './database-GQg0oTqt.js';
import { s as sanitizeLandingBlocks } from './landing-pages-DRUTjZVo.js';
import { c as slugify } from './sanitize-beQ_Z907.js';
import { r as requireCLIToken } from './auth-0IKf-_gf.js';
import { l as listLandingPagesQuerySchema, z as zodError, a as createLandingPageSchema } from './validation-BLmbvSSn.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'jsdom';
import 'zod';

const GET = async ({ request, url, getClientAddress }) => {
  const authError = await requireCLIToken(request, getClientAddress());
  if (authError) return authError;
  const parsed = listLandingPagesQuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return json(zodError(parsed.error), { status: 400 });
  try {
    const result = await getLandingPagesPage(parsed.data);
    return json({
      landing_pages: result.pages.map(({ content, settings, ...page }) => ({
        ...page,
        block_count: JSON.parse(content || "[]").length
      })),
      pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages }
    });
  } catch (error) {
    console.error("[CLI LANDINGS] Failed to list:", error);
    return json({ error: "Falha ao listar landing pages." }, { status: 500 });
  }
};
const POST = async ({ request, getClientAddress }) => {
  const authError = await requireCLIToken(request, getClientAddress());
  if (authError) return authError;
  let raw;
  try {
    raw = await request.json();
  } catch {
    return json({ error: "Body JSON inválido." }, { status: 400 });
  }
  const parsed = createLandingPageSchema.safeParse(raw);
  if (!parsed.success) return json(zodError(parsed.error), { status: 400 });
  const body = parsed.data;
  const slug = slugify(body.slug || body.title);
  if (!slug) return json({ error: "Não foi possível gerar um slug válido." }, { status: 400 });
  try {
    if (await getLandingPageBySlug(slug)) return json({ error: "Este slug já está em uso." }, { status: 409 });
    const blocks = sanitizeLandingBlocks(body.blocks);
    const id = await createLandingPage(body.title, slug);
    try {
      await updateLandingPage(
        id,
        body.title,
        slug,
        body.status || "draft",
        JSON.stringify(blocks),
        JSON.stringify(body.settings || {})
      );
    } catch (error) {
      await deleteLandingPage(id).catch(() => void 0);
      throw error;
    }
    return json({ success: true, id, slug, status: body.status || "draft", edit_url: `/admin/landing-pages/${id}`, public_url: `/p/${slug}` }, { status: 201 });
  } catch (error) {
    console.error("[CLI LANDINGS] Failed to create:", error);
    return json({ error: error instanceof Error ? error.message : "Falha ao criar landing page." }, { status: 500 });
  }
};

export { GET, POST };
//# sourceMappingURL=_server.ts-Daywtswm.js.map
