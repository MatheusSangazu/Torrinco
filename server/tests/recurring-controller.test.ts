import {beforeEach,describe,expect,it,vi} from 'vitest';
const mocks=vi.hoisted(()=>({create:vi.fn(async(_userId:number,input:any)=>({id:1,...input})),entity:vi.fn(async(id:number,accountId:number)=>id===9&&accountId===1?{id:9}:null)}));
vi.mock('../src/lib/prisma.js',()=>({prisma:{income_sources:{findFirst:vi.fn(async()=>({id:7}))}}}));
vi.mock('../src/services/recurring.service.js',()=>({createRecurring:mocks.create}));
vi.mock('../src/services/ownership.service.js',()=>({getCategoryForAccount:vi.fn(async()=>({id:1,name:'Teste'})),getEntityForAccount:mocks.entity}));
import {RecurringController} from '../src/controllers/recurring.controller.js';
function response(){return{statusCode:200,body:null as any,status(code:number){this.statusCode=code;return this},json(body:any){this.body=body;return this}}}
const body=(extra:any={})=>({description:'Mensal',amount:10,type:'income',frequency:'monthly',start_date:'2026-08-09',...extra});
describe('controller de recorrências',()=>{
 beforeEach(()=>vi.clearAllMocks());
 it('aceita entidade pertencente à conta',async()=>{const res=response();await RecurringController.createTransaction({userId:1,accountId:1,body:body({entity_id:9})} as any,res as any,vi.fn());expect(res.statusCode).toBe(201);expect(mocks.create).toHaveBeenCalledWith(1,expect.objectContaining({entity_id:9}))});
 it('rejeita entidade de outra conta',async()=>{const res=response();await RecurringController.createTransaction({userId:1,accountId:1,body:body({entity_id:99})} as any,res as any,vi.fn());expect(res.statusCode).toBe(403);expect(mocks.create).not.toHaveBeenCalled()});
});
