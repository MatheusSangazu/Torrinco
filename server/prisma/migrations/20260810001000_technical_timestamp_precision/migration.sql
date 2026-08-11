-- Aumenta precisão somente em instantes usados para ordenação, auditoria ou concorrência.
-- Valores históricos são preservados; os antigos continuam com milissegundos .000.

ALTER TABLE `subscription_history`
  MODIFY COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

ALTER TABLE `billing_webhook_events`
  MODIFY COLUMN `received_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  MODIFY COLUMN `processed_at` DATETIME(3) NULL;

ALTER TABLE `transactions`
  MODIFY COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  MODIFY COLUMN `deleted_at` DATETIME(3) NULL;

ALTER TABLE `pending_actions`
  MODIFY COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  MODIFY COLUMN `confirmed_at` DATETIME(3) NULL,
  MODIFY COLUMN `executed_at` DATETIME(3) NULL;

ALTER TABLE `action_audit`
  MODIFY COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
