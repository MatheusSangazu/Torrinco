import express from 'express';
import type { AddressInfo } from 'node:net';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ upload: vi.fn(), list: vi.fn(), get: vi.fn(), update: vi.fn(), updateItem: vi.fn(), addItem: vi.fn(), confirm: vi.fn(), cancel: vi.fn() }));
vi.mock('../src/middleware/jwt.js', () => ({ authenticateJwt: (req: any, _res: any, next: any) => { req.userId = 7; req.accountId = 11; req.userRole = 'member'; next(); } }));
vi.mock('../src/services/financial-import.service.js', () => ({ FinancialImportService: mocks, FinancialImportError: class extends Error {}, ImportFileError: class extends Error { code='FILE_REQUIRED'; statusCode=400; } }));
import importsRoutes from '../src/routes/imports.routes.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

describe('API de importações em uma aplicação Express real', () => {
  let server: ReturnType<ReturnType<typeof express>['listen']>; let base: string;
  beforeEach(async () => {
    Object.values(mocks).forEach(mock => mock.mockReset());
    const app = express(); app.use(express.json()); app.use('/api/imports', importsRoutes); app.use(errorHandler);
    await new Promise<void>(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });
  afterEach(() => new Promise<void>(resolve => server.close(() => resolve())));

  it('recebe multipart e usa somente usuário e conta autenticados', async () => {
    mocks.upload.mockResolvedValue({ id: 1, status: 'review', items: [] });
    const form = new FormData(); form.append('file', new File([Buffer.from('%PDF-1.4')], 'fatura.pdf', { type: 'application/pdf' }));
    const response = await fetch(`${base}/api/imports`, { method: 'POST', body: form });
    expect(response.status).toBe(201); expect(mocks.upload).toHaveBeenCalledWith(expect.objectContaining({ accountId: 11, userId: 7, fileName: 'fatura.pdf' }));
  });
  it('não cria rascunho sem arquivo', async () => {
    const response = await fetch(`${base}/api/imports`, { method: 'POST', body: new FormData() });
    expect(response.status).toBe(400); expect(mocks.upload).not.toHaveBeenCalled();
  });
  it('lista somente no escopo autenticado', async () => {
    mocks.list.mockResolvedValue([]); const response = await fetch(`${base}/api/imports`);
    expect(response.status).toBe(200); expect(mocks.list).toHaveBeenCalledWith({ accountId: 11, userId: 7 });
  });
  it('editar item não confirma nem grava a importação', async () => {
    mocks.updateItem.mockResolvedValue({ id: 3, status: 'review' });
    const response = await fetch(`${base}/api/imports/3/items/9`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ description: 'Corrigida' }) });
    expect(response.status).toBe(200); expect(mocks.confirm).not.toHaveBeenCalled();
  });
  it('confirma por endpoint separado e mantém o escopo do token', async () => {
    mocks.confirm.mockResolvedValue({ id: 3, status: 'completed', importedCount: 1 });
    const response = await fetch(`${base}/api/imports/3/confirm`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
    expect(response.status).toBe(200); expect(mocks.confirm).toHaveBeenCalledWith({ accountId: 11, userId: 7 }, 3, {});
  });
});
