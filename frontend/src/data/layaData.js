// ═════════════════════════════════════════════════════════════════
// LAYA DATA — Sabedoria Bíblica, Mentores Canônicos & Oráculo
// Suporte Nativo no Aplicativo, Zero Fricção, Alta Performance Offline
// ═════════════════════════════════════════════════════════════════

export const LAYA_MENTORES = [
  {
    id: 'jesus',
    nome: 'Jesus Cristo',
    titulo: 'O Mestre e Redentor',
    periodo: 'Evangelhos • O Verbo Vivo',
    descricao: 'A plenitude da graça, verdade e amor eterno. Ele ensina o caminho para a paz profunda, a salvação e a transformação do coração.',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
    ordem: 1,
    preco_desbloqueio: 0,
    especialidades: ['Paz', 'Graça', 'Salvação', 'Amor', 'Perdão'],
    frase_destaque: 'Vinde a mim todos os que estais cansados e oprimidos, e eu vos aliviarei.'
  },
  {
    id: 'salomao',
    nome: 'Rei Salomão',
    titulo: 'O Rei da Sabedoria',
    periodo: 'Provérbios & Eclesiastes',
    descricao: 'O homem mais sábio da história. Princípios de ouro sobre finanças, prudência, disciplina e negócios honrados.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    ordem: 2,
    preco_desbloqueio: 50,
    especialidades: ['Finanças', 'Sabedoria', 'Trabalho', 'Prudência'],
    frase_destaque: 'Os planos do diligente conduzem à abundância; a pressa leva à penúria.'
  },
  {
    id: 'davi',
    nome: 'Rei Davi',
    titulo: 'O Homem Segundo o Coração de Deus',
    periodo: 'Livro dos Salmos',
    descricao: 'Guerreiro e salmista que enfrentou gigantes e perseguições, rasgando a alma em adoração autêntica.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    ordem: 3,
    preco_desbloqueio: 70,
    especialidades: ['Superação do Medo', 'Adoração', 'Coragem'],
    frase_destaque: 'O Senhor é o meu pastor; de nada terei falta.'
  },
  {
    id: 'paulo',
    nome: 'Apóstolo Paulo',
    titulo: 'O Apóstolo dos Gentios',
    periodo: 'Epístolas Paulinas',
    descricao: 'Exemplo supremo de resiliência e foco ministerial. Ensina a transformar dor presente em peso eterno de glória.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    ordem: 4,
    preco_desbloqueio: 100,
    especialidades: ['Propósito', 'Resiliência', 'Fé Radical'],
    frase_destaque: 'Combati o bom combate, terminei a corrida, guardei a fé.'
  },
  {
    id: 'moises',
    nome: 'Moisés',
    titulo: 'O Libertador e Líder',
    periodo: 'Pentateuco',
    descricao: 'Conduziu um povo pelo deserto com paciência, liderança e intimidade face a face com o Criador.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    ordem: 5,
    preco_desbloqueio: 120,
    especialidades: ['Liderança', 'Direção Divina', 'Paciência'],
    frase_destaque: 'O Senhor pelejará por vós, e vós vos calareis.'
  },
  {
    id: 'ester',
    nome: 'Rainha Ester',
    titulo: 'A Rainha da Coragem',
    periodo: 'Livro de Ester',
    descricao: 'Posicionamento e sabedoria estratégica em tempo de crise que salvaram um povo da destruição.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ordem: 6,
    preco_desbloqueio: 140,
    especialidades: ['Coragem Estratégica', 'Jejum & Oração', 'Posicionamento'],
    frase_destaque: 'Quem sabe se não foi para um momento como este que você chegou ao reino?'
  }
];

export const LAYA_CONSELHOS = [
  {
    mentor_id: 'jesus',
    tema: 'ansiedade',
    titulo: 'O Descanso no Governo do Pai',
    versiculo_referencia: 'Mateus 6:33-34',
    texto_biblico: 'Buscai, pois, em primeiro lugar, o seu reino e a sua justiça, e todas estas coisas vos serão acrescentadas. Portanto, não vos inquieteis com o dia de amanhã.',
    conselho_doutrinario: 'A ansiedade tenta roubar a energia do presente projetando sombras no amanhã. Deus sustenta as aves e reveste as flores; você vale muito mais do que todas elas. Descanse no governo soberano do Pai.',
    oracao_guiada: 'Mestre amado, entrego a Ti toda a inquietação da minha mente. Eu escolho confiar que o meu amanhã está seguro em Tuas mãos. Recebo a Tua paz que excede todo o entendimento humano. Amém.',
    desafio_pratico: 'Respire fundo 3 vezes. Em silêncio, declare: "O Senhor cuida de mim agora". Recuse-se a antecipar preocupações nas próximas horas.'
  },
  {
    mentor_id: 'jesus',
    tema: 'perdao',
    titulo: 'O Perdão como Chave da Liberdade',
    versiculo_referencia: 'Lucas 23:34',
    texto_biblico: 'Pai, perdoa-lhes, porque não sabem o que fazem.',
    conselho_doutrinario: 'Perdoar não é concordar com a ofensa ou dizer que ela não doeu; perdoar é abrir a cela do prisioneiro e descobrir que o prisioneiro era você mesmo. A cruz é a prova de que a misericórdia triunfa sobre o juízo.',
    oracao_guiada: 'Senhor Jesus, liberta o meu peito de qualquer mágoa acumulada. Como recebi Tua graça imerecida, decido hoje liberar perdão a quem me feriu. Purifica o meu coração. Amém.',
    desafio_pratico: 'Ore uma bênção sincera pela vida da pessoa que te magoou. O amor desfaz o laço do ressentimento.'
  },
  {
    mentor_id: 'salomao',
    tema: 'financas',
    titulo: 'A Construção Honrada da Riqueza',
    versiculo_referencia: 'Provérbios 21:5',
    texto_biblico: 'Os planos do diligente conduzem à abundância, mas a pressa excessiva leva à penúria.',
    conselho_doutrinario: 'Quem busca enriquecimento rápido sem prudência cai em armadilhas. O crescimento sólido se alicerça no trabalho diligente, no controle rigoroso dos gastos e na recusa a atalhos fáceis.',
    oracao_guiada: 'Deus de sabedoria, concede-me inteligência financeira e domínio próprio. Que eu não seja escravo de desejos imediatistas, mas um administrador fiel daquilo que me confiaste. Amém.',
    desafio_pratico: 'Corte imediatamente um gasto supérfluo hoje e anote todos os seus custos fixos deste mês.'
  },
  {
    mentor_id: 'salomao',
    tema: 'sabedoria',
    titulo: 'A Escuta que Previne Erros Fatais',
    versiculo_referencia: 'Provérbios 15:22',
    texto_biblico: 'Sem conselho os projetos se frustram, mas com muitos conselheiros há bom êxito.',
    conselho_doutrinario: 'A soberba impede o homem de enxergar seus pontos cegos. Antes de dar um passo decisivo, busque conselho com pessoas comprovadas na fé e na prática.',
    oracao_guiada: 'Pai, dá-me ouvidos humildes e discernimento afiado para distinguir a voz da prudência das ilusões da vaidade. Amém.',
    desafio_pratico: 'Não tome decisões por impulso hoje. Espere 24 horas antes de qualquer compromisso de grande impacto.'
  },
  {
    mentor_id: 'davi',
    tema: 'medo',
    titulo: 'Derrubando os Gigantes da Mente',
    versiculo_referencia: '1 Samuel 17:45 / Salmo 27:1',
    texto_biblico: 'O Senhor é a minha luz e a minha salvação; de quem terei medo? O Senhor é a fortaleza da minha vida; a quem temerei?',
    conselho_doutrinario: 'Golias parecia invencível aos olhos dos homens, mas para quem conhece a grandeza de Deus, ele era apenas um homem mortal. O medo aumenta quando você olha para o problema; o medo morre quando você olha para o Todo-Poderoso.',
    oracao_guiada: 'Senhor dos Exércitos, repreende todo o pavor e covardia da minha mente. Eu me levanto revestido da Tua armadura celestial. A vitória pertence ao Senhor. Amém.',
    desafio_pratico: 'Escreva em um papel o maior obstáculo que você enfrenta e declare o Salmo 27:1 em voz audível sobre ele.'
  },
  {
    mentor_id: 'paulo',
    tema: 'proposito',
    titulo: 'Olhos Fixos na Coroa Incorruptível',
    versiculo_referencia: 'Filipenses 3:13-14',
    texto_biblico: 'Uma coisa faço: esquecendo-me das coisas que ficaram para trás e avançando para as que estão adiante, prossigo para o alvo.',
    conselho_doutrinario: 'O passado já não tem autoridade sobre você se o sangue de Cristo o redimiu. Não olhe para trás, nem para os tropeços nem para as glórias passadas. Mantenha os olhos fixos na vocação soberana.',
    oracao_guiada: 'Senhor Jesus, alinha o meu coração ao Teu propósito eterno. Livra-me das distrações mundanas e concede-me garra para concluir a jornada com integridade. Amém.',
    desafio_pratico: 'Defina hoje 1 hábito que você vai abandonar para ter mais tempo de oração e estudo da Palavra.'
  },
  {
    mentor_id: 'moises',
    tema: 'lideranca',
    titulo: 'A Força do Descanso no Deserto',
    versiculo_referencia: 'Êxodo 33:14',
    texto_biblico: 'A minha presença irá contigo, e eu te darei descanso.',
    conselho_doutrinario: 'A maior tentação de um líder ou condutor de família é tentar carregar a multidão nas próprias costas. Moisés quase se esgotou até aprender a delegar e depender da presença manifesta de Deus.',
    oracao_guiada: 'Senhor Deus, que a Tua presença seja a minha bússola inegociável. Não me deixes dar nenhum passo sem a Tua bênção. Ensina-me a liderar com mansidão e dependência total de Ti. Amém.',
    desafio_pratico: 'Se você lidera sua casa ou equipe, divida uma responsabilidade pesada com alguém hoje em vez de acumular tudo.'
  },
  {
    mentor_id: 'ester',
    tema: 'posicionamento',
    titulo: 'A Hora de Se Levantar com Fé e Estratégia',
    versiculo_referencia: 'Ester 4:14-16',
    texto_biblico: 'Vá e reúna todos os judeus... jejuem por mim. (...) Se for para perecer, que eu pereça!',
    conselho_doutrinario: 'Há momentos em que o silêncio se torna cumplicidade. Deus te posicionou onde você está não por acaso, mas com um propósito sagrado. Una a intercessão sincera à ação corajosa.',
    oracao_guiada: 'Pai do céu, concede-me ousadia santa para não me acovardar diante das pressões do ambiente. Usa a minha voz e minha postura para defender o que é justo e honrado. Amém.',
    desafio_pratico: 'Tome uma atitude ética que você vinha adiando por receio do que os outros iam pensar.'
  }
];

export const LAYA_TEMAS_ORACULO = [
  {
    slug: 'ansiedade-medo',
    categoria: 'EMOCAO',
    titulo: 'Ansiedade & Medo do Futuro',
    icone: 'shield',
    palavras_chave: ['ansiedade', 'medo', 'panico', 'angustia', 'preocupacao', 'futuro', 'insonia', 'nervoso', 'desespero'],
    promessa_biblica: 'O Senhor guardará em perfeita paz aquele cujo propósito está firme nele, porque nele confia.',
    versiculo_chave: 'Isaías 26:3 & Filipenses 4:6-7',
    direcionamento_laya: 'A ansiedade projeta tempestades em um tempo que ainda não existe. Deus não lhe dá graça para o amanhã hoje; Ele dá graça para o agora. Respire, ancore sua mente na fidelidade eterna de Deus.',
    oracao_resposta: 'Pai, eu esvazio o meu peito de todo medo e aperto. Eu declaro que os Teus planos para mim são de paz e não de mal, para me dar um futuro e uma esperança. Em nome de Jesus, amém.',
    acao_pratica: 'Desconecte-se de telas por 30 minutos. Beba água, feche os olhos e declare: "Deus está no controle total da minha vida".'
  },
  {
    slug: 'financas-dividas',
    categoria: 'VIDA_PRATICA',
    titulo: 'Finanças, Dívidas & Trabalho',
    icone: 'coins',
    palavras_chave: ['dinheiro', 'divida', 'desemprego', 'financeiro', 'falta', 'escassez', 'pagar', 'contas'],
    promessa_biblica: 'O meu Deus suprirá todas as vossas necessidades segundo as suas riquezas na glória em Cristo Jesus.',
    versiculo_chave: 'Filipenses 4:19 & Provérbios 3:9-10',
    direcionamento_laya: 'A libertação das dívidas e da escassez começa com a ordem interior: honestidade em cada centavo, fidelidade nos princípios e coragem para cortar excessos. O Senhor abençoa o trabalho diligente.',
    oracao_resposta: 'Senhor, Tu conheces cada compromisso meu. Concede-me sabedoria para administrar o que tenho e abre portas de honra e provisão sobrenatural. Amém.',
    acao_pratica: 'Escreva em uma folha todas as dívidas e corte 1 gasto desnecessário imediatamente.'
  },
  {
    slug: 'casamento-familia',
    categoria: 'RELACIONAMENTO',
    titulo: 'Casamento & Conflitos Familiares',
    icone: 'heart',
    palavras_chave: ['casamento', 'esposa', 'marido', 'filhos', 'familia', 'divorcio', 'briga', 'lar'],
    promessa_biblica: 'O amor é paciente, o amor é bondoso. Não inveja, não se orgulha, tudo sofre, tudo crê, tudo espera, tudo suporta.',
    versiculo_chave: '1 Coríntios 13:4-7 & Efésios 4:32',
    direcionamento_laya: 'Não lute contra quem você ama; lute pelo seu lar de joelhos diante de Deus. O orgulho ergue muros, mas a mansidão e o perdão restauram qualquer aliança.',
    oracao_resposta: 'Senhor, cura a minha família. Coloca guarda na minha boca para abençoar em vez de ferir. Que a Tua paz reine sobre o nosso teto. Amém.',
    acao_pratica: 'Surpreenda seu familiar com uma palavra de carinho ou um gesto concreto de serviço sem pedir nada em troca.'
  },
  {
    slug: 'proposito-direcao',
    categoria: 'ESPIRITUAL',
    titulo: 'Propósito de Vida & Decisões',
    icone: 'compass',
    palavras_chave: ['proposito', 'sentido', 'direcao', 'chamado', 'vazio', 'perdido', 'o que fazer'],
    promessa_biblica: 'Pois eu bem sei os planos que tenho a vosso respeito, diz o Senhor, planos de paz e não de mal.',
    versiculo_chave: 'Jeremias 29:11 & Provérbios 3:5-6',
    direcionamento_laya: 'O seu propósito primordial é glorificar a Deus e ser bênção onde você está hoje. Quando você serve fielmente no pouco, Deus abre o caminho para o muito.',
    oracao_resposta: 'Pai celestial, revela-me o Teu propósito para esta estação. Guia os meus passos e afasta-me de tudo aquilo que me distrai do Teu Reino. Amém.',
    acao_pratica: 'Escreva seus maiores dons e escolha 1 forma prática de usá-los para ajudar alguém hoje.'
  },
  {
    slug: 'luto-dor',
    categoria: 'EMOCAO',
    titulo: 'Luto, Perda & Tristeza',
    icone: 'sun',
    palavras_chave: ['luto', 'perda', 'morte', 'choro', 'tristeza', 'depressao', 'saudade', 'dor', 'solidao'],
    promessa_biblica: 'O Senhor está perto dos que têm o coração quebrantado e salva os de espírito abatido.',
    versiculo_chave: 'Salmo 34:18 & Apocalipse 21:4',
    direcionamento_laya: 'Deus recolhe cada uma das suas lágrimas. A dor da perda é real, mas ela não tem a última palavra: a ressurreição e a esperança em Cristo sustentam a alma ferida.',
    oracao_resposta: 'Consolador divino, derrama Teu bálsamo sobre a minha alma. Sustenta-me quando as forças faltarem e renova a minha esperança. Amém.',
    acao_pratica: 'Permita-se chorar e desabafar com Deus ou com uma pessoa de confiança. Não carregue o luto no isolamento.'
  },
  {
    slug: 'fe-esperanca',
    categoria: 'ESPIRITUAL',
    titulo: 'Fé Abalada & Incerteza',
    icone: 'flame',
    palavras_chave: ['fe', 'duvida', 'desanimo', 'frieza', 'esperanca', 'crise de fe'],
    promessa_biblica: 'A fé é a certeza daquilo que esperamos e a prova das coisas que não vemos.',
    versiculo_chave: 'Hebreus 11:1 & Isaías 40:31',
    direcionamento_laya: 'Ter fé não significa nunca ter dúvidas, significa continuar marchando a despeito delas. Deus continua agindo mesmo no silêncio aparente.',
    oracao_resposta: 'Senhor, eu creio! Ajuda-me na minha fraqueza e reaviva o fogo da fé em meu espírito. Eu declaro que Tu continuas reinando. Amém.',
    acao_pratica: 'Leia em voz alta o capítulo 11 de Hebreus e agradeça pelas promessas de Deus cumpridas no passado.'
  }
];

// ── FUNÇÃO DE CONSULTA SEMÂNTICA OFFLINE/CLIENT-SIDE ──
export function consultarOraculoLocal(texto, categoria = null) {
  if (!texto && !categoria) {
    return {
      resultado: LAYA_TEMAS_ORACULO[0],
      matchScore: 1,
      mentorSugerido: LAYA_MENTORES[0]
    };
  }

  const queryNorm = (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  const words = queryNorm.split(/\s+/).filter(w => w.length > 2);
  let bestTheme = null;
  let maxScore = -1;

  for (const tema of LAYA_TEMAS_ORACULO) {
    let score = 0;
    if (categoria && tema.categoria.toLowerCase() === categoria.toLowerCase()) score += 2;

    for (const w of words) {
      if (tema.titulo.toLowerCase().includes(w)) score += 3;
      if (tema.slug.includes(w)) score += 3;
      for (const kw of tema.palavras_chave) {
        const kwNorm = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (kwNorm === w) score += 5;
        else if (kwNorm.includes(w) || w.includes(kwNorm)) score += 2;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestTheme = tema;
    }
  }

  const selected = (maxScore > 0 && bestTheme) ? bestTheme : LAYA_TEMAS_ORACULO[0];

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
