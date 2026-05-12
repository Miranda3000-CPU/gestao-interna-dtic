#!/usr/bin/env bash
set -euo pipefail

# Build do executavel Windows via Wine (Python instalado no Wine)
: "${WINE_PYTHON:=~/.wine/drive_c/users/$USER/AppData/Local/Programs/Python/Python312/python.exe}"
WINE_PYTHON="${WINE_PYTHON/#\~/$HOME}"

if [ ! -f "$WINE_PYTHON" ]; then
  echo "[ERRO] Python do Wine nao encontrado em: $WINE_PYTHON"
  exit 1
fi

wine "$WINE_PYTHON" -m pip install -r requirements_windows.txt
wine "$WINE_PYTHON" -m PyInstaller gestao_dtic.spec --noconfirm --distpath dist_windows --workpath build_windows

echo
echo "Build concluida."
echo "Executavel: dist_windows/GestaoInternaDTIC/GestaoInternaDTIC.exe"
