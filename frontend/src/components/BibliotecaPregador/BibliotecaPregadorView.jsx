import React, { useState } from 'react';
import './BibliotecaPregadorView.css';

const ESBOCOS = [
  {
    id: 1,
    title: 'A Calmaria no Meio da Tempestade',
    theme: 'Fé & Conflitos',
    verse: 'Marcos 4:35-41',
    intro: 'Os discípulos estavam no mesmo barco que Jesus, mas o medo quase os afundou. Estar com Cristo não impede a tempestade de chegar, mas garante que o barco não naufragará.',
    points: [
      { num: 'I', title: 'O Lugar da Promessa', desc: '"Passemos para a outra margem." Quando Jesus dá uma ordem, o destino final já está determinado por Sua Palavra.' },
      { num: 'II', title: 'O Sono do Mestre e o Pânico dos Homens', desc: 'Jesus dormia no travesseiro. A paz de Deus não depende das circunstâncias exteriores, mas da soberania interior.' },
      { num: 'III', title: 'A Palavra que Cala o Vento', desc: '"Cala-te, emudece." Toda tempestade que se levanta na sua vida precisa se curvar diante da voz do Criador.' }
    ],
    illustration: 'Em uma tempestade violenta em alto mar, o passageiro olha para o marinheiro em desespero, mas se acalma ao ver o capitão firme no leme com um semblante sereno. Olhe para o Capitão da sua alma.',
    conclusion: 'Não avalie a presença de Jesus pelo tamanho do vento. Chame por Ele em oração e descanse na certeza de que Ele reina sobre as águas.'
  },
  {
    id: 2,
    title: 'O Poder da Oração Eficaz',
    theme: 'Oração & Intimidade',
    verse: 'Tiago 5:16-18',
    intro: 'A oração não é um monólogo vazio, mas a chave que move os céus na terra. Elias era homem sujeito aos mesmos sentimentos que nós, e orou com fervor.',
    points: [
      { num: 'I', title: 'Oração com Fervor e Alinhamento', desc: 'Não são palavras bonitas, mas o coração sincero alinhado à vontade soberana de Deus.' },
      { num: 'II', title: 'A Justiça que Dá Acesso', desc: 'A oração do justo pode muito em seus efeitos. Nossa justiça vem do sangue de Jesus.' },
      { num: 'III', title: 'Perseverança até a Chuva Descer', desc: 'Elias enviou seu servo 7 vezes até ver uma pequena nuvem do tamanho da mão de um homem.' }
    ],
    illustration: 'Uma pequena torneira aberta pingando continuamente enche um tonel com o tempo. A oração perseverante acumula autoridade e produz colheitas abundantes.',
    conclusion: 'Não pare de orar. Aquilo que você semeia em lágrimas e joelhos dobrados no secreto, o Pai manifestará com poder em público.'
  },
  {
    id: 3,
    title: 'A Graça que Restaura o Caído',
    theme: 'Salvação & Graça',
    verse: 'Lucas 15:11-24',
    intro: 'A parábola do filho pródigo revela que o coração do Pai nunca esteve focado na herança perdida, mas no filho resgatado.',
    points: [
      { num: 'I', title: 'A Ilusão da Distância', desc: 'Achar que longe do Pai teremos liberdade plena. O mundo cobra tudo e devolve apenas cascas.' },
      { num: 'II', title: 'Caindo em Si', desc: 'O arrependimento genuíno começa quando reconhecemos nossa necessidade de voltar para a casa paterna.' },
      { num: 'III', title: 'O Abraço antes da Confissão', desc: 'O Pai correu ao encontro do filho antes mesmo dele terminar o discurso. A graça sempre antecipa o julgamento.' }
    ],
    illustration: 'O anel restaurado, as sandálias nos pés e a melhor roupa simbolizam que Deus não nos aceita como escravos, mas nos recebe de volta como filhos legítimos.',
    conclusion: 'Não importa quão longe você tenha ido. Hoje é dia de voltar correndo para os braços do Pai, onde há banquete e restauração.'
  },
  {
    id: 4,
    title: 'Uma Família Edificada sobre a Rocha',
    theme: 'Família & Altar',
    verse: 'Josué 24:14-15',
    intro: 'Josué reuniu todo o povo e declarou seu posicionamento: "Eu e a minha casa serviremos ao Senhor". A liderança espiritual do lar é uma decisão inegociável.',
    points: [
      { num: 'I', title: 'O Perigo da Neutralidade', desc: 'Não existe família neutra. Ou seu lar é regido pelos valores do Reino ou pelos padrões passageiros do mundo.' },
      { num: 'II', title: 'O Testemunho que Educa', desc: 'Filhos aprendem muito mais com o que vêem os pais vivendo em secreto do que com regras impostas.' },
      { num: 'III', title: 'O Altar Familiar Restaurado', desc: 'A presença do Espírito Santo na casa dissipa as contendas e estabelece a paz de Cristo.' }
    ],
    illustration: 'Uma casa construída sobre a areia parece bonita enquanto faz sol. O teste real da estrutura acontece quando os ventos e as enxurradas batem forte.',
    conclusion: 'Decida hoje consagrar sua casa, seu casamento e seus filhos no altar de Deus. O que você consagra a Ele, o inimigo não pode destruir.'
  }
];

export default function BibliotecaPregadorView({ onBack }) {
  const [selectedTheme, setSelectedTheme] = useState('Todos');
  const [activeEsboco, setActiveEsboco] = useState(null);

  const themes = ['Todos', 'Fé & Conflitos', 'Oração & Intimidade', 'Salvação & Graça', 'Família & Altar'];

  const filteredEsbocos = selectedTheme === 'Todos' 
    ? ESBOCOS 
    : ESBOCOS.filter(e => e.theme === selectedTheme);

  return (
    <div className="bp-container animate-fade-in">
      <header className="bp-header">
        <button onClick={() => activeEsboco ? setActiveEsboco(null) : onBack()} className="bp-back-btn" aria-label="Voltar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="bp-header-info">
          <div className="bp-pill">
            <span className="bp-pill-dot" />
            <span>HOMILÉTICA & TEOLOGIA</span>
          </div>
          <h1 className="bp-title">Biblioteca do Pregador</h1>
        </div>

        <div style={{ width: 40 }} />
      </header>

      {/* Se não está lendo um esboço, mostra a listagem */}
      {!activeEsboco ? (
        <>
          {/* Filtro de Temas */}
          <div className="bp-themes-scroll">
            {themes.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTheme(t)}
                className={`bp-theme-chip ${selectedTheme === t ? 'active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="bp-list">
            {filteredEsbocos.map(esboco => (
              <div 
                key={esboco.id} 
                onClick={() => setActiveEsboco(esboco)}
                className="bp-card"
              >
                <div className="bp-card-top">
                  <span className="bp-theme-tag">{esboco.theme}</span>
                  <span className="bp-verse-tag">{esboco.verse}</span>
                </div>
                <h3 className="bp-card-title">{esboco.title}</h3>
                <p className="bp-card-preview">{esboco.intro.substring(0, 110)}...</p>
                <div className="bp-card-footer">
                  <span>{esboco.points.length} pontos estruturados</span>
                  <div className="bp-card-arrow">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Visualizador Completo do Esboço */
        <article className="bp-detail-card animate-fade-in">
          <div className="bp-detail-top">
            <span className="bp-theme-tag">{activeEsboco.theme}</span>
            <span className="bp-verse-tag">{activeEsboco.verse}</span>
          </div>

          <h2 className="bp-detail-title">{activeEsboco.title}</h2>

          <div className="bp-section-block">
            <h4 className="bp-section-header">Introdução</h4>
            <p className="bp-text">{activeEsboco.intro}</p>
          </div>

          <div className="bp-section-block">
            <h4 className="bp-section-header">Desenvolvimento Homilético</h4>
            <div className="bp-points-list">
              {activeEsboco.points.map(pt => (
                <div key={pt.num} className="bp-point-item">
                  <div className="bp-point-num">{pt.num}</div>
                  <div>
                    <h5 className="bp-point-title">{pt.title}</h5>
                    <p className="bp-point-desc">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bp-section-block bp-illustration-box">
            <h4 className="bp-section-header">Ilustração para o Sermão</h4>
            <p className="bp-text">{activeEsboco.illustration}</p>
          </div>

          <div className="bp-section-block bp-conclusion-box">
            <h4 className="bp-section-header">Conclusão & Apelo</h4>
            <p className="bp-text">{activeEsboco.conclusion}</p>
          </div>

          <button 
            onClick={() => {
              const fullText = `*${activeEsboco.title}* (${activeEsboco.verse})\n\n` +
                `*Introdução:*\n${activeEsboco.intro}\n\n` +
                activeEsboco.points.map(p => `*${p.num}. ${p.title}*\n${p.desc}`).join('\n\n') +
                `\n\n*Conclusão:*\n${activeEsboco.conclusion}\n\n` +
                `📖 _Esboço da Biblioteca do Pregador no 1Convite:_ https://1convite.com.br`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`, '_blank');
            }}
            className="bp-share-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>Compartilhar Esboço no WhatsApp</span>
          </button>
        </article>
      )}
    </div>
  );
}
