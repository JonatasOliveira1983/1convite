# Playbook: Deploy Contínuo e Verificação Empírica de Produção

### Pra que serve
Garantir o processo seguro de build, commit duplo e verificação empírica das rotas de produção (Cloudflare Pages, Render e Turso DB) com zero regressões de áudio HTTPS ou CORS.

### Quando usar
Use quando o usuário pedir:
- "faz o deploy das alterações"
- "sobe a nova versão para produção"
- "atualiza o 1convite no ar"
- "faz o push do sistema"

---

### O que precisa
- Checklist de verificação: `arquivos/checklist-deploy.md`
- Exemplo canônico: `exemplos/bom-deploy.md`
- Credencial de push para os repositórios remotos.

---

### Passos
1. **Verificação de Compilação Local:**
   - Rodar `cd frontend && npm run build` e confirmar código de saída 0 (`built in Xs`).
2. **Commit das Alterações:**
   - Montar mensagem de commit declarativa seguindo o padrão Conventional Commits (`feat: ...`, `fix: ...`).
3. **Push Duplo Sincronizado:**
   - Fazer push para a branch `main` disparando os webhooks automáticos do Cloudflare Pages e do Render.
4. **Verificação Empírica em Produção:**
   - Executar chamada HTTP real contra a API do Render (`https://oneconvite.onrender.com/api/v1/health`).
   - Conferir status `{"status": "ok", "db": "connected"}`.
   - Testar endpoint de áudio para garantir cabeçalho `https://` contra Mixed Content.

---

### Pronto quando (A Prova)
- [ ] 1. O build do frontend terminou com código 0 e pasta `dist/` gerada.
- [ ] 2. O git push foi aceito pelo repositório remoto sem conflito.
- [ ] 3. `GET https://oneconvite.onrender.com/api/v1/health` retornou HTTP 200 com banco Turso conectado.
- [ ] 4. A URL de áudio da Bíblia retorna com protocolo `https://`.
- [ ] 5. Prova do terminal foi exibida ao usuário (logs e códigos de resposta HTTP).

---

### Casos que já deram errado
- *Erro:* Proxy de áudio gerando `http://` ➔ *Correção:* Ativar `trust proxy 1` no Express e forçar `https://` em produção.
- *Erro:* Cloudflare Pages tentando rodar na raiz sem apontar `frontend` ➔ *Correção:* Configurar Root directory como `frontend`.
