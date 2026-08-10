import { beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => ({
  financial_imports: { findFirst: vi.fn(), findMany: vi.fn(), update: vi.fn(), updateMany: vi.fn(), create: vi.fn() },
  financial_import_items: { findMany: vi.fn(), update: vi.fn(), updateMany: vi.fn(), create: vi.fn(), createMany: vi.fn() },
  transactions: { create: vi.fn(), findMany: vi.fn() }, financial_entities: { findFirst: vi.fn() }, categories: { findFirst: vi.fn() },
  privacy_audit_events: { create: vi.fn() }, $transaction: vi.fn()
}));
vi.mock('../src/lib/prisma.js', () => ({ prisma: db }));
import { FinancialImportError, FinancialImportService } from '../src/services/financial-import.service.js';

const scope={accountId:11,userId:7};
const item=(id:number,extra:Record<string,unknown>={})=>({id,import_id:3,included:true,transaction_date:new Date('2026-08-01T00:00:00Z'),amount:10,type:'expense',category_id:null,entity_id:5,transaction_status:'paid',description:`Compra ${id}`,payment_method:'credit_card',duplicate_kind:null,requires_review:false,item_kind:'purchase',imported_transaction_id:null,...extra});
const batch=(extra:Record<string,unknown>={})=>({id:3,account_id:11,user_id:7,status:'review',target_entity_id:5,document_total:20,items:[item(1),item(2)],...extra});

describe('confirmação atômica e isolada da importação',()=>{
 beforeEach(()=>{Object.values(db).forEach(group=>{if(typeof group==='object')Object.values(group).forEach(fn=>(fn as any).mockReset?.())});db.$transaction.mockReset();db.$transaction.mockImplementation((fn:any)=>fn(db));db.financial_entities.findFirst.mockResolvedValue({id:5});db.categories.findFirst.mockResolvedValue(null);db.financial_imports.updateMany.mockResolvedValue({count:1});db.financial_imports.update.mockResolvedValue({});db.transactions.create.mockImplementation(async({data}:any)=>({id:100+db.transactions.create.mock.calls.length,...data}));db.financial_import_items.update.mockResolvedValue({});db.privacy_audit_events.create.mockResolvedValue({});});
 it('cria todos os itens e conclui dentro de uma única transação',async()=>{db.financial_imports.findFirst.mockResolvedValue(batch());const result=await FinancialImportService.confirm(scope,3,{});expect(db.$transaction).toHaveBeenCalledTimes(1);expect(db.transactions.create).toHaveBeenCalledTimes(2);expect(result).toMatchObject({status:'completed',importedCount:2,idempotent:false});});
 it('web request repetido após conclusão é idempotente',async()=>{db.financial_imports.findFirst.mockResolvedValue(batch({status:'completed',items:[item(1,{imported_transaction_id:101})]}));const result=await FinancialImportService.confirm(scope,3,{});expect(result.idempotent).toBe(true);expect(db.transactions.create).not.toHaveBeenCalled();});
 it('duplo clique perde a disputa de claim e não grava',async()=>{db.financial_imports.findFirst.mockResolvedValue(batch());db.financial_imports.updateMany.mockResolvedValue({count:0});await expect(FinancialImportService.confirm(scope,3,{})).rejects.toMatchObject({code:'IMPORT_LOCKED'});expect(db.transactions.create).not.toHaveBeenCalled();});
 it('falha em uma ocorrência rejeita toda a transação Prisma',async()=>{db.financial_imports.findFirst.mockResolvedValue(batch());db.transactions.create.mockResolvedValueOnce({id:101}).mockRejectedValueOnce(new Error('falha simulada'));await expect(FinancialImportService.confirm(scope,3,{})).rejects.toThrow('falha simulada');expect(db.$transaction).toHaveBeenCalledTimes(1);});
 it('exige conta ou cartão de destino',async()=>{db.financial_imports.findFirst.mockResolvedValue(batch({target_entity_id:null,document_total:10,items:[item(1,{entity_id:null})]}));await expect(FinancialImportService.confirm(scope,3,{})).rejects.toMatchObject({code:'TARGET_REQUIRED'});expect(db.transactions.create).not.toHaveBeenCalled();});
 it('exige motivo explícito para diferença de conciliação',async()=>{db.financial_imports.findFirst.mockResolvedValue(batch({document_total:99}));await expect(FinancialImportService.confirm(scope,3,{})).rejects.toMatchObject({code:'RECONCILIATION_CONFIRMATION_REQUIRED'});expect(db.transactions.create).not.toHaveBeenCalled();});
 it('consulta o lote sempre com conta e usuário autenticados',async()=>{db.financial_imports.findFirst.mockResolvedValue(null);await expect(FinancialImportService.get(scope,99)).rejects.toBeInstanceOf(FinancialImportError);expect(db.financial_imports.findFirst).toHaveBeenCalledWith(expect.objectContaining({where:{id:99,account_id:11,user_id:7}}));});
});
