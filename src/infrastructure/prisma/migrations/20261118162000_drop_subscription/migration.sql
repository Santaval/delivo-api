-- Pay-per-bill credits replace subscriptions. This is irreversible: take a DB backup first.
-- (MySQL/MariaDB enums are column types, so dropping the table also drops PlanTier,
-- SubscriptionStatus and PaymentProvider.)

-- DropForeignKey
ALTER TABLE `Subscription` DROP FOREIGN KEY `Subscription_companyId_fkey`;

-- DropTable
DROP TABLE `Subscription`;
