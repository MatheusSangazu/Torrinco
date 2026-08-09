import { prisma } from '../lib/prisma.js';

function safePayload(value:unknown):unknown {
  if(Array.isArray(value))return value.map(safePayload);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value as Record<string,unknown>).filter(([key])=>!/(card|cvv|cvc|token|password|secret|authorization)/i.test(key)).map(([key,item])=>[key,safePayload(item)]));
  return value;
}

export async function receiveBillingEvent(provider: string, eventId: string, eventType: string, payload: unknown) {
  try {
    const event = await prisma.billing_webhook_events.create({ data: { provider, provider_event_id: eventId, event_type: eventType, payload: safePayload(payload) as any } });
    return { event, duplicate: false };
  } catch (error: any) {
    if (error?.code !== 'P2002') throw error;
    const event = await prisma.billing_webhook_events.findUnique({ where: { provider_provider_event_id: { provider, provider_event_id: eventId } } });
    return { event, duplicate: true };
  }
}
