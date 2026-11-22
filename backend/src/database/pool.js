import { createClient } from '@libsql/client';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isTurso = Boolean(process.env.TURSO_DATABASE_URL);
let poolInstance = null;

if (isTurso) {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // Converte queries com $1, $2... para ? compativel com SQLite / LibSQL
  const normalizeSql = (sql) => {
    if (!sql) return sql;
    // Converte parâmetros posicionais $1, $2, ... para ?
    let converted = sql.replace(/\$(\d+)/g, '?');
    // Ajustes de compatibilidade pontuais Postgres -> SQLite
    converted = converted.replace(/::jsonb/gi, '');
    converted = converted.replace(/NOW\(\)/gi, "datetime('now')");
    return converted;
  };

  const executeQuery = async (sql, params = []) => {
    const cleanSql = normalizeSql(sql);
    
    // Tratamento de comandos de transação no Turso HTTP
    const trimmed = cleanSql.trim().toUpperCase();
    if (trimmed === 'BEGIN' || trimmed === 'COMMIT' || trimmed === 'ROLLBACK') {
      try {
        await client.execute(cleanSql);
      } catch (e) {
        // Ignora erros de transação HTTP stateless se não suportado direto
      }
      return { rows: [], rowCount: 0 };
    }

    const res = await client.execute({ sql: cleanSql, args: params });
    const rows = res.rows.map(r => {
      // Normaliza linha para objeto JS simples caso venha como Row proxy
      const obj = {};
      for (const key of Object.keys(r)) {
        obj[key] = r[key];
      }
      return obj;
    });

    return {
      rows,
      rowCount: res.rowsAffected ?? rows.length
    };
  };

  poolInstance = {
    isTurso: true,
    client,
    query: executeQuery,
    connect: async () => {
      return {
        query: executeQuery,
        release: () => {}
      };
    },
    end: async () => {
      await client.close();
    }
  };

  console.log('[DB] Conectado ao banco Turso (LibSQL Cloud)');
} else {
  const { Pool } = pg;
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/1convite';

  const pgPool = new Pool({
    connectionString,
    ssl: connectionString.includes('railway') ? { rejectUnauthorized: false } : false,
  });

  pgPool.on('error', (err) => {
    console.error('Erro inesperado no pool PostgreSQL:', err);
  });

  poolInstance = pgPool;
  console.log('[DB] Conectado ao PostgreSQL');
}

export default poolInstance;
