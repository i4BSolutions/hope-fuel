/*
  Warnings:

  - You are about to alter the column `Email` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - A unique constraint covering the columns `[Email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Customer` MODIFY `Email` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Customer_Email_key` ON `Customer`(`Email`);
