/**
 * RAG SERVICE - Motor de Recuperação e Contexto Bíblico/Teológico
 * Inspirado nas diretrizes canônicas de BM25 Okapi e NFKD da Base Tecnológica.
 */

const STOPWORDS_PT = new Set([
  'a', 'ao', 'aos', 'aquela', 'aquelas', 'aquele', 'aqueles', 'aquilo', 'as', 'ate', 'com', 'como',
  'da', 'das', 'de', 'dela', 'delas', 'dele', 'deles', 'depois', 'do', 'dos', 'e', 'ela', 'elas',
  'ele', 'eles', 'em', 'entre', 'era', 'eram', 'eramos', 'essa', 'essas', 'esse', 'esses', 'esta',
  'estas', 'este', 'estes', 'eu', 'foi', 'fomos', 'foram', 'ha', 'isso', 'isto', 'ja', 'lhe', 'lhes',
  'mais', 'mas', 'me', 'mesmo', 'meu', 'meus', 'minha', 'minhas', 'na', 'nas', 'nao', 'nas', 'nem',
  'no', 'nos', 'nossa', 'nossas', 'nosso', 'nossos', 'num', 'numa', 'o', 'os', 'ou', 'para', 'pela',
  'pelas', 'pelo', 'pelos', 'por', 'qual', 'quando', 'que', 'quem', 'sao', 'se', 'seja', 'sejam',
  'sem', 'seu', 'seus', 'so', 'sua', 'suas', 'tambem', 'te', 'tem', 'temos', 'teu', 'teus', 'tu',
  'tua', 'tuas', 'um', 'uma', 'umas', 'uns', 'voce', 'voces', 'vos'
]);

class RagService {
  constructor() {
    this.verses = [];
    this.invertedIndex = new Map(); // token -> array of { docIndex, tf }
    this.docLengths = [];
    this.avgDocLength = 0;
    this.isIndexed = false;
    this.theologicalTerms = [];
    this.k1 = 1.5;
    this.b = 0.75;
  }

  /**
   * Normalização Unicode NFKD (remove acentos, cedilhas e pontuação)
   */
  normalize(text) {
    if (!text) return '';
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Tokenização e remoção de stopwords
   */
  tokenize(text) {
    const norm = this.normalize(text);
    if (!norm) return [];
    return norm
      .split(' ')
      .filter(t => t.length > 1 && !STOPWORDS_PT.has(t));
  }

  /**
   * Indexa a Bíblia ACF completa em memória (31.106 versículos)
   */
  indexBible(bibleData) {
    if (!Array.isArray(bibleData) || bibleData.length === 0) return;
    const startTime = Date.now();
    this.verses = [];
    this.invertedIndex.clear();
    this.docLengths = [];

    let totalLength = 0;

    for (let b = 0; b < bibleData.length; b++) {
      const book = bibleData[b];
      const bookName = book.name || book.livro_nome || '';
      const bookAbrev = (book.abbrev || book.livro_abrev || '').toLowerCase();
      const testamento = b < 39 ? 'VT' : 'NT';

      if (!book.chapters) continue;

      for (let c = 0; c < book.chapters.length; c++) {
        const chapter = book.chapters[c];
        const chapterNum = c + 1;

        for (let v = 0; v < chapter.length; v++) {
          const verseText = chapter[v];
          const verseNum = v + 1;
          const tokens = this.tokenize(verseText);
          const docIndex = this.verses.length;
          const docLen = tokens.length;

          const docObj = {
            id: docIndex + 1,
            livro: bookName,
            abrev: bookAbrev,
            capitulo: chapterNum,
            versiculo: verseNum,
            texto: verseText,
            testamento,
            len: docLen
          };

          this.verses.push(docObj);
          this.docLengths.push(docLen);
          totalLength += docLen;

          // Mapa de frequência de termos no documento (TF)
          const termFreq = new Map();
          for (const token of tokens) {
            termFreq.set(token, (termFreq.get(token) || 0) + 1);
          }

          for (const [token, count] of termFreq.entries()) {
            if (!this.invertedIndex.has(token)) {
              this.invertedIndex.set(token, []);
            }
            this.invertedIndex.get(token).push({ docIndex, tf: count });
          }
        }
      }
    }

    this.avgDocLength = this.verses.length > 0 ? totalLength / this.verses.length : 0;
    this.isIndexed = true;
    const duration = Date.now() - startTime;
    console.log(`[RAG Service] BM25 Indexado com sucesso! ${this.verses.length} versículos, ${this.invertedIndex.size} termos únicos em ${duration}ms.`);
  }

  /**
   * Indexa termos teológicos
   */
  setTheologicalTerms(terms) {
    if (Array.isArray(terms)) {
      this.theologicalTerms = terms;
    }
  }

  /**
   * Busca BM25 Okapi nos versículos
   */
  searchBible(query, options = {}) {
    const { topK = 5, testamento = null, livro = null } = options;
    if (!this.isIndexed || this.verses.length === 0) {
      return [];
    }

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const N = this.verses.length;
    const docScores = new Map(); // docIndex -> score

    for (const token of queryTokens) {
      const postings = this.invertedIndex.get(token);
      if (!postings) continue;

      const df = postings.length;
      // IDF suavizado: ln((N - n + 0.5) / (n + 0.5) + 1)
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);

      for (const { docIndex, tf } of postings) {
        const doc = this.verses[docIndex];
        if (testamento && doc.testamento !== testamento) continue;
        if (livro && doc.abrev !== livro.toLowerCase()) continue;

        const docLen = this.docLengths[docIndex];
        const tfNorm = (tf * (this.k1 + 1)) / (tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength)));
        const score = idf * tfNorm;

        docScores.set(docIndex, (docScores.get(docIndex) || 0) + score);
      }
    }

    const sorted = Array.from(docScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK)
      .map(([docIndex, score]) => {
        const v = this.verses[docIndex];
        return {
          referencia: `${v.livro} ${v.capitulo}:${v.versiculo}`,
          livro: v.livro,
          abrev: v.abrev,
          capitulo: v.capitulo,
          versiculo: v.versiculo,
          texto: v.texto,
          testamento: v.testamento,
          score: parseFloat(score.toFixed(3))
        };
      });

    return sorted;
  }

  /**
   * Busca no Dicionário Teológico
   */
  searchTheology(query, topK = 3) {
    if (!this.theologicalTerms || this.theologicalTerms.length === 0) return [];
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const scored = this.theologicalTerms.map(term => {
      const targetText = `${term.termo || ''} ${term.significado || ''}`;
      const targetTokens = this.tokenize(targetText);
      let matchCount = 0;
      for (const qt of queryTokens) {
        if (targetTokens.includes(qt)) matchCount++;
      }
      return {
        termo: term.termo,
        significado: term.significado,
        score: matchCount
      };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /**
   * Busca Híbrida RAG para injetar contexto nos Mentores LAYA
   */
  getHybridContext(query, topK = 4) {
    const verses = this.searchBible(query, { topK });
    const theology = this.searchTheology(query, 2);

    let contextString = '';
    if (verses.length > 0) {
      contextString += '### PASSAGENS BÍBLICAS RELEVANTES (RAG BM25):\n';
      verses.forEach(v => {
        contextString += `• [${v.referencia}] "${v.texto}" (Relevância: ${v.score})\n`;
      });
      contextString += '\n';
    }

    if (theology.length > 0) {
      contextString += '### FUNDAMENTAÇÃO TEOLÓGICA:\n';
      theology.forEach(t => {
        contextString += `• **${t.termo}**: ${t.significado}\n`;
      });
      contextString += '\n';
    }

    return {
      contextString,
      verses,
      theology,
      indexedVersesCount: this.verses.length
    };
  }
}

const ragService = new RagService();
export { ragService, RagService };
export default ragService;
