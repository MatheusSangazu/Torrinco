ALTER TABLE `accounts`
  ADD COLUMN `current_period_ends_at` DATETIME(0) NULL,
  ADD COLUMN `grace_period_ends_at` DATETIME(0) NULL,
  ADD COLUMN `cancelled_at` DATETIME(0) NULL,
  MODIFY COLUMN `status` ENUM('trial','active','expired','past_due','cancelled','suspended') NULL DEFAULT 'trial';

CREATE TABLE `subscription_history` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `account_id` INTEGER NOT NULL,
  `plan_id` INTEGER NOT NULL,
  `previous_status` ENUM('trial','active','expired','past_due','cancelled','suspended') NULL,
  `new_status` ENUM('trial','active','expired','past_due','cancelled','suspended') NOT NULL,
  `reason` VARCHAR(100) NOT NULL,
  `metadata` JSON NULL,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  INDEX `subscription_history_account_id_created_at_idx` (`account_id`, `created_at`),
  PRIMARY KEY (`id`),
  CONSTRAINT `subscription_history_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `subscription_history_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `billing_webhook_events` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `provider` VARCHAR(50) NOT NULL,
  `provider_event_id` VARCHAR(191) NOT NULL,
  `event_type` VARCHAR(100) NOT NULL,
  `payload` JSON NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'received',
  `attempts` INTEGER NOT NULL DEFAULT 0,
  `error_message` TEXT NULL,
  `received_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `processed_at` DATETIME(0) NULL,
  UNIQUE INDEX `billing_webhook_events_provider_provider_event_id_key` (`provider`, `provider_event_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
