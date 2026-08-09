ALTER TABLE `transactions` ADD COLUMN `recurring_occurrence_at` DATETIME(0) NULL;
UPDATE `transactions` t JOIN (
  SELECT MIN(id) AS canonical_id FROM `transactions`
  WHERE `recurring_transaction_id` IS NOT NULL
  GROUP BY `recurring_transaction_id`, `transaction_date`
) c ON c.canonical_id = t.id SET t.`recurring_occurrence_at` = t.`transaction_date`;
CREATE UNIQUE INDEX `transactions_recurring_occurrence_uq` ON `transactions`(`recurring_transaction_id`, `recurring_occurrence_at`);

CREATE TABLE `scheduler_locks` (
  `job_name` VARCHAR(100) NOT NULL, `owner_id` VARCHAR(100) NOT NULL,
  `locked_until` DATETIME(3) NOT NULL, `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`job_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `scheduler_runs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT, `job_name` VARCHAR(100) NOT NULL,
  `execution_key` VARCHAR(191) NOT NULL, `owner_id` VARCHAR(100) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'running', `attempts` INTEGER NOT NULL DEFAULT 1,
  `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `finished_at` DATETIME(3) NULL,
  `duration_ms` INTEGER NULL, `result` JSON NULL, `error_message` TEXT NULL,
  UNIQUE INDEX `scheduler_runs_job_name_execution_key_key` (`job_name`, `execution_key`),
  INDEX `scheduler_runs_status_started_at_idx` (`status`, `started_at`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `reminder_deliveries` (
  `id` BIGINT NOT NULL AUTO_INCREMENT, `source_type` VARCHAR(30) NOT NULL,
  `source_id` VARCHAR(191) NOT NULL, `occurrence_key` VARCHAR(191) NOT NULL,
  `account_id` INTEGER NOT NULL, `user_id` INTEGER NOT NULL, `destination` VARCHAR(50) NOT NULL,
  `message` TEXT NOT NULL, `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `attempts` INTEGER NOT NULL DEFAULT 0, `max_attempts` INTEGER NOT NULL DEFAULT 5,
  `next_attempt_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `locked_by` VARCHAR(100) NULL,
  `locked_until` DATETIME(3) NULL, `last_error` TEXT NULL, `provider_result` JSON NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `sent_at` DATETIME(3) NULL, `failed_at` DATETIME(3) NULL,
  UNIQUE INDEX `reminder_delivery_occurrence_uq` (`source_type`, `source_id`, `occurrence_key`),
  INDEX `reminder_deliveries_status_next_attempt_at_locked_until_idx` (`status`, `next_attempt_at`, `locked_until`),
  INDEX `reminder_deliveries_account_id_idx` (`account_id`), INDEX `reminder_deliveries_user_id_idx` (`user_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
