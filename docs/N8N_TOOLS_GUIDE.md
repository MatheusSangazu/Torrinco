# N8N Tools Guide - Padrão Subworkflow

Guia para implementar tools do agente n8n usando **subworkflows** (padrão atual do Assistente Pessoal).

## Estrutura do Workflow Atual

```
Assistente Pessoal (Workflow Principal)
├── Webhook (Evolution API)
├── Input Type (Switch: text/voice/image/document)
├── SplitNumero (extrair telefone)
├── Porteiro (MySQL: busca usuário)
├── Redis (buffer de mensagens)
├── AI Agent
│   ├── Tool - Registrar Transacao (Subworkflow)
│   ├── Tool - Consultar Transacoes (Subworkflow)
│   └── Outras tools...
├── Enviar texto (Evolution API)
└── Redis (limpar buffer)
```

## Padrão de Subworkflow como Tool

### Estrutura Básica de um Subworkflow Tool:

```json
{
  "nodes": [
    {
      "name": "Webhook (Trigger)",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "tool-nome-da-tool",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Validar Input",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Validação dos parâmetros\nconst { telefone, valor, tipo, categoria, descricao, status } = $input.json();\n\nif (!valor || isNaN(valor)) {\n  throw new Error('Valor inválido');\n}\n\nif (!['expense', 'income'].includes(tipo)) {\n  throw new Error('Tipo deve ser expense ou income');\n}\n\nreturn [{ json: { telefone, valor, tipo, categoria, descricao, status } }];"
      }
    },
    {
      "name": "Buscar JWT",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "https://apitorrinco.forjacorp.com/api/auth/login",
        "body": {
          "type": "json",
          "json": "{ \"phone_number\": \"={{ $json.telefone }}\", \"password\": \"SENHA_DO_USUARIO\" }"
        }
      }
    },
    {
      "name": "HTTP Request API",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "https://apitorrinco.forjacorp.com/api/finance/transactions",
        "authentication": "predefinedCredentialType",
        "sendBody": true,
        "body": {
          "type": "json",
          "json": "{\n  \"description\": \"={{ $json.descricao }}\",\n  \"amount\": \"={{ $json.valor }}\",\n  \"type\": \"={{ $json.tipo }}\",\n  \"category_id\": \"={{ $json.category_id }}\",\n  \"transaction_date\": \"={{ $json.data_transacao || new Date().toISOString().split('T')[0] }}\",\n  \"status\": \"={{ $json.status || 'paid' }}\"\n}"
        }
      }
    },
    {
      "name": "Formatar Resposta",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const response = $input.json();\n\nif (response.success) {\n  return [{\n    json: {\n      success: true,\n      message: 'Transação registrada com sucesso',\n      transaction: response.transaction\n    }\n  }];\n} else {\n  return [{\n    json: {\n      success: false,\n      error: response.error || 'Erro ao registrar transação'\n    }\n  }];\n}"
      }
    }
  ]
}
```

---

## Tool 1: Registrar Transação (Subworkflow)

### Workflow: "Tool - Registrar Transacao API"

#### 1. Webhook Trigger
```json
{
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "tool-registrar-transacao-api",
    "httpMethod": "POST",
    "responseMode": "lastNode",
    "options": {}
  }
}
```

#### 2. Validar Input (Code Node)
```javascript
// Code Node: Validar Input
const { telefone, valor, tipo, categoria, descricao, data_transacao, status } = $input.json();

// Validações
if (!valor || isNaN(valor) || valor <= 0) {
  throw new Error('Valor inválido. Deve ser um número positivo.');
}

if (!['expense', 'income'].includes(tipo)) {
  throw new Error('Tipo deve ser "expense" ou "income".');
}

if (!descricao || descricao.trim() === '') {
  throw new Error('Descrição é obrigatória.');
}

// Mapeamento de categorias
const categoriasMap = {
  'alimentação': 1,
  'alimentacao': 1,
  'transporte': 2,
  'moradia': 3,
  'lazer': 4,
  'saúde': 5,
  'saude': 5,
  'educação': 6,
  'educacao': 6,
  'outros': 7
};

const category_id = categoriasMap[categoria.toLowerCase()] || 7;

return [{
  json: {
    telefone,
    valor: parseFloat(valor),
    tipo,
    category_id,
    descricao: descricao.trim(),
    data_transacao: data_transacao || new Date().toISOString().split('T')[0],
    status: status || (data_transacao ? 'pending' : 'paid')
  }
}];
```

#### 3. Buscar Usuário (MySQL)
```json
{
  "name": "Buscar Usuário",
  "type": "n8n-nodes-base.mySql",
  "parameters": {
    "operation": "executeQuery",
    "query": "SELECT id FROM users WHERE phone_number = '{{ $json.telefone }}' LIMIT 1",
    "options": {}
  }
}
```

#### 4. Login na API (HTTP Request)
```json
{
  "name": "Login API",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://apitorrinco.forjacorp.com/api/auth/login",
    "sendBody": true,
    "contentType": "application/json",
    "body": {
      "type": "json",
      "json": "={{ JSON.stringify({ phone_number: $json.telefone, password: 'SENHA_DO_USUARIO' }) }}"
    },
    "options": {}
  }
}
```

#### 5. Criar Transação (HTTP Request)
```json
{
  "name": "Criar Transação",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://apitorrinco.forjacorp.com/api/finance/transactions",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Authorization",
          "value": "Bearer {{ $json.token }}"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ]
    },
    "sendBody": true,
    "contentType": "application/json",
    "body": {
      "type": "json",
      "json": "={{ JSON.stringify({\n  description: $json.descricao,\n  amount: $json.valor,\n  type: $json.tipo,\n  category_id: $json.category_id,\n  transaction_date: $json.data_transacao,\n  status: $json.status\n}) }}"
    },
    "options": {}
  }
}
```

#### 6. Format Response (Code Node)
```javascript
// Code Node: Format Response
const response = $input.json();

if (response.success) {
  return [{
    json: {
      success: true,
      message: `✅ ${response.transaction.description} registrada: R$ ${response.transaction.amount.toFixed(2)}`,
      transaction_id: response.transaction.id,
      data: response.transaction
    }
  }];
} else {
  return [{
    json: {
      success: false,
      error: response.message || 'Erro ao registrar transação',
      details: response
    }
  }];
}
```

### Configuração no AI Agent

No nó **AI Agent**, adicione a tool:

```json
{
  "toolDescription": "Registra movimentações financeiras passadas (pagas) ou futuras (agendamentos). REGRAS OBRIGATÓRIAS:\n1. No campo 'tipo', use APENAS 'expense' (para gastos/saídas) ou 'income' (para ganhos/entradas). JAMAIS envie 'despesa', 'gasto' ou português.\n2. Identifique o contexto temporal: Se já aconteceu, define status='paid'. Se é um boleto ou previsão futura, defina status='pending'.\n3. Se for futuro, extraia a data de vencimento exata para o campo 'data_transacao'.",
  "workflowId": "ID_DO_SUBWORKFLOW",
  "workflowInputs": {
    "mappingMode": "defineBelow",
    "value": {
      "telefone": "={{ $('SplitNumero').item.json.resposta }}",
      "valor": "={{ $fromAI('valor', `O valor numérico da transação (ex: 50.00).`, 'number') }}",
      "tipo": "={{ $fromAI('tipo', `OBRIGATÓRIO: Apenas 'expense' ou 'income'.`, 'string') }}",
      "categoria": "={{ $fromAI('categoria', `Categoria do gasto (Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Outros).`, 'string') }}",
      "descricao": "={{ $fromAI('descricao', `Descrição breve do que é.`, 'string') }}",
      "data_transacao": "={{ $fromAI('data_transacao', `Data do vencimento ou pagamento (YYYY-MM-DD). Opcional para pagamentos hoje.`, 'string') }}",
      "status": "={{ $fromAI('status', `'paid' para pago/hoje, 'pending' para futuro/agendado.`, 'string') }}"
    }
  }
}
```

---

## Tool 2: Consultar Transações (Subworkflow)

### Workflow: "Tool - Consultar Transacoes"

#### 1. Webhook Trigger
```json
{
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "tool-consultar-transacoes",
    "httpMethod": "POST",
    "responseMode": "lastNode",
    "options": {}
  }
}
```

#### 2. Validar Input (Code Node)
```javascript
// Code Node: Validar Input
const { telefone, tipo, categoria, dias, periodo } = $input.json();

// Data atual
const now = new Date();
let start_date, end_date;

// Calcular período baseado no input
if (periodo === 'hoje') {
  start_date = now.toISOString().split('T')[0];
  end_date = start_date;
} else if (periodo === 'esta_semana') {
  const firstDay = new Date(now);
  firstDay.setDate(now.getDate() - now.getDay() + 1);
  start_date = firstDay.toISOString().split('T')[0];
  end_date = now.toISOString().split('T')[0];
} else if (periodo === 'este_mes') {
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  start_date = firstDay.toISOString().split('T')[0];
  end_date = now.toISOString().split('T')[0];
} else if (dias) {
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - parseInt(dias));
  start_date = pastDate.toISOString().split('T')[0];
  end_date = now.toISOString().split('T')[0];
} else {
  // Padrão: últimos 30 dias
  const pastDate = new Date(now);
  pastDate.setDate(now.getDate() - 30);
  start_date = pastDate.toISOString().split('T')[0];
  end_date = now.toISOString().split('T')[0];
}

// Mapeamento de categorias
const categoriasMap = {
  'alimentação': 1,
  'alimentacao': 1,
  'transporte': 2,
  'moradia': 3,
  'lazer': 4,
  'saúde': 5,
  'saude': 5,
  'educação': 6,
  'educacao': 6,
  'outros': 7
};

const category_id = categoria ? categoriasMap[categoria.toLowerCase()] : null;

return [{
  json: {
    telefone,
    tipo,
    category_id,
    start_date,
    end_date
  }
}];
```

#### 3. Login na API (HTTP Request)
```json
{
  "name": "Login API",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://apitorrinco.forjacorp.com/api/auth/login",
    "sendBody": true,
    "contentType": "application/json",
    "body": {
      "type": "json",
      "json": "={{ JSON.stringify({ phone_number: $json.telefone, password: 'SENHA_DO_USUARIO' }) }}"
    },
    "options": {}
  }
}
```

#### 4. Consultar Transações (HTTP Request)
```json
{
  "name": "Consultar Transações",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "GET",
    "url": "https://apitorrinco.forjacorp.com/api/finance/transactions",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [
        {
          "name": "start_date",
          "value": "={{ $json.start_date }}"
        },
        {
          "name": "end_date",
          "value": "={{ $json.end_date }}"
        },
        {
          "name": "type",
          "value": "={{ $json.tipo }}"
        },
        {
          "name": "category_id",
          "value": "={{ $json.category_id }}"
        }
      ]
    },
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Authorization",
          "value": "Bearer {{ $json.token }}"
        }
      ]
    },
    "options": {}
  }
}
```

#### 5. Format Response (Code Node)
```javascript
// Code Node: Format Response
const response = $input.json();

if (!response.success || !response.transactions || response.transactions.length === 0) {
  return [{
    json: {
      success: true,
      message: 'Nenhuma transação encontrada no período.',
      transactions: [],
      total: 0
    }
  }];
}

const transactions = response.transactions;
const total = transactions.reduce((acc, t) => acc + t.amount, 0);

// Agrupar por categoria
const byCategory = {};
transactions.forEach(t => {
  const cat = t.category.name;
  if (!byCategory[cat]) {
    byCategory[cat] = { count: 0, total: 0 };
  }
  byCategory[cat].count++;
  byCategory[cat].total += t.amount;
});

// Criar resumo
const categorySummary = Object.entries(byCategory)
  .map(([cat, data]) => `• ${cat}: R$ ${data.total.toFixed(2)} (${data.count})`)
  .join('\n');

return [{
  json: {
    success: true,
    message: `📊 ${transactions.length} transações no período:\nTotal: R$ ${total.toFixed(2)}\n\n${categorySummary}`,
    transactions,
    total,
    byCategory,
    count: transactions.length
  }
}];
```

### Configuração no AI Agent

```json
{
  "toolDescription": "Consulta transações financeiras com filtros por período, tipo (expense/income) e categoria. Usa 'periodo' com valores: 'hoje', 'esta_semana', 'este_mes', ou 'dias' com número de dias.",
  "workflowId": "ID_DO_SUBWORKFLOW",
  "workflowInputs": {
    "mappingMode": "defineBelow",
    "value": {
      "telefone": "={{ $('SplitNumero').item.json.resposta }}",
      "periodo": "={{ $fromAI('periodo', `Período da consulta: 'hoje', 'esta_semana', 'este_mes'. Opcional.`, 'string') }}",
      "dias": "={{ $fromAI('dias', `Número de dias para trás (ex: 7, 30). Opcional.`, 'number') }}",
      "tipo": "={{ $fromAI('tipo', `Tipo: 'expense' para gastos, 'income' para entradas. Opcional.`, 'string') }}",
      "categoria": "={{ $fromAI('categoria', `Categoria específica (Alimentação, Transporte, etc). Opcional.`, 'string') }}"
    }
  }
}
```

---

## Tool 3: Resumo Financeiro (Subworkflow)

### Workflow: "Tool - Resumo Financeiro"

#### 1. Webhook Trigger
```json
{
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "tool-resumo-financeiro",
    "httpMethod": "POST",
    "responseMode": "lastNode",
    "options": {}
  }
}
```

#### 2. Calcular Período (Code Node)
```javascript
// Code Node: Calcular Período
const { telefone, periodo } = $input.json();

const now = new Date();
let start_date, end_date;

if (periodo === 'hoje') {
  start_date = now.toISOString().split('T')[0];
  end_date = start_date;
} else if (periodo === 'esta_semana') {
  const firstDay = new Date(now);
  firstDay.setDate(now.getDate() - now.getDay() + 1);
  start_date = firstDay.toISOString().split('T')[0];
  end_date = now.toISOString().split('T')[0];
} else {
  // Padrão: este mês
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  start_date = firstDay.toISOString().split('T')[0];
  end_date = now.toISOString().split('T')[0];
}

return [{
  json: {
    telefone,
    start_date,
    end_date
  }
}];
```

#### 3-5. Login API + Consultar Resumo (mesma lógica anterior)

#### 6. Format Response (Code Node)
```javascript
// Code Node: Format Response
const response = $input.json();

if (!response.success) {
  return [{
    json: {
      success: false,
      message: 'Não foi possível obter o resumo financeiro.'
    }
  }];
}

const summary = response.summary;
const formatCurrency = (value) => 
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

const categoryBreakdown = summary.by_category
  ? summary.by_category.map(c => `  • ${c.category}: ${formatCurrency(c.total)} (${c.percentage}%)`).join('\n')
  : '';

return [{
  json: {
    success: true,
    message: `💰 Resumo Financeiro\n\n` +
          `Saldo: ${formatCurrency(summary.balance)}\n` +
          `Entradas: ${formatCurrency(summary.income)}\n` +
          `Saídas: ${formatCurrency(summary.expense)}\n` +
          `Transações: ${summary.transactions_count}\n\n` +
          `📈 Por Categoria:\n${categoryBreakdown}`,
    summary
  }
}];
```

### Configuração no AI Agent

```json
{
  "toolDescription": "Obtém resumo financeiro com saldo, entradas, saídas e breakdown por categoria. Usa 'periodo' com valores: 'hoje', 'esta_semana', 'este_mes' (padrão).",
  "workflowId": "ID_DO_SUBWORKFLOW",
  "workflowInputs": {
    "mappingMode": "defineBelow",
    "value": {
      "telefone": "={{ $('SplitNumero').item.json.resposta }}",
      "periodo": "={{ $fromAI('periodo', `Período: 'hoje', 'esta_semana', 'este_mes' (padrão).`, 'string') }}"
    }
  }
}
```

---

## Gerenciamento de Senhas/JWT

### Opção 1: Senha fixa (para testes)
```javascript
// No subworkflow, use uma senha fixa
const password = "SENHA_DO_USUARIO"; // ou use uma variável de ambiente
```

### Opção 2: Buscar senha do MySQL (recomendado)
```javascript
// Code Node: Buscar Senha do Usuário
const telefone = $input.json().telefone;

// Fazer query MySQL para buscar a senha do usuário
// (você precisa ter a senha armazenada ou usar outro método de autenticação)
```

### Opção 3: Usar credencial do n8n
Crie uma credencial do tipo "Header Auth" com o JWT token e use no HTTP Request.

---

## Boas Práticas

### 1. Tratamento de Erros
Sempre use **IF Nodes** para verificar sucesso/falha:

```json
{
  "conditions": {
    "conditions": [
      {
        "leftValue": "={{ $json.success }}",
        "rightValue": true,
        "operator": {
          "type": "boolean",
          "operation": "equals"
        }
      }
    ]
  }
}
```

### 2. Logging
Adicione logs em cada etapa:

```javascript
// Code Node: Log
console.log('Step: Nome do Step', JSON.stringify($input.json()));
return $input.all();
```

### 3. Validação
Sempre valide inputs antes de chamar a API.

### 4. Formatação
Retorne mensagens formatadas para o WhatsApp (concisas, com emojis).

---

## Próximos Passos

1. ✅ Criar subworkflow "Tool - Registrar Transacao API"
2. ✅ Criar subworkflow "Tool - Consultar Transacoes"
3. ✅ Criar subworkflow "Tool - Resumo Financeiro"
4. ✅ Adicionar tools no AI Agent
5. ⏭️ Testar com exemplos reais
6. ⏭️ Implementar Fase 2 (Cartões e Parcelas)

---

## Exemplos de Uso

### Exemplo 1: Registrar gasto
```
Usuário: Gastei 50 com uber hoje

AI Agent → Tool - Registrar Transacao API:
- telefone: 557981003085
- valor: 50
- tipo: expense
- categoria: transporte
- descricao: Uber
- data_transacao: 2026-02-23
- status: paid

Resposta: ✅ Uber registrada: R$ 50.00
```

### Exemplo 2: Consultar gastos
```
Usuário: Quanto gastei este mês?

AI Agent → Tool - Resumo Financeiro:
- telefone: 557981003085
- periodo: este_mes

Resposta: 💰 Resumo Financeiro

Saldo: R$ 2.500,00
Entradas: R$ 5.000,00
Saídas: R$ 2.500,00
Transações: 15

📈 Por Categoria:
  • Alimentação: R$ 800,00 (32%)
  • Moradia: R$ 1.000,00 (40%)
  • Transporte: R$ 700,00 (28%)
```
