import React, { useState } from 'react';
import { EBOOKS_DATA } from '../../data/ebooksData';
import './BibliotecaEbooksView.css';

export default function BibliotecaEbooksView({ onBack }) {
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [readingChapter, setReadingChapter] = useState(null);
  const [readingPdf, setReadingPdf] = useState(false);
  const [fontSize, setFontSize] = useState(16); // 14, 16, 18, 20

  const handleOpenBook = (book) => {
    setSelectedEbook(book);
    setReadingChapter(null);
    setReadingPdf(false);
  };

  const handleOpenChapter = (chapter) => {
    setReadingChapter(chapter);
  };

  const handleNextChapter = () => {
    if (!selectedEbook || !readingChapter) return;
    const currentIndex = selectedEbook.chapters.findIndex(c => c.id === readingChapter.id);
    if (currentIndex < selectedEbook.chapters.length - 1) {
      setReadingChapter(selectedEbook.chapters[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevChapter = () => {
    if (!selectedEbook || !readingChapter) return;
    const currentIndex = selectedEbook.chapters.findIndex(c => c.id === readingChapter.id);
    if (currentIndex > 0) {
      setReadingChapter(selectedEbook.chapters[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="eb-container animate-fade-in">
      {/* ── TOPO / HEADER ── */}
      <header className="eb-header">
        <button 
          onClick={() => {
            if (readingPdf) {
              setReadingPdf(false);
            } else if (readingChapter) {
              setReadingChapter(null);
            } else if (selectedEbook) {
              setSelectedEbook(null);
            } else {
              onBack();
            }
          }} 
          className="eb-back-btn" 
          aria-label="Voltar"
          title="Voltar"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="eb-header-info">
          <div className="eb-pill">
            <span className="eb-pill-dot" />
            <span>BIBLIOTECA DIGITAL PREMIUM</span>
          </div>
          <h1 className="eb-title">
            {readingChapter ? selectedEbook.title : (selectedEbook ? selectedEbook.title : 'E-books & Livros')}
          </h1>
        </div>

        <div style={{ width: 40, display: 'flex', justifyContent: 'flex-end' }}>
          {readingChapter && (
            <div className="eb-font-controls">
              <button 
                onClick={() => setFontSize(prev => Math.max(13, prev - 2))}
                className="eb-font-btn"
                title="Diminuir tamanho da letra"
              >
                A-
              </button>
              <button 
                onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                className="eb-font-btn"
                title="Aumentar tamanho da letra"
              >
                A+
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── ESTADO 1: LISTA DE E-BOOKS DISPONÍVEIS ── */}
      {!selectedEbook && (
        <div className="eb-grid animate-fade-in">
          {EBOOKS_DATA.map(b => (
            <div 
              key={b.id} 
              onClick={() => handleOpenBook(b)}
              className="eb-card"
            >
              {b.cover && (
                <div className="eb-card-cover-wrap">
                  <img src={b.cover} alt={b.title} className="eb-card-cover" loading="lazy" />
                </div>
              )}
              <div className="eb-card-header">
                <span className="eb-badge">{b.badge}</span>
                <span className="eb-author">{b.author}</span>
              </div>
              <h3 className="eb-card-title">{b.title}</h3>
              <p className="eb-card-desc">{b.desc}</p>
              <div className="eb-card-footer">
                <span className="eb-cap-count">PDF Completo + {b.chapters.length} estudos</span>
                <div className="eb-card-action">
                  <span>Abrir E-book</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ESTADO 2: SUMÁRIO E DETALHES DO LIVRO SELECIONADO ── */}
      {selectedEbook && !readingChapter && !readingPdf && (
        <article className="eb-detail-view animate-fade-in">
          <div className="eb-detail-hero">
            {selectedEbook.cover && (
              <img src={selectedEbook.cover} alt={selectedEbook.title} className="eb-detail-cover" />
            )}
            <div className="eb-detail-meta">
              <div className="eb-detail-badge-row">
                <span className="eb-badge">{selectedEbook.badge}</span>
                <span className="eb-author">{selectedEbook.author}</span>
              </div>
              <h2 className="eb-detail-title">{selectedEbook.title}</h2>
              <p className="eb-detail-intro">{selectedEbook.desc}</p>
              {selectedEbook.pdfUrl && (
                <div className="eb-pdf-actions">
                  <button
                    type="button"
                    className="eb-pdf-btn-primary"
                    onClick={() => setReadingPdf(true)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    <span>Ler PDF Completo</span>
                  </button>
                  <a
                    href={selectedEbook.pdfUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="eb-pdf-btn-secondary"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span>Baixar PDF</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="eb-chapters-header">
            <h3 className="eb-chapters-title">Capítulos & Estudos Completos</h3>
            <span className="eb-touch-hint">Toque para ler</span>
          </div>

          <div className="eb-chapters-list">
            {selectedEbook.chapters.map((ch, idx) => (
              <div 
                key={idx} 
                onClick={() => handleOpenChapter(ch)}
                className="eb-chapter-item"
              >
                <div className="eb-chapter-num">{idx + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 className="eb-chapter-name">{ch.title}</h4>
                  <p className="eb-chapter-desc">{ch.intro}</p>
                </div>
                <div className="eb-chapter-read-btn">
                  <span>Ler</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
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

      {/* ── ESTADO 2B: LEITOR DE PDF INTEGRADO ── */}
      {selectedEbook && readingPdf && selectedEbook.pdfUrl && (
        <div className="eb-pdf-reader animate-fade-in">
          <div className="eb-pdf-reader-bar">
            <span>{selectedEbook.title} • PDF Completo</span>
            <a href={selectedEbook.pdfUrl} download target="_blank" rel="noopener noreferrer" className="eb-pdf-btn-secondary">
              Baixar PDF
            </a>
          </div>
          <iframe
            src={selectedEbook.pdfUrl}
            title={selectedEbook.title}
            className="eb-pdf-viewer-frame"
          />
        </div>
      )}

      {/* ── ESTADO 3: LEITOR COMPLETO DO CAPÍTULO ── */}
      {selectedEbook && readingChapter && (
        <article className="eb-reader-view animate-fade-in" style={{ fontSize: `${fontSize}px` }}>
          <div className="eb-reader-meta">
            <span className="eb-reader-tag">Capítulo {readingChapter.id} de {selectedEbook.chapters.length}</span>
            <span className="eb-reader-bookname">{selectedEbook.title}</span>
          </div>

          <h2 className="eb-reader-title">{readingChapter.title}</h2>

          {/* Versículo de Abertura */}
          {readingChapter.verse && (
            <div className="eb-reader-verse-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              </svg>
              <blockquote className="eb-reader-verse-text">{readingChapter.verse}</blockquote>
            </div>
          )}

          {/* Introdução ao Capítulo */}
          <p className="eb-reader-intro-text">{readingChapter.intro}</p>

          {/* Texto Integral */}
          <div className="eb-reader-body">
            {readingChapter.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="eb-reader-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Aplicação Prática Devocional */}
          {readingChapter.application && (
            <div className="eb-reader-app-box">
              <div className="eb-reader-app-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span>Aplicação Prática para sua Vida</span>
              </div>
              <p className="eb-reader-app-text">{readingChapter.application}</p>
            </div>
          )}

          {/* Navegação Entre Capítulos */}
          <div className="eb-reader-nav-footer">
            <button 
              onClick={handlePrevChapter} 
              disabled={selectedEbook.chapters.findIndex(c => c.id === readingChapter.id) === 0}
              className="eb-nav-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              <span>Capítulo Anterior</span>
            </button>

            <button 
              onClick={handleNextChapter} 
              disabled={selectedEbook.chapters.findIndex(c => c.id === readingChapter.id) === selectedEbook.chapters.length - 1}
              className="eb-nav-btn primary"
            >
              <span>Próximo Capítulo</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </article>
      )}
    </div>
  );
}
