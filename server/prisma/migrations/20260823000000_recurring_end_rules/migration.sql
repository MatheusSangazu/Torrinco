-- Alteração aditiva: recorrências existentes preservam o comportamento sem fim.
ALTER TABLE `recurring_transactions`
  ADD COLUMN `end_type` ENUM('occurrence_count', 'end_date', 'never') NOT NULL DEFAULT 'never',
  ADD COLUMN `occurrence_count` INTEGER NULL,
  ADD COLUMN `end_date` DATE NULL;

-- Estado terminal evita que o job reprocesse diariamente uma série esgotada.
ALTER TABLE `recurring_transactions`
  MODIFY COLUMN `status` ENUM('active', 'paused', 'cancelled', 'completed') NULL DEFAULT 'active';
