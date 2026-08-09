/**
 * Testes de integração de isolamento multi-tenant.
 *
 * Provam que IDs de outra conta NÃO podem ser:
 *  - consultados, relacionados, alterados ou excluídos.
 *
 * Cenário: duas contas (Account A id=1, Account B id=2).
 */
import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import http from 'node:http';

// ── vi.hoisted: cria o mock ANTES de qualquer import do código real ──
const { prismaMock } = vi.hoisted(() => {
  const accounts = [
    { id: 1, name: 'Account A', status: 'active', plan_id: 1 },
    { id: 2, name: 'Account B', status: 'active', plan_id: 1 },
  ];
  const users = [
    { id: 1, account_id: 1, name: 'Admin A', role: 'admin', status: 'active', phone_number: '5511900000001', password_hash: 'x' },
    { id: 2, account_id: 2, name: 'Admin B', role: 'admin', status: 'active', phone_number: '5512900000002', password_hash: 'x' },
    { id: 3, account_id: 1, name: 'Member A', role: 'member', status: 'active', phone_number: '5513900000003', password_hash: 'x' },
  ];
  const categories = [
    { id: 10, account_id: 1, name: 'Alimentação', type: 'expense', color: '#ef4444' },
    { id: 11, account_id: 1, name: 'Salário', type: 'income', color: '#22c55e' },
    { id: 20, account_id: 2, name: 'Transporte', type: 'expense', color: '#eab308' },
  ];
  const financial_entities = [
    { id: 30, account_id: 1, name: 'Banco A', type: 'bank', balance: 1000 },
    { id: 40, account_id: 2, name: 'Banco B', type: 'bank', balance: 2000 },
  ];
  const income_sources = [
    { id: 50, user_id: 1, name: 'Salário A', color: '#22c55e' },
    { id: 60, user_id: 2, name: 'Salário B', color: '#22c55e' },
  ];
  const transactions: any[] = [];
  let nextId = 1000;

  function matchRec(rec: any, where: any): boolean {
    if (!where) return true;
    for (const [key, val] of Object.entries(where)) {
      if (val === undefined || val === null) continue;
      if (typeof val === 'object' && !Array.isArray(val)) {
        if ('in' in val) { if (!(val as any).in.includes(rec[key])) return false; continue; }
        if ('not' in val) { if (rec[key] === (val as any).not) return false; continue; }
      }
      if (rec[key] !== val) return false;
    }
    return true;
  }

  function mockTable(table: any[]) {
    return {
      findFirst: vi.fn(async ({ where }: any) => table.find(r => matchRec(r, where)) ?? null),
      findUnique: vi.fn(async ({ where }: any) => table.find(r => matchRec(r, where)) ?? null),
      findMany: vi.fn(async ({ where }: any) => table.filter(r => matchRec(r, where))),
      create: vi.fn(async ({ data }: any) => { const r = { id: ++nextId, ...data }; table.push(r); return r; }),
      update: vi.fn(async ({ where, data }: any) => {
        const i = table.findIndex(r => matchRec(r, where));
        if (i === -1) throw Object.assign(new Error('P2025'), { code: 'P2025' });
        table[i] = { ...table[i], ...data };
        return table[i];
      }),
      delete: vi.fn(async ({ where }: any) => {
        const i = table.findIndex(r => matchRec(r, where));
        if (i === -1) throw Object.assign(new Error('P2025'), { code: 'P2025' });
        return table.splice(i, 1)[0];
      }),
      count: vi.fn(async ({ where }: any) => table.filter(r => matchRec(r, where)).length),
      aggregate: vi.fn(async ({ where, _sum }: any) => {
        const matched = table.filter(r => matchRec(r, where));
        const k = _sum ? Object.keys(_sum)[0] : null;
        return { _sum: k ? { [k]: matched.reduce((s: number, r: any) => s + Number(r[k] || 0), 0) } : {} };
      }),
      updateMany: vi.fn(async ({ where, data }: any) => {
        let c = 0;
        for (let i = 0; i < table.length; i++) { if (matchRec(table[i], where)) { table[i] = { ...table[i], ...data }; c++; } }
        return { count: c };
      }),
      createMany: vi.fn(async ({ data }: any) => { const rows = Array.isArray(data) ? data : [data]; for (const row of rows) table.push({ id: ++nextId, ...row }); return { count: rows.length }; }),
    };
  }

  const prismaMock = {
    users: mockTable(users),
    accounts: mockTable(accounts),
    categories: mockTable(categories),
    financial_entities: mockTable(financial_entities),
    income_sources: mockTable(income_sources),
    transactions: mockTable(transactions),
    recurring_transactions: mockTable([]),
    $transaction: vi.fn(async (fn: any) => fn(prismaMock)),
    $disconnect: vi.fn(async () => {}),
    $queryRaw: vi.fn(async () => []),
  };

  return { prismaMock };
});

// ── Mock Prisma module ───────────────────────────────────────────
vi.mock('../src/lib/prisma.js', () => ({ prisma: prismaMock }));

// Importar APÓS o mock.
import { requireUserInAccount, getCategoryForAccount, getEntityForAccount, getIncomeSourceForUser } from '../src/services/ownership.service.js';
import { FinanceController } from '../src/controllers/finance.controller.js';
import { CategoriesController } from '../src/controllers/categories.controller.js';
import { EntityController } from '../src/controllers/entity.controller.js';
import { IncomeSourcesController } from '../src/controllers/income_sources.controller.js';

// ── Helper: Express app com auth mockada ─────────────────────────
function mockAuth(userId: number, accountId: number, userRole: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    (req as any).userId = userId;
    (req as any).accountId = accountId;
    (req as any).userRole = userRole;
    next();
  };
}

function createApp(auth: ReturnType<typeof mockAuth>) {
  const app = express();
  app.use(express.json());
  app.use(auth);
  app.post('/api/finance', (req, res, next) => FinanceController.create(req as any, res, next));
  app.get('/api/finance/summary', (req, res, next) => FinanceController.getSummary(req as any, res, next));
  app.get('/api/finance/forecast', (req, res, next) => FinanceController.getForecast(req as any, res, next));
  app.put('/api/categories/:id', (req, res, next) => CategoriesController.update(req as any, res, next));
  app.delete('/api/categories/:id', (req, res, next) => CategoriesController.delete(req as any, res, next));
  app.put('/api/entities/:id', (req, res, next) => EntityController.update(req as any, res, next));
  app.delete('/api/entities/:id', (req, res, next) => EntityController.delete(req as any, res, next));
  app.put('/api/income-sources/:id', (req, res, next) => IncomeSourcesController.update(req as any, res, next));
  app.delete('/api/income-sources/:id', (req, res, next) => IncomeSourcesController.delete(req as any, res, next));
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ error: err.message });
  });
  return app;
}

async function request(app: express.Application, method: string, path: string, body?: any): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const port = (server.address() as any).port;
      const opts: any = { method, headers: { 'Content-Type': 'application/json' } };
      const payload = body ? JSON.stringify(body) : undefined;
      const req = http.request(`http://localhost:${port}${path}`, opts, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          server.close();
          try { resolve({ status: res.statusCode!, body: data ? JSON.parse(data) : {} }); }
          catch { resolve({ status: res.statusCode!, body: data }); }
        });
      });
      req.on('error', (e) => { server.close(); reject(e); });
      if (payload) req.write(payload);
      req.end();
    });
  });
}

// ── Testes ───────────────────────────────────────────────────────

describe('1. Ownership Service — Unit Tests', () => {
  describe('requireUserInAccount', () => {
    it('permite acessar usuário da MESMA conta', async () => {
      const result = await requireUserInAccount(3, 1);
      expect(result.id).toBe(3);
    });

    it('bloqueia acessar usuário de OUTRA conta → 403', async () => {
      await expect(requireUserInAccount(2, 1)).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('getCategoryForAccount', () => {
    it('retorna categoria da mesma conta', async () => {
      expect((await getCategoryForAccount(10, 1))?.name).toBe('Alimentação');
    });
    it('retorna null para categoria de outra conta', async () => {
      expect(await getCategoryForAccount(20, 1)).toBeNull();
    });
  });

  describe('getEntityForAccount', () => {
    it('retorna null para entidade de outra conta', async () => {
      expect(await getEntityForAccount(40, 1)).toBeNull();
    });
  });

  describe('getIncomeSourceForUser', () => {
    it('retorna null para fonte de renda de outro usuário', async () => {
      expect(await getIncomeSourceForUser(60, 1)).toBeNull();
    });
  });
});

describe('2. HTTP — Finance target_user_id cross-account', () => {
  const adminA = mockAuth(1, 1, 'admin');

  it('GET /summary com target_user_id de outra conta → 403', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'GET', '/api/finance/summary?target_user_id=2');
    expect(res.status).toBe(403);
  });

  it('GET /forecast com target_user_id de outra conta → 403', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'GET', '/api/finance/forecast?target_user_id=2');
    expect(res.status).toBe(403);
  });

  it('GET /summary com target_user_id da MESMA conta → 200', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'GET', '/api/finance/summary?target_user_id=3');
    expect(res.status).toBe(200);
  });
});

describe('3. HTTP — Finance create com IDs cross-account', () => {
  const adminA = mockAuth(1, 1, 'admin');

  it('POST com entity_id de outra conta → 403', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'POST', '/api/finance', {
      amount: 100, type: 'expense', transaction_date: '2025-01-15', entity_id: 40,
    });
    expect(res.status).toBe(403);
  });

  it('POST com category_id de outra conta → categoria não vazada', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'POST', '/api/finance', {
      amount: 50, type: 'expense', transaction_date: '2025-01-15', category_id: 20,
    });
    expect(res.status).toBe(201);
    expect(res.body.transaction.category).not.toBe('Transporte');
  });
});

describe('4. HTTP — Categories cross-account CRUD', () => {
  const adminA = mockAuth(1, 1, 'admin');

  it('PUT categoria de outra conta → 404', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'PUT', '/api/categories/20', { name: 'Hackeado' });
    expect(res.status).toBe(404);
  });

  it('DELETE categoria de outra conta → 404', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'DELETE', '/api/categories/20');
    expect(res.status).toBe(404);
  });

  it('PUT categoria da MESMA conta → 200', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'PUT', '/api/categories/10', { name: 'Alimentação OK' });
    expect(res.status).toBe(200);
  });
});

describe('5. HTTP — Entities cross-account CRUD', () => {
  const adminA = mockAuth(1, 1, 'admin');

  it('PUT entidade de outra conta → 404', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'PUT', '/api/entities/40', { name: 'Hackeado' });
    expect(res.status).toBe(404);
  });

  it('DELETE entidade de outra conta → 404', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'DELETE', '/api/entities/40');
    expect(res.status).toBe(404);
  });
});

describe('6. HTTP — Income Sources cross-user CRUD', () => {
  const adminA = mockAuth(1, 1, 'admin');

  it('PUT fonte de renda de outro usuário → 404', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'PUT', '/api/income-sources/60', { name: 'Hackeado' });
    expect(res.status).toBe(404);
  });

  it('DELETE fonte de renda de outro usuário → 404', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'DELETE', '/api/income-sources/60');
    expect(res.status).toBe(404);
  });

  it('PUT fonte de renda do MESMO usuário → 200', async () => {
    const app = createApp(adminA);
    const res = await request(app, 'PUT', '/api/income-sources/50', { name: 'Salário OK' });
    expect(res.status).toBe(200);
  });
});
