#!/usr/bin/env bash
set -euo pipefail

echo "=== Build do executavel com pkg ==="
npx pkg . --targets node18-win-x64 --output dist/GestaoInternaDTIC.exe

echo ""
echo "=== Build do instalador MSI com msitools (wixl) ==="
wixl -o dist/GestaoInternaDTIC.msi installer.wxs

echo ""
echo "Build concluida!"
echo "  Executavel standalone: dist/GestaoInternaDTIC.exe"
echo "  Instalador MSI:        dist/GestaoInternaDTIC.msi"