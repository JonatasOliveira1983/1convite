# Checklist de Deploy no Render (Blog + Asaas + Resend)

## 1. Web Service do Blog (`oneconvite-blog`)
No painel do Render, clique em **New → Web Service** e conecte ao repositório `JonatasOliveira1983/1convite`:

- **Name:** `oneconvite-blog` (para corresponder à URL `https://oneconvite-blog.onrender.com`)
- **Root Directory:** `blog`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `node build`

### Variáveis de Ambiente (`oneconvite-blog`)
- `DATABASE_URL` = URL do banco Turso (`libsql://...`)
- `DATABASE_AUTH_TOKEN` = Token do Turso
- `SITE_URL` = `https://1convite.com.br/blog`
- `ORIGIN` = `https://1convite.com.br`
- `ADMIN_USERNAME` = usuário admin do blog
- `ADMIN_PASSWORD` = senha forte do admin do blog
- `GEMINI_API_KEY` = chave do Gemini para importação/SEO com IA
- `BODY_SIZE_LIMIT` = `104857600`

*(Caso o Render gere uma URL diferente de `https://oneconvite-blog.onrender.com`, crie a variável `BLOG_ORIGIN` no Cloudflare Pages apontando para a URL gerada).*

---

## 2. Variáveis do Backend Principal (`oneconvite`)
No serviço `oneconvite` já existente no Render (`https://oneconvite.onrender.com`), adicione:

- `ASAAS_API_KEY` = sua chave Asaas (`$aact_hmlg_...` para Sandbox ou `$aact_prod_...` para Produção)
- `ASAAS_WEBHOOK_TOKEN` = mesmo token secreto cadastrado no painel do Asaas (opcional)
- `RESEND_API_KEY` = sua chave `re_...` do Resend
- `RESEND_FROM_EMAIL` = remetente verificado no Resend (ex.: `1Convite <noreply@1convite.com.br>`)
- `FRONTEND_URL` = `https://1convite.com.br`

### Webhook no Painel do Asaas
- **URL:** `https://oneconvite.onrender.com/api/v1/pagamentos/webhook`
- **Eventos:** `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_CREDIT_CARD_CAPTURED`
