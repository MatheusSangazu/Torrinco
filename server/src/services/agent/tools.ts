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
            cartao: { type: 'string', description: 'Nome do cartão (opcional). Se informado, a despesa vai no cartão. Ex: "Nubank", "Itaú".' },
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
  }
];

/** Mapa nome → executor, para lookup rápido ao processar tool_calls. */
export const TOOL_EXECUTORS = new Map(TOOLS.map(t => [t.declaration.function.name, t.execute]));

/** Declarações no formato que o método chatWithTools espera. */
export const TOOL_DECLARATIONS = TOOLS.map(t => t.declaration);
