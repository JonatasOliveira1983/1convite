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

export function buildPixPendingEmailHtml({
  name,
  planName,
  invoiceUrl = '',
  valueReais = 0,
  siteUrl = 'https://1convite.com.br',
}) {
  const safeName = escapeHtml(name || 'Irmão(ã)');
  const safePlan = escapeHtml(planName || '1Convite');
  const safeUrl = escapeHtml(invoiceUrl || 'https://1convite.com.br/#planos');
  const logoUrl = `${escapeHtml(siteUrl.replace(/\/$/, ''))}/LOGOMARCA_DARK.png`;
  return `
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
  const html = buildPixPendingEmailHtml({ name, planName, invoiceUrl, valueReais, siteUrl });
  return sendEmail({
    to,
    subject: `Seu pedido 1Convite (${planName}) está aguardando pagamento`,
    html,
  });
}

export function buildLeadWelcomeEmailHtml({ name, siteUrl = 'https://1convite.com.br' }) {
  const safeName = escapeHtml(name || 'Visitante');
  const safeSite = escapeHtml(siteUrl.replace(/\/$/, ''));
  const logoUrl = `${safeSite}/LOGOMARCA_DARK.png`;
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;background:#09090b;color:#fafafa;padding:28px 22px;border-radius:14px;border:1px solid #27272a;">
      <div style="text-align:center;margin-bottom:14px;">
        <img src="${logoUrl}" alt="1Convite" height="32" style="display:inline-block;height:32px;width:auto;" />
      </div>
      <span style="display:inline-block;background:rgba(56,189,248,0.14);color:#38bdf8;border:1px solid rgba(56,189,248,0.3);padding:5px 12px;border-radius:999px;font-size:11px;font-weight:700;">BOAS-VINDAS</span>
      <h2 style="margin:14px 0 10px;font-family:Georgia,'Times New Roman',serif;color:#ffffff;">Paz seja contigo, ${safeName}!</h2>
      <p style="color:#d4d4d8;font-size:15px;line-height:1.6;">
        Recebemos seu cadastro no <strong>1Convite</strong>. Você já pode experimentar a Bíblia Sagrada ACF narrada, meditações diárias e estudos profundos da Palavra.
      </p>
      <div style="text-align:center;margin:22px 0;">
        <a href="${safeSite}/app" style="display:inline-block;background:#f97316;color:#09090b;font-weight:800;padding:12px 24px;border-radius:999px;text-decoration:none;">Acessar o 1Convite</a>
      </div>
      <p style="text-align:center;color:#71717a;font-size:12px;margin:20px 0 0;">
        1Convite — A Palavra Viva no seu bolso.
      </p>
    </div>
  `;
}

export async function sendLeadWelcomeEmail({ to, name, siteUrl = 'https://1convite.com.br' }) {
  if (!to || !String(to).includes('@')) {
    return { ok: false, skipped: true, reason: 'Contato não é e-mail' };
  }
  const html = buildLeadWelcomeEmailHtml({ name, siteUrl });
  return sendEmail({
    to,
    subject: 'Sua jornada no 1Convite começou!',
    html,
  });
}

export function buildPixReminderEmailHtml({
  name,
  planName,
  invoiceUrl = '',
  valueReais = 97,
  siteUrl = 'https://1convite.com.br',
}) {
  const safeName = escapeHtml(name || 'Irmão(ã)');
  const safePlan = escapeHtml(planName || 'Plano Popular — Edificação');
  const safeUrl = escapeHtml(invoiceUrl || `${siteUrl.replace(/\/$/, '')}/checkout`);
  const logoUrl = `${escapeHtml(siteUrl.replace(/\/$/, ''))}/LOGOMARCA_DARK.png`;
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;background:#09090b;color:#fafafa;padding:28px 22px;border-radius:14px;border:1px solid #27272a;">
      <div style="text-align:center;margin-bottom:14px;">
        <img src="${logoUrl}" alt="1Convite" height="32" style="display:inline-block;height:32px;width:auto;" />
      </div>
      <span style="display:inline-block;background:rgba(250,204,21,0.14);color:#facc15;border:1px solid rgba(250,204,21,0.35);padding:5px 12px;border-radius:999px;font-size:11px;font-weight:700;">LEMBRETE AMIGÁVEL</span>
      <h2 style="margin:14px 0 10px;font-family:Georgia,'Times New Roman',serif;color:#ffffff;">Seu acesso VIP ainda está reservado, ${safeName}</h2>
      <p style="color:#d4d4d8;font-size:14px;line-height:1.6;">
        Notamos que o PIX do seu <strong>${safePlan}</strong> (R$ ${Number(valueReais).toFixed(2).replace('.', ',')}) ainda está em aberto. Se aconteceu algum imprevisto, você pode concluir em segundos pelo link seguro abaixo e liberar seus Vales-Presente VIP na hora.
      </p>
      <div style="text-align:center;margin:22px 0;">
        <a href="${safeUrl}" style="display:inline-block;background:#facc15;color:#09090b;font-weight:800;padding:12px 24px;border-radius:999px;text-decoration:none;">Concluir Pagamento PIX</a>
      </div>
      <p style="text-align:center;color:#71717a;font-size:12px;margin:20px 0 0;">
        1Convite — Se precisar de ajuda, basta responder a este e-mail.
      </p>
    </div>
  `;
}

export function buildInviteRedeemedEmailHtml({
  name,
  voucherCode = 'REINO-VIP',
  daysValid = 180,
  siteUrl = 'https://1convite.com.br',
}) {
  const safeName = escapeHtml(name || 'Convidado(a)');
  const safeCode = escapeHtml(voucherCode);
  const safeSite = escapeHtml(siteUrl.replace(/\/$/, ''));
  const logoUrl = `${safeSite}/LOGOMARCA_DARK.png`;
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;background:#09090b;color:#fafafa;padding:28px 22px;border-radius:14px;border:1px solid #27272a;">
      <div style="text-align:center;margin-bottom:14px;">
        <img src="${logoUrl}" alt="1Convite" height="32" style="display:inline-block;height:32px;width:auto;" />
      </div>
      <span style="display:inline-block;background:rgba(34,197,94,0.16);color:#4ade80;border:1px solid rgba(34,197,94,0.35);padding:5px 12px;border-radius:999px;font-size:11px;font-weight:700;">CONVITE RESGATADO</span>
      <h2 style="margin:14px 0 10px;font-family:Georgia,'Times New Roman',serif;color:#ffffff;">Você recebeu um presente especial, ${safeName}!</h2>
      <p style="color:#d4d4d8;font-size:14px;line-height:1.6;">
        Seu código de Vale-Presente <strong style="color:#fbbf24;">${safeCode}</strong> foi ativado com sucesso! Você ganhou <strong>${Number(daysValid)} dias de acesso VIP completo</strong> à Bíblia Sagrada ACF narrada, e-books bíblicos e devocionais diários.
      </p>
      <div style="text-align:center;margin:22px 0;">
        <a href="${safeSite}/app" style="display:inline-block;background:#22c55e;color:#052e16;font-weight:800;padding:12px 24px;border-radius:999px;text-decoration:none;">Entrar no 1Convite VIP</a>
      </div>
    </div>
  `;
}

export function buildSeasonalChristmasEmailHtml({ name, siteUrl = 'https://1convite.com.br' }) {
  const safeName = escapeHtml(name || 'Irmão(ã)');
  const safeSite = escapeHtml(siteUrl.replace(/\/$/, ''));
  const logoUrl = `${safeSite}/LOGOMARCA_DARK.png`;
  const artUrl = `${safeSite}/emails/natal-1convite.jpg`;
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;background:#09090b;color:#fafafa;padding:26px 20px;border-radius:16px;border:1px solid #27272a;">
      <div style="text-align:center;margin-bottom:16px;">
        <img src="${logoUrl}" alt="1Convite" height="34" style="display:inline-block;height:34px;width:auto;" />
      </div>
      <div style="border-radius:12px;overflow:hidden;border:1px solid rgba(217,119,6,0.35);margin-bottom:18px;">
        <img src="${artUrl}" alt="Feliz Natal 1Convite" style="display:block;width:100%;height:auto;" />
      </div>
      <div style="text-align:center;">
        <span style="display:inline-block;background:rgba(217,119,6,0.16);color:#fbbf24;border:1px solid rgba(217,119,6,0.35);padding:5px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.6px;">ESPECIAL DE NATAL • 1CONVITE</span>
        <h1 style="margin:14px 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#ffffff;">Feliz Natal, ${safeName}!</h1>
        <p style="color:#d4d4d8;font-size:15px;line-height:1.65;margin:0 0 16px;">
          "Porque um menino nos nasceu, um filho se nos deu..." (Isaías 9:6). Que a luz de Cristo ilumine sua casa, fortaleça sua família e renove a esperança no seu coração neste Natal.
        </p>
        <div style="text-align:center;margin:22px 0 8px;">
          <a href="${safeSite}/app" style="display:inline-block;background:#f59e0b;color:#09090b;font-weight:800;padding:13px 26px;border-radius:999px;text-decoration:none;font-size:14px;">Ler Devocional de Natal no App</a>
        </div>
      </div>
      <p style="text-align:center;color:#71717a;font-size:12px;margin:22px 0 0;">
        Com carinho, Equipe 1Convite — A Palavra Viva no seu bolso.
      </p>
    </div>
  `;
}

export function buildSeasonalNewYearEmailHtml({ name, siteUrl = 'https://1convite.com.br' }) {
  const safeName = escapeHtml(name || 'Irmão(ã)');
  const safeSite = escapeHtml(siteUrl.replace(/\/$/, ''));
  const logoUrl = `${safeSite}/LOGOMARCA_DARK.png`;
  const artUrl = `${safeSite}/emails/ano-novo-1convite.jpg`;
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;background:#09090b;color:#fafafa;padding:26px 20px;border-radius:16px;border:1px solid #27272a;">
      <div style="text-align:center;margin-bottom:16px;">
        <img src="${logoUrl}" alt="1Convite" height="34" style="display:inline-block;height:34px;width:auto;" />
      </div>
      <div style="border-radius:12px;overflow:hidden;border:1px solid rgba(250,204,21,0.35);margin-bottom:18px;">
        <img src="${artUrl}" alt="Feliz Ano Novo 1Convite" style="display:block;width:100%;height:auto;" />
      </div>
      <div style="text-align:center;">
        <span style="display:inline-block;background:rgba(250,204,21,0.14);color:#fde047;border:1px solid rgba(250,204,21,0.35);padding:5px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.6px;">ESPECIAL DE ANO NOVO • 1CONVITE</span>
        <h1 style="margin:14px 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#ffffff;">Um Ano Novo abençoado, ${safeName}!</h1>
        <p style="color:#d4d4d8;font-size:15px;line-height:1.65;margin:0 0 16px;">
          "O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti" (Números 6:24-25). Comece este novo ciclo caminhando diariamente com a Palavra no 1Convite.
        </p>
        <div style="text-align:center;margin:22px 0 8px;">
          <a href="${safeSite}/app" style="display:inline-block;background:#facc15;color:#09090b;font-weight:800;padding:13px 26px;border-radius:999px;text-decoration:none;font-size:14px;">Começar Plano de Leitura</a>
        </div>
      </div>
      <p style="text-align:center;color:#71717a;font-size:12px;margin:22px 0 0;">
        Com carinho, Equipe 1Convite — A Palavra Viva no seu bolso.
      </p>
    </div>
  `;
}

export function getEmailPipelineStages({ statsMap = {}, siteUrl = 'https://1convite.com.br' } = {}) {
  const senderEmail = getResendConfig().fromEmail;
  const sampleInvites = ['REINO-7X9K2', 'REINO-4M8P1', 'REINO-9Q2W5'];
  const sampleVouchersHtml = sampleInvites
    .map(
      (code) => `
      <div style="background:#0f172a;border:1px dashed #fbbf24;border-radius:10px;padding:12px 14px;margin:10px 0;text-align:center;">
        <div style="font-size:10px;letter-spacing:1.2px;color:#fcd34d;text-transform:uppercase;margin-bottom:4px;">Vale-Presente VIP • 180 Dias Grátis</div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:800;letter-spacing:2px;color:#fbbf24;">${code}</div>
      </div>`
    )
    .join('');

  const welcomePreviewHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;background:#09090b;color:#fafafa;padding:28px 22px;border-radius:14px;border:1px solid #27272a;">
      <div style="text-align:center;margin-bottom:16px;">
        <img src="${escapeHtml(siteUrl)}/LOGOMARCA_DARK.png" alt="1Convite" height="36" style="display:inline-block;height:36px;width:auto;" />
      </div>
      <div style="text-align:center;margin-bottom:18px;">
        <span style="display:inline-block;background:rgba(34,197,94,0.16);color:#4ade80;border:1px solid rgba(34,197,94,0.35);padding:5px 12px;border-radius:999px;font-size:11px;font-weight:700;">ACESSO VIP LIBERADO</span>
        <h1 style="margin:14px 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#ffffff;">Bem-vindo(a) ao 1Convite, Carlos Ferreira!</h1>
        <p style="margin:0;color:#a1a1aa;font-size:14px;">Sua assinatura <strong>Plano Popular — Edificação</strong> foi confirmada com sucesso.</p>
      </div>
      <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:16px;margin-bottom:18px;text-align:center;">
        <a href="${escapeHtml(siteUrl)}/app" style="display:inline-block;background:#22c55e;color:#052e16;font-weight:800;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;">Acessar 1Convite Agora</a>
      </div>
      <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:16px;">
        <h3 style="margin:0 0 6px;font-size:15px;color:#ffffff;">Seus Vales-Presente VIP (180 dias grátis cada)</h3>
        ${sampleVouchersHtml}
      </div>
    </div>
  `;

  return [
    {
      id: 'cobranca_gerada',
      order: 1,
      title: '1. Cobrança Gerada (PIX/Boleto)',
      category: 'transacional',
      status: 'active',
      trigger: 'Automático ao gerar checkout no Asaas (/api/v1/pagamentos/checkout)',
      sender: senderEmail,
      subject: 'Seu pedido 1Convite (Plano Popular — Edificação) está aguardando pagamento',
      stats: statsMap.cobranca_gerada || { sent: 0, failed: 0 },
      previewHtml: buildPixPendingEmailHtml({
        name: 'Carlos Ferreira',
        planName: 'Plano Popular — Edificação',
        invoiceUrl: `${siteUrl}/checkout`,
        valueReais: 97,
        siteUrl,
      }),
    },
    {
      id: 'boas_vindas_vip',
      order: 2,
      title: '2. Boas-vindas VIP + Vouchers',
      category: 'transacional',
      status: 'active',
      trigger: 'Automático na confirmação do pagamento (Webhook Asaas ou Simulação Sandbox)',
      sender: senderEmail,
      subject: 'Acesso liberado! Seu Plano Popular + Vales-Presente VIP (1Convite)',
      stats: statsMap.boas_vindas_vip || { sent: 0, failed: 0 },
      previewHtml: welcomePreviewHtml,
    },
    {
      id: 'boas_vindas_lead',
      order: 3,
      title: '3. Boas-vindas de Lead',
      category: 'relacionamento',
      status: 'active',
      trigger: 'Automático quando um visitante se cadastra gratuitamente no app',
      sender: senderEmail,
      subject: 'Sua jornada no 1Convite começou!',
      stats: statsMap.boas_vindas_lead || { sent: 0, failed: 0 },
      previewHtml: buildLeadWelcomeEmailHtml({ name: 'Maria Clara', siteUrl }),
    },
    {
      id: 'lembrete_pix',
      order: 4,
      title: '4. Lembrete de PIX Pendente',
      category: 'recuperacao',
      status: 'ready',
      trigger: 'Pronto para disparo manual ou automação após 24h sem pagamento',
      sender: senderEmail,
      subject: 'Seu acesso VIP ao 1Convite ainda está reservado',
      stats: { sent: 0, failed: 0 },
      previewHtml: buildPixReminderEmailHtml({
        name: 'Carlos Ferreira',
        planName: 'Plano Popular — Edificação',
        invoiceUrl: `${siteUrl}/checkout`,
        valueReais: 97,
        siteUrl,
      }),
    },
    {
      id: 'convite_resgatado',
      order: 5,
      title: '5. Convite VIP Resgatado',
      category: 'relacionamento',
      status: 'ready',
      trigger: 'Pronto para quando um amigo resgatar um Vale-Presente VIP',
      sender: senderEmail,
      subject: 'Seu Vale-Presente VIP 1Convite foi ativado!',
      stats: { sent: 0, failed: 0 },
      previewHtml: buildInviteRedeemedEmailHtml({
        name: 'Ana Paula',
        voucherCode: 'REINO-7X9K2',
        daysValid: 180,
        siteUrl,
      }),
    },
    {
      id: 'sazonal_natal',
      order: 6,
      title: '6. Especial de Natal (Com Arte + Logo)',
      category: 'sazonal',
      status: 'seasonal',
      trigger: 'Campanha Sazonal (24–25 de Dezembro) — Compatível com Resend Gratuito',
      sender: senderEmail,
      subject: 'Feliz Natal! Que a luz de Cristo ilumine sua casa — 1Convite',
      stats: { sent: 0, failed: 0 },
      previewHtml: buildSeasonalChristmasEmailHtml({ name: 'Irmão(ã)', siteUrl }),
    },
    {
      id: 'sazonal_anonovo',
      order: 7,
      title: '7. Especial de Ano Novo (Com Arte + Logo)',
      category: 'sazonal',
      status: 'seasonal',
      trigger: 'Campanha Sazonal (31 Dez – 01 Jan) — Compatível com Resend Gratuito',
      sender: senderEmail,
      subject: 'Feliz Ano Novo abençoado na Palavra — 1Convite',
      stats: { sent: 0, failed: 0 },
      previewHtml: buildSeasonalNewYearEmailHtml({ name: 'Irmão(ã)', siteUrl }),
    },
  ];
}

export async function sendPipelineTestEmail({ templateId, to, siteUrl = 'https://1convite.com.br' }) {
  const stages = getEmailPipelineStages({ siteUrl });
  const stage = stages.find((s) => s.id === templateId);
  if (!stage) {
    return { ok: false, error: 'Etapa de pipeline não encontrada.' };
  }
  return sendEmail({
    to,
    subject: `[TESTE] ${stage.subject}`,
    html: stage.previewHtml,
  });
}
