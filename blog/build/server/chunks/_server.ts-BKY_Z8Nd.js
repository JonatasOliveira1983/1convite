import { j as json } from './index-BkmUvga9.js';
import { getAllCategories } from './database-BjMeOB2B.js';
import { r as requireCLIToken } from './auth-LehgbKdd.js';
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
//# sourceMappingURL=_server.ts-BKY_Z8Nd.js.map
