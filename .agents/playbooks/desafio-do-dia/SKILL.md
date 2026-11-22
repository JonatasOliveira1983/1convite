# Playbook: Geração e Curadoria do Desafio do Dia (365 Códigos Verbais)

### Pra que serve
Produzir ou calibrar os devocionais da Matriz Diária (365 dias) com código verbal de liderança, versículo fiel ACF, história cristã real e roteiro de meditação em 4 partes.

### Quando usar
Use quando o usuário pedir:
- "cria o desafio do dia para o dia X"
- "gera um novo código verbal para a matriz diária"
- "escreve a reflexão diária da Bíblia"
- "calibra a meditação guiada do dia"

Não use para: conselhos do LAYA (use o playbook `mentor-laya`).

---

### O que precisa
- Modelo estruturado: `arquivos/modelo-desafio.md`
- Regras de tom e doutrina: `arquivos/regras-de-tom.md`
- Exemplo canônico aprovado: `exemplos/bom-1.md`
- Acesso à Bíblia ACF no banco Turso para conferir o versículo.

---

### Passos
1. **Identificar o Pilar e o Dia:** Verificar o dia_id (1 a 365) e o pilar (`PROPÓSITO_M2414` ou `RECOMPENSA_AP321`).
2. **Definir o Código Verbal:** Redigir uma declaração afirmativa, memorável e acionável para o dia.
3. **Buscar o Versículo-Chave:** Consultar a Bíblia ACF no banco de dados e copiar o texto literal, citando Livro, Capítulo e Versículo.
4. **Escrever a Reflexão Prática:** 
   - Abrir com o princípio do Reino aplicável ao cotidiano.
   - Incluir obrigatoriamente uma **História Cristã Real** (biografias de homens e mulheres de fé, como Moody, Spurgeon, Müller, Corrie ten Boom, etc.).
5. **Estruturar o Roteiro da Meditação Guiada:**
   - Seguir rigorosamente as 4 fases:
     * 🟢 1. O Ponto de Partida: Ação de Graças pelo Hoje
     * 🟡 2. O Alinhamento: Tudo o que Tenho é Suficiente
     * 🟠 3. O Propósito e o Mover no Agora
     * 🔴 4. A Selagem do Convite
6. **Executar a Prova:** Rodar a lista de conferências antes de entregar.

---

### Decisões (Se X, então Y)
- **Se o dia for do pilar PROPÓSITO_M2414:** foque em evangelismo relacional, ação diária, serviço ao próximo e fidelidade no pouco.
- **Se o dia for do pilar RECOMPENSA_AP321:** foque em perseverança em tempos de prova, governo emocional, esperança eterna e vitória sobre o desânimo.
- **Se a história cristã parecer lendária ou duvidosa:** substitua por uma biografia historicamente comprovada e documentada.

---

### Pronto quando (A Prova)
Antes de salvar ou entregar o desafio, confira cada item:
- [ ] 1. O código verbal segue o formato `"Código XX: [Frase de Impacto]"`.
- [ ] 2. O versículo citado foi conferido palavra por palavra na Bíblia ACF (zero versículos inventados).
- [ ] 3. A reflexão contém a seção `📖 HISTÓRIA CRISTÃ REAL:` com personagem e ano/século identificável.
- [ ] 4. O roteiro de oração tem as 4 cores/fases (🟢, 🟡, 🟠, 🔴) com tempos de pausa indicados (ex: `Pausa de 3 segundos`).
- [ ] 5. A URL do áudio está definida como `/piano.mp3` ou link de áudio seguro em HTTPS.

---

### Casos que já deram errado
- *Erro:* Criar histórias fictícias ou parábolas seculares. *Correção:* Apenas fatos biográficos reais da história da igreja.
- *Erro:* Oração em tom de desespero ou vitimismo. *Correção:* Tom de gratidão, autoridade espiritual e certeza da graça.
