<img width="1236" height="744" alt="{92F8F0D7-E3CC-4CCB-93A3-E03A3F0296AB}" src="https://github.com/user-attachments/assets/5de02ec8-5ade-495b-a7a3-260b0bc6ec86" />

# Sistema de Gestão de Pessoal — CBMPA/DTIC

Sistema interno da **Diretoria de Tecnologia da Informação e Comunicação (DTIC)** do Corpo de Bombeiros Militar do Pará. Gerencia o efetivo de **Voluntários Civis** e **Militares (Praças)**, com emissão automática de folhas de frequência e registros de serviço extraordinário.

## Funcionalidades

### 🔹 Módulo Voluntários Civis
- Cadastro e remoção de voluntários (Técnico / Secretária)
- Folha de frequência com dias úteis, fins de semana e feriados nacionais
- Persistência em `voluntarios.json`

### 🔺 Módulo Militares / Praças
- Cadastro com graduação (SD, CB, SGT, SUB TEN) e nome de guerra
- Folha de Serviço Extraordinário / Reforço do Expediente
- Preenchimento automático de sábados e domingos
- Persistência em `militares.json`

### ⚙️ Geral
- Autenticação por senha (variável de ambiente)
- Sessão com expiração de 5 minutos
- Detecção automática de feriados nacionais (incluindo móveis)
- Interface responsiva com Tailwind CSS

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Linguagem | Python 3.14 |
| Framework | Flask 3.x |
| Frontend | HTML5 + Tailwind CSS (CDN) |
| Servidor (produção) | Gunicorn |
| Containerização | Docker + Docker Compose |

## Estrutura do Projeto

```
gestao-interna-dtic/
├── app.py                  # Aplicação Flask (rotas, CRUD, geração de folhas)
├── run_app.py              # Launcher para Windows (abre navegador)
├── requirements.txt        # Dependências Linux/Docker (com gunicorn)
├── requirements_windows.txt# Dependências Windows (com pyinstaller)
├── Dockerfile              # Imagem Docker (Python 3.14 + locale PT-BR)
├── docker-compose.yml      # Orquestração Docker
├── gestao_dtic.spec        # Configuração PyInstaller
├── installer.iss           # Script Inno Setup (instalador Windows)
├── build_windows.bat       # Script de build automatizado para Windows
├── .env                    # Senha de administração (não versionado)
├── voluntarios.json        # Dados dos voluntários civis
├── militares.json          # Dados dos militares
├── templates/
│   ├── index.html          # Dashboard principal
│   ├── login.html          # Tela de login
│   ├── folha_civil.html    # Folha de frequência (impressão)
│   └── folha_militar.html  # Folha de serviço extraordinário (impressão)
└── static/
    ├── brasao.jpg           # Brasão CBMPA
    ├── dte_logo.png         # Logo DTE
    └── header_militar.png   # Cabeçalho folha militar
```

## Instalação

### Configuração Inicial

Crie o arquivo `.env` na raiz do projeto:

```bash
ADMIN_PASSWORD=sua_senha_segura
```

---

### 🐧 Linux / Mac — Desenvolvimento Local

```bash
# Cria e ativa o ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instala dependências
pip install -r requirements.txt

# Inicia o servidor de desenvolvimento
python app.py
```

Acesse em: **http://localhost:5000**

---

### 🐳 Docker — Produção

```bash
docker-compose up --build
```

Acesse em: **http://localhost:5000** (mapeado da porta interna 8000)

---

### 🪟 Build do Executável Windows (Via Linux com Wine)

Para gerar o `.exe` Windows a partir do ambiente Linux, utilize o Python instalado dentro do Wine:

```bash
# Executa o PyInstaller usando a instalação do Python no Wine
wine ~/.wine/drive_c/users/jeiel/AppData/Local/Programs/Python/Python312/python.exe -m PyInstaller gestao_dtic.spec --noconfirm --distpath dist_windows --workpath build_windows
```

**Resultado:**

O executável gerado estará localizado em:
`dist_windows/GestaoInternaDTIC/GestaoInternaDTIC.exe`

Ao executar o `.exe` no Windows, ele iniciará o servidor Flask localmente e abrirá o navegador padrão automaticamente. Não é necessária a instalação prévia de dependências ou do Python na máquina de destino.

## Licença

[MIT](LICENSE) — © 2026 CBMPA/DTIC
