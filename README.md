Aqui está o conteúdo completo em Markdown, limpo, sem o excesso de emojis e pronto para você copiar e colar direto no seu arquivo `README.md`:

```markdown
# Sistema de Gerenciamento de Biblioteca (Projeto II)

Este projeto foi desenvolvido como requisito avaliativo para a disciplina de Desenvolvimento Backend na UTFPR. A aplicação consiste em um sistema completo de gerenciamento de biblioteca, unindo uma API REST robusta a uma interface SPA dinâmica e responsiva.

O objetivo principal foi aplicar na prática conceitos de arquitetura de software, controle de acesso baseado em funções (RBAC), persistência de dados relaciais e consumo de APIs seguras.

---

## Tecnologias Utilizadas

* **Backend:** Node.js, Express, Sequelize ORM, PostgreSQL, JWT (JSON Web Token) e Swagger UI.
* **Frontend:** React (Vite), JavaScript (ES6+), Axios e Context API.

---

## Estrutura do Repositório

```text
biblioteca-projeto2/
├── backend/      # API REST (Express + Sequelize)
└── frontend/     # Interface em React (Vite)

```

---

## Como Executar o Projeto

### 1. Pré-requisitos

* Node.js (versão 18 ou superior)
* PostgreSQL rodando localmente (caso prefira utilizar MySQL, altere o `DB_DIALECT` para `mysql` e instale o pacote `mysql2`).

### 2. Configurando o Backend

Navegue até a pasta do backend, instale as dependências e configure as variáveis de ambiente:

```bash
cd backend
npm install
cp .env.example .env  # Abra o arquivo .env e insira as credenciais do seu banco

```

Com o banco de dados vazio criado (exemplo: `biblioteca-bd`), execute as migrações e os seeds para popular as tabelas iniciais:

```bash
npx sequelize-cli db:create  # Opcional, caso o banco ainda não exista
npm run migrate             # Cria a estrutura de tabelas
npm run seed                # Insere dados obrigatórios de teste
npm run dev                 # Inicia o servidor local

```

* **API Local:** `http://localhost:3000`
* **Documentação Swagger:** `http://localhost:3000/api-docs`

#### Contas de Teste (Senha padrão: `123456`)

| Perfil | E-mail |
| --- | --- |
| **Administrador** | admin@biblioteca.com |
| **Bibliotecário** | bibliotecario@biblioteca.com |
| **Leitor** | ana.souza@aluno.com |
| **Leitor** | bruno.lima@aluno.com |

*Nota: O seed também cadastra 3 livros iniciais para demonstração. Se precisar resetar o banco a qualquer momento, utilize `npm run db:reset`.*

### 3. Configurando o Frontend

Abra um novo terminal, acesse a pasta do frontend e inicialize a interface:

```bash
cd frontend
npm install
cp .env.example .env  # Certifique-se de que a VITE_API_URL aponta para o backend (porta 3000)
npm run dev           # Inicia o app em http://localhost:5173

```

---

## Decisões de Arquitetura e Regras de Negócio

Durante o desenvolvimento, algumas escolhas foram feitas para garantir a consistência dos dados e simplificar a lógica de negócios:

* **Mapeamento de Empréstimos (1:1):** Para facilitar auditorias e devoluções individuais, cada registro na tabela `Emprestimo` vincula exatamente um leitor a um livro. Caso um usuário pegue mais de um livro emprestado, o sistema gera múltiplos registros independentes em vez de uma lista na mesma linha.
* **Separação de Usuários e Leitores:** O sistema trata a equipe interna (`Usuario` - Admin/Bibliotecário) separadamente dos alunos (`Leitor`). Isso isola as permissões de acesso e mantém a tabela de leitores limpa, contendo apenas dados pertinentes (como CPF/RA e status de ativação).
* **Cálculo Dinâmico de Atrasos:** Em vez de rodar rotinas ou cronjobs agendados na máquina, o status de `Atrasado` é calculado em tempo real nas consultas. Se o empréstimo continua aberto e a data prevista de entrega expirou, o backend injeta o status atualizado na resposta da API.
* **Acesso Simplificado:** Leitores cadastrados sem uma senha explícita utilizam o próprio número de CPF/RA como credencial inicial de login, facilitando testes e homologações.

---

## Escopo Implementado

* **Níveis de Permissão (RBAC):** Rotas protegidas por JWT (`verificarToken` + `autorizar`). O **Admin** possui controle total do sistema; o **Bibliotecário** gerencia o acervo, leitores e movimentações (sem permissão para excluir usuários); o **Leitor** realiza buscas de livros e visualiza apenas o próprio histórico.
* **Módulo de Empréstimos:** Validações automatizadas impedem locações para leitores inativos ou de livros sem estoque. O fluxo atualiza a quantidade disponível no acervo de forma automática durante as saídas e devoluções.
* **Filtros Avançados:** Busca textual em livros (por título, autor, categoria e ISBN) e relatórios de empréstimos filtrados por status ou intervalo de datas.
* **Interface customizada:** Frontend construído em React utilizando uma paleta de cores terrosa (bege, marrom, terracota e oliva) voltada à identidade visual de bibliotecas.

```

```
