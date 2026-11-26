// Catálogo Oficial TemploFit com GIFs animados pareados 1:1 para cada exercício
export const TEMPLOFIT_CATALOGUE = [
  // --- EXERCÍCIOS BASE DOS PROGRAMAS OFICIAIS ---
  {
    id: "base_squat",
    nome: "Agachamento Livre",
    origem: "Fase 1 • Despertar",
    grupo: "quads",
    musculos: ["quads", "glutes"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/squat.gif",
    descricao: "Pés na largura dos ombros, desça o quadril mantendo a coluna ereta até as coxas ficarem paralelas ao chão.",
    instrucoes: [
      "Posicione os pés na largura dos ombros com as pontas ligeiramente para fora.",
      "Inicie o movimento projetando o quadril para trás e flexionando os joelhos.",
      "Desça até 90 graus mantendo os calcanhares colados no chão e retorne à posição inicial."
    ]
  },
  {
    id: "base_pushup",
    nome: "Flexão de Braços",
    origem: "Fase 1 & Fase 2",
    grupo: "chest",
    musculos: ["chest", "triceps", "shoulders"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/pushup.gif",
    descricao: "Mãos no chão na largura dos ombros, corpo alinhado e cotovelos a 45 graus durante a descida.",
    instrucoes: [
      "Apoie as mãos ligeiramente mais afastadas que a largura dos ombros.",
      "Mantenha o abdômen e glúteos travados para não deixar o quadril cair.",
      "Desça o peito próximo ao chão e empurre de volta à posição inicial com controle."
    ]
  },
  {
    id: "base_plank",
    nome: "Prancha Isométrica",
    origem: "Fase 1 & Fase 2",
    grupo: "abs",
    musculos: ["abs", "shoulders"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/plank.gif",
    descricao: "Sustentação isométrica dos antebraços e pontas dos pés mantendo a linha corporal alinhada.",
    instrucoes: [
      "Apoie os antebraços e as pontas dos pés no chão.",
      "Mantenha cotovelos sob a linha dos ombros.",
      "Contraia fortemente o abdômen, sem elevar nem abaixar a lombar."
    ]
  },
  {
    id: "base_jumping",
    nome: "Polichinelos (Aquecimento & Cardio)",
    origem: "Fase 1 • Aquecimento",
    grupo: "calves",
    musculos: ["calves", "shoulders", "quads"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/jumping_jacks.gif",
    descricao: "Salto coordenado abrindo pernas e elevando os braços acima da cabeça em ritmo contínuo.",
    instrucoes: [
      "Comece em pé com braços ao longo do corpo e pés unidos.",
      "Dê um salto suave abrindo pernas e tocando as mãos acima da cabeça.",
      "Retorne à posição inicial mantendo respiração rítmica constante."
    ]
  },
  {
    id: "base_lunge",
    nome: "Afundo Alternado (Passada)",
    origem: "Fase 2 • Fortaleza",
    grupo: "quads",
    musculos: ["quads", "glutes", "hamstrings"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/lunge.gif",
    descricao: "Passo longo à frente flexionando ambos os joelhos em 90 graus mantendo tronco firme e ereto.",
    instrucoes: [
      "Dê um passo à frente com uma perna.",
      "Desça até o joelho de trás quase tocar o chão em ângulo reto.",
      "Empurre pelo calcanhar da frente para retornar e repita alternando as pernas."
    ]
  },
  {
    id: "base_tricep",
    nome: "Mergulho de Tríceps (Cadeira ou Banco)",
    origem: "Fase 2 • Fortaleza",
    grupo: "triceps",
    musculos: ["triceps", "shoulders"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/tricep_dip.gif",
    descricao: "Mãos apoiadas na borda do banco/cadeira, descendo o tronco pela flexão dos cotovelos.",
    instrucoes: [
      "Apoie as mãos na borda de uma cadeira firme ou banco estável.",
      "Estenda as pernas à frente e flexione os cotovelos a 90 graus descendo o corpo.",
      "Empurre de volta contraindo os tríceps no topo do movimento."
    ]
  },
  {
    id: "base_bench",
    nome: "Supino Reto com Barra ou Halteres",
    origem: "Fase 3 • Gigantes",
    grupo: "chest",
    musculos: ["chest", "triceps", "shoulders"],
    ambiente: "academia",
    gifUrl: "/templofit/gifs/bench_press.gif",
    descricao: "Empurrada horizontal deitada no banco reto com escápulas travadas e amplitude total.",
    instrucoes: [
      "Deite-se no banco com pés firmes no chão e escápulas recolhidas.",
      "Desça a barra/halteres de forma controlada até tocar suavemente o peitoral médio.",
      "Empurre a carga para cima sem estalar os cotovelos no topo."
    ]
  },
  {
    id: "base_lat",
    nome: "Puxada Frontal na Polia Alta",
    origem: "Fase 3 • Gigantes",
    grupo: "back",
    musculos: ["back", "biceps"],
    ambiente: "academia",
    gifUrl: "/templofit/gifs/lat_pulldown.gif",
    descricao: "Trabalho vertical para dorsais puxando a barra em direção à parte superior do peito.",
    instrucoes: [
      "Sente-se no aparelho ajustando as almofadas sobre as coxas.",
      "Segure a barra com pegada pronada aberta e incline o tronco ligeiramente para trás.",
      "Puxe a barra até a clavícula focando na contração das escápulas e dorsais."
    ]
  },
  {
    id: "base_legpress",
    nome: "Leg Press 45°",
    origem: "Fase 3 • Gigantes",
    grupo: "quads",
    musculos: ["quads", "glutes", "calves"],
    ambiente: "academia",
    gifUrl: "/templofit/gifs/leg_press.gif",
    descricao: "Empurrada pesada de membros inferiores na plataforma inclinada a 45 graus.",
    instrucoes: [
      "Apoie as costas e cabeça no encosto com pés na largura dos ombros.",
      "Destrave a plataforma e flexione os joelhos trazendo a carga até 90 graus.",
      "Empurre com a sola dos pés sem estender totalmente os joelhos no final."
    ]
  },
  {
    id: "base_shoulder",
    nome: "Desenvolvimento Militar de Ombros",
    origem: "Fase 3 • Gigantes",
    grupo: "shoulders",
    musculos: ["shoulders", "triceps"],
    ambiente: "academia",
    gifUrl: "/templofit/gifs/shoulder_press.gif",
    descricao: "Elevação vertical de halteres acima da cabeça para fortalecimento de deltoides.",
    instrucoes: [
      "Segure os halteres na altura das orelhas com cotovelos abertos a 90 graus.",
      "Empurre os pesos verticalmente até quase encostarem acima da cabeça.",
      "Desça lentamente controlando a fase excêntrica até a linha dos ombros."
    ]
  },

  // --- CATÁLOGO EXPANDIDO WGER COM GIFS INDIVIDUAIS ---
  {
    id: "129",
    nome: "Supino Sentado na Máquina",
    origem: "Catálogo Geral",
    grupo: "chest",
    musculos: ["chest", "triceps"],
    ambiente: "academia",
    gifUrl: "/templofit/gifs/ex_129.gif",
    descricao: "Execução guiada de supino sentado para isolamento de peitoral com máxima segurança.",
    instrucoes: [
      "Ajuste a altura do banco para que as manoplas fiquem na linha do peito.",
      "Empurre as manoplas para frente estendendo os braços com estabilidade.",
      "Retorne controlando a carga sem deixar os pesos baterem na pilha."
    ]
  },
  {
    id: "203",
    nome: "Agachamento Goblet com Halter",
    origem: "Catálogo Geral",
    grupo: "quads",
    musculos: ["quads", "glutes", "abs"],
    ambiente: "academia",
    gifUrl: "/templofit/gifs/ex_203.gif",
    descricao: "Agachamento segurando um halter ou kettlebell junto ao peito para postura vertical perfeita.",
    instrucoes: [
      "Segure um halter verticalmente rente ao esterno com ambas as mãos.",
      "Agache descendo os cotovelos entre a parte interna dos joelhos.",
      "Suba pressionando o meio do pé no chão com peito aberto."
    ]
  },
  {
    id: "204",
    nome: "Rosca Bíceps Inclinada com Halteres",
    origem: "Catálogo Geral",
    grupo: "biceps",
    musculos: ["biceps"],
    ambiente: "academia",
    gifUrl: "/templofit/gifs/ex_204.gif",
    descricao: "Flexão de cotovelos no banco inclinado a 45° proporcionando maior pré-alongamento do bíceps.",
    instrucoes: [
      "Ajuste o banco em inclinação de 45° a 60° e deite apoiando as costas por completo.",
      "Com os braços estendidos para baixo, flexione os cotovelos supinando os punhos.",
      "Controle a descida até o alongamento completo das fibras do bíceps."
    ]
  },
  {
    id: "308",
    nome: "Crucifixo Inclinado com Halteres",
    origem: "Catálogo Geral",
    grupo: "chest",
    musculos: ["chest", "shoulders"],
    ambiente: "academia",
    gifUrl: "/templofit/gifs/ex_308.gif",
    descricao: "Abertura peitoral no banco inclinado focando na porção clavicular do peitoral maior.",
    instrucoes: [
      "Deite no banco inclinado com os halteres acima do peito e cotovelos levemente flexionados.",
      "Abra os braços em arco amplo sentindo o peitoral esticar.",
      "Traga os halteres de volta ao topo como se estivesse abraçando uma árvore."
    ]
  },
  {
    id: "320",
    nome: "Polichinelos com Extensão Total",
    origem: "Catálogo Geral",
    grupo: "calves",
    musculos: ["calves", "quads", "shoulders"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/ex_320.gif",
    descricao: "Variação dinâmica com amplitude máxima de braços e pernas para condicionamento aeróbico.",
    instrucoes: [
      "Inicie ereto com pernas unidas e palmas das mãos nas coxas.",
      "Abra pernas em salto sincronizado enquanto toca as mãos no alto.",
      "Retorne rápido ao centro mantendo a ponta dos pés amortecendo aterrissagem."
    ]
  },
  {
    id: "349",
    nome: "Remada Unilateral na Polia",
    origem: "Catálogo Geral",
    grupo: "shoulders",
    musculos: ["shoulders", "back"],
    ambiente: "academia",
    gifUrl: "/templofit/gifs/ex_349.gif",
    descricao: "Remada com um braço por vez na polia para correção de assimetrias e tônus dorsal.",
    instrucoes: [
      "Segure o estribo com uma das mãos e posicione o tronco estável.",
      "Puxe o cotovelo para trás rente às costelas contraindo a escápula.",
      "Estenda o braço controladamente permitindo que a dorsal se alongue."
    ]
  },
  {
    id: "456",
    nome: "Agachamento Pistola Unilateral (Pistol Squat)",
    origem: "Catálogo Geral",
    grupo: "quads",
    musculos: ["quads", "glutes", "hamstrings"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/ex_456.gif",
    descricao: "Agachamento profundo com uma única perna estendendo a outra à frente, exercício avançado de equilíbrio.",
    instrucoes: [
      "Fique sobre uma perna estendendo a perna oposta para frente.",
      "Flexione o joelho de apoio descendo o quadril de forma estável.",
      "Retorne à posição de pé gerando força no calcanhar da perna ativa."
    ]
  },
  {
    id: "458",
    nome: "Prancha de Antebraços Estabilizada",
    origem: "Catálogo Geral",
    grupo: "abs",
    musculos: ["abs", "shoulders"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/ex_458.gif",
    descricao: "Prancha frontal clássica com antebraços paralelos e contração de todo o cinturão abdominal.",
    instrucoes: [
      "Deite de bruços e suba nos antebraços e pontas dos pés.",
      "Mantenha pescoço neutro olhando para o chão entre as mãos.",
      "Segure a postura sem arquear a lombar até o fim do tempo estipulado."
    ]
  },
  {
    id: "622",
    nome: "Elevação de Panturrilha em Pé",
    origem: "Catálogo Geral",
    grupo: "calves",
    musculos: ["calves"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/ex_622.gif",
    descricao: "Flexão plantar completa para fortalecimento dos gastrocnêmios e sóleo.",
    instrucoes: [
      "Fique em pé próximo a uma parede ou apoio com pés paralelos.",
      "Eleve os calcanhares o mais alto possível sustentando 1 segundo no topo.",
      "Desça os calcanhares controladamente até tocar levemente o piso."
    ]
  },
  {
    id: "691",
    nome: "Remada Alta Guiada (Smith / Polia)",
    origem: "Catálogo Geral",
    grupo: "shoulders",
    musculos: ["shoulders", "back"],
    ambiente: "academia",
    gifUrl: "/templofit/gifs/ex_691.gif",
    descricao: "Puxada vertical com cotovelos apontando para cima para deltoides laterais e trapézio.",
    instrucoes: [
      "Segure a barra com pegada na largura dos ombros.",
      "Puxe a barra verticalmente até a altura do peito, mantendo cotovelos acima dos punhos.",
      "Desça a barra em ritmo controlado até a extensão dos braços."
    ]
  },
  {
    id: "958",
    nome: "Rosca Bíceps em Fita TRX (Suspensão)",
    origem: "Catálogo Geral",
    grupo: "biceps",
    musculos: ["biceps", "abs"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/ex_958.gif",
    descricao: "Flexão de cotovelos utilizando o peso do próprio corpo em fita de suspensão funcional.",
    instrucoes: [
      "Segure as manoplas do TRX com tronco inclinado para trás e corpo reto.",
      "Flexione os cotovelos trazendo as mãos em direção à testa.",
      "Retorne lentamente mantendo o abdômen contraído durante todo o percurso."
    ]
  },
  {
    id: "999",
    nome: "Afundo Invertido Alternado",
    origem: "Catálogo Geral",
    grupo: "glutes",
    musculos: ["glutes", "quads", "hamstrings"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/ex_999.gif",
    descricao: "Passo para trás protegendo o joelho frontal com ativação concentrada de glúteos e posteriores.",
    instrucoes: [
      "Em pé com pés na largura do quadril, dê um passo amplo para trás.",
      "Flexione os dois joelhos em 90 graus mantendo o tronco vertical.",
      "Volte à posição inicial impulsionando pela perna da frente e alterne os lados."
    ]
  },
  {
    id: "1003",
    nome: "Levantamento Terra com Kettlebell",
    origem: "Catálogo Geral",
    grupo: "hamstrings",
    musculos: ["hamstrings", "glutes", "back"],
    ambiente: "academia",
    gifUrl: "/templofit/gifs/ex_1003.gif",
    descricao: "Padrão de bisagra de quadril para ativação da cadeia posterior e proteção lombar.",
    instrucoes: [
      "Fique sobre o kettlebell com pés na largura dos ombros.",
      "Projete o quadril para trás dobrando levemente os joelhos e segure a alça firme.",
      "Suba estendendo o quadril e glúteos mantendo a coluna 100% reta."
    ]
  },
  {
    id: "1018",
    nome: "Mobilidade Cervical e Alívio de Tensão",
    origem: "Catálogo Geral",
    grupo: "shoulders",
    musculos: ["shoulders", "abs"],
    ambiente: "casa",
    gifUrl: "/templofit/gifs/ex_1018.gif",
    descricao: "Movimentos controlados de inclinação lateral e rotação para descompressão do pescoço e trapézio.",
    instrucoes: [
      "Sente-se ou fique em pé com a coluna ereta e ombros relaxados.",
      "Incline suavemente a cabeça em direção ao ombro direito sentindo o alongamento lateral.",
      "Sustente por 5 a 10 segundos respirando fundo e repita para o lado esquerdo."
    ]
  },
  {
    id: "1117",
    nome: "Remada Sentada no Cabo (Polia Baixa)",
    origem: "Catálogo Geral",
    grupo: "back",
    musculos: ["back", "biceps"],
    ambiente: "academia",
    gifUrl: "/templofit/gifs/ex_1117.gif",
    descricao: "Remada horizontal sentado para densidade de costas e postura dorsal.",
    instrucoes: [
      "Sente-se no aparelho com pés apoiados na plataforma e joelhos semi-flexionados.",
      "Segure o puxador em V com braços estendidos e peito estufado.",
      "Puxe o suporte em direção ao abdômen aproximando as escápulas e retorne controlado."
    ]
  }
];
