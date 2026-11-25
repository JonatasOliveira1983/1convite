import { getSettings } from './database-BjMeOB2B.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const GET = async () => {
  const settings = await getSettings();
  const adsTxt = settings.ads_txt || "";
  return new Response(adsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate"
    }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-1bkjI4zA.js.map
