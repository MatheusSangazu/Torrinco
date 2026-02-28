# Agente de IA n8n - Integração Torrinco

Plano de atualização e implementação do agente de IA no n8n para o sistema Torrinco.

## Arquitetura Recomendada

✅ **USAR API REST** em vez de acesso direto ao MySQL

### Vantagens da API:
- **Consistência**: Validações de negócio já implementadas (verificação de duplicatas, lógica de parcelas)
- **Autenticação**: JWT configurado e validado
- **Manutenção**: Alterações na lógica de negócio aplicadas automaticamente
- **Segurança**: Controle de acesso por usuário/conta
- **Auditoria**: Logs centralizados no backend

### Quando usar subfluxos no n8n:
- Processamento complexo pós-API (formatação, filtros específicos do chat)
- Integrações externas (enviar WhatsApp via Evolution API)
- Lógica de decisão do agente

### NÃO usar subfluxos para:
- ❌ Acesso direto ao MySQL (bypassa validações)
- ❌ Lógica de negócio core (já está na API)
- ❌ Autenticação (use JWT da API)

## Tools Necessárias

### Fase 1 - Core Financeiro (Prioridade Alta)

#### 1. Consultar Transações
```
GET /api/finance/transactions
Parâmetros: start_date, end_date, type, category, status
Uso: Listar gastos/receitas, filtros por período
```

#### 2. Criar Transação
```
POST /api/finance/transactions
Campos: description, amount, type, category_id, transaction_date,
       payment_method, entity_id, installments, is_recurring
Uso: Registrar compras, receitas
Obs: Campo "income_source" removido do formulário (usar category_id para fontes de receita)
```

#### 3. Atualizar Transação
```
PUT /api/finance/transactions/:id
Uso: Corrigir informações
```

#### 4. Excluir Transação
```
DELETE /api/finance/transactions/:id
Uso: Remover lançamentos
```

#### 5. Resumo Financeiro
```
GET /api/finance/summary
Uso: Visão geral (saldo, entradas, saídas)
```

#### 6. Previsão Financeira
```
GET /api/finance/forecast
Parâmetros: period (next_month, month)
Uso: Projetar saldo futuro, inclui faturas de cartão de crédito do próximo mês
Retorna: income, expenses, balance, breakdown (recurring_income, recurring_expenses, installments, credit_card_bills)
```

### Fase 2 - Cartões e Parcelas

#### 7. Listar Cartões
```
GET /api/cards
Uso: Consultar cartões disponíveis
```

#### 8. Consultar Fatura Atual
```
GET /api/finance/cards/:cardId/bill
Uso: Ver fatura do mês
```

#### 9. Consultar Próxima Fatura
```
GET /api/finance/cards/:cardId/next-bill
Uso: Planejar pagamentos
```

#### 10. Gerenciar Parcelas
```
GET /api/installments
PUT /api/installments/:id/status
Uso: Acompanhar pagamentos parcelados
```

### Fase 3 - Categorias e Fontes

#### 11. Listar Categorias
```
GET /api/categories
Uso: Consultar categorias disponíveis
```

#### 12. Listar Fontes de Receita
```
GET /api/income-sources
Uso: Consultar fontes de receita
```

### Fase 4 - Relatórios e Exportação

#### 13. Exportar Excel
```
GET /api/export/excel
Parâmetros: start_date, end_date, type, category, status
Uso: Baixar planilha
```

#### 14. Enviar Relatório WhatsApp
```
POST /api/export/whatsapp
Uso: Enviar resumo via WhatsApp
```

### Fase 5 - Agenda e Lembretes

#### 15. Consultar Agenda
```
GET /api/calendar
Uso: Ver eventos e transações no calendário
```

#### 16. Criar Evento
```
POST /api/calendar
Uso: Adicionar compromissos
```

#### 17. Gerenciar Lembretes
```
GET /api/reminders
POST /api/reminders
GET /api/reminders/due
Parâmetros (POST): title, specific_date, time, frequency
Uso: Criar/consultar lembretes de pagamento
Obs: specific_date deve ser um objeto Date (não string ISO)
```

### Fase 6 - Transações Recorrentes

#### 18. Listar Recorrentes
```
GET /api/recurring
Uso: Ver assinaturas, contas fixas
```

#### 19. Criar Transação Recorrente
```
POST /api/recurring
Campos: description, amount, type, category, frequency, start_date
Uso: Criar assinaturas, contas fixas
Obs: next_due_date é automaticamente igual a start_date para novas transações
```

#### 20. Gerar Transação Recorrente
```
POST /api/recurring/:id/generate
Uso: Criar transação mensal a partir de recorrente
```

### Fase 7 - Orçamentos

#### 20. Gerenciar Orçamentos
```
GET /api/budget
POST /api/budget
Uso: Definir/consultar limites por categoria
```

## Plano de Execução

### Semana 1 - Base
- [ ] Configurar autenticação JWT no n8n (armazenar token como credencial)
- [ ] Criar tools da Fase 1 (Transações core)
- [ ] Testar fluxo: consulta → criação → atualização → exclusão

### Semana 2 - Expansão
- [ ] Criar tools da Fase 2 (Cartões e Parcelas)
- [ ] Criar tools da Fase 3 (Categorias e Fontes)
- [ ] Testar integrações

### Semana 3 - Relatórios e Exportação
- [ ] Criar tools da Fase 4 (Exportação)
- [ ] Implementar subfluxo para formatar dados WhatsApp
- [ ] Testar envio via Evolution API

### Semana 4 - Agenda e Recorrentes
- [ ] Criar tools da Fase 5 (Agenda)
- [ ] Criar tools da Fase 6 (Recorrentes)
- [ ] Criar tools da Fase 7 (Orçamentos)

## Configuração do n8n

### Credencial API
```json
{
  "name": "Torrinco API",
  "type": "httpHeaderAuth",
  "data": {
    "name": "Authorization",
    "value": "Bearer {{ $credentials.jwtToken }}"
  }
}
```

### Exemplo de Tool - Criar Transação
```javascript
// HTTP Request Node
{
  "method": "POST",
  "url": "https://apitorrinco.forjacorp.com/api/finance/transactions",
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "httpHeaderAuth",
  "sendBody": true,
  "bodyParameters": {
    "parameters": [
      {
        "name": "description",
        "value": "={{ $json.description }}"
      },
      {
        "name": "amount",
        "value": "={{ $json.amount }}"
      },
      {
        "name": "type",
        "value": "expense"
      },
      {
        "name": "category_id",
        "value": "={{ $json.category_id }}"
      },
      {
        "name": "transaction_date",
        "value": "={{ $json.transaction_date }}"
      }
    ]
  }
}
```

## Estratégia para Reduzir Alucinação

### 1. Dados Estruturados
A API retorna dados já processados e tipados, reduzindo ambiguidade:
```json
{
  "transactions": [
    {
      "id": 123,
      "description": "Supermercado",
      "amount": 150.00,
      "type": "expense",
      "category": { "id": 1, "name": "Alimentação" },
      "date": "2026-02-15"
    }
  ]
}
```

### 2. Filtragem no Backend
Use filtros para limitar quantidade de dados:
- `start_date` / `end_date`: Periodo específico
- `type`: Apenas despesas ou receitas
- `category`: Filtrar por categoria específica
- `status`: Pendentes, pagas, etc.

### 3. Paginação
Para queries que retornam muitos dados:
```
GET /api/finance/transactions?page=1&limit=20
```

### 4. Agregação Pronta
Use endpoints que já agregam dados:
- `/api/finance/summary`: Retorna totais já calculados
- `/api/finance/forecast`: Previsões prontas
- `/api/finance/cards/:cardId/bill`: Fatura processada

### 5. Validação na Origem
A API valida os dados antes de salvar:
- Duplicatas
- Valores negativos incorretos
- Datas futuras para transações passadas
- Categoria compatível com tipo (despesa/receita)

## Boas Práticas

### Para Queries do Usuário
1. **Seja específico**: "Quanto gastei em alimentação em janeiro" (filtro de categoria + data)
2. **Use agregações**: "Qual meu saldo atual?" (endpoint /summary)
3. **Evite "todos os dados"**: Não peça lista completa sem filtros

### Para Subfluxos
1. **Formatar resumo**: Dados da API → Resumo natural
2. **Validar intenção**: Analisar mensagem → Decidir tool
3. **Tratar erros**: Tentar → Fallback → Mensagem amigável

### Prompt Engineering
Forneça contexto claro ao agente:
```
Você é um assistente financeiro do Torrinco.
Use as tools da API para:
- Consultar transações (com filtros de data)
- Criar/atualizar transações
- Gerar relatórios

Sempre:
- Use filtros de data quando possível
- Prefira endpoints de agregação (/summary, /forecast)
- Formate valores em BRL (R$)
- Responda de forma concisa
```

## Exemplos de Uso

### Consulta Específica
```
Usuário: Quanto gastei este mês?

Agente:
1. GET /api/finance/summary
2. Formatar: "Você gastou R$ 2.500 este mês"
```

### Consulta com Filtros
```
Usuário: Quanto gastei em alimentação?

Agente:
1. GET /api/finance/transactions?category_id=1&type=expense&start_date=2026-02-01&end_date=2026-02-28
2. Somar valores
3. Formatar: "Você gastou R$ 450 em alimentação"
```

### Criação com Validação
```
Usuário: Gastei R$ 50 com Uber

Agente:
1. POST /api/finance/transactions {
     description: "Uber",
     amount: 50,
     type: "expense",
     category_id: 5,
     transaction_date: "2026-02-22"
   }
2. Se sucesso: "Transação registrada!"
3. Se erro (duplicata): "Esta transação já existe"
```

## Comparação: API vs MySQL Direto

| Aspecto | API | MySQL Direto |
|---------|-----|--------------|
| Validações de negócio | ✅ Automático | ❌ Manual |
| Autenticação | ✅ JWT | ❌ Precisa reimplementar |
| Manutenção | ✅ Centralizada | ❌ Dispersa |
| Dados retornados | ✅ Estruturados | ⚠️ Crus |
| Performance | ⚠️ Pode ser lento | ✅ Mais rápido |
| Segurança | ✅ Controlada | ❌ Vulnerável |
| Alucinação | ✅ Menor risco | ⚠️ Maior risco |

## Próximos Passos

1. Configurar credencial JWT no n8n
2. Começar pela Fase 1 (Core Financeiro)
3. Testar com queries específicas
4. Ajustar prompts conforme necessário
5. Expandir para fases seguintes
