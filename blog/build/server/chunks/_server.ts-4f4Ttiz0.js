import { j as json } from './index-BkmUvga9.js';
import { getSettings } from './database-BjMeOB2B.js';
import { t as trackRecommendationEvent } from './interest-engine-DkiIaEty.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const POST = async ({ request, locals, cookies, url }) => {
  try {
    const settings = await getSettings();
    if (settings.enable_recommendations === "0") {
      return json({ success: true, message: "Recommendations system is disabled" });
    }
    const { event, postId } = await request.json();
    if (!postId || !event) {
      return json({ success: false, error: "Missing parameters" }, { status: 400 });
    }
    await trackRecommendationEvent(event, Number(postId), locals, cookies, url);
    return json({ success: true });
  } catch (e) {
    console.error("Error tracking recommendation event:", e);
    return json({ success: false, error: e.message || "Internal server error" }, { status: 500 });
  }
};

export { POST };
//# sourceMappingURL=_server.ts-4f4Ttiz0.js.map
