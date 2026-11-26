# ARQUITETURA CANÔNICA DO SISTEMA 1CONVITE (`v3.1.0`)

> Documento canônico de arquitetura de software, topologia de nuvem, segurança Cloudflare, protocolo MCP/RAG e módulos do ecossistema.
> Atualizado em: 2026-11-26 (`v3.1.0`).

---

## 1. Visão Geral e Ecossistema

O **1Convite (`v3.1.0`)** é uma plataforma completa de edificação cristã diária, estudo bíblico, saúde física e organização espiritual, operando na Web (Desktop e Mobile PWA) e em aplicativo nativo Android (Capacitor 8).

### Módulos Principais do Aplicativo (`/app`)
1. **Bíblia Sagrada (ACF Offline/Online):** 31.106 versículos com áudio neural por capítulo, paisagens sonoras simultâneas (Chuva, Ondas, Piano) com controle de volume, destaques e anotações.
2. **Café com Deus (365 Dias) & Desafio do Dia:** Meditações guiadas, reflexões diárias e trilha espiritual gamificada com sistema de **Chaminhas** (`tb_gamificacao`).
3. **TemploFit (Corpo & Treino):**
   - **Jornada TemploFit • 6 Meses em Casa** (30 sessões diárias sem equipamentos em `homeJourney6Months.json`, divididas do Mês 1 ao Mês 6 / 2 Trimestres).
   - **19 Programas Oficiais OpenGym** (`openGymRoutines.json`) e catálogo com mais de 5.600 exercícios 3D/GIF.
   - **Mapa de Calor Anual**, **Gráfico de Peso Corporal**, **Recorde Pessoal (PR)**, **Troca Rápida de Exercício** e **Reset de Registros** no Turso.
4. **Biblioteca do Pregador:** 21 Esboços Prontos, 20 Estudos Bíblicos, 16 Estudos de Teologia Sistemática, 21 Mapas/Locais Bíblicos e Criador de Sermões salvo na nuvem (`tb_pregador_esbocos`).
5. **Planner da Mulher Virtuosa:** Planner diário com horários, 15 Devocionais Femininos, Caderno de Orações (`tb_mulher_virtuosa`), Plano de Leitura e Hábitos de Provérbios 31.
6. **Coleção 5 E-books Premium:** Leitura integrada e download direto em PDF (`/api/v1/download-ebook/:fileName`).
7. **Mentores Bíblicos (LAYA Engine + RAG BM25), Studio de Cards, Jogos & Kids, Lojinha do Reino e Papéis de Parede 4K.**
8. **Design System Unslop & Aparência Unificada:** Controle centralizado em *Minha Conta* para Modo Claro/Escuro, 5 paletas de cores e escala global de fonte (`--reading-font-size`).

---

## 2. Topologia de Infraestrutura e Segurança Cloudflare

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENTES E INTERFACES                              │
│   • Aplicativo Android Nativo (Capacitor 8 / @capacitor/app, filesystem,    │
│     share + DownloadManager nativo)                                         │
│   • Aplicação Web PWA Desktop & Mobile (https://1convite.com.br/app)        │
│   • Agentes Externos via MCP (Model Context Protocol v2024-11-05)           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / TLS 1.3
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                  BORDA E SEGURANÇA (CLOUDFLARE PAGES + FUNCTIONS)           │
│  • Hardening HTTP via _headers (HSTS, nosniff, X-Frame-Options, Referrer)   │
│  • Proxy Functions (/api/*, /blog/*, /download-wallpaper/*)                 │
│  • Landing Page de Vendas + Checkout Asaas (PIX / Cartão / Order Bump)      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API (CORS + Rate Limiting)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│               CAMADA DE SERVIÇOS E API (RENDER / EXPRESS 5)                 │
│  • Rate Limiting por IP em /auth, /pagamentos/checkout e /admin             │
│  • Gateway Asaas + Webhooks + E-mails Transacionais/Campanhas (Resend)      │
│  • Painel ADM Mestre (Usuários, Vendas Asaas, Campanhas e Saúde)            │
│  • Servidor MCP (v3.1.0) + Motor RAG BM25 (Bíblia + Acervo do Reino)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ LibSQL Protocol
┌──────────────────────────────────────▼──────────────────────────────────────┐
│              BANCO DE DADOS DISTRIBUÍDO (TURSO LIBSQL CLOUD)                │
│  • tb_biblia, tb_acessos_usuarios, tb_vouchers, tb_pagamentos_asaas         │
│  • tb_gamificacao, tb_mulher_virtuosa, tb_pregador_esbocos                  │
│  • tb_templofit_sessoes, tb_templofit_metricas, tb_templofit_rotinas_custom │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Painel de Controle Mestre (Admin) & Fluxo Comercial

- **Autenticação Administrativa:** Protegida via header `x-admin-email` e rate limiting.
- **Gestão Completa:**
  - **Visão Geral:** KPIs de usuários, receita confirmada, pendentes e saúde das integrações.
  - **Usuários & Planos:** Busca, filtro e liberação/remoção manual de VIP (`POST /api/v1/admin/usuarios/plano`).
  - **Vendas Asaas:** Confirmação manual de pedidos (`confirmar-manual`) e reenvio de credenciais (`reenviar-email`).
  - **Fluxo de E-mails (Resend):** Templates ao vivo, testes unitários e disparo de campanhas por segmento (`pendentes`, `gratuitos`, `vips`).
  - **Saúde do Sistema:** Monitoramento em tempo real de Turso, Asaas (Sandbox/Produção), Resend e OpenAI.

---

## 4. Governança Agêntica: MCP, RAG, Fine-Tuning & OpenViking

- **MCP (`backend/src/services/mcpServer.js`):** Expõe ferramentas de busca bíblica, matriz diária, conselhos LAYA, artigos do blog, planos Asaas, esboços da Biblioteca do Pregador (`search_preacher_library`) e resumo do TemploFit (`get_templofit_overview`).
- **RAG (`backend/src/services/ragService.js`):** Motor BM25 Okapi + normalização Unicode NFKD indexando 31.106 versículos bíblicos, dicionário teológico e acervo estendido de conhecimento.
- **Fine-Tuning (`tools/tuning/export_laya_dataset.js`):** Exporta dataset JSONL no formato ChatML/Unsloth incluindo mentores, TemploFit, Mulher Virtuosa e Pregador.
- **OpenViking (`tools/openviking/`):** Base hierárquica L0/L1/L2 versionada na `v3.1.0`.
