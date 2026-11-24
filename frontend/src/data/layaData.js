// ═════════════════════════════════════════════════════════════════
// LAYA DATA — Sabedoria Bíblica, Mentores Canônicos & Oráculo
// Suporte Nativo no Aplicativo, Zero Fricção, Alta Performance Offline
// ═════════════════════════════════════════════════════════════════

import jesusImg from '../assets/mentores/jesus.png';
import salomaoImg from '../assets/mentores/salomao.png';
import daviImg from '../assets/mentores/davi.png';
import pauloImg from '../assets/mentores/paulo.png';
import moisesImg from '../assets/mentores/moises.png';
import esterImg from '../assets/mentores/ester.png';
import mariaImg from '../assets/mentores/maria.png';

export const LAYA_MENTORES = [
  {
    id: 'jesus',
    nome: 'Jesus Cristo',
    titulo: 'O Mestre e Redentor',
    periodo: 'Evangelhos • O Verbo Vivo',
    avatar: jesusImg,
    ordem: 1,
    preco_desbloqueio: 0,
    especialidades: ['Paz Profunda', 'Graça & Salvação', 'Amor Incondicional', 'Perdão Radical'],
    frase_destaque: 'Vinde a mim todos os que estais cansados e oprimidos, e eu vos aliviarei.',
    versiculo_chave: 'João 14:6 & Mateus 11:28-30',
    biografia: 'O Filho de Deus encarnado, Autor e Consumador da Fé. Andou entre os homens ensinando o amor sacrificial, curando enfermos, perdoando pecados e vencendo a própria morte na cruz para reconciliar a humanidade com o Pai.',
    contexto_historico: 'Viveu na Judeia e Galileia sob ocupação romana. Revolucionou a história humana ensinando que o Reino de Deus não se conquista pela força das armas, mas pela pureza de coração, mansidão e rendição ao Pai.',
    pilares_sabedoria: [
      { titulo: 'Amor Sacrificial', desc: 'Amar a Deus sobre todas as coisas e ao próximo como a si mesmo, inclusive os inimigos.' },
      { titulo: 'Descanso no Pai', desc: 'Não viver ansioso pelo amanhã; o Pai celestial cuida de cada detalhe.' },
      { titulo: 'Perdão Restaurador', desc: 'Perdoar sem limites para que o próprio coração permaneça livre de amarguras.' }
    ],
    saudacao_chat: 'A paz seja convosco. Eu conheço as aflições do seu coração e vi cada uma de suas lágrimas. O que tem pesado sobre a sua alma hoje?',
    exemplos_perguntas: [
      'Como encontrar paz no meio de tanta tribulação?',
      'O que preciso fazer para ser salvo?',
      'Como perdoar alguém que me feriu profundamente?'
    ]
  },
  {
    id: 'salomao',
    nome: 'Rei Salomão',
    titulo: 'O Rei da Sabedoria',
    periodo: 'Provérbios & Eclesiastes',
    avatar: salomaoImg,
    ordem: 2,
    preco_desbloqueio: 50,
    especialidades: ['Finanças & Gestão', 'Sabedoria Prática', 'Trabalho Diligente', 'Prudência Contratual'],
    frase_destaque: 'Os planos do diligente conduzem à abundância; a pressa leva à penúria.',
    versiculo_chave: 'Provérbios 3:13-14 & Provérbios 21:5',
    biografia: 'Filho de Davi, terceiro rei de Israel. Quando Deus lhe ofereceu riquezas ou vida longa, pediu apenas discernimento para governar com justiça. Tornou-se o homem mais sábio e próspero de sua era, registrando princípios atemporais de administração e conduta.',
    contexto_historico: 'Governou no ápice do Império de Israel, construiu o Primeiro Templo de Jerusalém e gerenciou frotas comerciais internacionais, provando que a bênção do Senhor enriquece e não traz dores.',
    pilares_sabedoria: [
      { titulo: 'Prudência Financeira', desc: 'Fugir das dívidas e de garantias arriscadas; poupar no tempo da fartura.' },
      { titulo: 'Diligência Diária', desc: 'O trabalho constante e honesto constrói patrimônio sólido; a preguiça atrai a ruína.' },
      { titulo: 'Temor ao Senhor', desc: 'O princípio da verdadeira sabedoria é reverenciar a Deus em cada decisão.' }
    ],
    saudacao_chat: 'A paz do Senhor. A sabedoria é melhor que o ouro e o bom senso mais valioso que a prata. Qual decisão ou desafio financeiro você precisa discernir hoje?',
    exemplos_perguntas: [
      'Como sair das dívidas e prosperar com honra?',
      'Como saber se devo fechar uma sociedade ou negócio?',
      'Como vencer a pressa e a impulsividade nas decisões?'
    ]
  },
  {
    id: 'davi',
    nome: 'Rei Davi',
    titulo: 'O Homem Segundo o Coração de Deus',
    periodo: 'Livro dos Salmos • 1 & 2 Samuel',
    avatar: daviImg,
    ordem: 3,
    preco_desbloqueio: 70,
    especialidades: ['Superação do Medo', 'Adoração & Louvor', 'Coragem nas Batalhas', 'Quebrantamento'],
    frase_destaque: 'O Senhor é o meu pastor; de nada terei falta.',
    versiculo_chave: 'Salmo 23:1 & 1 Samuel 17:45',
    biografia: 'O menino pastor de ovelhas ungido por Samuel. Com uma funda e cinco pedras derrubou o gigante Golias. Perseguido em cavernas por anos, tornou-se rei e unificou Israel. Quando errou, rasgou a alma em arrependimento genuíno diante do Todo-Poderoso.',
    contexto_historico: 'Conheceu a solidão dos campos, a hostilidade do rei Saul e os perigos da guerra. Compôs dezenas de salmos que ensinam a orar tanto no abismo da aflição quanto no cume da vitória.',
    pilares_sabedoria: [
      { titulo: 'Coragem em Deus', desc: 'Gigantes não caem com armaduras terrenas, mas no nome do Senhor dos Exércitos.' },
      { titulo: 'Coração Quebrantado', desc: 'Deus não despreza o coração contrito; o perdão restaura a comunhão.' },
      { titulo: 'Louvor na Tempestade', desc: 'Adorar antes da vitória transforma o ambiente e renova a força interior.' }
    ],
    saudacao_chat: 'A paz do Senhor, meu irmão! De pastor esquecido no pasto a rei ungido, aprendi que nenhum gigante resiste ao Deus vivo. Qual batalha está diante de você agora?',
    exemplos_perguntas: [
      'Como ter coragem quando o medo e as ameaças parecem gigantes?',
      'Como recomeçar depois de ter errado e falhado gravemente?',
      'Como orar quando me sinto abandonado na caverna da solidão?'
    ]
  },
  {
    id: 'paulo',
    nome: 'Apóstolo Paulo',
    titulo: 'O Apóstolo dos Gentios',
    periodo: 'Epístolas Paulinas • Atos dos Apóstolos',
    avatar: pauloImg,
    ordem: 4,
    preco_desbloqueio: 100,
    especialidades: ['Propósito de Vida', 'Resiliência Suprema', 'Foco Ministerial', 'Alegria nas Prisões'],
    frase_destaque: 'Combati o bom combate, terminei a corrida, guardei a fé.',
    versiculo_chave: 'Filipenses 4:13 & 2 Timóteo 4:7',
    biografia: 'De perseguidor implacável dos cristãos no caminho de Damasco a maior missionário da Igreja Primitiva. Naufragou, foi apedrejado e preso, mas fundou igrejas por todo o mundo greco-romano e redigiu a maior parte da doutrina do Novo Testamento.',
    contexto_historico: 'Cidadão romano e fariseu erudito, renunciou a todo prestígio terreno por amor a Cristo. Escreveu as cartas mais alegres e profundas da Bíblia de dentro de masmorras escuras.',
    pilares_sabedoria: [
      { titulo: 'Foco no Alvo', desc: 'Esquecer o que ficou para trás e avançar para o que está adiante, olhando para Cristo.' },
      { titulo: 'Contentamento em Tudo', desc: 'Aprender a viver na fartura ou na escassez: tudo posso naquele que me fortalece.' },
      { titulo: 'Graça Suficiente', desc: 'O poder de Deus se aperfeiçoa na nossa fraqueza; quando sou fraco, sou forte.' }
    ],
    saudacao_chat: 'Graça e paz da parte de Deus Pai e de nosso Senhor Jesus Cristo! Escrevi algumas das minhas maiores mensagens em correntes. Qual desafio ou cansaço está testando o seu propósito?',
    exemplos_perguntas: [
      'Como não desanimar diante de tanta oposição e cansaço?',
      'Como descobrir o verdadeiro chamado e propósito da minha vida?',
      'Como suportar um espinho na carne que parece não ter fim?'
    ]
  },
  {
    id: 'moises',
    nome: 'Moisés',
    titulo: 'O Libertador e Líder',
    periodo: 'Pentateuco • Êxodo ao Deuteronômio',
    avatar: moisesImg,
    ordem: 5,
    preco_desbloqueio: 120,
    especialidades: ['Liderança Sob Pressão', 'Direção Divina', 'Paciência no Deserto', 'Intimidade com Deus'],
    frase_destaque: 'O Senhor pelejará por vós, e vós vos calareis.',
    versiculo_chave: 'Êxodo 14:14 & Números 12:3',
    biografia: 'Salvo das águas do Nilo, educado como príncipe do Egito. Passou 40 anos cuidando de ovelhas em Midiã até que Deus lhe falou na sarça ardente. Liderou a libertação de mais de 2 milhões de hebreus e recebeu as Tábuas da Lei no Monte Sinai.',
    contexto_historico: 'Confrontou o faraó mais poderoso da terra com o bordão de Deus. Guiou um povo rebelde por 40 anos no deserto, mantendo intimidade face a face com o Criador.',
    pilares_sabedoria: [
      { titulo: 'Firmeza e Mansidão', desc: 'A autoridade legítima vem da humildade e da dependência total da voz de Deus.' },
      { titulo: 'Paciência na Jornada', desc: 'O deserto não é morada eterna, é escola de dependência para a Terra Prometida.' },
      { titulo: 'A Presença Acima de Tudo', desc: 'Se a Tua presença não for conosco, não nos faças subir deste lugar.' }
    ],
    saudacao_chat: 'Que o Eterno te abençoe e te guarde. Conduzi um povo inteiro pelo deserto entre o Mar Vermelho e as montanhas. O que tem parecido um beco sem saída na sua caminhada?',
    exemplos_perguntas: [
      'Como liderar minha família quando há desânimo e queixas?',
      'O que fazer quando estou no meio de um deserto na minha vida?',
      'Como ouvir a voz de Deus com clareza em momentos decisivos?'
    ]
  },
  {
    id: 'ester',
    nome: 'Rainha Ester',
    titulo: 'A Rainha da Coragem',
    periodo: 'Livro de Ester • Império Persa',
    avatar: esterImg,
    ordem: 6,
    preco_desbloqueio: 140,
    especialidades: ['Coragem Estratégica', 'Jejum & Intercessão', 'Posicionamento Santo', 'Proteção do Povo'],
    frase_destaque: 'Quem sabe se não foi para um momento como este que você chegou ao reino?',
    versiculo_chave: 'Ester 4:14-16 & Provérbios 31:25',
    biografia: 'Órfã criada pelo primo Mardoqueu na Pérsia. Tornou-se rainha de 127 províncias. Diante do decreto de extermínio contra o seu povo, convocou jejum de três dias e arriscou a própria vida perante o rei Assuero para interceder pelos inocentes.',
    contexto_historico: 'Numa corte opulenta e perigosa, soube a hora de calar e o momento exato de agir com elegância e firmeza espiritual, invertendo a forca do inimigo em salvação nacional.',
    pilares_sabedoria: [
      { titulo: 'Posicionamento Decisivo', desc: 'Não fugir da responsabilidade sagrada quando o destino de outros depende de sua voz.' },
      { titulo: 'Estratégia no Espírito', desc: 'Antes de falar aos poderosos na terra, dobre os joelhos em jejum e oração perante o Rei dos Céus.' },
      { titulo: 'Prudência e Graça', desc: 'A coragem verdadeira não é agressiva; ela se veste de dignidade, momento oportuno e sabedoria.' }
    ],
    saudacao_chat: 'A paz do Senhor esteja sobre você. Estive diante de situações em que o perigo era mortal, mas o posicionamento em Deus mudou a história. Onde você precisa de coragem hoje?',
    exemplos_perguntas: [
      'Como me posicionar com firmeza sem perder a sabedoria e a graça?',
      'Como agir em ambientes hostis onde meus valores são desafiados?',
      'Como transformar o medo da rejeição em coragem sagrada?'
    ]
  },
  {
    id: 'maria',
    nome: 'Maria Mãe de Jesus',
    titulo: 'Exemplo de Devoção e Graça',
    periodo: 'Evangelhos • Maternidade Sagrada',
    avatar: mariaImg,
    ordem: 7,
    preco_desbloqueio: 150,
    especialidades: ['Devoção e Rendição', 'Humildade Profunda', 'Fé no Impossível', 'Cuidado da Família'],
    frase_destaque: 'Eis aqui a serva do Senhor; cumpra-se em mim segundo a tua palavra.',
    versiculo_chave: 'Lucas 1:38 & Lucas 2:19',
    biografia: 'Jovem humilde de Nazaré escolhida pelo Todo-Poderoso para gerar o Salvador do mundo. Respondeu ao anjo com submissão perfeita. Acompanhou o ministério de Jesus desde a manjedoura até a cruz, guardando e meditando todas as promessas em seu coração.',
    contexto_historico: 'Enfrentou o preconceito social de uma gravidez antes do casamento formal e a fuga para o Egito para proteger o bebê. Modelo de serenidade e firmeza silenciosa sob a vontade de Deus.',
    pilares_sabedoria: [
      { titulo: 'Entrega Serena', desc: 'Dizer "sim" à vontade soberana de Deus, mesmo quando ela quebra os nossos próprios planos.' },
      { titulo: 'Meditação no Coração', desc: 'Guardar as promessas divinas no íntimo da alma em vez de reagir com impulsividade.' },
      { titulo: 'Fidelidade nos Piores Momentos', desc: 'Permanecer aos pés da cruz quando muitos fogem, sustentada pela promessa da ressurreição.' }
    ],
    saudacao_chat: 'A graça e a paz do Senhor encham o seu ser. Eu vi Deus realizar o impossível onde havia apenas simplicidade e entrega. O que tem afligido o seu coração ou a sua família?',
    exemplos_perguntas: [
      'Como confiar em Deus quando o futuro parece incerto e assustador?',
      'Como cuidar do meu lar e dos meus filhos com sabedoria e paz?',
      'Como aprender a meditar em Deus em vez de me desesperar?'
    ]
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
    oracao_guiada: 'Pai celeste, entrego em Tuas mãos o dia de amanhã. Arranca do meu peito o medo do que ainda não aconteceu e firma meus passos no Teu Reino hoje. Amém.',
    desafio_pratico: 'Faça 3 respirações profundas orando em silêncio: "O Senhor é o meu pastor, nada me faltará".'
  },
  {
    mentor_id: 'salomao',
    tema: 'financas',
    titulo: 'A Diligência e a Ordem nas Finanças',
    versiculo_referencia: 'Provérbios 21:5 & Provérbios 22:7',
    texto_biblico: 'Os planos do diligente conduzem à abundância, mas a pressa excessiva leva à penúria. O rico domina sobre o pobre, e o que toma emprestado é servo do que empresta.',
    conselho_doutrinario: 'A prosperidade segundo Deus é fruto de ordem moral, economia no tempo de colheita e honestidade absoluta. Evite comprometer o seu futuro com dívidas impensadas e valorize o trabalho feito com esmero.',
    oracao_guiada: 'Senhor da Sabedoria, ensina-me a governar meus recursos com disciplina. Livra-me do espírito consumista e dá-me visão para plantar com generosidade e colher com honra. Amém.',
    desafio_pratico: 'Anote todos os seus gastos desta semana e corte imediatamente uma despesa fútil.'
  },
  {
    mentor_id: 'davi',
    tema: 'medo',
    titulo: 'Vencendo Gigantes na Força do Senhor',
    versiculo_referencia: 'Salmo 27:1 & 1 Samuel 17:45',
    texto_biblico: 'O Senhor é a minha luz e a minha salvação; de quem terei medo? Tu vens contra mim com espada e lança, mas eu vou contra ti em nome do Senhor dos Exércitos.',
    conselho_doutrinario: 'O tamanho do seu gigante apenas reflete o tamanho da vitória que Deus preparou para você. Não meça o problema pelas suas forças humanas, mas pela fidelidade Daquele que te chamou pelo nome.',
    oracao_guiada: 'Senhor dos Exércitos, repreende o pavor e a covardia do meu espírito. Enche-me da mesma ousadia santa que derrubou Golias. Que os meus olhos vejam a Tua glória nesta batalha. Amém.',
    desafio_pratico: 'Declare em voz alta agora: "Nenhum mal me atingirá, pois o Altíssimo é o meu refúgio".'
  },
  {
    mentor_id: 'paulo',
    tema: 'resiliencia',
    titulo: 'A Força que Nasce na Fraqueza',
    versiculo_referencia: '2 Coríntios 12:9-10 & Filipenses 4:13',
    texto_biblico: 'A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza. Por isso sinto prazer nas fraquezas e perseguições por amor de Cristo; pois quando sou fraco, então é que sou forte.',
    conselho_doutrinario: 'O sofrimento não é o fim da sua história, é o cadinho onde o seu caráter é forjado. Quando as circunstâncias externas parecem desmoronar, a graça interior de Cristo sustenta e multiplica a sua capacidade de perseverar.',
    oracao_guiada: 'Pai querido, quando o cansaço bater à porta, lembra-me de que a Tua graça me basta. Que a minha fraqueza seja o palco onde o Teu poder se manifestará com excelência. Amém.',
    desafio_pratico: 'Agradeça a Deus por uma dificuldade atual, pedindo a Ele discernimento para aprender a lição contida nela.'
  },
  {
    mentor_id: 'moises',
    tema: 'lideranca',
    titulo: 'A Quietude diante do Mar Vermelho',
    versiculo_referencia: 'Êxodo 14:13-15',
    texto_biblico: 'Moisés, porém, disse ao povo: Não temais; aquietai-vos e vede o livramento do Senhor que hoje vos fará... O Senhor pelejará por vós, e vós vos calareis.',
    conselho_doutrinario: 'Quando você estiver cercado por montes de um lado e o exército inimigo do outro, a resposta de Deus não é o pânico, mas a quietude vigilante. Deus abre caminhos no meio das águas profundas.',
    oracao_guiada: 'Deus de Abraão, de Isaque e de Jacó, dá-me a mansidão e a paciência de esperar a Tua nuvem se mover. Não permitas que a pressa ou a murmuração me façam retroceder. Amém.',
    desafio_pratico: 'Passe o dia sem fazer nenhuma reclamação sobre o trânsito, o clima ou pessoas.'
  },
  {
    mentor_id: 'ester',
    tema: 'coragem',
    titulo: 'A Hora Decisiva do Posicionamento',
    versiculo_referencia: 'Ester 4:14-16',
    texto_biblico: 'Pois, se de todo te calares agora, socorro e livramento de outra parte se levantarão... e quem sabe se não foi para um momento como este que chegaste ao reino? ...se perecer, pereci.',
    conselho_doutrinario: 'Há momentos em que o silêncio se torna cumplicidade. Deus te posicionou onde você está não por acaso, mas com um propósito sagrado. Una a intercessão sincera à ação corajosa.',
    oracao_guiada: 'Pai do céu, concede-me ousadia santa para não me acovardar diante das pressões do ambiente. Usa a minha voz e minha postura para defender o que é justo e honrado. Amém.',
    desafio_pratico: 'Tome uma atitude ética que você vinha adiando por receio do que os outros iam pensar.'
  },
  {
    mentor_id: 'maria',
    tema: 'devocao',
    titulo: 'A Entrega Total e a Paz de Confiar em Deus',
    versiculo_referencia: 'Lucas 1:38 & Lucas 2:19',
    texto_biblico: 'Disse então Maria: Eis aqui a serva do Senhor; cumpra-se em mim segundo a tua palavra. (...) Maria, porém, guardava todas estas coisas, meditando-as no seu coração.',
    conselho_doutrinario: 'A verdadeira grandeza diante de Deus começa na rendição silenciosa e humilde. Quando você entrega os seus planos ao Senhor e aprende a meditar nas Suas promessas no íntimo do coração, o medo do desconhecido se dissipa diante da soberania do Pai.',
    oracao_guiada: 'Pai Eterno, que eu tenha a docilidade e a mansidão de confiar inteiramente nos Teus desígnios para a minha história. Que a Tua santa vontade se cumpra em minha vida e em meu lar. Amém.',
    desafio_pratico: 'Passe 5 minutos em silêncio hoje, sem pedir nada, apenas agradecendo a Deus por Sua fidelidade e guardando as promessas Dele no coração.'
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

// ═════════════════════════════════════════════════════════════════
// LAYA INTEL — BASE DOUTRINÁRIA EXPANDIDA & VARIAÇÃO ANTI-REPETIÇÃO
// Mapeamento amplo de intenções teológicas e práticas de vida
// ═════════════════════════════════════════════════════════════════

const BANCO_INTENCOES_MENTORES = {
  // ── 1. JESUS CRISTO ──
  jesus: [
    {
      intent: 'SALVACAO_ETERNIDADE',
      palavras: ['salvo', 'salva', 'salvar', 'salvacao', 'ceu', 'vida eterna', 'eterna', 'paraíso', 'morte', 'morrer', 'inferno', 'condenacao', 'novo nascimento', 'nascer de novo', 'reino de deus', 'evangelho', 'salvação', 'perdido'],
      respostas: [
        {
          texto: 'Em verdade, em verdade te digo que aquele que não nascer de novo não pode ver o Reino de Deus. A salvação não é uma conquista humana nem o resultado de boas obras para que ninguém se glorie; ela nasce do arrependimento sincero e da fé no Filho que o Pai enviou por amor. Eu sou o caminho, a verdade e a vida; ninguém vem ao Pai senão por mim.',
          versiculo: 'João 3:3-5 & João 14:6',
          acao: 'Faça agora uma oração sincera: "Senhor Jesus, eu creio que Tu és o Filho de Deus. Perdoa os meus pecados e escreve o meu nome no Livro da Vida".'
        },
        {
          texto: 'Eu sou a porta das ovelhas; se alguém entrar por mim, salvar-se-á, e entrará, e sairá, e achará pastagens. Para ser salvo, você não precisa realizar o impossível: se com a sua boca você confessar que Eu sou o Senhor e em seu coração crer que Deus me ressuscitou dos mortos, serás salvo. Todo aquele que invocar o Meu nome jamais será confundido.',
          versiculo: 'João 10:9 & Romanos 10:9-10',
          acao: 'Declare com fé em voz alta: "Jesus Cristo é o único Senhor e Salvador da minha vida".'
        },
        {
          texto: 'Lembra-se do jovem que me perguntou o que deveria fazer para herdar a vida eterna? Ele cumpria mandamentos, mas o seu coração estava aprisionado às suas posses e seguranças terrenas. Para ser salvo, é preciso abrir mão de salvar a si mesmo, renunciar à justiça própria e me seguir de coração inteiro. A salvação é gratuita pela graça, mas exige a entrega total do seu coração.',
          versiculo: 'Marcos 10:17-21 & Efésios 2:8-9',
          acao: 'Entregue no altar do Senhor a área que você mais tinha receio de renunciar.'
        }
      ]
    },
    {
      intent: 'ANSIEDADE_MEDO_FUTURO',
      palavras: ['ansiedade', 'ansioso', 'preocupacao', 'preocupado', 'futuro', 'amanha', 'paz', 'insonia', 'dormir', 'panico', 'angustia', 'desespero', 'acalm', 'medo', 'aperto'],
      respostas: [
        {
          texto: 'Por que o seu coração está inquieto? Observe os lírios do campo: eles não trabalham nem fiam, contudo nem Salomão em toda a sua glória se vestiu como um deles. Não vos inquieteis pelo dia de amanhã; o dia de amanhã cuidará de si mesmo. Entregue o seu fardo a mim agora e busque em primeiro lugar o Reino e a Sua justiça.',
          versiculo: 'Mateus 6:33-34',
          acao: 'Respire fundo em paz agora mesmo e declare: "O Senhor cuida de mim no dia de hoje".'
        },
        {
          texto: 'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize. As tempestades ao redor não têm poder para afundar o barco quando Eu estou nele. Descanse na Minha soberania: nenhuma folha cai sem o consentimento do vosso Pai que está nos céus.',
          versiculo: 'João 14:27 & Mateus 8:26',
          acao: 'Feche os olhos por 2 minutos e repita mentalmente: "A paz de Cristo governa os meus pensamentos".'
        },
        {
          texto: 'Quem de vós, por mais ansioso que esteja, pode acrescentar um único côvado ao curso da sua vida? A ansiedade é a tentativa da criatura de carregar o fardo que pertence apenas ao Criador. Vinde a mim vós todos que estais cansados e sobrecarregados, e Eu vos darei descanso verdadeiro.',
          versiculo: 'Lucas 12:25-26 & Mateus 11:28',
          acao: 'Escreva em um papel o motivo exato da sua aflição e diga a Deus: "Senhor, isto agora está nas Tuas mãos".'
        }
      ]
    },
    {
      intent: 'PERDAO_MAGOA_OFENSA',
      palavras: ['perdoar', 'perdao', 'magoa', 'rancor', 'ofensa', 'traicao', 'traiu', 'injustica', 'raiva', 'odio', 'vinganca', 'inimigo', 'machucou', 'feriu', 'ofendeu'],
      respostas: [
        {
          texto: 'Se perdoardes aos homens as suas ofensas, também vosso Pai celeste vos perdoará; se, porém, não perdoardes, o vosso Pai também não vos perdoará. O perdão não valida o erro do outro; o perdão liberta a sua alma da prisão do ressentimento. Na cruz, eu roguei pelos que me cravavam os cravos: "Pai, perdoa-lhes, porque não sabem o que fazem".',
          versiculo: 'Mateus 6:14-15 & Lucas 23:34',
          acao: 'Diga em oração neste instante: "Em nome de Jesus, eu decido liberar perdão a quem me feriu".'
        },
        {
          texto: 'Quando Pedro me perguntou se deveria perdoar até sete vezes, respondi: "Não te digo até sete vezes, mas até setenta vezes sete". O amor sacrificial não guarda registro de malícias. Não permita que a amargura crie raízes no seu peito; abençoe os que te perseguem e você experimentará a leveza dos filhos de Deus.',
          versiculo: 'Mateus 18:21-22 & Romanos 12:14',
          acao: 'Ore especificamente pela pessoa que te magoou, pedindo a Deus que a alcance com misericórdia.'
        }
      ]
    },
    {
      intent: 'PECADO_CULPA_QUEDA',
      palavras: ['pecado', 'pequei', 'errei', 'falhei', 'culpa', 'culpado', 'vergonha', 'impureza', 'vicio', 'queda', 'cair', 'restaurar', 'misericordia', 'condenado'],
      respostas: [
        {
          texto: 'Nem eu tampouco te condeno; vá e não peques mais. Os sãos não precisam de médico, mas sim os doentes; eu não vim chamar justos, mas pecadores ao arrependimento. O Meu sangue vertido na cruz é poderoso para purificar a sua consciência de toda obra morta. Levante a cabeça: há festa no céu quando um coração se arrepende.',
          versiculo: 'João 8:11 & Lucas 5:31-32',
          acao: 'Abandone a culpa paralisante; confesse a Deus e receba a graça que te levanta para andar em santidade.'
        },
        {
          texto: 'Se confessarmos os nossos pecados, Ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça. Não fuja da Minha presença como Adão fugiu no jardim; venha como o filho pródigo, sujo e cansado, pois os braços do Pai estão abertos para te vestir com vestes de honra.',
          versiculo: '1 João 1:9 & Lucas 15:20-24',
          acao: 'Faça uma oração de confissão sincera e tome a decisão prática de fugir da ocasião de pecado.'
        }
      ]
    },
    {
      intent: 'AMOR_AO_PROXIMO_BOM_SAMARITANO',
      palavras: ['proximo', 'proximo?', 'bom samaritano', 'samaritano', 'amar o proximo', 'quem e meu proximo', 'vizinho', 'ajudar', 'misericordia', 'compaixao', 'inimigos', 'amar'],
      respostas: [
        {
          texto: 'Um homem descia de Jerusalém para Jericó e caiu nas mãos de salteadores, que o despiram e espancaram. Passaram um sacerdote e um levita, e ambos desviaram pelo outro lado. Mas um samaritano, que ia de viagem, aproximou-se, moveu-se de íntima compaixão e cuidou das suas feridas. Qual dos três te parece ter sido o próximo daquele homem? Aquele que usou de misericórdia para com ele. O seu próximo não é quem você escolhe por conveniência, mas qualquer pessoa que Deus colocar no seu caminho necessitada de socorro. Vai, e faze tu o mesmo.',
          versiculo: 'Lucas 10:30-37',
          acao: 'Demonstre compaixão prática hoje por alguém que não pode te retribuir o favor.'
        },
        {
          texto: 'O primeiro e maior mandamento é: Amarás o Senhor teu Deus de todo o teu coração, de toda a tua alma e de todo o teu entendimento. E o segundo, semelhante a este, é: Amarás o teu próximo como a ti mesmo. Destes dois mandamentos dependem toda a Lei e os Profetas. Se você diz amar a Deus a quem não vê, mas não tem amor ao próximo que vê, a verdade ainda não está em você.',
          versiculo: 'Mateus 22:37-40 & 1 João 4:20',
          acao: 'Trate hoje o próximo com a mesma paciência e generosidade que você gostaria de receber.'
        }
      ]
    },
    {
      intent: 'CASAMENTO_ESPOSA_RELACIONAMENTO',
      palavras: ['esposa', 'esposo', 'marido', 'mulher', 'casamento', 'casar', 'namoro', 'namorada', 'namorado', 'noiva', 'noivo', 'relacionamento', 'solteiro', 'solteira', 'conjugue'],
      respostas: [
        {
          texto: 'No princípio da criação, Deus os fez homem e mulher. Por isso deixará o homem a seu pai e a sua mãe e se unirá à sua mulher, e serão os dois uma só carne. Não ande com o coração ansioso ou precipitado para conseguir uma esposa; busque em primeiro lugar o Reino de Deus e a Sua justiça. Antes de procurar a pessoa certa, torne-se o homem certo perante Deus, aprendendo a amar com renúncia e fidelidade.',
          versiculo: 'Mateus 19:4-6 & Mateus 6:33',
          acao: 'Consagre a sua vida afetiva ao Senhor em oração e peça que Ele prepare o seu caráter para liderar com amor.'
        },
        {
          texto: 'Aquele que encontra uma esposa encontra o bem e alcança a benevolência do Senhor. Mas não se iluda com o brilho passageiro do mundo: a beleza física se desvanece, mas a mulher que teme ao Senhor, essa será louvada. Peça ao Pai celestial discernimento espiritual para reconhecer alguém com quem você possa edificar um altar de adoração mútua.',
          versiculo: 'Provérbios 18:22 & Provérbios 31:30',
          acao: 'Escreva em um caderno quais virtudes espirituais você busca e ore por sua futura esposa com paciência santa.'
        }
      ]
    },
    {
      intent: 'CURA_SAUDE_ENFERMIDADE',
      palavras: ['cura', 'curar', 'doenca', 'enfermidade', 'dor', 'doente', 'hospital', 'remedio', 'saude', 'medico', 'sarar'],
      respostas: [
        {
          texto: 'Eu sou o Senhor que te sara. Certamente Ele tomou sobre si as nossas enfermidades e as nossas dores levou sobre si; e pelas Suas pisaduras fomos sarados. Creia no poder de Deus que renova a sua saúde. Não temas, crê somente.',
          versiculo: 'Isaías 53:4-5 & Marcos 5:36',
          acao: 'Coloque a sua mão sobre a área enferma e declare com fé: "O poder de Cristo restaura o meu corpo e a minha paz".'
        }
      ]
    },
    {
      intent: 'ORACAO_PAI_NOSSO_INTIMIDADE',
      palavras: ['como orar', 'oracao', 'orar', 'pai nosso', 'ensina a orar', 'falar com deus', 'intimidade com deus'],
      respostas: [
        {
          texto: 'Quando você for orar, não seja como os hipócritas que gostam de orar nas esquinas para serem vistos pelos homens. Entre no seu quarto, feche a porta e ore ao seu Pai que está em secreto; e o seu Pai, que vê em secreto, te recompensará. Ore com simplicidade de filho: Pai nosso que estás nos céus, santificado seja o Teu nome...',
          versiculo: 'Mateus 6:6-13',
          acao: 'Retire-se para um lugar silencioso hoje e ore o Pai Nosso pausadamente, meditando em cada frase.'
        }
      ]
    }
  ],

  // ── 2. REI SALOMÃO ──
  salomao: [
    {
      intent: 'FINANCAS_DIVIDAS',
      palavras: ['dinheiro', 'divida', 'dividas', 'financ', 'escassez', 'falta', 'desemprego', 'salario', 'rico', 'pobre', 'prosperidade', 'dizimo', 'oferta', 'gastar', 'comprar', 'cartao', 'empréstimo'],
      respostas: [
        {
          texto: 'Ouça a voz da sabedoria prática: o rico domina sobre o pobre, e o que toma emprestado se torna servo do que empresta. A libertação das dívidas começa com honra e autodomínio. Os planos do diligente conduzem certamente à fartura, mas o apressado corre para a ruína. Elimine o supérfluo hoje e corte os laços da escravidão financeira.',
          versiculo: 'Provérbios 21:5 & Provérbios 22:7',
          acao: 'Coloque no papel todas as dívidas e corte imediatamente um gasto que você sabe que é desnecessário.'
        },
        {
          texto: 'Honra ao Senhor com os teus bens e com as primícias de toda a tua renda; assim se encherão fartamente os teus celeiros. Quem retém o que deve dar empobrece, mas a alma generosa prosperará. Não gaste o que você ainda não ganhou e fuja da armadilha de parecer próspero diante dos homens enquanto deve nos bastidores.',
          versiculo: 'Provérbios 3:9-10 & Provérbios 11:24-25',
          acao: 'Separe as primícias do seu trabalho com gratidão antes de planejar qualquer outro consumo.'
        },
        {
          texto: 'Vai ter com a formiga, ó preguiçoso; considera os seus caminhos e sê sábio! Ela não tem chefe nem comandante, contudo ajunta o seu mantimento no verão para o tempo da tempestade. O patrimônio sólido se constrói grão a grão com fidelidade diária, não com esquemas rápidos de enriquecimento.',
          versiculo: 'Provérbios 6:6-8 & Provérbios 13:11',
          acao: 'Crie hoje o compromisso inegociável de poupar uma fração de tudo o que entrar em suas mãos.'
        }
      ]
    },
    {
      intent: 'DECISAO_SOCIETARIA_PRUDENCIA',
      palavras: ['decisao', 'decidir', 'sociedade', 'socio', 'negocio', 'contrato', 'escolha', 'conselho', 'fiador', 'acordo', 'trabalho'],
      respostas: [
        {
          texto: 'O homem prudente vê o perigo e se abriga, mas os ingênuos avançam e sofrem o dano. Nunca assine documentos sob o calor da emoção e jamais sejas fiador de ninguém. Não te comprometas com o estranho. Onde não há conselho os planos fracassam, mas na multidão de sábios conselheiros há segurança permanente.',
          versiculo: 'Provérbios 11:14 & Provérbios 27:12',
          acao: 'Consulte ao menos duas pessoas maduras na fé e prudentes nos negócios antes de firmar qualquer pacto.'
        },
        {
          texto: 'Melhor é o pouco com o temor do Senhor do que grandes tesouros onde há inquietação. Avalie o caráter de quem caminha com você: quem anda com os sábios será cada vez mais sábio, mas o companheiro dos tolos acabará arruinado. Nos negócios, a reputação íntegra vale muito mais que o lucro rápido.',
          versiculo: 'Provérbios 15:16 & Provérbios 13:20',
          acao: 'Avalie suas parcerias profissionais e certifique-se de que nenhum compromisso fere a ética cristã.'
        }
      ]
    }
  ],

  // ── 3. REI DAVI ──
  davi: [
    {
      intent: 'MEDO_GIGANTES_BATALHA',
      palavras: ['medo', 'temor', 'gigante', 'golias', 'batalha', 'guerra', 'inimigo', 'inimigos', 'perseguicao', 'ameaca', 'pressao', 'forca', 'espada', 'escudo', 'covardia', 'desespero'],
      respostas: [
        {
          texto: 'Quando aquele filisteu afrontou Israel, os soldados experientes tremeram em suas tendas. Mas eu me lembrei de quem Deus é: Aquele que me livrou das garras do leão e do urso nas pastagens! Golias veio com espada, lança e escudo, mas eu fui contra ele em nome do Senhor dos Exércitos! O seu gigante pode ter estatura assustadora, mas ele cairá por terra. Firme seus passos!',
          versiculo: '1 Samuel 17:45 & Salmo 27:1-3',
          acao: 'Declare com autoridade santa: "O Senhor dos Exércitos está comigo; o Deus de Jacó é o meu refúgio".'
        },
        {
          texto: 'Ainda que eu ande pelo vale da sombra da morte, não temerei mal nenhum, porque Tu estás comigo; o Teu bordão e o Teu cajado me consolam! Preparei uma mesa perante mim na presença dos meus adversários. O medo tenta paralisar sua voz, mas o louvor rompe as cadeias da opressão. Adore a Deus antes do milagre acontecer.',
          versiculo: 'Salmo 23:4-5 & Salmo 34:1',
          acao: 'Coloque um hino de exaltação a Deus agora mesmo e adore ao Senhor com o coração aberto.'
        },
        {
          texto: 'Por que estás abatida, ó minha alma, e por que te perturbas dentro de mim? Espera em Deus, pois ainda o louvarei, a Ele que é o socorro da minha presença e o meu Deus. O Senhor é a fortaleza da minha vida; a quem temerei? Quando os malfeitores avançaram para me devorar, foram eles que tropeçaram e caíram.',
          versiculo: 'Salmo 42:11 & Salmo 27:1-2',
          acao: 'Leia o Salmo 27 em voz alta dentro da sua casa consagrando os seus caminhos ao Senhor.'
        }
      ]
    },
    {
      intent: 'SOLIDAO_LAMENTO_ARREPENDIMENTO',
      palavras: ['tristeza', 'choro', 'solidao', 'abandono', 'lagrimas', 'caverna', 'depressao', 'arrepender', 'arrependimento', 'perdao', 'errei', 'falhei', 'adulterio', 'sujo'],
      respostas: [
        {
          texto: 'Eu morei na caverna escura de Adulão fugindo da fúria injusta de Saul. Molhei a minha cama com lágrimas noite após noite. Mas aprendi: o choro pode durar uma noite inteira, mas a alegria radiante vem pela manhã! Deus recolhe cada gota do seu pranto em Seu odre celestial. Você não foi esquecido no deserto.',
          versiculo: 'Salmo 30:5 & Salmo 56:8',
          acao: 'Derrame a sua alma sem máscaras perante o Senhor e descanse na certeza do Seu livramento.'
        },
        {
          texto: 'Quando Nathan apontou o dedo e revelou o meu pecado com Bate-Seba, meus ossos envelheceram pelo meu bramido o dia todo. Mas quando confessei: "Pequei contra o Senhor!", Ele me perdoou. Cria em mim, ó Deus, um coração puro e renova dentro de mim um espírito inabalável! Um coração quebrantado e contrito Deus jamais desprezará.',
          versiculo: 'Salmo 32:3-5 & Salmo 51:10-17',
          acao: 'Rasgue o seu coração diante de Deus em arrependimento genuíno e receba a restauração do Espírito.'
        }
      ]
    }
  ],

  // ── 4. APÓSTOLO PAULO ──
  paulo: [
    {
      intent: 'CANSACO_DESANIMO_ESPINHO',
      palavras: ['cansado', 'cansaco', 'desanimo', 'desanimado', 'desistir', 'fraco', 'fraqueza', 'nao aguento', 'espinho', 'dor', 'tribulacao', 'fardo', 'pressao', 'acabado'],
      respostas: [
        {
          texto: 'Três vezes pedi ao Senhor que afastasse de mim um mensageiro de Satanás, um espinho terrível na minha carne. E Ele me respondeu com a maior verdade do Evangelho: "A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza". Portanto, de boa vontade me gloriarei nas fraquezas, para que sobre mim repouse o poder de Cristo. Quando sou fraco, aí é que sou forte!',
          versiculo: '2 Coríntios 12:8-10',
          acao: 'Renove suas forças espirituais declarando: "A graça de Deus me basta para vencer o dia de hoje".'
        },
        {
          texto: 'Em tudo somos atribulados, porém não angustiados; perplexos, porém não desanimados; perseguidos, porém não desamparados; abatidos, porém não destruídos! Não olhamos para as coisas que se veem, que são temporárias, mas para as que não se veem, que são eternas. A nossa leve e momentânea tribulação produz para nós um peso eterno de glória.',
          versiculo: '2 Coríntios 4:8-9 & 2 Coríntios 4:17-18',
          acao: 'Mude a sua perspectiva: não foque na dor passageira, olhe para a recompensa eterna da sua fé.'
        },
        {
          texto: 'Aprendi o segredo de viver contente em toda e qualquer situação: tanto sei estar humilhado como também ser honrado; sei ter abundância como passar necessidade. Tudo posso naquele que me fortalece! Não desista no meio do caminho; os que perseveram com paciência herdarão as promessas de Deus.',
          versiculo: 'Filipenses 4:11-13 & Gálatas 6:9',
          acao: 'Diga a Deus: "Senhor, não me deixes desfalecer na caminhada; fortalece o meu homem interior".'
        }
      ]
    },
    {
      intent: 'PROPOSITO_ALVO_CHAMADO',
      palavras: ['proposito', 'chamado', 'vocacao', 'alvo', 'futuro', 'carreira', 'ministerio', 'passado', 'culpa', 'erros do passado', 'o que fazer'],
      respostas: [
        {
          texto: 'Irmãos, quanto a mim, não julgo que o haja alcançado; mas uma coisa faço, e é que, esquecendo-me das coisas que para trás ficam e avançando para as que estão diante de mim, prossigo para o alvo, pelo prêmio da soberana vocação de Deus em Cristo Jesus. Não viva acorrentado ao que passou; em Cristo você é uma nova criatura!',
          versiculo: 'Filipenses 3:13-14 & 2 Coríntios 5:17',
          acao: 'Corte os laços emocionais com frustrações antigas e dê hoje um passo concreto em direção ao seu chamado.'
        },
        {
          texto: 'Combati o bom combate, acabei a carreira, guardei a fé. Desde agora, a coroa da justiça me está guardada, a qual o Senhor, justo juiz, me dará naquele dia. Não viva para agradar aos homens nem busque aplausos terrenos transitórios. Viva para a glória Daquele que te chamou das trevas para a Sua maravilhosa luz.',
          versiculo: '2 Timóteo 4:7-8 & Gálatas 1:10',
          acao: 'Escreva em uma frase qual é a sua principal missão espiritual e ore pedindo fidelidade para cumpri-la.'
        }
      ]
    }
  ],

  // ── 5. MOISÉS ──
  moises: [
    {
      intent: 'LIDERANCA_DESERTO_ESPERA',
      palavras: ['lideranca', 'liderar', 'deserto', 'espera', 'esperar', 'tempo', 'demora', 'paciencia', 'murmuracao', 'reclamacao', 'mar vermelho', 'impasse', 'sem saida'],
      respostas: [
        {
          texto: 'Quando chegamos às margens do Mar Vermelho, com as muralhas de água à nossa frente e os carros armados do Faraó atrás, o povo entrou em pavor e gritou. Mas a palavra do Senhor veio com trovão: "Não temais; aquietai-vos e vede o livramento do Senhor que hoje vos fará! O Senhor pelejará por vós, e vós vos calareis". Deus abre o mar na hora exata.',
          versiculo: 'Êxodo 14:13-14',
          acao: 'Cale o desespero e a queixa. Espere com firmeza: a mão de Deus se moverá a seu favor.'
        },
        {
          texto: 'Passei 40 anos cuidando de ovelhas em Midiã pensando que nada mais aconteceria, até que a sarça ardeu sem se consumir. O tempo de Deus não obedece ao relógio dos homens. O deserto não foi desperdício, foi o lugar onde aprendi que a força não vem dos palácios, mas da voz que troveja no monte santo. Espere com mansidão.',
          versiculo: 'Êxodo 3:1-5 & Salmo 90:1-4',
          acao: 'Agradeça a Deus pelo tempo de aprendizado em que você está, sem tentar forçar portas fechadas.'
        },
        {
          texto: 'Eu supliquei ao Todo-Poderoso: "Se a Tua presença não for conosco, não nos faças subir deste lugar!". Não busque vitórias sem a presença de Deus; não tome decisões importantes confiando na inteligência humana. Quando a nuvem da glória descansa, descanse; quando a nuvem se mover, marche com ousadia.',
          versiculo: 'Êxodo 33:14-15 & Números 9:17',
          acao: 'Consagre a sua rotina: "Senhor, se a Tua presença não for adiante de mim hoje, eu não darei nenhum passo".'
        }
      ]
    }
  ],

  // ── 6. RAINHA ESTER ──
  ester: [
    {
      intent: 'CORAGEM_POSICIONAMENTO',
      palavras: ['coragem', 'posicionamento', 'posicionar', 'falar', 'timidez', 'vergonha', 'covardia', 'crise', 'arriscar', 'justica', 'defender', 'arriscar a vida', 'jejum'],
      respostas: [
        {
          texto: 'Entrar nos átrios do rei Assuero sem ser convidada era sentença de morte sob as leis da Pérsia. Tive receio? Todo ser humano teme a dor. Mas Mardoqueu me advertiu: "Quem sabe se não foi exatamente para um momento decisivo como este que você chegou ao reino?". Convoquei o jejum e decidi: "Se perecer, pereci". O silêncio quando a verdade está em jogo é pecado. Posicione-se!',
          versiculo: 'Ester 4:14-16',
          acao: 'Não fuja da responsabilidade moral. Tome a posição santa que você vinha adiando por medo da reação alheia.'
        },
        {
          texto: 'Não lute com a agressividade da carne. Antes de me apresentar ao trono terreno, dobrei os joelhos diante do Trono Celestial por três dias. A verdadeira coragem não é espalhafatosa; ela se veste de dignidade, momento oportuno, mansidão e intercessão poderosa. A forca que o adversário armou para destruir a justiça se tornará o palco da vitória de Deus.',
          versiculo: 'Ester 5:1-3 & Ester 7:9-10',
          acao: 'Dedique um momento de consagração e jejum antes de ter aquela conversa difícil ou tomar aquela grande atitude.'
        }
      ]
    }
  ],

  // ── 7. MARIA MÃE DE JESUS ──
  maria: [
    {
      intent: 'DEVOCAO_ENTREGA_FAMILIA',
      palavras: ['mae', 'filho', 'filhos', 'familia', 'lar', 'casa', 'maternidade', 'devoção', 'entrega', 'confiar', 'humildade', 'misterio', 'dor de mae', 'lagrimas'],
      respostas: [
        {
          texto: 'Quando o anjo Gabriel entrou em minha casa humilde trazendo o anúncio mais surpreendente da história, meu coração estremeceu, mas minha alma descansou na soberania do Pai: "Eis aqui a serva do Senhor; cumpra-se em mim segundo a Tua palavra". O segredo da paz não é ter o controle de tudo, é entregar o controle Àquele que governa o universo.',
          versiculo: 'Lucas 1:38 & Lucas 1:46-48',
          acao: 'Diga a Deus com mansidão: "Senhor, cumpra-se na minha vida e na minha casa a Tua boa e perfeita vontade".'
        },
        {
          texto: 'Quantas coisas aconteceram desde a estrela de Belém até as profecias no Templo que eu não compreendia na hora... Mas a Escritura diz que Maria guardava todas essas palavras, meditando-as no íntimo do coração. Não reaja por impulso diante das crises da vida familiar; guarde as promessas de Deus e confie na fidelidade Dele.',
          versiculo: 'Lucas 2:19 & Lucas 2:51',
          acao: 'Passe alguns minutos em oração silenciosa entregando seus filhos e familiares nas mãos do Pai celestial.'
        },
        {
          texto: 'Eu estive aos pés da cruz no Monte Calvário, vendo o fruto do meu ventre padecer pelas dores do mundo. Uma espada atravessou a minha alma, exatamente como o profeta Simeão havia dito. Mas mesmo na hora mais escura da sexta-feira, o domingo da ressurreição já estava decretado nos céus. Nenhuma dor na presença de Deus é em vão.',
          versiculo: 'João 19:25-27 & Lucas 2:34-35',
          acao: 'Se você está sofrendo por alguém que ama, ancore sua esperança no Deus que faz a vida brotar da cinza.'
        }
      ]
    }
  ]
};

// ── STOPWORDS DA LÍNGUA PORTUGUESA (EVITA FALSOS POSITIVOS DE SUBSTRING) ──
const STOPWORDS_PT = new Set([
  'para', 'como', 'com', 'que', 'uma', 'seu', 'sua', 'dele', 'dela', 'eles', 'elas',
  'onde', 'qual', 'quem', 'isso', 'este', 'esta', 'esse', 'essa', 'voce', 'mais',
  'muito', 'pelo', 'pela', 'pelos', 'pelas', 'numa', 'num', 'uns', 'umas', 'ter',
  'estar', 'ser', 'fazer', 'conseguir', 'preciso', 'precisa', 'quero', 'quer',
  'dar', 'pode', 'podemos', 'tenho', 'tem', 'acho', 'sobre', 'algo', 'mesmo', 'diz'
]);

// ── MEMÓRIA DE ROTAÇÃO CONTEXTUAL ANTI-REPETIÇÃO ──
// Mantém registro por mentor/intent para alternar as respostas consecutivas
const _memoriaRotacao = {};

// ── MOTOR SEMÂNTICO E DINÂMICO DE RESPOSTA DO MENTOR ──
export function gerarRespostaMentor(mentorId, pergunta) {
  const mentor = LAYA_MENTORES.find(m => m.id === mentorId) || LAYA_MENTORES[0];
  const queryNorm = (pergunta || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .trim();

  // Filtra stopwords comuns
  const words = queryNorm.split(/\s+/).filter(w => w.length >= 3 && !STOPWORDS_PT.has(w));
  const mentorIntents = BANCO_INTENCOES_MENTORES[mentor.id] || BANCO_INTENCOES_MENTORES.jesus;

  let bestIntent = null;
  let highestScore = 0;

  for (const item of mentorIntents) {
    let score = 0;

    // 1. Verifica expressões compostas completas primeiro (ex: "vida eterna", "bom samaritano")
    for (const p of item.palavras) {
      const pNorm = p.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      if (pNorm.includes(' ') && queryNorm.includes(pNorm)) {
        score += 8;
      }
    }

    // 2. Pontua palavras significativas individuais
    for (const w of words) {
      for (const p of item.palavras) {
        const pNorm = p.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
        if (w === pNorm) {
          score += 5; // Match exato de palavra-chave
        } else if (w.length >= 5 && pNorm.length >= 5) {
          if (w.startsWith(pNorm) || pNorm.startsWith(w)) {
            score += 2; // Match de radical (ex: "perdoar" / "perdoo")
          }
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestIntent = item;
    }
  }

  // Se encontrou uma intenção doutrinária com score relevante
  if (bestIntent && highestScore >= 3) {
    const key = `${mentor.id}_${bestIntent.intent}`;
    const lastIndex = _memoriaRotacao[key] !== undefined ? _memoriaRotacao[key] : -1;
    const nextIndex = (lastIndex + 1) % bestIntent.respostas.length;
    _memoriaRotacao[key] = nextIndex;

    return bestIntent.respostas[nextIndex];
  }

  // Fallback Inteligente e Rotativo por Mentor (sempre em 1ª pessoa)
  const fallbackKey = `${mentor.id}_fallback`;
  const fbIndex = ((_memoriaRotacao[fallbackKey] || 0) + 1) % 2;
  _memoriaRotacao[fallbackKey] = fbIndex;

  if (mentor.id === 'jesus') {
    if (fbIndex === 0) {
      return {
        texto: 'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei. Tomai sobre vós o meu jugo e aprendei de mim, porque sou manso e humilde de coração, e encontrareis descanso para as vossas almas. Seja qual for a sua inquietação, Eu estou com você.',
        versiculo: 'Mateus 11:28-29',
        acao: 'Acalme a sua mente e faça uma prece de entrega sincera a Cristo agora.'
      };
    } else {
      return {
        texto: 'Em tudo o que você pedir em oração, crendo, você receberá. Não olhe para a pequenez das circunstâncias terrenas; olhe para a grandeza e a misericórdia do Pai que está nos céus. Firme a sua fé na Minha Palavra e ande em novidade de vida.',
        versiculo: 'Mateus 21:22 & João 15:7',
        acao: 'Declare com convicção: "Eu creio no poder de Deus para transformar a minha história".'
      };
    }
  }

  if (mentor.id === 'salomao') {
    return {
      texto: 'A sabedoria é a coisa principal; adquire, pois, a sabedoria; sim, com tudo o que possuis adquire o entendimento. O temor do Senhor é o princípio de todo o saber. Em qualquer decisão, avalie os frutos a longo prazo e fuja das ilusões imediatistas.',
      versiculo: 'Provérbios 4:7 & Provérbios 16:3',
      acao: 'Consagre a Deus os seus projetos antes de agir e peça discernimento prático.'
    };
  }

  if (mentor.id === 'davi') {
    return {
      texto: 'O Senhor é o meu pastor; de nada terei falta. Ele me faz repousar em pastos verdejantes e guia-me mansamente a águas tranquilas. Refrigera a minha alma. Firme seu coração na fidelidade de Deus e nenhum gigante prevalecerá contra você.',
      versiculo: 'Salmo 23:1-3',
      acao: 'Agradeça a Deus por três livramentos passados que Ele já operou em sua vida.'
    };
  }

  if (mentor.id === 'paulo') {
    return {
      texto: 'Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas diante de Deus as vossas petições, pela oração e pela súplica, com ações de graças. E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e as vossas mentes em Cristo Jesus.',
      versiculo: 'Filipenses 4:6-7',
      acao: 'Transforme a sua preocupação em uma oração objetiva de gratidão e súplica agora.'
    };
  }

  if (mentor.id === 'moises') {
    return {
      texto: 'Disse o Senhor: "A minha presença irá contigo, e eu te darei descanso". Não se perturbe pelas dificuldades do caminho pelo deserto. O Senhor peleja pelos que são Seus; confie na nuvem da Sua glória.',
      versiculo: 'Êxodo 33:14',
      acao: 'Dedique um momento de quietude entregando a condução da sua jornada a Deus.'
    };
  }

  if (mentor.id === 'ester') {
    return {
      texto: 'O Senhor ergue os humildes e frustra as maquinações da soberba. Quando você une a oração fervorosa à coragem ética, o céu se move em seu favor. Não tema os desafios do ambiente; permaneça firme na dignidade da fé.',
      versiculo: 'Ester 4:14 & Provérbios 31:25',
      acao: 'Tome hoje uma atitude de integridade e confie o resultado à providência divina.'
    };
  }

  // Maria
  return {
    texto: 'Minha alma engrandece ao Senhor, e o meu espírito se alegra em Deus, meu Salvador, porque contemplou a humildade da Sua serva. Confie no agir silencioso e perfeito do Pai: Ele cumpre cada uma das Suas promessas no tempo certo.',
    versiculo: 'Lucas 1:46-49',
    acao: 'Guarde as promessas de Deus e medite nelas com o coração em paz.'
  };
}
