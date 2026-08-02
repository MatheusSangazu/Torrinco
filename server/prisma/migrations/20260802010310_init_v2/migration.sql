-- CreateTable
CREATE TABLE `plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `max_users` INTEGER NOT NULL DEFAULT 1,
    `max_cards` INTEGER NOT NULL DEFAULT 5,
    `price_monthly` DECIMAL(10, 2) NULL,
    `price_yearly` DECIMAL(10, 2) NULL,
    `features` JSON NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `plans_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL DEFAULT 'Minha Conta',
    `plan_id` INTEGER NOT NULL,
    `status` ENUM('trial', 'active', 'blocked', 'cancelled') NULL DEFAULT 'trial',
    `trial_ends_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `accounts_plan_idx`(`plan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budgets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `amount_limit` DECIMAL(10, 2) NOT NULL,
    `month_ref` VARCHAR(7) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `unique_user_category`(`user_id`, `category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `color` VARCHAR(20) NULL DEFAULT '#3b82f6',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `categories_account_idx`(`account_id`),
    UNIQUE INDEX `unique_account_category_type`(`account_id`, `name`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `google_event_id` VARCHAR(255) NULL,
    `title` VARCHAR(150) NOT NULL,
    `event_date` DATETIME(0) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_google_event`(`google_event_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `financial_entities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `created_by_user_id` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` ENUM('bank', 'credit_card') NOT NULL,
    `balance` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `credit_limit` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `closing_day` INTEGER NULL,
    `due_day` INTEGER NULL,
    `color` VARCHAR(50) NULL DEFAULT 'from-purple-600 to-indigo-700',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `financial_entities_account_idx`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `income_sources` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `color` VARCHAR(20) NULL DEFAULT '#10b981',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `income_sources_user_idx`(`user_id`),
    UNIQUE INDEX `unique_user_income_source`(`user_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `card_bills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `card_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `period_start` DATE NOT NULL,
    `period_end` DATE NOT NULL,
    `closing_date` DATE NOT NULL,
    `due_date` DATE NOT NULL,
    `status` ENUM('open', 'closed', 'paid') NOT NULL DEFAULT 'open',
    `payment_transaction_id` INTEGER NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `closed_at` DATETIME(0) NULL,
    `paid_at` DATETIME(0) NULL,

    UNIQUE INDEX `card_bills_payment_transaction_id_key`(`payment_transaction_id`),
    INDEX `card_bills_card_idx`(`card_id`),
    INDEX `card_bills_user_idx`(`user_id`),
    UNIQUE INDEX `unique_card_period`(`card_id`, `period_start`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recurring_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `google_event_id` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `event_time` TIME(0) NOT NULL,
    `frequency` ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
    `start_date` DATE NOT NULL,
    `next_event_date` DATE NOT NULL,
    `status` ENUM('active', 'paused', 'cancelled') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `end_date` DATE NULL,

    INDEX `idx_google_recurring_event`(`google_event_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recurring_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `category` VARCHAR(50) NULL,
    `type` ENUM('income', 'expense') NOT NULL,
    `frequency` ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
    `start_date` DATE NOT NULL,
    `next_due_date` DATE NOT NULL,
    `status` ENUM('active', 'paused', 'cancelled') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `entity_id` INTEGER NULL,
    `payment_method` VARCHAR(20) NULL DEFAULT 'cash',
    `category_id` INTEGER NULL,

    INDEX `user_id`(`user_id`),
    INDEX `entity_id`(`entity_id`),
    INDEX `category_id`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reminder_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `event_identifier` VARCHAR(255) NOT NULL,
    `source_type` ENUM('event', 'transaction', 'reminder') NOT NULL DEFAULT 'event',
    `reminder_type_new` ENUM('1h', '10min', 'exact') NOT NULL DEFAULT '1h',
    `reminder_type` ENUM('1h', '10min') NOT NULL,
    `sent_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `idx_unique_reminder_v3`(`user_id`, `event_identifier`, `source_type`, `reminder_type_new`, `sent_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reminders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `trigger_time` TIME(0) NOT NULL,
    `frequency` ENUM('once', 'daily', 'weekly', 'monthly') NULL DEFAULT 'once',
    `specific_date` DATE NULL,
    `weekday` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NULL,
    `status` ENUM('active', 'inactive', 'completed') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_installments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `entity_id` INTEGER NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `installment_count` INTEGER NOT NULL,
    `installment_value` DECIMAL(10, 2) NOT NULL,
    `first_installment` INTEGER NOT NULL DEFAULT 1,
    `start_date` DATE NOT NULL,
    `status` ENUM('active', 'completed', 'cancelled') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `purchase_installments_user_idx`(`user_id`),
    INDEX `purchase_installments_entity_idx`(`entity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `entity_id` INTEGER NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `type` ENUM('expense', 'income') NOT NULL,
    `status` ENUM('paid', 'pending', 'overdue') NULL DEFAULT 'paid',
    `category` VARCHAR(50) NULL,
    `description` VARCHAR(255) NULL,
    `transaction_date` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_recurring` BOOLEAN NULL DEFAULT false,
    `deleted_at` DATETIME(0) NULL,
    `payment_method` VARCHAR(20) NULL DEFAULT 'cash',
    `category_id` INTEGER NULL,
    `income_source_id` INTEGER NULL,
    `installment_id` INTEGER NULL,
    `installment_number` INTEGER NULL,
    `recurring_transaction_id` INTEGER NULL,

    INDEX `account_id`(`account_id`),
    INDEX `fk_transaction_entity`(`entity_id`),
    INDEX `user_id`(`user_id`),
    INDEX `category_id`(`category_id`),
    INDEX `income_source_id`(`income_source_id`),
    INDEX `installment_id`(`installment_id`),
    INDEX `recurring_transaction_id`(`recurring_transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(512) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `revoked_at` DATETIME(0) NULL,

    UNIQUE INDEX `refresh_tokens_token_key`(`token`),
    INDEX `refresh_tokens_user_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `phone_number` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255) NULL,
    `name` VARCHAR(100) NULL,
    `role` ENUM('admin', 'member') NULL DEFAULT 'admin',
    `status` ENUM('active', 'inactive') NULL DEFAULT 'active',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `email` VARCHAR(150) NULL,
    `google_refresh_token` VARCHAR(512) NULL,
    `google_email` VARCHAR(255) NULL,
    `google_calendar_id` VARCHAR(255) NULL DEFAULT 'primary',

    UNIQUE INDEX `phone_number`(`phone_number`),
    INDEX `account_id`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_plan_fk` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `budgets` ADD CONSTRAINT `budgets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `financial_entities` ADD CONSTRAINT `financial_entities_account_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `income_sources` ADD CONSTRAINT `income_sources_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `card_bills` ADD CONSTRAINT `card_bills_card_fk` FOREIGN KEY (`card_id`) REFERENCES `financial_entities`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `card_bills` ADD CONSTRAINT `card_bills_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `card_bills` ADD CONSTRAINT `card_bills_payment_fk` FOREIGN KEY (`payment_transaction_id`) REFERENCES `transactions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recurring_events` ADD CONSTRAINT `recurring_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recurring_transactions` ADD CONSTRAINT `recurring_transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recurring_transactions` ADD CONSTRAINT `recurring_transactions_entity_fk` FOREIGN KEY (`entity_id`) REFERENCES `financial_entities`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recurring_transactions` ADD CONSTRAINT `recurring_transactions_category_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reminder_logs` ADD CONSTRAINT `fk_reminder_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reminders` ADD CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `purchase_installments` ADD CONSTRAINT `purchase_installments_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `purchase_installments` ADD CONSTRAINT `purchase_installments_entity_fk` FOREIGN KEY (`entity_id`) REFERENCES `financial_entities`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `fk_transaction_entity` FOREIGN KEY (`entity_id`) REFERENCES `financial_entities`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_category_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_income_source_fk` FOREIGN KEY (`income_source_id`) REFERENCES `income_sources`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_installment_fk` FOREIGN KEY (`installment_id`) REFERENCES `purchase_installments`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_recurring_transaction_id_fkey` FOREIGN KEY (`recurring_transaction_id`) REFERENCES `recurring_transactions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
