import crypto from 'node:crypto';
import type { BillingProvider,CheckoutRequest,CheckoutResult,InternalBillingEvent,ProviderStatus } from './types.js';

export class FakeBillingProvider implements BillingProvider {
  readonly name='fake';
  constructor(private readonly secret='test-billing-secret') { if(process.env.NODE_ENV!=='test')throw new Error('FAKE_BILLING_PROVIDER_DISABLED_OUTSIDE_TESTS'); }
  async createCheckout(request:CheckoutRequest):Promise<CheckoutResult>{return{externalCheckoutId:`fake_co_${request.orderPublicId}`,checkoutUrl:`https://fake.invalid/${request.orderPublicId}`}}
  async getStatus(externalId:string):Promise<ProviderStatus>{return{status:'test',externalId}}
  async cancelSubscription(_externalSubscriptionId:string):Promise<void>{}
  sign(raw:Buffer){return crypto.createHmac('sha256',this.secret).update(raw).digest('hex')}
  async validateAndMapWebhook(rawBody:Buffer,headers:Record<string,string|string[]|undefined>):Promise<InternalBillingEvent>{
    const signature=String(headers['x-fake-signature']??'');const expected=this.sign(rawBody);
    if(signature.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))throw Object.assign(new Error('INVALID_WEBHOOK_SIGNATURE'),{statusCode:401});
    const event=JSON.parse(rawBody.toString('utf8')) as Omit<InternalBillingEvent,'occurredAt'|'raw'>&{occurredAt:string};
    return{...event,occurredAt:new Date(event.occurredAt),raw:event};
  }
}
