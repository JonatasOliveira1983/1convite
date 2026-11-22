# Checklist Canônico de Deploy

### Antes do Push:
- [ ] 1. `npm run build` na pasta `frontend` sem erros.
- [ ] 2. Arquivos `.env` contendo credenciais não estão sendo rastreados pelo git.
- [ ] 3. URLs do frontend apontam para `https://oneconvite.onrender.com/api/v1`.

### Após o Push (Verificação Externa):
- [ ] 4. Render concluiu deploy com status `Live`.
- [ ] 5. Cloudflare Pages concluiu deploy com status `Success`.
- [ ] 6. Endpoint de saúde responde 200: `curl -s https://oneconvite.onrender.com/api/v1/health`.
