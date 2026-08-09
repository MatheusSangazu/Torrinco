/**
 * Log de auditoria — rastro de ações sensíveis (LGPD/segurança).
 *
 * Decisão: log estruturado em stdout (sem tabela nova/migration).
 * A Coolify/provedor de logs captura e arquiva. Futuramente pode trocar
 * por pino/winston sem mudar os callsites.
 *
 * Eventos auditados:
 *  - transação criada/editada/excluída
 *  - fatura paga/desfeita
 *  - recorrência/parcelamento criados
 *  - conexão Google OAuth
 *  - evento de calendário criado/editado/excluído
 *
 * Cada linha tem formato estável pra ser parseável:
 *   [audit] { ts, actor, action, target, meta }
 */

export type AuditActor =
  | { kind: 'user'; id: number; phone?: string }
  | { kind: 'system' };

export interface AuditEvent {
  actor: AuditActor;
  action: string;          // ex: 'transaction.create'
  target?: { type: string; id?: number | string };
  meta?: Record<string, any>;
}

/**
 * Emite um evento de auditoria.
 * Em produção, idealmente deve ir pra um sink persistente (Coolify logs,
 * Datadog, Loki, etc) — aqui só garantimos o formato.
 */
export function auditLog(event: AuditEvent): void {
  const line = {
    ts: new Date().toISOString(),
    actor: event.actor,
    action: event.action,
    target: event.target,
    meta: event.meta
  };
  // JSON em uma linha — fácil de ingerir.
  console.log(`[audit] ${JSON.stringify(line)}`);
  if (event.actor.kind === 'user') {
    const actorId = event.actor.id;
    import('../services/privacy.service.js').then(({privacyAudit}) => privacyAudit({ userId:actorId, eventType:event.action, targetType:event.target?.type, targetId:event.target?.id, outcome:'succeeded', metadata:event.meta })).catch(err => console.error('[audit] persistent sink failed', err));
  }
}
