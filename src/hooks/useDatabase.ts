import { useCallback } from 'react';

// Hook para usar o banco de dados SQLite no Electron
export const useDatabase = () => {
  const electronAPI = (window as any).electronAPI;

  // Query múltiplas linhas
  const query = useCallback(async (sql: string, params?: any[]) => {
    if (!electronAPI) {
      console.warn('Electron API não disponível. Rodando em modo web.');
      return [];
    }
    try {
      return await electronAPI.queryDB(sql, params);
    } catch (error) {
      console.error('Erro na query:', error);
      throw error;
    }
  }, []);

  // Executar comando (INSERT, UPDATE, DELETE)
  const run = useCallback(async (sql: string, params?: any[]) => {
    if (!electronAPI) {
      console.warn('Electron API não disponível. Rodando em modo web.');
      return { id: 0, changes: 0 };
    }
    try {
      return await electronAPI.runDB(sql, params);
    } catch (error) {
      console.error('Erro ao executar comando:', error);
      throw error;
    }
  }, []);

  // Obter uma linha
  const get = useCallback(async (sql: string, params?: any[]) => {
    if (!electronAPI) {
      console.warn('Electron API não disponível. Rodando em modo web.');
      return null;
    }
    try {
      return await electronAPI.getDB(sql, params);
    } catch (error) {
      console.error('Erro ao obter dados:', error);
      throw error;
    }
  }, []);

  return { query, run, get };
};

export default useDatabase;
