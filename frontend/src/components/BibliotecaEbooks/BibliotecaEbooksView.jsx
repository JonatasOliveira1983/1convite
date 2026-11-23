import React, { useState } from 'react';
import './BibliotecaEbooksView.css';

const EBOOKS = [
  {
    id: 1,
    title: 'As Parábolas de Jesus',
    author: 'Estudos Canônicos',
    badge: 'NOVO',
    desc: 'Um mergulho aprofundado nas narrativas mais poderosas contadas pelo Mestre, desvendando seus significados espirituais e aplicações práticas para os dias de hoje.',
    chapters: [
      { title: 'O Semeador e os Quatro Solos', desc: 'Como o coração humano reage à semente da Palavra de Deus.' },
      { title: 'O Filho Pródigo', desc: 'A revelação do amor incondicional do Pai e o resgate da comunhão.' },
      { title: 'O Bom Samaritano', desc: 'O verdadeiro conceito de compaixão e amor ao próximo na prática.' },
      { title: 'Os Talentos', desc: 'Fidelidade, mordomia cristã e multiplicação do que Deus nos confiou.' }
    ]
  },
  {
    id: 2,
    title: 'Cristo como Centro das Escrituras',
    author: 'Teologia Bíblica',
    badge: 'ESSENCIAL',
    desc: 'Descubra como cada livro da Bíblia, de Gênesis ao Apocalipse, aponta profética e tipologicamente para a pessoa, o sacrifício e o Reino de Jesus Cristo.',
    chapters: [
      { title: 'A Promessa em Gênesis 3:15', desc: 'O protoevangelho e a semente da mulher que esmaga a serpente.' },
      { title: 'Tipologia no Tabernáculo', desc: 'Cada detalhe da arca, mesa e véu apontando para o Cordeiro.' },
      { title: 'Os Salmos Messiânicos', desc: 'As dores da cruz e a glória da ressurreição profetizadas por Davi.' },
      { title: 'O Cumprimento nos Evangelhos', desc: 'A plenitude dos tempos e a consumação da salvação.' }
    ]
  },
  {
    id: 3,
    title: 'O Poder da Oração do Salmo 91',
    author: 'Edificação Diária',
    badge: 'PROTEÇÃO',
    desc: 'O manual de refúgio espiritual e oração de proteção para o seu lar. Aprenda a habitar no esconderijo do Altíssimo e descansar sob a sombra do Onipotente.',
    chapters: [
      { title: 'O Esconderijo do Altíssimo', desc: 'O que significa habitar e fazer morada na presença de Deus.' },
      { title: 'Livramento do Laço do Passarinheiro', desc: 'Como Deus desfaz as armadilhas invisíveis montadas contra sua vida.' },
      { title: 'Mil Cairão ao Teu Lado', desc: 'A promessa da imunidade espiritual e o escudo da verdade.' },
      { title: 'Aos Seus Anjos Dará Ordens', desc: 'O ministério angelical em favor dos que temem ao Senhor.' }
    ]
  },
  {
    id: 4,
    title: 'Tesouros do Conhecimento Bíblico',
    author: 'Cultura & Contexto',
    badge: 'HISTÓRIA',
    desc: 'Um guia completo sobre a geografia, os costumes, o hebraico e o grego bíblico para você compreender as entrelinhas dos textos sagrados.',
    chapters: [
      { title: 'Costumes e Tradições no Oriente Médio', desc: 'Entenda os pactos, alianças e banquetes nos tempos bíblicos.' },
      { title: 'Palavras Hebraicas de Poder', desc: 'Shalom, Hesed, Ruach e Elohim explicados no original.' },
      { title: 'Geografia dos Lugares Sagrados', desc: 'Jerusalém, o Mar da Galileia e as rotas dos apóstolos.' }
    ]
  },
  {
    id: 5,
    title: 'Apocalipse Revelado',
    author: 'Escatologia & Esperança',
    badge: 'PROFÉTICO',
    desc: 'O livro da revelação explicado sem medo e com foco na vitória final de Jesus Cristo e no estabelecimento da Nova Jerusalém.',
    chapters: [
      { title: 'As Sete Igrejas da Ásia', desc: 'Exortações, elogios e alertas espirituais para a igreja de hoje.' },
      { title: 'O Cordeiro e os Sete Selos', desc: 'A soberania do Leão da Tribo de Judá sobre a história.' },
      { title: 'A Nova Jerusalém e o Fim das Dores', desc: 'A restauração de todas as coisas e a eternidade com Deus.' }
    ]
  }
];

export default function BibliotecaEbooksView({ onBack }) {
  const [selectedEbook, setSelectedEbook] = useState(null);

  return (
    <div className="eb-container animate-fade-in">
      <header className="eb-header">
        <button onClick={() => selectedEbook ? setSelectedEbook(null) : onBack()} className="eb-back-btn" aria-label="Voltar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="eb-header-info">
          <div className="eb-pill">
            <span className="eb-pill-dot" />
            <span>BIBLIOTECA PREMIUM</span>
          </div>
          <h1 className="eb-title">E-books & Livros Digitais</h1>
        </div>

        <div style={{ width: 40 }} />
      </header>

      {!selectedEbook ? (
        <div className="eb-grid">
          {EBOOKS.map(b => (
            <div 
              key={b.id} 
              onClick={() => setSelectedEbook(b)}
              className="eb-card"
            >
              <div className="eb-card-header">
                <span className="eb-badge">{b.badge}</span>
                <span className="eb-author">{b.author}</span>
              </div>
              <h3 className="eb-card-title">{b.title}</h3>
              <p className="eb-card-desc">{b.desc}</p>
              <div className="eb-card-footer">
                <span>{b.chapters.length} capítulos disponíveis</span>
                <div className="eb-card-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <article className="eb-detail-view animate-fade-in">
          <div className="eb-detail-badge-row">
            <span className="eb-badge">{selectedEbook.badge}</span>
            <span className="eb-author">{selectedEbook.author}</span>
          </div>

          <h2 className="eb-detail-title">{selectedEbook.title}</h2>
          <p className="eb-detail-intro">{selectedEbook.desc}</p>

          <h3 className="eb-chapters-title">Capítulos & Estudos</h3>
          <div className="eb-chapters-list">
            {selectedEbook.chapters.map((ch, idx) => (
              <div key={idx} className="eb-chapter-item">
                <div className="eb-chapter-num">{idx + 1}</div>
                <div>
                  <h4 className="eb-chapter-name">{ch.title}</h4>
                  <p className="eb-chapter-desc">{ch.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => {
              const text = `📖 *${selectedEbook.title}*\n${selectedEbook.desc}\n\nDisponível na Biblioteca Digital do aplicativo 1Convite:\nhttps://1convite.com.br`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="eb-share-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>Recomendar Livro no WhatsApp</span>
          </button>
        </article>
      )}
    </div>
  );
}
