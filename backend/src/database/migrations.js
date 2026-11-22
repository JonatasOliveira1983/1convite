import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runSqlScript(client, sqlContent) {
  const cleanContent = sqlContent
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/--.*$/gm, '');

  const statements = cleanContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    if (statement) {
      await client.query(statement);
    }
  }
}

async function migrate() {
  const client = await pool.connect();
  try {
    const isTurso = pool.isTurso;
    const file1 = isTurso ? '001_initial_sqlite.sql' : '001_initial.sql';
    const file2 = isTurso ? '002_laya_knowledge_base_sqlite.sql' : '002_laya_knowledge_base.sql';

    console.log(`Executando migrações (${isTurso ? 'Turso LibSQL' : 'PostgreSQL'})...`);
    
    const sql1 = readFileSync(join(__dirname, '../../migrations', file1), 'utf-8');
    await runSqlScript(client, sql1);

    const sql2 = readFileSync(join(__dirname, '../../migrations', file2), 'utf-8');
    await runSqlScript(client, sql2);

    console.log('✅ Migrações executadas com sucesso no banco!');
  } catch (err) {
    console.error('❌ Erro na migração:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
