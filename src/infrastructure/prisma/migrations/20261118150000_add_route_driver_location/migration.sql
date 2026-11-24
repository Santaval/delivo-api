-- CreateTable
CREATE TABLE `RouteDriverLocation` (
    `routeId` VARCHAR(191) NOT NULL,
    `driverId` VARCHAR(191) NOT NULL,
    `lat` DOUBLE NOT NULL,
    `lng` DOUBLE NOT NULL,
    `heading` DOUBLE NULL,
    `speed` DOUBLE NULL,
    `accuracy` DOUBLE NULL,
    `recordedAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`routeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RouteDriverLocation` ADD CONSTRAINT `RouteDriverLocation_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

