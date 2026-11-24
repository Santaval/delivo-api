-- Data migration: every existing organization gets the 50-credit welcome grant, as one
-- WELCOME_GRANT ledger row plus a CreditBalance of 50 (the cached sum of that row).
--
-- Idempotent: the NOT EXISTS guards mean re-running this inserts nothing.
INSERT INTO `CreditLedgerEntry` (`id`, `companyId`, `delta`, `reason`, `balanceAfter`, `createdAt`)
SELECT UUID(), `c`.`id`, 50, 'WELCOME_GRANT', 50, NOW(3)
FROM `Company` AS `c`
WHERE NOT EXISTS (
    SELECT 1 FROM `CreditLedgerEntry` AS `e` WHERE `e`.`companyId` = `c`.`id` AND `e`.`reason` = 'WELCOME_GRANT'
);

INSERT INTO `CreditBalance` (`companyId`, `balance`, `updatedAt`)
SELECT `c`.`id`, 50, NOW(3)
FROM `Company` AS `c`
WHERE NOT EXISTS (
    SELECT 1 FROM `CreditBalance` AS `b` WHERE `b`.`companyId` = `c`.`id`
);
