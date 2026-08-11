import { beforeEach, describe, expect, it, vi } from 'vitest';

const db = vi.hoisted(() => ({
  financial_imports: { findFirst: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), updateMany: vi.fn(), create: vi.fn() },
  financial_import_items: { findMany: vi.fn(), update: vi.fn(), updateMany: vi.fn(), create: vi.fn(), createMany: vi.fn() },
  transactions: { create: vi.fn(), findMany: vi.fn() }, financial_entities: { findFirst: vi.fn() }, categories: { findFirst: vi.fn() },
  privacy_audit_events: { create: vi.fn() }, $transaction: vi.fn()
}));
vi.mock('../src/lib/prisma.js', () => ({ prisma: db }));
import { FinancialImportError, FinancialImportService } from '../src/services/financial-import.service.js';
import { itemFingerprint } from '../src/services/financial-import-parser.service.js';

const scope={accountId:11,userId:7};
const item=(id:number,extra:Record<string,unknown>={})=>({id,import_id:3,included:true,transaction_date:new Date('2026-08-01T00:00:00Z'),amount:10,type:'expense',category_id:null,entity_id:5,transaction_status:'paid',description:`Compra ${id}`,payment_method:'credit_card',duplicate_kind:null,requires_review:false,item_kind:'purchase',imported_transaction_id:null,...extra});
const batch=(extra:Record<string,unknown>={})=>({id:3,account_id:11,user_id:7,status:'review',target_entity_id:5,document_total:20,items:[item(1),item(2)],...extra});

describe('confirmação atômica e isolada da importação',()=>{
 beforeEach(()=>{Object.values(db).forEach(group=>{if(typeof group==='object')Object.values(group).forEach(fn=>(fn as any).mockReset?.())});db.$transaction.mockReset();db.$transaction.mockImplementation((work:any)=>Array.isArray(work)?Promise.all(work):work(db));db.financial_entities.findFirst.mockResolvedValue({id:5});db.categories.findFirst.mockResolvedValue(null);db.financial_imports.updateMany.mockResolvedValue({count:1});db.financial_imports.update.mockResolvedValue({});db.transactions.create.mockImplementation(async({data}:any)=>({id:100+db.transactions.create.mock.calls.length,...data}));db.financial_import_items.update.mockResolvedValue({});db.privacy_audit_events.create.mockResolvedValue({});});
 it('cria todos os itens e conclui dentro de uma única transação',async()=>{db.financial_imports.findFirst.mockResolvedValue(batch());const result=await FinancialImportService.confirm(scope,3,{});expect(db.$transaction).toHaveBeenCalledTimes(1);expect(db.transactions.create).toHaveBeenCalledTimes(2);expect(result).toMatchObject({status:'completed',importedCount:2,idempotent:false});});
 it('preserva a data civil da importação na transação e na serialização da API',async()=>{
  const transactionDate=new Date('2028-02-29T00:00:00.000Z');
  db.financial_imports.findFirst.mockResolvedValue(batch({document_total:10,items:[item(1,{transaction_date:transactionDate})]}));
  await FinancialImportService.confirm(scope,3,{});
  const created=db.transactions.create.mock.calls[0][0].data;
  expect(created.transaction_date).toBe(transactionDate);
  expect(JSON.parse(JSON.stringify(created)).transaction_date).toBe('2028-02-29T00:00:00.000Z');
 });
 it('web request repetido após conclusão é idempotente',async()=>{db.financial_imports.findFirst.mockResolvedValue(batch({status:'completed',items:[item(1,{imported_transaction_id:101})]}));const result=await FinancialImportService.confirm(scope,3,{});expect(result.idempotent).toBe(true);expect(db.transactions.create).not.toHaveBeenCalled();});
 it('duplo clique perde a disputa de claim e não grava',async()=>{db.financial_imports.findFirst.mockResolvedValue(batch());db.financial_imports.updateMany.mockResolvedValue({count:0});await expect(FinancialImportService.confirm(scope,3,{})).rejects.toMatchObject({code:'IMPORT_LOCKED'});expect(db.transactions.create).not.toHaveBeenCalled();});
 it('falha em uma ocorrência rejeita toda a transação Prisma',async()=>{db.financial_imports.findFirst.mockResolvedValue(batch());db.transactions.create.mockResolvedValueOnce({id:101}).mockRejectedValueOnce(new Error('falha simulada'));await expect(FinancialImportService.confirm(scope,3,{})).rejects.toThrow('falha simulada');expect(db.$transaction).toHaveBeenCalledTimes(1);});
 it('exige conta ou cartão de destino',async()=>{db.financial_imports.findFirst.mockResolvedValue(batch({target_entity_id:null,document_total:10,items:[item(1,{entity_id:null})]}));await expect(FinancialImportService.confirm(scope,3,{})).rejects.toMatchObject({code:'TARGET_REQUIRED'});expect(db.transactions.create).not.toHaveBeenCalled();});
 it('exige motivo explícito para diferença de conciliação',async()=>{db.financial_imports.findFirst.mockResolvedValue(batch({document_total:99}));await expect(FinancialImportService.confirm(scope,3,{})).rejects.toMatchObject({code:'RECONCILIATION_CONFIRMATION_REQUIRED'});expect(db.transactions.create).not.toHaveBeenCalled();});
 it('duplicado pode ser incluído somente mediante confirmação explícita',async()=>{
  const duplicateBatch=batch({document_total:10,items:[item(1,{duplicate_kind:'existing_transaction',included:true})]});db.financial_imports.findFirst.mockResolvedValue(duplicateBatch);
  await expect(FinancialImportService.confirm(scope,3,{})).rejects.toMatchObject({code:'DUPLICATE_CONFIRMATION_REQUIRED'});expect(db.transactions.create).not.toHaveBeenCalled();
  db.financial_imports.findFirst.mockResolvedValue(duplicateBatch);const result=await FinancialImportService.confirm(scope,3,{allow_duplicates:true});expect(result).toMatchObject({status:'completed_with_warnings',importedCount:1});
 });
 it('consulta o lote sempre com conta e usuário autenticados',async()=>{db.financial_imports.findFirst.mockResolvedValue(null);await expect(FinancialImportService.get(scope,99)).rejects.toBeInstanceOf(FinancialImportError);expect(db.financial_imports.findFirst).toHaveBeenCalledWith(expect.objectContaining({where:{id:99,account_id:11,user_id:7}}));});
});

describe('atualização em massa atômica da importação',()=>{
 beforeEach(()=>{Object.values(db).forEach(group=>{if(typeof group==='object')Object.values(group).forEach(fn=>(fn as any).mockReset?.())});db.$transaction.mockReset();db.$transaction.mockImplementation((work:any)=>Array.isArray(work)?Promise.all(work):work(db));db.financial_import_items.updateMany.mockResolvedValue({count:2});db.financial_imports.update.mockResolvedValue({});db.privacy_audit_events.create.mockResolvedValue({});});
 it('altera o lote com um update coletivo e uma reconciliação',async()=>{
  const updated=batch({items:[item(1,{included:false}),item(2,{included:false})]});
  db.financial_imports.findFirst.mockResolvedValueOnce({id:3,status:'review'}).mockResolvedValueOnce(updated);db.financial_import_items.findMany.mockResolvedValue([{id:1},{id:2}]);
  const result=await FinancialImportService.updateItemsBulk(scope,3,{item_ids:[1,2],changes:{included:false}});
  expect(db.$transaction).toHaveBeenCalledTimes(1);expect(db.financial_import_items.updateMany).toHaveBeenCalledTimes(1);expect(db.financial_imports.update).toHaveBeenCalledTimes(1);expect(result.reconciliation).toMatchObject({selected:0,ignored:2});
 });
 it('rejeita atomicamente quando algum item não pertence ao lote',async()=>{
  db.financial_imports.findFirst.mockResolvedValue({id:3,status:'review'});db.financial_import_items.findMany.mockResolvedValue([{id:1}]);
  await expect(FinancialImportService.updateItemsBulk(scope,3,{item_ids:[1,999],changes:{included:false}})).rejects.toMatchObject({code:'ITEM_NOT_FOUND'});
  expect(db.financial_import_items.updateMany).not.toHaveBeenCalled();expect(db.financial_imports.update).not.toHaveBeenCalled();
 });
 it('valida categoria no escopo da conta antes de alterar',async()=>{
  db.financial_imports.findFirst.mockResolvedValue({id:3,status:'review'});db.financial_import_items.findMany.mockResolvedValue([{id:1}]);db.categories.findFirst.mockResolvedValue(null);
  await expect(FinancialImportService.updateItemsBulk(scope,3,{item_ids:[1],changes:{category_id:88}})).rejects.toMatchObject({code:'INVALID_CATEGORY'});
  expect(db.categories.findFirst).toHaveBeenCalledWith({where:{id:88,account_id:11}});expect(db.financial_import_items.updateMany).not.toHaveBeenCalled();
 });
});

describe('histórico paginado da importação',()=>{
 beforeEach(()=>db.financial_imports.findMany.mockReset());
 it('usa cursor por id estável e informa continuidade',async()=>{
  db.financial_imports.findMany.mockResolvedValue(Array.from({length:3},(_,index)=>({id:30-index})));
  const result=await FinancialImportService.list(scope,{limit:2,cursor:31});
  expect(db.financial_imports.findMany).toHaveBeenCalledWith(expect.objectContaining({where:expect.objectContaining({account_id:11,user_id:7,id:{lt:31}}),orderBy:{id:'desc'},take:3}));
  expect(result).toEqual({imports:[{id:30},{id:29}],next_cursor:29,has_more:true});
 });
 it('combina pesquisa, status e período sem remover o escopo',async()=>{
  db.financial_imports.findMany.mockResolvedValue([]);
  await FinancialImportService.list(scope,{limit:20,search:'Nubank',status:'completed',from:'2026-07-01',to:'2026-07-31'});
  const call=db.financial_imports.findMany.mock.calls[0][0];
  expect(call.where).toMatchObject({account_id:11,user_id:7,status:'completed',OR:[{file_name:{contains:'Nubank'}},{target_entity:{is:{name:{contains:'Nubank'}}}}]});
  expect(call.where.created_at.gte).toEqual(new Date('2026-07-01T00:00:00.000Z'));expect(call.where.created_at.lt).toEqual(new Date('2026-08-01T00:00:00.000Z'));
 });
});

describe('rascunho idempotente e reimportação segura',()=>{
 const uploadInput={...scope,buffer:Buffer.from('Data,Descrição,Valor\n01/08/2026,Mercado,"10,00"'),fileName:'dados.csv',mimeType:'text/csv',fileSize:52};
 beforeEach(()=>{Object.values(db).forEach(group=>{if(typeof group==='object')Object.values(group).forEach(fn=>(fn as any).mockReset?.())});db.$transaction.mockImplementation((work:any)=>Array.isArray(work)?Promise.all(work):work(db));db.privacy_audit_events.create.mockResolvedValue({});});
 it('arquivo novo cria itens válidos incluídos por padrão',async()=>{
  db.financial_imports.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce(null);db.financial_imports.create.mockResolvedValue({id:40});db.financial_import_items.createMany.mockResolvedValue({count:1});db.financial_imports.update.mockResolvedValue({});db.financial_imports.findUnique.mockResolvedValue({id:40,document_total:null,items:[item(1,{import_id:40,included:true,amount:10,description:'Mercado',entity_id:null})]});
  const result:any=await FinancialImportService.upload(uploadInput);
  expect(result.items[0].included).toBe(true);expect(db.financial_imports.create).toHaveBeenCalledTimes(1);expect(db.financial_import_items.createMany.mock.calls[0][0].data[0].entity_id).toBeUndefined();
 });
 it('mesmo arquivo com rascunho retorna o mesmo ID e resumed sem criar lote',async()=>{
  db.financial_imports.findFirst.mockResolvedValueOnce({id:3}).mockResolvedValueOnce(batch());
  const result:any=await FinancialImportService.upload(uploadInput);
  expect(result).toMatchObject({id:3,resumed:true});expect(db.financial_imports.create).not.toHaveBeenCalled();expect(db.financial_imports.update).not.toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({warning_message:expect.anything()})}));
 });
 it('arquivo já concluído bloqueia nova importação até ação explícita',async()=>{
  db.financial_imports.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({id:9,completed_at:new Date('2026-08-02T12:00:00Z'),target_entity:{id:5,name:'Cartão',type:'credit_card'}});
  const result:any=await FinancialImportService.upload(uploadInput);
  expect(result).toMatchObject({reimport_blocked:true,previous_import:{id:9}});expect(db.financial_imports.create).not.toHaveBeenCalled();
 });
});

describe('duplicidade por destino e recálculo após edição',()=>{
 beforeEach(()=>{Object.values(db).forEach(group=>{if(typeof group==='object')Object.values(group).forEach(fn=>(fn as any).mockReset?.())});db.$transaction.mockImplementation((work:any)=>Array.isArray(work)?Promise.all(work):work(db));db.financial_entities.findFirst.mockResolvedValue({id:5});db.categories.findFirst.mockResolvedValue(null);db.financial_imports.update.mockResolvedValue({});db.financial_import_items.update.mockResolvedValue({});db.transactions.findMany.mockResolvedValue([]);db.financial_import_items.findMany.mockResolvedValue([]);});
 it('troca do destino preserva exceções e converte herança legada para nulo',async()=>{
  const inherited=item(1,{entity_id:5,fingerprint:'a'});const exception=item(2,{entity_id:8,fingerprint:'b'});const current=batch({target_entity_id:5,items:[inherited,exception]});
  db.financial_imports.findFirst.mockResolvedValueOnce(current).mockResolvedValueOnce({...current,target_entity_id:6,items:[{...inherited,entity_id:null},exception]}).mockResolvedValueOnce({...current,target_entity_id:6,items:[{...inherited,entity_id:null},exception]}).mockResolvedValueOnce({...current,target_entity_id:6,items:[{...inherited,entity_id:null},exception]});
  await FinancialImportService.update(scope,3,{target_entity_id:6});
  expect(db.financial_import_items.updateMany).toHaveBeenCalledWith({where:{import_id:3,entity_id:5},data:{entity_id:null}});expect(db.financial_imports.update).toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({target_entity_id:6})}));
 });
 it('mesmo fingerprint em outro destino não é duplicidade',async()=>{
  const current=item(1,{entity_id:null,fingerprint:'fp',exclusion_reason:null});const view=batch({items:[current]});
  db.financial_imports.findFirst.mockResolvedValueOnce(view).mockResolvedValueOnce(view).mockResolvedValueOnce(view).mockResolvedValueOnce(view);
  db.transactions.findMany.mockResolvedValue([{id:99,entity_id:6,transaction_date:current.transaction_date,amount:10,description:'Compra 1',type:'expense'}]);
  await FinancialImportService.updateItem(scope,3,1,{description:'Compra atualizada'});
  expect(db.financial_import_items.update).toHaveBeenLastCalledWith(expect.objectContaining({data:expect.objectContaining({duplicate_kind:null})}));
 });
 it('mesmo fingerprint no mesmo destino marca duplicidade e traz evidencia',async()=>{
  const fingerprint=itemFingerprint(new Date('2026-08-01T00:00:00Z'),10,'Compra 1','expense');
  const current=item(1,{entity_id:null,fingerprint,exclusion_reason:null});const view=batch({items:[current]});
  db.financial_imports.findFirst.mockResolvedValueOnce(view).mockResolvedValueOnce(view).mockResolvedValueOnce(view).mockResolvedValueOnce(view);
 db.transactions.findMany.mockResolvedValue([{id:99,entity_id:5,transaction_date:current.transaction_date,amount:10,description:'Compra 1',type:'expense'}]);
  await FinancialImportService.updateItem(scope,3,1,{description:'Compra atualizada'});
  const duplicateUpdate=db.financial_import_items.update.mock.calls.find(call=>call[0].data.duplicate_kind==='existing_transaction');
  expect(duplicateUpdate?.[0].data).toMatchObject({included:false,exclusion_reason:'automatic_duplicate'});
  expect(JSON.parse(duplicateUpdate?.[0].data.duplicate_reason)).toMatchObject({kind:'existing_transaction',destination_id:5,transaction_id:99});
 });
 it('edição de data, valor, descrição ou tipo dispara novo cálculo de duplicidade',async()=>{
  const current=item(1,{entity_id:null,fingerprint:'antigo',exclusion_reason:null});const view=batch({items:[current]});
  db.financial_imports.findFirst.mockResolvedValueOnce(view).mockResolvedValueOnce(view).mockResolvedValueOnce(view).mockResolvedValueOnce(view);
  await FinancialImportService.updateItem(scope,3,1,{amount:12,description:'Nova descrição',type:'income',transaction_date:'2026-08-02'});
  expect(db.transactions.findMany).toHaveBeenCalled();expect(db.financial_import_items.update.mock.calls[0][0].data).toMatchObject({duplicate_kind:null,duplicate_reason:null});
 });
 it('consulta apenas importações concluídas como origem externa',async()=>{
  const current=item(1,{entity_id:null,fingerprint:'fp',exclusion_reason:null});const view=batch({items:[current]});
  db.financial_imports.findFirst.mockResolvedValueOnce(view).mockResolvedValueOnce(view).mockResolvedValueOnce(view).mockResolvedValueOnce(view);
  await FinancialImportService.updateItem(scope,3,1,{description:'Compra 1'});
  expect(db.financial_import_items.findMany).toHaveBeenCalledWith(expect.objectContaining({where:expect.objectContaining({financial_imports:expect.objectContaining({status:{in:['completed','completed_with_warnings']}})})}));
 });
});
