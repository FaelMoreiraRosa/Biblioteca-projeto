# Sistema de Gerenciamento de Biblioteca - Projeto 2

**Vídeo de apresentação:** [assistir no Google Drive](https://drive.google.com/file/d/1NM5cRlOY1_OMQ_hiSOK9dVY2etLwG-Dr/view)

## Integrantes

- Lucas Gabriel Pinheiro dos Santos
- Rafael Moreira Rosa

Aplicação web completa para gerenciamento de uma biblioteca, desenvolvida com API REST em Node.js/Express, banco relacional com Sequelize, autenticação JWT, documentação Swagger e frontend em React.

## Tecnologias

**Backend**

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT
- Swagger

**Frontend**

- React
- Vite
- Axios
- React Router
- Context API

## Estrutura

```text
backend/      API REST em Express
frontend/     Interface em React
api/          Handler serverless para deploy na Vercel
vercel.json   Configuração de build, rotas e deploy
```

## Perfis de Acesso

O sistema possui três perfis:

- **Administrador:** acesso completo ao sistema, incluindo usuários, livros, leitores, empréstimos e devoluções.
- **Bibliotecário:** gerencia livros, leitores, empréstimos e devoluções, sem acesso à gestão de usuários internos.
- **Leitor:** consulta livros e visualiza apenas seus próprios empréstimos.

## Funcionalidades Implementadas

- Login com JWT.
- Controle de acesso por perfil.
- CRUD de usuários internos.
- CRUD de livros.
- CRUD de leitores.
- Inativação e reativação de leitores.
- Registro de empréstimos.
- Registro de devoluções.
- Atualização automática da quantidade disponível dos livros.
- Bloqueio de empréstimo para leitor inativo.
- Bloqueio de empréstimo quando não há exemplares disponíveis.
- Identificação de empréstimos atrasados.
- Histórico de empréstimos por leitor.
- Filtros de livros por busca geral, categoria e disponibilidade.
- Filtros de leitores por nome, CPF/RA e status.
- Filtros de empréstimos por leitor, status e intervalo de datas.
- Dashboard com resumo geral do sistema.
- Documentação Swagger.

## Decisões de Arquitetura

### Empréstimos com um livro por registro

Cada registro de empréstimo associa um leitor a um livro. Quando um leitor pega mais de um livro, o sistema registra múltiplos empréstimos independentes. Essa decisão simplifica a devolução individual, o controle de estoque e a auditoria do histórico.

### Separação entre usuários internos e leitores

Administradores e bibliotecários ficam na tabela de usuários do sistema. Leitores ficam em uma tabela própria, com CPF/RA, telefone, endereço e status. Essa separação deixa o controle de permissões mais claro.

### Cálculo de atrasos

O status de atraso é recalculado nas consultas de empréstimos. Se a data prevista de devolução já passou e o empréstimo ainda está em aberto, o sistema marca o registro como atrasado.

## Contas de Demonstração

Senha padrão:

```text
123456
```

| Perfil | E-mail |
|---|---|
| Administrador | admin@biblioteca.com |
| Bibliotecário | bibliotecario@biblioteca.com |
| Leitor | ana.souza@aluno.com |
| Leitor | bruno.lima@aluno.com |

## Como Executar Localmente

### 1. Backend

Entre na pasta do backend:

```powershell
cd backend
npm install
```

Crie o arquivo `.env` com base em `.env.example`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=biblioteca_bd
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_local
DB_DIALECT=postgres

JWT_SECRET=troque_por_um_segredo_forte
JWT_EXPIRES_IN=2h
```

Com o banco `biblioteca_bd` criado no PostgreSQL, rode:

```powershell
npm run migrate
npm run seed
npm run dev
```

API local:

```text
http://localhost:3000
```

Swagger local:

```text
http://localhost:3000/api-docs
```

### 2. Frontend

Em outro terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend local:

```text
http://localhost:5173
```

## Deploy na Vercel

O projeto possui configuração para publicar o frontend e expor a API pelo prefixo `/api`.

No ambiente de produção, o frontend usa automaticamente:

```text
/api
```

Assim, uma chamada como:

```text
/auth/login
```

no desenvolvimento local vira:

```text
http://localhost:3000/auth/login
```

e no deploy vira:

```text
/api/auth/login
```

### Variáveis necessárias na Vercel

Para o deploy funcionar com login e banco de dados, configure no painel da Vercel:

```env
DATABASE_URL=postgres://usuario:senha@host:porta/banco
JWT_SECRET=um_segredo_forte_para_producao
JWT_EXPIRES_IN=2h
DB_DIALECT=postgres
```

Sem `DATABASE_URL` e `JWT_SECRET`, a interface pode abrir, mas a autenticação e as rotas da API não funcionarão corretamente.

Swagger no deploy:

```text
/api/api-docs
```

## Scripts Principais

Backend:

```powershell
npm run dev
npm run migrate
npm run seed
npm run db:reset
```

Frontend:

```powershell
npm run dev
npm run build
```

## Observações para Avaliação

- O sistema usa JWT para proteger as rotas da API.
- O controle de acesso por perfil é aplicado no backend e no frontend.
- O Leitor não acessa usuários, leitores ou operações administrativas.
- O Bibliotecário opera livros, leitores e empréstimos, mas não gerencia usuários internos.
- O Administrador possui acesso completo.
- O modelo de empréstimos registra um livro por empréstimo para facilitar devoluções e rastreabilidade.
