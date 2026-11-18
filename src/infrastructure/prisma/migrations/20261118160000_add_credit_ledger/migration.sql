-- CreateTable
CREATE TABLE `CreditBalance` (
    `companyId` VARCHAR(191) NOT NULL,
    `balance` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`companyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CreditLedgerEntry` (
    `id` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `delta` INTEGER NOT NULL,
    `reason` ENUM('WELCOME_GRANT', 'PURCHASE', 'BILL_ISSUED', 'REFUND', 'ADMIN_ADJUSTMENT') NOT NULL,
    `balanceAfter` INTEGER NOT NULL,
    `billId` VARCHAR(191) NULL,
    `providerTransactionId` VARCHAR(191) NULL,
    `productId` VARCHAR(191) NULL,
    `environment` VARCHAR(191) NULL,
    `note` VARCHAR(500) NULL,
    `createdByUserId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CreditLedgerEntry_billId_key`(`billId`),
    UNIQUE INDEX `CreditLedgerEntry_providerTransactionId_key`(`providerTransactionId`),
    INDEX `CreditLedgerEntry_companyId_createdAt_idx`(`companyId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CreditBalance` ADD CONSTRAINT `CreditBalance_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditLedgerEntry` ADD CONSTRAINT `CreditLedgerEntry_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
