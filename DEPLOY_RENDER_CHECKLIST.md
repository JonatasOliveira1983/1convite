# Checklist de Deploy no Render (Backend + Blog + Asaas Produção + Resend)

## 1. Web Service do Blog (`oneconvite-blog`)
No painel do Render, em **New → Web Service** conectado ao repositório `JonatasOliveira1983/1convite`:

- **Name:** `oneconvite-blog` (`https://oneconvite-blog.onrender.com`)
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
No serviço `oneconvite` no Render (`https://oneconvite.onrender.com`), mantenha configuradas:

- `ASAAS_API_URL` = `https://api.asaas.com/v3` *(Produção)*
- `ASAAS_API_KEY` = chave de Produção (`$aact_prod_...`)
- `ASAAS_WEBHOOK_TOKEN` = token secreto cadastrado no painel do Asaas *(opcional; o backend também valida diretamente na API do Asaas)*
- `RESEND_API_KEY` = chave `re_...` do Resend
- `RESEND_FROM_EMAIL` = remetente verificado no Resend (ex.: `1Convite <noreply@1convite.com.br>`)
- `TURSO_DATABASE_URL` = URL do banco Turso (`libsql://...`)
- `TURSO_AUTH_TOKEN` = token de autenticação Turso
- `ADMIN_PASSWORD` = senha administrativa padrão
- `FRONTEND_URL` = `https://1convite.com.br`
- `PORT` = `3001` (ou porta injetada pelo Render)

### Webhook no Painel do Asaas (Produção)
- **URL:** `https://oneconvite.onrender.com/api/v1/pagamentos/webhook`
- **Versão da API:** `v3`
- **Tipo de envio:** `Não sequencial`
- **Fila de sincronização:** Ativada
- **Eventos (Cobranças):** `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`
