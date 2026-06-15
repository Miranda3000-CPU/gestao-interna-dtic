/**
 * Gestão Interna DTIC - Launcher
 * Inicia o servidor Node.js e abre o navegador automaticamente.
 */
const http = require('http');
const { exec } = require('child_process');
const path = require('path');

// Carrega o app Express do server.js
const app = require('./server');

let PORT = 3000;

function findFreePort(start = 3000, end = 3100) {
  return new Promise((resolve, reject) => {
    let port = start;
    function tryPort() {
      if (port > end) {
        return resolve(3000); // fallback
      }
      const server = http.createServer();
      server.listen(port, '127.0.0.1', () => {
        server.close(() => resolve(port));
      });
      server.on('error', () => {
        port++;
        tryPort();
      });
    }
    tryPort();
  });
}

function openBrowser(port) {
  const url = `http://127.0.0.1:${port}`;
  const platform = process.platform;

  let command;
  if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else if (platform === 'darwin') {
    command = `open "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  setTimeout(() => {
    exec(command, (err) => {
      if (err) {
        console.log(`Navegador não abriu automaticamente. Acesse: ${url}`);
      }
    });
  }, 1500);
}

(async function main() {
  // Garante que o diretório de dados existe (para .exe standalone fora do MSI)
  const fs = require('fs');
  const path = require('path');
  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || process.env.APPDATA || __dirname;
    const dataDir = path.join(localAppData, 'GestaoDTIC');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  PORT = await findFreePort();

  const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║       Gestão Interna DTIC - Servidor Local       ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Servidor rodando em: http://127.0.0.1:${PORT}       ║
║                                                  ║
║  O navegador será aberto automaticamente.        ║
║  Para encerrar, feche esta janela.               ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`);
    openBrowser(PORT);
  });
})();