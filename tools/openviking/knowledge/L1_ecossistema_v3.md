# L1 — Ecossistema 1Convite v3.0.0 (Produção)

- **Página de Vendas (`/`)**: Vitrine oficial com animações interativas, 5 E-books Bônus com capas oficiais, planos anuais (Básico R$67 / 1 convite, Popular R$97 / 3 convites, Avançado R$147 / 5 convites) e FAQ atualizado.
- **Aplicativo Web & Desktop (`/app`)**: Experiência Desktop (`>= 960px`) com Sidebar SVG lateral fixa (`Início`, `Bíblia Sagrada`, `Café com Deus`, `Corpo & Treino`, `Mentores Bíblicos`, `Ebooks & Estudos`, `Minha Conta`, `Blog 1Convite`) e experiência Mobile/Capacitor (`< 960px`).
- **Checkout (`/checkout`)**: Integração Asaas v3 (`PIX` instantâneo e `Cartão/Link`) com webhook que ativa VIP por 365 dias e gera automaticamente 1, 3 ou 5 códigos de 180 dias enviados via Resend.
- **Blog SEO (`/blog/` e `/artigos`)**: SvelteKit 5 + `@sveltejs/adapter-node` montado no backend Express (`oneconvite.onrender.com`) e servido via proxy Cloudflare Pages em `https://1convite.com.br/blog/`.
- **Biblioteca Digital**: 5 E-books completos com capas otimizadas e PDFs servidos em `/ebooks/pdfs/`.
