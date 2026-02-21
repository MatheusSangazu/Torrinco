# Torrinco Client

Frontend React do sistema de gestão financeira Torrinco.

## Tecnologias

- React 19.2
- Vite 7.3
- TypeScript 5.9
- TailwindCSS 4.1
- React Router DOM 7.13
- Recharts 3.7
- React Day Picker 9.13
- Lucide React 0.564
- Axios 1.13.5
- React Hot Toast 2.6

## Estrutura do Projeto

```
src/
├── components/          Componentes reutilizáveis
│   ├── CategorySelect.tsx
│   ├── CreditCardCarousel.tsx
│   ├── CustomSelect.tsx
│   ├── DatePicker.tsx
│   └── Input.tsx
├── context/             Contextos globais
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/               Custom hooks
│   └── useClickOutside.ts
├── layouts/             Layouts da aplicação
│   ├── AppLayout.tsx
│   └── AuthLayout.tsx
├── pages/               Páginas/rotas
│   ├── Calendar.tsx
│   ├── Cards.tsx
│   ├── Categories.tsx
│   ├── Dashboard.tsx
│   ├── FirstAccess.tsx
│   ├── ForgotPassword.tsx
│   ├── IncomeSources.tsx
│   ├── Login.tsx
│   ├── Reports.tsx
│   └── Transactions.tsx
├── services/            Serviços de API
│   ├── api.ts
│   ├── cards.service.ts
│   └── installments.service.ts
├── App.tsx
└── main.tsx
```

## Instalação

```bash
npm install
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001
```

Para produção:

```env
VITE_API_URL=https://apiTorrinco.forjacorp.com
```

## Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build de produção
npm run lint         # Executa ESLint
```

## Desenvolvimento

O servidor de desenvolvimento roda em `http://localhost:5173` por padrão.

## Build de Produção

```bash
npm run build
```

O build será gerado na pasta `dist/`.

## Deploy com Docker

O projeto inclui Dockerfile configurado para deploy com Coolify:

```bash
docker build -t torrinco-client .
```

### Variáveis de Ambiente no Docker

No Coolify, configure a variável de ambiente:
- `VITE_API_URL`: URL da API de produção

### Nginx Configuration

O build usa Nginx para servir os arquivos estáticos. A configuração está em `nginx.conf`.

## Funcionalidades

- **Dashboard**: Visão geral com métricas financeiras
- **Transações**: Listagem e gerenciamento de receitas/despesas
- **Cartões**: Controle de cartões de crédito e faturas
- **Categorias**: Gerenciamento de categorias personalizadas
- **Fontes de Renda**: Cadastro de fontes de receita
- **Calendário**: Visualização de eventos e compromissos financeiros
- **Relatórios**: Exportação de dados em diferentes formatos
- **Autenticação**: Login, registro e recuperação de senha

## PWA (Progressive Web App)

O projeto é configurado como PWA com `vite-plugin-pwa`:
- Ícones de aplicativo (192x192 e 512x512)
- Manifesto web
- Service Worker para cache offline

## Estilização

O projeto usa TailwindCSS 4.1 com configuração personalizada em `tailwind.config.js`.

## Integração com API

A comunicação com a API é feita via Axios através do serviço `api.ts`. O baseURL é configurado dinamicamente pela variável `VITE_API_URL`.

## Autenticação

O gerenciamento de autenticação é feito via `AuthContext.tsx` usando tokens JWT armazenados no localStorage.

## Roteamento

As rotas são gerenciadas pelo React Router DOM v7:

- `/` - Dashboard (requer autenticação)
- `/login` - Login
- `/forgot-password` - Recuperação de senha
- `/transactions` - Transações
- `/cards` - Cartões de crédito
- `/categories` - Categorias
- `/income-sources` - Fontes de renda
- `/calendar` - Calendário
- `/reports` - Relatórios

## Acessibilidade

O projeto segue as melhores práticas de acessibilidade com:
- Navegação por teclado
- Contraste adequado
- Labels em formulários
- Atributos ARIA onde necessário
