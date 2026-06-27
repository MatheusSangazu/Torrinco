
import { RecurringController } from './src/controllers/recurring.controller';
import { prisma } from './src/lib/prisma';
import { Request, Response } from 'express';

// Mock do Request e Response
const req = {
  body: {
    description: 'Teste Salario',
    amount: 1000,
    type: 'income',
    frequency: 'monthly',
    start_date: '2026-03-03', // Data que o usuário disse que selecionou
    payment_method: 'pix'
  },
  userId: 1 // Assumindo ID 1 para teste
} as any;

const res = {
  status: (code: number) => ({
    json: (data: any) => {
      console.log(`Response Status: ${code}`);
      console.log('Response Data:', JSON.stringify(data, null, 2));
      return res;
    }
  }),
  json: (data: any) => {
    console.log('Response Data:', JSON.stringify(data, null, 2));
    return res;
  }
} as any;

const next = (err: any) => {
  console.error('Error:', err);
};

// Mock do Prisma para evitar gravar no banco real se possível, 
// ou apenas deixar gravar e ver o log (mas precisa de conexão com banco).
// Como não tenho acesso ao banco real facilmente sem credenciais e ambiente configurado,
// vou confiar nos logs do console que adicionei no controller.
// Mas para rodar esse script, preciso que o ambiente esteja configurado.
// O ambiente <env> diz que estou no windows.
// Vou tentar rodar usando ts-node ou similar se disponível, ou compilar e rodar.

async function run() {
  console.log('--- Iniciando Teste de Simulação ---');
  try {
    await RecurringController.createTransaction(req, res, next);
  } catch (e) {
    console.error(e);
  }
}

run();
