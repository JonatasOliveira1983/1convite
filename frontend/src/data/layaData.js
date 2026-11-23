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
      'Como perdoar alguém que me feriu profundamente?',
      'Como vencer o medo do amanhã e da morte?'
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

// ── MOTOR DE CHAT EM PRIMEIRA PESSOA COM O MENTOR ──
// Sempre objetivo, direto ao ponto e baseado nas Escrituras Sagradas
export function gerarRespostaMentor(mentorId, pergunta) {
  const mentor = LAYA_MENTORES.find(m => m.id === mentorId) || LAYA_MENTORES[0];
  const q = (pergunta || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // 1. JESUS CRISTO
  if (mentor.id === 'jesus') {
    if (q.includes('ansied') || q.includes('futuro') || q.includes('preocup') || q.includes('medo')) {
      return {
        texto: 'Por que o seu coração está inquieto? Observe os lírios do campo: eles não trabalham nem fiam, contudo nem Salomão em toda a sua glória se vestiu como um deles. Não vos inquieteis pelo dia de amanhã; o dia de amanhã cuidará de si mesmo. Entregue o seu fardo a mim agora e busque em primeiro lugar o Reino e a Sua justiça.',
        versiculo: 'Mateus 6:33-34',
        acao: 'Respire em paz agora mesmo e declare três vezes: "O Senhor é o meu descanso".'
      };
    }
    if (q.includes('perdo') || q.includes('magoa') || q.includes('ofens') || q.includes('traic') || q.includes('raiva')) {
      return {
        texto: 'Se perdoardes aos homens as suas ofensas, também vosso Pai celeste vos perdoará. O perdão não significa que o que fizeram foi correto, mas que você se recusa a carregar o veneno da amargura na sua alma. Solte essa pessoa diante do Meu altar; a paz que o mundo não pode dar inundará o seu peito.',
        versiculo: 'Marcos 11:25 & Lucas 23:34',
        acao: 'Ore em voz baixa abençoando o nome dessa pessoa para que as cadeias da mágoa se quebrem.'
      };
    }
    if (q.includes('pecad') || q.includes('culpa') || q.includes('falh') || q.includes('errei')) {
      return {
        texto: 'Nem eu te condeno; vá e não peques mais. A Minha graça não veio para os que se acham perfeitos, mas para os doentes e quebrantados. Se confessares os teus pecados, sou fiel e justo para te perdoar e te purificar de toda injustiça. Levante a sua cabeça: você é lavado no Meu sangue.',
        versiculo: 'João 8:11 & 1 João 1:9',
        acao: 'Agradeça a Deus pelo perdão agora e dê as costas ao erro sem olhar para trás.'
      };
    }
    return {
      texto: 'Vinde a mim, vós todos que estais cansados e oprimidos, e eu vos aliviarei. Tomai sobre vós o meu jugo e aprendei de mim, porque sou manso e humilde de coração, e encontrareis descanso para as vossas almas. Confie na Minha graça: Eu estou convosco todos os dias.',
      versiculo: 'Mateus 11:28-29',
      acao: 'Coloque a sua mão sobre o coração e faça uma oração de entrega total ao Senhor.'
    };
  }

  // 2. REI SALOMÃO
  if (mentor.id === 'salomao') {
    if (q.includes('dinheiro') || q.includes('divida') || q.includes('financ') || q.includes('escassez') || q.includes('contas')) {
      return {
        texto: 'Ouça com atenção: o que toma emprestado é servo do que empresta. A libertação das dívidas não exige milagres mágicos, mas ordem, honestidade e diligência. Os planos do diligente conduzem com certeza à abundância, mas a pressa precipitada leva à penúria. Elimine gastos supérfluos hoje mesmo e honre ao Senhor com as primícias da sua renda.',
        versiculo: 'Provérbios 21:5 & Provérbios 22:7',
        acao: 'Faça uma lista honesta de cada centavo devido e corte uma despesa imediata hoje.'
      };
    }
    if (q.includes('decis') || q.includes('socied') || q.includes('negoc') || q.includes('escolh')) {
      return {
        texto: 'O homem prudente vê o perigo e se esconde, mas os insensatos avançam e sofrem a pena. Nunca assine acordos com pressa e não seja fiador de estranhos. Na multidão de conselheiros sábios há segurança. Avalie o fruto moral das pessoas antes de confiar-lhes suas portas e seus recursos.',
        versiculo: 'Provérbios 11:14 & Provérbios 27:12',
        acao: 'Não tome essa decisão antes de ouvir ao menos duas pessoas sábias e maduras na fé.'
      };
    }
    return {
      texto: 'A sabedoria é a coisa principal; adquire, pois, a sabedoria; sim, com tudo o que possuis adquire o entendimento. O temor do Senhor é o princípio de todo saber. Trabalhe com esmero, fuja da preguiça e a bênção que enriquece e não traz dores acompanhará a sua casa.',
      versiculo: 'Provérbios 4:7 & Provérbios 10:22',
      acao: 'Organize suas prioridades do dia escrevendo apenas o que é essencial para honrar a Deus.'
    };
  }

  // 3. REI DAVI
  if (mentor.id === 'davi') {
    if (q.includes('medo') || q.includes('gigant') || q.includes('ameac') || q.includes('inimig') || q.includes('pressao')) {
      return {
        texto: 'Quando Golias zombou do exército de Israel, todos tremeram, mas eu me lembrei do leão e do urso que o Senhor havia entregue nas minhas mãos no pasto. Aquele filisteu não lutava contra mim, mas contra o Deus vivo! O seu problema pode parecer uma montanha, mas o nome do Senhor dos Exércitos o despedaçará. Firme seus pés e não recue!',
        versiculo: '1 Samuel 17:45 & Salmo 27:1',
        acao: 'Declare com autoridade: "O Senhor é o meu escudo e a minha fortaleza, não temerei".'
      };
    }
    if (q.includes('trist') || q.includes('solidao') || q.includes('abandono') || q.includes('choro') || q.includes('caverna')) {
      return {
        texto: 'Eu morei na caverna de Adulão, perseguido como caça nos montes. Sei o que é molhar o leito com lágrimas. Mas aprendi: o choro pode durar uma noite, mas a alegria vem pela manhã! Rasgue a sua alma diante do Senhor em louvor, porque Ele recolhe cada lágrima em Seu odre e jamais te desamparará.',
        versiculo: 'Salmo 30:5 & Salmo 56:8',
        acao: 'Coloque um cântico de louvor e adore a Deus com o coração sincero por 5 minutos.'
      };
    }
    return {
      texto: 'O Senhor é o meu pastor; nada me faltará. Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque Tu estás comigo; a Tua vara e o Teu cajado me consolam. Confie: a bondade e a misericórdia de Deus te seguirão todos os dias da sua vida!',
      versiculo: 'Salmo 23:1-4',
      acao: 'Leia o Salmo 23 em voz alta consagrando a sua família ao Bom Pastor.'
    };
  }

  // 4. APÓSTOLO PAULO
  if (mentor.id === 'paulo') {
    if (q.includes('cansad') || q.includes('desanim') || q.includes('desist') || q.includes('fraco') || q.includes('espinho')) {
      return {
        texto: 'Pedi três vezes ao Senhor para afastar de mim um espinho na carne que me esbofeteava. Sabe o que Ele me respondeu? "A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza". Por isso me glorio nas tribulações: pois quando sou fraco, aí é que sou forte em Cristo! Não desanime da corrida; a coroa da justiça está guardada para você.',
        versiculo: '2 Coríntios 12:9-10 & 2 Timóteo 4:7-8',
        acao: 'Renove a sua decisão hoje: "Posso todas as coisas naquele que me fortalece".'
      };
    }
    if (q.includes('proposito') || q.includes('chamado') || q.includes('vontade') || q.includes('futuro')) {
      return {
        texto: 'Uma coisa eu faço: esquecendo-me das coisas que ficaram para trás e avançando para as que estão adiante, prossigo para o alvo, pelo prêmio da soberana vocação de Deus em Cristo Jesus. Não viva preso ao seu passado ou aos seus erros antigos; quem está em Cristo é nova criatura. O seu propósito é manifestar a glória do Evangelho onde quer que você pise.',
        versiculo: 'Filipenses 3:13-14 & 2 Coríntios 5:17',
        acao: 'Escreva um compromisso de serviço a Deus e pratique um ato de generosidade hoje.'
      };
    }
    return {
      texto: 'Em tudo somos atribulados, porém não angustiados; perplexos, porém não desanimados; perseguidos, porém não desamparados; abatidos, porém não destruídos. Alegrai-vos sempre no Senhor; outra vez digo: alegrai-vos! A paz de Deus, que excede todo o entendimento, guardará o vosso coração.',
      versiculo: '2 Coríntios 4:8-9 & Filipenses 4:4-7',
      acao: 'Agradeça a Deus especificamente por 3 bênçãos espirituais recebidas esta semana.'
    };
  }

  // 5. MOISÉS
  if (mentor.id === 'moises') {
    if (q.includes('espera') || q.includes('deserto') || q.includes('tempo') || q.includes('demora') || q.includes('pacienc')) {
      return {
        texto: 'Passei quarenta anos no palácio pensando que era alguém, quarenta anos apascentando ovelhas no deserto aprendendo que nada era, e quarenta anos liderando o povo vendo o que Deus pode fazer com quem nada é. O deserto não é castigo para quem ama a Deus, é a escola onde a soberba morre e a dependência do maná diário nasce. Espere na nuvem do Senhor; no tempo certo as águas se abrirão.',
        versiculo: 'Êxodo 14:14 & Salmo 90:12',
        acao: 'Cale as reclamações e agradeça pelo pão de hoje sem exigir o banquete de amanhã.'
      };
    }
    return {
      texto: 'Disse eu ao Senhor: "Se a Tua presença não for comigo, não nos faças subir deste lugar". Não dê um passo sequer confiando na força do seu próprio braço. O Senhor pelejará por você; apenas guarde a quietude e marche em obediência à Palavra.',
      versiculo: 'Êxodo 14:13 & Êxodo 33:14-15',
      acao: 'Faça 5 minutos de silêncio absoluto entregando a liderança da sua vida a Deus.'
    };
  }

  // 6. RAINHA ESTER
  if (mentor.id === 'ester') {
    if (q.includes('medo') || q.includes('posicion') || q.includes('coragem') || q.includes('fal') || q.includes('vergonha')) {
      return {
        texto: 'Apresentar-se diante do rei Assuero sem ser chamada significava sentença de morte. Tive medo? Sim, a carne treme diante do perigo. Mas Mardoqueu me lembrou: "Quem sabe se não foi para uma hora como esta que você chegou ao reino?". Convoquei o povo ao jejum e declarei: "Se perecer, pereci". O silêncio na hora da verdade é covardia. Dobre os joelhos primeiro, revista-se de graça e tome a sua posição.',
        versiculo: 'Ester 4:14-16 & Provérbios 31:25',
        acao: 'Dê hoje aquele passo corajoso ou tenha aquela conversa sincera que você vinha adiando.'
      };
    }
    return {
      texto: 'A força e a dignidade são os seus vestidos, e você há de rir-se do dia venturoso. Não tema as armadilhas tecidas contra a sua integridade: a forca que o adversário prepara para os justos cairá sobre a própria soberba dele. Mantenha a pureza e a fidelidade ao Rei dos Reis.',
      versiculo: 'Ester 7:10 & Provérbios 31:25-26',
      acao: 'Dedique um momento de jejum ou renúncia nesta semana consagrando seus desafios a Deus.'
    };
  }

  // 7. MARIA MÃE DE JESUS
  if (mentor.id === 'maria') {
    if (q.includes('filho') || q.includes('mae') || q.includes('familia') || q.includes('casa') || q.includes('lar') || q.includes('dor')) {
      return {
        texto: 'Eu acompanhei o meu Filho desde a palha fria da manjedoura até a dor dilacerante da cruz no Gólgota, onde uma espada atravessou a minha própria alma como Simeão profetizou. Mas eu sabia em quem havia crido: Deus nunca abandona uma mãe que ora de joelhos. Entregue os seus filhos e o seu lar nos braços do Pai; Ele cuida deles muito melhor do que nós.',
        versiculo: 'Lucas 1:46-48 & Lucas 2:35',
        acao: 'Ore agora estendendo as mãos em bênção sobre a sua família e declare paz sobre o seu teto.'
      };
    }
    return {
      texto: 'Quando o anjo Gabriel me trouxe o anúncio mais estarrecedor da história, respondi com mansidão: "Eis aqui a serva do Senhor; cumpra-se em mim segundo a Tua palavra". O segredo da paz não é entender tudo, é confiar Naquele que tudo pode. Guarde as promessas de Deus e medite nelas no seu coração.',
      versiculo: 'Lucas 1:38 & Lucas 2:19',
      acao: 'Passe alguns minutos em oração contemplativa, agradecendo a Deus com o coração manso.'
    };
  }

  // Resposta padrão
  return {
    texto: `A paz do Senhor. Como seu mentor nas Escrituras, afirmo com certeza: não ande ansioso por coisa alguma, mas em tudo, pela oração e súplicas, apresente seus pedidos a Deus. Ele guia os mansos no que é justo e ensina aos humildes o Seu caminho.`,
    versiculo: mentor.versiculo_chave || 'Filipenses 4:6-7',
    acao: 'Medite no versículo bíblico e dê o primeiro passo de obediência prática hoje.'
  };
}
