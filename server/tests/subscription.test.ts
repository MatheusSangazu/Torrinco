import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mock, state } = vi.hoisted(() => {
  const state:any = { account: null, users: 1, cards: 0, history: [] };
  const mock:any = {
    accounts: { findUnique: vi.fn(async()=>state.account), update: vi.fn(async({data}:any)=>(state.account={...state.account,...data})) },
    users: { count: vi.fn(async()=>state.users) },
    financial_entities: { count: vi.fn(async()=>state.cards) },
    subscription_history: { create: vi.fn(async({data}:any)=>{state.history.push(data);return data}), findMany:vi.fn(async()=>state.history) },
    plans: { findMany: vi.fn(async()=>[]) },
  };
  mock.$transaction=vi.fn(async(fn:any)=>fn(mock));
  return { mock, state };
});
vi.mock('../src/lib/prisma.js',()=>({prisma:mock}));
import { assertFeature, assertWithinLimit, changeSubscriptionStatus, evaluateAccountAccess } from '../src/services/subscription.service.js';

const future=new Date('2030-02-01T00:00:00Z'); const past=new Date('2029-12-01T00:00:00Z'); const now=new Date('2030-01-01T00:00:00Z');
const plan={id:1,name:'individual',max_users:1,max_cards:2,features:{calendar:true,advanced_reports:false},status:'active'};
beforeEach(()=>{state.account={id:10,plan_id:1,status:'active',trial_ends_at:null,current_period_ends_at:future,grace_period_ends_at:null,cancelled_at:null,plans:plan};state.users=1;state.cards=0;state.history=[];vi.clearAllMocks();});

describe('regras comerciais de assinatura',()=>{
 it('permite trial valido',()=>expect(evaluateAccountAccess({status:'trial',trial_ends_at:future},now).allowed).toBe(true));
 it('bloqueia trial expirado e o classifica como vencido',()=>expect(evaluateAccountAccess({status:'trial',trial_ends_at:past},now)).toMatchObject({allowed:false,status:'expired',reason:'TRIAL_EXPIRED'}));
 it('bloqueia ao atingir limite de cartoes',async()=>{state.cards=2;await expect(assertWithinLimit(10,'cards')).rejects.toMatchObject({code:'PLAN_LIMIT_REACHED',resource:'cards',maximum:2});});
 it('bloqueia ao atingir limite de usuarios',async()=>{await expect(assertWithinLimit(10,'users')).rejects.toMatchObject({code:'PLAN_LIMIT_REACHED',resource:'users',maximum:1});});
 it('bloqueia feature ausente no plano',async()=>{await expect(assertFeature(10,'advanced_reports')).rejects.toMatchObject({code:'FEATURE_NOT_INCLUDED',feature:'advanced_reports'});});
 it('cancela e registra historico',async()=>{await changeSubscriptionStatus(10,'cancelled','test_cancel');expect(state.account.status).toBe('cancelled');expect(state.history[0]).toMatchObject({previous_status:'active',new_status:'cancelled'});});
 it('reativa e registra historico',async()=>{state.account.status='cancelled';await changeSubscriptionStatus(10,'active','test_reactivate');expect(state.account.status).toBe('active');expect(state.history[0]).toMatchObject({previous_status:'cancelled',new_status:'active'});});
});
