import { j as json } from './index-BkmUvga9.js';
import { searchPosts } from './database-BjMeOB2B.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const GET = async ({ url }) => {
  try {
    const q = url.searchParams.get("q") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    if (!q || q.trim().length < 2) {
      return json({
        error: "Query deve ter pelo menos 2 caracteres"
      }, { status: 400 });
    }
    const results = await searchPosts(q.trim(), page, limit);
    return json({
      query: q,
      ...results
    });
  } catch (error) {
    console.error("Search API error:", error);
    return json({ error: "Erro na busca" }, { status: 500 });
  }
};

export { GET };
//# sourceMappingURL=_server.ts-C-kSs3L6.js.map
