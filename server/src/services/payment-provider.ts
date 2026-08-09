export interface PaymentCheckoutRequest { accountId: number; planId: number; returnUrl: string }
export interface PaymentCheckoutResult { externalId: string; redirectUrl: string }
export interface PaymentWebhookEvent { id: string; type: string; payload: unknown }

/** Contrato neutro. Controllers nunca dependem de SDKs de gateways. */
export interface PaymentProvider {
  readonly name: string;
  createCheckout(request: PaymentCheckoutRequest): Promise<PaymentCheckoutResult>;
  cancelSubscription(externalSubscriptionId: string): Promise<void>;
  parseWebhook(rawBody: Buffer, headers: Record<string, string | string[] | undefined>): Promise<PaymentWebhookEvent>;
}

export class PaymentProviderNotConfigured implements PaymentProvider {
  readonly name = 'not-configured';
  private unavailable(): never { throw Object.assign(new Error('PAYMENT_PROVIDER_NOT_CONFIGURED'), { statusCode: 501 }); }
  async createCheckout(_request: PaymentCheckoutRequest): Promise<PaymentCheckoutResult> { return this.unavailable(); }
  async cancelSubscription(_externalSubscriptionId: string): Promise<void> { return this.unavailable(); }
  async parseWebhook(_rawBody: Buffer, _headers: Record<string, string | string[] | undefined>): Promise<PaymentWebhookEvent> { return this.unavailable(); }
}
