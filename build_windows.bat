@echo off
chcp 65001 >nul
title Build - Gestão Interna DTIC

echo.
echo ╔══════════════════════════════════════════════════╗
echo ║   Build do Instalador - Gestão Interna DTIC     ║
echo ╚══════════════════════════════════════════════════╝
echo.

:: ============================================================
:: ETAPA 1: Verificar Python
:: ============================================================
echo [1/4] Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python não encontrado! Instale o Python 3.10+ e adicione ao PATH.
    echo Download: https://www.python.org/downloads/
    pause
    exit /b 1
)
python --version
echo.

:: ============================================================
:: ETAPA 2: Instalar dependências
:: ============================================================
echo [2/4] Instalando dependências...
pip install -r requirements_windows.txt
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependências!
    pause
    exit /b 1
)
echo Dependências instaladas com sucesso.
echo.

:: ============================================================
:: ETAPA 3: Gerar executável com PyInstaller
:: ============================================================
echo [3/4] Gerando executável com PyInstaller...
echo (Isso pode demorar alguns minutos...)

:: Limpa builds anteriores
if exist "build" rmdir /s /q build
if exist "dist" rmdir /s /q dist

pyinstaller gestao_dtic.spec --noconfirm
if errorlevel 1 (
    echo ERRO: Falha no PyInstaller!
    pause
    exit /b 1
)
echo Executável gerado com sucesso em dist\GestaoInternaDTIC\
echo.

:: ============================================================
:: ETAPA 4: Criar instalador com Inno Setup (opcional)
:: ============================================================
echo [4/4] Criando instalador com Inno Setup...

:: Tenta encontrar o Inno Setup
set ISCC_PATH=
if exist "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" (
    set "ISCC_PATH=C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
)
if exist "C:\Program Files\Inno Setup 6\ISCC.exe" (
    set "ISCC_PATH=C:\Program Files\Inno Setup 6\ISCC.exe"
)

if defined ISCC_PATH (
    "%ISCC_PATH%" installer.iss
    if errorlevel 1 (
        echo AVISO: Falha ao criar instalador Inno Setup.
        echo O executável está disponível em dist\GestaoInternaDTIC\
    ) else (
        echo.
        echo ════════════════════════════════════════════════════
        echo  INSTALADOR CRIADO COM SUCESSO!
        echo  Arquivo: installer_output\GestaoInternaDTIC_Setup_v1.0.0.exe
        echo ════════════════════════════════════════════════════
    )
) else (
    echo AVISO: Inno Setup não encontrado.
    echo Para criar o instalador .exe, instale o Inno Setup 6:
    echo https://jrsoftware.org/isdl.php
    echo.
    echo O aplicativo portátil está disponível em:
    echo   dist\GestaoInternaDTIC\GestaoInternaDTIC.exe
)

echo.
echo ════════════════════════════════════════════════════
echo  Build concluído!
echo ════════════════════════════════════════════════════
echo.
pause
