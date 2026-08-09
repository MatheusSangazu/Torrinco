import { beforeEach, describe, expect, it, vi } from 'vitest';

const { db, prismaMock, sendText } = vi.hoisted(() => {
  const db:any = { locks:new Map(), runs:new Map(), deliveries:[], users:[{id:1,account_id:1,status:'active'}], accessAllowed:true };
  const prismaMock:any = {
    $executeRaw: vi.fn(async()=>1),
    scheduler_locks: { findMany:vi.fn(async({where}:any)=>[{job_name:where.job_name,owner_id:where.owner_id,locked_until:new Date(Date.now()+60000)}]), updateMany:vi.fn(async()=>({count:1})) },
    scheduler_runs: {
      create:vi.fn(async({data}:any)=>{const k=`${data.job_name}:${data.execution_key}`;if(db.runs.has(k))throw Object.assign(new Error('unique'),{code:'P2002'});const r={id:BigInt(db.runs.size+1),...data};db.runs.set(k,r);return r}),
      update:vi.fn(async()=>({}))
    },
    reminder_deliveries: {
      create:vi.fn(async({data}:any)=>{const k=`${data.source_type}:${data.source_id}:${data.occurrence_key}`;if(db.deliveries.some((x:any)=>x.key===k))throw Object.assign(new Error('unique'),{code:'P2002'});const row={id:BigInt(db.deliveries.length+1),key:k,status:'pending',attempts:0,max_attempts:3,locked_until:null,next_attempt_at:new Date(0),...data};db.deliveries.push(row);return row}),
      findMany:vi.fn(async()=>db.deliveries.filter((x:any)=>['pending','retry'].includes(x.status))),
      updateMany:vi.fn(async({where,data}:any)=>{const row=db.deliveries.find((x:any)=>x.id===where.id);if(!row||!['pending','retry'].includes(row.status))return{count:0};Object.assign(row,data,{attempts:row.attempts+1});return{count:1}}),
      update:vi.fn(async({where,data}:any)=>{const row=db.deliveries.find((x:any)=>x.id===where.id);Object.assign(row,data);return row})
    },
    users:{findFirst:vi.fn(async({where}:any)=>db.users.find((u:any)=>u.id===where.id&&u.status==='active')??null)}
  };
  return {db,prismaMock,sendText:vi.fn()};
});
vi.mock('../src/lib/prisma.js',()=>({prisma:prismaMock}));
vi.mock('../src/services/evolution.service.js',()=>({EvolutionService:{sendText}}));
vi.mock('../src/services/subscription.service.js',()=>({assertAccountAccess:vi.fn(async()=>{if(!db.accessAllowed)throw Object.assign(new Error('ACCOUNT_INACTIVE'),{statusCode:403})})}));

import { runIdempotentJob } from '../src/services/job-runtime.service.js';
import { enqueueReminder, processReminderQueue, retryDelayMs } from '../src/services/reminder-delivery.service.js';

beforeEach(()=>{db.runs.clear();db.deliveries.length=0;db.users=[{id:1,account_id:1,status:'active'}];db.accessAllowed=true;sendText.mockReset();vi.clearAllMocks();});

describe('scheduler seguro para multiplas replicas',()=>{
  it('executa uma unica vez sob concorrencia de duas replicas',async()=>{let calls=0;const work=async()=>{calls++;await Promise.resolve();return{ok:true}};const [a,b]=await Promise.all([runIdempotentJob('daily','2030-01-01',work),runIdempotentJob('daily','2030-01-01',work)]);expect(calls).toBe(1);expect([a.executed,b.executed].filter(Boolean)).toHaveLength(1);});
  it('reexecucao da mesma chave e idempotente',async()=>{let calls=0;await runIdempotentJob('daily','same',async()=>++calls);await runIdempotentJob('daily','same',async()=>++calls);expect(calls).toBe(1);});
  it('enfileiramento repetido cria uma unica entrega',async()=>{const input={sourceType:'internal',sourceId:'8',occurrenceKey:'2030-01-01',accountId:1,userId:1,destination:'masked',message:'x'};await enqueueReminder(input);await enqueueReminder(input);expect(db.deliveries).toHaveLength(1);});
  it('duas replicas nao enviam a mesma entrega',async()=>{await enqueueReminder({sourceType:'internal',sourceId:'8',occurrenceKey:'x',accountId:1,userId:1,destination:'p',message:'m'});await Promise.all([processReminderQueue(),processReminderQueue()]);expect(sendText).toHaveBeenCalledTimes(1);expect(db.deliveries[0].status).toBe('sent');});
  it('falha transitoria agenda retry com backoff',async()=>{sendText.mockRejectedValueOnce(new Error('timeout'));await enqueueReminder({sourceType:'internal',sourceId:'8',occurrenceKey:'x',accountId:1,userId:1,destination:'p',message:'m'});await processReminderQueue();expect(db.deliveries[0].status).toBe('retry');expect(retryDelayMs(2)).toBeGreaterThan(retryDelayMs(1));});
  it('conta inativa vira falha permanente sem envio',async()=>{db.accessAllowed=false;await enqueueReminder({sourceType:'internal',sourceId:'8',occurrenceKey:'x',accountId:1,userId:1,destination:'p',message:'m'});await processReminderQueue();expect(sendText).not.toHaveBeenCalled();expect(db.deliveries[0].status).toBe('permanent_failure');});
});
