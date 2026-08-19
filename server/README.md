# Torrinco Backend API

Bem-vindo à documentação do backend do projeto **Torrinco**. Esta é uma API RESTful desenvolvida com **Node.js**, **Express**, **TypeScript** e **Prisma ORM**, seguindo a arquitetura **MVC** (Model-View-Controller).

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework web para construção da API.
- **TypeScript**: Superset JavaScript com tipagem estática.
- **Prisma ORM**: Manipulação de banco de dados e migrações.
- **JWT (JSON Web Tokens)**: Autenticação segura.
- **Bcrypt**: Hashing de senhas.
- **Evolution API**: Integração com WhatsApp.

## 🛠️ Configuração e Instalação

### Pré-requisitos
- Node.js (v18 ou superior)
- Gerenciador de pacotes (npm ou yarn)
- Banco de dados compatível com Prisma (ex: MariaDB, MySQL, PostgreSQL)

### Passos para Instalação

1. **Instale as dependências**:
   ```bash
   cd server
   npm install
   ```

2. **Configure as Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz da pasta `server/` com base em `.env.example`:
   ```env
   DATABASE_URL="mysql://usuario:senha@localhost:3306/torrinco"
   JWT_SECRET="sua_chave_secreta_jwt"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   NODE_ENV="development"
   ALLOWED_ORIGINS="http://localhost:5173,http://127.0.0.1:5173,https://torrinco.forjacorp.com"
   
   # Evolution API (opcional)
   EVOLUTION_API_URL="https://your-evolution-api.com/"
   EVOLUTION_API_KEY="your_api_key"
   EVOLUTION_INSTANCE_NAME="your_instance_name"
   ```

3. **Execute as Migrações do Banco de Dados**:
   ```bash
   npx prisma migrate dev
   ```

4. **Inicie o Servidor de Desenvolvimento**:
   ```bash
   npm run dev
   ```
   O servidor estará rodando em `http://localhost:3001`.

## 📂 Estrutura do Projeto (MVC)

O projeto segue o padrão MVC, separando responsabilidades:

- **`src/controllers/`**: Contém a lógica de negócio e manipulação das requisições.
- **`src/routes/`**: Define os endpoints da API e mapeia para os controllers.
- **`src/middleware/`**: Interceptadores para autenticação (JWT), tratamento de erros, etc.
- **`src/lib/`**: Configurações de bibliotecas (ex: instância do Prisma Client).
- **`prisma/`**: Esquema do banco de dados e migrações.

## 📚 Documentação da API

Todas as rotas (exceto as indicadas como públicas) são protegidas e requerem um token Bearer no header `Authorization`.

### 🔐 Autenticação (`/api/auth`)

| Método | Endpoint | Protegido | Descrição |
|--------|----------|-----------|-----------|
| POST | `/login` | ❌ | Realiza login e retorna token JWT |
| POST | `/create-password` | ❌ | Define senha no primeiro acesso |
| POST | `/request-password-reset` | ❌ | Solicita recuperação de senha |
| POST | `/reset-password` | ❌ | Redefine senha com token |
| GET | `/me` | ✅ | Retorna dados do usuário logado |
| POST | `/change-password` | ✅ | Altera a senha do usuário logado |
| POST | `/create-user` | ✅ Admin | Cria novo usuário |
| GET | `/users` | ✅ Admin | Lista usuários da conta |
| PUT | `/users/:id` | ✅ Admin | Atualiza usuário |
| DELETE | `/users/:id` | ✅ Admin | Remove usuário |

### 💰 Finanças (`/api/finance`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/summary` | Resumo financeiro (saldo, receitas, despesas) |
| GET | `/forecast` | Previsão financeira futura |
| POST | `/transactions` | Cria nova transação |
| GET | `/transactions` | Lista transações (com filtros) |
| GET | `/transactions/:id` | Detalhes de uma transação |
| PUT | `/transactions/:id` | Atualiza uma transação |
| DELETE | `/transactions/:id` | Remove (soft delete) uma transação |
| GET | `/cards/:cardId/bill` | Fatura atual do cartão |
| GET | `/cards/:cardId/next-bill` | Próxima fatura do cartão |

### 💳 Cartões (`/api/cards`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Lista todos os cartões |
| GET | `/:id/bills` | Histórico de faturas de um cartão |
| GET | `/:id/bills/:billId` | Detalhe, pagamentos e saldo restante da fatura |
| POST | `/:id/bills/:billId/pay` | Registra pagamento total ou parcial |
| POST | `/:id/bills/:billId/undo` | Desfaz o pagamento ativo mais recente |
| POST | `/` | Cria novo cartão |
| PUT | `/:id` | Atualiza cartão |
| DELETE | `/:id` | Remove cartão |

### 📦 Parcelas (`/api/installments`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Lista todas as parcelas |
| GET | `/:id` | Detalhes de uma parcela |
| POST | `/` | Cria nova parcela |
| PUT | `/:id/status` | Atualiza status da parcela |
| DELETE | `/:id` | Cancela parcela |

### 💵 Fontes de Renda (`/api/income_sources`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Lista fontes de renda |
| POST | `/` | Cria nova fonte de renda |
| PUT | `/:id` | Atualiza fonte de renda |
| DELETE | `/:id` | Remove fonte de renda |

### 🏦 Entidades Financeiras (`/api/entities`)

Gerencia contas bancárias e cartões de crédito.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/` | Cria nova entidade |
| GET | `/` | Lista todas as entidades |
| GET | `/:id` | Detalhes de uma entidade |
| PUT | `/:id` | Atualiza entidade |
| DELETE | `/:id` | Remove entidade |

### 📊 Orçamentos (`/api/budgets`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/` | Cria ou atualiza orçamento (Upsert) |
| GET | `/` | Lista orçamentos definidos |
| DELETE | `/:id` | Remove um orçamento |

### 🔄 Recorrência (`/api/recurring`)

Transações que se repetem (ex: assinaturas, aluguel).

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/` | Cria transação recorrente |
| GET | `/` | Lista transações recorrentes |
| GET | `/due` | Lista próximas recorrências a vencer |
| POST | `/:id/generate` | Gera transação real a partir da recorrência |
| PUT | `/:id` | Atualiza recorrência |
| DELETE | `/:id` | Cancela recorrência |

### 📅 Calendário (`/api/calendar`)

Eventos e compromissos.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/` | Cria evento |
| GET | `/` | Lista eventos (filtro por data) |
| GET | `/:id` | Detalhes de um evento |
| PUT | `/:id` | Atualiza evento |
| DELETE | `/:id` | Remove evento |

### ⏰ Lembretes (`/api/reminders`)

Notificações e lembretes personalizados.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/` | Cria lembrete |
| GET | `/` | Lista lembretes |
| GET | `/due` | Lembretes vencidos/atuais |
| GET | `/:id` | Detalhes de um lembrete |
| PUT | `/:id` | Atualiza lembrete |
| DELETE | `/:id` | Marca como concluído |
| POST | `/logs` | Cria log de disparo |
| GET | `/logs` | Histórico de disparos |

### 📂 Categorias (`/api/categories`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Lista categorias |
| POST | `/` | Cria nova categoria |
| PUT | `/:id` | Atualiza categoria |
| DELETE | `/:id` | Remove categoria |

### 📤 Exportação (`/api/export`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/excel` | Exporta dados para Excel (download) |
| POST | `/whatsapp` | Envia relatório via WhatsApp |

## 🚢 Deployment com Docker

### Build da Imagem

```bash
cd server
docker build -t torrinco-api .
```

### Executar Localmente

```bash
docker run -p 3001:3001 --env-file .env torrinco-api
```

### Variáveis de Ambiente para Produção

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `DATABASE_URL` | URL de conexão do banco de dados | ✅ |
| `DATABASE_USER` | Usuário do banco | ✅ |
| `DATABASE_PASSWORD` | Senha do banco | ✅ |
| `DATABASE_NAME` | Nome do banco | ✅ |
| `DATABASE_HOST` | Host do banco | ✅ |
| `DATABASE_PORT` | Porta do banco | ✅ |
| `JWT_SECRET` | Chave secreta para tokens JWT | ✅ |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | ❌ (padrão: 7d) |
| `PORT` | Porta do servidor | ❌ (padrão: 3001) |
| `ALLOWED_ORIGINS` | Origins permitidos no CORS (separados por vírgula) | ❌ |
| `EVOLUTION_API_URL` | URL da Evolution API | ❌ |
| `EVOLUTION_API_KEY` | API Key da Evolution API | ❌ |
| `EVOLUTION_INSTANCE_NAME` | Nome da instância da Evolution API | ❌ |

### Health Check

O servidor disponibiliza um endpoint de health check em `GET /health` que verifica a conexão com o banco de dados.

## 🧪 Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento com hot-reload.
- `npm run build`: Compila o projeto TypeScript para JavaScript.
- `npm start`: Inicia o servidor compilado (produção).
- `npx prisma migrate dev`: Cria e aplica novas migrações.
- `npx prisma generate`: Gera o Prisma Client.
- `npx prisma db push`: Sincroniza o schema com o banco de dados.

## 📝 Notas de Desenvolvimento

- **Padronização**: Todos os controllers retornam erros padronizados via middleware `errorHandler`.
- **Segurança**: Senhas são sempre armazenadas como hash (bcrypt).
- **Datas**: O sistema utiliza datas UTC para consistência.
- **Soft Delete**: Transações deletadas são marcadas com `deleted_at` ao invés de serem removidas do banco.
- **Recorrência**: Transações recorrentes criam uma relação direta via `recurring_transaction_id` na tabela `transactions`.
- **Inteligência de Faturas**: pagamentos são conciliados por vínculo explícito com a fatura, aceitam valores parciais e nunca são inferidos por descrição.
- **Estados de Fatura**: `open`, `closed`, `overdue`, `partially_paid` e `paid`; a virada do ciclo nunca implica pagamento automático.
- **Lembrete de Vencimento**: cada cartão pode aderir à pergunta automática por WhatsApp em uma hora cheia configurável; a fila garante uma única ocorrência por fatura.
- **Estorno de Pagamento**: desfaz o pagamento vinculado mais recente, preserva auditoria e recalcula o saldo e o estado da fatura.
- **Contrato detalhado**: consulte [`../docs/card-billing-api.md`](../docs/card-billing-api.md).
