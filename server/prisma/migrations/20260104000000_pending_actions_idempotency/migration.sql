-- AddColumn: pending_actions.idempotency_key
-- Usado principalmente para importações (evita duplicidade).

ALTER TABLE `pending_actions`
  ADD COLUMN `idempotency_key` VARCHAR(128) NULL;

CREATE UNIQUE INDEX `pending_actions_idempotency_key_uq` ON `pending_actions`(`idempotency_key`);

