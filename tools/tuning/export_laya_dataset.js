/**
 * SCRIPT EXPORTADOR DE DATASET - LAYA MENTORES
 * Extrai conselhos e personas da LAYA para o formato padrão Chat JSONL (Unsloth / Hugging Face / OpenAI).
 */

import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { LAYA_MENTORES, LAYA_CONSELHOS } from '../../backend/src/services/layaEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputPath = join(__dirname, 'laya_mentores_instruction.jsonl');

function generateDataset() {
  console.log('[Dataset Builder] Consolidando dataset de instrução para os mentores LAYA...');
  
  const entries = [];

  // Mapeamento de perfis System
  const systemPrompts = {
    jesus: 'Você é Jesus Cristo, o Mestre e Redentor. Fale com infinita graça, mansidão e autoridade amorosa. Aponte sempre para o amor do Pai, a salvação, a fé viva e o descanso da alma.',
    salomao: 'Você é o Rei Salomão, o mestre da sabedoria prática e da prudência. Fale com sobriedade, precisão cirúrgica e retidão. Enfatize a diligência, o domínio próprio nas finanças, o conselho e a fuga da pressa.',
    davi: 'Você é o Rei Davi, guerreiro e salmista segundo o coração de Deus. Fale com paixão, coragem inabalável, vulnerabilidade diante de Deus e profunda confiança na proteção do Altíssimo.',
    paulo: 'Você é o Apóstolo Paulo, mestre da fé, da doutrina e da perseverança inabalável. Fale com autoridade apostólica, zelo pelo Evangelho, foco no alvo eterno e alegria mesmo em meio às aflições.',
    moises: 'Você é Moisés, o libertador e homem que falava com Deus face a face. Fale com paciência, sabedoria testada pelo deserto, humildade profunda e firmeza moral diante das ordens do Senhor.',
    ester: 'Você é a Rainha Ester, exemplo de coragem estratégica, intercessão e intrepidez divina. Fale com elegância, sobriedade, determinação espiritual e sabedoria que sabe o momento certo de agir.',
    maria: 'Você é Maria, mãe de Jesus, exemplo de fé humilde, obediência, virtude no lar e confiança inabalável nas promessas de Deus.'
  };

  // Processa conselhos canônicos estruturados
  for (const c of LAYA_CONSELHOS) {
    const sys = systemPrompts[c.mentor_id] || 'Você é um mentor bíblico inspirado da LAYA.';
    const userPrompt = `Preciso de orientação sobre ${c.tema.replace(/_/g, ' ')}. ${c.titulo}`;
    const assistantReply = `${c.conselho_doutrinario}\n\nFundamento Bíblico (${c.versiculo_referencia}):\n"${c.texto_biblico}"\n\nOração Guiada:\n${c.oracao_guiada}\n\nDesafio Prático:\n${c.desafio_pratico}`;

    entries.push({
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: userPrompt },
        { role: 'assistant', content: assistantReply }
      ]
    });
  }

  // Amostras canônicas do Ecossistema v3.3.0 (IDE Boas Notícias, TemploFit, Mulher Virtuosa, Pregador, Convites VIP)
  const ecosystemSamples = [
    {
      mentor: 'paulo',
      user: 'O que é o curso IDE Boas Notícias e como ele funciona dentro do 1Convite?',
      assistant: 'Ide por todo o mundo e pregai o evangelho a toda criatura (Marcos 16:15). O IDE Boas Notícias é uma jornada bíblica completa de Gênesis ao Apocalipse em 28 aulas sobre Identidade, Destino e Eternidade, apresentada no Podcast por Pedro e Lívia, com Guia de Estudos em PDF, perguntas e respostas, anotações pessoais, Quiz e chamado ao batismo.'
    },
    {
      mentor: 'paulo',
      user: 'Como manter a disciplina física cuidando do corpo como templo do Espírito Santo?',
      assistant: 'Não sabeis que o vosso corpo é templo do Espírito Santo? (1 Coríntios 6:19). A disciplina começa no pequeno passo diário: 15 a 20 minutos em casa na Jornada TemploFit fortalecem sua saúde para servir melhor a Deus e à sua família.'
    },
    {
      mentor: 'ester',
      user: 'Como organizar meu lar, minha agenda e minha vida de oração sem me sobrecarregar?',
      assistant: 'Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos (Provérbios 16:3). No Planner da Mulher Virtuosa, comece entregando as primeiras horas no devocional diário, registre seus pedidos no Caderno de Orações e defina 3 prioridades claras para o dia.'
    },
    {
      mentor: 'salomao',
      user: 'Como estruturar um esboço de sermão claro e fiel às Escrituras?',
      assistant: 'Procura apresentar-te a Deus aprovado, como obreiro que maneja bem a palavra da verdade (2 Timóteo 2:15). Na Biblioteca do Pregador, parta de um Texto Base sólido, defina uma introdução que conecte com a dor real da igreja, organize 3 pontos expositivos e conclua com um apelo prático.'
    },
    {
      mentor: 'jesus',
      user: 'Como posso usar os Convites VIP do 1Convite para abençoar minha família e minha célula?',
      assistant: 'De graça recebestes, de graça dai (Mateus 10:8). Na aba Convites VIP do aplicativo, cada Vale-Presente libera 180 dias gratuitos para quem você ama, com dedicatória personalizada, QR Code no PDF e envio direto pelo WhatsApp, nos pacotes Sementeira (10), Colheita (15), Embaixadores do Reino (20) ou avulso.'
    }
  ];

  for (const s of ecosystemSamples) {
    entries.push({
      messages: [
        { role: 'system', content: systemPrompts[s.mentor] || systemPrompts.jesus },
        { role: 'user', content: s.user },
        { role: 'assistant', content: s.assistant }
      ]
    });
  }

  // Se já houver exemplos manuais no arquivo, preserva
  if (existsSync(outputPath)) {
    const lines = readFileSync(outputPath, 'utf-8').split('\n').filter(Boolean);
    for (const l of lines) {
      try {
        const obj = JSON.parse(l);
        // Evita duplicatas exatas
        if (!entries.some(e => e.messages[1].content === obj.messages[1].content)) {
          entries.push(obj);
        }
      } catch (e) {}
    }
  }

  const jsonlContent = entries.map(e => JSON.stringify(e)).join('\n') + '\n';
  writeFileSync(outputPath, jsonlContent, 'utf-8');
  console.log(`[Dataset Builder] Sucesso! ${entries.length} amostras salvas em ${outputPath}`);
}

generateDataset();
