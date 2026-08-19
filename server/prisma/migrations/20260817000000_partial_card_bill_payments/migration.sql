ALTER TABLE `card_bills`
  MODIFY `status` ENUM('open', 'closed', 'overdue', 'partially_paid', 'paid') NOT NULL DEFAULT 'open';

CREATE TABLE `card_bill_payments` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `bill_id` INTEGER NOT NULL,
  `user_id` INTEGER NOT NULL,
  `transaction_id` INTEGER NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `paid_at` DATETIME(3) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `reversed_at` DATETIME(3) NULL,
  UNIQUE INDEX `card_bill_payments_transaction_id_key`(`transaction_id`),
  INDEX `card_bill_payments_bill_idx`(`bill_id`, `reversed_at`),
  INDEX `card_bill_payments_user_idx`(`user_id`, `paid_at`),
  PRIMARY KEY (`id`),
  CONSTRAINT `card_bill_payments_bill_fk` FOREIGN KEY (`bill_id`) REFERENCES `card_bills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `card_bill_payments_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `card_bill_payments_transaction_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `card_bill_payments` (`bill_id`, `user_id`, `transaction_id`, `amount`, `paid_at`)
SELECT cb.`id`, cb.`user_id`, cb.`payment_transaction_id`, t.`amount`, COALESCE(cb.`paid_at`, t.`transaction_date`)
FROM `card_bills` cb
INNER JOIN `transactions` t ON t.`id` = cb.`payment_transaction_id`
WHERE cb.`payment_transaction_id` IS NOT NULL;
