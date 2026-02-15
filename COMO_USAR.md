# RHAPP - Aplicativo de RH

## Como usar

### Opção 1: Clique duplo no arquivo (Recomendado)
1. Procure por `RHAPP.bat` na pasta do aplicativo
2. Clique duas vezes para iniciar
3. O navegador abrirá automaticamente em `http://localhost:5173/RHAPP/`

### Opção 2: Linha de comando
```bash
npm run dev
```

Depois acesse: http://localhost:5173/RHAPP/

## Requisitos

- **Node.js** instalado ([baixe aqui](https://nodejs.org/))
- **npm** (vem com Node.js)

## Estrutura do App

- `src/` - Código React (componentes, pages, hooks)
- `public/` - Arquivos estáticos
- `dist/` - Build para produção
- `main.cjs` - Processo principal do Electron (futuro)
- `preload.cjs` - Preload script do Electron (futuro)

## Banco de Dados

O app usa **SQLite** com as seguintes tabelas:

### Funcionarios
```sql
CREATE TABLE funcionarios (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT,
  departamento TEXT,
  email TEXT,
  created_at DATETIME
)
```

### Departamentos
```sql
CREATE TABLE departamentos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  created_at DATETIME
)
```

### Relatorios
```sql
CREATE TABLE relatorios (
  id INTEGER PRIMARY KEY,
  titulo TEXT NOT NULL,
  conteudo TEXT,
  tipo TEXT,
  created_at DATETIME
)
```

## Desenvolvedoroes

- **Nome:** Eliedson Gustavo
- **Email:** eliedsongustavo6@gmail.com
- **GitHub:** https://github.com/ELIEDSON-GUSTAVO/RHAPP

## Licença

Todos os direitos reservados © 2026
