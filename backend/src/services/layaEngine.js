// ═════════════════════════════════════════════════════════════════
// LAYA ENGINE — Motor de Sabedoria Bíblica & Decisão Semântica
// 100% Autônomo, Sem APIs Externas, Resposta Instantânea em CPU
// ═════════════════════════════════════════════════════════════════

// Normaliza texto para busca semântica em CPU
function normalizeText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// ── BANCO DE DADOS DE MENTORES BÍBLICOS (Canônico & Estruturado) ──
export const LAYA_MENTORES = [
  {
    id: 'jesus',
    nome: 'Jesus Cristo',
    titulo: 'O Mestre e Redentor',
    periodo: 'Novo Testamento • Evangelhos',
    descricao: 'A plenitude da graça, verdade e amor. Ele ensina o caminho para a paz profunda, a salvação e a transformação do coração.',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
    ordem: 1,
    preco_desbloqueio: 0,
    especialidades: ['Paz', 'Graça', 'Salvação', 'Amor ao Próximo', 'Perdão']
  },
  {
    id: 'salomao',
    nome: 'Rei Salomão',
    titulo: 'O Rei da Sabedoria',
    periodo: 'Antigo Testamento • Livro de Provérbios e Eclesiastes',
    descricao: 'O homem mais sábio da história bíblica. Princípios cirúrgicos sobre finanças, gestão, prudência, trabalho e relacionamentos.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    ordem: 2,
    preco_desbloqueio: 50,
    especialidades: ['Finanças', 'Sabedoria', 'Negócios', 'Prudência', 'Disciplina']
  },
  {
    id: 'davi',
    nome: 'Rei Davi',
    titulo: 'O Homem Segundo o Coração de Deus',
    periodo: 'Antigo Testamento • Livro dos Salmos',
    descricao: 'Guerreiro e adorador que venceu gigantes, enfrentou o deserto da perseguição e aprendeu a rasgar o coração diante do Criador.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    ordem: 3,
    preco_desbloqueio: 70,
    especialidades: ['Superação do Medo', 'Adoração', 'Coragem', 'Batalha Espiritual']
  },
  {
    id: 'paulo',
    nome: 'Apóstolo Paulo',
    titulo: 'O Apóstolo dos Gentios',
    periodo: 'Novo Testamento • Epístolas Paulinas',
    descricao: 'Ex-perseguidor transformado em mestre do Reino. Especialista em resiliência, doutrina, liderança ministerial e propósito eterno.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    ordem: 4,
    preco_desbloqueio: 100,
    especialidades: ['Propósito', 'Resiliência', 'Fé Radical', 'Foco no Alvo']
  },
  {
    id: 'moises',
    nome: 'Moisés',
    titulo: 'O Libertador e Legislador',
    periodo: 'Antigo Testamento • Pentateuco',
    descricao: 'Líder chamado por Deus para conduzir um povo pelo deserto. Ensina sobre paciência, intimidade com Deus e perseverança.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    ordem: 5,
    preco_desbloqueio: 120,
    especialidades: ['Liderança', 'Direção Divina', 'Paciência no Deserto']
  },
  {
    id: 'ester',
    nome: 'Rainha Ester',
    titulo: 'A Rainha da Coragem e Jejum',
    periodo: 'Antigo Testamento • Livro de Ester',
    descricao: 'Exemplo de coragem, graça estratégica e intercessão que salvou uma nação inteira: "Se perecer, pereci".',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ordem: 6,
    preco_desbloqueio: 140,
    especialidades: ['Posicionamento', 'Coragem Estratégica', 'Jejum & Oração']
  }
];

// ── CONSELHOS ESTRUTURADOS POR MENTOR E TEMA ──
export const LAYA_CONSELHOS = [
  // JESUS
  {
    mentor_id: 'jesus',
    tema: 'medo_ansiedade',
    titulo: 'Não Andeis Ansiosos pelo Dia de Amanhã',
    versiculo_referencia: 'Mateus 6:33-34',
    texto_biblico: 'Buscai, pois, em primeiro lugar, o seu reino e a sua justiça, e todas estas coisas vos serão acrescentadas. Portanto, não vos inquieteis com o dia de amanhã, pois o amanhã trará os seus próprios cuidados.',
    conselho_doutrinario: 'A ansiedade tenta roubar a energia que Deus reservou exclusivamente para o hoje. Olhe para as aves do céu e os lírios do campo: eles não fiam nem tecem, e contudo o Pai cuida de cada detalhe. Quando você transfere o controle do seu amanhã para Deus, o fardo pesado se desfaz.',
    oracao_guiada: 'Senhor Jesus, eu entrego a Ti toda a angústia com o meu futuro. Eu declaro que Tu és o Senhor do meu amanhã. Eu recebo a Tua paz que excede todo o entendimento e decido viver o dia de hoje firmado na Tua graça. Amém.',
    desafio_pratico: 'Faça uma lista de 3 coisas que estão tirando a sua paz. Em oração, declare em voz alta a entrega de cada uma delas e recuse-se a se preocupar com elas nas próximas 24 horas.'
  },
  {
    mentor_id: 'jesus',
    tema: 'perdao_cura',
    titulo: 'A Força Libertadora do Perdão',
    versiculo_referencia: 'Lucas 23:34 / Mateus 18:21-22',
    texto_biblico: 'Pai, perdoa-lhes, porque não sabem o que fazem. (...) Não te digo que até sete vezes, mas até setenta vezes sete.',
    conselho_doutrinario: 'O rancor é um veneno que você bebe esperando que o outro sofra. Na cruz, o perdão não foi concedido porque as pessoas mereciam, mas porque o amor do Pai é maior do que qualquer ofensa. Perdoar não é esquecer o fato, é libertar um prisioneiro e descobrir que o prisioneiro era você.',
    oracao_guiada: 'Mestre, liberta o meu coração de toda amargura e desejo de justiça própria. Eu decido perdoar quem me feriu, assim como o Senhor perdoou todas as minhas faltas. Que a Tua cura penetre na minha alma hoje. Amém.',
    desafio_pratico: 'Pense na pessoa que mais te magoou recentemente. Ore genuinamente para que Deus abençoe a vida e a casa dela hoje.'
  },

  // SALOMÃO
  {
    mentor_id: 'salomao',
    tema: 'financas_trabalho',
    titulo: 'A Disciplina que Constrói a Prosperidade Real',
    versiculo_referencia: 'Provérbios 21:5 / Provérbios 13:11',
    texto_biblico: 'Os planos do diligente conduzem à abundância, mas a pressa excessiva leva à penúria. Os bens que facilmente se ganham diminuem, mas quem os ajunta pelo trabalho os aumentará.',
    conselho_doutrinario: 'Quem corre atrás de atalhos rápidos encontra a ruína. O dinheiro honrado é fruto de três colunas: diligência no trabalho, domínio próprio nos gastos e sabedoria na preservação. Não gaste o que você ainda não gerou, e nunca seja fiador de dívidas alheias.',
    oracao_guiada: 'Deus de toda a sabedoria, concede-me clareza mental e prudência para gerir os recursos que Tu colocaste em minhas mãos. Repreende todo espírito de desperdício, pressa e vaidade. Que meu trabalho glorifique o Teu nome. Amém.',
    desafio_pratico: 'Abra suas contas hoje. Elimine 1 gasto supérfluo imediatamente e anote exatamente quanto entrou e quanto saiu nos últimos 30 dias.'
  },
  {
    mentor_id: 'salomao',
    tema: 'sabedoria_decisoes',
    titulo: 'O Valor de Ouvir Múltiplos Conselhos',
    versiculo_referencia: 'Provérbios 15:22',
    texto_biblico: 'Onde não há conselho os projetos saem vãos, mas na multidão dos conselheiros eles se estabelecem.',
    conselho_doutrinario: 'O homem tolo confia cegamente em suas próprias emoções. Antes de assinar um contrato, mudar de emprego ou tomar uma decisão importante, busque pessoas tementes a Deus com maturidade comprovada. A calma é a mãe das decisões certas.',
    oracao_guiada: 'Pai celestial, não me deixes cair na armadilha da soberba. Coloca no meu caminho pessoas prudentes e dá-me ouvidos atentos para ouvir a verdade, mesmo quando ela contrariar o meu ego. Amém.',
    desafio_pratico: 'Não tome nenhuma decisão importante por impulso hoje. Espere 24 horas e consulte uma pessoa experiente e de oração.'
  },

  // DAVI
  {
    mentor_id: 'davi',
    tema: 'medo_ansiedade',
    titulo: 'O Senhor é o Meu Pastor: Nada Me Faltará',
    versiculo_referencia: 'Salmo 23:1-4',
    texto_biblico: 'Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.',
    conselho_doutrinario: 'Eu enfrentei leões, ursos e um gigante com uma funda e cinco pedras no riacho. O segredo não estava na minha força física, mas na certeza de que a batalha pertencia ao Senhor. O vale escuro não é o fim da sua jornada; é apenas o caminho de passagem para a mesa farta.',
    oracao_guiada: 'Senhor Deus dos Exércitos, quando o medo do futuro e os gigantes desta terra se levantarem contra mim, lembra-me de quem Tu és. Tu és o meu pastor e a minha fortaleza. Nenhum gigante resistirá diante da Tua presença. Amém.',
    desafio_pratico: 'Leia o Salmo 23 em voz alta três vezes ao longo do dia, pausando em cada versículo para respirar e agradecer.'
  },
  {
    mentor_id: 'davi',
    tema: 'adoracao_crise',
    titulo: 'Louvor no Meio da Caverna',
    versiculo_referencia: 'Salmo 57:7-8 / Salmo 34:1',
    texto_biblico: 'Firme está o meu coração, ó Deus, o meu coração está firme; cantarei e entoarei louvores.',
    conselho_doutrinario: 'Quando estive escondido na caverna de Adulão, perseguido injustamente e sem nada, eu decidi louvar. O louvor no sofrimento confunde as trevas e realinha os olhos com a soberania de Deus.',
    oracao_guiada: 'Pai, mesmo que a tempestade esteja forte lá fora, meu coração escolhe Te adorar. Tu és bom em todo o tempo. A minha alma descansa na Tua fidelidade. Amém.',
    desafio_pratico: 'Coloque um louvor suave para tocar agora e feche os olhos por 5 minutos apenas agradecendo a Deus pelas bênçãos invisíveis.'
  },

  // PAULO
  {
    mentor_id: 'paulo',
    tema: 'proposito_chamado',
    titulo: 'Prossigo para o Alvo: Correndo com Firmeza',
    versiculo_referencia: 'Filipenses 3:13-14 / 2 Timóteo 4:7',
    texto_biblico: 'Esquecendo-me das coisas que ficaram para trás e avançando para as que estão adiante, prossigo para o alvo, pelo prêmio da soberana vocação de Deus em Cristo Jesus.',
    conselho_doutrinario: 'Não permita que os erros do passado nem os aplausos de ontem paralisem o seu chamado. Naufrágios, cadeias e pedradas não puderam calar o evangelho que ardia em mim. A sua dor presente está gerando um peso eterno de glória.',
    oracao_guiada: 'Senhor Jesus, desvia os meus olhos das distrações do mundo. Dá-me disciplina, clareza e determinação para cumprir a corrida que me foi proposta. Que a minha vida seja gasta para o Teu Reino. Amém.',
    desafio_pratico: 'Escreva em uma folha seu maior objetivo espiritual para este ano e defina uma micro-ação que você fará hoje para se aproximar dele.'
  },
  {
    mentor_id: 'paulo',
    tema: 'resiliencia_tribulacao',
    titulo: 'A Graça que Basta na Fraqueza',
    versiculo_referencia: '2 Coríntios 12:9-10',
    texto_biblico: 'A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza. De boa vontade, pois, me gloriarei nas minhas fraquezas, para que sobre mim habite o poder de Cristo.',
    conselho_doutrinario: 'Três vezes roguei ao Senhor que tirasse o espinho da minha carne, e a resposta dEle foi: "A Minha graça é suficiente". Quando você reconhece que não tem forças por si mesmo, é exatamente aí que o poder divino assume o comando da sua vida.',
    oracao_guiada: 'Pai, quando me sinto exausto e sem saída, eu me abrigo na Tua graça. Não dependo da minha capacidade, mas do Teu poder sobrenatural agindo em mim. Em Ti sou mais que vencedor. Amém.',
    desafio_pratico: 'Não reclame de nenhuma adversidade hoje. Toda vez que surgir vontade de reclamar, substitua imediatamente por uma palavra de gratidão.'
  }
];

// ── TEMAS DO ORÁCULO LAYA (Busca Semântica por Emoção & Situação de Vida) ──
export const LAYA_ORACULO_TEMAS = [
  {
    slug: 'ansiedade-medo',
    categoria: 'EMOCAO',
    titulo: 'Ansiedade, Pânico e Medo do Futuro',
    palavras_chave: ['ansiedade', 'medo', 'panico', 'angustia', 'preocupacao', 'futuro', 'insonia', 'nervoso', 'desespero', 'aflicao'],
    promessa_biblica: 'O Senhor guardará em perfeita paz aquele cujo propósito está firme nele, porque nele confia.',
    versiculo_chave: 'Isaías 26:3 & Filipenses 4:6-7',
    direcionamento_laya: 'A ansiedade projeta desastres em um tempo que ainda não existe. Deus não lhe dá graça para o amanhã hoje; Ele dá graça para o agora. Respire, ancore sua mente nas promessas eternas e recuse-se a carregar o fardo sozinho.',
    oracao_resposta: 'Pai, eu esvazio o meu peito de todo medo e aperto. Eu rejeito as mentiras do inimigo sobre o meu futuro. Eu declaro que os Teus planos para mim são de paz e não de mal, para me dar um futuro e uma esperança. Em nome de Jesus, amém.',
    acao_pratica: 'Desconecte-se de redes sociais por 1 hora. Beba um copo de água, respire fundo e recite em voz alta: "Deus está no controle da minha vida".'
  },
  {
    slug: 'financas-dividas',
    categoria: 'VIDA_PRATICA',
    titulo: 'Dívidas, Escassez e Desafios Financeiros',
    palavras_chave: ['dinheiro', 'divida', 'desemprego', 'financeiro', 'falencia', 'falta', 'escassez', 'pagar', 'contas', 'pobreza'],
    promessa_biblica: 'O meu Deus suprirá todas as necessidades de vocês, de acordo com as suas gloriosas riquezas em Cristo Jesus.',
    versiculo_chave: 'Filipenses 4:19 & Malaquias 3:10',
    direcionamento_laya: 'Deus é o dono do ouro e da prata. A libertação financeira começa na mente: com fidelidade no pouco, honestidade radical e corte corajoso de despesas desnecessárias. A bênção do Senhor enriquece e não acrescenta dores.',
    oracao_resposta: 'Senhor, Tu conheces cada conta e cada compromisso financeiro meu. Dá-me sabedoria como a de Salomão para administrar meus recursos. Abre portas de trabalho e provisão sobrenatural onde não vejo saída. Amém.',
    acao_pratica: 'Liste detalhadamente todas as suas dívidas em ordem de urgência. Entre em contato com pelo menos um credor para propor um plano realista de pagamento.'
  },
  {
    slug: 'casamento-familia',
    categoria: 'RELACIONAMENTO',
    titulo: 'Crises no Casamento e Conflitos na Família',
    palavras_chave: ['casamento', 'esposa', 'marido', 'filhos', 'familia', 'divorcio', 'briga', 'discussao', 'traicao', 'lar'],
    promessa_biblica: 'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses.',
    versiculo_chave: '1 Coríntios 13:4-7 & Efésios 4:32',
    direcionamento_laya: 'Um lar não desmorona da noite para o dia; ele esfria pela falta de oração, comunicação e perdão diário. Não lute contra a pessoa amada; lute pelo casamento de joelhos diante de Deus.',
    oracao_resposta: 'Senhor, sara a minha família. Coloca guarda na minha boca para não proferir ofensas. Ensina-me a amar incondicionalmente, a pedir perdão e a ser um instrumento de reconciliação dentro da minha casa. Amém.',
    acao_pratica: 'Faça um gesto concreto de carinho hoje sem cobrar nada em troca (prepare um café, envie uma mensagem afetuosa ou faça um elogio sincero).'
  },
  {
    slug: 'proposito-direcao',
    categoria: 'ESPIRITUAL',
    titulo: 'Falta de Sentido, Propósito e Direção',
    palavras_chave: ['proposito', 'sentido', 'direcao', 'chamado', 'vazio', 'perdido', 'futuro', 'o que fazer', 'escolha', 'vocacao'],
    promessa_biblica: 'Pois eu bem sei os planos que tenho a vosso respeito, diz o Senhor, planos de paz e não de mal, para vos dar o fim que esperais.',
    versiculo_chave: 'Jeremias 29:11 & Provérbios 3:5-6',
    direcionamento_laya: 'O seu propósito não é uma profissão isolada; o seu propósito primordial é glorificar a Deus e servir ao próximo onde você estiver colocado agora. A clareza vem com o movimento: sirva hoje com excelência no pouco.',
    oracao_resposta: 'Pai, revela-me o Teu propósito para este tempo. Não quero viver dias vazios ou correr atrás do vento. Ilumina os meus passos e guia as minhas escolhas para que minha vida deixe um legado eterno. Amém.',
    acao_pratica: 'Dedique 15 minutos hoje para escrever seus maiores talentos e como você pode usá-los para abençoar alguém esta semana.'
  },
  {
    slug: 'luto-dor',
    categoria: 'EMOCAO',
    titulo: 'Luto, Tristeza Profunda e Coração Partido',
    palavras_chave: ['luto', 'perda', 'morte', 'choro', 'tristeza', 'depressao', 'saudade', 'dor', 'solidao', 'desolado'],
    promessa_biblica: 'O Senhor está perto dos que têm o coração quebrantado e salva os de espírito abatido.',
    versiculo_chave: 'Salmo 34:18 & Apocalipse 21:4',
    direcionamento_laya: 'O choro pode durar uma noite, mas a alegria vem pela manhã. Deus não despreza as suas lágrimas; Ele as recolhe em Seu vaso. Permita-se sentir, mas não permita que a dor apague a esperança da ressurreição.',
    oracao_resposta: 'Consolador divino, derrama o bálsamo do Espírito Santo sobre a minha alma ferida. Abraça o meu coração neste dia difícil e sustenta as minhas pernas quando sinto que não vou aguentar. Amém.',
    acao_pratica: 'Conecte-se com um amigo de oração ou familiar querido. Fale sobre o que você está sentindo e não se isole no silêncio.'
  },
  {
    slug: 'fe-esperanca',
    categoria: 'ESPIRITUAL',
    titulo: 'Fé Abalada, Incerteza e Desânimo Espiritual',
    palavras_chave: ['fe', 'duvida', 'desanimo', 'frieza', 'oracao', 'esperanca', 'deus nao me ouve', 'crise de fe'],
    promessa_biblica: 'A fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.',
    versiculo_chave: 'Hebreus 11:1 & Isaías 40:31',
    direcionamento_laya: 'A fé não é ausência de dúvidas, é fidelidade a despeito delas. Mesmo quando você não vê o mover de Deus, Ele continua operando no invisível. A menor semente de fé é capaz de mover montanhas.',
    oracao_resposta: 'Senhor, eu creio, mas ajuda-me na minha incredulidade. Acende novamente a chama do Teu Espírito em meu interior. Eu me levanto hoje na certeza de que Tu estás vivo e operando. Amém.',
    acao_pratica: 'Escolha um versículo de promessa, escreva-o em um papel ou no espelho e medite nele ao acordar e ao se deitar.'
  }
];

// ── SERVIÇO PRINCIPAL DA LAYA ──
export class LayaEngine {
  constructor(dbRun, dbGet, dbAll) {
    this.dbRun = dbRun;
    this.dbGet = dbGet;
    this.dbAll = dbAll;
  }

  // Lista todos os mentores
  async getMentores() {
    try {
      if (this.dbAll) {
        const rows = await this.dbAll('SELECT * FROM tb_laya_mentores ORDER BY ordem ASC');
        if (rows && rows.length > 0) return rows;
      }
    } catch (e) {
      console.warn('[LayaEngine] Fallback para mentores em memória:', e.message);
    }
    return LAYA_MENTORES;
  }

  // Detalhes de um mentor específico
  async getMentorById(mentorId) {
    const list = await this.getMentores();
    return list.find(m => m.id === mentorId) || null;
  }

  // Lista conselhos de um mentor
  async getConselhosDoMentor(mentorId) {
    try {
      if (this.dbAll) {
        const rows = await this.dbAll('SELECT * FROM tb_laya_conselhos WHERE mentor_id = $1', [mentorId]);
        if (rows && rows.length > 0) return rows;
      }
    } catch (e) {
      console.warn('[LayaEngine] Fallback para conselhos em memória:', e.message);
    }
    return LAYA_CONSELHOS.filter(c => c.mentor_id === mentorId);
  }

  // Busca conselho específico de mentor por tema
  async getConselho(mentorId, tema) {
    const conselhos = await this.getConselhosDoMentor(mentorId);
    const exato = conselhos.find(c => c.tema === tema);
    if (exato) return exato;
    return conselhos[0] || null;
  }

  // Lista de temas gerais do Oráculo
  async getTemasOraculo() {
    try {
      if (this.dbAll) {
        const rows = await this.dbAll('SELECT * FROM tb_laya_oraculo_temas ORDER BY id ASC');
        if (rows && rows.length > 0) return rows;
      }
    } catch (e) {
      console.warn('[LayaEngine] Fallback para temas em memória:', e.message);
    }
    return LAYA_ORACULO_TEMAS;
  }

  // Consulta semântica no Oráculo da LAYA
  // Processamento rápido em CPU por pontuação de n-grams/keywords
  async consultarOraculo(queryText, categoria = null) {
    const normQuery = normalizeText(queryText);
    const temas = await this.getTemasOraculo();
    
    if (!normQuery && !categoria) {
      return {
        resultado: temas[0],
        matchScore: 1.0,
        mentorSugerido: LAYA_MENTORES[0]
      };
    }

    let bestTheme = null;
    let maxScore = -1;

    for (const tema of temas) {
      let score = 0;
      if (categoria && tema.categoria.toLowerCase() === categoria.toLowerCase()) {
        score += 2;
      }

      const words = normQuery.split(/\s+/).filter(w => w.length > 2);
      for (const word of words) {
        // Checa título e slug
        if (normalizeText(tema.titulo).includes(word)) score += 3;
        if (normalizeText(tema.slug).includes(word)) score += 3;
        
        // Checa palavras-chave do tema
        for (const kw of (tema.palavras_chave || [])) {
          const normKw = normalizeText(kw);
          if (normKw === word) score += 5;
          else if (normKw.includes(word) || word.includes(normKw)) score += 2;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestTheme = tema;
      }
    }

    // Se não encontrou match forte, usa tema mais próximo
    const selected = (maxScore > 0 && bestTheme) ? bestTheme : temas[0];

    // Mapeia mentor recomendado conforme o tema
    let mentorId = 'jesus';
    if (selected.slug.includes('financas')) mentorId = 'salomao';
    else if (selected.slug.includes('ansiedade') || selected.slug.includes('medo')) mentorId = 'davi';
    else if (selected.slug.includes('proposito')) mentorId = 'paulo';
    else if (selected.slug.includes('luto')) mentorId = 'jesus';

    const mentor = LAYA_MENTORES.find(m => m.id === mentorId) || LAYA_MENTORES[0];

    return {
      resultado: selected,
      matchScore: maxScore > 0 ? maxScore : 1,
      mentorSugerido: mentor
    };
  }
}
