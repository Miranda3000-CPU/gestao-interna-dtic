const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Helpers de arquivos JSON
// ---------------------------------------------------------------------------

function resolvePath(filepath) {
  // Se empacotado com pkg, usa o diretório do executável; senão, __dirname
  const exeDir = process.pkg ? path.dirname(process.execPath) : __dirname;

  // Arquivos de dados (JSONs mutáveis) vão para %LOCALAPPDATA%/GestaoDTIC no Windows
  // para evitar exigência de admin. Assets estáticos permanecem no diretório do exe.
  const dataFiles = ['voluntarios.json', 'militares.json', 'config.json'];
  if (dataFiles.includes(filepath)) {
    if (process.platform === 'win32') {
      const localAppData = process.env.LOCALAPPDATA || process.env.APPDATA || exeDir;
      const dataDir = path.join(localAppData, 'GestaoDTIC');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      return path.join(dataDir, filepath);
    }
  }

  return path.join(exeDir, filepath);
}

function loadJSON(filename) {
  const filepath = resolvePath(filename);
  if (!fs.existsSync(filepath)) return [];
  try {
    const raw = fs.readFileSync(filepath, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(item => typeof item === 'object' && item !== null) : [];
  } catch {
    return [];
  }
}

function saveJSON(filename, data) {
  const filepath = resolvePath(filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 4), 'utf-8');
}

function nextId(data) {
  let max = 0;
  for (const item of data) {
    if (item.id && item.id > max) max = item.id;
  }
  return max + 1;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
// API - Civis (voluntários)
// ---------------------------------------------------------------------------

app.get('/api/civis', (_req, res) => {
  res.json(loadJSON('voluntarios.json'));
});

app.post('/api/civis', (req, res) => {
  const data = loadJSON('voluntarios.json');
  const nome = (req.body.nome || '').trim().toUpperCase();
  const nome_guerra = (req.body.nome_guerra || '').trim().toUpperCase();
  if (!nome || !nome_guerra) {
    return res.status(400).json({ error: 'Nome e nome de guerra são obrigatórios.' });
  }
  const novo = {
    id: nextId(data),
    nome,
    nome_guerra,
    funcao: (req.body.funcao || '').trim(),
    turno: (req.body.turno || '').trim(),
  };
  data.push(novo);
  saveJSON('voluntarios.json', data);
  res.json(novo);
});

app.delete('/api/civis/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido.' });
  }
  let data = loadJSON('voluntarios.json');
  const before = data.length;
  data = data.filter(item => item.id !== id);
  if (data.length === before) {
    return res.status(404).json({ error: 'Registro não encontrado.' });
  }
  saveJSON('voluntarios.json', data);
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// API - Militares
// ---------------------------------------------------------------------------

app.get('/api/militares', (_req, res) => {
  res.json(loadJSON('militares.json'));
});

app.post('/api/militares', (req, res) => {
  const data = loadJSON('militares.json');
  const nome = (req.body.nome || '').trim().toUpperCase();
  const nome_guerra = (req.body.nome_guerra || '').trim().toUpperCase();
  if (!nome || !nome_guerra) {
    return res.status(400).json({ error: 'Nome e nome de guerra são obrigatórios.' });
  }
  const novo = {
    id: nextId(data),
    graduacao: (req.body.graduacao || '').trim().toUpperCase(),
    nome,
    nome_guerra,
  };
  data.push(novo);
  saveJSON('militares.json', data);
  res.json(novo);
});

app.delete('/api/militares/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido.' });
  }
  let data = loadJSON('militares.json');
  const before = data.length;
  data = data.filter(item => item.id !== id);
  if (data.length === before) {
    return res.status(404).json({ error: 'Registro não encontrado.' });
  }
  saveJSON('militares.json', data);
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// API - Configurações (comandante)
// ---------------------------------------------------------------------------

function loadConfig() {
  const DEFAULT = {
    comandante: 'LUIZ ALFREDO SILVA GALIZA DOS SANTOS – CEL QOBM',
    nome_guerra_comandante: 'LUIZ ALFREDO',
    nota_num: '001',
  };
  const filepath = resolvePath('config.json');
  try {
    if (!fs.existsSync(filepath)) return { ...DEFAULT };
    const raw = fs.readFileSync(filepath, 'utf-8');
    const data = JSON.parse(raw);
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      return { ...DEFAULT, ...data };
    }
    return { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
}

app.get('/api/config', (_req, res) => {
  res.json(loadConfig());
});

app.post('/api/config', (req, res) => {
  const atual = loadConfig();
  const comandante = (req.body.comandante || '').trim();
  const nome_guerra_comandante = (req.body.nome_guerra_comandante || '').trim();

  const nota_num = (req.body.nota_num || '').trim();

  if (comandante) atual.comandante = comandante;
  if (nome_guerra_comandante) atual.nome_guerra_comandante = nome_guerra_comandante;
  if (nota_num) atual.nota_num = nota_num;

  saveJSON('config.json', atual);
  res.json(atual);
});

// ---------------------------------------------------------------------------
// API - Backup / Restore (exportar e importar dados)
// ---------------------------------------------------------------------------

app.get('/api/backup/export', (_req, res) => {
  const backup = {
    voluntarios: loadJSON('voluntarios.json'),
    militares: loadJSON('militares.json'),
    config: loadConfig(),
    exportado_em: new Date().toISOString(),
    versao: '2.0.0',
  };
  res.setHeader('Content-Disposition', 'attachment; filename="backup_gestao_dtic.json"');
  res.json(backup);
});

app.post('/api/backup/import', (req, res) => {
  const { voluntarios, militares, config } = req.body || {};

  if (!Array.isArray(voluntarios) || !Array.isArray(militares)) {
    return res.status(400).json({ error: 'Arquivo de backup inválido. Dados corrompidos.' });
  }

  saveJSON('voluntarios.json', voluntarios);
  saveJSON('militares.json', militares);
  if (config && typeof config === 'object' && !Array.isArray(config)) {
    saveJSON('config.json', config);
  }

  res.json({ ok: true, message: 'Backup restaurado com sucesso!' });
});

// ---------------------------------------------------------------------------
// Fallback - SPA
// ---------------------------------------------------------------------------

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------------------------------------------------------------------------
// Inicialização (se chamado diretamente)
// ---------------------------------------------------------------------------

if (require.main === module) {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
  });
}

module.exports = app;