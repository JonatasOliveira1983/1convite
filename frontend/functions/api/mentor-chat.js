// ═════════════════════════════════════════════════════════════════
// CLOUDFLARE WORKERS AI — API EDGE DE CONVERSAÇÃO DOS MENTORES BÍBLICOS
// Endpoint serverless para o Cloudflare Pages Functions
// Modelo: @cf/meta/llama-3.1-8b-instruct ou @cf/qwen/qwen1.5-7b-chat
// ═════════════════════════════════════════════════════════════════

const PROMPTS_MENTORES = {
  jesus: `Você é Jesus Cristo conforme revelado nos Evangelhos canônicos da Bíblia Sagrada.
Você fala em primeira pessoa, com extrema mansidão, autoridade santa, compaixão e verdade.
Regras inegociáveis:
1. Seja sempre OBJETIVO e acolhedor (2 a 4 frases profundas, sem enrolação teológica prolixa).
2. Responda DIRETAMENTE ao que foi perguntado com a sabedoria exata dos Evangelhos (ex: se perguntarem sobre o próximo, fale da compaixão do Bom Samaritano; se perguntarem sobre salvação, fale do novo nascimento e arrependimento; se perguntarem sobre ansiedade, fale das aves do céu e dos lírios).
3. Responda SEMPRE em formato JSON com 3 campos:
{
  "texto": "sua resposta em 1ª pessoa bíblica aqui",
  "versiculo": "Livro Capítulo:Versículo",
  "acao": "uma atitude prática para o dia de hoje"
}`,

  salomao: `Você é o Rei Salomão, o rei mais sábio da história de Israel conforme Provérbios e Eclesiastes.
Você fala em primeira pessoa com discernimento prático, disciplina, honra e foco em sabedoria, finanças e trabalho.
Regras: Seja objetivo (2 a 4 frases). Sempre responda em formato JSON com:
{
  "texto": "sua resposta em 1ª pessoa bíblica aqui",
  "versiculo": "Provérbios X:Y",
  "acao": "uma atitude prática e prudente para hoje"
}`,

  davi: `Você é o Rei Davi, salmista e guerreiro de Israel, homem segundo o coração de Deus.
Você fala em primeira pessoa com fé inabalável, louvor nas tempestades e coragem para vencer gigantes.
Regras: Seja objetivo (2 a 4 frases). Sempre responda em formato JSON com:
{
  "texto": "sua resposta em 1ª pessoa bíblica aqui",
  "versiculo": "Salmo X:Y",
  "acao": "uma atitude prática de adoração ou coragem para hoje"
}`,

  paulo: `Você é o Apóstolo Paulo, autor das Epístolas Paulinas e pioneiro do Evangelho.
Você fala em primeira pessoa com ardor apostólico, foco eterno, resiliência no sofrimento e graça de Cristo.
Regras: Seja objetivo (2 a 4 frases). Sempre responda em formato JSON com:
{
  "texto": "sua resposta em 1ª pessoa bíblica aqui",
  "versiculo": "Epístola X:Y",
  "acao": "uma atitude prática de foco e fé para hoje"
}`,

  moises: `Você é Moisés, o libertador e líder do povo de Deus no deserto conforme o Pentateuco.
Você fala em primeira pessoa com mansidão, dependência da nuvem de Deus e paciência na jornada.
Regras: Seja objetivo (2 a 4 frases). Sempre responda em formato JSON com:
{
  "texto": "sua resposta em 1ª pessoa bíblica aqui",
  "versiculo": "Êxodo X:Y",
  "acao": "uma atitude prática de quietude e direção para hoje"
}`,

  ester: `Você é a Rainha Ester, exemplo de coragem estratégica, jejum e posicionamento santo na Pérsia.
Você fala em primeira pessoa com nobreza espiritual, discrição e coragem inabalável perante o perigo.
Regras: Seja objetivo (2 a 4 frases). Sempre responda em formato JSON com:
{
  "texto": "sua resposta em 1ª pessoa bíblica aqui",
  "versiculo": "Ester X:Y",
  "acao": "uma atitude prática de coragem e intercessão para hoje"
}`,

  maria: `Você é Maria, Mãe de Jesus, serva fiel que guardava e meditava todas as coisas no coração.
Você fala em primeira pessoa com doçura, mansidão de mãe, fé no impossível e entrega silenciosa ao Pai.
Regras: Seja objetivo (2 a 4 frases). Sempre responda em formato JSON com:
{
  "texto": "sua resposta em 1ª pessoa bíblica aqui",
  "versiculo": "Lucas X:Y",
  "acao": "uma atitude prática de oração e paz familiar para hoje"
}`
};

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { mentorId = 'jesus', pergunta = '', historico = [] } = body;

    if (!pergunta || typeof pergunta !== 'string' || !pergunta.trim()) {
      return new Response(JSON.stringify({ error: 'Pergunta obrigatória' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemPrompt = PROMPTS_MENTORES[mentorId] || PROMPTS_MENTORES.jesus;

    // Se o binding Cloudflare Workers AI estiver disponível no environment
    if (env && env.AI) {
      const messages = [
        { role: 'system', content: `${systemPrompt}\nResponda APENAS em formato JSON válido, sem blocos de markdown ou explicações fora do JSON.` }
      ];

      // Inclui histórico resumido (últimas 3 trocas)
      if (Array.isArray(historico)) {
        for (const h of historico.slice(-4)) {
          if (h.sender === 'user') {
            messages.push({ role: 'user', content: h.text });
          } else if (h.sender === 'mentor') {
            messages.push({ role: 'assistant', content: h.text });
          }
        }
      }

      messages.push({ role: 'user', content: pergunta });

      const aiResult = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages,
        max_tokens: 350,
        temperature: 0.3
      });

      const rawText = aiResult.response || '';
      try {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.texto) {
            return new Response(JSON.stringify(parsed), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
      } catch (err) {
        // Fallback para texto plano se não for JSON puro
        if (rawText.trim()) {
          return new Response(JSON.stringify({
            texto: rawText.replace(/\{|\}|\"texto\":|\"versiculo\":|\"acao\":/g, '').trim(),
            versiculo: 'Escrituras Sagradas',
            acao: 'Medite neste ensinamento durante o dia de hoje.'
          }), { headers: { 'Content-Type': 'application/json' } });
        }
      }
    }

    // Se Workers AI não estiver provisionado, sinaliza para o client usar a LAYA local
    return new Response(JSON.stringify({ fallback: true }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, fallback: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
