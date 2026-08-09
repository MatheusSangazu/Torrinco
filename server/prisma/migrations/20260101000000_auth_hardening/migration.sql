-- Migration: Auth hardening — refresh token hashing + family_id
-- Adiciona token_hash (SHA-256 unique), family_id e remove unique de token.
-- Não apaga dados: tokens existentes são migrados com family_id default.

-- 1. Adicionar coluna token_hash (inicialmente nullable para backfill).
ALTER TABLE `refresh_tokens` ADD COLUMN `token_hash` VARCHAR(128) NULL;

-- 2. Adicionar coluna family_id (nullable para backfill).
ALTER TABLE `refresh_tokens` ADD COLUMN `family_id` VARCHAR(128) NULL;

-- 3. Backfill: calcular SHA-256 dos tokens existentes e atribuir family_id.
UPDATE `refresh_tokens` SET `token_hash` = SHA2(`token`, 256);
UPDATE `refresh_tokens` SET `family_id` = CONCAT('legacy-', `id`);

-- 4. Soltar unique constraint do token (agora token_hash é o unique).
ALTER TABLE `refresh_tokens` DROP INDEX `token`;

-- 5. Adicionar unique index em token_hash.
ALTER TABLE `refresh_tokens` ADD UNIQUE INDEX `refresh_tokens_token_hash_key` (`token_hash`);

-- 6. Tornar colunas NOT NULL após backfill.
ALTER TABLE `refresh_tokens` MODIFY COLUMN `token_hash` VARCHAR(128) NOT NULL;
ALTER TABLE `refresh_tokens` MODIFY COLUMN `family_id` VARCHAR(128) NOT NULL;

-- 7. Adicionar índice em family_id para detecção de reutilização.
CREATE INDEX `refresh_tokens_family_idx` ON `refresh_tokens`(`family_id`);
