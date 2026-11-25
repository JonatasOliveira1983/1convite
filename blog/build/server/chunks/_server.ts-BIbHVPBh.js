import { j as json } from './index-BkmUvga9.js';
import { regenerateCLIToken } from './database-BjMeOB2B.js';
import { validateSession } from './auth2-B20dP8z5.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';
import 'bcryptjs';

const POST = async ({ cookies }) => {
  const sessionId = cookies.get("admin_session");
  if (!sessionId) {
    return json({ error: "Não autenticado" }, { status: 401 });
  }
  const username = await validateSession(sessionId);
  if (!username) {
    return json({ error: "Sessão expirada" }, { status: 401 });
  }
  const token = await regenerateCLIToken();
  return json({ success: true, token });
};

export { POST };
//# sourceMappingURL=_server.ts-BIbHVPBh.js.map
