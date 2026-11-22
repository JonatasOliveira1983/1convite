# Playbook: Mentoria Bíblica Canônica da LAYA

### Pra que serve
Estruturar, calibrar e alimentar os conselhos doutrinários, orações guiadas e desafios práticos dos 6 Mentores Canônicos da LAYA (Jesus, Salomão, Davi, Paulo, Moisés, Ester).

### Quando usar
Use quando o usuário pedir:
- "adiciona um novo conselho de [mentor] sobre [tema]"
- "calibra a resposta de Salomão para finanças"
- "gera um direcionamento de Paulo sobre resiliência"
- "alimenta a base de mentores da LAYA"

Não use para: devocionais gerais (use o playbook `desafio-do-dia`).

---

### O que precisa
- Modelo estruturado: `arquivos/modelo-conselho.md`
- Regras das 6 personas: `arquivos/regras-mentores.md`
- Exemplo ouro: `exemplos/bom-salomao.md`
- Checagem no banco Turso na tabela `tb_laya_conselhos`.

---

### Passos
1. **Identificar o Mentor:** Escolher um dos 6 IDs canônicos: `jesus`, `salomao`, `davi`, `paulo`, `moises`, `ester`.
2. **Identificar o Tema de Vida:** Ex: `Finanças`, `Ansiedade`, `Liderança`, `Propósito`, `Família`, `Perdão`.
3. **Localizar a Passagem Bíblica Fiel:** Selecionar o versículo de autoria ou vivência daquele mentor específico.
4. **Redigir o Conselho Doutrinário:** Em primeira pessoa da persona ou terceira pessoa respeitosa, trazendo os princípios imutáveis das Escrituras.
5. **Redigir a Oração Guiada:** Oração centrada na verdade bíblica daquele conselho.
6. **Definir o Desafio Prático:** Uma ação mensurável para o usuário executar em menos de 24 horas.
7. **Executar a Prova:** Rodar a lista de conferências antes de salvar no banco ou entregar.

---

### Decisões (Se X, então Y)
- **Se o mentor for Jesus:** o conselho deve respirar amor, graça transformadora, salvação e reconciliação com o Pai.
- **Se o mentor for Salomão:** o conselho deve ser analítico, prático, cirúrgico sobre gestão, trabalho, prudência financeira e honra.
- **Se o mentor for Davi:** o conselho deve tocar em quebrantamento, coragem para enfrentar gigantes e adoração sincera.
- **Se o mentor for Paulo:** o conselho deve enfatizar propósito eterno, foco no alvo, resistência ao sofrimento e cruz de Cristo.

---

### Pronto quando (A Prova)
- [ ] 1. O `mentor_id` é rigorosamente um dos 6 válidos (`jesus`, `salomao`, `davi`, `paulo`, `moises`, `ester`).
- [ ] 2. O `versiculo_referencia` é um texto bíblico historicamente ligado ao mentor (ex: Salomão ➔ Provérbios/Eclesiastes; Davi ➔ Salmos; Paulo ➔ Epístolas; etc.).
- [ ] 3. O `texto_biblico` foi conferido e copiado na versão Almeida Corrigida Fiel (ACF).
- [ ] 4. O `desafio_pratico` é uma ação concreta executável hoje (não um conceito abstrato).
- [ ] 5. O registro segue a estrutura exata para inserção na tabela `tb_laya_conselhos`.

---

### Casos que já deram errado
- *Erro:* Colocar Salomão falando com linguagem mística. *Correção:* Salomão é pragmático, observador da vida e conselheiro de sabedoria prática.
- *Erro:* Desafio prático abstrato como "ame mais". *Correção:* Ação concreta: "Ligue para a pessoa que você julgou e peça perdão hoje".
