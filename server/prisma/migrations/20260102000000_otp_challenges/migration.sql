-- CreateTable: otp_challenges
-- Armazena desafios OTP (primeiro acesso / recuperação de senha).
-- Apenas o hash SHA-256 do código é persistido.

CREATE TABLE IF NOT EXISTS `otp_challenges` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `code_hash` VARCHAR(128) NOT NULL,
  `purpose` VARCHAR(30) NOT NULL,
  `user_id` INTEGER NOT NULL,
  `phone_number` VARCHAR(50) NOT NULL,
  `attempts` INTEGER NOT NULL DEFAULT 0,
  `max_attempts` INTEGER NOT NULL DEFAULT 5,
  `consumed` BOOLEAN NOT NULL DEFAULT false,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- AddForeignKey: otp_challenges -> users
ALTER TABLE `otp_challenges`
  ADD CONSTRAINT `otp_challenges_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- Indexes
CREATE INDEX `otp_challenges_user_idx` ON `otp_challenges`(`user_id`);
CREATE INDEX `otp_challenges_phone_purpose_idx` ON `otp_challenges`(`phone_number`, `purpose`);
