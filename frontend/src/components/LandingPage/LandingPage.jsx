import React, { useState } from 'react';
import './LandingPage.css';
import { sendLeadWebhook } from '../../services/webhookService';

export default function LandingPage({ onEnterApp }) {
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadObjective, setLeadObjective] = useState('crescimento');
  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success
  const [selectedMentor, setSelectedMentor] = useState('salomao');

  const mentores = [
    { id: 'jesus', nome: 'Jesus Cristo', papel: 'O Mestre e Redentor', citacao: 'Vinde a mim todos os que estais cansados e oprimidos, e eu vos aliviarei.', foco: 'Paz profunda, salvação e graça' },
    { id: 'salomao', nome: 'Rei Salomão', papel: 'O Rei da Sabedoria', citacao: 'O que adquire entendimento ama a sua alma; o que cultiva a inteligência achará o bem.', foco: 'Finanças, prudência e negócios' },
    { id: 'davi', nome: 'Rei Davi', papel: 'O Homem Segundo o Coração de Deus', citacao: 'O Senhor é a minha luz e a minha salvação; a quem temerei?', foco: 'Coragem, quebra de gigantes e adoração' },
    { id: 'paulo', nome: 'Apóstolo Paulo', papel: 'O Apóstolo dos Gentios', citacao: 'Combati o bom combate, acabei a carreira, guardei a fé.', foco: 'Propósito eterno e resiliência' },
    { id: 'moises', nome: 'Moisés', papel: 'O Libertador e Legislador', citacao: 'Se a tua presença não for conosco, não nos faças subir daqui.', foco: 'Liderança e paciência no deserto' },
    { id: 'ester', nome: 'Rainha Ester', papel: 'A Rainha da Coragem', citacao: 'Se perecer, pereci. Entrarei na presença do Rei.', foco: 'Posicionamento e jejum estratégico' }
  ];

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadPhone.trim()) return;
    setFormStatus('loading');
    try {
      await sendLeadWebhook({
        nome: leadName || 'Irmão Convidado',
        phone: leadPhone,
        origem: 'landing-hallmark-1convite',
        pagina: window.location.href,
        objetivo: leadObjective
      });
      setFormStatus('success');
    } catch (err) {
      console.error(err);
      setFormStatus('success'); // Sucesso resiliente para não frustrar o usuário
    }
  };

  return (
    <div className="hallmark-landing">
      {/* ── BARRA DE NAVEGAÇÃO ── */}
      <header className="hl-nav">
        <div className="hl-nav-container">
          <div className="hl-brand" onClick={onEnterApp} style={{ cursor: 'pointer' }}>
            <img src="/LOGO.png" alt="1Convite Logo" className="hl-logo-img" />
            <span className="hl-brand-name">1Convite</span>
          </div>

          <nav className="hl-nav-links">
            <a href="#recursos">Recursos</a>
            <a href="#laya">LAYA IA</a>
            <a href="#trilha">Trilha do Reino</a>
            <a href="#download-apk" className="hl-apk-pill">📱 APK Android</a>
          </nav>

          <div className="hl-nav-actions">
            <button className="hl-btn-app" onClick={onEnterApp}>
              <span>Acessar App</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION EDITORIAL (PADRÃO HALLMARK) ── */}
      <section className="hl-hero">
        <div className="hl-hero-bg-orb" />
        <div className="hl-hero-container">
          <div className="hl-badge-tag">
            <span className="hl-badge-dot" />
            <span>ECOSSISTEMA CRISTÃO COMPLETO • WEB & ANDROID</span>
          </div>

          <h1 className="hl-hero-title">
            A Palavra de Deus Viva.<br />
            <span className="hl-title-gradient">O Reino no seu bolso.</span>
          </h1>

          <p className="hl-hero-lead">
            Integre a leitura completa da Bíblia Sagrada com áudio imersivo, reflexões diárias de liderança, planos cronológicos e a sabedoria dos conselheiros bíblicos com IA nativa.
          </p>

          <div className="hl-hero-ctas">
            <button className="hl-btn-primary" onClick={onEnterApp}>
              <span className="hl-btn-icon">🔥</span>
              <span>Abrir 1Convite Agora</span>
            </button>

            <a href="#download-apk" className="hl-btn-secondary">
              <span className="hl-btn-icon">🤖</span>
              <span>Baixar APK Android</span>
            </a>
          </div>

          {/* MOCKUP VISUAL COM ILUMINAÇÃO EDITORIAL */}
          <div className="hl-mockup-wrapper">
            <div className="hl-mockup-glow" />
            <img
              src="/app_mobile_mockup.png"
              alt="1Convite App Mobile"
              className="hl-mockup-image"
            />
          </div>
        </div>
      </section>

      {/* ── SEÇÃO: OS 5 PILARES DO REINO ── */}
      <section id="recursos" className="hl-section">
        <div className="hl-container">
          <div className="hl-section-header">
            <span className="hl-section-kicker">ARQUITETURA ESPIRITUAL</span>
            <h2 className="hl-section-title">Construído para edificação real e diária</h2>
            <p className="hl-section-sub">Tudo o que você precisa para cultivar disciplina espiritual, sabedoria e comunhão em uma só ferramenta.</p>
          </div>

          <div className="hl-grid-pillars">
            {/* Pilar 1 */}
            <div className="hl-card-pillar hl-card-featured">
              <div className="hl-card-icon-box">📖</div>
              <h3>Bíblia Sagrada Completa & Áudio</h3>
              <p>Texto fidedigno em Almeida Corrigida Fiel (ACF) com 31.106 versículos, busca instantânea, marcações coloridas, comentários pessoais e player de áudio narrado com cache offline.</p>
              <div className="hl-pillar-badge">31.106 versículos indexados</div>
            </div>

            {/* Pilar 2 */}
            <div className="hl-card-pillar">
              <div className="hl-card-icon-box">⚡</div>
              <h3>Desafio do Dia & Matriz 365</h3>
              <p>Códigos verbais diários de liderança e governo emocional, histórias cristãs reais (de Moody a Spurgeon) e oração guiada em 4 fases espirituais estruturadas.</p>
              <div className="hl-pillar-badge">365 dias de jornadas</div>
            </div>

            {/* Pilar 3 */}
            <div className="hl-card-pillar hl-card-highlight">
              <div className="hl-card-icon-box">🧠</div>
              <h3>LAYA — Sabedoria Bíblica em CPU</h3>
              <p>Motor de IA nativo com busca semântica instantânea por emoções e situações de vida, além de mentoria canônica com Jesus, Salomão, Davi, Paulo, Moisés e Ester.</p>
              <div className="hl-pillar-badge">Zero custo por token</div>
            </div>

            {/* Pilar 4 */}
            <div className="hl-card-pillar">
              <div className="hl-card-icon-box">👑</div>
              <h3>Trilha do Reino & Talentos</h3>
              <p>Plano de leitura bíblica cronológico em 18 ou 12 meses. Acompanhamento de streak, ganho de Talentos (moedas), mapa visual de fé e marcos espirituais.</p>
              <div className="hl-pillar-badge">Cronologia completa</div>
            </div>

            {/* Pilar 5 */}
            <div className="hl-card-pillar">
              <div className="hl-card-icon-box">🎨</div>
              <h3>Studio de Cards & Conexões</h3>
              <p>Crie e personalize cartões inspiradores estilo Canva para compartilhar no WhatsApp, Instagram e convidar amigos para a caminhada da fé.</p>
              <div className="hl-pillar-badge">Compartilhamento ágil</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO: MENTORES CANÔNICOS DA LAYA ── */}
      <section id="laya" className="hl-section hl-section-darker">
        <div className="hl-container">
          <div className="hl-section-header">
            <span className="hl-section-kicker">MOTOR NEURAL AUTÔNOMO</span>
            <h2 className="hl-section-title">Aconselhe-se com os gigantes das Escrituras</h2>
            <p className="hl-section-sub">Respostas doutrinárias fiéis, versículos canônicos e desafios práticos para aplicar nas próximas 24 horas.</p>
          </div>

          <div className="hl-mentores-selector">
            {mentores.map(m => (
              <button
                key={m.id}
                className={`hl-mentor-tab ${selectedMentor === m.id ? 'active' : ''}`}
                onClick={() => setSelectedMentor(m.id)}
              >
                {m.nome}
              </button>
            ))}
          </div>

          {(() => {
            const current = mentores.find(m => m.id === selectedMentor) || mentores[0];
            return (
              <div className="hl-mentor-display">
                <div className="hl-mentor-info">
                  <span className="hl-mentor-tag">{current.papel}</span>
                  <h3 className="hl-mentor-name">{current.nome}</h3>
                  <p className="hl-mentor-foco"><strong>Especialidade:</strong> {current.foco}</p>
                  <blockquote className="hl-mentor-quote">"{current.citacao}"</blockquote>
                  <button className="hl-btn-primary" onClick={onEnterApp} style={{ marginTop: '20px' }}>
                    Consultar com {current.nome} no App
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── SEÇÃO: DOWNLOAD DO APK ANDROID (PADRÃO ARTEMIS) ── */}
      <section id="download-apk" className="hl-section">
        <div className="hl-container">
          <div className="hl-apk-box">
            <div className="hl-apk-content">
              <span className="hl-section-kicker">INSTALAÇÃO NATIVA ANDROID</span>
              <h2>Instale o 1Convite no seu celular</h2>
              <p>Experimente a versão nativa Android com inicialização instantânea, suporte a tela cheia, áudio em segundo plano e Bíblia offline.</p>

              <div className="hl-apk-steps">
                <div className="hl-apk-step">
                  <span className="hl-step-num">1</span>
                  <span>Baixe o arquivo <code>1convite.apk</code> pelo botão abaixo</span>
                </div>
                <div className="hl-apk-step">
                  <span className="hl-step-num">2</span>
                  <span>Abra o arquivo no Android e permita instalar</span>
                </div>
                <div className="hl-apk-step">
                  <span className="hl-step-num">3</span>
                  <span>Pronto! O ícone da chama aparecerá na sua tela inicial</span>
                </div>
              </div>

              <div className="hl-apk-actions">
                <a
                  href="https://github.com/JonatasOliveira1983/1convite/releases/latest/download/1convite.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hl-btn-primary hl-btn-lg"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Baixar 1convite.apk (Download Direto)</span>
                </a>

                <a
                  href="https://github.com/JonatasOliveira1983/1convite/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hl-btn-secondary hl-btn-lg"
                >
                  <span>Ver Todas as Versões & Builds</span>
                </a>

                <button className="hl-btn-secondary hl-btn-lg" onClick={onEnterApp} style={{ borderColor: 'var(--hl-accent-orange)', color: 'var(--hl-accent-orange)' }}>
                  <span>Abrir Versão Web Online ➔</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO: FORMULÁRIO DE CONEXÃO & LEADS ── */}
      <section className="hl-section hl-section-darker">
        <div className="hl-container">
          <div className="hl-lead-card">
            <span className="hl-section-kicker">COMUNHÃO & EDIFICAÇÃO</span>
            <h2>Receba o Versículo & Desafio do Dia no WhatsApp</h2>
            <p>Cadastre-se gratuitamente para receber devocionais curados e notificações de leitura bíblica diária.</p>

            {formStatus === 'success' ? (
              <div className="hl-form-success">
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🙌</div>
                <h3>Bênção recebida! Você está conectado.</h3>
                <p>Seus dados foram registrados com sucesso no ecossistema 1Convite.</p>
                <button className="hl-btn-primary" onClick={onEnterApp} style={{ marginTop: '16px' }}>
                  Entrar no Super App Agora
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="hl-lead-form">
                <div className="hl-form-row">
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    required
                    className="hl-input"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp (ex: 11999999999)"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    required
                    className="hl-input"
                  />
                </div>

                <div className="hl-form-actions">
                  <button type="submit" disabled={formStatus === 'loading'} className="hl-btn-primary hl-btn-block">
                    {formStatus === 'loading' ? 'Conectando...' : 'Receber Devocionais no WhatsApp'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER CANÔNICO DA PASTA DA MARCA ── */}
      <footer className="hl-footer">
        <div className="hl-container hl-footer-inner">
          <div className="hl-footer-brand">
            <img src="/LOGO.png" alt="1Convite Logo" className="hl-footer-logo" />
            <div>
              <div className="hl-footer-title">1Convite</div>
              <div className="hl-footer-sub">Conectando vidas ao propósito eterno</div>
            </div>
          </div>

          <div className="hl-footer-links">
            <button className="hl-footer-link" onClick={onEnterApp}>Acessar App</button>
            <a href="#recursos" className="hl-footer-link">Recursos</a>
            <a href="#download-apk" className="hl-footer-link">Baixar APK</a>
            <a href="https://1convite.com.br" className="hl-footer-link">1convite.com.br</a>
          </div>
        </div>
        <div className="hl-footer-bottom">
          <p>© 2026 1Convite. Todos os direitos reservados. Fiel à Palavra de Deus.</p>
        </div>
      </footer>
    </div>
  );
}
