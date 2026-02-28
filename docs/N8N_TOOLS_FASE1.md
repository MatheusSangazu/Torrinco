# N8N Tools - Fase 1: Core Financeiro

Guia detalhado para implementação das tools do agente n8n - Fase 1 (Core Financeiro).

## Pré-requisitos

### 1. Configurar Credencial JWT no n8n

1. Vá em **Credentials** > **Add Credential**
2. Selecione **Header Auth**
3. Configure:
   - **Name**: `Authorization`
   - **Value**: `Bearer {{ $credentials.jwtToken }}`
4. Salve como: `Torrinco API JWT`

### 2. Variáveis de Ambiente

No n8n, configure estas variáveis globais:
- `API_BASE_URL`: `https://apitorrinco.forjacorp.com/api`
- `JWT_TOKEN`: (obtido via login do usuário)

---

## Tool 1: Consultar Transações

### Configuração HTTP Request Node

```json
{
  "node": "HTTP Request",
  "parameters": {
    "method": "GET",
    "url": "={{ $env.API_BASE_URL }}/finance/transactions",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ]
    },
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
          "value": "={{ $json.type }}"
        },
        {
          "name": "category_id",
          "value": "={{ $json.category_id }}"
        },
        {
          "name": "status",
          "value": "={{ $json.status }}"
        }
      ]
    },
    "options": {}
  }
}
```

### Parâmetros de Entrada (Input Schema)

```json
{
  "type": "object",
  "properties": {
    "start_date": {
      "type": "string",
      "description": "Data inicial (formato YYYY-MM-DD)",
      "example": "2026-02-01"
    },
    "end_date": {
      "type": "string",
      "description": "Data final (formato YYYY-MM-DD)",
      "example": "2026-02-28"
    },
    "type": {
      "type": "string",
      "description": "Tipo de transação",
      "enum": ["income", "expense"]
    },
    "category_id": {
      "type": "number",
      "description": "ID da categoria"
    },
    "status": {
      "type": "string",
      "description": "Status da transação",
      "enum": ["pending", "paid", "cancelled"]
    }
  }
}
```

### Resposta Esperada

```json
{
  "success": true,
  "transactions": [
    {
      "id": 123,
      "description": "Supermercado Extra",
      "amount": 150.00,
      "type": "expense",
      "status": "paid",
      "transaction_date": "2026-02-15",
      "category": {
        "id": 1,
        "name": "Alimentação",
        "icon": "🍔",
        "color": "#FF6B6B"
      },
      "entity": {
        "id": 1,
        "name": "Supermercado Extra"
      },
      "payment_method": "credit_card",
      "installments": null
    }
  ]
}
```

### Subfluxo para Formatação (Opcional)

Use este subfluxo para transformar a resposta da API em texto natural:

```javascript
// Function Node: Formatar Transações
const transactions = $input.all()[0].json.transactions;

const formatted = transactions.map(t => 
  `• ${t.description}: R$ ${t.amount.toFixed(2)} (${t.category.name})`
).join('\n');

return [{
  json: {
    summary: `Encontradas ${transactions.length} transações:\n${formatted}`,
    count: transactions.length,
    total: transactions.reduce((acc, t) => acc + t.amount, 0)
  }
}];
```

---

## Tool 2: Criar Transação

### Configuração HTTP Request Node

```json
{
  "node": "HTTP Request",
  "parameters": {
    "method": "POST",
    "url": "={{ $env.API_BASE_URL }}/finance/transactions",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "httpHeaderAuth",
    "sendBody": true,
    "contentType": "application/json",
    "body": {
      "type": "json",
      "json": "={{ JSON.stringify({\n  description: $json.description,\n  amount: $json.amount,\n  type: $json.type,\n  category_id: $json.category_id,\n  transaction_date: $json.transaction_date || new Date().toISOString().split('T')[0],\n  payment_method: $json.payment_method,\n  entity_id: $json.entity_id,\n  installments: $json.installments,\n  is_recurring: $json.is_recurring || false\n}) }}"
    },
    "options": {}
  }
}
```

### Parâmetros de Entrada (Input Schema)

```json
{
  "type": "object",
  "required": ["description", "amount", "type", "category_id"],
  "properties": {
    "description": {
      "type": "string",
      "description": "Descrição da transação",
      "example": "Supermercado Extra"
    },
    "amount": {
      "type": "number",
      "description": "Valor da transação",
      "example": 150.00
    },
    "type": {
      "type": "string",
      "description": "Tipo da transação",
      "enum": ["income", "expense"]
    },
    "category_id": {
      "type": "number",
      "description": "ID da categoria",
      "example": 1
    },
    "transaction_date": {
      "type": "string",
      "description": "Data da transação (formato YYYY-MM-DD)",
      "example": "2026-02-15"
    },
    "payment_method": {
      "type": "string",
      "description": "Método de pagamento",
      "enum": ["cash", "credit_card", "debit_card", "pix", "bank_transfer"],
      "default": "cash"
    },
    "entity_id": {
      "type": "number",
      "description": "ID da entidade (estabelecimento/fonte)"
    },
    "installments": {
      "type": "number",
      "description": "Número de parcelas (para compras parceladas)"
    },
    "is_recurring": {
      "type": "boolean",
      "description": "Se é uma transação recorrente",
      "default": false
    }
  }
}
```

### Resposta Esperada

```json
{
  "success": true,
  "message": "Transação criada com sucesso",
  "transaction": {
    "id": 124,
    "description": "Supermercado Extra",
    "amount": 150.00,
    "type": "expense",
    "category": {
      "id": 1,
      "name": "Alimentação"
    },
    "transaction_date": "2026-02-15"
  }
}
```

### Subfluxo para Validação de Categoria

```javascript
// Function Node: Validar Categoria
const categories = {
  1: "Alimentação",
  2: "Transporte",
  3: "Moradia",
  4: "Lazer",
  5: "Saúde",
  6: "Educação",
  7: "Outros"
};

const categoryId = $input.json.category_id;

if (!categories[categoryId]) {
  throw new Error(`Categoria inválida. IDs disponíveis: ${Object.keys(categories).join(', ')}`);
}

return [{
  json: {
    ...$input.json(),
    category_name: categories[categoryId]
  }
}];
```

---

## Tool 3: Atualizar Transação

### Configuração HTTP Request Node

```json
{
  "node": "HTTP Request",
  "parameters": {
    "method": "PUT",
    "url": "={{ $env.API_BASE_URL }}/finance/transactions/{{ $json.id }}",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "httpHeaderAuth",
    "sendBody": true,
    "contentType": "application/json",
    "body": {
      "type": "json",
      "json": "={{ JSON.stringify({\n  description: $json.description,\n  amount: $json.amount,\n  category_id: $json.category_id,\n  transaction_date: $json.transaction_date,\n  payment_method: $json.payment_method,\n  entity_id: $json.entity_id,\n  status: $json.status\n}) }}"
    },
    "options": {}
  }
}
```

### Parâmetros de Entrada (Input Schema)

```json
{
  "type": "object",
  "required": ["id"],
  "properties": {
    "id": {
      "type": "number",
      "description": "ID da transação a ser atualizada"
    },
    "description": {
      "type": "string",
      "description": "Nova descrição"
    },
    "amount": {
      "type": "number",
      "description": "Novo valor"
    },
    "category_id": {
      "type": "number",
      "description": "Nova categoria"
    },
    "transaction_date": {
      "type": "string",
      "description": "Nova data (YYYY-MM-DD)"
    },
    "payment_method": {
      "type": "string",
      "enum": ["cash", "credit_card", "debit_card", "pix", "bank_transfer"]
    },
    "entity_id": {
      "type": "number"
    },
    "status": {
      "type": "string",
      "enum": ["pending", "paid", "cancelled"]
    }
  }
}
```

---

## Tool 4: Excluir Transação

### Configuração HTTP Request Node

```json
{
  "node": "HTTP Request",
  "parameters": {
    "method": "DELETE",
    "url": "={{ $env.API_BASE_URL }}/finance/transactions/{{ $json.id }}",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "httpHeaderAuth",
    "options": {}
  }
}
```

### Parâmetros de Entrada (Input Schema)

```json
{
  "type": "object",
  "required": ["id"],
  "properties": {
    "id": {
      "type": "number",
      "description": "ID da transação a ser excluída"
    }
  }
}
```

---

## Tool 5: Resumo Financeiro

### Configuração HTTP Request Node

```json
{
  "node": "HTTP Request",
  "parameters": {
    "method": "GET",
    "url": "={{ $env.API_BASE_URL }}/finance/summary",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "httpHeaderAuth",
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
        }
      ]
    },
    "options": {}
  }
}
```

### Parâmetros de Entrada (Input Schema)

```json
{
  "type": "object",
  "properties": {
    "start_date": {
      "type": "string",
      "description": "Data inicial (formato YYYY-MM-DD)",
      "example": "2026-02-01"
    },
    "end_date": {
      "type": "string",
      "description": "Data final (formato YYYY-MM-DD)",
      "example": "2026-02-28"
    }
  }
}
```

### Resposta Esperada

```json
{
  "success": true,
  "summary": {
    "balance": 2500.00,
    "income": 5000.00,
    "expense": 2500.00,
    "period": "2026-02-01 to 2026-02-28",
    "transactions_count": 15,
    "by_category": [
      {
        "category": "Alimentação",
        "total": 800.00,
        "percentage": 32
      },
      {
        "category": "Moradia",
        "total": 1000.00,
        "percentage": 40
      }
    ]
  }
}
```

### Subfluxo para Formatação

```javascript
// Function Node: Formatar Resumo
const summary = $input.json().summary;

const formatCurrency = (value) => 
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

const categoryBreakdown = summary.by_category
  .map(c => `  ${c.category}: ${formatCurrency(c.total)} (${c.percentage}%)`)
  .join('\n');

return [{
  json: {
    text: `📊 Resumo Financeiro\n\n` +
          `💰 Saldo: ${formatCurrency(summary.balance)}\n` +
          `📥 Entradas: ${formatCurrency(summary.income)}\n` +
          `📤 Saídas: ${formatCurrency(summary.expense)}\n` +
          `📊 Transações: ${summary.transactions_count}\n\n` +
          `📈 Por Categoria:\n${categoryBreakdown}`,
    data: summary
  }
}];
```

---

## Tool 6: Previsão Financeira

### Configuração HTTP Request Node

```json
{
  "node": "HTTP Request",
  "parameters": {
    "method": "GET",
    "url": "={{ $env.API_BASE_URL }}/finance/forecast",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "httpHeaderAuth",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [
        {
          "name": "months",
          "value": "={{ $json.months || 3 }}"
        }
      ]
    },
    "options": {}
  }
}
```

### Parâmetros de Entrada (Input Schema)

```json
{
  "type": "object",
  "properties": {
    "months": {
      "type": "number",
      "description": "Número de meses para previsão",
      "default": 3,
      "minimum": 1,
      "maximum": 12
    }
  }
}
```

### Resposta Esperada

```json
{
  "success": true,
  "forecast": {
    "current_balance": 2500.00,
    "projected": [
      {
        "month": "2026-03",
        "income": 5000.00,
        "expense": 2800.00,
        "net": 2200.00,
        "projected_balance": 4700.00
      },
      {
        "month": "2026-04",
        "income": 5000.00,
        "expense": 3000.00,
        "net": 2000.00,
        "projected_balance": 6700.00
      }
    ]
  }
}
```

---

## Exemplos de Uso com Agente AI

### Exemplo 1: Consultar Gastos do Mês

**Prompt do Usuário:**
"Quanto gastei este mês?"

**Fluxo no n8n:**
1. **AI Agent Node** detecta intenção: consultar gastos
2. **Date Calculator** (Function Node):
   ```javascript
   const now = new Date();
   const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
   const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
   
   return [{
     json: {
       start_date: firstDay.toISOString().split('T')[0],
       end_date: lastDay.toISOString().split('T')[0]
     }
   }];
   ```
3. **Tool 5: Resumo Financeiro** com os parâmetros de data
4. **Formatter Node** para gerar resposta natural
5. **AI Agent Node** retorna ao usuário

**Resposta Esperada:**
"Você gastou R$ 2.500,00 este mês. O saldo atual é R$ 2.500,00."

---

### Exemplo 2: Registrar Compra

**Prompt do Usuário:**
"Gastei R$ 50 com Uber"

**Fluxo no n8n:**
1. **AI Agent Node** extrai:
   - amount: 50
   - description: "Uber"
   - type: "expense"
2. **Category Matcher** (Function Node):
   ```javascript
   const categories = {
     "uber": 2, // Transporte
     "supermercado": 1, // Alimentação
     "farmácia": 5 // Saúde
   };
   
   const description = $input.json().description.toLowerCase();
   let matchedCategory = null;
   
   for (const [keyword, categoryId] of Object.entries(categories)) {
     if (description.includes(keyword)) {
       matchedCategory = categoryId;
       break;
     }
   }
   
   if (!matchedCategory) {
     matchedCategory = 7; // Outros
   }
   
   return [{
     json: {
       ...$input.json(),
       category_id: matchedCategory
     }
   }];
   ```
3. **Tool 2: Criar Transação** com os dados
4. **Success/Failure Handler** (Switch Node)
   - Se sucesso: "Transação registrada com sucesso!"
   - Se erro: "Erro ao registrar: {{ error.message }}"

---

### Exemplo 3: Relatório Detalhado

**Prompt do Usuário:**
"Me mostre um relatório detalhado dos últimos 30 dias"

**Fluxo no n8n:**
1. **Date Calculator** (últimos 30 dias)
2. **Tool 1: Consultar Transações** com filtros
3. **Tool 5: Resumo Financeiro** (paralelo)
4. **Aggregator** (Function Node):
   ```javascript
   const transactions = $input.first().json.transactions;
   const summary = $input.last().json.summary;
   
   const byCategory = {};
   transactions.forEach(t => {
     const cat = t.category.name;
     if (!byCategory[cat]) {
       byCategory[cat] = { count: 0, total: 0 };
     }
     byCategory[cat].count++;
     byCategory[cat].total += t.amount;
   });
   
   return [{
     json: {
       summary,
       byCategory,
       transactions
     }
   }];
   ```
5. **Formatter Node** para WhatsApp/Email
6. **Send WhatsApp** (se solicitado)

---

## Tratamento de Erros

### Error Handler Node

```javascript
// Function Node: Error Handler
const error = $input.json();

const errorMessages = {
  400: "Dados inválidos. Verifique os parâmetros.",
  401: "Não autorizado. Faça login novamente.",
  403: "Acesso negado.",
  404: "Recurso não encontrado.",
  409: "Conflito. Esta transação já existe.",
  500: "Erro no servidor. Tente novamente mais tarde."
};

const message = errorMessages[error.statusCode] || "Erro desconhecido.";

return [{
  json: {
    error: true,
    message,
    statusCode: error.statusCode,
    details: error.message
  }
}];
```

---

## Testes das Tools

### Teste 1: Consultar Transações
```json
{
  "start_date": "2026-02-01",
  "end_date": "2026-02-28",
  "type": "expense"
}
```

### Teste 2: Criar Transação
```json
{
  "description": "Teste Uber",
  "amount": 50.00,
  "type": "expense",
  "category_id": 2,
  "transaction_date": "2026-02-23"
}
```

### Teste 3: Resumo Financeiro
```json
{
  "start_date": "2026-02-01",
  "end_date": "2026-02-28"
}
```

---

## Próximos Passos

Após implementar a Fase 1:
1. ✅ Testar cada tool individualmente
2. ✅ Criar workflows de exemplo
3. ✅ Integrar com AI Agent (ChatGPT/Anthropic)
4. ⏭️ Implementar Fase 2 (Cartões e Parcelas)
5. ⏭️ Implementar Fase 3 (Categorias e Fontes)

---

## Dicas e Boas Práticas

### 1. Use Expressões do n8n
```javascript
// Data atual formatada
{{ new Date().toISOString().split('T')[0] }}

// Primeiro dia do mês
{{ new Date(new Date().getFullYear(), new Date().getMethod(), 1).toISOString().split('T')[0] }}
```

### 2. Armazene Credenciais Seguramente
- Nunca hardcode tokens
- Use variáveis de ambiente do n8n
- Use credenciais nativas do n8n

### 3. Valide Inputs
- Sempre valide parâmetros antes de enviar
- Use Function Nodes para pré-processamento
- Forneça mensagens de erro claras

### 4. Cache de Dados
- Cacheie listas de categorias (mudam pouco)
- Cacheie dados de entidades
- Use o node **Wait** para limitar taxa de requisições

### 5. Logging
- Use o node **Set** para adicionar metadados
- Registre timestamps de requisições
- Armazene IDs de transações para auditoria
