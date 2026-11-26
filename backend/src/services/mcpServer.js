/**
 * MCP SERVER - Model Context Protocol (v2024-11-05)
 * Implementação canônica do protocolo de contexto da Anthropic para agentes autônomos.
 */

import { ragService } from './ragService.js';
import { LAYA_MENTORES, LayaEngine } from './layaEngine.js';
import { PLANOS_1CONVITE, isAsaasConfigured } from './asaasService.js';
import { isResendConfigured } from './resendService.js';
import pool from '../database/pool.js';

export const MCP_TOOLS_CATALOG = [
  {
    name: 'search_bible_verses',
    description: 'Executa busca textual e semântica (BM25 Okapi) nos 31.106 versículos da Bíblia Sagrada ACF, com suporte a filtros por testamento ou livro.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Termo de busca, conceito, pergunta ou tema espiritual (ex: "ansiedade no coracao", "justificacao pela fe")'
        },
        top_k: {
          type: 'integer',
          description: 'Número de versículos a retornar (padrão 5, máximo 20)',
          default: 5
        },
        testamento: {
          type: 'string',
          enum: ['VT', 'NT'],
          description: 'Filtro opcional por Antigo Testamento (VT) ou Novo Testamento (NT)'
        },
        livro: {
          type: 'string',
          description: 'Abreviação do livro bíblico (ex: "sl" para Salmos, "pv" para Provérbios, "rm" para Romanos)'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'get_daily_matrix',
    description: 'Consulta o desafio prático, reflexão devocional, oração e versículo do dia da Matriz Anual do Reino (dias 1 a 365).',
    inputSchema: {
      type: 'object',
      properties: {
        dia: {
          type: 'integer',
          description: 'Número do dia na trilha de 365 dias (1 a 365)',
          minimum: 1,
          maximum: 365
        }
      },
      required: ['dia']
    }
  },
  {
    name: 'consult_biblical_mentor',
    description: 'Consulta o aconselhamento pastoral e a sabedoria de um dos 7 mentores da LAYA (Jesus, Salomão, Davi, Paulo, Moisés, Ester, Maria), fundamentado por RAG bíblico.',
    inputSchema: {
      type: 'object',
      properties: {
        mentor_id: {
          type: 'string',
          enum: ['jesus', 'salomao', 'davi', 'paulo', 'moises', 'ester', 'maria'],
          description: 'Identificador do mentor bíblico'
        },
        situacao: {
          type: 'string',
          description: 'A dúvida, aflição, tomada de decisão ou contexto do usuário'
        }
      },
      required: ['mentor_id', 'situacao']
    }
  },
  {
    name: 'search_theological_dictionary',
    description: 'Consulta o dicionário teológico do 1Convite para obter definições de termos bíblicos, conceitos doutrinários e raízes em hebraico/grego.',
    inputSchema: {
      type: 'object',
      properties: {
        termo: {
          type: 'string',
          description: 'Palavra ou conceito teológico (ex: "graca", "redencao", "justificacao", "agape")'
        }
      },
      required: ['termo']
    }
  },
  {
    name: 'get_system_vitals',
    description: 'Retorna a telemetria completa de saúde dos serviços 1Convite: banco Turso Cloud, status do RAG em memória, Asaas/Resend e estatísticas de uso.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'search_blog_articles',
    description: 'Busca artigos publicados no Blog Oficial 1Convite (/blog) sobre o Reino de Deus e vida cristã.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Termo de busca opcional no título ou resumo' },
        limit: { type: 'integer', default: 5 }
      }
    }
  },
  {
    name: 'get_payment_plans',
    description: 'Retorna os planos anuais oficiais do 1Convite (1, 3 e 5 convites VIP de 180 dias) e o status de configuração Asaas/Resend.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'search_preacher_library',
    description: 'Pesquisa esboços de sermões salvos na Biblioteca do Pregador (Turso) por tema ou texto bíblico.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Tema ou palavra-chave do sermão' },
        limit: { type: 'integer', default: 5 }
      }
    }
  },
  {
    name: 'get_templofit_overview',
    description: 'Retorna estatísticas globais e resumo da Jornada TemploFit (6 Meses em Casa e programas OpenGym).',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

class McpServer {
  constructor() {
    this.tools = MCP_TOOLS_CATALOG;
    this.layaEngine = new LayaEngine();
  }

  listTools() {
    return {
      tools: this.tools
    };
  }

  async executeTool(name, args = {}, context = {}) {
    const startTime = Date.now();
    try {
      let result;

      switch (name) {
        case 'search_bible_verses': {
          const { query, top_k = 5, testamento, livro } = args;
          const k = Math.min(Math.max(1, parseInt(top_k) || 5), 20);

          // Tenta primeiro via RAG em memória
          let verses = ragService.searchBible(query, { topK: k, testamento, livro });

          // Se o RAG ainda não estiver indexado ou não trouxer nada, faz fallback para Turso SQL
          if (verses.length === 0) {
            try {
              let sql = `SELECT livro_nome as livro, livro_abrev as abrev, capitulo, versiculo, texto, testamento 
                         FROM tb_biblia 
                         WHERE texto LIKE ? 
                         LIMIT ?`;
              const dbRes = await pool.query(sql, [`%${query}%`, k]);
              verses = (dbRes.rows || []).map(r => ({
                referencia: `${r.livro} ${r.capitulo}:${r.versiculo}`,
                ...r,
                score: 1.0
              }));
            } catch (sqlErr) {
              console.warn('[MCP] Fallback SQL falhou:', sqlErr.message);
            }
          }

          result = {
            total_encontrados: verses.length,
            query,
            versiculos: verses
          };
          break;
        }

        case 'get_daily_matrix': {
          const dia = Math.min(Math.max(1, parseInt(args.dia) || 1), 365);
          let item = null;
          try {
            const dbRes = await pool.query('SELECT * FROM tb_matriz_diaria WHERE dia = ? LIMIT 1', [dia]);
            if (dbRes.rows && dbRes.rows.length > 0) {
              item = dbRes.rows[0];
            }
          } catch (e) {
            console.warn('[MCP] Erro ao consultar matriz diária:', e.message);
          }

          result = {
            dia,
            registro: item || {
              dia,
              desafio: 'Pratique um ato de amor e gratidão ao próximo hoje.',
              versiculo_chave: '1 Tessalonicenses 5:18',
              reflexao: 'Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus.',
              oracao: 'Senhor, ensina-me a ser grato em todo momento e a refletir Tua luz.'
            }
          };
          break;
        }

        case 'consult_biblical_mentor': {
          const { mentor_id, situacao } = args;
          const mentor = LAYA_MENTORES.find(m => m.id === (mentor_id || '').toLowerCase()) || LAYA_MENTORES[0];

          // 1. Busca contexto via RAG Bíblico
          const hybrid = ragService.getHybridContext(situacao, 3);

          // 2. Busca conselhos canônicos do mentor
          const conselhos = await this.layaEngine.getConselhosDoMentor(mentor.id);
          let conselho = conselhos[0];

          // Se houver palavras-chave, seleciona o conselho mais alinhado
          const normSit = (situacao || '').toLowerCase();
          for (const c of conselhos) {
            const temaNorm = (c.tema || '').replace(/_/g, ' ');
            const tituloNorm = (c.titulo || '').toLowerCase();
            if (normSit.includes(temaNorm) || normSit.includes(tituloNorm) || 
                (c.texto_biblico && normSit.split(' ').some(w => w.length > 4 && c.texto_biblico.toLowerCase().includes(w)))) {
              conselho = c;
              break;
            }
          }

          result = {
            mentor: {
              id: mentor.id,
              nome: mentor.nome,
              titulo: mentor.titulo,
              periodo: mentor.periodo
            },
            situacao_analisada: situacao,
            tema: conselho ? conselho.tema : 'sabedoria_geral',
            titulo: conselho ? conselho.titulo : 'Conselho Bíblico',
            conselho_pastoral: conselho ? conselho.conselho_doutrinario : 'Permaneça firme na oração e na busca da Palavra.',
            versiculo_base: conselho ? `${conselho.versiculo_referencia}: "${conselho.texto_biblico}"` : null,
            oracao_guiada: conselho ? conselho.oracao_guiada : null,
            desafio_pratico: conselho ? conselho.desafio_pratico : null,
            rag_contexto_biblico: hybrid.verses
          };
          break;
        }

        case 'search_theological_dictionary': {
          const { termo } = args;
          let items = [];
          try {
            const dbRes = await pool.query('SELECT * FROM tb_dicionario WHERE termo LIKE ? LIMIT 5', [`%${termo}%`]);
            items = dbRes.rows || [];
          } catch (e) {
            console.warn('[MCP] Erro dicionario SQL:', e.message);
          }

          if (items.length === 0) {
            items = ragService.searchTheology(termo, 3);
          }

          result = {
            termo_pesquisado: termo,
            resultados: items
          };
          break;
        }

        case 'get_system_vitals': {
          let dbStatus = 'desconectado';
          let versesDbCount = 0;
          try {
            const check = await pool.query('SELECT COUNT(*) as total FROM tb_biblia');
            versesDbCount = parseInt(check.rows?.[0]?.total || check.rows?.[0]?.['COUNT(*)'] || 0);
            dbStatus = 'online';
          } catch (e) {
            dbStatus = `erro: ${e.message}`;
          }

          result = {
            status: 'online',
            version: '3.1.0',
            service: '1Convite Core Engine & MCP Server',
            protocol_version: '2024-11-05',
            database: {
              provider: 'Turso (LibSQL Cloud São Paulo)',
              status: dbStatus,
              versiculos_banco: versesDbCount
            },
            rag: {
              status: ragService.isIndexed ? 'indexado' : 'carregando',
              versiculos_memoria: ragService.verses.length,
              termos_invertidos: ragService.invertedIndex.size
            },
            pagamentos: {
              asaas_configurado: isAsaasConfigured(),
              resend_configurado: isResendConfigured()
            },
            mentores_disponiveis: LAYA_MENTORES.map(m => ({ id: m.id, nome: m.nome, especialidades: m.especialidades })),
            uptime_seconds: Math.floor(process.uptime()),
            node_version: process.version
          };
          break;
        }

        case 'search_blog_articles': {
          const q = String(args.query || '').trim();
          const lim = Math.min(Math.max(1, parseInt(args.limit) || 5), 20);
          let rows = [];
          try {
            const sql = q
              ? `SELECT id, title, slug, excerpt, created_at FROM posts WHERE published = 1 AND (title LIKE ? OR excerpt LIKE ?) ORDER BY id DESC LIMIT ?`
              : `SELECT id, title, slug, excerpt, created_at FROM posts WHERE published = 1 ORDER BY id DESC LIMIT ?`;
            const params = q ? [`%${q}%`, `%${q}%`, lim] : [lim];
            const dbRes = await pool.query(sql, params);
            rows = (dbRes.rows || []).map((p) => ({
              ...p,
              url: `https://1convite.com.br/blog/post/${p.slug}`
            }));
          } catch (e) {
            console.warn('[MCP] Erro ao buscar artigos do blog:', e.message);
          }
          result = { total: rows.length, artigos: rows };
          break;
        }

        case 'get_payment_plans': {
          result = {
            asaas_configurado: isAsaasConfigured(),
            resend_configurado: isResendConfigured(),
            planos: Object.values(PLANOS_1CONVITE)
          };
          break;
        }

        case 'search_preacher_library': {
          const q = String(args.query || '').trim();
          const lim = Math.min(Math.max(1, parseInt(args.limit) || 5), 20);
          let rows = [];
          try {
            const sql = q
              ? `SELECT id, titulo, tema, texto_base, created_at FROM tb_pregador_esbocos WHERE titulo LIKE ? OR tema LIKE ? ORDER BY created_at DESC LIMIT ?`
              : `SELECT id, titulo, tema, texto_base, created_at FROM tb_pregador_esbocos ORDER BY created_at DESC LIMIT ?`;
            const params = q ? [`%${q}%`, `%${q}%`, lim] : [lim];
            const dbRes = await pool.query(sql, params);
            rows = dbRes.rows || [];
          } catch (e) {
            console.warn('[MCP] Erro ao buscar esboços do Pregador:', e.message);
          }
          result = { total: rows.length, esbocos_salvos: rows };
          break;
        }

        case 'get_templofit_overview': {
          let totalSessoes = 0;
          try {
            const resCount = await pool.query('SELECT COUNT(*) as total FROM tb_templofit_sessoes');
            totalSessoes = Number(resCount.rows?.[0]?.total || 0);
          } catch {}
          result = {
            jornada_casa: 'Jornada TemploFit 6 Meses (30 treinos diários sem equipamentos)',
            programas_opengym: 19,
            sessoes_registradas_turso: totalSessoes
          };
          break;
        }

        default:
          throw new Error(`Ferramenta MCP desconhecida: ${name}`);
      }

      const executionTimeMs = Date.now() - startTime;
      return {
        status: 'success',
        tool: name,
        result,
        execution_time_ms: executionTimeMs
      };
    } catch (err) {
      return {
        status: 'error',
        tool: name,
        error: err.message,
        execution_time_ms: Date.now() - startTime
      };
    }
  }
}

export const mcpServer = new McpServer();
export default mcpServer;
