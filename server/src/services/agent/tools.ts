import type { ChatCompletionFunctionTool } from 'openai/resources/chat/completions';
import * as agent from '../agent.service.js';

/**
 * Ferramentas (function-calling) que o LLM pode invocar.
 *
 * Cada entrada é um par (declaração OpenAI + executor). O executor chama os
 * services diretamente — sem HTTP — usando o userId do dono do telefone.
 *
 * Os schemas (parameters) são escritos em PT-BR para o modelo entender a
 * intenção a partir da linguagem natural do usuário.
 */

export interface ToolDefinition {
  /** Declaração no formato esperado pela OpenAI. */
  declaration: ChatCompletionFunctionTool;
  /** Executor que recebe o userId e os argumentos já parseados. */
  execute: (userId: number, args: Record<string, any>) => Promise<any>;
}

export const TOOLS: ToolDefinition[] = [
  {
    declaration: {
      type: 'function',
      function: {
        name: 'registrar_despesa',
        description: 'Registra uma despesa/gasto. Use quando o usuário informar que gastou comprou ou pagou algo. Suporta parcelamento no cartão e recorrência.',
        parameters: {
          type: 'object',
          properties: {
            descricao: { type: 'string', description: 'Descrição do gasto, ex: "Mercado", "Celular", "Vivo"' },
            valor: { type: 'number', description: 'Valor total em reais. Para parcelamento, informe o valor TOTAL, não o da parcela.' },
            cartao: { type: 'string', description: 'Nome do cartão de CRÉDITO (opcional). Se informado, a despesa vai no cartão de crédito. Ex: "Nubank", "Itaú". Não use para pix, dinheiro ou débito.' },
            forma_pagamento: { type: 'string', enum: ['pix', 'dinheiro', 'debito', 'credito'], description: 'Forma de pagamento. Use "pix" ou "dinheiro" para pagamentos à vista em dinheiro/pix/transferência. Use "debito" para cartão de débito. NÃO preencha se usar o campo "cartao" (crédito).' },
            categoria: { type: 'string', description: 'Categoria opcional. Ex: "Alimentação", "Transporte", "Contas".' },
            parcelas: { type: 'number', description: 'Número de parcelas (opcional, só para cartão). Se >1, cria compra parcelada.' },
            recorrente: {
              type: 'object',
              description: 'Use quando o usuário disser que é todo mês/semana/ano. Define a recorrência.',
              properties: {
                frequencia: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'yearly'], description: 'Frequência da recorrência.' }
              }
            },
            data: { type: 'string', description: 'Data no formato YYYY-MM-DD (opcional, default hoje).' }
          },
          required: ['descricao', 'valor']
        }
      }
    },
    execute: (userId, args) => agent.registerExpense(userId, {
      description: args.descricao,
      amount: Number(args.valor),
      card_name: args.cartao,
      payment_method: args.forma_pagamento,
      category: args.categoria,
      date: args.data,
      installments: args.parcelas,
      recurring: args.recorrente
        ? { frequency: args.recorrente.frequencia }
        : undefined
    })
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'registrar_receita',
        description: 'Registra uma receita/entrada de dinheiro. Use quando o usuário informar que recebeu um valor (salário, venda, pix recebido).',
        parameters: {
          type: 'object',
          properties: {
            descricao: { type: 'string', description: 'Descrição, ex: "Salário", "Venda", "Pix do João"' },
            valor: { type: 'number', description: 'Valor em reais.' },
            categoria: { type: 'string', description: 'Categoria opcional.' },
            recorrente: {
              type: 'object',
              description: 'Use para receitas fixas mensais (ex: salário).',
              properties: {
                frequencia: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'yearly'] }
              }
            },
            data: { type: 'string', description: 'Data YYYY-MM-DD (opcional).' }
          },
          required: ['descricao', 'valor']
        }
      }
    },
    execute: (userId, args) => agent.registerIncome(userId, {
      description: args.descricao,
      amount: Number(args.valor),
      category: args.categoria,
      date: args.data,
      recurring: args.recorrente ? { frequency: args.recorrente.frequencia } : undefined
    })
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'consultar_saldo',
        description: 'Consulta o saldo e resumo financeiro do mês atual. Use quando o usuário perguntar sobre saldo, quanto gastou, quanto tem, resumo do mês.',
        parameters: { type: 'object', properties: {} }
      }
    },
    execute: (userId) => agent.getBalance(userId)
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'previsao',
        description: 'Mostra a previsão financeira do próximo mês (receitas, despesas e faturas previstas). Use quando o usuário perguntar sobre o próximo mês ou previsão.',
        parameters: { type: 'object', properties: {} }
      }
    },
    execute: (userId) => agent.getForecastForAgent(userId)
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'proximos_vencimentos',
        description: 'Lista os próximos vencimentos: contas recorrentes e faturas de cartão a vencer. Use quando o usuário perguntar o que vence, o que tem que pagar, contas do mês.',
        parameters: { type: 'object', properties: {} }
      }
    },
    execute: (userId) => agent.getUpcoming(userId)
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'pagar_fatura',
        description: 'Registra o pagamento da fatura atual de um cartão de crédito. Use quando o usuário disser que pagou a fatura de um cartão.',
        parameters: {
          type: 'object',
          properties: {
            cartao: { type: 'string', description: 'Nome do cartão. Ex: "Nubank".' }
          },
          required: ['cartao']
        }
      }
    },
    execute: (userId, args) => agent.payCardBill(userId, String(args.cartao))
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'consultar_fatura',
        description: 'Mostra os detalhes da fatura atual de um cartão (compras e total). Use quando o usuário perguntar sobre a fatura de um cartão específico.',
        parameters: {
          type: 'object',
          properties: {
            cartao: { type: 'string', description: 'Nome do cartão.' }
          },
          required: ['cartao']
        }
      }
    },
    execute: (userId, args) => agent.getCardBill(userId, String(args.cartao))
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'listar_cartoes',
        description: 'Lista todos os cartões de crédito e contas bancárias do usuário. Use quando o usuário perguntar "quais são meus cartões?" ou precisar saber as opções antes de escolher onde registrar.',
        parameters: { type: 'object', properties: {} }
      }
    },
    execute: (userId) => agent.listCards(userId)
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'excluir_transacao',
        description: 'Exclui (apaga) uma transação. Use quando o usuário pedir para apagar, deletar ou remover um gasto/receita. SEMPRE confirme com o usuário antes de excluir.',
        parameters: {
          type: 'object',
          properties: {
            ultima: { type: 'boolean', description: 'Use true para excluir a transação mais recente.' },
            descricao: { type: 'string', description: 'Parte da descrição para encontrar a transação (ex: "mercado").' },
            id: { type: 'number', description: 'ID direto da transação (quando o usuário souber).' }
          }
        }
      }
    },
    execute: (userId, args) => agent.deleteTransaction(userId, {
      id: args.id ? Number(args.id) : undefined,
      ultima: args.ultima === true,
      descricao: args.descricao
    })
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'editar_transacao',
        description: 'Edita uma transação existente. Permite alterar descrição, valor, data, categoria ou forma de pagamento. Use quando o usuário pedir para corrigir ou alterar um registro.',
        parameters: {
          type: 'object',
          properties: {
            ultima: { type: 'boolean', description: 'Use true para editar a transação mais recente.' },
            descricao: { type: 'string', description: 'Parte da descrição para encontrar a transação (ex: "mercado").' },
            nova_descricao: { type: 'string', description: 'Nova descrição.' },
            novo_valor: { type: 'number', description: 'Novo valor em reais.' },
            nova_data: { type: 'string', description: 'Nova data no formato YYYY-MM-DD.' },
            nova_categoria: { type: 'string', description: 'Nova categoria.' },
            nova_forma_pagamento: { type: 'string', enum: ['pix', 'dinheiro', 'debito', 'credito'], description: 'Nova forma de pagamento.' }
          }
        }
      }
    },
    execute: (userId, args) => agent.editTransaction(userId, {
      ultima: args.ultima === true,
      descricao: args.descricao,
      nova_descricao: args.nova_descricao,
      novo_valor: args.novo_valor !== undefined ? Number(args.novo_valor) : undefined,
      nova_data: args.nova_data,
      nova_categoria: args.nova_categoria,
      nova_forma_pagamento: args.nova_forma_pagamento
    })
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'relatorio_categoria',
        description: 'Gera um relatório de gastos por categoria. Use quando o usuário perguntar quanto gastou com algo ou pedir um resumo de gastos. Ex: "quanto gastei com mercado?", "meus gastos por categoria", "gastos de junho".',
        parameters: {
          type: 'object',
          properties: {
            categoria: { type: 'string', description: 'Categoria específica para filtrar (ex: "mercado", "transporte"). Se omitido, agrupa todas.' },
            periodo: { type: 'string', enum: ['mes', 'mes_passado', 'ano'], description: 'Período do relatório. "mes" = mês atual, "mes_passado" = mês anterior, "ano" = ano atual. Default: "mes".' }
          }
        }
      }
    },
    execute: (userId, args) => agent.getReportByCategory(userId, {
      categoria: args.categoria,
      periodo: args.periodo
    })
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'adicionar_lembrete',
        description: 'Cria um lembrete que será disparado no WhatsApp no horário especificado. Use para tarefas rápidas (tomar remédio, tirar lixo, checar algo).',
        parameters: {
          type: 'object',
          properties: {
            conteudo: { type: 'string', description: 'O que lembrar (ex: "Tomar remédio", "Tirar o lixo").' },
            horario: { type: 'string', description: 'Horário no formato HH:mm (24h). Ex: "14:30", "09:00".' },
            frequencia: { type: 'string', enum: ['once', 'daily', 'weekly', 'monthly'], description: 'Frequência. "once" = uma vez, "daily" = todo dia, "weekly" = toda semana, "monthly" = todo mês. Default: "once".' },
            data: { type: 'string', description: 'Data no formato YYYY-MM-DD (para "once" ou dia do mês para "monthly").' },
            dia_semana: { type: 'string', enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], description: 'Dia da semana (para "weekly").' }
          },
          required: ['conteudo', 'horario']
        }
      }
    },
    execute: (userId, args) => agent.createReminder(userId, {
      conteudo: args.conteudo,
      horario: args.horario,
      frequencia: args.frequencia,
      data: args.data,
      dia_semana: args.dia_semana
    })
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'listar_lembretes',
        description: 'Lista os lembretes ativos do usuário. Use quando o usuário perguntar "quais são meus lembretes?" ou "o que eu preciso lembrar?".',
        parameters: { type: 'object', properties: {} }
      }
    },
    execute: (userId) => agent.listReminders(userId)
  },

  {
    declaration: {
      type: 'function',
      function: {
        name: 'excluir_lembrete',
        description: 'Exclui um lembrete ativo. Use quando o usuário pedir para cancelar ou apagar um lembrete.',
        parameters: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'ID do lembrete.' },
            conteudo: { type: 'string', description: 'Parte do conteúdo para encontrar o lembrete (ex: "remédio").' }
          }
        }
      }
    },
    execute: (userId, args) => agent.deleteReminder(userId, {
      id: args.id ? Number(args.id) : undefined,
      conteudo: args.conteudo
    })
  }
];

/** Mapa nome → executor, para lookup rápido ao processar tool_calls. */
export const TOOL_EXECUTORS = new Map(TOOLS.map(t => [t.declaration.function.name, t.execute]));

/** Declarações no formato que o método chatWithTools espera. */
export const TOOL_DECLARATIONS = TOOLS.map(t => t.declaration);
