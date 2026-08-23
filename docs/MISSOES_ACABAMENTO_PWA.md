# Missões de acabamento do PWA

Plano complementar ao acompanhamento em
[`refatoracaoMissoes.md`](./refatoracaoMissoes.md), criado a partir da revisão
do comportamento responsivo e da experiência instalada do Torrinco.

## Objetivo

Fazer o PWA se comportar como aplicativo em Android e iOS, sem cortes por
notch ou teclado, zoom involuntário, rolagem da página atrás de diálogos ou
controles difíceis de tocar. O zoom manual deve continuar disponível por
acessibilidade.

## Legenda

- `[ ]` Não iniciada
- `[-]` Em andamento
- `[x]` Concluída e validada

## Missão 6 — Viewport, altura dinâmica e áreas seguras

Status: **concluída em 2026-08-23**.

- [x] Adicionar `viewport-fit=cover` sem usar `user-scalable=no` ou
  `maximum-scale=1`.
- [x] Criar variáveis/utilitários globais para `safe-area-inset-top`,
  `right`, `bottom` e `left`.
- [x] Aplicar áreas seguras ao cabeçalho mobile, menu lateral, conteúdo,
  avisos fixos e convite de instalação.
- [x] Substituir alturas baseadas em `100vh`, `h-screen` e `min-h-screen`
  onde houver risco de corte por `dvh`/`svh` com fallback apropriado.
- [x] Garantir que a Agenda, autenticação e estados de carregamento respeitem
  barras do sistema e teclado virtual.
- [x] Ajustar `theme-color` e barra de status para temas claro e escuro.

Critério de conclusão: nenhuma região fixa ou tela cheia fica atrás de notch,
barra de status, indicador de início ou teclado virtual.

## Missão 7 — Toque, rolagem e diálogos mobile

Status: **concluída em 2026-08-23**.

- [x] Aplicar `touch-action: manipulation` a controles interativos sem
  impedir o gesto de pinça para zoom.
- [x] Garantir área de toque mínima de aproximadamente 44 × 44 px em botões,
  ícones, fechamentos, seletores e ações principais.
- [x] Definir comportamento de `overscroll` apropriado para a aplicação
  instalada.
- [x] Bloquear a rolagem da página ao abrir menu lateral ou diálogo.
- [x] Padronizar diálogos com altura máxima dinâmica e rolagem interna.
- [x] Preparar formulários e botões dos diálogos para o teclado virtual aberto.
- [x] Preservar foco, fechamento por `Escape` e retorno do foco
  ao elemento que abriu o diálogo.

Critério de conclusão: toque duplo não provoca zoom acidental, todos os
controles são confortáveis de tocar e nenhum conteúdo de diálogo fica
inacessível.

## Missão 8 — Instalação e acabamento de aplicativo

Status: **concluída em 2026-08-23**.

- [x] Manter o convite de instalação do Chromium e criar orientação específica
  para Safari/iOS: “Compartilhar → Adicionar à Tela de Início”.
- [x] Tornar a dispensa do convite reversível e evitar insistência excessiva.
- [x] Usar `apple-touch-icon` com fundo sólido e validar os recortes dos ícones
  `any` e `maskable`.
- [x] Conferir nome, cores, orientação, `start_url`, `scope` e modo
  `standalone` no manifest final.
- [x] Substituir o `confirm()` nativo de atualização por uma comunicação visual
  integrada à interface.
- [x] Evitar sobreposição entre cabeçalho, aviso offline, notificações e
  convite de instalação.
- [x] Confirmar no build que links internos e recarregamentos permanecem dentro da
  experiência standalone.

Critério de conclusão: instalação, abertura, atualização e modo offline básico
parecem parte do Torrinco, sem elementos visuais inesperados do navegador.

## Missão 9 — Validação responsiva e instalada

Status: **em andamento — validação manual em aparelhos pendente**.

- [ ] Validar larguras de 360 px, 390 px, 430 px, 768 px e 1366 px.
- [ ] Validar orientação retrato e paisagem onde aplicável.
- [ ] Validar temas claro e escuro.
- [ ] Validar Chrome/Android instalado e Safari/iOS instalado em aparelho real
  ou simulador confiável.
- [ ] Testar login, Início, Transações, Cartões, Relatórios, Agenda e os
  principais diálogos com teclado aberto.
- [ ] Confirmar ausência de zoom ao focar campos e ao tocar rapidamente em
  controles, preservando o zoom manual por pinça.
- [ ] Testar inicialização online, inicialização offline, retorno da conexão,
  atualização do service worker e abertura por rota interna.
- [x] Registrar evidências, problemas encontrados e correções realizadas.
- [x] Executar testes, TypeScript, lint e build completo após os ajustes.

Critério de conclusão: todos os cenários passam nos tamanhos e ambientes
definidos, sem regressão funcional ou de acessibilidade.

## Ordem recomendada

1. Missão 6, pois define a base geométrica das telas.
2. Missão 7, que padroniza interação e diálogos sobre essa base.
3. Missão 8, com os detalhes de instalação e acabamento visual.
4. Missão 9, para validar o conjunto e registrar a entrega.

## Restrições de acessibilidade e segurança

- Não bloquear zoom manual por meta viewport.
- Não armazenar dados financeiros sensíveis no cache do service worker.
- Não transformar falhas de rede em valores financeiros zerados.
- Não remover foco visível, navegação por teclado ou semântica dos diálogos.

## Registro de execução

- 2026-08-23: Missões 6, 7 e 8 implementadas. O layout passou a usar
  `viewport-fit=cover`, `dvh`, áreas seguras, alvos de toque para ponteiro
  grosseiro, bloqueio de rolagem e diálogos com foco controlado. O convite de
  instalação cobre Chromium e Safari/iOS, a dispensa expira em 14 dias e a
  atualização do service worker usa um aviso integrado à interface.
- 2026-08-23: o `apple-touch-icon` passou a usar o ativo `maskable` com fundo
  sólido. O manifest de produção foi conferido em modo `standalone` e o service
  worker preserva navegação por rotas internas sem criar cache de respostas da
  API financeira.
- 2026-08-23: validação automatizada aprovada com 23 testes do client, incluindo
  6 testes do contrato PWA, 345 testes do servidor, TypeScript, lint e build de
  produção. O build gerou 56 itens de precache e os arquivos `sw.js` e Workbox.
- Pendente: validação visual e tátil em Android e iOS instalados, nas larguras e
  orientações previstas na Missão 9. Não havia navegador ou aparelho conectado
  à sessão para executar essa etapa com evidência real.
