import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  const client = await pool.connect();
  try {
    const sql1 = readFileSync(join(__dirname, '../../migrations/001_initial.sql'), 'utf-8');
    await client.query(sql1);
    const sql2 = readFileSync(join(__dirname, '../../migrations/002_laya_knowledge_base.sql'), 'utf-8');
    await client.query(sql2);
    console.log('Migrações (001 e 002 LAYA) executadas com sucesso!');
  } catch (err) {
    console.error('Erro na migração:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
