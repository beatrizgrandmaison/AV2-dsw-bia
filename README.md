# Sistema de Acompanhamento de Chamados Técnicos (HelpDesk)

Aplicação web full stack para gerenciamento de chamados técnicos, permitindo cadastro, acompanhamento, resolução e encerramento de solicitações com controle de acesso por usuário.

## Tecnologias utilizadas

- **Backend:** Node.js, Express (arquitetura MVC), JWT (`jsonwebtoken`) e hash de senhas (`bcryptjs`).
- **ORM e banco:** Prisma ORM (`prisma` e `@prisma/client` fixados em `7.10.0`) e PostgreSQL.
- **Frontend:** React 19, Vite, React Router DOM e Tailwind CSS 4.3.0 (`tailwindcss` e `@tailwindcss/vite` fixados em `4.3.0`).
- **Interface:** componentes próprios inspirados nos padrões de cartões, formulários e modais do Tailwind CSS.

## Regras de negócio e segurança

1. **Encerramento condicionado:** um chamado só pode ser alterado para `ENCERRADO` se o campo `solucao` tiver pelo menos 10 caracteres. Caso contrário, a API retorna HTTP `422`.
2. **Bloqueio pós-encerramento:** chamados encerrados não podem mais ser editados; a API retorna HTTP `422`.
3. **Controle de acesso:** todas as rotas de `/api/tickets` exigem um token JWT válido (`401`). Cada usuário visualiza, edita e exclui apenas os próprios chamados; tentativas de acesso a chamados de terceiros retornam `403`.

## Como executar localmente

O backend está na raiz do repositório e o frontend está na pasta `frontend`.

### 1. Configurar o backend

Na raiz do repositório:

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo e configure as credenciais do PostgreSQL e o segredo JWT:

```bash
cp .env.example .env
```

No PowerShell, use `Copy-Item .env.example .env` no lugar de `cp` se necessário.

#### Opção 2: usar PostgreSQL no Neon

1. Acesse [neon.tech](https://neon.tech/), crie um projeto e use **Connect** para copiar a connection string PostgreSQL.
2. No `.env` da raiz, substitua `COLE_SUA_URL_DO_NEON_AQUI` em `DATABASE_URL` pela URL real, mantendo as aspas. Não compartilhe nem faça commit desse arquivo; ele contém credenciais.
3. Depois de salvar o `.env`, siga os comandos de geração, migração e inicialização abaixo.

Antes de iniciar o servidor, gere o cliente Prisma e aplique as migrações:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

Inicie o backend:

```bash
npm run dev
```

O servidor usa a porta `3000` por padrão. O endpoint de verificação é `http://localhost:3000/api/health`.

### 2. Configurar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite inicia o frontend, normalmente em `http://localhost:5173`. A URL da API é configurada em `frontend/.env` pela variável `VITE_API_URL`.

## Scripts disponíveis

### Backend (raiz)

- `npm run dev` — inicia o servidor em modo de observação.
- `npm start` — inicia o servidor.
- `npm run prisma:generate` — gera o cliente Prisma.
- `npm run prisma:migrate` — executa migrações de desenvolvimento.

### Frontend (`frontend`)

- `npm run dev` — inicia o servidor de desenvolvimento Vite.
- `npm run build` — gera a versão de produção.
- `npm run preview` — pré-visualiza a versão de produção.
