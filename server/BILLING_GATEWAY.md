# Arquitetura de cobrança agnóstica

Nenhum gateway real está instalado ou habilitado. O retorno do navegador nunca ativa uma conta. Somente um webhook validado no backend pode produzir `payment.approved` ou `subscription.activated` e chamar o `AccountProvisioningService`.

## Onde conectar o futuro gateway

1. Implemente `BillingProvider` em `src/billing/<provider>.provider.ts`.
2. Valide assinatura, timestamp, origem e tolerância contra replay dentro de `validateAndMapWebhook`.
3. Converta eventos externos para os eventos de `src/billing/types.ts`.
4. Monte `createBillingWebhookRouter(provider)` em `server.ts` **antes** de `express.json()`, usando `express.raw({type:'application/json'})` exclusivamente nessa rota. O corpo bruto é obrigatório para validar assinaturas.
5. Configure segredos somente por variáveis de ambiente do deploy.

Não monte `FakeBillingProvider`: o construtor bloqueia qualquer ambiente diferente de `test`.

## Fluxo do checkout

`BillingOrchestratorService.createOrder` recebe uma referência de plano conhecida pelo servidor. O backend busca o plano e o preço em `plans`; `plan_id`, valor e status do frontend não são aceitos. `createCheckout` passa ao gateway o pedido já fechado e persiste o ID externo.

O checkout pode redirecionar o navegador, mas esse retorno serve apenas para exibir “processando”. A liberação ocorre após:

1. validação criptográfica pelo provider;
2. inserção idempotente em `billing_webhook_events`;
3. localização do pedido;
4. comparação de plano, moeda e valor;
5. reivindicação atômica do pedido;
6. provisionamento ou ativação pelo `AccountProvisioningService`.

## Estados separados

- Pedido: `commerce_orders.status`.
- Checkout: `billing_checkouts.status`.
- Pagamento: `billing_payments.status`.
- Assinatura externa: `billing_subscriptions.status`.
- Acesso da conta: `accounts.status`.

Uma identidade pode participar de várias contas por `account_members`. Durante a migração, `users.account_id` continua representando a conta principal para compatibilidade com JWTs existentes.

## Eventos internos

- `checkout.created`
- `payment.pending`
- `payment.approved`
- `payment.failed`
- `subscription.activated`
- `subscription.past_due`
- `subscription.cancelled`
- `payment.refunded`

Eventos desconhecidos, pedidos ausentes ou divergência de plano/valor/moeda ficam com estado `review` e não concedem acesso. Eventos anteriores a `last_event_at` não regridem a assinatura. Reembolso usa `BILLING_REFUND_POLICY=suspend` por padrão; `keep_until_period_end` preserva acesso até a política comercial ser executada. Dados não são apagados por cancelamento, inadimplência ou estorno.

## Dados armazenados

São persistidos IDs externos de checkout, pagamento, cliente, assinatura e evento. Payloads de webhook passam por sanitização recursiva de campos de cartão, CVV, tokens, senhas, segredos e autorização. O Torrinco não armazena dados completos de cartão e não cria senha para o cliente; usuários sem senha recebem convite de primeiro acesso com hash SHA-256.

## Testes

```powershell
npm test -- --run tests/billing-orchestrator.test.ts
```

O teste demonstra criação de checkout, ativação de cliente novo, nova conta para identidade existente, conversão de trial, duplicidade, revisão, eventos fora de ordem, reembolso e rejeição de assinatura inválida.
