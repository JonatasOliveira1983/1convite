#!/usr/bin/env node
/**
 * MCP STDIO BRIDGE - 1Convite
 * Conecta clientes como Claude Desktop, Antigravity e OpenCode ao 1Convite via protocolo MCP JSON-RPC sobre STDIO.
 */

import readline from 'readline';

const API_BASE_URL = process.env.ONE_CONVITE_API_URL || 'https://oneconvite.onrender.com/api/v1/mcp';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function sendResponse(id, result, error = null) {
  const payload = {
    jsonrpc: '2.0',
    id
  };
  if (error) {
    payload.error = error;
  } else {
    payload.result = result;
  }
  process.stdout.write(JSON.stringify(payload) + '\n');
}

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const msg = JSON.parse(trimmed);
    const { id, method, params } = msg;

    switch (method) {
      case 'initialize': {
        sendResponse(id, {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: '1convite-mcp-server',
            version: '1.0.0'
          }
        });
        break;
      }

      case 'notifications/initialized': {
        // Notificação sem resposta
        break;
      }

      case 'tools/list': {
        try {
          const res = await fetch(`${API_BASE_URL}/tools`);
          const data = await res.json();
          sendResponse(id, { tools: data.tools || [] });
        } catch (e) {
          sendResponse(id, null, { code: -32603, message: `Erro ao listar tools: ${e.message}` });
        }
        break;
      }

      case 'tools/call': {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        try {
          const res = await fetch(`${API_BASE_URL}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool: toolName, arguments: toolArgs })
          });
          const data = await res.json();

          sendResponse(id, {
            content: [
              {
                type: 'text',
                text: JSON.stringify(data.result || data, null, 2)
              }
            ],
            isError: data.status === 'error'
          });
        } catch (e) {
          sendResponse(id, null, { code: -32603, message: `Falha na execução: ${e.message}` });
        }
        break;
      }

      default: {
        if (id !== undefined) {
          sendResponse(id, null, { code: -32601, message: `Método não implementado: ${method}` });
        }
        break;
      }
    }
  } catch (err) {
    // Linha inválida JSON
  }
});
