-- DropForeignKey
ALTER TABLE `CompanyInvitation` DROP FOREIGN KEY `CompanyInvitation_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `CompanyInvitation` DROP FOREIGN KEY `CompanyInvitation_invitedById_fkey`;

-- DropTable
DROP TABLE `CompanyInvitation`;
