#!/usr/bin/env node
/**
 * OPENVIKING CLI - 1Convite Virtual Context Filesystem
 * Implementação da interface agêntica viking:// (ByteDance Volcengine).
 */

import { readdirSync, readFileSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const command = process.argv[2] || 'tree';
const targetUri = process.argv[3] || 'viking://1convite';

function resolvePath(uri) {
  const clean = uri.replace('viking://1convite', '').replace(/^\/+/, '');
  return join(__dirname, clean);
}

function printTree(dir, prefix = '', uriPrefix = 'viking://1convite') {
  const items = readdirSync(dir);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.startsWith('.')) continue;
    const full = join(dir, item);
    const isDir = statSync(full).isDirectory();
    const isLast = i === items.length - 1;
    const branch = isLast ? '└── ' : '├── ';

    console.log(`${prefix}${branch}${item} ${isDir ? `(${uriPrefix}/${item})` : ''}`);

    if (isDir) {
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      printTree(full, nextPrefix, `${uriPrefix}/${item}`);
    }
  }
}

switch (command) {
  case 'tree':
    console.log(`viking://1convite/`);
    printTree(__dirname);
    break;

  case 'ls': {
    const resolved = resolvePath(targetUri);
    try {
      const files = readdirSync(resolved);
      console.log(`Conteúdo de ${targetUri}:`);
      files.forEach(f => console.log(`  • ${f}`));
    } catch (e) {
      console.error(`Erro ao listar ${targetUri}: ${e.message}`);
    }
    break;
  }

  case 'cat':
  case 'read': {
    let resolved = resolvePath(targetUri);
    if (!resolved.endsWith('.md') && !resolved.endsWith('.json')) {
      // Tenta achar arquivo L1 correspondente
      if (statSync(resolved).isDirectory()) {
        const files = readdirSync(resolved);
        const l1 = files.find(f => f.startsWith('L1_'));
        if (l1) resolved = join(resolved, l1);
      }
    }
    try {
      const content = readFileSync(resolved, 'utf-8');
      console.log(content);
    } catch (e) {
      console.error(`Erro ao ler ${targetUri}: ${e.message}`);
    }
    break;
  }

  case 'grep': {
    const pattern = process.argv[3] || '';
    if (!pattern) {
      console.error('Uso: node viking_cli.js grep <termo>');
      process.exit(1);
    }
    console.log(`Buscando "${pattern}" em viking://1convite/...`);
    function searchRecursive(dir) {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          searchRecursive(full);
        } else if (entry.endsWith('.md') || entry.endsWith('.json')) {
          const txt = readFileSync(full, 'utf-8');
          const lines = txt.split('\n');
          lines.forEach((l, idx) => {
            if (l.toLowerCase().includes(pattern.toLowerCase())) {
              const rel = relative(__dirname, full).replace(/\\/g, '/');
              console.log(`  viking://1convite/${rel}:${idx + 1} ➔ ${l.trim()}`);
            }
          });
        }
      }
    }
    searchRecursive(__dirname);
    break;
  }

  default:
    console.log(`
Uso do OpenViking CLI:
  node viking_cli.js tree                 # Exibe a árvore do context database
  node viking_cli.js ls <viking://uri>    # Lista itens de um diretório
  node viking_cli.js cat <viking://uri>   # Lê o resumo L1 ou arquivo da URI
  node viking_cli.js grep <termo>         # Busca termos no sistema de arquivos virtual
`);
}
