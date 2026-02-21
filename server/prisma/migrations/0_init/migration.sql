-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL DEFAULT 'Minha Conta',
    `plan_type` ENUM('individual', 'family') NULL DEFAULT 'individual',
    `status` ENUM('trial', 'active', 'blocked', 'cancelled') NULL DEFAULT 'trial',
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

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
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` ENUM('bank', 'credit_card') NOT NULL,
    `balance` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `credit_limit` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `closing_day` INTEGER NULL,
    `due_day` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
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

    INDEX `user_id`(`user_id`),
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

    INDEX `account_id`(`account_id`),
    INDEX `fk_transaction_entity`(`entity_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `phone_number` VARCHAR(50) NOT NULL,
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
ALTER TABLE `budgets` ADD CONSTRAINT `budgets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `financial_entities` ADD CONSTRAINT `financial_entities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recurring_events` ADD CONSTRAINT `recurring_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recurring_transactions` ADD CONSTRAINT `recurring_transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reminder_logs` ADD CONSTRAINT `fk_reminder_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reminders` ADD CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `fk_transaction_entity` FOREIGN KEY (`entity_id`) REFERENCES `financial_entities`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

