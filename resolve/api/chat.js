// Vercel serverless function: proxies chat to Groq. The API key stays server-side.
const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// very small per-instance rate limiter (best effort; use Upstash/Vercel KV for real limits)
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 60_000, max = 20;
  const arr = (hits.get(ip) || []).filter(t => now - t < win);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString() || '{}'); } catch { return {}; }
}
function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  if (!process.env.GROQ_API_KEY) return send(res, 500, { error: 'GROQ_API_KEY is not set on the server' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'x';
  if (limited(ip)) return send(res, 429, { error: 'Too many requests, slow down.' });

  const body = await readBody(req);
  const brand = String(body.brand || 'HomeCare').slice(0, 60);
  const fee = Number(body.fee) || 499;
  const cities = String(body.cities || 'Pune, Mumbai, Indore').slice(0, 120);
  const customer = String(body.customer || '').slice(0, 60);
  const toneMap = {
    friendly: 'warm, friendly and helpful',
    professional: 'professional, efficient and concise',
    technical: 'a diagnostic, technical specialist'
  };
  const tone = toneMap[body.tone] || toneMap.friendly;

  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-10)
    .map(m => ({ role: m.role, content: m.content.slice(0, 800) }));
  if (!messages.length) return send(res, 400, { error: 'No messages' });

  const kbText = (Array.isArray(body.kb) ? body.kb : []).slice(0, 25)
    .map(e => `- ${String(e.t || '').slice(0, 120)}: ${String(e.a || '').slice(0, 600)}`).join('\n');

  const system = `You are Resolve, the AI front-desk concierge for ${brand}, a home appliance repair service covering ${cities}.
Tone: ${tone}. The inspection/visit fee is Rs ${fee}, credited against the final repair bill.
${customer ? `The customer is ${customer}.` : ''}
Answer ONLY from the knowledge base below. If the answer is not there, say you are not sure and offer to book a visit or connect a supervisor. Never invent prices, policies or times.
Keep replies to at most 3 short sentences. Plain text only, no markdown.

KNOWLEDGE BASE:
${kbText || '(empty)'}`;

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: MODEL, temperature: 0.4, max_tokens: 300,
        messages: [{ role: 'system', content: system }, ...messages]
      })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return send(res, 502, { error: data.error?.message || 'Groq error' });
    return send(res, 200, { reply: data.choices?.[0]?.message?.content?.trim() || '' });
  } catch (e) {
    return send(res, 500, { error: 'Server error' });
  }
};
