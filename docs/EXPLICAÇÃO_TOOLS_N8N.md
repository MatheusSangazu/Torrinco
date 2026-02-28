# Documentação das Tools do n8n (Agente Financeiro)

Este documento explica detalhadamente cada nó dos fluxos criados para o agente financeiro no n8n.

## 🔐 Autenticação Segura (Fluxo de Login)

Para garantir segurança máxima, o n8n realizará o login a cada execução para obter um token temporário. Isso evita o uso de tokens de longa duração que podem ser vazados.

### Variáveis de Ambiente Necessárias no n8n
Você deve configurar as seguintes variáveis no n8n (Credentials ou Environment Variables):
- `API_URL`: A URL base da sua API (ex: `http://localhost:3001` ou URL de produção)
- `API_USER_PHONE`: O telefone do usuário admin (usado para login)
- `API_PASSWORD`: A senha do usuário admin

---

## 1. Tool - Registrar Transação

Esta tool é responsável por receber dados de uma transação (despesa ou receita) e registrá-la na API do Torrinco.

### Nó: Execute Workflow Trigger
- **Tipo:** Gatilho inicial
- **Função:** Recebe os dados de entrada quando a tool é chamada pelo agente principal.
- **Entradas Esperadas:**
  - `valor`: Valor da transação (obrigatório)
  - `tipo`: 'despesa' ou 'receita' (obrigatório)
  - `descricao`: Descrição da transação
  - `categoria`: Nome da categoria
  - `forma_pagamento`: 'pix', 'cartao_credito', etc.
  - `cartao_id`: ID do cartão (se for cartão de crédito)
  - `parcelas`: Número de parcelas (se parcelado)
  - `recorrente`: true/false (se for assinatura)
  - `target_user_id`: (Opcional) ID do usuário para quem a transação será registrada (apenas se o login for Admin).

### Nó: Validar Input (Code)
- **Tipo:** JavaScript Code
- **Função:** Verifica se os dados recebidos são válidos antes de chamar a API.
- **Validações:**
  - Valor deve ser positivo.
  - Tipo deve ser 'despesa' ou 'receita'.
  - Se for cartão, exige `cartao_id`.
  - Se tiver parcelas, exige que seja cartão de crédito.

### Nó: Login API (HTTP Request)
- **Tipo:** Requisição HTTP (POST)
- **Endpoint:** `/api/auth/login`
- **Função:** Autentica com telefone/senha para obter um token JWT fresco.

### Nó: Criar Transação (HTTP Request)
- **Tipo:** Requisição HTTP (POST)
- **Endpoint:** `/api/finance/transactions`
- **Função:** Envia os dados validados para a API criar a transação.
- **Autenticação:** Usa o token obtido no passo anterior.
- **Lógica:** Mapeia os campos do input para o corpo da requisição JSON esperado pela API.

### Nó: Formatar Resposta (Code)
- **Tipo:** JavaScript Code
- **Função:** Recebe a resposta da API e cria uma mensagem amigável para o usuário.
- **Saída:** Texto formatado (ex: "✅ Despesa de R$ 50,00 registrada com sucesso!").

---

## 2. Tool - Consultar Resumo Financeiro

Esta tool busca o saldo atual, receitas, despesas e a previsão para o próximo mês.

### Nó: Execute Workflow Trigger
- **Função:** Inicia o fluxo (sem parâmetros obrigatórios).

### Nó: Login API (HTTP Request)
- **Função:** Autentica e obtém token novo.

### Nó: Obter Resumo (HTTP Request)
- **Endpoint:** `/api/finance/summary`
- **Autenticação:** Usa o token obtido.
- **Função:** Busca o saldo atual e totais do mês corrente. Aceita `target_user_id` na query string se for admin.

### Nó: Obter Previsão (HTTP Request)
- **Endpoint:** `/api/finance/forecast`
- **Autenticação:** Usa o token obtido.
- **Função:** Busca a previsão financeira para o próximo mês (faturas futuras, recorrências).

### Nó: Formatar Resposta (Code)
- **Função:** Combina os dados de Resumo e Previsão em uma única mensagem de texto formatada com emojis e valores monetários (R$).

---

## 3. Tool - Listar Categorias

Esta tool ajuda o agente a saber quais categorias existem no sistema para classificar corretamente as transações.

### Nó: Execute Workflow Trigger
- **Função:** Inicia o fluxo.

### Nó: Login API (HTTP Request)
- **Função:** Autentica e obtém token novo.

### Nó: Obter Categorias (HTTP Request)
- **Endpoint:** `/api/categories`
- **Autenticação:** Usa o token obtido.
- **Função:** Busca a lista de todas as categorias cadastradas.

### Nó: Formatar Resposta (Code)
- **Função:** Transforma o array de objetos JSON em uma lista de texto simples (bullet points) para que o modelo de IA possa ler e escolher a categoria correta.
