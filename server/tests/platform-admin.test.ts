import { describe,it,expect,vi,beforeEach } from 'vitest';

const mocks=vi.hoisted(()=>({role:null as null|{role:string},existing:null as any,audits:[] as any[]}));
vi.mock('../src/lib/prisma.js',()=>({prisma:{
  platform_user_roles:{findFirst:vi.fn(async()=>mocks.role)},
  users:{findUnique:vi.fn(async()=>mocks.existing)},
  platform_admin_audit:{create:vi.fn(async({data}:any)=>{mocks.audits.push(data);return data})},
}}));
import { requirePlatformOwner } from '../src/middleware/platform-admin.js';
import { AccountProvisioningService } from '../src/services/account-provisioning.service.js';
import { authSchemas } from '../src/schemas/index.js';

function response(){return {statusCode:200,body:null as any,status(code:number){this.statusCode=code;return this},json(body:any){this.body=body;return this}}}
describe('autorização global da plataforma',()=>{
 beforeEach(()=>{mocks.role=null;mocks.existing=null;mocks.audits.length=0});
 it.each(['member','admin'])('nega papel interno %s sem platform role',async userRole=>{const res=response();const next=vi.fn();await requirePlatformOwner({userId:1,userRole} as any,res as any,next);expect(res.statusCode).toBe(403);expect(next).not.toHaveBeenCalled()});
 it('permite platform_owner',async()=>{mocks.role={role:'platform_owner'};const res=response();const next=vi.fn();const req:any={userId:1};await requirePlatformOwner(req,res as any,next);expect(next).toHaveBeenCalledOnce();expect(req.platformRole).toBe('platform_owner')});
 it('endpoint comum não aceita atribuição de papel global',()=>{expect(authSchemas.createUser.safeParse({name:'X',phone_number:'5511999999999',role:'platform_owner'}).success).toBe(false);expect(authSchemas.updateUser.safeParse({role:'platform_owner'}).success).toBe(false)});
 it('telefone duplicado falha antes de provisionar outra identidade',async()=>{mocks.existing={id:9};await expect(AccountProvisioningService.provision({name:'Teste',phone:'55 11 99999-0000',planName:'individual',trialDays:14,origin:'platform_tester',createdBy:1})).rejects.toMatchObject({statusCode:409,code:'PHONE_ALREADY_EXISTS'})});
});
