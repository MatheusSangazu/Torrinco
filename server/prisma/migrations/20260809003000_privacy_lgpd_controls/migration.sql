CREATE TABLE `legal_consents` (
  `id` BIGINT NOT NULL AUTO_INCREMENT, `user_id` INTEGER NOT NULL, `account_id` INTEGER NOT NULL,
  `document_type` VARCHAR(30) NOT NULL, `document_version` VARCHAR(30) NOT NULL,
  `accepted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `origin` VARCHAR(30) NOT NULL,
  `ip_hash` VARCHAR(64) NULL, `user_agent` VARCHAR(255) NULL, `evidence` JSON NULL,
  UNIQUE INDEX `legal_consents_user_id_document_type_document_version_key` (`user_id`,`document_type`,`document_version`),
  INDEX `legal_consents_account_id_accepted_at_idx` (`account_id`,`accepted_at`), PRIMARY KEY (`id`),
  CONSTRAINT `legal_consents_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `data_subject_requests` (
  `id` BIGINT NOT NULL AUTO_INCREMENT, `user_id` INTEGER NOT NULL, `account_id` INTEGER NOT NULL,
  `request_type` VARCHAR(30) NOT NULL, `status` VARCHAR(30) NOT NULL DEFAULT 'requested',
  `requested_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `due_at` DATETIME(3) NULL,
  `completed_at` DATETIME(3) NULL, `cancellation_at` DATETIME(3) NULL, `result` JSON NULL, `last_error` TEXT NULL,
  INDEX `data_subject_requests_status_due_at_idx` (`status`,`due_at`),
  INDEX `data_subject_requests_account_id_requested_at_idx` (`account_id`,`requested_at`), PRIMARY KEY (`id`),
  CONSTRAINT `data_subject_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `privacy_audit_events` (
  `id` BIGINT NOT NULL AUTO_INCREMENT, `user_id` INTEGER NULL, `account_id` INTEGER NULL,
  `event_type` VARCHAR(60) NOT NULL, `target_type` VARCHAR(60) NULL, `target_id` VARCHAR(100) NULL,
  `outcome` VARCHAR(20) NOT NULL, `metadata` JSON NULL, `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `privacy_audit_events_account_id_created_at_idx` (`account_id`,`created_at`),
  INDEX `privacy_audit_events_user_id_created_at_idx` (`user_id`,`created_at`),
  INDEX `privacy_audit_events_event_type_created_at_idx` (`event_type`,`created_at`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
