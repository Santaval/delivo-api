-- AlterTable
ALTER TABLE `User` ADD COLUMN `memberCode` CHAR(6) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_memberCode_key` ON `User`(`memberCode`);
