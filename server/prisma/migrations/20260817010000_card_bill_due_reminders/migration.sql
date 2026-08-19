ALTER TABLE `financial_entities`
  ADD COLUMN `due_reminder_enabled` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `due_reminder_hour` INTEGER NOT NULL DEFAULT 9;
