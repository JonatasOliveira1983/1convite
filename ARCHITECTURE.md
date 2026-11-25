# ARQUITETURA CANÔNICA DO SISTEMA 1CONVITE (`v3.0.0`)

> Documento canônico de arquitetura de software, topologia de nuvem, protocolo de contexto e governança agêntica.
> Atualizado em: 2026-11-25 (`v3.0.0`).

---

## 1. Visão Geral e Propósito do Sistema

O **1Convite** é uma plataforma distribuída de edificação cristã diária, sabedoria bíblica e formação de hábitos espirituais. O ecossistema concilia uma experiência institucional e editorial de alto prestígio para a web aberta, um aplicativo móvel híbrido/nativo de altíssima performance para Android (via Capacitor) e um motor cognitivo autônomo (LAYA Engine) fundamentado em teologia bíblica clássica.

### Objetivos Arquiteturais Fundamentais
1. **Custo Operacional Zero com Alta Disponibilidade**: Eliminação de gargalos legados (como pausas automáticas de instâncias Supabase ou custos de servidores dedicados) através de uma arquitetura baseada em CDN global (Cloudflare Pages), containers escaláveis (Render) e banco de dados SQLite distribuído na borda (Turso LibSQL Cloud).
2. **Latência Sub-Milissegundo no Cliente**: 31.106 versículos bíblicos (Almeida Corrigida Fiel - ACF) indexados na memória e em cache local do navegador/PWA (`localStorage`), permitindo leitura bíblica 100% offline.
3. **Auditabilidade e Padronização Agêntica**: Governança baseada no protocolo MCP (Model Context Protocol), no sistema de arquivos virtual de contexto OpenViking (`viking://1convite/`) e na metodologia de Playbooks da Anthropic ("Uma Pasta por Tarefa").

---

## 2. Topologia de Infraestrutura e Nuvem

O sistema opera sob uma topologia híbrida multicamadas, distribuída geograficamente entre São Paulo (`aws-sa-east-1`) e as redes de borda globais:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CLIENTES E INTERFACES                              │
│   • Aplicativo Android Nativo (Capacitor 7 / 1convite.apk)                  │
│   • Aplicação Web PWA (https://1convite.com.br / https://1convite.pages.dev)│
│   • Agentes Externos via MCP (Claude Desktop, Antigravity, OpenCode)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / WSS / JSON-RPC
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                  BORDA E CDN (CLOUDFLARE PAGES GLOBAL)                      │
│  • Hospedagem do SPA React (Vite 5)                                         │
│  • Certificado SSL TLS 1.3 Automatizado                                     │
│  • Roteamento DNS para Hostinger (Nameservers: emma e odin)                 │
│  • Landing Page Editorial Padrão Hallmark / Vitrine de Mentores             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API (CORS com credenciais)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│               CAMADA DE SERVIÇOS E API (RENDER WEB SERVICE)                 │
│  • Endpoint Principal: https://oneconvite.onrender.com                      │
│  • Runtime: Node.js 22 LTS / Express 5                                      │
│  • Servidor Model Context Protocol (MCP v2024-11-05)                        │
│  • Motor de Busca Bíblica RAG BM25 Okapi                                    │
│  • LAYA Engine (Inteligência dos 6 Mentores Bíblicos)                       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ LibSQL Protocol (TCP / WebSocket)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│              BANCO DE DADOS DISTRIBUÍDO (TURSO LIBSQL CLOUD)                │
│  • Instância: 1convite-db na região São Paulo (aws-sa-east-1)               │
│  • 9 GB de armazenamento gratuito com réplicas instantâneas                 │
│  • Tabelas: Matriz Diária 365, Bíblia ACF (31.106 versículos), Mentores,    │
│    Conselhos, Dicionário Teológico, Trilhas e Progresso de Membros          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Padrão Artemis no Aplicativo Nativo Android (.APK)

Seguindo as diretrizes de automação e engenharia móvel do Google Artemis, o aplicativo Android é gerado através de um pipeline determinístico e auditável:

### 3.1. Pipeline de Compilação CI/CD (GitHub Actions)
- Arquivo de definição: [`.github/workflows/android.yml`](file:///.github/workflows/android.yml).
- Ambiente: `ubuntu-latest` com JDK 21 Zulu e Android SDK nativo.
- Passos:
  1. `npm ci && npm run build` em `frontend/`.
  2. `npx cap sync android` atualizando os assets web em `android/app/src/main/assets/public`.
  3. `chmod +x gradlew && ./gradlew assembleDebug` gerando o binário executável.
  4. Publicação automatizada como Release na tag `latest` do GitHub com o artefato `1convite.apk`.
  5. URL canônica para download direto: `https://github.com/JonatasOliveira1983/1convite/releases/download/latest/1convite.apk`.

### 3.2. Detecção de Plataforma e UX Nativa
O runtime detecta automaticamente se a execução ocorre em ambiente web ou dentro do webview Capacitor (`window.Capacitor`). Quando em modo mobile, o usuário é direcionado imediatamente ao Dashboard e à Bíblia Sagrada, ignorando a Landing Page institucional.

---

## 4. Padrão Hallmark na Landing Page & Pasta da Marca

A interface institucional do 1Convite adota a estética editorial do **Hallmark** (`Nutlope/hallmark`), combinada aos tokens formais da **Pasta da Marca** ([`.agents/marca/`](file:///.agents/marca/)):

### Tokens e Variáveis de Estilo
- **Fundo Primário**: `#09090B` (Preto Obsidiana) e `#121214` (Ardósia Profunda).
- **Acento Primário (Chama)**: `#F97316` (Laranja Vivo).
- **Acento Secundário (Vida & Aliança)**: `#10B981` (Verde Esmeralda).
- **Tipografia**: Sistema editorial com serifas nobres para epígrafes (`Playfair Display` / `Georgia`) e sans-serif ultra-legível para leitura bíblica (`Plus Jakarta Sans` / `Inter`).

---

## 5. Motor RAG Bíblico Local & Nuvem (Retrieval-Augmented Generation)

O serviço de RAG bíblico e teológico ([`backend/src/services/ragService.js`](file:///backend/src/services/ragService.js)) foi desenhado para fundamentar todas as respostas da LAYA com texto bíblico exato da ACF, com zero dependência de APIs de embeddings externas.

### 5.1. Algoritmo de Busca: BM25 Okapi em Português
- Parâmetros: $k_1 = 1.5$ (saturação de frequência) e $b = 0.75$ (penalização de comprimento).
- Normalização: Decomposição Unicode NFKD eliminando diacríticos e acentos.
- Filtragem de Stopwords: Dicionário otimizado em português, preservando substantivos teológicos de alto impacto (`graca`, `redencao`, `paz`, `medo`, `justificacao`, `divida`).

### 5.2. Métricas de Indexação
- **Versículos Indexados**: 31.106 passagens.
- **Termos Únicos Invertidos**: Mais de 12.000 raízes lexicais.
- **Tempo de Indexação em CPU**: ~200 milissegundos.
- **Latência Média de Consulta**: < 2 milissegundos.

---

## 6. Servidor Model Context Protocol (MCP v2024-11-05)

O backend expõe uma interface nativa compatível com o **Model Context Protocol** em [`backend/src/services/mcpServer.js`](file:///backend/src/services/mcpServer.js) e nos endpoints HTTP `/api/v1/mcp/tools` e `/api/v1/mcp/execute`.

### Catálogo de Ferramentas Canônicas MCP

| Ferramenta | Descrição | Parâmetros Principais |
| :--- | :--- | :--- |
| `search_bible_verses` | Busca textual e BM25 em 31.106 versículos da Bíblia ACF. | `query` (string), `top_k` (int), `testamento` (VT/NT), `livro` |
| `get_daily_matrix` | Consulta desafio, oração, reflexão e versículo do dia (1-365). | `dia` (int 1 a 365) |
| `consult_biblical_mentor` | Consulta os 6 mentores bíblicos da LAYA fundamentado por RAG. | `mentor_id` (jesus, salomao, etc.), `situacao` (string) |
| `search_theological_dictionary` | Consulta definições doutrinárias e raízes hebraicas/gregas. | `termo` (string) |
| `get_system_vitals` | Telemetria e saúde do Turso, Render, RAG, Asaas e Resend. | Nenhum |
| `search_blog_articles` | Busca artigos publicados no Blog Oficial 1Convite (`/blog`). | `query` (string), `limit` (int) |
| `get_payment_plans` | Retorna planos anuais (`1`, `3`, `5` convites) e status Asaas. | Nenhum |

### Integração STDIO (Claude Desktop & Antigravity)
O script [`tools/mcp_stdio_bridge.js`](file:///tools/mcp_stdio_bridge.js) traduz requisições JSON-RPC 2.0 da entrada padrão (`stdin`) para a API do 1Convite, permitindo que agentes no host utilizem o 1Convite como ferramenta de contexto nativa.

---

## 7. Metodologia de Fine-Tuning e Calibração dos Mentores LAYA

A especialização dos 6 mentores segue a filosofia em três níveis documentada em [`tools/tuning/GUIA_FINETUNING_LAYA.md`](file:///tools/tuning/GUIA_FINETUNING_LAYA.md):

1. **Nível 1 (RAG Bíblico)**: Injeção em tempo de execução dos versículos exatos pelo BM25.
2. **Nível 2 (Roteamento Semântico em CPU)**: N-grams rápidos selecionando o mentor mais qualificado para a aflição do usuário.
3. **Nível 3 (LoRA / QLoRA)**: Dataset canônico em [`tools/tuning/laya_mentores_instruction.jsonl`](file:///tools/tuning/laya_mentores_instruction.jsonl) pronto para treinamento com Unsloth sobre modelos abertos (Qwen2.5 3B / Llama 3 8B).

---

## 8. Context Database Hierárquico OpenViking (`viking://1convite/`)

O sistema adota o paradigma OpenViking da ByteDance Volcengine para organizar o contexto agêntico em um sistema de arquivos virtual legível e hierárquico:

```
viking://1convite/
├── knowledge/
│   ├── L1_biblia_acf.md          # Síntese canônica dos 66 livros e gêneros literários
│   ├── L1_matriz_diaria_365.md   # Arquitetura pedagógica dos 365 dias do Reino
│   └── L1_ecossistema_v3.md      # Rotas (/, /app, /checkout, /blog), Asaas, 5 E-books e Desktop
├── mentors/
│   └── L1_mentores_overview.md   # Personas, regras e especialidades dos 7 mentores
├── skills/
│   └── L1_skills_overview.md     # Índice de playbooks operacionais
├── manifest.json                 # Manifesto raiz do context database (v3.0.0)
└── viking_cli.js                 # CLI agêntica de navegação (tree, ls, cat, grep)
```

---

## 9. Governança e Metodologia de Playbooks ("Uma Pasta por Tarefa")

A manutenção e evolução do 1Convite é governada por Playbooks autocontidos em [`.agents/playbooks/`](file:///.agents/playbooks/), garantindo previsibilidade absoluta e eliminando alucinações de agentes:

- `desafio-do-dia`: Regras de redação, tom e verificação da matriz de 365 dias.
- `mentor-laya`: Protocolo de aconselhamento e pureza teológica dos mentores.
- `deploy-e-verificacao`: Checklist canônico de homologação pré-deploy.
- `apk-android`: Processo determinístico de build do executável móvel.
