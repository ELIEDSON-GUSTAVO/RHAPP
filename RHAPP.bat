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
    pause
    exit /b 1
)

REM Verificar se é primeira vez ou se faltam dependências
if not exist "node_modules" (
    echo.
    echo Instalando dependencias (primeira vez)...
    echo Isto pode levar alguns minutos...
    echo.
    call npm install
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

REM Matar processos anteriores da porta 5173
taskkill /F /FI "WINDOWTITLE eq*vite*" >nul 2>&1

REM Iniciar o servidor Vite em background
start "" cmd /C "npm run dev"

REM Aguardar o servidor iniciar
echo Aguardando servidor iniciar...
timeout /t 5 /nobreak >nul

REM Abrir navegador
echo Abrindo navegador...
start http://localhost:5173/RHAPP/

echo.
echo =====================================
echo RHAPP rodando com sucesso!
echo =====================================
echo.
echo URL: http://localhost:5173/RHAPP/
echo.
echo O navegador deve abrir automaticamente.
echo Se nao abrir, acesse manualmente a URL acima.
echo.
echo Para parar o servidor, feche a janela Vite.
echo.
pause
