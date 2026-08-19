# API de faturas e pagamentos de cartão

## Modelo de produto

As compras no crédito são despesas de consumo e pertencem ao ciclo calculado pelos dias de fechamento e vencimento do cartão. A fatura apenas agrupa essas compras. O pagamento da fatura é uma saída de caixa que reduz a dívida do cartão; ele não volta a compor o total de despesas de consumo.

A mudança de ciclo nunca quita uma fatura automaticamente. Os estados são:

- `open`: ciclo ainda aberto;
- `closed`: ciclo encerrado e ainda não vencido;
- `overdue`: venceu com saldo pendente;
- `partially_paid`: recebeu pagamento, mas ainda possui saldo;
- `paid`: soma dos pagamentos ativos alcançou o total.

Cada pagamento gera uma transação de saída, com categoria técnica `Pagamento de Cartão`, e um registro em `card_bill_payments`. Pagamentos desfeitos são preservados com `reversed_at` e sua transação recebe soft delete.

## Endpoints autenticados

Todas as rotas usam `Authorization: Bearer <token>`.

### Configurar pergunta automática no vencimento

Os campos abaixo podem ser enviados ao criar ou atualizar um cartão em `POST /api/cards` e `PUT /api/cards/:id`:

```json
{
  "due_reminder_enabled": true,
  "due_reminder_hour": 9
}
```

- a adesão é opcional e vem desativada por padrão;
- `due_reminder_hour` aceita horas inteiras de `0` a `23`, no fuso `America/Fortaleza`;
- no vencimento, o WhatsApp pergunta se a fatura foi paga e informa total, valor já pago e saldo;
- a entrega usa a chave única da fatura e não é repetida por múltiplas instâncias do servidor;
- respostas como `paguei tudo` e `paguei R$ 500` usam o contexto da fatura perguntada; `ainda não` mantém o saldo pendente;
- faturas pagas, vazias ou sem saldo restante não geram mensagem.

### Consultar fatura atual

`GET /api/finance/cards/:cardId/bill`

### Consultar fatura seguinte

`GET /api/finance/cards/:cardId/next-bill`

A fatura seguinte pode ser calculada sem estar materializada. Nesse caso `billId` não é retornado e ela ainda não aceita pagamento.

### Histórico e detalhe

- `GET /api/cards/:id/bills?months=6`
- `GET /api/cards/:id/bills/:billId`

O detalhe contém:

```json
{
  "bill": {
    "id": 31,
    "status": "partially_paid",
    "due_date": "2026-04-05T00:00:00.000Z",
    "total_amount": 820,
    "paid_amount": 500,
    "remaining_amount": 320,
    "payments": [
      {
        "id": 9,
        "amount": 500,
        "paid_at": "2026-04-04T13:30:00.000Z",
        "transaction_id": 412
      }
    ],
    "items": []
  }
}
```

### Registrar pagamento total ou parcial

`POST /api/cards/:id/bills/:billId/pay`

```json
{
  "amount": 500,
  "payment_method": "pix",
  "payment_date": "2026-04-04"
}
```

- `amount` é opcional. Quando omitido, quita exatamente o saldo restante.
- `amount` deve ser positivo e não pode superar o saldo restante.
- pagamentos parciais mantêm a fatura em `partially_paid`;
- o pagamento é sempre vinculado à fatura indicada por `billId`.

Erros de domínio relevantes: `BILL_NOT_FOUND`, `BILL_ALREADY_PAID`, `INVALID_PAYMENT_AMOUNT` e `PAYMENT_EXCEEDS_REMAINING`.

### Desfazer o pagamento mais recente

`POST /api/cards/:id/bills/:billId/undo`

Desfaz o pagamento ativo mais recente, recalcula o estado da fatura e preserva auditoria por soft delete.

## API do agente

### Registrar pagamento conciliado

`POST /api/agent/cards/pay`

```json
{
  "card_name": "Nubank",
  "amount": 500,
  "payment_method": "pix",
  "bill_id": 31
}
```

- `amount` deve refletir exatamente o valor dito pelo usuário;
- `bill_id` é opcional, mas recomendado após consulta;
- sem `bill_id`, o sistema escolhe a fatura pendente mais antiga do cartão;
- sem `amount`, o sistema interpreta que o usuário quitou o saldo restante;
- se não houver fatura conciliável, o agente deve oferecer o registro como saída simples pela API de despesas, em vez de inventar uma associação.

## Evitando dupla contagem

Compras no cartão permanecem nas análises de consumo. Transações da categoria `Pagamento de Cartão` afetam o saldo de caixa, mas são excluídas do total de despesas do período. Assim, pagar uma fatura não duplica as compras que já compõem os relatórios.

## Migração

A migração `20260817000000_partial_card_bill_payments` cria a tabela de pagamentos, amplia o enum de status e converte os vínculos legados de pagamento único para o novo histórico.

A migração `20260817010000_card_bill_due_reminders` adiciona ao cartão a adesão e o horário da pergunta automática de vencimento.
