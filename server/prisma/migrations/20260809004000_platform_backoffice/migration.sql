ALTER TABLE `accounts` ADD COLUMN `origin` VARCHAR(30) NOT NULL DEFAULT 'legacy';

ALTER TABLE `users` MODIFY COLUMN `role` ENUM('owner','admin','member') NULL DEFAULT 'admin';
UPDATE `users` u
JOIN (SELECT account_id, MIN(id) id FROM `users` WHERE role = 'admin' GROUP BY account_id) owners ON owners.id = u.id
SET u.role = 'owner';

CREATE TABLE `platform_user_roles` (
  `id` INTEGER NOT NULL AUTO_INCREMENT, `user_id` INTEGER NOT NULL,
  `role` ENUM('platform_owner','platform_support') NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `revoked_at` DATETIME(3) NULL,
  UNIQUE INDEX `platform_user_roles_user_id_role_key` (`user_id`,`role`),
  INDEX `platform_user_roles_role_revoked_at_idx` (`role`,`revoked_at`), PRIMARY KEY (`id`),
  CONSTRAINT `platform_user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `account_invitations` (
  `id` INTEGER NOT NULL AUTO_INCREMENT, `user_id` INTEGER NOT NULL, `account_id` INTEGER NOT NULL,
  `purpose` VARCHAR(40) NOT NULL, `token_hash` VARCHAR(64) NOT NULL,
  `status` ENUM('pending','sent','accepted','expired','revoked') NOT NULL DEFAULT 'pending',
  `expires_at` DATETIME(3) NOT NULL, `send_count` INTEGER NOT NULL DEFAULT 0, `created_by` INTEGER NULL,
  `accepted_at` DATETIME(3) NULL, `revoked_at` DATETIME(3) NULL, `metadata` JSON NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updated_at` DATETIME(3) NOT NULL,
  UNIQUE INDEX `account_invitations_token_hash_key` (`token_hash`),
  INDEX `account_invitations_account_id_status_idx` (`account_id`,`status`),
  INDEX `account_invitations_user_id_purpose_status_idx` (`user_id`,`purpose`,`status`), PRIMARY KEY (`id`),
  CONSTRAINT `account_invitations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `account_invitations_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `account_invitations_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `platform_admin_audit` (
  `id` BIGINT NOT NULL AUTO_INCREMENT, `actor_user_id` INTEGER NOT NULL, `target_user_id` INTEGER NULL,
  `target_account_id` INTEGER NULL, `action` VARCHAR(80) NOT NULL, `reason` VARCHAR(500) NULL,
  `outcome` VARCHAR(20) NOT NULL, `ip_hash` VARCHAR(64) NULL, `user_agent` VARCHAR(255) NULL,
  `metadata` JSON NULL, `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `platform_admin_audit_actor_user_id_created_at_idx` (`actor_user_id`,`created_at`),
  INDEX `platform_admin_audit_target_account_id_created_at_idx` (`target_account_id`,`created_at`),
  INDEX `platform_admin_audit_action_created_at_idx` (`action`,`created_at`), PRIMARY KEY (`id`),
  CONSTRAINT `platform_admin_audit_actor_user_id_fkey` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `platform_admin_audit_target_user_id_fkey` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `platform_admin_audit_target_account_id_fkey` FOREIGN KEY (`target_account_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
