# viking://1convite/knowledge/biblia_acf (L1 Summary)

### Resumo Executivo
- **Cânon**: Almeida Corrigida Fiel (ACF) completa.
- **Total de Livros**: 66 (39 no Antigo Testamento, 27 no Novo Testamento).
- **Total de Capítulos**: 1.189.
- **Total de Versículos**: 31.106.
- **Localização dos Dados**:
  - Nuvem Turso: tabela `tb_biblia_acf` (persistência durável e consultas SQL).
  - Memória RAM: `cachedBibleData` (array JSON para renderização instantânea do leitor).
  - RAG Service: índice invertido BM25 Okapi em `backend/src/services/ragService.js`.

### Principais Divisões e Gêneros Literários
1. **Pentateuco (Lei)**: Gênesis a Deuteronômio (Criação, Aliança, Êxodo, Tabernáculo e Lei Moral).
2. **Históricos**: Josué a Ester (Conquistas, Juízes, Monarquia Unida, Exílio e Restauração).
3. **Poéticos e Sapienciais**: Jó a Cantares de Salomão (Adoração nos Salmos, Sabedoria em Provérbios, Propósito em Eclesiastes).
4. **Proféticos**: Isaías a Malaquias (Profecias messiânicas, juízo e restauração).
5. **Evangelhos e Atos**: Mateus a Atos (Vida, morte, ressurreição de Cristo e expansão da Igreja primitiva).
6. **Epístolas**: Romanos a Judas (Doutrina, teologia da justificação, santificação e vida em comunidade).
7. **Revelação**: Apocalipse (Consumação dos séculos e a Nova Jerusalém).
