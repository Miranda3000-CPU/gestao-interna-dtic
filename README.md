# Gestão de Frequência - CBMPA/DTIC

Este é um sistema de gestão de frequência de voluntários, desenvolvido para o Corpo de Bombeiros Militar do Pará (CBMPA) - Diretoria de Tecnologia da Informação e Comunicação (DTIC).

## Descrição

A aplicação permite o cadastro de voluntários, a gestão de seus turnos e a geração de uma folha de frequência mensal para impressão. O acesso à área de gestão é protegido por senha.

## Funcionalidades

-   **Autenticação:** Sistema de login simples para proteger o acesso aos dados.
-   **Gestão de Voluntários (VCs):** Adicionar e remover voluntários da lista.
-   **Geração de Relatório:** Cria uma folha de frequência em formato HTML, pronta para impressão, com os dias do mês e marcação de fins de semana.
-   **Interface Simples:** Interface limpa e funcional construída com Tailwind CSS.

## Tecnologias Utilizadas

-   **Backend:** Python com [Flask](https://flask.palletsprojects.com/)
-   **Frontend:** HTML e [Tailwind CSS](https://tailwindcss.com/)
-   **Servidor WSGI:** [Gunicorn](https://gunicorn.org/)
-   **Containerização:** [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

## Configuração e Instalação

### Pré-requisitos

-   Docker
-   Docker Compose

### 1. Arquivo de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto e adicione a senha de administrador:

```
ADMIN_PASSWORD=sua_senha_secreta
```

### 2. Executando com Docker

Para construir e iniciar o container, execute o seguinte comando:

```bash
docker-compose up --build
```

A aplicação estará disponível em [http://localhost:5000](http://localhost:5000).

### 3. Instalação Local (Alternativa, sem Docker)

Caso não queira usar Docker, você pode rodar a aplicação localmente:

```bash
# Crie e ative um ambiente virtual
python -m venv .venv
source .venv/bin/activate # ou .venv\Scripts\activate no Windows

# Instale as dependências
pip install -r requirements.txt

# Execute a aplicação
flask run
```

## Uso

1.  Acesse a página de [login](http://localhost:5000/login).
2.  Insira a senha definida no arquivo `.env`.
3.  Na página principal, adicione ou remova voluntários.
4.  Para gerar o relatório, edite (se necessário) o nome do comandante e clique em "GERAR RELATÓRIO PDF". Uma nova aba será aberta com a folha de frequência.
5.  Para imprimir, use a função de impressão do seu navegador (Ctrl+P) e salve como PDF ou envie para uma impressora.
