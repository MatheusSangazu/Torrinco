-- Migração expand/contract: preserva as colunas DATETIME legadas durante a transição.
-- O backfill é determinístico após a auditoria confirmar apenas 00:00 e 12:00.

ALTER TABLE `transactions`
  ADD COLUMN `transaction_date_civil` DATE NULL AFTER `transaction_date`,
  ADD COLUMN `recurring_occurrence_date` DATE NULL AFTER `recurring_occurrence_at`;

UPDATE `transactions`
SET
  `transaction_date_civil` = DATE(`transaction_date`),
  `recurring_occurrence_date` = CASE
    WHEN `recurring_occurrence_at` IS NULL THEN NULL
    ELSE DATE(`recurring_occurrence_at`)
  END
WHERE `transaction_date_civil` IS NULL
   OR (`recurring_occurrence_at` IS NOT NULL AND `recurring_occurrence_date` IS NULL);

ALTER TABLE `transactions`
  MODIFY COLUMN `transaction_date_civil` DATE NOT NULL;

CREATE UNIQUE INDEX `transactions_recurring_civil_uq`
  ON `transactions` (`recurring_transaction_id`, `recurring_occurrence_date`);

CREATE TRIGGER `transactions_civil_date_bi`
BEFORE INSERT ON `transactions`
FOR EACH ROW
SET
  NEW.`transaction_date_civil` = DATE(NEW.`transaction_date`),
  NEW.`recurring_occurrence_date` = CASE
    WHEN NEW.`recurring_occurrence_at` IS NULL THEN NULL
    ELSE DATE(NEW.`recurring_occurrence_at`)
  END;

CREATE TRIGGER `transactions_civil_date_bu`
BEFORE UPDATE ON `transactions`
FOR EACH ROW
SET
  NEW.`transaction_date_civil` = DATE(NEW.`transaction_date`),
  NEW.`recurring_occurrence_date` = CASE
    WHEN NEW.`recurring_occurrence_at` IS NULL THEN NULL
    ELSE DATE(NEW.`recurring_occurrence_at`)
  END;
