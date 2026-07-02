#  Sistema de Gerenciamento de Biblioteca — Projeto 2

API REST em **Node.js/Express + Sequelize (PostgreSQL)**, autenticação **JWT**,
documentação **Swagger** e frontend em **React** (Vite).

---

## Estrutura

```
biblioteca-projeto2/
├── backend/     API REST (Express + Sequelize + JWT + Swagger)
└── frontend/    Interface React (Vite)
```

---

## 1. Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente (ou ajuste `DB_DIALECT` para `mysql` + instale `mysql2` se preferir MySQL)

---

## 2. Rodando o Backend

```bash
cd backend
npm install
cp .env.example .env      # depois edite com as credenciais do seu banco
```

Crie o banco de dados vazio (ex.: `biblioteca-bd`) e rode:

```bash
npx sequelize-cli db:create      # (opcional, se o banco ainda não existir)
npm run migrate                  # cria as tabelas
npm run seed                     # popula com os usuários/leitores/livros obrigatórios
npm run dev                      # inicia o servidor em http://localhost:3000
```

- API: `http://localhost:3000`
- Documentação Swagger: `http://localhost:3000/api-docs`

### Contas criadas pelo seed (senha `123456` para todas)

| Perfil         | E-mail                        |
|----------------|--------------------------------|
| Administrador  | admin@biblioteca.com          |
| Bibliotecário  | bibliotecario@biblioteca.com  |
| Leitor         | ana.souza@aluno.com           |
| Leitor         | bruno.lima@aluno.com          |

Também são criados 3 livros de exemplo para facilitar a demonstração.

Para resetar tudo do zero: `npm run db:reset`.

---

## 3. Rodando o Frontend

```bash
cd frontend
npm install
cp .env.example .env      # confirme que VITE_API_URL aponta pro backend
npm run dev                # abre em http://localhost:5173
```

---

## 4. O que foi implementado (checklist do enunciado)

**Perfis e permissões**
- [x] 3 tipos de usuário: Administrador, Bibliotecário, Leitor
- [x] Administrador: CRUD completo de usuários (define o tipo), CRUD de livros, visualiza tudo, realiza empréstimo/devolução
- [x] Bibliotecário: CRUD de livros e leitores, empréstimos/devoluções, histórico, atrasados — sem excluir usuários do sistema
- [x] Leitor: login, vê livros disponíveis, busca, vê **apenas seus próprios** empréstimos e histórico

**Autenticação**
- [x] Login com JWT (`/auth/login`)
- [x] Rotas protegidas por token + perfil (`verificarToken` + `autorizar([...])`)
- [x] Secret e demais configs em `.env` (nada mais hardcoded)

**Livros** — título, autor, editora, ano, categoria, ISBN, qtd_total, qtd_disponível, status
- [x] CRUD completo + busca por título/autor/categoria/ISBN + filtro de disponibilidade

**Leitores** — nome, CPF/RA, e-mail, telefone, endereço, status (Ativo/Inativo)
- [x] CRUD completo + busca por nome/CPF/RA + inativar/ativar + histórico de empréstimos

**Empréstimos**
- [x] Vínculo com leitor, livro, datas, status (`Em aberto`, `Devolvido`, `Atrasado`)
- [x] Regras: só empresta com estoque disponível; leitor inativo é bloqueado; estoque
      é decrementado/incrementado automaticamente; status "Atrasado" calculado
      dinamicamente; leitor só vê os próprios empréstimos
- [x] Filtros por status, leitor e intervalo de datas

**Swagger** — documentação completa em `/api-docs`, com todas as rotas, métodos, parâmetros e corpo de requisição documentados via JSDoc nas próprias rotas.

**Frontend React**
- [x] Telas de login, livros, leitores, usuários do sistema (Admin) e empréstimos
- [x] Consumo completo da API, navegação condicional por perfil
- [x] Paleta de cores terrosa (bege, marrom, terracota, oliva)

---

## 5. Decisões de projeto (vale explicar na apresentação)

- **Um empréstimo = um livro.** O enunciado menciona "associar empréstimo a um ou
  mais livros"; optamos por manter 1 registro de `Emprestimo` por livro (mais simples
  de auditar/devolver individualmente). Emprestar vários livros ao mesmo leitor = criar
  vários registros de empréstimo. Isso está refletido no modelo (`livro_id` único por empréstimo).
- **Usuários do sistema vs. Leitores são tabelas separadas** (`Usuario` para
  Administrador/Bibliotecário, `Leitor` para alunos), como já estava no projeto original.
  Isso facilita ter regras de acesso e campos diferentes (leitor tem CPF/RA e status
  ativo/inativo; usuário do sistema tem só nome/email/senha/tipo).
- **Status "Atrasado"** é recalculado dinamicamente a cada leitura (sem exigir um job
  agendado): se um empréstimo está "Em aberto" e a data prevista já passou, ele passa a
  ser "Atrasado" automaticamente ao listar.
- Senha padrão de leitores cadastrados sem senha explícita = o próprio CPF/RA (fica fácil
  de logar para teste/demo).

  ## 6. Tecnologias e Ferramentas

- **Backend:** Node.js, Express, Sequelize ORM, PostgreSQL, JWT (Json Web Token), Swagger UI.
- **Frontend:** React, Vite, JavaScript (ES6+), Context API / Axios.# Biblioteca-projeto
