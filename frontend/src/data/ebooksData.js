// Base de dados e textos completos para a Biblioteca de E-books & Livros Digitais
export const EBOOKS_DATA = [
  {
    id: 1,
    title: 'As Parábolas de Jesus',
    author: 'Estudos Canônicos',
    badge: 'ESTUDO TEOLÓGICO',
    cover: '/ebooks/covers/as-parabolas-de-jesus.jpg',
    pdfUrl: '/ebooks/pdfs/as-parabolas-de-jesus.pdf',
    desc: 'Uma análise teológica completa das parábolas do Novo Testamento explicadas com aplicações práticas e espirituais para o seu dia a dia.',
    chapters: [
      {
        id: 1,
        title: 'O Semeador e os Quatro Solos',
        verse: 'E outra parte caiu em boa terra, e deu fruto, que vingou e cresceu; e um produziu trinta, outro sessenta, e outro cem. — Marcos 4:8',
        intro: 'A Parábola do Semeador é uma das narrativas mais fundamentais ministradas por Jesus, pois serve como chave mestra para compreender como o Reino de Deus opera no coração humano.',
        content: `Na cultura agrária da Galileia, o semeador saía a semear espalhando as sementes com a mão. O solo, no entanto, apresentava quatro condições espirituais distintas que representam a postura interior de cada pessoa diante da verdade divina:

1. O Solo do Caminho: Representa o coração endurecido pelo tráfego constante das ocupações do mundo. A semente nem sequer penetra, e as aves do céu (o adversário) roubam a Palavra antes que ela crie raízes.

2. O Solo Rochoso: Representa a resposta superficial e puramente emocional. Há alegria imediata na recepção, mas por não haver profundidade de caráter e oração, quando surge a perseguição ou a tribulação por causa da Palavra, a pessoa logo se escandaliza.

3. O Solo Entre Espinhos: A semente germina, mas divide espaço com as preocupações desta vida e a ilusão das riquezas. Os espinhos sufocam o crescimento, tornando a fé estéril e sem frutos.

4. A Boa Terra: É o coração que ouve, medita, compreende, retém a Palavra e a pratica com perseverança. Este solo produz a trinta, sessenta e a cem por um, transformando não apenas o indivíduo, mas toda a sua família e comunidade.`,
        application: 'Examine seu solo hoje. Quais espinhos de ansiedade ou preocupação você precisa arrancar para que a semente da Palavra gere frutos espirituais duradouros?'
      },
      {
        id: 2,
        title: 'O Filho Pródigo e o Pai Amoroso',
        verse: 'E, levantando-se, foi para seu pai; e, quando ainda estava longe, viu-o seu pai, e se moveu de íntima compaixão e, correndo, lançou-se-lhe ao pescoço e o beijou. — Lucas 15:20',
        intro: 'Mais do que a história do filho perdido, esta parábola é o maior retrato da graça incondicional e do coração restaurador de Deus como Pai.',
        content: `O filho mais novo exigiu sua parte na herança antes do tempo — um ato que, na cultura judaica, equivalia a desejar a morte do pai. Ele partiu para uma terra distante e desperdiçou tudo com uma vida dissoluta.

Quando a fome assolou a região, viu-se forçado a cuidar de porcos (animal impuro para os judeus) e desejou comer a comida dos animais. Foi no ponto mais baixo de sua trajetória que ocorreu a virada: "caindo em si".

O arrependimento genuíno envolve três passos: reconhecimento do erro, decisão de mudar e retorno prático aos braços do Pai. 

A surpresa divina: O pai não esperou de braços cruzados para cobrar explicações. Ele correu ao encontro do filho descalço, vestiu-o com a melhor roupa (restituição de honra), colocou-lhe um anel no dedo (autoridade restaurada) e sandálias nos pés (condição de filho livre, e não de escravo).`,
        application: 'Não importa a que distância você ache que está de Deus. No instante em que você dá um passo em direção a Ele, o Pai corre em sua direção com perdão, amor e restauração plena.'
      },
      {
        id: 3,
        title: 'O Bom Samaritano: A Prática da Misericórdia',
        verse: 'Qual, pois, destes três te parece que foi o próximo daquele que caiu nas mãos dos salteadores? E ele disse: O que usou de misericórdia para com ele. Disse, pois, Jesus: Vai, e faze da mesma maneira. — Lucas 10:36-37',
        intro: 'Uma lição contundente sobre religiosidade estéril versus a verdadeira compaixão do Reino em ação.',
        content: `Um homem descia de Jerusalém para Jericó e caiu nas mãos de salteadores, que o deixaram semimorto. 

Passaram pelo mesmo caminho um sacerdote e depois um levita — homens dedicados ao templo e conhecedores da Lei. Ambos viram o homem ferido, mas passaram de largo, talvez temendo a contaminação ritual ou o perigo da estrada. A teologia deles não alcançou as mãos.

Contudo, um samaritano — membro de um povo desprezado pelos judeus — chegou junto dele, viu-o e moveu-se de íntima compaixão. Ele não apenas sentiu pena; ele agiu:
- Aproximou-se e atou-lhe as feridas;
- Derramou azeite e vinho (alívio e desinfecção);
- Colocou-o sobre o seu próprio animal;
- Levou-o a uma estalagem e cuidou dele pessoalmente;
- Deixou recursos pagos para a sua completa recuperação.`,
        application: 'O amor cristão autêntico é aquele que interrompe a nossa própria agenda para curar as feridas de quem cruzou o nosso caminho.'
      },
      {
        id: 4,
        title: 'A Parábola dos Talentos: Fidelidade e Mordomia',
        verse: 'E o seu senhor lhe disse: Bem está, servo bom e fiel. Sobre o pouco foste fiel, sobre muito te colocarei; entra no gozo do teu senhor. — Mateus 25:21',
        intro: 'Um chamado imperativo à diligência, produtividade espiritual e prestação de contas com o Criador.',
        content: `Um senhor que partiu para fora entregou bens aos seus servos, segundo a capacidade de cada um: a um deu cinco talentos, a outro dois, e a outro um.

O servo que recebeu cinco talentos negociou e ganhou outros cinco. O que recebeu dois fez o mesmo e dobrou o que tinha. Mas o que recebeu um talento, dominado pelo medo e por uma visão distorcida do caráter do seu senhor, cavou a terra e escondeu o tesouro.

Lições cruciais desta parábola:
1. Deus não nos dá responsabilidades acima do que podemos suportar com a Sua graça.
2. O que temos não nos pertence; somos mordomos e gestores das dádivas de Deus.
3. O medo paralisa, mas a fé multiplica. Esconder o dom por medo de errar é a maior falha que um servo pode cometer.
4. A recompensa da fidelidade no pouco é a autoridade sobre o muito e a alegria eterna do Mestre.`,
        application: 'Identifique os dons, talentos e oportunidades que Deus colocou nas suas mãos hoje. Use-os com ousadia para abençoar vidas e glorificar o Reino.'
      }
    ]
  },
  {
    id: 2,
    title: 'Cristo como Centro das Escrituras',
    author: 'Teologia Bíblica',
    badge: 'ESSENCIAL',
    cover: '/ebooks/covers/cristo-centro-escrituras.jpg',
    pdfUrl: '/ebooks/pdfs/cristo-centro-escrituras.pdf',
    desc: 'Descubra como cada livro da Bíblia aponta profética e tipologicamente para o Messias prometido, desde a criação até a eternidade.',
    chapters: [
      {
        id: 1,
        title: 'A Promessa em Gênesis: O Protoevangelho',
        verse: 'E porei inimizade entre ti e a mulher, e entre a tua semente e a sua semente; esta te ferirá a cabeça, e tu lhe ferirás o calcanhar. — Gênesis 3:15',
        intro: 'Logo no início da história humana, no momento da queda, a graça de Deus estabelece a primeira promessa da redenção messiânica.',
        content: `Gênesis 3:15 é conhecido na teologia como o "Protoevangelho" — a primeira proclamação das boas-novas em toda a Escritura.

No instante em que o pecado entrou na criação, Deus não abandonou a humanidade à sua própria sorte. Ele declarou uma guerra santa contra o império das trevas e profetizou que da mulher nasceria Alguém (Jesus Cristo) que desferiria o golpe fatal na cabeça da serpente no Calvário.

Mesmo quando o Salvador foi ferido no calcanhar (os cravos na cruz), esse ferimento temporário resultou no esmagamento definitivo do poder do pecado, da morte e do diabo. Toda a narrativa bíblica subsequente nada mais é do que o desdobramento dessa promessa triunfante.`,
        application: 'Quando olhar para suas quedas e fraquezas, lembre-se de que o plano de redenção de Deus é mais antigo e mais poderoso do que qualquer erro humano.'
      },
      {
        id: 2,
        title: 'O Tabernáculo: Cada Detalhe Aponta para o Cordeiro',
        verse: 'E o Verbo se fez carne, e habitou entre nós, e vimos a sua glória, como a glória do unigênito do Pai, cheio de graça e de verdade. — João 1:14',
        intro: 'A tenda do encontro no deserto como antecipação visual e sagrada de Jesus Cristo habitando entre os homens.',
        content: `A palavra grega para "habitou" em João 1:14 é 'eskenosen', que significa literalmente "armou a sua tenda / tabernaculou entre nós". Cada elemento do tabernáculo revela uma faceta de Jesus:

- A Única Porta: Jesus é a única porta de entrada para a comunhão com o Pai (João 10:9).
- O Altar de Bronze: A cruz onde o Cordeiro de Deus tirou o pecado do mundo.
- A Pia de Bronze: A purificação diária pela Palavra e pelo Espírito.
- O Candelabro de Ouro (Menorá): Jesus como a Luz do Mundo que nunca se apaga.
- A Mesa dos Pães da Proposição: Jesus como o Pão da Vida que sustenta nossa alma.
- O Altar de Incenso: A intercessão perpétua de Cristo à destra do Pai.
- O Véu Rasgado: Na morte de Cristo, o véu rasgou-se de alto a baixo, abrindo livre acesso ao Santo dos Santos para todo crente.`,
        application: 'Você não precisa mais de sacerdotes humanos ou sacrifícios de animais. Por meio de Jesus, você tem acesso direto, a qualquer momento, à presença do Altíssimo.'
      },
      {
        id: 3,
        title: 'Os Salmos Messiânicos e a Cruz de Davi',
        verse: 'Deus meu, Deus meu, por que me desamparaste?... Traspassaram-me as mãos e os pés. — Salmo 22:1, 16',
        intro: 'Mil anos antes da crucificação romana ser inventada, o rei Davi profetizou com exatidão cirúrgica a agonia e o triunfo do Messias.',
        content: `O Salmo 22 é um dos testemunhos proféticos mais extraordinários da história universal. Davi nunca morreu crucificado, mas sob inspiração direta do Espírito Santo, escreveu em detalhes sobre o sofrimento de Cristo no Gólgota:

1. O Grito de Agonia: "Deus meu, Deus meu, por que me desamparaste?" — exatamente as palavras proferidas por Jesus na cruz (Mateus 27:46).
2. O Escárnio Público: "Meneiam a cabeça, dizendo: Confiou no Senhor, que o livre" (Salmo 22:7-8).
3. A Sede Feroz: "A minha língua se apega ao meu céu da boca" (Salmo 22:15).
4. O Método de Execução: "Traspassaram-me as mãos e os pés" — séculos antes de Roma adotar a crucificação como pena capital.
5. O Sorteio das Vestes: "Repartem entre si as minhas vestes, e sobre a minha túnica lançam sortes" (Salmo 22:18, cumprido em João 19:24).

E o salmo termina não em derrota, mas em vitória retumbante: "Ele o fez" (consumado está!), e todas as famílias da terra se converterão ao Senhor.`,
        application: 'A sua salvação não foi um improviso. Cada detalhe da redenção foi planejado e profetizado com fidelidade eterna.'
      }
    ]
  },
  {
    id: 3,
    title: 'O Poder da Oração do Salmo 91',
    author: 'Edificação Diária',
    badge: 'PROTEÇÃO',
    cover: '/ebooks/covers/poder-oracao-salmo-91.jpg',
    pdfUrl: '/ebooks/pdfs/poder-oracao-salmo-91.pdf',
    desc: 'O manual de refúgio espiritual e oração de proteção para o seu lar. Aprenda a habitar no esconderijo do Altíssimo e descansar sob a sombra do Onipotente.',
    chapters: [
      {
        id: 1,
        title: 'Habitar no Abrigo do Altíssimo',
        verse: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. — Salmo 91:1',
        intro: 'A diferença entre visitar a Deus nos momentos de desespero e fazer dEle a sua morada contínua.',
        content: `O salmo começa com um verbo no presente contínuo: "habita". Habitar significa residir, permanecer, fincar raízes, estabelecer endereço. Muitos cristãos tratam Deus como um pronto-socorro espiritual — visitam-no apenas nas emergências, mas vivem no território do mundanismo.

A promessa de descanso sob a sombra do Onipotente ('El Shaddai' — o Deus Todo-Suficiente) pertence àquele que escolheu fazer da presença de Deus a sua atmosfera diária.

Sob essa sombra:
- O calor opressor das aflições não pode desidratar sua fé;
- As tempestades da vida encontram uma muralha inabalável;
- O medo do futuro dá lugar a uma paz que excede todo o entendimento humano.`,
        application: 'Oração Prática: Senhor Deus, declaro hoje que a Tua presença é a minha casa. Não quero ser um visitante eventual, mas um filho que habita continuamente sob as Tuas asas protetoras.'
      },
      {
        id: 2,
        title: 'Livramento do Laço do Passarinheiro e da Peste',
        verse: 'Porque ele te livrará do laço do passarinheiro, e da peste perniciosa. Ele te cobrirá com as suas penas, e debaixo das suas asas te confiarás; a sua verdade será o teu escudo e broquel. — Salmo 91:3-4',
        intro: 'Como Deus desmonta as armadilhas invisíveis e defende seus filhos dos ataques sutis.',
        content: `O passarinheiro nunca caça às claras; ele esconde o laço sob as folhagens e usa uma isca apetitosa para atrair a ave distraída.

O laço do passarinheiro representa as ciladas morais, financeiras e emocionais que o inimigo arma nos caminhos da vida: ofensas não resolvidas, propostas desonestas que parecem vantajosas, e armadilhas contra a harmonia da sua família.

Deus nos livra de duas maneiras:
1. Revelando a armadilha antes de cairmos nela, dando-nos discernimento espiritual;
2. Quebrando o laço quando caímos inocentemente, tirando os nossos pés do perigo (Salmo 124:7).

Além disso, a Sua fidelidade atua como escudo circular (broquel) protegendo contra as pestes e contaminações morais que assolam a sociedade moderna.`,
        application: 'Peça hoje ao Espírito Santo que aguce o seu discernimento para enxergar e rejeitar qualquer laço disfarçado em seu caminho.'
      },
      {
        id: 3,
        title: 'A Ordem aos Anjos e a Vitória sobre o Leão',
        verse: 'Porque aos seus anjos dará ordem a teu respeito, para te guardarem em todos os teus caminhos. Eles te sustentarão nas suas mãos, para que não tropeces com o teu pé em pedra. — Salmo 91:11-12',
        intro: 'O exército celestial a serviço dos herdeiros da salvação e o triunfo contra as forças espirituais.',
        content: `A Bíblia ensina claramente que os anjos são espíritos ministradores enviados por Deus para servir em favor dos que hão de herdar a salvação (Hebreus 1:14).

Quando você anda na vontade de Deus, existe uma escolta espiritual invisível ao redor dos seus passos. Eles têm ordens expressas do trono da graça para sustentar você nas horas de fraqueza e impedir que tropece fatalmente nas pedras da jornada.

O salmo prossegue declarando que você pisará o leão e a serpente (Salmo 91:13) — símbolos do poder agressivo e astuto das forças do mal. Essa mesma autoridade foi confirmada por Jesus em Lucas 10:19: "Eis que vos dou poder para pisar serpentes e escorpiões, e toda a força do inimigo, e nada vos fará dano algum".`,
        application: 'Descanse com o seu coração tranquilo. Quem guarda o seu lar não tosqueneja nem dorme.'
      }
    ]
  },
  {
    id: 4,
    title: 'Tesouros do Conhecimento Bíblico',
    author: 'Cultura & Contexto',
    badge: 'HISTÓRIA & ARQUEOLOGIA',
    cover: '/ebooks/covers/tesouros-conhecimento-biblico.jpg',
    pdfUrl: '/ebooks/pdfs/tesouros-conhecimento-biblico.pdf',
    desc: 'Um guia completo sobre a geografia sagrada, os costumes, o hebraico e o grego bíblico para desvendar as entrelinhas dos textos sagrados.',
    chapters: [
      {
        id: 1,
        title: 'Costumes e Tradições do Oriente Bíblico',
        verse: 'Porque a minha casa será chamada casa de oração para todos os povos. — Isaías 56:7',
        intro: 'Compreender o contexto histórico e cultural transforma histórias familiares em revelações profundas.',
        content: `Muitas passagens das Escrituras ganham uma luz totalmente nova quando compreendemos os costumes da época:

- A Hospitalidade Oriental: No deserto, recusar água e abrigo a um forasteiro era considerado uma abominação gravíssima. A hospitalidade era vista como um pacto sagrado sob a proteção de Deus, o que ilumina a atitude de Abraão ao receber os anjos em Manre (Gênesis 18).

- Rasgar as Vestes: Quando um judeu presenciava uma blasfêmia ou sofria uma dor indizível, rasgava a túnica na altura do peito, simbolizando que seu coração estava exposto e quebrado. Deus diz através de Joel: "Rasgai o vosso coração, e não as vossas vestes".

- O Calçado Tirado: Tirar a sandália diante de alguém significava a renúncia a um direito legal de propriedade ou um ato de reverência em solo consagrado pela presença divina (como Moisés diante da sarça ardente).`,
        application: 'Ao ler a Bíblia, busque sempre perguntar: o que este texto significava para as pessoas que o ouviram pela primeira vez? A verdade se torna viva!'
      },
      {
        id: 2,
        title: 'Palavras Hebraicas de Poder: Shalom, Hesed e Ruach',
        verse: 'O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti... e te dê a paz. — Números 6:24-26',
        intro: 'A riqueza intraduzível de termos hebraicos que revelam a profundidade do caráter de Deus.',
        content: `Três termos fundamentais que transformam a compreensão das Escrituras:

1. SHALOM (שָׁלוֹם): Geralmente traduzido como "paz", Shalom significa muito mais do que a simples ausência de guerra ou conflito. Refere-se à inteireza, saúde, segurança, prosperidade espiritual, integridade e bem-estar total proveniente do pacto com Deus. Quando Jesus diz "Deixo-vos a minha paz", Ele está conferindo plenitude de vida.

2. HESED (חֶסֶד): Traduzido variadamente como misericórdia, benignidade ou graça. É o amor leal e imutável de Deus alicerçado em Sua aliança, um amor que não desiste, que permanece fiel mesmo quando nós falhamos.

3. RUACH (רוּחַ): Significa sopro, fôlego de vida, vento e Espírito. É o mesmo fôlego divino que soprou nas narinas de Adão, o vento que abriu o Mar Vermelho e o Espírito que ressuscitou os ossos secos na visão de Ezequiel.`,
        application: 'Receba hoje o Shalom de Deus em sua mente, descanse no Hesed incondicional do Pai e seja renovado pelo Ruach Santo.'
      }
    ]
  },
  {
    id: 5,
    title: 'Devocional Café com Deus',
    author: '1Convite Edificação',
    badge: 'DEVOCIONAL DIÁRIO',
    cover: '/ebooks/covers/devocional-cafe-com-deus.jpg',
    pdfUrl: '/ebooks/pdfs/devocional-cafe-com-deus.pdf',
    desc: 'Meditações diárias para começar o dia na presença de Deus com direção prática, versículos-chave e oração guiada.',
    chapters: [
      {
        id: 1,
        title: 'O Primeiro Encontro da Manhã',
        verse: 'Pela manhã ouvirás a minha voz, ó Senhor; pela manhã apresentarei a ti a minha oração, e vigiarei. — Salmos 5:3',
        intro: 'Antes que as urgências do dia disputem sua atenção, reserve os primeiros minutos para alinhar o coração com o Criador.',
        content: `Quando entregamos as primícias do dia em oração e leitura da Palavra, nossa mente encontra clareza, paz e direção para cada decisão.\n\nNão se trata apenas de cumprir um hábito religioso, mas de cultivar uma conversa viva com o Pai antes de abrir portas, responder mensagens ou enfrentar pressões.`,
        application: 'Separe 10 minutos logo ao acordar para ler o devocional do dia e entregar sua agenda nas mãos do Senhor.'
      }
    ]
  }
];
