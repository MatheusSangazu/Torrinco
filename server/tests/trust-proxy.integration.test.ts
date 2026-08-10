import express from 'express';
import rateLimit from 'express-rate-limit';
import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it } from 'vitest';
import { configureTrustProxy, getTrustProxyHops } from '../src/config/trust-proxy.js';

describe('trust proxy e rate limit atras do Coolify', () => {
  let server: ReturnType<ReturnType<typeof express>['listen']> | undefined;
  afterEach(() => server && new Promise<void>(resolve => server!.close(() => resolve())));

  it('usa um salto por padrao e rejeita configuracao insegura', () => {
    expect(getTrustProxyHops(undefined)).toBe(1);
    expect(() => getTrustProxyHops('true')).toThrow();
    expect(() => getTrustProxyHops('-1')).toThrow();
  });

  it('considera o IP anexado pelo proxy e ignora valor anterior falsificado', async () => {
    const app = express(); configureTrustProxy(app, '1');
    app.get('/ip', (req, res) => res.json({ ip: req.ip }));
    await new Promise<void>(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
    const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    const response = await fetch(`${base}/ip`, { headers: { 'x-forwarded-for': '198.51.100.99, 203.0.113.10' } });
    expect(await response.json()).toEqual({ ip: '203.0.113.10' });
  });

  it('mantem limites separados para dois IPs de cliente', async () => {
    const app = express(); configureTrustProxy(app, '1');
    app.use(rateLimit({ windowMs: 60_000, max: 1, standardHeaders: true, legacyHeaders: false }));
    app.get('/', (_req, res) => res.sendStatus(200));
    await new Promise<void>(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
    const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    const first = await fetch(base, { headers: { 'x-forwarded-for': '198.51.100.1' } });
    const second = await fetch(base, { headers: { 'x-forwarded-for': '198.51.100.2' } });
    expect(first.status).toBe(200); expect(second.status).toBe(200);
  });
});
