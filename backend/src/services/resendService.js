/**
 * Serviço de envio de e-mails transacionais via Resend (https://api.resend.com/emails).
 */

function getResendConfig() {
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const fromEmail = (process.env.RESEND_FROM_EMAIL || '1Convite <noreply@1convite.com.br>').trim();
  const replyTo = (process.env.RESEND_REPLY_TO || '').trim();
  return { apiKey, fromEmail, replyTo };
}

export function isResendConfigured() {
  return Boolean(getResendConfig().apiKey);
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendEmail({ to, subject, html, text }) {
  const { apiKey, fromEmail, replyTo } = getResendConfig();
  if (!apiKey) {
    console.warn('[RESEND] RESEND_API_KEY não configurado. E-mail não enviado para:', to);
    return { ok: false, skipped: true, reason: 'RESEND_API_KEY missing' };
  }

  const payload = {
    from: fromEmail,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  };
  if (text) payload.text = text;
  if (replyTo) payload.reply_to = replyTo;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('[RESEND] Erro ao enviar e-mail:', response.status, errText);
    return { ok: false, error: errText };
  }

  const result = await response.json();
  return { ok: true, id: result.id };
}

export async function sendWelcomeAndVouchersEmail({
  to,
  name,
  planName,
  vouchers = [],
  expiryDateStr = '',
  tempPassword = '',
  siteUrl = 'https://1convite.com.br',
}) {
  const safeName = escapeHtml(name || 'Irmão(ã)');
  const safePlan = escapeHtml(planName || 'Plano Premium 1Convite');
  const safeSite = escapeHtml(siteUrl.replace(/\/$/, ''));
  const appUrl = `${safeSite}/app`;
  const logoUrl = `${safeSite}/LOGOMARCA_DARK.png`;

  const vouchersHtml = vouchers
    .map(
      (code) => `
      <div style="background:linear-gradient(135deg,#18140d 0%,#0b0d14 60%,#1a1309 100%);border:1.5px solid #d97706;border-radius:14px;padding:18px 18px 16px;margin:12px 0;box-shadow:0 10px 26px rgba(0,0,0,0.45);">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
          <tr>
            <td align="left" valign="middle">
              <img src="${logoUrl}" alt="1Convite" height="20" style="display:block;height:20px;width:auto;" />
            </td>
            <td align="right" valign="middle">
              <span style="display:inline-block;background:rgba(250,204,21,0.14);border:1px solid rgba(250,204,21,0.45);color:#facc15;border-radius:999px;padding:3px 10px;font-size:10px;font-weight:800;letter-spacing:0.8px;">180 DIAS VIP</span>
            </td>
          </tr>
        </table>
        <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:17px;color:#fde68a;text-align:center;margin:4px 0 10px;">
          Você é Especial • Vale-Presente 1Convite
        </div>
        <div style="background:#09090b;border:1px dashed rgba(250,204,21,0.5);border-radius:10px;padding:11px 14px;text-align:center;margin-bottom:10px;">
          <span style="font-family:'Courier New',Courier,monospace;font-size:21px;font-weight:900;letter-spacing:2.5px;color:#facc15;">${escapeHtml(code)}</span>
        </div>
        <div style="text-align:center;">
          <a href="${appUrl}?vip=${encodeURIComponent(code)}" style="color:#fb923c;font-size:12px;font-weight:700;text-decoration:none;">
            Link direto para o convidado resgatar →
          </a>
        </div>
      </div>`
    )
    .join('');

  const credentialsHtml = tempPassword
    ? `
      <div style="background:#09090b;border:1px solid #27272a;border-radius:10px;padding:14px 16px;margin:14px 0;">
        <div style="font-size:13px;color:#a1a1aa;margin-bottom:6px;">Suas credenciais de acesso ao App:</div>
        <div style="font-size:14px;color:#e4e4e7;margin-bottom:4px;"><strong>E-mail:</strong> <span style="font-family:monospace;color:#34d399;">${escapeHtml(to)}</span></div>
        <div style="font-size:14px;color:#e4e4e7;"><strong>Senha Temporária:</strong> <span style="font-family:monospace;color:#fb923c;font-weight:800;">${escapeHtml(tempPassword)}</span></div>
      </div>`
    : `
      <p style="margin:0 0 14px;color:#d4d4d8;font-size:14px;line-height:1.6;">
        Seu acesso VIP foi ativado na sua conta existente (<strong>${escapeHtml(to)}</strong>).
      </p>`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;background:#09090b;color:#fafafa;padding:32px 24px;border-radius:16px;border:1px solid #27272a;">
      <div style="text-align:center;margin-bottom:24px;">
        <img src="${logoUrl}" alt="1Convite" height="36" style="display:inline-block;height:36px;width:auto;margin-bottom:14px;" />
        <div>
          <span style="display:inline-block;background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.06em;">ACESSO VIP LIBERADO</span>
        </div>
        <h1 style="margin:14px 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:25px;color:#ffffff;">Bem-vindo(a) ao 1Convite, ${safeName}!</h1>
        <p style="margin:0;color:#a1a1aa;font-size:15px;">Sua assinatura <strong>${safePlan}</strong> foi confirmada com sucesso.${expiryDateStr ? ` Válida até <strong>${escapeHtml(expiryDateStr)}</strong>.` : ''}</p>
      </div>

      <div style="background:#121215;border:1px solid #27272a;border-radius:12px;padding:20px;margin-bottom:20px;">
        <h2 style="margin:0 0 8px;font-size:16px;color:#ffffff;">Como acessar o aplicativo (Desktop & Celular)</h2>
        ${credentialsHtml}
        <p style="margin:0 0 16px;color:#a1a1aa;font-size:13px;line-height:1.5;">
          Os seus 5 E-books Bônus em PDF, Bíblia Narrada, Café com Deus e Mentores Bíblicos já estão liberados na sua conta.
        </p>
        <div style="text-align:center;">
          <a href="${appUrl}" style="display:inline-block;background:#10b981;color:#052e16;font-weight:800;font-size:14px;padding:12px 24px;border-radius:999px;text-decoration:none;">Acessar 1Convite Agora</a>
        </div>
      </div>

      ${
        vouchers.length > 0
          ? `
      <div style="background:#121215;border:1px solid #27272a;border-radius:12px;padding:20px;margin-bottom:20px;">
        <h2 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#fde68a;">Seus Vales-Presente VIP (180 dias grátis cada)</h2>
        <p style="margin:0 0 12px;color:#a1a1aa;font-size:14px;line-height:1.5;">
          Compartilhe cada cartão abaixo com uma pessoa especial para abençoar a vida dela com 6 meses gratuitos:
        </p>
        ${vouchersHtml}
      </div>`
          : ''
      }

      <p style="text-align:center;color:#71717a;font-size:12px;margin:24px 0 0;">
        1Convite — A Palavra Viva no seu bolso. Se precisar de ajuda, responda a este e-mail.
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Acesso liberado! Seu ${planName} + Vales-Presente VIP (1Convite)`,
    html,
  });
}

export async function sendPixPendingEmail({
  to,
  name,
  planName,
  invoiceUrl = '',
  valueReais = 0,
  siteUrl = 'https://1convite.com.br',
}) {
  if (!to || !String(to).includes('@')) {
    return { ok: false, skipped: true, reason: 'Contato não é e-mail' };
  }
  const safeName = escapeHtml(name || 'Irmão(ã)');
  const safePlan = escapeHtml(planName || '1Convite');
  const safeUrl = escapeHtml(invoiceUrl || 'https://1convite.com.br/#planos');
  const logoUrl = `${escapeHtml(siteUrl.replace(/\/$/, ''))}/LOGOMARCA_DARK.png`;
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;background:#09090b;color:#fafafa;padding:28px 22px;border-radius:14px;border:1px solid #27272a;">
      <div style="text-align:center;margin-bottom:14px;">
        <img src="${logoUrl}" alt="1Convite" height="32" style="display:inline-block;height:32px;width:auto;" />
      </div>
      <span style="display:inline-block;background:rgba(249,115,22,0.16);color:#fb923c;border:1px solid rgba(249,115,22,0.35);padding:5px 12px;border-radius:999px;font-size:11px;font-weight:700;">PAGAMENTO PENDENTE</span>
      <h2 style="margin:14px 0 10px;font-family:Georgia,'Times New Roman',serif;color:#ffffff;">Finalize seu acesso ao 1Convite, ${safeName}</h2>
      <p style="color:#d4d4d8;font-size:14px;line-height:1.6;">
        Seu pedido do <strong>${safePlan}</strong> (R$ ${Number(valueReais).toFixed(2).replace('.', ',')}) foi gerado com sucesso. Assim que o pagamento for confirmado, enviaremos suas credenciais e Vales-Presente VIP automaticamente.
      </p>
      <div style="text-align:center;margin:22px 0;">
        <a href="${safeUrl}" style="display:inline-block;background:#f97316;color:#09090b;font-weight:800;padding:12px 24px;border-radius:999px;text-decoration:none;">Abrir Fatura Segura Asaas</a>
      </div>
    </div>
  `;
  return sendEmail({
    to,
    subject: `Seu pedido 1Convite (${planName}) está aguardando pagamento`,
    html,
  });
}

export async function sendLeadWelcomeEmail({ to, name, siteUrl = 'https://1convite.com.br' }) {
  if (!to || !String(to).includes('@')) {
    return { ok: false, skipped: true, reason: 'Contato não é e-mail' };
  }
  const safeName = escapeHtml(name || 'Visitante');
  const safeSite = escapeHtml(siteUrl.replace(/\/$/, ''));
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;background:#09090b;color:#fafafa;padding:28px 22px;border-radius:14px;border:1px solid #27272a;">
      <h2 style="margin:0 0 10px;color:#ffffff;">Paz seja contigo, ${safeName}!</h2>
      <p style="color:#d4d4d8;font-size:15px;line-height:1.6;">
        Recebemos seu cadastro no <strong>1Convite</strong>. Você já pode experimentar a Bíblia Sagrada ACF narrada, meditações diárias e muito mais.
      </p>
      <div style="text-align:center;margin:22px 0;">
        <a href="${safeSite}" style="display:inline-block;background:#f97316;color:#ffffff;font-weight:700;padding:12px 24px;border-radius:999px;text-decoration:none;">Conhecer o 1Convite</a>
      </div>
    </div>
  `;
  return sendEmail({
    to,
    subject: 'Sua jornada no 1Convite começou!',
    html,
  });
}
