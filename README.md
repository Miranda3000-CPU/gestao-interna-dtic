<div align="center">
  <img width="1236" height="744" alt="Screenshot do Sistema" src="https://github.com/user-attachments/assets/5de02ec8-5ade-495b-a7a3-260b0bc6ec86" />

  <h1>🚒 Sistema de Gestão de Pessoal — CBMPA/DTIC</h1>
  
  <p>
    Sistema interno da <b>Diretoria de Tecnologia da Informação e Comunicação (DTIC)</b> do Corpo de Bombeiros Militar do Pará.<br>
    Gerencia o efetivo de <b>Voluntários Civis</b> e <b>Militares (Praças)</b>, com emissão automática de folhas de frequência e registros de serviço extraordinário.
  </p>
</div>

---

## 🚀 Funcionalidades

### 🔹 Módulo Voluntários Civis
- Cadastro e remoção de voluntários (Técnico / Secretária).
- Geração de folha de frequência com dias úteis, fins de semana e feriados nacionais automáticos.
- Persistência simples e direta via `voluntarios.json`.

### 🔺 Módulo Militares / Praças
- Cadastro com graduação (SD, CB, SGT, SUB TEN) e nome de guerra.
- Geração da Folha de Serviço Extraordinário / Reforço do Expediente.
- Preenchimento automático com marcações específicas para sábados e domingos.
- Persistência de dados em `militares.json`.

### ⚙️ Geral
- Algoritmo de cálculo de feriados nacionais móveis e fixos.
- Interface moderna, limpa e responsiva utilizando **Tailwind CSS**.
- Aplicação empacotável para **Windows (.exe)** para distribuição rápida via Wine (Linux) ou nativamente no Windows.

---

## 🛠️ Tecnologias Utilizadas

| Componente | Tecnologia |
|:---|:---|
| **Linguagem** | Python 3.10+ |
| **Framework Web** | Flask 3.x |
| **Frontend** | HTML5, Jinja2 e Tailwind CSS (CDN) |
| **Distribuição Windows** | PyInstaller / Arquivos em Lote (.bat) |
| **Armazenamento** | JSON (Simples e eficiente) |

---

## 📂 Estrutura do Projeto

Abaixo a estrutura principal e atualizada dos arquivos do projeto:

```text
gestao-interna-dtic/
├── app.py                   # Lógica principal, rotas, CRUD e algoritmos de datas
├── run_app.py               # Launcher alternativo do sistema
├── requirements_windows.txt # Lista de dependências Python do projeto
├── gestao_dtic.spec         # Configurações do PyInstaller
├── militares.json           # Base de dados local (Militares)
├── voluntarios.json         # Base de dados local (Voluntários Civis)
├── templates/               # Views e telas (index, login, folhas de impressão)
└── static/                  # Arquivos de recursos visuais e logos (brasão, etc)
```

---

## ⚙️ Instalação e Execução

### 1. Desenvolvimento e Execução Local (Linux / Mac / Windows)
Para rodar o projeto no seu ambiente de desenvolvimento, clone o repositório e siga os passos:

Abra um terminal na pasta do projeto e execute:

```bash
# Cria e ativa o ambiente virtual
python -m venv venv

# Ativação:
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalação das dependências
pip install -r requirements_windows.txt

# Execução do servidor web Flask
python app.py
```
A aplicação estará disponível em: **http://localhost:5000**

---

## 🪟 Compilando Executável para Windows (via Linux com Wine)

Como o código é feito no Linux mas o alvo é o Windows, você pode usar o **Wine** para compilar o executável (`.exe`) sem precisar sair do seu ambiente.

**Pré-requisitos no Linux:**
- Ter o Wine instalado e inicializado.
- Ter o Python instalado dentro do Wine (ex: em `~/.wine/drive_c/users/jeiel/AppData/Local/Programs/Python/Python312/`).
- Ter as dependências (`requirements_windows.txt`) e o `PyInstaller` instalados neste Python do Wine.

**Comando de Build:**
Acesse o diretório raiz do projeto no terminal do Linux e execute:

```bash
wine ~/.wine/drive_c/users/jeiel/AppData/Local/Programs/Python/Python312/python.exe -m PyInstaller gestao_dtic.spec --noconfirm --distpath dist_windows --workpath build_windows
```

**Resultado:**
O executável gerado estará localizado em:
`dist_windows/GestaoInternaDTIC/GestaoInternaDTIC.exe`

Ao executar este `.exe` no Windows, ele iniciará o servidor Flask localmente e abrirá o navegador padrão automaticamente.

---

## 📄 Licença

Distribuído sob a licença **MIT** — © 2026 CBMPA/DTIC.
