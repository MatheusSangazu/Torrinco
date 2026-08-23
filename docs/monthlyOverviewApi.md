# API da Visão mensal

Contrato criado na Missão 3 do plano de refatoração financeira. Todos os valores
monetários são inteiros em **centavos** e usam `BRL`.

## Resumo anual

```http
GET /api/finance/monthly-overview?year=2026
```

Retorna sempre os 12 meses do ano solicitado:

```json
{
  "year": 2026,
  "currency": "BRL",
  "unit": "cents",
  "months": [
    {
      "month": "2026-08",
      "status": "current",
      "income": { "registered": 250000, "projected": 0, "total": 250000 },
      "expense": { "registered": 30000, "projected": 5000, "total": 35000 },
      "balance": { "registered": 220000, "projected": -5000, "total": 215000 },
      "item_count": 3
    }
  ]
}
```

Estados possíveis:

- `closed`: mês anterior ao mês atual; considera somente lançamentos registrados;
- `current`: mês atual; combina registrados e projetados;
- `projected`: mês futuro; combina lançamentos futuros registrados e projetados.

O mês atual é calculado no fuso oficial `America/Fortaleza` enquanto a conta não
possuir um fuso próprio persistido.

## Detalhamento mensal

```http
GET /api/finance/monthly-overview/2026-08
```

Retorna os mesmos totais do resumo anual e:

- `income_groups`: receitas por fonte; lançamentos sem fonte ficam em
  `Outras receitas`;
- `expense_groups`: despesas por cartão, conta ou forma de pagamento;
- `projected_items`: ocorrências ainda não materializadas;
- `item_count`: quantidade total de lançamentos incluídos.

Cada grupo contém `subtotal`, `count` e `items`. Cada item informa valor,
descrição, categoria, data da transação, data de competência, origem
`registered`/`projected` e `resource_url` para o recurso original.

## Autorização e desempenho

Por padrão, os endpoints retornam somente dados do usuário autenticado. `owner`
e `admin` podem usar `target_user_id` depois da validação de que o alvo pertence
à mesma conta. Outros perfis recebem HTTP 403 ao tentar consultar outro usuário.

O resumo anual e o detalhamento executam duas consultas de domínio por
requisição: uma para transações e outra para recorrências. O agrupamento dos 12
meses, cartões, contas, formas de pagamento e fontes ocorre em memória, sem N+1.
