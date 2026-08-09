CREATE TABLE `account_members` (
  `id` INTEGER NOT NULL AUTO_INCREMENT, `account_id` INTEGER NOT NULL, `user_id` INTEGER NOT NULL,
  `role` ENUM('owner','admin','member') NOT NULL DEFAULT 'member', `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `account_members_account_id_user_id_key` (`account_id`,`user_id`), INDEX `account_members_user_id_status_idx` (`user_id`,`status`), PRIMARY KEY (`id`),
  CONSTRAINT `account_members_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `account_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
INSERT IGNORE INTO `account_members` (`account_id`,`user_id`,`role`,`status`,`created_at`) SELECT `account_id`,`id`,`role`,`status`,COALESCE(`created_at`,CURRENT_TIMESTAMP(3)) FROM `users`;

CREATE TABLE `commerce_orders` (
  `id` INTEGER NOT NULL AUTO_INCREMENT, `public_id` VARCHAR(36) NOT NULL, `idempotency_key` VARCHAR(100) NOT NULL,
  `user_id` INTEGER NULL, `account_id` INTEGER NULL, `plan_id` INTEGER NOT NULL, `customer_name` VARCHAR(100) NOT NULL,
  `customer_phone` VARCHAR(30) NOT NULL, `customer_email` VARCHAR(150) NULL, `expected_amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'BRL', `billing_period_days` INTEGER NOT NULL DEFAULT 30,
  `status` ENUM('pending','checkout_created','paid','failed','cancelled','refunded','review') NOT NULL DEFAULT 'pending',
  `review_reason` VARCHAR(255) NULL, `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updated_at` DATETIME(3) NOT NULL,
  UNIQUE INDEX `commerce_orders_public_id_key` (`public_id`), UNIQUE INDEX `commerce_orders_idempotency_key_key` (`idempotency_key`),
  INDEX `commerce_orders_status_created_at_idx` (`status`,`created_at`), INDEX `commerce_orders_customer_phone_idx` (`customer_phone`), PRIMARY KEY (`id`),
  CONSTRAINT `commerce_orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `commerce_orders_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `commerce_orders_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `billing_checkouts` (
 `id` INTEGER NOT NULL AUTO_INCREMENT, `order_id` INTEGER NOT NULL, `provider` VARCHAR(50) NOT NULL, `external_checkout_id` VARCHAR(191) NOT NULL,
 `status` ENUM('created','pending','completed','expired','cancelled') NOT NULL DEFAULT 'created', `checkout_url` VARCHAR(1000) NULL, `expires_at` DATETIME(3) NULL,
 `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updated_at` DATETIME(3) NOT NULL,
 UNIQUE INDEX `billing_checkouts_provider_external_checkout_id_key` (`provider`,`external_checkout_id`), INDEX `billing_checkouts_order_id_status_idx` (`order_id`,`status`), PRIMARY KEY (`id`),
 CONSTRAINT `billing_checkouts_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `commerce_orders` (`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `billing_payments` (
 `id` INTEGER NOT NULL AUTO_INCREMENT, `order_id` INTEGER NOT NULL, `provider` VARCHAR(50) NOT NULL, `external_payment_id` VARCHAR(191) NOT NULL,
 `amount` DECIMAL(10,2) NOT NULL, `currency` VARCHAR(3) NOT NULL, `status` ENUM('pending','approved','failed','refunded') NOT NULL DEFAULT 'pending',
 `paid_at` DATETIME(3) NULL, `refunded_at` DATETIME(3) NULL, `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updated_at` DATETIME(3) NOT NULL,
 UNIQUE INDEX `billing_payments_provider_external_payment_id_key` (`provider`,`external_payment_id`), INDEX `billing_payments_order_id_status_idx` (`order_id`,`status`), PRIMARY KEY (`id`),
 CONSTRAINT `billing_payments_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `commerce_orders` (`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `billing_subscriptions` (
 `id` INTEGER NOT NULL AUTO_INCREMENT, `order_id` INTEGER NOT NULL, `account_id` INTEGER NOT NULL, `provider` VARCHAR(50) NOT NULL,
 `external_customer_id` VARCHAR(191) NULL, `external_subscription_id` VARCHAR(191) NULL,
 `status` ENUM('pending','active','past_due','cancelled') NOT NULL DEFAULT 'pending', `current_period_starts_at` DATETIME(3) NULL,
 `current_period_ends_at` DATETIME(3) NULL, `last_event_at` DATETIME(3) NULL, `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updated_at` DATETIME(3) NOT NULL,
 UNIQUE INDEX `billing_subscriptions_provider_external_subscription_id_key` (`provider`,`external_subscription_id`), INDEX `billing_subscriptions_account_id_status_idx` (`account_id`,`status`), INDEX `billing_subscriptions_order_id_idx` (`order_id`), PRIMARY KEY (`id`),
 CONSTRAINT `billing_subscriptions_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `commerce_orders` (`id`),
 CONSTRAINT `billing_subscriptions_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
