<div align="center">
  <img width="1236" height="744" alt="Screenshot do Sistema" src="https://github.com/user-attachments/assets/5de02ec8-5ade-495b-a7a3-260b0bc6ec86" />

  <h1>Sistema de Gestao de Pessoal - CBMPA/DTIC</h1>

  <p>
    Sistema interno da <b>Diretoria de Tecnologia da Informacao e Comunicacao (DTIC)</b> do Corpo de Bombeiros Militar do Para.<br>
    Gerencia o efetivo de <b>Voluntarios Civis</b> e <b>Militares (Pracas)</b>, com emissao automatica de folhas de frequencia e registros de servico extraordinario.
  </p>
</div>

---

## Funcionalidades

### Modulo Voluntarios Civis
- Cadastro e remocao de voluntarios.
- Geracao de folha de frequencia com dias uteis, fins de semana e feriados nacionais automaticos.
- Persistencia via `voluntarios.json`.

### Modulo Militares / Pracas
- Cadastro com graduacao e nome de guerra.
- Geracao da Folha de Servico Extraordinario / Reforco do Expediente.
- Preenchimento automatico com marcacoes especificas para sabados e domingos.
- Persistencia de dados em `militares.json`.

### Geral
- Calculo de feriados nacionais moveis e fixos.
- Interface responsiva com Tailwind CSS.
- Empacotamento para Windows (.exe) com PyInstaller.

---

## Tecnologias

| Componente | Tecnologia |
|:---|:---|
| Linguagem | Python 3.10+ |
| Framework Web | Flask 3.x |
| Frontend | HTML5, Jinja2 e Tailwind CSS (CDN) |
| Distribuicao Windows | PyInstaller |
| Armazenamento | JSON |

---

## Estrutura do Projeto

```text
gestao-interna-dtic/
├── app.py
├── run_app.py
├── build_windows.bat
├── build_windows.sh
├── requirements_windows.txt
├── gestao_dtic.spec
├── militares.json
├── voluntarios.json
├── templates/
└── static/
```

---

## Execucao local

```bash
# Cria e ativa o ambiente virtual
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Dependencias
pip install -r requirements_windows.txt

# Execucao
python app.py
```

Aplicacao disponivel em `http://localhost:5000`.

---

## Build do executavel Windows

### Opcao 1: Build no proprio Windows

```bat
build_windows.bat
```

Saida esperada:
`dist_windows\GestaoInternaDTIC\GestaoInternaDTIC.exe`

### Opcao 2: Build no Linux com Wine

```bash
./build_windows.sh
```

Se precisar, ajuste o Python do Wine:

```bash
WINE_PYTHON="/caminho/para/python.exe" ./build_windows.sh
```

Saida esperada:
`dist_windows/GestaoInternaDTIC/GestaoInternaDTIC.exe`

---

## Licenca

Distribuido sob a licenca MIT.
