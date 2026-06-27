-- AlterTable
ALTER TABLE `financial_entities` ADD COLUMN `color` VARCHAR(50) NULL DEFAULT 'from-purple-600 to-indigo-700';

-- AlterTable
ALTER TABLE `recurring_transactions` ADD COLUMN `category_id` INTEGER NULL,
    ADD COLUMN `entity_id` INTEGER NULL,
    ADD COLUMN `payment_method` VARCHAR(20) NULL DEFAULT 'cash';

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `category_id` INTEGER NULL,
    ADD COLUMN `income_source_id` INTEGER NULL,
    ADD COLUMN `installment_id` INTEGER NULL,
    ADD COLUMN `installment_number` INTEGER NULL,
    ADD COLUMN `payment_method` VARCHAR(20) NULL DEFAULT 'cash',
    ADD COLUMN `recurring_transaction_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `color` VARCHAR(20) NULL DEFAULT '#3b82f6',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `categories_user_idx`(`user_id`),
    UNIQUE INDEX `unique_user_category_type`(`user_id`, `name`, `type`),
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

-- CreateIndex
CREATE INDEX `entity_id` ON `recurring_transactions`(`entity_id`);

-- CreateIndex
CREATE INDEX `category_id` ON `recurring_transactions`(`category_id`);

-- CreateIndex
CREATE INDEX `category_id` ON `transactions`(`category_id`);

-- CreateIndex
CREATE INDEX `income_source_id` ON `transactions`(`income_source_id`);

-- CreateIndex
CREATE INDEX `installment_id` ON `transactions`(`installment_id`);

-- CreateIndex
CREATE INDEX `recurring_transaction_id` ON `transactions`(`recurring_transaction_id`);

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `income_sources` ADD CONSTRAINT `income_sources_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `card_bills` ADD CONSTRAINT `card_bills_card_fk` FOREIGN KEY (`card_id`) REFERENCES `financial_entities`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `card_bills` ADD CONSTRAINT `card_bills_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `card_bills` ADD CONSTRAINT `card_bills_payment_fk` FOREIGN KEY (`payment_transaction_id`) REFERENCES `transactions`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recurring_transactions` ADD CONSTRAINT `recurring_transactions_entity_fk` FOREIGN KEY (`entity_id`) REFERENCES `financial_entities`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recurring_transactions` ADD CONSTRAINT `recurring_transactions_category_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `purchase_installments` ADD CONSTRAINT `purchase_installments_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `purchase_installments` ADD CONSTRAINT `purchase_installments_entity_fk` FOREIGN KEY (`entity_id`) REFERENCES `financial_entities`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

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
