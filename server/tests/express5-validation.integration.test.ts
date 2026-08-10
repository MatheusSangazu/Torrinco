import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import express, { type Express } from 'express';
import type { Server } from 'node:http';
import { z } from 'zod';
import { validate, getValidatedBody, getValidatedParams, getValidatedQuery } from '../src/middleware/validate.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { commonSchemas, financeSchemas, recurringSchemas, reminderSchemas, calendarSchemas } from '../src/schemas/index.js';

describe('validação integrada no Express 5.2.1', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app: Express = express();
    app.use(express.json());

    const echoQuery = (req: express.Request, res: express.Response) => {
      res.json({ validated: getValidatedQuery(req), raw: req.query });
    };

    app.get('/api/finance/summary', validate({ query: financeSchemas.summaryQuery }), echoQuery);
    app.get('/api/finance/forecast', validate({ query: financeSchemas.forecastQuery }), echoQuery);
    app.get('/api/finance/transactions', validate({ query: commonSchemas.transactionListQuery }), echoQuery);
    app.get('/api/reminders/due', validate({ query: reminderSchemas.dueQuery }), echoQuery);
    app.get('/api/recurring/due', validate({ query: recurringSchemas.dueQuery }), echoQuery);
    app.post('/api/recurring', validate({ body: recurringSchemas.create }), (req,res)=>res.status(201).json({validated:getValidatedBody(req)}));
    app.get('/api/calendar', validate({ query: calendarSchemas.listQuery }), echoQuery);

    app.post('/body', validate({ body: z.object({ amount: z.coerce.number() }) }), (req, res) => {
      res.json({ body: getValidatedBody(req), requestBody: req.body });
    });
    app.get('/params/:id', validate({ params: commonSchemas.idParams }), (req, res) => {
      res.json({ params: getValidatedParams(req), requestParams: req.params });
    });
    app.get('/internal-error', (_req, _res, next) => next(new Error('prisma password leaked in stack')));
    app.use(errorHandler);

    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Test server did not bind a TCP port');
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });

  it.each([
    ['/api/finance/summary?period=month', { period: 'month' }],
    ['/api/finance/forecast?period=month', { period: 'month' }],
    ['/api/finance/transactions?start_date=2026-08-01&end_date=2026-08-31', { start_date: '2026-08-01', end_date: '2026-08-31' }],
    ['/api/reminders/due?days=7', { days: 7 }],
    ['/api/calendar?start_date=2026-08-01&end_date=2026-08-31', { start_date: '2026-08-01', end_date: '2026-08-31' }],
  ])('entrega query normalizada ao controller em %s', async (path, expected) => {
    const response = await fetch(`${baseUrl}${path}`);
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.validated).toEqual(expected);
  });

  it('coage query string numérica sem sobrescrever req.query', async () => {
    const response = await fetch(`${baseUrl}/api/recurring/due?days=7`);
    const payload = await response.json();
    expect(payload.validated.days).toBe(7);
    expect(typeof payload.validated.days).toBe('number');
    expect(payload.raw.days).toBe('7');
  });

  it('remove campo extra conforme o comportamento strip do schema', async () => {
    const response = await fetch(`${baseUrl}/api/finance/summary?period=month&extra=remove-me`);
    const payload = await response.json();
    expect(payload.validated).toEqual({ period: 'month' });
    expect(payload.raw.extra).toBe('remove-me');
  });

  it('retorna 400 para query inválida', async () => {
    const response = await fetch(`${baseUrl}/api/reminders/due?days=not-a-number`);
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ code: 'VALIDATION_ERROR', error: expect.stringContaining('Não foi possível') });
  });

  it('retorna erro de ID recorrente em português sem detalhes internos',async()=>{
    const response=await fetch(`${baseUrl}/api/recurring`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({description:'Teste',amount:10,type:'income',frequency:'monthly',start_date:'2026-08-09',entity_id:0})});
    const payload=await response.json();expect(response.status).toBe(400);expect(payload).toMatchObject({code:'VALIDATION_ERROR',details:[{field:'entity_id',label:'Conta ou cartão'}]});expect(JSON.stringify(payload)).not.toMatch(/Too small|Invalid input|Zod|Prisma|stack/i);
  });

  it('valida e substitui body e params separadamente', async () => {
    const bodyResponse = await fetch(`${baseUrl}/body`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ amount: '12', extra: true }),
    });
    expect(await bodyResponse.json()).toEqual({ body: { amount: 12 }, requestBody: { amount: 12 } });

    const paramsResponse = await fetch(`${baseUrl}/params/42`);
    expect(await paramsResponse.json()).toEqual({ params: { id: 42 }, requestParams: { id: 42 } });
  });

  it('oculta mensagem e detalhes internos de erros 500 em produção', async () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      const response = await fetch(`${baseUrl}/internal-error`);
      const payload = await response.json();
      expect(response.status).toBe(500);
      expect(payload).toEqual({ error: 'Erro interno do servidor', occurrenceId: expect.any(String) });
      expect(JSON.stringify(payload)).not.toContain('prisma');
      expect(consoleSpy).toHaveBeenCalled();
    } finally {
      consoleSpy.mockRestore();
      process.env.NODE_ENV = previous;
    }
  });
});
