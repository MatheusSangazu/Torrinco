# Plano de Ação — Torrinco

## Visão de produto (alinhada)
Sistema financeiro onde **o WhatsApp é a porta de entrada principal** (via Evolution API + agente de IA no n8n). O app/PWA é complementar: serve para visualização, configuração e como **fallback vivo** caso o bot esteja indisponível. O usuário nunca é refém de uma camada só.

## Diagnóstico inicial — raiz dos bugs

A arquitetura geral (MVC + Prisma) está boa. O problema está **concentrado no core financeiro**, em 5 pontos que se alimentam uns dos outros:

1. **Lógica de fatura de cartão duplicada em 5 lugares com implementações diferentes**
   - `finance.controller.ts` tem `getCardBill`, `getCardNextBill`, `getCardPreviousBill` **e** uma versão inline dentro de `getForecast`.
   - `cards.controller.ts` tem `calculateBillPeriod` + `calculateHistoricalBillPeriod`.
   - Cada uma calcula o período (fechamento/vencimento) de um jeito: umas usam hora local, outras UTC; o filtro do intervalo muda entre `gte/lte`, `gt/lte`, `lt`/`lte`. **Resultado: o mesmo cartão mostra totais diferentes dependendo do endpoint chamado.**

2. **Detecção de "fatura paga" frágil (string matching)**
   - Pagamento detectado por `category: 'Pagamento de Cartão'` + `description contains nome do cartão`.
   - Em `getCardBill` nem tem filtro de data na busca do pagamento.
   - Cartões com nomes parecidos ("Nubank" / "Nubank Gold") cruzam.
   - Não existe vínculo real entre a transação de pagamento e a fatura quitada.

3. **Datas/fuso inconsistentes**
   - `server.ts` seta `process.env.TZ` tarde demais.
   - `parseLocalDate` duplicado em 3 arquivos com offsets diferentes (12:00, 00:00...).
   - `transaction-projection.ts` tem dois `while` consecutivos duplicados para daily/weekly. Clássico bug de "transação no dia/mês errado".

4. **Parcelamento ignora o ciclo da fatura**
   - `installments.controller.ts` gera transações em `startDate + i meses`, todas `status: paid`, sem olhar o `closing_day` do cartão. Compra no dia 20 com fechamento no 10 cai na fatura errada.
   - Sem `$transaction` — falha no meio deixa estado inconsistente.

5. **Recorrência só "virtual" e deduplicação frágil**
   - A projeção deduplica comparando descrição+valor+dia. Editar uma transação gerada por recorrência = duplicada.
   - `next_due_date` só avança quando alguém chama `/generate` — não há materialização automática.

## Decisões consolidadas
- Refatorar o core (manter MVC + Prisma + schema).
- Faturas materializadas em tabela `card_bills`.
- Recorrências materializadas por **cron no server** + endpoint de gatilho.
- Camada **agent-friendly** para o n8n/IA.
- Single-user por conta (multi-user fica para o futuro).
- Banco pode ser resetado (só dados de teste).

## Princípios arquiteturais
1. **Toda lógica de domínio em `src/services/`** — controllers viram casca fina.
2. **Funções puras e testáveis** para datas/períodos em `src/lib/` (uma única fonte de verdade).
3. **Zero duplicação**: a regra da fatura, do parcelamento e da recorrência existe em **um** lugar cada.
4. **Operações multi-step em `$transaction`**.
5. **Remover todos `console.log` de debug**; logs estruturados (se necessário, `pino`).

---

## FASE 1 — Fundações e limpeza (sem mudar comportamento visível)
**Objetivo:** remover a podridão de datas/logs/duplicação antes de tocar no modelo.

1. **Padronizar fuso e datas**
   - Criar **uma** `src/lib/date-utils.ts` com `parseDate`, `toUTCDate`, `addMonths`, `formatPeriod`, `startOfDay/endOfDay`. Eliminar as 3 cópias de `parseLocalDate` (finance, recurring, cards).
   - Decisão técnica: **tudo em UTC** no banco; conversão só na borda de entrada/saída. Mover `process.env.TZ` para **antes** de qualquer import que dependa dele — ou remover e tratar via UTC explícito.
2. **Limpar debug** — remover todos os `console.log('DEBUG...')` de `transaction-projection.ts`, `finance.controller.ts` e `recurring.controller.ts`.
3. **Reescrever `transaction-projection.ts`** — eliminar os 2 `while` duplicados; uma função `advanceDate(freq, date)` única e testável.
4. **Reset do banco** — `npx prisma migrate reset` (só dados de teste).

✅ **Checkpoint:** comportamento atual mantido, mas com datas consistentes e sem logs.

---

## FASE 2 — Novo modelo de faturas (`card_bills`)
**Objetivo:** fatura como entidade real, com vínculo explícito de pagamento. Mata o bug de detecção por string matching.

1. **Schema** — nova tabela:
   ```
   card_bills: id, card_id, user_id, period_start, period_end,
   closing_date, due_date, total_amount (Decimal), status (open|closed|paid),
   payment_transaction_id (Int?), created_at, closed_at, paid_at
   ```
2. **Migration nova** (reset OK) + `prisma generate`.
3. **`src/services/billing.service.ts`** — a fonte única:
   - `getOrCreateCurrentBill(cardId)` — cálculo de período (closing/due day) em **uma** função `computeBillPeriod(closingDay, dueDay, refDate)`.
   - `closeBill`, `registerPayment(billId, ...)` → cria transação de pagamento e seta `payment_transaction_id` (vínculo real, não string).
   - `undoPayment(billId)` → desfaz via FK, restaura status.
   - `getBill`, `getNextBill`, `getPreviousBill`, `getHistory` — todos derivam da tabela, sem recálculo.
4. **Job de ciclo** — fecha faturas cuja `closing_date` passou e abre a próxima. (Pode rodar no mesmo cron da Fase 4.)

✅ **Checkpoint:** mesmo cartão mostra o mesmo total em qualquer endpoint; pagar/desfazer funciona por FK.

---

## FASE 3 — Refatorar parcelas e recorrência
**Objetivo:** regras corretas e resilientes.

1. **`src/services/installments.service.ts`**
   - Criar parcelas **respeitando o `closing_day`** do cartão (cada parcela cai no ciclo correto).
   - Tudo em `prisma.$transaction`.
   - Parcelas futuras como `pending`, não `paid`.
2. **`src/services/recurring.service.ts`**
   - Recorrência = template. Função `materializeDue(userId, upToDate)` cria transações reais para `next_due_date <= hoje` e avança a data.
   - Deduplicação passa a ser por `recurring_transaction_id` + data (confiável), não por descrição/valor.

✅ **Checkpoint:** parcela na fatura certa; recorrência sem duplicação.

---

## FASE 4 — Cron de materialização (no server)
**Objetivo:** cliente só usa WPP, servidor autossuficiente.

1. Adicionar `node-cron` (ou similar) rodando **diariamente** no `server.ts`:
   - Materializa recorrências vencidas.
   - Fecha faturas cujo ciclo virou.
2. **Endpoint `POST /api/recurring/run`** (auth) — permite ao **n8n forçar** a materialização antes de responder ao usuário (garante dados frescos no bot).
3. Independência: o servidor roda sozinho; se o n8n cair, o app/PWA continua como fallback. Se o servidor cair, o bot perde o canal mas os dados estão íntegros.

✅ **Checkpoint:** dados sempre atualizados sem ação do usuário.

---

## FASE 5 — Controllers viram casca fina
1. Refatorar `finance.controller.ts`, `cards.controller.ts`, `installments.controller.ts`, `recurring.controller.ts` para **só** chamar services.
2. `getCardBill/Next/Previous` → 3 linhas cada, chamando `billing.service`.
3. Eliminar a versão inline de fatura dentro de `getForecast`.
4. `summary`/`forecast` → chamam `summary.service` que usa as fontes unificadas.

✅ **Checkpoint:** sem duplicação; mudar regra = mudar em 1 lugar.

---

## FASE 6 — Frontend (mínimo, focado no que mudou)
1. `cards.service.ts` + `Cards.tsx` — pagar/desfazer passa a usar endpoints dedicados:
   - `POST /api/cards/:id/bills/:billId/pay` e `POST /api/cards/:id/bills/:billId/undo`.
   - Remover a criação manual de transação `"Pagamento de Cartão"` no front.
2. Ajustar tipos do `CreditCard` para usar `card_bills`.

✅ **Checkpoint:** app funcional sobre o novo modelo.

---

## FASE 7 — Camada agent-friendly (base para o agente de IA)
**Objetivo:** expor a lógica de domínio de forma simples, por intenção, para que
nem um humano (via outra UI) nem o agente de IA precisem entender ciclo de fatura,
parcelas ou categorias especiais.

1. **`src/routes/agent.routes.ts`** — endpoints de **intenção**:
   - `POST /agent/expense`, `POST /agent/income` (aceitam descrição livre + valor + opcional cartão/categoria + flags `installments` e `recurring`).
   - `GET /agent/balance` (saldo + resumo do mês).
   - `GET /agent/forecast` (próximo mês em texto estruturado).
   - `GET /agent/cards/:id/bill`, `POST /agent/cards/:id/bills/:billId/pay`.
   - `GET /agent/upcoming` (recorrências/parcelas/faturas a vencer).
2. **Auth por API key de serviço** (middleware `agentAuth`) — separada do JWT do app.
3. **Normalização**: `/agent/expense` resolve categoria/cartão por nome aproximado,
   interpreta `installments` (chama `installments.service`) e `recurring` (chama
   `recurring.service`). Tudo num endpoint só.
4. **Spec OpenAPI** gerada — útil para integrações externas e documentação.

> Observação: como o agente de IA vai viver no próprio código (FASE 8), ele poderá
> chamar os **services diretamente** em vez de HTTP. Mesmo assim a camada agent-friendly
> vale para: (a) integrações externas, (b) clareza do contrato, (c) testes isolados.

✅ **Checkpoint:** qualquer consumidor registra e consulta tudo sem conhecer regras internas.

---

## FASE 8 — Agente de IA no próprio código (substitui o n8n)
**Decisão:** o agente vive **dentro do servidor Node**, usando Evolution já integrado
+ OpenAI. O cliente fica dependente só do servidor (autossuficiente), não do n8n.

1. **Webhook Evolution** — `POST /webhooks/evolution` recebe as mensagens do WPP.
2. **`src/services/agent.service.ts`** — orquestra:
   - Monta o prompt de sistema + as **tools** (descrições das capacidades).
   - Chama a OpenAI (function-calling) com as tools.
   - Executa a tool escolhida chamando os **services diretamente** (ou os endpoints agent).
   - Devolve a resposta natural em PT-BR.
3. **`src/services/llm.service.ts`** — camada fina sobre a API da OpenAI
   (`chat.completions` com tools). Isolada para permitir trocar de provedor no futuro.
4. **Resposta no WPP** via `evolution.service` já existente.
5. **Tools iniciais**: `registrar_despesa`, `registrar_receita`, `consultar_saldo`,
   `previsao`, `pagar_fatura`, `proximos_vencimentos`.
   - Ex.: "gastei 50 no mercado com o nubank" → tool `registrar_despesa`.
   - Ex.: "comprei um celular de 1000 em 10x no nubank" → tool `registrar_despesa` com `installments: 10`.
   - Ex.: "conta da vivo 80 reais todo mês" → tool `registrar_despesa` com `recurring: {frequency: "monthly"}`.

✅ **Checkpoint:** usuário conversa com o bot no WPP e o sistema registra/consulta tudo,
sem depender de nenhum software externo além do próprio servidor + API da OpenAI.

---

## FASE 9 — Features futuras do agente (roadmap)

As features abaixo estão registradas para implementação futura, em ordem de prioridade.

### 9.1 — Importar fatura em PDF ✅ (implementado)
- Usuário envia PDF da fatura do cartão no WhatsApp.
- `pdf.service.ts` extrai o texto; o agente identifica cada transação e registra em loop.
- Protocolo "leitura silenciosa + resumo final" no prompt.

### 9.2 — Listar cartões/contas ✅ (implementado)
- Tool `listar_cartoes` devolve os cartões de crédito e contas bancárias do usuário.
- Permite que o usuário pergunte "quais são meus cartões?" e o agente responda.
- Útil quando o usuário tem múltiplos cartões e precisa escolher.

### 9.3 — Excluir/editar transação via chat ✅ (implementado)
- Tools `excluir_transacao` (soft delete) e `editar_transacao`.
- Suporte a "apaga a última" (referência relativa) e "apaga a do mercado" (por descrição).
- O agente SEMPRE confirma antes de excluir ("Quer que eu apague 'Mercado *R$ 50*?').

### 9.4 — Relatório por categoria ✅ (implementado)
- Tool `relatorio_categoria` agrega despesas por categoria num período.
- Permite "quanto gastei com mercado este mês?" ou "meu gasto com transporte em junho".
- Aceita filtros: categoria específica, período (mês atual, mês passado, ano).

### 9.5 — Lembretes e agenda ✅ (implementado)
- Tools `adicionar_lembrete`, `listar_lembretes`, `excluir_lembrete`.
- Frequências: once, daily, weekly, monthly.
- Cron job (a cada minuto) checa lembretes ativos e dispara no WPP no horário.
- "once" marca como completed após disparar; recorrentes recalculam próximo trigger.
- Regras de horário relativo do prompt ("em 5 min", "daqui a pouco" = +30min, "mais tarde" = +2h).

### 9.6 — Integração com Google Calendar ⏳ (PRÓXIMA — plano detalhado abaixo)

#### Decisão de arquitetura
- **Abordagem:** OAuth2 com User Consent (cada usuário autoriza uma vez, recebe refresh_token permanente).
- **Não usar:** Service Account (não escala pra múltiplos usuários) nem iCal (só leitura).

#### Pré-requisitos manuais (Google Cloud Console)
1. Criar projeto em https://console.cloud.google.com/ (ou reusar o do n8n).
2. Ativar **Google Calendar API**: APIs & Services → Library → "Google Calendar API" → Enable.
3. Configurar **OAuth consent screen**:
   - User type: **External**
   - App name: Torrinco
   - Authorized domains: `forjacorp.com`
   - Scopes: `calendar.events` (leitura/escrita) e `calendar.calendar.readonly`
   - **Status: Testing** (não precisa publicar). Adicionar seu Google Account como **Test User**.
4. Criar credenciais **OAuth 2.0 Client ID**:
   - Application type: **Web application**
   - Authorized redirect URIs:
     - `https://apitorrinco.forjacorp.com/api/google/callback` (produção)
     - `http://localhost:3001/api/google/callback` (desenvolvimento)
   - Anotar **Client ID** e **Client Secret**.
5. Adicionar no `.env` (e nas env vars da Coolify):
   ```
   GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
   GOOGLE_REDIRECT_URI=https://apitorrinco.forjacorp.com/api/google/callback
   ```
6. Rodar `prisma migrate dev` (NÃO necessário — schema já tem os campos, ver abaixo).

#### Schema já existe (não precisa migrate)
Os campos já estão no model `users`:
- `google_refresh_token` (VarChar 512) — token permanente
- `google_email` (VarChar 255) — email da conta Google conectada
- `google_calendar_id` (default "primary") — calendário padrão

E `google_event_id` já existe em `reminders` e `recurring_events` (para sync bidirecional).

#### Implementação técnica

**Pacotes a instalar:**
```bash
npm install googleapis
```

**Arquivos a criar:**

1. `server/src/services/google/auth.service.ts`
   - `getAuthUrl(userId)` → gera URL de autorização com state=userId.
   - `exchangeCode(code)` → troca código por tokens, retorna refresh_token.
   - `getOAuth2Client(userId)` → cria cliente autenticado (usa refresh_token do banco, renova access_token automaticamente).
   - `isConnected(userId)` → verifica se usuário tem google_refresh_token.

2. `server/src/services/google/calendar.service.ts`
   - `createEvent(userId, { titulo, inicio, fim, descricao?, local? })` → cria evento no Google Calendar, retorna google_event_id.
   - `listEvents(userId, { dataInicio, dataFim })` → lista eventos num período.
   - `deleteEvent(userId, eventId)` → remove evento.
   - `updateEvent(userId, eventId, dados)` → edita evento.

3. `server/src/controllers/google.controller.ts`
   - `GET /api/google/connect` → redireciona pra URL de autorização do Google.
   - `GET /api/google/callback` → recebe código do Google, troca por tokens, salva no banco, redireciona pra frontend (ou mostra página de sucesso simples).

4. `server/src/routes/google.routes.ts`
   ```typescript
   router.get('/connect', GoogleController.connect);
   router.get('/callback', GoogleController.callback);
   ```

**Arquivos a modificar:**

5. `server/src/services/agent.service.ts` — adicionar funções:
   - `connectGoogle(userId)` → verifica se já conectou; se não, retorna URL de autorização.
   - `createCalendarEvent(userId, opts)` → chama calendar.service.
   - `listCalendarEvents(userId, opts)` → chama calendar.service.
   - `deleteCalendarEvent(userId, opts)` → chama calendar.service.

6. `server/src/services/agent/tools.ts` — adicionar tools:
   - `conectar_agenda` → retorna link de autorização (ou "já conectado").
   - `criar_evento` → cria evento na agenda (título, data, horário, duração padrão 1h).
   - `listar_eventos` → lista eventos de um dia/período.
   - `excluir_evento` → remove evento da agenda.

7. `server/src/services/agent/conversation.service.ts` — adicionar ao prompt:
   - "Se o usuário pedir para agendar algo e não tiver Google conectado, oriente a conectar primeiro."
   - "Eventos vão direto pro Google Calendar (não pros lembretes internos)."
   - "Duração padrão se não informada: 1 hora."

**Integração com lembretes (opcional, pós-MVP):**
- Quando criar evento no Google, criar também um reminder interno com `google_event_id` pra sincronizar.
- Cron job checa eventos do Google via API periodicamente (ou usa Google Push Notifications / webhooks).

#### Fluxo do usuário no WPP

```
Usuário: "agenda reunião amanhã às 14h"
Bot: [se não conectado] "Para agendar na sua agenda Google, conecte primeiro: [link]"
                                    ↓
              Usuário clica → login Google → autoriza → redirect → salva token
                                    ↓
Bot: "✅ Agenda conectada! Posso criar eventos agora."
Bot: [se conectado] cria evento → "✅ Reunião agendada para amanhã às 14h."
```

#### Validação
- [ ] `getAuthUrl` gera URL válida (abre tela de login do Google).
- [ ] Callback recebe código, troca por refresh_token, salva no banco.
- [ ] `getOAuth2Client` renova access_token expirado automaticamente.
- [ ] `createEvent` cria evento no Google Calendar (confirmar via calendar.google.com).
- [ ] `listEvents` retorna eventos do dia.
- [ ] Agente via WPP consegue agendar/listar/cancelar eventos.
- [ ] Testar com refresh_token expirado (Google revoga após 7 dias se app estiver em Testing).

#### Observações
- **Testing mode:** tokens duram 7 dias (Google revoga). Quando publicar o app (verificação), viram permanentes. Para teste, reconectar a cada 7 dias é normal.
- **Refresh em memória:** `getOAuth2Client` pode cachear o access_token (expira em 1h) pra não renovar toda chamada.
- **Timezone:** eventos devem ser criados com timezone `America/Sao_Paulo` por padrão.

### 9.7 — Multi-contas e multi-cartões robusto ✅ (implementado — escopo reduzido)
- **Decisão de produto:** focar no que importa pro usuário (entender gastos), não em gerenciar contas.
- Implementado: **desambiguação inteligente de cartões por nome**.
  - Nova função `resolveEntityByName` retorna `ok` / `ambiguo` / `nao_encontrado`.
  - Quando "Nubank" casa com "Nubank" e "Nubank Gold", o agente PERGUNTA qual.
  - Antes chutava o primeiro (registrava no cartão errado).
- **NÃO implementado (decisão consciente):**
  - Saldo por conta bancária (saldos continuam sendo um total, mais simples).
  - Vincular despesas pix/débito a conta específica.
  - Isso evita inflar a UI e o modelo mental do usuário.
- Documentos genéricos também foram expandidos nessa fase: PDF/planilha reconhecem fatura, boleto, extrato, comprovante.

---

## FASE 10 — Pronto para vender (Pack Legal + Segurança) ✅ (implementado)

Antes de cobrar de qualquer usuário, fechamos o pacote mínimo de segurança e conformidade legal.

### 10.1 — Segurança
- **Validação HMAC do webhook Evolution** (`src/middleware/verifyWebhook.ts`): bloqueia payloads forjados. Requer `EVOLUTION_WEBHOOK_SECRET` compartilhado com a Evolution (em `securityConfig.signatureSecret`). Sem isso, o webhook retorna 401 em produção.
- **Rate limit global** (`apiLimiter`) aplicado em `/api` no `server.ts`. Rotas sensíveis (login, reset) já têm limites próprios.
- **Rate limit por usuário no agente** (`src/middleware/user-rate-limit.ts`): 30 conversas/hora por usuário (default). Previne que 1 cliente derrube o orçamento de OpenAI.
- **Raw body capture** no `express.json` (necessário para validar assinatura HMAC).

### 10.2 — Auditoria
- **`src/lib/audit.ts`**: log estruturado em stdout no formato `[audit] { ts, actor, action, target, meta }`.
- Eventos auditados: `transaction.create`, `recurring.create`, `installment.create`, `bill.pay`, `bill.undo_payment`, `user.export_data`, `user.delete_account`.

### 10.3 — Conformidade LGPD
- **Termos de Serviço e Política de Privacidade** reformulados (`src/controllers/legal.controller.ts`):
  - Base legal explícita (art. 7º, V/IX/II e art. 8º).
  - Cláusula dedicada de IA + transferência internacional (OpenAI).
  - Retenção por finalidade (transações 5 anos, logs 1 ano).
  - DPO identificado com canal "LGPD" no email.
  - Cláusula de menores, limitação de responsabilidade, foro Brasil.
- **Portabilidade de dados (art. 18, V)**: `GET /api/user/export-data` exporta tudo em JSON.
- **Eliminação (art. 18, VI)**: `DELETE /api/user/account` anonimiza PII imediatamente (mantém transações anonimizadas por 5 anos por obrigação contábil).

### 10.4 — Env vars novas (não esquecer no .env e Coolify)
```
EVOLUTION_WEBHOOK_SECRET="string-aleatoria-longa-gerada-com-openssl-rand-hex-32"
```

---

## FASE 11 — Roadmap pós-MVP (registrar, não implementar ainda)

Sugestões anotadas para implementação futura, em ordem de prioridade para preparar o produto para escala.

### 🟡 Prioridade alta (antes de abrir pra público desconhecido)
- **Backup automático do MySQL** (Coolify scheduler + dump → S3): Crítico se perder dados. Testar restore periodicamente.
- ~~**Isolamento multi-conta robusto**~~ ✅ **Implementado (28/06/2026)**: schema já tinha `accounts`+`account_id`; corrigidos os 4 gaps de aplicação — (1) IDOR residual em `finance.controller` (busca de recorrência sem `user_id`); (2) fallback single-user removido do `agentAuth` (`x-user-id` agora obrigatório com API key); (3) gate de status de conta no `authenticateJwt` + `refresh-token` (conta cancelada é travada em ≤1h); (4) auto-onboarding via `ALLOW_AUTO_ONBOARDING=true` (telefone novo → account trial + user). Para abrir vendas, basta ligar essa env no Coolify.
- **Integração de cobrança (Stripe / Pagar.me)**: para cobrar em escala, com gate real de features (free vs paid).
- **Monitoramento (Sentry + UptimeRobot)**: alerta de erro 500 e downtime.

### 🟢 Prioridade média (pós-MVP)
- **2FA no login** (TOTP).
- **Política de Cookies** (se o PWA usar cookies).
- **Termos de cancelamento** mais específicos (definir regras de reembolso).
- **Log estruturado com pino** (em vez de `console.log`): quando os logs crescerem.
- **Testes automatizados**: prevenir regressões ao escalar features.

### 🔵 Features de produto (roadmap)
- **Metas de gastos** por categoria.
- **Orçamento mensal** com alertas de estouro.
- **Alertas de limite de cartão** (quando chega em X% do limite).
- **Categorização automática** pela descrição da transação.
- **Import recorrente** (ex.: sincronizar com extrato via OFX).
- **Relatórios visuais** no PWA (gráficos de pizza, linhas).
- **Multi-dispositivo** (hoje 1 JWT por vez?).
- **Idiomas** (pós validação em PT-BR).

### 📌 Observações operacionais
- Para publicar o app no Google (sair de Testing), termos/política já estão prontos. Só submeter.
- Refresh tokens do Google em Testing duram 7 dias (reconectar); em Production, permanentes.
- Logs `[audit]` são emitidos em stdout — o provedor de hospedagem (Coolify) deve capturá-los.

---

## Riscos & observações
- **Maior risco:** a transição de "fatura computada" → "fatura materializada". Como pode resetar, mitigado.
- **Gray area remanescente (não bloqueante):** definir se pagamento de fatura **deve** abater o saldo em dinheiro (hoje é só uma despesa `pix`). Recomendação: sim, e o `registerPayment` fará isso explicitamente.
- **Multi-usuário** deixado de fora deliberadamente; quando virar requisito, voltamos ao schema de `accounts`.

### Decisão de plataforma WhatsApp (Evolution API vs Baileys)
**Contexto:** Evolution API 2.3.6 é o middleman atual (gerencia instância, reconexão, fila de envio, webhooks). Com o lançamento do "Evolution Go" pela equipe, há incerteza sobre quanto tempo a versão open-source continuará ativa/manutenida.

**Decisão atual: MANTER Evolution API 2.3.6.** Não migrar agora.
- Motivo: está rodando, estável, com manager UI e HTTP API completa. Migrar agora é custo alto sem retorno claro.
- Gatilhos para reavaliar migração:
  - Evolution 2.3.6 quebrar de forma irrecuperável.
  - Produto escalar para 10+ clientes (onde o isolamento e controle nativo viram vantagem).
  - Evolution Go cobrar/prender features essenciais.

**Alternativas avaliadas (registrar, não implementar):**
1. **Baileys direto via npm** (recomendado se migrar): é a lib que a própria Evolution usa por baixo dos panos. Vantagem: sem middleman, controle 100% da auth do webhook (interno, HMAC puro, sem configuração manual). Desvantagem: você reimplementa reconexão, fila de envio, persistência de sessão, retries — trabalho estimado em 1-2 semanas pra igualar o que a Evolution dá pronto.
2. **Clonar Evolution pro repo do Torrinco**: controle total do código, pode patchear auth. Desvantagem: herda manutenção de projeto grande, merge de updates upstream é trabalhoso. Não recomendado.
3. **Migrar pra Evolution Go**: versão oficial atualizada, suporte. Desvantagem: pode ser pago, mudanças de API, mesma incerteza de licença. Avaliar quando sair detalhes de pricing.

**Independente da plataforma:** o buraco de webhook auth é o mesmo — precisa de segredo compartilhado entre emissor (Evolution/Baileys) e receptor (Torrinco). A Evolution atual torna isso manual (você configura o header no webhook dela); com Baileys seria automático (gerado no código).

**Princípio:** estabilizar o produto vendável primeiro; migração de plataforma WhatsApp é decisão separada, disparada por requisito real, não por FOMO de versão nova.
