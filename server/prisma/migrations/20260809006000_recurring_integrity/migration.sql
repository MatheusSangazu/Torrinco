ALTER TABLE `recurring_transactions`
  ADD COLUMN `income_source_id` INTEGER NULL,
  ADD COLUMN `creation_key` VARCHAR(64) NULL;

CREATE UNIQUE INDEX `recurring_transactions_creation_key_key` ON `recurring_transactions`(`creation_key`);
CREATE INDEX `recurring_income_source_idx` ON `recurring_transactions`(`income_source_id`);
ALTER TABLE `recurring_transactions`
  ADD CONSTRAINT `recurring_transactions_income_source_fk`
  FOREIGN KEY (`income_source_id`) REFERENCES `income_sources`(`id`) ON DELETE SET NULL;
