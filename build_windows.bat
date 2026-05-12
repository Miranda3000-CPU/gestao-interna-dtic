@echo off
setlocal

REM Build executavel Windows com PyInstaller
if not exist venv\Scripts\python.exe (
  echo [ERRO] Ambiente virtual nao encontrado em venv\Scripts\python.exe
  echo Crie e ative o venv antes de executar este script.
  exit /b 1
)

venv\Scripts\python.exe -m pip install -r requirements_windows.txt
if errorlevel 1 exit /b 1

venv\Scripts\python.exe -m PyInstaller gestao_dtic.spec --noconfirm --distpath dist_windows --workpath build_windows
if errorlevel 1 exit /b 1

echo.
echo Build concluida.
echo Executavel: dist_windows\GestaoInternaDTIC\GestaoInternaDTIC.exe
endlocal
