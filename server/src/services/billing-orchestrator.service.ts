import crypto from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import type { BillingProvider,InternalBillingEvent } from '../billing/types.js';
import { receiveBillingEvent } from './billing-webhook.service.js';
import { AccountProvisioningService } from './account-provisioning.service.js';
import { invalidateAccountStatusCache } from '../middleware/jwt.js';
import { EvolutionService } from './evolution.service.js';

export class BillingOrchestratorService {
  static async createOrder(input:{idempotencyKey:string;planName:string;billingPeriod:'monthly'|'yearly';name:string;phone:string;email?:string;userId?:number;accountId?:number}){
    const existing=await prisma.commerce_orders.findUnique({where:{idempotency_key:input.idempotencyKey}});if(existing)return existing;
    const plan=await prisma.plans.findUnique({where:{name:input.planName}});if(!plan||plan.status!=='active')throw Object.assign(new Error('PLAN_NOT_AVAILABLE'),{statusCode:400});
    const amount=input.billingPeriod==='yearly'?plan.price_yearly:plan.price_monthly;if(amount==null)throw Object.assign(new Error('PLAN_PRICE_NOT_CONFIGURED'),{statusCode:409});
    try{return await prisma.commerce_orders.create({data:{public_id:crypto.randomUUID(),idempotency_key:input.idempotencyKey,user_id:input.userId,account_id:input.accountId,plan_id:plan.id,customer_name:input.name,customer_phone:AccountProvisioningService.normalizePhone(input.phone),customer_email:input.email,expected_amount:amount,currency:'BRL',billing_period_days:input.billingPeriod==='yearly'?365:30}})}catch(error:any){if(error?.code!=='P2002')throw error;return prisma.commerce_orders.findUniqueOrThrow({where:{idempotency_key:input.idempotencyKey}})};
  }
  static async createCheckout(orderPublicId:string,provider:BillingProvider){const order=await prisma.commerce_orders.findUnique({where:{public_id:orderPublicId},include:{plans:true}});if(!order)throw Object.assign(new Error('ORDER_NOT_FOUND'),{statusCode:404});const existing=await prisma.billing_checkouts.findFirst({where:{order_id:order.id,provider:provider.name}});if(existing)return existing;const result=await provider.createCheckout({orderPublicId:order.public_id,amount:String(order.expected_amount),currency:order.currency,customer:{name:order.customer_name,phone:order.customer_phone,email:order.customer_email??undefined},description:`Torrinco ${order.plans.name}`});const checkout=await prisma.billing_checkouts.create({data:{order_id:order.id,provider:provider.name,external_checkout_id:result.externalCheckoutId,checkout_url:result.checkoutUrl,expires_at:result.expiresAt}});await prisma.commerce_orders.update({where:{id:order.id},data:{status:'checkout_created'}});return checkout}
  static async processWebhook(provider:BillingProvider,rawBody:Buffer,headers:Record<string,string|string[]|undefined>){
    const mapped=await provider.validateAndMapWebhook(rawBody,headers);
    const inbox=await receiveBillingEvent(provider.name,mapped.providerEventId,mapped.type,mapped.raw);if(inbox.duplicate)return{duplicate:true,status:inbox.event?.status};
    try{const result:any=await this.applyEvent(provider.name,mapped);await prisma.billing_webhook_events.update({where:{id:inbox.event!.id},data:{status:result.review?'review':'processed',processed_at:new Date(),attempts:{increment:1},error_message:result.reviewReason}});return{duplicate:false,...result}}
    catch(error:any){await prisma.billing_webhook_events.update({where:{id:inbox.event!.id},data:{status:'failed',attempts:{increment:1},error_message:String(error?.message??error).slice(0,2000)}});throw error}
  }
  private static async applyEvent(provider:string,event:InternalBillingEvent){
    const order=await prisma.commerce_orders.findUnique({where:{public_id:event.orderPublicId},include:{plans:true}});
    if(!order)return{review:true,reviewReason:'UNKNOWN_ORDER'};
    if(event.planReference&&event.planReference!==order.plans.name)return this.review(order.id,'PLAN_MISMATCH');
    if(event.amount!=null&&(Number(event.amount)!==Number(order.expected_amount)||event.currency!==order.currency))return this.review(order.id,'AMOUNT_OR_CURRENCY_MISMATCH');
    if(event.type==='checkout.created'){await prisma.billing_checkouts.updateMany({where:{order_id:order.id,provider},data:{status:'created'}});return{processed:true}}
    if(event.type==='payment.pending'){await this.upsertPayment(provider,order.id,event,'pending');return{processed:true}}
    if(event.type==='payment.failed'){if(order.status!=='paid'&&order.status!=='refunded')await prisma.commerce_orders.update({where:{id:order.id},data:{status:'failed'}});await this.upsertPayment(provider,order.id,event,'failed');return{processed:true}}
    if(event.type==='payment.approved'||event.type==='subscription.activated'){
      const claimed=await prisma.commerce_orders.updateMany({where:{id:order.id,status:{in:['pending','checkout_created','failed']}},data:{status:'review',review_reason:'PROVISIONING_IN_PROGRESS'}});if(claimed.count===0)return{processed:true,ignored:'ALREADY_ACTIVATED_OR_PROCESSING'};
      await this.upsertPayment(provider,order.id,event,'approved');const periodEnd=new Date(event.occurredAt.getTime()+order.billing_period_days*86_400_000);
      const made=await AccountProvisioningService.activatePaidOrder({orderId:order.id,name:order.customer_name,phone:order.customer_phone,email:order.customer_email,planId:order.plan_id,existingUserId:order.user_id,existingAccountId:order.account_id,periodEndsAt:periodEnd});
      await prisma.accounts.updateMany({where:{id:made.account.id,access_status:'suspended',access_suspension_reason:'payment_refunded'},data:{access_status:'enabled',access_suspended_at:null,access_suspension_reason:null,access_suspended_by_user_id:null}});
      await prisma.commerce_orders.update({where:{id:order.id},data:{user_id:made.user.id,account_id:made.account.id,status:'paid',review_reason:null}});
      await prisma.billing_subscriptions.upsert({where:{provider_external_subscription_id:{provider,external_subscription_id:event.externalSubscriptionId??`order:${order.id}`}},create:{order_id:order.id,account_id:made.account.id,provider,external_customer_id:event.externalCustomerId,external_subscription_id:event.externalSubscriptionId??`order:${order.id}`,status:'active',current_period_starts_at:event.occurredAt,current_period_ends_at:periodEnd,last_event_at:event.occurredAt},update:{status:'active',current_period_ends_at:periodEnd,last_event_at:event.occurredAt}});
      if(made.invitation&&made.plainToken){const link=`${process.env.PUBLIC_APP_URL??'http://localhost:5173'}/first-access?invite=${encodeURIComponent(made.plainToken)}`;const sent=await EvolutionService.sendText(made.user.phone_number,`Seu acesso ao Torrinco está disponível: ${link}`);await prisma.account_invitations.update({where:{id:made.invitation.id},data:{status:sent?'sent':'pending',send_count:{increment:1}}})}invalidateAccountStatusCache(made.account.id);return{processed:true,accountId:made.account.id,userId:made.user.id}
    }
    if(!order.account_id)return this.review(order.id,'EVENT_WITHOUT_PROVISIONED_ACCOUNT');
    const subscription=await prisma.billing_subscriptions.findFirst({where:{order_id:order.id,provider}});if(subscription?.last_event_at&&subscription.last_event_at>event.occurredAt)return{processed:true,ignored:'OUT_OF_ORDER'};
    if(event.type==='subscription.past_due')return this.transition(order,'past_due','subscription_past_due',event,provider);
    if(event.type==='subscription.cancelled')return this.transition(order,'cancelled','subscription_cancelled',event,provider);
    if(event.type==='payment.refunded'){await this.upsertPayment(provider,order.id,event,'refunded');await prisma.commerce_orders.update({where:{id:order.id},data:{status:'refunded'}});const policy=process.env.BILLING_REFUND_POLICY??'suspend';return this.transition(order,policy==='keep_until_period_end'?'active':'suspended','payment_refunded',event,provider)}
    return{review:true,reviewReason:'UNMAPPED_EVENT'};
  }
  private static async review(orderId:number,reason:string){await prisma.commerce_orders.update({where:{id:orderId},data:{status:'review',review_reason:reason}});return{review:true,reviewReason:reason}}
  private static async upsertPayment(provider:string,orderId:number,event:InternalBillingEvent,status:'pending'|'approved'|'failed'|'refunded'){if(!event.externalPaymentId||event.amount==null||!event.currency)return;const key={provider_external_payment_id:{provider,external_payment_id:event.externalPaymentId}};const current=await prisma.billing_payments.findUnique({where:key});const rank={pending:0,failed:1,approved:2,refunded:3};if(current&&rank[current.status]>=rank[status])return;await prisma.billing_payments.upsert({where:key,create:{order_id:orderId,provider,external_payment_id:event.externalPaymentId,amount:event.amount,currency:event.currency,status,paid_at:status==='approved'?event.occurredAt:undefined,refunded_at:status==='refunded'?event.occurredAt:undefined},update:{status,...(status==='approved'&&{paid_at:event.occurredAt}),...(status==='refunded'&&{refunded_at:event.occurredAt})}})}
  private static async transition(order:any,status:'active'|'past_due'|'cancelled'|'suspended',reason:string,event:InternalBillingEvent,provider:string){
    const account=await prisma.accounts.findUnique({where:{id:order.account_id}});if(!account)return this.review(order.id,'ACCOUNT_NOT_FOUND');
    if(status==='suspended')await prisma.$transaction([
      prisma.accounts.update({where:{id:account.id},data:{access_status:'suspended',access_suspended_at:event.occurredAt,access_suspension_reason:reason,access_suspended_by_user_id:null}}),
      prisma.billing_subscriptions.updateMany({where:{order_id:order.id,provider},data:{status:'cancelled',last_event_at:event.occurredAt}}),
    ]);else await prisma.$transaction([
      prisma.accounts.update({where:{id:account.id},data:{status}}),
      prisma.subscription_history.create({data:{account_id:account.id,plan_id:order.plan_id,previous_status:account.status,new_status:status,reason,metadata:{provider,eventId:event.providerEventId}}}),
      prisma.billing_subscriptions.updateMany({where:{order_id:order.id,provider},data:{status,last_event_at:event.occurredAt}}),
    ]);
    invalidateAccountStatusCache(account.id);return{processed:true,accountId:account.id}
  }
}
