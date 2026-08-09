/**
 * Testes de validação centralizada com Zod.
 *
 * Cobre: valores negativos indevidos, NaN, IDs de texto, datas impossíveis,
 * campos extras, payload vazio, enums inválidos, strings longas demais.
 *
 * Testa os schemas diretamente (não precisa de Express/Prisma).
 */
import { describe, it, expect } from 'vitest';
import {
  authSchemas,
  financeSchemas,
  recurringSchemas,
  cardSchemas,
  categorySchemas,
  entitySchemas,
  incomeSourceSchemas,
  budgetSchemas,
  installmentSchemas,
  reminderSchemas,
  calendarSchemas,
  agentSchemas,
  commonSchemas,
} from '../src/schemas/index.js';

// Helper: retorna true se o schema aceita o payload.
function accepts(schema: any, data: any): boolean {
  return schema.safeParse(data).success;
}

// Helper: retorna os detalhes de erro.
function getErrors(schema: any, data: any): Array<{ field: string; message: string }> {
  const result = schema.safeParse(data);
  if (result.success) return [];
  return result.error.issues.map((i: any) => ({ field: i.path.join('.'), message: i.message }));
}

// ─────────────────────────────────────────────────────────────────

describe('1. Auth — validações', () => {
  describe('login', () => {
    it('aceita payload válido', () => {
      expect(accepts(authSchemas.login, { phone_number: '5511999999999', password: '123456' })).toBe(true);
    });

    it('rejeita payload vazio', () => {
      expect(accepts(authSchemas.login, {})).toBe(false);
    });

    it('rejeita senha muito curta (mas login aceita — min 1)', () => {
      // login aceita password min(1); apenas verifica que rejeita vazio
      expect(accepts(authSchemas.login, { phone_number: '5511', password: '' })).toBe(false);
    });

    it('rejeita phone_number ausente', () => {
      expect(accepts(authSchemas.login, { password: '123456' })).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('rejeita nova senha com menos de 8 caracteres', () => {
      expect(accepts(authSchemas.resetPassword, {
        phone_number: '5511', code: '123456', new_password: 'ab1234',
      })).toBe(false);
    });

    it('aceita nova senha com 8+ caracteres', () => {
      expect(accepts(authSchemas.resetPassword, {
        phone_number: '5511', code: '123456', new_password: 'senha123',
      })).toBe(true);
    });

    it('rejeita código não numérico', () => {
      expect(accepts(authSchemas.resetPassword, {
        phone_number: '5511', code: 'abcdef', new_password: 'senha123',
      })).toBe(false);
    });

    it('rejeita código com menos de 6 dígitos', () => {
      expect(accepts(authSchemas.resetPassword, {
        phone_number: '5511', code: '12345', new_password: 'senha123',
      })).toBe(false);
    });

    it('rejeita campos extras (.strict)', () => {
      expect(accepts(authSchemas.resetPassword, {
        phone_number: '5511', code: '123456', new_password: 'senha123', HACK: true,
      })).toBe(false);
    });
  });

  describe('createPassword', () => {
    it('rejeita senha < 8 chars', () => {
      expect(accepts(authSchemas.createPassword, {
        phone_number: '5511', code: '123456', password: 'ab',
      })).toBe(false);
    });

    it('aceita senha válida com 8+ caracteres', () => {
      expect(accepts(authSchemas.createPassword, {
        phone_number: '5511', code: '123456', password: 'senha123',
        accept_terms: true, accept_privacy: true,
      })).toBe(true);
    });

    it('rejeita cadastro sem aceite explícito dos documentos legais', () => {
      expect(accepts(authSchemas.createPassword, {
        phone_number: '5511', code: '123456', password: 'senha123',
      })).toBe(false);
    });
  });

  describe('createUser', () => {
    it('rejeita email inválido', () => {
      expect(accepts(authSchemas.createUser, {
        name: 'Teste', phone_number: '5511', email: 'not-an-email',
      })).toBe(false);
    });

    it('rejeita campos extras (.strict)', () => {
      expect(accepts(authSchemas.createUser, {
        name: 'Teste', phone_number: '5511', role: 'admin',
      })).toBe(false);
    });

    it('aceita payload válido sem email', () => {
      expect(accepts(authSchemas.createUser, {
        name: 'Teste', phone_number: '5511',
      })).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('rejeita role arbitrário', () => {
      expect(accepts(authSchemas.updateUser, { role: 'superadmin' })).toBe(false);
    });

    it('aceita role válido', () => {
      expect(accepts(authSchemas.updateUser, { role: 'member' })).toBe(true);
    });
  });
});

// ─────────────────────────────────────────────────────────────────

describe('2. Finance — validações', () => {
  describe('create', () => {
    const valid = { amount: 100, type: 'expense', transaction_date: '2025-01-15' };

    it('aceita payload válido', () => {
      expect(accepts(financeSchemas.create, valid)).toBe(true);
    });

    it('rejeita valor negativo', () => {
      expect(accepts(financeSchemas.create, { ...valid, amount: -50 })).toBe(false);
    });

    it('rejeita NaN como valor', () => {
      expect(accepts(financeSchemas.create, { ...valid, amount: NaN })).toBe(false);
    });

    it('rejeita tipo arbitrário', () => {
      expect(accepts(financeSchemas.create, { ...valid, type: 'transfer' })).toBe(false);
    });

    it('rejeita payload vazio', () => {
      expect(accepts(financeSchemas.create, {})).toBe(false);
    });

    it('rejeita transaction_date vazia', () => {
      expect(accepts(financeSchemas.create, { ...valid, transaction_date: '' })).toBe(false);
    });

    it('aceita string numérica para amount (coerce)', () => {
      expect(accepts(financeSchemas.create, { ...valid, amount: '99.90' })).toBe(true);
    });

    it('rejeita status arbitrário', () => {
      expect(accepts(financeSchemas.create, { ...valid, status: 'maybe' })).toBe(false);
    });

    it('rejeita payment_method arbitrário', () => {
      expect(accepts(financeSchemas.create, { ...valid, payment_method: 'crypto' })).toBe(false);
    });
  });

  describe('update', () => {
    it('aceita category_id null (limpar)', () => {
      expect(accepts(financeSchemas.update, { category_id: null })).toBe(true);
    });

    it('rejeita category_id negativo', () => {
      expect(accepts(financeSchemas.update, { category_id: -1 })).toBe(false);
    });

    it('rejeita category_id como texto não-numérico', () => {
      expect(accepts(financeSchemas.update, { category_id: 'abc' })).toBe(false);
    });
  });

  describe('idParams', () => {
    it('aceita ID positivo', () => {
      expect(accepts(commonSchemas.idParams, { id: 42 })).toBe(true);
    });

    it('aceita ID como string numérica', () => {
      expect(accepts(commonSchemas.idParams, { id: '42' })).toBe(true);
    });

    it('rejeita ID de texto', () => {
      expect(accepts(commonSchemas.idParams, { id: 'abc' })).toBe(false);
    });

    it('rejeita ID negativo', () => {
      expect(accepts(commonSchemas.idParams, { id: -5 })).toBe(false);
    });

    it('rejeita ID zero', () => {
      expect(accepts(commonSchemas.idParams, { id: 0 })).toBe(false);
    });

    it('rejeita ID decimal', () => {
      expect(accepts(commonSchemas.idParams, { id: 3.14 })).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────────

describe('3. Recurring — validações', () => {
  const valid = {
    description: 'Aluguel', amount: 1500, type: 'expense',
    frequency: 'monthly', start_date: '2025-01-01',
  };

  it('aceita payload válido', () => {
    expect(accepts(recurringSchemas.create, valid)).toBe(true);
  });

  it('rejeita frequência inválida', () => {
    expect(accepts(recurringSchemas.create, { ...valid, frequency: 'biweekly' })).toBe(false);
  });

  it('rejeita valor negativo', () => {
    expect(accepts(recurringSchemas.create, { ...valid, amount: -1 })).toBe(false);
  });

  it('rejeita description vazia', () => {
    expect(accepts(recurringSchemas.create, { ...valid, description: '' })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────

describe('4. Cards — validações', () => {
  describe('create', () => {
    const valid = { name: 'Nubank', closing_day: 10, due_day: 20 };

    it('aceita payload válido', () => {
      expect(accepts(cardSchemas.create, valid)).toBe(true);
    });

    it('rejeita closing_day > 31', () => {
      expect(accepts(cardSchemas.create, { ...valid, closing_day: 32 })).toBe(false);
    });

    it('rejeita closing_day = 0', () => {
      expect(accepts(cardSchemas.create, { ...valid, closing_day: 0 })).toBe(false);
    });

    it('rejeita due_day negativo', () => {
      expect(accepts(cardSchemas.create, { ...valid, due_day: -1 })).toBe(false);
    });

    it('rejeita nome vazio', () => {
      expect(accepts(cardSchemas.create, { ...valid, name: '' })).toBe(false);
    });
  });

  describe('update', () => {
    it('aceita closing_day válido', () => {
      expect(accepts(cardSchemas.update, { closing_day: 15 })).toBe(true);
    });

    it('rejeita closing_day > 31', () => {
      expect(accepts(cardSchemas.update, { closing_day: 50 })).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────────

describe('5. Categories — validações', () => {
  it('aceita payload válido', () => {
    expect(accepts(categorySchemas.create, { name: 'Alimentação', type: 'expense' })).toBe(true);
  });

  it('rejeita type arbitrário', () => {
    expect(accepts(categorySchemas.create, { name: 'X', type: 'savings' })).toBe(false);
  });

  it('rejeita nome vazio', () => {
    expect(accepts(categorySchemas.create, { name: '', type: 'income' })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────

describe('6. Entities — validações', () => {
  it('aceita payload válido (bank)', () => {
    expect(accepts(entitySchemas.create, { name: 'Itaú', type: 'bank' })).toBe(true);
  });

  it('aceita payload válido (credit_card)', () => {
    expect(accepts(entitySchemas.create, {
      name: 'Visa', type: 'credit_card', closing_day: 1, due_day: 10,
    })).toBe(true);
  });

  it('rejeita type arbitrário', () => {
    expect(accepts(entitySchemas.create, { name: 'X', type: 'loan' })).toBe(false);
  });

  it('rejeita balance NaN', () => {
    expect(accepts(entitySchemas.create, { name: 'X', type: 'bank', balance: NaN })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────

describe('7. Income Sources — validações', () => {
  it('aceita payload válido', () => {
    expect(accepts(incomeSourceSchemas.create, { name: 'Salário' })).toBe(true);
  });

  it('rejeita nome vazio', () => {
    expect(accepts(incomeSourceSchemas.create, { name: '' })).toBe(false);
  });

  it('rejeita payload vazio', () => {
    expect(accepts(incomeSourceSchemas.create, {})).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────

describe('8. Budgets — validações', () => {
  it('aceita payload válido', () => {
    expect(accepts(budgetSchemas.upsert, { category: 'Alimentação', amount_limit: 500 })).toBe(true);
  });

  it('rejeita amount_limit negativo', () => {
    expect(accepts(budgetSchemas.upsert, { category: 'X', amount_limit: -1 })).toBe(false);
  });

  it('rejeita category vazia', () => {
    expect(accepts(budgetSchemas.upsert, { category: '', amount_limit: 100 })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────

describe('9. Installments — validações', () => {
  const valid = {
    entity_id: 1, description: 'iPhone', amount: 5000,
    installment_count: 10, start_date: '2025-01-01',
  };

  it('aceita payload válido', () => {
    expect(accepts(installmentSchemas.create, valid)).toBe(true);
  });

  it('rejeita installment_count = 0', () => {
    expect(accepts(installmentSchemas.create, { ...valid, installment_count: 0 })).toBe(false);
  });

  it('rejeita installment_count > 120', () => {
    expect(accepts(installmentSchemas.create, { ...valid, installment_count: 121 })).toBe(false);
  });

  it('rejeita amount negativo', () => {
    expect(accepts(installmentSchemas.create, { ...valid, amount: -1 })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────

describe('10. Reminders — validações', () => {
  it('aceita payload válido', () => {
    expect(accepts(reminderSchemas.create, {
      content: 'Pagar conta', trigger_time: '2025-01-15T10:00:00',
    })).toBe(true);
  });

  it('rejeita frequency inválido', () => {
    expect(accepts(reminderSchemas.create, {
      content: 'X', trigger_time: '2025-01-15', frequency: 'hourly',
    })).toBe(false);
  });

  it('rejeita content vazio', () => {
    expect(accepts(reminderSchemas.create, { content: '', trigger_time: '2025-01-15' })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────

describe('11. Calendar — validações', () => {
  it('aceita payload válido', () => {
    expect(accepts(calendarSchemas.create, { title: 'Reunião', event_date: '2025-01-15' })).toBe(true);
  });

  it('rejeita title vazio', () => {
    expect(accepts(calendarSchemas.create, { title: '', event_date: '2025-01-15' })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────

describe('12. Agent — validações', () => {
  it('aceita expense válido', () => {
    expect(accepts(agentSchemas.expense, { description: 'Almoço', amount: 50 })).toBe(true);
  });

  it('rejeita amount negativo', () => {
    expect(accepts(agentSchemas.expense, { description: 'X', amount: -1 })).toBe(false);
  });

  it('rejeita description vazia', () => {
    expect(accepts(agentSchemas.expense, { description: '', amount: 10 })).toBe(false);
  });

  it('aceita income com recurring', () => {
    expect(accepts(agentSchemas.income, {
      description: 'Freela', amount: 2000, recurring: { frequency: 'monthly' },
    })).toBe(true);
  });

  it('rejeita recurring com frequency inválida', () => {
    expect(accepts(agentSchemas.income, {
      description: 'X', amount: 100, recurring: { frequency: 'biweekly' },
    })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────

describe('13. Edge cases transversais', () => {
  it('payload vazio é rejeitado em todos os schemas de create', () => {
    expect(accepts(authSchemas.login, {})).toBe(false);
    expect(accepts(financeSchemas.create, {})).toBe(false);
    expect(accepts(recurringSchemas.create, {})).toBe(false);
    expect(accepts(cardSchemas.create, {})).toBe(false);
    expect(accepts(categorySchemas.create, {})).toBe(false);
    expect(accepts(entitySchemas.create, {})).toBe(false);
    expect(accepts(incomeSourceSchemas.create, {})).toBe(false);
    expect(accepts(budgetSchemas.upsert, {})).toBe(false);
    expect(accepts(installmentSchemas.create, {})).toBe(false);
    expect(accepts(reminderSchemas.create, {})).toBe(false);
    expect(accepts(calendarSchemas.create, {})).toBe(false);
    expect(accepts(agentSchemas.expense, {})).toBe(false);
  });

  it('NaN é rejeitado em todos os campos monetários', () => {
    expect(accepts(financeSchemas.create, { amount: NaN, type: 'expense', transaction_date: '2025-01-01' })).toBe(false);
    expect(accepts(budgetSchemas.upsert, { category: 'X', amount_limit: NaN })).toBe(false);
    expect(accepts(agentSchemas.expense, { description: 'X', amount: NaN })).toBe(false);
  });

  it('Infinity é rejeitado em valores monetários', () => {
    expect(accepts(financeSchemas.create, { amount: Infinity, type: 'expense', transaction_date: '2025-01-01' })).toBe(false);
  });

  it('string absurdamente longa é rejeitada', () => {
    const longStr = 'a'.repeat(600);
    const veryLongStr = 'a'.repeat(2000);
    expect(accepts(authSchemas.login, { phone_number: longStr, password: '123456' })).toBe(false);
    expect(accepts(financeSchemas.create, {
      amount: 10, type: 'expense', transaction_date: '2025-01-01', description: veryLongStr,
    })).toBe(false);
  });
});
