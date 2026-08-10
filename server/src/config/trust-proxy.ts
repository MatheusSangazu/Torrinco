import type { Express } from 'express';

export function getTrustProxyHops(value = process.env.TRUST_PROXY_HOPS): number {
  if (value === undefined || value.trim() === '') return 1;
  const hops = Number(value);
  if (!Number.isInteger(hops) || hops < 0 || hops > 10) {
    throw new Error('TRUST_PROXY_HOPS deve ser um inteiro entre 0 e 10.');
  }
  return hops;
}

export function configureTrustProxy(app: Express, value = process.env.TRUST_PROXY_HOPS): number {
  const hops = getTrustProxyHops(value);
  app.set('trust proxy', hops);
  return hops;
}
