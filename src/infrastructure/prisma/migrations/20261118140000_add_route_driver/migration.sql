-- AlterTable
ALTER TABLE `Route` ADD COLUMN `driverId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Route_driverId_idx` ON `Route`(`driverId`);

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
