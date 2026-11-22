# Exemplo Canônico de Deploy com Prova Empírica

### Execução de Prova no Terminal:
```powershell
# 1. Teste de Saúde da API
Invoke-RestMethod -Uri "https://oneconvite.onrender.com/api/v1/health" -Method Get
# Retorno comprovado:
# {"status": "ok", "db": "connected"}

# 2. Teste da Rota de Mentores LAYA
Invoke-RestMethod -Uri "https://oneconvite.onrender.com/api/v1/laya/mentores" -Method Get
# Retorno comprovado:
# {"success": true, "mentores": [...]}
```
