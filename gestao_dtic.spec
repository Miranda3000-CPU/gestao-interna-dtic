# -*- mode: python ; coding: utf-8 -*-
"""
PyInstaller spec file para Gestão Interna DTIC.
Executar com: pyinstaller gestao_dtic.spec
"""

import os

block_cipher = None
base_dir = os.path.abspath('.')

a = Analysis(
    ['run_app.py'],
    pathex=[base_dir],
    binaries=[],
    datas=[
        ('templates', 'templates'),
        ('static', 'static'),
        ('voluntarios.json', '.'),
        ('militares.json', '.'),
        ('app.py', '.'),
    ],
    hiddenimports=[
        'flask',
        'flask.json',
        'flask.templating',
        'flask.sessions',
        'jinja2',
        'jinja2.ext',
        'markupsafe',
        'werkzeug',
        'werkzeug.serving',
        'werkzeug.debug',
        'werkzeug.security',
        'dotenv',
        'json',
        'email.mime.text',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'tkinter',
        'matplotlib',
        'numpy',
        'scipy',
        'pandas',
        'PIL',
        'cv2',
        'test',
        'unittest',
        'gunicorn',
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='GestaoInternaDTIC',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,  # True = mostra o terminal com info do servidor
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='static/icon.ico',
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='GestaoInternaDTIC',
)
