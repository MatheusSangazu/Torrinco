# Parâmetros das Tools para AI Agent

Este documento descreve os parâmetros de entrada que o AI Agent precisa passar para cada subworkflow.

## Como as Tools funcionam

**IMPORTANTE**: Todos os subworkflows usam **Webhook Trigger** atualmente. Para usar com AI Agent, você tem duas opções:

### Opção 1: Webhook Trigger (ATUAL)
- **Vantagem**: Pode ser testado individualmente
- **Desvantagem**: Requer URL exposta
- **Como usar com AI Agent**: O AI Agent chama via HTTP Request com a URL do webhook

### Opção 2: Execute Workflow Trigger (RECOMENDADO)
- **Vantagem**: Mais seguro, interno ao n8n
- **Desvantagem**: Não pode ser testado individualmente sem outro workflow
- **Como usar com AI Agent**: O AI Agent chama diretamente o subworkflow

## Parâmetros de Entrada por Tool

### Tool 1: `registrar_transacao`

**Função**: Registrar uma transação financeira (receita ou despesa)

**Parâmetros de entrada**:
```json
{
  "telefone": "5511999999999",
  "valor": 150.00,
  "tipo": "expense",
  "categoria": "alimentação",
  "descricao": "Supermercado Extra",
  "data_transacao": "2026-02-23",
  "status": "paid"
}
```

**Detalhes dos parâmetros**:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| telefone | string | ✅ Sim | Número do usuário (formato: 5511999999999) |
| valor | number | ✅ Sim | Valor da transação (deve ser positivo) |
| tipo | string | ✅ Sim | "expense" (despesa) ou "income" (receita) |
| categoria | string | ❌ Não | Nome da categoria (ex: "alimentação", "transporte", "moradia", "lazer", "saúde", "educação", "outros") |
| descricao | string | ✅ Sim | Descrição da transação |
| data_transacao | string | ❌ Não | Data no formato YYYY-MM-DD (se não informado, usa hoje) |
| status | string | ❌ Não | "paid" ou "pending" (padrão: "paid" se data não informada, "pending" se informada) |

**Mapeamento de categorias** (feito automaticamente):
- alimentação → ID 1
- transporte → ID 2
- moradia → ID 3
- lazer → ID 4
- saúde → ID 5
- educação → ID 6
- outros → ID 7

**Exemplos de uso**:

```
"Registrei uma compra de R$ 50 no Uber"
→ telefone: <do contexto>, valor: 50, tipo: "expense", categoria: "transporte", descricao: "Uber"

"Recebi R$ 2000 de salário"
→ telefone: <do contexto>, valor: 2000, tipo: "income", categoria: "outros", descricao: "Salário"
```

---

### Tool 2: `consultar_transacoes`

**Função**: Consultar transações financeiras com filtros

**Parâmetros de entrada**:
```json
{
  "telefone": "5511999999999",
  "tipo": "expense",
  "categoria": "alimentação",
  "dias": 30,
  "periodo": "este_mes"
}
```

**Detalhes dos parâmetros**:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| telefone | string | ✅ Sim | Número do usuário |
| tipo | string | ❌ Não | "expense" ou "income" (filtra por tipo) |
| categoria | string | ❌ Não | Nome da categoria (filtra por categoria) |
| dias | number | ❌ Não | Número de dias para consulta (ex: 30) |
| periodo | string | ❌ Não | "hoje", "esta_semana" ou "este_mes" |

**Regras de período** (calculado automaticamente):
- `periodo: "hoje"` → de hoje até hoje
- `periodo: "esta_semana"` → de segunda-feira até hoje
- `periodo: "este_mes"` → do dia 1 até hoje
- `dias: 30` → de 30 dias atrás até hoje
- Se nenhum período informado → padrão 30 dias

**Exemplos de uso**:

```
"Quanto gastei este mês?"
→ telefone: <do contexto>, periodo: "este_mes", tipo: "expense"

"Me mostre as despesas com alimentação"
→ telefone: <do contexto>, tipo: "expense", categoria: "alimentação"

"Quais foram minhas transações dos últimos 7 dias?"
→ telefone: <do contexto>, dias: 7
```

---

### Tool 3: `adicionar_lembrete`

**Função**: Adicionar um lembrete na agenda

**Parâmetros de entrada**:
```json
{
  "telefone": "5511999999999",
  "titulo": "Pagar conta de luz",
  "data_hora": "2026-02-23T14:30:00"
}
```

**Detalhes dos parâmetros**:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| telefone | string | ✅ Sim | Número do usuário |
| titulo | string | ✅ Sim | Título/descrição do lembrete |
| data_hora | string | ✅ Sim | Data e hora no formato ISO 8601 (YYYY-MM-DDTHH:mm:ss) |

**Regra importante**: O sistema converte automaticamente `data_hora` em `specific_date` (data com hora zerada) e `time` (hora formatada como HH:MM). A frequência é definida como "once" por padrão.

**Exemplos de uso**:

```
"Me lembre de pagar a conta de luz em 5 minutos"
→ telefone: <do contexto>, titulo: "Pagar conta de luz", data_hora: <hora atual + 5 minutos>

"Adicione um lembrete para às 15h"
→ telefone: <do contexto>, titulo: <do contexto>, data_hora: "2026-02-23T15:00:00"
```

---

### Tool 4: `listar_lembretes`

**Função**: Listar lembretes da agenda

**Parâmetros de entrada**:
```json
{
  "telefone": "5511999999999",
  "status": "pending"
}
```

**Detalhes dos parâmetros**:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| telefone | string | ✅ Sim | Número do usuário |
| status | string | ❌ Não | "pending" (padrão) ou "completed" |

**Exemplos de uso**:

```
"Quais são meus lembretes?"
→ telefone: <do contexto>

"Me mostre os lembretes pendentes"
→ telefone: <do contexto>, status: "pending"
```

---

### Tool 5: `resumo_financeiro`

**Função**: Obter resumo financeiro com totais e breakdown por categoria

**Parâmetros de entrada**:
```json
{
  "telefone": "5511999999999",
  "periodo": "este_mes"
}
```

**Detalhes dos parâmetros**:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| telefone | string | ✅ Sim | Número do usuário |
| periodo | string | ❌ Não | "hoje", "esta_semana" ou "este_mes" (padrão) |

**Exemplos de uso**:

```
"Como está minhas finanças este mês?"
→ telefone: <do contexto>, periodo: "este_mes"

"Me dê um resumo financeiro de hoje"
→ telefone: <do contexto>, periodo: "hoje"
```

---

### Tool 6: `previsao_fluxo_caixa`

**Função**: Obter previsão de fluxo de caixa para os próximos dias

**Parâmetros de entrada**:
```json
{
  "telefone": "5511999999999",
  "periodo": "next_month"
}
```

**Detalhes dos parâmetros**:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| telefone | string | ✅ Sim | Número do usuário |
| periodo | string | ❌ Não | "next_month" (padrão) ou "month" |

**Retorna**:
- income: Receitas totais
- expenses: Despesas totais (inclui faturas de cartão de crédito)
- balance: Saldo projetado
- breakdown: Detalhamento (recurring_income, recurring_expenses, installments, credit_card_bills)

**Exemplos de uso**:

```
"Como será meu fluxo de caixa no próximo mês?"
→ telefone: <do contexto>, periodo: "next_month"

"Me mostre uma previsão financeira"
→ telefone: <do contexto>
```

---

### Tool 7: `consultar_faturas`

**Função**: Consultar fatura de cartão de crédito

**Parâmetros de entrada**:
```json
{
  "telefone": "5511999999999",
  "cartao_id": 1,
  "tipo_fatura": "atual"
}
```

**Detalhes dos parâmetros**:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| telefone | string | ✅ Sim | Número do usuário |
| cartao_id | number | ✅ Sim | ID do cartão de crédito |
| tipo_fatura | string | ❌ Não | "atual" (padrão) ou "seguinte" |

**Exemplos de uso**:

```
"Quanto está minha fatura do cartão Nubank?"
→ telefone: <do contexto>, cartao_id: <obtido de consulta de cartões>

"Me mostre a próxima fatura do meu cartão"
→ telefone: <do contexto>, cartao_id: <obtido de consulta de cartões>, tipo_fatura: "seguinte"
```

---

## Contexto Automático do AI Agent

O AI Agent do n8n já tem acesso a estas informações automaticamente:

1. **Número de telefone**: Obtido da mensagem do WhatsApp (via workflow principal)
2. **Data e hora atual**: Via `$now.setZone('America/Sao_Paulo')`
3. **Histórico de conversa**: Via Redis Chat Memory

Portanto, ao chamar as tools, o AI Agent deve:
- Sempre passar o `telefone` (obtido do contexto)
- Calcular datas/horas baseando-se no horário atual
- Extrair informações da mensagem do usuário

## Como Configurar no AI Agent

### Passo 1: Adicionar Subworkflow como Tool

No node **AI Agent**:
1. Vá em **Tools** > **Add Tool** > **Execute Workflow**
2. Selecione o subworkflow desejado
3. Configure o **Name** (ex: `registrar_transacao`)
4. Configure a **Description** para o AI Agent entender quando usar

### Passo 2: Configurar Schema de Input

No **Execute Workflow** node:
1. Configure os parâmetros de entrada conforme a tabela acima
2. Defina quais são obrigatórios e quais são opcionais
3. Adicione descrições para cada parâmetro

### Passo 3: Atualizar System Message

No node **AI Agent**, adicione ao **System Message**:

```
## Tools Disponíveis

Você tem acesso às seguintes ferramentas para gerenciar finanças:

1. **registrar_transacao**: Registrar receitas e despesas
   - Use quando o usuário mencionar gastos, compras, pagamentos ou recebimentos
   - Sempre extrair: valor, tipo, descrição
   - Categoria: inferir da descrição se não informada

2. **consultar_transacoes**: Consultar histórico de transações
   - Use quando o usuário quiser ver gastos, despesas ou receitas
   - Período padrão: 30 dias (use "este_mes" para mês atual)

3. **adicionar_lembrete**: Adicionar lembretes
   - Use quando o usuário pedir para lembrar algo
   - O sistema converte automaticamente data_hora em specific_date e time
   - Sempre somar minutos à hora atual para calcular data_hora

4. **listar_lembretes**: Listar lembretes pendentes
   - Use quando o usuário perguntar por lembretes

5. **resumo_financeiro**: Obter resumo financeiro
   - Use quando o usuário pedir resumo, balanço ou panorama financeiro

6. **previsao_fluxo_caixa**: Prever fluxo de caixa
   - Use quando o usuário perguntar sobre previsão ou futuro financeiro

7. **consultar_faturas**: Consultar fatura de cartão
   - Use quando o usuário mencionar fatura de cartão

## Contexto Disponível

- **Telefone do usuário**: Obtido automaticamente da mensagem
- **Data e hora atual**: Sempre use como base para cálculos
- **Histórico**: Você tem acesso às mensagens anteriores
```

## Próximos Passos

1. ✅ Documentar parâmetros (este arquivo)
2. ⏭️ Alterar subworkflows para usar **Execute Workflow Trigger**
3. ⏭️ Adicionar tools ao AI Agent
4. ⏭️ Testar integração
