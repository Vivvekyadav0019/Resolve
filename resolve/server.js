// Local dev server: serves the static files and /api/chat (same handler Vercel uses).
// Usage: copy .env.example to .env, put your GROQ_API_KEY in it, then: node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// tiny .env loader (no dependencies)
try {
  fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/).forEach(line => {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !line.trim().startsWith('#') && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
} catch (e) {}

const chat = require('./api/chat.js');
const PORT = process.env.PORT || 3000;
const TYPES = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.png':'image/png' };
const STATIC = new Set(['index.html', 'app.js', 'style.css', 'config.js']);

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/api/chat') return chat(req, res);
  const name = url === '/' ? 'index.html' : url.slice(1);
  if (!STATIC.has(name)) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(path.join(__dirname, name), (err, data) => {
    if (err) { res.writeHead(500); return res.end('Error: ' + err.message); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(name)] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('===============================================');
  console.log(`Resolve AI Front Desk running at: ${url}`);
  console.log(process.env.GROQ_API_KEY ? 'Groq key: loaded' : 'Groq key: MISSING (chat will use offline fallback)');
  console.log('Press Ctrl+C to stop.');
  console.log('===============================================');
  const cmd = process.platform === 'win32' ? `start ${url}` : process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
  exec(cmd);
});
