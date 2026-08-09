import { prisma } from '../lib/prisma.js';

export async function receiveBillingEvent(provider: string, eventId: string, eventType: string, payload: unknown) {
  try {
    const event = await prisma.billing_webhook_events.create({ data: { provider, provider_event_id: eventId, event_type: eventType, payload: payload as any } });
    return { event, duplicate: false };
  } catch (error: any) {
    if (error?.code !== 'P2002') throw error;
    const event = await prisma.billing_webhook_events.findUnique({ where: { provider_provider_event_id: { provider, provider_event_id: eventId } } });
    return { event, duplicate: true };
  }
}
