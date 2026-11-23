-- Migração 003: Tabela de usuários individuais com UUID e suporte a avatar persistente
CREATE TABLE IF NOT EXISTS tb_usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT UNIQUE NOT NULL,
  email TEXT,
  nome TEXT NOT NULL DEFAULT 'Membro Convidado',
  avatar TEXT,
  genero TEXT DEFAULT 'homem',
  status_plano TEXT DEFAULT 'FREE',
  dia_atual INTEGER DEFAULT 1,
  checkpoint_completado INTEGER DEFAULT 0,
  checkpoint_started_at INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuarios_uuid ON tb_usuarios (uuid);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON tb_usuarios (email);
