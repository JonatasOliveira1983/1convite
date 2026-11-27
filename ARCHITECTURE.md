# ARQUITETURA CANÔNICA DO SISTEMA 1CONVITE (`v3.2.0`)

> Documento canônico de arquitetura de software, topologia de nuvem, segurança Cloudflare, pagamentos Asaas em Produção, protocolo MCP/RAG e módulos do ecossistema.
> Atualizado em: 2026-11-27 (`v3.2.0`).

---

## 1. Visão Geral e Ecossistema

O **1Convite (`v3.2.0`)** é uma plataforma completa de edificação cristã diária, estudo bíblico, saúde física e multiplicação do Reino, operando na Web (Desktop e Mobile PWA) e em aplicativo nativo Android (Capacitor 8).

### Módulos Principais do Aplicativo (`/app`)
1. **Bíblia Sagrada (ACF Offline/Online):** 31.106 versículos com áudio neural por capítulo, paisagens sonoras simultâneas (Chuva, Ondas, Piano) com controle de volume, destaques e anotações.
2. **Café com Deus (365 Dias), Desafio do Dia & Trilha 30 Dias:** Meditações guiadas, reflexões diárias e sistema de **Chaminhas** (`tb_gamificacao` e `tb_trilhas_usuarios` isolados por `user_contact`).
3. **TemploFit (Corpo & Treino):**
   - **Jornada TemploFit • 6 Meses em Casa** (30 sessões diárias sem equipamentos em `homeJourney6Months.json`).
   - **19 Programas Oficiais OpenGym** (`openGymRoutines.json`) e catálogo com mais de 5.600 exercícios 3D/GIF.
   - **Mapa de Calor Anual**, **Gráfico de Peso Corporal**, **Recorde Pessoal (PR)**, **Troca Rápida de Exercício** e **Reset de Registros** no Turso.
4. **Convites VIP (Controle, Voucher de Luxo & Multiplicação do Reino):**
   - Bloco dedicado no Dashboard e aba exclusiva **Convites VIP** (`ConvitesVipView.jsx`).
   - **Voucher Vertical de Luxo** (Cormorant Garamond + Montserrat, fundo rajado dourado, dedicatória personalizada, versículo, QR Code local via `qrcode` e guia em 3 passos).
   - **Compartilhamento Rico:** envio com **imagem PNG anexada** no WhatsApp Mobile (`navigator.share`) ou **auto-cópia para Ctrl+V** no WhatsApp Web, além de exportação em **PDF** e **PNG**.
   - **Pacotes Especiais & Avulso:** Compra avulsa (`R$ 24,99` cada) e 3 pacotes com desconto progressivo: **Pacote Sementeira** (10x / 5% OFF / `R$ 237,40`), **Pacote Colheita** (15x / 10% OFF / `R$ 337,35`) e **Pacote Embaixadores do Reino** (20x / 15% OFF / `R$ 424,83`).
5. **Biblioteca do Pregador:** 21 Esboços Prontos, 20 Estudos Bíblicos, 16 Estudos de Teologia Sistemática, 21 Mapas/Locais Bíblicos e Criador de Sermões (`tb_pregador_esbocos`).
6. **Planner da Mulher Virtuosa:** Planner diário, 15 Devocionais Femininos, Caderno de Orações (`tb_mulher_virtuosa`), Plano de Leitura e Hábitos de Provérbios 31.
7. **Coleção 5 E-books Premium:** Leitura integrada e download direto em PDF (`/api/v1/download-ebook/:fileName`).
8. **Mentores Bíblicos (LAYA Engine + RAG BM25), Studio de Cards, Jogos & Kids, Lojinha do Reino e Papéis de Parede 4K.**
9. **Design System Unslop, PWA & Performance:**
   - Imagens comprimidas (`58` assets otimizados + mentores em `23–28 KB`), code-splitting (`manualChunks` no Vite) e zero chamadas de API do App na Landing Page.
   - PWA `manifest.json` (`v3.2`) com `start_url: "/app"`, ícones `maskable` e Splash nativa Android (`styles.xml` + `capacitor.config.json`) em `#070A10` eliminando tela branca na abertura.

---

## 2. Topologia de Infraestrutura e Segurança Cloudflare

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENTES E INTERFACES                              │
│   • Aplicativo Android Nativo (Capacitor 8 / Splash #070A10)                │
│   • Aplicação Web PWA Desktop & Mobile (https://1convite.com.br/app)        │
│   • Agentes Externos via MCP (Model Context Protocol v2024-11-05)           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / TLS 1.3
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                  BORDA E SEGURANÇA (CLOUDFLARE PAGES + FUNCTIONS)           │
│  • Hardening HTTP via _headers (HSTS, nosniff, X-Frame-Options, Referrer)   │
│  • Proxy Functions (/api/*, /blog/*, /download-wallpaper/*)                 │
│  • Landing Page de Vendas + Checkout Asaas Produção (PIX / Cartão / Upsell) │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API (CORS + Rate Limiting)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│               CAMADA DE SERVIÇOS E API (RENDER / EXPRESS 5)                 │
│  • Rate Limiting por IP em /auth, /pagamentos/checkout e /admin             │
│  • Asaas Produção (api.asaas.com/v3) + Lock por paymentId + Webhook         │
│  • Resend com fila sequencial anti-429 e templates transacionais neutros    │
│  • Painel ADM Mestre (Usuários, Vendas Asaas, Pipeline 8 Etapas e Saúde)    │
│  • Servidor MCP (v3.2.0) + Motor RAG BM25 (Bíblia + Acervo do Reino)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ LibSQL Protocol
┌──────────────────────────────────────▼──────────────────────────────────────┐
│              BANCO DE DADOS DISTRIBUÍDO (TURSO LIBSQL CLOUD)                │
│  • tb_biblia, tb_acessos_usuarios (com avatar/genero/entitlements por conta)│
│  • tb_vouchers (owner_email + redeemed_by_*), tb_pagamentos_asaas           │
│  • tb_gamificacao, tb_trilhas_usuarios, tb_mulher_virtuosa, tb_pregador_*   │
│  • tb_templofit_sessoes, tb_templofit_metricas, tb_templofit_rotinas_custom │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Painel de Controle Mestre (Admin) & Fluxo Comercial

- **Autenticação Administrativa:** Protegida via header `x-admin-email` e persistência real do perfil/avatar Admin em `tb_acessos_usuarios`.
- **Funil Comercial Asaas Produção:** Planos anuais (Semente R\$ 67, Edificação R\$ 97, Reino R\$ 147), Order Bump (5 E-books R\$ 19,90), Upsell Combo (R\$ 47), Downsells (R\$ 24,90) e Pacotes de Convites VIP (Avulso R\$ 24,99, Sementeira R\$ 237,40, Colheita R\$ 337,35, Embaixadores R\$ 424,83).
- **Pipeline de E-mails (Resend):** 8 etapas monitoradas com fila sequencial (`650ms` + retry em `429`) e textos transacionais otimizados para entrega na caixa Principal.

---

## 4. Governança Agêntica: MCP, RAG, Fine-Tuning & OpenViking

- **MCP (`backend/src/services/mcpServer.js`):** Versão `3.2.0` com catálogo completo incluindo planos Asaas, ofertas de funil e pacotes de Convites VIP.
- **RAG (`backend/src/services/ragService.js`):** Motor BM25 Okapi + normalização Unicode NFKD indexando 31.106 versículos bíblicos, dicionário teológico e acervo do ecossistema.
- **Fine-Tuning (`tools/tuning/export_laya_dataset.js`):** Exporta dataset JSONL no formato ChatML/Unsloth incluindo mentores, TemploFit, Mulher Virtuosa, Pregador e Convites VIP.
- **OpenViking (`tools/openviking/`):** Base hierárquica L0/L1/L2 versionada na `v3.2.0`.
