-- Administrative access is independent from the commercial subscription lifecycle.
ALTER TABLE `accounts`
  ADD COLUMN `access_status` ENUM('enabled', 'suspended') NOT NULL DEFAULT 'enabled' AFTER `status`,
  ADD COLUMN `access_suspended_at` DATETIME(3) NULL AFTER `access_status`,
  ADD COLUMN `access_suspension_reason` VARCHAR(500) NULL AFTER `access_suspended_at`,
  ADD COLUMN `access_suspended_by_user_id` INTEGER NULL AFTER `access_suspension_reason`;

-- Preserve legacy suspensions while restoring the last known commercial state.
-- If no history exists, expired is safer than silently granting paid access.
UPDATE `accounts` AS `a`
SET
  `a`.`access_status` = 'suspended',
  `a`.`access_suspended_at` = CURRENT_TIMESTAMP(3),
  `a`.`access_suspension_reason` = 'legacy_status_migration',
  `a`.`status` = COALESCE(
    (
      SELECT `sh`.`previous_status`
      FROM `subscription_history` AS `sh`
      WHERE `sh`.`account_id` = `a`.`id`
        AND `sh`.`new_status` = 'suspended'
        AND `sh`.`previous_status` IS NOT NULL
        AND `sh`.`previous_status` <> 'suspended'
      ORDER BY `sh`.`created_at` DESC, `sh`.`id` DESC
      LIMIT 1
    ),
    'expired'
  )
WHERE `a`.`status` = 'suspended';
