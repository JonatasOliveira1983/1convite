import { j as json } from './index-BkmUvga9.js';
import { getAllProducts, getLandingBuilderPosts } from './database-BjMeOB2B.js';
import { r as requireCLIToken } from './auth-LehgbKdd.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const GET = async ({ request, getClientAddress }) => {
  const authError = await requireCLIToken(request, getClientAddress());
  if (authError) return authError;
  try {
    const [products, posts] = await Promise.all([getAllProducts(), getLandingBuilderPosts()]);
    return json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description || "",
        price_cents: p.price_cents,
        image_url: p.image_url || "",
        href: `/product/${p.slug}`
      })),
      posts: posts.map((p) => ({ ...p, href: `/post/${p.slug}` }))
    });
  } catch (error) {
    console.error("[CLI LANDINGS] Failed to load resources:", error);
    return json({ error: "Falha ao carregar produtos e posts." }, { status: 500 });
  }
};

export { GET };
//# sourceMappingURL=_server.ts-DbXOg9zj.js.map
