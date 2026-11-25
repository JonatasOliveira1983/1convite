import { j as json } from './index-BkmUvga9.js';
import { L as LANDING_CLI_MANIFEST } from './landing-cli-manifest-CzRTn1Jl.js';
import { r as requireCLIToken } from './auth-0IKf-_gf.js';
import './database-GQg0oTqt.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const GET = async ({ request, getClientAddress }) => {
  const authError = await requireCLIToken(request, getClientAddress());
  if (authError) return authError;
  return json(LANDING_CLI_MANIFEST, {
    headers: { "cache-control": "private, max-age=300" }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-4qT0OJ1U.js.map
