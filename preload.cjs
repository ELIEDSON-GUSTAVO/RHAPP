const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Executar query no banco de dados
  queryDB: (sql, params = []) => 
    ipcRenderer.invoke('db:query', sql, params),
  
  // Executar comando no banco de dados
  runDB: (sql, params = []) => 
    ipcRenderer.invoke('db:run', sql, params),
  
  // Obter uma linha do banco de dados
  getDB: (sql, params = []) => 
    ipcRenderer.invoke('db:get', sql, params),
});
