-- CreateTable: pending_actions
-- Ações do agente que exigem confirmação antes de executar.

CREATE TABLE IF NOT EXISTS `pending_actions` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `user_id` INTEGER NOT NULL,
  `account_id` INTEGER NOT NULL,
  `action_type` VARCHAR(60) NOT NULL,
  `payload` TEXT NOT NULL,
  `summary` VARCHAR(500) NOT NULL,
  `before_state` TEXT,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` DATETIME,
  `executed_at` DATETIME,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- AddForeignKey: pending_actions -> users
ALTER TABLE `pending_actions`
  ADD CONSTRAINT `pending_actions_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- Indexes
CREATE INDEX `pending_actions_user_idx` ON `pending_actions`(`user_id`);
CREATE INDEX `pending_actions_account_idx` ON `pending_actions`(`account_id`);
CREATE INDEX `pending_actions_status_idx` ON `pending_actions`(`status`);

-- CreateTable: action_audit
-- Registro de auditoria para ações do agente.

CREATE TABLE IF NOT EXISTS `action_audit` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `user_id` INTEGER NOT NULL,
  `account_id` INTEGER NOT NULL,
  `action_type` VARCHAR(60) NOT NULL,
  `execution` VARCHAR(20) NOT NULL DEFAULT 'execute',
  `before_state` TEXT,
  `after_state` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- AddForeignKey: action_audit -> users
ALTER TABLE `action_audit`
  ADD CONSTRAINT `action_audit_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- Indexes
CREATE INDEX `action_audit_user_idx` ON `action_audit`(`user_id`);
CREATE INDEX `action_audit_account_idx` ON `action_audit`(`account_id`);
