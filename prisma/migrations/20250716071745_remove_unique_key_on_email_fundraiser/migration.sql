-- This migration removes the unique constraint on the `email` field of the `Fundraiser` table.
-- DropIndex
DROP INDEX `FundraiserEmail` ON `Fundraiser`;
