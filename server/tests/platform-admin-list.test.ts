import { beforeEach, describe, expect, it, vi } from 'vitest';

const db=vi.hoisted(()=>({
  accounts:{count:vi.fn(),findMany:vi.fn(),findUnique:vi.fn(),update:vi.fn()},
  users:{findUnique:vi.fn(),findMany:vi.fn()},
  subscription_history:{create:vi.fn()},
  account_invitations:{update:vi.fn()},
  platform_admin_audit:{create:vi.fn(),count:vi.fn(),findMany:vi.fn()},
  $transaction:vi.fn(),
}));
const provisioning=vi.hoisted(()=>({provision:vi.fn()}));
const evolution=vi.hoisted(()=>({sendText:vi.fn()}));
vi.mock('../src/lib/prisma.js',()=>({prisma:db}));
vi.mock('../src/services/account-provisioning.service.js',()=>({AccountProvisioningService:provisioning}));
vi.mock('../src/services/evolution.service.js',()=>({EvolutionService:evolution}));

import { PlatformAdminService } from '../src/services/platform-admin.service.js';

describe('listagem de contas do Backoffice',()=>{
  beforeEach(()=>{
    vi.clearAllMocks();
    db.accounts.count.mockResolvedValue(52);
    db.accounts.findMany.mockResolvedValue([]);
    db.$transaction.mockImplementation(async(callback:any)=>callback(db));
  });

  it('aplica filtros, ordenação e paginação no servidor',async()=>{
    const result=await PlatformAdminService.listAccounts({accessStatus:'suspended',status:'active',origin:'checkout',plan:'individual',sort:'created_at',direction:'desc',page:2,pageSize:25});
    const expectedWhere={access_status:'suspended',status:'active',origin:'checkout',plans:{name:'individual'}};
    expect(db.accounts.count).toHaveBeenCalledWith({where:expectedWhere});
    expect(db.accounts.findMany).toHaveBeenCalledWith(expect.objectContaining({where:expectedWhere,orderBy:{created_at:'desc'},skip:25,take:25}));
    expect(result.pagination).toEqual({page:2,page_size:25,total:52,total_pages:3});
  });

  it('define atividade pela quantidade de transações',async()=>{
    await PlatformAdminService.listAccounts({sort:'activity',direction:'asc',page:1,pageSize:10});
    expect(db.accounts.findMany).toHaveBeenCalledWith(expect.objectContaining({orderBy:{transactions:{_count:'asc'}},include:expect.objectContaining({_count:{select:{transactions:true}}})}));
  });

  it('usa padrões seguros quando chamado sem parâmetros paginados',async()=>{
    const result=await PlatformAdminService.listAccounts({});
    expect(db.accounts.findMany).toHaveBeenCalledWith(expect.objectContaining({orderBy:{created_at:'desc'},skip:0,take:25}));
    expect(result.pagination).toEqual({page:1,page_size:25,total:52,total_pages:3});
  });

  it('reativa acesso sem alterar assinatura ou trial e audita a transição real',async()=>{
    const trialEndsAt=new Date('2026-08-20T03:00:00Z');
    db.accounts.findUnique.mockResolvedValue({id:42,status:'trial',access_status:'suspended',trial_ends_at:trialEndsAt,plan_id:1});
    db.users.findUnique.mockResolvedValue({account_id:7});
    db.accounts.update.mockImplementation(async({data}:any)=>({id:42,status:'trial',access_status:data.access_status,trial_ends_at:trialEndsAt,plan_id:1}));
    db.platform_admin_audit.create.mockImplementation(async({data}:any)=>data);

    const result=await PlatformAdminService.changeAccount(42,{accessStatus:'enabled',reason:'Solicitação confirmada pelo cliente'},{actorUserId:9});

    expect(db.accounts.update).toHaveBeenCalledWith({where:{id:42},data:{access_status:'enabled',access_suspended_at:null,access_suspension_reason:null,access_suspended_by_user_id:null}});
    expect(result).toMatchObject({status:'trial',access_status:'enabled',trial_ends_at:trialEndsAt});
    expect(db.platform_admin_audit.create).toHaveBeenCalledWith({data:expect.objectContaining({actor_user_id:9,target_account_id:42,action:'account.access.enable',reason:'Solicitação confirmada pelo cliente',outcome:'succeeded',metadata:expect.objectContaining({before:{status:'trial',accessStatus:'suspended'},after:{status:'trial',accessStatus:'enabled'}})})});
  });

  it('pagina e filtra auditoria sem retornar metadados sensíveis',async()=>{
    db.platform_admin_audit.count.mockResolvedValue(21);
    db.platform_admin_audit.findMany.mockResolvedValue([]);
    const result=await PlatformAdminService.history({accountId:42,action:'account.access.suspend',outcome:'succeeded',page:2,pageSize:10});
    const expectedWhere={target_account_id:42,action:'account.access.suspend',outcome:'succeeded'};
    expect(db.platform_admin_audit.count).toHaveBeenCalledWith({where:expectedWhere});
    expect(db.platform_admin_audit.findMany).toHaveBeenCalledWith(expect.objectContaining({where:expectedWhere,skip:10,take:10,orderBy:[{created_at:'desc'},{id:'desc'}]}));
    const select=db.platform_admin_audit.findMany.mock.calls[0][0].select;
    expect(select).not.toHaveProperty('metadata');expect(select).not.toHaveProperty('ip_hash');expect(select).not.toHaveProperty('user_agent');
    expect(result.pagination).toEqual({page:2,page_size:10,total:21,total_pages:3});
  });

  it('diferencia convite enviado de entrega pendente no cadastro de testador',async()=>{
    provisioning.provision.mockResolvedValue({account:{id:42},user:{id:8,phone_number:'5585999999999'},invitation:{id:3,status:'pending'},plan:{id:1},plainToken:'secret'});
    evolution.sendText.mockResolvedValue(false);
    db.account_invitations.update.mockResolvedValue({id:3,status:'pending'});
    db.platform_admin_audit.create.mockImplementation(async({data}:any)=>data);
    const result=await PlatformAdminService.createTester({name:'Teste',phone:'5585999999999',planName:'individual',trialDays:14,origin:'platform_tester'},{actorUserId:9});
    expect(result).toMatchObject({invitation:{status:'pending'},invitation_delivery:'pending'});
    expect(result.plainToken).toBeUndefined();
    expect(db.platform_admin_audit.create).toHaveBeenCalledWith({data:expect.objectContaining({metadata:expect.objectContaining({invitationDelivery:'pending'})})});
  });
});
