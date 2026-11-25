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
  siteUrl = 'https://1convite.com.br',
}) {
  const safeName = escapeHtml(name || 'Irmão(ã)');
  const safePlan = escapeHtml(planName || 'Plano Premium 1Convite');
  const safeSite = escapeHtml(siteUrl.replace(/\/$/, ''));

  const vouchersHtml = vouchers
    .map(
      (code) => `
      <div style="background:#18181b;border:1px solid #f97316;border-radius:10px;padding:12px 16px;margin:8px 0;text-align:center;">
        <span style="font-family:monospace;font-size:20px;font-weight:800;letter-spacing:2px;color:#fb923c;">${escapeHtml(code)}</span>
      </div>`
    )
    .join('');

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;background:#09090b;color:#fafafa;padding:32px 24px;border-radius:16px;border:1px solid #27272a;">
      <div style="text-align:center;margin-bottom:24px;">
        <span style="display:inline-block;background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.06em;">ACESSO VIP LIBERADO</span>
        <h1 style="margin:16px 0 8px;font-size:24px;color:#ffffff;">Bem-vindo(a) ao 1Convite, ${safeName}!</h1>
        <p style="margin:0;color:#a1a1aa;font-size:15px;">Sua assinatura <strong>${safePlan}</strong> foi confirmada com sucesso.${expiryDateStr ? ` Válida até <strong>${escapeHtml(expiryDateStr)}</strong>.` : ''}</p>
      </div>

      <div style="background:#121215;border:1px solid #27272a;border-radius:12px;padding:20px;margin-bottom:20px;">
        <h2 style="margin:0 0 8px;font-size:16px;color:#ffffff;">Como acessar o aplicativo</h2>
        <p style="margin:0 0 14px;color:#d4d4d8;font-size:14px;line-height:1.6;">
          Entre em <a href="${safeSite}" style="color:#34d399;text-decoration:none;font-weight:600;">${safeSite}</a> (ou no app Android) usando este mesmo e-mail: <strong>${escapeHtml(to)}</strong>.
        </p>
        <div style="text-align:center;">
          <a href="${safeSite}" style="display:inline-block;background:#10b981;color:#052e16;font-weight:800;font-size:14px;padding:12px 24px;border-radius:999px;text-decoration:none;">Acessar 1Convite Agora</a>
        </div>
      </div>

      ${
        vouchers.length > 0
          ? `
      <div style="background:#121215;border:1px solid #27272a;border-radius:12px;padding:20px;margin-bottom:20px;">
        <h2 style="margin:0 0 8px;font-size:16px;color:#ffffff;">Seus Códigos de Convite (180 dias grátis cada)</h2>
        <p style="margin:0 0 12px;color:#a1a1aa;font-size:14px;line-height:1.5;">
          Compartilhe cada código abaixo com uma pessoa especial para abençoar a vida dela com 6 meses gratuitos:
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
    subject: `Acesso liberado! Seu ${planName} + Códigos de Convite (1Convite)`,
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
