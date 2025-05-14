/*
  Warnings:

  - You are about to alter the column `AwsId` on the `Agent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - A unique constraint covering the columns `[AwsId]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Agent` MODIFY `AwsId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Agent_AwsId_key` ON `Agent`(`AwsId`);
