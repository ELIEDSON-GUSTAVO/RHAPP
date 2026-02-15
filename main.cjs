const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const isDev = require('electron-is-dev');

let mainWindow;
let db;

// Inicializar banco de dados SQLite
function initializeDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'app.db');
  
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Erro ao abrir banco de dados:', err);
    } else {
      console.log('Banco de dados conectado');
      createTables();
    }
  });
}

// Criar tabelas se não existirem
function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS funcionarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cargo TEXT,
      departamento TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS departamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS relatorios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      conteudo TEXT,
      tipo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Criar janela da aplicação
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  let startUrl;
  if (isDev) {
    startUrl = 'http://localhost:5173/RHAPP/';
    console.log('[DEV] Loading URL:', startUrl);
  } else {
    const distPath = path.join(__dirname, 'dist', 'index.html');
    startUrl = `file://${distPath}`;
    console.log('[PROD] Loading URL:', startUrl);
    console.log('[PROD] File exists:', require('fs').existsSync(distPath));
  }

  mainWindow.loadURL(startUrl);

  // Error handlers
  mainWindow.webContents.on('crashed', () => {
    console.error('Windows crashed!');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Load failed:', errorCode, errorDescription);
    mainWindow.webContents.openDevTools();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers para operações no banco de dados
ipcMain.handle('db:query', async (event, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle('db:run', async (event, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
});

ipcMain.handle('db:get', async (event, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
});

// Inicialização da aplicação
app.on('ready', () => {
  initializeDatabase();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Limpar banco de dados ao fechar
app.on('before-quit', () => {
  if (db) {
    db.close();
  }
});
