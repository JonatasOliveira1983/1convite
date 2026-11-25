import { j as json } from './index-BkmUvga9.js';
import { getAllCategories } from './database-GQg0oTqt.js';
import { r as requireCLIToken } from './auth-0IKf-_gf.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const GET = async ({ request, getClientAddress }) => {
  const authError = await requireCLIToken(request, getClientAddress());
  if (authError) return authError;
  const categories = await getAllCategories();
  return json({
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || null,
      pinterest_enabled: Boolean(c.pinterest_enabled),
      post_count: c.post_count || 0
    }))
  });
};

export { GET };
//# sourceMappingURL=_server.ts-CLcd1-ff.js.map
