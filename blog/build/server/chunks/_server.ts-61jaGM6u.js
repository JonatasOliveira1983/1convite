import { j as json } from './index-BkmUvga9.js';

const contacts = [];
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    if (!name || name.trim().length < 2) {
      return json({ error: "Nome é obrigatório (mínimo 2 caracteres)" }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return json({ error: "E-mail inválido" }, { status: 400 });
    }
    if (!subject) {
      return json({ error: "Assunto é obrigatório" }, { status: 400 });
    }
    if (!message || message.trim().length < 10) {
      return json({ error: "Mensagem é obrigatória (mínimo 10 caracteres)" }, { status: 400 });
    }
    const contact = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject.trim(),
      message: message.trim(),
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    contacts.push(contact);
    console.log("New contact:", contact);
    return json({
      success: true,
      message: "Mensagem enviada com sucesso!",
      id: contact.id
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return json({ error: "Erro ao processar solicitação" }, { status: 500 });
  }
};
const GET = async () => {
  return json({ contacts: contacts.slice(-100) });
};
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export { GET, POST };
//# sourceMappingURL=_server.ts-61jaGM6u.js.map
