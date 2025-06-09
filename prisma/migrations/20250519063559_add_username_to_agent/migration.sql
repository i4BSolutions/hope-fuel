/*
  Warnings:

  - A unique constraint covering the columns `[Username]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
-- DROP INDEX `Customer_Email_key` ON `Customer`;

-- AlterTable
ALTER TABLE `Agent` ADD COLUMN `Username` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Customer` MODIFY `Email` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Agent_Username_key` ON `Agent`(`Username`);
