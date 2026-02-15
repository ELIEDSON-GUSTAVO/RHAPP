@echo off
chcp 65001 >nul
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
    call npm install
    if errorlevel 1 (
        echo Erro ao instalar dependencias!
        pause
        exit /b 1
    )
)

REM Iniciar servidor Vite
echo.
echo =====================================
echo Iniciando RHAPP...
echo =====================================
echo.
echo Porta: 5173
echo URL: http://localhost:5173/RHAPP/
echo.
echo Para parar, pressione: CTRL + C
echo.

call npm run dev
