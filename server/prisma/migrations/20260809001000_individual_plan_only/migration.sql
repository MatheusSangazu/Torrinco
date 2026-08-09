-- Disponibilidade comercial inicial. Nao altera precos nem limites.
UPDATE `plans` SET `status` = 'active' WHERE `name` = 'individual';
UPDATE `plans` SET `status` = 'hidden' WHERE `name` IN ('family', 'pro', 'free');
