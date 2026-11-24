import React, { useState } from 'react';
import appLogoWhite from '../../assets/logomarca_dark.png';

export default function LegalModalPage({ initialTab = 'privacidade', onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'termos' | 'privacidade' | 'lgpd'
  const [lgpdFeedback, setLgpdFeedback] = useState('');

  const handleExportLocalData = () => {
    try {
      const payload = {
        exportadoEm: new Date().toISOString(),
        nome: localStorage.getItem('1convite_user_name') || null,
        contato: localStorage.getItem('1convite_user_email') || null,
        plano: localStorage.getItem('1convite_premium_plan') || 'Gratuito / Visitante',
        ultimaJornadaConcluida: localStorage.getItem('1convite_last_completed_date') || null,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'meus-dados-1convite-lgpd.json';
      a.click();
      URL.revokeObjectURL(url);
      setLgpdFeedback('Seus dados locais foram exportados com sucesso.');
    } catch {
      setLgpdFeedback('Não foi possível exportar os dados deste navegador.');
    }
  };

  const handleDeleteLocalData = () => {
    if (!window.confirm('Deseja realmente apagar todos os seus dados salvos localmente neste dispositivo (LGPD - Direito de Eliminação)?')) {
      return;
    }
    try {
      localStorage.clear();
      setLgpdFeedback('Dados locais removidos com sucesso. Para exclusão definitiva no servidor, envie solicitação para jonatasprojetos2013@gmail.com.');
    } catch {
      setLgpdFeedback('Erro ao limpar dados locais.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: 'rgba(6, 9, 17, 0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#12131a',
          border: '1px solid rgba(249, 115, 22, 0.35)',
          borderRadius: '20px',
          padding: '28px 24px',
          color: '#F8FAFC',
          boxShadow: '0 24px 70px rgba(0,0,0,0.75)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
          <img src={appLogoWhite} alt="1Convite" style={{ height: '32px', width: 'auto' }} />
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#FFFFFF',
              borderRadius: '10px',
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Fechar ✕
          </button>
        </div>

        {/* Abas */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>
          {[
            { id: 'termos', label: 'Termos de Uso' },
            { id: 'privacidade', label: 'Política de Privacidade & Cookies' },
            { id: 'lgpd', label: 'LGPD (Lei 13.709/2018)' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: activeTab === tab.id ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.14)',
                background: activeTab === tab.id ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255,255,255,0.04)',
                color: activeTab === tab.id ? '#FDBA74' : '#CBD5E1',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'termos' && (
          <div style={{ fontSize: '0.9rem', lineHeight: '1.65', color: '#CBD5E1' }}>
            <h2 style={{ color: '#FFFFFF', marginTop: 0 }}>Termos de Uso — Plataforma 1Convite</h2>
            <p><strong>Última atualização:</strong> Novembro de 2026 • <strong>Domínio oficial:</strong> 1convite.com.br</p>
            <h3 style={{ color: '#FDBA74', fontSize: '1rem' }}>1. Aceitação dos Termos</h3>
            <p>Ao acessar ou utilizar o aplicativo e portal <strong>1Convite</strong>, você concorda integralmente com estes Termos de Uso e com nossa Política de Privacidade.</p>
            <h3 style={{ color: '#FDBA74', fontSize: '1rem' }}>2. Planos Anuais e Vales-Presente (Convites VIP)</h3>
            <p>Os planos pagos (Básico R$ 67/ano, Mais Popular R$ 97/ano e Avançado R$ 147/ano) têm vigência anual e concedem códigos de convite (1, 5 ou 10 convites conforme o plano) para que o titular presenteie terceiros com 180 dias (6 meses) de acesso gratuito ao aplicativo. Os códigos são de uso pessoal para compartilhamento legítimo, sendo vedada a revenda não autorizada.</p>
            <h3 style={{ color: '#FDBA74', fontSize: '1rem' }}>3. Saúde e Bem-Estar (Treino Templo)</h3>
            <p>As orientações de exercícios físicos do módulo <strong>Treino Templo</strong> têm caráter educativo e de bem-estar. Consulte um profissional de saúde antes de iniciar atividades físicas intensas.</p>
            <h3 style={{ color: '#FDBA74', fontSize: '1rem' }}>4. Propriedade Intelectual</h3>
            <p>A marca 1Convite, layout, textos devocionais, áudios narrados e materiais exclusivos são protegidos pela legislação brasileira de direitos autorais.</p>
          </div>
        )}

        {activeTab === 'privacidade' && (
          <div style={{ fontSize: '0.9rem', lineHeight: '1.65', color: '#CBD5E1' }}>
            <h2 style={{ color: '#FFFFFF', marginTop: 0 }}>Política de Privacidade & Cookies — 1Convite</h2>
            <p><strong>Controlador:</strong> 1Convite • <strong>Contato:</strong> jonatasprojetos2013@gmail.com</p>
            <h3 style={{ color: '#FDBA74', fontSize: '1rem' }}>1. Dados Coletados</h3>
            <p>Coletamos apenas os dados estritamente necessários para o funcionamento da sua conta: nome, contato (e-mail ou WhatsApp), código de convite utilizado, foto de perfil opcional e histórico de progresso na jornada diária.</p>
            <h3 style={{ color: '#FDBA74', fontSize: '1rem' }}>2. Finalidade do Uso</h3>
            <p>Seus dados são utilizados exclusivamente para autenticar seu acesso, sincronizar seus devocionais e progresso, validar convites VIP e enviar notificações ou conteúdos solicitados por você.</p>
            <h3 style={{ color: '#FDBA74', fontSize: '1rem' }}>3. Armazenamento Local e Cookies</h3>
            <p>Utilizamos armazenamento local do navegador (<code>localStorage</code>) para lembrar suas preferências (modo escuro, tamanho da fonte, sessão e conclusão diária dos 3 passos). Não utilizamos rastreadores de terceiros para venda de dados.</p>
            <h3 style={{ color: '#FDBA74', fontSize: '1rem' }}>4. Segurança</h3>
            <p>Toda comunicação entre seu dispositivo e nossos servidores é protegida por criptografia SSL/TLS (HTTPS).</p>
          </div>
        )}

        {activeTab === 'lgpd' && (
          <div style={{ fontSize: '0.9rem', lineHeight: '1.65', color: '#CBD5E1' }}>
            <h2 style={{ color: '#FFFFFF', marginTop: 0 }}>Conformidade LGPD (Lei nº 13.709/2018)</h2>
            <p>Em cumprimento à Lei Geral de Proteção de Dados (LGPD), garantimos a você, titular dos dados, os direitos previstos no Art. 18 da Lei nº 13.709/2018:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Confirmação da existência de tratamento e acesso aos seus dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados (disponível na aba Minha Conta);</li>
              <li>Portabilidade e exportação dos seus dados armazenados;</li>
              <li>Eliminação dos dados pessoais tratados com o seu consentimento;</li>
              <li>Revogação do consentimento a qualquer momento.</li>
            </ul>
            <p><strong>Encarregado pelo Tratamento de Dados (DPO):</strong> Jonatas Oliveira — <strong>jonatasprojetos2013@gmail.com</strong></p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                onClick={handleExportLocalData}
                style={{
                  background: 'rgba(56, 189, 248, 0.16)',
                  border: '1px solid #38BDF8',
                  color: '#38BDF8',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Exportar Meus Dados (JSON)
              </button>
              <button
                type="button"
                onClick={handleDeleteLocalData}
                style={{
                  background: 'rgba(239, 68, 68, 0.16)',
                  border: '1px solid #EF4444',
                  color: '#FCA5A5',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Excluir Meus Dados Locais (LGPD)
              </button>
            </div>

            {lgpdFeedback && (
              <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.14)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#A7F3D0', fontSize: '0.82rem' }}>
                {lgpdFeedback}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
