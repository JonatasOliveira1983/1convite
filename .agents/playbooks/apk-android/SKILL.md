# Skill: Compilação e Distribuição do APK Android (Padrão Artemis)

### Pra que serve
Compilar de forma automatizada via CI/CD (GitHub Actions) ou localmente o aplicativo nativo Android do 1Convite (`1convite.apk`), gerando o binário APK assinado para download direto dos usuários sem burocracia de app store.

### Quando usar
- Sempre que houver nova versão ou atualização no frontend que precise ser refletida no app instalado nos celulares dos membros.
- Quando o usuário ou visitante solicitar o link de download direto do aplicativo para Android.

### O que precisa
- Repositório GitHub com workflow `.github/workflows/android.yml` configurado com permissão `contents: write`.
- Runner Ubuntu com Node.js 22, JDK 21 e Android SDK nativo.
- Capacitor Android integrado em `frontend/android`.

### Passos
1. Atualizar o código em `frontend/src/`.
2. Rodar a validação de build local:
   ```bash
   cd frontend
   npm run build
   npx cap sync android
   ```
3. Fazer commit e push para a branch `main`:
   ```bash
   git add .
   git commit -m "feat: nova versao do app mobile"
   git push origin main
   ```
4. O GitHub Actions executará o workflow `Build Android APK`:
   - Executa `gradlew assembleDebug`
   - Renomeia o pacote para `1convite.apk`
   - Cria/atualiza o release na tag `latest` do GitHub
5. O link direto de download permanente fica disponível em:
   `https://github.com/JonatasOliveira1983/1convite/releases/download/latest/1convite.apk`

### Decisões
- **Se** o usuário estiver acessando via Android (Capacitor), **então** o app entra direto no Dashboard (ignora a Landing Page).
- **Se** o usuário estiver no navegador Web institucional, **então** exibe a Landing Page de prestígio com o botão de download direto do APK.
- **Se** o usuário desejar ver a apresentação de dentro do app, **então** ele clica no botão "Ver Apresentação do 1Convite" em "Aparência & Configs".

### Pronto quando
- O workflow no GitHub Actions finalizar com status verde (`success`).
- O arquivo `1convite.apk` estiver disponível na página de Releases com mais de 50 MB de binário gerado.

### Casos que já deram errado
- **Erro:** `android-actions/setup-android@v3` falhar procurando pacote legado `tools`.
  - **Solução:** Não usar a action legada; o runner `ubuntu-latest` do GitHub já possui o Android SDK e as licenças pré-instaladas.
