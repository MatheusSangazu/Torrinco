# Torrinco — Funcionalidades Implementadas

Documento para a equipe de Landing Page. Cada item abaixo está **funcional em produção**.

---

## Posicionamento

**Torrinco** é um assistente financeiro pessoal que mora no seu WhatsApp.
Você conversa como se fosse um amigo controlando suas contas: ele entende,
registra, consulta e te avisa. Também tem um app web (PWA) pra quem prefere
tela grande.

**Diferencial:** o único que junta IA conversacional + finanças + agenda num
só lugar, pelo canal que o brasileiro já usa todo dia.

---

## 1. Assistente no WhatsApp (por IA)

O coração do produto. O usuário manda mensagem natural e a IA executa.

### 1.1 Linguagem natural (exemplos reais que funcionam)
- "gastei 50 no mercado" → registra despesa
- "recebi meu salário de 3500" → registra receita
- "comprei um celular de 2400 no nubank em 12x" → cria parcelamento
- "quanto gastei esse mês?" → relatório
- "qual a fatura do nubank?" → detalhe da fatura
- "paguei a fatura do nubank" → quita fatura
- "meus eventos de amanhã" → agenda do Google
- "cria um evento dentista amanhã 14h" → agenda no Google Calendar

### 1.2 Mídias suportadas
- **Texto:** comando direto
- **Áudio:** transcrição automática (Whisper) → executa o comando
- **Imagem:** o agente descreve e interpreta (ex: foto do comprovante Pix)
- **Documentos:** importação automática de **PDF, Excel (.xlsx/.xls) e CSV**
  - Enviou a fatura do Nubank em PDF? Ele importa todas as transações
  - Enviou a planilha do banco? Ele classifica e registra

### 1.3 Funções que a IA executa (18 comandos)

| Categoria | O que faz |
|-----------|-----------|
| **Registrar despesa** | Por texto/áudio/foto. Suporta cartão, Pix, débito, dinheiro |
| **Parcelamento** | "em 12x" → cria compra parcelada vinculada ao cartão |
| **Recorrência** | "todo mês" → cria transação recorrente (ex: aluguel, streaming) |
| **Registrar receita** | Salário, vendas, Pix recebido. Com opção recorrente |
| **Consultar saldo** | Resumo do mês: receitas, despesas, saldo |
| **Previsão próximo mês** | Projeta receitas, despesas e faturas previstas |
| **Próximos vencimentos** | Lista contas e faturas que vencem |
| **Pagar fatura** | Quita fatura de cartão com 1 mensagem |
| **Consultar fatura** | Detalhe da fatura atual de qualquer cartão |
| **Listar cartões** | Mostra cartões e contas cadastrados |
| **Editar transação** | "muda o valor do mercado pra 55" |
| **Excluir transação** | "apaga a última compra" |
| **Relatório por categoria** | "quanto gastei com mercado em junho?" |
| **Importar documento** | PDF/Excel/CSV → processa e registra em lote |

### 1.4 Lembretes (tarefas)
- **Criar lembrete:** "me lembra de tomar remédio todo dia 8h"
- **Listar lembretes:** "quais são meus lembretes?"
- **Excluir lembrete:** "cancela o lembrete do remédio"
- Frequências: uma vez, diário, semanal, mensal
- **Disparo automático no WhatsApp** no horário definido

---

## 2. Agenda Google (integração via WhatsApp)

- **Conectar agenda:** o agente manda o link de OAuth, usuário autoriza
- **Criar evento:** título, data, horário, duração, local, convidados
- **Listar eventos:** "minha agenda de hoje", "o que tenho essa semana?"
- **Editar evento:** "muda a reunião pra 15h"
- **Excluir evento:** "cancela a consulta de amanhã"
- **Convidados:** o Google envia convite automaticamente por email

### Notificações proativas de agenda (automáticas)
- **Agenda do dia** às 07h00 da manhã (somente se tiver eventos)
- **Lembrete 15 min antes** de cada evento

---

## 3. App Web (PWA — instalável no celular)

Para quem prefere interface visual. Funciona offline (PWA).

### Páginas
- **Dashboard:** visão geral do mês (saldo, gráficos, atalhos)
- **Transações:** lista, filtra, edita, exclui
- **Cartões:** carrossel de cartões com fatura atual, limite disponível, histórico
- **Relatórios:** gastos por categoria, período
- **Categorias:** personalizáveis com cores
- **Fontes de receita:** organize suas entradas
- **Lembretes:** gerencie tarefas
- **Agenda:** visualização calendário

### Recursos do PWA
- **Instalável** no celular (ícone na tela inicial, abre em tela cheia)
- **Login com telefone + senha**
- **Recuperação de senha** por código via WhatsApp
- **Primeiro acesso** com validação por código

---

## 4. Gestão de Cartões de Crédito (destaque)

- Cadastro de cartão com **dia de fechamento** e **dia de vencimento**
- **Fatura automática** por ciclo de fechamento
- Visualização de fatura **atual, anterior e futura**
- **Pagamento de fatura** (com transação vinculada — sem duplicação)
- **Desfazer pagamento** de fatura
- **Histórico** de faturas dos últimos meses
- Limite disponível calculado em tempo real

---

## 5. Compras Parceladas

- "comprei uma TV de 2400 no nubank em 12x"
- Cria as 12 transações automaticamente, uma por mês
- Acompanha parcelas pagas vs pendentes
- Cancela parcelamento quando precisar

---

## 6. Transações Recorrentes

- "meu aluguel de 1500 vence dia 10 todo mês"
- Cria o template; o sistema **gera a transação automaticamente** no vencimento
- Funciona para receitas (salário) e despesas (contas fixas)
- Pausar / cancelar quando quiser

---

## 7. Segurança e LGPD (mostrar na LP)

- **Política de Privacidade** e **Termos de Serviço** em conformidade com LGPD
- Dados **criptografados** (senhas com bcrypt, tokens JWT)
- **Portabilidade:** exporta todos os seus dados em JSON
- **Direito ao esquecimento:** exclui/anonimiza a conta a qualquer momento
- **Rate limiting** (proteção contra abuso)
- **Logs de auditoria** para operações sensíveis
- OpenAI configurada para **não treinar** com seus dados

---

## 8. Multi-conta (pronto para escalar)

- Cada usuário tem sua conta isolada
- **Cadastro automático:** novo telefone manda mensagem no WhatsApp e já começa
  a usar (quando o dono ativar o auto-onboarding)
- Trial → ativo → bloqueio de conta cancelada em até 1h

---

## Como o usuário começa (onboarding)

1. **Manda "oi" no WhatsApp** do Torrinco
2. O assistente cria a conta automaticamente (trial)
3. Já pode registrar gastos, cadastrar cartões, etc.
4. Para usar a agenda do Google, é só pedir "conecta minha agenda"

---

## Stack técnica (para a equipe técnica, se precisar)

- **Backend:** Node.js + Express + Prisma + MySQL
- **IA:** OpenAI (GPT-4 com function calling)
- **WhatsApp:** Evolution API
- **Frontend:** React + Vite (PWA)
- **Agenda:** Google Calendar API (OAuth2)
- **Hospedagem:** Coolify (auto-hospedado)

---

_Documento gerado em 28/06/2026. Para dúvidas sobre funcionalidades, validar
com o desenvolvedor (Matheus) antes de publicar na LP._
