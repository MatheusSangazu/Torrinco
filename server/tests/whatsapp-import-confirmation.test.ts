import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  getLatestPending: vi.fn(), confirmPendingAction: vi.fn(), cancelPendingAction: vi.fn(), createPendingAction: vi.fn(), markExecuted: vi.fn(), append: vi.fn(), chat: vi.fn(), preview: vi.fn(), key: vi.fn(),
  tx: { transactions: { create: vi.fn() }, categories: { findFirst: vi.fn(), create: vi.fn() }, financial_entities: { findFirst: vi.fn() } },
  prisma: { users: { findUnique: vi.fn() }, financial_entities: { findMany: vi.fn() }, transactions: { findMany: vi.fn() }, $transaction: vi.fn() }
}));
vi.mock('../src/lib/prisma.js', () => ({ prisma: state.prisma }));
vi.mock('../src/services/llm.service.js', () => ({ chatWithTools: state.chat }));
vi.mock('../src/services/agent/conversationHistory.service.js', () => ({ getHistory: vi.fn(() => []), appendToHistory: state.append }));
vi.mock('../src/services/action-safety.service.js', () => ({
  classifyRisk: vi.fn(), createPendingAction: state.createPendingAction, confirmPendingAction: state.confirmPendingAction, cancelPendingAction: state.cancelPendingAction,
  getLatestPending: state.getLatestPending, markExecuted: state.markExecuted, recordDirectAction: vi.fn(), getLatestActionForUndo: vi.fn(), markUndone: vi.fn(),
  buildImportPreview: state.preview, computeIdempotencyKey: state.key
}));
import { processConversation } from '../src/services/agent/conversation.service.js';

describe('confirmação da importação pelo WhatsApp', () => {
  beforeEach(() => {
    for (const fn of [state.getLatestPending,state.confirmPendingAction,state.cancelPendingAction,state.createPendingAction,state.markExecuted,state.append,state.chat,state.preview,state.key,state.tx.transactions.create,state.tx.categories.findFirst,state.tx.categories.create,state.tx.financial_entities.findFirst,state.prisma.users.findUnique,state.prisma.financial_entities.findMany,state.prisma.transactions.findMany,state.prisma.$transaction]) fn.mockReset();
    state.prisma.users.findUnique.mockResolvedValue({ account_id: 11 }); state.prisma.$transaction.mockImplementation((callback:any) => callback(state.tx)); state.tx.transactions.create.mockResolvedValue({ id: 101 }); state.markExecuted.mockResolvedValue(undefined);
  });
  it('resposta sim grava o lote confirmado e marca a ação como executada', async () => {
    state.getLatestPending.mockResolvedValue({ id: 9, actionType: 'bulk_import', summary: 'Importar 1 lançamento' });
    state.confirmPendingAction.mockResolvedValue({ ok: true, payload: { toolCalls: [{ name: 'registrar_despesa', arguments: { descricao: 'Mercado', valor: 50, data: '2026-08-01', forma_pagamento: 'pix' } }] } });
    const reply = await processConversation(107, [{ text: 'sim', mediaType: 'text', userId: 107, receivedAt: new Date() }], '5511000000107');
    expect(state.prisma.$transaction).toHaveBeenCalledTimes(1); expect(state.tx.transactions.create).toHaveBeenCalledTimes(1); expect(state.markExecuted).toHaveBeenCalledWith(9,107,11,expect.objectContaining({imported:1})); expect(reply).toContain('Importação concluída'); expect(state.chat).not.toHaveBeenCalled();
  });
  it('resposta não cancela sem criar transações', async () => {
    state.getLatestPending.mockResolvedValue({ id: 10, actionType: 'bulk_import', summary: 'Importar' }); state.cancelPendingAction.mockResolvedValue({ok:true});
    const reply=await processConversation(108,[{text:'não',mediaType:'text',userId:108,receivedAt:new Date()}],'5511000000108');
    expect(state.cancelPendingAction).toHaveBeenCalledWith(10,108,11); expect(state.tx.transactions.create).not.toHaveBeenCalled(); expect(reply).toContain('cancelada');
  });
  it('confirmação repetida não executa novamente', async () => {
    state.getLatestPending.mockResolvedValue({ id: 11, actionType: 'bulk_import', summary: 'Importar' }); state.confirmPendingAction.mockResolvedValue({ok:true,error:'já executada',payload:{}});
    const reply=await processConversation(109,[{text:'sim',mediaType:'text',userId:109,receivedAt:new Date()}],'5511000000109');
    expect(state.tx.transactions.create).not.toHaveBeenCalled(); expect(reply).toContain('já foi executada');
  });
  it('documento gera prévia e desmarca duplicidade interna antes da confirmação', async () => {
    const calls=[{id:'1',name:'registrar_despesa',arguments:{descricao:'Mercado',valor:50,data:'2026-08-01',forma_pagamento:'pix'}},{id:'2',name:'registrar_despesa',arguments:{descricao:'Mercado',valor:50,data:'2026-08-01',forma_pagamento:'pix'}}];
    state.chat.mockResolvedValue({toolCalls:calls,content:null}); state.prisma.transactions.findMany.mockResolvedValue([]); state.prisma.financial_entities.findMany.mockResolvedValue([]); state.preview.mockReturnValue({count:1,total:50,duplicates:0}); state.key.mockReturnValue('tenant-key'); state.createPendingAction.mockResolvedValue({id:12,status:'pending'});
    const reply=await processConversation(110,[{text:'[DOCUMENTO] fatura',mediaType:'pdf',userId:110,receivedAt:new Date()}],'5511000000110');
    expect(state.createPendingAction).toHaveBeenCalledWith(expect.objectContaining({accountId:11,userId:110,payload:expect.objectContaining({toolCalls:[expect.objectContaining({name:'registrar_despesa'})]})}));
    expect(state.createPendingAction.mock.calls[0]![0].payload.toolCalls).toHaveLength(1); expect(reply).toContain('duplicidades ignoradas: 1'); expect(state.tx.transactions.create).not.toHaveBeenCalled();
  });
});
