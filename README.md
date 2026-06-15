<div align="center">
  <img width="1236" height="744" alt="Screenshot do Sistema" src="https://github.com/user-attachments/assets/5de02ec8-5ade-495b-a7a3-260b0bc6ec86" />

  <h1>Sistema de Gestão de Pessoal - CBMPA/DTIC</h1>

  <p>
    Sistema interno da <b>Diretoria de Tecnologia da Informação e Comunicação (DTIC)</b> do Corpo de Bombeiros Militar do Pará.<br>
    Gerencia o efetivo de <b>Voluntários Civis</b> e <b>Militares (Praças)</b>, com emissão automática de folhas de frequência e registros de serviço extraordinário.
  </p>
</div>

---

## Funcionalidades

### Módulo Voluntários Civis
- Cadastro e remoção de voluntários.
- Geração de folha de frequência com dias úteis, fins de semana e feriados nacionais automáticos.
- Persistência via `voluntarios.json`.

### Módulo Militares / Praças
- Cadastro com graduação e nome de guerra.
- Geração da Folha de Serviço Extraordinário / Reforço do Expediente.
- Preenchimento automático com marcações específicas para sábados e domingos.
- Persistência de dados em `militares.json`.

### Geral
- Cálculo de feriados nacionais móveis e fixos.
- Interface responsiva com Tailwind CSS.
- Empacotamento standalone para Windows/Linux com `pkg`.

---

## Tecnologias

| Componente | Tecnologia |
|:---|:---|
| Runtime | Node.js 18+ |
| Backend | Express.js 4.x |
| Frontend | HTML5, Vanilla JS e Tailwind CSS (CDN) |
| Distribuição | `pkg` (executável standalone) |
| Armazenamento | JSON |

---

## Estrutura do Projeto

```text
gestao-interna-dtic/
├── package.json
├── server.js              # Servidor Express + API REST
├── launcher.js            # Inicia servidor + abre navegador
├── militares.json
├── voluntarios.json
├── public/
│   ├── index.html         # SPA principal
│   ├── folha_civil.html   # Relatório de frequência civil
│   ├── folha_militar.html # Relatório de serviço extraordinário
│   ├── js/
│   │   ├── api.js         # Chamadas fetch ao backend
│   │   ├── utils.js       # highlight_nome_guerra e helpers
│   │   ├── holidays.js    # Cálculo de feriados
│   │   ├── civil-report.js
│   │   └── militar-report.js
│   └── img/
│       ├── brasao.jpg
│       ├── dte_logo.png
│       ├── header_militar.png
│       └── icon.ico
```

---

## Execução Local

```bash
# Instalar dependências
npm install

# Executar (abre o navegador automaticamente)
npm start

# Ou apenas o servidor (sem abrir navegador)
npm run server
```

Aplicação disponível em `http://localhost:3000`.

---

## Build do Executável

### Gerar .exe para Windows

```bash
npx pkg . --targets node18-win-x64 --output dist/GestaoInternaDTIC.exe
```

### Gerar binário para Linux

```bash
npx pkg . --targets node18-linux-x64 --output dist/GestaoInternaDTIC
```

Saída esperada: executável standalone na pasta `dist/`.

### Build para ambas plataformas

```bash
npx pkg .
```

---

## Licença

Distribuído sob a licença MIT.