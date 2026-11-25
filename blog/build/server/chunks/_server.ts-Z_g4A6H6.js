import { j as json } from './index-BkmUvga9.js';
import { subscribeToNewsletter } from './database-GQg0oTqt.js';
import './shared-server-DaWdgxVh.js';
import 'crypto';

const POST = async ({ request }) => {
  try {
    const { email, name } = await request.json();
    if (!email) {
      return json({ success: false, error: "E-mail é obrigatório" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ success: false, error: "E-mail inválido" }, { status: 400 });
    }
    await subscribeToNewsletter(email, name);
    return json({ success: true, message: "Inscrição realizada com sucesso" });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return json({ success: false, error: "Erro ao processar inscrição" }, { status: 500 });
  }
};

export { POST };
//# sourceMappingURL=_server.ts-Z_g4A6H6.js.map
