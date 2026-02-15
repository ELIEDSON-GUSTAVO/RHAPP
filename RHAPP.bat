@echo off
setlocal enabledelayedexpansion

REM Mudar para o diretório do app
cd /d "%~dp0"

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo =====================================
    echo ERRO: Node.js nao foi encontrado!
    echo =====================================
    echo.
    echo Por favor instale Node.js em:
    echo https://nodejs.org/
    echo.
    echo Depois execute este arquivo novamente.
    echo.
    pause
    exit /b 1
)

REM Verificar se é primeira vez ou se faltam dependências
if not exist "node_modules" (
    echo.
    echo Instalando dependencias (primeira vez)...
    echo.
    npm install
    if errorlevel 1 (
        echo Erro ao instalar dependencias!
        pause
        exit /b 1
    )
)

REM Iniciar servidor Vite em background
echo.
echo =====================================
echo Iniciando RHAPP...
echo =====================================
echo.

start /B cmd /c npm run dev

REM Aguardar o servidor iniciar
timeout /t 4 /nobreak >nul

REM Obter URL
set PORT=5173
set URL=http://localhost:%PORT%/RHAPP/

REM Abrir navegador
echo Abrindo navegador em %URL%...
start %URL%

echo.
echo =====================================
echo RHAPP rodando com sucesso!
echo =====================================
echo.
echo URL: %URL%
echo.
echo Para parar o servidor, feche esta janela
echo.
pause
