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
- JWT (Autenticação com Access/Refresh Tokens)
- Rate Limiting (Segurança de API)
- Evolution API (WhatsApp)
- XLSX (Exportação)

### Banco de Dados
- MySQL/MariaDB

## Estrutura do Projeto

```
torrinco/
├── client/          Frontend React (Vite)
├── server/          Backend API (Node/Express)
└── docs/            Documentação de Integrações (n8n/AI)
```

## Funcionalidades

- Dashboard financeiro com métricas em tempo real e extrato detalhado de saldo acumulado
- Gerenciamento de transações (receitas/despesas) com filtros por tipo de pagamento
- Controle inteligente de cartões de crédito, faturas e pagamentos (com opção de desfazer)
- Sistema de parcelamento de compras automático e projeção de recorrências no crédito
- Previsão financeira detalhada para o mês atual e próximo mês
- Fontes de renda personalizáveis e categorização dinâmica
- Orçamentos e metas financeiras por categoria
- Calendário interativo de pagamentos e compromissos
- Lembretes automáticos integrados
- Relatórios e exportação (Excel/WhatsApp)
- Autenticação JWT segura com renovação automática (Access Token 1h / Refresh Token 7d)
- Proteção de API contra ataques de força bruta (Rate Limiting)
- Integração com Evolution API para automação via WhatsApp
- PWA (Progressive Web App) 100% responsivo para mobile e desktop
- Temas Claro e Escuro (Dark Mode) adaptativo
- Central de Importação com conferência, conciliação e criação atômica de lançamentos
- Backoffice da plataforma com contas, testadores, suspensão de acesso e auditoria

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

3. Em desenvolvimento local, execute as migrações e gere o client Prisma:
```bash
cd server
npx prisma migrate dev
npx prisma generate
```

Em produção, use `npm run test:schema`/`prisma migrate deploy`; não use `prisma migrate dev`. As migrations de datas civis, precisão técnica e separação de acesso administrativo exigem backup restaurável e os checklists em `docs/MISSION_05_TRANSACTION_CIVIL_DATES.md`, `docs/MISSION_06_TIMESTAMP_PRECISION.md` e `docs/platform-backoffice.md`.

### Variáveis de Ambiente

Para desenvolvimento local, copie `server/.env.example` para `server/.env` e `client/.env.example` para `client/.env`. Esses arquivos são as listas oficiais de variáveis; não concentre segredos em um `.env` na raiz.

## Deploy

O projeto está configurado para ser executado em ambiente de produção com suporte a HTTPS e cabeçalhos de segurança CORS. Certifique-se de que as variáveis `ALLOWED_ORIGINS` e `VITE_API_URL` apontem para os domínios corretos.

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
   DATABASE_URL=
   DATABASE_USER=usuario
   DATABASE_PASSWORD=senha
   DATABASE_NAME=
   DATABASE_HOST=
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

Documentos operacionais principais:

- [Central de Importação](./docs/import-center.md)
- [Backoffice da plataforma](./docs/platform-backoffice.md)
- [Contrato temporal](./docs/TEMPORAL_CONTRACT.md)
- [Contrato dos componentes de formulário](./docs/ui-component-contract.md)

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
