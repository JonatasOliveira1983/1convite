# 1Convite (`v3.2.0`) — Ecossistema Completo

Plataforma cristã completa que integra a Palavra de Deus, devocionais diários, saúde física (TemploFit), mentoria bíblica (LAYA + RAG BM25), biblioteca do pregador, planner feminino e multiplicação do Reino via Convites VIP.

> Para detalhes aprofundados de infraestrutura, protocolos e governança agêntica, consulte [ARCHITECTURE.md](file:///c:/Users/jonat/Desktop/Sistemas%202026/3%20-%201convite/ARCHITECTURE.md).

---

## Status em Produção

| Serviço | Infraestrutura / URL | Status |
|---|---|---|
| Frontend & Landing Page | Cloudflare Pages (`https://1convite.com.br`) | Ativo |
| Aplicativo Web & PWA | Cloudflare Pages (`https://1convite.com.br/app`) | Ativo |
| Backend API | Render (`https://oneconvite.onrender.com`) | Ativo |
| Blog SEO | Render (`https://oneconvite-blog.onrender.com` via proxy `/blog`) | Ativo |
| Banco de Dados | Turso LibSQL Cloud | Ativo |
| Pagamentos | Asaas Produção (`https://api.asaas.com/v3`) | Ativo |
| E-mails Transacionais | Resend (fila sequencial anti-429) | Ativo |
| APK Android | GitHub Actions (`android.yml` / Capacitor 8) | Automático |

---

## Principais Módulos

- **Acesso Fechado & Convites VIP:** Entrada no `/app` exclusiva para assinantes (e-mail e senha de compra ativa) ou portadores de **Código de Convite VIP** (180 dias gratuitos). Inclui gerador de **Voucher Vertical de Luxo** (PNG, PDF e compartilhamento rico no WhatsApp) e compra avulsa ou em pacotes (`Sementeira`, `Colheita`, `Embaixadores`).
- **Bíblia Sagrada (ACF):** 31.106 versículos com áudio neural por capítulo, paisagens sonoras simultâneas (Chuva, Ondas, Piano), destaques e anotações.
- **Café com Deus (365 Dias), Desafio do Dia & Trilha 30 Dias:** Meditações guiadas e sistema de **Chaminhas** isolado por conta.
- **TemploFit (Corpo & Treino):** Jornada 6 Meses em Casa (30 sessões), 19 programas OpenGym, catálogo com +5.600 exercícios, mapa de calor anual, gráfico de peso e recordes pessoais (PR).
- **Biblioteca do Pregador & Planner da Mulher Virtuosa:** Esboços de sermões, estudos bíblicos, teologia sistemática, mapas bíblicos, devocionais femininos e caderno de orações.
- **5 E-books Premium:** Leitura integrada no app e download direto em PDF.
- **Mentores Bíblicos (LAYA + RAG BM25):** Motor neural em CPU + busca BM25 Okapi sobre Bíblia e dicionário teológico, sem custo de API externa.
- **Painel ADM Integrado:** Acesso exclusivo pelo menu lateral para o administrador (`jonatasprojetos2013@gmail.com`) com gestão de usuários, bloqueio, visualização/edição de senha, controle por módulo, presente de Convites VIP, exportação CSV, monitoramento Asaas/Resend e reset de dados de teste pré-lançamento.

---

## Estrutura do Repositório

```text
1convite/
├── frontend/                  # React 19 + Vite 5.4 + PWA + Capacitor 8 Android
│   ├── src/
│   │   ├── App.jsx            # Shell principal (Landing, App, Menu Lateral/Mobile e ADM)
│   │   ├── components/        # LandingPage, LoginPage, AdminPanel, ConvitesVip, TemploFit, etc.
│   │   ├── services/          # adminAuthService, asaasCheckout, templofitService, etc.
│   │   └── data/              # Matriz diária, programas TemploFit, e-books e acervo
│   ├── functions/             # Cloudflare Pages Functions (proxy /api/*, /blog/*, headers)
│   └── android/               # Projeto nativo Android (Capacitor 8)
├── backend/                   # Express 5 + Turso LibSQL + Asaas + Resend + RAG + MCP
│   └── src/
│       ├── index.js           # API REST, Webhook Asaas, Auth, Admin e E-mails
│       └── services/          # ragService.js (BM25), mcpServer.js (v3.2.0), emailService
├── blog/                      # SvelteKit 5 + @sveltejs/adapter-node (/blog)
├── tools/
│   ├── openviking/            # Base de conhecimento hierárquica L0/L1/L2
│   └── tuning/                # Guia e exportador JSONL para Fine-Tuning LAYA
├── ARCHITECTURE.md            # Documento canônico de arquitetura v3.2.0
└── DEPLOY_RENDER_CHECKLIST.md # Variáveis e configuração de deploy no Render & Asaas
```

---

## Desenvolvimento Local

### Pré-requisitos
- Node.js >= 20
- Credenciais Turso (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) configuradas em `backend/.env`

```bash
# Instalar dependências
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Iniciar frontend e backend simultaneamente
npm run dev
```

- **Frontend (Vite):** `http://localhost:5173`
- **Backend (Express):** `http://localhost:3001`

### Comandos Úteis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia frontend + backend simultaneamente |
| `npm run build` | Build de produção do frontend (`frontend/dist`) |
| `node --check backend/src/index.js` | Valida sintaxe do servidor backend |
| `npm run lint` | Lint do frontend |
