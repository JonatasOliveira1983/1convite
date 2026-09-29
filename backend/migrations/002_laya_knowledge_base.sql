-- ═══════ LAYA KNOWLEDGE BASE - 1CONVITE ═══════
-- Motor de Sabedoria Bíblica & Mentoria Canônica

-- 1. Tabela de Mentores Bíblicos Canônicos
CREATE TABLE IF NOT EXISTS tb_laya_mentores (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  titulo TEXT NOT NULL,
  periodo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  avatar TEXT,
  ordem INTEGER DEFAULT 0,
  preco_desbloqueio INTEGER DEFAULT 0,
  especialidades JSONB DEFAULT '[]'::jsonb
);

-- 2. Tabela de Conselhos Estruturados por Mentor & Tema
CREATE TABLE IF NOT EXISTS tb_laya_conselhos (
  id SERIAL PRIMARY KEY,
  mentor_id TEXT REFERENCES tb_laya_mentores(id) ON DELETE CASCADE,
  tema TEXT NOT NULL,
  titulo TEXT NOT NULL,
  versiculo_referencia TEXT NOT NULL,
  texto_biblico TEXT NOT NULL,
  conselho_doutrinario TEXT NOT NULL,
  oracao_guiada TEXT NOT NULL,
  desafio_pratico TEXT NOT NULL
);

-- 3. Tabela do Oráculo Semântico da Laya (Temas de Vida)
CREATE TABLE IF NOT EXISTS tb_laya_oraculo_temas (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  categoria TEXT NOT NULL,
  titulo TEXT NOT NULL,
  palavras_chave TEXT NOT NULL,
  promessa_biblica TEXT NOT NULL,
  versiculo_chave TEXT NOT NULL,
  direcionamento_laya TEXT NOT NULL,
  oracao_resposta TEXT NOT NULL,
  acao_pratica TEXT NOT NULL
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_laya_conselhos_mentor_tema ON tb_laya_conselhos(mentor_id, tema);
CREATE INDEX IF NOT EXISTS idx_laya_oraculo_categoria ON tb_laya_oraculo_temas(categoria);
