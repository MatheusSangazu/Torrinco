# Missões da refatoração financeira

Documento de acompanhamento da implementação descrita em
[`refatoracaoPlano.md`](./refatoracaoPlano.md).

## Legenda

- `[ ]` Não iniciada
- `[-]` Em andamento
- `[x]` Concluída e validada

## Missão 1 — Motor financeiro e testes de caracterização

Status: **concluída em 2026-08-23**.

- [x] Caracterizar as regras atuais de transações, recorrências, cartões, faturas e parcelas.
- [x] Definir um contrato interno mensal com valores registrados, projetados e totais.
- [x] Centralizar a regra de competência por forma de pagamento.
- [x] Usar a fatura como competência das compras e parcelas no cartão.
- [x] Não contar pagamento de fatura como uma nova despesa.
- [x] Deduplicar projeções pela identidade da ocorrência recorrente.
- [x] Calcular totais sem somas em ponto flutuante binário.
- [x] Fazer resumo e previsão consumirem o mesmo motor.
- [x] Cobrir os cenários financeiros da missão com testes automatizados.
- [x] Executar testes, lint e build relacionados.

Critério de conclusão: resumo e previsão são adaptadores do mesmo motor mensal,
com testes demonstrando competência, composição e ausência de duplicidade.

## Missão 2 — Recorrências finitas

Status: **concluída em 2026-08-23**.

- [x] Criar migration aditiva para tipo de término, quantidade e data final.
- [x] Migrar recorrências existentes para `never` sem alterar o comportamento atual.
- [x] Validar invariantes no backend.
- [x] Limitar projeção e materialização conforme o término.
- [x] Atualizar criação e edição usadas pela API, frontend, jobs e agente/WhatsApp.
- [x] Preservar ocorrências históricas ao editar ou cancelar uma série.
- [x] Cobrir recorrências por quantidade, data e sem data final com testes.

## Missão 3 — API da Visão mensal

Status: **concluída em 2026-08-23**.

- [x] Implementar `GET /finance/monthly-overview?year=AAAA`.
- [x] Retornar os 12 meses e seus estados.
- [x] Implementar `GET /finance/monthly-overview/AAAA-MM`.
- [x] Agrupar despesas por cartão, conta e forma de pagamento.
- [x] Agrupar receitas por fonte, preservando “Outras receitas”.
- [x] Garantir autorização por usuário/conta.
- [x] Evitar consultas N+1 e conferir resumo contra detalhamento.

## Missão 4 — Dashboard e formulário

Status: **concluída em 2026-08-23**.

- [x] Substituir “Saldo do mês” por Receitas, Despesas e Balanço.
- [x] Mostrar composição entre registrado e projetado.
- [x] Criar a Visão mensal anual para desktop e celular.
- [x] Criar detalhes expansíveis por mês e grupo.
- [x] Diferenciar carregamento, vazio e erro sem exibir zero em falhas.
- [x] Adicionar frequência e término consciente ao formulário de recorrência.
- [x] Preservar widgets secundários sem competir com a visão financeira.

## Missão 5 — Validação final e limpeza

Status: **em andamento — validação visual manual pendente**.

- [ ] Validar 390 px, 768 px e 1366 px.
- [ ] Validar temas claro e escuro, teclado e foco visível.
- [x] Executar toda a suíte de testes, lint e builds de client e server.
- [x] Confirmar que dashboard e previsão retornam os mesmos totais.
- [x] Remover apenas código legado sem consumidores comprovados.
- [x] Documentar arquivos alterados, contrato, riscos e pendências.

## Trilha complementar — Acabamento do PWA

As missões detalhadas estão em
[`MISSOES_ACABAMENTO_PWA.md`](./MISSOES_ACABAMENTO_PWA.md).

- [x] Missão 6 — Viewport, altura dinâmica e áreas seguras.
- [x] Missão 7 — Toque, rolagem e diálogos mobile.
- [x] Missão 8 — Instalação e acabamento de aplicativo.
- [-] Missão 9 — Validação responsiva e instalada (aparelhos pendentes).

## Registro de validações

- 2026-08-23: diagnóstico inicial concluído; 33 testes existentes relacionados a
  dashboard, recorrências, faturas e parcelas passaram antes das alterações.
- 2026-08-23: Missão 1 concluída. O motor mensal passou a calcular valores em
  centavos inteiros, aplicar competência de fatura, excluir sua liquidação e
  separar registrado/projetado. A suíte completa do servidor terminou com 320
  testes aprovados em 31 arquivos; lint do client e builds foram aprovados.
- 2026-08-23: Missão 2 concluída. Recorrências passaram a aceitar término por
  quantidade, data ou sem data final, com compatibilidade `never` para dados e
  consumidores antigos. Projeção, materialização, job, API, formulário e agente
  usam a mesma regra; edição/cancelamento preservam ocorrências anteriores. A
  suíte completa do servidor terminou com 333 testes aprovados em 33 arquivos;
  lint do client e builds de produção foram aprovados. A migration foi criada,
  mas não executada.
- 2026-08-23: Missão 3 concluída. A API da Visão mensal passou a retornar os 12
  meses do ano e o detalhamento agrupado sob demanda, sempre em centavos. O
  serviço usa duas consultas por requisição, valida o usuário-alvo na conta e
  mantém os totais do resumo iguais à soma do detalhamento. A suíte completa do
  servidor terminou com 344 testes aprovados em 36 arquivos; lint do client e
  builds de produção foram aprovados.
- 2026-08-23: Missão 4 concluída. O Dashboard passou a consumir exclusivamente a
  API agregada para Receitas, Despesas, Balanço, comparação anual e detalhes do
  mês. O cálculo e os modais financeiros legados foram removidos do componente;
  cartões, agenda, lembretes e movimentações recentes permaneceram com estados
  independentes. O formulário de recorrência também oferece fonte da receita,
  frequência, término consciente, prévia e confirmação.
- 2026-08-23: validação automatizada da Missão 5 aprovada com 345 testes do
  servidor em 37 arquivos, 15 testes unitários do client, TypeScript, lint e
  builds de produção de client e server. Um teste específico confirma que os
  adaptadores de resumo e previsão expõem os mesmos totais do motor mensal. A
  validação visual automatizada não foi executada porque nenhuma instância do
  navegador do aplicativo estava disponível para a skill; as larguras, os dois
  temas e o percurso por teclado permanecem para a sessão manual de amanhã.
- 2026-08-23: a tela de Relatórios Financeiros foi alinhada ao contrato mensal
  canônico já usado pela tela inicial. Os cartões de Receitas, Despesas e
  Balanço, a distribuição por categoria e a tendência de seis meses agora usam
  competência financeira e incluem compras normais e recorrentes de cartão,
  além das demais formas de pagamento. Um teste de regressão reproduz setembro
  de 2026 com R$ 5.818,68 em despesas sem duplicar projeções. Os 345 testes do
  servidor, os 2 testes específicos do relatório, TypeScript, lint e o build
  completo foram aprovados.

## Entrega consolidada

### Principais arquivos e contratos

- Motor e serviços: `server/src/lib/monthly-finance-engine.ts`,
  `server/src/services/monthly-finance.service.ts` e
  `server/src/services/summary.service.ts`.
- Recorrências: `server/src/lib/recurrence-rules.ts`, schema, migration aditiva,
  controller, service, jobs e consumidores do agente.
- API mensal: controllers e rotas de finanças, com contrato documentado em
  [`monthlyOverviewApi.md`](./monthlyOverviewApi.md).
- Interface: `client/src/components/MonthlyOverview.tsx`, cliente tipado da API,
  utilitários/testes mensais, `Dashboard.tsx`, `Reports.tsx` e
  `Transactions.tsx`.
- Os endpoints anuais e mensais retornam BRL em centavos inteiros, com valores
  `registered`, `projected` e `total`; o detalhamento é buscado somente ao abrir
  o mês.

### Riscos e pendências

- [ ] Aplicar a migration aditiva de recorrências no ambiente desejado após
  revisar backup e janela de implantação. Ela foi criada, mas não executada.
- [ ] Fazer a validação visual autenticada em 390 px, 768 px e 1366 px, nos temas
  claro e escuro, incluindo expansão de mês/grupo e navegação por teclado.
- [ ] Conferir os totais com dados reais da conta após a migration; a cobertura
  automatizada usa cenários controlados e não altera dados existentes.
- Nenhum commit foi criado e nenhuma migration foi executada nesta sessão.
