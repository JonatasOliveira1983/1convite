-- 1Convite - Schema SQLite / Turso LibSQL

CREATE TABLE IF NOT EXISTS tb_matriz_diaria (
  dia_id INTEGER PRIMARY KEY,
  pilar_origem TEXT CHECK(pilar_origem IN ('PROPÓSITO_M2414', 'RECOMPENSA_AP321')) NOT NULL,
  codigo_verbal TEXT NOT NULL,
  versiculo_chave TEXT NOT NULL,
  texto_reflexao TEXT NOT NULL,
  texto_meditacao TEXT,
  url_audio_meditacao TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tb_usuario_progresso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dia_atual INTEGER DEFAULT 1,
  checkpoint_completado INTEGER DEFAULT 0,
  checkpoint_started_at INTEGER DEFAULT 0,
  status_plano TEXT DEFAULT 'FREE',
  nome TEXT,
  email TEXT,
  avatar TEXT
);

CREATE TABLE IF NOT EXISTS tb_contatos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  relacao TEXT NOT NULL,
  prioritario INTEGER DEFAULT 0,
  ultimo_convite_timestamp INTEGER DEFAULT 0,
  historico_acoes TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS tb_dicionario (
  termo TEXT PRIMARY KEY,
  significado TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tb_trilhas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tema TEXT NOT NULL,
  dia_trilha INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  versiculo TEXT NOT NULL,
  reflexao TEXT NOT NULL,
  acao_pratica TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tb_usuario_trilha_progresso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trilha_ativa TEXT DEFAULT NULL,
  dia_progresso INTEGER DEFAULT 1,
  atualizado_em INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tb_biblia (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  livro_nome TEXT NOT NULL,
  livro_abrev TEXT NOT NULL,
  capitulo INTEGER NOT NULL,
  versiculo INTEGER NOT NULL,
  texto TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tb_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telefone TEXT,
  nome TEXT,
  email TEXT,
  origem TEXT,
  pagina TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_biblia_abrev_cap ON tb_biblia (livro_abrev, capitulo);
CREATE INDEX IF NOT EXISTS idx_biblia_texto ON tb_biblia (texto);
CREATE INDEX IF NOT EXISTS idx_trilhas_tema_dia ON tb_trilhas (tema, dia_trilha);
CREATE INDEX IF NOT EXISTS idx_contatos_nome ON tb_contatos (nome);
