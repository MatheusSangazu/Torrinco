# Torrinco - Sistema de Gestão Financeira

Sistema completo de gestão financeira pessoal e empresarial com dashboard, controle de transações, cartões de crédito, faturas, relatórios e integração com WhatsApp.

## Tecnologias

### Frontend
- React 19.2
- Vite 7.3
- TypeScript 5.9
- TailwindCSS 4.1
- React Router DOM 7.13
- Recharts (gráficos)
- React Day Picker (calendário)
- Lucide React (ícones)

### Backend
- Node.js 20
- Express 5.2
- TypeScript 5.9
- Prisma 7.4 (ORM)
- JWT (autenticação)
- Evolution API (WhatsApp)
- XLSX (exportação)

### Banco de Dados
- MySQL/MariaDB

## Estrutura do Projeto

```
torrinco/
├── client/          Frontend React
├── server/          Backend API
└── package.json     Scripts raiz
```

## Funcionalidades

- Dashboard financeiro com métricas em tempo real e extrato detalhado de saldo
- Gerenciamento de transações (receitas/despesas) com filtros por tipo de pagamento
- Controle inteligente de cartões de crédito, faturas e pagamentos (com opção de desfazer)
- Sistema de parcelamento de compras automático
- Previsão financeira detalhada para o próximo mês
- Fontes de renda personalizáveis e categorização dinâmica
- Orçamentos e metas financeiras por categoria
- Calendário interativo de pagamentos e compromissos
- Lembretes automáticos integrados
- Relatórios e exportação (Excel/WhatsApp)
- Autenticação JWT com controle de acesso por níveis
- Integração com Evolution API para automação via WhatsApp
- PWA (Progressive Web App) 100% responsivo para mobile

## Instalação

### Pré-requisitos
- Node.js 20+
- MySQL/MariaDB
- npm ou yarn

### Configuração do Banco de Dados

1. Crie um banco de dados MySQL:
```sql
CREATE DATABASE finance_bot;
```

2. Configure as variáveis de ambiente (ver seção de variáveis abaixo)

3. Execute as migrações do Prisma:
```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### Variáveis de Ambiente

Para desenvolvimento local, use o arquivo `.env` na raiz do projeto com todas as variáveis de server e client.

**Server**:
```env
PORT=3001
DATABASE_URL="mysql://user:password@host:3306/finance_bot"
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=finance_bot
DATABASE_HOST=host
DATABASE_PORT=3306
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
EVOLUTION_API_URL=https://your-evolution-api-url
EVOLUTION_API_KEY=your-api-key
EVOLUTION_INSTANCE_NAME=your-instance
ALLOWED_ORIGINS=https://torrinco.forjacorp.com
```

**Client**:
```env
VITE_API_URL=https://apiTorrinco.forjacorp.com
```

## Desenvolvimento

### Iniciar Servidor (Backend)
```bash
cd server
npm install
npm run dev
```

O servidor rodará em `http://localhost:3001`

### Iniciar Cliente (Frontend)
```bash
cd client
npm install
npm run dev
```

O frontend rodará em `http://localhost:5173`

## Produção

### Deploy com Docker e Coolify

O projeto está configurado para deploy via Coolify com Docker nos domínios:
- Frontend: `https://torrinco.forjacorp.com`
- Backend: `https://apiTorrinco.forjacorp.com`

#### Docker Compose (Desenvolvimento Local)

Para rodar tudo com Docker Compose:
```bash
# Configure o arquivo .env na raiz
docker-compose up -d
```

O docker-compose iniciará:
- Server em http://localhost:3001
- Client em http://localhost:3000

#### Build e Deploy do Backend
```bash
cd server
docker build -t torrinco-api .
```

#### Build e Deploy do Frontend
```bash
cd client
docker build -t torrinco-client .
```

#### Configuração no Coolify

**Opção 1: Docker Compose (Recomendado - Uma Aplicação)**

1. No Coolify, crie uma nova aplicação
2. Build Pack: `Docker Compose`
3. Docker Compose Path: `docker-compose.coolify.yml`
4. Domínio: `torrinco.forjacorp.com`
5. Variáveis de Ambiente:
   ```
   DATABASE_URL=mysql://usuario:senha@mysql.forjacorp.com:3306/finance_bot
   DATABASE_USER=usuario
   DATABASE_PASSWORD=senha
   DATABASE_NAME=finance_bot
   DATABASE_HOST=mysql.forjacorp.com
   DATABASE_PORT=3306
   JWT_SECRET=sua_chave_secreta_aqui
   JWT_EXPIRES_IN=7d
   EVOLUTION_API_URL=https://seu-evolution-api.com/
   EVOLUTION_API_KEY=sua_api_key_aqui
   EVOLUTION_INSTANCE_NAME=nome_da_instancia
   ALLOWED_ORIGINS=https://torrinco.forjacorp.com
   VITE_API_URL=https://apitorrinco.forjacorp.com/api
   PORT=3001
   ```

**Nota**: O Coolify cria domínios separados automaticamente:
- `apitorrinco.forjacorp.com` - Server (API)
- `torrinco.forjacorp.com` - Client (Frontend)

O `VITE_API_URL` deve apontar para o domínio do server (`apitorrinco.forjacorp.com`).

**Opção 2: Duas Aplicações Separadas (Domínios Separados)**

**Aplicação 1 - Server (apiTorrinco.forjacorp.com)**

1. No Coolify, crie uma nova aplicação
2. Build Pack: `Dockerfile`
3. Dockerfile Path: `server/Dockerfile`
4. Port: `3001`
5. Domínio: `apiTorrinco.forjacorp.com`
6. Variáveis de Ambiente:
   ```
   DATABASE_URL=mysql://usuario:senha@mysql.forjacorp.com:3306/finance_bot
   DATABASE_USER=usuario
   DATABASE_PASSWORD=senha
   DATABASE_NAME=finance_bot
   DATABASE_HOST=mysql.forjacorp.com
   DATABASE_PORT=3306
   JWT_SECRET=sua_chave_secreta_aqui
   JWT_EXPIRES_IN=7d
   EVOLUTION_API_URL=https://seu-evolution-api.com/
   EVOLUTION_API_KEY=sua_api_key_aqui
   EVOLUTION_INSTANCE_NAME=nome_da_instancia
   ALLOWED_ORIGINS=https://torrinco.forjacorp.com
   PORT=3001
   ```

**Aplicação 2 - Client (torrinco.forjacorp.com)**

1. No Coolify, crie uma nova aplicação
2. Build Pack: `Dockerfile`
3. Dockerfile Path: `client/Dockerfile`
4. Port: `80`
5. Domínio: `torrinco.forjacorp.com`
6. Variáveis de Ambiente:
   ```
   VITE_API_URL=https://apiTorrinco.forjacorp.com
   ```

### Scripts NPM (Raiz)

```bash
npm install          # Instala dependências de ambos os projetos
npm run dev          # Inicia ambos em modo desenvolvimento
npm run build        # Build de ambos os projetos
npm run start        # Inicia ambos em modo produção
```

## API Documentation

Para documentação completa da API, consulte [server/README.md](./server/README.md)

## Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Recuperar senha

### Transações
- `GET /api/transactions` - Listar transações
- `POST /api/transactions` - Criar transação
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Deletar transação

### Cartões de Crédito
- `GET /api/finance/cards` - Listar cartões
- `GET /api/finance/cards/:cardId/bill` - Fatura atual
- `GET /api/finance/cards/:cardId/next-bill` - Próxima fatura

### Exportação
- `GET /api/export/excel` - Exportar para Excel
- `POST /api/export/whatsapp` - Enviar relatório via WhatsApp

## Health Checks

- Backend: `GET /health` - Verifica status do servidor e conexão com banco de dados

## Licença

MIT

## Autor

Matheus
