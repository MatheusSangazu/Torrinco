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

- Dashboard financeiro com métricas em tempo real
- Gerenciamento de transações (receitas/despesas)
- Controle de cartões de crédito e faturas
- Sistema de parcelamento de compras
- Fontes de renda personalizáveis
- Categorização de transações
- Orçamentos e metas financeiras
- Calendário de pagamentos e compromissos
- Lembretes automáticos
- Relatórios e exportação (Excel/WhatsApp)
- Autenticação JWT com controle de acesso
- Integração com Evolution API para WhatsApp
- PWA (Progressive Web App)

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

**Server (.env)**:
```env
PORT=3001
DATABASE_URL="mysql://user:password@host:3306/finance_bot"
JWT_SECRET=your-secret-key
EVOLUTION_API_URL=https://your-evolution-api-url
EVOLUTION_API_KEY=your-api-key
EVOLUTION_INSTANCE_NAME=your-instance
ALLOWED_ORIGINS=https://torrinco.forjacorp.com
```

**Client (.env)**:
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
